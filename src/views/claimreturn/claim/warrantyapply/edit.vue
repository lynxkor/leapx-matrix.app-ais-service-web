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
    :showEditBtn="EDITABLE_STATUSES.includes(form.applyStatus)"
  >
    <template #extraButtons>
      <el-button :loading="printLoading" size="small" @click="handlePrint">打印标签</el-button>
      <el-button size="small" @click="handleViewRights">查看权益</el-button>
      <el-button v-if="canApplyReject && (isPendingCurrentUserReview || form.applyStatus === APPLY_STATUS.APPROVED)" size="small" @click="handleReject(true)">申请驳回</el-button>
      <el-button v-if="canWithdraw && WITHDRAWABLE_STATUSES.includes(form.applyStatus)" size="small" @click="handleWithdraw">撤回</el-button>
      <el-button v-if="canDeny && isPendingCurrentUserReview" plain size="small" @click="handleDeny">拒赔</el-button>
      <el-button v-if="canReject && isPendingCurrentUserReview" size="small" @click="handleReject(false)">驳回</el-button>
      <el-button v-if="canCancel && (EDITABLE_STATUSES.includes(form.applyStatus))" plain size="small" @click="handleCancel">作废</el-button>
      <el-button v-if="canApprove && isPendingCurrentUserReview" type="primary" size="small" @click="handleApprove">同意</el-button>
      <el-button v-if="canSubmit && (EDITABLE_STATUSES.includes(form.applyStatus))" type="primary" size="small" @click="handleSubmit">提交</el-button>
    </template>
    <el-main>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
              {{ form.serviceActivityCode }}
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
              <el-link type="success" :href="`/claimreturn/claim/claimtrace/claimtraceorder/edit?id=${form.claimTrackId}`" target="_blank">{{ form.claimTrackNo }}</el-link>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>车辆&客户</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="VIN：" prop="vin">
              <LPEncrypted
                :value.sync="form.vin"
                :decryptMethod="() => getDetailDecryptField(form.id, 'vin')"
                >
                <el-input placeholder="" v-model="form.vin" clearable disabled />
              </LPEncrypted>
            </el-form-item>
            <el-form-item label="车牌号：" prop="vehiclePlateNo">
              <LPEncrypted
                :value.sync="form.vehiclePlateNo"
                :decryptMethod="() => getDetailDecryptField(form.id, 'vehiclePlateNo')"
                >
                <el-input placeholder="" v-model="form.vehiclePlateNo" clearable disabled />
              </LPEncrypted>
              <!-- <el-input placeholder="" v-model="form.vehiclePlateNo" clearable disabled /> -->
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
              <el-input placeholder="" v-model="form.vehicleProperty" clearable disabled />
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
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="VIN：" prop="vin">
              <LPEncrypted
                :value.sync="form.vin"
                :decryptMethod="() => getDetailDecryptField(form.id, 'vin')"
              >
                <el-link type="success" :href="`/datacenter/vehicle/vehicleProfile/edit?id=${form.vehicleProfileId}`" target="_blank">{{ form.vin }}</el-link>
              </LPEncrypted>
            </el-form-item>
            <el-form-item label="车牌号：" prop="vehiclePlateNo">
              <LPEncrypted
                :value.sync="form.vehiclePlateNo"
                :decryptMethod="() => getDetailDecryptField(form.id, 'vehiclePlateNo')"
                >
              </LPEncrypted>
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
              {{ form.vehicleProperty }}
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
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
            <el-form-item class="form-item-full" label="故障信息描述：" prop="faultPhenomenon">
              <base-input type="textarea" v-model="form.faultPhenomenon" clearable />
            </el-form-item>
            <el-form-item class="form-item-full" label="故障排除流程：" prop="troubleshootingFlow">
              <base-input type="textarea" v-model="form.troubleshootingFlow" clearable />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
            <el-form-item class="form-item-full" label="故障信息描述：" prop="faultPhenomenon">
             {{ form.faultPhenomenon }}
            </el-form-item>
            <el-form-item class="form-item-full" label="故障排除流程：" prop="troubleshootingFlow">
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
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm4" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
            v-show="!(isEditing || !_id)"
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
          <el-form :inline="true" ref="ruleForm5" label-width="150px" class="form-edit" v-show="isEditing || !_id || canEditMainPart">
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
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id) && !canEditMainPart">
            <el-form-item label="主因零件编码：" prop="mainPartCode">
              {{ form.mainPartCode }}
            </el-form-item>
            <el-form-item label="主因零件名称：" prop="mainPartName">
              {{ form.mainPartName }}
            </el-form-item>
            <el-form-item label="主因供应商编码：" prop="mainPartSupplierCode">
              {{ form.mainPartSupplierCode }}
            </el-form-item>
            <el-form-item label="主因供应商名称：" prop="mainPartSupplierName">
              {{ form.mainPartSupplierName }}
            </el-form-item>
          </el-form>
          <part-table
            ref="partTableRef"
            :id="_id"
            :canAddOrUpdate="canEdit"
            :canEditMainPart="canEditMainPart"
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
    @success="handleDialogSuccess"
  />
  <DenyDialog
    :visible.sync="denyDialogVisible"
    :denyIds="denyIds"
    @success="handleDialogSuccess"
  />
  <ApproveDialog
    :visible.sync="approveDialogVisible"
    :approveIds="approveIds"
    @success="handleDialogSuccess"
  />
  <CancelDialog
    :visible.sync="cancelDialogVisible"
    :cancelIds="cancelIds"
    @success="handleDialogSuccess"
  />
  <WithdrawDialog
    :visible.sync="withdrawDialogVisible"
    :withdrawIds="withdrawIds"
    @success="handleDialogSuccess"
  />
  <RightsDialog
    :visible.sync="rightsDialogVisible"
    :vehicleProfileId="form.vehicleProfileId"
    :id="_id"
  />
