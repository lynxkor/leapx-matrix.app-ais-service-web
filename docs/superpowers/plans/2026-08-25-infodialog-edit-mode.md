# 车辆档案"调整保养信息"编辑模式 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `app-ais-aftersale-front` 的"调整保养信息"弹窗中,把整车下次保养时间/里程两个字段改为**默认禁用**的查看态,通过新增的「编辑」按钮进入编辑态后,再通过「保存」或「取消」按钮提交或回滚修改——移除当前 `@change` / `@blur` 触发的自动保存行为。

**Architecture:** 在 `InfoDialog/index.vue` 单一文件内完成。引入 `isEditing` 状态控制字段 `disabled` 与按钮 `v-if` 切换;沿用现有 `originalForm` 做"取消回滚"基线;`handleSave` 复用现有 `updateFlat` API;`beforeClose` 拦截编辑态下点 X / 遮罩关闭并触发 `$confirm` 二次确认。完全移除 `onFieldChange` 自动保存与 `pendingSave` 状态。

**Tech Stack:** Vue 2 + Element UI + `this.$confirm` + `this.$message` + `this.$refs.formRef.validate` (callback 风格)。

---

## 设计参考与基线

- **设计文档**:`docs/superpowers/specs/2026-08-25-infodialog-edit-mode-design.md`
- **现有参考实现**:
  - `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` (本次唯一改动文件)
  - `src/api/datacenter/vehicle/vehicleProfile/index.js` (`updateFlat`, line 71-73,不动)
  - `src/views/datacenter/vehicle/vehicleProfile/edit.vue` (父组件,本次不动)

## 文件结构总览

| 类别 | 路径 | 变更 |
|------|------|------|
| 弹窗 | `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` | 加 `isEditing` 状态 + 字段 `disabled` + 4 个按钮 + 4 个新方法 + `beforeClose` + 移除自动保存 |

## Commit 切分建议

| Commit | 任务 | 范围 |
|--------|------|------|
| `feat(InfoDialog): 整车保养信息改为查看/编辑双态,显式保存` | Task 1 | 新增 `isEditing` 状态 + 字段禁用 + 4 个按钮 + `enterEdit` / `handleCancel` / `handleSave` + `onClose` 重置 |
| `feat(InfoDialog): 编辑态关闭二次确认,移除自动保存` | Task 2 | `beforeClose` + `:before-close` + 移除 `onFieldChange` 与 `pendingSave` |
| `chore(verify): 本地启动完成冒烟测试` | Task 3 | 浏览器人工验证 |

---

## 全局约束

- 缩进 2 空格,语句加 `;`,函数括号前后空格,文件末尾保留换行符。
- 样式变量:`@/libs/assets/style/variables.scss`;BEM 命名;主题色 `var(--leap-color-primary)`。
- 组件优先级:`@/libs/components` > element-ui;API 调用统一 `api.jsonPost`(本次不新增 API)。
- 不引入新依赖,不修改 `package.json`。
- **本计划不编写自动化测试**。本仓库对 Vue 组件无单测基建,验证方式为 `lint-staged`(commit 时自动跑 eslint)+ 本地浏览器冒烟测试。`lint-staged` 会阻断含 eslint error 的 commit。
- el-form `validate` 使用项目里现有的 callback 风格:`validate((valid) => { ... })`,需要 `async/await` 时用 `new Promise` 包一层。
- `updateFlat` API 入参/返回以 `src/api/datacenter/vehicle/vehicleProfile/index.js:71-73` 为准,本次不动。

---

## Task 1: 引入编辑模式 + 4 个方法

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue`

### Step 1.1: 在 `data()` 中新增 `isEditing` 字段

**位置**:`src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue`,`data()` 函数返回值(`saving` 与 `resettingVehicle` 之间)

**现状** (line 113-115):

```javascript
      saving: false,
      pendingSave: false,
      resettingVehicle: false,
