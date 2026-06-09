<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest"
        :title="`单据编号：${form.code}`">
        <template #extraButtons>
          <el-button size="small" @click="rightsList" v-if="buttonPermissions.rights">权益核销</el-button>
          <el-button size="small" @click="handleResendSignSms" v-if="buttonPermissions.canResendSignSms">补推结算单短信签字</el-button>
          <el-button size="small" @click="submitAndSing" v-if="buttonPermissions.sign">提交结算并签字</el-button>
          <el-button size="small" @click="reject" v-if="buttonPermissions.reject">驳回</el-button>
          <el-button size="small" @click="addInvoiceRecord" v-if="buttonPermissions.addRecord">添加收款记录</el-button>
          <el-button size="small" @click="paySuccess" v-if="buttonPermissions.success">完成收款</el-button>
          <el-button size="small" @click="createRefund" v-if="buttonPermissions.reCreate || buttonPermissions.reCreate1" :style="{'opacity': isStoreOrder && isOverSettlement30Days ? '0.5': 1}">创建反结算单</el-button>
          <el-button size="small" @click="createWarrantyApply"
            v-if="canCreateWarrantyApply">创建保修申请单</el-button>
          <el-button size="small" @click="handlePrint">打印结算单</el-button>
        </template>
        <div class="common-sub-title">
          <span>结算单号：{{ form.code || '-' }}</span>
          <i>|</i>
          <span>签字状态：{{ form.signStatusLabel || '-' }}</span>
          <i>|</i>
          <span>结算单状态：{{ form.statementStatusLabel || '-' }}</span>
          <i>|</i>
          <span>创建时间：{{ form.createTime || '-' }}</span>
        </div>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="结算单号：" prop="code">
                  <el-input placeholder="请输入" v-model="form.code" disabled clearable />
                </el-form-item>
                <el-form-item label="结算单类型：" prop="statementTypeLabel">
                  <el-input placeholder="请输入" v-model="form.statementTypeLabel" disabled clearable />
                </el-form-item>
                <el-form-item label="是否已推送满意度：" prop="isPushVisitResultLabel">
                  <el-input placeholder="请输入" v-model="form.isPushVisitResultLabel" disabled clearable />
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-input placeholder="请输入" v-model="form.serviceProxyCode" disabled clearable />
                </el-form-item>
                <el-form-item label="销账标识：" prop="accountType">
                  <el-input placeholder="请输入" v-model="form.accountTypeLabel" disabled clearable />
                  <!-- <fetch-select :request="fetchOptions" enumCode="xxx" v-model="form.accountType" placeholder="请选择"
                    disabled clearable filterable /> -->
                </el-form-item>
                <el-form-item label="是否已创建反结算申请单：" prop="createReStatementLabel">
                  <el-input placeholder="请输入" v-model="form.createReStatementLabel" disabled clearable />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input placeholder="请输入" v-model="form.dealerName" disabled clearable />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  <LPEncrypted
                    :value.sync="form.vehProfileVin"
                    :decryptMethod="() => getDecryptField(form.id, 'vehProfileVin')"
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <el-input placeholder="请输入" v-model="form.dataSource" disabled clearable />
                </el-form-item>
                <el-form-item label="负责人：" prop="serviceOwnerName">
                  <el-input placeholder="请输入" v-model="form.serviceOwnerName" disabled clearable />
                </el-form-item>
                <el-form-item label="支付方式：" prop="payType">
                  <el-input placeholder="请输入" v-model="form.payTypeLabel" disabled clearable />
                  <!-- <fetch-select :request="fetchOptions" enumCode="xxx" v-model="form.payTypeLabel" placeholder="请选择" disabled
                    clearable filterable /> -->
                </el-form-item>
                <el-form-item label="维修类型（汇总）：" prop="warrantyTypeCollect">
                  <!-- <fetch-select :request="fetchOptions" enumCode="xxx" v-model="form.warrantyTypeCollect"
                    placeholder="请选择" disabled clearable filterable /> -->
                  <el-input placeholder="请输入" v-model="form.warrantyTypeCollect" disabled clearable />
                </el-form-item>
                <el-form-item label="下次保养时间：" prop="nextMaintenanceTime">
                  <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.nextMaintenanceTime"
                    :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                    end-placeholder="结束日期" disabled />
                </el-form-item>
                <el-form-item label="下次保养里程：" prop="nextMaintenanceMileage">
                  <el-input placeholder="请输入" v-model="form.nextMaintenanceMileage" disabled clearable />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  <el-input placeholder="请输入" v-model="form.remark" clearable maxlength="500" />
                </el-form-item>
                <el-form-item class="form-item-full" />
                <el-form-item label="签字完成时间：" prop="signCompletedOn">
                  <el-input placeholder="请输入" v-model="form.signCompletedOn" disabled />
                </el-form-item>
                <el-form-item label="签字渠道：" prop="signChannelLabel">
                  <el-input placeholder="请输入" v-model="form.signChannelLabel" disabled />
                </el-form-item>
                <el-form-item label="签字生成时间：" prop="signGeneratedOn">
                  <el-input placeholder="请输入" v-model="form.signGeneratedOn" disabled />
                </el-form-item>
                <el-form-item label="签字状态：" prop="signStatusLabel">
                  <el-input placeholder="请输入" v-model="form.signStatusLabel" disabled />
                </el-form-item>
                <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredOn">
                  <el-input placeholder="请输入" v-model="form.signUrlExpiredOn" disabled />
                </el-form-item>
                <el-form-item class="form-item-full" />
                <el-form-item label="总金额：" prop="totalAmount">
                  <el-input placeholder="请输入" v-model="form.totalAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="维修项目金额：" prop="repairItemAmount">
                  <el-input placeholder="请输入" v-model="form.repairItemAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="结算人员：" prop="statementPersonName">
                  <el-input placeholder="请输入" v-model="form.statementPersonName" disabled clearable />
                  <!-- <fetch-select :request="fetchOptions" enumCode="xxx" v-model="form.statementPersonName"
                    placeholder="请选择" disabled clearable filterable /> -->
                </el-form-item>
                <el-form-item label="去零金额：" prop="noFractionAmount">
                  <el-input placeholder="请输入" v-model="form.noFractionAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="维修项优惠金额：" prop="repairItemDiscount">
                  <el-input placeholder="请输入" v-model="form.repairItemDiscount" disabled clearable />
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.statementTime"
                    :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                    end-placeholder="结束日期" disabled />
                </el-form-item>
                <el-form-item label="权益金额：" prop="rightsAmount">
                  <el-input placeholder="请输入" v-model="form.rightsAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="维修项应付金额：" prop="repairItemPayableAmount">
                  <el-input placeholder="请输入" v-model="form.repairItemPayableAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="收款人：" prop="payeeName">
                  <el-input placeholder="请输入" disabled v-model="form.payeeName" clearable />
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountAmount">
                  <el-input placeholder="请输入" v-model="form.discountAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="零件金额：" prop="partAmount">
                  <el-input placeholder="请输入" v-model="form.partAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="收款时间：" prop="receiveTime">
                  <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.receiveTime"
                    :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"
                    end-placeholder="结束日期" disabled />
                </el-form-item>
                <el-form-item label="实际应付总金额：" prop="payableAmount">
                  <el-input placeholder="请输入" v-model="form.payableAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="零件优惠金额：" prop="partDiscount">
                  <el-input placeholder="请输入" v-model="form.partDiscount" disabled clearable />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="form" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="剩余应付款金额：" prop="remainAmount">
                  <el-input placeholder="请输入" v-model="form.remainAmount" disabled clearable />
                </el-form-item>
                <el-form-item label="零件应付金额：" prop="partPayableAmount">
                  <el-input placeholder="请输入" v-model="form.partPayableAmount" disabled clearable />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="结算单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="结算单类型：" prop="statementTypeLabel">
                  {{ form.statementTypeLabel }}
                </el-form-item>
                <el-form-item label="是否已推送满意度：" prop="isPushVisitResultLabel">
                  {{ form.isPushVisitResultLabel }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-link type="success" @click.prevent="goToServiceProxy(form.serviceProxyId)">{{
                    form.serviceProxyCode
                    }}</el-link>
                </el-form-item>
                <el-form-item label="销账标识：" prop="accountTypeLabel">
                  {{ form.accountTypeLabel }}
                </el-form-item>
                <el-form-item label="是否已创建反结算：" prop="createReStatementLabel">
                  {{ form.createReStatementLabel }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-link type="success" @click.prevent="goToDealer(form.dealerId)">{{ form.dealerName }}</el-link>
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  <LPEncrypted
                    :value.sync="form.vehProfileVin"
                    :decryptMethod="() => getDecryptField(form.id, 'vehProfileVin')"
                  >
                    <el-link type="success" @click.prevent="goToVehicleProfile(form.vehProfileId)">{{
                      form.vehProfileVin }}</el-link>
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSourceLabel">
                  {{ form.dataSourceLabel }}
                </el-form-item>
                <el-form-item label="负责人：" prop="serviceOwnerName">
                  {{ form.serviceOwnerName }}
                </el-form-item>
                <el-form-item label="支付方式：" prop="payTypeLabel">
                  {{ form.payTypeLabel }}
                </el-form-item>
                <el-form-item label="维修类型（汇总）：" prop="warrantyTypeCollect">
                  {{ form.warrantyTypeCollect }}
                </el-form-item>
                <el-form-item label="下次保养时间：" prop="nextMaintenanceTime">
                  {{ form.nextMaintenanceTime }}
                </el-form-item>
                <el-form-item label="下次保养里程：" prop="nextMaintenanceMileage">
                  {{ form.nextMaintenanceMileage }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item class="form-item-full" />
                <el-form-item label="签字完成时间：" prop="signCompletedOn">
                  {{ form.signCompletedOn }}
                </el-form-item>
                <el-form-item label="签字渠道：" prop="signChannelLabel">
                  {{ form.signChannelLabel }}
                </el-form-item>
                <el-form-item label="签字生成时间：" prop="signGeneratedOn">
                  {{ form.signGeneratedOn }}
                </el-form-item>
                <el-form-item label="签字状态：" prop="signStatusLabel">
                  {{ form.signStatusLabel }}
                </el-form-item>
                <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredOn">
                  {{ form.signUrlExpiredOn }}
                </el-form-item>
                <el-form-item class="form-item-full" />
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="维修项目金额：" prop="repairItemAmount">
                  {{ form.repairItemAmount }}
                </el-form-item>
                <el-form-item label="结算人员：" prop="statementPersonName">
                  <el-link type="success" target="_blank" :href="`/partner/user/list/detail?&userId=${form.statementPersonId}`">{{ form.statementPersonName }}</el-link>
                </el-form-item>
                <el-form-item label="去零金额：" prop="noFractionAmount">
                  {{ form.noFractionAmount }}
                </el-form-item>
                <el-form-item label="维修项目优惠金额：" prop="repairItemDiscount">
                  {{ form.repairItemDiscount }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  {{ form.statementTime }}
                </el-form-item>
                <el-form-item label="权益金额：" prop="rightsAmount">
                  {{ form.rightsAmount }}
                </el-form-item>
                <el-form-item label="维修项目应付金额：" prop="repairItemPayableAmount">
                  {{ form.repairItemPayableAmount }}
                </el-form-item>
                <el-form-item label="收款人：" prop="payeeName">
                  <el-link type="success" target="_blank" :href="`/partner/user/list/detail?&userId=${form.payeeId}`">{{ form.payeeName }}</el-link>
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountAmount">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="零件金额：" prop="partAmount">
                  {{ form.partAmount }}
                </el-form-item>
                <el-form-item label="收款时间：" prop="receiveTime">
                  {{ form.receiveTime }}
                </el-form-item>
                <el-form-item label="实际应付总金额：" prop="payableAmount">
                  {{ form.payableAmount }}
                </el-form-item>
                <el-form-item label="零件优惠金额：" prop="partDiscount">
                  {{ form.partDiscount }}
                </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="剩余应付款金额：" prop="remainAmount">
                  {{ form.remainAmount }}
                </el-form-item>
                <el-form-item label="零件应付金额：" prop="partPayableAmount">
                  {{ form.partPayableAmount }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <PayRecord :formData="form" />
            <RightsRecord :formData="form" />
            <RepaireRecord :formData="form" />
            <PartsRecodr :formData="form" />
            <MaintenanceRecord :formData="form" />
          </section>
        </el-main>
      </edit-base-container>
      <SelectRightsDialog :visible.sync="rightsDialogVisible" :statementId="_id" @refresh="handleRefresh" :formData="form"/>
      <SubmitSettlemenDialog ref="settlemenDialogRef" :visible.sync="submitSettlemenDialogVisible" :serviceProxyId="_id"
        :info="form" @refresh="handleRefresh" />
      <AddPayrecordDialog :visible.sync="addPayrecordDialogVisible" :serviceProxyId="_id" :info="form"
        @refresh="handleRefresh" />
      <CreateWarrantyApplyDialog
        :visible.sync="warrantyApplyVisible"
        :id="_id"
      />
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, reject, receiptCompletion, createCounterSettlement, resendSignSms, getDecrypt } from '@/api/maintain/sp/serviceStatement/index';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import LPEncrypted from '@/libs/components/LPEncrypted';
import { getEnum } from '@/api/common';
import { StatementCheckoutTypeEnum, PackageTypeEnum } from '@/views/maintain/sp/serviceProxy/constant';
import CreateWarrantyApplyDialog from './components/CreateWarrantyApplyDialog';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import RepaireRecord from '@/views/maintain/sp/serviceStatement/components/RepaireRecord/index.vue';
import RightsRecord from '@/views/maintain/sp/serviceStatement/components/RightsUsageRecord/index.vue';
import MaintenanceRecord from '@/views/maintain/sp/serviceStatement/components/PartMaintenanceRecord/index.vue';
import PartsRecodr from '@/views/maintain/sp/serviceStatement/components/PartsRecord/index.vue';
import PayRecord from '@/views/maintain/sp/serviceStatement/components/PayRecord/index.vue';
import SelectRightsDialog from './components/SelectRightsDialog';
import SubmitSettlemenDialog from './components/SubmitSettlemenDialog';
import AddPayrecordDialog from './components/AddPayrecordDialog';
import { checkCanCreate } from '@/api/claimreturn/claim/warrantyapply';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dataSource: '',
  statementType: '',
  statementStatus: '',
  serviceProxyCode: '',
  warrantyTypeCollect: '',
  accountType: '',
  vehProfileVin: '',
  dealerName: '',
  repairItemAmount: '',
  repairItemDiscount: '',
  repairItemPayableAmount: '',
  partAmount: '',
  partDiscount: '',
  partPayableAmount: '',
  rightsAmount: '',
  discountAmount: '',
  noFractionAmount: '',
  totalAmount: '',
  payableAmount: '',
  remainAmount: '',
  nextMaintenanceMileage: '',
  nextMaintenanceTime: '',
  createReStatement: '',
  createWarranty: '',
  statementPersonName: '',
  statementTime: '',
  payeeName: '',
  receiveTime: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  isPushVisitResult: '',
  serviceProxyId: '',
  ownerOrgId: '',
  dealerCode: '',
  vehProfileId: '',
  payType: '',
  serviceOwnerId: '',
  signChannel: '',
  signCompletedTime: '',
  signGeneratedTime: '',
  signStatus: '',
  signUrlExpiredTime: '',
  statementPersonId: '',
  payeeId: '',
  claimStatus: '',
  satisfactionResult: '',
  claimItemAmount: '',
  claimOtherAmount: '',
  claimPartsAmount: '',
  invoiceRecordResps: [],
  rightsUsageRecordResps: [],
  repairItemResps: [],
  partResps: [],
  partMaintenanceResps: [],
  payTypeLabel: ''
};

export default {
  name: 'serviceStatementEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {

    EditPageLayout,
    EditBaseContainer,
    LPEncrypted,
    // EditTable,
    // FetchSelect,
    RepaireRecord,
    RightsRecord,
    MaintenanceRecord,
    PartsRecodr,
    PayRecord,
    SelectRightsDialog,
    SubmitSettlemenDialog,
    AddPayrecordDialog,
    CreateWarrantyApplyDialog,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },

    // 是否为商城订单
    isStoreOrder () {
      return (this.form.repairItemResps || []).some(item => String(item.packageType) === PackageTypeEnum.STORE);
    },
    // 商城订单已收款且超过结算时间30天
    isOverSettlement30Days () {
      if (!this.form.statementTime) return false;
      const statementDate = new Date(this.form.statementTime);
      const now = new Date();
      const diffDays = (now - statementDate) / (1000 * 60 * 60 * 24);
      return diffDays > 30;
    },

    // 按钮权限控制 - 使用计算属性确保响应式更新
    buttonPermissions () {
      // 驳回按钮：自费、保险、内部结算类型，且状态为待收款
      const baseType = [StatementCheckoutTypeEnum.SELF_PAY, StatementCheckoutTypeEnum.INSURANCE, StatementCheckoutTypeEnum.INTERNAL_SETTLEMENT];
      const baseType2 = [StatementCheckoutTypeEnum.WARRANTY, StatementCheckoutTypeEnum.CONTRACT];
      const { statementType, statementStatus, isCheck, signGeneratedOn, signStatus } = this.form;
      return {
        // 权益核销：结算类型为自费/保险/内部结算，状态为待结算，商城订单不显示
        rights: baseType.includes(statementType) && statementStatus === 10 && !this.isStoreOrder,

        // 提交结算并签字：签字状态为未签字，且结算状态为待结算
        sign: statementStatus === 10 && !isCheck,

        // 驳回：结算类型为自费/保险/内部结算，且状态为待收款
        reject: baseType.includes(statementType) && statementStatus === 30,

        // 完成收款：结算类型为自费/保险/内部结算，状态为待收款
        success: baseType.includes(statementType) && statementStatus === 30,
        // 1）【结算单类型】为自费、保险、内部结算 且 【结算单状态】为【已收款】 且 该结算单未创建反结算申请，展示该按钮支持创建反结算；商城订单已收款超30天不显示
        reCreate: baseType.includes(statementType) && [40].includes(statementStatus),
        // 2）【结算单类型】为保修、合同 且 【结算单状态】为【待收款】、【已收款】且 该结算单未创建反结算申请 ，展示该按钮支持创建反结算；商城订单已收款超30天不显示
        reCreate1: baseType2.includes(statementType) && [40, 30].includes(statementStatus),
        // 添加收款记录：结算类型为自费/保险/内部结算，状态为待收款
        addRecord: baseType.includes(statementType) && statementStatus === 30,
        // 重推签字短信
        canResendSignSms: signStatus === 10 && signGeneratedOn,
      };
    },

    // 创建保修申请单 按钮权限
    canCreateWarrantyApply () {
      return [StatementCheckoutTypeEnum.WARRANTY, StatementCheckoutTypeEnum.CONTRACT].includes(this.form.statementType) && this.form.statementStatus === 30;
    },
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    },
    // 'form.serviceProxyId': {
    //   handler (val) {
    //     if (val) {
    //       this.checkCanCreate();
    //     }
    //   },
    //   immediate: true,
    // }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '结算单表管理',
      pageType: 'edit',

      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceStatement',
      loading: false,
      submitLoading: false,
      rightsDialogVisible: false,
      submitSettlemenDialogVisible: false,
      addPayrecordDialogVisible: false,
      refundLoading: false,
      tableData: [],
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },

      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // 创建保修申请单
      // canCreateWarrantyApply: false,
      warrantyApplyVisible: false,
    };
  },
  mounted () {
  },
  methods: {
    checkCanCreate () {
      checkCanCreate({
        statementId: this._id,
        serviceProxyId: this.form.serviceProxyId,
      }).then(res => {
        // 【结算单类型】为保修、合同 且 结算单状态为【待收款】
        this.canCreateWarrantyApply = res?.canCreate && [StatementCheckoutTypeEnum.WARRANTY, StatementCheckoutTypeEnum.CONTRACT].includes(this.form.statementType) && this.form.statementStatus === 30;
      });
    },
    showMsg (msg) {
      return new Promise((resolve) => {
        const message = `<div class="ais-leave-tips-main warn"><i class="iconfont icon-lxppc-prompt"></i>提醒</div><div class="ais-leave-tips-sub">${msg}</div>`;
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          customClass: 'ais-leave-tips',
          showClose: false
        }).then(() => {
          resolve(true);
        }).catch(() => {
          resolve(false);
        });
      });
    },
    goToServiceProxy (serviceProxyId) {
      if (serviceProxyId) {
        this.$router.push({
          path: '/maintain/sp/serviceProxy/edit',
          query: {
            id: serviceProxyId
          }
        });
      } else {
        this.$message.warning('未找到施工单ID');
      }
    },

    // 跳转到车辆档案详情
    goToVehicleProfile (vehProfileId) {
      if (vehProfileId) {
        this.$router.push({
          path: '/datacenter/vehicle/vehicleProfile/edit',
          query: {
            id: vehProfileId
          }
        });
      } else {
        this.$message.warning('未找到车辆档案ID');
      }
    },

    // 跳转到门店详情
    goToDealer (dealerId) {
      window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${this.form.dealerCode}`, '_blank');
    },

    rightsList () {
      this.rightsDialogVisible = true;
    },

    submitAndSing () {
      // 实现提交结算并签字功能
      this.$refs.settlemenDialogRef.open();
    },

    reject () {
      // 实现驳回功能
      this.showMsg('您确定要驳回吗？').then((result) => {
        if (result) {
          this.handleReject();
        }
      });
    },
    // 处理驳回逻辑
    async handleReject () {
      try {
        // 假设驳回接口为 rejectStatement
        await reject(this._id); // 需要引入相应的驳回API
        this.$message.success('驳回成功');
        // 刷新页面数据
        this.handleRefresh();
      } catch (error) {
        console.error('驳回失败:', error);
        this.$message.error('驳回失败');
      }
    },
    addInvoiceRecord () {
      // 实现添加收款记录功能
      this.addPayrecordDialogVisible = true;
    },

    paySuccess () {
      // 1. 验证金额一致性
      const invoiceRecords = this.form.invoiceRecordResps || [];
      const totalPayAmount = invoiceRecords.reduce((sum, record) => {
        return sum + (+record.payAmount || 0);
      }, 0);
      const payableAmount = +this.form.payableAmount || 0;
      if (totalPayAmount === 0 && payableAmount === 0) {
        // 直接执行收款完成
        this.confirmPaySuccess();
      } else if (totalPayAmount !== payableAmount) {
        // 金额不一致时提示错误
        this.$message.warning(
          `结账记录总金额${totalPayAmount.toFixed(2)}不等于结算单应付总金额${payableAmount.toFixed(2)}！`
        );
      } else {
        // 金额一致时弹出确认对话框
        this.confirmPaySuccess();
      }
    },
    // 确认收款完成
    confirmPaySuccess () {
      this.showMsg('您确定要收款完成吗？').then((result) => {
        if (result) {
          this.handlePaySuccess();
        }
      });
    },
    // 处理收款完成逻辑
    async handlePaySuccess () {
      try {
        // 调用收款完成API
        await receiptCompletion(this._id);

        this.$message.success('收款完成成功');

        // 刷新页面数据
        this.handleRefresh();
      } catch (error) {
        console.error('收款完成失败:', error);
        this.$message.error('收款失败');
      }
    },

    async createRefund () {
      if (this.isStoreOrder && this.isOverSettlement30Days) {
        this.$message.warning('结算超过30天的商城订单结算单不可以反结算，请知悉');
        return;
      }
      const result = await this.showMsg('确定要创建反结算申请？<br><strong style="color: var(--leap-color-danger);">该施工单对应的结算单均需反结算,才可回退施工单进行修改</strong>');
      if (result) {
        try {
          this.refundLoading = true;
          const response = await createCounterSettlement(this._id);

          // 由于 axios 封装层成功时直接返回 data 字段
          const restatementId = response;

          if (restatementId) {
            this.$message.success('反结算申请创建成功');
            // 跳转至反结算编辑页面
            this.$router.push({
              path: '/maintain/sp/restatement/edit',
              query: {
                id: restatementId
              }
            });
          } else {
            this.$message.warning('未找到反结算申请单 ID');
          }
        } catch (error) {
          if (error && error.data) {
            // 如果返回了反结算单ID,显示可点击的链接
            this.$alert(
              `<div style="margin-bottom: 10px;">${error.msg || '反结算申请创建失败'}</div>
               <div><a href="javascript:void(0)" style="color: #409EFF; cursor: pointer; text-decoration: underline;" id="restatementLink">去审核</a></div>`,
              '提示',
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                callback: () => {},
                customClass: 'restatement-fail-dialog'
              }
            );
            // 等待 DOM 更新后绑定点击事件
            this.$nextTick(() => {
              const link = document.getElementById('restatementLink');
              if (link) {
                link.onclick = () => {
                  // 先关闭弹窗
                  document.querySelector('.restatement-fail-dialog .el-message-box__headerbtn').click();
                  // 再跳转
                  this.$router.push({
                    path: '/maintain/sp/restatement/edit',
                    query: { id: error.data }
                  });
                };
              }
            });
          }
        } finally {
          this.refundLoading = false;
        }
      }
    },
    // 创建保修申请单
    createWarrantyApply () {
      this.warrantyApplyVisible = true;
    },

    logList () {
      // 实现审核日志功能
      this.$auditLog.show({ id: this._id });
      // 这里可以添加具体的审核日志跳转逻辑
    },

    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'ServiceStatement', // 必选，对应 ./template/文件名.vue
        title: `结算单：${this.form.code}`// 可选，打印标题
      });
    },
    handleRefresh () {
      // this.checkCanCreate();
      this.$refs.containerRef.handleRefresh();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form }).then(response => {
        // 提交成功后重新加载当前路由
        this.$router.go(0); // 或者使用 this.$router.replace(this.$route)
        return response;
      });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getDecryptField (id, field) {
      return getDecrypt(id, field);
    },
    handleResendSignSms () {
      const message = '此操作将再次推送短信给用户进行结算单签字，是否继续？';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false
      }).then(() => {
        // 调用接口
        // 假设接口参数为 id
        resendSignSms(this._id).then(res => {
          this.$message.success('推送成功');
          // 可选：刷新页面数据以更新最新状态
          this.detailRequest();
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
