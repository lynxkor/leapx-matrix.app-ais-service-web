# 供应商代步车索赔价格 前端维修项目字段 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `app-ais-aftersale-front` 的 `supplierReplacementCarClaimPrice` 列表页和编辑页同步新增维修项目代码/名称的查询、列表展示与表单选择能力，对齐后端已实现的 `repair_item_id/code/name` 三字段。

**Architecture:** 沿用同模块 `dealerReplacementCarClaimPrice`（门店代步车）的现有前端模式——列表页加两个 `el-input` 全模糊查询 + 两个表格列；编辑页用 `<list-select>` 调用维保模块 `/maintain/web/basic/repairItem/list` 选择维修项目，自动回填 code/name；编辑时维修项目字段通过 `:disabled="Boolean(_id)"` 锁死。后端 `CmdExe.fillRepairItemInfo` 已支持仅传 `repairItemId` 自动填 code/name。

**Tech Stack:** Vue 2 + Vuex + Element UI + VXE Table + 内部 `<list-select>` 组件 + `LPVxeTable`。

---

## 设计参考与基线

- **设计文档**：`docs/superpowers/specs/2026-06-30-supplier-replacement-car-claim-price-front-repair-item-design.md`
- **后端实施计划**：`app-ais-claimreturn/docs/superpowers/plans/2026-06-30-supplier-replacement-car-claim-price-repair-item-implementation-plan.md`
- **同款参考实现**：`src/views/claimreturn/claim/basic/dealerReplacementCarClaimPrice/{index.vue,edit.vue}`
- **API 文件**（不动）：`src/api/claimreturn/claim/basic/supplierReplacementCarClaimPrice/index.js`

---

## 文件结构总览

| 类别 | 路径 | 变更 |
|---|---|---|
| 列表页 | `src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/index.vue` | 新增 2 个查询条件 + 2 个表格列 + defaultForm 加 2 个字段 |
| 编辑页 | `src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/edit.vue` | 新增 list-select（代码）+ el-input（名称）+ handleRepairItemChange + defaultForm + rules + 明细视图 2 行 |

---

## Commit 切分建议

| Commit | 任务 | 范围 |
|---|---|---|
| `feat(list): supplierReplacementCarClaimPrice 列表页新增维修项目代码/名称查询与表格列` | Task 1 | index.vue |
| `feat(edit): supplierReplacementCarClaimPrice 编辑页新增维修项目代码下拉与名称只读` | Task 2 + 3 | edit.vue（合并为单 commit） |
| `chore(verify): 本地启动 + 冒烟测试` | Task 4 | 集成验证 |

> Task 2 和 Task 3 都修改 edit.vue，合并为单个 commit 以减少噪音并保持原子性。

---

## Task 1: 列表页新增查询条件与表格列

**Files:**
- Modify: `src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/index.vue`

---

### Step 1.1: 在 `defaultForm` 中新增两个查询字段

**位置**：第 141-150 行（`const defaultForm = { ... }`）

将原代码：

```javascript
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  priceSerialNo: '',
  vehicleSeriesName: '',
  effectiveStartTime: '',
  status: '',
  createTime: '',
  updateTime: '',
  claimDaysAdjustment: '',
};
```

改为：

```javascript
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  priceSerialNo: '',
  vehicleSeriesName: '',
  repairItemCodeLike: '',
  repairItemNameLike: '',
  effectiveStartTime: '',
  status: '',
  createTime: '',
  updateTime: '',
  claimDaysAdjustment: '',
};
```

---

### Step 1.2: 在价格序号之后、车系名称之前新增「维修项目代码」查询条件

**位置**：第 12-25 行（两个 `el-form-item` 之间）

在第 25 行 `</el-form-item>`（车系名称结束）后、第 26 行 `<template v-if="show">` 之前，插入：

```html
<el-form-item label="维修项目代码">
  <el-input
    placeholder="请输入"
    v-model="form.repairItemCodeLike"
    clearable
  />
</el-form-item>
```

---

### Step 1.3: 在 `<template v-if="show">` 内、车系名称同级位置新增「维修项目名称」查询条件

**位置**：第 26-77 行（展开区域）

在第 26 行 `<template v-if="show">` 之后、第 27 行 `<!-- 生效开始日期 -->` 之前，插入：

```html
<el-form-item label="维修项目名称">
  <el-input
    placeholder="请输入"
    v-model="form.repairItemNameLike"
    clearable
  />
</el-form-item>
```

