<template>
  <el-dialog
    class="m-adjust-margin-quota-dialog"
    title="修改预留资金额度"
    width="560px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="small"
    >
      <el-form-item label="预留资金额度：" prop="newMarginQuota">
        <el-input-number
          v-model="form.newMarginQuota"
          :min="0"
          :max="MAX_MARGIN_QUOTA"
          :precision="2"
          :step="100"
          placeholder="请输入"
          class="full-width"
        />
      </el-form-item>
      <el-form-item label="调整说明：" prop="marginQuotaRemark">
        <el-input
          v-model="form.marginQuotaRemark"
          type="textarea"
          :rows="3"
          :maxlength="500"
          show-word-limit
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { adjustMarginQuota } from '@/api/sparepart/fund/account/index';

/**
 * 备件现金账户 - 修改预留资金额度 弹框
 * PRD：《保证金.pdf》「1.备件现金账户 → 调整预留资金额度」
 * 1. 若没有选中的记录，则提醒=请选择需要调整预留资金额度的记录
 * 2. 逻辑同预留资金额度导入
 * 字段定义见 PRD 数据模型：预留资金额度（必填，货币，>=0）、预留资金额度调整说明（非必填，文本）
 * 交互稿：标题「修改预留资金额度」，两项字段，底部「取消」「确定」
 */
export default {
  name: 'AdjustMarginQuotaDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // PRD 九、非功能需求：货币最大值 100,000,000,000.00
      MAX_MARGIN_QUOTA: 100000000000,
      dialogVisible: this.visible,
      submitLoading: false,
      form: {
        newMarginQuota: undefined,
        marginQuotaRemark: ''
      },
      rules: {
        newMarginQuota: [
          { required: true, message: '请输入预留资金额度', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入预留资金额度'));
                return;
              }
              if (Number(value) < 0) {
                callback(new Error('预留资金额度必须大于等于0'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        // 弹框打开时重置表单（保留校验）
        this.form.newMarginQuota = undefined;
        this.form.marginQuotaRemark = '';
        this.$nextTick(() => {
          this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
        });
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        if (!this.selectedRows || this.selectedRows.length === 0) {
          this.$message.warning('请选择需要调整预留资金额度的记录');
          return;
        }
        // 仅资金账户（FUND）允许调整
        const invalid = this.selectedRows.filter(r => r.accountType && r.accountType !== 'FUND');
        if (invalid.length > 0) {
          this.$message.warning('仅资金账户支持调整预留资金额度');
          return;
        }
        const idList = this.selectedRows.map(r => r.id);
        this.submitLoading = true;
        adjustMarginQuota({
          idList,
          newMarginQuota: this.form.newMarginQuota,
          marginQuotaRemark: this.form.marginQuotaRemark
        }).then(() => {
          this.$message.success('调整预留资金额度成功');
          this.$emit('success');
          this.close();
        }).catch(err => {
          console.error('调整预留资金额度失败:', err);
        }).finally(() => {
          this.submitLoading = false;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-adjust-margin-quota-dialog {
  ::v-deep .el-dialog__body {
    padding-top: 20px;
  }
  .full-width {
    width: 100%;
  }
}
</style>
