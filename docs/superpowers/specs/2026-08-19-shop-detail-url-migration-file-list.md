# 门店详情 URL 迁移 — 文件清单（实际修改版）

> 本次实际修改的文件清单。两个 commit 共 100 个 `.vue` 文件、162 行替换（121+41）。
> - commit `5cad7b41` refactor: 门店详情跳转统一改为 /datacenter/store/store/detail?storeCode（100 files, 121/121）
> - commit `250cde49` refactor: 移除门店详情 URL 中遗留的 num=2 参数（33 files, 41/41）

## 1. 汇总

| 项目 | 文件数 |
|---|---|
| `sparepart/` | 54 |
| `maintain/` | 25 |
| `claimreturn/` | 14 |
| `datacenter/` | 7 |
| **合计** | **100** |

> 说明：100 个文件全部位于 `src/views/`。`src/libs/mixins/commonMixins.js` 是 `src/libs` 子模块内部文件，本分支未修改。

## 2. 跳转字段统计

| 字段名 | 文件数 | 说明 |
|---|---|---|
| `dealerCode` | 96 | 大多数文件（行/表单） |
| `deliveryDealerCode` | 2 | 车辆档案 — 交付门店 |
| `salesDealerCode` | 2 | 车辆档案 — 销售门店 |
| `serviceDealerCode` | 2 | 车辆档案 — 服务门店 |
| `serviceCenterCode` | 2 | 质检单 — 服务中心 |
| `exclusiveServiceDealerCode` | 1 | 维修代办 — 专属服务门店 |

## 3. 完整文件清单（按模块）

### 索赔与旧件 (`claimreturn/`) — `claim/` — 8 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/claimreturn/claim/claimtrace/claimTraceOrder/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/claimreturn/claim/claimtrace/claimTraceOrder/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/claimreturn/claim/warrantyapply/edit.vue` | 编辑 | `dealerCode` |
| 4 | `src/views/claimreturn/claim/warrantyapply/index.vue` | 列表 | `dealerCode` |
| 5 | `src/views/claimreturn/claim/warrantyaudit/edit.vue` | 编辑 | `dealerCode` |
| 6 | `src/views/claimreturn/claim/warrantyaudit/index.vue` | 列表 | `dealerCode` |
| 7 | `src/views/claimreturn/claim/warrantysettle/edit.vue` | 编辑 | `dealerCode` |
| 8 | `src/views/claimreturn/claim/warrantysettle/index.vue` | 列表 | `dealerCode` |

### 索赔与旧件 (`claimreturn/`) — `oldpart/` — 6 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/claimreturn/oldpart/inventory/oem/edit.vue` | 编辑 | `dealerCode` |
| 4 | `src/views/claimreturn/oldpart/inventory/oem/index.vue` | 列表 | `dealerCode` |
| 5 | `src/views/claimreturn/oldpart/returnorder/edit.vue` | 编辑 | `dealerCode` |
| 6 | `src/views/claimreturn/oldpart/returnorder/index.vue` | 列表 | `dealerCode` |

### 主数据 (`datacenter/`) — `vehicle/` — 7 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/datacenter/vehicle/serviceDealerChangeApply/index.vue` | 列表 | `dealerCode` |
| 2 | `src/views/datacenter/vehicle/serviceProxyHis/edit.vue` | 编辑 | `dealerCode` |
| 3 | `src/views/datacenter/vehicle/serviceProxyHis/index.vue` | 列表 | `dealerCode` |
| 4 | `src/views/datacenter/vehicle/vehicleOwnerChangeApply/edit.vue` | 编辑 | `dealerCode` |
| 5 | `src/views/datacenter/vehicle/vehicleOwnerChangeApply/index.vue` | 列表 | `dealerCode` |
| 6 | `src/views/datacenter/vehicle/vehicleProfile/edit.vue` | 编辑 | `deliveryDealerCode`, `salesDealerCode`, `serviceDealerCode` |
| 7 | `src/views/datacenter/vehicle/vehicleProfile/index.vue` | 列表 | `deliveryDealerCode`, `salesDealerCode`, `serviceDealerCode` |

