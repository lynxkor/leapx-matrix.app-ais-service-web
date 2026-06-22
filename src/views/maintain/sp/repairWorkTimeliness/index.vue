<template>
  <div class="page-common m-repair-work-timeliness-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="门店名称">
        <fetch-select
          multiple
          filterable
          clearable
          remote
          v-model="form.dealerCodes"
          :remote-method="getDealerListByName"
          value-key="orgCode"
          label-key="orgName"
        />
      </el-form-item>
      <page-search-action
        v-if="canPage"
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @sortChange="handleSortChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import { pageRepairWorkTimeliness } from '@/api/maintain/sp/serviceProxy/index';
import { getTableConfig, tableAddOrUpdate, exportTable, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  dealerCodes: []
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    LPVxeTable,
    FetchSelect,
    PageSearchAction
  },
  data () {
    return {
      pageTitle: '车间作业时效表',
      pageType: 'list',
      moduleKey: 'AISMC-repairWorkTimeliness',
      form: {
        ...defaultForm
      },
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'repairWorkTimelinessTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'region', label: '区域', visible: true, width: 120 },
          { props: 'customerName', label: '客户姓名', visible: true, width: 120 },
          { props: 'vehProfileVin', label: 'VIN', visible: true, width: 200 },
          { props: 'carPlate', label: '车牌号', visible: true, width: 150 },
          { props: 'dealerCode', label: '厅店代码', visible: true, width: 150 },
          { props: 'dealerName', label: '厅店名称', visible: true, width: 200 },
          { props: 'serviceProxyCode', label: '接车施工单号', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '工单状态', visible: true, width: 120 },
          { props: 'serviceAdvisorName', label: '客户经理', visible: true, width: 120 },
          { props: 'repairItemName', label: '维修作业', visible: true, width: 200 },
          { props: 'dealerWorkTeamName', label: '维修班组', visible: true, width: 150 },
          { props: 'repairTechnicianName', label: '维修技师', visible: true, width: 120 },
          { props: 'timeSpend', label: '实际作业时间', visible: true, width: 180 },
          { props: 'finishAt', label: '维修结束时间', visible: true, width: 180 },
          { props: 'qualityCheckAt', label: '质检时间', visible: true, width: 180 },
          { props: 'qualityCheckerName', label: '质检人', visible: true, width: 120 }
        ],
        total: 0
      },
      sortColumns: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    async getDealerListByName (params) {
      return listOrgStoreInfo({ name: params });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });
      data.sortColumns = this.sortColumns;
      return data;
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '车间作业时效表',
        dataFetchPath: 'maintain/web/sp/serviceProxy/pageRepairWorkTimeliness',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '车间作业时效表.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导入中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;

      pageRepairWorkTimeliness({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-repair-work-timeliness-list {
}
</style>
