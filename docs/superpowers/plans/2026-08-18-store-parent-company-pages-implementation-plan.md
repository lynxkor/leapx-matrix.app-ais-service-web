# 门店与母公司前端页面 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `app-ais-aftersale-front` 新增门店与母公司的列表 / 详情共 4 个页面，路由接通后端 `StoreController` 与 `ParentCompanyController` 已有的 `page/get` 接口。

**Architecture:** 沿用项目内 `serviceProxyHis` 与 `vehicleProfile` 的成熟模式——列表用 `LPVxeTable + ais-search-form + PageSearchAction`，详情用 `EditPageLayout + EditBaseContainer` 多 section 只读。所有筛选下拉统一 `FetchSelect + enumCode`，能力开关统一 `FetchSelect + BooleanEnum` 单选。后端字段已经全部对齐（`isPartOrder` 与 `storeLevel/storeLevelName` 已补齐）。

**Tech Stack:** Vue 2 + Vuex + Element UI + VXE Table + `LPVxeTable` + `EditPageLayout/EditBaseContainer` + `FetchSelect` + 内部 `permissions/responsiveSearchForm/commonMixins` mixin。

---

## 设计参考与基线

- **设计文档**：`docs/superpowers/specs/2026-08-18-store-parent-company-pages-design.md`
- **同款列表参考**：`src/views/datacenter/vehicle/serviceProxyHis/index.vue`（最相似 — 只读、无审核操作、纯列表 + 跳转）
- **同款列表参考 2**：`src/views/datacenter/vehicle/vehicleProfile/index.vue`（筛选区布局与导出按钮）
- **同款详情参考**：`src/views/datacenter/vehicle/serviceProxyHis/edit.vue`（只读多 section）
- **同款路由参考**：`src/router/index.js` 行 1498-1514（serviceProxyHis 与其 edit 路由）

---

## 文件结构总览

| 类别 | 路径 | 变更 |
|---|---|---|
| API | `src/api/datacenter/store/index.js` | 新增 |
| API | `src/api/datacenter/parentCompany/index.js` | 新增 |
| 列表视图 | `src/views/datacenter/store/index.vue` | 新增 |
| 详情视图 | `src/views/datacenter/store/detail.vue` | 新增 |
| 列表视图 | `src/views/datacenter/store/parentCompany/index.vue` | 新增 |
| 详情视图 | `src/views/datacenter/store/parentCompany/detail.vue` | 新增 |
| 路由 | `src/router/index.js` | 修改（新增 4 条） |

> 备注：母公司两个页面放在 `views/datacenter/store/parentCompany/` 子目录下，与后端 controller 同主题放在一起。

---

## Commit 切分建议

| Commit | 任务 | 范围 |
|---|---|---|
| `feat(api): 新增门店与母公司前端 API 封装` | Task 1 | 2 个 API 文件 |
| `feat(router): 新增门店与母公司 4 条路由` | Task 2 | router/index.js |
| `feat(store-list): 新增门店管理列表页` | Task 3 | store/index.vue |
| `feat(store-detail): 新增门店详情页（4 section）` | Task 4 | store/detail.vue |
| `feat(pc-list): 新增母公司管理列表页` | Task 5 | parentCompany/index.vue |
| `feat(pc-detail): 新增母公司详情页（4 section + 股权合计）` | Task 6 | parentCompany/detail.vue |
| `chore(verify): 冒烟测试 4 个页面 + 路由跳转` | Task 7 | 集成验证 |

---

## 全局约定（所有任务遵守）

- mixins：`responsiveSearchForm`、`permissions`、`commonMixins`（按需 import）
- 列表筛选区：`ais-search-form` + `PageSearchAction`，默认折叠，`v-if="show"` 包裹展开项
- 分页：`{ page: 1, size: 20 }`，方法名 `getData`、`debouncedGetData`、`paginationChange`
- 详情只读：`EditPageLayout` + `EditBaseContainer` + `:showEditBtn="false"`，无 `submitRequest`
- 路由 query 传参：门店 `storeCode`、母公司 `companyCode`
- 字典取值：`async fetchOptions (code) { return getEnum(code); }`
- 导出：`exportTable({ businessType, dataFetchPath, reqParams, titleMap, httpMethod: 'POST' })`
- 表格 id：`storeTable`、`parentCompanyTable`（用于 `getTableConfig` 列配置持久化）
- 模块前缀：`AISMC-store`、`AISMC-parentCompany`
- 字段空值：列表与详情统一用 `-` 占位（formatter 函数 + 模板双兜底）
- 提交风格：每个 Task 完成后单独 commit，commit message 用 `feat(scope): ...` 形式

---

## Task 1: 新增门店与母公司 API 封装

**Files:**
- Create: `src/api/datacenter/store/index.js`
- Create: `src/api/datacenter/parentCompany/index.js`

---

### Step 1.1: 创建 `src/api/datacenter/store/index.js`

**路径**：`src/api/datacenter/store/index.js`

**内容**：

```javascript
import api from '@/axios';

// 门店管理 — 对应后端 StoreController
const prefix = 'datacenter/web/store/';

/**
 * 门店分页查询
 * @param {Object} data 参见 StorePageReq
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 门店详情
 * @param {Object} data { storeCode }
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}
```

