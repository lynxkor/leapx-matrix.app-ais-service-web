# 门店详情 URL 迁移 — 文件清单

> 本期要替换 100 个文件、114 处 `channelManagement/shopDetail` 引用。新 URL：`/datacenter/store/store/detail?storeCode=...`。

## 1. 汇总

| 项目 | 文件数 | 替换处数 |
|---|---|---|
| `sparepart/` | 54 | 约 60 处 |
| `datacenter/` | 7 | 约 11 处 |
| `claimreturn/` | 13 | 约 15 处 |
| `maintain/` | 25 | 约 26 处 |
| `libs/mixins/` | 1 | 1 处 |
| **合计** | **100** | **114** |

## 2. 文件清单

### 2.1 售后维修 (`maintain/`) — 18 个文件

| # | 文件 | 模块 | 功能 |
|---|---|---|---|
| 1 | `src/views/maintain/basic/dealerDiscount/index.vue` | 基础数据 | 门店折扣列表 |
| 2 | `src/views/maintain/basic/dealerDiscount/edit.vue` | 基础数据 | 门店折扣编辑 |
| 3 | `src/views/maintain/basic/dealerStation/index.vue` | 基础数据 | 门店工时设置列表 |
| 4 | `src/views/maintain/basic/dealerStation/edit.vue` | 基础数据 | 门店工时设置编辑 |
| 5 | `src/views/maintain/basic/dealerWorkTeam/index.vue` | 基础数据 | 门店维修班组列表 |
| 6 | `src/views/maintain/basic/dealerWorkTeam/edit.vue` | 基础数据 | 门店维修班组编辑 |
| 7 | `src/views/maintain/basic/dealerWorkhourPriceSetting/index.vue` | 基础数据 | 门店工时单价设置列表 |
| 8 | `src/views/maintain/basic/dealerWorkhourPriceSetting/edit.vue` | 基础数据 | 门店工时单价设置编辑 |
| 9 | `src/views/maintain/sp/companyInfo/index.vue` | 维修单 | 公司信息 |
| 10 | `src/views/maintain/sp/ownersEquityOrder/index.vue` | 维修单 | 维修权益单 |
| 11 | `src/views/maintain/sp/preAuth/index.vue` | 维修单 | 预授权列表 |
| 12 | `src/views/maintain/sp/preAuth/edit.vue` | 维修单 | 预授权编辑 |
| 13 | `src/views/maintain/sp/qualityOrderReport/index.vue` | 维修单 | 质检单列表 |
| 14 | `src/views/maintain/sp/qualityOrderReport/edit.vue` | 维修单 | 质检单编辑 |
| 15 | `src/views/maintain/sp/repairRecord/index.vue` | 维修单 | 维修记录列表 |
| 16 | `src/views/maintain/sp/repairWorkRecord/index.vue` | 维修单 | 维修工时记录 |
| 17 | `src/views/maintain/sp/restatement/index.vue` | 维修单 | 补开发票列表 |
| 18 | `src/views/maintain/sp/restatement/edit.vue` | 维修单 | 补开发票编辑 |
| 19 | `src/views/maintain/sp/serviceProxy/index.vue` | 维修单 | 维修代办列表 |
| 20 | `src/views/maintain/sp/serviceProxy/components/BasicInfo/index.vue` | 维修单 | 维修代办-基本信息 |
| 21 | `src/views/maintain/sp/serviceProxy/components/SparepartsInfo/index.vue` | 维修单 | 维修代办-备件信息 |
| 22 | `src/views/maintain/sp/serviceStatement/index.vue` | 维修单 | 维修结算单列表 |
| 23 | `src/views/maintain/sp/serviceStatement/edit.vue` | 维修单 | 维修结算编辑 |
| 24 | `src/views/maintain/sp/vehRetentionList/index.vue` | 维修单 | 车辆留存单列表 |
| 25 | `src/views/maintain/sp/vehRetentionList/edit.vue` | 维修单 | 车辆留存单编辑 |

### 2.2 备件 (`sparepart/`) — 50 个文件

