<template>
  <edit-page-layout ref="editLayout" title="预授权申请" showPaneFooter>
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
        :showEditBtn="form.approvalStatus === AUDIT_STATUS.TODO || form.approvalStatus === AUDIT_STATUS.REJECTED || form.approvalStatus === AUDIT_STATUS.EXPIRED"
      >
        <template #status>
          <!-- <span class="status primary" v-if="form.statusDesc">{{ form.statusDesc }}</span> -->
        </template>
        <template #extraButtons>
          <el-button size="small" type="primary" plain @click="handleApprove" v-if="_id && permissions.has('AISMC-preAuth-audit') && form.approvalStatus === AUDIT_STATUS.IN_PROGRESS && !form.isGoodWarranty">审批</el-button>
          <el-button size="small" type="primary" plain @click="handleCancel" v-if="_id && permissions.has('AISMC-preAuth-cancel') && form.approvalStatus === AUDIT_STATUS.REJECTED">作废</el-button>
          <el-button size="small" type="primary" :loading="loading" @click="handleSubmit(1)" v-if="_id && form.approvalStatus === AUDIT_STATUS.TODO || form.approvalStatus === AUDIT_STATUS.REJECTED">提交</el-button>
          <el-button size="small" type="primary" plain @click="handleApprove" v-if="_id && form.approvalStatus === AUDIT_STATUS.REFUSED">激活</el-button>
        </template>
        <template #footer>
          <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleSubmit(0)" :loading="loading">保存</el-button>
          <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleSubmit(1)" :loading="loading">提交</el-button>
        </template>
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="申请单号：">
                  <el-input v-model="form.code" :disabled="true" placeholder="保存后自动生成" />
                </el-form-item>
                <el-form-item label="施工单号：" prop="serviceProxyCode">
                  <fetch-select
                    :remote-method="queryServiceProxy"
                    remote
                    v-model="form.serviceProxyCode"
                    value-key="id"
                    label-key="code"
                    placeholder="请选择施工单"
                    clearable
                    filterable
                    :disabled="!!_id"
                    @change="handleServiceProxyChange"
                  />
                </el-form-item>
                <el-form-item label="预授权类型：" prop="preAuthType">
                  <!-- <el-radio-group v-model="form.preAuthType">
                    <el-radio :label="1">技术预授权</el-radio>
                    <el-radio :label="2">保修预授权</el-radio>
                  </el-radio-group> -->
                <fetch-select
                  :request="fetchOptions"
                  enumCode="PreAuthTypeEnum"
                  v-model="form.preAuthType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-input v-model="form.dealerName" disabled />
                </el-form-item>
                <el-form-item label="门店编码：">
                  <el-input v-model="form.dealerCode" disabled />
                </el-form-item>
                <el-form-item label="门店所属区域：">
                  <el-input v-model="form.dealerUnitName" disabled />
                </el-form-item>
                <el-form-item label="申请原因：" prop="reason" class="form-item-full">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入申请原因，限200字符"
                    v-model="form.reason"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请单号：">
                  <span>{{ form.code || '-' }}</span>
                </el-form-item>
                <el-form-item label="施工单号：">
                  <span>{{ form.serviceProxyCode || '-' }}</span>
                </el-form-item>
                <el-form-item label="预授权类型：">
                  <span>{{ form.preAuthType === 1 ? '技术预授权' : form.preAuthType === 2 ? '保修预授权' : '-' }}</span>
                </el-form-item>
                <el-form-item label="门店名称：">
                  <span>{{ form.dealerName || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店编码：">
                  <span>{{ form.dealerCode || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店所属区域：">
                  <span>{{ form.dealerUnitName || '-' }}</span>
                </el-form-item>
                <el-form-item label="申请原因：">
                  <span>{{ form.reason || '-' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 车辆信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>车辆信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="车主姓名：">
                  <span>{{ serviceProxyDetail?.customerName || form.serviceProxyResp.customerName || '-' }}</span>
                </el-form-item>
                <el-form-item label="送修人：">
                  <span>{{ serviceProxyDetail?.shuttleName || form.serviceProxyResp.shuttleName || '-' }}</span>
                </el-form-item>
                <el-form-item label="送修人手机：">
                  <span>{{ serviceProxyDetail?.shuttlePhone || form.serviceProxyResp.shuttlePhone || '-' }}</span>
                </el-form-item>
                <el-form-item label="VIN：">
                  <span>{{ preAuthInfoDetail?.vehProfileVin || form.vehProfileVin  || '-' }}</span>
                </el-form-item>
                <el-form-item label="车型：">
                  <span>{{ serviceProxyDetail?.vehModelName || form.serviceProxyResp.vehModelName || '-' }}</span>
                </el-form-item>
                <el-form-item label="车牌号：">
                  <span>{{ serviceProxyDetail?.carPlate || form.serviceProxyResp.carPlate || '-' }}</span>
                </el-form-item>
                <el-form-item label="车辆用途：">
                  <span>{{ preAuthInfoDetail.carPropertyLabel || form.carPropertyLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="进店里程数：">
                  <span>{{ serviceProxyDetail?.mileage || form.serviceProxyResp.mileage || '-' }}</span>
                </el-form-item>
                <el-form-item label="生产日期：">
                  <span>{{ formatDate(preAuthInfoDetail?.productionTime || form.productionTime) }}</span>
                </el-form-item>
                <el-form-item label="终身免保：">
                  <span>{{ preAuthInfoDetail?.warrantyLifeLabel || form.warrantyLifeLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="终身质保：">
                  <span>{{ preAuthInfoDetail?.isLifetimeLabel || form.isLifetimeLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="保修开始日期：">
                  <span>{{ formatDate(preAuthInfoDetail?.guaranteeStartDate || form.guaranteeStartDate) }}</span>
                </el-form-item>
                <el-form-item label="保修结束日期：">
                  <span>{{ formatDate(preAuthInfoDetail?.warrantyEndTime || form.warrantyEndTime) }}</span>
                </el-form-item>
                <el-form-item label="服务月份：">
                  <span>{{ preAuthInfoDetail?.serviceMonth || form.serviceMonth || '-' }}</span>
                </el-form-item>
                <el-form-item label="三包预警：">
                  <span>{{ preAuthInfoDetail?.alarmLevelLabel ||form.alarmLevelLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="预警信息：">
                  <span>{{ preAuthInfoDetail?.alarmInfo || form.alarmInfo || '-' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 质量反馈信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>质量反馈信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="质量反馈单号：" prop="qualityOrderReportId">
                  <fetch-select
                    :remote-method="queryQualityReport"
                    remote
                    v-model="form.qualityOrderReportId"
                    :params="form.qualityOrderReport"
                    value-key="id"
                    label-key="code"
                    subLabelKey="title"
                    placeholder="请选择质量反馈单"
                    clearable
                    filterable
                    @change="handleQualityReportChange"
                  />
                </el-form-item>
                <el-form-item label="故障现象描述：">
                  <el-input
                    type="text"
                    placeholder="故障现象描述"
                    v-model="form.faultInfo"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="故障排查流程：">
                  <el-input
                    type="text"
                    placeholder="故障排查流程"
                    v-model="form.troubleshootingProcess"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="质量反馈单号：">
                  <span>{{ form.qualityOrderReport || '-' }}</span>
                </el-form-item>
                <el-form-item label="故障现象描述：">
                  <span>{{ form?.qualityOrderReportResp?.customerContent || '-' }}</span>
                </el-form-item>
                <el-form-item label="故障排查流程：">
                  <span>{{ form?.qualityOrderReportResp?.troubleshootingProcess || '-' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 费用信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>费用信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <el-form :inline="true" class="form-detail">
                  <el-form-item label="工时索赔合计：">
                    <span>{{ serviceProxyDetail?.claimItemAmount || form.serviceProxyResp?.claimItemAmount || '-' }}</span>
                  </el-form-item>
                  <el-form-item label="零件索赔合计：">
                    <span>{{ serviceProxyDetail?.claimPartsAmount || form.serviceProxyResp?.claimPartsAmount || '-' }}</span>
                  </el-form-item>
                  <el-form-item label="其他索赔费用：">
                    <span>{{ serviceProxyDetail?.claimOtherAmount || form.serviceProxyResp?.claimOtherAmount || '-' }}</span>
                  </el-form-item>
                </el-form>
                <vxe-table
                  ref="repairTableRef"
                  stripe
                  :data="serviceProxyDetail?.costCountResp?.repairItemRespList || serviceProxyDetail?.spRepairItemResps || []"
                  show-overflow
                  :row-config="{ isHover: true }"
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="500px"
                >
                  <vxe-column field="repairItemCode" title="维修项目代码" width="200px">
                    <template #default="{ row }">
                      <el-link type="success" :href="`/service/maintain/basic/repairItem/edit?id=${row.repairItemId}`" target="_blank">{{ row.repairItemCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="repairItemName" title="维修项目名称" min-width="150" />

                  <vxe-column field="checkoutTypeName" title="结算类型" min-width="100" />
                  <vxe-column field="warrantyTypeName" title="保修类型" min-width="100" />
                  <vxe-column field="isAddItems" title="是否增项" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.isAddItems === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="price" title="工时单价" min-width="100" />
                  <vxe-column field="workHour" title="工时数" min-width="80" />
                  <vxe-column field="discountAmount" title="优惠金额" min-width="100" />
                  <vxe-column field="discountRate" title="折扣率" min-width="80" />
                  <vxe-column field="repairAmount" title="项目金额" min-width="100" />
                  <vxe-column field="packageCode" title="套餐代码" min-width="120" />
                  <vxe-column field="createTime" title="创建时间" min-width="160" sortable />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
              </div>
              <div class="common-section-table" style="margin-top: 20px;">
                <vxe-table
                  ref="partsTableRef"
                  stripe
                  :data="form.spSparePartResps || serviceProxyDetail?.costCountResp?.sparePartRespList || []"
                  show-overflow
                  :row-config="{ isHover: true }"
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="500px"
                >
                  <vxe-column field="partsCode" title="零件代码" width="200px" >
                    <template #default="{ row }">
                      <el-link type="success" :href="`/service/sparepart/basic/sparePart/edit?id=${row.partsId}`" target="_blank">{{ row.partsCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="partsName" title="零件名称" min-width="150" />
                  <vxe-column field="repairItemTypeName" title="维修类型" min-width="100" />
                  <vxe-column field="isOutstock" title="是否出库" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.isOutstock === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="checkoutTypeName" title="结算类型" min-width="100" />
                  <vxe-column field="warrantyTypeName" title="保修类型" min-width="100" />
                  <vxe-column field="isAddItems" title="是否增项" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.isAddItems === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="isOemPart" title="是否原厂" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.isOemPart === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="quantity" title="数量" min-width="80" />
                  <vxe-column field="price" title="单价" min-width="100" />
                  <vxe-column field="discountAmount" title="优惠金额" min-width="100" />
                  <vxe-column field="discountRate" title="折扣率" min-width="80" />
                  <vxe-column field="partsAmount" title="配件金额" min-width="100" />
                  <vxe-column field="isBindItem" title="是否与工时组合" min-width="120">
                    <template #default="{ row }">
                      <span>{{ row.isBindItem === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="repairItemCode" title="维修项目代码" min-width="120" />
                  <vxe-column field="repairItemName" title="维修项目名称" min-width="150" />
                  <vxe-column field="packageCode" title="套餐代码" min-width="120" />
                  <vxe-column field="packageName" title="套餐名称" min-width="120" />
                  <vxe-column field="createTime" title="创建时间" min-width="160" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>

          <!-- 审批信息 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body" >
              <el-form :inline="true" class="form-detail" v-show="form.isGoodWarranty">
                <el-form-item label="审批单号：">
                  <span>{{ form.auditNo || '-' }}</span>
                </el-form-item>
                <el-form-item label="同意工时索赔小计：">
                  <span>{{ form.approvedLaborClaimTotal || '-' }}</span>
                </el-form-item>
                <el-form-item label="工时分担比例：">
                  <span>{{ form.laborCostRatio || '-' }}</span>
                </el-form-item>
                <el-form-item label="同意零件索赔小计：">
                  <span>{{ form.approvedPartsClaimTotal || '-' }}</span>
                </el-form-item>
                <el-form-item label="零件分担比例：">
                  <span>{{ form.partsCostRatio || '-' }}</span>
                </el-form-item>
                <el-form-item label="同意其他索赔小计：">
                  <span>{{ form.approvedOtherClaimTotal || '-' }}</span>
                </el-form-item>
                <el-form-item label="其他分担比例：">
                  <span>{{ form.otherCostSharingRatio || '-' }}</span>
                </el-form-item>
              </el-form>

              <!-- 审批流程表格 -->
              <div class="common-section-table">
                <vxe-table
                  ref="approvalTableRef"
                  stripe
                  :data="form.supportApprovalResps || []"
                  show-overflow
                  :row-config="{ isHover: true }"
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="500px"
                >
                  <vxe-column field="approver" title="执行人" min-width="120" />
                  <vxe-column field="approvalOn" title="执行时间" min-width="160" />
                  <vxe-column field="approvalResult" title="审批结果" min-width="120" />
                  <vxe-column field="content" title="审批意见" min-width="150" />
                  <vxe-column field="remark" title="错误代码及内容" min-width="120" />
                  <vxe-column title="附件信息" min-width="200">
                    <template #default="{ row }">
                      <div class="approval-attachments">
                        <!-- 加载中状态 -->
                        <div v-if="attachmentLoadingMap[row.id]" class="attachment-loading">
                          <i class="el-icon-loading"></i>
                          <span>加载中...</span>
                        </div>

                        <!-- 加载失败状态 -->
                        <div v-else-if="attachmentErrorMap[row.id]" class="attachment-error">
                          <span>加载失败</span>
                          <i class="el-icon-refresh" @click="loadRowFiles(row.id)" style="cursor: pointer; margin-left: 4px;"></i>
                        </div>

                        <!-- 无附件状态 -->
                        <div v-else-if="!approvalAttachmentsMap[row.id] || approvalAttachmentsMap[row.id].length === 0" class="attachment-empty">
                          <span>{{ '-' }}</span>
                        </div>

                        <!-- 附件数量 <= 3: 直接展示缩略图 -->
                        <div v-else-if="approvalAttachmentsMap[row.id].length <= attachmentConfig.maxDisplay" class="attachment-list">
                          <div
                            v-for="file in approvalAttachmentsMap[row.id]"
                            :key="file.id"
                            class="table-attachment-item"
                            @click="handleAttachmentClick(file)"
                          >
                            <!-- 文件图标 -->
                            <img
                              :src="getFileIconPath(file)"
                              class="attachment-icon"
                              :alt="file.name"
                            />

                            <!-- 文件名提示 -->
                            <el-tooltip :content="file.name" placement="top" :open-delay="500">
                              <div class="attachment-name-overlay"></div>
                            </el-tooltip>
                          </div>
                        </div>

                        <!-- 附件数量 > 3: 展示前2个缩略图 + 更多下拉菜单 -->
                        <div v-else class="attachment-list">
                          <!-- 前2个附件缩略图 -->
                          <div
                            v-for="file in approvalAttachmentsMap[row.id].slice(0, attachmentConfig.maxDisplay)"
                            :key="file.id"
                            class="table-attachment-item"
                            @click="handleAttachmentClick(file)"
                          >
                            <!-- 文件图标 -->
                            <img
                              :src="getFileIconPath(file)"
                              class="attachment-icon"
                              :alt="file.name"
                            />

                            <!-- 文件名提示 -->
                            <el-tooltip :content="file.name" placement="top" :open-delay="500">
                              <div class="attachment-name-overlay"></div>
                            </el-tooltip>
                          </div>

                          <!-- 更多下拉菜单按钮 -->
                          <el-dropdown placement="bottom" class="attachment-dropdown">
                            <div class="attachment-dropdown-trigger">
                              <span class="attachment-more-text">更多</span>
                              <i class="el-icon-arrow-down"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown" class="attachment-dropdown-menu">
                              <el-dropdown-item
                                v-for="file in approvalAttachmentsMap[row.id].slice(attachmentConfig.maxDisplay)"
                                :key="file.id"
                                class="attachment-dropdown-item"
                                @click.native="handleAttachmentClick(file)"
                              >
                                <span class="dropdown-file-name" :title="file.name">{{ file.name }}</span>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                      </div>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>

          <!-- 附件信息 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件信息</h2>
            </div>
            <div class="common-section-body">
              <Attachment :_id="_id" :attachType="'mcs_preauth'" ref="attachmentRef"/>
            </div>
          </section>
        </el-main>
      </edit-base-container>
      <!-- 审核对话框 -->
      <PreAuthAuditDialog
        ref="auditDialog"
        :visible.sync="auditDialogVisible"
        :business-id="_id"
        :info="form"
        @success="$refs.containerRef.loadDetail()"
      />
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getServiceProxyDetail, cancelItem, getPreAuthInfo, checkPreAuth } from '@/api/maintain/sp/preAuth/index';
import { getList as getQualityReportList } from '@/api/maintain/sp/qualityOrderReport/index';
import { selectServiceProxy as selectServiceProxyApi, getEnum } from '@/api/maintain/sp/serviceProxy/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import Attachment from './components/FileUploadGrid';
import PreAuthAuditDialog from './components/AuditDialog/index.vue';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { AUDIT_STATUS } from './constant.js';
import { getFileList } from '@/libs/api/attachment';
import { isFileType } from '@/libs/utils/file.js';

const defaultForm = {
  code: '',
  serviceProxyId: '',
  serviceProxyCode: '',
  preAuthType: '',
  dealerName: '',
  dealerCode: '',
  dealerUnitName: '',
  reason: '',
  // 车辆信息
  ownerName: '',
  senderName: '',
  senderPhone: '',
  vehProfileVin: '',
  vehicleModel: '',
  licensePlateNo: '',
  carPropertyLabel: '',
  mileage: '',
  productionTime: '',
  carPropertyStrLabel: '',
  warrantyLifeLabel: '',
  isLifetimeLabel: '',
  guaranteeStartDate: '',
  warrantyEndTime: '',
  serviceMonth: '',
  alarmLevelLabel: '',
  alarmInfo: '',
  // 质量反馈
  qualityOrderReportId: '',
  qualityOrderReport: '',
  faultInfo: '',
  troubleshootingProcess: '',
  // 状态信息
  statusDesc: '',
  approver: '',
  approvalOn: '',
  modifierName: '',
  updateTime: '',
  creatorName: '',
  createTime: '',
  // 审批相关
  approvalContent: '',
  approvalStatus: '',
  approverId: '',
  subDateTime: '',
  subUser: '',
  approvedLaborClaimTotal: '',
  approvedOtherClaimTotal: '',
  approvedPartsClaimTotal: '',
  auditNo: '',
  laborCostRatio: '',
  otherCostSharingRatio: '',
  partsCostRatio: '',
  applyReject: '',
  applyRejectStatus: '',
  approvalSource: '',
  carProperty: '',
  rejectReason: '',
  rejectTime: '',
  warrantyLife: '',
  isGoodWarranty: '',
  serviceProxyResp: {}
};

export default {
  name: 'preAuthEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
    Attachment,
    PreAuthAuditDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '申请单号：' + (this.form.code || '新增');
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
    return {
      pageTitle: '预授权申请',
      pageType: 'edit',
      moduleKey: 'AISMC-preAuth',
      AUDIT_STATUS,
      loading: false,
      submitLoading: false,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      emptyText: '暂无数据',
      serviceProxyDetail: {}, // 施工单详情数据（仅用于展示）
      preAuthInfoDetail: {},
      // 审批记录附件映射 Map<approvalId, files[]>
      approvalAttachmentsMap: {},
      // 附件加载状态 Map<approvalId, boolean>
      attachmentLoadingMap: {},
      // 附件加载错误 Map<approvalId, error>
      attachmentErrorMap: {},
      // 附件配置
      attachmentConfig: {
        maxDisplay: 3, // 最大显示数量
        preloadCount: 20 // 预加载数量
      },
      // 审核对话框
      auditDialogVisible: false,
      rules: {
        serviceProxyId: [
          { required: true, message: '请选择施工单', trigger: 'change' }
        ],
        preAuthType: [
          { required: true, message: '请选择预授权类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' },
          { max: 200, message: '申请原因不能超过200字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    /**
     * 格式化日期为 yyyy-MM-dd 格式
     * @param {string|number|Date} date - 日期值
     * @returns {string} 格式化后的日期字符串
     */
    formatDate (date) {
      if (!date) return '-';
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('日期格式化失败:', error);
        return '-';
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return new Promise((resolve, reject) => {
          getDetail(id).then(res => {
            // 直接保存预授权详情数据（包含费用信息和审批信息）
            this.serviceProxyDetail = res;
            // 将审批相关数据合并到form中（用于提交）
            Object.assign(this.form, res);
            // 预加载前5条审批记录的附件
            this.$nextTick(() => {
              this.batchLoadAttachments();
            });
            resolve(res);
          }).catch((res) => {
            reject(res);
          });
        });
      }
    },
    /**
     * 加载单个审批记录的附件
     * @param {string|number} approvalId - 审批记录ID
     */
    async loadRowFiles (approvalId) {
      // 防重复加载
      if (this.approvalAttachmentsMap[approvalId] ||
          this.attachmentLoadingMap[approvalId]) {
        return;
      }

      this.$set(this.attachmentLoadingMap, approvalId, true);
      this.$set(this.attachmentErrorMap, approvalId, null);

      try {
        const response = await getFileList({
          businessId: approvalId,
          // attachType: this.attachmentConfig.attachType
        });

        const files = (response || []).map(file => ({
          id: file.id,
          name: file.fileName,
          url: file.fileUrl,
          size: file.fileSize,
          fileType: file.fileType,
          isImage: isFileType(file, 'image'),
          isVideo: isFileType(file, 'video'),
          isPdf: isFileType(file, 'pdf'),
          isExcel: isFileType(file, 'excel'),
          isWord: isFileType(file, 'word'),
          isPPT: isFileType(file, 'ppt'),
          isText: isFileType(file, 'text'),
          isZip: isFileType(file, 'zip'),
          isRar: isFileType(file, 'rar')
        }));

        this.$set(this.approvalAttachmentsMap, approvalId, files);
      } catch (error) {
        console.error(`加载审批记录${approvalId}的附件失败:`, error);
        this.$set(this.attachmentErrorMap, approvalId, error);
      } finally {
        this.$set(this.attachmentLoadingMap, approvalId, false);
      }
    },
    /**
     * 批量预加载审批附件(用于页面初始化)
     */
    async batchLoadAttachments () {
      const auditList = this.form.supportApprovalResps || [];
      const preloadList = auditList.slice(0, this.attachmentConfig.preloadCount);

      const promises = preloadList.filter(item => item.status === 20 || item.status === 40).map(item =>
        this.loadRowFiles(item.id).catch(err => {
          console.warn(`预加载审批记录${item.id}附件失败:`, err);
        })
      );

      await Promise.allSettled(promises);
    },
    getFileIconPath (file) {
      if (file.isImage) return file.url;
      if (file.isPdf) return require('@/libs/components/AisAttachment/icon/pdf.png');
      if (file.isExcel) return require('@/libs/components/AisAttachment/icon/xls.png');
      if (file.isWord) return require('@/libs/components/AisAttachment/icon/word.png');
      if (file.isPpt) return require('@/libs/components/AisAttachment/icon/ppt.png');
      if (file.isVideo) return require('@/libs/components/AisAttachment/icon/video.png');
      if (file.isZip) return require('@/libs/components/AisAttachment/icon/zip.png');
      return require('@/libs/components/AisAttachment/icon/text.png');
    },
    /**
     * 处理附件点击事件
     */
    handleAttachmentClick (file) {
      // 所有文件都在新窗口打开
      if (file.url) {
        window.open(file.url, '_blank');
      }
    },
    submitRequest (v = 0) {
      // 表单校验
      return addOrUpdate({
        id: this._id,
        saveOrSubmit: v,
        reason: this.form.reason,
        serviceProxyId: this.form.serviceProxyId,
        serviceProxyCode: this.form.serviceProxyCode,
        preAuthType: this.form.preAuthType,
        qualityOrderReportId: this.form.qualityOrderReportId,
        qualityOrderReport: this.form.qualityOrderReport,
      });
    },
    handleSubmit (v = 0) {
      addOrUpdate({
        id: this._id,
        saveOrSubmit: v,
        reason: this.form.reason,
        serviceProxyId: this.form.serviceProxyId,
        serviceProxyCode: this.form.serviceProxyCode,
        preAuthType: this.form.preAuthType,
        qualityOrderReportId: this.form.qualityOrderReportId,
        qualityOrderReport: this.form.qualityOrderReport,
      }).then(res => {
        this.$message.success(v === 0 ? '保存成功' : '提交审批成功');
        if (!this._id) {
          this.$router.replace({
            path: '/maintain/sp/preAuth/edit',
            query: { id: res }
          });
        } else {
          this.$refs.containerRef.loadDetail();
        }
      });
    },
    handleShowLog () {
      this.$auditLog.show({ id: this._id });
    },
    async queryServiceProxy (queryString) {
      if (!queryString) {
        return;
      }
      return new Promise(resolve => {
        selectServiceProxyApi({ code: queryString, pageSize: 20, pageNum: 1 }).then(res => {
          const list = res || [];
          resolve(list);
        }).catch(() => {
          resolve([]);
        });
      });
    },
    async queryQualityReport (queryString) {
      return new Promise(resolve => {
        if (!queryString) {
          resolve([]);
          return;
        }
        // 调用质量反馈单分页查询接口
        getQualityReportList({
          codeLike: queryString,
          vehProfileVin: this.form.vehProfileVin,
          orderStatus: 30,
          pageSize: 20,
          pageNum: 1
        }).then(res => {
          const list = (res?.records || []).map(item => {
            return {
              ...item,
              displayName: item.reportTypeLabel + '：' + item.cccName
            };
          });
          resolve(list);
        }).catch(() => {
          resolve([]);
        });
      });
    },
    handleServiceProxyChange (val, record) {
      if (!record || !record.id) {
        return;
      }

      // 填充施工单基础信息到form（用于提交）
      this.form.serviceProxyCode = record.code;
      this.form.serviceProxyId = record.id;

      // 如果是新增模式，根据施工单ID获取详细信息
      if (!this._id && record.id) {
        checkPreAuth(record.id).then(res => {
          if (!res.needPreAuth) {
            this.$message.error('该施工单无需预授权');
          } else {
            this.form.preAuthType = res.preAuthType;
            getServiceProxyDetail(record.id).then(detailRes => {
              if (detailRes) {
                // 直接保存接口返回的数据，用于展示
                this.serviceProxyDetail = detailRes;
                Object.assign(this.form, detailRes);
                // 设置预授权类型（如果有）
                if (detailRes.preAuthType) {
                  this.form.preAuthType = detailRes.preAuthType;
                }
              }
            }).catch(error => {
              console.error('获取施工单详情失败:', error);
            });
            getPreAuthInfo(record.id).then(preAuthInfo => {
              if (preAuthInfo) {
                // 直接保存接口返回的数据，用于展示
                this.preAuthInfoDetail = preAuthInfo;
                Object.assign(this.form, preAuthInfo);
              }
            }).catch(error => {
              console.error('获取施工单详情失败:', error);
            });
          }
        }).catch(error => {
          console.error('预授权检查失败:', error);
        });
      }
    },
    handleQualityReportChange (val, record) {
      if (!record) {
        // 清空选择时，同时清空反显的值
        this.form.qualityOrderReportId = '';
        this.form.qualityOrderReport = '';
        this.form.faultInfo = '';
        this.form.troubleshootingProcess = '';
        return;
      }
      // 关联质量反馈信息
      this.form.qualityOrderReportId = record.id || '';
      this.form.qualityOrderReport = record.code || '';
      // 反显字段：故障现象描述（customerContent）、故障检查过程（diagnosisContent）、故障排查流程（troubleshootingProcess）
      this.form.faultInfo = record.customerContent || '';
      this.form.troubleshootingProcess = record.diagnosisContent || record.troubleshootingProcess || '';
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    /**
     * 审批操作
     */
    handleApprove () {
      this.auditDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.auditDialog?.loadData?.();
      });
    },
    /**
     * 作废操作
     */
    handleCancel () {
      this.$confirm('确定要作废该记录吗?', '作废确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelItem(this._id).then(() => {
          this.$message.success('作废成功');
          this.$refs.containerRef.loadDetail();
        }).catch(() => {
          this.$message.error('作废失败');
        });
      }).catch(() => {
        // 用户取消操作
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.approval-attachments {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 4px 0;

  .attachment-loading,
  .attachment-error,
  .attachment-empty {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #999;
    font-size: 12px;
  }

  .attachment-error {
    color: #F56C6C;
  }

  // 直接展示附件列表 (<=3个)
  .attachment-list {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;

    .table-attachment-item {
      position: relative;
      width: 32px;
      height: 32px;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;

      .attachment-icon {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border: 1px solid #E6E6E5;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
          border-color: var(--leap-color-primary);
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }

      .attachment-name-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  // 下拉菜单展示附件列表 (>3个)
  .attachment-dropdown {
    .attachment-more-text {
      color: var(--leap-color-link);
      cursor: pointer;
    }
  }
}
</style>
