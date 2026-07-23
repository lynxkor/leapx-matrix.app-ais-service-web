# 自定义视图增加排序功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在已有的 `CustomQueryDialog` 中增加"排序"配置(单字段 + 升/降),作为视图(preset)的一部分持久化到 localStorage;选中视图时同步恢复排序;禁用列表表格列头点选排序。

**Architecture:** 三处改动协同工作。`presetStore.js` 增 `sort` 字段(preset 级 camelCase)+ 新 `updatePreset(id, patch)` 统一更新入口;`fieldMeta.js` 抽 `toSnakeCase(field)` 工具(供视图恢复排序与表头回写共用);`CustomQueryDialog/index.vue` 加排序 UI 区与 `workingSort` 状态机,沿用现有 `errorSummary` 汇合校验;`warrantyapply/index.vue` 三处钩入(`onDropdownCommand`、`onPresetChange`、`onApply`)同步 `this.sortColumns`,并在 `dataProp` 每列加 `sortable: false`。

**Tech Stack:** Vue 2.6 + Element UI + localStorage(无新依赖、无测试基建)。验证方式:ESLint + dev server + 浏览器手测。

---

## 文件结构

```
src/views/claimreturn/claim/warrantyapply/
├── index.vue                                                       ← 改动(排序同步 + 表头禁用)
└── components/
    └── CustomQueryDialog/
        ├── presetStore.js                                          ← 改动(sort 字段 + updatePreset)
        ├── fieldMeta.js                                            ← 改动(新增 toSnakeCase)
        └── index.vue                                               ← 改动(排序 UI + workingSort 生命周期)
```

无新增文件;改动全部落在已有 4 个文件。

---

## Task 1: `fieldMeta.js` 新增 `toSnakeCase` 工具

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/fieldMeta.js`

- [ ] **Step 1: 在 `cloneTree` 之后追加 `toSnakeCase` 导出**

打开 `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/fieldMeta.js`,在文件最末尾(`export function cloneTree (tree) { ... }` 之后)新增:

```js
// 工具:camelCase → snake_case (createTime → create_time)
export function toSnakeCase (field) {
  if (!field) return '';
  return field.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}
```

- [ ] **Step 2: 验证导出一致**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/fieldMeta.js 2>&1 | tail -10
```

预期: 无 error 输出。

- [ ] **Step 3: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/fieldMeta.js
git commit -m "feat(warrantyapply): 自定义视图排序 — 新增 toSnakeCase 工具"
```

---

## Task 2: `presetStore.js` 新增 `sort` 字段与 `updatePreset`

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/presetStore.js`

- [ ] **Step 1: 修改 `addPreset` 接受 `sort` 参数**

将 `addPreset` 改造为:

```js
export function addPreset (name, tree, sort) {
  const list = loadPresets();
  const preset = {
    id: genId(),
    name,
    tree: JSON.parse(JSON.stringify(tree)),
    sort: sort ? { ...sort } : null,
    createdAt: new Date().toISOString(),
    perfStatus: PERF_STATUS.PENDING,
    perfDurationMs: null,
    perfTestedAt: null
  };
  list.push(preset);
  persist(list);
  return preset;
}
```

- [ ] **Step 2: 新增 `updatePreset` 通用更新函数**

在 `updatePresetTree` 之后、`setPresetPerfStatus` 之前,新增:

```js
/**
 * 通用更新入口:同时支持 tree、sort 等字段。
 * patch 中省略的字段保持不变;传 null 表示显式置空。
 */
export function updatePreset (id, patch) {
  const list = loadPresets();
  const item = list.find(p => p.id === id);
  if (item) {
    if ('tree' in patch) item.tree = JSON.parse(JSON.stringify(patch.tree));
    if ('sort' in patch) item.sort = patch.sort ? { ...patch.sort } : null;
    item.updatedAt = new Date().toISOString();
    // 编辑条件/排序后视为待重新测试
    item.perfStatus = PERF_STATUS.PENDING;
    persist(list);
  }
  return list;
}
```

