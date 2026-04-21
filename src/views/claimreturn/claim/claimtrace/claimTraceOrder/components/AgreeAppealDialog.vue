<template>
  <el-dialog
    title="同意申诉"
    width="600px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" style="padding-right: 16px;">
          <el-form-item prop="appealAuditOpinion" class="form-item-full" label="审核意见：">
            <el-input type="textarea" v-model="form.appealAuditOpinion" placeholder="请输入" :rows="3" />
          </el-form-item>
          <el-form-item class="form-item-full" label="申诉凭证：">
            <AisAttachment
              style="padding-top: 5px;"
              :business-id="traceOrderId"
              attachType="申诉凭证"
              configCode="mcs_claimtrack_form"
              :readonly="true"
              emptyText="暂无申诉凭证"
            />
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
import { agreeAppeal } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import AisAttachment from '@/libs/components/AisAttachment';

export default {
  name: 'AgreeAppealDialog',
  components: { AisAttachment },
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
        appealAuditOpinion: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        appealAuditOpinion: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
      }
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.id = this.traceOrderId;
        this.form.appealAuditOpinion = '';
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
        agreeAppeal(this.form).then(() => {
          this.$message.success('同意申诉成功');
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