```

**改为**:

```javascript
      saving: false,
      resettingVehicle: false,
      isEditing: false,
```

**校验**:保存文件后,该处只剩三行,saving / resettingVehicle / isEditing。

### Step 1.2: 模板里给两个字段加 `:disabled` 并移除 `@change`

**位置**:同一文件 `<template>` 段(line 11-32),整段替换为:

```vue
      <el-form-item label="下次保养时间：" prop="nextMaintainDate">
        <el-date-picker
          v-model="form.nextMaintainDate"
          type="datetime"
          :disabled="!isEditing"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="下次保养里程：" prop="nextMaintainMileages">
        <div style="display: flex; align-items: center; width: 100%;">
          <el-input-number
            v-model="form.nextMaintainMileages"
            placeholder="请输入"
            :disabled="!isEditing"
            maxlength="20"
            precision="2"
            min="0"
            :controls="false"
            style="flex: 1; min-width: 0;"
          />
          <el-button
            v-if="!isEditing"
            size="small"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="enterEdit"
          >编辑</el-button>
          <el-button
            v-if="!isEditing && canResetVehicle"
            size="small"
            type="success"
            :loading="resettingVehicle"
            :disabled="saving"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="handleResetVehicle"
          >重置</el-button>
          <el-button
            v-if="isEditing"
            size="small"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="handleCancel"
          >取消</el-button>
          <el-button
            v-if="isEditing"
            size="small"
            type="primary"
            :loading="saving"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="handleSave"
          >保存</el-button>
        </div>
      </el-form-item>
```

**注意**:
- 两个控件的 `@change="onFieldChange"` **整段删除**(原代码 line 16 与 line 30)。
- 「编辑」按钮始终显示(无 `canResetVehicle` 限制,按设计文档 §5.1)。
- 「重置」按钮仅在查看态显示,且仍受 `canResetVehicle` 控制。
- 「保存」/「取消」仅在编辑态显示。
- 按钮之间顺序固定为:[编辑] [重置] / [取消] [保存],按设计文档 §5.1。

### Step 1.3: 新增 `enterEdit` / `handleCancel` 方法

**位置**:同一文件 `methods` 段,**紧接 `handleResetVehicle` 的 `onClose` 之前**(line 173 之前)

在现有 `handleResetVehicle` 方法的 `}` 闭合(line 172)与 `onClose () {` 之间插入:

```javascript
    enterEdit () {
      this.isEditing = true;
    },
    handleCancel () {
      this.form = { ...this.originalForm };
      this.isEditing = false;
      this.$nextTick(() => {
        if (this.$refs.formRef) this.$refs.formRef.clearValidate();
      });
    },
```

### Step 1.4: 新增 `handleSave` 方法

**位置**:同一文件 `methods` 段,**紧接 `handleCancel` 之后**

在 Step 1.3 插入的 `handleCancel` 闭合 `},` 之后,插入:

```javascript
    async handleSave () {
      if (this.saving) return;
      // 项目里 el-form.validate 使用 callback 风格,包一层 Promise 便于 async/await
      const valid = await new Promise(resolve => {
        this.$refs.formRef.validate((ok) => resolve(ok));
      });
      if (!valid) return;
      if (this.isNoChange()) {
        // 无变更:直接退出编辑态,不调接口
        this.isEditing = false;
        return;
      }
      this.saving = true;
      try {
        const sentDate = this.normalizeDate(this.form.nextMaintainDate);
        const sentMileages = this.normalizeMileages(this.form.nextMaintainMileages);
        await updateFlat({
          id: this.vehicleProfileId,
          nextMaintainDate: sentDate,
          nextMaintainDateSetNull: !sentDate,
          nextMaintainMileages: sentMileages,
          nextMaintainMileagesSetNull: !sentMileages,
        });
        this.$message.success('保存成功');
        this.syncOriginalForm(sentDate, sentMileages);
        this.isEditing = false;
        this.$emit('update');
      } catch (e) {
        // axios 拦截器已统一处理错误 toast;此处不需额外处理,保留编辑态供用户重试
      } finally {
        this.saving = false;
      }
    },
