<template>
  <div class="page-common m-warranty-settle-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <!-- 基础查询条件（始终可见） -->
      <el-form-item label="保修结算单">
        <tag-input
          v-model="form.settleCodeList"
          placeholder="请输入保修结算单号"
        />
      </el-form-item>
      <el-form-item label="门店：">
        <dealer-select v-model="form.dealerCodeList" multiple/>
      </el-form-item>
      <el-form-item label="订单创建时间">
        <el-date-picker
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

      <!-- 第一页签「保修结算通知书」扩展查询条件 -->
      <template v-if="show && activeTab === 'list'">
        <el-form-item label="月度">
          <el-input v-model="form.month" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="门店状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerStatusEnum"
            v-model="form.storeStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="通知书状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="settle_status"
            v-model="form.settleStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="收款方式">
          <fetch-select
            :request="fetchOptions"
            enumCode="payment_method"
            v-model="form.paymentMethodList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="银行户主">
          <el-input
            v-model="form.invoiceAccountNameLike"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
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
        <el-form-item label="发票验收日期">
          <el-date-picker
            v-model="form.invoiceCheckTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="付款确认日期">
          <el-date-picker
            v-model="form.paymentConfirmTime"
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

      <!-- 第二页签「通知书明细」扩展查询条件 -->
      <template v-if="show && activeTab === 'detail'">
        <el-form-item label="月度">
          <el-input v-model="form.month" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="门店状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerStatusEnum"
            v-model="form.storeStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="通知书状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="settle_status"
            v-model="form.settleStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="银行户主">
          <el-input
            v-model="form.invoiceAccountNameLike"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单修改时间">
          <el-date-picker
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
        <el-form-item label="保修申请单">
          <tag-input
            v-model="form.applyNoList"
            placeholder="请输入保修申请单号"
          />
        </el-form-item>
        <el-form-item label="保修类型">
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
        <el-form-item label="VIN">
          <tag-input
            v-model="form.vinList"
            placeholder="请输入VIN"
          />
        </el-form-item>
        <el-form-item label="发票验收日期">
          <el-date-picker
            v-model="form.invoiceCheckTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="付款确认日期">
          <el-date-picker
            v-model="form.paymentConfirmTime"
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

      <!-- 第三页签「追溯明细」扩展查询条件 -->
      <template v-if="show && activeTab === 'trace'">
        <el-form-item label="月度">
          <el-input v-model="form.month" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="门店状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerStatusEnum"
            v-model="form.storeStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="通知书状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="settle_status"
            v-model="form.settleStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="银行户主">
          <el-input
            v-model="form.invoiceAccountNameLike"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单修改时间">
          <el-date-picker
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
        <el-form-item label="追溯明细">
          <tag-input
            v-model="form.traceDetailCodeList"
            placeholder="请输入追溯明细单号"
          />
        </el-form-item>
        <el-form-item label="追溯类型">
          <el-select v-model="form.traceTypeList" placeholder="请选择" clearable multiple collapse-tags>
            <el-option label="索赔追溯" :value="'10'" />
            <el-option label="审计追溯" :value="'20'" />
          </el-select>
        </el-form-item>
        <el-form-item label="追溯业务单据">
          <tag-input
            v-model="form.businessCodeList"
            placeholder="请输入追溯业务单据"
          />
        </el-form-item>
        <el-form-item label="保修申请单">
          <tag-input
            v-model="form.applyNoList"
            placeholder="请输入保修申请单号"
          />
        </el-form-item>
        <el-form-item label="VIN">
          <tag-input
            v-model="form.vinList"
            placeholder="请输入VIN"
          />
        </el-form-item>
        <el-form-item label="发票验收日期">
          <el-date-picker
            v-model="form.invoiceCheckTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="付款确认日期">
          <el-date-picker
            v-model="form.paymentConfirmTime"
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

      <!-- 第四页签「开票明细」扩展查询条件 -->
      <template v-if="show && activeTab === 'invoice'">
        <el-form-item label="月度">
          <el-input v-model="form.month" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="门店状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerStatusEnum"
            v-model="form.storeStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="通知书状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="settle_status"
            v-model="form.settleStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="银行户主">
          <el-input
            v-model="form.invoiceAccountNameLike"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单修改时间">
          <el-date-picker
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
        <el-form-item label="发票号">
          <tag-input
            v-model="form.invoiceNoList"
            placeholder="请输入发票号"
          />
        </el-form-item>
        <el-form-item label="开票公司名称">
          <el-input v-model="form.invoiceCompanyName" placeholder="请输入开票公司名称" clearable/>
        </el-form-item>
        <el-form-item label="发票开具日期">
          <el-date-picker
            v-model="form.invoiceDate"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="发票验收日期">
          <el-date-picker
            v-model="form.invoiceCheckTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="付款确认日期">
          <el-date-picker
            v-model="form.paymentConfirmTime"
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
      <el-button v-if="canExport" :loading="exportLoadingTable" size="small" @click="exportExcel">导出</el-button>
      <template v-if="activeTab === 'list'">
        <el-button v-if="exportInvoice" :loading="exportLoading" size="small" @click="onExport">导出发票</el-button>
        <el-button v-if="canPayConfirm" size="small" @click="handleBatchPayConfirm">批量付款</el-button>
      </template>
    </div>

    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="保修结算通知书" name="list" />
      <el-tab-pane label="通知书明细" name="detail" />
      <el-tab-pane label="追溯明细" name="trace" />
      <el-tab-pane label="开票明细" name="invoice" />
    </el-tabs>

    <div class="ais-table-c">
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
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <CompleteDialog
      :visible.sync="completeDialogVisible"
      :id="completeRowId"
      :detailData="completeDetailData"
      :payment-method="completeDetailData.paymentMethod"
      @success="getData"
    />
    <InvoiceAcceptDialog
      :visible.sync="invoiceAcceptDialogVisible"
      :id="invoiceAcceptRowId"
      :payment-method="invoiceAcceptRow.paymentMethod"
      @success="getData"
    />
    <InvoiceReturnDialog
      :visible.sync="invoiceReturnDialogVisible"
      :id="invoiceReturnRowId"
      @success="getData"
    />
    <PayConfirmDialog
      :visible.sync="payConfirmDialogVisible"
      :ids="payConfirmRowIds"
      :payment-method="payConfirmRow.paymentMethod"
      @success="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, getDetailList, getTraceList, getInvoiceList, confirm, exportInvoiceZip } from '@/api/claimreturn/claim/warrantysettle/index';
