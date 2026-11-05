# 个人视图设置（PersonalViewSetting）

「自定义条件查询」与「表格设置」合并后的单个弹窗，用于在**单据明细表**上提供个人视图能力
（视图名称 + 自定义筛选 + 自定义排序 + 自定义表格）。

配合标准 `CustomView` 下拉组件使用，与保修申请单页面的交互完全一致。

> 需求出处：PRD《LP262002 维修出库单模块：个人视图及打印套用功能》7.1.2

---

## 一、整体结构

```
维修出库详情页 (edit.vue)
  └─ <CustomView>  ← 标准视图下拉(来自 @/libs/components/CustomView)
       ├─ 下拉菜单:系统视图 / 已保存视图 / 新增视图
       │    └─ [系][默] 标识 + 复制 / 设为默认
       └─ 弹窗:<component :is="dialogComponent">
                └─ <PersonalViewSetting>  ← 本组件(替换默认的 CustomQueryDialog)
                     ├─ 上半 <CustomQueryBlock>  ← 引用原「自定义条件查询」组件
                     │        (含 lib 自带的批量排序区,本项目不再重复实现)
                     ├─ 下半 <TableSetting>       ← 表格设置功能(已复制到本项目内)
                     └─ 右下 统一「取消 / 保存」
```

**关键点**：下拉本身用的是标准 `CustomView`，本组件只负责「新增/编辑」时弹出的那个弹窗。
列表页（保修申请单）继续用默认的 `CustomQueryDialog`，明细表页用合并弹窗，互不影响。

**批量排序(需求 LP262002 7.1.2.2)的实现位置在 lib 标准组件里**，
不是在本项目内另起一套 —— 详见下文「二之二」。

### 本项目内的文件

| 文件 | 职责 |
|---|---|
| `index.vue` | 弹窗容器：组合上下两块 + 统一 footer + 保存流程 |
| `CustomQueryBlock.vue` | **引用**原「自定义条件查询」组件（extends + 覆盖 el-dialog），隐藏其自带 footer |
| `TableSetting.vue` | **复制**到本项目内的「表格设置」功能（design 包 optionModal 在 node_modules 里加不了参数） |
| `InlineDialog.vue` | 行内容块容器（替代 el-dialog，不渲染 footer slot） |
| `localView.js` | 前端本地生效的工具：条件树求值 / 排序 / 列配置应用 / 存储键规则 |
---

## 二、CustomView 新增的入参（src/libs/components/CustomView/index.vue）

全部为**可选入参**，默认值保持原行为，**不影响任何既有页面**。

| 入参 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `dialogComponent` | Object \| Function | `null` | 「新增/编辑」弹窗组件。传 `PersonalViewSetting` 即换成合并弹窗 |
| `dialogProps` | Object | `{}` | 传给弹窗组件的额外 props(config / skipPerfTest / showBaseSettings) |
| `localApply` | Boolean | `false` | 本地生效模式:①选中视图不校验性能测试状态 ②提示语不提「表单已锁定」 |
| `defaultViewText` | String | `''` | 下拉里「默认视图」项的文案。空 = 与 `triggerText` 一致 |
| `enableDefaultView` | Boolean | `false` | **默认视图能力总开关**:①「系/默」标识 ②复制 / 设为默认 ③打开时自动选中默认视图 |

> `src/libs` 是 git submodule(partner-components),改动需在该仓库单独提 MR。

### 共享组件为「多字段排序」做的适配(需求 LP262002 7.1.2.2)

> **批量排序是 lib 标准功能,实现在 partner-components 仓库里**,
> 所有使用标准 `CustomQueryDialog` 弹窗的页面(列表页 + 明细表页)自动都具备批量排序。

新增 `src/libs/components/CustomView/sortJson.js`,统一 sortJson 的解析 / 序列化规则,
共享组件与业务项目内的弹窗共用一份,避免两处各写一套导致读不一致。

| 文件 | 改动 |
|---|---|
| `CustomView/sortJson.js`(新增) | `parseSortJson` / `resolveSortList` / `toSortJson` / `toSortColumns` / `isVirtualSortField` |
| `CustomView/SortFieldEditor.vue`(新增) | 批量排序编辑器:「＋添加排序字段」下拉 + 每行(手柄/字段名/升降序/删除)+ 拖拽调整次序 |
| `CustomView/CustomQueryDialog.vue` | 排序区由单字段改为批量(内嵌 `SortFieldEditor`);`sortList` 成为排序的唯一数据源;保存只发 `sortJson` |
| `CustomView/index.vue` | `applyPreset` 按 sortJson 生成多字段 `sortColumns`;`onCopyView` 一并复制 sortJson |