```

### Step 1.5: 修改 `onClose` 重置 `isEditing`

**位置**:`onClose () {` 方法(line 173-175)

**现状**:

```javascript
    onClose () {
      this.dialogVisible = false;
    },
```

**改为**:

```javascript
    onClose () {
      this.dialogVisible = false;
      this.isEditing = false;
    },
```

**作用**:防止下次打开弹窗时,上一次编辑态残留。

### Step 1.6: 启动本地 dev server 验证 Task 1

**命令**:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
npm run local
```

**人工验证步骤**:

1. 浏览器打开车辆档案 → 进入任一车辆详情 → 找到"调整保养信息"弹窗入口,打开。
2. **场景 A**——打开时:两个字段应**禁用**(灰色不可点);里程输入框后显示 **[编辑]** 和 **[重置]**(若有 `canResetVehicle` 权限)。
3. **场景 B**——点 **[编辑]**:两个字段变为可编辑;按钮切换为 **[取消]** 和 **[保存]**;[编辑] 与 [重置] 消失。
4. **场景 C**——修改里程值后点 **[保存]**:弹"保存成功"toast,字段重新禁用,按钮回到 [编辑] [重置]。
5. **场景 D**——点 [编辑] → 修改值 → 点 [取消]:字段值恢复到打开时的值,按钮回到 [编辑] [重置]。
6. **场景 E**——点 [编辑] → 不修改 → 点 [保存]:直接退出编辑态,无 toast(因 `isNoChange` 返回 true)。
7. **场景 F**——点 [编辑] → 输入非数字(若 el-input-number 允许绕过)→ 点 [保存]:保留编辑态,字段红框提示。
8. **场景 G**——故意改坏后端地址使保存失败:保留编辑态,弹错误 toast,可重试。

**任意场景失败**:停下来,排查后再继续;不要提交 Task 1 的 commit。

### Step 1.7: 提交 Task 1

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git add "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit -m "feat(InfoDialog): 整车保养信息改为查看/编辑双态,显式保存"
```

预期输出:commit 成功,hash 不为空。

**注意**:lint-staged 会自动跑 eslint;若失败,按报错修复再重试 commit。

---

## Task 2: 关闭确认 + 移除自动保存

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue`

### Step 2.1: 在 el-dialog 上加 `:before-close` 并移除 `:close-on-click-modal`

**位置**:同一文件 `<template>` 段(line 2-8),整段替换为:

```vue
  <el-dialog
    title="调整保养信息"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="beforeClose"
    @close="onClose"
  >
```

**注意**:`:close-on-click-modal="false"` **整行删除**(line 6),由 `beforeClose` 统一拦截。

### Step 2.2: 新增 `beforeClose` 方法

**位置**:同一文件 `methods` 段,**紧接 `onClose` 之后**

在 `onClose` 闭合 `},` 之后,插入:

```javascript
    beforeClose (done) {
      if (!this.isEditing) {
        done();
        return;
      }
      if (this.isNoChange()) {
        // 编辑态但无修改:直接关闭,不打扰
        done();
        return;
      }
      this.$confirm('当前有未保存的修改,确定关闭吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        done();
      }).catch(() => {
        // 用户选「取消」,留在对话框
      });
    },
```

### Step 2.3: 删除 `onFieldChange` 方法

**位置**:同一文件 `methods` 段,**删除整个 `onFieldChange` 方法**(原 line 176-207,共 32 行)

**删除范围**:从 `    onFieldChange () {` 起,到其闭合 `    },` 为止(含与上方 `onClose` 之间的换行)。

**删除后**,methods 顺序应为:

```
handleResetVehicle
enterEdit
handleCancel
handleSave
onClose
beforeClose
isNoChange
normalizeDate
normalizeMileages
syncOriginalForm
```

`onFieldChange` 已不存在。

### Step 2.4: 校验 `pendingSave` 已被 Task 1 Step 1.1 移除

在文件内 grep `pendingSave`:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
grep -n "pendingSave" "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
```

预期:**无输出**(若 Step 1.1 正确执行)。

### Step 2.5: 启动本地 dev server 验证 Task 2

**人工验证步骤**:

1. **场景 H**——查看态点 X / 遮罩关闭:直接关闭,无确认提示。
2. **场景 I**——编辑态不修改点 X / 遮罩关闭:直接关闭,无确认提示(`isNoChange` 命中)。
3. **场景 J**——编辑态修改后点 X:弹确认提示「当前有未保存的修改,确定关闭吗?」;选「取消」留在对话框且编辑态保留;选「确定」关闭。
4. **场景 K**——编辑态修改后点遮罩关闭:同场景 J。
5. **场景 L**——打开弹窗 → 不操作 → 关闭 → 再次打开:字段值恢复为最新数据,且为查看态(`isEditing = false`)。

**任意场景失败**:停下来,排查后再继续。

### Step 2.6: 提交 Task 2

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git add "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit -m "feat(InfoDialog): 编辑态关闭二次确认,移除自动保存"
```

预期输出:commit 成功,hash 不为空。

---

## Task 3: 集成冒烟测试与归档

**Files:** 无改动,只验证。

### Step 3.1: 跑完整 12 场景回归

将 Task 1 (场景 A–G) 与 Task 2 (场景 H–L) 合并跑一遍,确认 12 个场景全部通过。

记录每个场景的验证结果(纸笔或临时文件均可)。

### Step 3.2: 检查 git 历史与差异

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git log --oneline -5
git diff HEAD~2 -- "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue" | head -200
```

**预期**:
- log 最近 2 条为 Task 1 与 Task 2 的 commit。
- diff 仅触及 `InfoDialog/index.vue`,无其他文件改动。

### Step 3.3: 提交验证记录(可选)

如需在 git 中留痕,可:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit --allow-empty -m "chore(verify): 12 个场景冒烟测试通过"
```

否则跳过本步,直接报告完成。

---

## 自审记录(写计划时复核)

- **spec 覆盖**:
  - §5.1 模板 → Task 1 Step 1.2 ✅
  - §5.2 data 状态 → Task 1 Step 1.1 ✅
  - §5.2 `enterEdit` → Task 1 Step 1.3 ✅
  - §5.2 `handleCancel` → Task 1 Step 1.3 ✅
  - §5.2 `handleSave` → Task 1 Step 1.4 ✅
  - §5.2 `beforeClose` → Task 2 Step 2.2 ✅
  - §5.2 `onClose` 重置 `isEditing` → Task 1 Step 1.5 ✅
  - §5.2 移除 `onFieldChange` → Task 2 Step 2.3 ✅
  - §5.2 移除 `pendingSave` → Task 1 Step 1.1 + Task 2 Step 2.4 校验 ✅
  - §5.1 el-dialog `before-close` + 移除 `close-on-click-modal` → Task 2 Step 2.1 ✅
  - §6 边界场景 → Task 1 Step 1.6 + Task 2 Step 2.5 ✅

- **占位符扫描**:无 TBD / TODO / "类似 Task N" / 留白代码块。

- **类型一致性**:
  - `isEditing` 在 data / 模板 / methods 中引用一致。
  - `originalForm`、`isNoChange`、`normalizeDate`、`normalizeMileages`、`syncOriginalForm` 均沿用现有,未改名。
  - `enterEdit` / `handleCancel` / `handleSave` / `beforeClose` 在模板 `@click`/`@before-close` 与 methods 中名字一致。
  - 模板中所有按钮的 `v-if` 条件与设计文档 §5.1 一致。