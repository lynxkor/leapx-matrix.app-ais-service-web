# 零件保养信息子表"空日期不可编辑" 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修改 `NextTable.vue` 日期列的 `v-if` 条件,使 `nextMaintenanceDate` 为空的行在编辑态下不渲染 `el-date-picker`,而落到查看态的 `<span>` 分支(空文本)。

**Architecture:** 模板条件微调。`<el-date-picker>` 的 `v-if` 增加 `&& row.nextMaintenanceDate`,其他模板字符、方法、props、API 调用均不动。代码量:1 行模板。

**Tech Stack:** Vue 2 + VXE Table + Element UI。

---

## 设计参考与基线

- **设计文档**:`docs/superpowers/specs/2026-08-25-nexttable-empty-date-no-edit-design.md`
- **目标文件**:`src/views/datacenter/vehicle/vehicleProfile/NextTable.vue`(line 25-37 日期列模板)
- **不改**:里程列模板、`saveRowEdit` / `cancelEdit` / `handleResetPart` 方法、props、API

## 文件结构总览

| 类别 | 路径 | 变更 |
|------|------|------|
| 零件子表 | `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | line 28 `v-if` 条件增加 `&& row.nextMaintenanceDate` |

## Commit 切分建议

| Commit | 任务 | 范围 |
|--------|------|------|
| `feat(NextTable): 空日期的行,编辑时日期字段保持只读` | Task 1 | 单行模板改动 |
| `chore(verify): 本地启动完成冒烟测试` | Task 2 | 浏览器人工验证 |

---

## 全局约束

- 缩进 2 空格,语句加 `;`,函数括号前后空格,文件末尾保留换行符。
- 组件优先级:`@/libs/components` > element-ui;API 调用统一 `api.jsonPost`(本次不新增 API)。
- 不引入新依赖,不修改 `package.json`。
- **本计划不编写自动化测试**。本仓库对 Vue 组件无单测基建,验证方式为 `lint-staged`(commit 时自动跑 eslint)+ 本地浏览器冒烟测试。`lint-staged` 会阻断含 eslint error 的 commit。
- 「空」定义为 `!row.nextMaintenanceDate`(覆盖 `null` / `undefined` / `''`)。

---

## Task 1: 修改日期列 `v-if` 条件

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue:28`

### Step 1.1: 修改 `v-if` 条件

**位置**:`NextTable.vue` line 28(整个文件第 28 行,日期列模板里 `<el-date-picker>` 标签的 `v-if`)

**现状**:

```vue
          v-if="isEdit && eidtRowIndex === rowIndex"
```

**改为**:

```vue
          v-if="isEdit && eidtRowIndex === rowIndex && row.nextMaintenanceDate"
```

**唯一改动**:在条件末尾增加 `&& row.nextMaintenanceDate`。其他字符、缩进、模板结构均不动。

**校验**:保存文件后,该 `v-if` 表达式与设计文档 §3.2 字面一致。

### Step 1.2: 静态自检

打开文件,确认:
- line 28 的 `v-if` 表达式已更新
- 其他行无附带改动
- 文件末尾保留换行符

在文件内 grep 期望保留的方法(确认未误删):

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
grep -n "saveRowEdit\|cancelEdit\|editRow\|handleResetPart" "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
```

预期:4 个方法名均有命中,行号不变。

### Step 1.3: 启动本地 dev server 人工验证

**命令**:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
npm run local
```

**人工验证步骤**:

1. **场景 M**——打开车辆档案 → 进入任一车辆详情 → 点「调整保养信息」→ 在子表中找一行 `nextMaintenanceDate` 为空的零件 → 点该行操作栏「编辑」→ 日期列应**显示空文本**(跟查看态一致),里程列变为 `el-input-number` 可编辑。
2. **场景 N**——找一个日期非空的零件行 → 点「编辑」→ 日期列仍渲染 `el-date-picker`,里程列仍可编辑(行为不变)。
3. **场景 O**——空日期行改里程 → 点保存 → 接口成功 → 关闭弹窗 → 重新打开 → 再次进入该行编辑 → 仍仅里程可编辑。
4. **场景 P**——空日期行改里程 → 点取消 → 恢复原始值,退出编辑态。

**任意场景失败**:停下来,排查后再继续;不要提交 Task 1 的 commit。

### Step 1.4: 提交 Task 1

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git add "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit -m "feat(NextTable): 空日期的行,编辑时日期字段保持只读"
```

预期输出:commit 成功,hash 不为空。

**注意**:lint-staged 会自动跑 eslint;若失败,按报错修复再重试 commit。

---

## Task 2: 集成冒烟测试与归档

**Files:** 无改动,只验证。

### Step 2.1: 跑完整 4 场景回归

将 Task 1 的 4 个场景(M–P)合并跑一遍,确认全部通过。

记录每个场景的验证结果。

### Step 2.2: 检查 git 历史与差异

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git log --oneline -3
git diff HEAD~1 -- "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
```

**预期**:
- log 最近 1 条为 Task 1 的 commit
- diff 仅触及 `NextTable.vue` 的 line 28 一处,无其他改动

### Step 2.3: 提交验证记录(可选)

如需在 git 中留痕:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit --allow-empty -m "chore(verify): 4 个场景冒烟测试通过"
```

否则跳过本步,直接报告完成。

---

## 自审记录(写计划时复核)

- **spec 覆盖**:
  - §3.1 触发条件 → Step 1.1 条件 (`!row.nextMaintenanceDate` 等价于 falsy 检查) ✅
  - §3.2 模板改动 → Step 1.1 完整呈现 ✅
  - §3.3 不动的部分 → Step 1.2 grep 校验未误删方法 ✅
  - §4 边界场景 → Step 1.3 场景 M–P ✅

- **占位符扫描**:无 TBD / TODO / 留白代码块。

- **类型/方法名一致性**:
  - `row.nextMaintenanceDate` 与 `el-date-picker` 的 `v-model` 同名一致 ✅
  - `eidtRowIndex` 沿用现有拼写(项目历史 typo,本次不动) ✅
  - 模板改动不影响其他列的 `v-if`(里程列独立判断) ✅