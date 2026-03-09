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
                <el-form-item label="内部领料单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
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
                <el-form-item label="备件仓库ID：" prop="warehouseId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warehouseId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单状态:草稿，领料审批中，领料驳回，领料同意，退料审批中，退料驳回，退料同意：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="入库状态:未入库，已入库：" prop="inboundStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.inboundStatus"
                    placeholder="请选择"
                    clearable
                    filterable
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
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
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
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店组织id：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库状态:未出库，已出库：" prop="outboundStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.outboundStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="领料申请人：" prop="requester">
                  <el-input
                    placeholder="请输入"
                    v-model="form.requester"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="领料申请人名称：" prop="requesterName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.requesterName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="领料申请时间：" prop="requestTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.requestTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="领料申请说明：" prop="requestDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.requestDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="领料审批人：" prop="approver">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approver"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="领料审批人名称：" prop="approverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="领料审批时间：" prop="approvalTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.approvalTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="领料审批说明：" prop="approvalDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approvalDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.outboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="退料申请人：" prop="returnRequester">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnRequester"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退料申请人名称：" prop="returnRequesterName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnRequesterName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退料申请时间：" prop="returnRequestTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.returnRequestTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="退料申请说明：" prop="returnRequestDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnRequestDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退料审批人：" prop="returnApprover">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnApprover"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退料审批人名称：" prop="returnApproverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnApproverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退料审批时间：" prop="returnApprovalTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.returnApprovalTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="退料审批说明：" prop="returnApprovalDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnApprovalDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作人名称：" prop="inboundOperatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundOperatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.inboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="内部领料单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库ID：" prop="warehouseId">
                  {{ form.warehouseId }}
                </el-form-item>
                <el-form-item label="订单状态:草稿，领料审批中，领料驳回，领料同意，退料审批中，退料驳回，退料同意：" prop="orderStatus">
                  {{ form.orderStatus }}
                </el-form-item>
                <el-form-item label="入库状态:未入库，已入库：" prop="inboundStatus">
                  {{ form.inboundStatus }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
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
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="门店组织id：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="出库状态:未出库，已出库：" prop="outboundStatus">
                  {{ form.outboundStatus }}
                </el-form-item>
                <el-form-item label="领料申请人：" prop="requester">
                  {{ form.requester }}
                </el-form-item>
                <el-form-item label="领料申请人名称：" prop="requesterName">
                  {{ form.requesterName }}
                </el-form-item>
                <el-form-item label="领料申请时间：" prop="requestTime">
                  {{ form.requestTime }}
                </el-form-item>
                <el-form-item label="领料申请说明：" prop="requestDescription">
                  {{ form.requestDescription }}
                </el-form-item>
                <el-form-item label="领料审批人：" prop="approver">
                  {{ form.approver }}
                </el-form-item>
                <el-form-item label="领料审批人名称：" prop="approverName">
                  {{ form.approverName }}
                </el-form-item>
                <el-form-item label="领料审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="领料审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperator">
                  {{ form.outboundOperator }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="退料申请人：" prop="returnRequester">
                  {{ form.returnRequester }}
                </el-form-item>
                <el-form-item label="退料申请人名称：" prop="returnRequesterName">
                  {{ form.returnRequesterName }}
                </el-form-item>
                <el-form-item label="退料申请时间：" prop="returnRequestTime">
                  {{ form.returnRequestTime }}
                </el-form-item>
                <el-form-item label="退料申请说明：" prop="returnRequestDescription">
                  {{ form.returnRequestDescription }}
                </el-form-item>
                <el-form-item label="退料审批人：" prop="returnApprover">
                  {{ form.returnApprover }}
                </el-form-item>
                <el-form-item label="退料审批人名称：" prop="returnApproverName">
                  {{ form.returnApproverName }}
                </el-form-item>
                <el-form-item label="退料审批时间：" prop="returnApprovalTime">
                  {{ form.returnApprovalTime }}
                </el-form-item>
                <el-form-item label="退料审批说明：" prop="returnApprovalDescription">
                  {{ form.returnApprovalDescription }}
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperator">
                  {{ form.inboundOperator }}
                </el-form-item>
                <el-form-item label="入库操作人名称：" prop="inboundOperatorName">
                  {{ form.inboundOperatorName }}
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  {{ form.inboundTime }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/outbound/dealerOutboundOrder/index';
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
  code: '',
  dealerCode: '',
  dealerName: '',
  warehouseId: '',
  orderStatus: '',
  inboundStatus: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  ownerOrgId: '',
  outboundStatus: '',
  requester: '',
  requesterName: '',
  requestTime: '',
  requestDescription: '',
  approver: '',
  approverName: '',
  approvalTime: '',
  approvalDescription: '',
  outboundOperator: '',
  outboundTime: '',
  returnRequester: '',
  returnRequesterName: '',
  returnRequestTime: '',
  returnRequestDescription: '',
  returnApprover: '',
  returnApproverName: '',
  returnApprovalTime: '',
  returnApprovalDescription: '',
  inboundOperator: '',
  inboundOperatorName: '',
  inboundTime: '',
};

export default {
  name: 'dealerOutboundOrderEdit',
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
      return '内部领料单号：' + this.form.code;
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
      pageTitle: '内部领料申请',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-dealerOutboundOrder',
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
        code: [
          { required: true, message: '请输入内部领料单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '请输入备件仓库ID', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择订单状态:草稿，领料审批中，领料驳回，领料同意，退料审批中，退料驳回，退料同意', trigger: 'change' }
        ],
        inboundStatus: [
          { required: true, message: '请选择入库状态:未入库，已入库', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
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
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入门店组织id', trigger: 'change' }
        ],
        outboundStatus: [
          { required: true, message: '请选择出库状态:未出库，已出库', trigger: 'change' }
        ],
        requester: [
          { required: true, message: '请输入领料申请人', trigger: 'change' }
        ],
        requesterName: [
          { required: true, message: '请输入领料申请人名称', trigger: 'change' }
        ],
        requestTime: [
          { required: true, message: '请选择领料申请时间', trigger: 'change' }
        ],
        requestDescription: [
          { required: true, message: '请输入领料申请说明', trigger: 'change' }
        ],
        approver: [
          { required: true, message: '请输入领料审批人', trigger: 'change' }
        ],
        approverName: [
          { required: true, message: '请输入领料审批人名称', trigger: 'change' }
        ],
        approvalTime: [
          { required: true, message: '请选择领料审批时间', trigger: 'change' }
        ],
        approvalDescription: [
          { required: true, message: '请输入领料审批说明', trigger: 'change' }
        ],
        outboundOperator: [
          { required: true, message: '请输入出库操作人', trigger: 'change' }
        ],
        outboundTime: [
          { required: true, message: '请选择出库操作时间', trigger: 'change' }
        ],
        returnRequester: [
          { required: true, message: '请输入退料申请人', trigger: 'change' }
        ],
        returnRequesterName: [
          { required: true, message: '请输入退料申请人名称', trigger: 'change' }
        ],
        returnRequestTime: [
          { required: true, message: '请选择退料申请时间', trigger: 'change' }
        ],
        returnRequestDescription: [
          { required: true, message: '请输入退料申请说明', trigger: 'change' }
        ],
        returnApprover: [
          { required: true, message: '请输入退料审批人', trigger: 'change' }
        ],
        returnApproverName: [
          { required: true, message: '请输入退料审批人名称', trigger: 'change' }
        ],
        returnApprovalTime: [
          { required: true, message: '请选择退料审批时间', trigger: 'change' }
        ],
        returnApprovalDescription: [
          { required: true, message: '请输入退料审批说明', trigger: 'change' }
        ],
        inboundOperator: [
          { required: true, message: '请输入入库操作人', trigger: 'change' }
        ],
        inboundOperatorName: [
          { required: true, message: '请输入入库操作人名称', trigger: 'change' }
        ],
        inboundTime: [
          { required: true, message: '请选择入库操作时间', trigger: 'change' }
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
