<template>
  <div class="page-common m-warranty-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <!-- 基础查询条件 -->
      <el-form-item label="保修申请单号：">
        <tag-input v-model="form.applyNoList" placeholder="请输入保修申请单号" />
      </el-form-item>
      <el-form-item label="VIN：">
        <tag-input v-model="form.vinList" placeholder="请输入VIN" />
      </el-form-item>

      <!-- 扩展查询条件 -->
      <template v-if="show">
      <el-form-item label="三包预警：">
        <fetch-select
          :request="fetchOptions"
          enumCode="alarm_level"
          v-model="form.alarmLevelList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="施工单号：">
        <tag-input v-model="form.serviceProxyNoList" placeholder="请输入施工单号" />
      </el-form-item>
      <el-form-item label="结算单号：">
        <tag-input v-model="form.statementCodeList" placeholder="请输入结算单号" />
      </el-form-item>
      <el-form-item label="保修单状态：">
        <fetch-select
          :request="fetchOptions"
          enumCode="claim_warranty_apply_status"
          v-model="form.applyStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="保修类型：">
        <fetch-select
          filterable
          clearable
          remote
          reserve-keyword
          multiple
          v-model="form.repairItemTypeIdList"
          :remote-method="repairItemTypeRemote"
          params=""
          value-key="id"
          label-key="name"
          sub-label-key="code"
        />
      </el-form-item>
      <el-form-item label="门店：">
        <dealer-select v-model="form.dealerCodeList" multiple/>
      </el-form-item>
      <el-form-item label="门店所属区域：">
        <fetch-select
          v-model="form.dealerRegionCodeList"
          :remote-method="getScopeTypeOrg"
          placeholder="请选择"
          clearable
          remote
          multiple
          filterable
          value-key="code"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="当前提交时间：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.currentSubmitTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="审批时间：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.approvalTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="车牌号：">
        <el-input v-model="form.vehiclePlateNo" placeholder="请输入车牌号" clearable />
      </el-form-item>
      <el-form-item label="车主姓名：">
        <el-input v-model="form.ownerName" placeholder="请输入车主姓名" clearable />
      </el-form-item>
      <el-form-item label="车型：">
        <fetch-select
          filterable
          clearable
          remote
          multiple
          v-model="form.vehicleModelIdList"
          :remote-method="modelSearch"
          params=""
          value-key="id"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="保修开始日期：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.warrantyStartdate"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="维修开始日期：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.repairStartTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="主因件编码：">
        <fetch-select
          filterable
          clearable
          remote
          multiple
          reserve-keyword
          v-model="form.mainPartCodeList"
          :remote-method="partRemote"
          value-key="partCode"
          label-key="partName"
          subLabelKey="partCode"
          placeholder="请输入零件编码/名称"
        />
      </el-form-item>
      <el-form-item label="服务月份：">
        <el-input v-model="form.serviceMonth" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="工时分担比例：">
        <el-input v-model="form.laborShareRatio" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="备件分担比例：">
        <el-input v-model="form.partsShareRatio" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="其他分担比例：">
        <el-input v-model="form.otherShareRatio" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="修改时间：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.updateTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="handleWithdraw">批量撤回</el-button>
      <el-button size="small" @click="handleReject">批量驳回</el-button>
      <el-button size="small" @click="handleApprove">批量同意</el-button>
      <el-button size="small" @click="handleCancel">批量作废</el-button>
      <el-button size="small" @click="handlePrint">打印标签</el-button>
    </div>
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="保修经理" name="manager" />
      <el-tab-pane label="总经理" name="gm" />
    </el-tabs>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        row-class-name="warranty-apply-table-row"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <RejectDialog
      :visible.sync="rejectDialogVisible"
      :rejectIds="rejectIds"
      @success="getData"
      :isApplyReject="isApplyReject"
    />
    <DenyDialog
      :visible.sync="denyDialogVisible"
      :denyIds="denyIds"
      @success="getData"
      />
    <ApproveDialog
      :visible.sync="approveDialogVisible"
      :approveIds="approveIds"
      @success="getData"
      />
    <CancelDialog
      :visible.sync="cancelDialogVisible"
      :cancelIds="cancelIds"
      @success="getData"
      />
    <WithdrawDialog
      :visible.sync="withdrawDialogVisible"
      :withdrawIds="withdrawIds"
      @success="getData"
      />
    <RightsDialog
      :visible.sync="rightsDialogVisible"
      :vehicleProfileId="vehicleProfileId"
      :id="rowId"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList,
  submit,
  withdraw,
  approve,
  batchCancel,
  getDetailDecryptField,
  print,
} from '@/api/claimreturn/claim/warrantyapply/index';
import {
  APPLY_STATUS,
  EDITABLE_STATUSES,
  PENDING_REVIEW_STATUSES,
  WITHDRAWABLE_STATUSES,
  validateBatchStatus,
} from './constants';
import {
  getTableConfig, tableAddOrUpdate, getEnum, listVehicleModel, getScopeTypeOrg,
  sparePartList, exportTable
} from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { downloadExcel } from '@/libs/utils';
import EditPage from './edit.vue';
import DealerSelect from '@/components/dealer-select';
import TagInput from '@/libs/components/TagInput';
import { getList as repairGetList } from '@/api/maintain/basic/repairItemType';
import RejectDialog from './RejectDialog/index.vue';
import DenyDialog from './DenyDialog/index.vue';
import RightsDialog from './RightsDialog/index.vue';
import ApproveDialog from './ApproveDialog/index.vue';
import CancelDialog from './CancelDialog/index.vue';
import WithdrawDialog from './WithdrawDialog/index.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  applyNo: '',
  vin: '',
  alarmLevel: '',
  serviceProxyNo: '',
  statementCode: '',
  applyStatus: '',
  repairItemTypeName: '',
  dealerCode: '',
  dealerName: '',
  dealerRegionName: '',
  currentSubmitTime: '',
  approvalTime: '',
  vehiclePlateNo: '',
  ownerName: '',
  vehicleModelName: '',
  warrantyStartdate: '',
  repairStartTime: '',
  mainPartCode: '',
  mainPartName: '',
  mainPartNameList: '',
  serviceMonth: '',
  laborShareRatio: '',
  partsShareRatio: '',
  otherShareRatio: '',
  createTime: '',
  updateTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    DealerSelect,
    TagInput,
    RejectDialog,
    DenyDialog,
    RightsDialog,
    ApproveDialog,
    CancelDialog,
    WithdrawDialog,
  },
  data () {
    return {
      pageTitle: '保修申请单',
      pageType: 'list',
      // TIPS: 权限前缀 AISCR，根据实际情况修改
      moduleKey: 'AISCR-warrantyApply',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      activeTab: 'all',
      clickItemId: '',
      //
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      //
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ],
      rejectDialogVisible: false,
      rejectIds: [],
      isApplyReject: false,
      //
      denyDialogVisible: false,
      denyIds: [],
      //
      approveDialogVisible: false,
      approveIds: [],
      cancelDialogVisible: false,
      cancelIds: [],
      withdrawDialogVisible: false,
      withdrawIds: [],
      //
      cancel: false,
      applyReject: false,
      withdraw: false,
      deny: false,
      reject: false,
      approve: false,
      submit: false,
      //
      rightsDialogVisible: false,
      vehicleProfileId: '',
      rowId: '',
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'warrantyApplyTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'alarmLevelLabel',
            label: '三包预警',
            visible: true,
            width: 200,
            // buttons: [{ type: 'primary' }],
          },
          {
            props: 'applyNo',
            label: '保修申请单',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyApply/edit',
                  query: {
                    id: row.id
                  }
                });
              }
            }]
          },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'vin'),
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/vehicleProfile/edit',
                  query: {
                    id: row.vehicleProfileId
                  }
                });
              }
            }]
          },
          {
            props: 'serviceProxyNo',
            label: '施工单',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: {
                    id: row.serviceProxyId
                  }
                });
              }
            }]
          },
          {
            props: 'statementCode',
            label: '结算单号',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceStatement/edit',
                  query: {
                    id: row.statementId
                  }
                });
              }
            }]
          },
          { props: 'applyStatusLabel', label: '保修单状态', visible: true, width: 120 },
          { props: 'repairItemTypeName', label: '保修类型', visible: true, width: 120 },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              }
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 140 },
          { props: 'dealerRegionName', label: '门店所属区域', visible: true, width: 140 },
          { props: 'currentSubmitTime', label: '当前提交时间', visible: true, width: 200 },
          { props: 'approvalTime', label: '审批时间', visible: true, width: 200 },
          { props: 'vehiclePlateNo', label: '车牌号', visible: true, width: 160, mask: true, getValue: (row) => getDetailDecryptField(row.id, 'vehiclePlateNo') },
          { props: 'ownerName', label: '车主姓名', visible: true, width: 120, mask: true, getValue: (row) => getDetailDecryptField(row.id, 'ownerName') },
          { props: 'vehicleModelName', label: '车型', visible: true, width: 180 },
          { props: 'warrantyStartdate', label: '保修开始日期', visible: true, width: 200 },
          { props: 'repairStartTime', label: '维修开始日期', visible: true, width: 200 },
          { props: 'mainPartCode', label: '主因件编码', visible: true, width: 200 },
          { props: 'mainPartName', label: '主因件名称', visible: true, width: 200 },
          { props: 'mileage', label: '进店里程 KM', visible: true, width: 160, align: 'right' },
          { props: 'serviceMonth', label: '服务月份', visible: true, width: 120, align: 'right' },
          { props: 'laborClaimTotal', label: '工时索赔小计', visible: true, width: 160, align: 'right' },
          { props: 'partsClaimTotal', label: '备件索赔小计', visible: true, width: 160, align: 'right' },
          { props: 'otherClaimTotal', label: '其他索赔小计', visible: true, width: 160, align: 'right' },
          { props: 'totalClaimAmount', label: '索赔总金额', visible: true, width: 160, align: 'right' },
          { props: 'workCostCount', label: '工时费用小计', visible: true, width: 160, align: 'right' },
          { props: 'partsCostTotal', label: '备件费用小计', visible: true, width: 160, align: 'right' },
          { props: 'otherCostTotal', label: '其他费用小计', visible: true, width: 160, align: 'right' },
          { props: 'laborShareRatio', label: '工时分担比例', visible: true, width: 160, align: 'right' },
          { props: 'partsShareRatio', label: '备件分担比例', visible: true, width: 160, align: 'right' },
          { props: 'otherShareRatio', label: '其他分担比例', visible: true, width: 160, align: 'right' },
          { props: 'faultPhenomenon', label: '故障信息描述', visible: true, width: 200 },
          { props: 'troubleshootingFlow', label: '故障流程排查', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [
              {
                name: '编辑 ',
                show: (row) => {
                  return row.applyStatus === '10' || row.applyStatus === '30';
                },
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/claimreturn/claim/warrantyapply/edit',
                    query: {
                      id: row.id,
                      isEditing: true
                    }
                  });
                },
                type: 'info'
              }, {
                name: '提交',
                // popconfirmTitle: '确认提交?',
                click: (rowIndex, row) => {
                  submit({
                    id: row.id,
                  }).then(res => {
                    this.$message.success('提交成功');
                    this.getData();
                  });
                },
                type: 'info',
                show: (row) => {
                  if (!this.submit) {
                    return false;
                  }
                  // 未提交，已驳回
                  if (EDITABLE_STATUSES.includes(row.applyStatus)) {
                    return true;
                  }
                  return false;
                },
              },
              {
                name: '同意',
                click: (rowIndex, row) => {
                  this.handleApprove([row.id]);
                },
                type: 'info',
                show: (row) => {
                  if (!this.approve) {
                    return false;
                  }
                  return this.isRowPendingCurrentUserReview(row);
                },
              },
              {
                name: '驳回',
                click: (rowIndex, row) => {
                  this.handleReject([row.id], false);
                },
                type: 'info',
                show: (row) => {
                  if (!this.reject) {
                    return false;
                  }
                  return this.isRowPendingCurrentUserReview(row);
                },
              },
              {
                name: '申请驳回',
                click: (rowIndex, row) => {
                  this.handleReject([row.id], true);
                },
                type: 'info',
                show: (row) => {
                  if (!this.applyReject) {
                    return false;
                  }
                  return this.isRowPendingCurrentUserReview(row) || row.applyStatus === APPLY_STATUS.APPROVED;
                },
              },
              {
                name: '撤回',
                click: (rowIndex, row) => {
                  this.handleWithdraw([row.id]);
                },
                type: 'info',
                show: (row) => {
                  if (!this.withdraw) {
                    return false;
                  }
                  // 【保修单状态】为审核通过，已拒赔 显示此按钮
                  if (WITHDRAWABLE_STATUSES.includes(row.applyStatus)) {
                    return true;
                  }
                  return false;
                },
              },
              {
                name: '拒赔',
                click: (rowIndex, row) => {
                  this.handleDeny([row.id]);
                },
                type: 'info',
                show: (row) => {
                  if (!this.deny) {
                    return false;
                  }
                  return this.isRowPendingCurrentUserReview(row);
                },
              },
              {
                name: '作废',
                click: (rowIndex, row) => {
                  this.handleCancel([row.id]);
                },
                type: 'info',
                show: (row) => {
                  if (!this.cancel) {
                    return false;
                  }
                  // 保修单状态】为未提交，已驳回，显示此按钮
                  if (EDITABLE_STATUSES.includes(row.applyStatus)) {
                    return true;
                  }
                  return false;
                },
              },
              {
                name: '打印标签',
                click: (rowIndex, row) => {
                  this.handlePrint([row.id]);
                },
                type: 'info',
              },
              {
                name: '查看权益',
                click: (rowIndex, row) => {
                  this.rightsDialogVisible = true;
                  this.vehicleProfileId = row.vehicleProfileId;
                  this.rowId = row.id;
                },
                type: 'info',
              },
            ]
          }
        ],
        total: this.tableTotal
      };
    },
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.cancel = this.permissions.has(`${this.moduleKey}-cancel`);
    this.applyReject = this.permissions.has(`${this.moduleKey}-applyReject`);
    this.withdraw = this.permissions.has(`${this.moduleKey}-withdraw`);
    this.deny = this.permissions.has(`${this.moduleKey}-deny`);
    this.reject = this.permissions.has(`${this.moduleKey}-reject`);
    this.approve = this.permissions.has(`${this.moduleKey}-approve`);
    this.submit = this.permissions.has(`${this.moduleKey}-submit`);
  },
  methods: {
    isRowPendingCurrentUserReview (row) {
      if (!row.isInApproval) return false;
      const list = row.currentApproverIdList?.map(id => Number(id));
      if (!list || list.length === 0) return true;
      const userId = this.$store.state.user.userInfo.userId;
      return list.includes(userId);
    },
    handlePrint (paramIds) {
      const isRow = Array.isArray(paramIds);
      if (!this.selectionList?.length && !isRow) {
        this.$message.warning('请选择打印数据');
        return;
      }
      print({
        ids: isRow ? paramIds : this.selectionList.map(item => item.id),
      }).then(res => {
        if (res && res.length > 0) {
          this.$print.show({
            id: new Date().getTime() + '',
            template: 'OldPartMark',
            title: '保修旧件标签',
            data: res,
            width: 1122,
            isWarrantyApply: true,
          });
        } else {
          this.$message.warning('未查询到打印数据');
        }
      });
    },
    // 排序
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleReject (paramIds, isApplyReject = false) {
      const isRow = Array.isArray(paramIds);
      if (!this.selectionList.length && !isRow) {
        this.$message({ type: 'warning', message: '请选择数据' });
        return;
      }
      if (!isRow) {
        const list = this.selectionList;
        const allowedStatuses = isApplyReject ? [...PENDING_REVIEW_STATUSES, APPLY_STATUS.APPROVED] : PENDING_REVIEW_STATUSES;
        const check = validateBatchStatus(list, allowedStatuses, '驳回');
        if (!check.valid) {
          this.$message.warning(check.message);
          return;
        }
      }
      const ids = isRow ? paramIds : this.selectionList.map(item => item.id);
      this.rejectIds = ids;
      this.rejectDialogVisible = true;
      this.isApplyReject = isApplyReject;
    },
    handleApprove (paramIds) {
      const isRow = Array.isArray(paramIds);
      if (!this.selectionList.length && !isRow) {
        this.$message({ type: 'warning', message: '请选择数据' });
        return;
      }
      if (!isRow) {
        const list = this.selectionList;
        const check = validateBatchStatus(list, PENDING_REVIEW_STATUSES, '审批');
        if (!check.valid) {
          this.$message.warning(check.message);
          return;
        }
      }
      const ids = isRow ? paramIds : this.selectionList.map(item => item.id);
      this.approveIds = ids;
      this.approveDialogVisible = true;
    },
    handleDeny (paramIds) {
      const isRow = Array.isArray(paramIds);
      if (!this.selectionList.length && !isRow) {
        this.$message({ type: 'warning', message: '请选择数据' });
        return;
      }
      if (!isRow) {
        const list = this.selectionList;
        const check = validateBatchStatus(list, PENDING_REVIEW_STATUSES, '拒赔');
        if (!check.valid) {
          this.$message.warning(check.message);
          return;
        }
      }
      const ids = isRow ? paramIds : this.selectionList.map(item => item.id);
      this.denyIds = ids;
      this.denyDialogVisible = true;
    },
    handleCancel (paramIds) {
      const isRow = Array.isArray(paramIds);
      if (!this.selectionList.length && !isRow) {
        this.$message({ type: 'warning', message: '请选择数据' });
        return;
      }
      if (!isRow) {
        const list = this.selectionList;
        const check = validateBatchStatus(list, EDITABLE_STATUSES, '作废');
        if (!check.valid) {
          this.$message.warning(check.message);
          return;
        }
      }
      const ids = isRow ? paramIds : this.selectionList.map(item => item.id);
      this.cancelIds = ids;
      this.cancelDialogVisible = true;
    },
    handleWithdraw (paramIds) {
      const isRow = Array.isArray(paramIds);
      if (!this.selectionList.length && !isRow) {
        this.$message({ type: 'warning', message: '请选择数据' });
        return;
      }
      if (!isRow) {
        const list = this.selectionList;
        const check = validateBatchStatus(list, WITHDRAWABLE_STATUSES, '撤回');
        if (!check.valid) {
          this.$message.warning(check.message);
          return;
        }
      }
      const ids = isRow ? paramIds : this.selectionList.map(item => item.id);
      this.withdrawIds = ids;
      this.withdrawDialogVisible = true;
    },
    handleAdd () {
      this.$router.push({
        path: '/claimreturn/claim/warrantyApply/edit'
      });
    },
    onSubmit () {
      this.tableForm.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.tableForm.page = 1;
      this.tableForm.pageSize = pageSize;
      this.getData();
    },
    handleTabChange () {
      this.tableForm.page = 1;
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size })
        .then(res => {
          this.tableDataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          console.log(this.tableDataList);
          this.tableTotal = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.tableForm.page = num;
      } else {
        this.tableForm.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      // 动态处理所有日期范围字段
      if (this.form.currentSubmitTime) {
        delete data.currentSubmitTime;
        if (this.form.currentSubmitTime.length > 1) {
          data.currentSubmitTimeStart = this.form.currentSubmitTime[0];
          data.currentSubmitTimeEnd = this.form.currentSubmitTime[1];
        }
      }
      if (this.form.approvalTime) {
        delete data.approvalTime;
        if (this.form.approvalTime.length > 1) {
          data.approvalTimeStart = this.form.approvalTime[0];
          data.approvalTimeEnd = this.form.approvalTime[1];
        }
      }
      if (this.form.warrantyStartdate) {
        delete data.warrantyStartdate;
        if (this.form.warrantyStartdate.length > 1) {
          data.warrantyStartdateStart = this.form.warrantyStartdate[0];
          data.warrantyStartdateEnd = this.form.warrantyStartdate[1];
        }
      }
      if (this.form.repairStartTime) {
        delete data.repairStartTime;
        if (this.form.repairStartTime.length > 1) {
          data.repairStartTimeStart = this.form.repairStartTime[0];
          data.repairStartTimeEnd = this.form.repairStartTime[1];
        }
      }
      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }

      if (data.serviceMonth) {
        data.serviceMonth = Number(data.serviceMonth);
      }

      // 排序字段
      data.sortColumns = this.sortColumns;

      // Tab 固定条件
      if (this.activeTab === 'manager') {
        data.isWarrantyManagerApproval = 1;
      } else if (this.activeTab === 'gm') {
        data.isGeneralManagerApproval = 1;
      }

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async modelSearch (query) {
      return listVehicleModel({ modelNameLike: query });
    },
    repairItemTypeRemote (query) {
      return new Promise((resolve, reject) => {
        repairGetList({
          nameLike: query,
          pageSize: 20,
          pageNum: 1,
          categorys: ['20'],
        }).then(res => {
          const data = res.records?.filter(item => ['保修', '合同'].includes(item.checkoutTypeName));
          resolve(data);
        }).catch(err => {
          console.error(err);
          resolve([]);
        });
      });
    },
    getScopeTypeOrg () {
      return getScopeTypeOrg({ type: '1020' });
    },
    partRemote (query) {
      return sparePartList({ partCodeOrNameLike: query, oemPart: 1 });
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '保修申请单',
        dataFetchPath: 'claimreturn/claim/web/warrantyapply/warrantyApply/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '保修申请单.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-warranty-apply-list {
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  .ais-table-c {
    height: calc(100% - 168px);
  }
}
</style>
