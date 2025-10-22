<template>
  <el-dialog
    class="m-vehiclePartsMaintenance-edit-dialog"
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
          <el-form-item label="保养方案：" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="保养零件代码：">
        <el-input v-model="form.partsMaintenanceId" autocomplete="off" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="保养零件名称：">
            <el-input v-model="form.partsMaintenanceName" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次保养时间：">
            <!-- <el-input v-model="form.nextDate" autocomplete="off" /> -->
            <el-date-picker type="date" placeholder="选择日期" v-model="form.nextDate" value-format="yyyy-MM-dd" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次保养里程(KM)：">
            <el-input-number v-model="form.nextMileage" controls-position="right" :precision="2" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次保养间隔里程(KM)：">
            <el-input-number v-model="form.nextDuemileage" controls-position="right" :precision="2" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次保养间隔时间(月)：">
            <el-input-number v-model="form.nextDuetime" controls-position="right" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="整车档案ID：">
        <el-input v-model="form.vehicleProfileId" autocomplete="off"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="整车档案名称：">
            <el-input v-model="form.vehicleProfileName" autocomplete="off"></el-input>
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
import { addOrUpdate } from '@/api/vehiclePartsMaintenance';

export default {
  name: 'VehownerEditDialog',
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
        name: '',
        partsMaintenanceId: '',
        partsMaintenanceName: '',
        nextDate: '',
        nextMileage: '',
        nextDuemileage: '',
        nextDuetime: '',
        vehicleProfileId: '',
        vehicleProfileName: ''
      },
      rules: {
        name: [
          { required: true, message: '保养方案', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字', trigger: 'blur' }
        ]
      },
      submitLoading: false,
      formLabelWidth: '170px'
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
.m-vehiclePartsMaintenance-edit-dialog {
  .el-input-number {
    width: 100%;
  }
}
</style>