---

### Step 1.4: 在 `dataProp` 中新增两个表格列（紧贴 `vehicleSeriesName` 后面）

**位置**：第 208-209 行（`vehicleSeriesName` 列后）

将原代码：

```javascript
{ props: 'vehicleSeriesName', label: '车系名称', visible: true, width: 140 },
{ props: 'supplierClaimPrice', label: '供应商索赔价格', visible: true, width: 140, align: 'right' },
```

改为：

```javascript
{ props: 'vehicleSeriesName', label: '车系名称', visible: true, width: 140 },
{ props: 'repairItemCode', label: '维修项目代码', visible: true, width: 200 },
{ props: 'repairItemName', label: '维修项目名称', visible: true, width: 200 },
{ props: 'supplierClaimPrice', label: '供应商索赔价格', visible: true, width: 140, align: 'right' },
```

---

### Step 1.5: 启动本地服务并冒烟测试列表页

**命令**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
npm run local
```

预期：浏览器打开 `http://localhost:7779/claimreturn/claim/basic/supplierReplacementCarClaimPrice`，看到：

- 顶部查询区多了一个「维修项目代码」输入框
- 点击「展开」按钮后，多了一个「维修项目名称」输入框
- 表格多出「维修项目代码」「维修项目名称」两列，且紧贴「车系名称」右侧

**手动验证 checklist**：

- [ ] 列表加载正常，两列有数据
- [ ] 在「维修项目代码」框输入关键字 → 点击「搜索」→ 表格按 code 全模糊过滤
- [ ] 在「维修项目名称」框输入关键字 → 点击「搜索」→ 表格按 name 全模糊过滤

---

