<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="beforeClose"
    @close="onClose"
  >
    <template slot="title">
      <span class="dialog-title-text">调整保养信息</span>
      <el-tooltip
        placement="top"
        effect="light"
        popper-class="reset-formula-tooltip"
      >
        <i class="el-icon-info dialog-title-icon" />
        <template slot="content">
          <div class="reset-formula">
            <div class="reset-formula-section">
              <div class="reset-formula-title">车辆的保养重置:</div>
              <div>下次保养时间 = 重置触发的时间 + 下次保养计算时间(月)</div>
              <div>下次保养里程 = 重置时的车联网里程 + 下次保养计算里程(km)</div>
            </div>
            <div class="reset-formula-section">
              <div class="reset-formula-title">零部件的保养重置:</div>
              <div>下次保养时间 = 重置触发的时间 + 定期保养时间间隔(月)</div>
              <div>下次保养里程 = 重置时的车联网里程/车联网里程数(增) + 定期保养里程间隔(km)</div>
            </div>
          </div>
        </template>
      </el-tooltip>
    </template>
    <el-form :inline="true" :model="form" :rules="rules" ref="formRef" label-width="150px" class="info-form">
      <el-form-item label="下次保养时间：" prop="nextMaintainDate">
        <el-date-picker
          v-model="form.nextMaintainDate"
          type="datetime"
          :disabled="!isEditing"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="下次保养里程：" prop="nextMaintainMileages">
        <div style="display: flex; align-items: center; width: 100%;">
          <el-input-number
            v-model="form.nextMaintainMileages"
            placeholder="请输入"
            :disabled="!isEditing"
            maxlength="20"
            precision="2"
            min="0"
            :controls="false"
            style="flex: 1; min-width: 0;"
          />
          <el-button
            v-if="!isEditing"
            size="small"
            type="primary"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="enterEdit"
          >编辑</el-button>
          <el-button
            v-if="!isEditing && canResetVehicle"
            size="small"
            :loading="resettingVehicle"
            :disabled="saving"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="handleResetVehicle"
          >重置</el-button>
          <el-button
            v-if="isEditing"
            size="small"
            type="primary"
            :loading="saving"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="handleSave"
          >保存</el-button>
          <el-button
            v-if="isEditing"
            size="small"
            style="margin-left: 10px; flex-shrink: 0;"
            @click="handleCancel"
          >取消</el-button>

        </div>
      </el-form-item>
    </el-form>
    <next-table
      :id="vehicleProfileId"
      :vin="vin"
      :canResetPart="canResetPart"
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
    canResetVehicle: {
      type: Boolean,
      default: false,
    },
    canResetPart: {
      type: Boolean,
      default: false,
    }
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
      resettingVehicle: false,
      isEditing: false,
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
        // 后端字段:nextMaintenanceDate / nextMaintenanceMileage(注意"tion"和单数)
        this.form.nextMaintainDate = res.nextMaintenanceDate && moment(res.nextMaintenanceDate).isValid()
          ? moment(res.nextMaintenanceDate).format('YYYY-MM-DD HH:mm:ss')
          : null;
        this.form.nextMaintainMileages = res.nextMaintenanceMileage ?? '';
        this.originalForm = { ...this.form };
        this.$message.success('重置成功');
        this.$emit('vehicle-reset', res);
        this.$emit('update');
      } finally {
        this.resettingVehicle = false;
      }
    },
    enterEdit () {
      this.isEditing = true;
    },
    handleCancel () {
      this.form = { ...this.originalForm };
      this.isEditing = false;
      this.$nextTick(() => {
        if (this.$refs.formRef) this.$refs.formRef.clearValidate();
      });
    },
    async handleSave () {
      if (this.saving) return;
      // 项目里 el-form.validate 使用 callback 风格,包一层 Promise 便于 async/await
      const valid = await new Promise(resolve => {
        this.$refs.formRef.validate((ok) => resolve(ok));
      });
      if (!valid) return;
      if (this.isNoChange()) {
        // 无变更:直接退出编辑态,不调接口
        this.isEditing = false;
        return;
      }
      this.saving = true;
      try {
        const sentDate = this.normalizeDate(this.form.nextMaintainDate);
        const sentMileages = this.normalizeMileages(this.form.nextMaintainMileages);
        await updateFlat({
          id: this.vehicleProfileId,
          nextMaintainDate: sentDate,
          nextMaintainDateSetNull: !sentDate,
          nextMaintainMileages: sentMileages,
          nextMaintainMileagesSetNull: !sentMileages,
        });
        this.$message.success('保存成功');
        this.syncOriginalForm(sentDate, sentMileages);
        this.isEditing = false;
        this.$emit('update');
      } catch (e) {
        // axios 拦截器已统一处理错误 toast;此处不需额外处理,保留编辑态供用户重试
      } finally {
        this.saving = false;
      }
    },
    onClose () {
      this.dialogVisible = false;
      this.isEditing = false;
    },
    beforeClose (done) {
      if (!this.isEditing) {
        done();
        return;
      }
      if (this.isNoChange()) {
        // 编辑态但无修改:直接关闭,不打扰
        done();
        return;
      }
      this.$confirm('当前有未保存的修改,确定关闭吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        done();
      }).catch(() => {
        // 用户选「取消」,留在对话框
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
.dialog-title-text {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  margin-right: 8px;
}
.dialog-title-icon {
  cursor: help;
  color: #909399;
  font-size: 16px;
  vertical-align: middle;
  &:hover {
    color: var(--leap-color-primary, #4C4CD6);
  }
}
.reset-formula-tooltip {
  max-width: 360px;
  .reset-formula {
    line-height: 1.6;
    font-size: 12px;
  }
  .reset-formula-section {
    & + .reset-formula-section {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #ebeef5;
    }
  }
  .reset-formula-title {
    font-weight: 600;
    margin-bottom: 2px;
  }
}
</style>
