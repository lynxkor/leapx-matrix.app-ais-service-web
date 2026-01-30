<template>
  <el-dialog
    class="m-confirmdoc-dialog"
    title="结算并签字"
    width="400px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
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
              <el-radio
                v-for="item in signChannelOptions"
                :key="item.code"
                :label="item.code"
                >{{ item.message }}</el-radio
              >
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
          @click="submit()"
          >确 定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getEnum } from "@/api/maintain/sp/serviceProxy/index";
import { signSettlement } from "@/api/maintain/sp/serviceStatement/index";

export default {
  name: "ConfirmDocDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    serviceProxyCode: {
      type: String,
      default: "",
    },
    serviceProxyId: {
      type: [String, Number],
      default: "",
    },
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      form: {
        signChannel: "",
      },
      rules: {
        signChannel: [
          { required: true, message: "请选择签字渠道", trigger: "change" },
        ],
      },
      submitLoading: false,
      formLabelWidth: "0",
      signChannelOptions: [],
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.getSignChannelEnum();
      }
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    closed() {
      this.$refs.form.resetFields();
    },
    getSignChannelEnum() {
      getEnum("SignChannelEnum")
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          signSettlement({
            serviceProxyCode: this.serviceProxyCode,
            signChannel: this.form.signChannel,
          })
            .then((res) => {
              this.$message.success("签字成功");
              this.$emit("update:visible", false);
              this.$emit("refresh");
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
}
</style>
