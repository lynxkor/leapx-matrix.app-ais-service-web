---
name: ui-refine
description: |
  当用户说"调用技能页面优化师"、"调用技能ui-refine"、"帮我优化页面"、"调整页面交互"、"批量优化页面"时触发。
  此技能用于优化Vue页面的交互体验和展示效果，包括但不限于：
  - 表格交互（排序、筛选、分页、列宽）
  - 表单布局和验证提示
  - 搜索条件区域
  - 弹窗/抽屉体验
  - 状态展示和反馈
  - 代码样式统一
  输出为对原代码的修改建议。

  批量处理场景：用户给出多个文件路径时，依次对每个文件执行优化操作。
triggers:
  - "调用技能页面优化师"
  - "调用技能ui-refine"
  - "帮我优化页面"
  - "调整页面交互"
  - "批量优化页面"
---

# 页面优化师技能

## 技能职责

当用户请求优化页面时，对当前打开的Vue页面进行全面分析和优化。

## 工作流程

### 1. 确认优化范围

在开始之前，明确询问用户想要优化的具体方面：
- 表格交互
- 表单布局
- 搜索条件
- 弹窗/抽屉
- 样式统一
- 全部优化

### 2. 页面分析

读取目标页面的完整代码，分析：
- 当前使用的组件（Element UI / VXE Table / 自定义组件）
- 布局结构
- 交互模式
- 可优化的点

### 3. 提出优化方案

针对用户指定的方向，提出具体的优化建议，包括：
- 修改原因
- 修改前代码
- 修改后代码
- 预期效果

### 4. 代码修改

获得用户确认后，执行代码修改。

### 5. 记录用户反馈

当用户对调整后的width不满意并给出新值时，记录到用户的偏好档案中，供后续参考。

## 通用优化规则（适用于 index 和 edit 页面）

### 规则1：表格列宽动态调整

**适用范围**：index.vue 和 edit.vue 中的 vxe-table 列表展示字段

**计算规则**：
```
width = label字符串长度 * 30
```
注意：严格按照字符数计算，不取整。

**示例**：
```javascript
// 输入
label: '资金类型'  // 4个字符
// 输出
label: '资金类型', width: 120  // 4 * 30 = 120
```

**特殊字段（props内容可能比label长，需额外加宽）**：

| props | 原因 | 建议width |
|-------|------|-----------|
| vin | 车架号17位，通常很长 | 180 |
| remark | 备注内容不固定 | 200 |
| materialsCode | 物料编码较长 | 160 |

**用户偏好记录**（当用户调整后，记录到偏好档案）：
```
width偏好档案路径：.claude/skills/ui-refine/width-preferences.json
```

### 规则2：金额和数量数字右对齐

**适用范围**：所有表格中的金额和数量列

**需要右对齐的金额/数量字段（常见）**：
| 字段类型 | props示例 | 原因 |
|---------|----------|------|
| 金额类 | totalAmount, financingAmount, taxIncludedPrice, creditAmount, recAmount, rebateAmount, cashAmount, downPaymentRatio, depositRatio, vehicleNetworkMileage, actualLongitude, actualLatitude | 金融/数量字段 |
| 价格类 | wholesalePrice, guidePrice, marketGuidePrice, price | 价格字段 |
| 比例类 | downPaymentRatio, depositRatio, rebateRatio | 比例字段 |
| 数量类 | syncCount, quantity | 计数字段 |

**实现方式**：
```javascript
// 在 columnConfig 中添加 align 属性
{
  title: '金额',
  field: 'amount',
  align: 'right'  // 金额右对齐
},
{
  title: '数量',
  field: 'count',
  align: 'right'  // 数量右对齐
}
```

**注意**：其他列默认 `align: 'left'` 不变，只针对金额和数量设置右对齐。

### 规则3：edit页面 el-form 表单标签对齐规则

**编辑模式**：
```vue
<el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px">
```

**详情模式**：
```vue
<el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
```

