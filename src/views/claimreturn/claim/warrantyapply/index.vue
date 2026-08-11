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
          :key="regionSelectKey"
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
      <el-form-item :label="activeTab === 'approval' ? '最终审批时间：' : '审批时间：'">
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
      <el-form-item label="车系：">
        <list-select
          listUrl="/datacenter/web/materials/vehicleSeries/list"
          placeholder="请选择"
          v-model="form.vehicleSeriesIdList"
          query-key="seriesNameLike"
          clearable
          collapseTags
          auto-load-options
          no-param-load
          multiple
          filterable
          :params="{}"
        />
      </el-form-item>
      <el-form-item label="车型：">
        <list-select
          listUrl="/datacenter/web/materials/vehicleModel/list"
          placeholder="请选择"
          v-model="form.vehicleModelIdList"
          query-key="modelNameLike"
          clearable
          auto-load-options
          collapseTags
          multiple
          filterable
          :params="{seriesIdList: form.vehicleSeriesIdList}"
        />
      </el-form-item>
      <el-form-item label="年款：">
        <list-select
          listUrl="/datacenter/web/materials/vehicleYearType/list"
          placeholder="请选择"
          v-model="form.vehicleYearIdList"
          query-key="yearTypeNameLike"
          clearable
          multiple
          collapseTags
          no-param-load
          auto-load-options
          filterable
        />
      </el-form-item>
      <el-form-item label="活动编码：">
        <tag-input v-model="form.serviceActivityCodeList" placeholder="请输入活动编码" />
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
      <el-form-item label="订单修改时间：">
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
      <!-- 备件清单专属搜索条件(仅备件清单页签展开时显示) -->
      <template v-if="show && activeTab === 'parts'">
        <el-form-item label="是否主因：">
          <el-select v-model="form.isMainPartList" placeholder="请选择" clearable multiple collapse-tags>
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="旧件唯一码：">
          <el-input v-model="form.oldPartUniqueCode" placeholder="请输入旧件唯一码" clearable />
        </el-form-item>
        <el-form-item label="备件编码：">
          <tag-input v-model="form.partCodeList" placeholder="请输入备件编码" />
        </el-form-item>
        <el-form-item label="备件名称：">
          <el-input v-model="form.partName" placeholder="请输入备件名称（模糊查询）" clearable />
        </el-form-item>
        <el-form-item label="旧件返还类型：">
          <el-select v-model="form.returnPartTypeList" placeholder="请选择" clearable multiple collapse-tags>
            <el-option label="无旧件" :value="'10'" />
            <el-option label="不返件" :value="'20'" />
            <el-option label="正常返件" :value="'30'" />
            <el-option label="快速返还" :value="'40'" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否已返：">
          <el-select v-model="form.isReturnedList" placeholder="请选择" clearable multiple collapse-tags>
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="旧件编码：">
          <tag-input v-model="form.oldPartCodeList" placeholder="请输入旧件编码" />
        </el-form-item>
        <el-form-item label="旧件名称：">
          <el-input v-model="form.oldPartName" placeholder="请输入旧件名称（模糊查询）" clearable />
        </el-form-item>
        <el-form-item label="旧件供应商编码：">
          <tag-input v-model="form.oldPartSupplierCodeList" placeholder="请输入旧件供应商编码" />
        </el-form-item>
        <el-form-item label="旧件供应商名称：">
          <el-input v-model="form.oldPartSupplierName" placeholder="请输入旧件供应商名称（模糊查询）" clearable />
        </el-form-item>
      </template>
      <!-- 工时清单专属搜索条件(仅工时清单页签展开时显示) -->
      <template v-if="show && activeTab === 'workhours'">
        <el-form-item label="是否主因：">
          <el-select v-model="form.isMainItemList" placeholder="请选择" clearable multiple collapse-tags>
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="工时代码：">
          <tag-input v-model="form.repairItemCodeList" placeholder="请输入工时代码" />
        </el-form-item>
        <el-form-item label="工时名称：">
          <el-input v-model="form.repairItemName" placeholder="请输入工时名称（模糊查询）" clearable />
        </el-form-item>
      </template>
      <!-- 其他清单专属搜索字段 -->
      <template v-if="show && activeTab === 'other'">
        <el-form-item label="其他代码：">
          <tag-input v-model="form.otherCodeList" placeholder="请输入其他代码" />
        </el-form-item>
        <el-form-item label="其他名称：">
          <el-input v-model="form.otherName" placeholder="请输入其他名称（全模糊）" clearable />
        </el-form-item>
      </template>
      <!-- 审批记录专属搜索字段 -->
      <template v-if="show && activeTab === 'approval'">
        <el-form-item label="日志审批人：">
          <fetch-select
            filterable
            clearable
            remote
            multiple
            reserve-keyword
            v-model="form.approverUserIdList"
            :remote-method="approverUserSearch"
            value-key="userId"
            label-key="username"
            sub-label-key="empNo"
            placeholder="请输入姓名/工号搜索"
          />
        </el-form-item>
        <el-form-item label="日志审批时间：">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.logApprovalTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="日志审批结果：">
          <fetch-select
            :request="fetchOptions"
            enumCode="claim_approval_result"
            v-model="form.approvalResultList"
            placeholder="请选择日志审批结果"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="日志审批说明：">
          <el-input v-model="form.logApprovalRemark" placeholder="请输入日志审批说明（全模糊）" clearable />
        </el-form-item>
        <el-form-item label="日志错误代码：">
          <fetch-select
            filterable
            clearable
            remote
            reserve-keyword
            v-model="form.errorCodeList"
            :remote-method="errorCodeSearch"
            placeholder="请输入错误代码/名称搜索"
            value-key="code"
            label-key="name"
            sub-label-key="code"
            multiple
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
      <template v-if="activeTab !== 'parts' && activeTab !== 'workhours' && activeTab !== 'other' && activeTab !== 'approval'">
        <el-button v-if="withdraw" size="small" @click="handleWithdraw">批量撤回</el-button>
        <el-button v-if="reject" size="small" @click="handleReject">批量驳回</el-button>
        <el-button v-if="approve"  size="small" @click="handleApprove">批量同意</el-button>
        <el-button v-if="cancel" size="small" @click="handleCancel">批量作废</el-button>
        <el-button size="small" @click="handlePrint">打印标签</el-button>
      </template>
    </div>
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="全部订单" name="all" />
      <el-tab-pane label="保修经理订单" name="manager" />
      <el-tab-pane label="总经理订单" name="gm" />
      <el-tab-pane label="备件清单" name="parts" />
      <el-tab-pane label="工时清单" name="workhours" />
      <el-tab-pane label="其他清单" name="other" />
      <el-tab-pane label="审批记录" name="approval" />
    </el-tabs>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        :key="activeTab"
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
  getPartList,
  getWorkhourList,
  getOtherList,
  getApprovalList,
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
  getTableConfig, tableAddOrUpdate, getEnum,
  sparePartList, exportTable, getAllRegion, userQuery
} from '@/api/common';
import { getList as getRejectSettingList } from '@/api/claimreturn/claim/basic/approvalRejectSetting/index';
import FetchSelect from '@/libs/components/FetchSelect';
import ListSelect from '@/libs/components/list-select';
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
import { getTimeRangeByTypeFormat } from '@/libs/utils/time';
import { getDetail as getServiceActivityDetail } from '@/api/claimreturn/claim/basic/serviceActivity';