### Step 1.6: commit

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git add src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/index.vue
git commit -m "feat(list): supplierReplacementCarClaimPrice 列表页新增维修项目代码/名称查询与表格列"
```

---

## Task 2: 编辑页新增维修项目代码下拉与名称只读输入

**Files:**
- Modify: `src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/edit.vue`

---

### Step 2.1: 在 `defaultForm` 中新增三个字段

**位置**：第 156-175 行（`const defaultForm = { ... }`）

将原代码：

```javascript
const defaultForm = {
  // 多选时字段有变化，自行修复
  priceSerialNo: '',
  vehicleSeriesName: '',
  supplierClaimPrice: '',
  claimDaysAdjustment: 0,
  effectiveStartTime: '',
  status: '1',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  statusDesc: '',
  dataSource: '',
  vehicleSeriesId: '',
};
```

改为：

```javascript
const defaultForm = {
  // 多选时字段有变化，自行修复
  priceSerialNo: '',
  vehicleSeriesName: '',
  repairItemId: '',
  repairItemCode: '',
  repairItemName: '',
  supplierClaimPrice: '',
  claimDaysAdjustment: 0,
  effectiveStartTime: '',
  status: '1',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  statusDesc: '',
  dataSource: '',
  vehicleSeriesId: '',
};
```

---

### Step 2.2: 在车系名称之后插入「维修项目代码」list-select

**位置**：第 53 行 `</el-form-item>`（车系名称结束）后、第 54 行 `<!-- 供应商索赔价格 -->` 之前

在第 53 行 `</el-form-item>` 之后、第 54 行 `<!-- 供应商索赔价格 -->` 之前，插入：

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

---

### Step 2.3: 在「维修项目代码」之后插入「维修项目名称」只读 el-input

**位置**：紧贴上一步插入的 `</el-form-item>` 之后

紧接 Step 2.2 插入内容的 `</el-form-item>` 之后，插入：

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

---

### Step 2.4: 在 `rules` 中新增 `repairItemCode` 必填规则

**位置**：第 250-265 行（`rules: { ... }`）

将原代码：

```javascript
rules: {
  vehicleSeriesName: [
    { required: true, message: '请输入车系名称', trigger: 'change' }
  ],
  supplierClaimPrice: [
    { required: true, message: '请输入供应商索赔价格', trigger: 'change' },
    { validator: this.validatePositiveNumber, trigger: 'change' }
  ],
  effectiveStartTime: [
    { required: true, message: '请选择生效开始日期', trigger: 'change' },
    { validator: this.validateEffectiveStartTime, trigger: 'change' }
  ],
  claimDaysAdjustment: [
    { required: true, message: '请输入索赔天数调整', trigger: 'change' }
  ],
},
```

改为：

```javascript
rules: {
  vehicleSeriesName: [
    { required: true, message: '请输入车系名称', trigger: 'change' }
  ],
  repairItemCode: [
    { required: true, message: '请输入维修项目代码', trigger: 'change' }
  ],
  supplierClaimPrice: [
    { required: true, message: '请输入供应商索赔价格', trigger: 'change' },
    { validator: this.validatePositiveNumber, trigger: 'change' }
  ],
  effectiveStartTime: [
    { required: true, message: '请选择生效开始日期', trigger: 'change' },
    { validator: this.validateEffectiveStartTime, trigger: 'change' }
  ],
  claimDaysAdjustment: [
    { required: true, message: '请输入索赔天数调整', trigger: 'change' }
  ],
},
```

---

### Step 2.5: 新增 `handleRepairItemChange` 方法

**位置**：第 304-307 行（`handleVehicleSeriesChange` 方法之后、`validateEffectiveStartTime` 之前）

在第 307 行 `},`（`handleVehicleSeriesChange` 结束）之后、第 308 行 `validateEffectiveStartTime (rule, value, callback) {` 之前，插入：

```javascript
handleRepairItemChange (val, selectedItem) {
  this.form.repairItemId = val;
  this.form.repairItemCode = selectedItem ? selectedItem.code : '';
  this.form.repairItemName = selectedItem ? selectedItem.name : '';
},
```

---

## Task 3: 编辑页明细视图同步新增两行

**Files:**
- Modify: `src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/edit.vue`

---

### Step 3.1: 在 form-detail 中车系名称行之后插入两行

**位置**：第 100-131 行（明细视图 `<el-form>`）

在第 106 行 `</el-form-item>`（车系名称明细行结束）之后、第 107 行 `<!-- 供应商索赔价格 -->` 之前，插入：

```html
<el-form-item label="维修项目代码：" prop="repairItemCode">
  {{ form.repairItemCode }}
</el-form-item>
<el-form-item label="维修项目名称：" prop="repairItemName">
  {{ form.repairItemName }}
</el-form-item>
```

---

### Step 3.2: 编辑页 commit

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git add src/views/claimreturn/claim/basic/supplierReplacementCarClaimPrice/edit.vue
git commit -m "feat(edit): supplierReplacementCarClaimPrice 编辑页新增维修项目代码下拉与名称只读"
```

---

## Task 4: 集成验证（手动冒烟）

**Files:**
- Verify: 本地 npm run local 服务 + 后端 Nacos 已部署新版本

> 注：以下步骤全部为手动验证，无需修改任何代码。

---

### Step 4.1: 启动前端并打开新增页面

**命令**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
npm run local
```

浏览器进入「新增」页面（点击列表的「新增」按钮）。

**手动验证 checklist**：

- [ ] 表单出现顺序为：价格序号 → 车系名称 → **维修项目代码（下拉）** → **维修项目名称（输入框禁用）** → 供应商索赔价格 → 索赔天数调整 → 生效开始日期 → 状态 → 备注
- [ ] 「维修项目代码」下拉框：点击/输入关键字弹出候选列表，每项显示 code + name
- [ ] 选中一项后，「维修项目名称」输入框自动填充对应 name（保持禁用）
- [ ] 提交一条新记录成功（POST 返回 id）
- [ ] 列表中能看到新记录的 code/name 列

---

### Step 4.2: 打开编辑页面

**入口**：点击列表中新记录的「编辑」按钮。

**手动验证 checklist**：

- [ ] 「维修项目代码」下拉框显示当前 code，且 **不可下拉**
- [ ] 「维修项目名称」输入框显示当前 name，且 **不可编辑**
- [ ] 修改供应商索赔价格、索赔天数调整、生效开始日期（如允许），提交成功
- [ ] 刷新页面后，维修项目 code/name 仍正确显示

---

### Step 4.3: 明细视图验证

**入口**：点击列表中新记录的「价格序号」链接（详情视图）。

**手动验证 checklist**：

- [ ] 明细视图显示「维修项目代码」+「维修项目名称」两行
- [ ] 字段值与列表页一致

---

### Step 4.4: 列表模糊查询验证

**手动验证 checklist**：

- [ ] 在「维修项目代码」框输入完整 code（已存在）→ 点击「搜索」→ 仅命中该记录
- [ ] 在「维修项目代码」框输入 code 片段 → 全模糊匹配
- [ ] 展开后在「维修项目名称」框输入 name 片段 → 全模糊匹配
- [ ] 输入不存在的内容 → 列表为空

---

### Step 4.5: 导出验证

**入口**：勾选若干记录 → 点击「导出」。

**手动验证 checklist**：

- [ ] 导出 Excel 文件名包含「维修项目代码」「维修项目名称」列
- [ ] 列值与列表展示一致

---

### Step 4.6: 边界场景验证

**手动验证 checklist**：

- [ ] 新增时不选维修项目 → 提交时表单提示「请输入维修项目代码」
- [ ] 重复「维修项目 + 车系 + 生效开始日期」→ 后端 BizException → 前端 toast 提示「在生效开始日期：... 已经存在维修项目：... 车系：... 的代步车索赔价格，请重新录入」
- [ ] `/maintain/web/basic/repairItem/list` 接口不可用（mock 断网）→ 编辑页 list-select 下拉为空；新增提交时后端抛「维修项目不存在」BizException

---

### Step 4.7: 验收 commit

确认所有 checklist 通过后，无需额外 commit；Task 2 的 commit 已经覆盖代码改动。

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git log --oneline -10
git status
```

预期：

- `feat(list): supplierReplacementCarClaimPrice 列表页...`
- `feat(edit): supplierReplacementCarClaimPrice 编辑页...`
- `docs(superpowers): supplierReplacementCarClaimPrice 前端维修项目字段设计`
- working tree clean（除了已存在的未提交文件：`package-lock.json`、`package.json`、`public/js/env.js`、`templates-2/md/...`）

---

## 已知假设

1. **`/maintain/web/basic/repairItem/list` 接口稳定可用**：dealer 已在生产使用，supplier 沿用
2. **后端 Nacos 已部署新版本**：`supplier_replacement_car_claim_price` 表已包含三个新字段，且 `CmdExe.fillRepairItemInfo` 已生效
3. **`getList` 入参新增的 `repairItemCodeLike` / `repairItemNameLike` 字段**：MyBatis-Plus 自动识别 `Like` 后缀生成 `LIKE '%value%'`，无需后端额外配置
4. **`codeOrNameLike` 是维保模块接口的查询字段**：与 dealer 一致
5. **导入模板字段**：超出本计划范围，由业务/运维在 Nacos 同步更新

---

## 回滚方案

| 阶段 | 回滚方法 |
|---|---|
| Task 1（列表页）未提交 | `git checkout -- src/views/.../index.vue` |
| Task 1（列表页）已提交 | `git revert <commit-id>` |
| Task 2+3（编辑页）未提交 | `git checkout -- src/views/.../edit.vue` |
| Task 2+3（编辑页）已提交 | `git revert <commit-id>` |
| 整体回滚 | `git revert <edit-commit> <list-commit>`（后端不动，前端可独立回滚） |

---

## 自检（spec 覆盖检查）

| Spec 章节 | 对应 Task / Step | 备注 |
|---|---|---|
| §2.1 查询条件 | Task 1 Step 1.2 + 1.3 | 维修项目代码默认 + 维修项目名称展开 |
| §2.2 表格列 | Task 1 Step 1.4 | 紧贴 vehicleSeriesName 后 |
| §2.3 defaultForm | Task 1 Step 1.1 | +repairItemCodeLike +repairItemNameLike |
| §3.1 字段顺序 | Task 2 Step 2.2 + 2.3 | 车系名称之后 |
| §3.2 list-select | Task 2 Step 2.2 | 完整代码块 |
| §3.3 名称只读 | Task 2 Step 2.3 | disabled el-input |
| §3.4 明细视图 | Task 3 Step 3.1 | 两行 |
| §3.5 handleRepairItemChange | Task 2 Step 2.5 | 完整方法 |
| §3.6 defaultForm + rules | Task 2 Step 2.1 + 2.4 | 三字段 + code 必填 |
| §4 数据流 | 全部 Task 已关注 | 无需代码改动 |
| §5 错误处理 | Task 4 边界场景 | 冒烟测试覆盖 |
| §6 测试 | Task 4 全部 Step | 8 项冒烟 checklist |

---

## 后续收尾（非 plan 内）

- [ ] 推送分支并提交 MR，PR 描述中引用 `docs/superpowers/specs/2026-06-30-supplier-replacement-car-claim-price-front-repair-item-design.md` 和本计划
- [ ] 联系运维在生产部署后端时执行 `ALTER TABLE`（参考后端实施计划 §Task 1）
- [ ] 业务团队同步更新导入模板字段（Nacos 配置）