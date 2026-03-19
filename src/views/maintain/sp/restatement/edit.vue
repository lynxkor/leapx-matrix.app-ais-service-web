<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
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
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="结算单编码：" prop="statementCode">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementCode"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="反结算申请编号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销账标识：" prop="accountType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.accountType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="审核状态：" prop="approvalStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.approvalStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="保修提交状态：" prop="clmStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.clmStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保养项：" prop="maintenanceId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.maintenanceId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="去零金额：" prop="noFractionAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.noFractionAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="原因说明：" prop="reason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="剩余应付款金额：" prop="remainAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remainAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车施工单id：" prop="serviceProxyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算人员ID：" prop="statementPersonId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementPersonId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="结算单id：" prop="statementId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="结算单类型：" prop="statementType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementType"
                    placeholder="请选择"
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
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项目金额：" prop="repairItemAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项优惠金额：" prop="repairItemDiscount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemDiscount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项应付金额：" prop="repairItemPayableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemPayableAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件金额：" prop="partAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件优惠金额：" prop="partDiscount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partDiscount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件应付金额：" prop="partPayableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partPayableAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.discountAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益金额：" prop="rightsAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rightsAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实际应付总金额：" prop="payableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payableAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算人员：" prop="statementPersonName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementPersonName"
                    placeholder="请选择"
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
                  />
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementTime"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="收款人：" prop="payeeId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payeeId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收款时间：" prop="receiveAt">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.receiveAt"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
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
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="结算单编码：" prop="statementCode">
                  {{ form.statementCode }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  {{ form.serviceProxyCode }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="反结算申请编号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="销账标识：" prop="accountType">
                  {{ form.accountType }}
                </el-form-item>
                <el-form-item label="审核状态：" prop="approvalStatus">
                  {{ form.approvalStatus }}
                </el-form-item>
                <el-form-item label="保修提交状态：" prop="clmStatus">
                  {{ form.clmStatus }}
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="保养项：" prop="maintenanceId">
                  {{ form.maintenanceId }}
                </el-form-item>
                <el-form-item label="去零金额：" prop="noFractionAmount">
                  {{ form.noFractionAmount }}
                </el-form-item>
                <el-form-item label="原因说明：" prop="reason">
                  {{ form.reason }}
                </el-form-item>
                <el-form-item label="剩余应付款金额：" prop="remainAmount">
                  {{ form.remainAmount }}
                </el-form-item>
                <el-form-item label="接车施工单id：" prop="serviceProxyId">
                  {{ form.serviceProxyId }}
                </el-form-item>
                <el-form-item label="结算人员ID：" prop="statementPersonId">
                  {{ form.statementPersonId }}
                </el-form-item>
                <el-form-item label="结算单id：" prop="statementId">
                  {{ form.statementId }}
                </el-form-item>
                <el-form-item label="结算单类型：" prop="statementType">
                  {{ form.statementType }}
                </el-form-item>
                <el-form-item label="结算单状态：" prop="statementStatus">
                  {{ form.statementStatus }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="维修项目金额：" prop="repairItemAmount">
                  {{ form.repairItemAmount }}
                </el-form-item>
                <el-form-item label="维修项优惠金额：" prop="repairItemDiscount">
                  {{ form.repairItemDiscount }}
                </el-form-item>
                <el-form-item label="维修项应付金额：" prop="repairItemPayableAmount">
                  {{ form.repairItemPayableAmount }}
                </el-form-item>
                <el-form-item label="零件金额：" prop="partAmount">
                  {{ form.partAmount }}
                </el-form-item>
                <el-form-item label="零件优惠金额：" prop="partDiscount">
                  {{ form.partDiscount }}
                </el-form-item>
                <el-form-item label="零件应付金额：" prop="partPayableAmount">
                  {{ form.partPayableAmount }}
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountAmount">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="权益金额：" prop="rightsAmount">
                  {{ form.rightsAmount }}
                </el-form-item>
                <el-form-item label="实际应付总金额：" prop="payableAmount">
                  {{ form.payableAmount }}
                </el-form-item>
                <el-form-item label="结算人员：" prop="statementPersonName">
                  {{ form.statementPersonName }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  {{ form.statementTime }}
                </el-form-item>
                <el-form-item label="收款人：" prop="payeeId">
                  {{ form.payeeId }}
                </el-form-item>
                <el-form-item label="收款时间：" prop="receiveAt">
                  {{ form.receiveAt }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
              </div>
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
import { getDetail, addOrUpdate } from '@/api/maintain/sp/restatement/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  statementCode: '',
  serviceProxyCode: '',
  id: '',
  creator: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  code: '',
  accountType: '',
  approvalStatus: '',
  clmStatus: '',
  ownerOrgId: '',
  dealerCode: '',
  dealerName: '',
  maintenanceId: '',
  noFractionAmount: '',
  reason: '',
  remainAmount: '',
  serviceProxyId: '',
  statementPersonId: '',
  statementId: '',
  statementType: '',
  statementStatus: '',
  dataSource: '',
  repairItemAmount: '',
  repairItemDiscount: '',
  repairItemPayableAmount: '',
  partAmount: '',
  partDiscount: '',
  partPayableAmount: '',
  totalAmount: '',
  discountAmount: '',
  rightsAmount: '',
  payableAmount: '',
  statementPersonName: '',
  statementTime: '',
  payeeId: '',
  receiveAt: '',
  creatorName: '',
  createTime: '',
};

export default {
  name: 'restatementEdit',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '结算单编码：' + this.form.statementCode;
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
      pageTitle: '反结算申请单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-restatement',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        statementCode: [
          { required: true, message: '请选择结算单编码', trigger: 'change' }
        ],
        serviceProxyCode: [
          { required: true, message: '请输入接车施工单', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入反结算申请编号', trigger: 'change' }
        ],
        accountType: [
          { required: true, message: '请选择销账标识', trigger: 'change' }
        ],
        approvalStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        clmStatus: [
          { required: true, message: '请选择保修提交状态', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        maintenanceId: [
          { required: true, message: '请输入保养项', trigger: 'change' }
        ],
        noFractionAmount: [
          { required: true, message: '请输入去零金额', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入原因说明', trigger: 'change' }
        ],
        remainAmount: [
          { required: true, message: '请输入剩余应付款金额', trigger: 'change' }
        ],
        serviceProxyId: [
          { required: true, message: '请输入接车施工单id', trigger: 'change' }
        ],
        statementPersonId: [
          { required: true, message: '请选择结算人员ID', trigger: 'change' }
        ],
        statementId: [
          { required: true, message: '请选择结算单id', trigger: 'change' }
        ],
        statementType: [
          { required: true, message: '请选择结算单类型', trigger: 'change' }
        ],
        statementStatus: [
          { required: true, message: '请选择结算单状态', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源', trigger: 'change' }
        ],
        repairItemAmount: [
          { required: true, message: '请输入维修项目金额', trigger: 'change' }
        ],
        repairItemDiscount: [
          { required: true, message: '请输入维修项优惠金额', trigger: 'change' }
        ],
        repairItemPayableAmount: [
          { required: true, message: '请输入维修项应付金额', trigger: 'change' }
        ],
        partAmount: [
          { required: true, message: '请输入零件金额', trigger: 'change' }
        ],
        partDiscount: [
          { required: true, message: '请输入零件优惠金额', trigger: 'change' }
        ],
        partPayableAmount: [
          { required: true, message: '请输入零件应付金额', trigger: 'change' }
        ],
        totalAmount: [
          { required: true, message: '请输入总金额', trigger: 'change' }
        ],
        discountAmount: [
          { required: true, message: '请输入优惠总金额', trigger: 'change' }
        ],
        rightsAmount: [
          { required: true, message: '请输入权益金额', trigger: 'change' }
        ],
        payableAmount: [
          { required: true, message: '请输入实际应付总金额', trigger: 'change' }
        ],
        statementPersonName: [
          { required: true, message: '请选择结算人员', trigger: 'change' }
        ],
        statementTime: [
          { required: true, message: '请选择结算时间', trigger: 'change' }
        ],
        statementTime: [
          { required: true, message: '请选择结算时间', trigger: 'change' }
        ],
        payeeId: [
          { required: true, message: '请输入收款人', trigger: 'change' }
        ],
        receiveAt: [
          { required: true, message: '请选择收款时间', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
      }
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
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