- [ ] **Step 3: 让 `loadPresets` 兼容老数据(无 sort 字段的 preset)**

`loadPresets` 末尾(`return Array.isArray(list) ? list : [];` 之后)新增兜底:

```js
  return (Array.isArray(list) ? list : []).map(p => ({
    sort: null,
    ...p
  }));
```

说明:`...p` 在后,会覆盖 `sort: null` 默认值;老数据没有 sort 字段 → 保留 undefined;新数据有 sort → 保留真实值。这是读时迁移,不污染写回。

- [ ] **Step 4: 验证语法**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/presetStore.js 2>&1 | tail -10
```

预期: 无 error 输出。

- [ ] **Step 5: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/presetStore.js
git commit -m "feat(warrantyapply): 自定义视图排序 — preset 增 sort 字段 + updatePreset"
```

---

## Task 3: `CustomQueryDialog/index.vue` 增加 `workingSort` 状态与初始化

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue`

- [ ] **Step 1: 在 `data()` 中新增 `workingSort`**

将 `data ()` 改造为:

```js
  data () {
    return {
      dialogVisible: this.visible,
      workingTree: this.makeInitialTree(),
      workingSort: this.makeInitialSort(),
      errorSummary: [],
      presets: [],
      selectedPresetId: null,
      perfTesting: false
    };
  },
```

- [ ] **Step 2: 新增 `makeInitialSort` 方法**

在 `methods.makeInitialTree` 之后,新增:

```js
    makeInitialSort () {
      // 当前没有"已应用排序"概念,自定义模式默认空
      return { field: null, order: null };
    },
```

- [ ] **Step 3: 修改 `watch.visible`,打开弹窗时根据模式初始化 `workingSort`**

将现有 `watch.visible` 块改造为:

```js
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.workingTree = this.makeInitialTree();
        this.workingSort = this.makeInitialSort();
        this.errorSummary = [];
        this.presets = loadPresets();
        // editingPresetId 优先(编辑指定视图的场景)
        // 其次回退到 activePresetId(打开弹窗查看当前激活视图)
        this.selectedPresetId = this.editingPresetId || this.activePresetId || null;
        if (this.selectedPreset) {
          this.workingTree = cloneTree(this.selectedPreset.tree);
          this.workingSort = this.selectedPreset.sort
            ? { ...this.selectedPreset.sort }
            : this.makeInitialSort();
        }
      }
    },
```

- [ ] **Step 4: 修改 `watch.activePresetId`,清空时同步重置 `workingSort`**

将现有 `watch.activePresetId` 块改造为:

```js
    activePresetId (val) {
      // 父组件主动清除(例如点"清除方案"),同步到弹窗
      this.selectedPresetId = val || null;
      if (!val && this.dialogVisible) {
        this.workingTree = this.makeInitialTree();
        this.workingSort = this.makeInitialSort();
      }
    }
```

- [ ] **Step 5: 验证 ESLint**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue 2>&1 | tail -20
```

预期: 无 error(可能有 warning,关于未使用 `workingSort` 的 — 后续 task 用到即可消失)。

- [ ] **Step 6: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue
git commit -m "feat(warrantyapply): 自定义视图排序 — 弹窗 workingSort 状态与初始化"
```

---

## Task 4: `CustomQueryDialog/index.vue` 排序 UI 渲染

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue`

- [ ] **Step 1: 在条件树之后插入排序 UI 区块**

找到 `<custom-condition-group>` 标签(约第 79 行),在其 `</custom-condition-group>` 闭合之后、`<div class="c-cqd">` 闭合之前,插入:

```vue
      <!-- 排序(单字段 + 升/降) -->
      <div class="c-cqd__sort">
        <div class="c-cqd__sort-title">排序</div>
        <div class="c-cqd__sort-row">
          <el-select
            v-model="workingSort.field"
            placeholder="选择排序字段"
            size="small"
            filterable
            clearable
            class="c-cqd__sort-field"
          >
            <el-option
              v-for="f in fields"
              :key="f.key"
              :value="f.key"
              :label="f.label"
            />
          </el-select>
          <el-radio-group v-model="workingSort.order" size="small" :disabled="!workingSort.field">
            <el-radio-button label="asc">升序</el-radio-button>
            <el-radio-button label="desc">降序</el-radio-button>
          </el-radio-group>
        </div>
        <div class="c-cqd__sort-hint">不选字段则按后端默认排序</div>
      </div>
```