**兼容口径**:读取侧优先用 `sortJson`,没有才回落到旧的 `sortField` / `sortOrder`
(历史数据只有这两个字段)。保存侧**不做双写** —— 只发 `sortJson`,不再带旧的单字段排序,
旧字段与新字段不会并存。

**空排序的语义**:清空排序时前端发 `"[]"`(不是空串)——
空串会被后端当成「没传 sortJson」而回落到旧字段,导致清不掉;
`"[]"` 则明确表示「无排序」,后端与前端读取口径一致,都以此为准。

> ⚠️ 以上文件在 submodule(partner-components)里,需在该仓库单独提 MR 并更新主仓的 submodule 指针。

---

## 三、下拉项的默认视图能力（`enableDefaultView: true` 时）

| 视图类型 | 标识 | 可用操作 |
|---|---|---|
| **系统视图**（下拉第一项，`triggerText` 命名） | 恒显示「系」；是默认视图时再显示「默」 | 复制、设为默认（已是默认时不显示） |
| **用户视图** | 默认视图显示「默」 | 置顶、编辑、删除、复制、设为默认（非默认时才显示） |

- **复制**：复制出的视图名为「原视图名称-复制」。
  后端会自动给视图名追加创建人后缀（`XX(超级管理员)`），前端先去掉原名里的后缀再拼「-复制」，
  最终展示为 `XX-复制(超级管理员)`。用户视图复制会连同条件树与排序一起复制；
  系统视图复制得到一个空的用户视图。
  复制成功后抛 `copy` 事件（`{sourceId, newId, sourceIsSystem}`），
  由宿主页面复制该视图的**表格配置**（表格配置存在 userDefineTable，按视图 id 关联，不在本组件职责内）。
- **设为默认**：调后端 `POST /datareport/web/customView/customQueryView/setDefault`，参数 `{ id, defaultIs }`
  （`defaultIs` 不传按「设为默认」处理，传 `false` 表示取消默认）。
  「系统视图」是虚拟项（后端无记录），把它设为默认 = 取消当前默认用户视图的默认标记，系统视图自然回落为默认。
- **获取默认视图**：进入页面先用 `page` 接口传 `defaultIs=1` + `bizKey` 查到默认视图，
  再展示视图列表并自动选中默认视图（视图记录的 `defaultIs` 字段 0 否 / 1 是）。

---

## 四、页面接入示例

```vue
<CustomView
  :biz-key="viewBizKey"
  :active-preset-id.sync="activeViewId"
  :value="viewConditionTree"
  :sort-columns="viewSortColumns"
  trigger-text="系统视图"
  :dialog-component="viewDialogComponent"
  :dialog-props="viewDialogProps"
  local-apply
  enable-default-view
  @copy="onViewCopy"
  @change="onViewChange"
  @save="onViewSave"
/>
```

```js
computed: {
  // 传给弹窗的 props
  viewDialogProps () {
    return {
      config: {
        autoWrap: false,
        layout: 3,
        isOperateFixed: true,
        columnConfig: this.columns.map(col => ({
          props: col.field, label: col.title, visible: true, disabled: false, type: ''
        }))
      },
      // 本地性能测试的数据源:拉全量明细行(该 bizKey 后端通用查询不可用)
      perfTestRowsLoader: this.loadAllCollarRows,
      showBaseSettings: false  // EditTable 不支持折行/紧凑度,隐藏「基础设置」
    };
  }
}
```

### 事件

| 事件 | 时机 | 载荷 |
|---|---|---|
| `change` | 下拉选中视图 / 切回系统视图 | `{ conditions, sortColumns, activePresetId }` |
| `save` | 弹窗保存**且性能测试通过**后 | `{ id, viewName, conditionTree, sortFields, tableConfig }` |
| `copy` | 复制视图成功 | `{ sourceId, newId, sourceIsSystem }` |

---

## 五、为什么筛选/排序在前端本地生效

后端 `executeQuery`（通用视图查询）对本 bizKey **不可用**：

- `customViewMain.path` 指向 `/sp/web/maintenance/maintenanceOutboundOrderDetail/page`
- 该接口必须带 `maintenanceOutboundOrderId` 定位单据，通用查询拿不到 → 报「维修出库单不存在null」
- 条件树里的 `maintenance_outbound_order_id` 也无济于事（实测后端只认下划线字段名，
  但通用查询不会把它映射成接口参数）

