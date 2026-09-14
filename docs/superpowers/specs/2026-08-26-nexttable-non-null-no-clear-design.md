# 零件保养信息子表"非空字段不可清空" 设计文档

**日期**: 2026-08-26
**分支**: feature/20260812-resetMaintain
**状态**: 已批准,待实施

---

## 1. 背景与目标

`NextTable.vue` 零件行内编辑模式下,允许用户清空 `nextMaintenanceDate` 或 `nextMileage`(通过 picker 的 X 按钮)。但已有数据不应被清空——这与整车 `InfoDialog` 刚刚加的"必填校验"语义一致。

**目标**:对零件行,若原数据 `nextMaintenanceDate` / `nextMileage` 非空,编辑态下禁用 X 清空按钮,使用户无法将字段置空。

## 2. 范围

**包含**:
- `NextTable.vue` 日期列 picker 添加 `:clearable="false"`
- `NextTable.vue` 里程列 input-number 添加条件 `:clearable`(基于 `originTableData[rowIndex].nextMileage`)

**不包含**:
- `saveRowEdit` 增加 validator(backspace 清空防御,留作未来)
- `InfoDialog.vue` 改动(整车字段已有显式必填校验)
- `nextTable` 其他列、操作栏、API 调用

## 3. 设计

### 3.1 日期 picker(line 27-34)

**现状**:
```vue
<el-date-picker
  v-if="isEdit && eidtRowIndex === rowIndex && row.nextMaintenanceDate"
  v-model="row.nextMaintenanceDate"
  type="date"
  value-format="yyyy-MM-dd HH:mm:ss"
  placeholder="选择日期"
  size="small"
/>
```

**改动后**:
```vue
<el-date-picker
  v-if="isEdit && eidtRowIndex === rowIndex && row.nextMaintenanceDate"
  v-model="row.nextMaintenanceDate"
  type="date"
  value-format="yyyy-MM-dd HH:mm:ss"
  :clearable="false"
  placeholder="选择日期"
  size="small"
/>
```

**说明**:`v-if` 条件已限制 picker 只在 `row.nextMaintenanceDate` 非空时渲染,所以 picker 显示即代表"原数据非空"。直接常量 `:clearable="false"` 即可。

### 3.2 里程 input-number(line 40-47)

**现状**:
```vue
<el-input-number
  v-if="isEdit && eidtRowIndex === rowIndex"
  v-model="row.nextMileage"
  placeholder="请输入"
  :controls="false"
  :precision="2"
  size="small"
  style="width: 100%;"
/>
```

**改动后**:
```vue
<el-input-number
  v-if="isEdit && eidtRowIndex === rowIndex"
  v-model="row.nextMileage"
  placeholder="请输入"
  :clearable="!originTableData[rowIndex] || !originTableData[rowIndex].nextMileage"
  :controls="false"
  :precision="2"
  size="small"
  style="width: 100%;"
/>
```

**逻辑**:
- `!originTableData[rowIndex]` → 防御性:true(可清)
- `!originTableData[rowIndex].nextMileage` → 原值为空:true(可清)
- 两者都 falsy(原值非空)→ false(禁用 X)

### 3.3 不动的部分

| 区域 | 行为 |
|------|------|
| `vxe-table` 整体 | 不动 |
| 零件名称 / 零件代码 / 里程类型列 | 不动 |
| 操作栏(编辑 / 重置 / 保存 / 取消) | 不动 |
| `saveRowEdit` / `cancelEdit` / `editRow` / `handleResetPart` | 不动 |
| `getDetailPageApi` / 分页 | 不动 |
| `props` / `data` / `methods` | 不动 |

## 4. 边界场景

| 场景 | 期望 |
|------|------|
| 原 date 为 null 的行,点击编辑 | 日期列显示 span,无 picker(上一轮规则,本轮不变) |
| 原 date 为 '2026-08-25' 的行,点击编辑 | picker 显示,X 按钮禁用 |
| 原 mileage 为 null 的行,点击编辑 | input-number 显示,X 按钮可点(实际无内容可清) |
| 原 mileage 为 100 的行,点击编辑 | input-number 显示,X 按钮禁用 |
| 原 mileage 为 100 → 用户 backspace 到空 → 保存 | mileage 存 null(本轮不防御,已知边界) |
| 重置成功后字段更新 | originTableData 同步更新(`handleResetPart` line 269-273),下一次编辑沿用新值的 clearable 状态 |
| 分页切换 | picker 只在 `eidtRowIndex === rowIndex` 显示;分页会触发 `getDetailPageApi` 重置 `originTableData`,这是已有行为 |

## 5. 文件改动清单

| 文件 | 类型 | 改动概要 |
|------|------|----------|
| `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | 修改 | 日期 picker 加 `:clearable="false"`;里程 input-number 加条件 `:clearable` |

## 6. 验证

- **代码审查**:仅 `NextTable.vue` 模板 2 处添加,改动可控
- **lint-staged**:commit 时自动跑 eslint
- **本地启动 + 浏览器冒烟**:
  1. 打开车辆档案 → 「调整保养信息」弹窗 → 找一个有 date 的零件行 → 点编辑 → X 按钮应禁用
  2. 找一个有 mileage 的零件行 → 点编辑 → X 按钮应禁用
  3. 找一个 date 为 null 的零件行 → 点编辑 → 日期列应只显示 span
  4. 找一个 mileage 为 null 的零件行 → 点编辑 → X 按钮可点(无内容可清)
  5. 点重置按钮(权限允许时)→ 字段被填充,X 按钮应禁用(原数据被填了)
  6. 保存修改 → originTableData 同步 → 重新编辑,X 按钮仍禁用

## 7. 风险与回滚

- **风险**:极低。Element UI 原生支持 `:clearable`,无新依赖、无 API 改动。
- **回滚**:单 commit 反转即可。
- **已知边界**:backspace 清空可绕过。`el-date-picker` 实际不支持键盘清空(只能通过 X 按钮或 API),所以日期字段防御完整;`el-input-number` 支持 backspace 到空,理论可绕过,本轮不防御。

## 8. 未来清理(本轮不做)

- 若需要彻底防御 mileage 被 backspace 清空后保存:在 `saveRowEdit` 入口加校验,若 `row.nextMaintenanceDate` 或 `row.nextMileage` 为空且 `originTableData[rowIndex]` 对应字段非空,弹错提示并阻止保存。