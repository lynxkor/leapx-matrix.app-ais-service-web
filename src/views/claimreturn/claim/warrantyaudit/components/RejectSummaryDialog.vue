<template>
  <el-dialog
    title="驳回总结"
    width="480px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" style="padding-right: 16px;">
            <el-form-item prop="approveDesc" label="审批说明：">
              <el-input type="textarea" v-model="form.approveDesc" placeholder="请输入" />
            </el-form-item>
          </el-form>
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
import { rejectSummary } from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';

export default {
  name: 'RejectSummaryDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    auditId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      form: {
        auditId: '',
        approveDesc: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        approveDesc: [{ required: true, message: '请输入审批说明', trigger: 'blur' }],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.auditId = this.auditId;
        this.form.approveDesc = '';
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.submitLoading = true;
        rejectSummary(this.form).then(() => {
          this.$message.success('驳回总结成功');
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
</style>