**核心区别**：
- 编辑模式：有 `label-width="100px"`
- 详情模式：无 `label-width`，使用 `class="form-detail"`

### 规则4：status 状态展示模板

**适用范围**：edit.vue 中的 `<template #status>` slot

**判断条件**：当 slot 内容包含 `statusLabel` 时

**标准写法**：
```vue
<template #status>
  <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
</template>
```

**注意**：需要根据 `form.status` 的值动态切换样式类，`true` 用 `primary`，`false` 用 `danger`

### 规则5：extraButtons 按钮 Loading 状态

**适用范围**：edit.vue 中的 `<template #extraButtons>` 下的按钮

**判断逻辑**：如果按钮点击方法中调用了接口请求，则需要添加 `loading` 状态

**实现方式**：
```vue
<el-button type="primary" :loading="submitLoading" @click="handleSubmit">
  提交
</el-button>
```

**标准约定**：
- loading 变量命名：方法名 + `Loading`，如 `handleSubmit` -> `submitLoading`
- loading 状态初始值：`false`
- loading 在接口调用开始时设为 `true`，在 `finally` 中设为 `false`

**示例**：
```javascript
data() {
  return {
    submitLoading: false
  }
},
methods: {
  handleSubmit() {
    this.submitLoading = true;
    this.submitRequest().then(() => {
      // success
    }).finally(() => {
      this.submitLoading = false;
    });
  }
}
```

### 规则6：增加跳转链接

**适用范围**：edit.vue 中的 el-form-item 字段

**功能**：为外键/关联字段添加可点击跳转链接，使用 `window.open` 在新标签页打开目标编辑页

#### 6.1 需要跳转的字段特征

| 字段特征 | 示例 | 原因 |
|---------|------|------|
| 外键字段 | brandId, seriesId, modelId, materialsId | 指向其他业务对象 |
| 名称+Code组合 | dealerName + dealerCode, dealerCompanyName | 通常有关联编辑页 |
| 业务编号字段 | rebateBillDetailCode, bizOrderNo, deliveryOrderCode | 指向具体业务单据 |
| VIN | vin | 车辆档案主键 |

#### 6.2 不需要跳转的字段

| 字段特征 | 示例 | 原因 |
|---------|------|------|
| 系统自动生成字段 | creatorName, createTime, updateTime | 自动生成 |
| 枚举值 | statusLabel, rebateTypeLabel, postedLabel | 非外键 |
| 金额/数量 | rebateAmount, accruedAmount | 数值字段 |
| 审核意见 | auditOpinion, reviewOpinion | 文本字段 |
| 备注 | remark | 非外键 |

#### 6.3 路由前缀说明

| 项目 | 前缀 | 说明 |
|-----|------|------|
| 销售项目 (app-ais-sales-front) | `/sales` | 整车销售相关页面 |
| 售后项目 (app-ais-aftersale-front) | `/service` | 售后维修、备件相关页面 |
| 合作伙伴 | 无前缀 | 独立模块 |

#### 6.4 字段跳转目标映射表（数据中心）

