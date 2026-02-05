# Agent Guidelines for app-ais-aftersale-front

## Build & Development Commands

- `npm run local` - Start dev server (NODE_OPTIONS=--openssl-legacy-provider, port 7779)
- `npm run sit` - Build for SIT environment
- `npm run uat` - Build for UAT environment
- `npm run build` - Production build
- `npx eslint src/**/*.{js,vue}` - Run ESLint on staged files
- `npx lint-staged` - Run lint on staged files (pre-commit hook)

**No test framework configured** - Tests must be added separately if needed.

## Code Style & Formatting

### Indentation & Spacing
- 2 spaces for indentation (enforced by .editorconfig)
- Space before function parentheses: `function foo () {}`
- Space around operators: `a + b`, `a === b`
- Key spacing in objects: `{ key: value }` (no space before colon, space after)

### Semicolons & Punctuation
- Semicolons required after all statements
- Trailing commas in multiline objects/arrays only
- Files must end with newline character

### Quotes
- Prefer double quotes for strings: `"string"`
- Template literals for interpolation: `${variable}`

### Line Length & Structure
- Trim trailing whitespace
- Max line length not strictly enforced, but prefer < 120 chars

## Naming Conventions

### Variables & Functions
- camelCase: `userName`, `handleSubmit()`, `getList()`

### Components
- PascalCase: `UserList`, `EditDialog`, `PageSearchAction`
- Files: kebab-case: `user-list.vue`, `edit-dialog.vue`

### Directories
- kebab-case: `sparepart/warehouse/oemWarehouse/`

### Constants
- UPPER_SNAKE_CASE for true constants: `SPARE_PREFIX`, `VUE_APP_API_URL`

### API Functions
- Descriptive names: `getList`, `addOrUpdate`, `deleteItem`, `getDetail`, `enableItem`

## Import Guidelines

### Order
1. Third-party libraries
2. Internal libs (starting with `@/`)
3. Relative imports

### Style
```javascript
import Vue from 'vue';
import { Message } from 'element-ui';
import api from '@/axios';
import { paramsFilter } from '@/utils';
import Component from '@/components/Component.vue';
import localModule from './localModule';
```

### Alias
- `@` points to `src/`
- Use for all internal imports: `@/api/common.js`, `@/utils/index.js`

## Vue Component Guidelines

### Structure
```vue
<template>
  <!-- template content -->
</template>

<script>
export default {
  name: 'ComponentName',
  components: {},
  mixins: [],
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
/* styles */
</style>
```

### Props
- Define with types when possible: `props: { userId: { type: Number, required: true } }`

### Events
- Use kebab-case for event names: `@submit-form`, `@data-change`

## API Guidelines

### API File Structure
- Location: `src/api/[module]/[feature]/index.js`
- Pattern: Define constant prefix, export named functions

```javascript
import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

const prefix = SPARE_PREFIX + '/web/warehouse/oemWarehouse/';

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
```

### Request Methods
- `api.jsonPost(url, data)` - JSON POST request
- `api.get(url, params)` - GET request with query params
- `api.postExport(url, formData, config)` - File upload/download

## Error Handling

### Axios Interceptors
- Global error handling via `src/axios/index.js`
- Error codes: 200-299 (success), 600 (no data), 610 (token expired), 4xx/5xx (errors)
- Token expiry: commits USER_SIGN_OUT mutation
- Errors automatically show via Element UI Message

### Async/Await
```javascript
try {
  const res = await api.jsonPost(url, data);
  // handle success
} catch (error) {
  // error already logged by interceptor
  this.$message.error('Operation failed');
}
```

### Manual Error Display
```javascript
this.$message.error('Error message');
this.$message.success('Success message');
```

## State Management (Vuex)

### Module Structure
- Location: `src/store/modules/[moduleName].js`
- Export default state, mutations, actions, getters

### Usage
```javascript
// Component
this.$store.state.user.token
this.$store.commit('SET_TOKEN', newToken)
this.$store.dispatch('fetchUserData')

// Map helpers
import { mapState, mapActions } from 'vuex'
computed: { ...mapState('user', ['token']) }
methods: { ...mapActions('user', ['fetchUser']) }
```

## Router Guidelines

### Route Definition
```javascript
{
  path: '/sparepart/warehouse/oemWarehouse',
  name: 'oemWarehouse',
  component: () => import('@/views/sparepart/warehouse/oemWarehouse/index.vue'),
  meta: {
    name: 'OEM仓管理',
    requiresAuth: true,
    keepAlive: true
  }
}
```

### Navigation
- Programmatic: `this.$router.push('/path')`
- With params: `this.$router.push({ name: 'routeName', params: { id } })`
- With query: `this.$router.push({ path: '/path', query: { key: 'value' } })`

## Utility Functions

### Date Formatting
- Use moment.js: `moment(date).format('YYYY-MM-DD')`
- Or custom: `new Date().format('YYYY-MM-DD HH:mm:ss')` (Date prototype extension)

### Encryption
- `encrypt(data)`, `decrypt(data)` - for backend communication
- `encryptUC(data)`, `decryptUC(data)` - for user center

### Common Utils (src/utils/index.js)
- `paramsFilter(params)` - Remove falsy values (keep 0 and null)
- `formatDateTime(val, type)` - Format dates ('data', 'datetime', 'time')
- `getSourceUrl(options)` - Get resource URLs recursively
- `downloadFile(url, fileName)` - Trigger file download
- `getAreaInfo(districtCode)` - Get province/city/district info

## ESLint Rules (Notable)

- `no-debugger`: Disabled in production
- `no-console`: Allowed but logs stripped in production
- `no-unused-vars`: Warning level
- `camelcase`: Disabled
- `vue/multi-word-component-names`: Disabled
- `no-warning-comments`: Warn on TODO/FIXME comments
- `prefer-const`: Off (let is allowed)
- `no-else-return`: Off
- `eqeqeq`: Always use strict equality

## Architecture Notes

### Micro-Frontend
- Sub-app for qiankun micro-frontend
- Entry points: `bootstrap()`, `mount(props)`, `unmount()`
- Exports as UMD library
- Global public path handled via `public-path.js`

### Build Configuration
- Webpack externals: Vue, Vuex, VueRouter, axios (production)
- Filename includes app version query param
- Moment locales: Only zh-cn kept
- Console logs removed in production

### Dependencies
- Vue 2.6.11, Vue Router 3.1.5, Vuex 3.1.2
- Element UI (@leapmotor/element-ui)
- VXE Table & VXE PC UI
- Axios 0.19.0
- Lodash 4.17.21
- Moment.js 2.30.1

## Git Workflow

- Pre-commit hook runs `npx lint-staged`
- Lints staged `.js` and `.vue` files via ESLint
- Always ensure code passes linting before commit
