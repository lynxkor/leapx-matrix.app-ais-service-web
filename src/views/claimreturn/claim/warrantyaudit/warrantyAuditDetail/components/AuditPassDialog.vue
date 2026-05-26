<template>
  <el-dialog
    title="审计通过"
    :visible.sync="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="审计说明：" prop="auditDesc">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入审计说明"
          v-model="form.auditDesc"
          maxlength="500"
          show-word-limit
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
import { auditPass } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';

const defaultForm = {
  auditDesc: '',
};

export default {
  name: 'AuditPassDialog',
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
      dialogVisible: false,
      submitLoading: false,
      rules: {
        auditDesc: [
          { required: true, message: '请输入审计说明', trigger: 'blur' }
        ],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form = { ...defaultForm };
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
      }
    }
  },
  methods: {
    handleClose () {
      this.form = { ...defaultForm };
      this.$emit('update:visible', false);
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          auditPass({
            detailId: this.id,
            auditDesc: this.form.auditDesc,
          }).then(() => {
            this.$message.success('审计通过成功');
            this.$emit('success');
            this.handleClose();
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
