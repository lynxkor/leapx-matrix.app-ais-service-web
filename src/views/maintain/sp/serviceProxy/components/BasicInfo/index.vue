<template>
  <section class="common-section" style="margin-top: 0;">
    <div class="common-section-header">
      <h2>基础信息</h2>
    </div>
    <div class="common-section-body">
      <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
      <el-form :inline="true" :model="form" :rules="rules" ref="basicForm" label-width="190px" class="form-edit" v-if="isEditing || !_id" :disabled="formDisabled">
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
            v-if="!vinDisabled"
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
            :selectRef="onSelectRef"
          />
          <LPEncrypted
            v-else
            :value.sync="form.vehProfileVin"
            :decryptMethod="() => getDecryptField(form.id, 'vehProfileVin')"
          >
            <el-input
              placeholder="请输入"
              v-model="form.vehProfileVin"
              clearable
              :disabled="vinDisabled"
            />
          </LPEncrypted>
        </el-form-item>
        <el-form-item label="车牌号：" prop="carPlate" :required="carPlateRequired">
          <el-input
            v-if="!_id"
            placeholder="请输入"
            v-model="form.carPlate"
            clearable
            :disabled="carPlateDisabled"
          />
          <LPEncrypted
            v-else
            :value.sync="form.carPlate"
            :decryptMethod="() => getDecryptField(form.id, 'carPlate')"
          >
            <el-input
              placeholder="请输入"
              v-model="form.carPlate"
              clearable
              :disabled="carPlateDisabled"
            />
          </LPEncrypted>
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
            disabled
            enumCode="CustomerTypeEnum"
            v-model="form.custType"
            placeholder="请选择"
            clearable
            filterable
            @change="handleCustomTypeChange"
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
            v-if="!_id"
            placeholder="请输入"
            v-model="form.customerName"
            clearable
            disabled
          />
          <LPEncrypted
            v-else
            :value.sync="form.customerName"
            :decryptMethod="() => getDecryptField(form.id, 'customerName')"
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
            v-if="!_id"
            placeholder="请输入"
            v-model="form.customerPhone"
            clearable
            disabled
          />
          <LPEncrypted
            v-else
            :value.sync="form.customerPhone"
            :decryptMethod="() => getDecryptField(form.id, 'customerPhone')"
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
            v-if="!_id"
            placeholder="请输入"
            v-model="form.shuttleName"
            clearable
          />
          <LPEncrypted
            v-else
            :value.sync="form.shuttleName"
            :decryptMethod="() => getDecryptField(form.id, 'shuttleName')"
          >
            <el-input
              placeholder="请输入"
              v-model="form.shuttleName"
              clearable
            />
          </LPEncrypted>
        </el-form-item>
        <el-form-item label="离店里程数：" prop="departureMileage">
          <el-input
            placeholder="请输入"
            v-model="form.departureMileage"
            clearable
            maxlength="10"
          >
            <template slot="append">KM</template>
          </el-input>
        </el-form-item>
        <el-form-item label="离店车联网里程数（总）：" prop="departureNetMileage">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileage"
            clearable
            disabled
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
            v-if="!_id"
            placeholder="请输入"
            v-model="form.shuttlePhone"
            clearable
            maxlength="11"
          />
          <LPEncrypted
            v-else
            :value.sync="form.shuttlePhone"
            :decryptMethod="() => getDecryptField(form.id, 'shuttlePhone')"
          >
            <el-input
              placeholder="请输入"
              v-model="form.shuttlePhone"
              clearable
              maxlength="11"
            />
          </LPEncrypted>
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
            v-if="!_id"
            placeholder="请输入"
            v-model="form.bindingUser"
            clearable
            disabled
          />
          <LPEncrypted
            v-else
            :value.sync="form.bindingUser"
            :decryptMethod="() => getDecryptField(form.id, 'bindingUser')"
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
        <!-- <el-form-item label="保险公司名称：" prop="warrantyCompany">
          <el-input
            placeholder="请输入"
            v-model="form.warrantyCompany"
            clearable
          />
        </el-form-item> -->
        <el-form-item label="绑车人手机号码：" prop="bindingPhone">
          <el-input
            v-if="!_id"
            placeholder="请输入"
            v-model="form.bindingPhone"
            clearable
            disabled
          />
          <LPEncrypted
            v-else
            :value.sync="form.bindingPhone"
            :decryptMethod="() => getDecryptField(form.id, 'bindingPhone')"
          />
        </el-form-item>
        <!-- <el-form-item label="车联网里程数（纯）：" prop="netMileageElectricity">
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
        </el-form-item> -->
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
          <LPEncrypted
            :value.sync="form.vehProfileVin"
            :decryptMethod="() => getDecryptField(form.id, 'vehProfileVin')"
          >
            <el-link type="success" :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${form.vehProfileId}`" target="_blank">{{ form.vehProfileVin }}</el-link>
          </LPEncrypted>
        </el-form-item>
        <el-form-item label="车牌号：" prop="carPlate">
          <LPEncrypted
            :value.sync="form.carPlate"
            :decryptMethod="() => getDecryptField(form.id, 'carPlate')"
          />
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
          {{ form.creatorName }}
          <!-- <el-link type="success" :href="`/partner/user/list/detail?&userId=${form.creator}`" target="_blank">{{ form.creatorName }}</el-link> -->
        </el-form-item>
        <el-form-item label="车主姓名：" prop="customerName">
          <LPEncrypted
            :value.sync="form.customerName"
            :decryptMethod="() => getDecryptField(form.id, 'customerName')"
          />
        </el-form-item>
        <el-form-item label="上次进店里程数：" prop="lastMileage">
          {{ form.lastMileage }}
        </el-form-item>
        <el-form-item label="绑车人用户ID：" prop="bindingUserId">
          {{ form.bindingUserId }}
        </el-form-item>
        <el-form-item label="基本车型：" prop="vehModelName">
          <el-link type="success" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.vehModelId}`" target="_blank">{{ form.vehModelName }}</el-link>
        </el-form-item>
        <el-form-item label="车主手机：" prop="customerPhone">
          <LPEncrypted
            :value.sync="form.customerPhone"
            :decryptMethod="() => getDecryptField(form.id, 'customerPhone')"
          />
        </el-form-item>
        <el-form-item label="进店里程数：" prop="mileage">
          {{ form.mileage }}
        </el-form-item>
        <el-form-item label="车联网里程数（总）：" prop="netMileage">
          {{ form.netMileage }}
        </el-form-item>
        <el-form-item label="公告车型：" prop="vehRegisteredModelName">
          <el-link type="success" :href="`/sales/datacenter/materials/vehicleRegisteredModel/edit?id=${form.vehRegisteredModelId}`" target="_blank">{{ form.vehRegisteredModelName }}</el-link>
        </el-form-item>
        <el-form-item label="送修人：" prop="shuttleName">
          <LPEncrypted
            :value.sync="form.shuttleName"
            :decryptMethod="() => getDecryptField(form.id, 'shuttleName')"
          />
        </el-form-item>
        <el-form-item label="离店里程数：" prop="departureMileage">
          {{ form.departureMileage }}
        </el-form-item>
        <el-form-item label="离店车联网里程数（总）：" prop="departureNetMileage">
          {{ form.departureNetMileage }}
        </el-form-item>
        <el-form-item label="车辆年型（L）：" prop="vehYearTypeName">
          <el-link type="success" :href="`/sales/datacenter/materials/vehicleYearType/edit?id=${form.vehYearTypeId}`" target="_blank">{{ form.vehYearTypeName }}</el-link>
        </el-form-item>
        <el-form-item label="送修人手机：" prop="shuttlePhone">
          <LPEncrypted
            :value.sync="form.shuttlePhone"
            :decryptMethod="() => getDecryptField(form.id, 'shuttlePhone')"
          />
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
          <LPEncrypted
            :value.sync="form.bindingUser"
            :decryptMethod="() => getDecryptField(form.id, 'bindingUser')"
          />
        </el-form-item>
        <el-form-item label="离店电量%：" prop="outPower">
          {{ form.outPower }}
        </el-form-item>
        <el-form-item label="离店车联网电量%：" prop="outNetPower">
          {{ form.outNetPower }}
        </el-form-item>
        <!-- <el-form-item label="保险公司名称：" prop="warrantyCompany">
          {{ form.warrantyCompany }}
        </el-form-item> -->
        <el-form-item label="绑车人手机号码：" prop="bindingPhone">
          <LPEncrypted
            :value.sync="form.bindingPhone"
            :decryptMethod="() => getDecryptField(form.id, 'bindingPhone')"
          />
        </el-form-item>
        <!-- <el-form-item label="车联网里程数（纯）：" prop="netMileageElectricity">
          {{ form.netMileageElectricity }}
        </el-form-item>
        <el-form-item label="离店车联网里程数（纯）：" prop="departureNetMileageElectricity">
          {{ form.departureNetMileageElectricity }}
        </el-form-item> -->
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
import LPEncrypted from '@/libs/components/LPEncrypted';
import { getVehicleProfile, getCarInfo, checkVinTag, getEnum, getActivityInfo, getRecentlyServiceProxy, getLastStoreMileage, getDecrypt } from '@/api/maintain/sp/serviceProxy/index';
import { RepairOrderStatusEnum, BusinessTypeEnum } from '../../constant';
import { getFileSaveUrl } from '@/utils';

