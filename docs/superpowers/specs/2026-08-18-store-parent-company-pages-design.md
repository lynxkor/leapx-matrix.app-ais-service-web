# 门店与母公司前端页面 — 设计文档

- 日期：2026-08-18
- 作者：方海鹏 / Claude（brainstorming 协作产出）
- 适用范围：`app-ais-aftersale-front`
- 后端依赖：`app-ais-datacenter`（已就绪 — `StoreController`、`ParentCompanyController`）

## 1. 背景与目标

`app-ais-datacenter` 已上线两个 PC 端管理接口：门店管理（`StoreController`）与母公司管理（`ParentCompanyController`），但售后前端 `app-ais-aftersale-front` 还没有对应的可视化页面。本期目标是新增四个页面：

1. 门店列表 — 多条件筛选 + 分页 + 导出
2. 门店详情 — 多 section 只读展示
3. 母公司列表 — 多条件筛选 + 分页 + 导出
4. 母公司详情 — 多 section 只读展示（含投资人股权列表与合计）

风格对齐项目内已有页面（`vehicleProfile`、`serviceDealerChangeApply`、`serviceProxyHis`）。

## 2. 路由与文件结构

### 2.1 路由

新增 4 条路由到 `src/router/index.js`，参照 `serviceProxyHis`（行 1498-1514）：

```js
{
  path: '/datacenter/store/store',
  name: 'store',
  component: () => import('@/views/datacenter/store/index.vue'),
  meta: { name: '门店管理', keepAlive: true }
}, {
  path: '/datacenter/store/store/detail',
  name: 'storeDetail',
  component: () => import('@/views/datacenter/store/detail.vue'),
  meta: { name: '门店详情', noResourceUrl: 'true' }
}, {
  path: '/datacenter/store/parentCompany',
  name: 'parentCompany',
  component: () => import('@/views/datacenter/store/parentCompany/index.vue'),
  meta: { name: '母公司管理', keepAlive: true }
}, {
  path: '/datacenter/store/parentCompany/detail',
  name: 'parentCompanyDetail',
  component: () => import('@/views/datacenter/store/parentCompany/detail.vue'),
  meta: { name: '母公司详情', noResourceUrl: 'true' }
}
```

> 说明：路径前缀用 `/datacenter/store/store` 与 `/datacenter/store/parentCompany`，对应后端 controller 的 `RequestMapping("/web/store")` 与 `RequestMapping("/web/parentCompany")`。

### 2.2 文件清单

| 类型 | 路径 |
|---|---|
| 新增 | `src/api/datacenter/store/index.js` |
| 新增 | `src/api/datacenter/parentCompany/index.js` |
| 新增 | `src/views/datacenter/store/index.vue` |
| 新增 | `src/views/datacenter/store/detail.vue` |
| 新增 | `src/views/datacenter/store/parentCompany/index.vue` |
| 新增 | `src/views/datacenter/store/parentCompany/detail.vue` |
| 修改 | `src/router/index.js` |

> 备注：母公司列表与详情放在 `views/datacenter/store/parentCompany/` 子目录下，与后端 controller 同主题放在一起。

## 3. API 封装

### 3.1 `src/api/datacenter/store/index.js`

```js
import api from '@/axios';
const prefix = 'datacenter/web/store/';

export function getList (data) { return api.jsonPost(prefix + 'page', data); }
export function getDetail (data) { return api.jsonPost(prefix + 'get', data); }
```

### 3.2 `src/api/datacenter/parentCompany/index.js`

```js
import api from '@/axios';
const prefix = 'datacenter/web/parentCompany/';

export function getList (data) { return api.jsonPost(prefix + 'page', data); }
export function getDetail (data) { return api.jsonPost(prefix + 'get', data); }
```

### 3.3 调用约定

- 列表：`POST datacenter/web/store/page` 入参 `{ pageNum, pageSize, ...筛选字段 }`，出参 `{ records, total, totalPage }`（沿用 `PageResult`）。
- 门店详情：`POST datacenter/web/store/get` 入参 `{ storeCode }`，出参 `StoreDetailResp`。
- 母公司详情：`POST datacenter/web/parentCompany/get` 入参 `{ companyCode }`，出参 `ParentCompanyDetailResp`。

