# 整车保养信息字段必填校验 设计文档

**日期**: 2026-08-26
**分支**: feature/20260812-resetMaintain
**状态**: 已批准,待实施

---

## 1. 背景与目标

`InfoDialog` 当前允许整车「下次保养时间」与「下次保养里程」为空保存(后端通过 `*SetNull` flag 接收 null)。但整车保养记录必须有可执行的下次保养日期/里程,允许空值会留下无效数据。

**目标**:对这两个字段增加必填校验,空值不允许提交。具体行为:实时校验(控件变化时立即提示错误)+ 保存时强制阻断(不允许调接口)。

## 2. 范围

**包含**:
- `InfoDialog/index.vue` `data()` 中:
  - 新增 `validateDate` 函数
  - 扩展 `validateMileage` 增加空值分支
  - 补全 `rules` 两条(原 `rules` 只有 mileage 一条;补 date 一条并给 mileage 加 `required: true`)

**不包含**:
- 模板字段、按钮、icon、tooltip 改动
- `handleSave` 方法体改动(校验已在 `validate` 中拦截,`if (!valid) return;` 已存在)
- `NextTable.vue` 改动(零件行有自己的需求,不属本轮)
- 后端接口
- `*SetNull` flag 清理(留作未来 PR)

## 3. 设计

### 3.1 触发模式
- `trigger: ['blur', 'change']` —— `change` 用于清空时立即红字;`blur` 用于失焦时也校验
- `required: true` 显式声明 ——Element UI 自动在 `<el-form-item label>` 前加红 `*`

### 3.2 错误文案(沿用项目具体化风格)
- 下次保养时间:**「请选择下次保养时间」**
- 下次保养里程:**「请输入下次保养里程」**(空值时);原有「必须为数字」保留(非空但非数字时)

### 3.3 代码改动

**位置**:`InfoDialog/index.vue` `data()` 块(line 139-163)

**改动前**(line 140-158):

```javascript
data () {
  const validateMileage = (rule, value, callback) => {
    if (value !== '' && value !== null && value !== undefined && isNaN(Number(value))) {
      callback(new Error('必须为数字'));
    } else {
      callback();
    }
  };
  return {
    form: {
      nextMaintainDate: null,
      nextMaintainMileages: '',
    },
    originalForm: {
      nextMaintainDate: null,
      nextMaintainMileages: '',
    },
    rules: {
      nextMaintainMileages: [{ validator: validateMileage, trigger: 'blur' }],
    },
    saving: false,
    resettingVehicle: false,
    isEditing: false,
  };
},
```

**改动后**:

```javascript
data () {
  const validateDate = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请选择下次保养时间'));
    } else {
      callback();
    }
  };
  const validateMileage = (rule, value, callback) => {
    if (value === '' || value === null || value === undefined) {
      callback(new Error('请输入下次保养里程'));
      return;
    }
    if (isNaN(Number(value))) {
      callback(new Error('必须为数字'));
      return;
    }
    callback();
  };
  return {
    form: {
      nextMaintainDate: null,
      nextMaintainMileages: '',
    },
    originalForm: {
      nextMaintainDate: null,
      nextMaintainMileages: '',
    },
    rules: {
      nextMaintainDate: [{ required: true, validator: validateDate, trigger: ['blur', 'change'] }],
      nextMaintainMileages: [{ required: true, validator: validateMileage, trigger: ['blur', 'change'] }],
    },
    saving: false,
    resettingVehicle: false,
    isEditing: false,
  };
},
```

**关键变化**:
- 新增 `validateDate`(独立函数,与 `validateMileage` 平级)
- `validateMileage` 增加空值分支(空 → 「请输入下次保养里程」)
- `rules` 由 1 条变 2 条,均加 `required: true` 与 `trigger: ['blur', 'change']`

### 3.4 handleSave 行为
不动。`handleSave` 已有:
```javascript
const valid = await new Promise(resolve => {
  this.$refs.formRef.validate((ok) => resolve(ok));
});
if (!valid) return;
```
空值会被 validator 拦截,`!valid` 命中,函数提前返回,**不调接口、保留编辑态**。

