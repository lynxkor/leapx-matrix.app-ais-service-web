<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <div class="page-common-edit">
        <el-container>
          <el-main>
            <section class="common-title common-title-extend" v-if="_id">
              <div class="common-title-main">
                <h2>单据编号：{{ form.code }}</h2>
                  <div v-if="isEditing">
                    <el-button size="small" @click="handleCancel">取消</el-button>
                    <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
                  </div>
                  <ButtonGroup maxWidth="50%" v-else>
                    <!-- 通用操作按钮 -->
                    <el-button size="small" @click="handlePrint" v-if="!isCanceled && permissions.has('AISMC-serviceProxy-printServiceProxy')">打印工单</el-button>
                    <el-button size="small" @click="couponsDialogVisible = true" v-if="!isCanceled && permissions.has('AISMC-serviceProxy-rightsList')">查询卡券&终身</el-button>
                    <el-button size="small" @click="handleResendSignSms" v-if="canResendSignSms && permissions.has('AISMC-serviceProxy-confirmToSign')">补推施工单短信签字</el-button>
                    <el-button size="small" @click="handleImport" v-if="!isCanceled && canImport">上传附件</el-button>
                    <el-button size="small" @click="handleShowLog" v-if="canLog">审核日志</el-button>
                    <el-button size="small" @click="remindInfoDialogVisible = true" v-if="permissions.has('AISMC-serviceProxy-getSpRemindInfo')">提醒信息</el-button>
                    <!-- 流程操作按钮 -->
                    <el-button size="small" @click="discardDialogVisible = true" v-if="!isCompleted && !form.isCreateStatementInfo && permissions.has('AISMC-serviceProxy-cancel')">作废</el-button>
                    <el-button size="small" @click="materialReturnDialogVisible = true" v-if="!isCompleted && hasRepairItems && permissions.has('AISMC-serviceStatement-refundPart')">退料</el-button>
                    <el-button size="small" @click="handlePreCheck" v-if="orderStatus === RepairOrderStatusEnum.RECEPTION_INSPECTION && permissions.has('AISMC-serviceProxy-precheck')">预检确认</el-button>
                    <el-button size="small" @click="handleCreatingOrder" v-if="canSign && permissions.has('AISMC-serviceProxy-confirmToSign')">制单确认并签字</el-button>
                    <el-button size="small" @click="selectRepairItemDialogVisible = true" v-if="canEditOrder && form.isCreateStatementInfo === 0 && permissions.has('AISMC-serviceProxy-repairItem')">选择维修项目</el-button>
                    <el-button size="small" @click="dispatchWorkDialogVisible = true" v-if="isInConstruction && hasUndispatchedItems && permissions.has('AISMC-serviceProxy-dispatchWorkers')">派工</el-button>
                    <el-button size="small" @click="deleteDispatchWorkDialogVisible = true" v-if="isInConstruction && hasDispatchedItems && permissions.has('AISMC-serviceProxy-dispatchWorkers')">删除派工</el-button>
                    <el-button size="small" @click="startWorkDialogVisible = true" v-if="isInConstruction && hasDispatchedNotStartedItems && permissions.has('AISMC-serviceProxy-startWork')">作业开始</el-button>
                    <el-button size="small" @click="endWorkDialogVisible = true" v-if="isInConstruction && hasWorkingItems && permissions.has('AISMC-serviceProxy-endWork')">作业结束</el-button>
                    <el-button size="small" @click="finalCheckDialogVisible = true" v-if="orderStatus === RepairOrderStatusEnum.PENDING_FINAL_INSPECTION && permissions.has('AISMC-serviceProxy-finalInspection')">终检</el-button>
                    <el-button size="small" @click="handleSettlement(1)" :loading="settlementLoading" v-if="canSettlement && !form.isCreateStatementInfo && permissions.has('AISMC-serviceStatement-add')">结算</el-button>
                    <el-button size="small" @click="handleSettlement(0)" :loading="settlementLoading" v-if="canSettlement && form.isCreateStatementInfo && permissions.has('AISMC-serviceStatement-cancel')">取消结算</el-button>
                    <el-button size="small" @click="handleCancelFinal" v-if="orderStatus === RepairOrderStatusEnum.ANTI_SETTLEMENT && permissions.has('AISMC-serviceProxy-finalInspection')">取消终检</el-button>

                    <el-divider direction="vertical"></el-divider>
                    <el-button v-if="canAddOrUpdate" size="small" type="primary" plain @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
                  </ButtonGroup>
              </div>
              <h5>
                <span>签字状态：{{ form.signStatusLabel || '-' }}</span>
                <i>|</i>
                <span>工单状态：{{ form.orderStatusLabel || '-' }}</span>
                <i>|</i>
                <span>故障确认：{{ form.confirmFaultLabel || '-' }}</span>
                <i>|</i>
                <span>开单时间：{{ form.createTime || '-' }}</span>
              </h5>
            </section>
            <NavTop :current="form.orderStatus" :_id="_id"/>
            <BasicInfo :formData.sync="form" :isEditing="isEditing" :_id="_id" ref="basicInfoRef" @refresh="handleRefresh"/>
            <EntrustInfo :formData="form" :isEditing.sync="isEditing" :_id="_id" ref="entrustInfoRef" @change="submitForm" @refresh="handleRefresh"/>
            <BatteryInfo :formData="form" :isEditing="isEditing" :_id="_id" ref="batteryInfoRef"/>
            <InquiryInfo :formData="form" :_id="_id"/>
            <RepairInfo :formData="form" :_id="_id"/>
            <SparepartsInfo :formData="form"/>
            <section class="common-section">
              <div :class="['common-section-header', { fold: collapsedSections['attachment'] }]" data-section-key="attachment">
                <h2>资料附件</h2>
              </div>
              <div class="common-section-body" :style="{ display: collapsedSections['attachment'] ? 'none' : '' }">
                <Attachment :_id="_id" :show-upload="false" ref="attachmentRef" attachType="附件资料"/>
              </div>
            </section>
            <MaintainInfo :formData="form"/>
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
        @check="checkIfShowRemindDialog"
      />
      <!-- 派工 -->
      <DispatchWorkDialog
        :visible.sync="dispatchWorkDialogVisible"
        :vehicleInfo="form"
        mode="add"
        @refresh="handleRefresh"
      />
      <!-- 删除派工 -->
      <DispatchWorkDialog
        :visible.sync="deleteDispatchWorkDialogVisible"
        :vehicleInfo="form"
        mode="delete"
        @refresh="handleRefresh"
      />
      <!-- 作业开始 -->
      <StartWorkDialog
        :visible.sync="startWorkDialogVisible"
        :vehicleInfo="form"
        mode="start"
        @refresh="handleRefresh"
      />
      <!-- 作业结束 -->
      <StartWorkDialog
        :visible.sync="endWorkDialogVisible"
        :vehicleInfo="form"
        mode="end"
        @refresh="handleRefresh"
      />
      <!-- 项目终检 -->
      <FinalCheckDialog
        :visible.sync="finalCheckDialogVisible"
        :vehicleInfo="form"
        @refresh="handleRefresh"
      />
      <!-- 接车施工单作废 -->
      <DiscardDialog
        :visible.sync="discardDialogVisible"
        :vehicleInfo="form"
        @refresh="handleRefresh"
      />
      <!-- 退料 -->
      <MaterialReturnDialog
        :visible.sync="materialReturnDialogVisible"
        :vehicleInfo="form"
        @refresh="handleRefresh"
      />
      <!-- 查询卡券&终身 -->
      <CouponsDialog
        :visible.sync="couponsDialogVisible"
        :vehicleInfo="form"
        @refresh="handleRefresh"
      />
      <!-- 提醒信息 -->
      <RemindInfoDialog
        :visible.sync="remindInfoDialogVisible"
        :vehicleInfo="form"
        @refresh="handleRefresh"
      />
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
    <!-- 结算故障解决情况弹窗 -->
    <SettlementDialog
      :visible.sync="settlementDialogVisible"
      @confirm="handleSettlementConfirm"
    />
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, precheck, addStatement, cancelStatement, cancelFinal, getSpRemindInfo, isVehRetention, addVehRetentionList, resendSignSms } from '@/api/maintain/sp/serviceProxy/index';
import { RepairOrderStatusEnum, BusinessTypeEnum, RemindInfoTypeEnum, CurrentSituationEnum, CustomerTypeEnum, ConfirmFaultEnum, CurrentFaultEnum } from './constant';
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
import SettlementDialog from './components/SettlementDialog';
import RemindInfoDialog from './components/RemindInfoDialog';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dataSource: '',
  orderStatus: '',
  warrantyTypeCollect: '',
  customerName: '',
  custType: CustomerTypeEnum.WALK_IN,
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
  currentFault: 1,
  customerContent: '',
  invaildDesc: '',
  anomalyDescription: '',
  previewingFinishAt: '',
  confirmedOn: '',
  expectStartAt: '',
  startAt: '',
  finishAt: '',
  faultSolve: '',
  // 【本次进店情况（周期内）】：枚举：非故障进店、首次故障进店、多次非重复故障进店、多次重复故障进店；开单默认为“非故障进店”，不可编辑；
  currentSituation: CurrentSituationEnum.NO_FAULT,
  currentSituationLabel: '非故障进店',
  faultAlert: '',
  faultPeriod: '',
  earliestfaultServiceProxy: '',
  recentlyfaultServiceProxy: '',
  faultModule: '',
  isCreateStatementInfo: '',
  isPreAuth: '',
  isCreatePreAuth: '',
  preAuthId: '',
  reason: '',
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
    RemindInfoDialog,
    SettlementDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    // 工单状态计算属性
    orderStatus () {
      return this.form.orderStatus;
    },
    // 是否已取消
    isCanceled () {
      return this.orderStatus === RepairOrderStatusEnum.CANCEL;
    },
    // 是否已交车、反结算或取消
    isCompleted () {
      return [
        RepairOrderStatusEnum.DELIVERED,
        RepairOrderStatusEnum.ANTI_SETTLEMENT,
        RepairOrderStatusEnum.CANCEL
      ].includes(this.orderStatus);
    },

    // 是否在施工中(待派工或施工中)
    isInConstruction () {
      return [
        RepairOrderStatusEnum.PENDING_DISPATCH,
        RepairOrderStatusEnum.UNDER_CONSTRUCTION
      ].includes(this.orderStatus);
    },
    // 是否可编辑维修项目
    canEditOrder () {
      return ![
        RepairOrderStatusEnum.ANTI_SETTLEMENT,
        RepairOrderStatusEnum.CANCEL,
        RepairOrderStatusEnum.RECEPTION_INSPECTION
      ].includes(this.orderStatus);
    },
    // 是否可结算(待交车)
    canSettlement () {
      return this.orderStatus === RepairOrderStatusEnum.PENDING_DELIVERY;
    },
    // 是否有维修项目或配件
    hasItems () {
      return (this.form?.costCountResp?.repairItemRespList?.length ||
        this.form?.costCountResp?.sparePartRespList?.length);
    },
    // 是否存在未派工的维修项目
    hasUndispatchedItems () {
      return this.form?.workRecordRespList?.some(item => item.isDispatch !== 1);
    },
    // 是否存在已派工的维修项目
    hasDispatchedItems () {
      return this.form?.workRecordRespList?.some(item => item.isDispatch === 1);
    },
    // 是否存在已派工未开始的维修项目
    hasDispatchedNotStartedItems () {
      return this.form?.workRecordRespList?.some(item => item.isDispatch === 1 && !item.timeSpend);
    },
    // 是否存在作业中的维修项目
    hasWorkingItems () {
      return this.form?.workRecordRespList?.some(item => item.isDispatch === 1 && item.timeSpend && !item.finishAt);
    },
    // 是否存在已经领料但是未全部退料的维修备件记录且未结算
    hasRepairItems () {
      const item = this.form?.costCountResp?.sparePartRespList?.some(item => (+item.quantity || 0) > 0 && item.isOutstock);
      return item && !this.form?.isCreateStatementInfo;
    },
    canResendSignSms () {
      // 假设 signStatus 为空或特定状态表示待签字，这里主要依据题目要求的“签字生成时间不为空”和“非作废”
      // 如果需要严格判断“待签字”，请加上 && this.form.signStatus === 'YOUR_PENDING_STATUS_CODE'
      return !this.isCanceled && this.form.signGeneratedOn && this.form.signStatus && this.form.signStatus === 10;
    },
    canSign () {
      // 制单中状态，且签字状态为空或非待签字/已签字，存在维修项目
      const isCreatingAndUnsigned = this.orderStatus === RepairOrderStatusEnum.CREATING_ORDER && this.hasItems && !this.form.signStatus;
      // 无故障且确认结果为不准确
      const hasFaultConflict = Number(this.form.currentFault) === CurrentFaultEnum.NONE && Number(this.form.confirmFault) === ConfirmFaultEnum.INACCURATE;
      return isCreatingAndUnsigned || hasFaultConflict;
    },
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
      collapsedSections: { attachment: true, batteryInfo: true },
      pageTitle: '接车施工单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceProxy',
      isEditing: false,
      loading: false,
      submitLoading: false,
      confirmDocDialogVisible: false,
      selectRepairItemDialogVisible: false,
      dispatchWorkDialogVisible: false,
      deleteDispatchWorkDialogVisible: false,
      startWorkDialogVisible: false,
      endWorkDialogVisible: false,
      finalCheckDialogVisible: false,
      discardDialogVisible: false,
      materialReturnDialogVisible: false,
      couponsDialogVisible: false,
      settlementDialogVisible: false, // 结算弹窗
      settlementLoading: false,
      remindInfoDialogVisible: false,
      yes_no_enum: YES_NO_ENUM,
      RepairOrderStatusEnum,
      form: { ...form },
      originalForm: { ...form }
    };
  },

  mounted () {
    this.getDetailData();
    // 这个页面除默认AISMC-serviceProxy外还使用了AISMC-serviceStatement开头的权限，特殊处理
    const pageSource = (this.$store.state.pageSource?.aisPageSource || []).filter(item => item.startsWith('AISMC-serviceStatement'));
    pageSource.forEach(item => {
      this.permissions.add(item);
    });
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleCancel () {
      this.$refs.basicInfoRef.clearValidate();
      this.$refs.entrustInfoRef.clearValidate();
      // 检查表单是否有修改
      if (JSON.stringify(this.originalForm) !== JSON.stringify(this.form)) {
        const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>确定要取消？</div><div class="ais-leave-tips-sub">取消后，当前填写的数据会被清空。</div>';
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          customClass: 'ais-leave-tips',
          showClose: false
        }).then(() => {
          this.isEditing = false;
          this.form = JSON.parse(JSON.stringify(this.originalForm));
        }).catch(() => {
        });
      } else {
        this.isEditing = false;
      }
    },
    handleShowLog () {
      this.$auditLog.show({ id: this._id });
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
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['接车施工单', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          if (!res) {
            this.$message.warning('详情数据获取失败');
            return;
          }
          this.form = res;
          this.$nextTick(() => {
            this.originalForm = JSON.parse(JSON.stringify(this.form));
          });
        }).catch(() => {
          this.loading = false;
        });
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const basicInfo = await this.$refs.basicInfoRef.getFormData();
        const entrustInfo = await this.$refs.entrustInfoRef.getFormData();
        const batteryInfo = await this.$refs.batteryInfoRef.getFormData();
        const data = { ...this.form, ...basicInfo, ...entrustInfo, ...batteryInfo };
        // 后端要求新开单增加isAddItems字段
        if (!this._id) {
          data.isAddItems = 0;
          data.dataSource = 170; // 新建时增加开单来源，170零小跑PC端; 180零小跑APP端
        }
        if (data.currentFault && (data.faultAlertRecordRespList || []).length === 0 && (data.faultAlertRecordParams || []).length === 0) {
          this.$message.warning('请先添加故障模块');
          this.isEditing = true;
          return;
        }
        // 进店里程数变化时才校验
        if (this.form.mileage !== this.originalForm.mileage) {
          if (+this.form.mileage < +this.form.lastMileage) {
            this.$message.warning(`本次进店里程数${this.form.mileage}小于上次进店里程数${this.form.lastMileage}，请注意`);
          } else if (Math.abs(+this.form.mileage - +this.form.netMileage) > 300) {
            this.$message.warning('进店里程数和车联网里程数不符，请注意');
          }
        }
        this.submitLoading = true;
        delete data.currentSituation;
        delete data.currentSituationLabel;
        delete data.recentlyfaultServiceProxy;
        delete data.recentlyfaultServiceProxyCode;
        delete data.earliestfaultServiceProxy;
        delete data.earliestfaultServiceProxyCode;
        delete data.faultAlert;
        addOrUpdate(data).then(res => {
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
              this.isEditing = false;
            } else {
              this.$router.replace({
                path: '/maintain/sp/serviceProxy/edit',
                query: {
                  id
                }
              });
            }
          }
        }).catch(() => {
          this.$message.error('保存失败，请重试');
        }).finally(() => {
          this.submitLoading = false;
          this.$refs.basicInfoRef?.clearValidate();
          this.$refs.entrustInfoRef?.clearValidate();
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
        ...defaultForm,
        businessType: BusinessTypeEnum.NATURAL_ARRIVAL // 默认自然到店
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
    // 附件上传成功后刷新
    handleAttachmentRefresh () {
      this.$refs.attachmentRef?.loadAttachmentList();
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
        id: this._id, // 必选，对应数据id
        template: 'ServiceProxy', // 必选，对应 ./template/文件名.vue
        title: `接车施工单：${this.form.code}`// 可选，打印标题
      });
    },
    handleImport () {
      this.$refs.attachmentRef?.openUploadDialog();
    },
    async handleCreatingOrder () {
      try {
        const entrustInfo = await this.$refs.entrustInfoRef.getFormData();
        if (Number(entrustInfo.currentFault) === CurrentFaultEnum.HAS_FAULT && !entrustInfo.customerContent) {
          this.$message.warning('请先填写故障描述和故障模块');
          this.isEditing = true;
          return;
        }
        if (entrustInfo.expectFinishAt) {
          // 检查留车信息
          await this.checkVehicleRetention();
        } else {
          this.$message.warning('请先填写预计交车时间');
          this.isEditing = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async checkVehicleRetention () {
      try {
        // 静默调用检查接口
        const needRetention = await isVehRetention(this._id);

        if (needRetention.isVehRetention) {
          // 需要留车，先创建留车清单
          const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>该车辆需要留车检查，请咨询客户是否同意留车？</div>';
          this.$confirm(message, '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            customClass: 'ais-leave-tips',
            showClose: false
          }).then(async () => {
            try {
              // 静默调用创建接口
              await addVehRetentionList({ serviceProxyId: this._id, vehRetentionConfigId: needRetention.vehRetentionConfigId });
              this.$message.success('留车清单创建成功');
              // 继续弹出制单确认弹窗
              this.confirmDocDialogVisible = true;
            } catch (err) {
              this.$message.error('创建留车清单失败');
              console.error(err);
            }
          }).catch(() => {
            // this.$message.info('已取消操作');
            this.confirmDocDialogVisible = true;
          });
        } else {
          // 不需要留车，直接弹出制单确认弹窗
          this.confirmDocDialogVisible = true;
        }
      } catch (error) {
        console.error('检查留车信息失败:', error);
        // 即使检查失败也继续弹出制单确认弹窗
        this.confirmDocDialogVisible = true;
      }
    },
    // 结算与取消结算
    handleSettlement (v) {
      if (v) {
        // 判断是否存在故障
        if (this.form.currentFault === 1) {
          // 存在故障，需要填写故障解决情况
          this.settlementDialogVisible = true;
        } else {
          // 不存在故障，直接确认
          this.handleSettlementConfirm({ faultSolve: true, reason: '' });
        }
      } else {
        if (this.settlementLoading) return;
        const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>您确定要取消结算吗？</div>';
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          customClass: 'ais-leave-tips',
          showClose: false
        }).then(() => {
          this.settlementLoading = true;
          cancelStatement({ serviceProxyId: this._id }).then(res => {
            this.$message.success('取消结算成功');
            this.getDetailData();
          }).finally(() => {
            this.settlementLoading = false;
          });
        }).catch(() => {
        });
      }
    },
    async handleSettlementConfirm (faultData = {}) {
      if (this.settlementLoading) return;
      this.settlementLoading = true;
      try {
        const res = await addStatement({ serviceProxyId: this._id, ...faultData });
        this.$message.success('结算成功');
        this.getDetailData();
        if (res) {
          this.$router.push({
            path: '/maintain/sp/serviceStatement/edit',
            query: { id: res }
          });
        }
      } catch (error) {
        console.error('结算失败:', error);
        this.$message.error(error.msg || '结算失败');
      } finally {
        this.settlementLoading = false;
      }
    },

    // 取消终检
    handleCancelFinal () {
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>您确定要取消终检吗？</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        // 调用接口
        cancelFinal({ id: this._id }).then(res => {
          this.$message.success('取消终检成功');
          this.getDetailData();
        });
      }).catch(() => {
      });
    },
    // 检查是否要弹出提醒
    checkIfShowRemindDialog () {
      // 后端说是异步，要求延迟
      setTimeout(() => {
        getSpRemindInfo(this._id).then(res => {
          const list = res || [];
          const target = list.find(item => (item.type === RemindInfoTypeEnum.PRE_AUTH || item.type === RemindInfoTypeEnum.CITY_LEVEL) && item.content);
          if (target) {
            this.remindInfoDialogVisible = true;
          }
        });
      }, 1000);
    },
    /**
     * 补推施工单短信签字
     */
    handleResendSignSms () {
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>此操作将再次推送短信给用户进行施工单签字，是否继续？</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        // 调用接口
        // 假设接口参数为 id
        resendSignSms(this._id).then(res => {
          this.$message.success('推送成功');
          // 可选：刷新页面数据以更新最新状态
          this.getDetailData();
        }).catch(err => {
          // 错误处理通常由拦截器统一处理，如需特殊处理可在此添加
          console.error(err);
        });
      }).catch(() => {
        // 用户取消操作，无需处理
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.page-common-edit .common-title {
  position: sticky;
  top: 0px;
  .el-divider--vertical {
    height: auto;
    margin: 4px 12px;
    background-color: var(--leap-color-default-light-4);
  }
}
</style>
