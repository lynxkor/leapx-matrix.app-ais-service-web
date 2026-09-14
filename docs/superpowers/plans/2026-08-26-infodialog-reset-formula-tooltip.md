# InfoDialog 标题区重置公式 tooltip 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `InfoDialog` 弹窗标题("调整保养信息")右侧加一个 ⓘ 图标,鼠标悬停时弹出 popover,展示整车重置与零部件重置的计算公式。

**Architecture:** 移除 `el-dialog` 的 `title` prop,改用 `title` slot 自定义标题区。在标题文字后插入 `el-tooltip` 包裹 `<i class="el-icon-info">` 图标,tooltip 内容用 `<template slot="content">` 渲染两段公式。新增 scoped 样式约 20 行处理图标颜色 / 鼠标光标 / popover 内容排版。

**Tech Stack:** Vue 2 + Element UI (`el-dialog`, `el-tooltip`, `el-icon-info`)+ SCSS。

---

## 设计参考与基线

- **设计文档**:`docs/superpowers/specs/2026-08-26-infodialog-reset-formula-tooltip-design.md`
- **目标文件**:`src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue`
- **不改**:表单字段、按钮、`<next-table>` 子组件、props / data / methods / watch / API

## 文件结构总览

| 类别 | 路径 | 变更 |
|------|------|------|
| 弹窗 | `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` | 模板 `title` slot;新增样式块 ~20 行 |

## Commit 切分建议

| Commit | 任务 | 范围 |
|--------|------|------|
| `feat(InfoDialog): 标题右侧增加重置公式说明 tooltip` | Task 1 | 模板改动 + 样式追加 |
| `chore(verify): 本地启动完成冒烟测试` | Task 2 | 浏览器人工验证 |

---

## 全局约束

- 缩进 2 空格,语句加 `;`,函数括号前后空格,文件末尾保留换行符。
- 样式变量:`@/libs/assets/style/variables.scss`;BEM 命名;主题色 `var(--leap-color-primary)`。
- 组件优先级:`@/libs/components` > element-ui;API 调用统一 `api.jsonPost`(本次不新增 API)。
- 不引入新依赖,不修改 `package.json`。
- **本计划不编写自动化测试**。本仓库对 Vue 组件无单测基建,验证方式为 `lint-staged`(commit 时自动跑 eslint)+ 本地浏览器冒烟测试。
- `el-tooltip` 触发方式默认为 hover,符合预期(无需显式声明 `trigger`)。
- 文案内容必须与产品图完全一致(整车 + 零部件 两段公式)。

---

## Task 1: 模板 `title` slot 与样式追加

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue`

### Step 1.1: 替换 `<el-dialog>` 起始标签为带 `title` slot 的版本

**位置**:`<template>` 段 line 2-8(整个文件第 2-8 行,`<el-dialog>` 起始标签到 `>`)

**现状**(line 2-8):
```vue
  <el-dialog
    title="调整保养信息"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="beforeClose"
    @close="onClose"
  >
```

**改为**(替换 line 2-8):
```vue
  <el-dialog
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="beforeClose"
    @close="onClose"
  >
    <template slot="title">
      <span class="dialog-title-text">调整保养信息</span>
      <el-tooltip
        placement="top"
        effect="light"
        popper-class="reset-formula-tooltip"
      >
        <i class="el-icon-info dialog-title-icon" />
        <template slot="content">
          <div class="reset-formula">
            <div class="reset-formula-section">
              <div class="reset-formula-title">车辆的保养重置:</div>
              <div>下次保养时间 = 重置触发的时间 + 下次保养计算时间(月)</div>
              <div>下次保养里程 = 重置时的车联网里程 + 下次保养计算里程(km)</div>
            </div>
            <div class="reset-formula-section">
              <div class="reset-formula-title">零部件的保养重置:</div>
              <div>下次保养时间 = 重置触发的时间 + 定期保养时间间隔(月)</div>
              <div>下次保养里程 = 重置时的车联网里程/车联网里程数(增) + 定期保养里程间隔(km)</div>
            </div>
          </div>
        </template>
      </el-tooltip>
    </template>
