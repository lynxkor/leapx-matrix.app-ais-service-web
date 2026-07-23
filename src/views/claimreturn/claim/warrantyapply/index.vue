<template>
  <div class="page-common m-warranty-apply-list" :class="{ 'is-preset-locked': formDisabled }">
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
        <tag-input v-model="form.applyNoList" placeholder="请输入保修申请单号" :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="VIN：">
        <tag-input v-model="form.vinList" placeholder="请输入VIN" :disabled="formDisabled" />
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
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="施工单号：">
        <tag-input v-model="form.serviceProxyNoList" placeholder="请输入施工单号" :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="结算单号：">
        <tag-input v-model="form.statementCodeList" placeholder="请输入结算单号" :disabled="formDisabled" />
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
          :disabled="formDisabled"
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
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="门店：">
        <dealer-select v-model="form.dealerCodeList" multiple :disabled="formDisabled"/>
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
          :disabled="formDisabled"
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
          :disabled="formDisabled"
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
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="车牌号：">
        <el-input v-model="form.vehiclePlateNo" placeholder="请输入车牌号" clearable :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="车主姓名：">
        <el-input v-model="form.ownerName" placeholder="请输入车主姓名" clearable :disabled="formDisabled" />
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
          :disabled="formDisabled"
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
          :disabled="formDisabled"
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
          :disabled="formDisabled"
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
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="服务月份：">
        <el-input v-model="form.serviceMonth" placeholder="请输入" clearable :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="工时分担比例：">
        <el-input v-model="form.laborShareRatio" placeholder="请输入" clearable :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="备件分担比例：">
        <el-input v-model="form.partsShareRatio" placeholder="请输入" clearable :disabled="formDisabled" />
      </el-form-item>
      <el-form-item label="其他分担比例：">
        <el-input v-model="form.otherShareRatio" placeholder="请输入" clearable :disabled="formDisabled" />
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
          :disabled="formDisabled"
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
          :disabled="formDisabled"
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
      <el-button v-if="withdraw" size="small" @click="handleWithdraw">批量撤回</el-button>
      <el-button v-if="reject" size="small" @click="handleReject">批量驳回</el-button>
      <el-button v-if="approve"  size="small" @click="handleApprove">批量同意</el-button>
      <el-button v-if="cancel" size="small" @click="handleCancel">批量作废</el-button>
      <el-button size="small" @click="handlePrint">打印标签</el-button>
      <el-dropdown
        trigger="click"
        placement="bottom-end"
        class="m-view-dropdown m-view-dropdown--right"
        @command="onDropdownCommand"
        @visible-change="onDropdownVisibleChange"
      >
        <el-button size="small" class="m-view-dropdown__trigger">
          {{ activePresetName || '默认视图' }}
          <i class="el-icon-arrow-down el-icon--right" />
          <i
            v-if="activePresetName"
            class="el-icon-close m-view-dropdown__clear"
            @click.stop="handleClearPreset"
          />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <div class="m-view-dropdown__search" @click.stop>
            <el-input
              v-model="presetFilterKeyword"
              size="mini"
              placeholder="搜索视图名称"
              clearable
              prefix-icon="el-icon-search"
            />
          </div>
          <el-dropdown-item
            v-if="defaultViewVisible"
            command="__default__"
            :class="['m-view-dropdown__item', { 'is-active': !activePresetId }]"
          >
            <span class="m-view-dropdown__label">默认视图</span>
          </el-dropdown-item>
          <el-dropdown-item
            v-for="p in filteredPresets"
            :key="p.id"
            :command="p.id"
            :class="['m-view-dropdown__item', { 'is-active': activePresetId === p.id }]"
          >
            <span class="m-view-dropdown__label">{{ p.name }}</span>
            <el-tag
              :type="perfStatusTagType(p)"
              size="mini"
              class="m-view-dropdown__perf"
            >{{ perfStatusLabel(p) }}</el-tag>
            <span class="m-view-dropdown__actions" @click.stop>
              <i
                class="el-icon-top m-view-dropdown__action"
                title="置顶"
                @click.stop="onMoveToTop(p)"
              />
              <i
                class="el-icon-edit m-view-dropdown__action"
                title="编辑"
                @click.stop="onEditView(p)"
              />
              <i
                class="el-icon-delete m-view-dropdown__action m-view-dropdown__action--danger"
                title="删除"
                @click.stop="onDeleteView(p)"
              />
            </span>
          </el-dropdown-item>
          <el-dropdown-item divided command="__new__">
            <i class="el-icon-plus" />
            <span class="m-view-dropdown__label">新增视图</span>
          </el-dropdown-item>
          <div
            v-if="presetFilterKeyword && !defaultViewVisible && filteredPresets.length === 0"
            class="m-view-dropdown__empty"
          >未找到匹配的视图</div>
        </el-dropdown-menu>
      </el-dropdown>
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
    <CustomQueryDialog
      :visible.sync="customDialogVisible"
      v-model="appliedCustomConditions"
      v-model:active-preset-id="activePresetId"
      :editing-preset-id="editingPresetId"
      @update:sort="onApplySort"
      @update:editing-preset-id="editingPresetId = $event"
    />
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
  getTableConfig, tableAddOrUpdate, getEnum, listVehicleModel,
  sparePartList, exportTable, getAllRegion
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
import { getTimeRangeByTypeFormat } from '@/libs/utils/time';
import CustomQueryDialog from './components/CustomQueryDialog/index.vue';
import { loadPresets, movePresetToTop, deletePreset, PERF_STATUS } from './components/CustomQueryDialog/presetStore';
import { cloneTree, toSnakeCase } from './components/CustomQueryDialog/fieldMeta';

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
    EditPage,
    DealerSelect,
    TagInput,
    RejectDialog,
    DenyDialog,
    RightsDialog,
    ApproveDialog,
    CancelDialog,
    WithdrawDialog,
    CustomQueryDialog,
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
      edit: false,
      detail: false,
      //
      rightsDialogVisible: false,
      vehicleProfileId: '',
      rowId: '',
      customDialogVisible: false,
      appliedCustomConditions: null,
      activePresetId: null,
      editingPresetId: null,
      presets: [],
      presetFilterKeyword: '',
    };
  },
  computed: {
    formDisabled () {
      return !!this.activePresetId;
    },
    activePresetName () {
      if (!this.activePresetId) return '';
      const list = loadPresets();
      const preset = list.find(p => p.id === this.activePresetId);
      return preset ? preset.name : '';
    },
    filteredPresets () {
      const kw = (this.presetFilterKeyword || '').trim().toLowerCase();
      if (!kw) return this.presets;
      return this.presets.filter(p => (p.name || '').toLowerCase().includes(kw));
    },
    defaultViewVisible () {
      const kw = (this.presetFilterKeyword || '').trim().toLowerCase();
      return !kw || '默认视图'.toLowerCase().includes(kw);
    },
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
  watch: {
    // 弹窗关闭后清空 editingPresetId,下次打开不再继承上次的视图定位
    customDialogVisible (val) {
      if (!val) this.editingPresetId = null;
    }
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
          column: toSnakeCase(item.field),
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
      // 1. 若【保修申请单号】或【VIN】有内容，清空【创建时间】【当前提交时间】【审批时间】
      const hasApplyNo = this.form.applyNoList?.length > 0;
      const hasVin = this.form.vinList?.length > 0;
      if (hasApplyNo || hasVin) {
        this.form.createTime = null;
        this.form.currentSubmitTime = null;
        this.form.approvalTime = null;
      }

      // 2. 非空校验：【保修申请单号】【VIN】【创建时间】【当前提交时间】【审批时间】不允许都为空
      const allEmpty = !hasApplyNo && !hasVin &&
        !this.form.createTime &&
        !this.form.currentSubmitTime &&
        !this.form.approvalTime;
      if (allEmpty) {
        this.$message.warning('【保修申请单号】【VIN】【创建时间】【当前提交时间】【审批时间】不允许都为空');
        return;
      }

      // 3. 日期范围校验：所有日期最长跨度为一年
      if (!this.validateDateSpan(this.form.createTime, '创建时间')) return;

      sessionStorage.setItem(SEARCH_PARAMS_KEY, JSON.stringify(this.getFormData()));
      this.tableForm.page = 1;
      this.getData();
    },
    onReset () {
      this.appliedCustomConditions = null;
      this.activePresetId = null;
      this.form = { ...defaultForm, createTime: getDefaultCreateTime() };
      this.sortColumns = [];
      this.tableForm.page = 1;
      this.tableForm.pageSize = pageSize;
      this._scopeTypeOrgCache = null;
      this.regionSelectKey++;
      this.getData();
    },
    handleClearPreset () {
      this.activePresetId = null;
      this.appliedCustomConditions = null;
      this.sortColumns = [];
      this.$message.success('已清除方案,可自由编辑查询条件');
    },
    onMoveToTop (preset) {
      this.presets = movePresetToTop(preset.id);
      this.$message.success(`已将视图「${preset.name}」置顶`);
    },
    onEditView (preset) {
      // 选中并打开弹窗编辑该视图的条件
      this.activePresetId = preset.id;
      this.appliedCustomConditions = cloneTree(preset.tree);
      this.editingPresetId = preset.id;
      this.customDialogVisible = true;
    },
    onDeleteView (preset) {
      this.$confirm(`确认删除视图「${preset.name}」?删除后不可恢复。`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePreset(preset.id);
        this.presets = loadPresets();
        // 如果删的是当前激活的视图,自动清除
        if (this.activePresetId === preset.id) {
          this.activePresetId = null;
          this.appliedCustomConditions = null;
        }
        this.$message.success('已删除视图');
      }).catch(() => {});
    },
    perfStatusLabel (preset) {
      const s = preset.perfStatus || PERF_STATUS.PENDING;
      if (s === PERF_STATUS.PASSED) return '已通过';
      if (s === PERF_STATUS.FAILED) return '未通过';
      return '待测试';
    },
    perfStatusTagType (preset) {
      const s = preset.perfStatus || PERF_STATUS.PENDING;
      if (s === PERF_STATUS.PASSED) return 'success';
      if (s === PERF_STATUS.FAILED) return 'danger';
      return 'warning';
    },
    refreshPresets () {
      this.presets = loadPresets();
    },
    onDropdownVisibleChange (visible) {
      // 每次展开时刷新 localStorage,确保新建/删除/重命名后立即可见
      if (visible) {
        this.refreshPresets();
      } else {
        // 收起时清空搜索关键字
        this.presetFilterKeyword = '';
      }
    },
    onApplySort (sort) {
      // 弹窗保存/应用排序时,同步到 sortColumns 并重查
      this.sortColumns = sort
        ? [{ column: toSnakeCase(sort.field), sort: sort.order.toUpperCase() }]
        : [];
      this.getData();
    },
    onDropdownCommand (cmd) {
      if (cmd === '__default__') {
        this.handleClearPreset();
        return;
      }
      if (cmd === '__new__') {
        // 管理视图:打开条件编辑弹窗,顶部栏可保存/重命名/删除视图
        this.activePresetId = null;
        this.appliedCustomConditions = null;
        this.customDialogVisible = true;
        return;
      }
      // 选中已有视图:锁定表单,使用该视图的条件
      const preset = this.presets.find(p => p.id === cmd);
      if (!preset) return;
      // 性能测试未通过的视图不能用于查询
      if (preset.perfStatus !== PERF_STATUS.PASSED) {
        this.$message.warning(`视图「${preset.name}」未通过性能测试,不能用于查询,请先在管理视图中完成测试`);
        return;
      }
      this.activePresetId = preset.id;
      this.appliedCustomConditions = cloneTree(preset.tree);
      // 同步排序(视图里有 sort 就用,没有就清空走后端默认)
      this.sortColumns = preset.sort
        ? [{ column: toSnakeCase(preset.sort.field), sort: preset.sort.order.toUpperCase() }]
        : [];
      this.$message.success(`已使用视图「${preset.name}」,表单已锁定`);
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
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .m-view-dropdown {
    &--right {
      // 触发器不要紧贴右边,让 popper 底部右对齐时也向左移,
      // 避免弹出菜单压住表格右侧的操作列图标
      margin-left: auto;
      margin-right: 140px;
    }
    &__trigger {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    &__clear {
      margin-left: 6px;
      padding: 0 4px;
      font-size: 14px;
      border-radius: 50%;
      &:hover {
        background: rgba(0,0,0,0.1);
        color: var(--leap-color-primary);
      }
    }
    &__search {
      padding: 6px 10px;
      border-bottom: 1px solid #ebeef5;
    }
    &__empty {
      padding: 12px;
      text-align: center;
      color: #909399;
      font-size: 12px;
    }
    &__label {
      flex: 1;
    }
    &__perf {
      margin-left: 8px;
      height: 18px;
      line-height: 18px;
      padding: 0 6px;
    }
    ::v-deep .el-dropdown-menu__item &__perf.el-tag {
      margin-left: 8px;
      height: 18px;
      line-height: 18px;
      padding: 0 6px;
    }
    &__actions {
      display: inline-flex;
      gap: 4px;
      margin-left: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    &__action {
      padding: 4px 6px;
      border-radius: 3px;
      font-size: 13px;
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.08);
        color: var(--leap-color-primary);
      }
      &--danger:hover {
        color: #f56c6c;
      }
    }
    ::v-deep .el-dropdown-menu__item:hover &__actions {
      opacity: 1;
    }
    ::v-deep .el-dropdown-menu__item.is-active {
      color: var(--leap-color-primary);
      background: #ecf5ff;
    }
  }
  .ais-table-c {
    height: calc(100% - 168px);
  }
  &.is-preset-locked {
    ::v-deep .ais-search-form {
      opacity: 0.6;
      pointer-events: none;
      transition: opacity 0.2s;
    }
  }
}
</style>