- [ ] **Step 2: 在 `<style>` 块底部追加排序区样式**

在 `</style>` 闭合前(`<style lang="scss" scoped>` 块的 `.dialog-footer` 规则之后)新增:

```scss
  &__sort {
    margin-top: 12px;
    padding: 8px 10px;
    background: #f5f7fa;
    border-radius: 4px;
  }
  &__sort-title {
    color: #606266;
    font-size: 13px;
    margin-bottom: 6px;
  }
  &__sort-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }
  &__sort-field {
    width: 240px;
  }
  &__sort-hint {
    color: #909399;
    font-size: 12px;
  }
```

- [ ] **Step 3: 验证 ESLint + 模板语法**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue 2>&1 | tail -20
```

预期: 无 error。

- [ ] **Step 4: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue
git commit -m "feat(warrantyapply): 自定义视图排序 — 弹窗排序 UI 区"
```

---

## Task 5: `CustomQueryDialog/index.vue` 排序校验与生命周期

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue`

- [ ] **Step 1: 在 `validateTree` 之后新增 `validateSort`**

```js
    /**
     * 排序校验:返回 { valid, summary }
     * 规则:选了字段就必须选 order;两者皆空视为"不指定排序",合法。
     */
    validateSort () {
      const summary = [];
      if (this.workingSort.field && !this.workingSort.order) {
        summary.push('排序:请选择顺序');
      }
      return { valid: summary.length === 0, summary };
    },
```

- [ ] **Step 2: 修改 `onApply`,应用时同时校验条件和排序,emit 也带上 sort**

将 `onApply` 改造为:

```js
    onApply () {
      const treeResult = this.validateTree(this.workingTree);
      const sortResult = this.validateSort();
      const summary = [...treeResult.summary, ...sortResult.summary];
      if (summary.length > 0) {
        this.errorSummary = summary;
        return;
      }
      this.errorSummary = [];
      // 选中预设:把改动写回预设(tree + sort 一起)
      if (this.selectedPresetId) {
        this.presets = updatePreset(this.selectedPresetId, {
          tree: this.workingTree,
          sort: this.workingSort.field
            ? { field: this.workingSort.field, order: this.workingSort.order }
            : null
        });
      }
      this.$emit('input', cloneTree(this.workingTree));
      this.$emit('update:sort', this.workingSort.field
        ? { field: this.workingSort.field, order: this.workingSort.order }
        : null);
      const tipExtra = this.workingSort.field ? `,排序:${this.workingSort.field} ${this.workingSort.order}` : '';
      this.$message.success(`已应用 ${this.countNodes(this.workingTree)} 个自定义条件${tipExtra}`);
      this.$emit('update:visible', false);
    },
```

- [ ] **Step 3: 修改 `onSavePreset`,保存时带上 sort**

将 `onSavePreset` 中调用 `addPreset` 的语句改为:

```js
        const preset = addPreset(name, this.workingTree, this.workingSort.field
          ? { field: this.workingSort.field, order: this.workingSort.order }
          : null);
```

- [ ] **Step 4: 修改 `onClear`、`onDeletePreset`、`onPresetChange`,重置排序**

`onPresetChange` 中,id 为空时(切回自定义模式)的分支改为:

```js
      if (!id) {
        // 切回自定义模式:重置为空
        this.workingTree = {
          logic: 'AND',
          conditions: [createEmptyRow()]
        };
        this.workingSort = this.makeInitialSort();
        this.$emit('update:active-preset-id', null);
        return;
      }
