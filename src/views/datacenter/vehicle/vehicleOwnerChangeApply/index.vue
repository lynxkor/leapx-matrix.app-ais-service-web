<template>
  <div class="page-common m-vehicle-owner-change-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="申请单号">
        <tag-input v-model="form.applyNoList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="申请状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="owner_change_apply_status"
          v-model="form.applyStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="业务类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="vehicle_owner_change_type"
          v-model="form.businessTypeList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="vin">
          <tag-input v-model="form.vinList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="门店：">
          <dealer-select v-model="form.dealerCodeList" placeholder="请输入门店编码或名称" multiple/>
        </el-form-item>
        <el-form-item label="车型">
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
        <el-form-item label="数据来源">
          <fetch-select
            :request="fetchOptions"
            enumCode="dataSource"
            v-model="form.dataSourceList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.applyTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="审批时间">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.auditTime"
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
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
    <form-cancel-dialog
      :visible.sync="visible"
      :id="cancelId"
      @update="getData"
    />
    <form-reject-dialog
      :visible.sync="rejectVisible"
      :id="rejectId"
      @update="getData"
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
  approve,
  getDecryptField,
} from '@/api/datacenter/vehicle/vehicleOwnerChangeApply/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import FormCancelDialog from './FormCancelDialog';
import FormRejectDialog from './FormRejectDialog';
import { APPLY_STATUS, DATA_SOURCE } from './constant';
import DealerSelect from '@/components/dealer-select';
import ListSelect from '@/libs/components/list-select';

const defaultForm = {
  applyNo: '',
  applyStatus: '',
  applyStatusList: [],
  businessType: '',
  vin: '',
  dealerKeywordList: [],
  applyTime: '',
  auditTime: '',
  createTime: '',
  updateTime: '',
  vehicleModelIdList: [],
  dataSourceList: []
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
    FormCancelDialog,
    FormRejectDialog,
    DealerSelect,
    ListSelect
  },
  data () {
    return {
      pageTitle: '车主信息变更',
      pageType: 'list',
      APPLY_STATUS,
      moduleKey: 'AISDC-vehicleOwnerChangeApply',
      form: {
        ...defaultForm
      },
      selectionList: [],
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      sortColumns: [],
      // 作废
      visible: false,
      cancelId: '',
      // 驳回
      rejectVisible: false,
      rejectId: '',
      //
      canSubmit: false,
      canCancel: false,
      canApprove: false,
      canReject: false,
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'vehicleOwnerChangeApply',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'applyNo',
            label: '申请单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/vehicleOwnerChangeApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'applyStatusLabel', label: '申请状态', visible: true, width: 120 },
          { props: 'businessTypeLabel', label: '业务类型', visible: true, width: 200 },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            mask: true,
            getValue: (row) => getDecryptField(row.id, 'vin'),
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/vehicleProfile/edit',
                  query: {
                    id: row.vehicleProfileId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'vehicleModelName', label: '车型', visible: true, width: 200 },
          { props: 'dataSourceLabel', label: '数据来源', visible: true, width: 160 },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          {
            props: 'applierName',
            label: '申请人',
            visible: true,
            width: 150,
            mask: true,
            getValue: (row) => getDecryptField(row.id, 'applierName')
          },
          {
            props: 'applierId',
            label: '申请人ID',
            visible: true,
            width: 150,
            mask: true,
            getValue: (row) => getDecryptField(row.id, 'applierId')
          },
          { props: 'applyDesc', label: '申请说明', visible: true, width: 200 },
          { props: 'applyTime', label: '申请时间', visible: true, width: 200 },
          { props: 'auditorName', label: '审批人', visible: true, width: 200 },
          { props: 'auditTime', label: '审批时间', visible: true, width: 200 },
          { props: 'auditDesc', label: '审批说明', visible: true, width: 200 },
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
                name: '提交',
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
                  if (!this.canSubmit) { return false; }
                  if (String(row.dataSource) === DATA_SOURCE.LXP_APP) { return false; }
                  return row.applyStatus === APPLY_STATUS.DRAFT || row.applyStatus === APPLY_STATUS.REJECTED;
                },
              },
              {
                name: '作废',
                click: (rowIndex, row) => {
                  this.visible = true;
                  this.cancelId = row.id;
                },
                type: 'danger',
                show: (row) => {
                  if (!this.canCancel) { return false; }
                  if (String(row.dataSource) === DATA_SOURCE.LXP_APP) { return false; }
                  return row.applyStatus === APPLY_STATUS.DRAFT || row.applyStatus === APPLY_STATUS.REJECTED;
                },
              },
              {
                name: '审批通过',
                click: (rowIndex, row) => {
                  approve({
                    id: row.id,
                  }).then(res => {
                    this.$message.success('审批通过');
                    this.getData();
                  });
                },
                type: 'info',
                show: (row) => {
                  if (!this.canApprove) { return false; }
                  return row.applyStatus === APPLY_STATUS.PENDING;
                }
              },
              {
                name: '审批驳回',
                click: (rowIndex, row) => {
                  this.rejectVisible = true;
                  this.rejectId = row.id;
                },
                type: 'danger',
                show: (row) => {
                  if (!this.canReject) { return false; }
                  return row.applyStatus === APPLY_STATUS.PENDING;
                }
              }
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
    this.canSubmit = this.permissions.has(`${this.moduleKey}-submit`);
    this.canCancel = this.permissions.has(`${this.moduleKey}-cancel`);
    this.canApprove = this.permissions.has(`${this.moduleKey}-approve`);
    this.canReject = this.permissions.has(`${this.moduleKey}-reject`);
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
    handleAdd () {
      this.$router.push({
        path: '/datacenter/vehicle/vehicleOwnerChangeApply/edit'
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
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '新页面',
        dataFetchPath: 'datacenter/web/vehicle/vehicleOwnerChangeApply/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '新页面.xlsx');
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

      getList({ ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size })
        .then(res => {
          this.tableDataList = res.records.map(item => {
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
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });

      // 动态处理所有日期范围字段
      if (this.form.applyTime) {
        delete data.applyTime;
        if (this.form.applyTime.length > 1) {
          data.applyTimeStart = this.form.applyTime[0];
          data.applyTimeEnd = this.form.applyTime[1];
        }
      }
      if (this.form.auditTime) {
        delete data.auditTime;
        if (this.form.auditTime.length > 1) {
          data.auditTimeStart = this.form.auditTime[0];
          data.auditTimeEnd = this.form.auditTime[1];
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
  }
};
</script>

<style lang="scss" scoped>
.m-vehicle-owner-change-apply-list {
}
</style>
