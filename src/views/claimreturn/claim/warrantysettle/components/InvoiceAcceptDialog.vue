<template>
  <el-dialog
    title="发票验收"
    width="480px"
    :visible.sync="dialogVisible"
    @close="close"
    :append-to-body="true"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" >
            <el-form-item class="form-item-full" label="验收说明：" prop="invoiceCheckDesc">
              <base-input
                type="textarea"
                placeholder="请输入验收说明"
                v-model="form.invoiceCheckDesc"
                clearable
              />
            </el-form-item>
            <el-form-item class="form-item-full" label="收款方式：" prop="paymentMethod">
              <fetch-select
                :request="fetchOptions"
                enumCode="payment_method"
                v-model="form.paymentMethod"
                placeholder="请选择"
                clearable
                filterable
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
import { invoiceAccept } from '@/api/claimreturn/claim/warrantysettle/index';
import { getEnum } from '@/api/common';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  paymentMethod: '',
  invoiceCheckDesc: '',
};

export default {
  name: 'InvoiceAcceptDialog',
  components: {
    BaseInput,
    FetchSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: { ...defaultForm },
      dialogVisible: this.visible,
      submitLoading: false,
      rules: {
        paymentMethod: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.paymentMethod = this.paymentMethod || '';
      } else {
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
        invoiceAccept({
          id: this.id,
          paymentMethod: this.form.paymentMethod,
          invoiceCheckDesc: this.form.invoiceCheckDesc,
        }).then(res => {
          this.close();
          this.$message.success('发票验收成功！');
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
