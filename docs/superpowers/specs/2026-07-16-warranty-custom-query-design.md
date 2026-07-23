# 保修申请单查询 — 自定义条件查询(UI 占位)

**日期**: 2026-07-16
**状态**: 待用户审核
**范围**: 仅前端 UI 占位,不接真实查询

## 背景与目标

`warrantyapply/index.vue` 当前有 20+ 固定查询条件,只能按预置字段筛选。当用户需要按"VIN + 状态 + 创建时间在某个范围"等组合做临时分析时,必须叠加多个固定条件,操作繁琐且难以表达复合逻辑。

本设计新增"自定义条件查询":用户可在弹窗中可视化构造条件树,行内/组内可切换 AND/OR,支持嵌套。**本阶段仅完成 UI,真实查询语义由后续接入**——这是与产品对齐后的明确取舍:先把交互做扎实,等后端就绪再接。

## 范围

**包含**:
- 弹窗 + 递归条件构建器
- 35 个表格数据列全部可作为条件字段(操作列不计)
- 4 种字段类型(text / number / date / enum)各自匹配运算符
- 多值"等于/不等于"输入
- 嵌套分组,深度上限 5 层(深度 0~4)
- 校验、应用、清空、取消、空状态
- 触发按钮 + 已应用条件数徽标

**不包含**:
- 不发送自定义条件到后端(占位阶段)
- 不持久化(localStorage / 后端保存)
- 不暴露给其他页面复用(仅本页面)
- 不修改现有 20+ 固定条件表单

## 架构

### 触发点

在 `warrantyapply/index.vue` 搜索区右侧、操作按钮行新增"高级查询"按钮(始终可见),点击打开弹窗。

```vue
<el-button size="small" @click="customVisible = true">
  高级查询
  <el-badge v-if="appliedConditions.length > 0" :value="appliedConditions.length" class="btn-badge" />
</el-button>
```

### 组件层次

```
CustomQueryDialog/index.vue           弹窗壳(el-dialog,宽 720px)
  └─ CustomConditionGroup.vue         递归组节点(顶层固定 1 个)
       ├─ CustomConditionRow.vue      叶子行
       └─ CustomConditionGroup.vue    子分组(深度 ≤ 4)
```

### 数据形状

```js
// 应用态(父组件持有):一棵树
appliedConditions = {
  logic: 'AND',                  // 'AND' | 'OR'
  conditions: [
    { id, field: 'vin', operator: 'contains', value: 'LV...' },
    { id, field: 'applyStatusLabel', operator: 'equals', value: ['10', '20'] },
    { id, type: 'group', logic: 'OR', conditions: [ ... ] }
  ]
}
```

> 叶子节点无 `type` 字段;子分组节点带 `type: 'group'` 便于单一渲染分支。

### 文件清单

| 文件 | 类型 | 责任 |
|------|------|------|
| `warrantyapply/index.vue` | 改动 | 加按钮 + 引用 dialog + state |
| `warrantyapply/components/CustomQueryDialog/index.vue` | 新增 | 弹窗壳、校验、应用、清空 |
| `warrantyapply/components/CustomQueryDialog/CustomConditionGroup.vue` | 新增 | 递归组渲染、加行/加分组/删行/删分组 |
| `warrantyapply/components/CustomQueryDialog/CustomConditionRow.vue` | 新增 | 字段/运算符/值三段 UI |
| `warrantyapply/components/CustomQueryDialog/fieldMeta.js` | 新增 | 字段元数据 + 类型映射 + 运算符矩阵 |

`fieldMeta.js` 集中维护字段字典,后续真正接入时易改成"从后端拉字典"。

## 字段元数据(`fieldMeta.js`)

### 字段列表

字段键与表格列 `dataProp[].props` 一一对应,共 35 个(操作列 `operate` 不计);类型映射如下:

