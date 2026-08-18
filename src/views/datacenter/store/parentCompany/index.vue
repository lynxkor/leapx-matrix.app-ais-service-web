<template>
  <div class="page-common m-parent-company-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="100px"
      class="ais-search-form"
    >
      <el-form-item label="公司名称">
        <el-input
          placeholder="请输入"
          v-model="form.companyName"
          clearable
        />
      </el-form-item>
      <el-form-item label="公司编码">
        <el-input
          placeholder="请输入"
          v-model="form.companyCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="大区">
        <fetch-select
          :request="fetchOptions"
          enumCode="ais_base_region"
          v-model="form.region"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="省市区">
        <el-input
          placeholder="请输入编码"
          v-model="form.areaCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="合作类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="parent_company_cooperation_type"
          v-model="form.cooperationType"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <page-search-action
        v-if="canList"
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
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList } from '@/api/datacenter/parentCompany/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { downloadExcel } from '@/libs/utils';

const defaultForm = {
  companyName: '',
  companyCode: '',
  region: '',
  areaCode: '',
  cooperationType: ''
};

const pageSize = 20;
const mockConfig = { data: null };

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: { PageSearchAction, LPVxeTable, FetchSelect },
  data () {
    return {
      pageTitle: '母公司管理',
      pageType: 'list',
      moduleKey: 'AISMC-parentCompany',
      form: { ...defaultForm },
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'parentCompanyTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          {
            props: 'companyName',
            label: '公司名称',
            visible: true,
            width: 220,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/store/parentCompany/detail',
                  query: { companyCode: row.companyCode }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'companyCode', label: '公司编码', visible: true, width: 160 },
          { props: 'regionName', label: '大区', visible: true, width: 120 },
          { props: 'cooperationType', label: '合作类型', visible: true, width: 120, formatter: ({ row }) => row.cooperationTypeName || row.cooperationType || '-' },
          { props: 'companyCustomerTypeName', label: '企业客户分类', visible: true, width: 140 },
          { props: 'financialInvoiceType', label: '财务发票分类', visible: true, width: 120 },
          { props: 'legalPerson', label: '法人代表', visible: true, width: 120 },
          { props: 'legalPersonTelephone', label: '法人联系方式', visible: true, width: 160 },
          { props: 'email', label: '公司邮箱', visible: true, width: 200 },
          { props: 'address', label: '公司注册地址', visible: true, width: 240 },
          { props: 'detailAddress', label: '详细地址', visible: true, width: 240 },
          { props: 'bankName', label: '开户银行', visible: true, width: 200 },
          { props: 'taxNumber', label: '税号', visible: true, width: 200 },
          { props: 'openAccount', label: '开户账户', visible: true, width: 200 },
          { props: 'invoicePhone', label: '开票电话', visible: true, width: 160 },
          { props: 'bankHouseholder', label: '银行户主', visible: true, width: 160 },
          { props: 'invoiceAddress', label: '开票地址', visible: true, width: 240 },
          { props: 'investorEquityInfo', label: '股权信息', visible: true, width: 200 }
        ],
        total: 0
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
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '母公司管理',
        dataFetchPath: 'datacenter/web/parentCompany/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '母公司管理.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).catch(err => {
        console.error('导出失败:', err);
        this.$message({ type: 'error', message: '导出失败' });
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          if (!res || !res.records) return;
          this.optionObj.dataList = res.records.map(item => ({ ...item, deleteLoading: false }));
          this.optionObj.total = res.total;
        }).catch(err => {
          console.error('获取母公司列表数据失败:', err);
          this.$message.error('获取母公司列表数据失败');
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () { this.getData(); }, 300),
    getConfig () {
      return new Promise((resolve) => {
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
        if (data[key] === '' || data[key] === null || data[key] === undefined) delete data[key];
      });
      return data;
    },
    async fetchOptions (code) {
      if (code) return getEnum(code);
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-parent-company-list {
}
</style>
