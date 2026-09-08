# 门店详情 URL 迁移 — 文件清单（实际修改版）

> 本次实际修改的文件清单。两个 commit 共 100 个 `.vue` 文件、162 行替换（121+41）。
> - commit `5cad7b41` refactor: 门店详情跳转统一改为 /datacenter/store/store/detail?storeCode（100 files, 121/121）
> - commit `250cde49` refactor: 移除门店详情 URL 中遗留的 num=2 参数（33 files, 41/41）

## 1. 汇总

| 项目 | 文件数 | 替换处数 |
|---|---|---|
| `sparepart/` | 54 | 约 90 处 |
| `maintain/` | 25 | 约 31 处 |
| `claimreturn/` | 14 | 约 19 处 |
| `datacenter/` | 7 | 约 11 处 |
| **合计** | **100** | **约 151 处** |

> 说明：100 个文件全部位于 `src/views/`。`src/libs/mixins/commonMixins.js` 是 `src/libs` 子模块内部文件，本分支未修改（子模块独立维护）。

## 2. 完整文件清单（按模块）

### 2.1 售后维修 (`maintain/`) — 25 个文件

#### `maintain/basic/` — 8 个

| # | 文件 | 功能 |
|---|---|---|
| 1 | `src/views/maintain/basic/dealerDiscount/index.vue` | 门店折扣列表 |
| 2 | `src/views/maintain/basic/dealerDiscount/edit.vue` | 门店折扣编辑 |
| 3 | `src/views/maintain/basic/dealerStation/index.vue` | 门店工时设置列表 |
| 4 | `src/views/maintain/basic/dealerStation/edit.vue` | 门店工时设置编辑 |
| 5 | `src/views/maintain/basic/dealerWorkTeam/index.vue` | 门店维修班组列表 |
| 6 | `src/views/maintain/basic/dealerWorkTeam/edit.vue` | 门店维修班组编辑 |
| 7 | `src/views/maintain/basic/dealerWorkhourPriceSetting/index.vue` | 门店工时单价设置列表 |
| 8 | `src/views/maintain/basic/dealerWorkhourPriceSetting/edit.vue` | 门店工时单价设置编辑 |

#### `maintain/sp/` — 17 个

| # | 文件 | 功能 |
|---|---|---|
| 9 | `src/views/maintain/sp/companyInfo/index.vue` | 公司信息 |
| 10 | `src/views/maintain/sp/ownersEquityOrder/index.vue` | 维修权益单 |
| 11 | `src/views/maintain/sp/preAuth/index.vue` | 预授权列表 |
| 12 | `src/views/maintain/sp/preAuth/edit.vue` | 预授权编辑 |
| 13 | `src/views/maintain/sp/qualityOrderReport/index.vue` | 质检单列表 |
| 14 | `src/views/maintain/sp/qualityOrderReport/edit.vue` | 质检单编辑 |
| 15 | `src/views/maintain/sp/repairRecord/index.vue` | 维修记录列表 |
| 16 | `src/views/maintain/sp/repairWorkRecord/index.vue` | 维修工时记录 |
| 17 | `src/views/maintain/sp/restatement/index.vue` | 补开发票列表 |
| 18 | `src/views/maintain/sp/restatement/edit.vue` | 补开发票编辑 |
| 19 | `src/views/maintain/sp/serviceProxy/index.vue` | 维修代办列表 |
| 20 | `src/views/maintain/sp/serviceProxy/components/BasicInfo/index.vue` | 维修代办-基本信息 |
| 21 | `src/views/maintain/sp/serviceProxy/components/SparepartsInfo/index.vue` | 维修代办-备件信息 |
| 22 | `src/views/maintain/sp/serviceStatement/index.vue` | 维修结算单列表 |
| 23 | `src/views/maintain/sp/serviceStatement/edit.vue` | 维修结算编辑 |
| 24 | `src/views/maintain/sp/vehRetentionList/index.vue` | 车辆留存单列表 |
| 25 | `src/views/maintain/sp/vehRetentionList/edit.vue` | 车辆留存单编辑 |

### 2.2 备件 (`sparepart/`) — 54 个文件

