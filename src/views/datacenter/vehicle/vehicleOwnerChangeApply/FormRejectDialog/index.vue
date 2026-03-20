<template>
  <el-dialog
    class="m-return-dialog"
    title="审批驳回"
    width="600px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="dialog-content">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form-edit"
      >
        <el-form-item label="驳回说明：" prop="auditDesc">
          <base-input
            size="small"
            type="textarea"
            placeholder="请输入"
            v-model="form.auditDesc"
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
import { reject } from '@/api/datacenter/vehicle/vehicleOwnerChangeApply';
import BaseInput from '@/libs/components/BaseInput/index.vue';

const defaultForm = {
  auditDesc: '',
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
    id: {
      type: String,
      default: '',
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      form: { ...defaultForm },
      rules: {
        auditDesc: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
      }
    };
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    },
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
        this.submitLoading = true;
        reject({
          ...this.form,
          id: this._id,
        }).then(res => {
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
