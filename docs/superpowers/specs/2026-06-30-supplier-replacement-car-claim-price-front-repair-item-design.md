# 供应商代步车索赔价格 增加维修项目字段 前端设计

> **对应后端计划**：`app-ais-claimreturn/docs/superpowers/plans/2026-06-30-supplier-replacement-car-claim-price-repair-item-implementation-plan.md`
>
> **目的**：对齐后端已实现的 `repair_item_id / repair_item_code / repair_item_name` 三字段及全模糊查询能力。

## §1 范围

| 类别 | 路径 | 变更 |
|---|---|---|
| 列表页 | `src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/index.vue` | 增加两个查询条件、两个表格列 |
| 编辑页 | `src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/edit.vue` | 增加维修项目代码下拉、维修项目名称只读输入；明细视图同步新增 |
| API 文件 | `src/api/claimreturn/claim/basic/supplierReplacementCarClaimPrice/index.js` | 不动（`getList` / `addOrUpdate` / `getDetail` 已直接转发） |
| 后端 | — | 不动（已实现完毕） |

**设计原则**：完全沿用 `dealerReplacementCarClaimPrice`（同模块的"门店代步车索赔价格"）的现有前端模式，两个业务是镜像关系（一个对供应商、一个对门店），代码风格保持一致便于维护。

---

## §2 列表页改动（`index.vue`）

### 2.1 新增查询条件

按 dealer 模式，位置在 **价格序号** 之后、**车系名称** 之前：

```html
<el-form-item label="维修项目代码">
  <el-input
    placeholder="请输入"
    v-model="form.repairItemCodeLike"
    clearable
  />
</el-form-item>
```

**维修项目名称** 放在 `<template v-if="show">` 内（与"生效开始日期"等高级筛选同级）：

```html
<el-form-item label="维修项目名称">
  <el-input
    placeholder="请输入"
    v-model="form.repairItemNameLike"
    clearable
  />
</el-form-item>
```

两个字段对应后端 `SupplierReplacementCarClaimPriceQo` 的 `repairItemCodeLike` / `repairItemNameLike`，由 MyBatis-Plus 自动生成 `LIKE '%value%'`。

### 2.2 新增表格列

紧贴 `vehicleSeriesName` 后面：

```javascript
{ props: 'vehicleSeriesName', label: '车系名称', visible: true, width: 140 },
{ props: 'repairItemCode', label: '维修项目代码', visible: true, width: 200 },
{ props: 'repairItemName', label: '维修项目名称', visible: true, width: 200 },
{ props: 'supplierClaimPrice', label: '供应商索赔价格', visible: true, width: 140, align: 'right' },
```

数据由后端 `SupplierReplacementCarClaimPriceResponse` 直接返回（MapStruct 自动透出）。

### 2.3 `defaultForm` 同步新增

```javascript
const defaultForm = {
  priceSerialNo: '',
  vehicleSeriesName: '',
  repairItemCodeLike: '',     // 新增
  repairItemNameLike: '',     // 新增
  effectiveStartTime: '',
  // ... 其余不变
};
```

---

## §3 编辑页改动（`edit.vue`）

### 3.1 表单字段顺序

按用户决策：放在 **车系名称** 之后、**供应商索赔价格** 之前。

完整顺序：

```
价格序号 → 车系名称 → 维修项目代码 → 维修项目名称 →
供应商索赔价格 → 索赔天数调整 → 生效开始日期 → 状态 → 备注
```

### 3.2 新增「维修项目代码」字段（list-select）

```html
<el-form-item label="维修项目代码：" prop="repairItemCode">
  <list-select
    listUrl="/maintain/web/basic/repairItem/list"
    placeholder="请输入维修项目代码/名称"
    v-model="form.repairItemId"
    :disabled="Boolean(_id)"
    query-key="codeOrNameLike"
    auto-load-options
    filterable
    clearable
    label-key="code"
    second-line-key="name"
    @change="handleRepairItemChange"
    :params="{}" />
</el-form-item>
```

要点：

- `v-model="form.repairItemId"`：存 ID，提交时由后端 `CmdExe.fillRepairItemInfo` 自动填 code/name
- `:disabled="Boolean(_id)"`：编辑时禁用，新增时可选
- `query-key="codeOrNameLike"`：输入关键字时按 code 或 name 模糊
- `label-key="code"` + `second-line-key="name"`：下拉项第一行显示 code、第二行显示 name（沿用 dealer）
- 跨服务调用维保模块的 `repairItem/list`，dealer 已先例使用

### 3.3 新增「维修项目名称」字段（只读输入）

```html
<el-form-item label="维修项目名称：" prop="repairItemName">
  <el-input
    placeholder="请输入"
    v-model="form.repairItemName"
    clearable
    disabled
  />
</el-form-item>
```

要点：

- 用户手动输入无意义（由选择器自动带出），用 `disabled` 锁死
- 不出现在表单校验规则里（详见 §3.6）

### 3.4 明细视图（form-detail）同步新增

```html
<el-form-item label="维修项目代码：" prop="repairItemCode">
  {{ form.repairItemCode }}
</el-form-item>
<el-form-item label="维修项目名称：" prop="repairItemName">
  {{ form.repairItemName }}
</el-form-item>
```

放在车系名称的明细行之后。