#### `sparepart/basic/` — 12 个

| # | 文件 | 功能 |
|---|---|---|
| 1 | `src/views/sparepart/basic/dealerSparePart/index.vue` | 门店备件列表 |
| 2 | `src/views/sparepart/basic/dealerSparePart/edit.vue` | 门店备件编辑 |
| 3 | `src/views/sparepart/basic/predictBlacklist/edit.vue` | 备件预占黑名单编辑 |
| 4 | `src/views/sparepart/basic/purchaseMinAmount/index.vue` | 备件采购起订量列表 |
| 5 | `src/views/sparepart/basic/purchaseMinAmount/edit.vue` | 备件采购起订量编辑 |
| 6 | `src/views/sparepart/basic/purchasePrice/index.vue` | 备件采购价列表 |
| 7 | `src/views/sparepart/basic/purchasePrice/edit.vue` | 备件采购价编辑 |
| 8 | `src/views/sparepart/basic/purchasePriceCoupon/index.vue` | 备件采购价券列表 |
| 9 | `src/views/sparepart/basic/purchaseTimesLimit/index.vue` | 备件采购限次列表 |
| 10 | `src/views/sparepart/basic/purchaseTimesLimit/edit.vue` | **本期新增** — 备件采购限次编辑 |
| 11 | `src/views/sparepart/basic/sparePartPurchasePrice/index.vue` | 备件采购价格列表 |
| 12 | `src/views/sparepart/basic/sparePartPurchasePrice/edit.vue` | 备件采购价格编辑 |

#### `sparepart/claim/` — 2 个

| # | 文件 | 功能 |
|---|---|---|
| 13 | `src/views/sparepart/claim/sparePartClaim/index.vue` | 备件索赔列表 |
| 14 | `src/views/sparepart/claim/sparePartClaim/edit.vue` | 备件索赔编辑 |

#### `sparepart/fund/` — 4 个

| # | 文件 | 功能 |
|---|---|---|
| 15 | `src/views/sparepart/fund/accountOperateApply/index.vue` | 资金操作申请列表 |
| 16 | `src/views/sparepart/fund/accountOperateApply/edit.vue` | 资金操作申请编辑 |
| 17 | `src/views/sparepart/fund/accountOperateDeductionApply/index.vue` | 资金扣款申请列表 |
| 18 | `src/views/sparepart/fund/accountOperateDeductionApply/edit.vue` | 资金扣款申请编辑 |

#### `sparepart/inbound/` — 5 个

| # | 文件 | 功能 |
|---|---|---|
| 19 | `src/views/sparepart/inbound/dealerInboundOrder/index.vue` | 门店入库单列表 |
| 20 | `src/views/sparepart/inbound/inboundOrder/index.vue` | 入库单列表 |
| 21 | `src/views/sparepart/inbound/inboundOrder/edit.vue` | 入库单编辑 |
| 22 | `src/views/sparepart/inbound/maintenanceReturnInbound/index.vue` | 维修退货入库列表 |
| 23 | `src/views/sparepart/inbound/maintenanceReturnInbound/edit.vue` | 维修退货入库编辑 |

#### `sparepart/outbound/` — 5 个

| # | 文件 | 功能 |
|---|---|---|
| 24 | `src/views/sparepart/outbound/dealerOutboundOrder/index.vue` | 门店出库单列表 |
| 25 | `src/views/sparepart/outbound/dealerOutboundOrder/edit.vue` | 门店出库单编辑 |
| 26 | `src/views/sparepart/outbound/dealerReturnOrder/index.vue` | 门店退货单列表 |
| 27 | `src/views/sparepart/outbound/maintenanceOutboundOrder/index.vue` | 维修出库单列表 |
| 28 | `src/views/sparepart/outbound/maintenanceOutboundOrder/edit.vue` | 维修出库单编辑 |

#### `sparepart/purchase/` — 10 个