import { getTableConfig, tableAddOrUpdate, getEnum, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getEndOfDayString, downloadExcel } from '@/libs/utils';
import { getTimeRangeByTypeFormat } from '@/libs/utils/time';
import { getDetailDecryptField } from '@/api/claimreturn/claim/warrantyapply/index';
import { getList as repairGetList } from '@/api/maintain/basic/repairItemType';
import EditPage from './edit.vue';
import CompleteDialog from './components/CompleteDialog';
import InvoiceAcceptDialog from './components/InvoiceAcceptDialog';
import InvoiceReturnDialog from './components/InvoiceReturnDialog';
import PayConfirmDialog from './components/PayConfirmDialog';
import DealerSelect from '@/components/dealer-select';

// 订单创建时间默认值：最近 1 个月（通知书明细页签）
function getDefaultCreateTime () {
  const { startTime, endTime } = getTimeRangeByTypeFormat('最近一个月');
  return [startTime, endTime];
}

const defaultForm = {
  settleCodeList: [],
  dealerCodeList: [],
  month: '',
  dealerNameList: [],
  storeStatusList: [],
  settleStatusList: [],
  paymentMethodList: [],
  invoiceAccountNameLike: '',
  createTime: '',
  updateTime: '',
  invoiceCheckTime: '',
  paymentConfirmTime: '',
  applyNoList: [],
  vinList: [],
  repairItemTypeIdList: [],
  // 追溯明细页签专属
  traceDetailCodeList: [],
  traceTypeList: [],
  businessCodeList: [],
  // 开票明细页签专属
  invoiceNoList: [],
  invoiceCompanyName: '',
  invoiceDate: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};