| 字段名 | 跳转目标 | 参数 |
|-------|---------|-----|
| brandId / brandName | `/sales/datacenter/materials/vehiclebrand/edit` | id |
| seriesId / seriesName | `/sales/datacenter/materials/vehicleseries/edit` | id |
| modelLineId / modelLineName | `/sales/datacenter/materials/vehiclemodelline/edit` | id |
| modelId / modelName | `/sales/datacenter/materials/vehiclemodel/edit` | id |
| yearTypeId / yearTypeName | `/sales/datacenter/materials/vehicleyeartype/edit` | id |
| exteriorId / exteriorName | `/sales/datacenter/materials/vehicleexterior/edit` | id |
| interiorId / interiorName | `/sales/datacenter/materials/vehicleinterior/edit` | id |
| roofId / roofName | `/sales/datacenter/materials/vehicleroof/edit` | id |
| wheelHubId / wheelHubName | `/sales/datacenter/materials/vehiclewheelhub/edit` | id |
| drivingRangeId / drivingRangeName | `/sales/datacenter/materials/vehicledrivingrange/edit` | id |
| rangePowerId / rangePowerName | `/sales/datacenter/materials/vehiclerangepower/edit` | id |
| optionPackageId / optionPackageName | `/sales/datacenter/materials/vehicleoptionpackage/edit` | id |
| batteryCellId / batteryCellName | `/sales/datacenter/materials/vehiclebatterycell/edit` | id |
| registeredModelId / registeredModelName | `/sales/datacenter/materials/vehicleregisteredmodel/edit` | id |
| materialsId / materialsCode / materialsDesc | `/sales/datacenter/materials/vehiclematerials/edit` | id |
| matchMaterialsId / matchMaterialsCode | `/sales/datacenter/materials/vehiclematerials/edit` | id |
| **vin** | **需要确认**（见下方说明） | vin |
| dealerCode / dealerName | `/partner/channelManagement/shopDetail` | dealerCode |
| dealerCompanyCode / dealerCompanyName | `/partner/channelManagement/companyDetails` | companyCode |

#### 6.5 vin 字段特殊说明

vin 字段可能跳转到两个不同的页面，需要**询问用户当前操作人需要跳转到哪个页面**：

| 跳转目标 | 页面名称 | 使用场景 |
|---------|---------|---------|
| `/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit` | 整车库存台账编辑 | 库存相关业务 |
| `/service/datacenter/vehicle/vehicleProfile/edit` | 车辆档案编辑 | 车辆档案相关业务 |

**询问话术：**
```
vin 字段可以跳转到以下两个页面，请确认需要使用哪个：
1. 整车库存台账编辑 (/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit?vin=xxx) - 库存相关业务
2. 车辆档案编辑 (/service/datacenter/vehicle/vehicleProfile/edit?vin=xxx) - 车辆档案相关业务
```

#### 6.6 其他业务字段跳转目标（零售/批发）

| 字段名 | 跳转目标 | 参数 |
|-------|---------|-----|
| retailOrderCode | `/sales/vehretail/ordermanager/retailorderinfo/edit` | id |
| wholesaleOrderId | `/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit` | id |
| enterpriseOrderId | `/sales/vehwholesale/entorder/entVehicleOrder/edit` | id |
| deliveryOrderCode | `/sales/vehretail/orderManager/deliveryOrder/edit` | id |
| budgetItemId | `/sales/vehwholesale/fund/fundBudgetItem/edit` | id |
| feeSupportTypeId | `/sales/vehwholesale/fund/fundFeeSupportType/edit` | id |
| productCode / productId | `/sales/vehretail/productManager/productCenter/edit` | id |
| fundFinancialOrganizationId / fundFinancialOrganizationName | `/sales/vehwholesale/fund/fundFinancialOrganization/edit` | id |
| recFinancialOrganizationId / recFinancialOrganizationName | `/sales/vehwholesale/fund/fundFinancialOrganization/edit` | id |

#### 6.7 代码模板

**el-form-item el-link 写法：**
```vue
<el-form-item label="物料编码">
  <el-link type="primary" :href="`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materialsId}`" target="_blank">
    {{ form.materialsCode }}
  </el-link>
</el-form-item>
```

**错误写法（不要使用 el-button 做跳转）：**
```vue
<!-- 错误！不要使用 el-button 做跳转链接 -->
<el-button class="link" style="padding: 0;" type="text" @click="openWindow('/sales/xxx/edit?id=' + form.xxxId)">链接文字</el-button>
```

**正确写法（使用 el-link）：**
```vue
<!-- 正确！使用 el-link + :href + target="_blank" -->
<el-link type="primary" :href="`/sales/xxx/edit?id=${form.xxxId}`" target="_blank">链接文字</el-link>
```

**注意**：跳转链接统一使用 `el-link`，不要使用 `el-button`。`el-button` 用于操作按钮，`el-link` 用于跳转链接。

