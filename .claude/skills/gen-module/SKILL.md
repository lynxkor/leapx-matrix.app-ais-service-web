---
name: gen-module
description: Intelligent Vue module generator for AIS frontend projects. Use this skill when users need to create new Vue modules with list pages, edit pages, and API files. Supports two modes: (1) Direct JSON configuration for fast generation - provide complete config object with path, list, and title to skip all questions, or (2) Conversational mode - provide module details through natural language. Automatically infers field types (dates, selects, booleans, numbers), generates code based on project templates, and auto-inserts routes. **ALWAYS reads latest templates before generation to ensure consistency.**
---

## Quick Start

**Way 1: Direct Configuration** (Fastest)

Provide complete JSON config:
```json
/gen-module {
  "path": "/maintain/basic/storeInfo",
  "list": [
    {"key": "storeName", "description": "门店名称", "type": "string", "visible": true, "searchable": true, "sort": 1},
    {"key": "openDate", "description": "开业时间", "type": "string", "format": "date-time", "visible": true, "searchable": true, "sort": 2}
  ],
  "title": "门店信息管理"
}
```
Skip all questions, go directly to generation.

**Way 2: Conversational Mode**

Provide module details:
1. Module name (PascalCase, e.g., `DealerInfo`)
2. Chinese title (e.g., `门店信息管理`)
3. Module path (optional, e.g., `maintain/basic`)
4. Field definitions (natural language, JSON, or Swagger format)

[Full workflow below]

---

## Workflow

### Step 0: Detect Pre-Provided Configuration

**Check if user's message contains a complete configuration object** in the format:

```json
{
  "path": "/datacenter/vehicle/serviceProxyHis",
  "list": [
    {"key": "fieldName", "description": "字段描述", "visible": true, "searchable": true, "type": "string", "sort": 1}
  ],
  "title": "模块标题"
}
```

**If detected**:
1. Extract configuration from user's message
2. Parse module name from `path` (last segment)
3. Use provided `title` as Chinese title
4. Use provided `list` as field definitions
5. **Skip to Step 1** - Show preview directly, await confirmation

**Example**:
```
User: /gen-module { "path": "/maintain/basic/storeInfo", "list": [...], "title": "门店信息管理" }

AI: 检测到已提供配置，跳过信息收集。

【即将生成的配置】
模块名称: StoreInfo
中文标题: 门店信息管理
...

确认生成？(y/n)
```

**If no configuration is detected**, proceed to Step 1.

---

### Step 1: Collect Module Information

Ask in order:
1. **Module name** - PascalCase (e.g., `DealerInfo`)
2. **Chinese title** - Page display name (e.g., `门店信息管理`)
3. **Module path** - Optional path with slashes (e.g., `maintain/basic`)

Accept format: `parent/path` or `moduleName` for default path.

---

### Step 2: Parse Field Definitions

Support three input formats:

**Natural Language** (comma-separated):
```
门店名称、门店编码、所属区域、联系人、电话、开业时间、是否启用
```

**JSON Object**:
```json
{
  "storeName": "门店名称",
  "storeCode": "门店编码",
  "region": "所属区域",
  "openDate": "开业时间",
  "enabled": "是否启用"
}
```

**JSON Array** (with type hints):
```json
[
  {"key": "storeName", "description": "门店名称", "type": "string"},
  {"key": "openDate", "description": "开业时间", "type": "string", "format": "date-time"}
]
```

**Swagger/OpenAPI** - Paste field definitions directly

---

### Step 3: Apply Type Inference

For each field:
1. Check if explicit type provided (from JSON)
2. Apply inference rules based on key and description
3. Set searchable and visible defaults
4. Assign sort order (1, 2, 3...)

**Inference rules** (see [references/inference-rules.md](references/inference-rules.md) for details):
- Date/time fields → `el-date-picker`
- Type/status/state fields → `fetch-select`
- Boolean fields → `el-radio-group` (edit), `fetch-select` (search)
- Number fields → `el-input`
- Other fields → `el-input`

**Searchable defaults**: All fields searchable unless:
- Ending with `id`/`_id`
- Contains `creator`, `modifier`, `remark`
- System fields (`createTime`, `updateTime`)

**Visibility defaults**: First 5 fields `visible: true`, others `visible: false`

---

### Step 4: Preview Configuration

Display formatted preview:

