<template>
  <div>
  <edit-base-container
    ref="containerRef"
    :id="_id"
    :title="title"
    :isEditing.sync="isEditing"
    :form.sync="form"
    :originalForm.sync="originalForm"
    :submitRequest="submitRequest"
    :detailRequest="detailRequest"
    :showEditBtn="canEdit"
  >
    <template #extraButtons>
      <el-button :loading="printLoading" size="small" @click="handlePrint">打印标签</el-button>
      <el-button size="small" @click="handleViewRights">查看权益</el-button>
      <el-button v-if="canApplyReject && (isPendingCurrentUserReview || form.applyStatus === APPLY_STATUS.APPROVED)" size="small" @click="handleReject(true)">申请驳回</el-button>
      <el-button v-if="canWithdraw && WITHDRAWABLE_STATUSES.includes(form.applyStatus)" size="small" @click="handleWithdraw">撤回</el-button>
      <el-button v-if="canDeny && (isPendingCurrentUserReview || form.applyStatus === APPLY_STATUS.APPROVED)" plain size="small" @click="handleDeny">拒赔</el-button>
      <el-button v-if="canReject && isPendingCurrentUserReview" size="small" @click="handleReject(false)">驳回</el-button>
      <el-button v-if="canCancel && (EDITABLE_STATUSES.includes(form.applyStatus))" plain size="small" @click="handleCancel">作废</el-button>
      <el-button v-if="canApprove && isPendingCurrentUserReview" type="primary" size="small" @click="handleApprove">同意</el-button>
      <el-button v-if="canSubmit && (EDITABLE_STATUSES.includes(form.applyStatus))" type="primary" size="small" :loading="loading" @click="handleSubmit">提交</el-button>
    </template>
    <el-main>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isFormEditing">
            <el-form-item label="保修申请单号：" prop="applyNo">
              <el-input placeholder="" v-model="form.applyNo" clearable disabled />
            </el-form-item>
            <el-form-item label="接车施工单号：" prop="serviceProxyNo">
              <el-input placeholder="" v-model="form.serviceProxyNo" clearable disabled />
            </el-form-item>
            <el-form-item label="首次提交时间：" prop="firstSubmitTime">
              <el-date-picker
                disabled
                v-model="form.firstSubmitTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="保修单状态：" prop="applyStatusLabel">
              <el-input placeholder="" v-model="form.applyStatusLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="结算类型：" prop="checkoutTypeName">
              <el-input placeholder="" v-model="form.checkoutTypeName" clearable disabled />
            </el-form-item>
            <el-form-item label="结算单号：" prop="statementCode">
              <el-input placeholder="" v-model="form.statementCode" clearable disabled />
            </el-form-item>
            <el-form-item label="当前提交时间：" prop="currentSubmitTime">
              <el-date-picker
                disabled
                v-model="form.currentSubmitTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="旧件返还状态：" prop="returnPartsStatusLabel">
              <el-input placeholder="" v-model="form.returnPartsStatusLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="保修类型：" prop="repairItemTypeName">
              <el-input placeholder="" v-model="form.repairItemTypeName" clearable disabled />
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-input placeholder="" v-model="form.dealerCode" clearable disabled />
            </el-form-item>
            <el-form-item label="审批时间：" prop="approvalTime">
              <el-date-picker
                v-model="form.approvalTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="预授权单：" prop="preAuthCode">
              <el-input placeholder="" v-model="form.preAuthCode" clearable disabled />
            </el-form-item>
            <el-form-item label="维修开始时间：" prop="repairStartTime">
              <el-date-picker
                v-model="form.repairStartTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              <el-input placeholder="" v-model="form.dealerName" clearable disabled />
            </el-form-item>
            <el-form-item label="审批说明：" prop="approvalRemark">
              <el-input placeholder="" v-model="form.approvalRemark" clearable disabled />
            </el-form-item>
            <el-form-item label="活动编码：" prop="serviceActivityCode">
              <el-input placeholder="" v-model="form.serviceActivityCode" clearable disabled />
            </el-form-item>
            <el-form-item label="维修结束时间：" prop="repairEndTime">
              <el-date-picker
                v-model="form.repairEndTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="门店所属区域：" prop="dealerRegionName">
              <el-input placeholder="" v-model="form.dealerRegionName" clearable disabled />
            </el-form-item>
            <el-form-item label="保修付款时间：" prop="paymentTime">
              <el-date-picker
                v-model="form.paymentTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="索赔追溯单：" prop="claimTrackNo">
              <el-input placeholder="" v-model="form.claimTrackNo" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!isFormEditing">
            <el-form-item label="保修申请单号：" prop="applyNo">
              {{ form.applyNo }}
            </el-form-item>
            <el-form-item label="接车施工单号：" prop="serviceProxyNo">
              <el-link type="success" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.serviceProxyId}`" target="_blank">{{ form.serviceProxyNo }}</el-link>
            </el-form-item>
            <el-form-item label="首次提交时间：" prop="firstSubmitTime">
              {{ form.firstSubmitTime }}
            </el-form-item>
            <el-form-item label="保修单状态：" prop="applyStatusLabel">
              {{ form.applyStatusLabel }}
            </el-form-item>
            <el-form-item label="结算类型：" prop="checkoutTypeName">
              {{ form.checkoutTypeName }}
            </el-form-item>
            <el-form-item label="结算单号：" prop="statementCode">
              <el-link type="success" :href="`/service/maintain/sp/serviceStatement/edit?id=${form.statementId}`" target="_blank">{{ form.statementCode }}</el-link>
            </el-form-item>
            <el-form-item label="当前提交时间：" prop="currentSubmitTime">
              {{ form.currentSubmitTime }}
            </el-form-item>
            <el-form-item label="旧件返还状态：" prop="returnPartsStatusLabel">
              {{ form.returnPartsStatusLabel }}
            </el-form-item>
            <el-form-item label="保修类型：" prop="repairItemTypeName">
              {{ form.repairItemTypeName }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-link
                v-if="form.dealerCode"
                type="primary"
                :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.dealerCode}`"
                target="_blank"
              >{{ form.dealerCode }}</el-link>
              <span v-else>{{ form.dealerCode }}</span>
            </el-form-item>
            <el-form-item label="审批时间：" prop="approvalTime">
              {{ form.approvalTime }}
            </el-form-item>
            <el-form-item label="预授权单：" prop="preAuthCode">
              <el-link type="success" :href="`/service/maintain/sp/preAuth/edit?id=${form.preAuthId}`" target="_blank">{{ form.preAuthCode }}</el-link>
            </el-form-item>
            <el-form-item label="维修开始时间：" prop="repairStartTime">
              {{ form.repairStartTime }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ form.dealerName }}
            </el-form-item>
            <el-form-item label="审批说明：" prop="approvalRemark">
              {{ form.approvalRemark }}
            </el-form-item>
            <el-form-item label="活动编码：" prop="serviceActivityCode">
              <el-link v-if="form.serviceActivityId" type="primary" @click="openActivityDetail">{{ form.serviceActivityCode }}</el-link>
              <span v-else>{{ form.serviceActivityCode }}</span>
            </el-form-item>
            <el-form-item label="维修结束时间：" prop="repairEndTime">
              {{ form.repairEndTime }}
            </el-form-item>
            <el-form-item label="门店所属区域：" prop="dealerRegionName">
              {{ form.dealerRegionName }}
            </el-form-item>
            <el-form-item label="保修付款时间：" prop="paymentTime">
              {{ form.paymentTime }}
            </el-form-item>
            <el-form-item label="索赔追溯单：" prop="claimTrackNo">
              <el-link type="success" :href="`/service/claimreturn/claim/claimtrace/claimTraceOrder/edit?id=${form.claimTrackId}`" target="_blank">{{ form.claimTrackNo }}</el-link>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>车辆&客户</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isFormEditing">
            <el-form-item label="VIN：" prop="vin">
              <el-input placeholder="" v-model="form.vin" clearable disabled />
            </el-form-item>
            <el-form-item label="车牌号：" prop="vehiclePlateNo">
              <el-input placeholder="" v-model="form.vehiclePlateNo" clearable disabled />
            </el-form-item>
            <el-form-item label="生产日期：" prop="produceDate">
              <el-date-picker
                disabled
                v-model="form.produceDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="服务月份：" prop="serviceMonth">
              <el-input placeholder="" v-model="form.serviceMonth" clearable disabled />
            </el-form-item>
            <el-form-item label="车型：" prop="vehicleModelName">
              <el-input placeholder="" v-model="form.vehicleModelName" clearable disabled />
            </el-form-item>
            <el-form-item label="车系：" prop="vehicleSeriesName">
              <el-input placeholder="" v-model="form.vehicleSeriesName" clearable disabled />
            </el-form-item>
            <el-form-item label="年款：" prop="vehicleYearName">
              <el-input placeholder="" v-model="form.vehicleYearName" clearable disabled />
            </el-form-item>
            <el-form-item label="保修开始日期：" prop="warrantyStartdate">
              <el-date-picker
                disabled
                v-model="form.warrantyStartdate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="整车保修结束日期(预测)：" prop="warrantyEnddateForecast">
              <el-date-picker
                disabled
                v-model="form.warrantyEnddateForecast"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="进店里程KM：" prop="mileage">
              <el-input placeholder="" v-model="form.mileage" clearable disabled />
            </el-form-item>
            <el-form-item label="车主姓名：" prop="ownerName">
              <el-input placeholder="" v-model="form.ownerName" clearable disabled />
            </el-form-item>
            <el-form-item label="车主电话：" prop="ownerPhone">
              <el-input placeholder="" v-model="form.ownerPhone" clearable disabled />
            </el-form-item>
            <el-form-item label="送修人姓名：" prop="shuttleName">
              <el-input placeholder="" v-model="form.shuttleName" clearable disabled />
            </el-form-item>
            <el-form-item label="送修人电话：" prop="shuttlePhone">
              <el-input placeholder="" v-model="form.shuttlePhone" clearable disabled />
            </el-form-item>
            <el-form-item label="是否终身免保：" prop="isLifetimeWarrantyLabel">
              <el-input placeholder="" v-model="form.isLifetimeWarrantyLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="车辆用途：" prop="vehicleProperty">
              <el-input placeholder="" v-model="form.vehiclePropertyLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="开单预警信息：" prop="spRemindInfo">
              <el-input type="textarea" :value="remindContent" clearable disabled />
            </el-form-item>
            <el-form-item label="保修预警信息：" prop="warrantyWarningMsg">
              <el-input type="textarea" :value="form.warrantyWarningMsg" clearable disabled />
            </el-form-item>
            <el-form-item label="整车是否在保(预测)：" prop="isLifetimeWarrantyForecastLabel">
              <el-input placeholder="" v-model="form.isLifetimeWarrantyForecastLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="三包预警：" prop="alarmLevelLabel">
              <el-input placeholder="" v-model="form.alarmLevelLabel" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!isFormEditing">
            <el-form-item label="VIN：" prop="vin">
              <el-link type="success" :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${form.vehicleProfileId}`" target="_blank">{{ form.vin }}</el-link>
            </el-form-item>
            <el-form-item label="车牌号：" prop="vehiclePlateNo">
              {{ form.vehiclePlateNo }}
            </el-form-item>
            <el-form-item label="生产日期：" prop="produceDate">
              {{ form.produceDate }}
            </el-form-item>
            <el-form-item label="服务月份：" prop="serviceMonth">
              {{ form.serviceMonth }}
            </el-form-item>
            <el-form-item label="车型：" prop="vehicleModelName">
              {{ form.vehicleModelName }}
            </el-form-item>
            <el-form-item label="车系：" prop="vehicleSeriesName">
              {{ form.vehicleSeriesName }}
            </el-form-item>
            <el-form-item label="年款：" prop="vehicleYearName">
              {{ form.vehicleYearName }}
            </el-form-item>
            <el-form-item label="保修开始日期：" prop="warrantyStartdate">
              {{ form.warrantyStartdate }}
            </el-form-item>
            <el-form-item label="整车保修结束日期(预测)：" prop="warrantyEnddateForecast">
              {{ form.warrantyEnddateForecast }}
            </el-form-item>
            <el-form-item label="进店里程KM：" prop="mileage">
              {{ form.mileage }}
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
            <el-form-item label="是否终身免保：" prop="isLifetimeWarrantyLabel">
              {{ form.isLifetimeWarrantyLabel }}
            </el-form-item>
            <el-form-item label="车辆用途：" prop="vehicleProperty">
              {{ form.vehiclePropertyLabel }}
            </el-form-item>
            <el-form-item label="整车是否在保(预测)：" prop="isLifetimeWarrantyForecastLabel">
              {{ form.isLifetimeWarrantyForecastLabel }}
            </el-form-item>
            <el-form-item label="三包预警：" prop="alarmLevelLabel">
              {{ form.alarmLevelLabel }}
            </el-form-item>
            <el-form-item label="开单预警信息：" style="width: 100%;">
              {{ remindContent }}
            </el-form-item>
            <el-form-item label="保修预警信息：" prop="warrantyWarningMsg" style="width: 100%;">
              {{ form.warrantyWarningMsg }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>质量反馈信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="150px" class="form-edit" v-show="isFormEditing">
            <el-form-item label="质量反馈报告：" prop="qualityOrderReportId">
              <fetch-select
                remote
                v-model="form.qualityOrderReportId"
                :remote-method="getReportList"
                placeholder="请输入质量反馈报告单号"
                labelKey="code"
                valueKey="id"
                subLabelKey="code"
                clearable
                filterable
                @change="onReportChange"
              />
            </el-form-item>
            <el-form-item label="VRT：" prop="vrtName">
              <el-input placeholder="" v-model="form.vrtName" clearable disabled />
            </el-form-item>
            <el-form-item label="VFG：" prop="vfgName">
              <el-input placeholder="" v-model="form.vfgName" clearable disabled />
            </el-form-item>
            <el-form-item label="CCC：" prop="cccName">
              <ccc-search
                @update="onCCCUpdate"
                :value="form.cccName"
              />
            </el-form-item>
            <el-form-item class="form-item-full" label="故障现象描述：" prop="faultPhenomenon">
              <base-input type="textarea" v-model="form.faultPhenomenon" clearable maxlength="5000" />
            </el-form-item>
            <el-form-item class="form-item-full" label="故障排查流程：" prop="troubleshootingFlow">
              <base-input type="textarea" v-model="form.troubleshootingFlow" clearable maxlength="5000" />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!isFormEditing">
            <el-form-item label="质量反馈报告：" prop="qualityOrderReport">
              {{ form.qualityOrderReport }}
            </el-form-item>
            <el-form-item label="VRT：" prop="vrtName">
              {{ form.vrtName }}
            </el-form-item>
            <el-form-item label="VFG：" prop="vfgName">
              {{  form.vfgName }}
            </el-form-item>
            <el-form-item label="CCC：" prop="cccName">
              {{ form.cccName }}
            </el-form-item>
            <el-form-item class="form-item-full" label="故障现象描述：" prop="faultPhenomenon">
             {{ form.faultPhenomenon }}
            </el-form-item>
            <el-form-item class="form-item-full" label="故障排查流程：" prop="troubleshootingFlow">
              {{ form.troubleshootingFlow }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>保修费用信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm4" label-width="150px" class="form-edit" v-show="isFormEditing">
            <el-form-item label="工时索赔小计：" prop="laborClaimTotal">
              <el-input v-model="form.laborClaimTotal" clearable disabled />
            </el-form-item>
            <el-form-item label="零件索赔小计：" prop="partsClaimTotal">
              <el-input v-model="form.partsClaimTotal" clearable disabled />
            </el-form-item>
            <el-form-item label="其他索赔小计：" prop="otherClaimTotal">
              <el-input v-model="form.otherClaimTotal" clearable disabled />
            </el-form-item>
            <el-form-item label="索赔总金额：" prop="totalClaimAmount">
              <el-input v-model="form.totalClaimAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="工时费用小计：" prop="workCostCount" v-if="isGoodwillWarranty">
              <el-input v-model="form.workCostCount" clearable disabled />
            </el-form-item>
            <el-form-item label="零件费用小计：" prop="partsCostTotal" v-if="isGoodwillWarranty">
              <el-input v-model="form.partsCostTotal" clearable disabled />
            </el-form-item>
            <el-form-item label="其他费用小计：" prop="otherCostTotal" v-if="isGoodwillWarranty">
              <el-input v-model="form.otherCostTotal" clearable disabled />
            </el-form-item>
            <el-form-item label="费用总金额：" prop="totalCostAmount" v-if="isGoodwillWarranty">
              <el-input v-model="form.totalCostAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="工时分担比例：" prop="laborShareRatio" v-if="isGoodwillWarranty">
              <el-input v-model="form.laborShareRatio" clearable disabled />
            </el-form-item>
            <el-form-item label="零件分担比例：" prop="partsShareRatio" v-if="isGoodwillWarranty">
              <el-input v-model="form.partsShareRatio" clearable disabled />
            </el-form-item>
            <el-form-item label="其他分担比例：" prop="otherShareRatio" v-if="isGoodwillWarranty">
              <el-input v-model="form.otherShareRatio" clearable disabled />
            </el-form-item>
            <el-form-item label="平台单号：" prop="platformApprovalNo" v-if="isGoodwillWarranty">
              <el-input v-model="form.platformApprovalNo" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form
            :inline="true"
            class="form-detail"
            v-show="!isFormEditing"
          >
            <el-form-item label="工时索赔小计：">{{ form.laborClaimTotal }}</el-form-item>
            <el-form-item label="备件索赔小计：">{{ form.partsClaimTotal }}</el-form-item>
            <el-form-item label="其他索赔小计：">{{ form.otherClaimTotal }}</el-form-item>
            <el-form-item label="索赔总金额：">{{ form.totalClaimAmount }}</el-form-item>

            <el-form-item label="工时费用小计：" v-if="isGoodwillWarranty">{{ form.workCostCount }}</el-form-item>
            <el-form-item label="备件费用小计：" v-if="isGoodwillWarranty">{{ form.partsCostTotal }}</el-form-item>
            <el-form-item label="其他费用小计：" v-if="isGoodwillWarranty">{{ form.otherCostTotal }}</el-form-item>
            <el-form-item label="费用总金额：" v-if="isGoodwillWarranty">{{ form.totalCostAmount }}</el-form-item>

            <el-form-item label="工时分担比例：" v-if="isGoodwillWarranty">{{ form.laborShareRatio }}</el-form-item>
            <el-form-item label="备件分担比例：" v-if="isGoodwillWarranty">{{ form.partsShareRatio }}</el-form-item>
            <el-form-item label="其他分担比例：" v-if="isGoodwillWarranty">{{ form.otherShareRatio }}</el-form-item>
            <el-form-item label="平台单号：" v-if="isGoodwillWarranty">{{ form.platformApprovalNo }}</el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>工时信息</h2>
        </div>
        <div class="common-section-body">
          <work-hour-table
            :id="_id"
            :canAddOrUpdate="canEdit"
            @update="handleTableUpdate"
          />
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>
            零件信息
          </h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm5" label-width="150px" class="form-edit" v-show="isFormEditing">
            <el-form-item label="主因零件编码：" prop="mainPartId">
              <fetch-select
                ref="mainPartSelectRef"
                :remote-method="partRemote"
                remote
                v-model="form.partAndSupplierId"
                @change="onMainPartChange"
                placeholder="请输入零件编码/名称"
                :params="form.mainPartCode"
                labelKey="partCode"
                valueKey="partAndSupplierId"
                clearable
                filterable
                :disabled="!isFormEditing"
              >
                <template #option="{ item }">
                  <span v-if="item.disabled">{{ item.placeholder }}</span>
                  <span v-else>{{ item.partCode }}/{{ item.partName }}{{item.supplierCode ? `-${item.supplierName}-${item.supplierCode}`: ''}}</span>
                </template>
              </fetch-select>
            </el-form-item>
            <el-form-item label="主因零件名称：" prop="mainPartName">
              <el-input placeholder="" v-model="form.mainPartName" clearable disabled />
            </el-form-item>
            <el-form-item label="主因供应商编码：" prop="mainPartSupplierCode">
              <el-input placeholder="" v-model="form.mainPartSupplierCode" clearable disabled />
            </el-form-item>
            <el-form-item label="主因供应商名称：" prop="mainPartSupplierName">
              <el-input placeholder="" v-model="form.mainPartSupplierName" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!isFormEditing">
            <el-form-item label="主因零件编码：" prop="mainPartCode">
              <el-link type="primary" :href="`/service/sparepart/basic/sparePart/edit?id=${form.mainPartId}`" target="_blank">{{ form.mainPartCode }}</el-link>
            </el-form-item>
            <el-form-item label="主因零件名称：" prop="mainPartName">
              {{ form.mainPartName }}
            </el-form-item>
            <el-form-item label="主因供应商编码：" prop="mainPartSupplierCode">
              <el-link type="primary" :href="`/service/sparepart/basic/supplierInfo/edit?id=${form.mainPartSupplierId}`" target="_blank">{{ form.mainPartSupplierCode }}</el-link>
            </el-form-item>
            <el-form-item label="主因供应商名称：" prop="mainPartSupplierName">
              {{ form.mainPartSupplierName }}
            </el-form-item>
          </el-form>
          <part-table
            ref="partTableRef"
            :id="_id"
            :canAddOrUpdate="canEdit"
            @update="handleTableUpdate"
          />
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>其他信息</h2>
        </div>
        <div class="common-section-body">
          <other-table
            :id="_id"
            :canAddOrUpdate="canEdit"
          />
        </div>
      </section>
      <warranty-apply-file
        :id="_id"
        :canAddOrUpdate="canEdit"
        :repairItemTypeId="form.repairItemTypeId"
        :serviceActivityId="form.serviceActivityId"
        :disabled="!EDITABLE_STATUSES.includes(form.applyStatus)"
      />
      <section class="common-section">
        <div class="common-section-header">
          <h2>未完成活动</h2>
        </div>
        <div class="common-section-body">
          <activity-table
            :vehicleProfileId="form.vehicleProfileId"
            :canAddOrUpdate="canEdit"
          />
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>审批记录</h2>
        </div>
        <div class="common-section-body">
          <approval-record-table
            :id="_id"
            :canAddOrUpdate="canEdit"
          />
        </div>
      </section>
    </el-main>
  </edit-base-container>
  <RejectDialog
    :visible.sync="rejectDialogVisible"
    :rejectIds="rejectIds"
    :isApplyReject="isApplyReject"
    @success="handleRejectSuccess"
  />
  <DenyDialog
    :visible.sync="denyDialogVisible"
    :denyIds="denyIds"
    @success="handleApproveSuccess"
  />
  <ApproveDialog
    :visible.sync="approveDialogVisible"
    :approveIds="approveIds"
    @success="handleApproveSuccess"
  />
  <CancelDialog
    :visible.sync="cancelDialogVisible"
    :cancelIds="cancelIds"
    @success="handleDialogSuccess"
  />
  <WithdrawDialog
    :visible.sync="withdrawDialogVisible"
    :withdrawIds="withdrawIds"
    @success="handleApproveSuccess"
  />
  <RightsDialog
    :visible.sync="rightsDialogVisible"
    :vehicleProfileId="form.vehicleProfileId"
    :id="_id"
  />

  <!-- 保修预警提醒弹窗 (BXYJ006/007/008/009 命中时弹出) -->
  <el-dialog
    title="保修预警提醒"
    :visible.sync="warningDialogVisibleBinding"
    width="720px"
    :close-on-click-modal="false"
    @close="warningDetailList = []"
  >
  <div v-if="warningDetailList.length === 0 && form.warrantyWarningMsg" style="padding: 8px 0;">
    {{ form.warrantyWarningMsg }}
  </div>
  <div
    v-for="(item, idx) in warningDetailList"
    :key="idx"
    style="
      border: 1px solid #ebeef5;
      border-radius: 4px;
      padding: 14px 18px;
      margin-bottom: 12px;
      background: #fafbfc;
    "
  >
    <!-- 标题: 规则名 (加粗 + 底部虚线分隔) -->
    <div style="
      font-weight: 600;
      font-size: 15px;
      color: #303133;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #e4e7ed;
    ">
      {{ item.ruleName || '预警' }}
    </div>
    <!-- 内容: 完整提醒文案 (缩进+灰色+行高) -->
    <div v-if="item.content" style="
      font-size: 13px;
      color: #606266;
      line-height: 1.8;
      margin-bottom: 10px;
      padding-left: 8px;
      word-break: break-all;
    ">
      {{ item.content }}
    </div>
    <!-- 保修单号 / 施工单号 列表 (点击可跳转详情, 超过 3 条时折叠 + "查看更多"跳列表页)
         content 文案里已经拼了完整单号序列, 这里只渲染链接块, 不再重复 "保修单号:" 之类的 label,
         避免与 content 重复感. (2026-08-26 用户纠正: 这个列表块不能删, 有跳转 + 查看更多 业务诉求) -->
    <div v-if="item.applyNos && item.applyNos.length" style="padding-left: 8px; margin-top: 8px;">
      <el-link
        v-for="(applyNo, i) in item.applyNos.slice(0, 3)"
        :key="'a' + idx + '-' + i"
        type="success"
        :href="getApplyDetailHref(applyNo)"
        target="_blank"
        style="margin-right: 8px;"
      >{{ applyNo }}</el-link>
      <el-link
        v-if="item.applyNos.length > 3"
        type="primary"
        :href="getApplyListHref(item.applyNos)"
        target="_blank"
        style="margin-left: 4px;"
      >查看更多 ({{ item.applyNos.length }})</el-link>
    </div>
    <!-- 施工单号 (BXYJ009 使用) -->
    <div v-if="item.proxyNos && item.proxyNos.length" style="padding-left: 8px; margin-top: 8px;">
      <el-link
        v-for="(proxyNo, i) in item.proxyNos.slice(0, 3)"
        :key="'p' + idx + '-' + i"
        type="success"
        :href="getProxyDetailHref(proxyNo)"
        target="_blank"
        style="margin-right: 8px;"
      >{{ proxyNo }}</el-link>
      <el-link
        v-if="item.proxyNos.length > 3"
        type="primary"
        :href="getProxyListHref(item.proxyNos)"
        target="_blank"
        style="margin-left: 4px;"
      >查看更多 ({{ item.proxyNos.length }})</el-link>
    </div>
    <!-- 零件编码 (BXYJ010 预留) -->
    <div v-if="item.partCodes && item.partCodes.length" style="padding-left: 8px; margin-top: 8px;">
      <span style="color: #909399; font-size: 12px; margin-right: 6px;">零件编码：</span>
      <el-link
        v-for="(partCode, i) in item.partCodes.slice(0, 3)"
        :key="'c' + idx + '-' + i"
        type="success"
        :href="getPartDetailHref(partCode)"
        target="_blank"
        style="margin-right: 8px;"
      >{{ partCode }}</el-link>
      <el-link
        v-if="item.partCodes.length > 3"
        type="primary"
        :href="getPartListHref(item.partCodes)"
        target="_blank"
        style="margin-left: 4px;"
      >查看更多 ({{ item.partCodes.length }})</el-link>
    </div>
  </div>
  <div slot="footer">
    <el-button @click="warningDetailList = []">关闭</el-button>
  </div>
</el-dialog>

</div>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  submit,
  withdraw,
  approve,
  batchCancel,
  print,
  getNextId,
  getList
} from '@/api/claimreturn/claim/warrantyapply/index';
import {
  APPLY_STATUS,
  EDITABLE_STATUSES,
  PENDING_REVIEW_STATUSES,
  WITHDRAWABLE_STATUSES,
} from './constants';
import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import CccSearch from '@/components/CccSearch/index.vue';
import { getRelatedReports } from '@/api/maintain/sp/qualityOrderReport/index';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import WorkHourTable from './WorkHourTable.vue';
import OtherTable from './OtherTable.vue';
import ActivityTable from './ActivityTable.vue';
import ApprovalRecordTable from './ApprovalRecordTable.vue';
import PartTable from './PartTable.vue';
import WarrantyApplyFile from './WarrantyApplyFile.vue';
import RejectDialog from './RejectDialog/index.vue';
import DenyDialog from './DenyDialog/index.vue';
import RightsDialog from './RightsDialog/index.vue';
import ApproveDialog from './ApproveDialog/index.vue';
import CancelDialog from './CancelDialog/index.vue';
import WithdrawDialog from './WithdrawDialog/index.vue';
// 旧件供应商
import { getLists } from '@/api/sparepart/basic/sparePartSupplier/index';
import { getSparePartFull } from '@/api/sparepart/basic/sparePart';
import { getDetail as getServiceActivityDetail } from '@/api/claimreturn/claim/basic/serviceActivity';
// 接车施工单 (BXYJ009 跳转需要按 proxyNo 批量查 id, 详情页只接受 id 入参)
import { getList as getServiceProxyList } from '@/api/maintain/sp/serviceProxy/index';

const SEARCH_PARAMS_KEY = 'WARRANTY_APPLY_SEARCH_PARAMS';
const NO_OLD_PART = '10'; // 无旧件

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
  checkoutTypeName: '',
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
  vehicleProfileId: '',
  produceDate: '',
  vehicleProperty: '',
  vehicleModelId: '',
  vehicleModelName: '',
  vehicleSeriesId: '',
  vehicleSeriesName: '',
  vehicleYearId: '',
  vehicleYearName: '',
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
  isInApproval: false,
  currentApproverIdList: [],
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
    FetchSelect,
    CccSearch,
    BaseInput,
    WorkHourTable,
    OtherTable,
    ActivityTable,
    ApprovalRecordTable,
    PartTable,
    WarrantyApplyFile,
    RejectDialog,
    DenyDialog,
    RightsDialog,
    ApproveDialog,
    CancelDialog,
    WithdrawDialog,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修申请单号：' + (this.form.applyNo);
    },
    canEdit () {
      return EDITABLE_STATUSES.includes(this.form.applyStatus) && this.canAddOrUpdate;
    },
    isFormEditing () {
      return this.isEditing || !this._id;
    },
    isPendingCurrentUserReview () {
      if (!this.form.isInApproval) return false;
      const list = this.form.currentApproverIdList?.map(id => Number(id)) || [];
      if (!list || list.length === 0) return true;
      const userId = this.$store.state.user.userInfo.userId;
      return list.includes(userId);
    },
    isGoodwillWarranty () {
      return this.form.repairItemTypeName === '善意保修';
    },
    remindContent () {
      return this.form.spRemindInfo;
    },
    /**
     * 保修预警弹窗 visible 完全由 warningDetailList 长度派生 (响应式)
     * <p>
     *   - detailList 有内容 → dialog 自动开
     *   - detailList 为空 → dialog 自动关
     *   - 用户手动点 X → set(false) 触发, 清空 list 防止下次又自动开
     * </p>
     */
    warningDialogVisibleBinding: {
      get () { return this.warningDetailList.length > 0; },
      set (val) {
        if (!val) {
          this.warningDetailList = [];
        }
      }
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
    },
    'form.mainPartCode': {
      handler (val, old) {
        if (val && val !== old) {
          if (this.$refs.mainPartSelectRef) {
            this.$refs.mainPartSelectRef.loadRemoteMethod(this.form.mainPartCode);
          }
        }
      }
    },
    /**
     * 保修预警详情变化时, 自动同步弹窗状态
     * <p>删除附件 / 重算预警 / 路由返回 等都会触发 form.warrantyWarningDetail 变化,
     * 此时根据 detail 数组长度决定开关 dialog, 避免弹窗残留</p>
     */
    'form.warrantyWarningDetail': {
      handler (newVal) {
        this.syncWarningDialogByDetail(newVal);
      },
      immediate: false
    },
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
      APPLY_STATUS,
      EDITABLE_STATUSES,
      PENDING_REVIEW_STATUSES,
      WITHDRAWABLE_STATUSES,
      defaultNewRow: {
        name: '',
      },
      emptyText: '若要启用此内容，请创建记录',
      rules: {
      },
      // 操作按钮权限
      canSubmit: false,
      canApprove: false,
      canReject: false,
      canApplyReject: false,
      canWithdraw: false,
      canDeny: false,
      canCancel: false,
      printLoading: false,
      // 对话框状态
      rejectDialogVisible: false,
      rejectIds: [],
      isApplyReject: false,
      denyDialogVisible: false,
      denyIds: [],
      approveDialogVisible: false,
      approveIds: [],
      cancelDialogVisible: false,
      cancelIds: [],
      withdrawDialogVisible: false,
      withdrawIds: [],
      rightsDialogVisible: false,
      // 保修预警提醒弹窗 (visible 由 warningDialogVisibleBinding computed 自动响应)
      warningDetailList: [],
      applyNoToIdMap: {},
      // BXYJ009: 施工单号 → id 映射 (详情页只接受 id 入参, 需要先批量查询)
      proxyNoToIdMap: {}
    };
  },
  created () {
    this.canSubmit = this.permissions.has(`${this.moduleKey}-submit`);
    this.canApprove = this.permissions.has(`${this.moduleKey}-approve`);
    this.canReject = this.permissions.has(`${this.moduleKey}-reject`);
    this.canApplyReject = this.permissions.has(`${this.moduleKey}-applyReject`);
    this.canWithdraw = this.permissions.has(`${this.moduleKey}-withdraw`);
    this.canDeny = this.permissions.has(`${this.moduleKey}-deny`);
    this.canCancel = this.permissions.has(`${this.moduleKey}-cancel`);
  },
  mounted () {
    console.log('[DEBUG] warrantyAuditList mounted', this.permissions);
  },
  methods: {
    // 参考 techServiceActivity/index.vue 的 getPath 实现
    getActivityPath (activityType) {
      return activityType === '4'
        ? '/claimreturn/claim/basic/serviceCareActivity/edit'
        : '/claimreturn/claim/basic/techServiceActivity/edit';
    },
    async openActivityDetail () {
      const activityId = this.form?.serviceActivityId;
      if (!activityId) {
        this.$message.warning('该保修申请单未关联活动');
        return;
      }
      try {
        const activity = await getServiceActivityDetail(activityId);
        if (!activity) {
          this.$message.error('活动不存在或已被删除');
          return;
        }
        const activityType = String(activity.activityType || '').trim();
        if (!activityType) {
          this.$message.error('活动类型信息缺失，暂无法打开详情');
          return;
        }
        // 保修申请页面仅查看活动，isEditing=false 进入查看模式
        this.$router.push({
          path: this.getActivityPath(activityType),
          query: {
            id: String(activityId),
            isEditing: false,
          }
        });
      } catch (error) {
        console.error('获取活动详情失败:', error);
        this.$message.error('活动详情查询失败，请稍后重试');
      }
    },
    handleTableUpdate () {
      this.refreshAll();
    },
    // 取详情并补齐 partAndSupplierId（不含弹窗副作用）
    fetchDetail () {
      const id = this._id;
      if (!id) return Promise.resolve();
      return getDetail(id).then(res => ({
        ...res,
        partAndSupplierId: res.mainPartId ? res.mainPartId + res.mainPartSupplierId : '',
      })).then(res => {
        // 同步保修预警弹窗状态 (detail 变化触发)
        this.syncWarningDialogByDetail(res.warrantyWarningDetail);
        return res;
      });
    },
    /**
     * 根据 detail JSON 同步弹窗状态
     * <p>任何路径 (首次加载 / 删除附件 / 重新拉数据) 调此方法统一更新,
     * dialog visible 由 warningDetailList.length 派生 (computed), 不需要手动控制</p>
     */
    syncWarningDialogByDetail (detailJson) {
      let list = [];
      if (detailJson) {
        try {
          list = JSON.parse(detailJson);
        } catch (e) {
          console.error('[保修预警] 解析 warrantyWarningDetail 失败', e);
          list = [];
        }
      }
      this.warningDetailList = Array.isArray(list) ? list : [];
    },
    detailRequest () {
      return this.fetchDetail().then(res => {
        this.parseAndShowWarning(res);
        return res;
      });
    },
    /**
     * 解析 warranty_warning_detail JSON, 显示保修预警提醒弹窗
     * <p>
     * 规则: 即使 detail 字段为空 (老数据 / 还没触发预警), 只要 warranty_warning_msg 非空, 也展示简单提示。
     * </p>
     */
    parseAndShowWarning (res) {
      const msg = res?.warrantyWarningMsg;
      let list = [];
      if (res?.warrantyWarningDetail) {
        try {
          list = JSON.parse(res.warrantyWarningDetail);
        } catch (e) {
          console.error('[保修预警] 解析 warrantyWarningDetail 失败', e);
          list = [];
        }
      }
      this.warningDetailList = Array.isArray(list) ? list : [];
      // dialog visible 由 warningDialogVisibleBinding (computed) 自动响应 detailList 长度变化
      if (this.warningDetailList.length > 0) {
        this.$nextTick(() => {
          this.loadApplyNoIdMappings();
          // BXYJ009: 同步加载施工单号 → id 映射, 用于点击单号跳详情
          this.loadProxyNoIdMappings();
        });
      }
    },
    /**
     * 加载 applyNo → id 的映射, 用于点击单号跳详情
     */
    async loadApplyNoIdMappings () {
      // 收集所有 applyNos
      const applyNos = new Set();
      this.warningDetailList.forEach(item => {
        if (item && Array.isArray(item.applyNos)) {
          item.applyNos.forEach(no => { if (no) applyNos.add(no); });
        }
      });
      if (applyNos.size === 0) return;
      try {
        const res = await getList({
          pageNum: 1,
          pageSize: applyNos.size,
          applyNoList: Array.from(applyNos)
        });
        const map = {};
        const records = res?.data?.records || res?.records || [];
        records.forEach(r => { if (r.applyNo) map[r.applyNo] = r.id; });
        this.applyNoToIdMap = map;
      } catch (e) {
        console.error('[保修预警] 批量查 applyNo→id 失败', e);
      }
    },
    /**
     * 加载 proxyNo → id 的映射 (BXYJ009)
     */
    async loadProxyNoIdMappings () {
      const proxyNos = new Set();
      this.warningDetailList.forEach(item => {
        if (item && Array.isArray(item.proxyNos)) {
          item.proxyNos.forEach(no => { if (no) proxyNos.add(no); });
        }
      });
      if (proxyNos.size === 0) return;
      try {
        // codes: 接车施工单管理列表页的"单据编号"查询字段, 数组形式代表多值 IN 查询
        // serviceProxy/page 直接返回 { records: [...], total: N } 结构, 没有 res.data 包装
        const res = await getServiceProxyList({
          pageNum: 1,
          pageSize: proxyNos.size,
          codes: Array.from(proxyNos)
        });
        const map = {};
        const records = res?.data?.records || res?.records || [];
        records.forEach(r => { if (r.code) map[r.code] = r.id; });
        this.proxyNoToIdMap = map;
      } catch (e) {
        console.error('[保修预警] 批量查 proxyNo→id 失败', e);
      }
    },
    /**
     * 保修单详情链接: 优先用 id (详情页 ?id= 入参), 降级到 applyNo 跳列表
     */
    getApplyDetailHref (applyNo) {
      const id = this.applyNoToIdMap[applyNo];
      return id
        ? `/claimreturn/claim/warrantyApply/edit?id=${id}`
        : `/claimreturn/claim/warrantyApply?applyNo=${encodeURIComponent(applyNo)}`;
    },
    /**
     * 保修单列表链接: 批量带入 applyNoList 过滤
     */
    getApplyListHref (applyNos) {
      return `/claimreturn/claim/warrantyApply?applyNoList=${applyNos.map(encodeURIComponent).join(',')}`;
    },
    /**
     * 施工单详情链接: 优先用 id, 降级到 proxyNo 跳列表页查询 (参考 BXYJ006-008 applyNos 实现)
     * <p>
     *   接车施工单详情页 {@code /maintain/sp/serviceProxy/edit} 的 {@code _id} 只接受
     *   {@code ?id=} 入参, 不支持按 serviceProxyNo 查询, 所以需要先通过
     *   {@link #loadProxyNoIdMappings} 把 proxyNo → id 映射加载好。
     * </p>
     */
    getProxyDetailHref (proxyNo) {
      const id = this.proxyNoToIdMap[proxyNo];
      if (id) {
        return `/maintain/sp/serviceProxy/edit?id=${id}`;
      }
      // 映射加载失败 / 找不到 → 降级跳列表 (带 codes 让用户在列表里筛选)
      return `/maintain/sp/serviceProxy?codes=${encodeURIComponent(proxyNo)}`;
    },
    /**
     * 施工单列表链接: 跳转到接车施工单管理列表页, 通过 {@code codes} 多值过滤。
     * <p>
     *   serviceProxy 列表页已实现 {@code applyWarningSearchParams},
     *   会读取该参数重置 form.codes 并触发查询。
     * </p>
     */
    getProxyListHref (proxyNos) {
      return `/maintain/sp/serviceProxy?codes=${proxyNos.map(encodeURIComponent).join(',')}`;
    },
    /**
     * 备件主数据详情链接 (sparePart 备件主数据模块)
     */
    getPartDetailHref (partCode) {
      return `/service/sparepart/basic/sparePart?partCode=${encodeURIComponent(partCode)}`;
    },
    getPartListHref (partCodes) {
      return `/service/sparepart/basic/sparePart?partCodeList=${partCodes.map(encodeURIComponent).join(',')}`;
    },
    async submitRequest () {
      const res = await addOrUpdate({ ...this.form });
      // 保存成功后刷新零件表格
      this.$nextTick(() => {
        if (this.$refs.partTableRef) {
          this.$refs.partTableRef.getDetailPageApi();
        }
      });
      return res;
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
    onCCCUpdate ({ data, node }) {
      this.form.cccName = data.name;
      this.form.cccId = data.id;
      this.form.cccCode = data.code;

      const vfgNode = node?.parent;
      this.form.vfgId = vfgNode?.data.id;
      this.form.vfgName = vfgNode?.data.name;

      const vrtNode = vfgNode?.parent;
      this.form.vrtId = vrtNode?.data.id;
      this.form.vrtName = vrtNode?.data.name;
    },
    getReportList (query) {
      const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
      const dateStr = fifteenDaysAgo.toISOString().slice(0, 10);
      return getRelatedReports({
        pageNum: 1,
        pageSize: 20,
        codeOrNameLike: query,
        serviceProxyId: this.form.serviceProxyId,
        createTimeStart: dateStr,
        applyStatusList: ['30', '50'],
      });
    },
    onReportChange (val, row) {
      this.form.qualityOrderReport = row.qualityOrderReport;
      // 将报告单中的VRT，VFG，CCC，故障信息描述，故障流程排查，主因备件，主因供应商，覆盖更新到保修申请单
      this.form.cccId = row.cccId;
      this.form.cccName = row.cccName;
      this.form.vfgId = row.vfgId;
      this.form.vfgName = row.vfgName;
      this.form.vrtId = row.vrtId;
      this.form.vrtName = row.vrtName;
      this.form.faultPhenomenon = row.customerContent; // 故障排查信息 赋值
      this.form.troubleshootingFlow = row.troubleshootingProcess;
      // this.form.troubleshootingFlow = row.troubleshootingFlow;

      this.form.mainPartName = row.causePartName;
      this.form.mainPartCode = row.causePartCode;
      this.form.mainPartId = row.causePartId;

      this.form.mainPartSupplierName = row.supplierName;
      this.form.mainPartSupplierCode = row.supplierCode;
      this.form.mainPartSupplierId = row.supplierId;
      // 更新 partAndSupplierId 以同步 fetch-select 显示
      this.form.partAndSupplierId = row.causePartId && row.supplierId ? row.causePartId + row.supplierId : '';
      // 重新加载下拉框选项，使选项列表更新为新的零件编码
      this.$nextTick(() => {
        if (this.$refs.mainPartSelectRef) {
          this.$refs.mainPartSelectRef.loadRemoteMethod(this.form.mainPartCode);
        }
      });
    },
    // 搜索主因零件
    partRemote (query) {
      const search = (query || '').trim();
      return new Promise((resolve, reject) => {
        getLists({
          pageNum: 1,
          pageSize: 20,
          oemPart: 1,
          partCodeOrNameLike: search,
          status: 1,
        }).then(res => {
          if (!res?.length) {
            resolve([
              {
                placeholder: `备件编码：${search}不存在备件供应商关系信息`,
                disabled: true,
              }
            ]);
          } else {
            const records = res.map(item => {
              return {
                ...item,
                partAndSupplierId: item.sparePartId + item.supplierInfoId,
              };
            });
            resolve(records);
          }
        });
      });
    },
    // 主因零件选择变更
    onMainPartChange (val, row) {
      if (!row) {
        this.form.mainPartCode = '';
        this.form.mainPartName = '';
        this.form.mainPartId = '';
        this.form.mainPartSupplierCode = '';
        this.form.mainPartSupplierName = '';
        this.form.mainPartSupplierId = '';
        this.form.partAndSupplierId = '';
        return;
      }
      this.form.mainPartCode = row?.partCode;
      this.form.mainPartName = row?.partName;
      this.form.mainPartId = row?.sparePartId;
      this.form.mainPartSupplierCode = row?.supplierCode || '';
      this.form.mainPartSupplierName = row?.supplierName || '';
      this.form.mainPartSupplierId = row?.supplierInfoId || '';
    },
    // 刷新页面所有接口（保留用户未提交的表单修改，避免静默丢失）
    async refreshAll () {
      if (!this._id) return;
      // 1. 快照用户已修改但未提交的字段（对照 originalForm 基线）
      const editedEntries = Object.keys(this.form)
        .filter(k => JSON.stringify(this.form[k]) !== JSON.stringify(this.originalForm[k]))
        .map(k => [k, this.form[k]]);
      // 2. 拉取服务端最新数据
      const res = await this.fetchDetail();
      if (!res) return;
      // 2.1 同步预警弹窗状态 (删除附件等场景下 detail 清空 → 自动关闭 dialog)
      this.parseAndShowWarning(res);
      // 3. 以服务端数据为基础，叠加用户未提交的修改
      const merged = { ...res };
      editedEntries.forEach(([k, v]) => { merged[k] = v; });
      this.form = merged;
      // 4. 同步脏状态基线：未改字段=服务端最新值（干净），改过字段=旧基线值（仍为脏）
      const newBaseline = { ...res };
      editedEntries.forEach(([k]) => { newBaseline[k] = this.originalForm[k]; });
      this.originalForm = { ...newBaseline };
      // 容器内部基线（取消编辑/还原使用）同步刷新，避免还原出陈旧的派生数据
      if (this.$refs.containerRef) {
        this.$refs.containerRef.innerOriginalForm = { ...newBaseline };
      }
      if (this.$refs.partTableRef) {
        this.$refs.partTableRef.getDetailPageApi();
      }
    },
    // 提交
    handleSubmit () {
      this.loading = true;
      submit({ id: this._id }).then(() => {
        this.$message.success('提交成功');
        this.$refs.containerRef.loadDetail();
      }).catch(() => {
        this.$message.error('提交失败，请稍后重试');
      }).finally(() => {
        this.loading = false;
      });
    },
    // 同意
    handleApprove () {
      this.approveIds = [this._id];
      this.approveDialogVisible = true;
    },
    // 驳回/申请驳回
    handleReject (isApplyReject) {
      this.rejectIds = [this._id];
      this.isApplyReject = isApplyReject;
      this.rejectDialogVisible = true;
    },
    // 撤回
    handleWithdraw () {
      this.withdrawIds = [this._id];
      this.withdrawDialogVisible = true;
    },
    // 拒赔
    handleDeny () {
      this.denyIds = [this._id];
      this.denyDialogVisible = true;
    },
    // 作废
    handleCancel () {
      this.cancelIds = [this._id];
      this.cancelDialogVisible = true;
    },
    // 打印标签
    handlePrint () {
      this.printLoading = true;
      print({ ids: [this._id] })
        .then(res => {
          const printData = res?.filter(item => item.returnPartType !== NO_OLD_PART) || [];
          if (printData.length > 0) {
            this.$print.show({
              id: new Date().getTime() + '',
              template: 'OldPartMark',
              title: '保修旧件标签',
              data: printData,
              width: 1122,
              isWarrantyApply: true,
            });
          } else {
            this.$message.warning('未查询到打印数据');
          }
        })
        .finally(() => {
          this.printLoading = false;
        });
    },
    // 查看权益
    handleViewRights () {
      this.rightsDialogVisible = true;
    },
    // 对话框成功回调
    handleDialogSuccess () {
      this.$refs.containerRef.loadDetail();
    },
    // 驳回跳转下一条，申请驳回仅刷新当前单
    handleRejectSuccess () {
      if (this.isApplyReject) {
        this.handleDialogSuccess();
      } else {
        this.handleApproveSuccess();
      }
    },
    // 同意成功后跳转下一条
    handleApproveSuccess () {
      const searchParams = JSON.parse(sessionStorage.getItem(SEARCH_PARAMS_KEY) || '{}');
      // 增加预防，无id不跳
      if (!this._id) return;
      getNextId({
        ...searchParams,
        maxId: this._id
      }).then(nextId => {
        if (nextId) {
          if (nextId !== this._id) {
            this.$message.info('已自动跳转到下一条记录');
            this.$router.replace({
              path: '/claimreturn/claim/warrantyApply/edit',
              query: { id: nextId }
            });
          }
        } else {
          this.$message.info('没有更多待审批记录');
          this.$refs.containerRef.loadDetail();
        }
      }).catch(() => {
        this.$refs.containerRef.loadDetail();
      });
    }
  }
};
</script>
