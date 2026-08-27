# 零件保养信息子表"非空字段不可清空" 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `NextTable.vue` 零件行编辑态下,若原数据 `nextMaintenanceDate` / `nextMileage` 非空,禁用控件的 X 清空按钮,使用户无法将字段置空。

**Architecture:** 在 `NextTable.vue` 模板的日期 picker 与里程 input-number 上各加一个 `:clearable` 属性。日期 picker 直接 `:clearable="false"`(因为 picker 只在 `row.nextMaintenanceDate` 非空时才渲染);里程 input-number 用动态表达式 `:clearable="!originTableData[rowIndex] || !originTableData[rowIndex].nextMileage"`(根据原始 mileage 决定)。无状态、无方法、无 API 变更。

**Tech Stack:** Vue 2 + VXE Table + Element UI (`el-date-picker`, `el-input-number`)。

---

## 设计参考与基线

- **设计文档**:`docs/superpowers/specs/2026-08-26-nexttable-non-null-no-clear-design.md`
- **目标文件**:`src/views/datacenter/vehicle/vehicleProfile/NextTable.vue`
- **改动段**:模板 line 27-34(日期 picker)、line 40-47(里程 input-number)
- **不改**:`vxe-table` 整体、其他列、操作栏、`saveRowEdit` / `cancelEdit` / `editRow` / `handleResetPart` / API

## 文件结构总览

| 类别 | 路径 | 变更 |
|------|------|------|
| 零件子表 | `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | 日期 picker 加 `:clearable="false"`;里程 input-number 加条件 `:clearable` |

## Commit 切分建议

| Commit | 任务 | 范围 |
|--------|------|------|
| `feat(NextTable): 已填字段编辑时禁用清空按钮` | Task 1 | 2 处模板属性添加 |
| `chore(verify): 本地启动完成冒烟测试` | Task 2 | 浏览器人工验证 |

---

## 全局约束

- 缩进 2 空格,语句加 `;`,函数括号前后空格,文件末尾保留换行符。
- 组件优先级:`@/libs/components` > element-ui;API 调用统一 `api.jsonPost`(本次不新增 API)。
- 不引入新依赖,不修改 `package.json`。
- **本计划不编写自动化测试**。本仓库对 Vue 组件无单测基建,验证方式为 `lint-staged`(commit 时自动跑 eslint)+ 本地浏览器冒烟测试。
- 元素控件原生支持 `:clearable` 属性,无需新依赖或工具方法。
- backspace 清空防御(已知边界)不在本轮范围。

---

## Task 1: 模板属性添加

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue`

### Step 1.1: 给日期 picker 加 `:clearable="false"`

**位置**:`<template>` 段 line 27-34,日期列里的 `<el-date-picker>` 标签

**现状**(line 27-34):
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

**改为**:
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

**关键**:仅添加 `:clearable="false"` 一行,其他属性原样保留。注意 `v-if` 条件已保证 picker 只在 `row.nextMaintenanceDate` 非空时渲染,所以 picker 出现即代表"原数据非空",直接常量禁用清空即可。

### Step 1.2: 给里程 input-number 加条件 `:clearable`

**位置**:`<template>` 段 line 40-47,里程列里的 `<el-input-number>` 标签

**现状**(line 40-47):
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

**改为**:
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

**关键**:
- `:clearable` 是动态表达式:原 mileage 非空 → false(禁用);原 mileage 空 → true(可清)
- `originTableData[rowIndex]` 的索引与 `rowIndex` 对齐(都是 `vehicleProfileMaintenanceRecordPage` API 返回的 records 索引)
- `!originTableData[rowIndex]` 是防御性判断,处理 originTableData 缺失的边界(实际不会发生,但加上避免 lint 警告)

### Step 1.3: 静态自检

打开文件,确认:
- 日期 picker `:clearable="false"` 已加,其他属性原样
- 里程 input-number `:clearable="!originTableData[rowIndex] || !originTableData[rowIndex].nextMileage"` 已加,其他属性原样
- 其他列(零件名称 / 代码 / 里程类型 / 操作栏)无附带改动
- 文件末尾保留换行符

在文件内 grep 期望保留的方法:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
grep -n "saveRowEdit\|cancelEdit\|editRow\|handleResetPart" "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
```

预期:4 个方法名均有命中(行号不变)。

### Step 1.4: 启动本地 dev server 人工验证

**命令**:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
npm run local
```

**人工验证步骤**:

1. **场景 AB**——打开车辆档案 → 「调整保养信息」弹窗 → 找一个有 `nextMaintenanceDate` 的零件行 → 点编辑 → 日期 picker 显示,X 按钮应**不可点**(无 hover/click 反应)。
2. **场景 AC**——找一个有 `nextMileage` 的零件行 → 点编辑 → 里程 input-number 显示,X 按钮应**不可点**。
3. **场景 AD**——找一个 date 为 null 的零件行 → 点编辑 → 日期列仍只显示 span(上一轮规则,本轮不变)。
4. **场景 AE**——找一个 mileage 为 null 的零件行 → 点编辑 → X 按钮可点(无内容可清,行为正常)。
5. **场景 AF**——点重置(权限允许时)→ 字段被填值 → 重新点编辑 → X 按钮应**禁用**(因为重置后字段非空)。

**任意场景失败**:停下来,排查后再继续;不要提交 Task 1 的 commit。

### Step 1.5: 提交 Task 1

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git add "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit -m "feat(NextTable): 已填字段编辑时禁用清空按钮"
```

预期输出:commit 成功,hash 不为空。

**注意**:lint-staged 会自动跑 eslint;若失败,按报错修复再重试 commit。

---

## Task 2: 集成冒烟测试与归档

**Files:** 无改动,只验证。

### Step 2.1: 跑完整 5 场景回归

将 Task 1 的 5 个场景(AB–AF)合并跑一遍,确认全部通过。

记录每个场景的验证结果。

### Step 2.2: 检查 git 历史与差异

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git log --oneline -3
git diff HEAD~1 -- "src/views/datacenter/vehicle/vehicleProfile/NextTable.vue"
```

**预期**:
- log 最近 1 条为 Task 1 的 commit
- diff 仅触及 `NextTable.vue` 的两处模板属性,无其他改动

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
  - §3.1 日期 picker 改动 → Step 1.1 ✓
  - §3.2 里程 input-number 改动 → Step 1.2 ✓
  - §3.3 不动部分 → Step 1.3 grep 校验 ✓
  - §4 边界场景 → Step 1.4 场景 AB–AF ✓

- **占位符扫描**:无 TBD / TODO / 留白代码块。

- **类型 / 方法名一致性**:
  - `originTableData` 在 data 中已定义(line 146),与 spec 一致 ✓
  - `rowIndex` 来自 `#default` slot 解构,在两个模板里都已可用 ✓
  - 4 个方法名(`saveRowEdit` / `cancelEdit` / `editRow` / `handleResetPart`)未改名 ✓
  - `:clearable` 是 Element UI 标准属性,模板语法正确 ✓