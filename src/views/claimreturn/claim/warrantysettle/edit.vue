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
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="结算单号：" prop="settleCode">
              <el-input placeholder="" v-model="form.settleCode" clearable disabled />
            </el-form-item>
            <el-form-item label="结算状态：" prop="settleStatusLabel">
              <el-input placeholder="" v-model="form.settleStatusLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-input placeholder="" v-model="form.dealerCode" clearable disabled />
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              <el-input placeholder="" v-model="form.dealerName" clearable disabled />
            </el-form-item>
            <el-form-item label="服务月份：" prop="month">
              <el-input placeholder="" v-model="form.month" clearable disabled />
            </el-form-item>
            <el-form-item label="付款方式：" prop="paymentMethodLabel">
              <el-input placeholder="" v-model="form.paymentMethodLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="上级组织：" prop="parentOrgName">
              <el-input placeholder="" v-model="form.parentOrgName" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="结算单号：" prop="settleCode">
              {{ form.settleCode }}
            </el-form-item>
            <el-form-item label="结算状态：" prop="settleStatusLabel">
              {{ form.settleStatusLabel }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ form.dealerCode }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ form.dealerName }}
            </el-form-item>
            <el-form-item label="服务月份：" prop="month">
              {{ form.month }}
            </el-form-item>
            <el-form-item label="付款方式：" prop="paymentMethodLabel">
              {{ form.paymentMethodLabel }}
            </el-form-item>
            <el-form-item label="上级组织：" prop="parentOrgName">
              {{ form.parentOrgName }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>金额信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="工时费合计：" prop="workHourTotal">
              <el-input placeholder="" :value="form.workHourTotal | formatAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="备件费合计：" prop="partTotal">
              <el-input placeholder="" :value="form.partTotal | formatAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="其他费用合计：" prop="otherTotal">
              <el-input placeholder="" :value="form.otherTotal | formatAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="总金额：" prop="totalAmount">
              <el-input placeholder="" :value="form.totalAmount | formatAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="追溯金额：" prop="tracebackAmount">
              <el-input placeholder="" :value="form.tracebackAmount | formatAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="判定金额：" prop="determineAmount">
              <el-input placeholder="" :value="form.determineAmount | formatAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="13%发票金额：" prop="invoiceAmount13">
              <el-input placeholder="" :value="form.invoiceAmount13 | formatAmount" clearable disabled />
            </el-form-item>
            <el-form-item label="6%发票金额：" prop="invoiceAmount6">
              <el-input placeholder="" :value="form.invoiceAmount6 | formatAmount" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="工时费合计：" prop="workHourTotal">
              {{ form.workHourTotal | formatAmount }}
            </el-form-item>
            <el-form-item label="备件费合计：" prop="partTotal">
              {{ form.partTotal | formatAmount }}
            </el-form-item>
            <el-form-item label="其他费用合计：" prop="otherTotal">
              {{ form.otherTotal | formatAmount }}
            </el-form-item>
            <el-form-item label="总金额：" prop="totalAmount">
              {{ form.totalAmount | formatAmount }}
            </el-form-item>
            <el-form-item label="追溯金额：" prop="tracebackAmount">
              {{ form.tracebackAmount | formatAmount }}
            </el-form-item>
            <el-form-item label="判定金额：" prop="determineAmount">
              {{ form.determineAmount | formatAmount }}
            </el-form-item>
            <el-form-item label="13%发票金额：" prop="invoiceAmount13">
              {{ form.invoiceAmount13 | formatAmount }}
            </el-form-item>
            <el-form-item label="6%发票金额：" prop="invoiceAmount6">
              {{ form.invoiceAmount6 | formatAmount }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>开票信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="开票银行：" prop="invoiceBank">
              <el-input placeholder="" v-model="form.invoiceBank" clearable disabled />
            </el-form-item>
            <el-form-item label="开票账号：" prop="invoiceAccount">
              <el-input placeholder="" v-model="form.invoiceAccount" clearable disabled />
            </el-form-item>
            <el-form-item label="开票户名：" prop="invoiceAccountName">
              <el-input placeholder="" v-model="form.invoiceAccountName" clearable disabled />
            </el-form-item>
            <el-form-item label="开票税号：" prop="invoiceTaxNo">
              <el-input placeholder="" v-model="form.invoiceTaxNo" clearable disabled />
            </el-form-item>
            <el-form-item label="开票电话：" prop="invoiceTel">
              <el-input placeholder="" v-model="form.invoiceTel" clearable disabled />
            </el-form-item>
            <el-form-item label="开票地址：" prop="invoiceAddress">
              <el-input placeholder="" v-model="form.invoiceAddress" clearable disabled />
            </el-form-item>
            <el-form-item class="form-item-full" label="开票备注：" prop="invoiceDesc">
              <el-input type="textarea" v-model="form.invoiceDesc" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="开票银行：" prop="invoiceBank">
              {{ form.invoiceBank }}
            </el-form-item>
            <el-form-item label="开票账号：" prop="invoiceAccount">
              {{ form.invoiceAccount }}
            </el-form-item>
            <el-form-item label="开票户名：" prop="invoiceAccountName">
              {{ form.invoiceAccountName }}
            </el-form-item>
            <el-form-item label="开票税号：" prop="invoiceTaxNo">
              {{ form.invoiceTaxNo }}
            </el-form-item>
            <el-form-item label="开票电话：" prop="invoiceTel">
              {{ form.invoiceTel }}
            </el-form-item>
            <el-form-item label="开票地址：" prop="invoiceAddress">
              {{ form.invoiceAddress }}
            </el-form-item>
            <el-form-item class="form-item-full" label="开票备注：" prop="invoiceDesc">
              {{ form.invoiceDesc }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>操作记录</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm4" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="门店审核人：" prop="dealerVerifierName">
              <el-input placeholder="" v-model="form.dealerVerifierName" clearable disabled />
            </el-form-item>
            <el-form-item label="门店审核时间：" prop="dealerVerifyTime">
              <el-date-picker
                disabled
                v-model="form.dealerVerifyTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="开票完成人：" prop="invoiceCompleterName">
              <el-input placeholder="" v-model="form.invoiceCompleterName" clearable disabled />
            </el-form-item>
            <el-form-item label="开票完成时间：" prop="invoiceCompleteTime">
              <el-date-picker
                disabled
                v-model="form.invoiceCompleteTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="form-item-full" label="开票完成说明：" prop="invoiceCompleteDesc">
              <el-input type="textarea" v-model="form.invoiceCompleteDesc" clearable disabled />
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
            <el-form-item class="form-item-full" label="发票验收说明：" prop="invoiceCheckDesc">
              <el-input type="textarea" v-model="form.invoiceCheckDesc" clearable disabled />
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
            <el-form-item class="form-item-full" label="付款确认说明：" prop="paymentConfirmDesc">
              <el-input type="textarea" v-model="form.paymentConfirmDesc" clearable disabled />
            </el-form-item>
            <el-form-item label="快递公司：" prop="expressCompany">
              <el-input placeholder="" v-model="form.expressCompany" clearable disabled />
            </el-form-item>
            <el-form-item label="快递时间：" prop="expressTime">
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
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="门店审核人：" prop="dealerVerifierName">
              {{ form.dealerVerifierName }}
            </el-form-item>
            <el-form-item label="门店审核时间：" prop="dealerVerifyTime">
              {{ form.dealerVerifyTime }}
            </el-form-item>
            <el-form-item label="开票完成人：" prop="invoiceCompleterName">
              {{ form.invoiceCompleterName }}
            </el-form-item>
            <el-form-item label="开票完成时间：" prop="invoiceCompleteTime">
              {{ form.invoiceCompleteTime }}
            </el-form-item>
            <el-form-item class="form-item-full" label="开票完成说明：" prop="invoiceCompleteDesc">
              {{ form.invoiceCompleteDesc }}
            </el-form-item>
            <el-form-item label="发票验收人：" prop="invoiceCheckerName">
              {{ form.invoiceCheckerName }}
            </el-form-item>
            <el-form-item label="发票验收时间：" prop="invoiceCheckTime">
              {{ form.invoiceCheckTime }}
            </el-form-item>
            <el-form-item class="form-item-full" label="发票验收说明：" prop="invoiceCheckDesc">
              {{ form.invoiceCheckDesc }}
            </el-form-item>
            <el-form-item label="付款确认人：" prop="paymentConfirmerName">
              {{ form.paymentConfirmerName }}
            </el-form-item>
            <el-form-item label="付款确认时间：" prop="paymentConfirmTime">
              {{ form.paymentConfirmTime }}
            </el-form-item>
            <el-form-item class="form-item-full" label="付款确认说明：" prop="paymentConfirmDesc">
              {{ form.paymentConfirmDesc }}
            </el-form-item>
            <el-form-item label="快递公司：" prop="expressCompany">
              {{ form.expressCompany }}
            </el-form-item>
            <el-form-item label="快递时间：" prop="expressTime">
              {{ form.expressTime }}
            </el-form-item>
            <el-form-item label="快递单号：" prop="expressCode">
              {{ form.expressCode }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>系统信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm5" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="创建时间：" prop="createTime">
              <el-date-picker
                disabled
                v-model="form.createTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="更新时间：" prop="updateTime">
              <el-date-picker
                disabled
                v-model="form.updateTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="form-item-full" label="备注：" prop="remark">
              <el-input type="textarea" v-model="form.remark" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="创建时间：" prop="createTime">
              {{ form.createTime }}
            </el-form-item>
            <el-form-item label="更新时间：" prop="updateTime">
              {{ form.updateTime }}
            </el-form-item>
            <el-form-item class="form-item-full" label="备注：" prop="remark">
              {{ form.remark }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </el-main>
  </edit-base-container>
</template>

<script>
import { getDetail } from '@/api/claimreturn/claim/warrantysettle/index';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  settleCode: '',
  settleStatusLabel: '',
  dealerCode: '',
  dealerName: '',
  month: '',
  paymentMethodLabel: '',
  parentOrgName: '',
  workHourTotal: '',
  partTotal: '',
  otherTotal: '',
  totalAmount: '',
  tracebackAmount: '',
  determineAmount: '',
  invoiceAmount13: '',
  invoiceAmount6: '',
  invoiceBank: '',
  invoiceAccount: '',
  invoiceAccountName: '',
  invoiceTaxNo: '',
  invoiceTel: '',
  invoiceAddress: '',
  invoiceDesc: '',
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
  createTime: '',
  updateTime: '',
  remark: '',
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
      moduleKey: 'AISCR-warrantysettle',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
      },
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return Promise.resolve();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
  }
};
</script>
