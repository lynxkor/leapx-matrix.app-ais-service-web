<template>
  <edit-base-container
    ref="containerRef"
    :id="_id"
    :title="title"
    :isEditing.sync="isEditing"
    :form.sync="form"
    :originalForm.sync="originalForm"
    :submitRequest="submitRequest"
    :detailRequest="detailRequest"
  >
    <el-main>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="保修申请单号：" prop="applyNo">
              <el-input placeholder="" v-model="form.applyNo" clearable disabled />
            </el-form-item>
            <el-form-item label="接车施工单号：" prop="serviceProxyNo">
              <el-input placeholder="" v-model="form.serviceProxyNo" clearable disabled />
            </el-form-item>
            <el-form-item label="首次提交时间：" prop="firstSubmitTime">
              <el-date-picker
                disabled
                v-model="form.firstSubmitTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="保修单状态：" prop="applyStatusLabel">
              <el-input placeholder="" v-model="form.applyStatusLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="结算类型：" prop="checkoutTypeCode">
              <el-input placeholder="" v-model="form.checkoutTypeCode" clearable disabled />
            </el-form-item>
            <el-form-item label="结算单号：" prop="statementCode">
              <el-input placeholder="" v-model="form.statementCode" clearable disabled />
            </el-form-item>
            <el-form-item label="当前提交时间：" prop="currentSubmitTime">
              <el-date-picker
                disabled
                v-model="form.currentSubmitTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="旧件返还状态：" prop="returnPartsStatusLabel">
              <el-input placeholder="" v-model="form.returnPartsStatusLabel" clearable disabled />
            </el-form-item>
            <el-form-item label="保修类型：" prop="repairItemTypeName">
              <el-input placeholder="" v-model="form.repairItemTypeName" clearable disabled />
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-input placeholder="" v-model="form.dealerCode" clearable disabled />
            </el-form-item>
            <el-form-item label="审批时间：" prop="approvalTime">
              <el-date-picker
                v-model="form.approvalTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="预授权单：" prop="preAuthCode">
              <el-input placeholder="" v-model="form.preAuthCode" clearable disabled />
            </el-form-item>
            <el-form-item label="维修开始时间：" prop="repairStartTime">
              <el-date-picker
                v-model="form.repairStartTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              <el-input placeholder="" v-model="form.dealerName" clearable disabled />
            </el-form-item>
            <el-form-item label="审批说明：" prop="approvalRemark">
              <el-input placeholder="" v-model="form.approvalRemark" clearable disabled />
            </el-form-item>
            <el-form-item label="活动编码：" prop="serviceActivityCode">
              <el-input placeholder="" v-model="form.serviceActivityCode" clearable disabled />
            </el-form-item>
            <el-form-item label="维修结束时间：" prop="repairEndTime">
              <el-date-picker
                v-model="form.repairEndTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="门店所属区域：" prop="dealerRegionName">
              <el-input placeholder="" v-model="form.dealerRegionName" clearable disabled />
            </el-form-item>
            <el-form-item label="保修付款时间：" prop="paymentTime">
              <el-date-picker
                v-model="form.paymentTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="索赔追溯单：" prop="claimTrackNo">
              <el-input placeholder="" v-model="form.claimTrackNo" clearable disabled />
            </el-form-item>
          </el-form>
          <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="保修申请单号：" prop="applyNo">
              {{ form.applyNo }}
            </el-form-item>
            <el-form-item label="接车施工单号：" prop="serviceProxyNo">
              {{ form.serviceProxyNo }}
            </el-form-item>
            <el-form-item label="首次提交时间：" prop="firstSubmitTime">
              {{ form.firstSubmitTime }}
            </el-form-item>
            <el-form-item label="保修单状态：" prop="applyStatusLabel">
              {{ form.applyStatusLabel }}
            </el-form-item>
            <el-form-item label="结算类型：" prop="checkoutTypeCode">
              {{ form.checkoutTypeCode }}
            </el-form-item>
            <el-form-item label="结算单号：" prop="statementCode">
              {{ form.statementCode }}
            </el-form-item>
            <el-form-item label="当前提交时间：" prop="currentSubmitTime">
              {{ form.currentSubmitTime }}
            </el-form-item>
            <el-form-item label="旧件返还状态：" prop="returnPartsStatusLabel">
              {{ form.returnPartsStatusLabel }}
            </el-form-item>
            <el-form-item label="保修类型：" prop="repairItemTypeName">
              {{ form.repairItemTypeName }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ form.dealerCode }}
            </el-form-item>
            <el-form-item label="审批时间：" prop="approvalTime">
              {{ form.approvalTime }}
            </el-form-item>
            <el-form-item label="预授权单：" prop="preAuthCode">
              {{ form.preAuthCode }}
            </el-form-item>
            <el-form-item label="维修开始时间：" prop="repairStartTime">
              {{ form.repairStartTime }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ form.dealerName }}
            </el-form-item>
            <el-form-item label="审批说明：" prop="approvalRemark">
              {{ form.approvalRemark }}
            </el-form-item>
            <el-form-item label="活动编码：" prop="serviceActivityCode">
              {{ form.serviceActivityCode }}
            </el-form-item>
            <el-form-item label="维修结束时间：" prop="repairEndTime">
              {{ form.repairEndTime }}
            </el-form-item>
            <el-form-item label="门店所属区域：" prop="dealerRegionName">
              {{ form.dealerRegionName }}
            </el-form-item>
            <el-form-item label="保修付款时间：" prop="paymentTime">
              {{ form.paymentTime }}
            </el-form-item>
            <el-form-item label="索赔追溯单：" prop="claimTrackNo">
              {{ form.claimTrackNo }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </el-main>
  </edit-base-container>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
} from '@/api/claimreturn/claim/warrantyapply/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
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
  applyNo: '',
  serviceProxyId: '',
  serviceProxyNo: '',
  statementId: '',
  statementCode: '',
  checkoutTypeId: '',
  checkoutTypeCode: '',
  repairItemTypeId: '',
  repairItemTypeName: '',
  dealerCode: '',
  ownerOrgId: '',
  dealerName: '',
  dealerRegionName: '',
  dealerRegionCode: '',
  repairStartTime: '',
  repairEndTime: '',
  applyStatus: '',
  returnPartsStatus: '',
  isAutoAuditSet: '',
  isAutoAudited: '',
  autoAuditFailReason: '',
  preAuthId: '',
  preAuthCode: '',
  serviceActivityId: '',
  serviceActivityCode: '',
  serviceActivityName: '',
  schemeId: '',
  schemeName: '',
  firstSubmitTime: '',
  currentSubmitTime: '',
  currentSubmitterId: '',
  currentSubmitterName: '',
  approvalTime: '',
  approvalRemark: '',
  approverId: '',
  approverName: '',
  errorCodeId: '',
  errorContent: '',
  paymentTime: '',
  claimTrackId: '',
  claimTrackNo: '',
  vin: '',
  vehiclePlateNo: '',
  produceDate: '',
  vehicleProperty: '',
  vehicleModelId: '',
  vehicleModelName: '',
  warrantyStartdate: '',
  serviceMonth: '',
  alarmLevel: '',
  mileage: '',
  warrantyWarningMsg: '',
  isLifetimeWarrantyForecast: '',
  warrantyEnddateForecast: '',
  isLifetimeWarranty: '',
  ownerName: '',
  ownerPhone: '',
  shuttleName: '',
  shuttlePhone: '',
  qualityOrderReportId: '',
  qualityOrderReport: '',
  vfgId: '',
  vfgCode: '',
  vfgName: '',
  vrtId: '',
  vrtCode: '',
  vrtName: '',
  cccId: '',
  cccCode: '',
  cccName: '',
  faultPhenomenon: '',
  troubleshootingFlow: '',
  laborClaimTotal: '',
  workCostCount: '',
  laborShareRatio: '',
  approvedLaborClaimTotal: '',
  partsClaimTotal: '',
  partsCostTotal: '',
  partsShareRatio: '',
  approvedPartsClaimTotal: '',
  otherClaimTotal: '',
  otherCostTotal: '',
  otherShareRatio: '',
  approvedOtherClaimTotal: '',
  totalClaimAmount: '',
  totalCostAmount: '',
  platformApprovalNo: '',
  mainPartId: '',
  mainPartCode: '',
  mainPartName: '',
  mainPartSupplierId: '',
  mainPartSupplierCode: '',
  mainPartSupplierName: '',
  isPolicyLaborPrice: '',
  policyLaborPriceId: '',
  usedPolicyLaborQuota: '',
  standardLaborClaimTotal: '',
  standardLaborCostTotal: '',
  rejectApplyTime: '',
  rejectApplyRemark: '',
  qualityRejectType: '',
  qualityRejectApplyTime: '',
  qualityRejectApplyReason: '',
  qualityRejectApplierId: '',
  qualityRejectApplierName: '',
  qualityRejectStatus: '',
  qualityRejectHandlerRemark: '',
  qualityRejectHandlerTime: '',
  isWarrantyManagerApproval: '',
  isGeneralManagerApproval: '',
  warrantyAuditDetailId: '',
  cancelUserId: '',
  cancelUserName: '',
  cancelTime: '',
  cancelReason: '',
  dataSource: '',
};

export default {
  name: 'warrantyApplyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    // FetchSelect,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修申请单号：' + (this.form.applyNo || '新建');
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
      pageTitle: '保修申请单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR 根据实际情况修改
      moduleKey: 'AISCR-warrantyApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
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
      },
    };
  },
  mounted () {
  },
  methods: {
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
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>
