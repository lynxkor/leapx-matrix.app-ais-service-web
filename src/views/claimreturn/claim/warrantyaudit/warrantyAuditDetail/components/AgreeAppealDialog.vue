<template>
  <el-dialog
    title="同意申诉"
    :visible.sync="dialogVisible"
    width="600px"
    @close="handleClose"
  >
    <el-form :model="form" size="small" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="申诉处理说明：" prop="appealHandleDesc">
        <el-input
          type="textarea"
          maxlength="500"
          show-word-limit
          placeholder="请输入申诉处理说明"
          v-model="form.appealHandleDesc"
        />
      </el-form-item>
      <el-form-item label="错误代码：" prop="errorConfigIds">
        <fetch-select :remote-method="getErrorItemList" remote v-model="form.errorConfigIds" placeholder="请选择"
          labelKey="checkItem" valueKey="id" subLabelKey="errorCode" clearable multiple collapseTags filterable
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
import { getList as getErrorConfigList } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditErrorConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  errorConfigIds: [],
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
    id: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      form: { ...defaultForm },
      submitLoading: false,
      dialogVisible: false,
      rules: {
        appealHandleDesc: [
          { required: true, message: '请输入申诉处理说明', trigger: 'blur' }
        ],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      this.$refs.ruleForm.clearValidate();
    }
  },
  methods: {
    // 错误代码处理
    async getErrorItemList (query) {
      try {
        const res = await getErrorConfigList({ errorCategoryLike: query || '' });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    handleClose () {
      this.form = { ...defaultForm };
      this.$emit('update:visible', false);
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          agreeAppeal({
            detailId: this.id,
            ...this.form,
          }).then(() => {
            this.$message.success('同意申诉成功');
            this.$emit('success');
            this.handleClose();
          }).catch(() => {
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
  }
};
</script>
