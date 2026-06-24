---
name: gen-module
description: Intelligent Vue module generator for AIS frontend projects. Use this skill when users need to create new Vue modules with list pages, edit pages, and API files. Supports three modes: (1) Document-Driven mode - provide Confluence requirement URL + YAPI interface URL + specific requirement, auto-extracts fields via MCP (recommended for 80%+ cases), (2) Direct JSON configuration - provide complete config object with path, list, and title, or (3) Conversational mode - provide module details through natural language. Automatically infers field types (dates, selects, booleans, numbers), generates code based on project templates, and auto-inserts routes. **ALWAYS reads latest templates before generation to ensure consistency.**
---

## Quick Start

> **推荐使用 Way 1（文档驱动模式）**，覆盖 80%+ 真实业务场景。仅当无文档时回退到 Way 2/3。

**Way 1: Document-Driven Mode** (推荐)

```
/gen-module 需求 https://wiki-intra.leapmotor.com/pages/viewpage.action?pageId=97821126
          接口 https://itdev-yapi.leapmotor.com/project/96/interface/api/19659
          完成 1、厅店工位信息需求开发
```

**Way 2: Direct Configuration**

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

**Way 3: Conversational Mode**

1. Module name (lowerCamelCase, e.g., `dealerInfo`)
2. Chinese title (e.g., `门店信息管理`)
3. Module path (optional, e.g., `maintain/basic`)
4. Field definitions (natural language / JSON / Swagger)

## 输入模式决策表

| 用户输入特征 | 模式 | 跳转 |
|---|---|---|
| 含 Confluence URL + YAPI URL | Way 1 文档驱动 | Step 1A |
| 含完整 JSON `{path, list, title}` | Way 2 直接配置 | Step 4 预览 |
| 仅模块名 / 字段描述 | Way 3 对话模式 | Step 1B |

---

## Workflow

### Step 0: Detect Input Mode

按上方决策表检查用户输入，进入对应分支。三种模式殊途同归，最终都汇入 Step 4 预览。

### Step 1A: Document-Driven Field Extraction (Way 1)

调用 MCP 工具解析 Confluence 需求文档和 YAPI 接口定义，自动提炼字段。

**详细规则**（URL 正则、字段映射表、API Path 推导）：见 [references/workflow-document-driven.md](references/workflow-document-driven.md)。本步骤加载该文件。

完成后产出与 Way 2 同格式的字段列表，进入 Step 3。

### Step 1B: Collect Module Information (Way 3 only)

按顺序询问：
1. **Module name** - lowerCamelCase (e.g., `dealerInfo`)
2. **Chinese title** - 页面显示名 (e.g., `门店信息管理`)
3. **Module path** - 可选带斜杠 (e.g., `maintain/basic`)

### Step 2: Parse Field Definitions (Way 2/3 only)

支持自然语言、JSON Object、JSON Array、Swagger/OpenAPI 四种输入。详见 [references/inference-rules.md](references/inference-rules.md)。

### Step 3: Apply Type Inference

对每个字段：
1. 优先用显式类型
2. 按 key/description 模式推断（date/select/boolean/number）
3. 设置 searchable / visible 默认值
4. 排序

**详细推断规则**：见 [references/inference-rules.md](references/inference-rules.md)。

### Step 3.5: Form Mode Selection

**默认 `isProForm = true`**（生成 `<edit-page-layout>` + `<edit-base-container>` + 详情态切换 + 子表区）。

仅当用户明确要求"简单模式 / page-common-add / 单表单无详情态 / 字段少于 3 个且无审核日志"时切换为 `false`。

**Step 4 预览时必须显示当前 Form Mode**，允许用户在生成前切换。

### Step 4: Preview Configuration

展示完整预览，等待用户确认：

```
【即将生成的配置】
模块名称: dealerStation
中文标题: 厅店工位信息
模块路径: maintain/basic/dealerStation
API路径: maintain/web/basic/dealerStation
Form Mode: ProForm (EditBaseContainer)  ← 默认；如需简单模式请说明

【字段列表】
字段名      | 中文名称   | 类型   | 控件类型       | 搜索 | 可见
-----------|-----------|--------|--------------|------|------
code       | 工位代码   | string | el-input     | ✗    | ✓ (跳详情)
name       | 工位名称   | string | el-input     | ✓    | ✓
stationType| 工位类型   | int    | fetch-select | ✓    | ✓
status     | 状态      | int    | fetch-select | ✓    | ✓
dealerName | 门店名称   | string | el-input     | ✓    | ✓
remark     | 说明      | string | el-input     | ✗    | ✓
createTime | 创建时间   | date   | date-picker  | ✓    | ✓

【查询条件三段式分桶】
top2 (始终可见): name, dealerName
third (大屏可见): stationType
last (展开可见): status, createTime

【操作按钮】
新增 / 导出 / 批量删除 / 批量启用 / 批量停用

【注意事项】
⚠️ stationType / status 字段需要补充枚举代码
⚠️ 路由将自动添加到 src/router/index.js

确认生成？(y/n/调整字段/切换为简单模式)
```

### Step 5: Read Latest Template Files

**CRITICAL**：生成代码前必读项目级模板（**不在技能包内**）：

