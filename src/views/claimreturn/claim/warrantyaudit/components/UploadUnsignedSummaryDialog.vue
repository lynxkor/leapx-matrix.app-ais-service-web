<template>
  <el-dialog
    title="上传总结报告"
    width="600px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="140px" class="form-edit" style="padding-right: 16px;">
          <el-form-item prop="fileId"  label="待签署总结报告：">
            <AisAttachment
              style="padding-top: 5px;"
              ref="attachment"
              :business-id="form.auditId"
              :uploadConfig="uploadConfig"
              :noEcho="true"
              attachType="待签署总结报告"
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
import { uploadUnsignedSummary } from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';
import AisAttachment from '@/libs/components/AisAttachment';

export default {
  name: 'UploadUnsignedSummaryDialog',
  components: {
    AisAttachment,
  },
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
        fileId: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        fileId: [{ required: true, message: '请上传待签署总结报告', trigger: 'change' }],
      },
      uploadConfig: {
        acceptSuffix: '.pdf,.doc,.docx,.xlsx,.xls',
        maxSize: 50,
        maxNum: 1,
        required: '1',
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.auditId = this.auditId;
        this.form.fileId = '';
      }
    }
  },
  methods: {
    handleUploadLoadingChange (loading) {
      this.submitLoading = loading;
    },
    close () {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    submit () {
      const attachList = this.$refs.attachment.getAttachment();
      if (!attachList || attachList.length === 0) {
        this.$message.warning('请上传待签署总结报告');
        return;
      }
      this.form.fileId = attachList[0].fileId;
      this.submitLoading = true;
      uploadUnsignedSummary(this.form).then(() => {
        this.$message.success('上传成功');
        this.close();
        this.$emit('success');
      }).finally(() => {
        this.submitLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