**window.open 写法（用于按钮）：**
```javascript
window.open(`/sales/datacenter/materials/vehiclematerials/edit?id=${form.materialsId}`, '_blank');
```

#### 6.8 常见错误排查

| 错误类型 | 错误示例 | 正确写法 |
|---------|---------|---------|
| 缺少 /sales 前缀 | `/datacenter/materials/vehiclebrand/edit` | `/sales/datacenter/materials/vehiclebrand/edit` |
| 使用 /detail | `/sales/xxx/detail` | `/sales/xxx/edit` |
| 路径大小写错误 | `/sales/datacenter/materials/vehicleSeries/edit` | `/sales/datacenter/materials/vehicleseries/edit` |

**注意**：路径大小写需与 router/index.js 保持一致

## 样式统一清单

待用户补充具体优化规则...

## 附录：完整路由汇总表

### 一、销售项目路由 (/sales)

#### 整车库存 (vehstock)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/sales/vehstock/basic/regionNoticeDirectory/edit` | 地区对应公告目录编辑 | id |
| `/sales/vehstock/basic/vehicleInventoryStock/edit` | 整车库存存量定义编辑 | id |
| `/sales/vehstock/basic/vehicleReservationConfig/edit` | 车辆预留配置编辑 | id |
| `/sales/vehstock/basic/warehouseVehicleRelation/edit` | 仓库配车关系编辑 | id |
| `/sales/vehstock/vdc/vehiclePo/edit` | 整车采购订单编辑 | id |
| `/sales/vehstock/vdc/vehicleVdcInventoryLedger/edit` | 整车库存台账编辑 | id / vin |
| `/sales/vehstock/store/vehiclePdiCheckItemConfig/edit` | PDI检查项目配置编辑 | id |
| `/sales/vehstock/store/storeVehiclePdi/edit` | 库存车辆PDI编辑 | id |
| `/sales/vehstock/store/storeInventoryLedger/edit` | 库存台账编辑 | id |

#### 数据中心-整车主机厂主数据 (datacenter/materials)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/sales/datacenter/materials/vehiclebrand/edit` | 车辆品牌编辑 | id |
| `/sales/datacenter/materials/vehicleseries/edit` | 车系编辑 | id |
| `/sales/datacenter/materials/vehiclemodelline/edit` | 系列编辑 | id |
| `/sales/datacenter/materials/vehiclemodel/edit` | 车型编辑 | id |
| `/sales/datacenter/materials/vehicleyeartype/edit` | 年款编辑 | id |
| `/sales/datacenter/materials/vehicleexterior/edit` | 外饰编辑 | id |
| `/sales/datacenter/materials/vehicleinterior/edit` | 内饰编辑 | id |
| `/sales/datacenter/materials/vehicleroof/edit` | 车顶编辑 | id |
| `/sales/datacenter/materials/vehiclewheelhub/edit` | 轮毂编辑 | id |
| `/sales/datacenter/materials/vehicledrivingrange/edit` | 续航编辑 | id |
| `/sales/datacenter/materials/vehiclerangepower/edit` | 动力编辑 | id |
| `/sales/datacenter/materials/vehicleoptionpackage/edit` | 选装包编辑 | id |
| `/sales/datacenter/materials/vehiclebatterycell/edit` | 电池电芯编辑 | id |
| `/sales/datacenter/materials/vehicleregisteredmodel/edit` | 备案型号编辑 | id |
| `/sales/datacenter/materials/vehiclematerials/edit` | 整车物料编辑 | id |
| `/sales/datacenter/materials/vehiclematerialsmatch/edit` | 物料可配关系编辑 | id |

