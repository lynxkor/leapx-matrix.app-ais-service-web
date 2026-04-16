<template>
  <el-dialog
    title="同意申诉"
    :visible="visible"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="错误代码：" prop="errorCodes">
        <fetch-select
          :request="fetchOptions"
          enumCode="warranty_audit_error_type"
          v-model="form.errorCodes"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="申诉处理说明：" prop="appealHandleDesc">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入申诉处理说明"
          v-model="form.appealHandleDesc"
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
import { agreeAppeal } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  errorCodes: [],
  appealHandleDesc: '',
};

export default {
  name: 'AgreeAppealDialog',
  components: {
    FetchSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectionList: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      form: { ...defaultForm },
      submitLoading: false,
      rules: {
        appealHandleDesc: [
          { required: true, message: '请输入申诉处理说明', trigger: 'blur' }
        ],
      },
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.initForm();
      }
    }
  },
  methods: {
    initForm () {
      this.form = { ...defaultForm };
    },
    handleClose () {
      this.$emit('update:visible', false);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const ids = this.selectionList.map(item => item.id);
          agreeAppeal({
            ids,
            errorCodes: this.form.errorCodes,
            appealHandleDesc: this.form.appealHandleDesc,
          }).then(() => {
            this.$message.success('同意申诉成功');
            this.$emit('success');
            this.handleClose();
          }).catch(() => {
            this.$message.error('同意申诉失败');
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
  }
};
</script>
