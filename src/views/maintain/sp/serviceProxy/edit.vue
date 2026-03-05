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
                    <!-- 通用操作按钮 -->
                    <el-button size="small" @click="handlePrint" v-if="!isCanceled">打印工单</el-button>
                    <el-button size="small" @click="couponsDialogVisible = true" v-if="!isCanceled">查询卡券&终身</el-button>
                    <el-button size="small" @click="handleImport" v-if="!isCanceled">上传附件</el-button>
                    <el-button size="small" @click="handleShowLog">审核日志</el-button>
                    <!-- 流程操作按钮 -->
                    <el-button size="small" @click="discardDialogVisible = true" v-if="!isCompleted">作废</el-button>
                    <el-button size="small" @click="materialReturnDialogVisible = true" v-if="!isCompleted && hasRepairItems">退料</el-button>
                    <el-button size="small" @click="handlePreCheck" v-if="orderStatus === RepairOrderStatusEnum.RECEPTION_INSPECTION">预检确认</el-button>
                    <el-button size="small" @click="handleCreatingOrder" v-if="orderStatus === RepairOrderStatusEnum.CREATING_ORDER && hasItems">制单确认并签字</el-button>
                    <el-button size="small" @click="selectRepairItemDialogVisible = true" v-if="canEditOrder && form.isCreateStatementInfo === 0">选择维修项目</el-button>
                    <el-button size="small" @click="dispatchWorkDialogVisible = true" v-if="isInConstruction && hasUndispatchedItems">派工</el-button>
                    <el-button size="small" @click="deleteDispatchWorkDialogVisible = true" v-if="isInConstruction && hasDispatchedNotStartedItems">删除派工</el-button>
                    <el-button size="small" @click="startWorkDialogVisible = true" v-if="isInConstruction && hasDispatchedNotStartedItems">作业开始</el-button>
                    <el-button size="small" @click="endWorkDialogVisible = true" v-if="isInConstruction && hasWorkingItems">作业结束</el-button>
                    <el-button size="small" @click="finalCheckDialogVisible = true" v-if="orderStatus === RepairOrderStatusEnum.PENDING_FINAL_INSPECTION">终检</el-button>
                    <el-button size="small" @click="handleSettlement(1)" v-if="canSettlement && !form.isCreateStatementInfo">结算</el-button>
                    <el-button size="small" @click="handleSettlement(0)" v-if="canSettlement && form.isCreateStatementInfo">取消结算</el-button>
                    <el-button size="small" @click="handleCancelFinal" v-if="orderStatus === RepairOrderStatusEnum.ANTI_SETTLEMENT">取消终检</el-button>

                    <el-divider direction="vertical"></el-divider>
                    <el-button v-if="canAddOrUpdate" size="small" type="primary" plain @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
                  </ButtonGroup>
              </div>
              <h5>
                <span>签字状态：{{ form.signStatusLabel || '-' }}</span>
                <i>|</i>
                <span>工单状态：{{ form.orderStatusLabel || '-' }}</span>
                <i>|</i>
                <span>领料状态：{{ form.pickStatusLabel || '-' }}</span>
                <i>|</i>
                <span>开单时间：{{ form.createTime || '-' }}</span>
              </h5>
            </section>
            <BasicInfo :formData="form" :isEditing="isEditing" :_id="_id" ref="basicInfoRef"/>
            <EntrustInfo :formData="form" :isEditing="isEditing" :_id="_id" ref="entrustInfoRef" @change="submitForm"/>
            <BatteryInfo :formData="form" :isEditing="isEditing" :_id="_id" ref="batteryInfoRef"/>
            <!-- <InquiryInfo :formData="form"/> -->
            <RepairInfo :formData="form"/>
            <SparepartsInfo :formData="form"/>
            <Attachment :formData="fileList" @refresh="handleRefresh"/>
            <MaintainInfo :formData="form"/>
            <!-- TIPS: 填入项目id即可 -->
            <Upload
              :visible="uploadDialogVisible"
              :businessId="_id"
              @close="handleUploadDialogClose"
              @refresh="handleRefresh"
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
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, precheck, addStatement, cancelStatement, cancelFinal } from '@/api/maintain/sp/serviceProxy/index';
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
import Upload from './components/UploadDialog';
import { getFileList } from '@/libs/api/attachment';

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

export const RepairOrderStatusEnum = {
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
  DELIVERED: 180,
  /** 反结算 */
  ANTI_SETTLEMENT: 200,
  /** 已作废 */
  CANCEL: 210
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
    // InquiryInfo,
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

    // 是否存在已派工未开始的维修项目
    hasDispatchedNotStartedItems () {
      return this.form?.workRecordRespList?.some(item => item.isDispatch === 1 && !item.timeSpend);
    },
    // 是否存在作业中的维修项目
    hasWorkingItems () {
      console.log('hasWorkingItems', this.form?.workRecordRespList);
      return this.form?.workRecordRespList?.some(item => item.isDispatch === 1 && item.timeSpend && !item.finishAt);
    },
    // 是否存在已经领料但是未全部退料的维修备件记录
    hasRepairItems () {
      const item = this.form?.costCountResp?.sparePartRespList?.some(item => (+item.quantity || 0) > 0 && item.isOutstock);
      return item;
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
      deleteDispatchWorkDialogVisible: false,
      startWorkDialogVisible: false,
      endWorkDialogVisible: false,
      finalCheckDialogVisible: false,
      discardDialogVisible: false,
      materialReturnDialogVisible: false,
      couponsDialogVisible: false,
      yes_no_enum: YES_NO_ENUM,
      RepairOrderStatusEnum,
      uploadDialogVisible: false,
      form: { ...form },
      originalForm: { ...form },
      fileList: []
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    getFileList () {
      getFileList({
        businessId: this._id
      }).then(res => {
        if (res.code === 200) {
          this.fileList = res.data || [];
        }
      });
    },
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
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['接车施工单管理', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          this.form = res;
          this.originalForm = res;
        });
        this.getFileList();
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
              this.$router.replace({
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
        id: this._id, // 必选，对应数据id
        template: 'ServiceProxy', // 必选，对应 ./template/文件名.vue
        title: `接车施工单：${this.form.code}`// 可选，打印标题
      });
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    async handleCreatingOrder () {
      try {
        const entrustInfo = await this.$refs.entrustInfoRef.getFormData();
        if (entrustInfo.expectFinishAt) {
          this.confirmDocDialogVisible = true;
        } else {
          this.$message.warning('请先填写预计交车时间');
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 结算与取消结算
    handleSettlement (v) {
      if (v) {
        const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>您确定要生成结算单？</div>';
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          customClass: 'ais-leave-tips',
          showClose: false
        }).then(() => {
          // 调用接口
          addStatement({ serviceProxyId: this._id }).then(res => {
            this.$message.success('结算成功');
            this.getDetailData();
          });
        }).catch(() => {
        });
      } else {
        const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>您确定要取消结算吗？</div>';
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          customClass: 'ais-leave-tips',
          showClose: false
        }).then(() => {
          // 调用接口
          cancelStatement({ serviceProxyId: this._id }).then(res => {
            this.$message.success('取消结算成功');
            this.getDetailData();
          });
        }).catch(() => {
        });
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
        cancelFinal({ serviceProxyId: this._id }).then(res => {
          this.$message.success('取消终检成功');
        });
      }).catch(() => {
      });
    }
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
