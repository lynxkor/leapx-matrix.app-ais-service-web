<template>
  <el-dialog
    title="驳回申诉"
    width="600px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="140px" class="form-edit" style="padding-right: 16px;">
          <el-form-item prop="auditOpinion" class="form-item-full" label="审核意见：">
            <el-input type="textarea" v-model="form.auditOpinion" placeholder="请输入" :rows="3" />
          </el-form-item>
          <el-form-item class="form-item-full" label="申诉凭证：">
            <AisAttachment
              style="padding-top: 5px;"
              :business-id="traceOrderId"
              attachType="申诉凭证"
              :readonly="true"
              configCode="mcs_claimtrack_form"
              emptyText="暂无申诉凭证"
            />
          </el-form-item>
          <el-form-item prop="sysAutoAgreeDate" label="系统自动同意日期：">
            <el-date-picker
              v-model="form.sysAutoAgreeDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              :picker-options="datePickerOptions"
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
import { rejectAppeal } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import AisAttachment from '@/libs/components/AisAttachment';

export default {
  name: 'RejectAppealDialog',
  components: { AisAttachment },
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
        auditOpinion: '',
        sysAutoAgreeDate: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      datePickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 86400000;
        }
      },
      rules: {
        auditOpinion: [{ required: true, message: '请输入审核意见', trigger: 'blur' }],
        sysAutoAgreeDate: [{ required: true, message: '请选择系统自动同意日期', trigger: 'change' }],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.id = this.traceOrderId;
        this.form.auditOpinion = '';
        this.form.sysAutoAgreeDate = this.formData.sysAutoAgreeDate || '';
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
        rejectAppeal(this.form).then(() => {
          this.$message.success('驳回申诉成功');
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