export const CustomTypeEnum = {
  /** 预约客户 */
  APPOINTMENT_CUSTOMER: '10',
  /** 自然到店 */
  CUSTOMER: '20',
};

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
    },
    formDisabled () {
      return this.formData.orderStatus === RepairOrderStatusEnum.CANCEL || this.formData.orderStatus === RepairOrderStatusEnum.DELIVERED;
    },
    carPlateDisabled () {
      // 除已作废、已交车，则可编辑车牌号
      return this.form.orderStatus === RepairOrderStatusEnum.CANCEL || this.form.orderStatus === RepairOrderStatusEnum.DELIVERED;
    },
    carPlateRequired () {
      return this.checkCarPlateRequired();
    }
  },
  components: {
    FetchSelect,
    LPEncrypted
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
      RepairOrderStatusEnum,
      selectRef: null,
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
          { required: true, message: '请输入送修人手机', trigger: 'blur' },
          { pattern: /^1[\d*]{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        carPlate: [
          { validator: this.validateCarPlate, trigger: ['blur', 'change'] }
        ],
      },
      popconfirmTitle: ''
    };
  },
  methods: {
    checkCarPlateRequired () {
      // 如果开单时间 >= 销售日期 + 60天 且 销售日期有数据，则车牌号必填
      if (!this.form.saleDate) {
        return false;
      }
      const saleDate = new Date(this.form.saleDate);
      // 如果是新增,取当前时间,否则取开单时间
      const createTime = this.form.createTime ? new Date(this.form.createTime) : new Date();
      // 计算销售日期 + 60天
      const saleDatePlus60Days = new Date(saleDate);
      saleDatePlus60Days.setDate(saleDatePlus60Days.getDate() + 60);
      // 如果开单时间 >= 销售日期 + 60天，则车牌号必填
      return createTime >= saleDatePlus60Days;
    },
    validateCarPlate (_rule, value, callback) {
      // 如果开单时间 >= 销售日期 + 60天 且 销售日期有数据，则车牌号必填
      if (this.checkCarPlateRequired()) {
        if (!value || value.trim() === '') {
          callback(new Error('请输入车牌号'));
        } else {
          callback();
        }
        return;
      }
      // 其他情况非必填
      callback();
    },
    scrollToError (invalidFields) {
      if (!invalidFields || !Object.keys(invalidFields).length) return;
      // 查找包含错误信息的表单项
      const errorItem = this.$refs.basicForm.$el.querySelector('.is-error');
      if (errorItem) {
        // 找到最近的 el-form-item
        const formItem = errorItem.closest('.el-form-item');
        if (formItem) {
          formItem.style.scrollMarginTop = '150px';
          formItem.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
        setTimeout(() => {
          formItem.style.scrollMarginTop = '';
        }, 100);
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getFormData () {
      return new Promise((resolve, reject) => {
        // 4.0去掉相关校验
        // if (+this.form.mileage < +this.form.lastMileage) {
        //   this.$message.error(`本次进店里程数：${this.form.mileage}需要大于等于上次进店里程数${this.form.lastMileage},请重新填写进店里程数`);
        // } else if (+this.form.mileage >= +this.form.netMileage + 100) {
        //   this.popconfirmTitle = '进店里程数大于车联网里程数，请确认是否清空重新录入';
        //   this.$nextTick(() => {
        //     this.popoverVisible = true;
        //   });
        // } else if (+this.form.mileage + 100 < +this.form.netMileage) {
        //   this.popconfirmTitle = '进店里程数小于车联网里程数，请确认是否清空重新录入';
        //   this.$nextTick(() => {
        //     this.popoverVisible = true;
        //   });
        // } else if (this.$refs.basicForm) {
        if (this.$refs.basicForm) {
          this.$refs.basicForm.validate((valid, invalidFields) => {
            if (valid) {
              resolve(this.form);
            } else {
              this.$nextTick(() => {
                this.scrollToError(invalidFields);
              });
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
      this.$refs.basicForm?.clearValidate();
    },
    searchVehicle (query) {
      if (!query) {
        return Promise.resolve([]);
      }
      const searchKey = query?.trim();
      return getVehicleProfile({ searchVin: searchKey });
    },
    onSelectRef (el) {
      this.selectRef = el;
    },
    handleVinChange (val, record) {
      if (record?.vin) {
        checkVinTag(record.vin).then(res => {
          this.selectRef?.blur();
          if (res) {
            const message = `<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">该车辆为${res}，请注意接待。</div>`;
            this.$confirm(message, '', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true,
              showCancelButton: false,
              customClass: 'ais-leave-tips',
              showClose: false
            }).then(() => {
            }).catch(() => {
            });
          }
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
            bindingUserId: record.vehicleProfileOwnerResp.bindingUserid, // 绑车人用户ID
            bindingUser: record.vehicleProfileOwnerResp.bindingUser, // 绑车人姓名
            bindingPhone: record.vehicleProfileOwnerResp.bindingPhone, // 绑车人手机号
            shuttleName: record.vehicleProfileOwnerResp.ownerName,
            shuttlePhone: record.vehicleProfileOwnerResp.mobilephone,
          };
          Object.assign(this.form, { ...data });
          this.getNetworkCarInfo();
          this.checkActivity();
          this.getRecentlyServiceProxy();
          this.getLastStoreMileage();
        });
      }
    },
    getRecentlyServiceProxy () {
      getRecentlyServiceProxy(this.form.vehProfileVin).then(res => {
        if (res) {
          this.form.anomalyDescription = res.anomalyDescription || '';
          this.form.exteriorPhotoList = (res.exteriorPhotoList || []).map(item => ({
            fileId: item.fileId,
            fileUrl: getFileSaveUrl(item),
            fileType: item.fileType,
            attachType: item.attachType,
            configCode: item.configCode
          }));
          this.form.interiorPhotoList = (res.interiorPhotoList || []).map(item => ({
            fileId: item.fileId,
            fileUrl: getFileSaveUrl(item),
            fileType: item.fileType,
            attachType: item.attachType,
            configCode: item.configCode
          }));
        }
      });
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
    },
    getLastStoreMileage () {
      getLastStoreMileage(this.form.vehProfileVin).then(res => {
        Object.assign(this.form, {
          lastMileage: res, // 上次施工单进店里程
        });
      });
    },
    // 校验是否有活动
    checkActivity () {
      getActivityInfo(this.form.vehProfileVin).then(res => {
        if (res) {
          const message = `<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>提示</div><div class="ais-leave-tips-sub">${res}</div>`;
          this.$confirm(message, '', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            showCancelButton: false,
            customClass: 'ais-leave-tips',
            showClose: false
          }).then(() => {
          }).catch(() => {
          });
        }
      });
    },
    getDecryptField (id, field) {
      return getDecrypt(id, field);
    },
    handleCustomTypeChange (value) {
      this.$emit('update:formData', {
        ...this.formData,
        customType: value,
        businessType: value === CustomTypeEnum.APPOINTMENT_CUSTOMER ? BusinessTypeEnum.APPOINTMENT_ARRIVAL : BusinessTypeEnum.NATURAL_ARRIVAL
      });
    }
  }
};
</script>
