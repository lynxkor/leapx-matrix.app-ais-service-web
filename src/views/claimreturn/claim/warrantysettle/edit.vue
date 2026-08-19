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
  >
    <template #extraButtons>
      <el-button v-if="canConfirm && form.settleStatus === '10'" type="primary" size="small" :loading="confirmLoading" @click="handleConfirm">确认</el-button>
      <el-button v-if="canComplete && (form.settleStatus === '60' || form.settleStatus === '110')" type="primary" size="small" @click="handleComplete">开票完成</el-button>
      <el-button v-if="canInvoiceAccept && form.settleStatus === '65'" type="primary" size="small" @click="handleInvoiceAccept">发票验收</el-button>
      <el-button v-if="canInvoiceReturn && (form.settleStatus === '65' || form.settleStatus === '90')" type="primary" size="small" @click="handleInvoiceReturn">发票退回</el-button>
      <el-button v-if="canPayConfirm && form.settleStatus === '90'" type="primary" size="small" @click="handlePayConfirm">确认付款</el-button>
    </template>
    <el-main>
      <!-- 基础信息 -->
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-sub-header">
            <h3>订单信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="保修结算单：" prop="settleCode">
              <el-input placeholder="" v-model="form.settleCode" clearable disabled />
            </el-form-item>
            <el-form-item label="通知书状态：" prop="settleStatusLabel">
              <el-input placeholder="" v-model="form.settleStatusLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-input placeholder="" v-model="form.dealerCode" clearable disabled />
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              <el-input placeholder="" v-model="form.dealerName" clearable disabled />
            </el-form-item>
            <el-form-item label="公司编码：" prop="parentOrgCode">
              <el-input placeholder="" v-model="form.parentOrgCode" clearable disabled />
            </el-form-item>
            <el-form-item label="公司名称：" prop="parentOrgName">
              <el-input placeholder="" v-model="form.parentOrgName" clearable disabled />
            </el-form-item>
            <el-form-item label="月度：" prop="month">
              <el-input placeholder="" v-model="form.month" clearable disabled />
            </el-form-item>
            <el-form-item label="收款方式：" prop="paymentMethodLabel">
              <el-input placeholder="" v-model="form.paymentMethodLabel" clearable disabled />
            </el-form-item>
            <el-form-item class="form-item-full" label="备注：" prop="remark">
              <el-input type="textarea" v-model="form.remark" clearable />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="保修结算单：" prop="settleCode">
              {{ form.settleCode }}
            </el-form-item>
            <el-form-item label="通知书状态：" prop="settleStatusLabel">
              {{ form.settleStatusLabel }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-link
                v-if="form.dealerCode"
                type="primary"
                :href="`/datacenter/store/store/detail?storeCode=${form.dealerCode}`"
                target="_blank"
              >{{ form.dealerCode }}</el-link>
              <span v-else>{{ form.dealerCode }}</span>
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ form.dealerName }}
            </el-form-item>
            <el-form-item label="公司编码：" prop="parentOrgCode">
              {{ form.parentOrgCode }}
            </el-form-item>
            <el-form-item label="公司名称：" prop="parentOrgName">
              {{ form.parentOrgName }}
            </el-form-item>
            <el-form-item label="月度：" prop="month">
              {{ form.month }}
            </el-form-item>
            <el-form-item label="收款方式：" prop="paymentMethodLabel">
              {{ form.paymentMethodLabel }}
            </el-form-item>
            <el-form-item class="form-item-full" label="备注：" prop="remark">
              {{ form.remark }}
            </el-form-item>
          </el-form>

          <div class="common-section-sub-header">
            <h3>金额信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="工时金额：" prop="workHourTotal">
              <el-input placeholder="" :value="form.workHourTotal" clearable disabled />
            </el-form-item>
            <el-form-item label="零件总额：" prop="partTotal">
              <el-input placeholder="" :value="form.partTotal" clearable disabled />
            </el-form-item>
            <el-form-item label="其他总额：" prop="otherTotal">
              <el-input placeholder="" :value="form.otherTotal" clearable disabled />
            </el-form-item>
            <el-form-item label="总金额：" prop="totalAmount">
              <el-input placeholder="" :value="form.totalAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="追溯金额：" prop="tracebackAmount">
              <el-input placeholder="" :value="form.tracebackAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="判定金额：" prop="determineAmount">
              <el-input placeholder="" :value="form.determineAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="开票金额一（13%）：" prop="invoiceAmount13">
              <el-input placeholder="" :value="form.invoiceAmount13" clearable disabled />
            </el-form-item>
            <el-form-item label="开票金额二（6%）：" prop="invoiceAmount6">
              <el-input placeholder="" :value="form.invoiceAmount6" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="工时金额：" prop="workHourTotal">
              {{ form.workHourTotal }}
            </el-form-item>
            <el-form-item label="零件总额：" prop="partTotal">
              {{ form.partTotal }}
            </el-form-item>
            <el-form-item label="其他总额：" prop="otherTotal">
              {{ form.otherTotal }}
            </el-form-item>
            <el-form-item label="总金额：" prop="totalAmount">
              {{ form.totalAmount }}
            </el-form-item>
            <el-form-item label="追溯金额：" prop="tracebackAmount">
              {{ form.tracebackAmount }}
            </el-form-item>
            <el-form-item label="判定金额：" prop="determineAmount">
              {{ form.determineAmount }}
            </el-form-item>
            <el-form-item label="开票金额一（13%）：" prop="invoiceAmount13">
              {{ form.invoiceAmount13 }}
            </el-form-item>
            <el-form-item label="开票金额二（6%）：" prop="invoiceAmount6">
              {{ form.invoiceAmount6 }}
            </el-form-item>
          </el-form>

          <div class="common-section-sub-header">
            <h3>金额分类汇总</h3>
          </div>
          <AmountSummaryTable :_id="_id" />
        </div>
      </section>

      <!-- 状态信息 -->
      <section class="common-section">
        <div class="common-section-header">
          <h2>状态信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="门店验证人：" prop="dealerVerifierName">
              <el-input placeholder="" v-model="form.dealerVerifierName" clearable disabled />
            </el-form-item>
            <el-form-item label="门店验证时间：" prop="dealerVerifyTime">
              <el-date-picker
                disabled
                v-model="form.dealerVerifyTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="完成开票人：" prop="invoiceCompleterName">
              <el-input placeholder="" v-model="form.invoiceCompleterName" clearable disabled />
            </el-form-item>
            <el-form-item label="完成开票时间：" prop="invoiceCompleteTime">
              <el-date-picker
                disabled
                v-model="form.invoiceCompleteTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发票验收人：" prop="invoiceCheckerName">
              <el-input placeholder="" v-model="form.invoiceCheckerName" clearable disabled />
            </el-form-item>
            <el-form-item label="发票验收时间：" prop="invoiceCheckTime">
              <el-date-picker
                disabled
                v-model="form.invoiceCheckTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="付款确认人：" prop="paymentConfirmerName">
              <el-input placeholder="" v-model="form.paymentConfirmerName" clearable disabled />
            </el-form-item>
            <el-form-item label="付款确认时间：" prop="paymentConfirmTime">
              <el-date-picker
                disabled
                v-model="form.paymentConfirmTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="form-item-full" label="完成开票说明：" prop="invoiceCompleteDesc">
              <el-input type="textarea" v-model="form.invoiceCompleteDesc" clearable disabled />
            </el-form-item>
            <el-form-item class="form-item-full" label="发票验收说明：" prop="invoiceCheckDesc">
              <el-input type="textarea" v-model="form.invoiceCheckDesc" clearable disabled />
            </el-form-item>
            <el-form-item class="form-item-full" label="付款确认说明：" prop="paymentConfirmDesc">
              <el-input type="textarea" v-model="form.paymentConfirmDesc" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="门店验证人：" prop="dealerVerifierName">
              {{ form.dealerVerifierName }}
            </el-form-item>
            <el-form-item label="门店验证时间：" prop="dealerVerifyTime">
              {{ form.dealerVerifyTime }}
            </el-form-item>
            <el-form-item label="完成开票人：" prop="invoiceCompleterName">
              {{ form.invoiceCompleterName }}
            </el-form-item>
            <el-form-item label="完成开票时间：" prop="invoiceCompleteTime">
              {{ form.invoiceCompleteTime }}
            </el-form-item>
            <el-form-item label="发票验收人：" prop="invoiceCheckerName">
              {{ form.invoiceCheckerName }}
            </el-form-item>
            <el-form-item label="发票验收时间：" prop="invoiceCheckTime">
              {{ form.invoiceCheckTime }}
            </el-form-item>
            <el-form-item label="付款确认人：" prop="paymentConfirmerName">
              {{ form.paymentConfirmerName }}
            </el-form-item>
            <el-form-item label="付款确认时间：" prop="paymentConfirmTime">
              {{ form.paymentConfirmTime }}
            </el-form-item>
            <el-form-item class="form-item-full" label="完成开票说明：" prop="invoiceCompleteDesc">
              {{ form.invoiceCompleteDesc }}
            </el-form-item>
            <el-form-item class="form-item-full" label="发票验收说明：" prop="invoiceCheckDesc">
              {{ form.invoiceCheckDesc }}
            </el-form-item>
            <el-form-item class="form-item-full" label="付款确认说明：" prop="paymentConfirmDesc">
              {{ form.paymentConfirmDesc }}
            </el-form-item>
          </el-form>
        </div>
      </section>

      <!-- 发票信息 -->
      <section class="common-section">
        <div class="common-section-header">
          <h2>发票信息</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-sub-header">
            <h3>基础信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm4" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="快递公司：" prop="expressCompany">
              <el-input placeholder="" v-model="form.expressCompany" clearable disabled />
            </el-form-item>
            <el-form-item label="邮寄时间：" prop="expressTime">
              <el-date-picker
                disabled
                v-model="form.expressTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="快递单号：" prop="expressCode">
              <el-input placeholder="" v-model="form.expressCode" clearable disabled />
            </el-form-item>
            <el-form-item label="开户银行：" prop="invoiceBank">
              <el-input placeholder="" v-model="form.invoiceBank" clearable disabled />
            </el-form-item>
            <el-form-item label="税号：" prop="invoiceTaxNo">
              <el-input placeholder="" v-model="form.invoiceTaxNo" clearable disabled />
            </el-form-item>
            <el-form-item label="开户账号：" prop="invoiceAccount">
              <el-input placeholder="" v-model="form.invoiceAccount" clearable disabled />
            </el-form-item>
            <el-form-item label="开票电话：" prop="invoiceTel">
              <el-input placeholder="" v-model="form.invoiceTel" clearable disabled />
            </el-form-item>
            <el-form-item label="银行户主：" prop="invoiceAccountName">
              <el-input placeholder="" v-model="form.invoiceAccountName" clearable disabled />
            </el-form-item>
            <el-form-item class="form-item-full" label="开票地址：" prop="invoiceAddress">
              <el-input type="textarea" v-model="form.invoiceAddress" clearable disabled />
            </el-form-item>
            <el-form-item class="form-item-full" label="开票说明：" prop="invoiceDesc">
              <el-input type="textarea" v-model="form.invoiceDesc" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="快递公司：" prop="expressCompany">
              {{ form.expressCompany }}
            </el-form-item>
            <el-form-item label="邮寄时间：" prop="expressTime">
              {{ form.expressTime }}
            </el-form-item>
            <el-form-item label="快递单号：" prop="expressCode">
              {{ form.expressCode }}
            </el-form-item>
            <el-form-item label="开户银行：" prop="invoiceBank">
              {{ form.invoiceBank }}
            </el-form-item>
            <el-form-item label="税号：" prop="invoiceTaxNo">
              {{ form.invoiceTaxNo }}
            </el-form-item>
            <el-form-item label="开户账号：" prop="invoiceAccount">
              {{ form.invoiceAccount }}
            </el-form-item>
            <el-form-item label="开票电话：" prop="invoiceTel">
              {{ form.invoiceTel }}
            </el-form-item>
            <el-form-item label="银行户主：" prop="invoiceAccountName">
              {{ form.invoiceAccountName }}
            </el-form-item>
            <el-form-item class="form-item-full" label="开票地址：" prop="invoiceAddress">
              {{ form.invoiceAddress }}
            </el-form-item>
            <el-form-item class="form-item-full" label="开票说明：" prop="invoiceDesc">
              {{ form.invoiceDesc }}
            </el-form-item>
          </el-form>

          <div class="common-section-sub-header">
            <h3>开票信息</h3>
          </div>
          <InvoiceInfoTable :_id="_id" @success="invoiceSuccess" />

          <div class="common-section-sub-header">
            <h3>发票附件</h3>
          </div>
          <div>
            <AttachmentList
              ref="attachmentListRef"
              :business-id="_id"
              config-code="mcs_settleaccount"
              type="card"
              :readonly="true"
              />
          </div>
        </div>
      </section>

      <!-- 通知书明细 -->
      <section class="common-section">
        <div class="common-section-header">
          <h2>通知书明细 <el-button style="margin-left: 8px;" v-if="permissions.has('AISCR-warrantySettle-detailExport')" plain size="small" :loading="exportLoading" @click="exportNoticeExcel">通知书明细导出</el-button></h2>
        </div>
        <div class="common-section-body">
          <NoticeDetailTable :_id="_id" />
        </div>
      </section>

      <!-- 追溯明细 -->
      <section class="common-section">
        <div class="common-section-header">
          <h2>追溯明细 <el-button style="margin-left: 8px;" v-if="permissions.has('AISCR-warrantySettle-trackDetailExport')" plain size="small" :loading="exportLoading" @click="exportTraceExcel">追溯明细导出</el-button></h2>
        </div>
        <div class="common-section-body">
          <TraceDetailTable :_id="_id" />
        </div>
      </section>
    </el-main>
  </edit-base-container>
  <CompleteDialog
    :visible.sync="completeDialogVisible"
    :id="currentRowId"
    :detailData="form"
    :payment-method="form.paymentMethod"
    @success="handleDialogSuccess"
  />
  <InvoiceAcceptDialog
    :visible.sync="invoiceAcceptDialogVisible"
    :id="currentRowId"
    :payment-method="form.paymentMethod"
    @success="handleDialogSuccess"
  />
  <InvoiceReturnDialog
    :visible.sync="invoiceReturnDialogVisible"
    :id="currentRowId"
    @success="handleDialogSuccess"
  />
  <PayConfirmDialog
    :visible.sync="payConfirmDialogVisible"
    :ids="[currentRowId]"
    :payment-method="form.paymentMethod"
    @success="handleDialogSuccess"
  />