| 字段键 | 中文标签 | 类型 |
|--------|---------|------|
| `applyNo` | 保修申请单 | text |
| `vin` | VIN | text |
| `serviceProxyNo` | 施工单 | text |
| `statementCode` | 结算单号 | text |
| `applyStatusLabel` | 保修单状态 | enum(claim_warranty_apply_status) |
| `repairItemTypeName` | 保修类型 | text |
| `dealerCode` | 门店编码 | text |
| `dealerName` | 门店名称 | text |
| `dealerRegionName` | 门店所属区域 | text |
| `currentSubmitTime` | 当前提交时间 | date |
| `approvalTime` | 审批时间 | date |
| `vehiclePlateNo` | 车牌号 | text |
| `ownerName` | 车主姓名 | text |
| `vehicleModelName` | 车型 | text |
| `warrantyStartdate` | 保修开始日期 | date |
| `repairStartTime` | 维修开始日期 | date |
| `mainPartCode` | 主因件编码 | text |
| `mainPartName` | 主因件名称 | text |
| `mileage` | 进店里程 KM | number |
| `serviceMonth` | 服务月份 | number |
| `laborClaimTotal` | 工时索赔小计 | number |
| `partsClaimTotal` | 备件索赔小计 | number |
| `otherClaimTotal` | 其他索赔小计 | number |
| `totalClaimAmount` | 索赔总金额 | number |
| `workCostCount` | 工时费用小计 | number |
| `partsCostTotal` | 备件费用小计 | number |
| `otherCostTotal` | 其他费用小计 | number |
| `laborShareRatio` | 工时分担比例 | number |
| `partsShareRatio` | 备件分担比例 | number |
| `otherShareRatio` | 其他分担比例 | number |
| `faultPhenomenon` | 故障信息描述 | text |
| `troubleshootingFlow` | 故障流程排查 | text |
| `createTime` | 创建时间 | date |
| `updateTime` | 修改时间 | date |
| `alarmLevelLabel` | 三包预警 | enum(alarm_level) |

### 运算符矩阵

| 类型 | 等于 | 不等于 | 包含 | 不包含 | 为空 | 不为空 | 以...开头 | 以...结尾 | 大于 | 小于 | ≥ | ≤ | 介于 | 在...中 | 不在...中 |
|------|-----|-------|-----|-------|-----|-------|----------|----------|-----|-----|---|---|------|--------|----------|
| text | 多值 | 多值 | 单值 | 单值 | — | — | 单值 | 单值 | — | — | — | — | — | — | — |
| number | 多值 | 多值 | — | — | — | — | — | — | 单值 | 单值 | 单值 | 单值 | — | — | — |
| date | — | — | — | — | — | — | — | — | 单值 | 单值 | — | — | 双值 | — | — |
| enum | 多选 | 多选 | — | — | — | — | — | — | — | — | — | — | — | 多选 | 多选 |

> 多值/多选语义 = IN (...),即任一匹配。等价于 `field = v1 OR field = v2`。

### 值控件映射

| 类型 | 等于/不等于/在...中/不在...中 | 其他运算符 |
|------|-----------------------------|-----------|
| text | `TagInput`(复用 `@/libs/components/TagInput`) | `el-input` |
| number | `TagInput`(复用 + `before-add` 校验数字) | `el-input-number` |
| date | — | `el-date-picker`,"介于"用 `daterange` |
| enum | `FetchSelect`(根据运算符决定 single/multiple) | — |

## 组件契约

### CustomQueryDialog

**Props**:
- `value: Boolean` — 弹窗显隐(`v-model`)
- `columns: Array` — 字段元数据(由父组件从 `fieldMeta.js` 传入)

**Events**:
- `input(value: Boolean)` — 关闭/打开
- `apply(tree)` — 用户点击"应用",`tree` 是已校验的条件树
- `clear()` — 用户点击"清空"

**内部 state**:
- `workingTree: GroupNode` — 编辑副本,打开弹窗时深拷贝父组件的 `appliedConditions`(若空则初始化为 1 个空行)
- `errors: Array<{rowId, message}>` — 校验错误集合

**生命周期**:
- `watch(value)`:打开时重置 `workingTree`,关闭不重置(下次打开恢复)
- 点击"应用":执行校验 → 通过则 emit apply + 关闭;失败则填充 errors 并在顶部 alert
- 点击"清空":`$confirm` → 重置为 1 个空行
- 点击"取消"或关闭 X:关闭,不保存