#### 整车批发-资金 (vehwholesale/fund)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/sales/vehwholesale/fund/dealerFundAccount/edit` | 资金账户编辑 | id |
| `/sales/vehwholesale/fund/dealerFundAccountTransLog/edit` | 资金账户交易流水编辑 | id |
| `/sales/vehwholesale/fund/fundBudgetItem/edit` | 预算科目编辑 | id |
| `/sales/vehwholesale/fund/fundFeeSupportType/edit` | 费用支持类型编辑 | id |
| `/sales/vehwholesale/fund/fundRebateReturnConfig/edit` | 返利自动返还设置编辑 | id |
| `/sales/vehwholesale/fund/fundFinancialOrganization/edit` | 金融机构编辑 | id |
| `/sales/vehwholesale/fund/fundSaleCompany/edit` | 销售公司编辑 | id |

#### 整车批发-银行 (vehwholesale/bank)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/sales/vehwholesale/bank/finBankCreditRecord/edit` | 银行信贷记录编辑 | id |
| `/sales/vehwholesale/bank/finBankStatement/edit` | 银行对账单编辑 | id |
| `/sales/vehwholesale/bank/finBankSyncLog/edit` | 银行同步日志编辑 | id |

#### 整车批发-订单 (vehwholesale/wholesale)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/sales/vehwholesale/wholesale/vehicleWholesaleOrder/edit` | 整车批发订单编辑 | id |
| `/sales/vehwholesale/wholesale/vehicleWholesaleOrderFactory/edit` | 整车批发订单工厂编辑 | id |

#### 整车批发-企业客户订单 (vehwholesale/entorder)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/sales/vehwholesale/entorder/entVehicleOrder/edit` | 企业客户整车订单编辑 | id |

#### 零售订单 (vehretail)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/sales/vehretail/ordermanager/retailorderinfo/edit` | 零售订单编辑 | id |
| `/sales/vehretail/ordermanager/orderunlockapply/edit` | 订单解锁申请编辑 | id |
| `/sales/vehretail/orderManager/orderPayRecord/edit` | 订单支付记录编辑 | id |
| `/sales/vehretail/orderManager/orderBackStatusRecord/edit` | 订单退回状态记录编辑 | id |
| `/sales/vehretail/orderManager/orderLockRecord/edit` | 订单锁定记录编辑 | id |
| `/sales/vehretail/orderManager/deliveryOrder/edit` | 交付订单编辑 | id |
| `/sales/vehretail/ordermanager/orderconfigchange/edit` | 订单配置变更编辑 | id |

#### 零售-退款 (vehretail/orderRefund)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/sales/vehretail/orderRefund/changeApply/edit` | 变更申请编辑 | mallOrderCode |
| `/sales/vehretail/orderRefund/refundApply/edit` | 退款申请编辑 | mallOrderCode |

### 二、售后项目路由 (/service)

#### 数据中心-车辆 (datacenter/vehicle)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/datacenter/vehicle/vehicleprofile/edit` | 车辆档案编辑 | id / vin |
| `/service/datacenter/vehicle/serviceProxyHis/edit` | 接车施工单-维修履历信息管理编辑 | id |

#### 备件基础数据 (sparepart/basic)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/sparepart/basic/sparePart/edit` | 备件信息编辑 | id / partCode |
| `/service/sparepart/basic/sparePart/detail` | 备件信息详情 | id |
| `/service/sparepart/basic/dealerSparePart/edit` | 经销商备件编辑 | id |
| `/service/sparepart/basic/supplierInfo/edit` | 供应商信息编辑 | id |
| `/service/sparepart/basic/supplierInfo/detail` | 供应商信息详情 | id |
| `/service/sparepart/basic/sparePartSupplier/edit` | 备件供应商关系编辑 | id |
| `/service/sparepart/basic/sparePartPurchasePrice/edit` | 备件采购价格编辑 | id |
| `/service/sparepart/basic/sparePartSalesPrice/edit` | 备件销售价格编辑 | id |
| `/service/sparepart/basic/sparePartVehicleModel/edit` | 备件车型关联编辑 | id |
| `/service/sparepart/basic/sparePartReplacer/edit` | 备件替换关系编辑 | id |
| `/service/sparepart/basic/spareSalesCategory/edit` | 备件销售分类编辑 | id |
| `/service/sparepart/basic/purchasePrice/edit` | 备件特殊采购价设置编辑 | id |
| `/service/sparepart/basic/purchaseMinAmount/edit` | 备件起订金额设置编辑 | id |

