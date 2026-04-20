<template>
  <el-dialog
    title="调整追溯金额"
    width="900px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="140px" class="form-edit" style="padding-right: 16px;">
          <el-form-item label="计算模式：">
            <el-radio-group v-model="calcMode" @change="handleCalcModeChange">
              <el-radio label="auto">按明细自动计算</el-radio>
              <el-radio label="manual">直接调整总金额</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原追溯金额：">
            <el-input :value="originalAmount" disabled />
          </el-form-item>
          <el-form-item label="修改后追溯金额：">
            <el-input
              v-if="calcMode === 'manual'"
              v-model="form.adjustedAmount"
              placeholder="请输入"
              @input="handleManualAmountInput"
            />
            <el-input v-else :value="autoCalcAmount" disabled />
          </el-form-item>
          <el-form-item prop="adjustReason" class="form-item-full" label="金额调整原因：">
            <el-input type="textarea" v-model="form.adjustReason" placeholder="请输入" :rows="2" />
          </el-form-item>
        </el-form>
        <div class="detail-table-wrapper" v-show="calcMode === 'auto'">
          <vxe-table
            ref="detailTableRef"
            :data="detailList"
            stripe
            show-overflow
            resizable
            border="inner"
            size="medium"
            max-height="300px"
            :checkbox-config="{ checkField: 'checked' }"
            @checkbox-change="handleCheckboxChange"
            @checkbox-all="handleCheckboxChange"
          >
            <vxe-column type="checkbox" width="50" />
            <vxe-column field="detailCode" title="明细编号" min-width="150" />
            <vxe-column field="warrantyCode" title="保修申请单" min-width="150" />
            <vxe-column field="warrantySettleCode" title="保修结算单" min-width="150" />
            <vxe-column field="traceAmount" title="追溯金额" min-width="120" />
          </vxe-table>
        </div>
      </section>
    </div>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { adjustTraceAmount } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import { listUnprocessedDetails } from '@/api/claimreturn/claim/warrantyapply/index';

export default {
  name: 'AdjustAmountDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    traceOrderId: {
      type: [String, Number],
      default: ''
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      form: {
        id: '',
        adjustedAmount: '',
        adjustReason: '',
        selectedDetailIds: [],
      },
      calcMode: 'auto',
      detailList: [],
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        adjustReason: [{ required: true, message: '请输入金额调整原因', trigger: 'blur' }],
      },
    };
  },
  computed: {
    originalAmount () {
      return this.formData.planTraceAmount || 0;
    },
    autoCalcAmount () {
      const checked = this.detailList.filter(item => item.checked);
      return checked.reduce((sum, item) => sum + (Number(item.traceAmount) || 0), 0);
    },
    finalAmount () {
      return this.calcMode === 'auto' ? this.autoCalcAmount : this.form.adjustedAmount;
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.id = this.traceOrderId;
        this.form.adjustedAmount = '';
        this.form.adjustReason = '';
        this.form.selectedDetailIds = [];
        this.calcMode = 'auto';
        this.loadDetailList();
      }
    }
  },
  methods: {
    loadDetailList () {
      if (!this.formData.warrantyId) return;
      listUnprocessedDetails({ warrantyApplyId: this.formData.warrantyId }).then(res => {
        this.detailList = (res || []).map(item => ({
          ...item,
          checked: true,
        }));
      });
    },
    handleCalcModeChange (mode) {
      if (mode === 'auto') {
        this.form.adjustedAmount = this.autoCalcAmount;
      }
    },
    handleCheckboxChange () {
      // 自动模式下切换到手工时金额同步
    },
    handleManualAmountInput (val) {
      this.form.adjustedAmount = val;
    },
    close () {
      this.$emit('update:visible', false);
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        const amount = this.finalAmount;
        if (!amount || Number(amount) <= 0) {
          this.$message.warning('追溯金额必需大于0');
          return;
        }
        this.submitLoading = true;
        const params = {
          id: this.form.id,
          adjustedAmount: amount,
          adjustReason: this.form.adjustReason,
        };
        if (this.calcMode === 'auto') {
          const checked = this.detailList.filter(item => item.checked);
          params.selectedDetailIds = checked.map(item => item.id);
        }
        adjustTraceAmount(params).then(() => {
          this.$message.success('调整追溯金额成功');
          this.close();
          this.$emit('success');
        }).finally(() => {
          this.submitLoading = false;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-table-wrapper {
  margin-top: 12px;
}
</style>
