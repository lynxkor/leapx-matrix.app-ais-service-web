<template>
  <el-dialog
    title="作废"
    width="480px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" style="padding-right: 16px;">
          <el-form-item prop="cancelDesc" class="form-item-full" label="作废说明：">
            <el-input type="textarea" v-model="form.cancelDesc" placeholder="请输入" :rows="3" />
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
import { cancelOrder } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';

export default {
  name: 'CancelOrderDialog',
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
        cancelDesc: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        cancelDesc: [{ required: true, message: '请输入作废说明', trigger: 'blur' }],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.id = this.traceOrderId;
        this.form.cancelDesc = '';
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
        cancelOrder(this.form).then(() => {
          this.$message.success('作废成功');
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
