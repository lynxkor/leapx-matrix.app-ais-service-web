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
      <el-form-item label="保修结算单">
        <tag-input
          v-model="form.settleCodeList"
          placeholder="请输入保修结算单号"
        />
      </el-form-item>
      <el-form-item label="门店：">
        <dealer-select v-model="form.dealerCodeList" multiple/>
      </el-form-item>
      <template v-if="show">
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
        <el-form-item label="创建时间">
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
      <el-button v-if="exportInvoice" :loading="exportLoading" size="small" @click="onExport">导出发票</el-button>
      <el-button v-if="canPayConfirm" size="small" @click="handleBatchPayConfirm">批量付款</el-button>
    </div>
    <div class="ais-table-c">
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
      @success="getData"
    />
    <InvoiceAcceptDialog
      :visible.sync="invoiceAcceptDialogVisible"
      :id="invoiceAcceptRowId"
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
      @success="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, confirm, exportInvoiceZip } from '@/api/claimreturn/claim/warrantysettle/index';
import { getTableConfig, tableAddOrUpdate, getEnum, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getEndOfDayString, downloadExcel } from '@/libs/utils';
import EditPage from './edit.vue';
import CompleteDialog from './components/CompleteDialog';
import InvoiceAcceptDialog from './components/InvoiceAcceptDialog';
import InvoiceReturnDialog from './components/InvoiceReturnDialog';
import PayConfirmDialog from './components/PayConfirmDialog';
import DealerSelect from '@/components/dealer-select';

const defaultForm = {
  settleCodeList: [],
  dealerCodeList: [],
  month: '',
  dealerNameList: [],
  storeStatusList: [],
  settleStatusList: [],
  invoiceAccountNameLike: '',
  createTime: '',
  updateTime: '',
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
        ...defaultForm
      },
      selectionList: [],
      show: false,
      loading: false,
      clickItemId: '',
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
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
      invoiceReturnDialogVisible: false,
      invoiceReturnRowId: '',
      payConfirmDialogVisible: false,
      payConfirmRowIds: [],
    };
  },
  computed: {
    optionObj () {
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
                  query: {
                    id: row.id
                  }
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
                click: (rowIndex, row) => {
                  this.handleConfirm(row);
                },
                type: 'info',
                show: (row) => {
                  // 待门店验证
                  return this.canConfirm && row.settleStatus === '10';
                }
              },
              {
                name: '开票完成',
                click: (rowIndex, row) => {
                  this.handleComplete(row);
                },
                type: 'info',
                show: (row) => {
                  // 待开票 已退回
                  return this.canComplete && (row.settleStatus === '60' || row.settleStatus === '110');
                }
              },
              {
                name: '发票验收',
                click: (rowIndex, row) => {
                  this.handleInvoiceAccept(row);
                },
                type: 'info',
                show: (row) => {
                  // 已开票
                  return this.canInvoiceAccept && row.settleStatus === '65';
                }
              },
              {
                name: '发票退回',
                click: (rowIndex, row) => {
                  this.handleInvoiceReturn(row);
                },
                type: 'info',
                show: (row) => {
                  // 已开票
                  return this.canInvoiceReturn && row.settleStatus === '65';
                }
              },
              {
                name: '确认付款',
                click: (rowIndex, row) => {
                  this.handlePayConfirm(row);
                },
                type: 'info',
                show: (row) => {
                  // 已验收
                  return this.canPayConfirm && row.settleStatus === '90';
                }
              }
            ]
          }
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
    console.log(this.permissions);
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
      this.payConfirmDialogVisible = true;
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
    exportExcel () {
      this.exportLoadingTable = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '保修结算通知书',
        dataFetchPath: 'claimreturn/claim/web/warrantysettle/warrantySettle/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '保修结算通知书.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelImportTask', '_blank'),
            { message: '正在导入中，是否要跳转"系统管理-文件管理-导入任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoadingTable = false;
      });
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

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
        }
      }
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = getEndOfDayString(this.form.updateTime[1]);
        }
      }

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
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