| # | 文件 | 功能 |
|---|---|---|
| 29 | `src/views/sparepart/purchase/backOrder/index.vue` | 备件退库单列表 |
| 30 | `src/views/sparepart/purchase/backOrder/edit.vue` | 备件退库单编辑 |
| 31 | `src/views/sparepart/purchase/boToShareTransfer/index.vue` | 备件调拨列表 |
| 32 | `src/views/sparepart/purchase/boToShareTransfer/edit.vue` | 备件调拨编辑 |
| 33 | `src/views/sparepart/purchase/purchaseApply/index.vue` | 备件采购申请列表 |
| 34 | `src/views/sparepart/purchase/purchaseApply/edit.vue` | 备件采购申请编辑 |
| 35 | `src/views/sparepart/purchase/purchaseOrder/index.vue` | 备件采购单列表 |
| 36 | `src/views/sparepart/purchase/purchaseOrder/edit.vue` | 备件采购单编辑 |
| 37 | `src/views/sparepart/purchase/shippingOrder/index.vue` | 备件发货单列表 |
| 38 | `src/views/sparepart/purchase/shippingOrder/edit.vue` | 备件发货单编辑 |

#### `sparepart/return/` — 4 个

| # | 文件 | 功能 |
|---|---|---|
| 39 | `src/views/sparepart/return/returnException/index.vue` | 异常退库列表 |
| 40 | `src/views/sparepart/return/returnException/edit.vue` | 异常退库编辑 |
| 41 | `src/views/sparepart/return/returnOrder/index.vue` | 退库单列表 |
| 42 | `src/views/sparepart/return/returnOrder/edit.vue` | 退库单编辑 |

#### `sparepart/sale/` — 3 个

| # | 文件 | 功能 |
|---|---|---|
| 43 | `src/views/sparepart/sale/retailOrder/index.vue` | 零售单列表 |
| 44 | `src/views/sparepart/sale/retailOrderOut/index.vue` | 零售单出库列表 |
| 45 | `src/views/sparepart/sale/retailOrderReturn/index.vue` | 零售单退货列表 |

#### `sparepart/warehouse/` — 9 个

| # | 文件 | 功能 |
|---|---|---|
| 46 | `src/views/sparepart/warehouse/inventory/index.vue` | 库存列表 |
| 47 | `src/views/sparepart/warehouse/oemOutboundOrder/index.vue` | OEM 出库单列表 |
| 48 | `src/views/sparepart/warehouse/oemOutboundOrder/edit.vue` | OEM 出库单编辑 |
| 49 | `src/views/sparepart/warehouse/sharedInventory/index.vue` | 共享库存列表 |
| 50 | `src/views/sparepart/warehouse/stockTaking/index.vue` | 盘点列表 |
| 51 | `src/views/sparepart/warehouse/stockTaking/edit.vue` | 盘点编辑 |
| 52 | `src/views/sparepart/warehouse/stockTakingDifferences/index.vue` | 盘点差异列表 |
| 53 | `src/views/sparepart/warehouse/stockTakingDifferencesProfit/index.vue` | 盘点差异收益列表 |
| 54 | `src/views/sparepart/warehouse/warehouse/index.vue` | 仓库列表 |

### 2.3 索赔与旧件 (`claimreturn/`) — 14 个文件

#### `claimreturn/claim/` — 8 个

| # | 文件 | 功能 |
|---|---|---|
| 1 | `src/views/claimreturn/claim/claimtrace/claimTraceOrder/index.vue` | 索赔追溯单列表 |
| 2 | `src/views/claimreturn/claim/claimtrace/claimTraceOrder/edit.vue` | 索赔追溯单编辑 |
| 3 | `src/views/claimreturn/claim/warrantyapply/index.vue` | 索赔申请列表 |
| 4 | `src/views/claimreturn/claim/warrantyapply/edit.vue` | 索赔申请编辑 |
| 5 | `src/views/claimreturn/claim/warrantyaudit/index.vue` | 索赔审核列表 |
| 6 | `src/views/claimreturn/claim/warrantyaudit/edit.vue` | 索赔审核编辑 |
| 7 | `src/views/claimreturn/claim/warrantysettle/index.vue` | 索赔结算列表 |
| 8 | `src/views/claimreturn/claim/warrantysettle/edit.vue` | 索赔结算编辑 |

#### `claimreturn/oldpart/` — 6 个

