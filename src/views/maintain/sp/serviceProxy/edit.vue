<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <div class="page-common-edit">
        <el-container>
          <el-main>
            <NavTop :current="form.orderStatus"/>
            <section class="common-title common-title-extend" v-if="_id">
              <div class="common-title-main">
                <h2>单据编号：{{ form.code }}</h2>
                  <div v-if="isEditing">
                    <el-button size="small" @click="handleCancel">取消</el-button>
                    <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
                  </div>
                  <ButtonGroup maxWidth="50%" v-else>
                    <el-button size="small" @click="handlePrint">打印工单</el-button>
                    <el-button size="small" @click="handleImport">上传附件</el-button>
                    <el-button size="small" @click="handleShowLog">审核日志</el-button>
                    <el-button size="small" @click="discardDialogVisible = true" v-if="![RepairOrderStatusEnum.DELIVERED].includes(form.orderStatus)">作废</el-button>
                    <el-button size="small" @click="materialReturnDialogVisible = true" v-if="![RepairOrderStatusEnum.DELIVERED].includes(form.orderStatus)">退料</el-button>
                    <el-button size="small" @click="couponsDialogVisible = true" v-if="[RepairOrderStatusEnum.CREATING_ORDER, RepairOrderStatusEnum.PENDING_DISPATCH, RepairOrderStatusEnum.UNDER_CONSTRUCTION].includes(form.orderStatus)">查询卡券&终身</el-button>
                    <el-button size="small" @click="finalCheckDialogVisible = true"  v-if="[RepairOrderStatusEnum.PENDING_FINAL_INSPECTION].includes(form.orderStatus)">终检</el-button>
                    <el-button size="small" @click="startWorkDialogVisible = true" v-if="[RepairOrderStatusEnum.PENDING_DISPATCH, RepairOrderStatusEnum.UNDER_CONSTRUCTION].includes(form.orderStatus)">作业开始</el-button>
                    <el-button size="small" @click="handlePreCheck" v-if="[RepairOrderStatusEnum.RECEPTION_INSPECTION].includes(form.orderStatus)">预检确认</el-button>
                    <el-button size="small" @click="selectRepairItemDialogVisible = true" v-if="[RepairOrderStatusEnum.CREATING_ORDER, RepairOrderStatusEnum.PENDING_DISPATCH, RepairOrderStatusEnum.UNDER_CONSTRUCTION, RepairOrderStatusEnum.PENDING_FINAL_INSPECTION, RepairOrderStatusEnum.PENDING_DELIVERY].includes(form.orderStatus)">选择维修项目</el-button>
                    <el-button size="small" @click="confirmDocDialogVisible = true" v-if="[RepairOrderStatusEnum.CREATING_ORDER].includes(form.orderStatus)">制单确认并签字</el-button>
                    <el-button size="small" @click="dispatchWorkDialogVisible = true" v-if="[RepairOrderStatusEnum.PENDING_DISPATCH, RepairOrderStatusEnum.UNDER_CONSTRUCTION].includes(form.orderStatus)">派工</el-button>
                    <el-button size="small" @click="couponsDialogVisible = true" v-if="[RepairOrderStatusEnum.PENDING_DELIVERY].includes(form.orderStatus)">结算</el-button>
                    <el-button size="small" @click="couponsDialogVisible = true" v-if="[RepairOrderStatusEnum.PENDING_DELIVERY].includes(form.orderStatus)">取消结算</el-button>
                    <!-- <el-button size="small" @click="handleCancel">预警信息</el-button> -->
                    <el-divider direction="vertical"></el-divider>
                    <el-button v-if="canAddOrUpdate" size="small" type="primary" plain @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
                  </ButtonGroup>
              </div>
              <h5>
                <span>签字状态：{{ form.signStatusLabel || '-' }}</span>
                <i>|</i>
                <span>工单状态：{{ form.orderStatusLabel || '-' }}</span>
                <i>|</i>
                <span>领料状态：{{ form.pickStatus || '-' }}</span>
                <i>|</i>
                <span>开单时间：{{ form.createTime || '-' }}</span>
              </h5>
            </section>
            <BasicInfo :formData="form" :rules="rules" :isEditing="isEditing" :_id="_id" ref="basicInfoRef"/>
            <EntrustInfo :formData="form" :rules="rules" :isEditing="isEditing" :_id="_id" ref="entrustInfoRef"/>
            <BatteryInfo :formData="form" :rules="rules" :isEditing="isEditing" :_id="_id" ref="batteryInfoRef"/>
            <InquiryInfo :formData="form"/>
            <RepairInfo :formData="form"/>
            <SparepartsInfo :formData="form"/>
            <Attachment :formData="form"/>
            <MaintainInfo :formData="form"/>
            <!-- TIPS: 填入项目id即可 -->
            <Upload
              :visible="uploadDialogVisible"
              :id="'1'"
              @close="handleUploadDialogClose"
            />
          </el-main>
          <el-footer height="60px" v-if="!_id">
            <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
            <el-button size="small" type="primary" plain @click="submitForm('ruleForm', true)">保存并下一个</el-button>
            <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
            <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
          </el-footer>
        </el-container>
      </div>
      <!-- 制单确认并签字 -->
      <ConfirmDocDialog
        :visible.sync="confirmDocDialogVisible"
        :serviceProxyId="_id"
        @refresh="handleRefresh"
      />
      <!-- 选择维修项目 -->
      <SelectRepairItemDialog
        :visible.sync="selectRepairItemDialogVisible"
        :vehicleInfo="form"
        @refresh="handleRefresh"
      />
      <!-- 派工 -->
      <DispatchWorkDialog
        :visible.sync="dispatchWorkDialogVisible"
        @refresh="handleRefresh"
      />
      <!-- 派工 -->
      <StartWorkDialog
        :visible.sync="startWorkDialogVisible"
        @refresh="handleRefresh"
      />
      <!-- 项目终检 -->
      <FinalCheckDialog
        :visible.sync="finalCheckDialogVisible"
        @refresh="handleRefresh"
      />
      <!-- 接车施工单作废 -->
      <DiscardDialog
        :visible.sync="discardDialogVisible"
        @refresh="handleRefresh"
      />
      <!-- 退料 -->
      <MaterialReturnDialog
        :visible.sync="materialReturnDialogVisible"
        @refresh="handleRefresh"
      />
      <!-- 查询卡券&终身 -->
      <CouponsDialog
        :visible.sync="couponsDialogVisible"
        @refresh="handleRefresh"
      />
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, precheck } from '@/api/maintain/sp/serviceProxy/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import NavTop from './components/NavTop';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ButtonGroup from '@/libs/components/ButtonGroup';
import MaintainInfo from './components/MaintainInfo';
import BasicInfo from './components/BasicInfo';
import EntrustInfo from './components/EntrustInfo';
import BatteryInfo from './components/BatteryInfo';
import InquiryInfo from './components/InquiryInfo';
import SparepartsInfo from './components/SparepartsInfo';
import Attachment from './components/Attachment';
import RepairInfo from './components/RepairInfo';
import ConfirmDocDialog from './components/ConfirmDocDialog';
import CouponsDialog from './components/CouponsDialog';
import DiscardDialog from './components/DiscardDialog';
import FinalCheckDialog from './components/FinalCheckDialog';
import MaterialReturnDialog from './components/MaterialReturnDialog';
import SelectRepairItemDialog from './components/SelectRepairItemDialog';
import StartWorkDialog from './components/StartWorkDialog';
import DispatchWorkDialog from './components/DispatchWorkDialog';
import Upload from '@/libs/components/UploadDialog';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dataSource: '',
  orderStatus: '',
  warrantyTypeCollect: '',
  customerName: '',
  custType: '',
  vehModelName: '',
  carPlate: '',
  dealerName: '',
  appointmentNo: '',
  mileage: '',
  lastMileage: '',
  startWarrantyDate: '',
  exclusiveServiceDealerName: '',
  expectFinishAt: '',
  createStatementInfoDate: '',
  serviceOwnerId: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  pickStatus: '',
  ownerOrgId: '',
  dealerCode: '',
  shuttleName: '',
  shuttlePhone: '',
  payType: '',
  warrantyCompany: '',
  signChannel: '',
  signCompletedOn: '',
  signGeneratedOn: '',
  signStatus: '',
  signUrlExpiredOn: '',
  appointmentType: '',
  serviceAdvisorId: '',
  preAuthType: '',
  isLockLive: '',
  serviceActivityId: '',
  isCreateWarranty: '',
  isOutboundOrder: '',
  isVehRetentionRemind: '',
  isCancelStorage: '',
  discountId: '',
  finalCheckAt: '',
  finalCheckerId: '',
  finalChecker: '',
  ticketStep: '',
  batteryApply: '',
  warrantyStatus: '',
  claimItemAmount: '',
  claimOtherAmount: '',
  claimPartsAmount: '',
  departureMileage: '',
  inPower: '',
  outPower: '',
  netMileage: '',
  departureNetMileage: '',
  inNetPower: '',
  outNetPower: '',
  departureNetMileageElectricity: '',
  departureNetMileageExtend: '',
  netMileageElectricity: '',
  netMileageExtend: '',
  vehProfileId: '',
  vehProfileVin: '',
  maintenanceMileage: '',
  maintenanceTime: '',
  saleDate: '',
  exclusiveServiceDealerCode: '',
  customerPhone: '',
  bindingPhone: '',
  bindingUser: '',
  bindingUserId: '',
  vehModelId: '',
  vehRegisteredModelId: '',
  vehRegisteredModelName: '',
  vehYearTypeId: '',
  vehYearTypeName: '',
  dedicatedServiceManagerId: '',
  dedicatedServiceManager: '',
  motorModel: '',
  motorSerialNumber: '',
  batteryModel: '',
  batterySerialNumber: '',
  engineNumber: '',
  repairItemTypeDetailCollect: '',
  businessType: '',
  alarmLevel: '',
  isLive: '',
  haveRework: '',
  isCarWash: '',
  isRetainOldParts: '',
  inCustomerContent: '',
  customerComment: '',
  testResult: '',
  currentFault: '',
  customerContent: '',
  invaildDesc: '',
  anomalyDescription: '',
  previewingFinishAt: '',
  confirmedOn: '',
  expectStartAt: '',
  startAt: '',
  finishAt: '',
  faultSolve: '',
  currentSituation: '',
  faultAlert: '',
  faultPeriod: '',
  earliestfaultServiceProxy: '',
  recentlyfaultServiceProxy: '',
  faultModule: '',
  isCreateStatementInfo: '',
  isPreAuth: '',
  isCreatePreAuth: '',
  preAuthId: '',
  unresolvedReason: '',
  faultDesc: '',
  batteryUnitId: '',
  targetUnitCode: '',
  beforeChangeCode: '',
  afterChangeCode: '',
  exteriorPhotos: '',
  interiorPhotos: '',
  repairItemResps: '',
  sparePartResps: '',
  partOutboundResps: '',
};