### 3.5 新增 `handleRepairItemChange` 方法

```javascript
handleRepairItemChange (val, selectedItem) {
  this.form.repairItemId = val;
  this.form.repairItemCode = selectedItem ? selectedItem.code : '';
  this.form.repairItemName = selectedItem ? selectedItem.name : '';
}
```

### 3.6 `defaultForm` 与 `rules` 同步

```javascript
const defaultForm = {
  priceSerialNo: '',
  vehicleSeriesName: '',
  // 新增 ↓
  repairItemId: '',
  repairItemCode: '',
  repairItemName: '',
  supplierClaimPrice: '',
  // ... 其余不变
};
```

`rules` 仅校验代码字段（与后端 `AddOrUpdateReq` 只把 `repairItemId` 标 required 对齐）：

```javascript
rules: {
  repairItemCode: [
    { required: true, message: '请输入维修项目代码', trigger: 'change' }
  ],
  // 维修项目名称由选择器自动带出，不校验
  // ... 其余不变
}
```

---

## §4 数据流 / 接口契约

### 4.1 新增外部依赖

| 接口 | 调用方 | 说明 |
|---|---|---|
| `GET /maintain/web/basic/repairItem/list` | 编辑页 list-select | 跨服务调用维保模块，dealer 已先例 |

**请求**：

```javascript
{ codeOrNameLike: '关键字', limitSize: 20 }
```

**响应**：数组 `[{ id, code, name, ... }]`，list-select 自动映射 `id` → value、`code` → label、`name` → 第二行。

### 4.2 列表页 `getList` 入参新增

| 字段 | 后端对应 | 类型 |
|---|---|---|
| `repairItemCodeLike` | `Qo.repairItemCodeLike` | string |
| `repairItemNameLike` | `Qo.repairItemNameLike` | string |

`getFormData` 已有逻辑「空字符串自动 `delete`」，新字段无需特殊处理。

### 4.3 `addOrUpdate` 入参

**仅 `repairItemId` 必填**。`repairItemCode` / `repairItemName` 由后端 `CmdExe.fillRepairItemInfo` 自动根据 `repairItemId` 通过 `RepairItemGateway.getById` 查询并填入 Do。

后端业务唯一性校验升级为 `维修项目ID + 车系ID + 生效开始日期`，前端无需感知。

---

## §5 错误处理 / 边界场景

| 场景 | 行为 |
|---|---|
| 新增未选维修项目 | el-form rule 拦截：`"请输入维修项目代码"` |
| 选了维修项目后清空 | list-select change 事件把 code/name 同步清空；rule 拦截 |
| 编辑时维修项目下拉禁用 | `:disabled="Boolean(_id)"` 直接禁用 |
| 绕过前端禁用改 repairItemId | 后端 `CmdExe.fillRepairItemInfo` 重新填充；`Validator.validateEdit` 抛 `"维修项目不允许编辑"` BizException，前端 toast 显示 |
| 跨服务接口 `/maintain/web/basic/repairItem/list` 不可用 | list-select 显示空下拉；不静默吞 |
| 后端 `RepairItemGateway` Fallback 全部降级 | 后端抛 `"维修项目不存在"` BizException，前端 toast 显示 |
| 表格列显示 | 后端 Response 直接返回 `repairItemCode/repairItemName`，无前端二次处理 |
| 导出 Excel | 导出基于 `dataProp` 可见列自动包含两列，无需额外改动 |

---

## §6 测试

冒烟测试（在 `npm run local` 启动后）：

1. 列表加载正常，表格新增两列有数据
2. 输入「维修项目代码」模糊查询生效
3. 输入「维修项目名称」模糊查询生效
4. 新增一条记录：list-select 弹出可选维修项目 → 输入关键字过滤 → 选中 → 自动带出 code/name → 提交成功
5. 编辑记录：list-select 禁用、维修项目名称输入框禁用
6. 明细视图（form-detail）正确显示两字段
7. 导出 Excel 包含「维修项目代码」「维修项目名称」两列
8. 重复「维修项目 + 车系 + 生效开始日期」时，后端抛唯一性异常，前端 toast 提示

---

## §7 兼容性

- 后端字段均为新增可空（`DEFAULT NULL`），老数据无需迁移
- 后端业务唯一性从「车系+生效时间」升级为「维修项目+车系+生效时间」，运维部署前需清理 `(NULL, X, Y)` 重复元组（详见后端计划 §回滚方案）
- 前端改动只涉及 supplier 模块两个 vue 文件，不影响其他模块

---

## §8 已知假设

1. **`/maintain/web/basic/repairItem/list` 接口稳定可用**：dealer 已在生产使用，supplier 沿用
2. **MyBatis-Plus 自动识别 `Like` 后缀**：项目已有 `vehicleSeriesNameLike` 先例，无需修改配置
3. **MapStruct 同名字段自动映射**：项目约定，前端不需要任何处理
4. **导入模板**：列表有「导入」按钮，但导入模板字段维护在 Nacos 配置而非前端代码，超出本设计范围；后续由业务/运维同步

---

## §9 非目标

- 不修改后端任何 Java 类（已实现完毕）
- 不修改 API 文件（已直接转发，无需新增）
- 不修改导入模板字段（属于 Nacos 配置，由业务团队负责）
- 不修改路由、权限、面包屑