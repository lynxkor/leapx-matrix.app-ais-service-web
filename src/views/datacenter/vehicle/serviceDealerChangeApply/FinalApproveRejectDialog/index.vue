<template>
  <el-dialog
    title="驳回"
    width="500px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="page-common-edit">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" >
            <el-form-item label="驳回说明：" prop="rejectReason">
              <el-input
                v-model="form.rejectReason"
                type="textarea"
                :rows="4"
                placeholder="请输入驳回说明"
              />
            </el-form-item>
          </el-form>
        </div>
      </section>
    </div>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { finalRejectReject } from '@/api/datacenter/vehicle/serviceDealerChangeApply';

export default {
  name: 'FinalApproveRejectDialog',
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
      dialogVisible: this.visible,
      submitLoading: false,
      form: {
        rejectReason: '',
      },
      rules: {
        rejectReason: [
          { required: true, message: '请输入驳回说明', trigger: 'change' }
        ],
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
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
        finalRejectReject({
          id: this.id,
          rejectReason: this.form.rejectReason,
        }).then(res => {
          this.close();
          this.$message.success('驳回成功');
          this.$emit('success');
        }).finally(() => {
          this.submitLoading = false;
        });
      });
    },
    onReset () {
      this.$refs.ruleForm?.resetFields();
      this.form.rejectReason = '';
    },
  }
};
</script>
