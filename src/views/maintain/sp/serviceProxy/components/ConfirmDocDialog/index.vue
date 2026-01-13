<template>
  <el-dialog
    class="m-confirmdoc-dialog"
    title="制单确认并签字"
    width="400px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <el-form size="small" ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-row>
        <el-col :span="22">
          <el-form-item label="" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="1">APP/短信/零小跑</el-radio>
              <el-radio :label="2">纸质单据</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="$emit('update:visible', false)">取 消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { finish } from '@/api/claimreturn/claim/basic/serviceActivityVehicle';
export default {
  name: 'ConfirmDocDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      form: {
        type: '',
      },
      rules: {
        type: [
          { required: true, message: '类型必选', trigger: 'blur' }
        ]
      },
      submitLoading: false,
      formLabelWidth: '0'
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;

      if (val) {
        Object.keys(this.form).forEach(key => {
          this.form[key] = this.info[key];
        });
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.$refs.form.resetFields();
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          // this.$emit('submit', { ...this.info, ...this.form });
          finish({ ...this.info, ...this.form }).then(res => {
            this.$emit('update:visible', false);
            this.$emit('refresh', res);
            this.closed();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    }

  }
};
</script>
<style lang="scss" scoped>
  .m-confirmdoc-dialog{
    ::v-deep .el-radio-group{
      display: flex;
      flex-direction: column;
      .el-radio{
        margin: 8px 0;
      }
    }
  }
</style>