- `{projectRoot}/templates/index.vue`
- `{projectRoot}/templates/edit.vue`
- `{projectRoot}/templates/api.js`

示例路径：`d:\ais\app-ais-marketing-front\templates\`、`d:\ais\app-ais-sales-front\templates\`。

### Step 6: Generate Files

> ⚠️ **Step 6.2 / 6.3 生成任何 `<fetch-select>` 前，必读 [references/fetch-select-patterns.md](references/fetch-select-patterns.md)**，按字段场景匹配对应模式（A/B/C/D/E），照搬代码风格。

#### 6.1 API File: `src/api/{modulePath}/index.js`

遵循 [references/project-conventions.md](references/project-conventions.md) 的 **API Path Rule**（`{firstSegment}/web/{restOfPath}/`）。

模板：
```javascript
import api from '@/axios';
const prefix = '{apiPath}/';

export function getList (data) { return api.jsonPost(prefix + 'page', data); }
export function addOrUpdate (data) { return api.jsonPost(prefix + 'addOrUpdate', data); }
export function deleteItem (data) { return api.jsonPost(prefix + 'delete', data); }
export function getDetail (data) { return api.jsonPost(prefix + 'get', data); }
export function enableItem (data) { return api.jsonPost(prefix + 'enableOrDisable', data); }
```

#### 6.2 List Page: `src/views/{modulePath}/index.vue`

关键约束（**严格遵守**）：

- **三段式查询表单**：`top2SearchList` (前 2，无 v-show) / `thirdSearchList` (第 3，每项独立 `v-show="this.visibleCount === 3 || show"`) / `lastSearchList` (≥4，整体包 `<template v-if="show">`)。详细规则见 [references/template-guide.md](references/template-guide.md) "Search Form Three-Segment Layout"
- `mixins` 必须含 `responsiveSearchForm`（提供 `visibleCount`）
- `data()` 必须含 `show: false`
- `el-date-picker` 必须含 `unlink-panels`
- 首列跳转目标统一为 `/{modulePath}/edit`
- `getFormData()` 必须含 `data.sortColumns = this.sortColumns;`
- 操作列：编辑、删除（删除带二次确认）
- 行动按钮：新增 / 导出 / 批量删除 / 批量启用 / 批量停用

#### 6.3 Edit Page: `src/views/{modulePath}/edit.vue`

默认 **ProForm 模式**：`<edit-page-layout>` + `<edit-base-container>` + 双表单（编辑/详情切换）+ 可选子表区。

字段控件映射：
- Date → `el-date-picker`（单日期）
- Select → `fetch-select`（参见 patterns.md）
- Boolean → `el-radio-group`
- Array → `EditTable`（子表）
- Normal → `el-input`
- Jump Link → 详情态(`form-detail`)命中常见跳转实体时渲染为 `<el-link>`，其余区（编辑/搜索/列表/子表）为 `el-input`（详见 [references/jump-link-patterns.md](references/jump-link-patterns.md)）

#### 6.4 Insert Routes

读取 `src/router/index.js`，在 `name: 'index'` 路由的 `children` 数组末尾插入两条路由。

**命名规则**：严格遵循 [references/project-conventions.md](references/project-conventions.md) 的 **Naming Convention**（全部 lowerCamelCase）。

```javascript
{
  path: '/{modulePath}',
  name: '{moduleName}',   // lowerCamelCase
  component: () => import('@/views/{modulePath}/index.vue'),
  meta: { name: '{title}', keepAlive: true }
},
{
  path: '/{modulePath}/edit',
  name: '{moduleName}Edit',
  component: () => import('@/views/{modulePath}/edit.vue'),
  meta: { name: '{title}详情', noResourceUrl: 'true' }
}
```

### Step 7: Post-Generation

报告：
- ✅ 已创建的文件
- ⚠️ 手动跟进事项（枚举字典、资源权限配置）
- 🔍 测试清单（`npm run local/sit`、CRUD 验证、权限按钮）

---

## Advanced Features

### Field Grouping

字段含 `type: "array"` 时，提示："检测到子表字段，是否生成主子表编辑页？" 确认后用 `EditTable` 组件生成。

### Custom Field Attributes

允许对话中调整：`region 字段改为不可搜索` / `openDate 改为单日期选择器` / `添加 address 字段，不可见`。

---

## References

| 文档 | 何时加载 |
|---|---|
| [references/workflow-document-driven.md](references/workflow-document-driven.md) | Step 1A 文档驱动模式（Way 1） |
| [references/inference-rules.md](references/inference-rules.md) | Step 3 字段类型推断 |
| [references/template-guide.md](references/template-guide.md) | Step 6.2/6.3 模板结构、Mustache 变量、三段式查询表单规则 |
| [references/fetch-select-patterns.md](references/fetch-select-patterns.md) | Step 6.2/6.3 生成任何 `<fetch-select>` 前 |
| [references/jump-link-patterns.md](references/jump-link-patterns.md) | Step 6.3 生成详情页 `form-detail` 前，判断字段是否为常见跳转实体 |
| [references/project-conventions.md](references/project-conventions.md) | Step 6 生成文件前的命名/API 路径/代码风格约束 |
