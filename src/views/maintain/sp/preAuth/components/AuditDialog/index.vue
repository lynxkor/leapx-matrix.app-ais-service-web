<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="预授权审批"
    width="700px"
    :before-close="handleClose"
    custom-class="anti-settlement-dialog"
  >
    <el-form size="small" ref="ruleForm" :model="form" :rules="rules" label-width="120px" label-position="right">
      <el-form-item label="审核操作" prop="auditStaus">
        <el-radio-group v-model="form.auditStaus">
          <el-radio label="30">审批通过</el-radio>
          <el-radio label="20">审批驳回</el-radio>
          <el-radio label="40" v-if="info.approvalStatus !== AUDIT_STATUS.REFUSED">拒绝申请</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="错误代码及内容" prop="preAuthRuleCodeId" v-if="form.auditStaus === '20'">
        <fetch-select
          v-model="form.preAuthRuleCodeId"
          placeholder="请选择错误代码"
          :options="errorCodeOptions"
          value-key="value"
          label-key="label"
          subLabelKey="desc"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="审核意见" prop="auditContent">
        <el-input
          v-model="form.auditContent"
          type="textarea"
          :rows="3"
          placeholder="请输入"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="附件信息" v-if="form.auditStaus === '20'">
        <AisAttachment
          ref="attachment"
          :upload-config="uploadConfig"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm" :loading="submitting">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AisAttachment from '@/libs/components/AisAttachment';
import { auditItem } from '@/api/maintain/sp/preAuth/index';
import { getErrorCodeList } from '@/api/maintain/sp/preAuth/errorCode';
import { AUDIT_STATUS } from '../../constant';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  name: 'PreAuthAuditDialog',
  components: {
    AisAttachment,
    FetchSelect
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
    info: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dialogVisible: false,
      form: {
        auditStaus: '30',
        auditContent: '',
        preAuthRuleCodeId: ''
      },
      errorCodeOptions: [], // 错误代码选项
      AUDIT_STATUS,
      uploadConfig: {
        acceptSuffix: '.png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.xls,.xlsx',
        maxSize: 10, // 10MB
        maxNum: 5,
        required: '0'
      },
      rules: {
        auditStaus: [
          { required: true, message: '请选择审核操作', trigger: 'change' }
        ],
        preAuthRuleCodeId: [
          { required: true, message: '请选择错误代码', trigger: 'change' }
        ]
      },
      submitting: false
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getErrorCodeData();
      }
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
    // 获取错误代码列表
    async getErrorCodeData () {
      try {
        const params = {
          pageNum: 1,
          pageSize: 500
        };
        const res = await getErrorCodeList(params);
        // 只显示启用状态的错误代码
        const enabledList = (res.records || []).filter(item => item.status === 1);
        this.errorCodeOptions = enabledList.map(item => ({
          value: item.id,
          label: item.code,
          desc: item.content
        }));
      } catch (error) {
        console.error('获取错误代码列表失败:', error);
        this.$message.error('获取错误代码列表失败');
      }
    },
    async handleConfirm () {
      if (this.submitting) {
        return;
      }

      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // 获取附件信息
          const attachments = this.$refs.attachment ? this.$refs.attachment.getAttachment() : [];

          // 准备提交数据
          const submitData = {
            id: this.businessId,
            auditStaus: this.form.auditStaus,
            auditContent: this.form.auditContent,
            preAuthRuleCodeId: this.form.preAuthRuleCodeId,
            attachments
          };

          this.submitting = true;
          try {
            await auditItem(submitData);
            this.$message.success('提交成功');
            this.dialogVisible = false;
            this.$emit('success');
          } catch (error) {} finally {
            this.submitting = false;
          }
        }
      });
    },
    resetForm () {
      this.form = {
        auditStaus: '30',
        auditContent: '',
        preAuthRuleCodeId: ''
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
