<template>
  <el-dialog
    title="作废"
    width="480px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="page-common-edit">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="90px" class="form-edit" >
            <el-form-item class="form-item-full" label="作废原因：" prop="cancelReason">
              <base-input
                type="textarea"
                placeholder="请输入作废原因"
                v-model="form.cancelReason"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
      </section>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { batchCancel } from '@/api/claimreturn/claim/warrantyapply';
import BaseInput from '@/libs/components/BaseInput/index.vue';

const defaultForm = {
  cancelReason: '',
};
export default {
  name: 'CancelDialog',
  components: {
    BaseInput,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cancelIds: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      form: { ...defaultForm },
      dialogVisible: this.visible,
      submitLoading: false,
      rules: {
        cancelReason: [
          { required: true, message: '请输入作废原因', trigger: 'blur' }
        ],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (!val) {
        this.onReset();
      }
    },
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.onReset();
    },
    submit () {
      this.$refs.ruleForm?.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.submitLoading = true;
        batchCancel({
          applyIds: this.cancelIds,
          cancelReason: this.form.cancelReason,
        }).then(res => {
          this.close();
          this.$message.success('作废成功！');
          this.$emit('success');
        }).finally(() => {
          this.submitLoading = false;
        });
      });
    },
    onReset () {
      this.$refs.ruleForm?.resetFields();
      this.form = {
        ...defaultForm,
      };
    },
  }
};
</script>
