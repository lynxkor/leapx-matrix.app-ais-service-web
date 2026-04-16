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
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="保修审计单号：" prop="auditCode">
                  <el-input v-model="form.auditCode" disabled placeholder="系统自动生成" />
                </el-form-item>
                <el-form-item label="审计类型：" prop="auditType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="warranty_audit_type"
                    v-model="form.auditType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="审计单状态：" prop="auditStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="warranty_audit_status"
                    v-model="form.auditStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="保修审计主题：" prop="auditTheme">
                  <el-input v-model="form.auditTheme" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="审计开始日期：" prop="auditStartDate">
                  <el-date-picker
                    v-model="form.auditStartDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="提交截止日期：">
                  <el-input v-model="form.submitDeadline" disabled />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input v-model="form.dealerCode" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="审计专员1：" prop="auditor1Name">
                  <el-input v-model="form.auditor1Name" clearable placeholder="请输入" />
                </el-form-item>
                <!-- <el-form-item label="审计专员1签名：" prop="auditor1Sign">
                  <el-input v-model="form.auditor1Sign" clearable placeholder="请输入" />
                </el-form-item> -->
                <el-form-item label="计划扣款金额：">
                  <el-input v-model="form.planDeductAmount" disabled />
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-input v-model="form.dealerName" disabled />
                </el-form-item>
                <el-form-item label="审计专员2：" prop="auditor2Name">
                  <el-input v-model="form.auditor2Name" clearable placeholder="请输入" />
                </el-form-item>
                <!-- <el-form-item label="审计专员2签名：" prop="auditor2Sign">
                  <el-input v-model="form.auditor2Sign" clearable placeholder="请输入" />
                </el-form-item> -->
                <el-form-item label="已扣款金额：">
                  <el-input v-model="form.deductedAmount" disabled />
                </el-form-item>
                <el-form-item label="保修审批开始日期：" prop="warrantyApprovalStartDate">
                  <el-date-picker
                    v-model="form.warrantyApprovalStartDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="计划审计数量：" prop="planAuditCount">
                  <el-input-number v-model="form.planAuditCount" :min="1" :precision="0" controls-position="right" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="未扣款金额：">
                  <el-input v-model="form.undeductAmount" disabled />
                </el-form-item>
                <el-form-item label="保修审批结束日期：" prop="warrantyApprovalEndDate">
                  <el-date-picker
                    v-model="form.warrantyApprovalEndDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="实际审计数量：" prop="actualAuditCount">
                  <el-input-number v-model="form.actualAuditCount" :min="0" :precision="0" controls-position="right" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="保修审批区间金额：">
                  <el-input v-model="form.warrantyApprovalAmount" disabled />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="form.remark" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="审计明细总金额：">
                  <el-input v-model="form.auditDetailTotalAmount" disabled />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="保修审计单号：">{{ form.auditCode }}</el-form-item>
                <el-form-item label="审计类型：">{{ form.auditTypeLabel || form.auditType }}</el-form-item>
                <el-form-item label="审计单状态：">{{ form.auditStatusLabel || form.auditStatus }}</el-form-item>
                <el-form-item label="保修审计主题：">{{ form.auditTheme }}</el-form-item>
                <el-form-item label="审计开始日期：">{{ form.auditStartDate }}</el-form-item>
                <el-form-item label="提交截止日期：">{{ form.submitDeadline }}</el-form-item>
                <el-form-item label="门店编码：">{{ form.dealerCode }}</el-form-item>
                <el-form-item label="审计专员1：">{{ form.auditor1Name }}</el-form-item>
                <!-- <el-form-item label="审计专员1签名：">{{ form.auditor1Sign }}</el-form-item> -->
                <el-form-item label="计划扣款金额：">{{ form.planDeductAmount }}</el-form-item>
                <el-form-item label="门店名称：">{{ form.dealerName }}</el-form-item>
                <el-form-item label="审计专员2：">{{ form.auditor2Name }}</el-form-item>
                <!-- <el-form-item label="审计专员2签名：">{{ form.auditor2Sign }}</el-form-item> -->
                <el-form-item label="已扣款金额：">{{ form.deductedAmount }}</el-form-item>
                <el-form-item label="保修审批开始日期：">{{ form.warrantyApprovalStartDate }}</el-form-item>
                <el-form-item label="计划审计数量：">{{ form.planAuditCount }}</el-form-item>
                <el-form-item label="未扣款金额：">{{ form.undeductAmount }}</el-form-item>
                <el-form-item label="保修审批结束日期：">{{ form.warrantyApprovalEndDate }}</el-form-item>
                <el-form-item label="实际审计数量：">{{ form.actualAuditCount }}</el-form-item>
                <el-form-item label="保修审批区间金额：">{{ form.warrantyApprovalAmount }}</el-form-item>
                <el-form-item label="备注：">{{ form.remark }}</el-form-item>
                <el-form-item label="审计明细总金额：">{{ form.auditDetailTotalAmount }}</el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 门店人员信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>门店人员信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="法人：" prop="legalPerson">
                  <el-input v-model="form.legalPerson" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="服务店长：" prop="serviceManager">
                  <el-input v-model="form.serviceManager" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="保修经理：" prop="warrantyManager">
                  <el-input v-model="form.warrantyManager" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="投资人：" prop="investor">
                  <el-input v-model="form.investor" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="配件经理：" prop="partsManager">
                  <el-input v-model="form.partsManager" clearable placeholder="请输入" />
                </el-form-item>
                <el-form-item label="技术经理：" prop="techManager">
                  <el-input v-model="form.techManager" clearable placeholder="请输入" />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="法人：">{{ form.legalPerson }}</el-form-item>
                <el-form-item label="服务店长：">{{ form.serviceManager }}</el-form-item>
                <el-form-item label="保修经理：">{{ form.warrantyManager }}</el-form-item>
                <el-form-item label="投资人：">{{ form.investor }}</el-form-item>
                <el-form-item label="配件经理：">{{ form.partsManager }}</el-form-item>
                <el-form-item label="技术经理：">{{ form.techManager }}</el-form-item>
              </el-form>
            </div>
          </section>
          <search-add-table
            :_id="_id"
            :canAddOrUpdate="canAddOrUpdate"
            @data-change="() => {}"
            @checkboxChange="checkboxChange"
          />
        </el-main>
      </edit-base-container>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
} from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import SearchAddTable from './components/SearchAddTable';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  id: null,
  auditCode: '',
  auditTheme: '',
  dealerCode: '',
  dealerName: '',
  ownerOrgId: null,
  warrantyApprovalStartDate: '',
  warrantyApprovalEndDate: '',
  remark: '',
  auditType: '',
  auditTypeLabel: '',
  auditStartDate: '',
  auditor1Id: null,
  auditor1Name: '',
  auditor1Sign: '',
  auditor2Id: null,
  auditor2Name: '',
  auditor2Sign: '',
  planAuditCount: null,
  actualAuditCount: 0,
  auditStatus: '',
  auditStatusLabel: '',
  issuerId: null,
  issuerName: '',
  issueTime: '',
  summarySignTime: '',
  summarySignerId: null,
  summarySignerName: '',
  summarySignDesc: '',
  summaryApproverId: null,
  summaryApproverName: '',
  summaryApproveTime: '',
  summaryApproveDesc: '',
  rectifySignTime: '',
  rectifySignerId: null,
  rectifySignerName: '',
  rectifySignDesc: '',
  rectifyApproverId: null,
  rectifyApproverName: '',
  rectifyApproveTime: '',
  rectifyApproveDesc: '',
  submitDeadline: '',
  planDeductAmount: '',
  deductedAmount: '',
  undeductAmount: '',
  warrantyApprovalAmount: '',
  auditDetailTotalAmount: '',
  legalPerson: '',
  investor: '',
  serviceManager: '',
  partsManager: '',
  warrantyManager: '',
  techManager: '',
};

