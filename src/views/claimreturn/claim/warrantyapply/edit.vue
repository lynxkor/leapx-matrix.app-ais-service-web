<template>
  <edit-base-container
    ref="containerRef"
    :id="_id"
    :title="title"
    :isEditing.sync="isEditing"
    :form.sync="form"
    :originalForm.sync="originalForm"
    :submitRequest="submitRequest"
    :detailRequest="detailRequest"
  >
    <el-main>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="主键：" prop="id">
              <el-input
                placeholder="请输入"
                v-model="form.id"
                clearable
              />
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              <el-input
                placeholder="请输入"
                v-model="form.creator"
                clearable
              />
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              <el-input
                placeholder="请输入"
                v-model="form.creatorName"
                clearable
              />
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              <el-input
                placeholder="请输入"
                v-model="form.modifier"
                clearable
              />
            </el-form-item>
            <el-form-item label="修改者名称：" prop="modifierName">
              <el-input
                placeholder="请输入"
                v-model="form.modifierName"
                clearable
              />
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              <el-date-picker
                v-model="form.updateTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input
                placeholder="请输入"
                v-model="form.remark"
                clearable
              />
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              <el-input
                placeholder="请输入"
                v-model="form.statusDesc"
                clearable
              />
            </el-form-item>
            <el-form-item label="保修申请单号：" prop="applyNo">
              <el-input
                placeholder="请输入"
                v-model="form.applyNo"
                clearable
              />
            </el-form-item>
            <el-form-item label="接车施工单 ID：" prop="serviceProxyId">
              <el-input
                placeholder="请输入"
                v-model="form.serviceProxyId"
                clearable
              />
            </el-form-item>
            <el-form-item label="接车施工单号：" prop="serviceProxyNo">
              <el-input
                placeholder="请输入"
                v-model="form.serviceProxyNo"
                clearable
              />
            </el-form-item>
            <el-form-item label="结算单 ID：" prop="statementId">
              <el-input
                placeholder="请输入"
                v-model="form.statementId"
                clearable
              />
            </el-form-item>
            <el-form-item label="结算单号：" prop="statementCode">
              <el-input
                placeholder="请输入"
                v-model="form.statementCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="结算类型 ID：" prop="checkoutTypeId">
              <el-input
                placeholder="请输入"
                v-model="form.checkoutTypeId"
                clearable
              />
            </el-form-item>
            <el-form-item label="结算类型编码：" prop="checkoutTypeCode">
              <el-input
                placeholder="请输入"
                v-model="form.checkoutTypeCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="保修类型 ID：" prop="repairItemTypeId">
              <el-input
                placeholder="请输入"
                v-model="form.repairItemTypeId"
                clearable
              />
            </el-form-item>
            <el-form-item label="保修类型名称：" prop="repairItemTypeName">
              <el-input
                placeholder="请输入"
                v-model="form.repairItemTypeName"
                clearable
              />
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-input
                placeholder="请输入"
                v-model="form.dealerCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="归属门店 ID（组织 ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
              <el-input
                placeholder="请输入"
                v-model="form.ownerOrgId"
                clearable
              />
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              <el-input
                placeholder="请输入"
                v-model="form.dealerName"
                clearable
              />
            </el-form-item>
            <el-form-item label="门店所属区域名称：" prop="dealerRegionName">
              <el-input
                placeholder="请输入"
                v-model="form.dealerRegionName"
                clearable
              />
            </el-form-item>
            <el-form-item label="门店所属区域编码：" prop="dealerRegionCode">
              <el-input
                placeholder="请输入"
                v-model="form.dealerRegionCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="维修开始时间：" prop="repairStartTime">
              <el-date-picker
                v-model="form.repairStartTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="维修结束时间：" prop="repairEndTime">
              <el-date-picker
                v-model="form.repairEndTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="保修单状态，10:未提交;20:审核中;25:待保修经理审核;30:待总经理审核;40:已驳回;50:已拒赔;60:审核通过;70:已结算;80:已付款;90:已作废：" prop="applyStatus">
              <el-input
                placeholder="请输入"
                v-model="form.applyStatus"
                clearable
              />
            </el-form-item>
            <el-form-item label="旧件返还状态，0:待返还;1:已部分返还;2:已全部返还;3:无需返还;4:无旧件：" prop="returnPartsStatus">
              <el-input
                placeholder="请输入"
                v-model="form.returnPartsStatus"
                clearable
              />
            </el-form-item>
            <el-form-item label="是否设定自动审核，0:否;1:是：" prop="isAutoAuditSet">
              <el-input
                placeholder="请输入"
                v-model="form.isAutoAuditSet"
                clearable
              />
            </el-form-item>
            <el-form-item label="是否自动审核，0:否;1:是：" prop="isAutoAudited">
              <el-input
                placeholder="请输入"
                v-model="form.isAutoAudited"
                clearable
              />
            </el-form-item>
            <el-form-item label="未自动审核原因：" prop="autoAuditFailReason">
              <el-input
                placeholder="请输入"
                v-model="form.autoAuditFailReason"
                clearable
              />
            </el-form-item>
            <el-form-item label="预授权 ID：" prop="preAuthId">
              <el-input
                placeholder="请输入"
                v-model="form.preAuthId"
                clearable
              />
            </el-form-item>
            <el-form-item label="预授权编码：" prop="preAuthCode">
              <el-input
                placeholder="请输入"
                v-model="form.preAuthCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="服务活动 ID：" prop="serviceActivityId">
              <el-input
                placeholder="请输入"
                v-model="form.serviceActivityId"
                clearable
              />
            </el-form-item>
            <el-form-item label="服务活动编码：" prop="serviceActivityCode">
              <el-input
                placeholder="请输入"
                v-model="form.serviceActivityCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="服务活动名称：" prop="serviceActivityName">
              <el-input
                placeholder="请输入"
                v-model="form.serviceActivityName"
                clearable
              />
            </el-form-item>
            <el-form-item label="活动方案 ID：" prop="schemeId">
              <el-input
                placeholder="请输入"
                v-model="form.schemeId"
                clearable
              />
            </el-form-item>
            <el-form-item label="活动方案名称：" prop="schemeName">
              <el-input
                placeholder="请输入"
                v-model="form.schemeName"
                clearable
              />
            </el-form-item>
            <el-form-item label="首次提交时间：" prop="firstSubmitTime">
              <el-date-picker
                v-model="form.firstSubmitTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="当前提交时间：" prop="currentSubmitTime">
              <el-date-picker
                v-model="form.currentSubmitTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="当前提交人 ID：" prop="currentSubmitterId">
              <el-input
                placeholder="请输入"
                v-model="form.currentSubmitterId"
                clearable
              />
            </el-form-item>
            <el-form-item label="当前提交人名称：" prop="currentSubmitterName">
              <el-input
                placeholder="请输入"
                v-model="form.currentSubmitterName"
                clearable
              />
            </el-form-item>
            <el-form-item label="审批时间：" prop="approvalTime">
              <el-date-picker
                v-model="form.approvalTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="审批说明：" prop="approvalRemark">
              <el-input
                placeholder="请输入"
                v-model="form.approvalRemark"
                clearable
              />
            </el-form-item>
            <el-form-item label="审批人 ID：" prop="approverId">
              <el-input
                placeholder="请输入"
                v-model="form.approverId"
                clearable
              />
            </el-form-item>
            <el-form-item label="审批人名称：" prop="approverName">
              <el-input
                placeholder="请输入"
                v-model="form.approverName"
                clearable
              />
            </el-form-item>
            <el-form-item label="错误代码 ID：" prop="errorCodeId">
              <el-input
                placeholder="请输入"
                v-model="form.errorCodeId"
                clearable
              />
            </el-form-item>
            <el-form-item label="错误内容：" prop="errorContent">
              <el-input
                placeholder="请输入"
                v-model="form.errorContent"
                clearable
              />
            </el-form-item>
            <el-form-item label="保修付款时间：" prop="paymentTime">
              <el-date-picker
                v-model="form.paymentTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="索赔追溯单 ID：" prop="claimTrackId">
              <el-input
                placeholder="请输入"
                v-model="form.claimTrackId"
                clearable
              />
            </el-form-item>
            <el-form-item label="索赔追溯单号：" prop="claimTrackNo">
              <el-input
                placeholder="请输入"
                v-model="form.claimTrackNo"
                clearable
              />
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              <el-input
                placeholder="请输入"
                v-model="form.vin"
                clearable
              />
            </el-form-item>
            <el-form-item label="车牌号：" prop="vehiclePlateNo">
              <el-input
                placeholder="请输入"
                v-model="form.vehiclePlateNo"
                clearable
              />
            </el-form-item>
            <el-form-item label="生产日期：" prop="produceDate">
              <el-date-picker
                v-model="form.produceDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="车辆用途，1:家用;2:运营;4:B 级车;10:J 级车;20:J1 级车;30:专车;60:报废灭失：" prop="vehicleProperty">
              <el-input
                placeholder="请输入"
                v-model="form.vehicleProperty"
                clearable
              />
            </el-form-item>
            <el-form-item label="车型 ID：" prop="vehicleModelId">
              <el-input
                placeholder="请输入"
                v-model="form.vehicleModelId"
                clearable
              />
            </el-form-item>
            <el-form-item label="车型名称：" prop="vehicleModelName">
              <el-input
                placeholder="请输入"
                v-model="form.vehicleModelName"
                clearable
              />
            </el-form-item>
            <el-form-item label="保修开始日期：" prop="warrantyStartdate">
              <el-date-picker
                v-model="form.warrantyStartdate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="服务月份：" prop="serviceMonth">
              <el-input
                placeholder="请输入"
                v-model="form.serviceMonth"
                clearable
              />
            </el-form-item>
            <el-form-item label="三包预警，0:-- ;10:正常;20:黄色;30:红色;40:过期：" prop="alarmLevel">
              <el-input
                placeholder="请输入"
                v-model="form.alarmLevel"
                clearable
              />
            </el-form-item>
            <el-form-item label="进店里程：" prop="mileage">
              <el-input
                placeholder="请输入"
                v-model="form.mileage"
                clearable
              />
            </el-form-item>
            <el-form-item label="保修预警信息：" prop="warrantyWarningMsg">
              <el-input
                placeholder="请输入"
                v-model="form.warrantyWarningMsg"
                clearable
              />
            </el-form-item>
            <el-form-item label="整车是否在保（预测），0:否;1:是：" prop="isLifetimeWarrantyForecast">
              <el-date-picker
                v-model="form.isLifetimeWarrantyForecast"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="整车保修结束日期（预测）：" prop="warrantyEnddateForecast">
              <el-date-picker
                v-model="form.warrantyEnddateForecast"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="是否终身免保，0:否;1:是：" prop="isLifetimeWarranty">
              <el-date-picker
                v-model="form.isLifetimeWarranty"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="车主姓名：" prop="ownerName">
              <el-input
                placeholder="请输入"
                v-model="form.ownerName"
                clearable
              />
            </el-form-item>
            <el-form-item label="车主电话：" prop="ownerPhone">
              <el-input
                placeholder="请输入"
                v-model="form.ownerPhone"
                clearable
              />
            </el-form-item>
            <el-form-item label="送修人姓名：" prop="shuttleName">
              <el-input
                placeholder="请输入"
                v-model="form.shuttleName"
                clearable
              />
            </el-form-item>
            <el-form-item label="送修人电话：" prop="shuttlePhone">
              <el-input
                placeholder="请输入"
                v-model="form.shuttlePhone"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量反馈报告 ID：" prop="qualityOrderReportId">
              <el-input
                placeholder="请输入"
                v-model="form.qualityOrderReportId"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量反馈报告编号：" prop="qualityOrderReport">
              <el-input
                placeholder="请输入"
                v-model="form.qualityOrderReport"
                clearable
              />
            </el-form-item>
            <el-form-item label="VFG ID：" prop="vfgId">
              <el-input
                placeholder="请输入"
                v-model="form.vfgId"
                clearable
              />
            </el-form-item>
            <el-form-item label="VFG 编码：" prop="vfgCode">
              <el-input
                placeholder="请输入"
                v-model="form.vfgCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="VFG 名称：" prop="vfgName">
              <el-input
                placeholder="请输入"
                v-model="form.vfgName"
                clearable
              />
            </el-form-item>
            <el-form-item label="VRT ID：" prop="vrtId">
              <el-input
                placeholder="请输入"
                v-model="form.vrtId"
                clearable
              />
            </el-form-item>
            <el-form-item label="VRT 编码：" prop="vrtCode">
              <el-input
                placeholder="请输入"
                v-model="form.vrtCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="VRT 名称：" prop="vrtName">
              <el-input
                placeholder="请输入"
                v-model="form.vrtName"
                clearable
              />
            </el-form-item>
            <el-form-item label="CCC ID：" prop="cccId">
              <el-input
                placeholder="请输入"
                v-model="form.cccId"
                clearable
              />
            </el-form-item>
            <el-form-item label="CCC 编码：" prop="cccCode">
              <el-input
                placeholder="请输入"
                v-model="form.cccCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="CCC 名称：" prop="cccName">
              <el-input
                placeholder="请输入"
                v-model="form.cccName"
                clearable
              />
            </el-form-item>
            <el-form-item label="故障现象描述：" prop="faultPhenomenon">
              <el-input
                placeholder="请输入"
                v-model="form.faultPhenomenon"
                clearable
              />
            </el-form-item>
            <el-form-item label="故障排查流程：" prop="troubleshootingFlow">
              <el-input
                placeholder="请输入"
                v-model="form.troubleshootingFlow"
                clearable
              />
            </el-form-item>
            <el-form-item label="工时索赔小计：" prop="laborClaimTotal">
              <el-input
                placeholder="请输入"
                v-model="form.laborClaimTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="工时费用小计：" prop="workCostCount">
              <el-input
                placeholder="请输入"
                v-model="form.workCostCount"
                clearable
              />
            </el-form-item>
            <el-form-item label="工时分担比例：" prop="laborShareRatio">
              <el-input
                placeholder="请输入"
                v-model="form.laborShareRatio"
                clearable
              />
            </el-form-item>
            <el-form-item label="审批同意工时索赔小计：" prop="approvedLaborClaimTotal">
              <el-input
                placeholder="请输入"
                v-model="form.approvedLaborClaimTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="备件索赔小计：" prop="partsClaimTotal">
              <el-input
                placeholder="请输入"
                v-model="form.partsClaimTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="备件费用小计：" prop="partsCostTotal">
              <el-input
                placeholder="请输入"
                v-model="form.partsCostTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="备件分担比例：" prop="partsShareRatio">
              <el-input
                placeholder="请输入"
                v-model="form.partsShareRatio"
                clearable
              />
            </el-form-item>
            <el-form-item label="审批同意备件索赔小计：" prop="approvedPartsClaimTotal">
              <el-input
                placeholder="请输入"
                v-model="form.approvedPartsClaimTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="其他索赔小计：" prop="otherClaimTotal">
              <el-input
                placeholder="请输入"
                v-model="form.otherClaimTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="其他费用小计：" prop="otherCostTotal">
              <el-input
                placeholder="请输入"
                v-model="form.otherCostTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="其他分担比例：" prop="otherShareRatio">
              <el-input
                placeholder="请输入"
                v-model="form.otherShareRatio"
                clearable
              />
            </el-form-item>
            <el-form-item label="审批同意其他索赔小计：" prop="approvedOtherClaimTotal">
              <el-input
                placeholder="请输入"
                v-model="form.approvedOtherClaimTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="索赔总金额：" prop="totalClaimAmount">
              <el-input
                placeholder="请输入"
                v-model="form.totalClaimAmount"
                clearable
              />
            </el-form-item>
            <el-form-item label="费用总金额：" prop="totalCostAmount">
              <el-input
                placeholder="请输入"
                v-model="form.totalCostAmount"
                clearable
              />
            </el-form-item>
            <el-form-item label="审批平台单号：" prop="platformApprovalNo">
              <el-input
                placeholder="请输入"
                v-model="form.platformApprovalNo"
                clearable
              />
            </el-form-item>
            <el-form-item label="主因备件 ID：" prop="mainPartId">
              <el-input
                placeholder="请输入"
                v-model="form.mainPartId"
                clearable
              />
            </el-form-item>
            <el-form-item label="主因备件编码：" prop="mainPartCode">
              <el-input
                placeholder="请输入"
                v-model="form.mainPartCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="主因备件名称：" prop="mainPartName">
              <el-input
                placeholder="请输入"
                v-model="form.mainPartName"
                clearable
              />
            </el-form-item>
            <el-form-item label="主因供应商 ID：" prop="mainPartSupplierId">
              <el-input
                placeholder="请输入"
                v-model="form.mainPartSupplierId"
                clearable
              />
            </el-form-item>
            <el-form-item label="主因供应商编码：" prop="mainPartSupplierCode">
              <el-input
                placeholder="请输入"
                v-model="form.mainPartSupplierCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="主因供应商名称：" prop="mainPartSupplierName">
              <el-input
                placeholder="请输入"
                v-model="form.mainPartSupplierName"
                clearable
              />
            </el-form-item>
            <el-form-item label="是否使用政策工时价，0:否;1:是：" prop="isPolicyLaborPrice">
              <el-input
                placeholder="请输入"
                v-model="form.isPolicyLaborPrice"
                clearable
              />
            </el-form-item>
            <el-form-item label="政策工时单价 ID：" prop="policyLaborPriceId">
              <el-input
                placeholder="请输入"
                v-model="form.policyLaborPriceId"
                clearable
              />
            </el-form-item>
            <el-form-item label="使用政策工时额度：" prop="usedPolicyLaborQuota">
              <el-input
                placeholder="请输入"
                v-model="form.usedPolicyLaborQuota"
                clearable
              />
            </el-form-item>
            <el-form-item label="标准工时索赔小计：" prop="standardLaborClaimTotal">
              <el-input
                placeholder="请输入"
                v-model="form.standardLaborClaimTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="标准工时费用小计：" prop="standardLaborCostTotal">
              <el-input
                placeholder="请输入"
                v-model="form.standardLaborCostTotal"
                clearable
              />
            </el-form-item>
            <el-form-item label="驳回申请时间：" prop="rejectApplyTime">
              <el-date-picker
                v-model="form.rejectApplyTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="驳回申请说明：" prop="rejectApplyRemark">
              <el-input
                placeholder="请输入"
                v-model="form.rejectApplyRemark"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量驳回类型：" prop="qualityRejectType">
              <el-input
                placeholder="请输入"
                v-model="form.qualityRejectType"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量驳回申请时间：" prop="qualityRejectApplyTime">
              <el-date-picker
                v-model="form.qualityRejectApplyTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="质量驳回申请原因：" prop="qualityRejectApplyReason">
              <el-input
                placeholder="请输入"
                v-model="form.qualityRejectApplyReason"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量驳回申请人 ID：" prop="qualityRejectApplierId">
              <el-input
                placeholder="请输入"
                v-model="form.qualityRejectApplierId"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量驳回申请人名称：" prop="qualityRejectApplierName">
              <el-input
                placeholder="请输入"
                v-model="form.qualityRejectApplierName"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量驳回状态，10:申请;20:同意&驳回门店;30:同意&拒赔;40:拒绝;50:同意&不撤回：" prop="qualityRejectStatus">
              <el-input
                placeholder="请输入"
                v-model="form.qualityRejectStatus"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量驳回处理说明：" prop="qualityRejectHandlerRemark">
              <el-input
                placeholder="请输入"
                v-model="form.qualityRejectHandlerRemark"
                clearable
              />
            </el-form-item>
            <el-form-item label="质量驳回处理时间：" prop="qualityRejectHandlerTime">
              <el-date-picker
                v-model="form.qualityRejectHandlerTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="是否保修经理分级审批，0:否;1:是：" prop="isWarrantyManagerApproval">
              <el-input
                placeholder="请输入"
                v-model="form.isWarrantyManagerApproval"
                clearable
              />
            </el-form-item>
            <el-form-item label="是否总经理分级审批，0:否;1:是：" prop="isGeneralManagerApproval">
              <el-input
                placeholder="请输入"
                v-model="form.isGeneralManagerApproval"
                clearable
              />
            </el-form-item>
            <el-form-item label="保修审计明细 ID：" prop="warrantyAuditDetailId">
              <el-input
                placeholder="请输入"
                v-model="form.warrantyAuditDetailId"
                clearable
              />
            </el-form-item>
            <el-form-item label="作废人 ID：" prop="cancelUserId">
              <el-input
                placeholder="请输入"
                v-model="form.cancelUserId"
                clearable
              />
            </el-form-item>
            <el-form-item label="作废人名称：" prop="cancelUserName">
              <el-input
                placeholder="请输入"
                v-model="form.cancelUserName"
                clearable
              />
            </el-form-item>
            <el-form-item label="作废时间：" prop="cancelTime">
              <el-date-picker
                v-model="form.cancelTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="作废原因：" prop="cancelReason">
              <el-input
                placeholder="请输入"
                v-model="form.cancelReason"
                clearable
              />
            </el-form-item>
            <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
              <el-input
                placeholder="请输入"
                v-model="form.dataSource"
                clearable
              />
            </el-form-item>
          </el-form>
          <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="主键：" prop="id">
              {{ form.id }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ form.creator }}
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              {{ form.creatorName }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ form.createTime }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ form.modifier }}
            </el-form-item>
            <el-form-item label="修改者名称：" prop="modifierName">
              {{ form.modifierName }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ form.updateTime }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ form.remark }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              否
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ form.statusDesc }}
            </el-form-item>
            <el-form-item label="保修申请单号：" prop="applyNo">
              {{ form.applyNo }}
            </el-form-item>
            <el-form-item label="接车施工单 ID：" prop="serviceProxyId">
              {{ form.serviceProxyId }}
            </el-form-item>
            <el-form-item label="接车施工单号：" prop="serviceProxyNo">
              {{ form.serviceProxyNo }}
            </el-form-item>
            <el-form-item label="结算单 ID：" prop="statementId">
              {{ form.statementId }}
            </el-form-item>
            <el-form-item label="结算单号：" prop="statementCode">
              {{ form.statementCode }}
            </el-form-item>
            <el-form-item label="结算类型 ID：" prop="checkoutTypeId">
              {{ form.checkoutTypeId }}
            </el-form-item>
            <el-form-item label="结算类型编码：" prop="checkoutTypeCode">
              {{ form.checkoutTypeCode }}
            </el-form-item>
            <el-form-item label="保修类型 ID：" prop="repairItemTypeId">
              {{ form.repairItemTypeId }}
            </el-form-item>
            <el-form-item label="保修类型名称：" prop="repairItemTypeName">
              {{ form.repairItemTypeName }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ form.dealerCode }}
            </el-form-item>
            <el-form-item label="归属门店 ID（组织 ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
              {{ form.ownerOrgId }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ form.dealerName }}
            </el-form-item>
            <el-form-item label="门店所属区域名称：" prop="dealerRegionName">
              {{ form.dealerRegionName }}
            </el-form-item>
            <el-form-item label="门店所属区域编码：" prop="dealerRegionCode">
              {{ form.dealerRegionCode }}
            </el-form-item>
            <el-form-item label="维修开始时间：" prop="repairStartTime">
              {{ form.repairStartTime }}
            </el-form-item>
            <el-form-item label="维修结束时间：" prop="repairEndTime">
              {{ form.repairEndTime }}
            </el-form-item>
            <el-form-item label="保修单状态，10:未提交;20:审核中;25:待保修经理审核;30:待总经理审核;40:已驳回;50:已拒赔;60:审核通过;70:已结算;80:已付款;90:已作废：" prop="applyStatus">
              {{ form.applyStatus }}
            </el-form-item>
            <el-form-item label="旧件返还状态，0:待返还;1:已部分返还;2:已全部返还;3:无需返还;4:无旧件：" prop="returnPartsStatus">
              {{ form.returnPartsStatus }}
            </el-form-item>
            <el-form-item label="是否设定自动审核，0:否;1:是：" prop="isAutoAuditSet">
              {{ form.isAutoAuditSet }}
            </el-form-item>
            <el-form-item label="是否自动审核，0:否;1:是：" prop="isAutoAudited">
              {{ form.isAutoAudited }}
            </el-form-item>
            <el-form-item label="未自动审核原因：" prop="autoAuditFailReason">
              {{ form.autoAuditFailReason }}
            </el-form-item>
            <el-form-item label="预授权 ID：" prop="preAuthId">
              {{ form.preAuthId }}
            </el-form-item>
            <el-form-item label="预授权编码：" prop="preAuthCode">
              {{ form.preAuthCode }}
            </el-form-item>
            <el-form-item label="服务活动 ID：" prop="serviceActivityId">
              {{ form.serviceActivityId }}
            </el-form-item>
            <el-form-item label="服务活动编码：" prop="serviceActivityCode">
              {{ form.serviceActivityCode }}
            </el-form-item>
            <el-form-item label="服务活动名称：" prop="serviceActivityName">
              {{ form.serviceActivityName }}
            </el-form-item>
            <el-form-item label="活动方案 ID：" prop="schemeId">
              {{ form.schemeId }}
            </el-form-item>
            <el-form-item label="活动方案名称：" prop="schemeName">
              {{ form.schemeName }}
            </el-form-item>
            <el-form-item label="首次提交时间：" prop="firstSubmitTime">
              {{ form.firstSubmitTime }}
            </el-form-item>
            <el-form-item label="当前提交时间：" prop="currentSubmitTime">
              {{ form.currentSubmitTime }}
            </el-form-item>
            <el-form-item label="当前提交人 ID：" prop="currentSubmitterId">
              {{ form.currentSubmitterId }}
            </el-form-item>
            <el-form-item label="当前提交人名称：" prop="currentSubmitterName">
              {{ form.currentSubmitterName }}
            </el-form-item>
            <el-form-item label="审批时间：" prop="approvalTime">
              {{ form.approvalTime }}
            </el-form-item>
            <el-form-item label="审批说明：" prop="approvalRemark">
              {{ form.approvalRemark }}
            </el-form-item>
            <el-form-item label="审批人 ID：" prop="approverId">
              {{ form.approverId }}
            </el-form-item>
            <el-form-item label="审批人名称：" prop="approverName">
              {{ form.approverName }}
            </el-form-item>
            <el-form-item label="错误代码 ID：" prop="errorCodeId">
              {{ form.errorCodeId }}
            </el-form-item>
            <el-form-item label="错误内容：" prop="errorContent">
              {{ form.errorContent }}
            </el-form-item>
            <el-form-item label="保修付款时间：" prop="paymentTime">
              {{ form.paymentTime }}
            </el-form-item>
            <el-form-item label="索赔追溯单 ID：" prop="claimTrackId">
              {{ form.claimTrackId }}
            </el-form-item>
            <el-form-item label="索赔追溯单号：" prop="claimTrackNo">
              {{ form.claimTrackNo }}
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              {{ form.vin }}
            </el-form-item>
            <el-form-item label="车牌号：" prop="vehiclePlateNo">
              {{ form.vehiclePlateNo }}
            </el-form-item>
            <el-form-item label="生产日期：" prop="produceDate">
              {{ form.produceDate }}
            </el-form-item>
            <el-form-item label="车辆用途，1:家用;2:运营;4:B 级车;10:J 级车;20:J1 级车;30:专车;60:报废灭失：" prop="vehicleProperty">
              {{ form.vehicleProperty }}
            </el-form-item>
            <el-form-item label="车型 ID：" prop="vehicleModelId">
              {{ form.vehicleModelId }}
            </el-form-item>
            <el-form-item label="车型名称：" prop="vehicleModelName">
              {{ form.vehicleModelName }}
            </el-form-item>
            <el-form-item label="保修开始日期：" prop="warrantyStartdate">
              {{ form.warrantyStartdate }}
            </el-form-item>
            <el-form-item label="服务月份：" prop="serviceMonth">
              {{ form.serviceMonth }}
            </el-form-item>
            <el-form-item label="三包预警，0:-- ;10:正常;20:黄色;30:红色;40:过期：" prop="alarmLevel">
              {{ form.alarmLevel }}
            </el-form-item>
            <el-form-item label="进店里程：" prop="mileage">
              {{ form.mileage }}
            </el-form-item>
            <el-form-item label="保修预警信息：" prop="warrantyWarningMsg">
              {{ form.warrantyWarningMsg }}
            </el-form-item>
            <el-form-item label="整车是否在保（预测），0:否;1:是：" prop="isLifetimeWarrantyForecast">
              {{ form.isLifetimeWarrantyForecast }}
            </el-form-item>
            <el-form-item label="整车保修结束日期（预测）：" prop="warrantyEnddateForecast">
              {{ form.warrantyEnddateForecast }}
            </el-form-item>
            <el-form-item label="是否终身免保，0:否;1:是：" prop="isLifetimeWarranty">
              {{ form.isLifetimeWarranty }}
            </el-form-item>
            <el-form-item label="车主姓名：" prop="ownerName">
              {{ form.ownerName }}
            </el-form-item>
            <el-form-item label="车主电话：" prop="ownerPhone">
              {{ form.ownerPhone }}
            </el-form-item>
            <el-form-item label="送修人姓名：" prop="shuttleName">
              {{ form.shuttleName }}
            </el-form-item>
            <el-form-item label="送修人电话：" prop="shuttlePhone">
              {{ form.shuttlePhone }}
            </el-form-item>
            <el-form-item label="质量反馈报告 ID：" prop="qualityOrderReportId">
              {{ form.qualityOrderReportId }}
            </el-form-item>
            <el-form-item label="质量反馈报告编号：" prop="qualityOrderReport">
              {{ form.qualityOrderReport }}
            </el-form-item>
            <el-form-item label="VFG ID：" prop="vfgId">
              {{ form.vfgId }}
            </el-form-item>
            <el-form-item label="VFG 编码：" prop="vfgCode">
              {{ form.vfgCode }}
            </el-form-item>
            <el-form-item label="VFG 名称：" prop="vfgName">
              {{ form.vfgName }}
            </el-form-item>
            <el-form-item label="VRT ID：" prop="vrtId">
              {{ form.vrtId }}
            </el-form-item>
            <el-form-item label="VRT 编码：" prop="vrtCode">
              {{ form.vrtCode }}
            </el-form-item>
            <el-form-item label="VRT 名称：" prop="vrtName">
              {{ form.vrtName }}
            </el-form-item>
            <el-form-item label="CCC ID：" prop="cccId">
              {{ form.cccId }}
            </el-form-item>
            <el-form-item label="CCC 编码：" prop="cccCode">
              {{ form.cccCode }}
            </el-form-item>
            <el-form-item label="CCC 名称：" prop="cccName">
              {{ form.cccName }}
            </el-form-item>
            <el-form-item label="故障现象描述：" prop="faultPhenomenon">
              {{ form.faultPhenomenon }}
            </el-form-item>
            <el-form-item label="故障排查流程：" prop="troubleshootingFlow">
              {{ form.troubleshootingFlow }}
            </el-form-item>
            <el-form-item label="工时索赔小计：" prop="laborClaimTotal">
              {{ form.laborClaimTotal }}
            </el-form-item>
            <el-form-item label="工时费用小计：" prop="workCostCount">
              {{ form.workCostCount }}
            </el-form-item>
            <el-form-item label="工时分担比例：" prop="laborShareRatio">
              {{ form.laborShareRatio }}
            </el-form-item>
            <el-form-item label="审批同意工时索赔小计：" prop="approvedLaborClaimTotal">
              {{ form.approvedLaborClaimTotal }}
            </el-form-item>
            <el-form-item label="备件索赔小计：" prop="partsClaimTotal">
              {{ form.partsClaimTotal }}
            </el-form-item>
            <el-form-item label="备件费用小计：" prop="partsCostTotal">
              {{ form.partsCostTotal }}
            </el-form-item>
            <el-form-item label="备件分担比例：" prop="partsShareRatio">
              {{ form.partsShareRatio }}
            </el-form-item>
            <el-form-item label="审批同意备件索赔小计：" prop="approvedPartsClaimTotal">
              {{ form.approvedPartsClaimTotal }}
            </el-form-item>
            <el-form-item label="其他索赔小计：" prop="otherClaimTotal">
              {{ form.otherClaimTotal }}
            </el-form-item>
            <el-form-item label="其他费用小计：" prop="otherCostTotal">
              {{ form.otherCostTotal }}
            </el-form-item>
            <el-form-item label="其他分担比例：" prop="otherShareRatio">
              {{ form.otherShareRatio }}
            </el-form-item>
            <el-form-item label="审批同意其他索赔小计：" prop="approvedOtherClaimTotal">
              {{ form.approvedOtherClaimTotal }}
            </el-form-item>
            <el-form-item label="索赔总金额：" prop="totalClaimAmount">
              {{ form.totalClaimAmount }}
            </el-form-item>
            <el-form-item label="费用总金额：" prop="totalCostAmount">
              {{ form.totalCostAmount }}
            </el-form-item>
            <el-form-item label="审批平台单号：" prop="platformApprovalNo">
              {{ form.platformApprovalNo }}
            </el-form-item>
            <el-form-item label="主因备件 ID：" prop="mainPartId">
              {{ form.mainPartId }}
            </el-form-item>
            <el-form-item label="主因备件编码：" prop="mainPartCode">
              {{ form.mainPartCode }}
            </el-form-item>
            <el-form-item label="主因备件名称：" prop="mainPartName">
              {{ form.mainPartName }}
            </el-form-item>
            <el-form-item label="主因供应商 ID：" prop="mainPartSupplierId">
              {{ form.mainPartSupplierId }}
            </el-form-item>
            <el-form-item label="主因供应商编码：" prop="mainPartSupplierCode">
              {{ form.mainPartSupplierCode }}
            </el-form-item>
            <el-form-item label="主因供应商名称：" prop="mainPartSupplierName">
              {{ form.mainPartSupplierName }}
            </el-form-item>
            <el-form-item label="是否使用政策工时价，0:否;1:是：" prop="isPolicyLaborPrice">
              {{ form.isPolicyLaborPrice }}
            </el-form-item>
            <el-form-item label="政策工时单价 ID：" prop="policyLaborPriceId">
              {{ form.policyLaborPriceId }}
            </el-form-item>
            <el-form-item label="使用政策工时额度：" prop="usedPolicyLaborQuota">
              {{ form.usedPolicyLaborQuota }}
            </el-form-item>
            <el-form-item label="标准工时索赔小计：" prop="standardLaborClaimTotal">
              {{ form.standardLaborClaimTotal }}
            </el-form-item>
            <el-form-item label="标准工时费用小计：" prop="standardLaborCostTotal">
              {{ form.standardLaborCostTotal }}
            </el-form-item>
            <el-form-item label="驳回申请时间：" prop="rejectApplyTime">
              {{ form.rejectApplyTime }}
            </el-form-item>
            <el-form-item label="驳回申请说明：" prop="rejectApplyRemark">
              {{ form.rejectApplyRemark }}
            </el-form-item>
            <el-form-item label="质量驳回类型：" prop="qualityRejectType">
              {{ form.qualityRejectType }}
            </el-form-item>
            <el-form-item label="质量驳回申请时间：" prop="qualityRejectApplyTime">
              {{ form.qualityRejectApplyTime }}
            </el-form-item>
            <el-form-item label="质量驳回申请原因：" prop="qualityRejectApplyReason">
              {{ form.qualityRejectApplyReason }}
            </el-form-item>
            <el-form-item label="质量驳回申请人 ID：" prop="qualityRejectApplierId">
              {{ form.qualityRejectApplierId }}
            </el-form-item>
            <el-form-item label="质量驳回申请人名称：" prop="qualityRejectApplierName">
              {{ form.qualityRejectApplierName }}
            </el-form-item>
            <el-form-item label="质量驳回状态，10:申请;20:同意&驳回门店;30:同意&拒赔;40:拒绝;50:同意&不撤回：" prop="qualityRejectStatus">
              {{ form.qualityRejectStatus }}
            </el-form-item>
            <el-form-item label="质量驳回处理说明：" prop="qualityRejectHandlerRemark">
              {{ form.qualityRejectHandlerRemark }}
            </el-form-item>
            <el-form-item label="质量驳回处理时间：" prop="qualityRejectHandlerTime">
              {{ form.qualityRejectHandlerTime }}
            </el-form-item>
            <el-form-item label="是否保修经理分级审批，0:否;1:是：" prop="isWarrantyManagerApproval">
              {{ form.isWarrantyManagerApproval }}
            </el-form-item>
            <el-form-item label="是否总经理分级审批，0:否;1:是：" prop="isGeneralManagerApproval">
              {{ form.isGeneralManagerApproval }}
            </el-form-item>
            <el-form-item label="保修审计明细 ID：" prop="warrantyAuditDetailId">
              {{ form.warrantyAuditDetailId }}
            </el-form-item>
            <el-form-item label="作废人 ID：" prop="cancelUserId">
              {{ form.cancelUserId }}
            </el-form-item>
            <el-form-item label="作废人名称：" prop="cancelUserName">
              {{ form.cancelUserName }}
            </el-form-item>
            <el-form-item label="作废时间：" prop="cancelTime">
              {{ form.cancelTime }}
            </el-form-item>
            <el-form-item label="作废原因：" prop="cancelReason">
              {{ form.cancelReason }}
            </el-form-item>
            <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
              {{ form.dataSource }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </el-main>
  </edit-base-container>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
} from '@/api/claimreturn/claim/warrantyapply/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  applyNo: '',
  serviceProxyId: '',
  serviceProxyNo: '',
  statementId: '',
  statementCode: '',
  checkoutTypeId: '',
  checkoutTypeCode: '',
  repairItemTypeId: '',
  repairItemTypeName: '',
  dealerCode: '',
  ownerOrgId: '',
  dealerName: '',
  dealerRegionName: '',
  dealerRegionCode: '',
  repairStartTime: '',
  repairEndTime: '',
  applyStatus: '',
  returnPartsStatus: '',
  isAutoAuditSet: '',
  isAutoAudited: '',
  autoAuditFailReason: '',
  preAuthId: '',
  preAuthCode: '',
  serviceActivityId: '',
  serviceActivityCode: '',
  serviceActivityName: '',
  schemeId: '',
  schemeName: '',
  firstSubmitTime: '',
  currentSubmitTime: '',
  currentSubmitterId: '',
  currentSubmitterName: '',
  approvalTime: '',
  approvalRemark: '',
  approverId: '',
  approverName: '',
  errorCodeId: '',
  errorContent: '',
  paymentTime: '',
  claimTrackId: '',
  claimTrackNo: '',
  vin: '',
  vehiclePlateNo: '',
  produceDate: '',
  vehicleProperty: '',
  vehicleModelId: '',
  vehicleModelName: '',
  warrantyStartdate: '',
  serviceMonth: '',
  alarmLevel: '',
  mileage: '',
  warrantyWarningMsg: '',
  isLifetimeWarrantyForecast: '',
  warrantyEnddateForecast: '',
  isLifetimeWarranty: '',
  ownerName: '',
  ownerPhone: '',
  shuttleName: '',
  shuttlePhone: '',
  qualityOrderReportId: '',
  qualityOrderReport: '',
  vfgId: '',
  vfgCode: '',
  vfgName: '',
  vrtId: '',
  vrtCode: '',
  vrtName: '',
  cccId: '',
  cccCode: '',
  cccName: '',
  faultPhenomenon: '',
  troubleshootingFlow: '',
  laborClaimTotal: '',
  workCostCount: '',
  laborShareRatio: '',
  approvedLaborClaimTotal: '',
  partsClaimTotal: '',
  partsCostTotal: '',
  partsShareRatio: '',
  approvedPartsClaimTotal: '',
  otherClaimTotal: '',
  otherCostTotal: '',
  otherShareRatio: '',
  approvedOtherClaimTotal: '',
  totalClaimAmount: '',
  totalCostAmount: '',
  platformApprovalNo: '',
  mainPartId: '',
  mainPartCode: '',
  mainPartName: '',
  mainPartSupplierId: '',
  mainPartSupplierCode: '',
  mainPartSupplierName: '',
  isPolicyLaborPrice: '',
  policyLaborPriceId: '',
  usedPolicyLaborQuota: '',
  standardLaborClaimTotal: '',
  standardLaborCostTotal: '',
  rejectApplyTime: '',
  rejectApplyRemark: '',
  qualityRejectType: '',
  qualityRejectApplyTime: '',
  qualityRejectApplyReason: '',
  qualityRejectApplierId: '',
  qualityRejectApplierName: '',
  qualityRejectStatus: '',
  qualityRejectHandlerRemark: '',
  qualityRejectHandlerTime: '',
  isWarrantyManagerApproval: '',
  isGeneralManagerApproval: '',
  warrantyAuditDetailId: '',
  cancelUserId: '',
  cancelUserName: '',
  cancelTime: '',
  cancelReason: '',
  dataSource: '',
};

