<template>
  <el-dialog
    title="审计驳回"
    :visible="visible"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="提交截止日期：" prop="auditFeedbackDeadline">
        <el-date-picker
          v-model="form.auditFeedbackDeadline"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="deadlinePickerOptions"
        />
      </el-form-item>
      <el-form-item label="错误代码：" prop="errorCodes">
        <fetch-select
          :request="fetchOptions"
          enumCode="warranty_audit_error_type"
          v-model="form.errorCodes"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="扣款计算方式：">
        <el-radio-group v-model="form.calcType" @change="handleCalcTypeChange">
          <el-radio label="auto">自动计算</el-radio>
          <el-radio label="manual">手工调整</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 自动计算页签 -->
      <div v-if="form.calcType === 'auto'" class="deduct-section">
        <el-table :data="autoDeductList" border size="small">
          <el-table-column prop="errorTypeLabel" label="错误代码" width="150" />
          <el-table-column prop="laborDeductRate" label="工时扣款比例(%)" width="150" />
          <el-table-column prop="laborDeduct" label="工时扣款金额" width="150" />
          <el-table-column prop="partDeductRate" label="备件扣款比例(%)" width="150" />
          <el-table-column prop="partDeduct" label="备件扣款金额" width="150" />
          <el-table-column prop="otherDeductRate" label="其他扣款比例(%)" width="150" />
          <el-table-column prop="otherDeduct" label="其他扣款金额" width="150" />
        </el-table>
        <div class="deduct-summary">
          <span>工时扣款合计：{{ formatMoney(form.laborDeduct) }}</span>
          <span>备件扣款合计：{{ formatMoney(form.partDeduct) }}</span>
          <span>其他扣款合计：{{ formatMoney(form.otherDeduct) }}</span>
          <span>计划扣款总金额：{{ formatMoney(form.planDeductTotal) }}</span>
        </div>
      </div>
      <!-- 手工调整页签 -->
      <div v-if="form.calcType === 'manual'" class="deduct-section">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="工时扣款：" prop="laborDeduct">
              <el-input-number
                v-model="form.laborDeduct"
                :min="0"
                :precision="2"
                placeholder="请输入"
                @change="handleManualDeductChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备件扣款：" prop="partDeduct">
              <el-input-number
                v-model="form.partDeduct"
                :min="0"
                :precision="2"
                placeholder="请输入"
                @change="handleManualDeductChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其他扣款：" prop="otherDeduct">
              <el-input-number
                v-model="form.otherDeduct"
                :min="0"
                :precision="2"
                placeholder="请输入"
                @change="handleManualDeductChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="deduct-summary">
          <span>计划扣款总金额：{{ formatMoney(form.planDeductTotal) }}</span>
        </div>
      </div>
      <el-form-item label="金额调整原因：" prop="amountAdjustReason" v-if="form.calcType === 'manual'">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入金额调整原因"
          v-model="form.amountAdjustReason"
        />
      </el-form-item>
      <el-form-item label="审计说明：" prop="auditDesc">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入审计说明"
          v-model="form.auditDesc"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { auditReject, calculateDeduct, getErrorConfigList } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  auditFeedbackDeadline: '',
  errorCodes: [],
  calcType: 'auto',
  laborDeduct: 0,
  partDeduct: 0,
  otherDeduct: 0,
  planDeductTotal: 0,
  amountAdjustReason: '',
  auditDesc: '',
  isAutoCalc: '1',
};