## 4. 门店列表（`store/index.vue`）

### 4.1 模块前缀与权限

- `moduleKey = 'AISMC-store'`
- 通过 `permissions` mixin 自动产出 `canList`、`canDetail`、`canExport` 等布尔位
- 列表首列按钮驱动详情跳转，不展示额外"操作"列

### 4.2 筛选区（默认折叠，点击展开）

| 表单项 | 控件 | 绑定字段 | 后端字段 |
|---|---|---|---|
| 关键字 | `el-input` | `form.keyword` | `keyword` |
| 门店编码 | `el-input` | `form.storeCode` | `storeCode` |
| 门店名称 | `el-input` | `form.storeName` | `storeName` |
| 门店大区 | `FetchSelect` enumCode=`ais_base_region` multiple | `form.regionList` | `regionList` |
| 门店省市区 | `el-cascader`（静态 province/city/district） | `form.areaCode` | `areaCode` |
| 建店类型 | `FetchSelect` enumCode=`store_build_type` multiple | `form.buildStoreType` | `buildStoreType` |
| 经营状态 | `FetchSelect` enumCode=`store_status` multiple | `form.statusList` | `statusList` |
| 经营状态-销售 | `FetchSelect` enumCode=`store_sale_status` multiple | `form.saleStatusList` | `saleStatusList` |
| 经营状态-服务 | `FetchSelect` enumCode=`store_service_status` multiple | `form.serviceStatusList` | `serviceStatusList` |
| 经营状态-交付 | `FetchSelect` enumCode=`store_delivery_status` multiple | `form.deliveryStatusList` | `deliveryStatusList` |
| 门店等级 | `FetchSelect` enumCode=`store_level` | `form.storeLevel` | `storeLevel` |
| 是否有销售能力 | `FetchSelect` enumCode=`BooleanEnum` | `form.isSales` | `isSales` |
| 是否有试驾能力 | `FetchSelect` enumCode=`BooleanEnum` | `form.isTestDrive` | `isTestDrive` |
| 是否有批售能力 | `FetchSelect` enumCode=`BooleanEnum` | `form.isWholesaleSale` | `isWholesaleSale` |
| 是否有交付能力 | `FetchSelect` enumCode=`BooleanEnum` | `form.isSupportDeliver` | `isSupportDeliver` |
| 是否有维修能力 | `FetchSelect` enumCode=`BooleanEnum` | `form.isRepair` | `isRepair` |
| 是否有维保能力 | `FetchSelect` enumCode=`BooleanEnum` | `form.isMaintenance` | `isMaintenance` |
| 是否有道路救援能力 | `FetchSelect` enumCode=`BooleanEnum` | `form.isSupportRescue` | `isSupportRescue` |
| 是否支持事故维修 | `FetchSelect` enumCode=`BooleanEnum` | `form.isAccidentRepair` | `isAccidentRepair` |
| 是否有备附件订购能力 | `FetchSelect` enumCode=`BooleanEnum` | `form.isPartOrder` | `isPartOrder` |

> 备注：9 个能力开关均绑定到 `StorePageReq` 已支持的 Boolean 字段（`isPartOrder` 已由后端补齐）。所有能力筛选控件统一用 `FetchSelect` + `BooleanEnum` 单选，避免与"是否"语义不一致；空值表示"不限"。

**FetchSelect + BooleanEnum 模板**（9 个能力筛选项均沿用此模板，仅 `v-model` 不同）：

```html
<fetch-select
  :request="fetchOptions"
  enumCode="BooleanEnum"
  v-model="form.isSales"
  placeholder="请选择"
  clearable
  filterable
/>
```

### 4.3 列表字段

