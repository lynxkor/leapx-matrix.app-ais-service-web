# app-ais-aftersale-front

Vue 2.6 微前端子应用 | 技术栈: Vue Router + Vuex + Element UI + VXE Table | 端口: 7779

## 基本原则
### 1. 编码前思考

**不要假设。不要隐藏困惑。呈现权衡。**

LLM 经常默默选择一种解释然后执行。这个原则强制明确推理：

- **明确说明假设** — 如果不确定，询问而不是猜测
- **呈现多种解释** — 当存在歧义时，不要默默选择
- **适时提出异议** — 如果存在更简单的方法，说出来
- **困惑时停下来** — 指出不清楚的地方并要求澄清

### 2. 简洁优先

**用最少的代码解决问题。不要过度推测。**

对抗过度工程的倾向：

- 不要添加要求之外的功能
- 不要为一次性代码创建抽象
- 不要添加未要求的"灵活性"或"可配置性"
- 不要为不可能发生的场景做错误处理
- 如果 200 行代码可以写成 50 行，重写它

**检验标准：** 资深工程师会觉得这过于复杂吗？如果是，简化。

### 3. 精准修改

**只碰必须碰的。只清理自己造成的混乱。**

编辑现有代码时：

- 不要"改进"相邻的代码、注释或格式
- 不要重构没坏的东西
- 匹配现有风格，即使你更倾向于不同的写法
- 如果注意到无关的死代码，提一下 —— 不要删除它

当你的改动产生孤儿代码时：

- 删除因你的改动而变得无用的导入/变量/函数
- 不要删除预先存在的死代码，除非被要求

**检验标准：** 每一行修改都应该能直接追溯到用户的请求。

### 4. 目标驱动执行

**定义成功标准。循环验证直到达成。**

将指令式任务转化为可验证的目标：

| 不要这样做... | 转化为... |
|--------------|-----------------|
| "添加验证" | "为无效输入编写测试，然后让它们通过" |
| "修复 bug" | "编写重现 bug 的测试，然后让它通过" |
| "重构 X" | "确保重构前后测试都能通过" |

对于多步骤任务，说明一个简短的计划：

```
1. [步骤] → 验证: [检查]
2. [步骤] → 验证: [检查]
3. [步骤] → 验证: [检查]
```

## 规范
- 缩进2空格，语句加分号，函数括号前后有空格，文件最后必须有一个换行符
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

## 架构规范（强制）
- 列表页（`index.vue`）+ 明细/编辑页（`edit.vue`）开发前必读 `.claude/skills/frontend-architecture-rules/skill.md`
- 代码评审按该 skill §8 检查清单执行（L1-L14 列表 + E1-E10 编辑 + A1-A4 API）
- 列表页与编辑页 `moduleKey` 必须保持一致
- 状态枚举集中在 `<page>/constants.js`，禁止页面硬编码
- 通用模式（搜索表单骨架、optionObj、双 form、EditBaseContainer 等）以 skill 为准，不在本文件重复粘贴
