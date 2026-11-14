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
import { notifyBatchResult } from '../BatchResultHelper';

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
          // 单条审核：直接展示后端业务提示（如：当前车辆为新上市车型，必须上传质量反馈报告）
          // 批量审核：保持原有失败条数 + 失败ID 提示（批量存在部分成功/部分失败）
          const isSingle = (this.approveIds || []).length === 1;
          const failMsg = isSingle && res?.failedCount > 0
            ? res?.failedMessages?.[this.approveIds[0]]
            : '';
          if (failMsg) {
            this.$alert(failMsg, '同意失败', {
              confirmButtonText: '知道了',
              customClass: 'batch-result-msgbox',
            }).catch(() => { /* 用户关闭，无操作 */ });
          } else {
            notifyBatchResult(this, res, '同意');
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