| # | 文件 | 功能 |
|---|---|---|
| 9 | `src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/index.vue` | 旧件销毁单列表 |
| 10 | `src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit.vue` | 旧件销毁单编辑 |
| 11 | `src/views/claimreturn/oldpart/inventory/oem/index.vue` | 旧件 OEM 库存列表 |
| 12 | `src/views/claimreturn/oldpart/inventory/oem/edit.vue` | 旧件 OEM 库存编辑 |
| 13 | `src/views/claimreturn/oldpart/returnorder/index.vue` | 旧件退库单列表 |
| 14 | `src/views/claimreturn/oldpart/returnorder/edit.vue` | **本期新增** — 旧件退库单编辑 |

### 2.4 主数据 (`datacenter/`) — 7 个文件

| # | 文件 | 功能 |
|---|---|---|
| 1 | `src/views/datacenter/vehicle/serviceDealerChangeApply/index.vue` | 服务门店变更申请列表 |
| 2 | `src/views/datacenter/vehicle/serviceProxyHis/edit.vue` | 维修履历详情 |
| 3 | `src/views/datacenter/vehicle/serviceProxyHis/index.vue` | 维修履历列表 |
| 4 | `src/views/datacenter/vehicle/vehicleOwnerChangeApply/edit.vue` | 车主信息变更申请编辑 |
| 5 | `src/views/datacenter/vehicle/vehicleOwnerChangeApply/index.vue` | 车主信息变更申请列表 |
| 6 | `src/views/datacenter/vehicle/vehicleProfile/edit.vue` | 车辆档案详情 |
| 7 | `src/views/datacenter/vehicle/vehicleProfile/index.vue` | 车辆档案列表 |

## 3. 实际替换方式

按实施计划 § 5 的 sed 命令批量执行（修正版）：

```bash
# 1) URL 路径替换
find src -type f \( -name "*.vue" -o -name "*.js" \) -print0 | xargs -0 sed -i \
  's|/partner/channelManagement/shopDetail|/datacenter/store/store/detail|g'

# 2) URL query 参数名替换（仅匹配 ?dealerCode= 和 &dealerCode=，不动对象字面量 key）
find src -type f \( -name "*.vue" -o -name "*.js" \) -print0 | xargs -0 sed -i \
  -e 's|?dealerCode=|?storeCode=|g' \
  -e 's|\&dealerCode=|\&storeCode=|g'

# 3) $router.push({ query: { dealerCode: ... } }) 模式 — 精确锚定
find src -type f \( -name "*.vue" -o -name "*.js" \) -print0 | xargs -0 sed -i \
  -e 's|dealerCode: row.dealerCode|storeCode: row.dealerCode|g' \
  -e 's|dealerCode: form.dealerCode|storeCode: form.dealerCode|g'

# 4) num=2 参数丢弃（commit 250cde49）
find src -type f \( -name "*.vue" -o -name "*.js" \) -print0 | xargs -0 sed -i \
  -e 's|?num=2&storeCode=|?storeCode=|g' \
  -e 's|\&num=2&storeCode=|\&storeCode=|g'
```

## 4. 验证

```bash
# 应为 0
grep -rn "channelManagement/shopDetail" src
grep -rnE '\?dealerCode=|\&dealerCode=' src
grep -rn 'datacenter/store/store/detail?num' src

# 字段访问保留（row.dealerCode、form.dealerCode 等）
grep -rn 'dealerCode:' src | grep -v '?dealerCode\|\&dealerCode=' | head -10
```

## 5. 与原始 spec 文件清单的差异

| 项目 | 原始 spec | 实际 |
|---|---|---|
| 总文件数 | 99 (98 .vue + commonMixins.js) | **100 .vue** |
| `commonMixins.js` | 列出但实际未动 | 已剔除（子模块独立维护） |
| `sparepart/basic/purchaseTimesLimit/edit.vue` | 遗漏 | **已补全** |
| `claimreturn/oldpart/returnorder/edit.vue` | 遗漏 | **已补全** |

两处遗漏源于最初 `grep` 工具对路径通配/编码的覆盖差异，已在最终 commit 中正确替换。