因此明细表视图的筛选/排序改为**前端本地生效**（见 `localView.js`）：

1. 明细表一次性按大 `pageSize`(500) 拉全量 —— 单据明细行数有限
2. `filterByTree` 按条件树过滤（下划线字段名 → 驼峰行字段名自动映射）
3. `sortByFields` 多字段排序
4. 按前端分页参数切页

未使用视图时行为不变：走后端分页。

---

## 六、数据存储

| 数据 | 存储位置 | 键 |
|---|---|---|
| 视图名 / 筛选条件 / 排序 | 后端视图表 `customQueryView` | `bizKey` |
| 表格配置（列显隐/顺序） | `userDefineTable` | `${bizKey}__pvs__${viewId}` |
| 默认视图 id | 后端视图表 `defaultIs` 字段（0 否 / 1 是） | — |

视图表**没有**表格配置字段，故走公共的用户自定义表格接口单独存。
键规则集中在 `localView.viewTableConfigCode(bizKey, viewId)`，
弹窗与业务页面共用，避免两处各写一份导致读不到。

### 排序的存储格式

后端视图表新增 `sort_json` 列（JSON 数组），存批量排序列表：

```json
[{"index":1,"sortField":"spare_part_code","sortOrder":"asc"},
 {"index":2,"sortField":"location_name","sortOrder":"desc"}]
```

- `index`：排序位次（1 起），越小越靠前，最终排序时次序靠前的字段先排。
- `sortField`：字段名，下划线形态（与 `custom_view_field.field_name` 一致）。
- `sortOrder`：`asc` / `desc`。

**历史数据兼容**：改造前的视图只有 `sort_field` / `sort_order` 两个字段（单字段排序）。
读取时**优先用 `sort_json`，没有才回落到旧的两个字段**，行为与改造前完全一致；
旧视图被重新编辑保存后会自动迁移到新格式。

保存时**不做双写**：前端带 `sortJson` 就不再带旧的 `sortField` / `sortOrder`，
后端也只写 `sort_json` 一列，两套字段不会并存。

---

## 七之一、性能测试（测试通过才算真正保存）

与原分支（`feature/20261013-customView`）一致，保存流程是：

```
校验 → 落库(视图 + 表格配置) → 性能测试 → 【通过才】交出 save 事件 + 切换选中视图 + 关闭弹窗
```

**性能测试未通过时弹窗保持打开**（便于改条件后重试），且**不会**交出 `save` 事件
—— 否则宿主页面已按新条件刷新了页面，用户看到的却是「测试没通过」，状态不一致。

上半区的「性能测试」按钮与保存流程**走同一个入口**（`onPerfTest`），保证两条路径判定口径一致。

### 三种测试模式（按优先级）

| 模式 | 触发条件 | 实现 | 适用场景 |
|---|---|---|---|
| **本地性能测试** | 宿主传了 `perfTestRowsLoader` | `localView.localPerfTest`：对全量明细行跑一次真实的过滤 + 排序并计时，阈值 5000ms | 单据明细表视图（本地生效） |
| **跳过** | 无 loader 且 `skipPerfTest: true` | 不测试，保存即生效（⚠️ 与原分支语义不一致，慎用） | 确实不需要测试的场景 |
| **后端 perf** | 其余 | `qb.onRunPerfTest()` → `customQueryViewApi.perf(id)` | 列表页视图（走后端通用查询） |

### 为什么明细表要用本地性能测试

后端 `perf` 走 `customViewMain.path` 指向的列表接口（通用视图查询）。
单据明细表**不是独立列表页**，该接口必须带单据 ID 才能定位数据，通用查询拿不到。实测 `bizKey=maintenanceOutboundOrderDetail`：

- 直接调 `executeQuery` → 报「维修出库单不存在null」/ 500；
- 调 `perf` → 同样报「维修出库单不存在null」（`code:400`），或后端 `future.get(10, SECONDS)` 超时 →
  `perfStatus` 恒为 `pending`（未通过），**永远不可能通过**。

即后端性能测试在明细表场景**完全不可用**，若照搬原分支的后端 perf 路径，明细页将**永远保存不了视图**。
而明细表视图的筛选/排序本来就在前端本地生效，所以性能测试也应测「本地这条路径」——
用视图的条件树与排序项对全量明细行做一次真实的过滤 + 排序并计时，
测的正是用户实际会走的执行路径，语义上与后端 perf 等价。

