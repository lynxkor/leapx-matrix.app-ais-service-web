<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>基础信息</h2>
    </div>
    <div class="common-section-body">
      <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
      <el-form :inline="true" :model="form" :rules="rules" ref="basicForm" label-width="190px" class="form-edit" v-if="isEditing || !_id">
        <el-form-item label="单据编号：" prop="code">
          <el-input
            placeholder="请输入"
            v-model="form.code"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="VIN码：" prop="vehProfileVin">
          <fetch-select
            filterable
            clearable
            remote
            reserve-keyword
            v-model="form.vehProfileVin"
            :remote-method="searchVehicle"
            @change="handleVinChange"
            :disabled="vinDisabled"
            value-key="vin"
            label-key="vin"
          />
        </el-form-item>
        <el-form-item label="车牌号：" prop="carPlate">
          <el-input
            placeholder="请输入"
            v-model="form.carPlate"
            clearable
          />
        </el-form-item>
        <el-form-item label="数据来源：" prop="dataSourceLabel">
          <el-input
            placeholder="请输入"
            v-model="form.dataSourceLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="门店名称：" prop="dealerName">
          <el-input
            placeholder="请输入"
            v-model="form.dealerName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="客户类型：" prop="custType">
          <fetch-select
            :request="fetchOptions"
            enumCode="CustomerTypeEnum"
            v-model="form.custType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="建议保养里程：" prop="maintenanceMileage">
          <el-input
            placeholder="请输入"
            v-model="form.maintenanceMileage"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="销售日期：" prop="saleDate">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.saleDate"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="专属服务门店：" prop="exclusiveServiceDealerName">
          <el-input
            placeholder="请输入"
            v-model="form.exclusiveServiceDealerName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="预约单号：" prop="appointmentNo">
          <el-input
            placeholder="请输入"
            v-model="form.appointmentNo"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="建议保养时间：" prop="maintenanceTime">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.maintenanceTime"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="保修开始日期：" prop="startWarrantyDate">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.startWarrantyDate"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="登记人：" prop="creatorName">
          <el-input
            placeholder="请输入"
            v-model="form.creatorName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="车主姓名：" prop="customerName">
          <el-input
            placeholder="请输入"
            v-model="form.customerName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="上次进店里程数：" prop="lastMileage">
          <el-input
            placeholder="请输入"
            v-model="form.lastMileage"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="绑车人用户ID：" prop="bindingUserId">
          <el-input
            placeholder="请输入"
            v-model="form.bindingUserId"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="基本车型：" prop="vehModelName">
          <el-input
            placeholder="请输入"
            v-model="form.vehModelName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="车主手机：" prop="customerPhone">
          <el-input
            placeholder="请输入"
            v-model="form.customerPhone"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="进店里程数：" prop="mileage">
          <el-input
            placeholder="请输入"
            v-model="form.mileage"
            clearable
          >
            <template slot="append">KM</template>
            <el-popover
              placement="bottom"
              width="250"
              slot="suffix"
              trigger="manual"
              v-if="popconfirmTitle"
              v-model="popoverVisible">
              <p>{{ popconfirmTitle }}</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleApply">应用</el-button>
              </div>
              <i
                class="el-icon-warning-outline el-input__icon"
                @click="popoverVisible = true"
                slot="reference"
              />
            </el-popover>
          </el-input>
        </el-form-item>
        <el-form-item label="车联网里程数（总）：" prop="netMileage">
          <el-input
            placeholder="请输入"
            v-model="form.netMileage"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="公告车型：" prop="vehRegisteredModelName">
          <el-input
            placeholder="请输入"
            v-model="form.vehRegisteredModelName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="送修人：" prop="shuttleName">
          <el-input
            placeholder="请输入"
            v-model="form.shuttleName"
            clearable
          />
        </el-form-item>
        <el-form-item label="离店里程数：" prop="departureMileage">
          <el-input
            placeholder="请输入"
            v-model="form.departureMileage"
            clearable
          >
            <template slot="append">KM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="离店车联网里程数（总）：" prop="departureNetMileage">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileage"
            clearable
          >
            <template slot="append">KM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="车辆年型（L）：" prop="vehYearTypeName">
          <el-input
            placeholder="请输入"
            v-model="form.vehYearTypeName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="送修人手机：" prop="shuttlePhone">
          <el-input
            placeholder="请输入"
            v-model="form.shuttlePhone"
            clearable
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="进店电量%：" prop="inPower">
          <el-input
            placeholder="请输入"
            v-model="form.inPower"
            clearable
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="进店车联网电量%：" prop="inNetPower">
          <el-input
            placeholder="请输入"
            v-model="form.inNetPower"
            clearable
            disabled
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="支付方式：" prop="payType">
          <fetch-select
            :request="fetchOptions"
            enumCode="PaymentMethodEnum"
            v-model="form.payType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="绑车人姓名：" prop="bindingUser">
          <el-input
            placeholder="请输入"
            v-model="form.bindingUser"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="离店电量%：" prop="outPower">
          <el-input
            placeholder="请输入"
            v-model="form.outPower"
            clearable
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="离店车联网电量%：" prop="outNetPower">
          <el-input
            placeholder="请输入"
            v-model="form.outNetPower"
            clearable
            disabled
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="保险公司名称：" prop="warrantyCompany">
          <el-input
            placeholder="请输入"
            v-model="form.warrantyCompany"
            clearable
          />
        </el-form-item>
        <el-form-item label="绑车人手机号码：" prop="bindingPhone">
          <el-input
            placeholder="请输入"
            v-model="form.bindingPhone"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="车联网里程数（纯）：" prop="netMileageElectricity">
          <el-input
            placeholder="请输入"
            v-model="form.netMileageElectricity"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="离店车联网里程数（纯）：" prop="departureNetMileageElectricity">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileageElectricity"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="车联网里程数（增）：" prop="netMileageExtend">
          <el-input
            placeholder="请输入"
            v-model="form.netMileageExtend"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="离店车联网里程数（增）：" prop="departureNetMileageExtend">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileageExtend"
            clearable
            disabled
          />
        </el-form-item>
          <el-form-item label="签字渠道：" prop="signChannelLabel">
          <el-input
            placeholder="请输入"
            v-model="form.signChannelLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="签字生成时间：" prop="signGeneratedOn">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.signGeneratedOn"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="签字完成时间：" prop="signCompletedOn">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.signCompletedOn"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredOn">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.signUrlExpiredOn"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="form-detail" v-else>
        <el-form-item label="单据编号：" prop="code">
          {{ form.code }}
        </el-form-item>
        <el-form-item label="VIN码：" prop="vehProfileVin">
          <el-link type="success" :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${form.vehProfileId}`" target="_blank">{{ form.vehProfileVin }}</el-link>
        </el-form-item>
        <el-form-item label="车牌号：" prop="carPlate">
          {{ form.carPlate }}
        </el-form-item>
        <el-form-item label="数据来源：" prop="dataSourceLabel">
          {{ form.dataSourceLabel }}
        </el-form-item>
        <el-form-item label="门店名称：" prop="dealerName">
          <el-link type="success" :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.dealerCode}`" target="_blank">{{ form.dealerName }}</el-link>
        </el-form-item>
        <el-form-item label="客户类型：" prop="custTypeLabel">
          {{ form.custTypeLabel }}
        </el-form-item>
        <el-form-item label="建议保养里程：" prop="maintenanceMileage">
          {{ form.maintenanceMileage }}
        </el-form-item>
        <el-form-item label="销售日期：" prop="saleDate">
          {{ form.saleDate }}
        </el-form-item>
        <el-form-item label="专属服务门店：" prop="exclusiveServiceDealerName">
          <el-link type="success" :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.exclusiveServiceDealerCode}`" target="_blank">{{ form.exclusiveServiceDealerName }}</el-link>
        </el-form-item>
        <el-form-item label="预约单号：" prop="appointmentNo">
          {{ form.appointmentNo }}
        </el-form-item>
        <el-form-item label="建议保养时间：" prop="maintenanceTime">
          {{ form.maintenanceTime }}
        </el-form-item>
        <el-form-item label="保修开始日期：" prop="startWarrantyDate">
          {{ form.startWarrantyDate }}
        </el-form-item>
        <el-form-item label="登记人：" prop="creatorName">
          <el-link type="success" :href="`/partner/user/list/detail?&userId=${form.creator}`" target="_blank">{{ form.creatorName }}</el-link>
        </el-form-item>
        <el-form-item label="车主姓名：" prop="customerName">
          {{ form.customerName }}
        </el-form-item>
        <el-form-item label="上次进店里程数：" prop="lastMileage">
          {{ form.lastMileage }}
        </el-form-item>
        <el-form-item label="绑车人用户ID：" prop="bindingUserId">
          {{ form.bindingUserId }}
        </el-form-item>
        <el-form-item label="基本车型：" prop="vehModelName">
          <el-link type="success" :href="`/sales/datacenter/materials/vehicleModel/detail?id=${form.vehModelId}`" target="_blank">{{ form.vehModelName }}</el-link>
        </el-form-item>
        <el-form-item label="车主手机：" prop="customerPhone">
          {{ form.customerPhone }}
        </el-form-item>
        <el-form-item label="进店里程数：" prop="mileage">
          {{ form.mileage }}
        </el-form-item>
        <el-form-item label="车联网里程数（总）：" prop="netMileage">
          {{ form.netMileage }}
        </el-form-item>
        <el-form-item label="公告车型：" prop="vehRegisteredModelName">
          <el-link type="success" :href="`/sales/datacenter/materials/vehicleRegisteredModel/detail?id=${form.vehRegisteredModelId}`" target="_blank">{{ form.vehRegisteredModelName }}</el-link>
        </el-form-item>
        <el-form-item label="送修人：" prop="shuttleName">
          {{ form.shuttleName }}
        </el-form-item>
        <el-form-item label="离店里程数：" prop="departureMileage">
          {{ form.departureMileage }}
        </el-form-item>
        <el-form-item label="离店车联网里程数（总）：" prop="departureNetMileage">
          {{ form.departureNetMileage }}
        </el-form-item>
        <el-form-item label="车辆年型（L）：" prop="vehYearTypeName">
          <el-link type="success" :href="`/sales/datacenter/materials/vehicleYearType/detail?id=${form.vehYearTypeId}`" target="_blank">{{ form.vehYearTypeName }}</el-link>
        </el-form-item>
        <el-form-item label="送修人手机：" prop="shuttlePhone">
          {{ form.shuttlePhone }}
        </el-form-item>
        <el-form-item label="进店电量%：" prop="inPower">
          {{ form.inPower }}
        </el-form-item>
        <el-form-item label="进店车联网电量%：" prop="inNetPower">
          {{ form.inNetPower }}
        </el-form-item>
        <el-form-item label="支付方式：" prop="payTypeLabel">
          {{ form.payTypeLabel }}
        </el-form-item>
        <el-form-item label="绑车人姓名：" prop="bindingUser">
          {{ form.bindingUser }}
        </el-form-item>
        <el-form-item label="离店电量%：" prop="outPower">
          {{ form.outPower }}
        </el-form-item>
        <el-form-item label="离店车联网电量%：" prop="outNetPower">
          {{ form.outNetPower }}
        </el-form-item>
        <el-form-item label="保险公司名称：" prop="warrantyCompany">
          {{ form.warrantyCompany }}
        </el-form-item>
        <el-form-item label="绑车人手机号码：" prop="bindingPhone">
          {{ form.bindingPhone }}
        </el-form-item>
        <el-form-item label="车联网里程数（纯）：" prop="netMileageElectricity">
          {{ form.netMileageElectricity }}
        </el-form-item>
        <el-form-item label="离店车联网里程数（纯）：" prop="departureNetMileageElectricity">
          {{ form.departureNetMileageElectricity }}
        </el-form-item>
        <el-form-item label="车联网里程数（增）：" prop="netMileageExtend">
          {{ form.netMileageExtend }}
        </el-form-item>
        <el-form-item label="离店车联网里程数（增）：" prop="departureNetMileageExtend">
          {{ form.departureNetMileageExtend }}
        </el-form-item>
        <el-form-item label="签字渠道：" prop="signChannelLabel">
          {{ form.signChannelLabel }}
        </el-form-item>
        <el-form-item label="签字生成时间：" prop="signGeneratedOn">
          {{ form.signGeneratedOn }}
        </el-form-item>
        <el-form-item label="签字完成时间：" prop="signCompletedOn">
          {{ form.signCompletedOn }}
        </el-form-item>
        <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredOn">
          {{ form.signUrlExpiredOn }}
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getVehicleProfile, getCarInfo, checkVinTag, getEnum } from '@/api/maintain/sp/serviceProxy/index';
import { RepairOrderStatusEnum } from '../../edit.vue';

export default {
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    // rules: {
    //   type: Object,
    //   default: () => {}
    // },
    isEditing: {
      type: Boolean,
      default: false
    },
    _id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    vinDisabled () {
      return !!this.form.orderStatus && this.form.orderStatus !== RepairOrderStatusEnum.RECEPTION_INSPECTION;
    }
  },
  components: {
    FetchSelect
  },
  watch: {
    formData: {
      handler (val) {
        if (val) {
          this.form = val;
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      form: {},
      popoverVisible: false,
      rules: {
        vehProfileVin: [
          { required: true, message: '请输入VIN', trigger: 'change' }
        ],
        mileage: [
          { required: true, message: '请输入进店里程数', trigger: 'change' },
          { pattern: /^\d+\.*\d*$/, message: '进店里程数必须为数字', trigger: 'blur' }
        ],
        shuttleName: [
          { required: true, message: '请输入送修人姓名', trigger: 'change' }
        ],
        shuttlePhone: [
          { required: true, message: '请输入送修人手机', trigger: 'change' }
        ],
      },
      popconfirmTitle: ''
    };
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getFormData () {
      return new Promise((resolve, reject) => {
        if (+this.form.mileage < +this.form.lastMileage) {
          this.$message.error(`本次进店里程数：${this.form.mileage}需要大于等于上次进店里程数${this.form.lastMileage},请重新填写进店里程数`);
        } else if (+this.form.mileage >= +this.form.netMileage + 100) {
          this.popconfirmTitle = '进店里程数大于车联网里程数，请确认是否清空重新录入';
          this.$nextTick(() => {
            this.popoverVisible = true;
          });
        } else if (+this.form.mileage + 100 < +this.form.netMileage) {
          this.popconfirmTitle = '进店里程数小于车联网里程数，请确认是否清空重新录入';
          this.$nextTick(() => {
            this.popoverVisible = true;
          });
        } else if (this.$refs.basicForm) {
          this.$refs.basicForm.validate((valid) => {
            if (valid) {
              resolve(this.form);
            }
          });
        } else {
          resolve(this.form);
        }
      });
    },
    handleApply () {
      this.popconfirmTitle = '';
      this.form.mileage = '';
      this.popoverVisible = false;
    },
    clearValidate () {
      this.$refs.basicForm.clearValidate();
    },
    searchVehicle (query) {
      if (!query) {
        return Promise.resolve([]);
      }
      return getVehicleProfile({ searchVin: query });
    },
    handleVinChange (val, record) {
      if (record.vin) {
        checkVinTag(record.vin).then(res => {
          const data = {
            carPlate: record.vehiclePlateNo, // 车牌号
            maintenanceMileage: record.vehicleProfileServiceResp.nextMaintainMileages, // 建议保养里程
            maintenanceTime: record.vehicleProfileServiceResp.nextMaintainDate, // 建议保养时间
            customerName: record.vehicleProfileOwnerResp.ownerName, // 车主姓名
            customerPhone: record.vehicleProfileOwnerResp.mobilephone, // 车主手机
            exclusiveServiceDealerId: record.vehicleProfileServiceResp.serviceDealerCode, // 专属服务门店
            exclusiveServiceDealerName: record.vehicleProfileServiceResp.serviceDealerName, // 专属服务门店
            dedicatedServiceManagerId: record.vehicleProfileServiceResp.serviceUserId, // 专属客户经理
            startWarrantyDate: record.vehicleProfileServiceResp.warrantyStartdate, // 保修开始日期
            saleDate: record.salesDate, // 销售日期
            motorModel: record.motorModel, // 电机型号
            motorSerialNumber: record.motorSerialNumber, // 电机序列号
            batteryModel: record.batteryModel, // 电池型号
            batterySerialNumber: record.batterySerialNumber, // 电池序列号
            vehModelId: record.vehicleModelId, // 基本车型
            vehModelName: record.vehicleModelName, // 基本车型
            vehRegisteredModelId: record.carSaleSversionId, // 公告车型
            vehRegisteredModelName: record.carSalesVersionName, // 公告车型
            vehYearTypeId: record.vehicleYearId, // 车辆年型（L）
            vehYearTypeName: record.vehicleYearName, // 车辆年型（L）
            engineNumber: record.enginenNumber, // 发动机号
            lastMileage: record.vehicleProfileServiceResp.lastMileage, // 上次进店里程
            bindingUserId: record.vehicleProfileOwnerResp.bindingUserId, // 绑车人用户ID
            bindingUser: record.vehicleProfileOwnerResp.bindingUser, // 绑车人姓名
            bindingPhone: record.vehicleProfileOwnerResp.bindingPhone, // 绑车人手机号
          };
          Object.assign(this.form, { ...data });
          this.getNetworkCarInfo();
        });
      }
    },
    getNetworkCarInfo () {
      getCarInfo(this.form.vehProfileVin).then(res => {
        Object.assign(this.form, {
          netMileage: res.mileage, // 车联网总里程
          inPower: res.electricity, // 进店电量
          netMileageElectricity: res.electricalMileage || '',
          // departureNetMileageElectricity: ,
          netMileageExtend: res.oilMileage,
          // departureNetMileageExtend: '',
          inNetPower: res.electricity,
          mileage: res.mileage
        });
        // if (!this.form.netMileage) this.form.netMileage = res.mileage;
        // if (!this.form.inPower) this.form.inPower = res.electricity;
      });
    }
  }
};

</script>