### 3.5 关于 `*SetNull` flag(保留,不清理)

`handleSave` 现有代码:
```javascript
await updateFlat({
  id: this.vehicleProfileId,
  nextMaintainDate: sentDate,
  nextMaintainDateSetNull: !sentDate,    // 新规则下永远 false
  nextMaintainMileages: sentMileages,
  nextMaintainMileagesSetNull: !sentMileages,  // 新规则下永远 false
});
```

本轮**保留这两个 flag**:最小改动原则;`false` 在后端仍可作为"不置空"的冗余信号;后续若需清理可单独 PR。

### 3.6 不动的部分

| 区域 | 行为 |
|------|------|
| 模板字段(`.dialog` 段 line 34-90) | 不动 |
| 字段 `:disabled` 行为 | 不动 |
| 4 个按钮(编辑/重置/保存/取消) | 不动 |
| 标题区 ⓘ tooltip | 不动 |
| `originalForm` / `syncOriginalForm` | 不动 |
| `enterEdit` / `handleCancel` / `handleResetVehicle` / `onClose` / `beforeClose` / `isNoChange` | 不动 |
| API (`updateFlat`) | 不动 |

## 4. 边界场景

| 场景 | 期望 |
|------|------|
| 打开弹窗,字段有值 | 无错误红字 |
| 打开弹窗,字段为空(null / '') | 无错误红字(校验未触发) |
| 点「编辑」进入编辑态,字段空,无任何改动 | 控件前显示红 `*`(来自 `required: true`),但下方无错误红字(未触发 validator) |
| 编辑态清空 mileage | 立即红字「请输入下次保养里程」(change 触发) |
| 编辑态清空日期 | 立即红字「请选择下次保养时间」(date picker commit 触发) |
| 编辑态输入非数字 mileage | 红字「必须为数字」 |
| 编辑态填回合法值 | 红字消失 |
| 编辑态点「保存」,字段有空 | 红字提示 + 不调接口,保留编辑态 |
| 编辑态点「保存」,字段全合法,值未变 | 走 `isNoChange` 分支退出编辑态,不调接口 |
| 编辑态点「保存」,字段全合法,值已变 | 调 `updateFlat`,正常保存 |
| 点「重置」(成功后字段被填充)| 不触发任何校验(因为结果非空)|
| 编辑态点「取消」 | `originalForm` 恢复;若原值为空,字段回空(无错误红字) |

## 5. 文件改动清单

| 文件 | 类型 | 改动概要 |
|------|------|----------|
| `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` | 修改 | `data()` 中 validators + rules,~15 行变更 |

## 6. 验证

- **代码审查**:仅 `data()` 段,改动可控
- **lint-staged**:commit 时自动跑 eslint
- **本地启动 + 浏览器冒烟**:
  1. 打开车辆档案 → 「调整保养信息」弹窗(字段有值)→ 点编辑 → 清空 mileage → 立即红字「请输入下次保养里程」
  2. 改回合法值 → 红字消失
  3. 清空两个字段 → 点保存 → 弹红字提示 + 不调接口
  4. 都填上 → 点保存 → 正常保存
  5. 输入非数字 mileage(若绕过 el-input-number 校验)→ 红字「必须为数字」
  6. 数据库历史 null 数据 → 打开对话框 → 必须先填值才能保存

## 7. 风险与回滚

- **风险**:极低。`data()` 内部扩展,不动外部接口。
- **副作用**:若数据库存在 `nextMaintainDate: null` 或 `nextMaintainMileages: null` 的历史车辆,用户必须先填值才能保存——这是用户预期行为。
- **回滚**:单 commit 反转即可,无副作用。

## 8. 未来清理(本轮不做)

- `handleSave` 中 `nextMaintainDateSetNull` / `nextMaintainMileagesSetNull` 已成为死代码(永远 false),可后续 PR 删除。