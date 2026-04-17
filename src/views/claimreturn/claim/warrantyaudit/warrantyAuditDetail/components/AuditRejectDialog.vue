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
      <el-form-item label="提交截止日期：" prop="feedbackDeadline">
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
  isAutoCalc: 0,
  feedbackDeadline: '',
};

export default {
  name: 'ReviewRejectDialog',
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
        feedbackDeadline: [
          { required: true, message: '请选择提交截止日期' }
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
      this.dialogVisible = val;
      this.$refs.auditForm.clearValidate();
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
    handleTabClick (tab) {
      // 可选：切换 Tab 时清除校验结果，提升体验
      this.$refs.auditForm.clearValidate();
    },
    // 自动计算金额
    async handleErrorConfigChange () {
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
      if (this.activeName === 'isAutoCalc') {
        this.rules.amountAdjustReason[0].required = false;
      } else {
        this.rules.amountAdjustReason[0].required = true;
      }
      this.$refs.auditForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          auditReject({
            detailId: this.id,
            ...this.form,
            isAutoCalc: this.activeName === 'isAutoCalc' ? 0 : 1,
          }).then(() => {
            this.$message.success('审计驳回成功');
            this.handleClose();
            this.$emit('success');
            this.form = { ...defaultForm };
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

/* 简单的样式优化，让只读数据看起来整齐 */
.readonly-deducts {
  padding: 10px 0;
  line-height: 32px;
  /* 与 input 高度对齐 */
}

.readonly-deducts .label {
  width: 120px;
  /* 对应 label-width */
  display: inline-block;
  text-align: right;
  margin-right: 10px;
  color: #606266;
}

.readonly-deducts .value {
  margin-right: 20px;
  font-weight: bold;
}

/* 让审计说明在 inline 表单中占据 100% 宽度 */
.full-width-item {
  width: 100%;
  margin-bottom: 20px;
  display: block !important;
}

.full-width-item .el-input {
  width: 100% !important;
}
</style>