export default {
  name: 'warrantyApplyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    // FetchSelect,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '标题xxx';
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '保修申请单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR 根据实际情况修改
      moduleKey: 'AISCR-warrantyApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请输入状态变更描述', trigger: 'blur' }
        ],
        applyNo: [
          { required: true, message: '请输入保修申请单号', trigger: 'blur' }
        ],
        serviceProxyId: [
          { required: true, message: '请输入接车施工单 ID', trigger: 'blur' }
        ],
        serviceProxyNo: [
          { required: true, message: '请输入接车施工单号', trigger: 'blur' }
        ],
        statementId: [
          { required: true, message: '请输入结算单 ID', trigger: 'blur' }
        ],
        statementCode: [
          { required: true, message: '请输入结算单号', trigger: 'blur' }
        ],
        checkoutTypeId: [
          { required: true, message: '请输入结算类型 ID', trigger: 'blur' }
        ],
        checkoutTypeCode: [
          { required: true, message: '请输入结算类型编码', trigger: 'blur' }
        ],
        repairItemTypeId: [
          { required: true, message: '请输入保修类型 ID', trigger: 'blur' }
        ],
        repairItemTypeName: [
          { required: true, message: '请输入保修类型名称', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店 ID（组织 ID），当数据权限归属到本组织以及本下级', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        dealerRegionName: [
          { required: true, message: '请输入门店所属区域名称', trigger: 'blur' }
        ],
        dealerRegionCode: [
          { required: true, message: '请输入门店所属区域编码', trigger: 'blur' }
        ],
        repairStartTime: [
          { required: true, message: '请选择维修开始时间', trigger: 'change' }
        ],
        repairEndTime: [
          { required: true, message: '请选择维修结束时间', trigger: 'change' }
        ],
        applyStatus: [
          { required: true, message: '请输入保修单状态，10:未提交;20:审核中;25:待保修经理审核;30:待总经理审核;40:已驳回;50:已拒赔;60:审核通过;70:已结算;80:已付款;90:已作废', trigger: 'blur' }
        ],
        returnPartsStatus: [
          { required: true, message: '请输入旧件返还状态，0:待返还;1:已部分返还;2:已全部返还;3:无需返还;4:无旧件', trigger: 'blur' }
        ],
        isAutoAuditSet: [
          { required: true, message: '请输入是否设定自动审核，0:否;1:是', trigger: 'blur' }
        ],
        isAutoAudited: [
          { required: true, message: '请输入是否自动审核，0:否;1:是', trigger: 'blur' }
        ],
        autoAuditFailReason: [
          { required: true, message: '请输入未自动审核原因', trigger: 'blur' }
        ],
        preAuthId: [
          { required: true, message: '请输入预授权 ID', trigger: 'blur' }
        ],
        preAuthCode: [
          { required: true, message: '请输入预授权编码', trigger: 'blur' }
        ],
        serviceActivityId: [
          { required: true, message: '请输入服务活动 ID', trigger: 'blur' }
        ],
        serviceActivityCode: [
          { required: true, message: '请输入服务活动编码', trigger: 'blur' }
        ],
        serviceActivityName: [
          { required: true, message: '请输入服务活动名称', trigger: 'blur' }
        ],
        schemeId: [
          { required: true, message: '请输入活动方案 ID', trigger: 'blur' }
        ],
        schemeName: [
          { required: true, message: '请输入活动方案名称', trigger: 'blur' }
        ],
        firstSubmitTime: [
          { required: true, message: '请选择首次提交时间', trigger: 'change' }
        ],
        currentSubmitTime: [
          { required: true, message: '请选择当前提交时间', trigger: 'change' }
        ],
        currentSubmitterId: [
          { required: true, message: '请输入当前提交人 ID', trigger: 'blur' }
        ],
        currentSubmitterName: [
          { required: true, message: '请输入当前提交人名称', trigger: 'blur' }
        ],
        approvalTime: [
          { required: true, message: '请选择审批时间', trigger: 'change' }
        ],
        approvalRemark: [
          { required: true, message: '请输入审批说明', trigger: 'blur' }
        ],
        approverId: [
          { required: true, message: '请输入审批人 ID', trigger: 'blur' }
        ],
        approverName: [
          { required: true, message: '请输入审批人名称', trigger: 'blur' }
        ],
        errorCodeId: [
          { required: true, message: '请输入错误代码 ID', trigger: 'blur' }
        ],
        errorContent: [
          { required: true, message: '请输入错误内容', trigger: 'blur' }
        ],
        paymentTime: [
          { required: true, message: '请选择保修付款时间', trigger: 'change' }
        ],
        claimTrackId: [
          { required: true, message: '请输入索赔追溯单 ID', trigger: 'blur' }
        ],
        claimTrackNo: [
          { required: true, message: '请输入索赔追溯单号', trigger: 'blur' }
        ],
        vin: [
          { required: true, message: '请输入VIN', trigger: 'blur' }
        ],
        vehiclePlateNo: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        produceDate: [
          { required: true, message: '请选择生产日期', trigger: 'change' }
        ],
        vehicleProperty: [
          { required: true, message: '请输入车辆用途，1:家用;2:运营;4:B 级车;10:J 级车;20:J1 级车;30:专车;60:报废灭失', trigger: 'blur' }
        ],
        vehicleModelId: [
          { required: true, message: '请输入车型 ID', trigger: 'blur' }
        ],
        vehicleModelName: [
          { required: true, message: '请输入车型名称', trigger: 'blur' }
        ],
        warrantyStartdate: [
          { required: true, message: '请选择保修开始日期', trigger: 'change' }
        ],
        serviceMonth: [
          { required: true, message: '请输入服务月份', trigger: 'blur' }
        ],
        alarmLevel: [
          { required: true, message: '请输入三包预警，0:-- ;10:正常;20:黄色;30:红色;40:过期', trigger: 'blur' }
        ],
        mileage: [
          { required: true, message: '请输入进店里程', trigger: 'blur' }
        ],
        warrantyWarningMsg: [
          { required: true, message: '请输入保修预警信息', trigger: 'blur' }
        ],
        isLifetimeWarrantyForecast: [
          { required: true, message: '请选择整车是否在保（预测），0:否;1:是', trigger: 'change' }
        ],
        warrantyEnddateForecast: [
          { required: true, message: '请选择整车保修结束日期（预测）', trigger: 'change' }
        ],
        isLifetimeWarranty: [
          { required: true, message: '请选择是否终身免保，0:否;1:是', trigger: 'change' }
        ],
        ownerName: [
          { required: true, message: '请输入车主姓名', trigger: 'blur' }
        ],
        ownerPhone: [
          { required: true, message: '请输入车主电话', trigger: 'blur' }
        ],
        shuttleName: [
          { required: true, message: '请输入送修人姓名', trigger: 'blur' }
        ],
        shuttlePhone: [
          { required: true, message: '请输入送修人电话', trigger: 'blur' }
        ],
        qualityOrderReportId: [
          { required: true, message: '请输入质量反馈报告 ID', trigger: 'blur' }
        ],
        qualityOrderReport: [
          { required: true, message: '请输入质量反馈报告编号', trigger: 'blur' }
        ],
        vfgId: [
          { required: true, message: '请输入VFG ID', trigger: 'blur' }
        ],
        vfgCode: [
          { required: true, message: '请输入VFG 编码', trigger: 'blur' }
        ],
        vfgName: [
          { required: true, message: '请输入VFG 名称', trigger: 'blur' }
        ],
        vrtId: [
          { required: true, message: '请输入VRT ID', trigger: 'blur' }
        ],
        vrtCode: [
          { required: true, message: '请输入VRT 编码', trigger: 'blur' }
        ],
        vrtName: [
          { required: true, message: '请输入VRT 名称', trigger: 'blur' }
        ],
        cccId: [
          { required: true, message: '请输入CCC ID', trigger: 'blur' }
        ],
        cccCode: [
          { required: true, message: '请输入CCC 编码', trigger: 'blur' }
        ],
        cccName: [
          { required: true, message: '请输入CCC 名称', trigger: 'blur' }
        ],
        faultPhenomenon: [
          { required: true, message: '请输入故障现象描述', trigger: 'blur' }
        ],
        troubleshootingFlow: [
          { required: true, message: '请输入故障排查流程', trigger: 'blur' }
        ],
        laborClaimTotal: [
          { required: true, message: '请输入工时索赔小计', trigger: 'blur' }
        ],
        workCostCount: [
          { required: true, message: '请输入工时费用小计', trigger: 'blur' }
        ],
        laborShareRatio: [
          { required: true, message: '请输入工时分担比例', trigger: 'blur' }
        ],
        approvedLaborClaimTotal: [
          { required: true, message: '请输入审批同意工时索赔小计', trigger: 'blur' }
        ],
        partsClaimTotal: [
          { required: true, message: '请输入备件索赔小计', trigger: 'blur' }
        ],
        partsCostTotal: [
          { required: true, message: '请输入备件费用小计', trigger: 'blur' }
        ],
        partsShareRatio: [
          { required: true, message: '请输入备件分担比例', trigger: 'blur' }
        ],
        approvedPartsClaimTotal: [
          { required: true, message: '请输入审批同意备件索赔小计', trigger: 'blur' }
        ],
        otherClaimTotal: [
          { required: true, message: '请输入其他索赔小计', trigger: 'blur' }
        ],
        otherCostTotal: [
          { required: true, message: '请输入其他费用小计', trigger: 'blur' }
        ],
        otherShareRatio: [
          { required: true, message: '请输入其他分担比例', trigger: 'blur' }
        ],
        approvedOtherClaimTotal: [
          { required: true, message: '请输入审批同意其他索赔小计', trigger: 'blur' }
        ],
        totalClaimAmount: [
          { required: true, message: '请输入索赔总金额', trigger: 'blur' }
        ],
        totalCostAmount: [
          { required: true, message: '请输入费用总金额', trigger: 'blur' }
        ],
        platformApprovalNo: [
          { required: true, message: '请输入审批平台单号', trigger: 'blur' }
        ],
        mainPartId: [
          { required: true, message: '请输入主因备件 ID', trigger: 'blur' }
        ],
        mainPartCode: [
          { required: true, message: '请输入主因备件编码', trigger: 'blur' }
        ],
        mainPartName: [
          { required: true, message: '请输入主因备件名称', trigger: 'blur' }
        ],
        mainPartSupplierId: [
          { required: true, message: '请输入主因供应商 ID', trigger: 'blur' }
        ],
        mainPartSupplierCode: [
          { required: true, message: '请输入主因供应商编码', trigger: 'blur' }
        ],
        mainPartSupplierName: [
          { required: true, message: '请输入主因供应商名称', trigger: 'blur' }
        ],
        isPolicyLaborPrice: [
          { required: true, message: '请输入是否使用政策工时价，0:否;1:是', trigger: 'blur' }
        ],
        policyLaborPriceId: [
          { required: true, message: '请输入政策工时单价 ID', trigger: 'blur' }
        ],
        usedPolicyLaborQuota: [
          { required: true, message: '请输入使用政策工时额度', trigger: 'blur' }
        ],
        standardLaborClaimTotal: [
          { required: true, message: '请输入标准工时索赔小计', trigger: 'blur' }
        ],
        standardLaborCostTotal: [
          { required: true, message: '请输入标准工时费用小计', trigger: 'blur' }
        ],
        rejectApplyTime: [
          { required: true, message: '请选择驳回申请时间', trigger: 'change' }
        ],
        rejectApplyRemark: [
          { required: true, message: '请输入驳回申请说明', trigger: 'blur' }
        ],
        qualityRejectType: [
          { required: true, message: '请输入质量驳回类型', trigger: 'blur' }
        ],
        qualityRejectApplyTime: [
          { required: true, message: '请选择质量驳回申请时间', trigger: 'change' }
        ],
        qualityRejectApplyReason: [
          { required: true, message: '请输入质量驳回申请原因', trigger: 'blur' }
        ],
        qualityRejectApplierId: [
          { required: true, message: '请输入质量驳回申请人 ID', trigger: 'blur' }
        ],
        qualityRejectApplierName: [
          { required: true, message: '请输入质量驳回申请人名称', trigger: 'blur' }
        ],
        qualityRejectStatus: [
          { required: true, message: '请输入质量驳回状态，10:申请;20:同意&驳回门店;30:同意&拒赔;40:拒绝;50:同意&不撤回', trigger: 'blur' }
        ],
        qualityRejectHandlerRemark: [
          { required: true, message: '请输入质量驳回处理说明', trigger: 'blur' }
        ],
        qualityRejectHandlerTime: [
          { required: true, message: '请选择质量驳回处理时间', trigger: 'change' }
        ],
        isWarrantyManagerApproval: [
          { required: true, message: '请输入是否保修经理分级审批，0:否;1:是', trigger: 'blur' }
        ],
        isGeneralManagerApproval: [
          { required: true, message: '请输入是否总经理分级审批，0:否;1:是', trigger: 'blur' }
        ],
        warrantyAuditDetailId: [
          { required: true, message: '请输入保修审计明细 ID', trigger: 'blur' }
        ],
        cancelUserId: [
          { required: true, message: '请输入作废人 ID', trigger: 'blur' }
        ],
        cancelUserName: [
          { required: true, message: '请输入作废人名称', trigger: 'blur' }
        ],
        cancelTime: [
          { required: true, message: '请选择作废时间', trigger: 'change' }
        ],
        cancelReason: [
          { required: true, message: '请输入作废原因', trigger: 'blur' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'blur' }
        ],
      },
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>