```

`onPresetChange` 中,找到预设后的分支改为:

```js
      const preset = this.presets.find(p => p.id === id);
      if (preset) {
        this.workingTree = cloneTree(preset.tree);
        this.workingSort = preset.sort ? { ...preset.sort } : this.makeInitialSort();
        this.$emit('update:active-preset-id', id);
      }
```

`onDeletePreset` 中,确认成功后的回调内,`this.workingTree = { ... }` 之后追加一行:

```js
        this.workingSort = this.makeInitialSort();
```

`onClear` 中,确认成功后的回调内,`this.workingTree = { ... }` 之后追加一行:

```js
        this.workingSort = this.makeInitialSort();
```

- [ ] **Step 5: 修改 imports,把 `updatePresetTree` 改为 `updatePreset`**

将 import 块中:

```js
import {
  loadPresets,
  addPreset,
  renamePreset,
  deletePreset,
  updatePresetTree,
  setPresetPerfStatus,
  PERF_STATUS,
  PERF_THRESHOLD_MS
} from './presetStore';
```

改为:

```js
import {
  loadPresets,
  addPreset,
  renamePreset,
  deletePreset,
  updatePreset,
  setPresetPerfStatus,
  PERF_STATUS,
  PERF_THRESHOLD_MS
} from './presetStore';
```

(注意:`updatePresetTree` 仍在 presetStore 导出,但弹窗不再调用 — 留给其他潜在调用方,或者后续清理。本期不删。)

- [ ] **Step 6: 验证 ESLint**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue 2>&1 | tail -20
```

预期: 无 error。

- [ ] **Step 7: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue
git commit -m "feat(warrantyapply): 自定义视图排序 — 校验、应用、保存与生命周期"
```

---

## Task 6: `warrantyapply/index.vue` 接收 sort 事件

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/index.vue`

- [ ] **Step 1: 在 `<CustomQueryDialog>` 标签上加 `@update:sort` 监听**

找到 `<CustomQueryDialog>` 标签(约第 336 行),改为:

```vue
    <CustomQueryDialog
      :visible.sync="customDialogVisible"
      v-model="appliedCustomConditions"
      v-model:active-preset-id="activePresetId"
      :editing-preset-id="editingPresetId"
      @update:sort="onApplySort"
      @update:editing-preset-id="editingPresetId = $event"
    />
```

- [ ] **Step 2: 新增 `onApplySort` 方法**

在 `methods` 块内(`onDropdownCommand` 之前)新增:

```js
    onApplySort (sort) {
      // 弹窗保存/应用排序时,同步到 sortColumns 并重查
      this.sortColumns = sort
        ? [{ column: toSnakeCase(sort.field), sort: sort.order.toUpperCase() }]
        : [];
      this.getData();
    },
```

- [ ] **Step 3: 新增 `import toSnakeCase`**

在 `import { cloneTree } from './components/CustomQueryDialog/fieldMeta';` 之后追加:

```js
import { cloneTree, toSnakeCase } from './components/CustomQueryDialog/fieldMeta';
```

(把前一行 `cloneTree` 改成 `cloneTree, toSnakeCase`,并删除单行的 `cloneTree` import。)

- [ ] **Step 4: 验证 ESLint**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/index.vue 2>&1 | tail -20
```

预期: 无 error。

- [ ] **Step 5: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/index.vue
git commit -m "feat(warrantyapply): 自定义视图排序 — 接收弹窗 update:sort 事件"
```

---

## Task 7: `warrantyapply/index.vue` 选中下拉视图时同步排序

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/index.vue`

- [ ] **Step 1: 修改 `onDropdownCommand` 选中已有视图分支**

在 `onDropdownCommand` 中,`// 选中已有视图:锁定表单,使用该视图的条件` 注释之后、`this.activePresetId = preset.id;` 之前,找到 `if (preset.perfStatus !== PERF_STATUS.PASSED)` 的整段。改为:

```js
      this.activePresetId = preset.id;
      this.appliedCustomConditions = cloneTree(preset.tree);
      // 同步排序(视图里有 sort 就用,没有就清空走后端默认)
      this.sortColumns = preset.sort
        ? [{ column: toSnakeCase(preset.sort.field), sort: preset.sort.order.toUpperCase() }]
        : [];
      this.$message.success(`已使用视图「${preset.name}」,表单已锁定`);
```