#### 备件入库 (sparepart/inbound)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/sparepart/inbound/dealerInboundOrder/edit` | 经销商入库单编辑 | id |
| `/service/sparepart/inbound/transferInbound/edit` | 调拨入库单编辑 | id |
| `/service/sparepart/inbound/purchaseInbound/edit` | 采购入库单编辑 | id |

#### 备件出库 (sparepart/outbound)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/sparepart/outbound/dealerOutboundOrder/edit` | 经销商出库单编辑 | id |
| `/service/sparepart/outbound/maintenanceOutboundOrder/edit` | 维修出库单编辑 | id |
| `/service/sparepart/outbound/salesOutboundOrder/edit` | 销售出库单编辑 | id |

#### 备件调拨 (sparepart/transfer)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/sparepart/transfer/transferOutbound/edit` | 调拨出库单编辑 | id |
| `/service/sparepart/transfer/transferInbound/edit` | 调拨入库单编辑 | id |

#### 备件库存 (sparepart/warehouse)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/sparepart/warehouse/inventory/edit` | 库存信息编辑 | id |
| `/service/sparepart/warehouse/stockTaking/edit` | 盘点单编辑 | id |

#### 备件采购 (sparepart/purchase)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/sparepart/purchase/purchaseApply/edit` | 采购申请单编辑 | id |
| `/service/sparepart/purchase/purchaseOrder/edit` | 采购订单编辑 | id |

#### 备件销售 (sparepart/sale)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/sparepart/sale/retailOrder/edit` | 零售订单编辑 | id |

#### 索赔管理 (sparepart/claim)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/sparepart/claim/sparePartClaim/edit` | 备件索赔编辑 | id |

#### 索赔退回管理 (claimreturn/claim)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/claimreturn/claim/basic/approvalRejectSetting/edit` | 审批驳回设置编辑 | id |
| `/service/claimreturn/claim/basic/ccc/edit` | CCC编辑 | id |
| `/service/claimreturn/claim/basic/dealerReplacementCarClaimPrice/edit` | 经销商置换车索赔价格编辑 | id |
| `/service/claimreturn/claim/basic/freeMaintenancePolicy/edit` | 免费保养政策编辑 | id |
| `/service/claimreturn/claim/basic/partSpecialPartWarrantyPolicy/edit` | 配件专用件保修政策编辑 | id |
| `/service/claimreturn/claim/basic/partWarrantyPolicy/edit` | 配件保修政策编辑 | id |
| `/service/claimreturn/claim/basic/serviceActivityVehicle/edit` | 服务活动车辆编辑 | id |
| `/service/claimreturn/claim/basic/supplierReplacementCarClaimPrice/edit` | 供应商置换车索赔价格编辑 | id |
| `/service/claimreturn/claim/basic/techServiceActivity/edit` | 技术服务活动编辑 | id |
| `/service/claimreturn/claim/basic/threeGuaranteesRule/edit` | 三包规则编辑 | id |
| `/service/claimreturn/claim/basic/vehicleSpecialPartWarrantyPolicy/edit` | 车辆专用件保修政策编辑 | id |
| `/service/claimreturn/claim/basic/vehicleWarrantyPolicy/edit` | 车辆保修政策编辑 | id |
| `/service/claimreturn/claim/basic/vfg/edit` | VFG编辑 | id |
| `/service/claimreturn/claim/basic/vrt/edit` | VRT编辑 | id |
| `/service/claimreturn/claim/basic/warrantyAttachmentSetting/edit` | 保修附件设置编辑 | id |
| `/service/claimreturn/claim/basic/warrantyGradeApprovalSetting/edit` | 保修等级审批设置编辑 | id |
| `/service/claimreturn/claim/basic/warrantyHourSetting/edit` | 保修工时设置编辑 | id |
| `/service/claimreturn/claim/basic/warrantyOrderWarningRule/edit` | 保修订单预警规则编辑 | id |
| `/service/claimreturn/claim/basic/warrantyParameterConfig/edit` | 保修参数配置编辑 | id |
| `/service/claimreturn/claim/basic/warrantyPartManagementRateSetting/edit` | 保修配件管理费率设置编辑 | id |
| `/service/claimreturn/claim/basic/warrantySettlementCalendar/edit` | 保修结算日历编辑 | id |
| `/service/claimreturn/claim/claimtrace/claimTraceOrder/edit` | 索赔跟踪订单编辑 | id |
| `/service/claimreturn/claim/warrantyapply/edit` | 保修申请编辑 | id |
| `/service/claimreturn/claim/warrantyaudit/edit` | 保修审核编辑 | id |
| `/service/claimreturn/claim/warrantyaudit/warrantyAuditDetail/edit` | 保修审核详情编辑 | id |
| `/service/claimreturn/claim/warrantyaudit/warrantyAuditErrorConfig/edit` | 保修审核错误配置编辑 | id |
| `/service/claimreturn/claim/warrantysettle/edit` | 保修结算编辑 | id |