</div>
</template>

<script>
import { getDetail, confirm, addOrUpdate } from '@/api/claimreturn/claim/warrantysettle/index';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AmountSummaryTable from './components/AmountSummaryTable';
import InvoiceInfoTable from './components/InvoiceInfoTable';
import NoticeDetailTable from './components/NoticeDetailTable';
import TraceDetailTable from './components/TraceDetailTable';
import AttachmentList from '@/libs/components/AttachmentList';
import CompleteDialog from './components/CompleteDialog';
import InvoiceAcceptDialog from './components/InvoiceAcceptDialog';
import InvoiceReturnDialog from './components/InvoiceReturnDialog';
import PayConfirmDialog from './components/PayConfirmDialog';
import { exportTable } from '@/api/common';
import { downloadExcel } from '@/libs/utils';

const defaultForm = {
  id: '',
  settleCode: '',
  settleStatus: '',
  settleStatusLabel: '',
  dealerCode: '',
  dealerName: '',
  companyCode: '',
  companyName: '',
  month: '',
  paymentMethod: '',
  paymentMethodLabel: '',
  remark: '',
  workHourTotal: '',
  tracebackAmount: '',
  partTotal: '',
  determineAmount: '',
  otherTotal: '',
  totalAmount: '',
  invoiceAmount13: '',
  invoiceAmount6: '',
  dealerVerifierName: '',
  dealerVerifyTime: '',
  invoiceCompleterName: '',
  invoiceCompleteTime: '',
  invoiceCompleteDesc: '',
  invoiceCheckerName: '',
  invoiceCheckTime: '',
  invoiceCheckDesc: '',
  paymentConfirmerName: '',
  paymentConfirmTime: '',
  paymentConfirmDesc: '',
  expressCompany: '',
  expressTime: '',
  expressCode: '',
  invoiceBank: '',
  invoiceTaxNo: '',
  invoiceDesc: '',
  invoiceAccount: '',
  invoiceTel: '',
  invoiceAccountName: '',
  invoiceAddress: '',
};

