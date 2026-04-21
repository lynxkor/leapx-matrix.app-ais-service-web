<template>
  <el-dialog
    title="驳回修改"
    width="480px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" style="padding-right: 16px;">
          <el-form-item prop="auditOpinion" class="form-item-full" label="审批说明：">
            <el-input type="textarea" v-model="form.auditOpinion" placeholder="请输入" :rows="3" />
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
import { rejectModify } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';

export default {
  name: 'RejectModifyDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    traceOrderId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      form: {
        id: '',
        auditOpinion: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        auditOpinion: [{ required: true, message: '请输入审批说明', trigger: 'blur' }],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.id = this.traceOrderId;
        this.form.auditOpinion = '';
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.submitLoading = true;
        rejectModify(this.form).then(() => {
          this.$message.success('驳回修改成功');
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