#### 旧件管理 (claimreturn/oldpart)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/claimreturn/oldpart/basic/oldPartOemWarehouse/edit` | OEM旧件仓库编辑 | id |
| `/service/claimreturn/oldpart/basic/oldPartUnqualifiedConfig/edit` | 旧件不合格配置编辑 | id |
| `/service/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit` | 旧件销毁订单编辑 | id |
| `/service/claimreturn/oldpart/inventory/oem/edit` | OEM旧件库存编辑 | id |
| `/service/claimreturn/oldpart/outbound/edit` | 旧件出库编辑 | id |
| `/service/claimreturn/oldpart/returnorder/edit` | 旧件退回订单编辑 | id |

#### 数据中心-车辆服务 (datacenter/vehicle)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/datacenter/vehicle/serviceDealerChangeApply/edit` | 服务经销商变更申请编辑 | id |
| `/service/datacenter/vehicle/vehicleOwnerChangeApply/edit` | 车主变更申请编辑 | id |

#### 维修管理 (maintain)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/maintain/basic/batteryUnit/edit` | 电池单元编辑 | id |
| `/service/maintain/basic/checkoutType/edit` | 结账类型编辑 | id |
| `/service/maintain/basic/cityLaborLevel/edit` | 城市工时等级编辑 | id |
| `/service/maintain/basic/dataSyncRecord/edit` | 数据同步记录编辑 | id |
| `/service/maintain/basic/dealerDiscount/edit` | 经销商折扣编辑 | id |
| `/service/maintain/basic/dealerPermission/edit` | 经销商权限编辑 | id |
| `/service/maintain/basic/dealerStation/edit` | 经销商工位编辑 | id |
| `/service/maintain/basic/dealerWorkTeam/edit` | 经销商工作组编辑 | id |

#### Excel管理 (excelManagement)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/excelManagement/commonDataProcessExcelModelMap/edit` | 通用数据处理Excel模板映射编辑 | id |
| `/service/excelManagement/commonDataProcessExcelTask/edit` | 通用数据处理Excel任务编辑 | id |

#### 文件管理 (file)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/service/file/attachmentConfig/edit` | 附件配置编辑 | id |

#### 合作伙伴路由 (无前缀)

| 路由地址 | 页面名称 | 参数 |
|---------|---------|------|
| `/partner/channelManagement/shopDetail` | 门店详情 | dealerCode |
| `/partner/channelManagement/companyDetails` | 母公司详情 | companyCode |

## 偏好档案

### width偏好档案
路径：`.claude/skills/ui-refine/width-preferences.json`

格式：
```json
{
  "字段名": {
    "建议width": 120,
    "用户调整后": 150,
    "调整日期": "2026-05-07",
    "原因": "内容较长"
  }
}
```
