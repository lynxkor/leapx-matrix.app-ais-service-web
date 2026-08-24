# 车辆档案"调整保养信息"重置功能 设计文档

**日期**: 2026-08-20
**分支**: feature/20260812-resetMaintain
**状态**: 已批准,待实施

---

## 1. 背景与目标

车辆档案"调整保养信息"弹窗中,目前只能**手动编辑**整车和零件的下次保养里程/时间。本次新增两个**重置**能力:

- **整车重置**: 一键按当前车联网里程重算整车下次保养里程与时间
- **零件重置**: 一键按当前车联网里程(总里程或增程里程)重算指定零件的下次保养里程与时间

后端已提供 `MaintenanceRemindController#resetVehicle` 与 `MaintenanceRemindController#resetPart` 接口,前端需要封装 API 并提供 UI 操作入口与二次确认。

## 2. 范围

**包含**:

- 新建前端 API 封装 `resetVehicle` 与 `resetPart`
- 在"调整保养信息"弹窗(`InfoDialog`)整车下次保养里程输入框后增加重置按钮
- 在弹窗内"保养零件下次保养子表"(`NextTable`)操作栏增加重置按钮
- 重置前调用 `getCarInfo` 获取当前车联网里程,二次确认后调用重置接口
- 重置成功后用接口返回数据刷新弹窗与父页面 (`edit.vue`) 展示

**不包含**:

- 后端接口实现
- 权限后端配置
- 保养规则/重置算法
- 其他模块(`index.vue` 列表、`ChangeHistory`、`BenefitDialog`)的联动

## 3. 接口约定

### 3.1 后端接口(已知,无需前端实现)

| 接口 | Controller#Method | 入参 | 返回(预期) |
|------|-------------------|------|-----------|
| `getCarInfo` | `ServiceProxyController#getCarInfo` | `vin: String` | `{ mileage: Number, oilMileage: Number, electricalMileage: Number, electricity: Number }` |
| `resetVehicle` | `MaintenanceRemindController#resetVehicle` | `{ vin: String }` | `{ nextMaintainDate: String, nextMaintainMileages: Number }` |
| `resetPart` | `MaintenanceRemindController#resetPart` | `{ vin: String, maintenancePartCode: String }` | `{ nextMaintenanceDate: String, nextMileage: Number }` |

### 3.2 字段映射(基于现有代码复核)

`getCarInfo` 返回字段已通过现有调用处核实:

- `res.mileage` — 车联网总里程 (见 `qualityOrderReport/edit.vue:1270`, `serviceProxy/.../BasicInfo/index.vue:903`)
- `res.oilMileage` — 增程里程 (见 `BasicInfo/index.vue:907`, 赋值给 `netMileageExtend`)
- `res.electricalMileage` — 纯电里程 (备用,本次未使用)
- `res.electricity` — 进店电量 (本次未使用)

## 4. 文件改动清单

| 文件 | 类型 | 改动概要 |
|------|------|---------|
| `src/api/maintain/basic/maintenanceRemind/index.js` | **新增** | 封装 `resetVehicle` + `resetPart`,前缀 `maintain/web/basic/maintenanceRemind/` |
| `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` | 修改 | 新增 `vin` prop;新增整车重置按钮 + 方法;emit `vehicle-reset` |
| `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | 修改 | 新增 `vin` prop;操作栏新增重置按钮 + 方法 |
| `src/views/datacenter/vehicle/vehicleProfile/edit.vue` | 修改 | `onInfo()` 传 vin;监听 `vehicle-reset` 同步父 form 字段 |

## 5. 数据流

### 5.1 整车重置

```
用户点击"整车重置"按钮 (InfoDialog)
  ↓
resettingVehicle = true
  ↓
getCarInfo({ vin: form.vin })
  ↓ 成功
拼装确认文案: 当前车联网里程(总)为 ${res.mileage} km,是否确定重置?
  ↓
this.$confirm(...)
  ↓ 用户点"确定"
resetVehicle({ vin: form.vin })
  ↓ 成功
更新 form.nextMaintainDate / nextMaintainMileages (同时更新 originalForm)
$message.success('重置成功')
$emit('vehicle-reset', res)        // 父页面同步 form 字段
$emit('update')                    // 父页面 reload NextTable + containerRef.loadDetail()
```

### 5.2 零件重置

```
用户点击零件行"重置"按钮 (NextTable)
  ↓
resettingRowId = row.id (loading 状态)
  ↓
getCarInfo({ vin: this.vin })
  ↓ 成功
根据 row.mileageType 判断显示:
  - 总里程 → 当前车联网里程数(总)为 ${res.mileage} km
  - 增程里程 → 当前车联网里程数(增)为 ${res.oilMileage} km
  ↓
this.$confirm(...)
  ↓ 用户点"确定"
resetPart({ vin: this.vin, maintenancePartCode: row.maintenancePartCode })
  ↓ 成功
