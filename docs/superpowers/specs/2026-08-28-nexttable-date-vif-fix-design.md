# 零件日期列 v-if 修复 设计文档

**日期**: 2026-08-28
**分支**: feature/20260812-resetMaintain
**状态**: 已批准,待实施
**关联**: 修复前序 spec `2026-08-25-nexttable-empty-date-no-edit-design.md` 引入的 bug

---

## 1. 背景与问题

前序 spec `2026-08-25-nexttable-empty-date-no-edit-design.md`(commit `5447aefd`)将日期列 picker 的 `v-if` 设为:

```vue
<el-date-picker
  v-if="isEdit && eidtRowIndex === rowIndex && row.nextMaintenanceDate"
  ...
/>
```

**Bug**:用户在编辑态下**清空日期**(键盘 backspace / 直接编辑)后,`row.nextMaintenanceDate` 变为 `null`,picker 因 `v-if` 不满足而消失,落到 `<span v-else>` 分支。用户**无法重新选择日期**,被困在空状态,只能放弃或撤销。

最新 spec `2026-08-26-nexttable-save-validator-design.md` 加了 `saveRowEdit` 校验器作为兜底防御,但 picker 消失这个 UX 死路仍存在。

## 2. 范围

**包含**:
- `NextTable.vue` 日期列模板 `v-if` 表达式移除 `&& row.nextMaintenanceDate` 条件
- picker 在编辑态下始终可见,允许清空后重新选择

**不包含**:
- 任何方法改动(已存在的 `saveRowEdit` 校验器继续作为兜底)
- 其他列、操作栏、API
- `eidtRowIndex` 逻辑

## 3. 设计

### 3.1 模板改动

**位置**:`src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` line 28

**现状**:
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

**改为**:
```vue
<el-date-picker
  v-if="isEdit && eidtRowIndex === rowIndex && originTableData[rowIndex] && originTableData[rowIndex].nextMaintenanceDate"
  v-model="row.nextMaintenanceDate"
  type="date"
  value-format="yyyy-MM-dd HH:mm:ss"
  :clearable="false"
  placeholder="选择日期"
  size="small"
/>
```

**关键**:用 `originTableData[rowIndex].nextMaintenanceDate`(原始快照)替代之前的 `row.nextMaintenanceDate`(当前值)。原数据非空 → picker 始终可见,即使当前值被清空;原数据为空 → picker 不渲染(保持只读 span)。其他属性原样。

### 3.2 与其他防御层的关系

| 防御层 | 现状 |
|--------|------|
| `:clearable="false"` (commit `91b8e85e`) | 保留。阻止用户点 X 清空。 |
| `saveRowEdit` 校验器(commit `e988aac7`)| 保留。原数据非空 + 当前空 → 报错 + 保留编辑态。 |
| **v-if 修复(本 spec)** | picker 始终可见,允许清空后重新选 |

三层防御现在完整:不阻止输入 → 输入时空 → 保存时报错且 picker 不消失。

### 3.3 行为变化(对原"空日期行不可编辑"语义的影响)

**前序 spec `5447aefd`** 的设计意图:空日期行(`row.nextMaintenanceDate` 为 null)在编辑态下不显示 picker,只显示 span。

**本 spec 保留该语义**:通过检查 `originTableData[rowIndex].nextMaintenanceDate`(原始快照)而非 `row.nextMaintenanceDate`(当前值),确保:
- 原数据日期为空的行 → picker 不渲染(保持只读 span,与 spec A 一致)
- 原数据日期非空的行 → picker 在编辑态始终可见,即使当前值被清空(修复 bug)

**业务影响**:与 spec A 完全一致,仅修复 picker 消失导致用户卡死的 UX bug。

### 3.4 不动的部分

| 区域 | 行为 |
|------|------|
| `:clearable="false"` | 不动 |
| `saveRowEdit` 校验器 | 不动 |
| 里程列模板 | 不动 |
| 操作栏、`originTableData`、`getDetailPageApi` | 不动 |
| API | 不动 |

## 4. 边界场景

| 场景 | 期望 |
|------|------|
| 原 date 非空,清空 picker | picker 仍可见(空),可重新选日期 |
| 原 date 非空,清空后点保存 | toast「下次保养日期不能为空」(校验器兜底) |
| 原 date 为 null 的行,点击编辑 | picker 不渲染,显示只读 span(保留 spec A 语义) |
| 原 date 为 null 的行,直接点保存 | 正常保存(原值本就允许为空,校验器不触发) |

## 5. 文件改动清单

| 文件 | 类型 | 改动概要 |
|------|------|----------|
| `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | 修改 | 日期列 `v-if` 移除一个条件 |

## 6. 验证

- **代码审查**:1 行修改,1 处模板表达式缩短
- **lint-staged**:commit 时自动跑 eslint
- **本地启动 + 浏览器冒烟**:
  1. 找一个有 `nextMaintenanceDate` 的零件行 → 点编辑 → 键盘 backspace 清空日期 → picker 仍可见,可重新选日期 → 选回有效日期 → 点保存 → 正常保存
  2. 找一个 date 为 null 的零件行 → 点编辑 → picker 显示(空)→ 可选日期
  3. 回归:saveRowEdit 校验器仍工作(清空后保存 → toast 报错)

## 7. 风险与回滚

- **风险**:极低。1 行模板表达式缩短。
- **回滚**:单 commit 反转。
- **副作用**:空日期行从"不可编辑日期"放宽为"可编辑日期"——若业务方不接受,需另议。

## 8. 与前序 spec 的关系

- **前序 spec A**(`2026-08-25-nexttable-empty-date-no-edit-design.md`,commit `5447aefd`):引入 `v-if` 包含 `&& row.nextMaintenanceDate`,**导致本 bug**。
- **前序 spec B**(`2026-08-26-nexttable-non-null-no-clear-design.md`,commit `91b8e85e`):加 `:clearable="false"` 预防 UX。
- **前序 spec C**(`2026-08-26-nexttable-save-validator-design.md`,commit `e988aac7`):加 `saveRowEdit` 校验器兜底。
- **本 spec D**:修复 spec A 的 `v-if`,让 picker 不消失,允许清空后重新选。