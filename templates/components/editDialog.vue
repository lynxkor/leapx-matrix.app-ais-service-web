<template>
  <el-dialog
    class="m-{{{nameKebabCase}}}-edit-dialog"
    title="编辑"
    width="800px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="ID：">
            <span>{{ form.id }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="colName1：" prop="col1">
            <el-input v-model="form.col1" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="colName2：">
        <el-input v-model="form.col2" autocomplete="off" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="时间：">
            <!-- <el-input v-model="form.nextDate" autocomplete="off" /> -->
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submit()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { addOrUpdate } from '@/api/{{{nameCamelCase}}}';

export default {
  name: '{{{name}}}EditDialog',
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
        id: '',
        col1: '',
        col2: '',
        date: ''
      },
      rules: {
        name: [
          { required: true, message: 'colName1必填', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字', trigger: 'blur' }
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ id: this.info.id, ...this.form }).then(res => {
            this.$emit('submit', { ...this.info, ...this.form });
            this.$emit('update:visible', false);
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    }

  }
};
</script>

<style lang="scss">
.m-{{{nameKebabCase}}}-edit-dialog {
  .el-input-number {
    width: 100%;
  }
}
</style>