</div>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  getDetailDecryptField,
  submit,
  withdraw,
  approve,
  batchCancel,
  print,
} from '@/api/claimreturn/claim/warrantyapply/index';
import {
  APPLY_STATUS,
  EDITABLE_STATUSES,
  PENDING_REVIEW_STATUSES,
  WITHDRAWABLE_STATUSES,
} from './constants';
import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getLoginUser } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import CccSearch from '@/components/CccSearch/index.vue';
import { getRelatedReports } from '@/api/maintain/sp/qualityOrderReport/index';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import LPEncrypted from '@/libs/components/LPEncrypted/index.vue';
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
    LPEncrypted,
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
    isFactoryAccount () {
      return this.accountFlag === false;
    },
    canEditMainPart () {
      return this.isFactoryAccount && this.isPendingCurrentUserReview;
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
      let result = '';
      let last = false;
      const remindList = this.form.spRemindInfo || [];
      remindList?.forEach((item, index) => {
        if (index === remindList.length - 1) {
          last = true;
        }
        if (item.type === '2') { // 三包预警
          item.content?.forEach(contentItem => {
            result += contentItem.title + '，';
            result += contentItem.contents.join('，');
          });
        } else {
          result += item.content;
          if (!last) {
            result += ' ';
          }
        }
      });
      return result;
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
      accountFlag: null,
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
    getLoginUser().then(res => {
      this.accountFlag = res.accountFlag;
    });
  },
  mounted () {
    // 571005W202603271622250001
  },
  methods: {
    getDetailDecryptField (id, field) {
      return getDetailDecryptField(id, field);
    },
    handleTableUpdate () {
      this.$refs.containerRef.loadDetail();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          const warningMsg = res.warrantyWarningMsg;
          if (warningMsg) {
            this.$nextTick(() => {
              this.$alert(warningMsg, '保修预警提醒', {
                closeOnClickModal: false,
                type: 'warning',
              });
            });
          }
          return {
            ...res,
            partAndSupplierId: res.mainPartId ? res.mainPartId + res.mainPartSupplierId : '',
          };
        });
      }
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
      return new Promise((resolve, reject) => {
        getLists({
          pageNum: 1,
          pageSize: 20,
          oemPart: 1,
          partCodeOrNameLike: query,
          status: 1,
        }).then(res => {
          if (!res?.length) {
            resolve([
              {
                placeholder: `备件编码：${query}不存在备件供应商关系信息`,
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
        this.form.mainPartSupplierName = '';
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
    // 刷新页面所有接口
    async refreshAll () {
      await this.$refs.containerRef.loadDetail();
      this.$refs.partTableRef.getDetailPageApi();
    },
    // 提交
    handleSubmit () {
      submit({ id: this._id }).then(() => {
        this.$message.success('提交成功');
        this.$refs.containerRef.loadDetail();
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
          if (res && res.length > 0) {
            this.$print.show({
              id: new Date().getTime() + '',
              template: 'OldPartMark',
              title: '保修旧件标签',
              data: res,
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
    }
  }
};
</script>
