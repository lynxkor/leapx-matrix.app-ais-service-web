<template>
  <el-dialog
    :title="isApplyReject ? '申请驳回' : '驳回'"
    width="480px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="page-common-edit">
      <section class="common-section">
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" >
            <el-form-item class="form-item-full" label="审批说明：" prop="approvalRemark">
              <base-input
                type="textarea"
                placeholder="请输入审批说明"
                v-model="form.approvalRemark"
                clearable
              />
            </el-form-item>
            <el-form-item class="form-item-full" label="错误名称：" prop="errorCodeId">
              <fetch-select
                filterable
                clearable
                remote
                reserve-keyword
                v-model="form.errorCodeId"
                :remote-method="codeSearch"
                params=""
                value-key="id"
                label-key="name"
                sub-label-key="code"
                @change="onChange"
              />
            </el-form-item>
            <el-form-item class="form-item-full" label="错误代码：" prop="code">
              {{ form.code }}
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

import { getList } from '@/api/claimreturn/claim/basic/approvalRejectSetting/index';
import { reject, applyReject } from '@/api/claimreturn/claim/warrantyapply';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';

const defaultForm = {
  approvalRemark: '', // 驳回原因
  errorCodeId: '', // 错误代码id
  code: '', // 错误代码
};
export default {
  name: 'RejectDialog',
  components: {
    BaseInput,
    FetchSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    rejectIds: {
      type: Array,
      default: () => [],
    },
    isApplyReject: {
      type: Boolean,
      default: null,
    }
  },
  data () {
    return {
      pageSizes: [10, 20, 50, 100],
      form: { ...defaultForm },
      oldPartUniqueCode: '',
      pageSize: 20,
      pageNum: 1,
      loading: false,
      //
      dialogVisible: this.visible,
      submitLoading: false,
      rules: {
        approvalRemark: [
          { required: true, message: '请选择验收结果', trigger: 'change' }
        ],
        errorCodeId: [
          { required: true, message: '请选择错误代码', trigger: 'change' }
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
      //
      this.$refs.ruleForm?.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.submitLoading = true;
        const rejectFunction = this.isApplyReject ? applyReject : reject;
        rejectFunction({
          ids: this.rejectIds,
          [this.isApplyReject ? 'applyRemark' : 'approvalRemark']: this.form.approvalRemark,
          errorCodeId: this.form.errorCodeId,
        }).then(res => {
          this.close();
          this.$message.success('驳回成功！');
          this.$emit('success');
        }).finally(() => {
          this.submitLoading = false;
        });
        //
      });
    },
    onReset () {
      this.$refs.ruleForm?.resetFields();
      this.form = {
        ...defaultForm,
      };
    },
    async codeSearch (query) {
      return getList({
        nameOrCodeLike: query || '',
        pageNum: 1,
        pageSize: 20,
      });
    },
    onChange (value, row) {
      this.form.code = row.code;
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