// 创建时间默认值：最近 3 个月
function getDefaultCreateTime () {
  const { startTime, endTime } = getTimeRangeByTypeFormat('最近三个月');
  return [startTime, endTime];
}

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
  vehicleSeriesIdList: [],
  vehicleModelIdList: [],
  vehicleYearIdList: [],
  serviceActivityCodeList: [],
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
  // 备件清单专属查询字段
  isMainPartList: [],
  oldPartUniqueCode: '',
  partCodeList: [],
  partName: '',
  returnPartTypeList: [],
  isReturnedList: [],
  oldPartCodeList: [],
  oldPartName: '',
  oldPartSupplierCodeList: [],
  oldPartSupplierName: '',
  // 工时清单专属查询字段
  isMainItemList: [],
  repairItemCodeList: [],
  repairItemName: '',
  // 其他清单专属查询字段
  otherCodeList: [],
  otherName: '',
  // 审批记录专属查询字段
  approverUserIdList: [],
  logApprovalTime: '',
  approvalResultList: [],
  logApprovalRemark: '',
  errorCodeList: [],
  errorContent: '',
  // 其他清单/审批记录共用字段（精确多选/批量）
  dealerNameList: []
};

const SEARCH_PARAMS_KEY = 'WARRANTY_APPLY_SEARCH_PARAMS';
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
    ListSelect,
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
        ...defaultForm,
        createTime: getDefaultCreateTime()
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      regionSelectKey: 0,
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
        {
          column: 'create_time',
          sort: 'DESC'
        }
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
      edit: false,
      detail: false,
      //
      rightsDialogVisible: false,
      vehicleProfileId: '',
      rowId: '',
    };
  },
  computed: {
    optionObj () {
      if (this.activeTab === 'parts') return this.optionObjParts;
      if (this.activeTab === 'workhours') return this.optionObjWorkhours;
      if (this.activeTab === 'other') return this.optionObjOther;
      if (this.activeTab === 'approval') return this.optionObjApproval;
      return this.optionObjApply;
    },
    optionObjApply () {
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
            props: 'serviceActivityCode',
            label: '活动编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.serviceActivityId),
              click: (rowIndex, row) => {
                this.openActivityDetail(row);
              }
            }]
          },
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
          { props: 'vehicleSeriesName', label: '车系', visible: true, width: 160 },
          { props: 'vehicleYearName', label: '年款', visible: true, width: 120 },
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
          { props: 'faultPhenomenon', label: '故障现象描述', visible: true, width: 200 },
          { props: 'troubleshootingFlow', label: '故障排查流程', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },
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
                  return this.edit && (row.applyStatus === '10' || row.applyStatus === '30');
                },
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/claimreturn/claim/warrantyApply/edit',
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
                  // 【保修单状态】为审核中、待保修经理审核、待总经理审核、审核通过，显示此按钮
                  return this.isRowPendingCurrentUserReview(row) || row.applyStatus === APPLY_STATUS.APPROVED;
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
                show: () => {
                  return this.detail;
                },
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
    optionObjParts () {
      return {
        id: 'warrantyApplyPartsTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          { props: 'alarmLevelLabel', label: '三包预警', visible: true, width: 120 },
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
                  query: { id: row.id }
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
                  query: { id: row.vehicleProfileId }
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
                  query: { id: row.serviceProxyId }
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
                  query: { id: row.statementId }
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
          { props: 'vehicleSeriesName', label: '车系', visible: true, width: 160 },
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
          {
            props: 'serviceActivityCode',
            label: '活动编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.serviceActivityId),
              click: (rowIndex, row) => {
                this.openActivityDetail(row);
              }
            }]
          },
          { props: 'vehicleYearName', label: '年款', visible: true, width: 120 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },
          { props: 'isMainPartLabel', label: '是否主因', visible: true, width: 100, align: 'center' },
          { props: 'oldPartUniqueCode', label: '旧件唯一码', visible: true, width: 180 },
          {
            props: 'partCode',
            label: '备件编码',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.partId),
              click: (rowIndex, row) => {
                window.open(`/service/sparepart/basic/sparePart/edit?id=${row.partId}`, '_blank');
              }
            }]
          },
          { props: 'partName', label: '备件名称', visible: true, width: 200 },
          { props: 'returnPartTypeLabel', label: '旧件返还类型', visible: true, width: 140 },
          { props: 'isReturnedLabel', label: '是否已返', visible: true, width: 100, align: 'center' },
          {
            props: 'oldPartCode',
            label: '旧件编码',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.oldPartId),
              click: (rowIndex, row) => {
                window.open(`/service/sparepart/basic/sparePart/edit?id=${row.oldPartId}`, '_blank');
              }
            }]
          },
          { props: 'oldPartName', label: '旧件名称', visible: true, width: 200 },
          {
            props: 'oldPartSupplierCode',
            label: '旧件供应商编码',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.oldPartSupplierId),
              click: (rowIndex, row) => {
                window.open(`/service/sparepart/basic/supplierInfo/edit?id=${row.oldPartSupplierId}`, '_blank');
              }
            }]
          },
          { props: 'oldPartSupplierName', label: '旧件供应商名称', visible: true, width: 200 },
          { props: 'partQuantity', label: '备件数', visible: true, width: 120, align: 'right' },
          { props: 'partUnitPrice', label: '备件单价', visible: true, width: 140, align: 'right' },
          { props: 'managementRate', label: '管理费率%', visible: true, width: 120, align: 'right' },
          { props: 'totalCostAmount', label: '备件明细总金额', visible: true, width: 160, align: 'right' },
          { props: 'remark', label: '备件明细备注', visible: true, width: 200 }
        ],
        total: this.tableTotal
      };
    },
    optionObjWorkhours () {
      return {
        id: 'warrantyApplyWorkhoursTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          { props: 'alarmLevelLabel', label: '三包预警', visible: true, width: 120 },
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
                  query: { id: row.id }
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
                  query: { id: row.vehicleProfileId }
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
                  query: { id: row.serviceProxyId }
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
                  query: { id: row.statementId }
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
          { props: 'vehicleSeriesName', label: '车系', visible: true, width: 160 },
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
          {
            props: 'serviceActivityCode',
            label: '活动编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.serviceActivityId),
              click: (rowIndex, row) => {
                this.openActivityDetail(row);
              }
            }]
          },
          { props: 'vehicleYearName', label: '年款', visible: true, width: 120 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },
          { props: 'isMainItemLabel', label: '是否主因', visible: true, width: 120, align: 'center' },
          {
            props: 'repairItemCode',
            label: '工时代码',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.repairItemId),
              click: (rowIndex, row) => {
                window.open(`/service/maintain/basic/repairItem/edit?id=${row.repairItemId}`, '_blank');
              }
            }]
          },
          { props: 'repairItemName', label: '工时名称', visible: true, width: 200 },
          { props: 'workHour', label: '工时数', visible: true, width: 120, align: 'right' },
          { props: 'workHourUnitPrice', label: '工时单价', visible: true, width: 140, align: 'right' },
          { props: 'totalCostAmount', label: '工时明细总金额', visible: true, width: 160, align: 'right' },
          { props: 'remark', label: '工时明细备注', visible: true, width: 200 }
        ],
        total: this.tableTotal
      };
    },
    optionObjOther () {
      return {
        id: 'warrantyApplyOtherTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          { props: 'alarmLevelLabel', label: '三包预警', visible: true, width: 120 },
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
                  query: { id: row.id }
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
                  query: { id: row.vehicleProfileId }
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
                  query: { id: row.serviceProxyId }
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
                  query: { id: row.statementId }
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
          { props: 'vehicleSeriesName', label: '车系', visible: true, width: 160 },
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
          {
            props: 'serviceActivityCode',
            label: '活动编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.serviceActivityId),
              click: (rowIndex, row) => {
                this.openActivityDetail(row);
              }
            }]
          },
          { props: 'vehicleYearName', label: '年款', visible: true, width: 120 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },
          { props: 'otherCode', label: '其他代码', visible: true, width: 200 },
          { props: 'otherName', label: '其他名称', visible: true, width: 200 },
          { props: 'totalCostAmount', label: '其他明细总金额', visible: true, width: 160, align: 'right' },
          { props: 'remark', label: '其他明细备注', visible: true, width: 200 }
        ],
        total: this.tableTotal
      };
    },
    optionObjApproval () {
      return {
        id: 'warrantyApplyApprovalTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          { props: 'alarmLevelLabel', label: '三包预警', visible: true, width: 120 },
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
                  query: { id: row.id }
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
                  query: { id: row.vehicleProfileId }
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
                  query: { id: row.serviceProxyId }
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
                  query: { id: row.statementId }
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
          { props: 'approvalTime', label: '最终审批时间', visible: true, width: 200 },
          { props: 'vehiclePlateNo', label: '车牌号', visible: true, width: 160, mask: true, getValue: (row) => getDetailDecryptField(row.id, 'vehiclePlateNo') },
          { props: 'ownerName', label: '车主姓名', visible: true, width: 120, mask: true, getValue: (row) => getDetailDecryptField(row.id, 'ownerName') },
          { props: 'vehicleSeriesName', label: '车系', visible: true, width: 160 },
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
          {
            props: 'serviceActivityCode',
            label: '活动编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.serviceActivityId),
              click: (rowIndex, row) => {
                this.openActivityDetail(row);
              }
            }]
          },
          { props: 'vehicleYearName', label: '年款', visible: true, width: 120 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },
          { props: 'approverUserName', label: '日志审批人', visible: true, width: 160 },
          { props: 'logApprovalTime', label: '日志审批时间', visible: true, width: 200 },
          { props: 'logApprovalResultLabel', label: '日志审批结果', visible: true, width: 140 },
          { props: 'logApprovalRemark', label: '日志审批说明', visible: true, width: 200 },
          { props: 'errorCode', label: '日志错误代码', visible: true, width: 160 },
          { props: 'errorContent', label: '日志错误内容', visible: true, width: 200 }
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
    this.edit = this.permissions.has(`${this.moduleKey}-addOrUpdate`);
    this.detail = this.permissions.has(`${this.moduleKey}-detail`);
  },
  methods: {
    isRowPendingCurrentUserReview (row) {
      if (!row.isInApproval) return false;
      const list = row.currentApproverIdList?.map(id => Number(id));
      if (!list || list.length === 0) return true;
      const userId = this.$store.state.user.userInfo.userId;
      return list.includes(userId);
    },
    // 参考 techServiceActivity/index.vue 的 getPath 实现
    getActivityPath (activityType) {
      return activityType === '4'
        ? '/claimreturn/claim/basic/serviceCareActivity/edit'
        : '/claimreturn/claim/basic/techServiceActivity/edit';
    },
    async openActivityDetail (row) {
      const activityId = row?.serviceActivityId;
      if (!activityId) {
        this.$message.warning('该保修申请单未关联活动');
        return;
      }
      try {
        const activity = await getServiceActivityDetail(activityId);
        if (!activity) {
          this.$message.error('活动不存在或已被删除');
          return;
        }
        const activityType = String(activity.activityType || '').trim();
        if (!activityType) {
          this.$message.error('活动类型信息缺失，暂无法打开详情');
          return;
        }
        // 保修申请页面仅查看活动，isEditing=false 进入查看模式（默认有"编辑"按钮，用户可手动进入编辑）
        this.$router.push({
          path: this.getActivityPath(activityType),
          query: {
            id: String(activityId),
            isEditing: false,
          }
        });
      } catch (error) {
        console.error('获取活动详情失败:', error);
        this.$message.error('活动详情查询失败，请稍后重试');
      }
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
    /**
     * 校验日期范围跨度是否超过 1 年
     * @param {Array} dateRange - 日期范围数组 [start, end]
     * @param {string} fieldName - 字段中文名，用于提示
     * @returns {boolean} true 表示校验通过（未超限）
     */
    validateDateSpan (dateRange, fieldName) {
      if (dateRange?.length > 1) {
        const span = new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime();
        if (span > 365 * 24 * 60 * 60 * 1000) {
          this.$message.warning(`${fieldName}范围不能超过 1 年`);
          return false;
        }
      }
      return true;
    },
    onSubmit () {
      // 1. 若【保修申请单号】【VIN】【施工单号】【结算单号】任一有内容，清空【创建时间】【当前提交时间】【审批时间】
      const hasApplyNo = this.form.applyNoList?.length > 0;
      const hasVin = this.form.vinList?.length > 0;
      const hasServiceProxyNo = this.form.serviceProxyNoList?.length > 0;
      const hasStatementCode = this.form.statementCodeList?.length > 0;
      if (hasApplyNo || hasVin || hasServiceProxyNo || hasStatementCode) {
        this.form.createTime = null;
        this.form.currentSubmitTime = null;
        this.form.approvalTime = null;
      }

      // 2. 非空校验：根据 tab 不同校验条件不同
      // 其他清单：与现有条件一致
      // 审批记录：增加 "日志审批时间" 作为非空校验条件之一
      const baseEmpty = !hasApplyNo && !hasVin && !hasServiceProxyNo && !hasStatementCode &&
        !this.form.createTime &&
        !this.form.currentSubmitTime &&
        !this.form.approvalTime;
      let allEmpty = baseEmpty;
      let emptyMessage = '【保修申请单号】【VIN】【施工单号】【结算单号】【创建时间】【当前提交时间】【审批时间】不允许都为空';
      if (this.activeTab === 'approval') {
        const hasLogApprovalTime = !!this.form.logApprovalTime;
        allEmpty = baseEmpty && !hasLogApprovalTime;
        emptyMessage = '【保修申请单号】【VIN】【施工单号】【结算单号】【创建时间】【当前提交时间】【最终审批时间】【日志审批时间】不允许都为空';
      }
      if (allEmpty) {
        this.$message.warning(emptyMessage);
        return;
      }

      // 3. 日期范围校验：所有日期最长跨度为一年
      // 审批时间在【审批记录】tab 下 label 变为【最终审批时间】，校验提示需同步
      const approvalTimeLabel = this.activeTab === 'approval' ? '最终审批时间' : '审批时间';
      if (!this.validateDateSpan(this.form.createTime, '创建时间')) return;
      if (!this.validateDateSpan(this.form.currentSubmitTime, '当前提交时间')) return;
      if (!this.validateDateSpan(this.form.approvalTime, approvalTimeLabel)) return;
      if (!this.validateDateSpan(this.form.warrantyStartdate, '保修开始日期')) return;
      if (!this.validateDateSpan(this.form.repairStartTime, '维修开始日期')) return;
      if (!this.validateDateSpan(this.form.updateTime, '订单修改时间')) return;
      if (!this.validateDateSpan(this.form.logApprovalTime, '日志审批时间')) return;

      sessionStorage.setItem(SEARCH_PARAMS_KEY, JSON.stringify(this.getFormData()));
      this.tableForm.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm, createTime: getDefaultCreateTime() };
      this.tableForm.page = 1;
      this.tableForm.pageSize = pageSize;
      this._scopeTypeOrgCache = null;
      this.regionSelectKey++;
      this.getData();
    },
    handleTabChange () {
      this.tableForm.page = 1;
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      const reqData = { ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size };
      let apiCall;
      if (this.activeTab === 'parts') {
        apiCall = getPartList(reqData);
      } else if (this.activeTab === 'workhours') {
        apiCall = getWorkhourList(reqData);
      } else if (this.activeTab === 'other') {
        apiCall = getOtherList(reqData);
      } else if (this.activeTab === 'approval') {
        apiCall = getApprovalList(reqData);
      } else {
        apiCall = getList(reqData);
      }
      apiCall
        .then(res => {
          this.tableDataList = (res?.records || []).map(item => {
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
      // 后端 user_define_table 表中可能存了 warrantyApplyTable 的旧配置，
      // 会覆盖前端 optionObj.dataProp 的列顺序。这里主动用前端硬编码的
      // columnConfig 同步到后端。
      // 注意：visible 始终以前端硬编码为准（避免远端缓存 visible:false 覆盖新列）
      // 宽度保留用户自定义（remote.width 优先于 item.width）
      return new Promise((resolve) => {
        getTableConfig(this.optionObj.id).then(data => {
          const remoteData = data?.data || {};
          const remoteColumnConfig = remoteData?.config?.columnConfig || [];

          const mergedColumnConfig = this.optionObj.dataProp.map((item) => {
            const existing = remoteColumnConfig.find(c => c.props === item.props);
            return {
              ...item,
              props: item.props,
              visible: item.visible !== false,
              width: existing?.width || item.width,
            };
          });

          const mergedConfig = {
            ...(remoteData.config || {}),
            columnConfig: mergedColumnConfig
          };

          // 异步覆盖后端旧配置，不阻塞页面渲染
          tableAddOrUpdate({
            tableCode: this.optionObj.id,
            config: mergedConfig
          }).catch(err => console.error('同步表格列配置失败:', err));

          resolve({ data: { ...remoteData, config: mergedConfig } });
        }).catch(err => {
          // 容错：接口挂了也不影响使用，回落到前端硬编码
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

      // 备件清单专属字段映射
      if (this.form.partName) {
        delete data.partName;
        data.partNameLike = this.form.partName;
      }
      if (this.form.oldPartName) {
        delete data.oldPartName;
        data.oldPartNameLike = this.form.oldPartName;
      }
      if (this.form.oldPartSupplierName) {
        delete data.oldPartSupplierName;
        data.oldPartSupplierNameLike = this.form.oldPartSupplierName;
      }
      // 工时清单专属字段映射
      if (this.form.repairItemName) {
        delete data.repairItemName;
        data.repairItemNameLike = this.form.repairItemName;
      }
      // 其他清单专属字段映射
      if (this.form.otherName) {
        delete data.otherName;
        data.otherNameLike = this.form.otherName;
      }
      // 审批记录专属字段 - 日志审批时间拆分
      if (this.form.logApprovalTime) {
        delete data.logApprovalTime;
        if (this.form.logApprovalTime.length > 1) {
          data.logApprovalTimeStart = this.form.logApprovalTime[0];
          data.logApprovalTimeEnd = this.form.logApprovalTime[1];
        }
      }
      // 审批记录专属字段 - 日志审批说明（全模糊→ approvalRemarkLike）
      if (this.form.logApprovalRemark) {
        delete data.logApprovalRemark;
        data.approvalRemarkLike = this.form.logApprovalRemark;
      }
      // 审批记录专属字段 - 日志错误内容（全模糊→ errorContentLike）
      if (this.form.errorContent) {
        delete data.errorContent;
        data.errorContentLike = this.form.errorContent;
      }
      // 其他清单/审批记录专用：门店名称（精确多选）
      // partsPage/workhourPage 使用 dealerNameLike（模糊），与 dealerNameList 共存
      // 此处直接传递 dealerNameList，不做转换

      // 按页签过滤专属参数，防止跨页签参数泄漏导致 SQL 报错
      const partsOnlyKeys = [
        'isMainPartList', 'oldPartUniqueCode', 'partCodeList', 'partNameLike',
        'returnPartTypeList', 'isReturnedList', 'oldPartCodeList', 'oldPartNameLike',
        'oldPartSupplierCodeList', 'oldPartSupplierNameLike'
      ];
      // 工时 + 其他 共享（两者都用 repair_item_code/name）
      const workhourAndOtherOnlyKeys = [
        'isMainItemList', 'repairItemCodeList', 'repairItemNameLike'
      ];
      const otherOnlyKeys = [
        'otherCodeList', 'otherNameLike'
      ];
      const approvalOnlyKeys = [
        'approverUserIdList', 'logApprovalTimeStart', 'logApprovalTimeEnd',
        'approvalResultList', 'approvalRemarkLike', 'errorCodeList', 'errorContentLike'
      ];
      if (this.activeTab === 'parts') {
        [...workhourAndOtherOnlyKeys, ...otherOnlyKeys, ...approvalOnlyKeys].forEach(key => delete data[key]);
      } else if (this.activeTab === 'workhours') {
        // 工时清单：保留 repairItemCodeList / repairItemNameLike / isMainItemList，其余专属字段全部清理
        [...partsOnlyKeys, ...otherOnlyKeys, ...approvalOnlyKeys]
          .forEach(key => delete data[key]);
      } else if (this.activeTab === 'other') {
        // 其他清单：保留 otherCodeList / otherNameLike，其余专属字段全部清理
        [...partsOnlyKeys, ...approvalOnlyKeys, 'isMainItemList']
          .forEach(key => delete data[key]);
      } else if (this.activeTab === 'approval') {
        [...partsOnlyKeys, ...workhourAndOtherOnlyKeys, ...otherOnlyKeys].forEach(key => delete data[key]);
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
    async getScopeTypeOrg (query) {
      if (!this._scopeTypeOrgCache) {
        const res = await getAllRegion();
        this._scopeTypeOrgCache = res?.data || res || [];
      }
      if (!query) {
        return { data: this._scopeTypeOrgCache };
      }
      const filtered = this._scopeTypeOrgCache.filter(item => item.name && item.name.includes(query));
      return { data: filtered };
    },
    partRemote (query) {
      return sparePartList({ partCodeOrNameLike: query, oemPart: 1 });
    },
    // 复用审批驳回配置接口加载错误代码下拉数据
    // 下拉 value-key="code" 直接绑 code 数组，与后端 waa.error_code 筛字段一致，无需 id↔code 转换
    errorCodeSearch (query) {
      return getRejectSettingList({
        nameOrCodeLike: query || '',
        pageNum: 1,
        pageSize: 20,
      });
    },
    // 日志审批人：复用 common.userQuery 接口搜索（与 GradeTable/审计专员 一致）
    // 下拉 value-key="userId" 直接绑 userId 数组，与后端 waa.approver_user_id 筛字段一致
    approverUserSearch (query) {
      return userQuery({ keyword: query });
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        // 各页签 row 是「申请单 × 明细」的 JOIN 行，row.id 是申请单主键；
        // 按 id 过滤会导致 JOIN 后膨胀成多行。这里按各页签对应明细主键过滤，
        // 与后端 mapper 中 `wap.id / waw.id / wao.id / waa.id IN (...)` 配套。
        // all / manager / gm 走原 /page 接口，本身不是 JOIN 视图，按 id 过滤。
        const detailIdFieldMap = {
          approval: 'approvalId',
          parts: 'partDetailId',
          workhours: 'workhourDetailId',
          other: 'otherDetailId'
        };
        const idField = detailIdFieldMap[this.activeTab] || 'id';
        const ids = this.selectionList.map(item => item[idField]) || [];
        reqParams.ids = ids;
      }
      // 通用导出微服务回调后端分页接口时不会自动补 pageNum/pageSize；
      // 后端新接口（partsPage/workhourPage/otherPage/approvalPage）在
      // `new Page<>(qo.getPageNum(), qo.getPageSize())` 时 pageNum=null 会因 long
      // 自动拆箱抛出 NPE → 500。这里主动补 pageNum=1, pageSize=99999。
      reqParams.pageNum = reqParams.pageNum || 1;
      reqParams.pageSize = reqParams.pageSize || 99999;
      const tab = this.activeTab;
      const isParts = tab === 'parts';
      const isWorkhours = tab === 'workhours';
      const isOther = tab === 'other';
      const isApproval = tab === 'approval';
      // all / manager / gm 走原来的 /page 接口（与原本可用的逻辑保持一致）
      // parts / workhours / other / approval 各自走专属分页接口
      let dataFetchPath;
      let businessType;
      let fileName;
      if (isParts) {
        dataFetchPath = 'claimreturn/claim/web/warrantyapply/warrantyApply/partsPage';
        businessType = '保修备件清单';
        fileName = '保修备件清单.xlsx';
      } else if (isWorkhours) {
        dataFetchPath = 'claimreturn/claim/web/warrantyapply/warrantyApply/workhourPage';
        businessType = '保修工时清单';
        fileName = '保修工时清单.xlsx';
      } else if (isOther) {
        dataFetchPath = 'claimreturn/claim/web/warrantyapply/warrantyApply/otherPage';
        businessType = '保修其他清单';
        fileName = '保修其他清单.xlsx';
      } else if (isApproval) {
        dataFetchPath = 'claimreturn/claim/web/warrantyapply/warrantyApply/approvalPage';
        businessType = '保修审批记录';
        fileName = '保修审批记录.xlsx';
      } else {
        // all / manager / gm 沿用原逻辑，统一走 /page，businessType 为「保修申请单」
        dataFetchPath = 'claimreturn/claim/web/warrantyapply/warrantyApply/page';
        businessType = '保修申请单';
        fileName = '保修申请单.xlsx';
      }
      exportTable({
        businessType,
        dataFetchPath,
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, fileName);
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
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
