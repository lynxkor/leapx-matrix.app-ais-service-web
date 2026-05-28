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
        :showEditBtn="detailButtons.includes('编辑')"
      >
        <template #extraButtons>
          <el-button v-if="detailButtons.includes('发布')" size="small" type="primary" @click="handlePublish">发布</el-button>
          <el-button v-if="detailButtons.includes('签署总结')" size="small" @click="handleSignSummary">签署总结</el-button>
          <el-button v-if="detailButtons.includes('同意总结')" size="small" @click="handleAgreeSummary">同意总结</el-button>
          <el-button v-if="detailButtons.includes('驳回总结')" size="small" @click="handleRejectSummary">驳回总结</el-button>
          <el-button v-if="detailButtons.includes('签署整改')" size="small" @click="handleSignRectify">签署整改</el-button>
          <el-button v-if="detailButtons.includes('同意整改')" size="small" @click="handleAgreeRectify">同意整改</el-button>
          <el-button v-if="detailButtons.includes('驳回整改')" size="small" @click="handleRejectRectify">驳回整改</el-button>
          <el-button v-if="detailButtons.includes('重新生成待签署总结报告')" size="small" @click="handleRegenerateUnsignedSummary">重新生成待签署总结报告</el-button>
          <el-button v-if="detailButtons.includes('上传待签署总结报告')" size="small" @click="handleUploadUnsignedSummary">上传待签署总结报告</el-button>
          <el-button v-if="detailButtons.includes('重新生成待签署整改报告')" size="small" @click="handleRegenerateUnsignedRectify">重新生成待签署整改报告</el-button>
          <el-button v-if="detailButtons.includes('上传待签署整改报告')" size="small" @click="handleUploadUnsignedRectify">上传待签署整改报告</el-button>
        </template>
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id" :disabled="![AUDIT_STATUS.DRAFT].includes(form.auditStatus)">
                <el-form-item label="保修审计单号：" prop="auditCode">
                  <el-input v-model="form.auditCode" disabled placeholder="系统自动生成" />
                </el-form-item>
                <el-form-item label="审计类型：" prop="auditType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="warranty_audit_type"
                    v-model="form.auditType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="审计单状态：" prop="auditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="warranty_audit_status"
                    v-model="form.auditStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="保修审计主题：" prop="auditTheme">
                  <el-input v-model="form.auditTheme" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="审计开始日期：" prop="auditStartDate">
                  <el-date-picker
                    v-model="form.auditStartDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="提交截止日期：">
                  <el-input v-model="form.submitDeadline" disabled />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <dealer-select ref="dealerSelectRef" v-model="form.dealerCode" :disabled="isDraftWithDetails" @change="handleDealerChange" />
                </el-form-item>
                <el-form-item label="审计专员1：" prop="auditor1Id">
                  <div class="form-item-sign">
                    <fetch-select
                      v-model="form.auditor1Name"
                      :remote-method="searchUser"
                      value-key="userId"
                      label-key="username"
                      filterable
                      remote
                      clearable
                      reserve-keyword
                      placeholder="请选择审计专员1"
                      @change="(val, record) => handleAuditor1Change(val, record)"
                    />
                    <AisAttachment
                      ref="auditor1SignRef"
                      :businessId="_id"
                      attachType="审计专员1签名"
                      :show-pagination="false"
                      :noEcho="true"
                      :uploadConfig="signUploadConfig"
                      :buttonText="sign1Label"
                      :showFilelist="false"
                      @addParam="data => handleUpdate(data, 'auditor1Sign')"
                    />
                  </div>
                </el-form-item>
                <!-- <el-form-item label="审计专员1签名：" prop="auditor1Sign">
                  <el-input v-model="form.auditor1Sign" clearable placeholder="请输入" />
                </el-form-item> -->
                <el-form-item label="计划扣款金额：">
                  <el-input v-model="form.planDeductAmount" disabled />
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-input v-model="form.dealerName" disabled />
                </el-form-item>
                <el-form-item label="审计专员2：" prop="auditor2Id">
                  <div class="form-item-sign">
                    <fetch-select
                      v-model="form.auditor2Name"
                      :remote-method="searchUser"
                      value-key="userId"
                      label-key="username"
                      filterable
                      remote
                      clearable
                      reserve-keyword
                      placeholder="请选择审计专员2"
                      @change="(val, record) => handleAuditor2Change(val, record)"
                    />
                    <AisAttachment
                      ref="auditor2SignRef"
                      :businessId="_id"
                      attachType="审计专员2签名"
                      :show-pagination="false"
                      :noEcho="true"
                      :uploadConfig="signUploadConfig"
                      :buttonText="sign2Label"
                      :showFilelist="false"
                      @addParam="data => handleUpdate(data, 'auditor2Sign')"
                    />
                  </div>
                </el-form-item>
                <!-- <el-form-item label="审计专员2签名：" prop="auditor2Sign">
                  <el-input v-model="form.auditor2Sign" clearable placeholder="请输入" />
                </el-form-item> -->
                <el-form-item label="已扣款金额：">
                  <el-input v-model="form.deductedAmount" disabled />
                </el-form-item>
                <el-form-item label="保修审批开始日期：" prop="warrantyApprovalStartDate">
                  <el-date-picker
                    v-model="form.warrantyApprovalStartDate"
                    :disabled="isDraftWithDetails"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="approvalStartPickerOptions"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="计划审计数量：" prop="planAuditCount">
                  <el-input-number size="small" v-model="form.planAuditCount" :min="1" :precision="0" controls-position="right" :disabled="isDraftWithDetails" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="未扣款金额：">
                  <el-input v-model="form.undeductAmount" disabled />
                </el-form-item>
                <el-form-item label="保修审批结束日期：" prop="warrantyApprovalEndDate">
                  <el-date-picker
                    v-model="form.warrantyApprovalEndDate"
                    :disabled="isDraftWithDetails"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="approvalEndPickerOptions"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="实际审计数量：" prop="actualAuditCount">
                  <el-input-number size="small" v-model="form.actualAuditCount" :min="0" :precision="0" controls-position="right" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="保修审批区间金额：">
                  <el-input v-model="form.warrantyApprovalAmount" disabled />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="form.remark" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="审计明细总金额：">
                  <el-input v-model="form.auditDetailTotalAmount" disabled />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="保修审计单号：">{{ form.auditCode }}</el-form-item>
                <el-form-item label="审计类型：">{{ form.auditTypeLabel || form.auditType }}</el-form-item>
                <el-form-item label="审计单状态：">{{ form.auditStatusLabel || form.auditStatus }}</el-form-item>
                <el-form-item label="保修审计主题：">{{ form.auditTheme }}</el-form-item>
                <el-form-item label="审计开始日期：">{{ form.auditStartDate }}</el-form-item>
                <el-form-item label="提交截止日期：">{{ form.submitDeadline }}</el-form-item>
                <el-form-item label="门店编码：">
                  <el-link
                    v-if="form.dealerCode"
                    type="primary"
                    :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.dealerCode}`"
                    target="_blank"
                  >{{ form.dealerCode }}</el-link>
                  <span v-else>{{ form.dealerCode }}</span>
                </el-form-item>
                <el-form-item label="审计专员1：">{{ form.auditor1Name }}</el-form-item>
                <!-- <el-form-item label="审计专员1签名：">{{ form.auditor1Sign }}</el-form-item> -->
                <el-form-item label="计划扣款金额：">{{ form.planDeductAmount }}</el-form-item>
                <el-form-item label="门店名称：">
                  <el-link
                    v-if="form.dealerCode"
                    type="primary"
                    :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.dealerCode}`"
                    target="_blank"
                  >{{ form.dealerName }}</el-link>
                  <span v-else>{{ form.dealerName }}</span>
                </el-form-item>
                <el-form-item label="审计专员2：">{{ form.auditor2Name }}</el-form-item>
                <!-- <el-form-item label="审计专员2签名：">{{ form.auditor2Sign }}</el-form-item> -->
                <el-form-item label="已扣款金额：">{{ form.deductedAmount }}</el-form-item>
                <el-form-item label="保修审批开始日期：">{{ form.warrantyApprovalStartDate }}</el-form-item>
                <el-form-item label="计划审计数量：">{{ form.planAuditCount }}</el-form-item>
                <el-form-item label="未扣款金额：">{{ form.undeductAmount }}</el-form-item>
                <el-form-item label="保修审批结束日期：">{{ form.warrantyApprovalEndDate }}</el-form-item>
                <el-form-item label="实际审计数量：">{{ form.actualAuditCount }}</el-form-item>
                <el-form-item label="保修审批区间金额：">{{ form.warrantyApprovalAmount }}</el-form-item>
                <el-form-item label="备注：">{{ form.remark }}</el-form-item>
                <el-form-item label="审计明细总金额：">{{ form.auditDetailTotalAmount }}</el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 门店人员信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>门店人员信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="法人：" prop="legalPerson">
                  <el-input v-model="form.legalPerson" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="服务店长：" prop="serviceManager">
                  <el-input v-model="form.serviceManager" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="保修经理：" prop="warrantyManager">
                  <el-input v-model="form.warrantyManager" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="投资人：" prop="investor">
                  <el-input v-model="form.investor" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="配件经理：" prop="partsManager">
                  <el-input v-model="form.partsManager" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="技术经理：" prop="techManager">
                  <el-input v-model="form.techManager" clearable placeholder="请输入" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="法人：">{{ form.legalPerson }}</el-form-item>
                <el-form-item label="服务店长：">{{ form.serviceManager }}</el-form-item>
                <el-form-item label="保修经理：">{{ form.warrantyManager }}</el-form-item>
                <el-form-item label="投资人：">{{ form.investor }}</el-form-item>
                <el-form-item label="配件经理：">{{ form.partsManager }}</el-form-item>
                <el-form-item label="技术经理：">{{ form.techManager }}</el-form-item>
              </el-form>
            </div>
          </section>
          <search-add-table
            v-if="_id"
            :_id="_id"
            :canAddOrUpdate="canAddOrUpdate && form.auditStatus === AUDIT_STATUS.DRAFT"
            :canImport="canAddOrUpdate && form.auditStatus === AUDIT_STATUS.DRAFT"
            :formData="form"
            @data-change="() => {}"
            @checkboxChange="checkboxChange"
            @refresh="handleRefresh"
          />
          <!-- 总结报告 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>总结报告
                <el-button type="text" class="download-link" @click="handleDownloadUnsignedSummary" v-if="form.summarySignTime">下载未签署总结报告</el-button>
              </h2>
            </div>
            <div class="common-section-body">
              <div class="report-section">
                <div class="report-attachment">
                  <AisAttachment
                    v-if="_id"
                    :businessId="_id"
                    configCode="warrantyAudit"
                    attachType="已签署总结报告"
                    :show-pagination="false"
                    :uploadConfig="uploadConfig"
                    title="已签署总结报告"
                    type="card"
                    readonly
                  />
                </div>
                <div class="report-info">
                  <el-form :inline="true" class="form-detail">
                    <el-form-item label="总结签署人：">{{ form.summarySignerName || '--' }}</el-form-item>
                    <el-form-item label="总结签署时间：">{{ form.summarySignTime || '--' }}</el-form-item>
                    <el-form-item label="总结签署说明：">{{ form.summarySignDesc || '--' }}</el-form-item>
                    <el-form-item label="总结审批人：">{{ form.summaryApproverName || '--' }}</el-form-item>
                    <el-form-item label="总结审批时间：">{{ form.summaryApproveTime || '--' }}</el-form-item>
                    <el-form-item label="总结审批说明：">{{ form.summaryApproveDesc || '--' }}</el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </section>
          <!-- 整改报告 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>整改报告<el-button type="text" class="download-link" @click="handleDownloadUnsignedRectify" v-if="form.rectifySignTime">下载未签署整改报告</el-button></h2>
            </div>
            <div class="common-section-body">
              <div class="report-section">
                <div class="report-attachment">
                  <AisAttachment
                    v-if="_id"
                    :businessId="_id"
                    configCode="warrantyAudit"
                    attachType="已签署整改报告"
                    :show-pagination="false"
                    :uploadConfig="uploadConfig"
                    title="已签署整改报告"
                    type="card"
                    readonly
                  />
                </div>
                <div class="report-info">
                  <el-form :inline="true" class="form-detail">
                    <el-form-item label="整改签署人：">{{ form.rectifySignerName || '--' }}</el-form-item>
                    <el-form-item label="整改签署时间：">{{ form.rectifySignTime || '--' }}</el-form-item>
                    <el-form-item label="整改签署说明：">{{ form.rectifySignDesc || '--' }}</el-form-item>
                    <el-form-item label="整改审批人：">{{ form.rectifyApproverName || '--' }}</el-form-item>
                    <el-form-item label="整改审批时间：">{{ form.rectifyApproveTime || '--' }}</el-form-item>
                    <el-form-item label="整改审批说明：">{{ form.rectifyApproveDesc || '--' }}</el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </section>
          <!-- 追溯明细 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>追溯明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="traceTable"
                  :data="traceTableData"
                  stripe
                  show-overflow
                  resizable
                  :row-config="{ isHover: true }"
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="300px"
                >
                  <vxe-column field="traceDetailCode" title="追溯明细" />
                  <vxe-column field="businessCode" title="保修审计明细" />
                  <vxe-column field="warrantyCode" title="保修申请单" />
                  <vxe-column field="settleCode" title="保修结算单" />
                  <vxe-column field="currentTraceAmount" title="本次追溯金额" />
                  <vxe-column field="createTime" title="创建时间" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
                <div class="table-pagination" v-if="traceTotal > 0">
                  <el-pagination
                    @size-change="tracePageSizeChange"
                    @current-change="traceCurrentPageChange"
                    :current-page="traceCurrent"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="tracePageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="traceTotal"
                  />
                </div>
              </div>
            </div>
          </section>
          <PublishDialog
            :visible.sync="publishDialogVisible"
            :audit-id="_id"
            :actual-audit-count="form.actualAuditCount || 0"
            @success="refreshDetail"
          />
          <!-- 签署总结弹窗 -->
          <SignSummaryDialog
            :visible.sync="signSummaryDialogVisible"
            :audit-id="_id"
            @success="refreshDetail"
          />
          <!-- 驳回总结弹窗 -->
          <RejectSummaryDialog
            :visible.sync="rejectSummaryDialogVisible"
            :audit-id="_id"
            @success="refreshDetail"
          />
          <!-- 签署整改弹窗 -->
          <SignRectifyDialog
            :visible.sync="signRectifyDialogVisible"
            :audit-id="_id"
            @success="refreshDetail"
          />
          <!-- 驳回整改弹窗 -->
          <RejectRectifyDialog
            :visible.sync="rejectRectifyDialogVisible"
            :audit-id="_id"
            @success="refreshDetail"
          />
          <!-- 上传待签署总结报告弹窗 -->
          <UploadUnsignedSummaryDialog
            :visible.sync="uploadUnsignedSummaryDialogVisible"
            :audit-id="_id"
            @success="refreshDetail"
          />
          <!-- 上传待签署整改报告弹窗 -->
          <UploadUnsignedRectifyDialog
            :visible.sync="uploadUnsignedRectifyDialogVisible"
            :audit-id="_id"
            @success="refreshDetail"
          />
        </el-main>
      </edit-base-container>
    <!-- 发布弹窗 -->
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  agreeSummary,
  agreeRectify,
  regenerateUnsignedSummary,
  regenerateUnsignedRectify,
  getClaimTraceOrderDetail,
} from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';
import { getFileList } from '@/libs/api/attachment';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import SearchAddTable from './components/SearchAddTable';
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { getDetailVisibleButtons, AUDIT_STATUS } from './constant';
import PublishDialog from './components/PublishDialog';
import SignSummaryDialog from './components/SignSummaryDialog';
import RejectSummaryDialog from './components/RejectSummaryDialog';
import SignRectifyDialog from './components/SignRectifyDialog';
import RejectRectifyDialog from './components/RejectRectifyDialog';
import UploadUnsignedSummaryDialog from './components/UploadUnsignedSummaryDialog';
import UploadUnsignedRectifyDialog from './components/UploadUnsignedRectifyDialog';
import AisAttachment from '@/libs/components/AisAttachment';
import DealerSelect from '@/components/dealer-select';
import { getUserByNameOrNo } from '@/libs/api/common';