> 对照验证：列表页 `bizKey=warrantyapply` 的视图 `perfStatus=passed`（后端 perf 可用），
> 明细页 `bizKey=maintenanceOutboundOrderDetail` 恒为 `pending`（必然失败）。

### 宿主页面接入

```js
// 传一个加载器,返回该单据的全部明细行
async loadAllCollarRows () {
  const res = await collarPage({
    pageNum: 1,
    pageSize: LOCAL_VIEW_MAX_ROWS,
    maintenanceOutboundOrderId: this._id
  });
  return (res && res.records) || [];
}
```

用函数而不是直接传数组：明细行只在保存时才需要，且要保证测的是最新数据。

---

## 七、已知限制

1. **基础设置三项对本页面无效**：`EditTable` 写死了 `show-overflow` 与行高，
   故传 `showBaseSettings: false` 隐藏该区块，避免「设了不生效」。
2. **打印设置的「按个人视图」尚未实现**：PRD 里打印设置需联动个人视图列表（必选、单选），
   属另一模块，不在本组件范围内。
3. **PRD 的【序号】虚拟字段未加**：PRD 7.1.2.2 还要求明细表加【序号】虚拟列，
   本次只做「排序字段批量配置」，故未加；但排序候选列表已按 PRD 剔除【序号】（它没有对应的业务字段）。
4. **后端执行的排序沿用数据库排序规则**：PRD 要求「中文转拼音」「混合模式数字按自然序」，
   前端本地排序（`localView.sortByFields`）已用 `Intl.Collator` 满足；
   但走后端 `executeQuery` 的视图（列表页场景），ORDER BY 沿用数据库的排序规则，
   `a2` / `a10` 的大小写与自然序需数据库排序规则配合，未在本需求内改造。

---

## 七之二、自定义排序的交互（PRD 7.1.2.2）

> 实现位置：**lib 标准组件** `src/libs/components/CustomView/SortFieldEditor.vue`
> (由 `CustomQueryDialog.vue` 内嵌),本项目通过继承直接复用,不再另写一套。

| PRD 要求 | 实现 |
|---|---|
| 首次选择排序字段时，列出所有可排序字段 | 「＋ 添加排序字段」下拉，取自后端字段元数据（`customViewField/list`） |
| 不受表格设置影响 | 候选字段取自后端字段元数据，不取表格列配置 |
| 剔除已参与排序的字段 | `candidateFields` 计算属性按 `sortList` 过滤 |
| 剔除虚拟字段【序号】 | `isVirtualSortField` 黑名单（字段名 + 中文名） |
| 字段多时支持滚动条 | 候选下拉容器 `max-height: 200px; overflow-y: auto` |
| 新增排序字段默认升序 | `addField` 里 `order: 'asc'` |
| 支持删除排序字段和排序方式 | 每行 ⊖ 按钮 + 升序/降序单选 |
| 排序按钮显示已参与排序的字段数量 | 按钮文案「添加排序字段（N）」 |
| 多个排序字段可拖动调整次序 | `vuedraggable`，手柄 `.c-sfe__handle` |
| 次序靠前的字段先排序 | 列表顺序即 `sortJson` 的 `index` 顺序 |

---

## 八、⚠️ 踩坑：vxe-table 不会因 `columns` 变化而重排已有列

`EditTable` 内部是 `vxe-table`（3.17.13）。当 `columns` prop 变化时，
vxe 只把**已存在的列**做 `visible` 同步，**不会调整列的位置**：

- 列显隐 → ✅ 生效
- 列顺序（拖拽调整）→ ❌ **不生效**，表格仍是页面原本的列顺序

**解决**：用「可见列的字段序列」做 `:key`，列配置一变就重建表格组件，让 vxe 按新顺序渲染。

```vue
<edit-table :key="tableColumnsKey" :columns="displayColumns" ... />
```

```js
computed: {
  tableColumnsKey () {
    return this.displayColumns.map(col => col.field).join('|');
  }
}
```

> 重建会清掉 vxe 内部的勾选状态，页面侧需同步清空 `selectedRows`（`resetSelection()`），
> 否则会出现「页面认为已勾选、表格却未勾选」的不一致。
>
> key 不能直接绑 `displayColumns` 本身 —— 它是 computed，每次返回新数组引用，
> 会导致表格每次渲染都重建。
