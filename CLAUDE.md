# app-ais-aftersale-front

Vue 2.6 微前端子应用 | 技术栈: Vue Router + Vuex + Element UI + VXE Table | 端口: 7779

## 规范
- 缩进2空格，语句加分号，函数括号前后有空格
- 样式变量: `@/libs/assets/style/variables.scss` | BEM命名 | 主题色 `var(--leap-color-primary)`
- 组件优先级: `@/libs/components` > element-ui

## API
```javascript
import api from '@/axios';
const prefix = 'module/web/api/';

export function getList (data) { return api.jsonPost(prefix + 'page', data); }
export function addOrUpdate (data) { return api.jsonPost(prefix + 'addOrUpdate', data); }
export function deleteItem (data) { return api.jsonPost(prefix + 'delete', data); }
export function getDetail (data) { return api.jsonPost(prefix + 'get', data); }
```

请求方法: `api.post` / `api.jsonPost` / `api.get` / `api.delete` / `api.put`
请求参数：如果是单个参数，则直接放到body中，即 `getDetail(id)`，而不是`getDetail({id})`
响应: 使用api封装后的方法调用成功会直接返回data，不再包含code信息，无需判断code

## 路由
path: `/业务/模块/功能` | name: `{模块名}` / `{模块名}Detail` / `{模块名}Edit`
meta: `{ name, keepAlive, requiresAuth, noResourceUrl }`

## 组件 (@/libs/components)
- `FetchSelect` - 远程搜索
- `EditTable` - 可编辑表格

## 页面模板
```vue
<!-- 列表页 -->
<div class="page-common">
  <el-form :inline="true" :model="form" class="ais-search-form">
    <page-search-action @submit="onSubmit" @reset="onReset" />
  </el-form>
  <div class="ais-actions">
    <el-button @click="handleAdd">新增</el-button>
  </div>
  <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page :option-obj="optionObj" :get-config="getConfig" />
</div>

<!-- 编辑页 -->
<edit-base-container :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form" :submitRequest="submitRequest" :detailRequest="detailRequest">
  <el-form :model="form" :rules="rules" ref="ruleForm"></el-form>
</edit-base-container>
```

## 目录
```
src/
├── api/        # API接口
├── axios/      # 请求封装
├── libs/       # 共享库
│   ├── components/
│   └── utils/
├── views/      # 页面
└── router/     # 路由
```

## 运行
`npm run local` | `npm run sit` | `npm run build`