### 售后维修 (`maintain/`) — `basic/` — 8 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/maintain/basic/dealerDiscount/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/maintain/basic/dealerDiscount/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/maintain/basic/dealerStation/edit.vue` | 编辑 | `dealerCode` |
| 4 | `src/views/maintain/basic/dealerStation/index.vue` | 列表 | `dealerCode` |
| 5 | `src/views/maintain/basic/dealerWorkTeam/edit.vue` | 编辑 | `dealerCode` |
| 6 | `src/views/maintain/basic/dealerWorkTeam/index.vue` | 列表 | `dealerCode` |
| 7 | `src/views/maintain/basic/dealerWorkhourPriceSetting/edit.vue` | 编辑 | `dealerCode` |
| 8 | `src/views/maintain/basic/dealerWorkhourPriceSetting/index.vue` | 列表 | `dealerCode` |

### 售后维修 (`maintain/`) — `sp/` — 17 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/maintain/sp/companyInfo/index.vue` | 列表 | `dealerCode` |
| 2 | `src/views/maintain/sp/ownersEquityOrder/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/maintain/sp/preAuth/edit.vue` | 编辑 | `dealerCode` |
| 4 | `src/views/maintain/sp/preAuth/index.vue` | 列表 | `dealerCode` |
| 5 | `src/views/maintain/sp/qualityOrderReport/edit.vue` | 编辑 | `serviceCenterCode` |
| 6 | `src/views/maintain/sp/qualityOrderReport/index.vue` | 列表 | `serviceCenterCode` |
| 7 | `src/views/maintain/sp/repairRecord/index.vue` | 列表 | `dealerCode` |
| 8 | `src/views/maintain/sp/repairWorkRecord/index.vue` | 列表 | `dealerCode` |
| 9 | `src/views/maintain/sp/restatement/edit.vue` | 编辑 | `dealerCode` |
| 10 | `src/views/maintain/sp/restatement/index.vue` | 列表 | `dealerCode` |
| 11 | `src/views/maintain/sp/serviceProxy/components/BasicInfo/index.vue` | 列表 | `dealerCode`, `exclusiveServiceDealerCode` |
| 12 | `src/views/maintain/sp/serviceProxy/components/SparepartsInfo/index.vue` | 列表 | `dealerCode` |
| 13 | `src/views/maintain/sp/serviceProxy/index.vue` | 列表 | `dealerCode` |
| 14 | `src/views/maintain/sp/serviceStatement/edit.vue` | 编辑 | `dealerCode` |
| 15 | `src/views/maintain/sp/serviceStatement/index.vue` | 列表 | `dealerCode` |
| 16 | `src/views/maintain/sp/vehRetentionList/edit.vue` | 编辑 | `dealerCode` |
| 17 | `src/views/maintain/sp/vehRetentionList/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `basic/` — 12 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/basic/dealerSparePart/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/sparepart/basic/dealerSparePart/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/sparepart/basic/predictBlacklist/edit.vue` | 编辑 | `dealerCode` |
| 4 | `src/views/sparepart/basic/purchaseMinAmount/edit.vue` | 编辑 | `dealerCode` |
| 5 | `src/views/sparepart/basic/purchaseMinAmount/index.vue` | 列表 | `dealerCode` |
| 6 | `src/views/sparepart/basic/purchasePrice/edit.vue` | 编辑 | `dealerCode` |
| 7 | `src/views/sparepart/basic/purchasePrice/index.vue` | 列表 | `dealerCode` |
| 8 | `src/views/sparepart/basic/purchasePriceCoupon/index.vue` | 列表 | `dealerCode` |
| 9 | `src/views/sparepart/basic/purchaseTimesLimit/edit.vue` | 编辑 | `dealerCode` |
| 10 | `src/views/sparepart/basic/purchaseTimesLimit/index.vue` | 列表 | `dealerCode` |
| 11 | `src/views/sparepart/basic/sparePartPurchasePrice/edit.vue` | 编辑 | `dealerCode` |
| 12 | `src/views/sparepart/basic/sparePartPurchasePrice/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `claim/` — 2 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/claim/sparePartClaim/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/sparepart/claim/sparePartClaim/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `fund/` — 4 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/fund/accountOperateApply/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/sparepart/fund/accountOperateApply/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/sparepart/fund/accountOperateDeductionApply/edit.vue` | 编辑 | `dealerCode` |
| 4 | `src/views/sparepart/fund/accountOperateDeductionApply/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `inbound/` — 5 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/inbound/dealerInboundOrder/index.vue` | 列表 | `dealerCode` |
| 2 | `src/views/sparepart/inbound/inboundOrder/edit.vue` | 编辑 | `dealerCode` |
| 3 | `src/views/sparepart/inbound/inboundOrder/index.vue` | 列表 | `dealerCode` |
| 4 | `src/views/sparepart/inbound/maintenanceReturnInbound/edit.vue` | 编辑 | `dealerCode` |
| 5 | `src/views/sparepart/inbound/maintenanceReturnInbound/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `outbound/` — 5 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/outbound/dealerOutboundOrder/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/sparepart/outbound/dealerOutboundOrder/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/sparepart/outbound/dealerReturnOrder/index.vue` | 列表 | `dealerCode` |
| 4 | `src/views/sparepart/outbound/maintenanceOutboundOrder/edit.vue` | 编辑 | `dealerCode` |
| 5 | `src/views/sparepart/outbound/maintenanceOutboundOrder/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `purchase/` — 10 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/purchase/backOrder/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/sparepart/purchase/backOrder/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/sparepart/purchase/boToShareTransfer/edit.vue` | 编辑 | `dealerCode` |
| 4 | `src/views/sparepart/purchase/boToShareTransfer/index.vue` | 列表 | `dealerCode` |
| 5 | `src/views/sparepart/purchase/purchaseApply/edit.vue` | 编辑 | `dealerCode` |
| 6 | `src/views/sparepart/purchase/purchaseApply/index.vue` | 列表 | `dealerCode` |
| 7 | `src/views/sparepart/purchase/purchaseOrder/edit.vue` | 编辑 | `dealerCode` |
| 8 | `src/views/sparepart/purchase/purchaseOrder/index.vue` | 列表 | `dealerCode` |
| 9 | `src/views/sparepart/purchase/shippingOrder/edit.vue` | 编辑 | `dealerCode` |
| 10 | `src/views/sparepart/purchase/shippingOrder/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `return/` — 4 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/return/returnException/edit.vue` | 编辑 | `dealerCode` |
| 2 | `src/views/sparepart/return/returnException/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/sparepart/return/returnOrder/edit.vue` | 编辑 | `dealerCode` |
| 4 | `src/views/sparepart/return/returnOrder/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `sale/` — 3 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/sale/retailOrder/index.vue` | 列表 | `dealerCode` |
| 2 | `src/views/sparepart/sale/retailOrderOut/index.vue` | 列表 | `dealerCode` |
| 3 | `src/views/sparepart/sale/retailOrderReturn/index.vue` | 列表 | `dealerCode` |

