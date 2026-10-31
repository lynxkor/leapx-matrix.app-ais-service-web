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
                     ├─ 下半 <TableSetting>       ← 表格设置功能(已复制到本项目内)
                     └─ 右下 统一「取消 / 保存」
```

**关键点**：下拉本身用的是标准 `CustomView`，本组件只负责「新增/编辑」时弹出的那个弹窗。
列表页（保修申请单）继续用默认的 `CustomQueryDialog`，明细表页用合并弹窗，互不影响。

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
| `enableDefaultView` | Boolean | `false` | **默认视图能力总开关**：①「系/默」标识 ②复制 / 设为默认 ③打开时自动选中默认视图 |

> `src/libs` 是 git submodule(partner-components),改动需在该仓库单独提 MR。

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
      skipPerfTest: true,      // 该 bizKey 后端通用查询不可用,跳过性能测试
      showBaseSettings: false  // EditTable 不支持折行/紧凑度,隐藏「基础设置」
    };
  }
}
```

### 事件

| 事件 | 时机 | 载荷 |
|---|---|---|
| `change` | 下拉选中视图 / 切回系统视图 | `{ conditions, sortColumns, activePresetId }` |
| `save` | 弹窗保存成功 | `{ id, viewName, conditionTree, sortFields, tableConfig }` |
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

---

## 七、已知限制

1. **多字段排序只落第一项**：后端 `addOrUpdate` 只接受单字段 `sortField/sortOrder`，
   完整多字段列表通过 `save` 事件的 `sortFields` 交给宿主页面（前端本地生效时是完整的）。
2. **基础设置三项对本页面无效**：`EditTable` 写死了 `show-overflow` 与行高，
   故传 `showBaseSettings: false` 隐藏该区块，避免「设了不生效」。
3. **原组件的单字段排序区被隐藏**：PRD 的自定义排序要求多字段 + 拖拽调整次序，
   由外层实现，原组件的 `.c-cqd__sort` 通过 `hide-sort` 隐藏（`CustomQueryBlock` 里加 class 实现）。
4. **打印设置的「按个人视图」尚未实现**：PRD 里打印设置需联动个人视图列表（必选、单选），
   属另一模块，不在本组件范围内。

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
