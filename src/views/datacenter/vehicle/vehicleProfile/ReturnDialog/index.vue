<template>
  <el-dialog
    class="m-return-dialog"
    title="退车"
    width="600px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="dialog-content">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="form-edit"
      >
        <el-form-item label="流程编号（OA）：" prop="processCode">
          <base-input
            size="small"
            placeholder="请输入"
            v-model="form.processCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户名称（OA）：" prop="ownerName">
          <base-input
            size="small"
            placeholder="请输入"
            v-model="form.ownerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="VIN车架号（OA）：" prop="vin">
          <base-input
            size="small"
            placeholder="请输入"
            v-model="form.vin"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="submitLoading"
          @click="submit"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { vehicleReturn } from '@/api/datacenter/vehicle/vehicleProfile';
import BaseInput from '@/libs/components/BaseInput/index.vue';

const defaultForm = {
  processCode: '',
  ownerName: '',
  vin: [],
};

export default {
  name: 'ReturnDialog',
  components: {
    BaseInput,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      form: { ...defaultForm },
      rules: {
        processCode: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        ownerName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        vin: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (!val) {
        this.onReset();
      }
    }
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
        // if (this.form.ownerName !== this.ownerName) {
        //   this.$message.error('车车主姓名和当前车主不一致，不允许退车');
        //   return;
        // }
        // if (this.form.vin !== this.vin) {
        //   this.$message.error('退车VIN和当前车辆不一致，不允许退车');
        //   return;
        // }
        this.submitLoading = true;
        vehicleReturn(this.form).then(res => {
          this.dialogVisible = false;
          this.$emit('update');
        }).finally(() => {
          this.submitLoading = false;
        });
      });
    },
    onReset () {
      this.$refs.ruleForm?.resetFields();
      this.form = { ...defaultForm };
    },
  }
};
</script>

<style lang="scss" scoped>
.m-return-dialog {
  ::v-deep .el-dialog__body {
    padding: 20px;
  }

  .form-edit {
    .el-form-item {
      margin-bottom: 18px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