| # | 文件 | 模块 | 功能 |
|---|---|---|---|
| 1 | `src/views/sparepart/basic/dealerSparePart/index.vue` | 基础数据 | 门店备件列表 |
| 2 | `src/views/sparepart/basic/dealerSparePart/edit.vue` | 基础数据 | 门店备件编辑（2 处） |
| 3 | `src/views/sparepart/basic/predictBlacklist/edit.vue` | 基础数据 | 备件预占黑名单编辑 |
| 4 | `src/views/sparepart/basic/purchaseMinAmount/index.vue` | 基础数据 | 备件采购起订量列表 |
| 5 | `src/views/sparepart/basic/purchaseMinAmount/edit.vue` | 基础数据 | 备件采购起订量编辑 |
| 6 | `src/views/sparepart/basic/purchasePrice/index.vue` | 基础数据 | 备件采购价列表 |
| 7 | `src/views/sparepart/basic/purchasePrice/edit.vue` | 基础数据 | 备件采购价编辑 |
| 8 | `src/views/sparepart/basic/purchasePriceCoupon/index.vue` | 基础数据 | 备件采购价券列表 |
| 9 | `src/views/sparepart/basic/purchaseTimesLimit/index.vue` | 基础数据 | 备件采购限次列表 |
| 10 | `src/views/sparepart/basic/sparePartPurchasePrice/index.vue` | 基础数据 | 备件采购价格列表 |
| 11 | `src/views/sparepart/basic/sparePartPurchasePrice/edit.vue` | 基础数据 | 备件采购价格编辑 |
| 12 | `src/views/sparepart/claim/sparePartClaim/index.vue` | 备件理赔 | 备件索赔列表 |
| 13 | `src/views/sparepart/claim/sparePartClaim/edit.vue` | 备件理赔 | 备件索赔编辑 |
| 14 | `src/views/sparepart/fund/accountOperateApply/index.vue` | 资金管理 | 资金操作申请列表 |
| 15 | `src/views/sparepart/fund/accountOperateApply/edit.vue` | 资金管理 | 资金操作申请编辑 |
| 16 | `src/views/sparepart/fund/accountOperateDeductionApply/index.vue` | 资金管理 | 资金扣款申请列表 |
| 17 | `src/views/sparepart/fund/accountOperateDeductionApply/edit.vue` | 资金管理 | 资金扣款申请编辑 |
| 18 | `src/views/sparepart/inbound/dealerInboundOrder/index.vue` | 入库 | 门店入库单列表 |
| 19 | `src/views/sparepart/inbound/inboundOrder/index.vue` | 入库 | 入库单列表 |
| 20 | `src/views/sparepart/inbound/inboundOrder/edit.vue` | 入库 | 入库单编辑 |
| 21 | `src/views/sparepart/inbound/maintenanceReturnInbound/index.vue` | 入库 | 维修退货入库列表 |
| 22 | `src/views/sparepart/inbound/maintenanceReturnInbound/edit.vue` | 入库 | 维修退货入库编辑 |
| 23 | `src/views/sparepart/outbound/dealerOutboundOrder/index.vue` | 出库 | 门店出库单列表 |
| 24 | `src/views/sparepart/outbound/dealerOutboundOrder/edit.vue` | 出库 | 门店出库单编辑 |
| 25 | `src/views/sparepart/outbound/dealerReturnOrder/index.vue` | 出库 | 门店退货单列表 |
| 26 | `src/views/sparepart/outbound/maintenanceOutboundOrder/index.vue` | 出库 | 维修出库单列表 |
| 27 | `src/views/sparepart/outbound/maintenanceOutboundOrder/edit.vue` | 出库 | 维修出库单编辑 |
| 28 | `src/views/sparepart/purchase/backOrder/index.vue` | 采购 | 备件退库单列表（2 处） |
| 29 | `src/views/sparepart/purchase/backOrder/edit.vue` | 采购 | 备件退库单编辑 |
| 30 | `src/views/sparepart/purchase/boToShareTransfer/index.vue` | 采购 | 备件调拨列表 |
| 31 | `src/views/sparepart/purchase/boToShareTransfer/edit.vue` | 采购 | 备件调拨编辑 |
| 32 | `src/views/sparepart/purchase/purchaseApply/index.vue` | 采购 | 备件采购申请列表 |
| 33 | `src/views/sparepart/purchase/purchaseApply/edit.vue` | 采购 | 备件采购申请编辑 |
| 34 | `src/views/sparepart/purchase/purchaseOrder/index.vue` | 采购 | 备件采购单列表（3 处） |
| 35 | `src/views/sparepart/purchase/purchaseOrder/edit.vue` | 采购 | 备件采购单编辑 |
| 36 | `src/views/sparepart/purchase/shippingOrder/index.vue` | 采购 | 备件发货单列表 |
| 37 | `src/views/sparepart/purchase/shippingOrder/edit.vue` | 采购 | 备件发货单编辑 |
| 38 | `src/views/sparepart/return/returnException/index.vue` | 退库 | 异常退库列表 |
| 39 | `src/views/sparepart/return/returnException/edit.vue` | 退库 | 异常退库编辑 |
| 40 | `src/views/sparepart/return/returnOrder/index.vue` | 退库 | 退库单列表 |
| 41 | `src/views/sparepart/return/returnOrder/edit.vue` | 退库 | 退库单编辑 |
| 42 | `src/views/sparepart/sale/retailOrder/index.vue` | 销售 | 零售单列表 |
| 43 | `src/views/sparepart/sale/retailOrderOut/index.vue` | 销售 | 零售单出库列表 |
| 44 | `src/views/sparepart/sale/retailOrderReturn/index.vue` | 销售 | 零售单退货列表 |
| 45 | `src/views/sparepart/warehouse/inventory/index.vue` | 仓库 | 库存列表 |
| 46 | `src/views/sparepart/warehouse/oemOutboundOrder/index.vue` | 仓库 | OEM 出库单列表（2 处） |
| 47 | `src/views/sparepart/warehouse/oemOutboundOrder/edit.vue` | 仓库 | OEM 出库单编辑 |
| 48 | `src/views/sparepart/warehouse/sharedInventory/index.vue` | 仓库 | 共享库存列表 |
| 49 | `src/views/sparepart/warehouse/stockTaking/index.vue` | 仓库 | 盘点列表 |
| 50 | `src/views/sparepart/warehouse/stockTaking/edit.vue` | 仓库 | 盘点编辑 |
| 51 | `src/views/sparepart/warehouse/stockTakingDifferences/index.vue` | 仓库 | 盘点差异列表 |
| 52 | `src/views/sparepart/warehouse/stockTakingDifferencesProfit/index.vue` | 仓库 | 盘点差异收益列表 |
| 53 | `src/views/sparepart/warehouse/warehouse/index.vue` | 仓库 | 仓库列表 |