```
【即将生成的配置】
模块名称: DealerInfo
中文标题: 门店信息管理
模块路径: maintain/basic
API路径: maintain/web/basic/dealerInfo

【字段列表】
字段名      | 中文名称   | 类型   | 控件类型       | 搜索 | 可见
-----------|-----------|--------|--------------|------|------
storeName  | 门店名称   | string | el-input     | ✓    | ✓
storeCode  | 门店编码   | string | el-input     | ✓    | ✓
region     | 所属区域   | string | fetch-select | ✓    | ✓
openDate   | 开业时间   | string | date-picker  | ✓    | ✓
enabled    | 是否启用   | boolean| radio-group  | ✗    | ✓

【注意事项】
⚠️ region 字段需要补充枚举代码
⚠️ 路由将自动添加到 src/router/index.js

确认生成？(y/n/调整字段)
```

Wait for user confirmation before proceeding.

---

### Step 5: Read Latest Template Files

**CRITICAL**: Before generating any code, ALWAYS read these template files from **project root directory** to match current project standards:

- `templates/index.vue` - List page template
- `templates/edit.vue` - Edit page template (high-level mode for advanced scenarios)
- `templates/api.js` - API template

**Template location**: `{projectRoot}/templates/`

Example paths:
- `d:\ais\app-ais-sales-front\templates\index.vue`
- `d:\ais\app-ais-sales-front\templates\edit.vue`
- `d:\ais\app-ais-sales-front\templates\api.js`

This ensures generated code matches latest project patterns and avoids "free-form" generation.

---

### Step 6: Generate Files Directly

Create three files based on module configuration:

#### 6.1 API File: `src/api/{modulePath}/index.js`

**CRITICAL - API Path Rule**:
The API path follows: `{firstSegment}/web/{restOfPath}/`
- **Example**: `modulePath:maintain/basic/dealerWorkTeam` → `apiPath:maintain/web/basic/dealerWorkTeam`
- The `web` segment is inserted AFTER the first `/` separator

Follow this pattern:
```javascript
import api from '@/axios';
const prefix = '{apiPath}/';

export function getList (data) { return api.jsonPost(prefix + 'page', data); }
export function addOrUpdate (data) { return api.jsonPost(prefix + 'addOrUpdate', data); }
export function deleteItem (data) { return api.jsonPost(prefix + 'delete', data); }
export function getDetail (data) { return api.jsonPost(prefix + 'get', data); }
export function enableItem (data) { return api.jsonPost(prefix + 'enableOrDisable', data); }
```

**Path transformation examples**:
- `maintain/basic/dealerWorkTeam` → `maintain/web/basic/dealerWorkTeam/`
- `datacenter/vehicle/serviceProxy` → `datacenter/web/vehicle/serviceProxy/`
- `vehwholesale/basic/dealerInfo` → `vehwholesale/web/basic/dealerInfo/`

#### 6.2 List Page: `src/views/{modulePath}/index.vue`

Key elements:
- Search form with responsive layout (2 visible + expandable)
- LPVxeTable component with pagination
- Action buttons: 新增, 导入, 导出, 批量删除, 批量启用/停用
- Table columns based on visible fields
- First column as link to edit page
- Operations column: 编辑, 删除

Field type mapping for search form:
- Date fields: `el-date-picker` with `type="daterange"`
- Select fields: `fetch-select` with `enumCode` placeholder
- Boolean fields: `fetch-select` with `yes_no_enum`
- Normal fields: `el-input`

#### 6.3 Edit Page: `src/views/{modulePath}/edit.vue`

Key elements:
- Use `edit-base-container` component for consistent layout
- Form validation rules
- Field type mapping for edit form:
  - Date fields: `el-date-picker` (single date)
  - Select fields: `fetch-select`
  - Boolean fields: `el-radio-group`
  - Array fields: `EditTable` component for sub-tables
  - Normal fields: `el-input`

#### 6.4 Insert Routes

Read `src/router/index.js` and insert two routes after the last child route of the 'index' route:

**List Route**:
```javascript
{
  path: '/{modulePath}',
  name: '{moduleName}',
  component: () => import('@/views/{modulePath}/index.vue'),
  meta: {
    name: '{title}',
    keepAlive: true
  }
}
```

**Edit Route**:
```javascript
{
  path: '/{modulePath}/edit',
  name: '{moduleName}Edit',
  component: () => import('@/views/{modulePath}/edit.vue'),
  meta: {
    name: '{title}详情',
    noResourceUrl: 'true'
  }
}
```

---

### Step 7: Post-Generation

**Report**:
- ✅ Files created successfully
- ⚠️ Manual steps needed (enums, permissions)
- 🔍 Testing checklist

**Verify**:
- Run `npm run local/sit`
- Test CRUD operations
- Check permission buttons

---

## Project Context

**Tech Stack**: Vue 2.6 + Vue Router + Vuex + Element UI + VXE Table

**Code Style**:
- 2 spaces indentation
- Semicolons after statements
- Spaces around function parentheses: `function name () {}`
- BEM naming for CSS classes
- Use theme color: `var(--leap-color-primary)`