(把"性能测试未通过"的提前 return 保留 — 整段 if 块要在 `this.$message.warning(...)` + `return;` 处提前 return,然后才是上面这段。)

- [ ] **Step 2: 验证 ESLint**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/index.vue 2>&1 | tail -20
```

预期: 无 error。

- [ ] **Step 3: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/index.vue
git commit -m "feat(warrantyapply): 自定义视图排序 — 下拉选中视图时同步 sortColumns"
```

---

## Task 8: `warrantyapply/index.vue` 重置/清除时清空排序

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/index.vue`

- [ ] **Step 1: 修改 `onReset`**

在 `onReset ()` 方法体内,`this.form = { ...defaultForm, createTime: getDefaultCreateTime() };` 之后追加一行:

```js
      this.sortColumns = [];
```

- [ ] **Step 2: 修改 `handleClearPreset`**

在 `handleClearPreset ()` 方法体内,`this.appliedCustomConditions = null;` 之后追加一行:

```js
      this.sortColumns = [];
```

- [ ] **Step 3: 验证 ESLint**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/index.vue 2>&1 | tail -20
```

预期: 无 error。

- [ ] **Step 4: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/index.vue
git commit -m "feat(warrantyapply): 自定义视图排序 — 重置/清除视图时清空 sortColumns"
```

---

## Task 9: `warrantyapply/index.vue` 禁用表格列头排序

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/index.vue`

- [ ] **Step 1: 修改 `optionObj` dataProp 模板,给每列加 `sortable: false`**

找到 `optionObj () { return { ... dataProp: [ ... ] ... } }`(约第 564 行)。

把 `dataProp: [` 替换为:

```js
        dataProp: this.tableColumns.map(c => ({ sortable: false, ...c })),
```

并在 `data()` 里新增:

```js
      tableColumns: [
        { props: 'alarmLevelLabel', label: '三包预警', visible: true, width: 200 },
        { props: 'applyNo', label: '保修申请单', visible: true, width: 200, buttons: [...] },
        ...
      ],
```

(把现有 `dataProp: [...]` 的字面量整体抽到 `data()` 的 `tableColumns`,然后用 `.map(c => ({ sortable: false, ...c }))` 注入 sortable。)

为简化,可分两步:

- [ ] **Step 1a: 在 `data()` 中新增 `tableColumns` 数组**

把现有 `dataProp: [ ... ]` 中的对象数组(从 `{ props: 'alarmLevelLabel', ... }` 到 `{ props: 'operate', ... }`)整体抽出来,作为 `data () { return { ..., tableColumns: [ ... ] } }` 的一个新字段。**注意:移出后,`buttons` 内回调函数里的 `this` 绑定仍由 `optionObj` 计算属性提供,这一点不变。**

- [ ] **Step 1b: 替换 `dataProp` 为 `this.tableColumns.map(...)`**

将 `dataProp: [` 整段替换为:

```js
        dataProp: this.tableColumns.map(c => ({ sortable: false, ...c })),
```

- [ ] **Step 2: 验证 ESLint**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/index.vue 2>&1 | tail -20
```

预期: 无 error。

- [ ] **Step 3: 启动 dev server 做冒烟**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && timeout 90 npm run local &
sleep 75
curl -s http://localhost:7779 -o /dev/null -w "%{http_code}\n"
jobs -p | xargs -r kill
```

预期: 200。

- [ ] **Step 4: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/index.vue
git commit -m "feat(warrantyapply): 自定义视图排序 — 禁用表格列头点选"
```

---

## Task 10: 端到端手动验证

**Files:** 无改动(纯验证)。

- [ ] **Step 1: 启动 dev server**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npm run local
```

打开浏览器进入 `/claimreturn/claim/warrantyApply`。

- [ ] **Step 2: 验证排序 UI 渲染**

