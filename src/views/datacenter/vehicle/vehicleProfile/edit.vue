<template>
  <edit-page-layout ref="editLayout" title="车辆档案明细">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`VIN码：${form.vin}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <!-- 第一段：基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail" v-show="!isEditing">
                <LPEncrypted
                  :value.sync="form.vin"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'vin')"
                >
                  <el-form-item label="VIN码：">
                    {{ form.vin }}
                  </el-form-item>
                </LPEncrypted>
                <LPEncrypted
                  :value.sync="form.vehiclePlateNo"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'vehiclePlateNo')"
                >
                <el-form-item label="车牌号：">
                  {{ form.vehiclePlateNo }}
                </el-form-item>
                </LPEncrypted>
                <el-form-item label="整车物料编码：">
                  {{ form.vehicleMaterialCode }}
                </el-form-item>
                <el-form-item label="整车物料描述：">
                  {{ form.vehicleMaterialDesc }}
                </el-form-item>
                <el-form-item label="VDC入库日期：">
                  {{ form.vdcInboundOn }}
                </el-form-item>
                <el-form-item label="电池型号：">
                  {{ form.batteryModel }}
                </el-form-item>
                <el-form-item label="电池序列号：">
                  {{ form.batterySerialNumber }}
                </el-form-item>
                <el-form-item label="发动机号：">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="变速箱号：">
                  {{ form.gearboxCode }}
                </el-form-item>
                <el-form-item label="制造日期：">
                  {{ form.manufacturingDate }}
                </el-form-item>
                <el-form-item label="电机型号：">
                  {{ form.motorModel }}
                </el-form-item>
                <el-form-item label="电机序列号：">
                  {{ form.motorSerialNumber }}
                </el-form-item>
                <el-form-item label="销售公告车型名称：">
                  {{ form.carSalesVersionName }}
                </el-form-item>
                <el-form-item label="合格证号：">
                  {{ form.certNumber }}
                </el-form-item>
                <el-form-item label="电驱序列号(后)：">
                  {{ form.electricnumberAfter }}
                </el-form-item>
                <el-form-item label="电驱序列号(前)：">
                  {{ form.electricnumberBefore }}
                </el-form-item>
                <el-form-item label="发动机型号：">
                  {{ form.enginenModel }}
                </el-form-item>
                <el-form-item label="制造工厂名称：">
                  {{ form.factoryinfoName }}
                </el-form-item>
                <el-form-item label="车身颜色：">
                  {{ form.vehicleColor }}
                </el-form-item>
                <el-form-item label="车辆品牌：">
                  {{ form.vehicleDepartment }}
                </el-form-item>
                <el-form-item label="车辆出厂时间：">
                  {{ form.vehicleDepartureTime }}
                </el-form-item>
                <el-form-item label="车辆生产企业名称：">
                  {{ form.vehicleEnterpriseName }}
                </el-form-item>
                <el-form-item label="车型通用名称：">
                  {{ form.vehicleModel }}
                </el-form-item>
                <el-form-item label="车辆名称：">
                  {{ form.vehicleName }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.vehicleModelName }}
                </el-form-item>
                <el-form-item label="年型：">
                  {{ form.vehicleYearName }}
                </el-form-item>
                <el-form-item label="销售日期：">
                  {{ form.salesDate }}
                </el-form-item>
                <el-form-item label="销售门店名称：">
                  {{ form.salesDealerName }}
                </el-form-item>
                <el-form-item label="销售顾问名称：">
                  {{ form.salesUserName }}
                </el-form-item>
                <el-form-item label="交付门店名称：">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="交付顾问名称：">
                  {{ form.deliveryUserName }}
                </el-form-item>
                <el-form-item label="商城订单号：">
                  {{ form.shopcode }}
                </el-form-item>
                <el-form-item label="整车订单：">
                  {{ form.vehicleOrder }}
                </el-form-item>
                <el-form-item label="企业客户整车订单：">
                  {{ form.vehicleEnterpriseOrder }}
                </el-form-item>
                <el-form-item label="车辆类型：">
                  {{ form.vehicleType }}
                </el-form-item>
                <el-form-item label="基本车系名称：">
                  {{ form.vehicleSeriesName }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 第二段：车主信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>车主信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" label-width="150px" class="form-detail" v-show="!isEditing">
                <LPEncrypted
                  :value.sync="form.ownerName"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'ownerName')"
                >
                  <el-form-item label="车主姓名：">
                    {{ form.ownerName }}
                  </el-form-item>
                </LPEncrypted>
                <LPEncrypted
                  :value.sync="form.idcardNo"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'idcardNo')"
                >
                  <el-form-item label="证件号码：">
                    {{ form.idcardNo }}
                  </el-form-item>
                </LPEncrypted>
                <LPEncrypted
                  :value.sync="form.mobilephone"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'mobilephone')"
                >
                  <el-form-item label="车主手机号码：">
                    {{ form.mobilephone }}
                  </el-form-item>
                </LPEncrypted>
                <el-form-item label="生日：">
                  {{ form.birthdate }}
                </el-form-item>
                <el-form-item label="省：">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="区：">
                  {{ form.districtName }}
                </el-form-item>
                <el-form-item label="家庭地址：">
                  {{ form.homeAddress }}
                </el-form-item>
                <el-form-item label="工作地址：">
                  {{ form.workAddress }}
                </el-form-item>
                <el-form-item label="特殊备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="实名状态：">
                  {{ form.realnameStatusLabel }}
                </el-form-item>
                <LPEncrypted
                  :value.sync="form.bindingUser"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'bindingUser')"
                >
                  <el-form-item label="绑车人姓名：">
                    {{ form.bindingUser }}
                  </el-form-item>
                </LPEncrypted>
                <LPEncrypted
                  :value.sync="form.bindingPhone"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'bindingPhone')"
                >
                  <el-form-item label="绑车人手机号码：">
                    {{ form.bindingPhone }}
                  </el-form-item>
                </LPEncrypted>
                <el-form-item label="绑车时间：">
                  {{ form.bindingOn }}
                </el-form-item>
                <el-form-item label="是否做过绑车：">
                  {{ form.isBindingLabel }}
                </el-form-item>
                <el-form-item label="APP用户ID：">
                  {{ form.userId }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 第三段：服务信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>服务信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" label-width="150px" class="form-detail" v-show="!isEditing">
                <el-form-item label="是否终身免保：">
                  {{ form.isLifetimeFreeMaintainLabel }}
                </el-form-item>
                <el-form-item label="是否终身质保：">
                  {{ form.isLifetimeWarrantyLabel }}
                </el-form-item>
                <el-form-item label="保修开始日期：">
                  {{ form.warrantyStartdate }}
                </el-form-item>
                <el-form-item label="保修结束日期：">
                  {{ form.warrantyEnddate }}
                </el-form-item>
                <el-form-item label="保修期(月)：">
                  {{ form.warrantyperiod }}
                </el-form-item>
                <el-form-item label="终身质保描述：">
                  {{ form.lifetimeWarrantyinfo }}
                </el-form-item>
                <el-form-item label="专属服务门店名称：">
                  {{ form.serviceDealerName }}
                </el-form-item>
                <el-form-item label="专属客户经理名称：">
                  {{ form.serviceUserName }}
                </el-form-item>
                <el-form-item label="是否用户修改专属服务信息：">
                  {{ form.isUserChangeDealerLabel }}
                </el-form-item>
                <el-form-item label="保养次数：">
                  {{ form.maintainNum }}
                </el-form-item>
                <el-form-item label="上次进店里程数(KM)：">
                  {{ form.lastMileage }}
                </el-form-item>
                <el-form-item label="车联网里程数(KM)：">
                  {{ form.lastNetMileage }}
                </el-form-item>
                <el-form-item label="最近保养时间：">
                  {{ form.lastMaintainDate }}
                </el-form-item>
                <el-form-item label="最近保养里程：">
                  {{ form.lastMaintainMileages }}
                </el-form-item>
                <el-form-item label="下次保养时间：">
                  {{ form.nextMaintainDate }}
                </el-form-item>
                <el-form-item label="下次保养里程：">
                  {{ form.nextMaintainMileages }}
                </el-form-item>
                <LPEncrypted
                  :value.sync="form.shuttleName"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'shuttleName')"
                >
                <el-form-item label="送修人：">
                  {{ form.shuttleName }}
                </el-form-item>
                </LPEncrypted>
                <LPEncrypted
                  :value.sync="form.shuttlePhone"
                  :decryptMethod="() => getDetailDecryptField(form.id, 'shuttlePhone')"
                >
                <el-form-item label="送修人手机：">
                  {{ form.shuttlePhone }}
                </el-form-item>
                </LPEncrypted>
                <el-form-item label="整车保修结束日期(预测)：">
                  {{ form.warrantyEnddateForecast }}
                </el-form-item>
                <el-form-item label="整车是否在保(预测)：">
                  {{ form.isLifetimeWarrantyForecastLabel }}
                </el-form-item>
                <el-form-item label="车辆状态：">
                  {{ getVehicleStatusText(form.vehicleStatus) }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, getDetailDecryptField } from '@/api/datacenter/vehicle/vehicleProfile/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import LPEncrypted from '@/libs/components/LPEncrypted/index.vue';

const defaultForm = {
  // 基础信息
  vin: '',
  vehiclePlateNo: '',
  vehicleMaterialId: '',
  vehicleMaterialCode: '',
  vehicleMaterialDesc: '',
  productionTime: '',
  vdcInboundOn: '',
  batteryModel: '',
  batterySerialNumber: '',
  enginenNumber: '',
  gearboxCode: '',
  manufacturingDate: '',
  motorModel: '',
  motorSerialNumber: '',
  carSaleSversionId: '',
  carSalesVersionName: '',
  certNumber: '',
  electricnumberAfter: '',
  electricnumberBefore: '',
  enginenModel: '',
  factoryinfoId: '',
  factoryinfoName: '',
  vehicleColor: '',
  vehicleDepartment: '',
  vehicleDepartureTime: '',
  vehicleEnterpriseName: '',
  vehicleFuelType: '',
  vehicleModel: '',
  vehicleName: '',
  vehiclePlaceOrigin: '',
  vehicleModelId: '',
  vehicleModelName: '',
  vehicleYearId: '',
  vehicleYearName: '',
  usageType: '',
  salesDate: '',
  salesDealerCode: '',
  salesDealerName: '',
  salesUserId: '',
  salesUserName: '',
  deliveryDealerCode: '',
  deliveryDealerName: '',
  deliveryUserId: '',
  deliveryUserName: '',
  shopcode: '',
  isEnterpriseOrder: '',
  vehicleOrderId: '',
  vehicleOrder: '',
  vehicleEnterpriseOrder: '',
  ownerCode: '',
  cityDeliveryNo: '',
  countryDeliveryNo: '',
  isNoticeActivate: '',
  noticeActivateTime: '',
  noticeFailReason: '',
  vehicleType: '',
  vehicleSeriesId: '',
  vehicleSeriesName: '',

  // 车主信息
  ownerName: '',
  idcardNo: '',
  idcardType: '',
  mobilephone: '',
  gender: '',
  enterpriseName: '',
  address: '',
  areaCode: '',
  birthdate: '',
  provinceName: '',
  cityName: '',
  districtName: '',
  email1: '',
  email2: '',
  fax: '',
  faxareaCode: '',
  homeAddress: '',
  openId: '',
  qq: '',
  remark: '',
  telephone1: '',
  telephone2: '',
  telephone3: '',
  weibo: '',
  weixin: '',
  workAddress: '',
  zipCode: '',
  bindingIdno: '',
  bindingIdtype: '',
  bindingOn: '',
  bindingPhone: '',
  bindingUser: '',
  bindingUserid: '',
  isBinding: '',
  acceptTime: '',
  customerCertNumber: '',
  customerName: '',
  iccid: '',
  msisdn: '',
  operatore: '',
  realnameStatus: '',
  realnameRejectreason: '',
  userId: '',
  enterpriseId: '',
  provinceCode: '',
  cityCode: '',
  districtCode: '',
  needRealName: '',

  // 服务信息
  isLifetimeFreeMaintain: '',
  isLifetimeWarranty: '',
  warrantyStartdate: '',
  warrantyEnddate: '',
  warrantyperiod: '',
  lifetimeWarrantyinfo: '',
  serviceDealerCode: '',
  serviceDealerName: '',
  serviceUserId: '',
  serviceUserName: '',
  isUserChangeDealer: '',
  maintainNum: '',
  lastMileage: '',
  lastNetMileage: '',
  lastMaintainDate: '',
  lastMaintainMileages: '',
  nextMaintainDate: '',
  nextMaintainMileages: '',
  shuttleName: '',
  shuttlePhone: '',
  warrantyEnddateForecast: '',
  isLifetimeWarrantyForecast: '',
  vehicleStatus: '',
  vehicleStaffupDatetime: '',
};

export default {
  name: 'vehicleProfileEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    LPEncrypted,
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '车辆档案管理',
      pageType: 'edit',
      title: 'VIN码：' + form.vin,
      moduleKey: 'AISMC-vehicleProfile',
      loading: false,
      submitLoading: false,
      isEditing: false,
      form: { ...form },
      originalForm: { ...form },
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        // 使用平铺接口
        return getDetail({ id });
      }
    },
    submitRequest () {
      // 明细页不需要提交功能
      return Promise.resolve();
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    getVehicleStatusText (status) {
      const statusMap = {
        1: '正常',
        2: '维修中',
        3: '报废'
      };
      return statusMap[status] || '';
    },
    getDetailDecryptField (id, field) {
      return getDetailDecryptField(id, field);
    },
  }
};
</script>
