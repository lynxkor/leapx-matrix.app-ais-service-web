<template>
  <el-dialog
    title="调整保养信息"
    :visible.sync="dialogVisible"
    width="900px"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form :inline="true" :model="form" :rules="rules" ref="formRef" label-width="150px" class="info-form">
      <el-form-item label="下次保养时间：" prop="nextMaintainDate">
        <el-date-picker
          v-model="form.nextMaintainDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="onFieldChange"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="下次保养里程：" prop="nextMaintainMileages">
        <el-input
          clearable
          v-model="form.nextMaintainMileages"
          placeholder="请输入"
          maxlength="20"
          @blur="onFieldChange"
        />
      </el-form-item>
    </el-form>
    <next-table
      :id="vehicleProfileId"
      :isEdit="true"
      @update="$emit('update')"
    />
  </el-dialog>
</template>

<script>
import moment from 'moment';
import NextTable from '../NextTable.vue';
import { updateFlat } from '@/api/datacenter/vehicle/vehicleProfile';

export default {
  name: 'InfoDialog',
  components: {
    NextTable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vehicleProfileId: {
      type: [String, Number],
      default: null,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    const validateMileage = (rule, value, callback) => {
      if (value !== '' && value !== null && value !== undefined && isNaN(Number(value))) {
        callback(new Error('必须为数字'));
      } else {
        callback();
      }
    };
    return {
      form: {
        nextMaintainDate: null,
        nextMaintainMileages: '',
      },
      originalForm: {
        nextMaintainDate: null,
        nextMaintainMileages: '',
      },
      rules: {
        nextMaintainMileages: [{ validator: validateMileage, trigger: 'blur' }],
      },
      saving: false,
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      },
    },
  },
  watch: {
    data: {
      handler (val) {
        this.form.nextMaintainDate = moment(val.nextMaintainDate || '').format('YYYY-MM-DD HH:mm:ss');
        this.form.nextMaintainMileages = val.nextMaintainMileages || '';
        this.originalForm = { ...this.form };
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onClose () {
      this.dialogVisible = false;
    },
    onFieldChange () {
      if (this.saving) return;
      this.$refs.formRef.validate((valid) => {
        if (!valid) return;
        const noChange =
          this.form.nextMaintainDate === this.originalForm.nextMaintainDate &&
          Number(this.form.nextMaintainMileages) === Number(this.originalForm.nextMaintainMileages);
        if (noChange) return;
        this.saving = true;
        updateFlat({
          id: this.vehicleProfileId,
          nextMaintainDate: this.form.nextMaintainDate === 'Invalid date' ? null : this.form.nextMaintainDate,
          nextMaintainMileages: this.form.nextMaintainMileages,
        }).then(() => {
          this.$message.success('保存成功');
          this.originalForm = { ...this.form };
          this.$emit('update');
        }).finally(() => {
          this.saving = false;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.info-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}
.page-common-edit .el-form-item, .page-common-detail .el-form-item{
  width: 50%;
}
</style>
