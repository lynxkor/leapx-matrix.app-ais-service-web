<template>
  <el-dialog
    title="发布"
    width="480px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" label-width="120px" class="form-edit">
            <el-form-item prop="submitDeadline" class="form-item-full" label="提交截止日期：">
              <el-date-picker
                v-model="form.submitDeadline"
                type="date"
                placeholder="请选择日期"
                value-format="yyyy-MM-dd"
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
import { publish } from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';

export default {
  name: 'PublishDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    auditId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      form: {
        auditId: '',
        submitDeadline: ''
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        submitDeadline: [{ required: true, message: '请选择', trigger: 'change' }],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.auditId = this.auditId;
        this.form.submitDeadline = '';
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    submit () {
      if (!this.form.submitDeadline) {
        this.$message.warning('请选择提交截止日期');
        return;
      }
      this.submitLoading = true;
      publish(this.form).then(() => {
        this.$message.success('发布成功');
        this.close();
        this.$emit('success');
      }).finally(() => {
        this.submitLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
