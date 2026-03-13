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
          <section class="common-section">
            <div class="common-section-header">
              <h2>常规信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-sub-header">
                <h3>归属信息</h3>
                <el-button size="small">查看终身保养</el-button>
                <el-button size="small">重新预测质保期</el-button>
              </div>
              <!-- <el-form :inline="true" :model="form" label-width="150px" class="form-detail"> -->
              <el-form label-width="150px" :inline="true" :model="form" :rules="rules" ref="ruleForm1" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="整车订单：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleOrder"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="企业客户整车订单：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleEnterpriseOrder"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="商城订单号：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.shopcode"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="销售门店：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesDealerName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="销售顾问：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesUserName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="交付门店：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDealerName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="交付顾问：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryUserName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <!-- TODO -->
                <el-form-item label="服务门店：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceDealerName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="服务顾问：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceUserName"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="是否用户修改服务门店：">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isUserChangeDealerLabel"
                    disabled
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="特殊备注：" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="整车订单：">
                  {{ form.vehicleOrder }}
                </el-form-item>
                <el-form-item label="企业客户整车订单：">
                  {{ form.vehicleEnterpriseOrder }}
                </el-form-item>
                <el-form-item label="商城订单号：">
                  {{ form.shopcode }}
                </el-form-item>
                <el-form-item label="销售门店：">
                  {{ form.salesDealerName }}
                </el-form-item>
                <el-form-item label="销售顾问：">
                  {{ form.salesUserName }}
                </el-form-item>
                <el-form-item label="交付门店：">
                  {{ form.deliveryDealerName }}
                </el-form-item>
                <el-form-item label="交付顾问：">
                  {{ form.deliveryUserName }}
                </el-form-item>
                <!-- TODO -->
                <el-form-item label="服务门店：">
                  {{ form.serviceDealerName }}
                </el-form-item>
                <el-form-item label="服务顾问：">
                  {{ form.serviceUserName }}
                </el-form-item>
                <el-form-item label="是否用户修改服务门店：">
                  {{ form.isUserChangeDealerLabel }}
                </el-form-item>
                <el-form-item label="特殊备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>保修信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="保修开始日期：">
                  {{ form.warrantyStartdate }}
                </el-form-item>
                <el-form-item label="整车是否在保(预测)：">
                  {{ form.isLifetimeWarrantyForecastLabel }}
                </el-form-item>
                <el-form-item label="保修结束日期：">
                  {{ form.warrantyEnddate }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>保养信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item v-show="isEditing || !_id" label="下次保养时间：" prop="remark">
                  <el-date-picker
                    v-model="form.nextMaintainDate"
                    type="date"
                    style="max-width: 200px"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  />
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)" label="下次保养时间：" prop="remark">
                  {{ form.nextMaintainDate }}
                </el-form-item>
                <el-form-item v-show="isEditing || !_id" label="下次保养里程：" prop="remark">
                  <el-input-number
                    v-model="form.nextMaintainMileages"
                    placeholder="请输入"
                    :controls="false"
                    :precision="0"
                  />
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)" label="下次保养里程：" prop="remark">
                  {{ form.nextMaintainMileages }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>物料信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="整车物料：">
                  {{ form.vehicleMaterialName }}
                </el-form-item>
                <el-form-item label="物料描述：">
                  {{ form.vehicleMaterialDescribe }}
                </el-form-item>
                <el-form-item label="基本车系：">
                  {{ form.vehicleSeriesName }}
                </el-form-item>
                <el-form-item label="基本车型：">
                  {{ form.vehicleModelName }}
                </el-form-item>
                <el-form-item label="选配续航：">
                  {{ form.vehicleNedcName }}
                </el-form-item>
                <el-form-item label="选配动力：">
                  {{ form.vehiclePowerVersionName }}
                </el-form-item>
                <el-form-item label="外饰风格：">
                  {{ form.vehicleExteriorstyleName }}
                </el-form-item>
                <el-form-item label="内饰风格：">
                  {{ form.vehicleInteriorstyleName }}
                </el-form-item>
                <el-form-item label="选配轮毂：">
                  {{ form.vehicleWheelhubName }}
                </el-form-item>
                <el-form-item label="电池电芯：">
                  {{ form.vehicleBatteriesName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>车主信息<el-button style="margin-left: 6px;" size="small">查看关键信息变更日志</el-button></h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-sub-header">
                <h3>车主信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item v-show="isEditing || !_id" label="称呼：" prop="gender">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehicle_profile_gender"
                    v-model="form.gender"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)" label="称呼：" prop="gender">
                  {{ form.genderLabel }}
                </el-form-item>
                <el-form-item label="车主姓名：">
                  <LPEncrypted
                    :value.sync="form.ownerName"
                    :decryptMethod="() => getDetailDecryptField(form.id, 'ownerName')"
                  >
                    {{ form.ownerName }}
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="车主手机号码：">
                  <LPEncrypted
                    :value.sync="form.mobilephone"
                    :decryptMethod="() => getDetailDecryptField(form.id, 'mobilephone')"
                  >
                    {{ form.mobilephone }}
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="证件类型：">
                  {{ form.idcardType }}
                </el-form-item>
                <el-form-item label="证件号码：">
                  <LPEncrypted
                    :value.sync="form.idcardNo"
                    :decryptMethod="() => getDetailDecryptField(form.id, 'idcardNo')"
                  >
                    {{ form.idcardNo }}
                  </LPEncrypted>
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>绑车人信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="绑车人用户ID号：">
                  {{form.bindingUserid}}
                </el-form-item>
                <el-form-item label="绑车人姓名：">
                  <LPEncrypted
                    :value.sync="form.bindingUser"
                    :decryptMethod="() => getDetailDecryptField(form.id, 'bindingUser')"
                  >
                    {{ form.bindingUser }}
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="绑车人手机：">
                  <LPEncrypted
                    :value.sync="form.bindingPhone"
                    :decryptMethod="() => getDetailDecryptField(form.id, 'bindingPhone')"
                  >
                    {{ form.bindingPhone }}
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="绑车人证件类型：">
                  {{ form.bindingIdtypeLabel }}
                </el-form-item>
                <el-form-item label="绑车人证件号码：">
                  {{ form.bindingIdno }}
                </el-form-item>
                <el-form-item label="绑车时间：">
                  {{ form.bindingOn }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>实名认证信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="实名状态：">
                  {{ form.realnameStatusLabel }}
                </el-form-item>
                <el-form-item label="卡ICCID：">
                  {{ form.iccid }}
                </el-form-item>
                <!-- TODO -->
                <el-form-item label="受理时间：">
                  {{ form.xxx }}
                </el-form-item>
                <el-form-item label="实名驳回原因：">
                  {{ form.xxx }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>其他信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <!-- TODO -->
                <el-form-item label="住宅电话：">
                  {{ form.xxx }}
                </el-form-item>
                <el-form-item label="办公电话：">
                  {{ form.xxx }}
                </el-form-item>
                <el-form-item label="身份证所在地：">
                  {{ form.xxx }}
                </el-form-item>
                <el-form-item v-show="isEditing || !_id" label="生日：" prop="birthdate">
                  <el-date-picker v-model="form.birthdate" type="date" value-format="yyyy-MM-dd"  placeholder="请选择">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)" label="生日：" prop="birthdate">
                  {{ form.birthdate }}
                </el-form-item>
                <el-form-item label="邮箱：">
                  {{ form.xxx }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>地址信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item  v-show="(isEditing || !_id)"  label="省市区：" prop="provinceCode">
                  <el-cascader
                    placeholder="请选择省市区"
                    v-model="form.districtCode"
                    :props="orgProps"
                    :options="areaOptions"
                    filterable
                    @change="handleCascaderChange"
                    clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item label="省市区：" v-show="!(isEditing || !_id)">
                  {{ form.provinceName + form.cityName+ form.districtName }}
                </el-form-item>

                <el-form-item v-show="isEditing || !_id" label="家庭地址：" prop="homeAddress">
                  <el-input v-model="form.homeAddress" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)" label="家庭地址：" prop="homeAddress">
                  {{ form.homeAddress }}
                </el-form-item>

                <el-form-item v-show="isEditing || !_id" label="工作地址：" prop="workAddress">
                  <el-input v-model="form.workAddress" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)" label="工作地址：" prop="workAddress">
                  {{ form.workAddress }}
                </el-form-item>
              </el-form>
              <div class="common-section-sub-header">
                <h3>送修人信息</h3>
              </div>
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item v-show="isEditing || !_id" label="送修人：" prop="shuttleName">
                  <el-input
                    v-model="form.shuttleName"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)"  label="送修人：" prop="shuttleName">
                    {{ form.shuttleName }}
                </el-form-item>

                <el-form-item v-show="isEditing || !_id" label="送修人手机：" prop="shuttlePhone">
                  <el-input
                    v-model="form.shuttlePhone"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)"  label="送修人手机：" prop="shuttlePhone">
                    {{ form.shuttlePhone }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>车辆信息<el-button style="margin-left: 6px;" size="small">查看维修履历</el-button></h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-detail">
                <el-form-item label="VIN：">
                  <LPEncrypted
                    :value.sync="form.vin"
                    :decryptMethod="() => getDetailDecryptField(form.id, 'vin')"
                  >
                    {{ form.vin }}
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="车牌号：">
                  <LPEncrypted
                    :value.sync="form.vehiclePlateNo"
                    :decryptMethod="() => getDetailDecryptField(form.id, 'vehiclePlateNo')"
                  >
                    {{ form.vehiclePlateNo }}
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="合格证号：">
                  {{ form.certNumber }}
                </el-form-item>
                <!-- TODO -->
                <el-form-item label="公告车型：">
                  {{ form.carSalesVersionName }}
                </el-form-item>
                <el-form-item label="车辆属性：">
                  {{ form.xxx }}
                </el-form-item>
                <el-form-item label="车辆类型：">
                  {{ form.vehicleType }}
                </el-form-item>
                <el-form-item label="车辆名称：">
                  {{ form.vehicleName }}
                </el-form-item>
                <el-form-item label="车型通用名称：">
                  {{ form.vehicleModel }}
                </el-form-item>
                <el-form-item label="车身颜色：">
                  {{ form.vehicleColor }}
                </el-form-item>
                <!-- TODO -->
                <el-form-item label="燃料种类：">
                  {{ form.xxxx }}
                </el-form-item>
                <el-form-item label="车型：">
                  {{ form.xxxx }}
                </el-form-item>
                <el-form-item label="年款：">
                  {{ form.vehicleYearName }}
                </el-form-item>
                <el-form-item label="发动机型号：">
                  {{ form.enginenModel }}
                </el-form-item>
                <el-form-item label="发动机号：">
                  {{ form.enginenNumber }}
                </el-form-item>
                <el-form-item label="电池型号：">
                  {{ form.batteryModel }}
                </el-form-item>
                <el-form-item label="电池序列号：">
                  {{ form.batterySerialNumber }}
                </el-form-item>
                <el-form-item label="电机型号：">
                  {{ form.motorModel }}
                </el-form-item>
                <el-form-item label="电机序列号：">
                  {{ form.motorSerialNumber }}
                </el-form-item>
                <el-form-item label="电驱序列号(前)：">
                  {{ form.electricnumberBefore }}
                </el-form-item>
                <el-form-item label="电驱序列号(后)：">
                  {{ form.electricnumberAfter }}
                </el-form-item>
                <el-form-item label="车辆品牌：">
                  {{ form.vehicleDepartment }}
                </el-form-item>
                <el-form-item label="车辆生产企业名称：">
                  {{ form.vehicleEnterpriseName }}
                </el-form-item>
                <!-- TODO -->
                <el-form-item label="车辆产地：">
                  {{ form.xxx }}
                </el-form-item>
                <el-form-item label="制造工厂：">
                  {{ form.factoryinfoName }}
                </el-form-item>
                <el-form-item label="制造日期：">
                  {{ form.manufacturingDate }}
                </el-form-item>
                <el-form-item label="VDC入库日期：">
                  {{ form.vdcInboundOn }}
                </el-form-item>
                <el-form-item label="车辆出厂时间：">
                  {{ form.vehicleDepartureTime }}
                </el-form-item>
                <el-form-item label="销售日期：">
                  {{ form.salesDate }}
                </el-form-item>
                <el-form-item v-show="isEditing || !_id" label="车辆销售变更时间：" prop="vehicleStaffupDatetime">
                  <el-date-picker v-model="form.vehicleStaffupDatetime" type="date" value-format="yyyy-MM-dd" placeholder="请选择">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)" label="车辆销售变更时间：" prop="vehicleStaffupDatetime">
                  {{ form.vehicleStaffupDatetime }}
                </el-form-item>
                <el-form-item label="车辆状态：">
                  {{ form.vehicleStatusLabel }}
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
import { getDetail, getDetailDecryptField, updateFlat } from '@/api/datacenter/vehicle/vehicleProfile/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import LPEncrypted from '@/libs/components/LPEncrypted/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum } from '@/api/common';
import { getAreaInfo } from '@/utils';

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
    FetchSelect,
    LPEncrypted,
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    _vin () {
      return this.vin || this.$route.query.vin || this.form.vin;
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
      areaOptions: JSON.parse(localStorage.areaTree),
      pageTitle: '车辆档案管理',
      pageType: 'edit',
      title: 'VIN码：' + form.vin,
      moduleKey: 'AISMC-vehicleProfile',
      loading: false,
      submitLoading: false,
      isEditing: false,
      form: { ...form },
      originalForm: { ...form },
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      const vin = this._vin;
      console.log(id, vin);
      if (id || vin) {
        // 使用平铺接口
        return getDetail({ id, vin });
      }
    },
    submitRequest () {
      // 明细页不需要提交功能
      if (this.form.districtCode) {
        let areaInfo = getAreaInfo(this.form.districtCode);
        this.form.provinceName = areaInfo.provinceName;
        this.form.provinceCode = areaInfo.provinceCode;
        this.form.cityName = areaInfo.cityName;
        this.form.cityCode = areaInfo.cityCode;
        this.form.districtName = areaInfo.districtName;
        this.form.districtCode = areaInfo.districtCode;
      }
      return updateFlat({ ...this.form });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    getDetailDecryptField (id, field) {
      return getDetailDecryptField(id, field);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleCascaderChange (value) {
      console.log(value);
    },
  }
};
</script>
<style lang="scss" scoped>
.common-section-sub-header{
  display: flex;
  margin-bottom: 8px;
  h3 {
    color: #0A0E0A;
    font-size: 14px;
    font-weight: 500;
    line-height: 30px;
    margin-right: 15px;
  }
}

</style>
