<template>
  <el-dialog
    title="签署整改"
    width="600px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="140px" class="form-edit" style="padding-right: 16px;">
          <el-form-item prop="rectifySignDesc" class="form-item-full" label="签署说明：">
            <el-input type="textarea" v-model="form.rectifySignDesc" placeholder="请输入"/>
          </el-form-item>
          <el-form-item class="form-item-full" label="未签署整改报告：">
            <AisAttachment
              :business-id="form.auditId"
              :uploadConfig="uploadConfig"
              :readonly="true"
              attachType="待签署整改报告"
            />
          </el-form-item>
          <el-form-item prop="fileId" class="form-item-full" label="已签署整改报告：">
            <AisAttachment
              style="padding-top: 5px;"
              ref="attachment"
              :business-id="form.auditId"
              :uploadConfig="uploadConfig"
              :noEcho="true"
              attachType="已签署整改报告"
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
import { signRectify } from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';
import AisAttachment from '@/libs/components/AisAttachment';

export default {
  name: 'SignRectifyDialog',
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
        rectifySignDesc: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        fileId: [{ required: true, message: '请上传已签署整改报告', trigger: 'change' }],
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
      const fileList = this.$refs.attachment.getAttachment();
      if (!fileList || fileList.length === 0) {
        this.$message.warning('请上传已签署整改报告');
        return;
      }
      this.form.fileId = fileList[0].fileId;
      this.submitLoading = true;
      signRectify(this.form).then(() => {
        this.$message.success('签署整改成功');
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