打开"自定义条件查询"弹窗(或点击顶部视图下拉 → "新增视图")。预期:
- 条件树下方出现「排序」区块
- 有字段下拉(列出 70+ 字段)、升/降 radio(默认禁用)
- 提示文字「不选字段则按后端默认排序」可见

关闭弹窗。

- [ ] **Step 3: 验证"保存视图"包含排序**

打开弹窗 → 配 1 个条件(如 `VIN 包含 LV001`) → 排序选 `创建时间` + `降序` → 点「保存为视图」→ 输入名 `测试排序视图`。

预期:
- toast: "已保存视图"
- 顶部视图下拉出现 `测试排序视图`

- [ ] **Step 4: 验证视图选中后排序恢复**

关闭弹窗。在顶部视图下拉里选 `测试排序视图`。预期:
- toast: "已使用视图「测试排序视图」,表单已锁定"
- 表单 disabled
- 浏览器 DevTools → Network → 触发下一次查询时,请求体包含 `sortColumns: [{column: "create_time", sort: "DESC"}]`

- [ ] **Step 5: 验证视图编辑路径**

在视图下拉里点 `测试排序视图` 行内的编辑图标。预期:
- 弹窗打开,定位到该视图
- 排序字段已自动填 `创建时间`,顺序已选 `降序`

把顺序改为 `升序`,点「保存」。预期:
- toast 包含 "排序:createTime asc"
- 关闭弹窗
- 下次请求 `sortColumns` 为 `[{column: "create_time", sort: "ASC"}]`

- [ ] **Step 6: 验证空排序保存**

新建视图(下拉 → 新增视图) → 只配条件,不配排序 → 保存为 `无排序视图`。

预期:
- 保存成功
- 选中该视图 → 请求体 `sortColumns = []`(不出现 sortColumns 字段)

- [ ] **Step 7: 验证视图间切换**

依次选 `测试排序视图`(有排序)→ `无排序视图`(无排序)→ 默认视图。预期:
- 每次切换都有 toast
- `sortColumns` 跟随切换(有 / 空 / 空)

- [ ] **Step 8: 验证重置/清除**

选中 `测试排序视图` → 搜索区点「重置」。预期:
- 表单恢复默认,custom 徽标清空
- `sortColumns = []`

选中 `测试排序视图` → 顶部视图下拉里点 `清除方案`(close 图标)。预期:
- 切回默认视图,排序清空

- [ ] **Step 9: 验证校验**

打开弹窗 → 排序选 `创建时间`,但保留升/降不点 → 点「保存」。预期:
- 顶部红色 alert 出现:`排序:请选择顺序`
- 弹窗不关闭

清空排序字段 → 点「保存」。预期:正常关闭,无错误。

- [ ] **Step 10: 验证表头不可点**

观察表格列头。预期:
- 列头无排序箭头(因 `sortable: false`)
- 即便有,鼠标点击也不响应
- 列头无排序高亮

- [ ] **Step 11: 验证老数据兼容**

打开 DevTools → Application → Local Storage → `WARRANTY_CUSTOM_QUERY_PRESETS`。手动插入一条老格式数据(无 `sort` 字段):

```json
{"id":"p_legacy","name":"老视图","tree":{"logic":"AND","conditions":[...]},"createdAt":"2026-01-01T00:00:00.000Z","perfStatus":"passed","perfDurationMs":1200,"perfTestedAt":"2026-01-01T00:00:00.000Z"}
```

刷新页面。选中 `老视图`。预期:
- 弹窗打开,排序区为空(field/order 都 null)
- 不报任何错
- 选中后 `sortColumns = []`

清理这条测试数据。

- [ ] **Step 12: 验证清空/删除视图重置排序**

打开弹窗,配条件 + 排序 → 点「清空」→ 确认。预期:条件和排序都重置。

选中某视图 → 编辑配条件 + 排序 → 切到"自定义编辑"(不选视图) → 切回该视图。预期:排序恢复。

切回视图后,点「删除视图」→ 确认。预期:视图消失,排序清空。

- [ ] **Step 13: 回归检查**

