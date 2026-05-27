<template>
  <div class="page-common m-departure-detail-list">
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
      <el-form-item label="出厂日期" v-show="this.visibleCount === 3 || show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.departureDate"
          type="daterange"
          unlink-panels
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <template v-if="show">
      </template>
      <page-search-action
        v-if="canPage"
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
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { pageDepartureDetail } from '@/api/maintain/sp/serviceProxy/index';
import { getTableConfig, tableAddOrUpdate, exportTable, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

function getDefaultDepartureDate () {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return [fmt(start) + ' 00:00:00', fmt(end) + ' 23:59:59'];
}

const defaultForm = {
  dealerCodes: [],
  departureDate: ''
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
      pageTitle: '出厂台次名细',
      pageType: 'list',
      moduleKey: 'AISMC-departureDetail',
      form: {
        ...defaultForm
      },
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'departureDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'region', label: '区域', visible: true, width: 120 },
          { props: 'province', label: '省', visible: true, width: 120 },
          { props: 'city', label: '市', visible: true, width: 120 },
          { props: 'district', label: '区', visible: true, width: 120 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'dealerCode', label: '门店编号', visible: true, width: 150 },
          { props: 'parentCompanyName', label: '合作伙伴', visible: true, width: 150 },
          { props: 'vehProfileVin', label: 'VIN', visible: true, width: 200 },
          { props: 'carPlate', label: '车牌号', visible: true, width: 150 },
          { props: 'serviceProxyCode', label: '工单号', visible: true, width: 200 },
          { props: 'serviceProxyCreateTime', label: '开单日期', visible: true, width: 180 },
          { props: 'orderStatusLabel', label: '工单状态', visible: true, width: 120 },
          { props: 'departureDate', label: '出厂日期', visible: true, width: 180 },
          { props: 'statementTypeLabel', label: '结算类型', visible: true, width: 120 },
          { props: 'serviceAdvisorName', label: '客户经理', visible: true, width: 120 },
          { props: 'vehModelName', label: '车型', visible: true, width: 150 },
          { props: 'customerName', label: '车主姓名', visible: true, width: 120 },
          { props: 'customerPhone', label: '车主手机', visible: true, width: 150 },
          { props: 'shuttleName', label: '送修人', visible: true, width: 120 },
          { props: 'shuttlePhone', label: '送修人手机', visible: true, width: 150 }
        ],
        total: 0
      },
      sortColumns: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.form.departureDate = getDefaultDepartureDate();
    this.getData();
  },
  methods: {
    async getDealerListByName (params) {
      return listOrgStoreInfo({ name: params });
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
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '出厂台次名细',
        dataFetchPath: 'maintain/web/sp/serviceProxy/pageDepartureDetail',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '出厂台次名细.xlsx');
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
    getData () {
      this.loading = true;

      pageDepartureDetail({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = res.records.map(item => {
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
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.departureDate) {
        delete data.departureDate;
        if (this.form.departureDate.length > 1) {
          data.startDate = this.form.departureDate[0];
          data.endDate = this.form.departureDate[1];
        }
      }
      data.sortColumns = this.sortColumns;
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-departure-detail-list {
}
</style>
