<template>
  <div class="page-common m-claim-trace-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="索赔追溯单">
        <tag-input v-model="form.claimTraceCodes" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="保修申请单">
        <tag-input v-model="form.warrantyCodes" placeholder="请输入"/>
      </el-form-item>
      <template v-if="show">
        <el-form-item label="追溯状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="claim_trace_status"
          v-model="form.traceStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
        <el-form-item label="VIN 码">
          <tag-input v-model="form.vins" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="门店编码">
          <dealer-select v-model="form.dealerCodes" multiple/>
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
        <el-form-item label="计划追溯金额">
          <el-input
            placeholder="开始金额"
            v-model="form.planTraceAmountStart"
            clearable
            style="width: 130px;"
          />
          <span style="margin: 0 10px;">至</span>
          <el-input
            placeholder="结束金额"
            v-model="form.planTraceAmountEnd"
            clearable
            style="width: 130px;"
          />
        </el-form-item>
        <el-form-item label="已追溯金额">
          <el-input
            placeholder="开始金额"
            v-model="form.tracedAmountStart"
            clearable
            style="width: 130px;"
          />
          <span style="margin: 0 10px;">至</span>
          <el-input
            placeholder="结束金额"
            v-model="form.tracedAmountEnd"
            clearable
            style="width: 130px;"
          />
        </el-form-item>
        <el-form-item label="未追溯金额">
          <el-input
            placeholder="开始金额"
            v-model="form.unTraceAmountStart"
            clearable
            style="width: 130px;"
          />
          <span style="margin: 0 10px;">至</span>
          <el-input
            placeholder="结束金额"
            v-model="form.unTraceAmountEnd"
            clearable
            style="width: 130px;"
          />
        </el-form-item>
        <el-form-item label="首次下发时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.firstIssueTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="最新下发时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.latestIssueTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="系统自动同意日期">
          <el-date-picker
            v-model="form.sysAutoAgreeDate"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="同意追溯时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.agreeTraceTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-form-item label="修改时间">
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
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="permissions.has(`${moduleKey}-submitForAudit`)" size="small" @click="handleBatchSubmitForAudit">批量审核下发</el-button>
      <el-button v-if="permissions.has(`${moduleKey}-cancel`)" size="small" @click="handleBatchCancel">批量作废</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
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
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      id="claimTraceOrderImportTemplate"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
    <!-- 列表页弹窗 -->
    <SubmitAuditDialog
      :visible.sync="submitAuditDialogVisible"
      :traceOrderId="currentRow.id"
      :traceOrderIds="batchSubmitForAuditIds"
      :batchMode="batchSubmitForAuditMode"
      :formData="currentRow"
      @success="getData"
    />
    <CancelOrderDialog
      :visible.sync="cancelOrderDialogVisible"
      :traceOrderId="currentRow.id"
      :traceOrderIds="batchCancelIds"
      :batchMode="batchCancelMode"
      @success="getData"
    />
    <!--
      【已废弃-2026-07-24】rejectForModify 接口废弃：【审核中】状态在新流程中永远不会出现，请使用 submitForAudit 替代。
    <RejectModifyDialog
      :visible.sync="rejectModifyDialogVisible"
      :traceOrderId="currentRow.id"
      @success="getData"
    />
    -->
    <AppealDialog
      :visible.sync="appealDialogVisible"
      :traceOrderId="currentRow.id"
      @success="getData"
    />
    <AgreeAppealDialog
      :visible.sync="agreeAppealDialogVisible"
      :traceOrderId="currentRow.id"
      @success="getData"
    />
    <RejectAppealDialog
      :visible.sync="rejectAppealDialogVisible"
      :traceOrderId="currentRow.id"
      :formData="currentRow"
      @success="getData"
    />
    <RefuseAppealDialog
      :visible.sync="refuseAppealDialogVisible"
      :traceOrderId="currentRow.id"
      @success="getData"
    />
    <AdjustAmountDialog
      :visible.sync="adjustAmountDialogVisible"
      :traceOrderId="currentRow.id"
      :formData="currentRow"
      @success="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, enableItem, agreeTrace, getDetailDecryptField } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getAllRegion } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';
