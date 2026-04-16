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
      >
        <template #status>
          <span class="status primary">{{ form.auditStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="canSupplyMaterial" size="small" type="primary" @click="handleSupplyMaterial">补充材料</el-button>
          <el-button v-if="canAuditPass" size="small" type="primary" @click="handleAuditPass">审计通过</el-button>
          <el-button v-if="canAuditReject" size="small" type="danger" @click="handleAuditReject">审计驳回</el-button>
          <el-button v-if="canAppeal" size="small" type="warning" @click="handleAppeal">申诉</el-button>
          <el-button v-if="canAgree" size="small" type="success" @click="handleAgree">同意</el-button>
          <el-button v-if="canAgreeAppeal" size="small" type="success" @click="handleAgreeAppeal">同意申诉</el-button>
          <el-button v-if="canRejectAppeal" size="small" type="danger" @click="handleRejectAppeal">拒绝申诉</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="保修审计明细单号：">
                  {{ form.auditDetailCode }}
                </el-form-item>
                <el-form-item label="保修申请单编号：">
                  <el-link type="primary" @click="jumpToWarrantyApply(form.warrantyApplyId)">{{ form.warrantyApplyCode }}</el-link>
                </el-form-item>
                <el-form-item label="保修审计单编码：">
                  <el-link type="primary" @click="jumpToWarrantyAudit(form.auditId)">{{ form.auditCode }}</el-link>
                </el-form-item>
                <el-form-item label="接车施工单编号：">
                  <el-link type="primary" @click="jumpToServiceProxy(form.serviceProxyId)">{{ form.serviceProxyCode }}</el-link>
                </el-form-item>
                <el-form-item label="结算单编号：">
                  {{ form.settlementCode }}
                </el-form-item>
                <el-form-item label="VIN码：">
                  <el-link type="primary" @click="jumpToVehicle(form.vin)">{{ formatVin(form.vin) }}</el-link>
                </el-form-item>
                <el-form-item label="门店编码：">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="保修类型：">
                  {{ form.repairItemTypeName }}
                </el-form-item>
                <el-form-item label="主因备件编码：">
                  {{ form.mainPartCode }}
                </el-form-item>
                <el-form-item label="主因备件名称：">
                  {{ form.mainPartName }}
                </el-form-item>
                <el-form-item label="审计状态：">
                  {{ form.auditStatusLabel }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>索赔金额信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="索赔总金额：">
                  {{ formatMoney(form.totalClaimAmount) }}
                </el-form-item>
                <el-form-item label="工时索赔小计：">
                  {{ formatMoney(form.laborClaimTotal) }}
                </el-form-item>
                <el-form-item label="备件索赔小计：">
                  {{ formatMoney(form.partsClaimTotal) }}
                </el-form-item>
                <el-form-item label="其他索赔小计：">
                  {{ formatMoney(form.otherClaimTotal) }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>扣款金额信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="工时扣款：">
                  {{ formatMoney(form.laborDeduct) }}
                </el-form-item>
                <el-form-item label="备件扣款：">
                  {{ formatMoney(form.partDeduct) }}
                </el-form-item>
                <el-form-item label="其他扣款：">
                  {{ formatMoney(form.otherDeduct) }}
                </el-form-item>
                <el-form-item label="计划扣款总金额：">
                  {{ formatMoney(form.planDeductTotal) }}
                </el-form-item>
                <el-form-item label="已扣款金额：">
                  {{ formatMoney(form.deductedAmount) }}
                </el-form-item>
                <el-form-item label="未扣款金额：">
                  {{ formatMoney(form.undeductAmount) }}
                </el-form-item>
                <el-form-item label="扣款金额是否自动计算：">
                  {{ form.isAutoCalc === '1' ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="金额调整原因：">
                  {{ form.amountAdjustReason }}
                </el-form-item>
                <el-form-item label="金额调整人：">
                  {{ form.amountAdjustName }}
                </el-form-item>
                <el-form-item label="金额调整时间：">
                  {{ form.amountAdjustTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>材料补充信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="材料补充人：">
                  {{ form.materialSupplierName }}
                </el-form-item>
                <el-form-item label="材料补充时间：">
                  {{ form.materialSupplyTime }}
                </el-form-item>
                <el-form-item label="材料补充说明：">
                  {{ form.materialSupplyDesc }}
                </el-form-item>
                <el-form-item label="材料提交截止日期：">
                  {{ form.materialSubmitDeadline }}
                </el-form-item>
                <el-form-item label="审计结果反馈截止日期：">
                  {{ form.auditFeedbackDeadline }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>审计信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="审计人：">
                  {{ form.auditorName }}
                </el-form-item>
                <el-form-item label="审计时间：">
                  {{ form.auditTime }}
                </el-form-item>
                <el-form-item label="审计说明：">
                  {{ form.auditDesc }}
                </el-form-item>
                <el-form-item label="审计结果同意人：">
                  {{ form.auditResultAgreeName }}
                </el-form-item>
                <el-form-item label="审计结果同意时间：">
                  {{ form.auditResultAgreeTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>申诉信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="申诉人：">
                  {{ form.appealerName }}
                </el-form-item>
                <el-form-item label="申诉时间：">
                  {{ form.appealTime }}
                </el-form-item>
                <el-form-item label="申诉说明：">
                  {{ form.appealDesc }}
                </el-form-item>
                <el-form-item label="申诉处理人：">
                  {{ form.appealHandlerName }}
                </el-form-item>
                <el-form-item label="申诉处理时间：">
                  {{ form.appealHandleTime }}
                </el-form-item>
                <el-form-item label="申诉处理说明：">
                  {{ form.appealHandleDesc }}
                </el-form-item>
                <el-form-item label="申诉处理结果：">
                  {{ form.appealResultLabel }}
                </el-form-item>
              </el-form>
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
  </edit-page-layout>
  <!-- 补充材料弹窗 -->
  <!-- <SupplyMaterialDialog
    :visible.sync="supplyMaterialDialogVisible"
    :selection-list="[{ id: form.id, auditStatus: form.auditStatus }]"
    @success="loadDetail"
  /> -->
  <!-- 审计通过弹窗 -->
  <!-- <AuditPassDialog
    :visible.sync="auditPassDialogVisible"
    :selection-list="[{ id: form.id, auditStatus: form.auditStatus }]"
    @success="loadDetail"
  /> -->
  <!-- 审计驳回弹窗 -->
  <!-- <AuditRejectDialog
    :visible.sync="auditRejectDialogVisible"
    :selection-list="[{ id: form.id, auditStatus: form.auditStatus, warrantyApplyId: form.warrantyApplyId, laborClaimTotal: form.laborClaimTotal, partsClaimTotal: form.partsClaimTotal, otherClaimTotal: form.otherClaimTotal }]"
    @success="loadDetail"
  /> -->
  <!-- 申诉弹窗 -->
  <!-- <AppealDialog
    :visible.sync="appealDialogVisible"
    :selection-list="[{ id: form.id, auditStatus: form.auditStatus }]"
    @success="loadDetail"
  /> -->
  <!-- 同意申诉弹窗 -->
  <!-- <AgreeAppealDialog
    :visible.sync="agreeAppealDialogVisible"
    :selection-list="[{ id: form.id, auditStatus: form.auditStatus, warrantyApplyId: form.warrantyApplyId, laborClaimTotal: form.laborClaimTotal, partsClaimTotal: form.partsClaimTotal, otherClaimTotal: form.otherClaimTotal }]"
    @success="loadDetail"
  /> -->
  <!-- 拒绝申诉弹窗 -->
  <!-- <RejectAppealDialog
    :visible.sync="rejectAppealDialogVisible"
    :selection-list="[{ id: form.id, auditStatus: form.auditStatus, warrantyApplyId: form.warrantyApplyId, laborClaimTotal: form.laborClaimTotal, partsClaimTotal: form.partsClaimTotal, otherClaimTotal: form.otherClaimTotal }]"
    @success="loadDetail"
  /> -->
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  agree,
} from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  auditDetailCode: '',
  warrantyApplyId: '',
  warrantyApplyCode: '',
  auditId: '',
  auditCode: '',
  serviceProxyId: '',
  serviceProxyCode: '',
  settlementId: '',
  settlementCode: '',
  vin: '',
  dealerCode: '',
  dealerName: '',
  repairItemTypeId: '',
  repairItemTypeName: '',
  mainPartId: '',
  mainPartCode: '',
  mainPartName: '',
  auditStatus: '',
  auditStatusLabel: '',
  totalClaimAmount: 0,
  laborClaimTotal: 0,
  partsClaimTotal: 0,
  otherClaimTotal: 0,
  laborDeduct: 0,
  partDeduct: 0,
  otherDeduct: 0,
  planDeductTotal: 0,
  deductedAmount: 0,
  undeductAmount: 0,
  isAutoCalc: '',
  amountAdjustReason: '',
  amountAdjustId: '',
  amountAdjustName: '',
  amountAdjustTime: '',
  materialSupplierId: '',
  materialSupplierName: '',
  materialSupplyTime: '',
  materialSupplyDesc: '',
  materialSubmitDeadline: '',
  auditFeedbackDeadline: '',
  auditorId: '',
  auditorName: '',
  auditTime: '',
  auditDesc: '',
  auditResultAgreeId: '',
  auditResultAgreeName: '',
  auditResultAgreeTime: '',
  appealerId: '',
  appealerName: '',
  appealTime: '',
  appealDesc: '',
  appealHandlerId: '',
  appealHandlerName: '',
  appealHandleTime: '',
  appealHandleDesc: '',
  appealResult: '',
  appealResultLabel: '',
  createTime: '',
  updateTime: '',
};

// 审计状态枚举值
const AUDIT_STATUS = {
  WAIT_SUPPLY: '10', // 待门店补充材料
  WAIT_AUDIT: '20', // 待审计
  PASS: '30', // 通过
  ERROR_WAIT_CONFIRM: '40', // 错误待确认
  APPEAL: '50', // 申诉
  ERROR_CONFIRMED: '60', // 错误已确认
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
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修审计明细：' + (this.form.auditDetailCode || '');
    },
    // 根据审计状态判断按钮是否可用
    canSupplyMaterial () {
      return this.form.auditStatus === AUDIT_STATUS.WAIT_SUPPLY;
    },
    canAuditPass () {
      return this.form.auditStatus === AUDIT_STATUS.WAIT_AUDIT;
    },
    canAuditReject () {
      return this.form.auditStatus === AUDIT_STATUS.WAIT_AUDIT;
    },
    canAppeal () {
      return this.form.auditStatus === AUDIT_STATUS.ERROR_WAIT_CONFIRM;
    },
    canAgree () {
      return this.form.auditStatus === AUDIT_STATUS.ERROR_WAIT_CONFIRM;
    },
    canAgreeAppeal () {
      return this.form.auditStatus === AUDIT_STATUS.APPEAL;
    },
    canRejectAppeal () {
      return this.form.auditStatus === AUDIT_STATUS.APPEAL;
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
    // 格式化金额
    formatMoney (value) {
      if (value === null || value === undefined) {
        return '-';
      }
      return Number(value).toFixed(2) + ' 元';
    },
    // VIN脱敏显示
    formatVin (vin) {
      if (vin && vin.length > 6) {
        return vin.substring(0, 3) + '***' + vin.substring(vin.length - 3);
      }
      return vin || '-';
    },
    // 跳转到保修申请单
    jumpToWarrantyApply (id) {
      if (id) {
        this.$router.push({
          path: '/claimreturn/claim/warrantyapply/edit',
          query: { id }
        });
      }
    },
    // 跳转到保修审计单
    jumpToWarrantyAudit (id) {
      if (id) {
        this.$router.push({
          path: '/claimreturn/claim/warrantyAudit/edit',
          query: { id }
        });
      }
    },
    // 跳转到接车施工单
    jumpToServiceProxy (id) {
      if (id) {
        this.$router.push({
          path: '/maintain/sp/serviceproxy/edit',
          query: { id }
        });
      }
    },
    // 跳转到车辆详情
    jumpToVehicle (vin) {
      if (vin) {
        this.$router.push({
          path: '/datacenter/vehicle/vehicleprofile/edit',
          query: { vin }
        });
      }
    },
    // 补充材料
    handleSupplyMaterial () {
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
      this.appealDialogVisible = true;
    },
    // 同意
    handleAgree () {
      this.$confirm('确定同意该审计结果吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agree({ ids: [this.form.id] }).then(() => {
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
</style>