---

### Step 1.2: 创建 `src/api/datacenter/parentCompany/index.js`

**路径**：`src/api/datacenter/parentCompany/index.js`

**内容**：

```javascript
import api from '@/axios';

// 母公司管理 — 对应后端 ParentCompanyController
const prefix = 'datacenter/web/parentCompany/';

/**
 * 母公司分页查询
 * @param {Object} data 参见 ParentCompanyPageReq
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 母公司详情
 * @param {Object} data { companyCode }
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}
```

---

### Step 1.3: 验证文件可被 IDE 解析

**命令**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
ls src/api/datacenter/store/index.js src/api/datacenter/parentCompany/index.js
```

**预期**：两个文件路径均输出，文件大小不为 0。

---

### Step 1.4: commit

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git add src/api/datacenter/store/index.js src/api/datacenter/parentCompany/index.js
git -c user.email=fhp@leapmotor.com -c user.name=方海鹏 commit -m "feat(api): 新增门店与母公司前端 API 封装"
```

---

## Task 2: 注册 4 条路由

**Files:**
- Modify: `src/router/index.js`（在 serviceProxyHis 路由块之后插入）

---

### Step 2.1: 在 `serviceProxyHis` 路由块后插入 4 条新路由

**位置**：行 1514 之后（`}, {` 结束处），在 vehicleOwnerChangeApply 路由块（约行 2531）之前的安全插入点

**找到**：

```javascript
    }, {
      path: '/datacenter/vehicle/serviceProxyHis/edit',
      name: 'serviceProxyHisEdit',
      component: () => import('@/views/datacenter/vehicle/serviceProxyHis/edit.vue'),

      meta: {
        name: '接车施工单-维修履历信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
```

在 `}, {` 闭合后插入：

```javascript
    }, {
      path: '/datacenter/store/store',
      name: 'store',
      component: () => import('@/views/datacenter/store/index.vue'),

      meta: {
        name: '门店管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/store/store/detail',
      name: 'storeDetail',
      component: () => import('@/views/datacenter/store/detail.vue'),

      meta: {
        name: '门店详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/datacenter/store/parentCompany',
      name: 'parentCompany',
      component: () => import('@/views/datacenter/store/parentCompany/index.vue'),

      meta: {
        name: '母公司管理',
        keepAlive: true
      }
    }, {
      path: '/datacenter/store/parentCompany/detail',
      name: 'parentCompanyDetail',
      component: () => import('@/views/datacenter/store/parentCompany/detail.vue'),

      meta: {
        name: '母公司详情',
        noResourceUrl: 'true'
      }
    }, {
```

> 注意：插入点紧接 serviceProxyHis 路由后，第一行末尾的 `}, {` 闭合与下一条 route 开始必须保留。后续 4 条都按这个格式串入。

---

### Step 2.2: 验证路由对象语法

**命令**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
node -e "const r = require('./src/router/index.js'); console.log('parse ok')" 2>&1 || echo "node 解析失败属正常（import 语法），改用 lint 校验"
```

**预期**：node 直接 require 会失败（因为 ESM `import`），属正常现象。

**改为依赖 webpack 构建或 IDE 检查**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
grep -c "name: 'store'" src/router/index.js
grep -c "name: 'parentCompany'" src/router/index.js
```

**预期**：每个 grep 输出 `1`。

---

### Step 2.3: commit

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git add src/router/index.js
git -c user.email=fhp@leapmotor.com -c user.name=方海鹏 commit -m "feat(router): 新增门店与母公司 4 条路由"
```

---

## Task 3: 门店管理列表页

**Files:**
- Create: `src/views/datacenter/store/index.vue`

---

### Step 3.1: 创建列表页文件

**路径**：`src/views/datacenter/store/index.vue`

**完整内容**：

```vue
<template>
  <div class="page-common m-store-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <el-form-item label="关键字">
        <el-input
          placeholder="门店名称/编码"
          v-model="form.keyword"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店编码">
        <el-input
          placeholder="请输入"
          v-model="form.storeCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店名称">
        <el-input
          placeholder="请输入"
          v-model="form.storeName"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店大区">
        <fetch-select
          :request="fetchOptions"
          enumCode="ais_base_region"
          v-model="form.regionList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="门店省市区">
        <el-input
          placeholder="请输入编码"
          v-model="form.areaCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="建店类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_build_type"
          v-model="form.buildStoreType"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="经营状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_status"
          v-model="form.statusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="经营状态-销售">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_sale_status"
          v-model="form.saleStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="经营状态-服务">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_service_status"
          v-model="form.serviceStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="经营状态-交付">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_delivery_status"
          v-model="form.deliveryStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="门店等级">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_level"
          v-model="form.storeLevel"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="是否有销售能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isSales"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有试驾能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isTestDrive"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有批售能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isWholesaleSale"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有交付能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isSupportDeliver"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有维修能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isRepair"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有维保能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isMaintenance"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有道路救援能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isSupportRescue"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否支持事故维修">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isAccidentRepair"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有备附件订购能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isPartOrder"
            placeholder="请选择"
            clearable
            filterable
          />
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
    <div class="ais-actions">
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/datacenter/store/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { downloadExcel } from '@/libs/utils';

