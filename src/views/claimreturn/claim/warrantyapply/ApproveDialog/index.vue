<template>
  <el-dialog
    title="同意"
    width="480px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="page-common-edit">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="90px" class="form-edit" >
            <el-form-item class="form-item-full" label="审批说明：" prop="approvalRemark">
              <base-input
                type="textarea"
                placeholder="请输入审批说明"
                v-model="form.approvalRemark"
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
import { approve } from '@/api/claimreturn/claim/warrantyapply';
import BaseInput from '@/libs/components/BaseInput/index.vue';

const defaultForm = {
  approvalRemark: '',
};
export default {
  name: 'ApproveDialog',
  components: {
    BaseInput,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    approveIds: {
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
        approve({
          ids: this.approveIds,
          approvalRemark: this.form.approvalRemark,
        }).then(res => {
          this.close();
          if (res.failedCount > 0) {
            this.$message.warning(res.failedCount + '条数据同意失败！');
          } else {
            this.$message.success('同意成功！');
          }
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