export default {
  name: 'AuditRejectDialog',
  components: {
    FetchSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectionList: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      form: { ...defaultForm },
      autoDeductList: [],
      submitLoading: false,
      rules: {
        errorCodes: [
          { required: true, message: '请选择错误代码', trigger: 'change' }
        ],
        amountAdjustReason: [
          { required: true, message: '请输入金额调整原因', trigger: 'blur' }
        ],
      },
      deadlinePickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.initForm();
      }
    },
    'form.errorCodes': {
      handler (val) {
        if (val && val.length > 0 && this.form.calcType === 'auto') {
          this.calculateAutoDeduct();
        }
      },
      deep: true
    }
  },
  methods: {
    initForm () {
      this.form = { ...defaultForm };
      this.autoDeductList = [];
      // 根据第一条数据的isAutoCalc判断默认显示哪个页签
      if (this.selectionList.length > 0 && this.selectionList[0].isAutoCalc === '0') {
        this.form.calcType = 'manual';
      }
    },
    handleClose () {
      this.$emit('update:visible', false);
    },
    handleCalcTypeChange (val) {
      if (val === 'auto') {
        // 从手工切换到自动，需要重新计算相关金额
        if (this.form.errorCodes && this.form.errorCodes.length > 0) {
          this.calculateAutoDeduct();
        }
      } else if (val === 'manual') {
        // 从自动切换到手工，将自动中的金额覆盖到手工中
        if (this.autoDeductList.length > 0) {
          this.form.laborDeduct = this.autoDeductList.reduce((sum, item) => sum + (item.laborDeduct || 0), 0);
          this.form.partDeduct = this.autoDeductList.reduce((sum, item) => sum + (item.partDeduct || 0), 0);
          this.form.otherDeduct = this.autoDeductList.reduce((sum, item) => sum + (item.otherDeduct || 0), 0);
          this.handleManualDeductChange();
        }
      }
    },
    async calculateAutoDeduct () {
      if (!this.form.errorCodes || this.form.errorCodes.length === 0) {
        return;
      }
      // 获取错误项配置
      const errorConfigRes = await getErrorConfigList({
        errorTypeList: this.form.errorCodes,
        pageNum: 1,
        pageSize: 100,
      });
      const errorConfigList = errorConfigRes.records || [];
      // 获取第一条数据的索赔金额信息
      const firstItem = this.selectionList[0] || {};
      const laborClaimTotal = firstItem.laborClaimTotal || 0;
      const partsClaimTotal = firstItem.partsClaimTotal || 0;
      const otherClaimTotal = firstItem.otherClaimTotal || 0;
      // 计算扣款金额
      this.autoDeductList = errorConfigList.map(config => {
        const laborDeduct = Math.round(laborClaimTotal * (config.laborDeductRate || 0) / 100 * 100) / 100;
        const partDeduct = Math.round(partsClaimTotal * (config.partDeductRate || 0) / 100 * 100) / 100;
        const otherDeduct = Math.round(otherClaimTotal * (config.otherDeductRate || 0) / 100 * 100) / 100;
        return {
          errorType: config.errorType,
          errorTypeLabel: config.errorTypeLabel,
          laborDeductRate: config.laborDeductRate,
          laborDeduct,
          partDeductRate: config.partDeductRate,
          partDeduct,
          otherDeductRate: config.otherDeductRate,
          otherDeduct,
        };
      });
      // 计算汇总金额（相同保修申请单，每个工时/备件/其他分别只能扣款一次，按最高比例）
      this.form.laborDeduct = Math.max(...this.autoDeductList.map(item => item.laborDeduct || 0), 0);
      this.form.partDeduct = Math.max(...this.autoDeductList.map(item => item.partDeduct || 0), 0);
      this.form.otherDeduct = Math.max(...this.autoDeductList.map(item => item.otherDeduct || 0), 0);
      this.handleManualDeductChange();
    },
    handleManualDeductChange () {
      this.form.planDeductTotal = Math.round((this.form.laborDeduct + this.form.partDeduct + this.form.otherDeduct) * 100) / 100;
    },
    formatMoney (value) {
      if (value === null || value === undefined) {
        return '0.00 元';
      }
      return Number(value).toFixed(2) + ' 元';
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 计划扣款总金额必需大于0
          if (this.form.planDeductTotal <= 0) {
            this.$message.warning('计划扣款总金额必需大于0');
            return;
          }
          this.submitLoading = true;
          const ids = this.selectionList.map(item => item.id);
          auditReject({
            ids,
            auditFeedbackDeadline: this.form.auditFeedbackDeadline,
            errorCodes: this.form.errorCodes,
            laborDeduct: this.form.laborDeduct,
            partDeduct: this.form.partDeduct,
            otherDeduct: this.form.otherDeduct,
            planDeductTotal: this.form.planDeductTotal,
            amountAdjustReason: this.form.amountAdjustReason,
            auditDesc: this.form.auditDesc,
            isAutoCalc: this.form.calcType === 'auto' ? '1' : '0',
          }).then(() => {
            this.$message.success('审计驳回成功');
            this.$emit('success');
            this.handleClose();
          }).catch(() => {
            this.$message.error('审计驳回失败');
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.deduct-section {
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}
.deduct-summary {
  margin-top: 10px;
  display: flex;
  gap: 20px;
  font-weight: bold;
}
</style>
