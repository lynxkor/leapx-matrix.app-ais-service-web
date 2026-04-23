<template>
  <el-dialog
    class="m-confirmdoc-dialog"
    title="结算并签字"
    width="400px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
    append-to-body
  >
    <el-form
      size="small"
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-row>
        <el-col :span="22">
          <el-form-item label="" prop="signChannel">
            <el-radio-group v-model="form.signChannel">
              <el-radio label="999">APP/短信/零小跑</el-radio>
              <div v-if="form.signChannel === '999'" class="sign-channel-tip">此操作将生成待签字结算单且需要用户签字</div>
              <el-radio label="40">纸质单据</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="$emit('update:visible', false)"
          >取 消</el-button
        >
        <el-button
          size="small"
          :loading="submitLoading"
          type="primary"
          @click="submit"
          >确 定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getEnum } from '@/api/maintain/sp/serviceProxy/index';
import { signSettlement } from '@/api/maintain/sp/serviceStatement/index';

export default {
  name: 'ConfirmDocDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    serviceProxyCode: {
      type: String,
      default: '',
    },
    serviceProxyId: {
      type: [String, Number],
      default: '',
    },
    info: {
      type: Object,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      form: {
        signChannel: '999',
      },
      rules: {
        signChannel: [
          { required: true, message: '请选择签字渠道', trigger: 'change' },
        ],
      },
      submitLoading: false,
      formLabelWidth: '0',
      signChannelOptions: [
        { code: '999', message: 'APP/短信/零小跑' },
        { code: '40', message: '纸质单据' },
      ],
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        // this.getSignChannelEnum();
      }
    },
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.$refs.form.resetFields();
    },
    getSignChannelEnum () {
      getEnum('SignChannelEnum')
        .then((res) => {
          this.signChannelOptions = res || [];
          if (this.signChannelOptions.length > 0 && !this.form.signChannel) {
            this.form.signChannel = this.signChannelOptions[0].code;
          }
        })
        .catch(() => {
          this.signChannelOptions = [];
        });
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          const params = {
            ...this.formData,
            ...this.data,
          };
          if (this.form.signChannel === '40') {
            params.signChannel = '40';
          }
          signSettlement(params)
            .then((res) => {
              this.$message.success('提交成功');
              this.$emit('update:visible', false);
              this.$emit('refresh');
            })
            .finally(() => {
              this.submitLoading = false;
            });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.m-confirmdoc-dialog {
  ::v-deep .el-radio-group {
    display: flex;
    flex-direction: column;
    .el-radio {
      margin: 8px 0;
    }
  }
  .sign-channel-tip {
    color: var(--leap-color-danger);
    background-color: rgba($color:#B91919, $alpha: 0.1);
    font-size: 12px;
    line-height: 1.5;
    margin: 4px 0;
    padding: 4px 12px;
    border-radius: 4px;
  }
}
</style>
