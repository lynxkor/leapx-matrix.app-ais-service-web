<template>
  <edit-page-layout ref="editLayout" title="保修审计明细详情" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <template #status>
          <span class="status primary">{{ form.warrantyAuditDetail.auditStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="_id && permissions.has(`${moduleKey}-supplementMaterial`) && form.warrantyAuditDetail.auditStatus === '20'" size="small" type="primary" @click="handleSupplyMaterial">补充材料</el-button>
          <el-button v-if="_id && permissions.has(`${moduleKey}-pass`) && form.warrantyAuditDetail.auditStatus === '30'" size="small" type="primary" @click="handleAuditPass">审计通过</el-button>
          <el-button v-if="_id && permissions.has(`${moduleKey}-reject`) && form.warrantyAuditDetail.auditStatus === '30'" size="small" type="primary" @click="handleAuditReject">审计驳回</el-button>
          <el-button v-if="_id && permissions.has(`${moduleKey}-appeal`) && form.warrantyAuditDetail.auditStatus === '50'" size="small" type="primary" @click="handleAppeal">申诉</el-button>
          <el-button v-if="_id && permissions.has(`${moduleKey}-agree`) && form.warrantyAuditDetail.auditStatus === '50'" size="small" type="primary" @click="handleAgree">同意</el-button>
          <el-button v-if="_id && permissions.has(`${moduleKey}-agreeAppeal`) && form.warrantyAuditDetail.auditStatus === '60'" size="small" type="primary" @click="handleAgreeAppeal">同意申诉</el-button>
          <el-button v-if="_id && permissions.has(`${moduleKey}-rejectAppeal`) && form.warrantyAuditDetail.auditStatus === '60'" size="small" type="primary" @click="handleRejectAppeal">拒绝申诉</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="保修申请单号：">
                  <el-link type="primary" :href="`/claimreturn/claim/warrantyApply/edit?id=${form.warrantyApply?.id}`" target="_blank">{{ form.warrantyApply?.applyNo }}</el-link>
                </el-form-item>
                <el-form-item label="接车施工单号：">
                  <el-link type="primary" :href="`/maintain/sp/serviceProxy/edit?id=${form.warrantyApply?.serviceProxyId}`" target="_blank">{{ form.warrantyApply?.serviceProxyNo }}</el-link>
                </el-form-item>
                <el-form-item label="首次提交时间：">
                  {{ form.warrantyApply?.firstSubmitTime }}
                </el-form-item>
                <el-form-item label="保修单状态：">
                  {{ form.warrantyApply?.applyStatusLabel }}
                </el-form-item>
                <el-form-item label="结算类型：">
                  {{ form.warrantyApply?.checkoutTypeName }}
                </el-form-item>
                <el-form-item label="结算单号：">
                  <el-link type="primary" :href="`/maintain/sp/serviceStatement/edit?id=${form.warrantyApply?.statementId}`" target="_blank">{{ form.warrantyApply?.statementCode }}</el-link>
                </el-form-item>
                <el-form-item label="当前提交时间：" prop="currentSubmitTime">
                  {{ form.warrantyApply?.currentSubmitTime }}
                </el-form-item>
                <el-form-item label="旧件返还状态：">
                  {{ form.warrantyApply?.returnPartsStatusLabel }}
                </el-form-item>
                <el-form-item label="保修类型：">
                  {{ form.warrantyApply?.repairItemTypeName }}
                </el-form-item>
                <el-form-item label="门店编码：">
                  {{ form.warrantyApply?.dealerCode }}
                </el-form-item>
                <el-form-item label="审批时间：">
                  {{ form.warrantyApply?.approvalTime }}
                </el-form-item>
                <el-form-item label="预授权单：">
                  <el-link type="primary" :href="`/maintain/sp/preAuth/edit?id=${form.warrantyApply?.preAuthId}`" target="_blank">{{ form.warrantyApply?.preAuthCode }}</el-link>
                </el-form-item>
                <el-form-item label="维修开始时间：">
                  {{ form.warrantyApply?.repairStartTime }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.warrantyApply?.dealerName }}
                </el-form-item>
                <el-form-item label="活动编码：">
                  {{ form.warrantyApply?.serviceActivityCode }}
                </el-form-item>
                <el-form-item label="维修结束时间：">
                  {{ form.warrantyApply?.repairEndTime }}
                </el-form-item>
                <el-form-item label="门店所属区域：">
                  {{ form.warrantyApply?.dealerRegionName }}
                </el-form-item>
                <el-form-item label="保修付款时间：">
                  {{ form.warrantyApply?.paymentTime }}
                </el-form-item>
                <el-form-item label="索赔追溯单：">
                  <el-link type="primary" :href="`/claimreturn/claim/claimtrace/claimTraceOrder/edit?id=${form.warrantyApply?.claimTrackId}`" target="_blank">{{ form.warrantyApply?.claimTrackNo }}</el-link>
                </el-form-item>
                <el-form-item label="审批说明：" style="width: 100%;">
                  {{ form.warrantyApply?.approvalRemark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>车辆&客户</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="vin：">
                  <LPEncrypted
                    :value.sync="form.vehicleProfile.vin"
                    :decryptMethod="() => getDetailDecryptField()"
                  >
                    <el-link type="primary" :href="`/datacenter/vehicle/vehicleProfile/edit?id=${form.vehicleProfile?.vin}`" target="_blank">{{ form.vehicleProfile?.vin }}</el-link>
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="车牌号：">
                  {{ form.vehicleProfile?.vehiclePlateNo }}
                </el-form-item>
                <el-form-item label="生产日期：">
                  {{ form.vehicleProfile?.produceDate }}
                </el-form-item>
                <el-form-item label="服务月份：">
                  {{ form.warrantyApply?.serviceMonth }}
                </el-form-item>
                <el-form-item label="保修开始日期：">
                  {{ form.vehicleProfile?.warrantyStartdate }}
                </el-form-item>
                <el-form-item label="整车保修结束日期(预测)：">
                  {{ form.vehicleProfile?.warrantyEnddate }}
                </el-form-item>
                <el-form-item label="进店历程KM：">
                  {{ form.warrantyApply?.mileage }}
                </el-form-item>
                <el-form-item label="车主姓名：">
                  {{ form.warrantyApply?.ownerName }}
                </el-form-item>
                <el-form-item label="车主电话：">
                  {{ form.warrantyApply?.ownerPhone }}
                </el-form-item>
                <el-form-item label="送修人姓名：">
                  {{ form.warrantyApply?.shuttleName }}
                </el-form-item>
                <el-form-item label="送修人电话：">
                  {{ form.warrantyApply?.shuttlePhone }}
                </el-form-item>
                <el-form-item label="是否终身免保：">
                  {{ form.warrantyApply?.isLifetimeWarrantyLabel }}
                </el-form-item>
                <el-form-item label="车辆用途：">
                  {{ form.warrantyApply?.vehiclePropertyLabel }}
                </el-form-item>
                <el-form-item label="保修预警信息：">
                  {{ form.warrantyApply?.warrantyWarningMsg }}
                </el-form-item>
                <el-form-item label="整车是否在保(预测)：">
                  {{ form.warrantyApply?.isVehicleInWarrantyLabel }}
                </el-form-item>
                <el-form-item label="三包预警：">
                  {{ form.warrantyApply?.alarmLevelLabel }}
                </el-form-item>
                <el-form-item label="开单预警信息：" style="width: 100%;">
                  {{ remindContent }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>质量反馈信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="质量反馈报告：">
                  {{ form.qualityOrderReport?.description }}
                </el-form-item>
                <el-form-item label="VRT：">
                  {{ form.warrantyApply?.vrtName }}
                </el-form-item>
                <el-form-item label="VFG：">
                  {{ form.warrantyApply?.vfgName }}
                </el-form-item>
                <el-form-item label="CCC：">
                  {{ form.warrantyApply?.cccName }}
                </el-form-item>
                <el-form-item label="故障信息描述：" style="width: 100%;">
                  {{ form.warrantyApply?.faultPhenomenon }}
                </el-form-item>
                <el-form-item label="故障排查流程：" style="width: 100%;">
                  {{ form.warrantyApply?.troubleshootingFlow }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>保修费用信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="工时索赔小计：">
                  {{ form.warrantyApply?.laborClaimTotal }}
                </el-form-item>
                <el-form-item label="备件索赔小计：">
                  {{ form.warrantyApply?.partsClaimTotal }}
                </el-form-item>
                <el-form-item label="其他索赔小计：">
                  {{ form.warrantyApply?.otherClaimTotal }}
                </el-form-item>
                <el-form-item label="索赔总金额：">
                  {{ form.warrantyApply?.totalClaimAmount }}
                </el-form-item>
                <el-form-item label="工时费用小计：">
                  {{ form.warrantyApply?.workCostCount }}
                </el-form-item>
                <el-form-item label="备件费用小计： ">
                  {{ form.warrantyApply?.partsCostTotal }}
                </el-form-item>
                <el-form-item label="其他费用小计：">
                  {{ form.warrantyApply?.otherCostTotal }}
                </el-form-item>
                <el-form-item label="费用总金额：">
                  {{ form.warrantyApply?.totalCostAmount }}
                </el-form-item>
                <el-form-item label="工时分担比例：">
                  {{ form.warrantyApply?.laborShareRatio }}
                </el-form-item>
                <el-form-item label="备件分担比例：">
                  {{ form.warrantyApply?.partsShareRatio }}
                </el-form-item>
                <el-form-item label="其他分担比例：">
                  {{ form.warrantyApply?.otherShareRatio }}
                </el-form-item>
                <el-form-item label="平台单号：">
                  {{ form.warrantyApply?.platformApprovalNo }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>工时信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="form.warrantyApplyWorkhours" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="isMainItem" title="是否主因" min-width="10%">
                    <template #default="{ row }">
                      {{ row.isMainItem === 1 ? '是':'否' }}
                    </template>
                  </vxe-column>
                  <vxe-column field="repairItemCode" title="工时代码" min-width="10%" />
                  <vxe-column field="repairItemName" title="工时名称" min-width="10%" />
                  <vxe-column field="workHour" title="工时数" min-width="10%" />
                  <vxe-column field="totalCostAmount" title="总金额" min-width="10%" />
                  <vxe-column field="remark" title="备注" min-width="10%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>备件信息</h2>
            </div>
            <div class="common-section-body">
              <div style="margin-bottom: 8px;">
                <el-form :inline="true" :model="form" class="form-detail">
                  <el-form-item label="主因备件编码：">
                    {{ form.warrantyApply?.mainPartCode }}
                  </el-form-item>
                  <el-form-item label="主因备件名称：">
                    {{ form.warrantyApply?.mainPartName }}
                  </el-form-item>
                  <el-form-item label="主因供应商编码：">
                    {{ form.warrantyApply?.mainPartSupplierCode }}
                  </el-form-item>
                  <el-form-item label="主因供应商名称：">
                    {{ form.warrantyApply?.mainPartSupplierName }}
                  </el-form-item>
                </el-form>
              </div>
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="form.warrantyPartList" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="isMainPart" title="是否主因" min-width="7%" >
                    <template #default="{ row }">
                      {{ row.isMainPart === 1 ? '是':'否' }}
                    </template>
                  </vxe-column>
                  <vxe-column field="oldPartUniqueCode" title="旧件唯一码" min-width="7%" />
                  <vxe-column field="partCode" title="备件编码" min-width="7%" />
                  <vxe-column field="partName" title="备件名称" min-width="7%" />
                  <vxe-column field="returnPartTypeLabel" title="旧件返还类型" min-width="7%" />
                  <vxe-column field="isReturnedLabel" title="是否已返" min-width="7%" />
                  <vxe-column field="oldPartCode" title="旧件编码" min-width="7%" />
                  <vxe-column field="oldPartName" title="旧件名称" min-width="7%" />
                  <vxe-column field="oldPartSupplierCode" title="旧件供应商编码" min-width="7%" />
                  <vxe-column field="partQuantity" title="备件数" min-width="7%" />
                  <vxe-column field="partUnitPrice" title="备件单价" min-width="7%" />
                  <vxe-column field="managementRate" title="管理费率%" min-width="7%" />
                  <vxe-column field="totalCostAmount" title="总金额" min-width="7%" />
                  <vxe-column field="remark" title="备注" min-width="7%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>审计信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-title">基础信息</div>
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="保修审计单：">
                  <el-link type="primary" :href="`/claimreturn/claim/warrantyAudit/edit?id=${form.warrantyAuditDetail?.auditId}`" target="_blank">{{ form.warrantyAuditDetail?.auditCode }}</el-link>
                </el-form-item>
                <el-form-item label="保修审计明细：">
                  {{ form.warrantyAuditDetail?.auditDetailCode }}
                </el-form-item>
                <el-form-item label="审计开始日期：">
                  {{ form.warrantyAuditDetail?.auditTime }}
                </el-form-item>
                <el-form-item label="审计状态：">
                  {{ form.warrantyAuditDetail?.auditStatusLabel }}
                </el-form-item>
              </el-form>
              <div class="common-title">材料补充信息</div>
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="材料补充人：">
                  {{ form.warrantyAuditDetail?.materialSupplierName }}
                </el-form-item>
                <el-form-item label="材料补充时间：">
                  {{ form.warrantyAuditDetail?.materialSupplyTime }}
                </el-form-item>
                <el-form-item label="材料提交截止日期：">
                  {{ form.warrantyAuditDetail?.materialSubmitDeadline }}
                </el-form-item>
                <el-form-item label="材料补充说明：" style="width: 100%;">
                  {{ form.warrantyAuditDetail?.materialSupplyDesc }}
                </el-form-item>
              </el-form>
              <div class="common-title">审计&反馈信息</div>
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="审计人：">
                  {{ form.warrantyAuditDetail?.auditorName }}
                </el-form-item>
                <el-form-item label="审计时间：">
                  {{ form.warrantyAuditDetail?.auditTime }}
                </el-form-item>
                <el-form-item label="错误项：">
                    <div>{{ errorCategoryText }}</div>
                </el-form-item>
                <el-form-item label="审计结果同意人：">
                  {{ form.warrantyAuditDetail?.auditResultAgreeName }}
                </el-form-item>
                <el-form-item label="审计结果同意时间：">
                  {{ form.warrantyAuditDetail?.auditResultAgreeTime }}
                </el-form-item>
                <el-form-item label="审计说明：" style="width: 100%;">
                  {{ form.warrantyAuditDetail?.auditDesc }}
                </el-form-item>
              </el-form>
              <div class="common-title">申诉信息</div>
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="申诉人：">
                  {{ form.warrantyAuditDetail?.appealerName }}
                </el-form-item>
                <el-form-item label="申诉时间：">
                  {{ form.warrantyAuditDetail?.appealTime }}
                </el-form-item>
                <el-form-item label="申诉处理人：">
                  {{ form.warrantyAuditDetail?.appealHandlerName }}
                </el-form-item>
                <el-form-item label="申诉处理时间：">
                  {{ form.warrantyAuditDetail?.appealHandleTime }}
                </el-form-item>
                <el-form-item label="申诉处理结果：">
                  {{ form.warrantyAuditDetail?.appealResult }}
                </el-form-item>
                <el-form-item label="申诉说明：" style="width: 100%">
                  {{ form.warrantyAuditDetail?.appealDesc }}
                </el-form-item>
                <el-form-item label="申诉处理说明：" style="width: 100%">
                  {{ form.warrantyAuditDetail?.appealHandleDesc }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>审计扣款信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="工时扣款：">
                  {{ form.warrantyAuditDetail?.laborDeduct }}
                </el-form-item>
                <el-form-item label="备件扣款：">
                  {{ form.warrantyAuditDetail?.partDeduct }}
                </el-form-item>
                <el-form-item label="其他扣款：">
                  {{ form.warrantyAuditDetail?.otherDeduct }}
                </el-form-item>
                <el-form-item label="计划扣款总金额：">
                  {{ form.warrantyAuditDetail?.planDeductTotal }}
                </el-form-item>
                <el-form-item label="已扣款总金额：">
                  {{ form.warrantyAuditDetail?.deductedAmount }}
                </el-form-item>
                <el-form-item label="未扣款金额：">
                  {{ form.warrantyAuditDetail?.undeductAmount }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>审计补充材料</h2>
            </div>
            <div class="common-section-body">
              <AisAttachment :businessId="form.warrantyAuditDetail?.id" />
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>原保修单材料</h2>
            </div>
            <div class="common-section-body">
              <AisAttachment :businessId="form.warrantyApply?.id" />
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>审批记录</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="form.warrantyApprovalRecordList" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="approverUserName" title="审批人" min-width="10%" />
                  <vxe-column field="approvalTime" title="审批时间" min-width="10%" />
                  <vxe-column field="approvalResultLabel" title="审批结果" min-width="10%" />
                  <vxe-column field="approvalRemark" title="审批说明" min-width="10%" />
                  <vxe-column field="errorCode" title="错误代码" min-width="10%" />
                  <vxe-column field="errorContent" title="错误内容" min-width="10%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="form.warrantyAuditDetail && form.warrantyAuditDetail.planDeductTotal > 0">
            <div class="common-section-header">
              <h2>追溯明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="form.claimTraceOrderDetailList" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="traceDetailCode" title="追溯明细" min-width="10%" />
                  <vxe-column field="settleCode" title="保修结算单" min-width="10%" />
                  <vxe-column field="currentTraceAmount" title="本次追溯金额(元)" min-width="10%" />
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
    <!-- 补充材料弹窗 -->
    <SupplyMaterialDialog
      :visible.sync="supplyMaterialDialogVisible"
      :selectionItem="formData"
      @update:visible="supplyMaterialDialogVisible = $event"
      @success="loadDetail"
    />
    <!-- 审计通过弹窗 -->
    <AuditPassDialog
      :visible.sync="auditPassDialogVisible"
      :id="_id"
      @update:visible="auditPassDialogVisible = $event"
      @success="loadDetail"
    />
    <!-- 审计驳回弹窗 -->
    <AuditRejectDialog
      :visible.sync="auditRejectDialogVisible"
      :id="_id"
      @update:visible="auditRejectDialogVisible = $event"
      @success="loadDetail"
    />
      <!-- 同意申诉弹窗 -->
    <AgreeAppealDialog
      :visible.sync="agreeAppealDialogVisible"
      :id="_id"
      @update:visible="agreeAppealDialogVisible = $event"
      @success="loadDetail"
    />
    <!-- 拒绝申诉弹窗 -->
    <RejectAppealDialog
      :visible.sync="rejectAppealDialogVisible"
      :id="_id"
      @update:visible="rejectAppealDialogVisible = $event"
      @success="loadDetail"
    />
    <!-- 申诉弹窗 -->
    <AppealDialog
      :visible.sync="appealDialogVisible"
      :selectionItem="formData"
      @update:visible="appealDialogVisible = $event"
      @success="loadDetail"
    />
  </edit-page-layout>
</template>

<script>
import {
  getDetailWithRelated,
  addOrUpdate,
  agree,
  getDecryptField,
} from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import LPEncrypted from '@/libs/components/LPEncrypted';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AuditRejectDialog from './components/AuditRejectDialog.vue';
import AuditPassDialog from './components/AuditPassDialog.vue';
import AgreeAppealDialog from './components/AgreeAppealDialog.vue';
import RejectAppealDialog from './components/RejectAppealDialog.vue';
import AisAttachment from './components/AisAttachment.vue';
import SupplyMaterialDialog from './components/SupplyMaterialDialog.vue';
import AppealDialog from './components/AppealDialog.vue';

const defaultForm = {
  vehicleProfile: {}, // 车辆档案信息
  vehicleProfileOwner: {}, // 车辆档案-车主信息
  warrantyAuditDetail: {}, // 保修审计明细基本信息
  qualityOrderReport: {}, // 质量反馈报告
  warrantyApply: {}, // 保修申请单主信息
  warrantyApprovalRecordList: [], // 保修审核记录列表
  warrantyApplyWorkhours: [], // 保修申请单-工时列表
  warrantyPartList: [], // 保修申请单-备件列表
  warrantyApplyOthers: [], // 保修申请单-其他费用列表
  warrantyAudit: {}, // 审计单信息
  claimTraceOrderDetailList: [], // 索赔追溯单明细
};

export default {
  name: 'warrantyAuditDetailEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    AuditPassDialog,
    AuditRejectDialog,
    AgreeAppealDialog,
    RejectAppealDialog,
    AisAttachment,
    SupplyMaterialDialog,
    AppealDialog,
    LPEncrypted
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修审计明细：' + (this.form.auditDetailCode || '');
    },
    // 错误项 信息
    errorCategoryText () {
      // 1. 安全检查：如果列表为空或不存在，返回空字符串
      if (!this.form?.errorList || this.form.errorList.length === 0) {
        return '';
      }
      // 2. 处理数据：
      // 使用 map 遍历，item 是当前项，index 是索引
      // 返回格式为 "1) 内容" 的新数组
      const list = this.form.errorList.map((item, index) => {
        return `${index + 1}) ${item.errorCategory}`;
      });

      // 3. 拼接字符串：用逗号分隔
      return list.join(', ');
    },
    // 开单预警信息
    remindContent () {
      let result = '';
      let last = false;
      const remindList = this.form.warrantyApply?.spRemindInfo || [];
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
      pageTitle: '保修审计明细',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantyAuditDetail',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      // 弹窗控制
      supplyMaterialDialogVisible: false,
      auditPassDialogVisible: false,
      auditRejectDialogVisible: false,
      appealDialogVisible: false,
      agreeAppealDialogVisible: false,
      rejectAppealDialogVisible: false,
      formData: {}, // 弹窗需要传递的参数
    };
  },
  mounted () {
  },
  methods: {
    getDetailDecryptField () {
      return getDecryptField(this._id, 'vin');
    },
    async detailRequest () {
      const id = this._id;
      if (id) {
        try {
          const res = await getDetailWithRelated(id);
          return res;
        } catch (error) {
          console.error('请求出错:', error);
        }
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    loadDetail () {
      if (this.$refs.containerRef) {
        this.$refs.containerRef.loadDetail();
      }
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 提取的公共方法：构建表单数据
    setCommonFormData () {
      const detail = this.form.warrantyAuditDetail;
      const apply = this.form.warrantyApply;

      return {
        id: detail.id,
        vin: detail.vin,
        repairItemTypeId: apply.repairItemTypeId,
        repairItemTypeName: apply.repairItemTypeName,
        warrantyApplyCode: detail.warrantyApplyCode,
        warrantyApplyId: detail.warrantyApplyId,
        auditDesc: detail.auditDesc,
        errorList: this.form.errorList || [],
      };
    },
    // 补充材料
    handleSupplyMaterial () {
      this.formData = this.setCommonFormData();
      this.supplyMaterialDialogVisible = true;
    },
    // 审计通过
    handleAuditPass () {
      this.auditPassDialogVisible = true;
    },
    // 审计驳回
    handleAuditReject () {
      this.auditRejectDialogVisible = true;
    },
    // 申诉
    handleAppeal () {
      this.formData = this.setCommonFormData();
      this.appealDialogVisible = true;
    },
    // 同意
    handleAgree () {
      this.$confirm('确定同意该审计结果吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agree({ detailId: this._id }).then(() => {
          this.$message.success('操作成功');
          this.loadDetail();
        }).catch(() => {
          this.$message.error('操作失败');
        });
      }).catch(() => {});
    },
    // 同意申诉
    handleAgreeAppeal () {
      this.agreeAppealDialogVisible = true;
    },
    // 拒绝申诉
    handleRejectAppeal () {
      this.rejectAppealDialogVisible = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.form-detail {
  .el-form-item {
    margin-bottom: 12px;
  }
}
.common-title {
  font-size: 14px;
  font-weight: 500;
  color: #0A0E0A;
  margin-bottom: 12px;
}
</style>