export default {
  name: 'warrantySettleEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    AmountSummaryTable,
    InvoiceInfoTable,
    NoticeDetailTable,
    TraceDetailTable,
    AttachmentList,
    CompleteDialog,
    InvoiceAcceptDialog,
    InvoiceReturnDialog,
    PayConfirmDialog,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修结算通知书：' + (this.form.settleCode || '');
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
      pageTitle: '保修结算通知书',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantySettle',
      loading: false,
      submitLoading: false,
      confirmLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
      },
      // 操作按钮权限
      canConfirm: false,
      canComplete: false,
      canInvoiceAccept: false,
      canInvoiceReturn: false,
      canPayConfirm: false,
      // 对话框状态
      currentRowId: '',
      completeDialogVisible: false,
      invoiceAcceptDialogVisible: false,
      invoiceReturnDialogVisible: false,
      payConfirmDialogVisible: false,
      exportLoading: false,
      noticeTitleMap: {
        warrantyApplyNo: '保修申请单',
        warrantyTypeName: '保修类型',
        vin: 'VIN',
        workHourTotal: '工时总额',
        partTotal: '零件总额',
        otherTotal: '其他总额',
        totalAmount: '总金额',
        determineAmount: '判定金额'
      },
      traceTitleMap: {
        traceDetailCode: '追溯明细',
        traceTypeLabel: '追溯类型',
        businessCode: '业务单据',
        warrantyCode: '保修申请单',
        vin: 'VIN',
        currentTraceAmount: '本次追溯金额'
      },
    };
  },
  created () {
    this.canConfirm = this.permissions.has(`${this.moduleKey}-confirm`);
    this.canComplete = this.permissions.has(`${this.moduleKey}-completeInvoice`);
    this.canInvoiceAccept = this.permissions.has(`${this.moduleKey}-acceptInvoice`);
    this.canInvoiceReturn = this.permissions.has(`${this.moduleKey}-returnInvoice`);
    this.canPayConfirm = this.permissions.has(`${this.moduleKey}-confirmPay`);
  },
  methods: {
    // 导出通知书明细
    exportNoticeExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '通知书明细',
        dataFetchPath: 'claimreturn/claim/web/warrantysettle/warrantySettleClaimDetail/page',
        reqParams: { settleId: this._id },
        titleMap: this.noticeTitleMap,
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '通知书明细.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    // 导出追溯明细
    exportTraceExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '追溯明细',
        dataFetchPath: 'claimreturn/claim/web/claimtrace/claimTraceOrderDetail/page',
        reqParams: { settleAccountId: this._id },
        titleMap: this.traceTitleMap,
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '追溯明细.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({
        remark: this.form.remark,
        id: this._id
      });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    // 确认
    handleConfirm () {
      this.$confirm('确认保修结算通知书?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmLoading = true;
        confirm(this._id).then(() => {
          this.$message.success('确认成功');
          this.$refs.containerRef.loadDetail();
        }).finally(() => {
          this.confirmLoading = false;
        });
      }).catch(() => {});
    },
    // 开票完成
    handleComplete () {
      this.currentRowId = this._id;
      this.completeDialogVisible = true;
    },
    // 发票验收
    handleInvoiceAccept () {
      this.currentRowId = this._id;
      this.invoiceAcceptDialogVisible = true;
    },
    // 发票退回
    handleInvoiceReturn () {
      this.currentRowId = this._id;
      this.invoiceReturnDialogVisible = true;
    },
    // 确认付款
    handlePayConfirm () {
      this.currentRowId = this._id;
      this.payConfirmDialogVisible = true;
    },
    // 对话框成功回调
    handleDialogSuccess () {
      this.$refs.containerRef.loadDetail();
    },
    invoiceSuccess () {
      this.$refs.attachmentListRef?.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
.common-section-sub-header {
  display: flex;
  margin-bottom: 8px;
  width: 100%;
  h3 {
    color: #0A0E0A;
    font-size: 14px;
    font-weight: 500;
    line-height: 30px;
    margin-right: 15px;
  }
}
</style>