### 2.3 索赔与旧件 (`claimreturn/`) — 22 个文件

| # | 文件 | 模块 | 功能 |
|---|---|---|---|
| 1 | `src/views/claimreturn/claim/claimtrace/claimTraceOrder/index.vue` | 索赔 | 索赔追溯单列表 |
| 2 | `src/views/claimreturn/claim/claimtrace/claimTraceOrder/edit.vue` | 索赔 | 索赔追溯单编辑 |
| 3 | `src/views/claimreturn/claim/warrantyapply/index.vue` | 索赔 | 索赔申请列表 |
| 4 | `src/views/claimreturn/claim/warrantyapply/edit.vue` | 索赔 | 索赔申请编辑 |
| 5 | `src/views/claimreturn/claim/warrantyaudit/index.vue` | 索赔 | 索赔审核列表（2 处） |
| 6 | `src/views/claimreturn/claim/warrantyaudit/edit.vue` | 索赔 | 索赔审核编辑（2 处） |
| 7 | `src/views/claimreturn/claim/warrantysettle/index.vue` | 索赔 | 索赔结算列表 |
| 8 | `src/views/claimreturn/claim/warrantysettle/edit.vue` | 索赔 | 索赔结算编辑 |
| 9 | `src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/index.vue` | 旧件 | 旧件销毁单列表 |
| 10 | `src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit.vue` | 旧件 | 旧件销毁单编辑 |
| 11 | `src/views/claimreturn/oldpart/inventory/oem/index.vue` | 旧件 | 旧件 OEM 库存列表 |
| 12 | `src/views/claimreturn/oldpart/inventory/oem/edit.vue` | 旧件 | 旧件 OEM 库存编辑 |
| 13 | `src/views/claimreturn/oldpart/returnorder/index.vue` | 旧件 | 旧件退库单列表（2 处） |

### 2.4 主数据 (`datacenter/`) — 9 个文件