import { TRACE_STATUS } from './constant';
import SubmitAuditDialog from './components/SubmitAuditDialog';
import CancelOrderDialog from './components/CancelOrderDialog';
import AppealDialog from './components/AppealDialog';
import AgreeAppealDialog from './components/AgreeAppealDialog';
import RejectAppealDialog from './components/RejectAppealDialog';
import RefuseAppealDialog from './components/RefuseAppealDialog';
import AdjustAmountDialog from './components/AdjustAmountDialog';
const defaultForm = {
  claimTraceCodes: [],
  traceStatusList: [],
  warrantyCodes: [],
  vins: [],
  dealerCodes: [],
  dealerRegionCodeList: [],
  dealerName: '',
  planTraceAmountStart: '',
  planTraceAmountEnd: '',
  tracedAmountStart: '',
  tracedAmountEnd: '',
  unTraceAmountStart: '',
  unTraceAmountEnd: '',
  firstIssueTime: '',
  latestIssueTime: '',
  sysAutoAgreeDate: '',
  agreeTraceTime: '',
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
    TagInput,
    DealerSelect,
    Upload,
    SubmitAuditDialog,
    CancelOrderDialog,
    AppealDialog,
    AgreeAppealDialog,
    RejectAppealDialog,
    RefuseAppealDialog,
    AdjustAmountDialog,
  },
  data () {
    return {
      pageTitle: '索赔追溯单',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-claimTraceOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      regionSelectKey: 0,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      currentRow: {},
      submitAuditDialogVisible: false,
      batchSubmitForAuditMode: false,
      batchSubmitForAuditIds: [],
      cancelOrderDialogVisible: false,
      batchCancelMode: false,
      batchCancelIds: [],
      rejectModifyDialogVisible: false,
      appealDialogVisible: false,
      agreeAppealDialogVisible: false,
      rejectAppealDialogVisible: false,
      refuseAppealDialogVisible: false,
      adjustAmountDialogVisible: false,
      optionObj: {
        id: 'claimTraceOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'claimTraceCode',
            label: '索赔追溯单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/claimtrace/claimTraceOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'traceStatusLabel', label: '追溯状态', visible: true, width: 120 },
          {
            props: 'warrantyCode',
            label: '保修申请单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.warrantyId) {
                  window.open(`/service/claimreturn/claim/warrantyApply/edit?id=${row.warrantyId}`, '_blank');
                }
              },
              type: 'primary'
            }]
          },
          {
            props: 'vin',
            label: 'VIN 码',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDetailDecryptField(row.id, 'vin'),
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/datacenter/vehicle/vehicleProfile/edit?id=${row.vehicleProfileId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'dealerRegionName', label: '门店所属区域', visible: true, width: 140 },
          { props: 'laborClaimTotal', label: '保修工时金额', visible: true, width: 160, align: 'right' },
          { props: 'partsClaimTotal', label: '保修备件金额', visible: true, width: 160, align: 'right' },
          { props: 'otherClaimTotal', label: '保修其他金额', visible: true, width: 160, align: 'right' },
          { props: 'planTraceAmount', label: '计划追溯金额', visible: true, width: 160, align: 'right' },
          { props: 'tracedAmount', label: '已追溯金额', visible: true, width: 160, align: 'right' },
          { props: 'unTraceAmount', label: '未追溯金额', visible: true, width: 160, align: 'right' },
          { props: 'firstIssueTime', label: '首次下发时间', visible: true, width: 200 },
          { props: 'latestIssueTime', label: '最新下发时间', visible: true, width: 200 },
          { props: 'sysAutoAgreeDate', label: '系统自动同意日期', visible: true, width: 200 },
          { props: 'agreeTraceTime', label: '同意追溯时间', visible: true, width: 200 },
          { props: 'traceDesc', label: '追溯说明', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 200,
            buttons: [
              {
                name: '编辑',
                show: (row) => [TRACE_STATUS.DRAFT, TRACE_STATUS.REJECTED, TRACE_STATUS.AUDITING].includes(row.traceStatus),
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/claimreturn/claim/claimtrace/claimTraceOrder/edit',
                    query: { id: row.id, isEditing: true }
                  });
                },
                type: 'info'
              },
              {
                name: '审核下发',
                show: (row) => this.permissions.has(`${this.moduleKey}-submitForAudit`) && [TRACE_STATUS.DRAFT, TRACE_STATUS.REJECTED].includes(row.traceStatus),
                click: (rowIndex, row) => {
                  this.currentRow = row;
                  this.batchSubmitForAuditMode = false;
                  this.batchSubmitForAuditIds = [];
                  this.submitAuditDialogVisible = true;
                },
                type: 'info'
              },
              {
                name: '作废',
                show: (row) => this.permissions.has(`${this.moduleKey}-cancel`) && [TRACE_STATUS.DRAFT, TRACE_STATUS.REJECTED].includes(row.traceStatus),
                click: (rowIndex, row) => {
                  this.currentRow = row;
                  this.batchCancelMode = false;
                  this.batchCancelIds = [];
                  this.cancelOrderDialogVisible = true;
                },
                type: 'info'
              },
              {
                name: '调整索赔金额',
                show: (row) => this.permissions.has(`${this.moduleKey}-adjustTraceAmount`) && [TRACE_STATUS.DRAFT, TRACE_STATUS.REJECTED, TRACE_STATUS.APPEALING].includes(row.traceStatus),
                click: (rowIndex, row) => {
                  this.currentRow = row;
                  this.adjustAmountDialogVisible = true;
                },
                type: 'info'
              },
              /*
               * 【已废弃-2026-07-24】agreeIssue 接口废弃：【审核中】状态在新流程中永远不会出现，请使用 submitForAudit 替代。
               */
              // {
              //   name: '同意下发',
              //   show: (row) => this.permissions.has(`${this.moduleKey}-agreeIssue`) && row.traceStatus === TRACE_STATUS.AUDITING,
              //   click: (rowIndex, row) => {
              //     this.handleAgreeIssue(row);
              //   },
              //   type: 'info'
              // },
              /*
               * 【已废弃-2026-07-24】rejectForModify 接口废弃：【审核中】状态在新流程中永远不会出现，请使用 submitForAudit 替代。
               */
              // {
              //   name: '驳回修改',
              //   show: (row) => this.permissions.has(`${this.moduleKey}-rejectForModify`) && row.traceStatus === TRACE_STATUS.AUDITING,
              //   click: (rowIndex, row) => {
              //     this.currentRow = row;
              //     this.rejectModifyDialogVisible = true;
              //   },
              //   type: 'info'
              // },
              {
                name: '同意追溯',
                show: (row) => this.permissions.has(`${this.moduleKey}-agreeTrace`) && (row.traceStatus === TRACE_STATUS.PENDING_CONFIRM || row.traceStatus === TRACE_STATUS.APPEAL_REJECTED),
                click: (rowIndex, row) => {
                  this.handleAgreeTrace(row);
                },
                type: 'info'
              },
              {
                name: '申诉',
                show: (row) => this.permissions.has(`${this.moduleKey}-appeal`) && (row.traceStatus === TRACE_STATUS.PENDING_CONFIRM || row.traceStatus === TRACE_STATUS.APPEAL_REJECTED),
                click: (rowIndex, row) => {
                  this.currentRow = row;
                  this.appealDialogVisible = true;
                },
                type: 'info'
              },
              {
                name: '同意申诉',
                show: (row) => this.permissions.has(`${this.moduleKey}-agreeAppeal`) && row.traceStatus === TRACE_STATUS.APPEALING,
                click: (rowIndex, row) => {
                  this.currentRow = row;
                  this.agreeAppealDialogVisible = true;
                },
                type: 'info'
              },
              {
                name: '驳回申诉',
                show: (row) => this.permissions.has(`${this.moduleKey}-rejectAppeal`) && row.traceStatus === TRACE_STATUS.APPEALING,
                click: (rowIndex, row) => {
                  this.currentRow = row;
                  this.rejectAppealDialogVisible = true;
                },
                type: 'info'
              },
              {
                name: '拒绝申诉',
                show: (row) => this.permissions.has(`${this.moduleKey}-rejectForAppeal`) && row.traceStatus === TRACE_STATUS.APPEALING,
                click: (rowIndex, row) => {
                  this.currentRow = row;
                  this.refuseAppealDialogVisible = true;
                },
                type: 'info'
              }
            ]
          }
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
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
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/claimreturn/claim/claimtrace/claimTraceOrder/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this._scopeTypeOrgCache = null;
      this.regionSelectKey++;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '索赔追溯单',
        dataFetchPath: 'claimreturn/claim/web/claimtrace/claimTraceOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '索赔追溯单.xlsx');
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
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = (res?.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('列表数据加载失败:', err);
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
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
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
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      if (this.form.firstIssueTime) {
        delete data.firstIssueTime;
        if (this.form.firstIssueTime.length > 1) {
          data.firstIssueTimeStart = this.form.firstIssueTime[0];
          data.firstIssueTimeEnd = this.form.firstIssueTime[1];
        }
      }

      if (this.form.latestIssueTime) {
        delete data.latestIssueTime;
        if (this.form.latestIssueTime.length > 1) {
          data.latestIssueTimeStart = this.form.latestIssueTime[0];
          data.latestIssueTimeEnd = this.form.latestIssueTime[1];
        }
      }

      if (this.form.sysAutoAgreeDate) {
        delete data.sysAutoAgreeDate;
        if (this.form.sysAutoAgreeDate.length > 1) {
          data.sysAutoAgreeDateStart = this.form.sysAutoAgreeDate[0];
          data.sysAutoAgreeDateEnd = this.form.sysAutoAgreeDate[1];
        }
      }

      if (this.form.agreeTraceTime) {
        delete data.agreeTraceTime;
        if (this.form.agreeTraceTime.length > 1) {
          data.agreeTraceTimeStart = this.form.agreeTraceTime[0];
          data.agreeTraceTimeEnd = this.form.agreeTraceTime[1];
        }
      }

      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }

      // 计划追溯金额区间
      if (this.form.planTraceAmountStart) {
        data.planTraceAmountStart = this.form.planTraceAmountStart;
      }
      if (this.form.planTraceAmountEnd) {
        data.planTraceAmountEnd = this.form.planTraceAmountEnd;
      }
      // 已追溯金额区间
      if (this.form.tracedAmountStart) {
        data.tracedAmountStart = this.form.tracedAmountStart;
      }
      if (this.form.tracedAmountEnd) {
        data.tracedAmountEnd = this.form.tracedAmountEnd;
      }
      // 未追溯金额区间
      if (this.form.unTraceAmountStart) {
        data.unTraceAmountStart = this.form.unTraceAmountStart;
      }
      if (this.form.unTraceAmountEnd) {
        data.unTraceAmountEnd = this.form.unTraceAmountEnd;
      }
      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
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
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    },
    /*
     * 【已废弃-2026-07-24】agreeIssue 接口废弃：【审核中】状态在新流程中永远不会出现，请使用 submitForAudit 替代。
    handleAgreeIssue (row) {
      this.$confirm('确定同意下发？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agreeIssue(row.id).then(() => {
          this.$message.success('同意下发成功');
          this.getData();
        });
      }).catch(() => {});
    },
    */
    handleBatchSubmitForAudit () {
      if (!this.selectionList.length) {
        this.$message.warning('请选择需要下发的记录');
        return;
      }
      // 仅允许下发草稿或已驳回状态的追溯单
      const notAllowed = this.selectionList.filter(
        item => ![TRACE_STATUS.DRAFT, TRACE_STATUS.REJECTED].includes(item.traceStatus)
      );
      if (notAllowed.length > 0) {
        this.$message.warning('只允许下发草稿或已驳回状态的追溯单');
        return;
      }
      this.currentRow = {};
      this.batchSubmitForAuditMode = true;
      this.batchSubmitForAuditIds = this.selectionList.map(item => item.id);
      this.submitAuditDialogVisible = true;
    },
    handleBatchCancel () {
      if (!this.selectionList.length) {
        this.$message.warning('请选择需要作废的记录');
        return;
      }
      // 仅允许作废草稿或已驳回状态的追溯单
      const notAllowed = this.selectionList.filter(
        item => ![TRACE_STATUS.DRAFT, TRACE_STATUS.REJECTED].includes(item.traceStatus)
      );
      if (notAllowed.length > 0) {
        this.$message.warning('只允许作废草稿或驳回状态的追溯单');
        return;
      }
      this.currentRow = {};
      this.batchCancelMode = true;
      this.batchCancelIds = this.selectionList.map(item => item.id);
      this.cancelOrderDialogVisible = true;
    },
    handleAgreeTrace (row) {
      this.$confirm('确定同意追溯？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agreeTrace(row.id).then(() => {
          this.$message.success('同意追溯成功');
          this.getData();
        });
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.m-claim-trace-order-list {
}
</style>