### 备件 (`sparepart/`) — `warehouse/` — 9 个文件

| # | 文件 | 功能 | 字段 |
|---|---|---|---|
| 1 | `src/views/sparepart/warehouse/inventory/index.vue` | 列表 | `dealerCode` |
| 2 | `src/views/sparepart/warehouse/oemOutboundOrder/edit.vue` | 编辑 | `dealerCode` |
| 3 | `src/views/sparepart/warehouse/oemOutboundOrder/index.vue` | 列表 | `dealerCode` |
| 4 | `src/views/sparepart/warehouse/sharedInventory/index.vue` | 列表 | `dealerCode` |
| 5 | `src/views/sparepart/warehouse/stockTaking/edit.vue` | 编辑 | `dealerCode` |
| 6 | `src/views/sparepart/warehouse/stockTaking/index.vue` | 列表 | `dealerCode` |
| 7 | `src/views/sparepart/warehouse/stockTakingDifferences/index.vue` | 列表 | `dealerCode` |
| 8 | `src/views/sparepart/warehouse/stockTakingDifferencesProfit/index.vue` | 列表 | `dealerCode` |
| 9 | `src/views/sparepart/warehouse/warehouse/index.vue` | 列表 | `dealerCode` |

**合计 100 个文件**

## 4. 与原始 spec 文件清单的差异

| 项目 | 原始 spec | 实际 |
|---|---|---|
| 总文件数 | 99 (98 .vue + commonMixins.js) | **100 .vue** |
| `commonMixins.js` | 列出但实际未动 | 已剔除（子模块独立维护） |
| `sparepart/basic/purchaseTimesLimit/edit.vue` | 遗漏 | **已补全** |
| `claimreturn/oldpart/returnorder/edit.vue` | 遗漏 | **已补全** |

两处遗漏源于最初 `grep` 工具对路径通配/编码的覆盖差异，已在最终 commit 中正确替换。
