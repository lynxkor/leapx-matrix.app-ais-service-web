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
        <div style="display: flex; align-items: center; width: 100%;">
          <el-input
            clearable
            v-model="form.nextMaintainMileages"
            placeholder="请输入"
            maxlength="20"
            @change="onFieldChange"
            style="flex: 1; min-width: 0;"
          />
          <el-button
            v-if="canReset"
            size="small"
            type="success"
            :loading="resettingVehicle"
            :disabled="saving"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="handleResetVehicle"
          >重置</el-button>
        </div>
      </el-form-item>
    </el-form>
    <next-table
      :id="vehicleProfileId"
      :vin="vin"
      :canReset="canReset"
      :isEdit="true"
      @update="$emit('update')"
    />
  </el-dialog>
</template>

<script>
import moment from 'moment';
import NextTable from '../NextTable.vue';
import { updateFlat } from '@/api/datacenter/vehicle/vehicleProfile';
import { resetVehicle } from '@/api/maintain/basic/maintenanceRemind';
import { getCarInfo } from '@/api/maintain/sp/serviceProxy';

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
    vin: {
      type: String,
      default: '',
    },
    canReset: {
      type: Boolean,
      default: false,
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
      pendingSave: false,
      resettingVehicle: false,
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
        this.form.nextMaintainDate = val.nextMaintainDate && moment(val.nextMaintainDate).isValid() ? moment(val.nextMaintainDate).format('YYYY-MM-DD HH:mm:ss') : null;
        this.form.nextMaintainMileages = val.nextMaintainMileages || '';
        this.originalForm = { ...this.form };
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async handleResetVehicle () {
      if (this.resettingVehicle || this.saving) return;
      if (!this.vin) {
        this.$message.warning('缺少车辆 VIN,无法重置');
        return;
      }
      this.resettingVehicle = true;
      try {
        const carInfo = await getCarInfo(this.vin);
        const totalMileage = carInfo && carInfo.mileage;
        if (totalMileage === null || totalMileage === undefined || totalMileage === '') {
          this.$message.warning('未获取到车联网里程,无法重置');
          return;
        }
        await this.$confirm(
          `当前车联网里程(总)为 ${totalMileage} km,是否确定重置?`,
          '重置确认',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        );
        const res = await resetVehicle({ vin: this.vin });
        this.form.nextMaintainDate = res.nextMaintainDate && moment(res.nextMaintainDate).isValid()
          ? moment(res.nextMaintainDate).format('YYYY-MM-DD HH:mm:ss')
          : null;
        this.form.nextMaintainMileages = res.nextMaintainMileages ?? '';
        this.originalForm = { ...this.form };
        this.$message.success('重置成功');
        this.$emit('vehicle-reset', res);
        this.$emit('update');
      } catch (e) {
        if (e === 'cancel' || e?.message === 'cancel') return;
        this.$message.error(e?.message || '重置失败');
      } finally {
        this.resettingVehicle = false;
      }
    },
    onClose () {
      this.dialogVisible = false;
    },
    onFieldChange () {
      if (this.saving) {
        this.pendingSave = true;
        return;
      }
      this.$refs.formRef.validate((valid) => {
        if (!valid) return;
        if (this.isNoChange()) return;

        this.saving = true;
        const sentDate = this.normalizeDate(this.form.nextMaintainDate);
        const sentMileages = this.normalizeMileages(this.form.nextMaintainMileages);

        updateFlat({
          id: this.vehicleProfileId,
          nextMaintainDate: sentDate,
          nextMaintainDateSetNull: !sentDate,
          nextMaintainMileages: sentMileages,
          nextMaintainMileagesSetNull: !sentMileages,
        }).then(() => {
          this.$message.success('保存成功');
          this.syncOriginalForm(sentDate, sentMileages);
          this.$emit('update');
        }).finally(() => {
          this.saving = false;
          if (this.pendingSave) {
            this.pendingSave = false;
            this.$nextTick(() => this.onFieldChange());
          }
        });
      });
    },
    isNoChange () {
      return this.normalizeDate(this.form.nextMaintainDate) === this.normalizeDate(this.originalForm.nextMaintainDate) &&
        this.normalizeMileages(this.form.nextMaintainMileages) === this.normalizeMileages(this.originalForm.nextMaintainMileages);
    },
    normalizeDate (val) {
      return (!val || val === 'Invalid date') ? null : val;
    },
    normalizeMileages (val) {
      return (val === '' || val === null || val === undefined) ? null : val;
    },
    syncOriginalForm (sentDate, sentMileages) {
      if (this.normalizeDate(this.form.nextMaintainDate) === sentDate) {
        this.originalForm.nextMaintainDate = this.form.nextMaintainDate;
      }
      if (this.normalizeMileages(this.form.nextMaintainMileages) === sentMileages) {
        this.originalForm.nextMaintainMileages = this.form.nextMaintainMileages;
      }
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
