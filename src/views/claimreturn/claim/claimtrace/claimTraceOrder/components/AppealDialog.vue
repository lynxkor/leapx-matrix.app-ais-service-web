<template>
  <el-dialog
    title="申诉"
    width="600px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" style="padding-right: 16px;">
          <el-form-item prop="appealDesc" class="form-item-full" label="申诉说明：">
            <el-input type="textarea" v-model="form.appealDesc" placeholder="请输入" :rows="3" />
          </el-form-item>
          <el-form-item class="form-item-full" label="申诉凭证：" required>
            <AisAttachment
              style="padding-top: 5px;"
              ref="attachment"
              :business-id="traceOrderId"
              attachType="申诉凭证"
              :uploadConfig="uploadConfig"
              @upload-loading-change="handleUploadLoadingChange"
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
import { submitAppeal } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import AisAttachment from '@/libs/components/AisAttachment';

export default {
  name: 'AppealDialog',
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
        appealDesc: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        appealDesc: [{ required: true, message: '请输入申诉说明', trigger: 'blur' }],
      },
      uploadConfig: {
        acceptSuffix: '.rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.xlsx,.xls,.mp4',
        maxSize: 50,
        maxNum: 9,
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.id = this.traceOrderId;
        this.form.appealDesc = '';
      }
    }
  },
  methods: {
    handleUploadLoadingChange (loading) {
      this.submitLoading = loading;
    },
    close () {
      this.$emit('update:visible', false);
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        const attachFileList = this.$refs.attachment.getAttachment();
        const files = this.$refs.attachment.getFileList();
        const allFiles = [...files, ...attachFileList];
        if (!allFiles || allFiles.length === 0) {
          this.$message.warning('请上传追溯凭证');
          return;
        }
        this.submitLoading = true;
        submitAppeal({ ...this.form, attachFileList: allFiles }).then(() => {
          this.$message.success('申诉成功');
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
