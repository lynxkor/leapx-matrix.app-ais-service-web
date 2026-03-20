<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="反结算申请审核"
    width="600px"
    :before-close="handleClose"
    custom-class="anti-settlement-dialog"
  >
    <el-form size="small" ref="ruleForm" :model="form" :rules="rules" label-width="100px" label-position="right">
      <el-form-item label="审核操作" prop="auditAction" required>
        <el-radio-group v-model="form.auditAction">
          <el-radio label="agree">同意</el-radio>
          <el-radio label="reject">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="审核意见" prop="auditOpinion" required>
        <el-input
          v-model="form.auditOpinion"
          type="textarea"
          :rows="3"
          placeholder="请输入"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AntiSettlementDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        auditAction: 'reject',
        auditOpinion: ''
      },
      rules: {
        auditAction: [
          { required: true, message: '请选择审核操作', trigger: 'change' }
        ],
        auditOpinion: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    dialogVisible (val) {
      this.$emit('update:visible', val);
      if (val) {
        this.resetForm();
      }
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false;
    },
    handleConfirm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('confirm', {
            auditAction: this.form.auditAction,
            auditOpinion: this.form.auditOpinion
          });
          this.dialogVisible = false;
        }
      });
    },
    resetForm () {
      this.form = {
        auditAction: 'reject',
        auditOpinion: ''
      };
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