### CustomConditionGroup

**Props**:
- `group: GroupNode` — 当前组数据
- `columns: Array` — 字段元数据
- `depth: Number` — 当前深度(0 起)

**Events**:
- `remove()` — 删除整个组(仅子组可发,顶层不发)
- `change()` — 组内容变更,父级用于 markDirty

**行为**:
- 头部:`el-radio-group` 切换 AND/OR + 提示行数
- 行列表:`v-for` 渲染,行间显示分隔符("且"/"或")
- 叶子用 `CustomConditionRow`,子组用自身(递归)
- 加行:push 一个空行;加分组:push 一个 `{type: 'group', logic: 'AND', conditions: [emptyRow]}`(若 depth < 4)

### CustomConditionRow

**Props**:
- `row: LeafNode` — 行数据
- `columns: Array` — 字段元数据

**Events**:
- `remove()` — 删除本行
- `change()` — 内容变更

**行为**:
- 字段选择:`el-select` 从 columns 取
- 运算符选择:`el-select`,选项根据字段类型动态计算
- 值控件:watch `field` 和 `operator` → 切换时清空 `value` 并重挂载控件
- 删除:emit remove

## 状态流转

```
[关闭]
  │ click "高级查询"
  ▼
[打开] workingTree = clone(appliedConditions) || defaultEmptyRow
  │
  ├─ 编辑(增/删/改) → workingTree 立即更新(无请求)
  │
  ├─ click "应用"
  │     ├─ validate(workingTree)
  │     ├─ 通过 → emit('apply', tree); close
  │     └─ 失败 → 标记 errors,顶部 alert
  │
  ├─ click "清空" → confirm → 重置 workingTree = defaultEmptyRow
  │
  └─ click "取消" / X → close(丢弃编辑)
```

## 校验规则

| 规则 | 错误位置 |
|------|---------|
| 字段未选 | 行内字段下拉红框 + 顶部 alert "第 N 行:请选择字段" |
| 运算符未选 | 行内运算符下拉红框 + 顶部 alert |
| 值未填(运算符需要值) | 行内值控件红框 + 顶部 alert |
| number 多值含非数字 | TagInput 红框 + 顶部 alert |
| date"介于"只填一端 | 起始/结束控件红框 + 顶部 alert |
| date 起始 > 结束(仅"介于"校验) | 顶部 alert |

校验在"应用"点击时统一触发,**不做行内实时校验**(避免编辑过程闪烁)。

## 嵌套层级视觉

- 子组左侧缩进,灰色边框包裹
- 子组头部显示"满足以下 N 条(或以下任一)"
- 深度 ≤ 3 时"加分组"按钮可点,深度 = 4 时 disabled + tooltip"已达最大嵌套层级 5"

## 与现有表单的关系

- 现有 20+ 固定查询条件**不变**
- "高级查询"按钮是平行的另一种入口
- 占位阶段:`getFormData()` 仍只发送固定条件字段,自定义条件不参与请求
- 接入阶段:`getFormData()` 增加 `customCriteria: appliedConditions` 字段,后端按结构化条件树解析(后端格式后续定)

## 测试

| 类型 | 范围 |
|------|------|
| 手动 | 增/删/嵌套深度上限/字段切换清值/运算符切换清值/校验错误展示/应用/取消/清空/打开默认状态/多值输入 |
| 视觉 | 嵌套缩进、TagInput 多值、日期控件、FetchSelect 多选 |
| 回归 | 现有 20+ 固定条件表单不变,搜索/重置/导出/分页/排序行为不变 |

> 项目无明显单元测试基建,不引入新测试框架。

## 不做(显式 YAGNI)

- ❌ 持久化(localStorage / sessionStorage / 后端保存)
- ❌ 预设条件模板
- ❌ 导入/导出条件 JSON
- ❌ 真正接入后端查询
- ❌ 与现有固定条件做 OR 混合(只独立存在)
- ❌ 字段搜索/筛选(37 个足够少,直接展示)
- ❌ 国际化(项目内其他页面已写死中文)
- ❌ 跨页面复用(仅本页面)