const defaultForm = {
  id: null,
  auditCode: '',
  auditTheme: '',
  dealerCode: '',
  dealerName: '',
  ownerOrgId: null,
  warrantyApprovalStartDate: '',
  warrantyApprovalEndDate: '',
  remark: '',
  auditType: '',
  auditTypeLabel: '',
  auditStartDate: '',
  auditor1Id: null,
  auditor1Name: '',
  auditor1Sign: '',
  auditor2Id: null,
  auditor2Name: '',
  auditor2Sign: '',
  planAuditCount: null,
  actualAuditCount: 0,
  auditStatus: '10',
  auditStatusLabel: '',
  issuerId: null,
  issuerName: '',
  issueTime: '',
  summarySignTime: '',
  summarySignerId: null,
  summarySignerName: '',
  summarySignDesc: '',
  summaryApproverId: null,
  summaryApproverName: '',
  summaryApproveTime: '',
  summaryApproveDesc: '',
  rectifySignTime: '',
  rectifySignerId: null,
  rectifySignerName: '',
  rectifySignDesc: '',
  rectifyApproverId: null,
  rectifyApproverName: '',
  rectifyApproveTime: '',
  rectifyApproveDesc: '',
  submitDeadline: '',
  planDeductAmount: '',
  deductedAmount: '',
  undeductAmount: '',
  warrantyApprovalAmount: '',
  auditDetailTotalAmount: '',
  legalPerson: '',
  investor: '',
  serviceManager: '',
  partsManager: '',
  warrantyManager: '',
  techManager: '',
};