**Component Priority**:
- Prefer `@/libs/components` over `element-ui`
- Use `LPVxeTable` for data tables
- Use `FetchSelect` for remote search
- Use `PageSearchAction` for search forms

**API Integration**:
- All APIs return data directly (no code checking needed)
- Use `api.jsonPost` for POST requests with JSON body
- Response format: `{ records: [], total: 0 }` for list pages

**File Organization**:
```
src/
├── api/{modulePath}/
│   └── index.js          # API functions
└── views/{modulePath}/
    ├── index.vue         # List page
    └── edit.vue          # Edit page
```

**Module Naming**:
- Module name: PascalCase (`DealerInfo`)
- Module path: lowercase with slashes (`maintain/basic/dealerInfo`)
- **API path**: `{firstSegment}/web/{restOfPath}/`
  - **Critical**: Insert `web` after first `/` separator
  - Example: `maintain/basic/dealerWorkTeam` → `maintain/web/basic/dealerWorkTeam/`

**Route Format**: `/{business}/{module}/{feature}`

---

## Error Handling

### Validation Checks

Before generation:
1. ✅ Module name is valid (alphanumeric, no special chars)
2. ✅ Field names are valid (not Vue reserved words)
3. ✅ At least one field defined
4. ✅ Parent directory exists (if path specified)

### Common Errors

**Module name conflict**:
```
检测到模块 'DealerInfo' 已存在
建议替代名称: DealerInfoDetail, DealerInfoExt, StoreDealerInfo
```

**Invalid field name**:
```
字段 'name' 与 Vue 保留字冲突
已自动重命名为 'itemName'
```

**Path not found**:
```
路径 'unknown/path' 不存在
现有路径: maintain/basic, maintain/sp, sparepart/basic
请选择现有路径或创建新路径
```

**Generation failure**:
```
代码生成失败: [error details]
配置文件已保存至: bin/generate.json.debug
请检查配置或手动运行: node bin/generate.js <path>
```

---

## Advanced Features

### Field Grouping

For main-detail table scenarios:
- Detect fields with `type: "array"`
- Prompt: "检测到子表字段，是否生成主子表编辑页？"
- If yes, generate with EditTable component

### Enum Suggestions

For select-type fields, suggest common enum codes:
- `status` → suggest `StatusEnum`
- `type` → suggest module-specific enum
- Allow user to specify enum code

### Custom Field Attributes

Allow overrides in conversation:
```
用户: region 字段改为不可搜索
用户: openDate 改为单日期选择器
用户: 添加 address 字段，不可见
```

---

## Mustache Variables

**Critical variables**:
- `{{{apiPath}}}` - **API path with `web` inserted** (Use in API files!)
  - Example: `maintain/basic/dealerWorkTeam` → `{{{apiPath}}}` = `maintain/web/basic/dealerWorkTeam`
  - Template: `const prefix = '{{{apiPath}}}/';`
- `{{{modulePath}}}` - Full module path (use in file paths and routes)
- `{{{name}}}` - **Module name in PascalCase** (first letter lowercase)
  - Example: `dealerWorkTeam`
- `{{{nameCamelCase}}}` - **Module name in lower camelCase** (first letter lowercase - CRITICAL!)
  - Example: `dealerWorkTeam`
  - ⚠️ **CRITICAL**: When generating code, ALWAYS ensure this outputs lower camelCase (first letter lowercase)
  - ✅ Correct: `moduleKey: 'AISMC-dealerWorkTeam'`
  - ❌ Wrong: `moduleKey: 'AISMC-DealerWorkTeam'`
  - Use for: `moduleKey`, route names, component names

**Field variables**:
- `{{{key}}}` - Field identifier
- `{{{description}}}` - Chinese display name
- `{{{type}}}` - Data type
- `{{{format}}}` - Optional format
- `{{{visible}}}` - Boolean: is field visible
- `{{{searchable}}}` - Boolean: is field searchable

**Conditional helpers** (inferred by field type):
- `{{{isDate}}}` - Date/time field
- `{{{isSelect}}}` - Select/dropdown field
- `{{{isBoolean}}}` - Boolean field
- `{{{isNormal}}}` - Normal text field

**Loop helpers**:
- `{{{#cols}}}` ... `{{{\/cols}}}` - All fields
- `{{{#searchList}}}` ... `{{{\/searchList}}}` - Searchable fields
- `{{{#visible}}}` ... `{{{\/visible}}}` - Visible fields
- `{{{#isFirst}}}` ... `{{{\/isFirst}}}` - First field only

---

## References

For template structure and detailed field type inference, see:
- [references/template-guide.md](references/template-guide.md) - Template variables and structure
- [references/inference-rules.md](references/inference-rules.md) - Field type inference rules
