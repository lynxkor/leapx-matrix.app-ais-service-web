<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest" :showEditBtn="detailButtons.includes('编辑')">
        <template #status>
          <span v-if="form.traceStatusLabel" class="status primary">{{ form.traceStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="detailButtons.includes('作废')" size="small" @click="handleCancelOrder">作废</el-button>
          <el-button v-if="detailButtons.includes('调整追溯金额')" size="small" @click="handleAdjustAmount">调整追溯金额</el-button>
          <el-button v-if="detailButtons.includes('驳回修改')" size="small" @click="handleRejectModify">驳回修改</el-button>
          <el-button v-if="detailButtons.includes('申诉')" size="small" @click="handleAppeal">申诉</el-button>
          <el-button v-if="detailButtons.includes('驳回申诉')" size="small" @click="handleRejectAppeal">驳回申诉</el-button>
          <el-button v-if="detailButtons.includes('拒绝申诉')" size="small" @click="handleRefuseAppeal">拒绝申诉</el-button>
          <el-button v-if="detailButtons.includes('提交审核')" size="small" type="primary"
            @click="handleSubmitAudit">提交审核</el-button>
          <el-button v-if="detailButtons.includes('同意下发')" size="small" type="primary"
            @click="handleAgreeIssue">同意下发</el-button>
          <el-button v-if="detailButtons.includes('同意追溯')" size="small" type="primary"
            @click="handleAgreeTrace">同意追溯</el-button>
          <el-button v-if="detailButtons.includes('同意申诉')" size="small" type="primary"
            @click="handleAgreeAppeal">同意申诉</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="索赔追溯单号：" prop="claimTraceCode">
                  <el-input placeholder="系统自动生成" v-model="form.claimTraceCode" clearable disabled />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input v-model="form.dealerCode" disabled />
                </el-form-item>
                <el-form-item label="追溯状态：" prop="traceStatus">
                  <fetch-select :request="fetchOptions" enumCode="claim_trace_status" v-model="form.traceStatus"
                    clearable filterable disabled />
                </el-form-item>
                <el-form-item label="保修申请单：" prop="warrantyCode">
                 <list-select
                    listUrl="claimreturn/claim/web/warrantyapply/warrantyApply/selectableList"
                    placeholder="请输入保修申请单"
                    v-model="form.warrantyCode"
                    :disabled="Boolean(_id)"
                    query-key="applyNo"
                    filterable
                    clearable
                    label-key="applyNo"
                    value-key="applyNo"
                    @change="handleWarrantyApplyChange"
                  :params="{}" />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerCode">
                  <dealer-select v-model="form.dealerCode" disabled />
                </el-form-item>
                <el-form-item label="首次下发时间：">
                  <el-input v-model="form.firstIssueTime" disabled />
                </el-form-item>
                <el-form-item label="追溯说明：" prop="traceDesc">
                  <el-input v-model="form.traceDesc" clearable type="textarea" :rows="1" disabled />
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <LPEncrypted
                    :value.sync="form.vin"
                    :decryptMethod="getDetailDecryptField"
                    :disabled="!_id"
                  >
                    <el-input  v-model="form.vin" clearable disabled />
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="最新下发时间：">
                  <el-input v-model="form.latestIssueTime" disabled />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input placeholder="请输入" v-model="form.remark" clearable type="textarea" :rows="1" :disabled="!!_id && (![TRACE_STATUS.DRAFT, TRACE_STATUS.AUDITING, TRACE_STATUS.REJECTED].includes(form.traceStatus))" />
                </el-form-item>
                <el-form-item label="系统自动同意时间：">
                  <el-input v-model="form.sysAutoAgreeDate" disabled />
                </el-form-item>
                <el-form-item label="提交人：">
                  <el-input v-model="form.submitter" disabled />
                </el-form-item>
                <el-form-item label="提交时间：">
                  <el-input v-model="form.submitTime" disabled />
                </el-form-item>
                <el-form-item label="审核人：">
                  <el-input v-model="form.auditor" disabled />
                </el-form-item>
                <el-form-item label="审核意见：">
                  <el-input v-model="form.auditOpinion" disabled />
                </el-form-item>
                <el-form-item label="审核时间：">
                  <el-input v-model="form.auditTime" disabled />
                </el-form-item>
              </el-form>
              <!-- 详情页：基础信息 -->
              <el-form :inline="true" label-width="150px" class="form-detail" v-show="!isEditing && _id">
                <el-form-item label="索赔追溯单号：">{{ form.claimTraceCode }}</el-form-item>
                <el-form-item label="门店编码：">{{ form.dealerCode }}</el-form-item>
                <el-form-item label="追溯状态：">{{ form.traceStatusLabel }}</el-form-item>
                <el-form-item label="保修申请单：">{{ form.warrantyCode }}</el-form-item>
                <el-form-item label="门店名称：">{{ form.dealerName }}</el-form-item>
                <el-form-item label="首次下发时间：">{{ form.firstIssueTime }}</el-form-item>
                <el-form-item label="追溯说明：">{{ form.traceDesc }}</el-form-item>
                <el-form-item label="VIN：">
                  <LPEncrypted
                    :value.sync="form.vin"
                    :decryptMethod="getDetailDecryptField"
                  >
                    {{ form.vin }}
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="最新下发时间：">{{ form.latestIssueTime }}</el-form-item>
                <el-form-item label="备注：">{{ form.remark }}</el-form-item>
                <el-form-item label="系统自动同意时间：">{{ form.sysAutoAgreeDate }}</el-form-item>
                <el-form-item label="提交人：">{{ form.submitter }}</el-form-item>
                <el-form-item label="提交时间：">{{ form.submitTime }}</el-form-item>
                <el-form-item label="审核人：">{{ form.auditor }}</el-form-item>
                <el-form-item label="审核意见：">{{ form.auditOpinion }}</el-form-item>
                <el-form-item label="审核时间：">{{ form.auditTime }}</el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>处理信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑页：处理信息 -->
              <el-form :inline="true" :model="form" label-width="150px" class="form-edit" v-show="isEditing && _id">
                <el-form-item label="门店处理意见：">
                  <el-input v-model="form.dealerProcessOpinion" disabled />
                </el-form-item>
                <el-form-item label="同意追溯时间：">
                  <el-input v-model="form.agreeTraceTime" disabled />
                </el-form-item>
                <el-form-item label="追溯金调整人：">
                  <el-input v-model="form.traceAmountAdjuster" disabled />
                </el-form-item>
                <el-form-item label="申诉审核意见：">
                  <el-input v-model="form.appealAuditOpinion" disabled />
                </el-form-item>
                <el-form-item label="计划追溯金额：">
                  <el-input v-model="form.planTraceAmount" disabled />
                </el-form-item>
                <el-form-item label="追溯金额调整原因：">
                  <el-input v-model="form.traceAmountAdjustReason" disabled />
                </el-form-item>
                <el-form-item label="保修工时金额：">
                  <el-input v-model="form.laborClaimTotal" disabled />
                </el-form-item>
                <el-form-item label="已追溯金额：">
                  <el-input v-model="form.tracedAmount" disabled />
                </el-form-item>
                <el-form-item label="作废人：">
                  <el-input v-model="form.canceller" disabled />
                </el-form-item>
                <el-form-item label="保修备件金额：">
                  <el-input v-model="form.partsClaimTotal" disabled />
                </el-form-item>
                <el-form-item label="未追溯金额：">
                  <el-input v-model="form.unTraceAmount" disabled />
                </el-form-item>
                <el-form-item label="作废说明：">
                  <el-input v-model="form.cancelDesc" disabled />
                </el-form-item>
                <el-form-item label="保修其他金额：">
                  <el-input v-model="form.otherClaimTotal" disabled />
                </el-form-item>
                <el-form-item label="作废时间：">
                  <el-input v-model="form.cancelTime" disabled />
                </el-form-item>
              </el-form>
              <!-- 详情页：处理信息 -->
              <el-form :inline="true" label-width="150px" class="form-detail" v-show="!isEditing && _id">
                <el-form-item label="门店处理意见：">{{ form.dealerProcessOpinion }}</el-form-item>
                <el-form-item label="同意追溯时间：">{{ form.agreeTraceTime }}</el-form-item>
                <el-form-item label="追溯金调整人：">{{ form.traceAmountAdjuster }}</el-form-item>
                <el-form-item label="申诉审核意见：">{{ form.appealAuditOpinion }}</el-form-item>
                <el-form-item label="计划追溯金额：">{{ form.planTraceAmount }}</el-form-item>
                <el-form-item label="追溯金额调整原因：">{{ form.traceAmountAdjustReason }}</el-form-item>
                <el-form-item label="保修工时金额：">{{ form.laborClaimTotal }}</el-form-item>
                <el-form-item label="已追溯金额：">{{ form.tracedAmount }}</el-form-item>
                <el-form-item label="作废人：">{{ form.canceller }}</el-form-item>
                <el-form-item label="保修备件金额：">{{ form.partsClaimTotal }}</el-form-item>
                <el-form-item label="未追溯金额：">{{ form.unTraceAmount }}</el-form-item>
                <el-form-item label="作废说明：">{{ form.cancelDesc }}</el-form-item>
                <el-form-item label="保修其他金额：">{{ form.otherClaimTotal }}</el-form-item>
                <el-form-item label="作废时间：">{{ form.cancelTime }}</el-form-item>
              </el-form>
            </div>
          </section>
           <!-- 追溯凭证 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>追溯凭证</h2>
            </div>
            <div class="common-section-body">
              <AisAttachment
                :business-id="_id"
                attachType="不合格凭证"
                configCode="mcs_claimtrack_form"
                emptyText="暂无不合格凭证"
                :readonly="!detailButtons.includes('编辑')"
              />
            </div>
          </section>
          <!-- 申诉凭证 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>申诉凭证</h2>
            </div>
            <div class="common-section-body">
              <AisAttachment
                :business-id="_id"
                attachType="申诉凭证"
                configCode="mcs_claimtrack_form"
                emptyText="暂无申诉凭证"
                :readonly="!detailButtons.includes('编辑')"
              />
            </div>
          </section>
          <!-- 追溯明细 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>追溯明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table ref="traceTableRef" :data="traceTableData" stripe show-overflow resizable border="inner"
                  size="medium" min-height="0" max-height="300px">
                  <vxe-column field="traceDetailCode" title="追溯明细" min-width="150" />
                  <!-- <vxe-column field="warrantyApplyCode" title="保修申请单" min-width="150" /> -->
                  <vxe-column field="settleCode" title="保修结算单" min-width="150" />
                  <vxe-column field="currentTraceAmount" title="本次追溯金额" min-width="120" />
                  <vxe-column field="createTime" title="创建时间" min-width="160" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
                  </template>
                </vxe-table>
                <div class="table-pagination" v-if="traceTotal > 0">
                  <el-pagination @size-change="tracePageSizeChange" @current-change="traceCurrentPageChange"
                    :current-page="traceCurrent" :page-sizes="[10, 20, 50, 100]" :page-size="tracePageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="traceTotal" />
                </div>
              </div>
            </div>
          </section>
          <!-- 弹窗组件 -->
          <SubmitAuditDialog :visible.sync="submitAuditDialogVisible" :traceOrderId="_id" :formData="form"
            @success="refreshDetail" />
          <CancelOrderDialog :visible.sync="cancelOrderDialogVisible" :traceOrderId="_id" @success="refreshDetail" />
          <AdjustAmountDialog :visible.sync="adjustAmountDialogVisible" :traceOrderId="_id" :formData="form"
            @success="refreshDetail" />
          <RejectModifyDialog :visible.sync="rejectModifyDialogVisible" :traceOrderId="_id" @success="refreshDetail" />
          <AppealDialog :visible.sync="appealDialogVisible" :traceOrderId="_id" @success="refreshDetail" />
          <AgreeAppealDialog :visible.sync="agreeAppealDialogVisible" :traceOrderId="_id" @success="refreshDetail" />
          <RejectAppealDialog :visible.sync="rejectAppealDialogVisible" :traceOrderId="_id" :formData="form"
            @success="refreshDetail" />
          <RefuseAppealDialog :visible.sync="refuseAppealDialogVisible" :traceOrderId="_id" @success="refreshDetail" />
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, agreeIssue, agreeTrace, getDetailDecryptField } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import { claimTraceOrderDetailList } from '@/api/claimreturn/claim/claimtrace/claimTraceOrderDetail/index';
import { getList } from '@/api/claimreturn/claim/warrantyapply/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import FetchSelect from '@/libs/components/FetchSelect';
import DealerSelect from '@/components/dealer-select/index.vue';
import { getDetailVisibleButtons, TRACE_STATUS, TRACE_TYPE } from './constant';
import SubmitAuditDialog from './components/SubmitAuditDialog';
import CancelOrderDialog from './components/CancelOrderDialog';
import AdjustAmountDialog from './components/AdjustAmountDialog';
import RejectModifyDialog from './components/RejectModifyDialog';
import AppealDialog from './components/AppealDialog';
import AgreeAppealDialog from './components/AgreeAppealDialog';
import RejectAppealDialog from './components/RejectAppealDialog';
import RefuseAppealDialog from './components/RefuseAppealDialog';
import AisAttachment from '@/libs/components/AisAttachment';
import ListSelect from '@/libs/components/list-select';
import LPEncrypted from '@/libs/components/LPEncrypted/index.vue';

const defaultForm = {
  claimTraceCode: '',
  traceStatus: '10',
  dealerCode: '',
  warrantyId: '',
  warrantyCode: '',
  dealerName: '',
  traceDesc: '',
  vin: '',
  remark: '',
  firstIssueTime: '',
  latestIssueTime: '',
  sysAutoAgreeDate: '',
  submitter: '',
  submitTime: '',
  auditor: '',
  auditOpinion: '',
  auditTime: '',
  dealerProcessOpinion: '',
  agreeTraceTime: '',
  traceAmountAdjuster: '',
  appealAuditOpinion: '',
  planTraceAmount: '',
  traceAmountAdjustReason: '',
  traceAmountAdjustTime: '',
  tracedAmount: '',
  canceller: '',
  unTraceAmount: '',
  cancelDesc: '',
  cancelTime: '',
  laborClaimTotal: '',
  partsClaimTotal: '',
  otherClaimTotal: '',
  dealerProcessor: '',
  dealerProcessTime: '',
  appealAuditor: '',
  appealAuditTime: '',
  traceStatusLabel: '',
};

export default {
  name: 'claimTraceOrderEdit',
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
    FetchSelect,
    DealerSelect,
    SubmitAuditDialog,
    CancelOrderDialog,
    AdjustAmountDialog,
    RejectModifyDialog,
    AppealDialog,
    AgreeAppealDialog,
    RejectAppealDialog,
    RefuseAppealDialog,
    AisAttachment,
    ListSelect,
    LPEncrypted
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '索赔追溯单号：' + (this.form.claimTraceCode || '');
    },
    detailButtons () {
      if (this.isEditing) return [];
      return getDetailVisibleButtons(this.form.traceStatus);
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
      pageTitle: '索赔追溯单',
      pageType: 'edit',
      moduleKey: 'AISCR-claimTraceOrder',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      TRACE_STATUS,
      rules: {
        warrantyCode: [
          { required: true, message: '请输入保修申请单', trigger: 'change' }
        ],
      },
      // 弹窗可见性
      submitAuditDialogVisible: false,
      cancelOrderDialogVisible: false,
      adjustAmountDialogVisible: false,
      rejectModifyDialogVisible: false,
      appealDialogVisible: false,
      agreeAppealDialogVisible: false,
      rejectAppealDialogVisible: false,
      refuseAppealDialogVisible: false,
      // 追溯明细
      traceTableData: [],
      traceCurrent: 1,
      tracePageSize: 10,
      traceTotal: 0,
    };
  },
  mounted () {
    if (this._id) {
      this.getTraceTableData();
    }
  },
  methods: {
    getDetailDecryptField () {
      return getDetailDecryptField(this.form.id, 'vin');
    },
    queryListData (query) {
      return getList({
        limitSize: 20,
        // isClaimTrackIdNull: true,
        isWarrantyAuditDetailIdNull: true,
        // approvalTimeStart: this.formData.warrantyApprovalStartDate,
        // approvalTimeEnd: this.formData.warrantyApprovalEndDate,
        applyStatusList: ['70', '80'],
        dealerCode: this.form.dealerCode
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.$nextTick(() => {
            this.getTraceTableData();
          });
          return res;
        });
      }
    },
    handleWarrantyApplyChange (val, record) {
      if (record) {
        this.form.warrantyId = record.id;
        this.form.vin = record.vin;
      } else {
        this.form.warrantyId = '';
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return { ...defaultForm };
    },
    refreshDetail () {
      if (this.$refs.containerRef) {
        this.$refs.containerRef.loadDetail();
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 操作按钮方法
    handleSubmitAudit () {
      this.submitAuditDialogVisible = true;
    },
    handleCancelOrder () {
      this.cancelOrderDialogVisible = true;
    },
    handleAdjustAmount () {
      this.adjustAmountDialogVisible = true;
    },
    handleRejectModify () {
      this.rejectModifyDialogVisible = true;
    },
    handleAgreeIssue () {
      this.$confirm('确定同意下发？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agreeIssue(this._id).then(() => {
          this.$message.success('同意下发成功');
          this.refreshDetail();
        });
      }).catch(() => { });
    },
    handleAgreeTrace () {
      this.$confirm('确定同意追溯？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agreeTrace(this._id).then(() => {
          this.$message.success('同意追溯成功');
          this.refreshDetail();
        });
      }).catch(() => { });
    },
    handleAppeal () {
      this.appealDialogVisible = true;
    },
    handleAgreeAppeal () {
      this.agreeAppealDialogVisible = true;
    },
    handleRejectAppeal () {
      this.rejectAppealDialogVisible = true;
    },
    handleRefuseAppeal () {
      this.refuseAppealDialogVisible = true;
    },
    // 追溯明细
    getTraceTableData () {
      claimTraceOrderDetailList({
        businessId: this._id,
        traceType: TRACE_TYPE.CLAIM_TRACE,
        pageNum: this.traceCurrent,
        pageSize: this.tracePageSize,
      }).then(res => {
        this.traceTableData = res.records || [];
        this.traceTotal = res.total || 0;
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
