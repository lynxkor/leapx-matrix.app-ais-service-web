# 零件保养信息子表"saveRowEdit 校验兜底" 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `NextTable.vue` 的 `saveRowEdit` 方法顶部增加校验:若原数据 `nextMaintenanceDate` / `nextMileage` 非空但当前编辑后值为空,弹错并保留编辑态,不调接口。原值本就为空的允许提交。

**Architecture:** 单方法顶部增加 4 行条件判断 + `$message.error` + `return`。无状态、无 props、无 API 改动。`:clearable="false"`(上一轮)保留作为预防层;本轮校验作为兜底层。

**Tech Stack:** Vue 2 + VXE Table + Element UI Message + `cloneDeep`(已有)。

---

## 设计参考与基线

- **设计文档**:`docs/superpowers/specs/2026-08-26-nexttable-save-validator-design.md`
- **关联 spec**:`docs/superpowers/specs/2026-08-26-nexttable-non-null-no-clear-design.md`(commit `91b8e85e` 提供 `:clearable` 预防层)
- **目标文件**:`src/views/datacenter/vehicle/vehicleProfile/NextTable.vue`
- **改动段**:`saveRowEdit` 方法(line 208-218)
- **不改**:模板、其他列、操作栏、`originTableData` 数据流、API

## 文件结构总览

| 类别 | 路径 | 变更 |
|------|------|------|
| 零件子表 | `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | `saveRowEdit` 顶部增加 4 行校验 |

## Commit 切分建议

| Commit | 任务 | 范围 |
|--------|------|------|
| `feat(NextTable): saveRowEdit 增加校验,原值非空则不允许置空提交` | Task 1 | 单方法顶部 4 行新增 |
| `chore(verify): 本地启动完成冒烟测试` | Task 2 | 浏览器人工验证 |

---

## 全局约束

- 缩进 2 空格,语句加 `;`,函数括号前后空格,文件末尾保留换行符。
- 组件优先级:`@/libs/components` > element-ui;API 调用统一 `api.jsonPost`(本次不动 API)。
- 不引入新依赖,不修改 `package.json`。
- **本计划不编写自动化测试**。本仓库对 Vue 组件无单测基建,验证方式为 `lint-staged`(commit 时自动跑 eslint)+ 本地浏览器冒烟测试。
- 校验失败的错误提示用 `$message.error` toast(NextTable 不是 el-form,不引入内联红字)。
- 校验失败时**保留 `eidtRowIndex`**(不退出编辑态),让用户继续修改。
- 与上一轮 `:clearable="false"` 共存(双层防御)。

---

## Task 1: saveRowEdit 顶部加校验

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue:208-218`

### Step 1.1: 替换 `saveRowEdit` 方法

**位置**:`<script>` 段 line 208-218,`saveRowEdit` 方法整段

**现状**(line 208-218):
```javascript
    saveRowEdit (row, rowIndex) {
      editMaintenanceRecord({
        id: row.id,
        nextMaintenanceDate: row.nextMaintenanceDate,
        nextMileage: row.nextMileage,
      }).then(() => {
        this.$message.success('保存成功');
        this.originTableData = cloneDeep(this.tableData);
        this.eidtRowIndex = -1;
        this.$emit('update');
      });
    },
```

**改为**:
```javascript
    saveRowEdit (row, rowIndex) {
      const origin = this.originTableData.find(r => r.id === row.id);
      // 若原数据日期非空,当前值不能为空
      if (origin && origin.nextMaintenanceDate && !row.nextMaintenanceDate) {
        this.$message.error('下次保养日期不能为空');
        return;
      }
      // 若原数据里程非空,当前值不能为空
      if (origin && origin.nextMileage && (row.nextMileage === '' || row.nextMileage === null || row.nextMileage === undefined)) {
        this.$message.error('下次保养里程不能为空');
        return;
      }
      editMaintenanceRecord({
        id: row.id,
        nextMaintenanceDate: row.nextMaintenanceDate,
        nextMileage: row.nextMileage,
      }).then(() => {
        this.$message.success('保存成功');
        this.originTableData = cloneDeep(this.tableData);
        this.eidtRowIndex = -1;
        this.$emit('update');
      });
    },
```

