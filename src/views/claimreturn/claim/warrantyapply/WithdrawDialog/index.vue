<template>
  <el-dialog
    title="撤回"
    width="480px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="page-common-edit">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" >
            <el-form-item class="form-item-full" label="撤回说明：" prop="withdrawRemark">
              <base-input
                type="textarea"
                placeholder="请输入撤回说明"
                v-model="form.withdrawRemark"
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
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { withdraw } from '@/api/claimreturn/claim/warrantyapply';
import BaseInput from '@/libs/components/BaseInput/index.vue';

const defaultForm = {
  withdrawRemark: '',
};
export default {
  name: 'WithdrawDialog',
  components: {
    BaseInput,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    withdrawIds: {
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
        withdrawRemark: [
          { required: true, message: '请输入撤回说明', trigger: 'blur' }
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
        withdraw({
          ids: this.withdrawIds,
          withdrawRemark: this.form.withdrawRemark,
        }).then(res => {
          this.close();
          this.$message.success('撤回成功！');
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
