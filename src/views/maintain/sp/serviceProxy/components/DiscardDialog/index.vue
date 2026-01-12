<template>
  <el-dialog
    class="m-serviceActivityVehicle-dialog"
    title="接车施工单作废"
    width="600px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <el-form size="small" ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-row>
        <el-col :span="22">
          <el-form-item label="作废原因：" prop="manualCompletionNote">
            <el-input type="textarea" placeholder="请输入" rows="3" v-model="form.manualCompletionNote"  maxlength="500" show-word-limit/>
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
// import { finish } from '@/api/claimreturn/claim/basic/serviceActivityVehicle';
export default {
  name: 'DiscardDialog',
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
        finishTime: '',
        manualCompletionNote: ''
      },
      rules: {
        manualCompletionNote: [
          { required: true, message: '完成说明必填', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 500 个字', trigger: 'blur' }
        ],
        finishTime: [
          { required: true, message: '完成时间必填', trigger: 'blur' }
        ]
      },
      submitLoading: false,
      formLabelWidth: '120px'
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
      // this.$refs.form.validate(valid => {
      //   if (valid) {
      //     this.submitLoading = true;
      //     // this.$emit('submit', { ...this.info, ...this.form });
      //     finish({ ...this.info, ...this.form }).then(res => {
      //       this.$emit('update:visible', false);
      //       this.$emit('refresh', res);
      //       this.closed();
      //     }).finally(() => {
      //       this.submitLoading = false;
      //     });
      //   }
      // });
    }

  }
};
</script>