const RepairOrderStatusEnum = {
  /** 接车预检测 */
  RECEPTION_INSPECTION: 100,
  /** 制单中 */
  CREATING_ORDER: 110,
  /** 待派工 */
  PENDING_DISPATCH: 120,
  /** 施工中 */
  UNDER_CONSTRUCTION: 140,
  /** 待终检 */
  PENDING_FINAL_INSPECTION: 150,
  /** 待交车 */
  PENDING_DELIVERY: 160,
  /** 已交车 */
  DELIVERED: 180
};

export default {
  name: 'serviceProxyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    // EditTable,
    // FetchSelect,
    NavTop,
    ButtonGroup,
    MaintainInfo,
    BasicInfo,
    EntrustInfo,
    BatteryInfo,
    InquiryInfo,
    SparepartsInfo,
    Attachment,
    RepairInfo,
    ConfirmDocDialog,
    CouponsDialog,
    DiscardDialog,
    FinalCheckDialog,
    MaterialReturnDialog,
    SelectRepairItemDialog,
    StartWorkDialog,
    DispatchWorkDialog,
    Upload
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '接车施工单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceProxy',
      isEditing: false,
      loading: false,
      submitLoading: false,
      confirmDocDialogVisible: false,
      selectRepairItemDialogVisible: false,
      dispatchWorkDialogVisible: false,
      startWorkDialogVisible: false,
      finalCheckDialogVisible: false,
      discardDialogVisible: false,
      materialReturnDialogVisible: false,
      couponsDialogVisible: false,
      yes_no_enum: YES_NO_ENUM,
      RepairOrderStatusEnum,
      uploadDialogVisible: false,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        code: [
          { required: true, message: '请输入单据编号', trigger: 'change' }
        ],
        // dataSource: [
        //   { required: true, message: '请输入数据来源', trigger: 'change' }
        // ],
        // orderStatus: [
        //   { required: true, message: '请选择工单状态', trigger: 'change' }
        // ],
        // warrantyTypeCollect: [
        //   { required: true, message: '请选择保修类型（汇总）', trigger: 'change' }
        // ],
        // customerName: [
        //   { required: true, message: '请输入车主姓名', trigger: 'change' }
        // ],
        // custType: [
        //   { required: true, message: '请选择客户类型', trigger: 'change' }
        // ],
        // vehModelName: [
        //   { required: true, message: '请输入基本车型', trigger: 'change' }
        // ],
        // carPlate: [
        //   { required: true, message: '请输入车牌号', trigger: 'change' }
        // ],
        // dealerName: [
        //   { required: true, message: '请输入门店名称', trigger: 'change' }
        // ],
        // appointmentNo: [
        //   { required: true, message: '请输入预约单号', trigger: 'change' }
        // ],
        // mileage: [
        //   { required: true, message: '请输入进店里程数', trigger: 'change' }
        // ],
        // lastMileage: [
        //   { required: true, message: '请输入上次进店里程数', trigger: 'change' }
        // ],
        // startWarrantyDate: [
        //   { required: true, message: '请选择保修开始日期', trigger: 'change' }
        // ],
        // exclusiveServiceDealerName: [
        //   { required: true, message: '请输入专属服务���店名称', trigger: 'change' }
        // ],
        // expectFinishAt: [
        //   { required: true, message: '请选择预计交车时间', trigger: 'change' }
        // ],
        // createStatementInfoDate: [
        //   { required: true, message: '请选择生成结算单时间', trigger: 'change' }
        // ],
        // serviceOwnerId: [
        //   { required: true, message: '请输入负责人', trigger: 'change' }
        // ],
        // id: [
        //   { required: true, message: '请输入主键', trigger: 'change' }
        // ],
        // creator: [
        //   { required: true, message: '请输入创建者', trigger: 'change' }
        // ],
        // creatorName: [
        //   { required: true, message: '请输入创建者名称', trigger: 'change' }
        // ],
        // createTime: [
        //   { required: true, message: '请选择创建时间', trigger: 'change' }
        // ],
        // modifier: [
        //   { required: true, message: '请输入修改者', trigger: 'change' }
        // ],
        // modifierName: [
        //   { required: true, message: '请输入修改者名称', trigger: 'change' }
        // ],
        // updateTime: [
        //   { required: true, message: '请选择修改时间', trigger: 'change' }
        // ],
        // remark: [
        //   { required: true, message: '请输入备注', trigger: 'change' }
        // ],
        // status: [
        //   { required: true, message: '请选择状态', trigger: 'change' }
        // ],
        // statusDesc: [
        //   { required: true, message: '请选择状态变更描述', trigger: 'change' }
        // ],
        // pickStatus: [
        //   { required: true, message: '请选择领料状态', trigger: 'change' }
        // ],
        // ownerOrgId: [
        //   { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        // ],
        // dealerCode: [
        //   { required: true, message: '请输入门店编码', trigger: 'change' }
        // ],
        // shuttleName: [
        //   { required: true, message: '请输入送修人', trigger: 'change' }
        // ],
        // shuttlePhone: [
        //   { required: true, message: '请输入送修人手机', trigger: 'change' }
        // ],
        // payType: [
        //   { required: true, message: '请选择支付方式', trigger: 'change' }
        // ],
        // warrantyCompany: [
        //   { required: true, message: '请输入保险公司名称', trigger: 'change' }
        // ],
        // signChannel: [
        //   { required: true, message: '请输入签字渠道（1、短信 2、APP  3、零小跑）', trigger: 'change' }
        // ],
        // signCompletedOn: [
        //   { required: true, message: '请选择签字完成时间', trigger: 'change' }
        // ],
        // signGeneratedOn: [
        //   { required: true, message: '请选择签字生成时间', trigger: 'change' }
        // ],
        // signStatus: [
        //   { required: true, message: '请选择签字状态（1、待签字 2、已签字）', trigger: 'change' }
        // ],
        // signUrlExpiredOn: [
        //   { required: true, message: '请选择短信签字链接过期时间', trigger: 'change' }
        // ],
        // appointmentType: [
        //   { required: true, message: '请选择预约方式', trigger: 'change' }
        // ],
        // serviceAdvisorId: [
        //   { required: true, message: '请输入客户经理', trigger: 'change' }
        // ],
        // preAuthType: [
        //   { required: true, message: '请选择预授权类型', trigger: 'change' }
        // ],
        // isLockLive: [
        //   { required: true, message: '请输入是否锁定直播开关', trigger: 'change' }
        // ],
        // serviceActivityId: [
        //   { required: true, message: '请输入技术服务活动', trigger: 'change' }
        // ],
        // isCreateWarranty: [
        //   { required: true, message: '请输入是否已生成保修单', trigger: 'change' }
        // ],
        // isOutboundOrder: [
        //   { required: true, message: '请输入是否已生成出库单', trigger: 'change' }
        // ],
        // isVehRetentionRemind: [
        //   { required: true, message: '请输入是否已提醒留车调查', trigger: 'change' }
        // ],
        // isCancelStorage: [
        //   { required: true, message: '请输入是否作废并入库', trigger: 'change' }
        // ],
        // discountId: [
        //   { required: true, message: '请输入优惠模式', trigger: 'change' }
        // ],
        // finalCheckAt: [
        //   { required: true, message: '请选择终检时间', trigger: 'change' }
        // ],
        // finalCheckerId: [
        //   { required: true, message: '请输入终检人', trigger: 'change' }
        // ],
        // finalChecker: [
        //   { required: true, message: '请输入终检人', trigger: 'change' }
        // ],
        // ticketStep: [
        //   { required: true, message: '请输入开单步骤', trigger: 'change' }
        // ],
        // batteryApply: [
        //   { required: true, message: '请输入电池维修申请单', trigger: 'change' }
        // ],
        // warrantyStatus: [
        //   { required: true, message: '请选择保修单状态', trigger: 'change' }
        // ],
        // claimItemAmount: [
        //   { required: true, message: '请输入索赔工时费用（总）', trigger: 'change' }
        // ],
        // claimOtherAmount: [
        //   { required: true, message: '请输入索赔其他费用（总）', trigger: 'change' }
        // ],
        // claimPartsAmount: [
        //   { required: true, message: '请输入索赔材料费用（总）', trigger: 'change' }
        // ],
        // departureMileage: [
        //   { required: true, message: '请输入离店里程数', trigger: 'change' }
        // ],
        // inPower: [
        //   { required: true, message: '请输入进店电量%', trigger: 'change' }
        // ],
        // outPower: [
        //   { required: true, message: '请输入离店电量%', trigger: 'change' }
        // ],
        // netMileage: [
        //   { required: true, message: '请输入车联网里程数（总）', trigger: 'change' }
        // ],
        // departureNetMileage: [
        //   { required: true, message: '请输入离店车联网里程数（总）', trigger: 'change' }
        // ],
        // inNetPower: [
        //   { required: true, message: '请输入进店车联网电量%', trigger: 'change' }
        // ],
        // outNetPower: [
        //   { required: true, message: '请输入离店车联网电量%', trigger: 'change' }
        // ],
        // departureNetMileageElectricity: [
        //   { required: true, message: '请输入离店车联网里程数（纯）', trigger: 'change' }
        // ],
        // departureNetMileageExtend: [
        //   { required: true, message: '请输入离店车联网里程数（增）', trigger: 'change' }
        // ],
        // netMileageElectricity: [
        //   { required: true, message: '请输入车联网里程数（纯）', trigger: 'change' }
        // ],
        // netMileageExtend: [
        //   { required: true, message: '请输入车联网里程数（增）', trigger: 'change' }
        // ],
        // vehProfileId: [
        //   { required: true, message: '请输入整车档案id', trigger: 'change' }
        // ],
        // vehProfileVin: [
        //   { required: true, message: '请输入VIN码', trigger: 'change' }
        // ],
        // maintenanceMileage: [
        //   { required: true, message: '请输入建议保养里程', trigger: 'change' }
        // ],
        // maintenanceTime: [
        //   { required: true, message: '请选择建议保养时间', trigger: 'change' }
        // ],
        // saleDate: [
        //   { required: true, message: '请选择销售日期', trigger: 'change' }
        // ],
        // exclusiveServiceDealerCode: [
        //   { required: true, message: '请输入专属服务门店编码', trigger: 'change' }
        // ],
        // customerPhone: [
        //   { required: true, message: '请输入车主手机', trigger: 'change' }
        // ],
        // bindingPhone: [
        //   { required: true, message: '请输入绑车人手机号码', trigger: 'change' }
        // ],
        // bindingUser: [
        //   { required: true, message: '请输入绑车人姓名', trigger: 'change' }
        // ],
        // bindingUserId: [
        //   { required: true, message: '请输入绑车人用户ID', trigger: 'change' }
        // ],
        // vehModelId: [
        //   { required: true, message: '请输入基本车型id', trigger: 'change' }
        // ],
        // vehRegisteredModelId: [
        //   { required: true, message: '请输入公告车型id', trigger: 'change' }
        // ],
        // vehRegisteredModelName: [
        //   { required: true, message: '请输入公告车型', trigger: 'change' }
        // ],
        // vehYearTypeId: [
        //   { required: true, message: '请选择年型id', trigger: 'change' }
        // ],
        // vehYearTypeName: [
        //   { required: true, message: '请选择年型', trigger: 'change' }
        // ],
        // dedicatedServiceManagerId: [
        //   { required: true, message: '请输入专属客户经理', trigger: 'change' }
        // ],
        // dedicatedServiceManager: [
        //   { required: true, message: '请输入专属客户经理', trigger: 'change' }
        // ],
        // motorModel: [
        //   { required: true, message: '请输入电机型号', trigger: 'change' }
        // ],
        // motorSerialNumber: [
        //   { required: true, message: '请输入电机序列号', trigger: 'change' }
        // ],
        // batteryModel: [
        //   { required: true, message: '请输入电池型号', trigger: 'change' }
        // ],
        // batterySerialNumber: [
        //   { required: true, message: '请输入电池序列号', trigger: 'change' }
        // ],
        // engineNumber: [
        //   { required: true, message: '请输入发动机号', trigger: 'change' }
        // ],
        // repairItemTypeDetailCollect: [
        //   { required: true, message: '请选择维修类型（汇总）', trigger: 'change' }
        // ],
        // businessType: [
        //   { required: true, message: '请选择业务类型', trigger: 'change' }
        // ],
        // alarmLevel: [
        //   { required: true, message: '请输入三包预警', trigger: 'change' }
        // ],
        // isLive: [
        //   { required: true, message: '请输入是否直播', trigger: 'change' }
        // ],
        // haveRework: [
        //   { required: true, message: '请输入是否返修', trigger: 'change' }
        // ],
        // isCarWash: [
        //   { required: true, message: '请输入是否洗车', trigger: 'change' }
        // ],
        // isRetainOldParts: [
        //   { required: true, message: '请输入是否保留旧件', trigger: 'change' }
        // ],
        // inCustomerContent: [
        //   { required: true, message: '请输入车联网故障描述', trigger: 'change' }
        // ],
        // customerComment: [
        //   { required: true, message: '请输入客户诉求', trigger: 'change' }
        // ],
        // testResult: [
        //   { required: true, message: '请输入客户经理建议', trigger: 'change' }
        // ],
        // currentFault: [
        //   { required: true, message: '请输入本次进店是否存在故障', trigger: 'change' }
        // ],
        // customerContent: [
        //   { required: true, message: '请输入客户故障描述', trigger: 'change' }
        // ],
        // invaildDesc: [
        //   { required: true, message: '请输入作废描述', trigger: 'change' }
        // ],
        // anomalyDescription: [
        //   { required: true, message: '请输入异常描述', trigger: 'change' }
        // ],
        // previewingFinishAt: [
        //   { required: true, message: '请选择预检完成时间', trigger: 'change' }
        // ],
        // confirmedOn: [
        //   { required: true, message: '请选择制单完成时间', trigger: 'change' }
        // ],
        // expectStartAt: [
        //   { required: true, message: '请选择计划作业时间', trigger: 'change' }
        // ],
        // startAt: [
        //   { required: true, message: '请选择实际作业时间', trigger: 'change' }
        // ],
        // finishAt: [
        //   { required: true, message: '请选择完成作业时间', trigger: 'change' }
        // ],
        // faultSolve: [
        //   { required: true, message: '请输入客户反馈故障是否全部解决', trigger: 'change' }
        // ],
        // currentSituation: [
        //   { required: true, message: '请输入本次进店情况（周期内）', trigger: 'change' }
        // ],
        // faultAlert: [
        //   { required: true, message: '请输入故障提醒内容', trigger: 'change' }
        // ],
        // faultPeriod: [
        //   { required: true, message: '请输入故障统计周期（天）', trigger: 'change' }
        // ],
        // earliestfaultServiceProxy: [
        //   { required: true, message: '请输入最早故障施工单（周期内）', trigger: 'change' }
        // ],
        // recentlyfaultServiceProxy: [
        //   { required: true, message: '请输入最近故障施工单（周期内）', trigger: 'change' }
        // ],
        // faultModule: [
        //   { required: true, message: '请输入故障统计模块', trigger: 'change' }
        // ],
        // isCreateStatementInfo: [
        //   { required: true, message: '请选择是否已生成结算单', trigger: 'change' }
        // ],
        // isPreAuth: [
        //   { required: true, message: '请输入是否需要提报预授权', trigger: 'change' }
        // ],
        // isCreatePreAuth: [
        //   { required: true, message: '请输入是否已经生成预授权', trigger: 'change' }
        // ],
        // preAuthId: [
        //   { required: true, message: '请输入预授权信息', trigger: 'change' }
        // ],
        // unresolvedReason: [
        //   { required: true, message: '请输入未解决问题原因', trigger: 'change' }
        // ],
        // faultDesc: [
        //   { required: true, message: '请输入原因说明', trigger: 'change' }
        // ],
        // batteryUnitId: [
        //   { required: true, message: '请输入电池去向单位', trigger: 'change' }
        // ],
        // targetUnitCode: [
        //   { required: true, message: '请输入去向单位统一代码', trigger: 'change' }
        // ],
        // beforeChangeCode: [
        //   { required: true, message: '请输入更换前编号', trigger: 'change' }
        // ],
        // afterChangeCode: [
        //   { required: true, message: '请输入更换后编号', trigger: 'change' }
        // ],
        // exteriorPhotos: [
        //   { required: true, message: '请输入车外检查', trigger: 'change' }
        // ],
        // interiorPhotos: [
        //   { required: true, message: '请输入车内检查', trigger: 'change' }
        // ],
        // repairItemResps: [
        //   { required: true, message: '请输入维修项目', trigger: 'change' }
        // ],
        // sparePartResps: [
        //   { required: true, message: '请输入维修零配件', trigger: 'change' }
        // ],
        // partOutboundResps: [
        //   { required: true, message: '请输入维修零配件出库单', trigger: 'change' }
        // ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleCancel () {
      this.$refs.basicInfoRef.clearValidate();
      this.$refs.entrustInfoRef.clearValidate();
      this.isEditing = false;
    },
    handleShowLog () {
      this.$auditLog.show({ id: 123 });
    },
    handleEdit () {
      this.isEditing = true;
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['接车施工单管理', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const basicInfo = await this.$refs.basicInfoRef.getFormData();
        const entrustInfo = await this.$refs.entrustInfoRef.getFormData();
        const batteryInfo = await this.$refs.batteryInfoRef.getFormData();
        this.submitLoading = true;
        addOrUpdate({ ...this.form, ...basicInfo, ...entrustInfo, ...batteryInfo }).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          const id = res;
          if (rest || !id) {
            this.resetForm(formName);
          } else {
            if (this.form.id) {
              this.getDetailData();
            } else {
              this.$router.push({
                path: '/maintain/sp/serviceProxy/edit',
                query: {
                  id
                }
              });
            }
          }
        }).finally(() => {
          this.submitLoading = false;
        });
      } catch (error) {
        console.log(error);
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleRefresh () {
      this.getDetailData();
    },
    // 预检确认
    handlePreCheck () {
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>此操作将完成预检，工单进入制单环节，是否继续？</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        // 调用接口
        precheck(this._id).then(res => {
          this.getDetailData();
        });
      }).catch(() => {
      });
    },
    handlePrint () {
      this.$print.show({
        id: 'xxxx', // 必选，对应数据id
        template: 'demo', // 必选，对应 ./template/文件名.vue
        title: 'test'// 可选，打印标题
      });
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
  }
};
</script>
<style lang="scss" scoped>
.page-common-edit .common-title {
  position: sticky;
  top: 48px;
  .el-divider--vertical {
    height: auto;
  }
}
</style>