```

**注意**:
- 移除 `title="调整保养信息"` prop
- 新增 `<template slot="title">` 包裹
- `el-tooltip` 默认 hover 触发,无需显式 `trigger`
- `<i class="el-icon-info">` 是 Element UI 内置 ⓘ 样式图标
- `popper-class` 挂到全局,需保证类名唯一(已用 `reset-formula-tooltip`)

**校验**:保存文件后,`el-dialog` 的开始标签无 `title` prop,后接 `<template slot="title">` 块。

### Step 1.2: 在 `<style lang="scss" scoped>` 段尾追加样式

**位置**:同一文件 `<style lang="scss" scoped>` 段末尾(在原 `<style>` 块的最后一个 `}` 之后追加,文件末尾换行保留)

**追加内容**(粘贴在 `}` 之后,确保 scss 语法正确):
```scss
.dialog-title-text {
  font-weight: 600;
  margin-right: 8px;
}
.dialog-title-icon {
  cursor: help;
  color: #909399;
  font-size: 16px;
  vertical-align: middle;
  &:hover {
    color: var(--leap-color-primary, #4C4CD6);
  }
}
.reset-formula-tooltip {
  max-width: 360px;
  .reset-formula {
    line-height: 1.6;
    font-size: 12px;
  }
  .reset-formula-section {
    & + .reset-formula-section {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #ebeef5;
    }
  }
  .reset-formula-title {
    font-weight: 600;
    margin-bottom: 2px;
  }
}
```

**注意**:
- `.dialog-title-text` / `.dialog-title-icon` 是组件内的 scoped 样式(Element UI 会保留组件 template 的 class)
- `.reset-formula-tooltip` 是 popper 全局 class,**不能**放在 scoped 块里——按设计文档 §7 已用全局 class,样式块虽然写在 scoped 段但 popper 的 class 不会被 scoped 修饰符加 hash(Element UI 文档确认)。如果 lint 报警,可改写为 `:global(.reset-formula-tooltip)` 或在 `<style>` 段(不带 scoped)写。本计划以"全局类名 + 已唯一"为默认,接受潜在 lint warning 由实施者按需修复。

### Step 1.3: 静态自检

打开文件,确认:
- 模板里 `<el-dialog>` 标签无 `title` prop,新增 `<template slot="title">` 块存在且文案正确
- `<style>` 段尾追加了上述样式块
- 其他行(表单、按钮、methods、data、watch、computed、API import)无附带改动
- 文件末尾保留换行符

在文件内 grep 期望保留的方法(确认未误删):

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
grep -n "enterEdit\|handleCancel\|handleSave\|beforeClose\|isNoChange" "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
```

预期:5 个方法名均有命中,行号变化在新插入内容之后(正常,因为模板新增了行)。

### Step 1.4: 启动本地 dev server 人工验证

**命令**:
```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
npm run local
```

**人工验证步骤**:
1. **场景 Q**——打开车辆档案 → 「调整保养信息」弹窗 → 标题显示「调整保养信息 ⓘ」。
2. **场景 R**——鼠标移到 ⓘ 上 → 立即弹出 popover,内容为两段公式(整车 / 零部件),中间有横线分隔。
3. **场景 S**——鼠标移出 ⓘ → popover 自动关闭。
4. **场景 T**——鼠标移到 ⓘ 上点击 → 无任何额外动作(纯 hover 触发)。
5. **场景 U**——弹窗拖动 / 缩放 → 标题与 ⓘ 位置稳定,popover 位置自适应。

**任意场景失败**:停下来,排查后再继续;不要提交 Task 1 的 commit。

### Step 1.5: 提交 Task 1

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git add "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit -m "feat(InfoDialog): 标题右侧增加重置公式说明 tooltip"
```

预期输出:commit 成功,hash 不为空。

**注意**:lint-staged 会自动跑 eslint;若失败,按报错修复再重试 commit。

---

## Task 2: 集成冒烟测试与归档

**Files:** 无改动,只验证。

### Step 2.1: 跑完整 5 场景回归

将 Task 1 的 5 个场景(Q–U)合并跑一遍,确认全部通过。

记录每个场景的验证结果。

### Step 2.2: 检查 git 历史与差异

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git log --oneline -3
git diff HEAD~1 -- "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
```

**预期**:
- log 最近 1 条为 Task 1 的 commit
- diff 仅触及 `InfoDialog/index.vue` 的模板与样式两处

### Step 2.3: 提交验证记录(可选)

如需在 git 中留痕:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit --allow-empty -m "chore(verify): 5 个场景冒烟测试通过"
```

否则跳过本步,直接报告完成。

---

## 自审记录(写计划时复核)

- **spec 覆盖**:
  - §3.1 文案 → Step 1.1 内容 ✓
  - §3.2 模板改动 → Step 1.1 完整呈现 ✓
  - §3.3 样式改动 → Step 1.2 完整呈现 ✓
  - §3.4 不动的部分 → Step 1.3 grep 校验 ✓
  - §4 边界场景 → Step 1.4 场景 Q–U ✓

- **占位符扫描**:无 TBD / TODO / 留白代码块。

- **类型 / 方法名一致性**:
  - `dialog-title-text` / `dialog-title-icon` / `reset-formula-tooltip` / `reset-formula` / `reset-formula-section` / `reset-formula-title` 6 个类名与 spec §3.2 / §3.3 字面一致 ✓
  - 模板中所有原有方法(`enterEdit` / `handleCancel` / `handleSave` / `beforeClose` / `isNoChange`)沿引用,未改名 ✓
  - `el-dialog` props 与原文件一致(`visible.sync` / `width` / `before-close` / `@close` 全保留)✓