<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="预授权审批"
    width="700px"
    :before-close="handleClose"
    custom-class="anti-settlement-dialog"
  >
    <el-form size="small" ref="ruleForm" :model="form" :rules="rules" label-width="120px" label-position="right">
      <el-form-item label="审核操作" prop="auditAction">
        <el-radio-group v-model="form.auditAction">
          <el-radio label="pass">审批通过</el-radio>
          <el-radio label="reject">审批驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="错误代码及内容" prop="errorCode">
        <el-select
          v-model="form.errorCode"
          placeholder="请选择错误代码"
          filterable
          clearable
        >
          <el-option
            v-for="item in errorCodeOptions"
            :key="item.value"
            :label="`${item.label} (${item.desc})`"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核意见" prop="auditOpinion">
        <el-input
          v-model="form.auditOpinion"
          type="textarea"
          :rows="3"
          placeholder="请输入"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="附件信息">
        <AisAttachment
          ref="attachment"
          :business-id="businessId"
          config-code="mcs_preauth"
          attach-type="审批附件"
          :upload-config="uploadConfig"
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
import AisAttachment from '@/libs/components/AisAttachment';
import { auditItem } from '@/api/maintain/sp/preAuth/index';

export default {
  name: 'AuditDialog',
  components: {
    AisAttachment
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    businessId: {
      type: [String, Number],
      default: ''
    },
    rowId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        auditAction: 'reject',
        auditOpinion: '',
        errorCode: ''
      },
      errorCodeOptions: [], // 错误代码选项，可通过props传入或通过API获取
      uploadConfig: {
        acceptSuffix: '.png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.xls,.xlsx',
        maxSize: 10, // 10MB
        maxNum: 5,
        required: '0'
      },
      rules: {
        auditAction: [
          { required: true, message: '请选择审核操作', trigger: 'change' }
        ],
        errorCode: [
          { required: true, message: '请选择错误代码', trigger: 'change' }
        ]
      },
      submitting: false
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    dialogVisible (val) {
      this.$emit('update:visible', val);
      if (!val) {
        this.resetForm();
      }
    }
  },
  methods: {
    handleClose () {
      this.dialogVisible = false;
    },
    async handleConfirm () {
      if (this.submitting) {
        return;
      }

      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // 获取附件信息
          const attachments = this.$refs.attachment ? this.$refs.attachment.getAttachment() : [];

          const auditResult = this.form.auditAction === 'pass' ? 1 : 0;

          // 准备提交数据
          const submitData = {
            id: this.rowId,
            auditResult,
            auditOpinion: this.form.auditOpinion,
            errorCode: this.form.errorCode,
            attachments
          };

          this.submitting = true;
          try {
            await auditItem(submitData);
            this.$message.success(this.form.auditAction === 'pass' ? '审批通过' : '审批驳回');
            this.dialogVisible = false;
            this.$emit('success');
          } catch (error) {
            this.$message.error('操作失败');
          } finally {
            this.submitting = false;
          }
        }
      });
    },
    resetForm () {
      this.form = {
        auditAction: 'reject',
        auditOpinion: '',
        errorCode: ''
      };
      this.$nextTick(() => {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate();
        }
        // 重置附件组件
        if (this.$refs.attachment) {
          this.$refs.attachment.update();
        }
      });
    },
    // 设置错误代码选项
    setErrorCodeOptions (options) {
      this.errorCodeOptions = options || [];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
