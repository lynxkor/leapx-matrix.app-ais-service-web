<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"

        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >

        <template #extraButtons>

             <el-button size="small" @click="rightsList" v-if="showButton('rights')">权益列表</el-button>
              <el-button size="small" @click="submitAndSing"  v-if="showButton('sign')" >提交结算并签字</el-button>
          <el-button size="small" @click="reject" v-if="showButton(reject)" >驳回</el-button>
          <el-button size="small" @click="addInvoceRecord"  v-if="showButton('addRecord')" >添加收款记录</el-button>
          <el-button size="small" @click="paySuccess" v-if="showButton('success')" >完成收款</el-button>
          <el-button size="small" @click="createRefund" v-if="showButton('reCreate')">创建反结算单</el-button>
          <el-button size="small" @click="createWarrantyApply" v-if="showButton('createWarranty')">创建保修申请单</el-button>

          <el-button size="small">打印结算单</el-button>
          <el-button size="small" @click="logList">审核日志</el-button>
        </template>

 <div >
              <span class="label">结算单号：</span>
              <span class="value">{{ form.code }}</span>

              <span class="label">签字状态：</span>
              <span class="value">{{ form.singStatusLabel }}</span>

              <span class="label">结算单状态：</span>
              <span class="value">{{ form.statementStatusLabel }}</span>

              <span class="label">创建时间：</span>
              <span class="value">{{ form.createTime }}</span>
            </div>

        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form"   label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="结算单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                     disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                     disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算单类型：" prop="statementType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementType"
                    placeholder="请选择"
                     disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="结算单状态：" prop="statementStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementStatus"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyCode"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保修类型（汇总）：" prop="warrantyTypeCollect">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.warrantyTypeCollect"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销账标识：" prop="accountType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.accountType"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehProfileVin"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项目金额：" prop="repairItemAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项优惠金额：" prop="repairItemDiscount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemDiscount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项应付金额：" prop="repairItemPayableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemPayableAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件金额：" prop="partAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件优惠金额：" prop="partDiscount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partDiscount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件应付金额：" prop="partPayableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partPayableAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益金额：" prop="rightsAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rightsAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.discountAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="去零金额：" prop="noFractionAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.noFractionAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实际应付总金额：" prop="payableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payableAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="剩余应付款金额：" prop="remainAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remainAmount"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下次保养里程：" prop="nextMaintenanceMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.nextMaintenanceMileage"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下次保养时间：" prop="nextMaintenanceTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.nextMaintenanceTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>

                <el-form-item label="结算人员：" prop="statementPersonName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementPersonName"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.statementTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementTime"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="收款人：" prop="payeeName">
                  <el-input
                    placeholder="请输入"
                    disabled
                    v-model="form.payeeName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收款时间：" prop="receiveTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.receiveTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    disabled
                  />
                </el-form-item>

                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="是否已推送满意度：" prop="isPushVisitResult">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isPushVisitResult"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车施工单id：" prop="serviceProxyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyId"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID）：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车档案id：" prop="vehProfileId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehProfileId"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="支付方式：" prop="payType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.payType"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="负责人：" prop="serviceOwnerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceOwnerId"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="签字渠道：" prop="signChannel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.signChannel"
                    disabled
                    clearable
                  />
                </el-form-item>

                <el-form-item label="收款人id：" prop="payeeId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payeeId"
                    disabled
                    clearable
                  />
                </el-form-item>

              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
                                  <a href="#" @click.prevent="goToServiceProxy(form.serviceProxyId)">{{ form.serviceProxyCode }}</a>

                                                 </el-form-item>
                   <el-form-item label="销账标识：" prop="accountTypeLabel">
                                    {{ form.accountTypeLabel }}
                                  </el-form-item>
                                  <el-form-item label="是否已创建反结算：" prop="createReStatementLabel">
                                   {{ form.createReStatementLabel }}
                                                  </el-form-item>
                     <el-form-item label="门店名称：" prop="dealerName">
                       <a href="#" @click.prevent="goToDealer(form.dealerId)">{{ form.dealerName }}</a>
                                  </el-form-item>
                       <el-form-item label="VIN码：" prop="vehProfileVin">
                        <a href="#" @click.prevent="goToVehicleProfile(form.vehProfileId)">{{ form.vehProfileVin }}</a>

                                     </el-form-item>
                <el-form-item label="数据来源：" prop="dataSourceLabel">
                  {{ form.dataSourceLabel }}
                </el-form-item>
  <el-form-item label="负责人：" prop="serviceOwnerId">
                  {{ form.serviceOwnerId }}
                </el-form-item>
       <el-form-item label="支付方式：" prop="payTypeLabel">
                       {{ form.payTypeLabel }}
                     </el-form-item>

                <el-form-item label="保修类型（汇总）：" prop="warrantyTypeCollect">
                  {{ form.warrantyTypeCollect }}
                </el-form-item>
                <el-form-item label="下次保养时间：" prop="nextMaintenanceTime">
                                                 {{ form.nextMaintenanceTime }}
                                               </el-form-item>
                <el-form-item label="下次保养里程：" prop="nextMaintenanceMileage">
                                 {{ form.nextMaintenanceMileage }}
                               </el-form-item>

      <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                    <el-form-item label="总金额：" prop="totalAmount">
                                  {{ form.totalAmount }}
                                </el-form-item>

                <el-form-item label="维修项优惠金额：" prop="repairItemDiscount">
                  {{ form.repairItemDiscount }}
                </el-form-item>
                 <el-form-item label="结算人员：" prop="statementPersonName">
                                  {{ form.statementPersonName }}
                                </el-form-item>
        <el-form-item label="去零金额：" prop="noFractionAmount">
                        {{ form.noFractionAmount }}
                      </el-form-item>
                <el-form-item label="维修项优惠金额：" prop="repairItemPayableAmount">
                  {{ form.repairItemPayableAmount }}
                </el-form-item>
                 <el-form-item label="结算时间：" prop="statementTime">
                                  {{ form.statementTime }}
                                </el-form-item>
                     <el-form-item label="权益金额：" prop="rightsAmount">
                                   {{ form.rightsAmount }}
                                 </el-form-item>
                  <el-form-item label="维修项目应付金额：" prop="repairItemAmount">
                                   {{ form.repairItemAmount }}
                                 </el-form-item>
                  <el-form-item label="收款人：" prop="payeeName">
                                  {{ form.payeeName }}
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
                  <el-form-item label="剩余应付款金额：" prop="remainAmount">
                                  {{ form.remainAmount }}
                                </el-form-item>
                <el-form-item label="零件应付金额：" prop="partPayableAmount">
                  {{ form.partPayableAmount }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section"  v-show="!(isEditing || !_id)">
              <IghtsRecord :formData="form"/>
              <MaintenanceRecord :formData="form"/>
              <PartsRecodr :formData="form"/>
              <PayRecord :formData="form"/>
              <RepaireRecord :formData="form"/>

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
import { getDetail, addOrUpdate } from '@/api/maintain/sp/serviceStatement/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';

import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import RepaireRecord from '@/views/maintain/sp/serviceStatement/components/RepaireRecord/index.vue';
import IghtsRecord from '@/views/maintain/sp/serviceStatement/components/IghtsUsageRecord/index.vue';
import MaintenanceRecord from '@/views/maintain/sp/serviceStatement/components/PartMaintenanceRecord/index.vue';
import PartsRecodr from '@/views/maintain/sp/serviceStatement/components/PartsRecord/index.vue';
import PayRecord from '@/views/maintain/sp/serviceStatement/components/PayRecord/index.vue';

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
  partMaintenanceResps: []
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
    EditTable,
    FetchSelect,
    RepaireRecord,
    IghtsRecord,
    MaintenanceRecord,
    PartsRecodr,
    PayRecord,

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
      pageTitle: '结算单表管理',
      pageType: 'edit',

      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceStatement',
      loading: false,
      submitLoading: false,
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

    };
  },
  mounted () {
  },
  methods: {
    showButton (type) {
      switch (type) {
        case 'reject':
        // 驳回按钮：自费、保险、内部结算类型，且状态为待收款
          const validTypesForReject = [30, 40, 50]; // 自费=30,保险=40,内部结算=50 (根据实际枚举值调整)
          const validStatusForReject = [20]; // 待收款状态码 (根据实际状态码调整)
          const isValidTypeForReject = validTypesForReject.includes(this.form.statementType);
          const isValidStatusForReject = validStatusForReject.includes(this.form.statementStatus);
          return isValidTypeForReject && isValidStatusForReject;

        case 'sign':
        // 结算并签字：签字状态为未签字，且结算状态为待结算
          const needSign = !this.form.signStatus || this.form.signStatus === 0; // 未签字状态
          const pendingSettlement = this.form.statementStatus === 10; // 待结算状态
          return needSign && pendingSettlement;

        case 'success':
        // 收款成功：结算类型为自费/保险/内部结算，状态为待收款
          const validTypesForPayment = [30, 40, 50];
          const isPendingPayment = this.form.statementStatus === 20; // 待收款状态
          const isValidTypeForPayment = validTypesForPayment.includes(this.form.statementType);
          return isValidTypeForPayment && isPendingPayment;

        case 'reCreate':
        // 反结算：结算类型为自费/保险/内部结算，状态为待结算/待收款
          const validTypesForRefund = [30, 40, 50];
          const validStatusForRefund = [10, 20]; // 待结算/待收款
          const isValidTypeForRefund = validTypesForRefund.includes(this.form.statementType);
          const isValidStatusForRefund = validStatusForRefund.includes(this.form.statementStatus);
          return isValidTypeForRefund && isValidStatusForRefund;

        case 'addRecord':
        // 收款记录：结算类型为自费/保险/内部结算，状态为待收款
          const validTypesForRecord = [30, 40, 50];
          const isValidTypeForRecord = validTypesForRecord.includes(this.form.statementType);
          const isPendingPaymentRecord = this.form.statementStatus === 20; // 待收款状态
          return isValidTypeForRecord && isPendingPaymentRecord;

        case 'createWarranty':
        // 创建保单：结算类型为自费/保险，状态为已完成
          const validTypesForWarranty = [30, 40]; // 自费/保险
          const isCompletedStatus = this.form.statementStatus === 30; // 已完成状态
          const isValidTypeForWarranty = validTypesForWarranty.includes(this.form.statementType);
          return isValidTypeForWarranty && isCompletedStatus;

        case 'rights':
        // 权益列表：结算类型为自费/保险/内部结算，状态为待结算
          const validTypesForRights = [30, 40, 50];
          const isValidTypeForRights = validTypesForRights.includes(this.form.statementType);
          const isPendingRights = this.form.statementStatus === 10; // 待结算状态
          return isValidTypeForRights && isPendingRights;

        default:
          return false;
      }
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
          path: '/vehicle/profile/detail',
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
      if (dealerId) {
        this.$router.push({
          path: '/dealer/detail',
          query: {
            id: dealerId
          }
        });
      } else {
        this.$message.warning('未找到门店ID');
      }
    },

    rightsList () {
      // 实现权益列表功能
      console.log('权益列表');
      // 这里可以添加具体的权益列表跳转逻辑
    },

    submitAndSing () {
      // 实现提交结算并签字功能
      console.log('提交结算并签字');
      // 这里可以添加具体的提交结算并签字逻辑
    },

    reject () {
      // 实现驳回功能
      console.log('驳回');
      // 这里可以添加具体的驳回逻辑
    },

    addInvoceRecord () {
      // 实现添加收款记录功能
      console.log('添加收款记录');
      // 这里可以添加具体的添加收款记录逻辑
    },

    paySuccess () {
      // 实现完成收款功能
      console.log('完成收款');
      // 这里可以添加具体的完成收款逻辑
    },

    createRefund () {
      // 实现创建反结算单功能
      console.log('创建反结算单');
      // 这里可以添加具体的创建反结算单逻辑
    },

    createWarrantyApply () {
      // 实现创建保修申请单功能
      console.log('创建保修申请单');
      // 这里可以添加具体的创建保修申请单逻辑
    },

    logList () {
      // 实现审核日志功能
      console.log('审核日志');
      // 这里可以添加具体的审核日志跳转逻辑
    },

    handleRefresh () {
      this.detailRequest();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
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
    }
  }
};
</script>
