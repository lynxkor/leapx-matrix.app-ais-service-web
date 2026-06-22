<template>
  <div class="page-common m-warranty-settle-summary-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <el-form-item label="月度">
        <el-date-picker
          v-model="form.month"
          type="month"
          format="yyyyMM"
          value-format="yyyyMM"
          placeholder="请选择"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item label="公司名称">
        <fetch-select
            :remote-method="getParentCompany"
            remote
            v-model="form.companyCodeList"
            placeholder="请选择"
            labelKey="companyName"
            valueKey="companyCode"
            subLabelKey="companyCode"
            clearable
            multiple
            collapseTags
            filterable
              />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="门店编码：">
          <dealer-select v-model="form.dealerCodes" placeholder="请选择" clearable multiple filterable />
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="onExport">导出</el-button>
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
      >
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/claimreturn/claim/warrantysettle/warrantySettleSummary';
import { getTableConfig, tableAddOrUpdate, getSparePartCompany, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import DealerSelect from '@/components/dealer-select';
import { downloadExcel } from '@/libs/utils';
import moment from 'moment';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  month: moment().subtract(1, 'month').format('YYYYMM'),
  companyCodeList: '',
  dealerCodes: [],
  dealerNames: [],
};

const pageSize = 20;

const mockConfig = {
  data: null
};

export default {
  components: {
    PageSearchAction,
    LPVxeTable,
    DealerSelect,
    FetchSelect,
  },
  mixins: [responsiveSearchForm, permissions, commonMixins],
  data () {
    return {
      pageTitle: '保修结算汇总报表',
      pageType: 'list',
      moduleKey: 'AISCR-warrantySettleSummary',
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'warrantySettleSummaryTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          { props: 'type', label: '类型', visible: true, width: 80 },
          { props: 'warrantyTypeName', label: '保修类型', visible: true, width: 120 },
          { props: 'activityCode', label: '活动代码', visible: true, width: 120 },
          { props: 'activityName', label: '活动名称', visible: true, width: 180 },
          { props: 'month', label: '月度', visible: true, width: 100 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 100 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'province', label: '省', visible: true, width: 100 },
          { props: 'city', label: '市', visible: true, width: 100 },
          { props: 'region', label: '区域', visible: true, width: 100 },
          { props: 'parentOrgCode', label: '公司编码', visible: true, width: 120 },
          { props: 'parentOrgName', label: '公司名称', visible: true, width: 200 },
          { props: 'paymentMethod', label: '收款方式', visible: true, width: 120 },
          {
            props: 'amount',
            label: '金额',
            visible: true,
            width: 120,
            formatter: (row) => this.formatAmount(row.amount)
          }
        ],
        total: this.tableTotal
      };
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    async getParentCompany (query) {
      try {
        const res = await getSparePartCompany({ codeOrNameLike: query });
        res.records = res.records?.map(item => ({
          ...item,
          displayName: item.companyName + `(${item.companyCode})`
        }));
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    formatAmount (amount) {
      if (amount === null || amount === undefined) {
        return '0.00';
      }
      return Number(amount).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    onSubmit () {
      this.tableForm.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.tableForm.page = 1;
      this.tableForm.size = pageSize;
      this.getData();
    },
    getData () {
      this.loading = true;

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
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });

      return data;
    },
    onExport () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '保修结算汇总报表',
        dataFetchPath: 'claimreturn/claim/web/warrantysettle/warrantySettleSummary/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '保修结算汇总报表.xlsx');
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
.m-warranty-settle-summary-list {
}
</style>