const AUDIT_TYPE_OPTIONS = [
  { label: '正式审计', value: '10' },
  { label: '跟进审计', value: '20' },
];

const AUDIT_STATUS_OPTIONS = [
  { label: '草稿', value: '10' },
  { label: '审计中', value: '20' },
  { label: '总结报告签署中', value: '30' },
  { label: '总结报告审批中', value: '40' },
  { label: '总结报告已驳回', value: '50' },
  { label: '整改报告签署中', value: '60' },
  { label: '整改报告审批中', value: '70' },
  { label: '整改报告已驳回', value: '80' },
  { label: '已完成', value: '90' },
];

export default {
  name: 'warrantyAuditEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    SearchAddTable,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修审计单：' + (this.form.auditCode || '');
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
      pageTitle: '保修审计发布',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantyAudit',
      loading: false,
      submitLoading: false,
      auditTypeOptions: AUDIT_TYPE_OPTIONS,
      auditStatusOptions: AUDIT_STATUS_OPTIONS,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        auditTheme: [
          { required: true, message: '请输入保修审计主题', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        warrantyApprovalStartDate: [
          { required: true, message: '请选择保修审批开始日期', trigger: 'change' }
        ],
        warrantyApprovalEndDate: [
          { required: true, message: '请选择保修审批结束日期', trigger: 'change' }
        ],
        auditType: [
          { required: true, message: '请选择审计类型', trigger: 'change' }
        ],
        auditStartDate: [
          { required: true, message: '请选择审计开始日期', trigger: 'change' }
        ],
        auditor1Name: [
          { required: true, message: '请输入审计专员1', trigger: 'blur' }
        ],
        auditor1Sign: [
          { required: true, message: '请输入审计专员1签名', trigger: 'blur' }
        ],
        planAuditCount: [
          { required: true, message: '请输入计划审计数量', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' }
        ],
        investor: [
          { required: true, message: '请输入投资人', trigger: 'blur' }
        ],
        serviceManager: [
          { required: true, message: '请输入服务店长', trigger: 'blur' }
        ],
        partsManager: [
          { required: true, message: '请输入配件经理', trigger: 'blur' }
        ],
        warrantyManager: [
          { required: true, message: '请输入保修经理', trigger: 'blur' }
        ],
        techManager: [
          { required: true, message: '请输入技术经理', trigger: 'blur' }
        ],
      },
      selectedRows: [],
    };
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
    getDefautlForm () {
      return { ...defaultForm };
    },
    checkboxChange (records) {
      this.selectedRows = records;
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