| # | 文件 | 模块 | 功能 |
|---|---|---|---|
| 1 | `src/views/datacenter/vehicle/serviceDealerChangeApply/index.vue` | 车辆档案 | 服务门店变更申请列表 |
| 2 | `src/views/datacenter/vehicle/serviceProxyHis/edit.vue` | 车辆档案 | 维修履历详情 |
| 3 | `src/views/datacenter/vehicle/serviceProxyHis/index.vue` | 车辆档案 | 维修履历列表 |
| 4 | `src/views/datacenter/vehicle/vehicleOwnerChangeApply/edit.vue` | 车辆档案 | 车主信息变更申请编辑 |
| 5 | `src/views/datacenter/vehicle/vehicleOwnerChangeApply/index.vue` | 车辆档案 | 车主信息变更申请列表 |
| 6 | `src/views/datacenter/vehicle/vehicleProfile/edit.vue` | 车辆档案 | 车辆档案详情（3 处） |
| 7 | `src/views/datacenter/vehicle/vehicleProfile/index.vue` | 车辆档案 | 车辆档案列表（3 处） |

> 注：`datacenter/store/` 子目录由本期前序任务新增，本身已是新地址，不在本次替换范围内。

### 2.5 公共 mixin — 1 个文件

| # | 文件 | 说明 |
|---|---|---|
| 1 | `src/libs/mixins/commonMixins.js` | `navigateToRoute()` 工具方法内部 docstring 示例 |

### 2.6 `navigateToRoute({ path: ..., query: { dealerCode } })` 模式 — 6 个文件

实际调用 `this.navigateToRoute({ path: '/partner/channelManagement/shopDetail', query: { dealerCode } })` 的位置（不是 `window.open` 也不是 `<el-link>`，而是 `$router.push` 包装）：

| # | 文件 | 行号 | query 来源 |
|---|---|---|---|
| 1 | `src/views/maintain/basic/dealerDiscount/index.vue` | 184 | `row.dealerCode` |
| 2 | `src/views/claimreturn/oldpart/inventory/oem/index.vue` | 448 | `row.dealerCode` |
| 3 | `src/views/claimreturn/oldpart/inventory/oem/edit.vue` | 160 | `form.dealerCode` |
| 4 | `src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/index.vue` | 207 | `row.dealerCode` |
| 5 | `src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit.vue` | 326 | `row.dealerCode` |
| 6 | `src/views/claimreturn/oldpart/returnorder/index.vue` | 203 | `row.dealerCode` |

> 全部 6 处都通过 `this.navigateToRoute({ path: '/partner/channelManagement/shopDetail', query: { dealerCode: ... } })` 跳转。sed 第二条命令会同时把 `path:` 后面的 URL 字符串与 `dealerCode:` 字段名替换。

## 3. 替换操作

按 spec § 5 的两行 sed 命令批量执行：

```bash
# 路径替换
find src -type f \( -name "*.vue" -o -name "*.js" \) | xargs sed -i \
  's|/partner/channelManagement/shopDetail|/datacenter/store/store/detail|g'

# 参数名替换（仅 query 字符串与对象 key，不动字段访问）
find src -type f \( -name "*.vue" -o -name "*.js" \) | xargs sed -i \
  's|?dealerCode=|?storeCode=|g; s|&dealerCode=|\&storeCode=|g; s|dealerCode: |storeCode: |g'
```

## 4. 验证

```bash
# 应为 0 条
grep -rn "channelManagement/shopDetail" src
grep -rn "?dealerCode=\| dealerCode:" src

# 应保留字段访问（row.dealerCode 等）
grep -rn "dealerCode" src | head -20
```

## 5. 抽样校验（建议）

替换后人工核对 5 个文件，确认跳转上下文正确：

| # | 文件 | 重点关注 |
|---|---|---|
| 1 | `src/views/datacenter/vehicle/vehicleProfile/index.vue` | 含 `num=2` 与销售/服务/交付3 个字段名 |
| 2 | `src/views/sparepart/warehouse/oemOutboundOrder/index.vue` | 含 2 处 |
| 3 | `src/libs/mixins/commonMixins.js` | 工具方法 |
| 4 | `src/views/maintain/sp/serviceProxy/components/BasicInfo/index.vue` | 组件内跳转 |
| 5 | `src/views/claimreturn/oldpart/returnorder/index.vue` | 含 `$router.push` 模式 |