| 列 | 字段 | 数据源 |
|---|---|---|
| 门店编码（首列、点击跳转） | `props: 'storeCode', buttons: [...]` | `storeCode` |
| 门店名称 | `storeName` | `storeName` |
| 公司名称 | `parentCompanyName` | `parentCompanyName` |
| 公司编码 | `parentCompanyCode` | `parentCompanyCode` |
| 大区 | `regionName` | `region` |
| 省市区 | `areaName` | `provinceName + '/' + cityName + '/' + countyName`（前端拼） |
| 建店类型(大类) | `storeTypeBroadTypeName` | `storeTypeBroadTypeName` |
| 建店类型(小类) | `buildStoreType` | `buildStoreType` |
| 经营状态 | `statusName` | `statusName` |
| 经营状态-销售 | `saleStatusName` | `saleStatusName` |
| 经营状态-服务 | `serviceStatusName` | `serviceStatusName` |
| 经营状态-交付 | `deliveryStatusName` | `deliveryStatusName` |
| 9 个能力开关（销售/试驾/批售/交付/维修/维保/救援/事故维修/备附件订购） | `formatter` 把布尔映射成"是/否" | `isXxx` |
| 道路救援服务地址 | `roadRescueAddress` | `roadRescueAddress` |
| 验收完成时间 | `acceptanceTime` | `acceptanceTime` |
| 门店等级 | `storeLevelName` | `storeLevelName` |
| 专属交付门店 | `exclusiveDeliveryStoreName` | `exclusiveDeliveryStoreName` |
| 专属服务门店 | `exclusiveServiceStoreName` | `exclusiveServiceStoreName` |
| 营业时间 | `businessTime` | `businessTime` |
| 销售热线 | `salesHotline` | `salesHotline` |
| 服务热线 | `serviceHotline` | `serviceHotline` |
| 备件收货人姓名 | `partRecipient` | 列表接口不返回，显示 "-" |
| 备件收货人手机 | `partPhone` | 列表接口不返回，显示 "-" |
| 备件收货地 | `partAddress` | 列表接口不返回，显示 "-" |
| 是否允许第三方收货 | `isAllowedThirdDelivered` | 列表接口不返回，显示 "-" |

> 备注：列表接口 `StorePageResp` 不返回备件收货相关字段，本期保留列名以便与详情对齐，但内容统一展示 `-`。

### 4.4 导出按钮

参照 `vehicleProfile/index.vue`：

- `businessType = '门店管理'`
- `dataFetchPath = 'datacenter/web/store/page'`
- 文件名：`门店管理.xlsx`
- 支持勾选导出（`selectionList`）

### 4.5 交互

- 点击"门店编码"列按钮 → `this.$router.push({ path: '/datacenter/store/store/detail', query: { storeCode: row.storeCode } })`
- 表格配置 `optionObj.id = 'storeTable'`
- 默认排序：按门店编码升序（后端 `sortFlag=1`），如未传则后端默认顺序

## 5. 门店详情（`store/detail.vue`）

### 5.1 整体结构

参照 `serviceProxyHis/edit.vue`：

- `EditPageLayout` `title="门店详情"` `ref="editLayout"`
- `EditBaseContainer` `:showEditBtn="false"` `:detailRequest="detailRequest"`
- `detailRequest = ({ storeCode }) => getDetail({ storeCode })`
- 标题显示 `门店编码：${form.storeCode || '-'}`

### 5.2 section 一：基本信息

| 字段 | 数据源 | 备注 |
|---|---|---|
| 门店编码 | `storeCode` | |
| 门店名称 | `storeName` | |
| 公司名称 | `companyName` | |
| 所属大区 | `region` | |
| 建店类型 | `buildStoreType` | |
| 店面地址 | `provinceName + '/' + cityName + '/' + countyName` | 拼接 |
| 经营状态 | 三态综合文本 | 取 `statusName`（若有） |
| 经营状态-销售 | `saleStatus` | 字典 label 来自 `getEnum('store_sale_status')` |
| 经营状态-服务 | `serviceStatus` | |
| 经营状态-交付 | `deliveryStatus` | |
| 店面详细地址 | `storeAddress` | |
| 经纬度 | `addressXy` | |
| 专属交付门店 | `exclusiveDeliveryStoreName` | |
| 专属服务门店 | `exclusiveServiceStoreName` | |
| 营业时间 | `businessTime` | |
| 销售热线 | `salesHotline` | |
| 服务热线 | `serviceHotline` | |
| 验收完成时间 | `acceptanceTime` | |

### 5.3 section 二：服务项目类别