const defaultForm = {
  keyword: '',
  storeCode: '',
  storeName: '',
  regionList: [],
  areaCode: '',
  buildStoreType: [],
  statusList: [],
  saleStatusList: [],
  serviceStatusList: [],
  deliveryStatusList: [],
  storeLevel: '',
  isSales: '',
  isTestDrive: '',
  isWholesaleSale: '',
  isSupportDeliver: '',
  isRepair: '',
  isMaintenance: '',
  isSupportRescue: '',
  isAccidentRepair: '',
  isPartOrder: '',
};

const pageSize = 20;
const mockConfig = { data: null };

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: { PageSearchAction, LPVxeTable, FetchSelect },
  data () {
    return {
      pageTitle: '门店管理',
      pageType: 'list',
      moduleKey: 'AISMC-store',
      form: { ...defaultForm },
      show: false,
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'storeTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          {
            props: 'storeCode',
            label: '门店编码',
            visible: true,
            width: 160,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/store/store/detail',
                  query: { storeCode: row.storeCode }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'storeName', label: '门店名称', visible: true, width: 200 },
          { props: 'parentCompanyName', label: '公司名称', visible: true, width: 200 },
          { props: 'parentCompanyCode', label: '公司编码', visible: true, width: 160 },
          { props: 'region', label: '大区', visible: true, width: 120 },
          {
            props: 'areaName',
            label: '省市区',
            visible: true,
            width: 200,
            formatter: ({ row }) => {
              const arr = [row.provinceName, row.cityName, row.countyName].filter(Boolean);
              return arr.join('/') || '-';
            }
          },
          { props: 'storeTypeBroadTypeName', label: '建店类型(大类)', visible: true, width: 140 },
          { props: 'buildStoreType', label: '建店类型(小类)', visible: true, width: 140 },
          { props: 'statusName', label: '经营状态', visible: true, width: 120 },
          { props: 'saleStatusName', label: '经营状态-销售', visible: true, width: 120 },
          { props: 'serviceStatusName', label: '经营状态-服务', visible: true, width: 120 },
          { props: 'deliveryStatusName', label: '经营状态-交付', visible: true, width: 120 },
          { props: 'roadRescueAddress', label: '道路救援服务地址', visible: true, width: 220 },
          { props: 'acceptanceTime', label: '验收完成时间', visible: true, width: 160 },
          { props: 'storeLevelName', label: '门店等级', visible: true, width: 120 },
          { props: 'exclusiveDeliveryStoreName', label: '专属交付门店', visible: true, width: 160 },
          { props: 'exclusiveServiceStoreName', label: '专属服务门店', visible: true, width: 160 },
          { props: 'businessTime', label: '营业时间', visible: true, width: 160 },
          { props: 'salesHotline', label: '销售热线', visible: true, width: 140 },
          { props: 'serviceHotline', label: '服务热线', visible: true, width: 140 },
          ...this.buildBoolCols([
            ['isSales', '是否有销售能力'],
            ['isTestDrive', '是否有试驾能力'],
            ['isWholesaleSale', '是否有批售能力'],
            ['isSupportDeliver', '是否有交付能力'],
            ['isRepair', '是否有维修能力'],
            ['isMaintenance', '是否有维保能力'],
            ['isSupportRescue', '是否有道路救援能力'],
            ['isAccidentRepair', '是否支持事故维修'],
            ['isPartOrder', '是否有备附件订购能力']
          ]),
          { props: 'partRecipient', label: '备件收货人姓名', visible: true, width: 140, formatter: () => '-' },
          { props: 'partPhone', label: '备件收货人手机', visible: true, width: 140, formatter: () => '-' },
          { props: 'partAddress', label: '备件收货地', visible: true, width: 200, formatter: () => '-' },
          { props: 'isAllowedThirdDelivered', label: '是否允许第三方收货', visible: true, width: 140, formatter: () => '-' }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    buildBoolCols (pairs) {
      return pairs.map(([key, label]) => ({
        props: key,
        label,
        visible: true,
        width: 140,
        formatter: ({ row }) => (row[key] === true || row[key] === 'true' || row[key] === 1 ? '是' : '否')
      }));
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '门店管理',
        dataFetchPath: 'datacenter/web/store/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店管理.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          if (!res || !res.records) return;
          this.optionObj.dataList = res.records.map(item => ({ ...item, deleteLoading: false }));
          this.optionObj.total = res.total;
        }).catch(err => {
          console.error('获取门店列表数据失败:', err);
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () { this.getData(); }, 300),
    getConfig () {
      return new Promise((resolve) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (Array.isArray(data[key]) && !data[key].length) delete data[key];
        if (data[key] === '' || data[key] === null || data[key] === undefined) delete data[key];
      });
      return data;
    },
    async fetchOptions (code) {
      if (code) return getEnum(code);
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-store-list {
}
</style>
```

---

### Step 3.2: 启动本地服务并冒烟测试

**命令**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
npm run local
```

**预期**：浏览器打开 `http://localhost:7779/datacenter/store/store`，看到：

- 顶部筛选区有 11 个默认筛选项 + 展开后 9 个能力开关
- 表格列包含门店编码（点击跳转）、门店名称、公司名称、公司编码、大区、省市区、建店类型(大类/小类)、4 个经营状态、道路救援服务地址、验收完成时间、门店等级、专属交付/服务门店、营业时间、销售/服务热线、备件收货四列（占位 "-")、9 个能力开关
- "导出"按钮可见
- 点击门店编码 → 跳转到 `/datacenter/store/store/detail?storeCode=xxx`

