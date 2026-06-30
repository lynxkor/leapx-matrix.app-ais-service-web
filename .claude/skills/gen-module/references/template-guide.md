# Template Guide

This document explains the template structure and variable system used in AIS frontend module generation.

## Template Files Location

Templates are located in the project root at `templates/`:
- `templates/index.vue` - List page template
- `templates/edit.vue` - Edit page template
- `templates/api.js` - API functions template
- `templates/detail.vue` - Detail page template (not used currently)

## Variable System

The templates use Mustache-like syntax with custom delimiters `{{{` and `}}}` to avoid conflicts with Vue's `{{}}`.

### Module-Level Variables

Available at top level of templates:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{{title}}}` | Chinese title of module | "门店信息管理" |
| `{{{name}}}` | Module name (**lowerCamelCase**) | "dealerInfo" |
| `{{{nameCamelCase}}}` | Module name (**lowerCamelCase**, same as `{{{name}}}`) | "dealerInfo" |
| `{{{nameKebabCase}}}` | Module name kebab-case (CSS class) | "dealer-info" |
| `{{{apiPath}}}` | API path with `/web/` inserted | "maintain/web/basic/dealerInfo" |
| `{{{modulePath}}}` | Full module path | "maintain/basic/dealerInfo" |
| `{{{isProForm}}}` | Whether to use ProForm mode (default `true`) | true |

**CRITICAL RULE — lowerCamelCase**:
`{{{name}}}` and `{{{nameCamelCase}}}` MUST both produce **lowerCamelCase** (first letter lowercase):
- ✅ Correct: `dealerWorkTeam`, `storeInfo`, `vehicleModel`
- ❌ Wrong: `DealerWorkTeam`, `StoreInfo`, `VehicleModel`

**Use cases**:
- `moduleKey: 'AISMC-{{{nameCamelCase}}}'` → `moduleKey: 'AISMC-dealerWorkTeam'`
- Route `name`: `{{{nameCamelCase}}}` → `dealerInfo`
- Component `name`: `{{{nameCamelCase}}}Edit` → `dealerInfoEdit`

### Field Properties

Each field in `{{{cols}}}` array has these properties:

| Property | Type | Description |
|----------|------|-------------|
| `key` | string | Field identifier (camelCase) |
| `description` | string | Chinese display name |
| `type` | string | Data type: 'string', 'number', 'boolean', 'array' |
| `format` | string | Optional format: 'date-time', 'int32', 'int64' |
| `visible` | boolean | Show in table columns |
| `searchable` | boolean | Show in search form |
| `sort` | number | Display order |
| `isFirst` | boolean | Is this the first field |
| `isDate` | boolean | Inferred: date/time field |
| `isSelect` | boolean | Inferred: dropdown select field |
| `isBoolean` | boolean | Inferred: yes/no field |
| `isNormal` | boolean | Inferred: normal text input |

## Template Structure

### index.vue (List Page)

#### Search Form Section

Uses responsive layout with 3 states:
1. **Collapsed (default)**: Show first 2 searchable fields
2. **Expanded (3 items)**: Show first 3 searchable fields
3. **Fully expanded**: Show all searchable fields

Field loops:
- `{{{#top2SearchList}}}` - Fields 1-2 (always visible)
- `{{{#thirdSearchList}}}` - Field 3 (v-show based on visibleCount)
- `{{{#lastSearchList}}}` - Fields 4+ (v-show based on show flag)

---

## Search Form Three-Segment Layout (CRITICAL)

The search form uses a strict three-segment layout driven by `responsiveSearchForm` mixin's `visibleCount` and the page's `show` state. **All three segments MUST follow these exact rules** — do not free-form the visibility control.

### Visibility Control Matrix

| Segment | Field Index | Visibility Binding | Large Screen (≥1920) | Collapsed (show=false, Mid/Small Screen) |
|---|---|---|---|---|
| `top2SearchList` | 0, 1 | **None** (always rendered, no `v-show`) | Always visible | Always visible |
| `thirdSearchList` | 2 | **Each item independently** `v-show="this.visibleCount === 3 \|\| show"` | Always visible | Only when `show === true` |
| `lastSearchList` | ≥3 | **Entire group wrapped** in `<template v-if="show">` | Only when `show === true` (renders) | Not rendered |

### Skeleton Example

```vue
<el-form :inline="true" :model="form" size="small"
         label-position="right" label-width="150px" class="ais-search-form">

  <!-- Segment 1: top2SearchList - always visible, no v-show -->
  <el-form-item label="字段1">
    <el-input v-model="form.field1" clearable />
  </el-form-item>
  <el-form-item label="字段2">
    <el-input v-model="form.field2" clearable />
  </el-form-item>

  <!-- Segment 2: thirdSearchList - independent v-show on EACH item -->
  <el-form-item label="字段3" v-show="this.visibleCount === 3 || show">
    <fetch-select :request="fetchOptions" enumCode="StatusEnum"
      v-model="form.field3" clearable multiple filterable />
  </el-form-item>

  <!-- Segment 3: lastSearchList - wrapped ENTIRELY in <template v-if="show"> -->
  <template v-if="show">
    <el-form-item label="字段4">
      <el-input v-model="form.field4" clearable />
    </el-form-item>
    <el-form-item label="字段5">
      <el-date-picker v-model="form.field5" type="daterange" unlink-panels
        :picker-options="pickerOptions" range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期" end-placeholder="结束日期" />
    </el-form-item>
  </template>

  <page-search-action
    v-if="canList"
    v-model="show"
    is-expandable
    :loading="loading"
    @submit="onSubmit"
    @reset="onReset"
  />
</el-form>
```

### Hard Requirements (MUST Follow)

1. **`data()` must contain `show: false`** — controls the expand/collapse state.
2. **`mixins` array must include `responsiveSearchForm`** (imported from `@/libs/mixins/responsive`) — provides `visibleCount`. Without it, `v-show="this.visibleCount === 3 || show"` will throw ReferenceError.
3. **`el-date-picker` MUST include `unlink-panels`** — allows independent panel selection in date ranges (project-wide convention).
4. **`page-search-action` default attributes**: `v-if="canList" v-model="show" is-expandable :loading="loading" @submit="onSubmit" @reset="onReset"`.
5. **`getFormData()` MUST contain `data.sortColumns = this.sortColumns;`** — even when `sortColumns` is an empty array.
6. **When all three segments are empty** (no searchable fields): omit the entire `<el-form class="ais-search-form">` block AND the `<page-search-action>` component. Keep `responsiveSearchForm` mixin and `show: false` in data for consistency.
7. **When `lastSearchList` is empty**: set `<page-search-action :is-expandable="false">` to avoid showing a non-functional expand button.
8. **Segment 2 uses `v-show`** (display:none, keeps DOM); **Segment 3 uses `v-if`** (no render, frees DOM). This difference is intentional — Segment 2 needs to be reactive to `visibleCount` changes (screen resize), Segment 3 only depends on user action.
9. **Preserve `this.` prefix** in `v-show="this.visibleCount === 3 || show"` — template literal requires explicit `this.` even though Vue templates usually allow omitting it. This is project-wide convention.

### Edge Cases

- **Only 1 searchable field**: it goes to `top2SearchList`, no segments 2/3. Set `:is-expandable="false"` on `page-search-action`.
- **Only 2 searchable fields**: both go to `top2SearchList`, no segments 2/3. Set `:is-expandable="false"`.
- **Exactly 3 searchable fields**: top2 + third, no last. Keep `is-expandable` (allows user to hide field 3 on small screens).
- **4+ searchable fields**: full three-segment layout, `is-expandable` enabled.

#### Search Form Field Types

For each searchable field, use conditional rendering:

```vue
{{{#isDate}}}
<el-date-picker
  v-model="form.{{{key}}}"
  type="daterange"
  value-format="yyyy-MM-dd HH:mm:ss"
/>
{{{ /isDate}}}

{{{#isSelect}}}
<fetch-select
  :request="fetchOptions"
  enumCode="xxx"
  v-model="form.{{{key}}}"
/>
{{{ /isSelect}}}

{{{#isBoolean}}}
<fetch-select
  :options="yes_no_enum"
  v-model="form.{{{key}}}"
/>
{{{ /isBoolean}}}

{{{#isNormal}}}
<el-input
  v-model="form.{{{key}}}"
  clearable
/>
{{{ /isNormal}}}
```

#### Table Configuration

Build `dataProp` array from `{{{cols}}}`:

```javascript
dataProp: [
  {{{#cols}}}
  {{{#isFirst}}}
  {
    props: '{{{key}}}',
    label: '{{{description}}}',
    visible: {{{visible}}},
    width: 200,
    fixed: 'left',
    buttons: [{
      click: (rowIndex, row) => {
        this.$router.push({
          path: '/{{{modulePath}}}/edit',
          query: { id: row.id }
        });
      },
      type: 'primary'
    }]
  },
  {{{/isFirst}}}
  {{{^isFirst}}}
  {{{#visible}}}
  {
    props: '{{{key}}}',
    label: '{{{description}}}',
    visible: {{{visible}}},
    width: 200
  },
  {{{/visible}}}
  {{{/isFirst}}}
  {{{/cols}}}
  {
    props: 'operate',
    label: '操作',
    type: 'operate',
    fixed: 'right',
    buttons: [
      { name: '编辑', ... },
      { name: '删除', ... }
    ]
  }
]
```

### edit.vue (Edit Page)

#### Form Structure

Using `edit-base-container` component:

```vue
<edit-base-container
  :id="_id"
  :title="title"
  :isEditing.sync="isEditing"
  :form.sync="form"
  :submitRequest="submitRequest"
  :detailRequest="detailRequest"
>
  <el-form :model="form" :rules="rules" ref="ruleForm">
    <!-- Form items here -->
  </el-form>
</edit-base-container>
```

#### Form Field Types

```vue
{{{#isDate}}}
<el-form-item label="{{{description}}}" prop="{{{key}}}">
  <el-date-picker
    v-model="form.{{{key}}}"
    type="date"
    value-format="yyyy-MM-dd HH:mm:ss"
  />
</el-form-item>
{{{ /isDate}}}

{{{#isSelect}}}
<el-form-item label="{{{description}}}" prop="{{{key}}}">
  <fetch-select
    :request="fetchOptions"
    enumCode="xxx"
    v-model="form.{{{key}}}"
  />
</el-form-item>
{{{ /isSelect}}}

{{{#isBoolean}}}
<el-form-item label="{{{description}}}" prop="{{{key}}}">
  <el-radio-group v-model="form.{{{key}}}">
    <el-radio :label="1">是</el-radio>
    <el-radio :label="0">否</el-radio>
  </el-radio-group>
</el-form-item>
{{{ /isBoolean}}}

{{{#isNormal}}}
<el-form-item label="{{{description}}}" prop="{{{key}}}">
  <el-input v-model="form.{{{key}}}" />
</el-form-item>
{{{ /isNormal}}}
```

#### Sub-Table (Array Fields)

For fields with `type: 'array'`:

```vue
{{{#cols}}}
{{{#type.array}}}
<el-form-item label="{{{description}}}">
  <EditTable
    v-model="form.{{{key}}}"
    :columns="subTableColumns"
  />
</el-form-item>
{{{ /type.array}}}
{{{ /cols}}}
```

### api.js (API Functions)

Standard CRUD API pattern:

```javascript
import api from '@/axios';

const prefix = '{module}/web/';

export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

export function deleteItem (data) {
  return api.jsonPost(prefix + 'delete', data);
}

export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}
```

## Code Style Guidelines

### Indentation and Spacing
- Use 2 spaces for indentation
- Always use semicolons
- Spaces around function parentheses: `function name () {}`
- Spaces in object literals: `{ key: value }`

### Naming Conventions
- Components: PascalCase (`MyComponent`)
- Variables: camelCase (`myVariable`)
- Constants: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- CSS classes: kebab-case with BEM (`my-block__element--modifier`)

### Vue Component Structure
```vue
<template>
  <div class="page-common m-{{{nameKebabCase}}}-list">
    <!-- Template content -->
  </div>
</template>

<script>
export default {
  name: 'M{{{nameCamelCase}}}',
  components: {},
  mixins: [],
  data () {
    return {
      // Data properties
    };
  },
  created () {},
  methods: {
    // Methods
  }
};
</script>

<style lang="scss" scoped>
.m-{{{nameKebabCase}}}-list {
  // Styles
}
</style>
```

### Import Order
```javascript
// 1. External libraries
import debounce from 'lodash.debounce';

// 2. @leapmotor/design components
import { LPVxeTable } from '@leapmotor/design';

// 3. Local components
import PageSearchAction from '@/libs/components/AisPageSearchAction';

// 4. API functions
import { getList, deleteItem } from '@/api/{{{modulePath}}}/index';

// 5. Mixins
import responsiveSearchForm from '@/libs/mixins/responsive';
```

## Route Insertion Pattern

Routes are inserted into `src/router/index.js` under the 'index' route's children array.

Find the route with `name: 'index'`, then push new routes to its `children` array.

### Route Structure

```javascript
{
  path: '/{modulePath}',
  name: '{name}',
  component: () => import('@/views/{modulePath}/index.vue'),
  meta: {
    name: '{title}',
    keepAlive: true
  }
}
```

For edit/detail pages, add `noResourceUrl: 'true'` to meta.

## Common Patterns

### Permission Control

Add permission checks using `permissions` mixin:

```javascript
{
  moduleKey: 'AISMC-{{{nameCamelCase}}}',
  computed: {
    canAddOrUpdate () {
      return this.checkPermission(this.moduleKey + ':addOrUpdate');
    },
    canDelete () {
      return this.checkPermission(this.moduleKey + ':delete');
    }
  }
}
```

### Date Range Handling

Convert date range to start/end for API:

```javascript
getFormData () {
  const data = { ...this.form };

  if (this.form.createTime) {
    delete data.createTime;
    if (this.form.createTime.length > 1) {
      data.createTimeStart = this.form.createTime[0];
      data.createTimeEnd = this.form.createTime[1];
    }
  }

  return data;
}
```

### Table Configuration with Mock Fallback

```javascript
getConfig () {
  return new Promise((resolve, reject) => {
    getTableConfig(this.optionObj.id).then(data => {
      resolve({ data });
    }).catch(err => {
      console.error(err);
      resolve(mockConfig); // Fallback to mock
    });
  });
}
```
