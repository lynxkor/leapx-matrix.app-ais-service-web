<template>
  <div class="page-common m-recording-task-list">
    <div>
      <el-form
        :inline="true"
        :model="form"
        size="small"
        label-position="right"
        label-width="120px"
        class="ais-search-form"
      >
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
        <el-form-item label="单据类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="RecordingDocTypeEnum"
            v-model="form.docTypes"
            placeholder="请选择"
            clearable
            multiple
          />
        </el-form-item>
        <el-form-item label="单据编号" v-show="visibleCount === 3 || show">
          <el-input
            placeholder="请输入"
            v-model="form.docCodeLike"
            clearable
          />
        </el-form-item>
        <template v-if="show">
          <el-form-item label="关联施工单号">
            <el-input
              placeholder="请输入"
              v-model="form.serviceProxyCodeLike"
              clearable
            />
          </el-form-item>
          <el-form-item label="任务状态">
            <fetch-select
              :request="fetchOptions"
              enumCode="RecordingTaskStatusEnum"
              v-model="form.taskStatuses"
              placeholder="请选择"
              clearable
              multiple
            />
          </el-form-item>
          <el-form-item label="开启方式">
            <fetch-select
              :request="fetchOptions"
              enumCode="RecordingOpenTypeEnum"
              v-model="form.openTypes"
              placeholder="请选择"
              clearable
              multiple
            />
          </el-form-item>
          <el-form-item label="开单人">
            <el-input
              placeholder="请输入"
              v-model="form.openerLike"
              clearable
            />
          </el-form-item>
          <el-form-item label="开单门店">
            <el-select
              v-model="form.openDealerCodes"
              multiple
              filterable
              clearable
              remote
              collapse-tags
              placeholder="请选择"
              :remote-method="storeSearch"
              :loading="storeLoading"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="关闭原因">
            <fetch-select
              :request="fetchOptions"
              enumCode="RecordingCloseReasonEnum"
              v-model="form.closeReasons"
              placeholder="请选择"
              clearable
              multiple
            />
          </el-form-item>
          <el-form-item label="开启时间">
            <el-date-picker
              v-model="form.openTime"
              type="daterange"
              unlink-panels
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="计划关闭时间">
            <el-date-picker
              v-model="form.planCloseTime"
              type="daterange"
              unlink-panels
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="关闭成功时间">
            <el-date-picker
              v-model="form.closeSuccessTime"
              type="daterange"
              unlink-panels
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
      </div>
    </div>
    <div
      class="ais-table-c"
      :class="{ 'z-form-show': show }"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/maintain/basic/recordingTask/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getEndOfDayString, downloadExcel } from '@/libs/utils';

const DOC_TYPE_CONSTRUCTION = 1;

const defaultForm = {
  createTime: '',
  docTypes: [],
  docCodeLike: '',
  serviceProxyCodeLike: '',
  taskStatuses: [],
  openTypes: [],
  openerLike: '',
  openDealerCodes: [],
  closeReasons: [],
  openTime: '',
  planCloseTime: '',
  closeSuccessTime: ''
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
    FetchSelect
  },
  data () {
    return {
      pageTitle: '录音事件',
      pageType: 'list',
      form: { ...defaultForm },
      moduleKey: 'AISMC-recordingTask',
      show: false,
      loading: false,
      exportLoading: false,
      storeOptions: [],
      storeLoading: false,
      searchTimer: null,
      optionObj: {
        id: 'recordingTaskTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'docTypeLabel', label: '单据类型', visible: true, width: 100, fixed: 'left' },
          {
            props: 'docCode',
            label: '单据编号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => this.goDocDetail(row),
              type: 'primary'
            }]
          },
          {
            props: 'serviceProxyCode',
            label: '关联施工单号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => this.goServiceProxy(row),
              type: 'primary'
            }]
          },
          { props: 'openDealerName', label: '开单门店', visible: true, width: 200 },
          { props: 'opener', label: '开单人', visible: true, width: 120 },
          { props: 'taskId', label: '任务ID', visible: true, width: 280 },
          { props: 'openTypeLabel', label: '开启方式', visible: true, width: 100 },
          {
            props: 'taskStatusLabel',
            label: '任务状态',
            visible: true,
            width: 110,
            formatter: ({ row }) => {
              const label = row.taskStatusLabel || '';
              const failed = row.taskStatus === 2 || row.taskStatus === 5;
              return failed ? `<span style="color:#F56C6C;font-weight:600">${label}</span>` : label;
            }
          },
          { props: 'openTime', label: '开启时间', visible: true, width: 180 },
          { props: 'openSuccessTime', label: '开启成功时间', visible: true, width: 180 },
          { props: 'openFailTime', label: '开启失败时间', visible: true, width: 180 },
          { props: 'planCloseTime', label: '计划关闭时间', visible: true, width: 180 },
          { props: 'closeFailTime', label: '关闭失败时间', visible: true, width: 180 },
          { props: 'closeSuccessTime', label: '关闭成功时间', visible: true, width: 180 },
          { props: 'closeReasonLabel', label: '关闭原因', visible: true, width: 160 },
          { props: 'failReason', label: '失败原因', visible: true, width: 220, showOverflow: true },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 }
        ],
        total: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
    },
    goDocDetail (row) {
      if (row.docType === DOC_TYPE_CONSTRUCTION) {
        this.goServiceProxy(row);
      }
    },
    goServiceProxy (row) {
      if (!row.serviceProxyId) return;
      this.$router.push({
        path: '/maintain/sp/serviceProxy/edit',
        query: { id: row.serviceProxyId, isEditing: false }
      });
    },
    async storeSearch (query) {
      if (query !== '' && query.length < 2) {
        this.storeOptions = [];
        return;
      }
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(async () => {
        this.storeLoading = true;
        try {
          const res = await listOrgStoreInfo({ name: query });
          this.storeOptions = (res || []).map(item => ({
            value: item.orgCode,
            label: item.orgName
          }));
        } catch (e) {
          this.storeOptions = [];
        } finally {
          this.storeLoading = false;
        }
      }, 300);
    },
    getData () {
      this.loading = true;
      getList({
        ...this.getFormData(),
        pageNum: this.optionObj.form.page,
        pageSize: this.optionObj.form.size
      }).then(res => {
        this.optionObj.dataList = (res.records || []).map(item => ({ ...item }));
        this.optionObj.total = res.total;
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
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(data).forEach(key => {
        const val = data[key];
        if (val === '' || val === null || val === undefined) {
          delete data[key];
        } else if (Array.isArray(val) && val.length === 0) {
          delete data[key];
        }
      });

      if (this.form.createTime && this.form.createTime.length > 1) {
        delete data.createTime;
        data.createTimeStart = this.form.createTime[0];
        data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
      }
      this.assignDateRange(data, 'openTime', 'openTimeStart', 'openTimeEnd');
      this.assignDateRange(data, 'planCloseTime', 'planCloseTimeStart', 'planCloseTimeEnd');
      this.assignDateRange(data, 'closeSuccessTime', 'closeSuccessTimeStart', 'closeSuccessTimeEnd');

      return data;
    },
    assignDateRange (data, field, startKey, endKey) {
      const range = this.form[field];
      if (range && range.length > 1) {
        delete data[field];
        data[startKey] = range[0];
        data[endKey] = getEndOfDayString(range[1]);
      }
    },
    fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '录音事件',
        dataFetchPath: '/maintain/web/basic/recordingTask/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '录音事件.xlsx');
          } catch (e) {
            this.$message({ type: 'error', message: '文件导出失败' });
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-recording-task-list {
}
</style>
