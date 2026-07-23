# 自定义视图增加排序功能 — 设计文档

日期:2026-07-23
关联代码:`src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/*`、`src/views/claimreturn/claim/warrantyapply/index.vue`

## 背景

`CustomQueryDialog` 当前只支持"条件查询",每个视图(preset)只持久化 `tree`(条件树)到 `localStorage`。但实际使用中,用户经常需要固定的排序(如"按创建时间倒序")。本期为视图增加"排序"能力:在弹窗内配置排序字段与顺序,作为视图的一部分保存;选中视图时,排序随条件一起被恢复。

## 设计

### 1. 数据模型 — Preset 增加 `sort` 字段

`presetStore.js` 中,preset 对象新增与 `tree` 同级的 `sort` 字段:

```js
{
  id,
  name,
  tree: { logic, conditions: [...] },     // 已有
  sort: { field: 'createTime', order: 'desc' } | null,  // 新增,可空
  createdAt,
  updatedAt,
  perfStatus,
  perfDurationMs,
  perfTestedAt
}
```

字段选用 camelCase(如 `createTime`、`vehiclePlateNo`),与查询条件 `field` 一致,复用 `FIELDS` 列表。后端 API 需要的 `sortColumns: [{column, sort}]` 是 snake_case,由列表页 `getFormData()` 在发送请求前转换。

`presetStore.js` 行为变更:

- `addPreset(name, tree, sort)`:保存时把 `sort` 一起写入。
- `updatePresetTree` 保留(向后兼容老调用方),内部调用统一通过新增的 `updatePreset(id, { tree, sort })` 实现;或新增 `updatePresetSort(id, sort)` 单独更新排序。本期选择**新增 `updatePreset(id, patch)` 通用更新**,内部合并 `tree` 和 `sort`。
- 读老数据(没有 `sort` 字段)时,使用 `preset.sort ?? null`,不回写污染。

### 2. 弹窗 UI — 在条件树下方加排序区

文件:`src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue`

布局:错误汇总 → 条件树 → 排序区(单字段 + 升/降)。

```
┌─ 排序(单字段) ──────────────────┐
│ 字段:[下拉 v-model=sortField]    │
│ 顺序:( ) 升序  ( ) 降序          │
│ 不选字段则按后端默认排序          │
└──────────────────────────────────┘
```

控件:

- 字段下拉用 `el-select`,`v-model="workingSort.field"`,选项来自 `FIELDS`(value=key, label=label),可清空。
- 顺序用 `el-radio-group`,`v-model="workingSort.order"`,值 `'asc'` / `'desc'`。未选字段时 radio 禁用。
- 提示文案固定在控件下方一行。

数据:

- `data()` 新增 `workingSort: { field: null, order: null }`。
- `makeInitialTree()` 同步重置为 `workingSort = { field: null, order: null }`(返回时不带函数,直接初始化字段)。
- `watch.visible`:打开弹窗时,若选中预设,`workingSort = cloneTree(preset.sort ?? { field: null, order: null })`;若自定义模式,使用初始空对象。
- `onPresetChange` / `onClear` / `onDeletePreset`:重置 `workingSort`。
- `onApply`:把 `workingSort` 作为 `preset.sort` 一起应用。校验:若 `workingSort.field` 已选但 `workingSort.order` 未选,汇入 `errorSummary`(`第 X 个排序项:请选择顺序`)。
- `onSavePreset`:把 `workingSort` 作为第二个参数传给 `addPreset`。
- 视图已选中后再编辑,`updatePreset(id, { tree, sort })` 一起更新。

### 3. 列表页集成

文件:`src/views/claimreturn/claim/warrantyapply/index.vue`

#### 3.1 选中预设时同步 `sortColumns`

`onDropdownCommand`、`onPresetChange`、`onApply` 三处路径在选中预设后,把 `preset.sort` 同步到 `this.sortColumns`:

```js
this.sortColumns = preset.sort
  ? [{ column: toSnakeCase(preset.sort.field), sort: preset.sort.order.toUpperCase() }]
  : [];
this.getData();
```

提取工具函数 `toSnakeCase(field)`(把 `createTime` → `create_time`),与 `handleSortChange` 中的现有正则共用同一实现。放在 `fieldMeta.js` 里(因为字段元数据与字段 key 在那里维护)。

#### 3.2 禁用表头点选排序

`optionObj.dataProp` 每个列定义加 `sortable: false`(对应 vxe-table 的关闭排序)。`@sortChange="handleSortChange"` 监听保留但永远不触发(作为安全网);若实现后确认永远不触发,可后续单独清理。

#### 3.3 重置 / 清除

- `onReset`:`this.sortColumns = []`。
- `handleClearPreset`:`this.sortColumns = []`。
- 默认视图(无预设):`sortColumns = []`,按后端默认顺序排。

#### 3.4 表头图标同步(已知风险)

应用视图后,`LPVxeTable` 列头里的排序指示图标可能不会立刻与 `sortColumns` 同步——属于视觉降级,不影响数据正确性。实现时若发现 `this.$refs.tableRef` 暴露 `clearSort()` / `sort(field, order)` 之类的 API,优先调用;否则接受"图标滞后于数据"。

### 4. 测试与验证

1. **持久化**:字段 + desc → 保存视图 → 关闭重开 → 选同一视图 → 排序生效。
2. **独立验证**:条件 X + 排序 `createTime desc` → 列表按条件筛 + 倒序。
3. **空排序**:保存视图时留空排序 → 选中后 `sortColumns = []`,请求体不带 `sortColumns`。
4. **隔离**:视图 A(带排序)、视图 B(不带)→ 切 A,B 排序跟随切换;切回默认排序清空。
5. **清空/重置**:弹窗「清空」→ 排序清空;列表「重置」→ 排序清空。
6. **表头不可点**:列头点击不响应;`sortColumns=[]` 时无高亮图标。
7. **老数据兼容**:历史 preset 没有 `sort` 字段 → 读取按 `null` 处理,选中视图不报错。
8. **校验汇合**:只选字段不选顺序 → `errorSummary` 出现「排序:请选择顺序」。

## 影响范围

| 文件 | 改动 |
|---|---|
| `CustomQueryDialog/presetStore.js` | preset 结构增 `sort`;`addPreset` 增参;新增 `updatePreset` |
| `CustomQueryDialog/index.vue` | 排序 UI + 校验 + workingSort 生命周期 |
| `CustomQueryDialog/fieldMeta.js` | 新增 `toSnakeCase` 工具 |
| `warrantyapply/index.vue` | `sortColumns` 同步;`sortable: false`;`onReset`/`handleClearPreset` 清排序 |

## 非目标(YAGNI)

- 多字段排序、复杂优先级排序(本期只单字段)。
- 排序字段黑名单(本期复用全部 `FIELDS`)。
- 把 sort 拆成单独存储 / 与 preset 解耦(本期随 preset 一起存)。
- 服务端真接入排序 API 验证(本期不涉及,沿用现有 `getList` 的 `sortColumns` 参数)。