// {code: '10', message: '待门店验证'}
// {code: '60', message: '待开票'}
// {code: '65', message: '已开票'}
// {code: '90', message: '已验收'}
// {code: '100', message: '已付款'}
// {code: '110', message: '已退回'}

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    TagInput,
    EditPage,
    CompleteDialog,
    InvoiceAcceptDialog,
    InvoiceReturnDialog,
    PayConfirmDialog,
    DealerSelect,
  },
  data () {
    return {
      pageTitle: '保修结算通知书',
      pageType: 'list',
      moduleKey: 'AISCR-warrantySettle',
      form: {
        ...defaultForm,
        createTime: getDefaultCreateTime()
      },
      selectionList: [],
      show: false,
      loading: false,
      activeTab: 'list',
      clickItemId: '',
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      // 排序字段
      sortColumns: [
        { column: 'create_time', sort: 'DESC' }
      ],
      // 操作按钮权限
      canConfirm: false,
      canComplete: false,
      canInvoiceAccept: false,
      canInvoiceReturn: false,
      canPayConfirm: false,
      exportInvoice: false,
      exportLoading: false,
      exportLoadingTable: false,
      //
      completeDialogVisible: false,
      completeRowId: '',
      completeDetailData: {},
      invoiceAcceptDialogVisible: false,
      invoiceAcceptRowId: '',
      invoiceAcceptRow: {},
      invoiceReturnDialogVisible: false,
      invoiceReturnRowId: '',
      payConfirmDialogVisible: false,
      payConfirmRowIds: [],
      payConfirmRow: {},
    };
  },
  computed: {
    optionObj () {
      if (this.activeTab === 'detail') return this.optionObjDetail;
      if (this.activeTab === 'trace') return this.optionObjTrace;
      if (this.activeTab === 'invoice') return this.optionObjInvoice;
      return this.optionObjSettle;
    },
    optionObjSettle () {
      return {
        id: 'warrantySettleTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'settleCode',
            label: '保修结算单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantySettle/edit',
                  query: { id: row.id }
                });
              }
            }]
          },
          { props: 'month', label: '月度', visible: true, width: 120 },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                window.open(`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
              }
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'storeStatusLabel', label: '门店状态', visible: true, width: 120 },
          { props: 'settleStatusLabel', label: '通知书状态', visible: true, width: 120 },
          { props: 'paymentMethodLabel', label: '收款方式', visible: true, width: 120 },
          { props: 'invoiceAccountName', label: '银行户主', visible: true, width: 150 },
          {
            props: 'workHourTotal',
            label: '工时总额',
            visible: true,
            width: 120,
            formatter: (row) => this.formatAmount(row.workHourTotal),
            align: 'right'
          },
          {
            props: 'partTotal',
            label: '备件总额',
            visible: true,
            width: 120,
            formatter: (row) => this.formatAmount(row.partTotal),
            align: 'right'
          },
          {
            props: 'otherTotal',
            label: '其他总额',
            visible: true,
            width: 120,
            formatter: (row) => this.formatAmount(row.otherTotal),
            align: 'right'
          },
          {
            props: 'totalAmount',
            label: '总金额',
            visible: true,
            width: 120,
            formatter: (row) => this.formatAmount(row.totalAmount),
            align: 'right'
          },
          {
            props: 'tracebackAmount',
            label: '追溯金额',
            visible: true,
            width: 120,
            formatter: (row) => this.formatAmount(row.tracebackAmount),
            align: 'right'
          },
          {
            props: 'determineAmount',
            label: '判定金额',
            visible: true,
            width: 120,
            formatter: (row) => this.formatAmount(row.determineAmount),
            align: 'right'
          },
          {
            props: 'invoiceAmount13',
            label: '开票金额一 （13%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount13),
            align: 'right'
          },
          {
            props: 'invoiceAmount6',
            label: '开票金额二 （6%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount6),
            align: 'right'
          },
          { props: 'invoiceCheckTime', label: '发票验收日期', visible: true, width: 180 },
          { props: 'paymentConfirmTime', label: '付款确认日期', visible: true, width: 180 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 280,
            buttons: [
              {
                name: '确认',
                click: (rowIndex, row) => { this.handleConfirm(row); },
                type: 'info',
                show: (row) => this.canConfirm && row.settleStatus === '10'
              },
              {
                name: '开票完成',
                click: (rowIndex, row) => { this.handleComplete(row); },
                type: 'info',
                show: (row) => this.canComplete && (row.settleStatus === '60' || row.settleStatus === '110')
              },
              {
                name: '发票验收',
                click: (rowIndex, row) => { this.handleInvoiceAccept(row); },
                type: 'info',
                show: (row) => this.canInvoiceAccept && row.settleStatus === '65'
              },
              {
                name: '发票退回',
                click: (rowIndex, row) => { this.handleInvoiceReturn(row); },
                type: 'info',
                show: (row) => this.canInvoiceReturn && (row.settleStatus === '65' || row.settleStatus === '90')
              },
              {
                name: '确认付款',
                click: (rowIndex, row) => { this.handlePayConfirm(row); },
                type: 'info',
                show: (row) => this.canPayConfirm && row.settleStatus === '90'
              }
            ]
          }
        ],
        total: this.tableTotal
      };
    },
    optionObjDetail () {
      return {
        id: 'warrantySettleDetailTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'settleCode',
            label: '保修结算单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantySettle/edit',
                  query: { id: row.id }
                });
              }
            }]
          },
          { props: 'month', label: '月度', visible: true, width: 120 },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              }
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'storeStatusLabel', label: '门店状态', visible: true, width: 120 },
          { props: 'settleStatusLabel', label: '通知书状态', visible: true, width: 120 },
          { props: 'invoiceAccountName', label: '银行户主', visible: true, width: 150 },
          {
            props: 'workHourTotal',
            label: '结算工时总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.workHourTotal),
            align: 'right'
          },
          {
            props: 'partTotal',
            label: '结算备件总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.partTotal),
            align: 'right'
          },
          {
            props: 'otherTotal',
            label: '结算其他总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.otherTotal),
            align: 'right'
          },
          {
            props: 'totalAmount',
            label: '结算总金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.totalAmount),
            align: 'right'
          },
          {
            props: 'tracebackAmount',
            label: '追溯金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.tracebackAmount),
            align: 'right'
          },
          {
            props: 'determineAmount',
            label: '判定金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.determineAmount),
            align: 'right'
          },
          {
            props: 'invoiceAmount13',
            label: '开票金额一（13%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount13),
            align: 'right'
          },
          {
            props: 'invoiceAmount6',
            label: '开票金额二（6%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount6),
            align: 'right'
          },
          { props: 'invoiceCheckTime', label: '发票验收日期', visible: true, width: 180 },
          { props: 'paymentConfirmTime', label: '付款确认日期', visible: true, width: 180 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 180 },
          {
            props: 'applyNo',
            label: '保修申请单',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.warrantyApplyId),
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyApply/edit',
                  query: { id: row.warrantyApplyId }
                });
              }
            }]
          },
          { props: 'repairItemTypeName', label: '保修类型', visible: true, width: 140 },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.warrantyApplyId, 'vin'),
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.vehicleProfileId),
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/vehicleProfile/edit',
                  query: { id: row.vehicleProfileId }
                });
              }
            }]
          },
          {
            props: 'detailWorkHourTotal',
            label: '明细工时总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.detailWorkHourTotal),
            align: 'right'
          },
          {
            props: 'detailPartTotal',
            label: '明细备件总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.detailPartTotal),
            align: 'right'
          },
          {
            props: 'detailOtherTotal',
            label: '明细其他总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.detailOtherTotal),
            align: 'right'
          },
          {
            props: 'detailTotalAmount',
            label: '明细总金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.detailTotalAmount),
            align: 'right'
          },
          {
            props: 'detailDetermineAmount',
            label: '明细判定金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.detailDetermineAmount),
            align: 'right'
          }
        ],
        total: this.tableTotal
      };
    },
    optionObjTrace () {
      return {
        id: 'warrantySettleTraceTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'settleCode',
            label: '保修结算单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantySettle/edit',
                  query: { id: row.id }
                });
              }
            }]
          },
          { props: 'month', label: '月度', visible: true, width: 120 },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              }
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'storeStatusLabel', label: '门店状态', visible: true, width: 120 },
          { props: 'settleStatusLabel', label: '通知书状态', visible: true, width: 120 },
          { props: 'invoiceAccountName', label: '银行户主', visible: true, width: 150 },
          {
            props: 'workHourTotal',
            label: '结算工时总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.workHourTotal),
            align: 'right'
          },
          {
            props: 'partTotal',
            label: '结算备件总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.partTotal),
            align: 'right'
          },
          {
            props: 'otherTotal',
            label: '结算其他总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.otherTotal),
            align: 'right'
          },
          {
            props: 'totalAmount',
            label: '结算总金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.totalAmount),
            align: 'right'
          },
          {
            props: 'tracebackAmount',
            label: '追溯金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.tracebackAmount),
            align: 'right'
          },
          {
            props: 'determineAmount',
            label: '判定金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.determineAmount),
            align: 'right'
          },
          {
            props: 'invoiceAmount13',
            label: '开票金额一（13%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount13),
            align: 'right'
          },
          {
            props: 'invoiceAmount6',
            label: '开票金额二（6%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount6),
            align: 'right'
          },
          { props: 'invoiceCheckTime', label: '发票验收日期', visible: true, width: 180 },
          { props: 'paymentConfirmTime', label: '付款确认日期', visible: true, width: 180 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 180 },
          { props: 'traceDetailCode', label: '追溯明细', visible: true, width: 180 },
          {
            props: 'traceTypeLabel',
            label: '追溯类型',
            visible: true,
            width: 120
          },
          {
            props: 'businessCode',
            label: '追溯业务单据',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.businessId),
              click: (rowIndex, row) => {
                // 追溯业务单据：10=索赔追溯 -> 索赔追溯详情；20=审计追溯 -> 审计详情
                const path = row.traceType === '10'
                  ? '/claimreturn/claim/claimtrace/claimTraceOrder/edit'
                  : '/claimreturn/claim/warrantyaudit/warrantyAudit/edit';
                this.$router.push({
                  path,
                  query: { id: row.businessId }
                });
              }
            }]
          },
          {
            props: 'applyNo',
            label: '保修申请单',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.warrantyApplyId),
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyApply/edit',
                  query: { id: row.warrantyApplyId }
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
            getValue: (row) => getDetailDecryptField(row.warrantyApplyId, 'vin'),
            buttons: [{
              type: 'primary',
              show: (row) => Boolean(row.vehicleProfileId),
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/vehicleProfile/edit',
                  query: { id: row.vehicleProfileId }
                });
              }
            }]
          },
          {
            props: 'currentTraceAmount',
            label: '本次追溯金额',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.currentTraceAmount),
            align: 'right'
          }
        ],
        total: this.tableTotal
      };
    },
    optionObjInvoice () {
      return {
        id: 'warrantySettleInvoiceTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'settleCode',
            label: '保修结算单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantySettle/edit',
                  query: { id: row.id }
                });
              }
            }]
          },
          { props: 'month', label: '月度', visible: true, width: 120 },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              }
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'storeStatusLabel', label: '门店状态', visible: true, width: 120 },
          { props: 'settleStatusLabel', label: '通知书状态', visible: true, width: 120 },
          { props: 'invoiceAccountName', label: '银行户主', visible: true, width: 150 },
          {
            props: 'workHourTotal',
            label: '结算工时总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.workHourTotal),
            align: 'right'
          },
          {
            props: 'partTotal',
            label: '结算备件总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.partTotal),
            align: 'right'
          },
          {
            props: 'otherTotal',
            label: '结算其他总额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.otherTotal),
            align: 'right'
          },
          {
            props: 'totalAmount',
            label: '结算总金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.totalAmount),
            align: 'right'
          },
          {
            props: 'tracebackAmount',
            label: '追溯金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.tracebackAmount),
            align: 'right'
          },
          {
            props: 'determineAmount',
            label: '判定金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.determineAmount),
            align: 'right'
          },
          {
            props: 'invoiceAmount13',
            label: '开票金额一（13%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount13),
            align: 'right'
          },
          {
            props: 'invoiceAmount6',
            label: '开票金额二（6%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount6),
            align: 'right'
          },
          { props: 'invoiceCheckTime', label: '发票验收日期', visible: true, width: 180 },
          { props: 'paymentConfirmTime', label: '付款确认日期', visible: true, width: 180 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 180 },
          { props: 'invoiceNo', label: '发票号', visible: true, width: 200 },
          { props: 'invoiceCompanyName', label: '开票公司名称', visible: true, width: 200 },
          { props: 'invoiceDate', label: '发票开具日期', visible: true, width: 180 },
          {
            props: 'amount',
            label: '发票金额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.amount),
            align: 'right'
          },
          {
            props: 'taxRate',
            label: '发票税点',
            visible: true,
            width: 120,
            align: 'right'
          },
          {
            props: 'noTaxAmount',
            label: '发票不含税金额',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.noTaxAmount),
            align: 'right'
          },
          {
            props: 'taxAmount',
            label: '发票税额',
            visible: true,
            width: 140,
            formatter: (row) => this.formatAmount(row.taxAmount),
            align: 'right'
          },
          { props: 'invoiceCreateTime', label: '发票创建时间', visible: true, width: 180 }
        ],
        total: this.tableTotal
      };
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.canConfirm = this.permissions.has(`${this.moduleKey}-confirm`);
    this.canComplete = this.permissions.has(`${this.moduleKey}-completeInvoice`);
    this.canInvoiceAccept = this.permissions.has(`${this.moduleKey}-acceptInvoice`);
    this.canInvoiceReturn = this.permissions.has(`${this.moduleKey}-returnInvoice`);
    this.canPayConfirm = this.permissions.has(`${this.moduleKey}-confirmPay`);
    this.exportInvoice = this.permissions.has(`${this.moduleKey}-exportInvoice`);
  },
  methods: {
    // 格式化金额
    formatAmount (amount) {
      if (amount === null || amount === undefined) {
        return '0.00';
      }
      return Number(amount).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    // 确认
    handleConfirm (row) {
      this.$confirm('确认保修结算通知书?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirm(row.id).then(() => {
          this.$message.success('确认成功');
          this.getData();
        });
      }).catch(() => {});
    },
    // 开票完成
    handleComplete (row) {
      this.completeRowId = row.id;
      this.completeDetailData = row;
      this.completeDialogVisible = true;
    },
    // 发票验收
    handleInvoiceAccept (row) {
      this.invoiceAcceptRowId = row.id;
      this.invoiceAcceptRow = row;
      this.invoiceAcceptDialogVisible = true;
    },
    // 发票退回
    handleInvoiceReturn (row) {
      this.invoiceReturnRowId = row.id;
      this.invoiceReturnDialogVisible = true;
    },
    // 确认付款
    handlePayConfirm (row) {
      this.payConfirmRowIds = [row.id];
      this.payConfirmRow = row;
      this.payConfirmDialogVisible = true;
    },
    // 批量付款
    handleBatchPayConfirm () {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择需要付款的单据');
        return;
      }
      const invalidStatuses = this.selectionList.filter(item => item.settleStatus !== '90');
      if (invalidStatuses.length > 0) {
        this.$message.warning('只能选择已验收的单据');
        return;
      }
      this.payConfirmRowIds = this.selectionList.map(item => item.id);
      this.payConfirmRow = {};
      this.payConfirmDialogVisible = true;
    },
    /**
     * 校验日期范围跨度（detail tab 的 createTime 上限半年）
     */
    validateDateSpan (dateRange, fieldName, maxDays = 365) {
      if (dateRange?.length > 1) {
        const span = new Date(dateRange[1]).getTime() - new Date(dateRange[0]).getTime();
        if (span > maxDays * 24 * 60 * 60 * 1000) {
          this.$message.warning(`${fieldName}范围不能超过 ${maxDays === 183 ? '半年' : maxDays + ' 天'}`);
          return false;
        }
      }
      return true;
    },
    onSubmit () {
      if (this.activeTab === 'detail' || this.activeTab === 'trace' || this.activeTab === 'invoice') {
        // 通知书明细 / 追溯明细 / 开票明细：3 项必填校验
        const hasSettleCode = this.form.settleCodeList?.length > 0;
        const hasDealer = this.form.dealerCodeList?.length > 0;
        const hasCreateTime = this.form.createTime && this.form.createTime.length > 0;
        if (!hasSettleCode && !hasDealer && !hasCreateTime) {
          this.$message.warning('【保修结算单】【门店编码】【订单创建时间】不允许都为空');
          return;
        }
        // detail/trace/invoice tab 的 createTime 上限 183 天
        if (!this.validateDateSpan(this.form.createTime, '订单创建时间', 183)) return;
      }
      // 其余日期上限 365 天
      if (!this.validateDateSpan(this.form.updateTime, '订单修改时间')) return;
      if (!this.validateDateSpan(this.form.invoiceCheckTime, '发票验收日期')) return;
      if (!this.validateDateSpan(this.form.paymentConfirmTime, '付款确认日期')) return;
      // invoice tab 的发票开具日期校验
      if (!this.validateDateSpan(this.form.invoiceDate, '发票开具日期')) return;

      this.tableForm.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm, createTime: getDefaultCreateTime() };
      this.tableForm.page = 1;
      this.tableForm.pageSize = pageSize;
      this.getData();
    },
    handleTabChange () {
      this.tableForm.page = 1;
      this.getData();
    },
    exportExcel () {
      this.exportLoadingTable = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        // 通知书明细 / 追溯明细 / 开票明细 三个页签的 row 是「结算单 × 明细」的 JOIN 行，
        // row.id 是结算单主键；按 id 过滤会导致 JOIN 后膨胀成多行。
        // 这里按各页签对应明细主键过滤，与后端 mapper 中
        // `wscd.id / ctd.id / wsir.id IN (...)` 配套。
        // 「保修结算通知书」主页签不是 JOIN 视图，按 id 过滤。
        const detailIdFieldMap = {
          detail: 'claimDetailId',
          trace: 'traceDetailId',
          invoice: 'invoiceRecordId'
        };
        const idField = detailIdFieldMap[this.activeTab] || 'id';
        const ids = this.selectionList.map(item => item[idField]) || [];
        reqParams.ids = ids;
      }
      // 通用导出微服务回调后端分页接口时不会自动补 pageNum/pageSize；
      // 后端新接口（detailPage/tracePage/invoicePage）使用 `new Page<>(qo.getPageNum(), qo.getPageSize())`，
      // pageNum=null 时会因 long 自动拆箱抛出 NPE → 500。
      // 这里主动补 pageNum=1, pageSize 设为较大值，让新接口一次拿到全量数据用于导出。
      reqParams.pageNum = reqParams.pageNum || 1;
      reqParams.pageSize = reqParams.pageSize || 99999;
      // 按当前页签分发到对应的分页接口（包含 JOIN 后的完整字段）
      const tabExportMap = {
        list: {
          dataFetchPath: 'claimreturn/claim/web/warrantysettle/warrantySettle/page',
          businessType: '保修结算通知书',
          fileName: '保修结算通知书.xlsx'
        },
        detail: {
          dataFetchPath: 'claimreturn/claim/web/warrantysettle/warrantySettle/detailPage',
          businessType: '保修结算通知书明细',
          fileName: '保修结算通知书明细.xlsx'
        },
        trace: {
          dataFetchPath: 'claimreturn/claim/web/warrantysettle/warrantySettle/tracePage',
          businessType: '保修结算追溯明细',
          fileName: '保修结算追溯明细.xlsx'
        },
        invoice: {
          dataFetchPath: 'claimreturn/claim/web/warrantysettle/warrantySettle/invoicePage',
          businessType: '保修结算开票明细',
          fileName: '保修结算开票明细.xlsx'
        }
      };
      const { dataFetchPath, businessType, fileName } = tabExportMap[this.activeTab] || tabExportMap.list;
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
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoadingTable = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      const reqData = { ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size };
      let apiCall;
      if (this.activeTab === 'detail') {
        apiCall = getDetailList(reqData);
      } else if (this.activeTab === 'trace') {
        apiCall = getTraceList(reqData);
      } else if (this.activeTab === 'invoice') {
        apiCall = getInvoiceList(reqData);
      } else {
        apiCall = getList(reqData);
      }
      apiCall
        .then(res => {
          this.tableDataList = (res?.records || []).map(item => ({
            ...item,
            deleteLoading: false
          }));
          this.tableTotal = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
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
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });

      // 日期区间拆分
      const splitDate = (key) => {
        if (this.form[key]) {
          delete data[key];
          if (this.form[key].length > 1) {
            data[`${key}Start`] = this.form[key][0];
            data[`${key}End`] = getEndOfDayString(this.form[key][1]);
          }
        }
      };
      splitDate('createTime');
      splitDate('updateTime');
      splitDate('invoiceCheckTime');
      splitDate('paymentConfirmTime');
      splitDate('invoiceDate');

      // 按页签清理专属参数
      const detailOnlyKeys = [
        'applyNoList', 'vinList', 'repairItemTypeIdList', 'dealerNameList'
      ];
      const traceOnlyKeys = [
        'traceDetailCodeList', 'traceTypeList', 'businessCodeList'
      ];
      const invoiceOnlyKeys = [
        'invoiceNoList', 'invoiceCompanyName', 'invoiceDateStart', 'invoiceDateEnd'
      ];
      if (this.activeTab === 'list') {
        detailOnlyKeys.forEach(key => delete data[key]);
        traceOnlyKeys.forEach(key => delete data[key]);
        invoiceOnlyKeys.forEach(key => delete data[key]);
      } else if (this.activeTab === 'detail') {
        traceOnlyKeys.forEach(key => delete data[key]);
        invoiceOnlyKeys.forEach(key => delete data[key]);
      } else if (this.activeTab === 'trace') {
        // trace tab 不需要保修类型筛选
        delete data.repairItemTypeIdList;
        invoiceOnlyKeys.forEach(key => delete data[key]);
      } else if (this.activeTab === 'invoice') {
        detailOnlyKeys.forEach(key => delete data[key]);
        traceOnlyKeys.forEach(key => delete data[key]);
      }

      // 排序
      data.sortColumns = this.sortColumns;

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 保修类型远程搜索（与 warrantyapply/index.vue 一致）
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
    onExport () {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择需要导出发票的保修结算通知书记录');
        return;
      }
      const invalidStatuses = ['10', '60', '110'];
      const hasInvalidStatus = this.selectionList.some(item => invalidStatuses.includes(item.settleStatus));
      if (hasInvalidStatus) {
        this.$message.warning('只允许选择通知书状态为已开票或已验收或已付款的记录');
        return;
      }
      const ids = this.selectionList.map(item => item.id);
      this.exportLoading = true;
      exportInvoiceZip({ ids })
        .then(() => {
          this.$message.success('导出请求成功，请到系统管理-文件管理-下载管理下载导出文件');
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-warranty-settle-list {
}
</style>
