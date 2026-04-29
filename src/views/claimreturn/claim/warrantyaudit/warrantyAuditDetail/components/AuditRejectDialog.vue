<template>
  <el-dialog class="m-start-work-dialog" title="审计驳回" :visible.sync="dialogVisible" width="60%" @close="handleClose">
    <el-form :model="form" :rules="rules" ref="auditForm" label-width="120px" size="small" inline
      label-position="right">
      <!-- 公共信息区域 -->
      <el-form-item label="审计说明：" prop="auditDesc" class="full-width-item">
        <el-input type="textarea" maxlength="500" show-word-limit placeholder="请输入审计说明" v-model="form.auditDesc" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="错误代码：" prop="errorConfigIds">
        <fetch-select :remote-method="getErrorItemList" remote v-model="form.errorConfigIds" placeholder="请选择"
          labelKey="checkItem" valueKey="id" subLabelKey="errorCode" clearable multiple collapseTags filterable
          @change="handleErrorConfigChange" />
      </el-form-item>
      <el-form-item label="提交截止日期：">
        <el-date-picker v-model="form.feedbackDeadline" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          placeholder="选择日期" :picker-options="deadlinePickerOptions" />
      </el-form-item>
      <!-- 2. Tab 切换区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- Tab 1: 自动计算 (只读模式) -->
        <el-tab-pane label="自动计算" name="isAutoCalc">
          <div class="readonly-deducts">
            <span class="label">工时扣款：</span><span class="value">{{ form.laborDeduct }}</span>
            <span class="label">备件扣款：</span><span class="value">{{ form.partDeduct }}</span>
            <span class="label">其他扣款：</span><span class="value">{{ form.otherDeduct }}</span>
          </div>
          <div class="deduct-summary">
            <span>计划扣款总金额：<b>{{ planDeductTotal }}</b></span>
          </div>
        </el-tab-pane>

        <!-- Tab 2: 手工调整 (编辑模式) -->
        <el-tab-pane label="手工调整" name="isManualCalc">
          <el-form-item label="工时扣款：" prop="laborDeduct">
            <el-input v-model="form.laborDeduct" type="number" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="备件扣款：" prop="partDeduct">
            <el-input v-model="form.partDeduct" type="number" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="其他扣款：" prop="otherDeduct">
            <el-input v-model="form.otherDeduct" type="number" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="金额调整原因：" prop="amountAdjustReason">
            <el-input placeholder="请输入金额调整原因" v-model="form.amountAdjustReason" />
          </el-form-item>
          <div class="deduct-summary">
            <span>计划扣款总金额：<b>{{ planDeductTotal }}</b></span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getList as getErrorConfigList } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditErrorConfig/index';
import { auditReject, calculateDeduction } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  errorConfigIds: [],
  laborDeduct: 0,
  partDeduct: 0,
  otherDeduct: 0,
  planDeductTotal: 0,
  amountAdjustReason: '',
  auditDesc: '',
  isAutoCalc: 1,
  feedbackDeadline: '',
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
    id: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      form: { ...defaultForm },
      submitLoading: false,
      dialogVisible: false,
      activeName: 'isAutoCalc',
      rules: {
        auditDesc: [
          { required: true, message: '请输入审计说明' }
        ],
        errorConfigIds: [
          { required: true, message: '请选择错误代码' }
        ],
        amountAdjustReason: [
          { required: true, message: '请输入金额调整原因' }
        ],
      },
      deadlinePickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
    };
  },
  computed: {
    planDeductTotal () {
      const l = Number(this.form.laborDeduct) || 0;
      const p = Number(this.form.partDeduct) || 0;
      const o = Number(this.form.otherDeduct) || 0;
      return Math.round((l + p + o) * 100) / 100;
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form = { ...defaultForm };
        this.activeName = 'isAutoCalc';
        this.$nextTick(() => {
          this.$refs.auditForm.clearValidate();
        });
      }
    },
  },
  methods: {
    handleClose () {
      this.form = { ...defaultForm };
      this.$emit('update:visible', false);
    },
    // 错误代码处理
    async getErrorItemList (query) {
      try {
        const res = await getErrorConfigList({ errorCategoryLike: query || '' });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    handleTabClick () {
      this.$refs.auditForm.clearValidate();
      // 从自动切换到手工：将自动计算的金额覆盖到手工输入框
      if (this.activeName === 'isManualCalc') {
        // 金额已经在 form 中，无需额外处理
      }
      // 从手工切换到自动：重新计算
      if (this.activeName === 'isAutoCalc' && this.form.errorConfigIds.length > 0) {
        this.handleErrorConfigChange();
      }
    },
    // 自动计算金额
    async handleErrorConfigChange () {
      if (!this.form.errorConfigIds || this.form.errorConfigIds.length === 0) {
        this.form.laborDeduct = 0;
        this.form.partDeduct = 0;
        this.form.otherDeduct = 0;
        return;
      }
      const params = {
        detailId: this.id,
        errorConfigIds: this.form.errorConfigIds,
      };
      const res = await calculateDeduction(params);
      this.form.laborDeduct = res.laborDeduct || 0;
      this.form.partDeduct = res.partDeduct || 0;
      this.form.otherDeduct = res.otherDeduct || 0;
    },
    handleSubmit () {
      // 手工模式校验
      if (this.activeName === 'isManualCalc') {
        this.rules.amountAdjustReason[0].required = true;
        // 计划扣款总金额必须大于0
        if (this.planDeductTotal <= 0) {
          this.$message.warning('计划扣款总金额必须大于0');
          return;
        }
      } else {
        this.rules.amountAdjustReason[0].required = false;
      }
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          auditReject({
            detailId: this.id,
            ...this.form,
            isAutoCalc: this.activeName === 'isAutoCalc' ? 1 : 0,
          }).then(() => {
            this.$message.success('审计驳回成功');
            this.handleClose();
            this.$emit('success');
          }).catch(() => {
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
.m-start-work-dialog {

  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }
}

.deduct-summary {
  margin-top: 10px;
  padding: 10px 0;
  display: flex;
  gap: 20px;
  font-weight: bold;
}

.readonly-deducts {
  padding: 10px 0;
  line-height: 32px;
}

.readonly-deducts .label {
  width: 120px;
  display: inline-block;
  text-align: right;
  margin-right: 10px;
  color: #606266;
}

.readonly-deducts .value {
  margin-right: 20px;
  font-weight: bold;
}

.full-width-item {
  width: 100%;
  margin-bottom: 20px;
  display: block !important;
}

.full-width-item .el-input {
  width: 100% !important;
}
</style>
