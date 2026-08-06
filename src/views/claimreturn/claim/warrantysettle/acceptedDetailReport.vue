<template>
  <div class="page-common m-accepted-detail-report">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="保修月度">
        <el-date-picker
          v-model="form.month"
          type="month"
          format="yyyyMM"
          value-format="yyyyMM"
          placeholder="请选择"
          clearable
        />
      </el-form-item>
      <el-form-item label="公司编码/名称">
        <fetch-select
          :remote-method="getCompany"
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
        <el-form-item label="门店编码/名称">
          <dealer-select v-model="form.dealerCodeList" multiple/>
        </el-form-item>
      </template>

      <page-search-action
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
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getAcceptedDetailReport } from '@/api/claimreturn/claim/warrantysettle/acceptedDetailReport';
import { getTableConfig, exportTable, getSparePartCompany } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import DealerSelect from '@/components/dealer-select';
import { downloadExcel } from '@/libs/utils';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  month: '',
  companyCodeList: '',
  dealerCodeList: [],
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
    DealerSelect,
  },
  data () {
    return {
      pageTitle: '保修结算验收明细报表',
      pageType: 'list',
      moduleKey: 'AISCR-warrantySettleAcceptedDetailReport',
      form: {
        ...defaultForm
      },
      selectionList: [],
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
        id: 'acceptedDetailReportTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          { props: 'type', label: '类型', visible: true, width: 100 },
          { props: 'monthCode', label: '保修月度', visible: true, width: 100 },
          { props: 'alarmLevelLabel', label: '三包预警', visible: true, width: 100 },
          { props: 'paymentMethodLabel', label: '收款方式', visible: true, width: 100 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 160 },
          { props: 'parentOrgCode', label: '公司编码', visible: true, width: 120 },
          { props: 'parentOrgName', label: '公司名称', visible: true, width: 180 },
          { props: 'provinceName', label: '省', visible: true, width: 100 },
          { props: 'cityName', label: '市', visible: true, width: 100 },
          { props: 'dealerRegionName', label: '所属区域', visible: true, width: 120 },
          {
            props: 'serviceProxyNo',
            label: '接车施工单号',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: {
                    id: row.serviceProxyId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'warrantyApplyNo',
            label: '保修申请单号',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyApply/edit',
                  query: {
                    id: row.warrantyApplyId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
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
          { props: 'vehicleModelName', label: '车型', visible: true, width: 150 },
          { props: 'vehiclePropertyLabel', label: '车辆用途', visible: true, width: 120 },
          { props: 'approvalStatusLabel', label: '审批状态', visible: true, width: 120 },
          { props: 'warrantyTypeName', label: '保修类型', visible: true, width: 120 },
          { props: 'serviceActivityCode', label: '活动代码', visible: true, width: 120 },
          { props: 'serviceActivityName', label: '活动名称', visible: true, width: 180 },
          { props: 'warrantyStartDate', label: '保修开始日期', visible: true, width: 120 },
          {
            props: 'mainFaultPartCode',
            label: '主因件编码',
            visible: true,
            width: 150,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/edit',
                  query: {
                    id: row.mainPartId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'mainFaultPartName', label: '主因件名称', visible: true, width: 180 },
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
    async getCompany (query) {
      if (!query) {
        return {
          total: 0,
          records: []
        };
      }
      try {
        const res = await getSparePartCompany({ codeOrNameLike: query });
        res.records = res.records?.map(item => ({
          ...item,
          displayName: item.companyName + `(${item.companyCode})`
        }));
        return res;
      } catch (error) {
        console.error('Error fetching company list:', error);
      }
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
    getData () {
      this.loading = true;
      this.selectionList = [];

      getAcceptedDetailReport({ ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size })
        .then(res => {
          this.tableDataList = (res?.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.tableTotal = res?.total || 0;
        }).catch(err => {
          console.error('获取列表失败:', err);
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
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });

      return data;
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '保修结算验收明细报表',
        dataFetchPath: 'claimreturn/claim/web/warrantysettle/warrantySettle/acceptedDetailReportExport',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '保修结算验收明细报表.xlsx');
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
.m-accepted-detail-report {
}
</style>
