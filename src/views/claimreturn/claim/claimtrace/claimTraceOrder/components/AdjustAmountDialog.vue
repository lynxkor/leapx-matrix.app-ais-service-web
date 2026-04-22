<template>
  <el-dialog
    title="调整追溯金额"
    width="900px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <div class="page-common-edit">
      <section class="common-section">
        <el-form inline :model="form" :rules="rules" ref="ruleForm" label-width="140px" style="padding-right: 16px;">
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
              v-model="form.planTraceAmount"
              placeholder="请输入"
            />
            <el-input v-else :value="autoCalcAmount" disabled />
          </el-form-item>
          <el-form-item prop="adjustReason" label="金额调整原因：">
            <el-input type="textarea" v-model="form.adjustReason" placeholder="请输入" :rows="1" />
          </el-form-item>
        </el-form>
        <div class="detail-table-wrapper" v-show="calcMode === 'auto'">
          <h4 class="table-title">工时列表</h4>
          <vxe-table
            ref="workhourTableRef"
            :data="workhourList"
            stripe
            show-overflow
            resizable
            border="inner"
            size="medium"
            min-height="0px"
            max-height="200px"
            :checkbox-config="{ checkField: 'checked' }"
            @checkbox-change="handleCheckboxChange"
            @checkbox-all="handleCheckboxChange"
          >
            <vxe-column type="checkbox" width="50" />
            <vxe-column field="repairItemCode" title="工时代码" min-width="150" />
            <vxe-column field="repairItemName" title="工时名称" min-width="150" />
            <vxe-column field="totalCostAmount" title="总金额" min-width="120" />
          </vxe-table>

          <h4 class="table-title">零件列表</h4>
          <vxe-table
            ref="partTableRef"
            :data="partList"
            stripe
            show-overflow
            resizable
            border="inner"
            size="medium"
            min-height="0px"
            max-height="200px"
            :checkbox-config="{ checkField: 'checked' }"
            @checkbox-change="handleCheckboxChange"
            @checkbox-all="handleCheckboxChange"
          >
            <vxe-column type="checkbox" width="50" />
            <vxe-column field="partCode" title="零件代码" min-width="150" />
            <vxe-column field="partName" title="零件名称" min-width="150" />
            <vxe-column field="totalCostAmount" title="总金额" min-width="120" />
          </vxe-table>

          <h4 class="table-title">其他列表</h4>
          <vxe-table
            ref="otherTableRef"
            :data="otherList"
            stripe
            show-overflow
            resizable
            border="inner"
            size="medium"
            min-height="0px"
            max-height="200px"
            :checkbox-config="{ checkField: 'checked' }"
            @checkbox-change="handleCheckboxChange"
            @checkbox-all="handleCheckboxChange"
          >
            <vxe-column type="checkbox" width="50" />
            <vxe-column field="repairItemCode" title="其他代码" min-width="150" />
            <vxe-column field="repairItemName" title="其他名称" min-width="150" />
            <vxe-column field="totalCostAmount" title="总金额" min-width="120" />
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
import { adjustTraceAmount, getWorkhourPage, getPartPage, getOtherPage } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';

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
        planTraceAmount: '',
        adjustReason: '',
        selectedDetailIds: [],
      },
      calcMode: 'auto',
      workhourList: [],
      partList: [],
      otherList: [],
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        adjustReason: [{ required: true, message: '请输入金额调整原因', trigger: 'change' }],
      },
    };
  },
  computed: {
    originalAmount () {
      return this.formData.planTraceAmount || 0;
    },
    autoCalcAmount () {
      const sum = (list) => list.filter(item => item.checked).reduce((s, item) => s + (Number(item.totalCostAmount) || 0), 0);
      return sum(this.workhourList) + sum(this.partList) + sum(this.otherList);
    },
    finalAmount () {
      return this.calcMode === 'auto' ? this.autoCalcAmount : this.form.planTraceAmount;
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.id = this.traceOrderId;
        this.form.planTraceAmount = '';
        this.form.adjustReason = '';
        this.form.selectedDetailIds = [];
        this.calcMode = 'auto';
        this.loadAllLists();
      }
    }
  },
  methods: {
    loadAllLists () {
      if (!this.formData.warrantyId) return;
      const params = { applyId: this.formData.warrantyId, pageSize: 999, page: 1 };
      Promise.all([
        getWorkhourPage(params),
        getPartPage(params),
        getOtherPage(params)
      ]).then(([workhourRes, partRes, otherRes]) => {
        this.workhourList = (workhourRes.records || []).map(item => ({ ...item, checked: true }));
        this.partList = (partRes.records || []).map(item => ({ ...item, checked: true }));
        this.otherList = (otherRes.records || []).map(item => ({ ...item, checked: true }));
      });
    },
    handleCalcModeChange (mode) {
      if (mode === 'auto') {
        this.form.planTraceAmount = this.autoCalcAmount;
      } else {
        this.form.planTraceAmount = this.autoCalcAmount;
      }
    },
    handleCheckboxChange () {
      // checkbox变化触发autoCalcAmount重新计算
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
          planTraceAmount: amount,
          adjustReason: this.form.adjustReason,
        };
        if (this.calcMode === 'auto') {
          params.selectedDetailIds = [
            ...this.workhourList.filter(i => i.checked).map(i => i.id),
            ...this.partList.filter(i => i.checked).map(i => i.id),
            ...this.otherList.filter(i => i.checked).map(i => i.id)
          ];
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
.table-title {
  margin: 12px 0 8px;
  font-size: 14px;
  font-weight: 600;
}
</style>
