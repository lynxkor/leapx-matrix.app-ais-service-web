<template>
  <el-dialog
    title="发票退回"
    width="480px"
    :visible.sync="dialogVisible"
    @close="close"
    :append-to-body="true"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" >
            <el-form-item class="form-item-full" label="退回原因：" prop="returnReason">
              <base-input
                type="textarea"
                placeholder="请输入退回原因"
                v-model="form.returnReason"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
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
import { invoiceReturn } from '@/api/claimreturn/claim/warrantysettle/index';
import BaseInput from '@/libs/components/BaseInput/index.vue';

const defaultForm = {
  returnReason: '',
};

export default {
  name: 'InvoiceReturnDialog',
  components: {
    BaseInput,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: { ...defaultForm },
      dialogVisible: this.visible,
      submitLoading: false,
      rules: {
        returnReason: [{ required: true, message: '请输入退回原因', trigger: 'blur' }],
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
        invoiceReturn({
          id: this.id,
          returnReason: this.form.returnReason,
        }).then(res => {
          this.close();
          this.$message.success('发票退回成功！');
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

<style lang="scss" scoped>
</style>