更新 tableData[index].nextMaintenanceDate / nextMileage (同步 originTableData)
$message.success('重置成功')
$emit('update')                    // 父页面 reload NextTable
```

## 6. UI 交互细节

### 6.1 整车重置按钮(InfoDialog)

- **位置**: `el-input` (line 21-27) 之后,`<el-form-item>` 内
- **样式**: `<el-button size="small" type="primary" plain :loading="resettingVehicle" @click="handleResetVehicle">重置</el-button>`,`margin-left: 10px`
- **权限**: `v-if="canReset"`(`canReset` 由父页面 `edit.vue` 通过 prop 传入,值为 `modifyMaintenanceRecord`)
- **防重入**: `saving` 为 true 时禁用

### 6.2 零件重置按钮(NextTable 操作栏)

- **位置**: `<template v-else>` 分支(非编辑态),编辑按钮之后
- **样式**: 文字链接 `<span class="action-button btn-reset">重置</span>`,颜色与编辑按钮区分
- **权限**: `v-if="canReset"`(prop 传入,值同父页面 `modifyMaintenanceRecord`)
- **条件**: `v-if="canReset && row.maintenancePartCode"` 且 `resettingRowId !== row.id`
- **行 loading**: `resettingRowId === row.id` 时该行重置按钮置为"重置中..."且不可点击

### 6.3 二次确认弹窗($confirm)

- **标题**: `"重置确认"`
- **内容**:
  - 整车: `当前车联网里程(总)为 ${res.mileage} km,是否确定重置?`
  - 零件(总里程): `当前车联网里程数(总)为 ${res.mileage} km,是否确定重置?`
  - 零件(增程里程): `当前车联网里程数(增)为 ${res.oilMileage} km,是否确定重置?`
- **按钮**: `确定` / `取消`(Element UI 默认)

### 6.4 错误处理

任一步骤失败 → `this.$message.error(后端 message)` → 状态保持不变,弹窗关闭或保持开启但不做修改。

### 6.5 边界条件

| 场景 | 处理 |
|------|------|
| `getCarInfo` 网络失败 | `error.message` 提示,不弹 $confirm |
| `res.mileage` 为 `null/undefined` (整车) | `$message.warning('未获取到车联网里程,无法重置')` |
| `res.oilMileage` 为 `null/undefined` (零件-增程) | `$message.warning('该车辆暂无增程里程数据')` |
| 增程里程车型但缺 `mileageType` 字段 | `$message.error('零件里程类型异常,无法重置')` |

## 7. 状态字段与 Props

### InfoDialog 新增

```js
props: {
  // ... 原有
  vin: { type: String, default: '' },
  canReset: { type: Boolean, default: false }, // 父页面透传 modifyMaintenanceRecord
},
data () {
  return {
    // ... 原有
    resettingVehicle: false,
  };
}
```

### NextTable 新增

```js
props: {
  // ... 原有
  vin: { type: String, default: '' },
  canReset: { type: Boolean, default: false },
},
data () {
  return {
    // ... 原有
    resettingRowId: null,
  };
}
```

### edit.vue 修改

```vue
<info-dialog
  :vin="form.vin"
  :can-reset="modifyMaintenanceRecord"
  @vehicle-reset="onVehicleReset"
  @update="onInfoSuccess"
/>

<!-- InfoDialog 内部使用 :can-reset 传给 NextTable -->
<next-table
  :id="vehicleProfileId"
  :vin="vin"
  :can-reset="canReset"
  :isEdit="true"
  @update="$emit('update')"
/>
```

```js
onVehicleReset(res) {
  this.form.nextMaintainDate = res.nextMaintainDate;
  this.form.nextMaintainMileages = res.nextMaintainMileages;
},
```

## 8. 验证清单

- [ ] 整车重置: 点击按钮 → getCarInfo → $confirm → resetVehicle → 弹窗与父页面 form 同步更新
- [ ] 零件重置(总里程): 流程同上,使用 `res.mileage` 与 `row.maintenancePartCode`
- [ ] 零件重置(增程里程): 使用 `res.oilMileage`
- [ ] 重置后零件表行数据刷新,不影响其他行
- [ ] 重置后父页面 form 字段更新,NextTable 刷新
- [ ] `originalForm` 同步更新,避免 `onFieldChange` 误触发自动保存
- [ ] getCarInfo 失败时不弹确认,无任何修改
- [ ] resetVehicle / resetPart 失败时 $message.error,状态不变
- [ ] 缺失里程数据时友好提示
- [ ] 权限控制: 无 `modifyMaintenanceRecord` 时按钮隐藏
- [ ] 防重入: loading 期间按钮禁用,不会重复触发

## 9. 后续可能扩展(本次不实施)

- `index.vue` 列表页的批量重置
- `ChangeHistory` 记录重置操作日志(若后端已写,前端可不改)
- 重置前的"最近一次重置时间"展示
- 整车/零件之外的"其他保养项"重置