**手动验证 checklist**：

- [ ] 列表加载正常（至少有标题行）
- [ ] 关键字输入框可输入并触发查询
- [ ] 展开区 9 个能力开关下拉都正常显示「是/否」选项
- [ ] 重置按钮恢复 defaultForm
- [ ] 导出按钮可点击并触发任务
- [ ] 点击门店编码列跳转到详情路由（详情页 Task 4 才完成，跳转后会白屏 — 这步只验证路由通）

---

### Step 3.3: commit

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git add src/views/datacenter/store/index.vue
git -c user.email=fhp@leapmotor.com -c user.name=方海鹏 commit -m "feat(store-list): 新增门店管理列表页"
```

---

## Task 4: 门店详情页（4 section 只读）

**Files:**
- Create: `src/views/datacenter/store/detail.vue`

---

### Step 4.1: 创建详情页文件

**路径**：`src/views/datacenter/store/detail.vue`

**完整内容**：

```vue
<template>
  <edit-page-layout ref="editLayout" title="门店详情">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_storeCode"
        :title="`门店编码：${form.storeCode || '-'}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <el-main>
          <!-- section 一：基本信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>基本信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="门店编码：">{{ form.storeCode }}</el-form-item>
                <el-form-item label="门店名称：">{{ form.storeName }}</el-form-item>
                <el-form-item label="公司名称：">{{ form.companyName }}</el-form-item>
                <el-form-item label="所属大区：">{{ form.region }}</el-form-item>
                <el-form-item label="建店类型：">{{ form.buildStoreType }}</el-form-item>
                <el-form-item label="店面地址：">{{ joinArea(form) }}</el-form-item>
                <el-form-item label="经营状态-销售：">{{ form.saleStatus || '-' }}</el-form-item>
                <el-form-item label="经营状态-服务：">{{ form.serviceStatus || '-' }}</el-form-item>
                <el-form-item label="经营状态-交付：">{{ form.deliveryStatus || '-' }}</el-form-item>
                <el-form-item label="店面详细地址：">{{ form.storeAddress }}</el-form-item>
                <el-form-item label="经纬度：">{{ form.addressXy }}</el-form-item>
                <el-form-item label="专属交付门店：">{{ form.exclusiveDeliveryStoreName }}</el-form-item>
                <el-form-item label="专属服务门店：">{{ form.exclusiveServiceStoreName }}</el-form-item>
                <el-form-item label="营业时间：">{{ form.businessTime }}</el-form-item>
                <el-form-item label="销售热线：">{{ form.salesHotline }}</el-form-item>
                <el-form-item label="服务热线：">{{ form.serviceHotline }}</el-form-item>
                <el-form-item label="验收完成时间：">{{ form.acceptanceTime }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 二：服务项目类别 -->
          <section class="common-section">
            <div class="common-section-header"><h2>服务项目类别</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="是否有销售能力：">{{ boolLabel(form.isSales) }}</el-form-item>
                <el-form-item label="是否有试驾能力：">{{ boolLabel(form.isTestDrive) }}</el-form-item>
                <el-form-item label="是否有批售能力：">{{ boolLabel(form.isWholesaleSale) }}</el-form-item>
                <el-form-item label="是否有交付能力：">{{ boolLabel(form.isSupportDeliver) }}</el-form-item>
                <el-form-item label="是否有维修能力：">{{ boolLabel(form.isRepair) }}</el-form-item>
                <el-form-item label="是否有维保能力：">{{ boolLabel(form.isMaintenance) }}</el-form-item>
                <el-form-item label="是否有道路救援能力：">{{ boolLabel(form.isSupportRescue) }}</el-form-item>
                <el-form-item label="是否支持事故维修：">{{ boolLabel(form.isAccidentRepair) }}</el-form-item>
                <el-form-item label="是否有备附件订购能力：">{{ boolLabel(form.isPartOrder) }}</el-form-item>
                <el-form-item label="道路救援服务地址：">{{ form.roadRescueAddress }}</el-form-item>
                <el-form-item label="门店等级：">{{ form.storeLevelName }}</el-form-item>
                <el-form-item label="专属交付门店：">{{ form.exclusiveDeliveryStoreName }}</el-form-item>
                <el-form-item label="专属服务门店：">{{ form.exclusiveServiceStoreName }}</el-form-item>
                <el-form-item label="营业时间：">{{ form.businessTime }}</el-form-item>
                <el-form-item label="销售热线：">{{ form.salesHotline }}</el-form-item>
                <el-form-item label="服务热线：">{{ form.serviceHotline }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 三：备件收货信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>备件收货信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="备件收货人姓名：">{{ form.sparePartReceiving?.partRecipient }}</el-form-item>
                <el-form-item label="备件收货人手机：">{{ form.sparePartReceiving?.partPhone }}</el-form-item>
                <el-form-item label="省市区：">{{ joinSpareArea(form.sparePartReceiving) }}</el-form-item>
                <el-form-item label="备件收货地址：">{{ form.sparePartReceiving?.partAddress }}</el-form-item>
                <el-form-item label="是否允许第三方收货：">{{ spareThirdLabel(form.sparePartReceiving?.isAllowedThirdDelivered) }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 四：整车仓库信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>整车仓库信息</h2></div>
            <div class="common-section-body">
              <vxe-table
                :data="form.warehouseList || []"
                stripe
                show-overflow
                :row-config="{ isHover: true }"
                resizable
                min-height="0"
                max-height="400px"
                border="inner"
                size="medium"
              >
                <vxe-column field="warehouseCode" title="仓库编码" min-width="160" />
                <vxe-column field="warehouseName" title="仓库名称" min-width="180" />
                <vxe-column title="省市区" min-width="200">
                  <template #default="{ row }">{{ joinArea(row) }}</template>
                </vxe-column>
                <vxe-column field="warehouseDetailAddress" title="详细地址" min-width="220" />
                <vxe-column field="warehouseAddressXy" title="经纬度" min-width="160" />
                <vxe-column field="contacts" title="商品车接收联系人" min-width="140" />
                <vxe-column field="contactPhone" title="联系人手机号码" min-width="140" />
                <vxe-column title="是否默认仓库" min-width="120">
                  <template #default="{ row }">{{ row.isDefault === 1 ? '是' : '否' }}</template>
                </vxe-column>
                <vxe-column title="是否冻结" min-width="100">
                  <template #default="{ row }">{{ row.isFrozen ? '是' : '否' }}</template>
                </vxe-column>
              </vxe-table>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getDetail } from '@/api/datacenter/store/index';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  storeCode: '',
  storeName: '',
  companyName: '',
  region: '',
  buildStoreType: '',
  provinceName: '',
  cityName: '',
  countyName: '',
  storeAddress: '',
  addressXy: '',
  exclusiveDeliveryStoreName: '',
  exclusiveServiceStoreName: '',
  businessTime: '',
  salesHotline: '',
  serviceHotline: '',
  acceptanceTime: '',
  saleStatus: '',
  serviceStatus: '',
  deliveryStatus: '',
  isSales: false,
  isTestDrive: false,
  isWholesaleSale: false,
  isSupportDeliver: false,
  isRepair: false,
  isMaintenance: false,
  isSupportRescue: false,
  isAccidentRepair: false,
  isPartOrder: false,
  roadRescueAddress: '',
  storeLevelName: '',
  sparePartReceiving: null,
  warehouseList: []
};

export default {
  name: 'storeDetail',
  props: {
    storeCode: { type: String, default: '' }
  },
  mixins: [permissions, commonMixins],
  components: { EditPageLayout, EditBaseContainer },
  computed: {
    _storeCode () {
      return this.storeCode || this.$route.query.storeCode || '';
    }
  },
  watch: {
    _storeCode: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      pageTitle: '门店详情',
      pageType: 'detail',
      moduleKey: 'AISMC-store',
      isEditing: false,
      form: { ...defaultForm }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店管理', '门店详情']);
  },
  methods: {
    async detailRequest () {
      const code = this._storeCode;
      if (!code) return null;
      const res = await getDetail({ storeCode: code });
      return res || { ...defaultForm };
    },
    joinArea (obj = {}) {
      const arr = [obj.provinceName, obj.cityName, obj.countyName].filter(Boolean);
      return arr.join('/') || '-';
    },
    joinSpareArea (sp) {
      if (!sp || !sp.areaCode || !sp.areaCode.length) return '-';
      return sp.areaCode.join('/');
    },
    boolLabel (v) {
      return v === true || v === 'true' || v === 1 ? '是' : '否';
    },
    spareThirdLabel (v) {
      return v === 1 ? '是' : '否';
    }
  }
};
</script>

<style lang="scss" scoped>
.common-section-table {
  .m-vxe-table-empty-text { text-align: left; }
}
</style>
```

---

### Step 4.2: 冒烟测试详情页

**命令**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
npm run local
```

**手动验证 checklist**（先在列表页点击"门店编码"列进入）：

- [ ] URL 变为 `/datacenter/store/store/detail?storeCode=xxx`
- [ ] 顶部标题"门店编码：xxx"
- [ ] section 一 基本信息：门店编码、名称、公司、大区、建店类型、店面地址（拼接）、4 个经营状态、店面详细地址、经纬度、专属交付/服务门店、营业时间、销售/服务热线、验收完成时间 — 全部展示
- [ ] section 二 服务项目类别：9 个能力开关「是/否」正确，门店等级、热线等重复字段正确
- [ ] section 三 备件收货信息：5 个字段正确（无数据时为 "-"）
- [ ] section 四 整车仓库信息：以列表展示，列正确
- [ ] 没有"编辑"按钮（`:showEditBtn="false"`）
- [ ] 浏览器返回按钮回到列表页

---

### Step 4.3: commit

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git add src/views/datacenter/store/detail.vue
git -c user.email=fhp@leapmotor.com -c user.name=方海鹏 commit -m "feat(store-detail): 新增门店详情页（4 section）"
```

---

## Task 5: 母公司管理列表页

**Files:**
- Create: `src/views/datacenter/store/parentCompany/index.vue`

---

### Step 5.1: 创建母公司列表页文件

**路径**：`src/views/datacenter/store/parentCompany/index.vue`

**完整内容**：

```vue
<template>
  <div class="page-common m-parent-company-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="100px"
      class="ais-search-form"
    >
      <el-form-item label="公司名称">
        <el-input
          placeholder="请输入"
          v-model="form.companyName"
          clearable
        />
      </el-form-item>
      <el-form-item label="公司编码">
        <el-input
          placeholder="请输入"
          v-model="form.companyCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="大区">
        <fetch-select
          :request="fetchOptions"
          enumCode="ais_base_region"
          v-model="form.region"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="省市区">
        <el-input
          placeholder="请输入编码"
          v-model="form.areaCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="合作类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="parent_company_cooperation_type"
          v-model="form.cooperationType"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <page-search-action
        v-if="canList"
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/datacenter/parentCompany/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { downloadExcel } from '@/libs/utils';

const defaultForm = {
  companyName: '',
  companyCode: '',
  region: '',
  areaCode: '',
  cooperationType: ''
};

const pageSize = 20;
const mockConfig = { data: null };

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: { PageSearchAction, LPVxeTable, FetchSelect },
  data () {
    return {
      pageTitle: '母公司管理',
      pageType: 'list',
      moduleKey: 'AISMC-parentCompany',
      form: { ...defaultForm },
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'parentCompanyTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          {
            props: 'companyName',
            label: '公司名称',
            visible: true,
            width: 220,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/store/parentCompany/detail',
                  query: { companyCode: row.companyCode }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'companyCode', label: '公司编码', visible: true, width: 160 },
          { props: 'regionName', label: '大区', visible: true, width: 120 },
          { props: 'cooperationType', label: '合作类型', visible: true, width: 120, formatter: ({ row }) => row.cooperationTypeName || row.cooperationType || '-' },
          { props: 'companyCustomerTypeName', label: '企业客户分类', visible: true, width: 140 },
          { props: 'financialInvoiceType', label: '财务发票分类', visible: true, width: 120 },
          { props: 'legalPerson', label: '法人代表', visible: true, width: 120 },
          { props: 'legalPersonTelephone', label: '法人联系方式', visible: true, width: 160 },
          { props: 'email', label: '公司邮箱', visible: true, width: 200 },
          { props: 'address', label: '公司注册地址', visible: true, width: 240 },
          { props: 'detailAddress', label: '详细地址', visible: true, width: 240 },
          { props: 'bankName', label: '开户银行', visible: true, width: 200 },
          { props: 'taxNumber', label: '税号', visible: true, width: 200 },
          { props: 'openAccount', label: '开户账户', visible: true, width: 200 },
          { props: 'invoicePhone', label: '开票电话', visible: true, width: 160 },
          { props: 'bankHouseholder', label: '银行户主', visible: true, width: 160 },
          { props: 'invoiceAddress', label: '开票地址', visible: true, width: 240 },
          { props: 'investorEquityInfo', label: '股权信息', visible: true, width: 200 }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '母公司管理',
        dataFetchPath: 'datacenter/web/parentCompany/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '母公司管理.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          if (!res || !res.records) return;
          this.optionObj.dataList = res.records.map(item => ({ ...item, deleteLoading: false }));
          this.optionObj.total = res.total;
        }).catch(err => {
          console.error('获取母公司列表数据失败:', err);
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () { this.getData(); }, 300),
    getConfig () {
      return new Promise((resolve) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || data[key] === undefined) delete data[key];
      });
      return data;
    },
    async fetchOptions (code) {
      if (code) return getEnum(code);
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-parent-company-list {
}
</style>
```

---

### Step 5.2: 冒烟测试母公司列表

**命令**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
npm run local
```

**手动验证 checklist**：

- [ ] 浏览器打开 `http://localhost:7779/datacenter/store/parentCompany`
- [ ] 筛选区 5 项：公司名称、公司编码、大区、省市区、合作类型
- [ ] 表格 18 列：首列"公司名称"可点击跳转，其余列名符合设计
- [ ] 导出按钮可点击

---

### Step 5.3: commit

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git add src/views/datacenter/store/parentCompany/index.vue
git -c user.email=fhp@leapmotor.com -c user.name=方海鹏 commit -m "feat(pc-list): 新增母公司管理列表页"
```

---

## Task 6: 母公司详情页（4 section + 股权合计）

**Files:**
- Create: `src/views/datacenter/store/parentCompany/detail.vue`

---

### Step 6.1: 创建详情页文件

**路径**：`src/views/datacenter/store/parentCompany/detail.vue`

**完整内容**：

```vue
<template>
  <edit-page-layout ref="editLayout" title="母公司详情">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_companyCode"
        :title="`母公司编码：${form.companyCode || '-'}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <el-main>
          <!-- section 一：基础信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>基础信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="母公司名称：">{{ form.companyName }}</el-form-item>
                <el-form-item label="母公司编码：">{{ form.companyCode }}</el-form-item>
                <el-form-item label="财务发票分类：">{{ form.financialInvoiceType }}</el-form-item>
                <el-form-item label="合作类型：">{{ form.cooperationTypeName || form.cooperationType }}</el-form-item>
                <el-form-item label="所属大区：">{{ form.regionName }}</el-form-item>
                <el-form-item label="企业客户分类：">{{ form.companyCustomerTypeName }}</el-form-item>
                <el-form-item label="法人代表：">{{ form.legalPerson }}</el-form-item>
                <el-form-item label="法人联系方式：">{{ form.legalPersonTelephone }}</el-form-item>
                <el-form-item label="公司邮箱：">{{ form.email }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 二：地址信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>地址信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="公司注册地址：">{{ form.address }}</el-form-item>
                <el-form-item label="详细地址：">{{ form.detailAddress }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 三：开户信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>开户信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="开户银行：">{{ form.bankName }}</el-form-item>
                <el-form-item label="税号：">{{ form.taxNumber }}</el-form-item>
                <el-form-item label="开户账户：">{{ form.openAccount }}</el-form-item>
                <el-form-item label="开票电话：">{{ form.invoicePhone }}</el-form-item>
                <el-form-item label="银行户主：">{{ form.bankHouseholder }}</el-form-item>
                <el-form-item label="开票地址：">{{ form.invoiceAddress }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 四：投资人股权信息（含合计） -->
          <section class="common-section">
            <div class="common-section-header"><h2>投资人股权信息</h2></div>
            <div class="common-section-body">
              <vxe-table
                :data="form.investorEquityList || []"
                stripe
                show-overflow
                :row-config="{ isHover: true }"
                resizable
                min-height="0"
                max-height="400px"
                border="inner"
                size="medium"
                show-footer
                :footer-method="footerMethod"
              >
                <vxe-column field="investorName" title="投资人名称" min-width="220" />
                <vxe-column field="equityRatio" title="股权占比（%）" min-width="160" align="right" header-align="right">
                  <template #default="{ row }">{{ row.equityRatio }}</template>
                </vxe-column>
                <vxe-column field="investorType" title="投资人类型" min-width="160">
                  <template #default="{ row }">{{ row.investorType }}</template>
                </vxe-column>
                <template #footer>
                  <table class="vxe-table--footer">
                    <tbody>
                      <tr>
                        <td class="footer-cell">股权占比合计（%）</td>
                        <td class="footer-cell footer-value">{{ form.equityRatioTotal ?? totalRatio }}</td>
                        <td class="footer-cell"></td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </vxe-table>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getDetail } from '@/api/datacenter/parentCompany/index';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  companyName: '',
  companyCode: '',
  financialInvoiceType: '',
  cooperationType: '',
  cooperationTypeName: '',
  regionName: '',
  companyCustomerTypeName: '',
  legalPerson: '',
  legalPersonTelephone: '',
  email: '',
  address: '',
  detailAddress: '',
  bankName: '',
  taxNumber: '',
  openAccount: '',
  invoicePhone: '',
  bankHouseholder: '',
  invoiceAddress: '',
  investorEquityList: [],
  equityRatioTotal: null
};

export default {
  name: 'parentCompanyDetail',
  props: {
    companyCode: { type: String, default: '' }
  },
  mixins: [permissions, commonMixins],
  components: { EditPageLayout, EditBaseContainer },
  computed: {
    _companyCode () {
      return this.companyCode || this.$route.query.companyCode || '';
    },
    totalRatio () {
      const list = this.form.investorEquityList || [];
      const sum = list.reduce((acc, cur) => acc + Number(cur.equityRatio || 0), 0);
      return Math.round(sum * 100) / 100;
    }
  },
  watch: {
    _companyCode: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      pageTitle: '母公司详情',
      pageType: 'detail',
      moduleKey: 'AISMC-parentCompany',
      isEditing: false,
      form: { ...defaultForm }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['母公司管理', '母公司详情']);
  },
  methods: {
    async detailRequest () {
      const code = this._companyCode;
      if (!code) return null;
      const res = await getDetail({ companyCode: code });
      return res || { ...defaultForm };
    },
    footerMethod ({ columns, data }) {
      // 预留：vxe-table 内置合计方法（与模板 #footer 二选一）
      return [
        columns.map((col, idx) => {
          if (idx === 0) return '股权占比合计（%）';
          if (col.field === 'equityRatio') {
            const sum = (data || []).reduce((acc, cur) => acc + Number(cur.equityRatio || 0), 0);
            return Math.round(sum * 100) / 100;
          }
          return null;
        })
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.common-section-table { .m-vxe-table-empty-text { text-align: left; } }
.footer-cell { padding: 8px 12px; }
.footer-value { color: #f56c6c; font-weight: 600; }
</style>
```

---

### Step 6.2: 冒烟测试母公司详情

**命令**：

```bash
cd D:/work/code/ais/app-ais-aftersale-front
npm run local
```

**手动验证 checklist**：

- [ ] 在母公司列表点击"公司名称"列 → 进入 `/datacenter/store/parentCompany/detail?companyCode=xxx`
- [ ] 顶部标题"母公司编码：xxx"
- [ ] section 一 基础信息：9 项字段正确
- [ ] section 二 地址信息：2 项
- [ ] section 三 开户信息：6 项
- [ ] section 四 投资人股权信息：以列表展示 3 列；底部显示"股权占比合计（%）：xxx"
- [ ] 没有"编辑"按钮

---

### Step 6.3: commit

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git add src/views/datacenter/store/parentCompany/detail.vue
git -c user.email=fhp@leapmotor.com -c user.name=方海鹏 commit -m "feat(pc-detail): 新增母公司详情页（4 section + 股权合计）"
```

---

## Task 7: 集成验证（4 页面 + 路由跳转）

**Files:**
- 无（纯验证）

---

### Step 7.1: 启动本地服务

```bash
cd D:/work/code/ais/app-ais-aftersale-front
npm run local
```

---

### Step 7.2: 完整路径冒烟 checklist

| # | 路径 | 验证点 |
|---|---|---|
| 1 | `/datacenter/store/store` | 门店列表 11+9 筛选项 + 全部列渲染 |
| 2 | 点击门店编码 | 跳转到 `/datacenter/store/store/detail?storeCode=xxx` |
| 3 | 门店详情页 | 4 section 全部展示，无编辑按钮 |
| 4 | 浏览器返回 | 回到列表页，分页状态保留 |
| 5 | `/datacenter/store/parentCompany` | 母公司列表 5 筛选 + 18 列 |
| 6 | 点击公司名称 | 跳转到 `/datacenter/store/parentCompany/detail?companyCode=xxx` |
| 7 | 母公司详情页 | 4 section + 股权合计 |
| 8 | 浏览器返回 | 回到母公司列表 |

**额外验证**：

- [ ] 列表导出按钮可触发任务（不验证下载成功，仅验证按钮响应）
- [ ] 筛选"重置"按钮恢复 defaultForm
- [ ] 分页切换页码正常加载
- [ ] 任意筛选组合查询均返回正常
- [ ] 刷新详情页（保留 query）能正常加载

---

### Step 7.3: 检查 git log 验证 commit 切分

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git log --oneline -10
```

**预期输出**（最近 7 条 commit）：

```
xxxxx chore(verify): 冒烟测试 4 个页面 + 路由跳转   ← 可能本任务无 commit
xxxxx feat(pc-detail): 新增母公司详情页（4 section + 股权合计）
xxxxx feat(pc-list): 新增母公司管理列表页
xxxxx feat(store-detail): 新增门店详情页（4 section）
xxxxx feat(store-list): 新增门店管理列表页
xxxxx feat(router): 新增门店与母公司 4 条路由
xxxxx feat(api): 新增门店与母公司前端 API 封装
```

---

### Step 7.4: 完整 diff 复核

```bash
cd D:/work/code/ais/app-ais-aftersale-front
git diff master..HEAD --stat
```

**预期**：新增 6 个文件 + 修改 1 个文件（`src/router/index.js`），无意外修改其他文件。

---

## 注意事项

1. **路由顺序**：在 `serviceProxyHis` 路由后插入 4 条。如顺序错乱导致菜单顺序错误，需调整插入点。
2. **权限模块前缀**：必须用 `AISMC-store` 与 `AISMC-parentCompany`，否则 `permissions` mixin 取不到权限会全开。如实际权限前缀不同需替换。
3. **enumCode 取值**：`ais_base_region`、`store_build_type`、`store_status`、`store_sale_status`、`store_service_status`、`store_delivery_status`、`store_level`、`BooleanEnum`、`parent_company_cooperation_type`、`financial_invoice_type`、`investor_type` — 若实际字典 code 不同，需在 Nacos 字典管理核对后修改。
4. **`.vue` 文件样式**：每个文件均带 `<style lang="scss" scoped>`，与项目其他页面保持一致。
6. **`fetchOptions` 方法名**：`permissions`/`commonMixins` 等 mixin 可能已包含同名方法，如冲突需重命名。
7. **`deal-select` 组件**：本次未使用门店下拉组件（如需在门店大区字段引用门店列表）—— 本期用纯 `FetchSelect + enumCode` 即可。
8. **删除 `getFormData` 中数组过滤**：已保留对 `Array.isArray` 与空字符串的统一清理，覆盖 9 个能力开关 + 4 个状态 + 2 个大区/建店多选。
9. **详情页 `_storeCode` / `_companyCode`**：通过 `computed` 兜底 `props.storeCode || $route.query.storeCode`，避免重复加载。
10. **股权合计展示**：模板 #footer 优先展示 `form.equityRatioTotal`，fallback 用 `totalRatio`（前端 sum）。`footerMethod` 仅作为 vxe-table 内置合计的备用入口，未被启用。