确认下列未受影响:
- 搜索条件(20+ 固定条件)输入/重置
- Tab 切换(全部 / 保修经理 / 总经理)
- 分页、导出、批量操作(撤回/驳回/同意/作废)
- 「性能测试」按钮仍能跑,会更新 `perfStatus`(因编辑后会被重置为 PENDING)

- [ ] **Step 14: 关闭 dev server**

Ctrl+C 关闭 `npm run local`。

---

## 自审

### Spec 覆盖

| Spec 章节 | 任务 |
|----------|------|
| §1 数据模型 — preset 增 `sort` 字段 | Task 2 (Step 1, `addPreset`) |
| §1 `updatePreset(id, patch)` 通用更新 | Task 2 (Step 2) |
| §1 老数据兼容(无 sort 字段) | Task 2 (Step 3) |
| §2 弹窗 UI 排序区(单字段 + 升降序) | Task 4 |
| §2 `workingSort` 状态机 | Task 3 (Step 1-2)、Task 5 (Step 4) |
| §2 `watch.visible` 打开时按 preset 初始化 | Task 3 (Step 3) |
| §2 `watch.activePresetId` 清空时重置 | Task 3 (Step 4) |
| §2 校验:字段有值但顺序未选 → errorSummary | Task 5 (Step 1) |
| §2 `onApply` 校验 + 应用 + emit | Task 5 (Step 2) |
| §2 `onSavePreset` 带 sort | Task 5 (Step 3) |
| §2 `onClear`/`onDeletePreset`/`onPresetChange` 重置 | Task 5 (Step 4) |
| §2 引入 `updatePreset` 替换 `updatePresetTree` | Task 5 (Step 5) |
| §3.1 选中预设同步 `sortColumns`(下拉路径) | Task 7 |
| §3.1 `toSnakeCase` 工具 + 共用 | Task 1 |
| §3.1 弹窗保存时通过 `update:sort` 同步 | Task 6 |
| §3.2 禁用表头排序(`sortable: false`) | Task 9 |
| §3.3 `onReset` / `handleClearPreset` 清空 sortColumns | Task 8 |
| §3.4 表头图标不同步(已知风险,降级方案) | 接受降级,无代码改动 |
| §4 验证(8 条测试场景) | Task 10 (Step 2-13) |
| YAGNI(无多字段、无黑名单、不拆存储) | 全部任务未越界 |

### 占位符扫描

无 `TBD` / `TODO` / "implement later" / "fill in details" / "appropriate error handling" / "similar to Task N" / "handle edge cases"。

### 类型一致性

- `toSnakeCase(field)` 在 Task 1 定义 → Task 6 (`import`) → Task 7 (`import` + 调用)。
- `preset.sort = { field, order } | null` 在 Task 2 (Step 1) 定义 → Task 3 (Step 3, `workingSort` 初始化) → Task 5 (Step 2-3, 应用/保存) → Task 7 (读取 + 转 snake_case + 转大写) — 形状一致。
- `updatePreset(id, patch)` 在 Task 2 定义 → Task 5 (Step 5 import + Step 2 调用)— 一致。
- `workingSort = { field, order }` 全程 camelCase;后端要的 snake_case 仅在 list 页 `getData()` 之前转一次。
- `sortColumns = [{ column, sort }]` 形状与现有 `handleSortChange` 完全兼容,`getFormData()` 已有逻辑无需改。
- `updatePresetTree` 仍存在但不再被弹窗调用 — 保留作为未来可能的 API,本期不删(零成本)。

### 已知风险 / 注意点

- Task 9 的 Step 1a 把 `dataProp` 数组整体搬到 `data().tableColumns` 时,**回调函数内的 `this` 仍指向组件实例**(因 `optionObj` 是 computed,内联 `this.tableColumns` 解析时 `this` 是组件)。无闭包陷阱。
- `LPVxeTable` 列头图标同步问题(spec §3.4 已知风险)已被显式接受为降级方案。
- `updatePresetTree` 仍 export 但不再被弹窗 import — 留作将来 API;**不在本期删除**(避免无关改动)。