export default {
  name: 'warrantyAuditEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    SearchAddTable,
    EditBaseContainer,
    FetchSelect,
    PublishDialog,
    SignSummaryDialog,
    RejectSummaryDialog,
    SignRectifyDialog,
    RejectRectifyDialog,
    UploadUnsignedSummaryDialog,
    UploadUnsignedRectifyDialog,
    AisAttachment,
    DealerSelect,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修审计单：' + (this.form.auditCode || '');
    },
    detailButtons () {
      return getDetailVisibleButtons(this.form.auditStatus);
    },
    sign1Label () {
      return this.form.auditor1Sign ? '已上传签名' : '上传签名';
    },
    sign2Label () {
      return this.form.auditor2Sign ? '已上传签名' : '上传签名';
    },
    isDraftWithDetails () {
      return this.form.auditStatus === AUDIT_STATUS.DRAFT && this._id && this.form.actualAuditCount > 0;
    },
    approvalStartPickerOptions () {
      return {
        disabledDate: (time) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return time.getTime() >= today.getTime();
        }
      };
    },
    approvalEndPickerOptions () {
      return {
        disabledDate: (time) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (time.getTime() >= today.getTime()) return true;
          if (this.form.warrantyApprovalStartDate) {
            const start = new Date(this.form.warrantyApprovalStartDate);
            start.setHours(0, 0, 0, 0);
            return time.getTime() < start.getTime();
          }
          return false;
        }
      };
    },
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
      pageTitle: '保修审计发布',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantyAudit',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      AUDIT_STATUS,
      uploadConfig: {
        acceptSuffix: '.png,.jpg,.jpeg,.xlsx,.xls,.docx,.doc,.rar,.zip',
        maxSize: 50,
        maxNum: 1,
        required: '1',
      },
      signUploadConfig: {
        acceptSuffix: '.png,.jpg,.jpeg',
        maxSize: 50,
        maxNum: 1,
        required: '1',
      },
      rules: {
        auditTheme: [
          { required: true, message: '请输入保修审计主题', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请选择门店编码', trigger: 'change' }
        ],
        warrantyApprovalStartDate: [
          { required: true, message: '请选择保修审批开始日期', trigger: 'change' }
        ],
        warrantyApprovalEndDate: [
          { required: true, message: '请选择保修审批结束日期', trigger: 'change' }
        ],
        auditType: [
          { required: true, message: '请选择审计类型', trigger: 'change' }
        ],
        auditStartDate: [
          { required: true, message: '请选择审计开始日期', trigger: 'change' }
        ],
        auditor1Name: [
          { required: true, message: '请选择审计专员1', trigger: 'change' }
        ],
        auditor1Sign: [
          { required: true, message: '请上传审计专员1签名', trigger: 'change' }
        ],
        auditor2Sign: [
          {
            validator: (rule, value, callback) => {
              if (this.form.auditor2Id && !value) {
                callback(new Error('审计专员2有内容时签名必传'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        planAuditCount: [
          { required: true, message: '请输入计划审计数量', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' }
        ],
        investor: [
          { required: true, message: '请输入投资人', trigger: 'blur' }
        ],
        serviceManager: [
          { required: true, message: '请输入服务店长', trigger: 'blur' }
        ],
        partsManager: [
          { required: true, message: '请输入配件经理', trigger: 'blur' }
        ],
        warrantyManager: [
          { required: true, message: '请输入保修经理', trigger: 'blur' }
        ],
        techManager: [
          { required: true, message: '请输入技术经理', trigger: 'blur' }
        ],
      },
      selectedRows: [],
      //
      publishDialogVisible: false,
      signSummaryDialogVisible: false,
      rejectSummaryDialogVisible: false,
      signRectifyDialogVisible: false,
      rejectRectifyDialogVisible: false,
      uploadUnsignedSummaryDialogVisible: false,
      uploadUnsignedRectifyDialogVisible: false,
      // 追溯明细
      traceTableData: [],
      traceCurrent: 1,
      tracePageSize: 10,
      traceTotal: 0,
    };
  },
  mounted () {
    this.getTraceTableData();
  },
  methods: {
    handleUpdate (data, key) {
      if (data?.addOrUpdateParams?.fileId) {
        this.form[key] = data.addOrUpdateParams.fileId;
      }
    },
    handleRefresh () {
      this.$refs.containerRef.loadDetail();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    getDefautlForm () {
      return { ...defaultForm };
    },
    checkboxChange (records) {
      this.selectedRows = records;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async searchUser (query) {
      if (!query) return [];
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res || [];
      } catch (error) {
        return [];
      }
    },
    handleAuditor1Change (val, record) {
      if (record) {
        this.form.auditor1Id = record.userId;
        this.form.auditor1Name = record.username;
      } else {
        this.form.auditor1Id = null;
        this.form.auditor1Name = '';
      }
    },
    handleAuditor2Change (val, record) {
      if (record) {
        this.form.auditor2Id = record.userId;
        this.form.auditor2Name = record.username;
      } else {
        this.form.auditor2Id = null;
        this.form.auditor2Name = '';
      }
    },
    handleDealerChange (val) {
      if (!val) {
        this.form.dealerCode = '';
        this.form.dealerName = '';
        this.form.ownerOrgId = null;
        return;
      }
      const dealerSelect = this.$refs.dealerSelectRef;
      if (dealerSelect && dealerSelect.selectedOptions) {
        const selected = dealerSelect.selectedOptions.find(item => item.orgCode === val);
        if (selected) {
          this.form.dealerName = selected.orgName;
          this.form.ownerOrgId = selected.orgId;
        }
      }
    },
    refreshDetail () {
      if (this.$refs.containerRef) {
        this.$refs.containerRef.loadDetail();
      }
    },
    handlePublish () {
      if (!this.form.actualAuditCount || this.form.actualAuditCount <= 0) {
        this.$message.warning('请添加审计明细信息之后，再执行发布');
        return;
      }
      this.publishDialogVisible = true;
    },
    handleSignSummary () {
      this.signSummaryDialogVisible = true;
    },
    handleRejectSummary () {
      this.rejectSummaryDialogVisible = true;
    },
    handleSignRectify () {
      this.signRectifyDialogVisible = true;
    },
    handleRejectRectify () {
      this.rejectRectifyDialogVisible = true;
    },
    handleAgreeSummary () {
      this.$confirm('确定同意总结？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agreeSummary({ auditId: this._id }).then(() => {
          this.$message.success('同意总结成功');
          this.refreshDetail();
        });
      }).catch(() => {});
    },
    handleAgreeRectify () {
      this.$confirm('确定同意整改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agreeRectify({ auditId: this._id }).then(() => {
          this.$message.success('同意整改成功');
          this.refreshDetail();
        });
      }).catch(() => {});
    },
    handleRegenerateUnsignedSummary () {
      this.$confirm('确定重新生成待签署总结报告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        regenerateUnsignedSummary({ auditId: this._id }).then(() => {
          this.$message.success('重新生成成功');
          this.refreshDetail();
        });
      }).catch(() => {});
    },
    handleUploadUnsignedSummary () {
      this.uploadUnsignedSummaryDialogVisible = true;
    },
    handleRegenerateUnsignedRectify () {
      this.$confirm('确定重新生成待签署整改报告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        regenerateUnsignedRectify({ auditId: this._id }).then(() => {
          this.$message.success('重新生成成功');
          this.refreshDetail();
        });
      }).catch(() => {});
    },
    handleUploadUnsignedRectify () {
      this.uploadUnsignedRectifyDialogVisible = true;
    },
    async handleDownloadUnsignedSummary () {
      const list = await getFileList({ businessId: this._id, attachType: '待签署总结报告' });
      if (list && list.length) {
        window.open(list[0].fileUrl);
      } else {
        this.$message.warning('暂无可下载的报告');
      }
    },
    async handleDownloadUnsignedRectify () {
      const list = await getFileList({ businessId: this._id, attachType: '待签署整改报告' });
      if (list && list.length) {
        window.open(list[0].fileUrl);
      } else {
        this.$message.warning('暂无可下载的报告');
      }
    },
    getTraceTableData () {
      getClaimTraceOrderDetail({
        auditId: this._id,
      }).then(res => {
        this.traceTableData = res.data?.records || [];
        this.traceTotal = res.total;
      });
    },
    tracePageSizeChange (pageSize) {
      this.tracePageSize = pageSize;
      this.traceCurrent = 1;
      this.getTraceTableData();
    },
    traceCurrentPageChange (current) {
      this.traceCurrent = current;
      this.getTraceTableData();
    },
  }
};
</script>

<style lang="scss" scoped>
.report-section {
  display: flex;
  gap: 24px;

  .report-attachment {
    flex-shrink: 0;
    width: 500px;

    .report-attachment-label {
      font-size: 14px;
      color: #303133;
      margin-bottom: 8px;
    }
  }

  .report-info {
    flex: 1;
    min-width: 0;
  }
  ::v-deep .business-upload.card {
    width: 100%;
    min-width: auto;
  }
}
.download-link{
  margin-left: 8px;
  color: var(--leap-color-primary);
}
.form-item-sign{
  display: flex;
  gap: 8px;
  align-items: center;
  &::v-deep .business-upload{
    width: 100px;
  }
  &::v-deep .business-upload-area{
    margin-bottom: 0;
  }
}
</style>