| 字段 | 数据源 |
|---|---|
| 是否有销售能力 | `isSales` → 是/否 |
| 是否有试驾能力 | `isTestDrive` → 是/否 |
| 是否有批售能力 | `isWholesaleSale` → 是/否 |
| 是否有交付能力 | `isSupportDeliver` → 是/否 |
| 是否有维修能力 | `isRepair` → 是/否 |
| 是否有维保能力 | `isMaintenance` → 是/否 |
| 是否有道路救援能力 | `isSupportRescue` → 是/否 |
| 是否支持事故维修 | `isAccidentRepair` → 是/否 |
| 是否有备附件订购能力 | `isPartOrder` → 是/否 |
| 道路救援服务地址 | `roadRescueAddress` |
| 门店等级 | `storeLevelName` |
| 专属交付门店 | 同上 |
| 专属服务门店 | 同上 |
| 营业时间 | 同上 |
| 销售热线 | 同上 |
| 服务热线 | 同上 |

### 5.4 section 三：备件收货信息

| 字段 | 数据源 |
|---|---|
| 备件收货人姓名 | `sparePartReceiving.partRecipient` |
| 备件收货人手机 | `sparePartReceiving.partPhone` |
| 省市区 | `sparePartReceiving.areaCode`（list of code）→ 拼接展示 |
| 备件收货地址 | `sparePartReceiving.partAddress` |
| 是否允许第三方收货 | `sparePartReceiving.isAllowedThirdDelivered === 1 ? '是' : '否'` |

> 备注：`SparePartReceivingResp` 只含省市区 `code`，不返回 name。本期前端直接展示 code 拼接（如 `"330000/330100/330106"`）。如需 name 需后端补字段 — 本期不做。

### 5.5 section 四：整车仓库信息（列表）

vxe-table 渲染 `form.warehouseList`，列：

| 列 | 数据源 |
|---|---|
| 仓库编码 | `warehouseCode` |
| 仓库名称 | `warehouseName` |
| 省市区 | `provinceName + '/' + cityName + '/' + countyName` |
| 详细地址 | `warehouseDetailAddress` |
| 经纬度 | `warehouseAddressXy` |
| 商品车接收联系人 | `contacts` |
| 商品车接收联系人手机号码 | `contactPhone` |
| 是否默认仓库 | `isDefault === 1 ? '是' : '否'` |
| 是否冻结 | `isFrozen ? '是' : '否'` |

## 6. 母公司列表（`parentCompany/index.vue`）

### 6.1 模块前缀与权限

- `moduleKey = 'AISMC-parentCompany'`
- 其余沿用 `permissions` mixin

### 6.2 筛选区

| 表单项 | 控件 | 绑定字段 | 后端字段 |
|---|---|---|---|
| 公司名称 | `el-input` | `form.companyName` | `companyName` |
| 公司编码 | `el-input` | `form.companyCode` | `companyCode` |
| 大区 | `FetchSelect` enumCode=`ais_base_region` | `form.region` | `region` |
| 省市区 | `el-cascader` | `form.areaCode` | `areaCode` |
| 合作类型 | `FetchSelect` enumCode=`parent_company_cooperation_type` | `form.cooperationType` | `cooperationType` |

### 6.3 列表字段

| 列 | 数据源 |
|---|---|
| 公司名称（首列、点击跳转） | `companyName` |
| 公司编码 | `companyCode` |
| 大区 | `regionName` |
| 合作类型 | `cooperationTypeLabel`（若有）否则 code |
| 企业客户分类 | `companyCustomerTypeName` |
| 财务发票分类 | `financialInvoiceType` 字典 label |
| 法人代表 | `legalPerson` |
| 法人联系方式 | `legalPersonTelephone` |
| 公司邮箱 | `email` |
| 公司注册地址 | `address` |
| 详细地址 | `detailAddress` |
| 开户银行 | `bankName` |
| 税号 | `taxNumber` |
| 开户账户 | `openAccount` |
| 开票电话 | `invoicePhone` |
| 银行户主 | `bankHouseholder` |
| 开票地址 | `invoiceAddress` |
| 股权信息 | `investorEquityInfo`（页面不解析，详情展示） |

### 6.4 导出按钮

- `businessType = '母公司管理'`
- `dataFetchPath = 'datacenter/web/parentCompany/page'`
- 文件名：`母公司管理.xlsx`