**关键**:
- 顶部增加 `const origin = this.originTableData.find(...)`,获取原数据快照
- 两条 `if` 校验:原值非空 && 当前值空 → toast + return
- `return` 后不调接口,保留 `eidtRowIndex`(已在外层作用域,不需显式赋值)
- API 调用代码原样保留

### Step 1.2: 静态自检

打开文件,确认:
- `saveRowEdit` 顶部有 `const origin = ...`
- 两条 `if` 校验逻辑字面与 brief 一致
- API 调用代码未变
- 其他方法(`editRow` / `cancelEdit` / `handleResetPart` / `getDetailPageApi`)无附带改动
- 文件末尾保留换行符

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
grep -n "saveRowEdit\|cancelEdit\|editRow\|handleResetPart" "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
```

预期:4 个方法名均有命中,行号变化(因 saveRowEdit 内新增行)。

### Step 1.3: 启动本地 dev server 人工验证

**命令**:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
npm run local
```

**人工验证步骤**:

1. **场景 AG**——找一个有 `nextMaintenanceDate` 的零件行 → 点编辑 → 键盘 backspace 清空日期(绕过 X 按钮) → 点保存 → toast「下次保养日期不能为空」+ 保留编辑态(不退出)。
2. **场景 AH**——找一个有 `nextMileage` 的零件行 → 点编辑 → 键盘清空 mileage → 点保存 → toast「下次保养里程不能为空」+ 保留编辑态。
3. **场景 AI**——找一个 date 为 null 的零件行 → 编辑(日期列显示 span,无 picker) → 改 mileage → 点保存 → 正常保存(日期为空不校验)。
4. **场景 AJ**——找一个 mileage 为 null 的零件行 → 编辑 → 改日期 → 点保存 → 正常保存(里程为空不校验)。
5. **场景 AK**——校验失败后填回合法值 → 点保存 → 正常保存。
6. **场景 AL**——重置后(字段被填)→ 编辑 → 清空日期 → 点保存 → toast 报错(因为重置后原值非空,触发校验)。
7. **场景 AM**(回归)——所有字段都合法点保存 → 正常保存,行为不变。

**任意场景失败**:停下来,排查后再继续;不要提交 Task 1 的 commit。

### Step 1.4: 提交 Task 1

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git add "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit -m "feat(NextTable): saveRowEdit 增加校验,原值非空则不允许置空提交"
```

预期输出:commit 成功,hash 不为空。

**注意**:lint-staged 会自动跑 eslint;若失败,按报错修复再重试 commit。

---

## Task 2: 集成冒烟测试与归档

**Files:** 无改动,只验证。

### Step 2.1: 跑完整 7 场景回归

将 Task 1 的 7 个场景(AG–AM)合并跑一遍,确认全部通过。

记录每个场景的验证结果。

### Step 2.2: 检查 git 历史与差异

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git log --oneline -3
git diff HEAD~1 -- "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
```

**预期**:
- log 最近 1 条为 Task 1 的 commit
- diff 仅触及 `saveRowEdit` 方法(顶部 4 行新增)

### Step 2.3: 提交验证记录(可选)

如需在 git 中留痕:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit --allow-empty -m "chore(verify): 7 个场景冒烟测试通过"
```

否则跳过本步,直接报告完成。

---

## 自审记录(写计划时复核)

- **spec 覆盖**:
  - §3.1 校验逻辑 → Step 1.1 完整呈现 ✓
  - §3.2 与 InfoDialog 差异 → 计划文本中说明 ✓
  - §3.3 双层防护 → 计划文本中说明 ✓
  - §3.4 不动部分 → Step 1.2 grep 校验 ✓
  - §4 边界场景 → Step 1.3 场景 AG–AM ✓

- **占位符扫描**:无 TBD / TODO / 留白代码块。

- **类型 / 方法名一致性**:
  - `originTableData` 在 data() 已定义,本轮复用 ✓
  - `cloneDeep` 已有 lodash import ✓
  - `$message.error` 是 Element UI Message 标准用法 ✓
  - 4 个方法名(`saveRowEdit` / `cancelEdit` / `editRow` / `handleResetPart`)未改名 ✓