### 6.5 交互

- 点击"公司名称"列按钮 → `this.$router.push({ path: '/datacenter/store/parentCompany/detail', query: { companyCode: row.companyCode } })`
- 表格配置 `optionObj.id = 'parentCompanyTable'`

## 7. 母公司详情（`parentCompany/detail.vue`）

### 7.1 整体结构

参照 `serviceProxyHis/edit.vue`：

- `EditPageLayout` `title="母公司详情"`
- `EditBaseContainer` `:showEditBtn="false"` `:detailRequest="detailRequest"`
- `detailRequest = ({ companyCode }) => getDetail({ companyCode })`
- 标题显示 `母公司编码：${form.companyCode || '-'}`

### 7.2 section 一：基础信息

| 字段 | 数据源 |
|---|---|
| 母公司名称 | `companyName` |
| 母公司编码 | `companyCode` |
| 财务发票分类 | `financialInvoiceType` 字典 label |
| 合作类型 | `cooperationTypeName` |
| 所属大区 | `regionName` |
| 企业客户分类 | `companyCustomerTypeName` |
| 法人代表 | `legalPerson` |
| 法人联系方式 | `legalPersonTelephone` |
| 公司邮箱 | `email` |

### 7.3 section 二：地址信息

| 字段 | 数据源 |
|---|---|
| 公司注册地址 | `address` |
| 详细地址 | `detailAddress` |

### 7.4 section 三：开户信息

| 字段 | 数据源 |
|---|---|
| 开户银行 | `bankName` |
| 税号 | `taxNumber` |
| 开户账户 | `openAccount` |
| 开票电话 | `invoicePhone` |
| 银行户主 | `bankHouseholder` |
| 开票地址 | `invoiceAddress` |

### 7.5 section 四：投资人股权信息（列表 + 合计）

vxe-table 渲染 `form.investorEquityList`，列：

| 列 | 数据源 |
|---|---|
| 投资人名称 | `investorName` |
| 股权占比 (%) | `equityRatio` |
| 投资人类型 | `investorType` 字典 label |

**表格底部合计**：用 `footer-method` 计算 `equityRatio` 总和；优先展示 `form.equityRatioTotal`（后端已返回），fallback 客户端 sum。

## 8. 关键复用与约定

- mixins：`responsiveSearchForm`、`permissions`、`commonMixins`
- 组件：`LPVxeTable`、`EditPageLayout`、`EditBaseContainer`、`PageSearchAction`、`FetchSelect`、`el-cascader`、`el-date-picker`
- 表单提交模型：`LpBaseParam` 通用规范（pageNum/pageSize/sortColumns 等由前端统一构造）
- 时间字段：`acceptanceTime`（`LocalDate`）直接展示，不做时区转换
- 布尔字段展示：统一 `formatter: (row) => (row.isXxx ? '是' : '否')`

## 9. 错误处理

- 列表接口失败：`loading=false` 后弹 `this.$message.error('获取列表数据失败')`
- 详情接口失败：EditBaseContainer 自带的错误捕获
- 字段为空：统一展示 `-`，不显示 undefined/null

## 10. 兼容性 / 不做范围

- 门店列表备件收货相关字段：列表接口不返回，本期展示 `-`（不在本期修复）
- 备件收货省市区只展示 code：本期前端直接展示 code（如需 name 需后端补字段 — 不在范围）
- 不实现新增/编辑/删除门店或母公司 — 仅有查看与导出
- 不实现批量操作

## 11. 验收标准

- 4 个新页面均能正常路由跳转与渲染
- 筛选条件全部可输入/选择，重置后回到默认
- 列表分页、导出、勾选导出可用
- 门店详情 4 个 section 正确展示；母公司详情 4 个 section + 股权合计正确
- 不破坏现有 `vehicle/*` 模块的功能
- 路由前缀与面包屑名称符合设计

## 12. 后续可选工作（不在本期）

- 后端补 `SparePartReceivingResp` 的省市区 name（替换 code 展示）
- 后端补 `StorePageResp` 的备件收货字段，使列表可展示
- 新增门店/母公司页面（当前仅查看与导出）