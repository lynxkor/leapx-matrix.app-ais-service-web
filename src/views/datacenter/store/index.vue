<template>
  <div class="page-common m-store-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <el-form-item label="关键字">
        <el-input
          placeholder="门店名称/编码"
          v-model="form.keyword"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店编码">
        <el-input
          placeholder="请输入"
          v-model="form.storeCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店名称">
        <el-input
          placeholder="请输入"
          v-model="form.storeName"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店大区">
        <fetch-select
          :request="fetchOptions"
          enumCode="ais_base_region"
          v-model="form.regionList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="门店省市区">
        <el-input
          placeholder="请输入编码"
          v-model="form.areaCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="建店类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_build_type"
          v-model="form.buildStoreType"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="经营状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_status"
          v-model="form.statusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="经营状态-销售">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_sale_status"
          v-model="form.saleStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="经营状态-服务">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_service_status"
          v-model="form.serviceStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="经营状态-交付">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_delivery_status"
          v-model="form.deliveryStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="门店等级">
        <fetch-select
          :request="fetchOptions"
          enumCode="store_level"
          v-model="form.storeLevel"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="是否有销售能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isSales"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有试驾能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isTestDrive"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有批售能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isWholesaleSale"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有交付能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isSupportDeliver"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有维修能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isRepair"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有维保能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isMaintenance"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有道路救援能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isSupportRescue"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否支持事故维修">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isAccidentRepair"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否有备附件订购能力">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isPartOrder"
            placeholder="请选择"
            clearable
            filterable
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
import { getList } from '@/api/datacenter/store/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { downloadExcel } from '@/libs/utils';

const defaultForm = {
  keyword: '',
  storeCode: '',
  storeName: '',
  regionList: [],
  areaCode: '',
  buildStoreType: [],
  statusList: [],
  saleStatusList: [],
  serviceStatusList: [],
  deliveryStatusList: [],
  storeLevel: '',
  isSales: '',
  isTestDrive: '',
  isWholesaleSale: '',
  isSupportDeliver: '',
  isRepair: '',
  isMaintenance: '',
  isSupportRescue: '',
  isAccidentRepair: '',
  isPartOrder: '',
};

const pageSize = 20;
const mockConfig = { data: null };

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: { PageSearchAction, LPVxeTable, FetchSelect },
  data () {
    return {
      pageTitle: '门店管理',
      pageType: 'list',
      moduleKey: 'AISMC-store',
      form: { ...defaultForm },
      show: false,
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'storeTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          {
            props: 'storeCode',
            label: '门店编码',
            visible: true,
            width: 160,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/store/store/detail',
                  query: { storeCode: row.storeCode }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'storeName', label: '门店名称', visible: true, width: 200 },
          { props: 'parentCompanyName', label: '公司名称', visible: true, width: 200 },
          { props: 'parentCompanyCode', label: '公司编码', visible: true, width: 160 },
          { props: 'region', label: '大区', visible: true, width: 120 },
          {
            props: 'areaName',
            label: '省市区',
            visible: true,
            width: 200,
            formatter: ({ row }) => {
              const arr = [row.provinceName, row.cityName, row.countyName].filter(Boolean);
              return arr.join('/') || '-';
            }
          },
          { props: 'storeTypeBroadTypeName', label: '建店类型(大类)', visible: true, width: 140 },
          { props: 'buildStoreType', label: '建店类型(小类)', visible: true, width: 140 },
          { props: 'statusName', label: '经营状态', visible: true, width: 120 },
          { props: 'saleStatusName', label: '经营状态-销售', visible: true, width: 120 },
          { props: 'serviceStatusName', label: '经营状态-服务', visible: true, width: 120 },
          { props: 'deliveryStatusName', label: '经营状态-交付', visible: true, width: 120 },
          { props: 'roadRescueAddress', label: '道路救援服务地址', visible: true, width: 220 },
          { props: 'acceptanceTime', label: '验收完成时间', visible: true, width: 160 },
          { props: 'storeLevelName', label: '门店等级', visible: true, width: 120 },
          { props: 'exclusiveDeliveryStoreName', label: '专属交付门店', visible: true, width: 160 },
          { props: 'exclusiveServiceStoreName', label: '专属服务门店', visible: true, width: 160 },
          { props: 'businessTime', label: '营业时间', visible: true, width: 160 },
          { props: 'salesHotline', label: '销售热线', visible: true, width: 140 },
          { props: 'serviceHotline', label: '服务热线', visible: true, width: 140 },
          ...this.buildBoolCols([
            ['isSales', '是否有销售能力'],
            ['isTestDrive', '是否有试驾能力'],
            ['isWholesaleSale', '是否有批售能力'],
            ['isSupportDeliver', '是否有交付能力'],
            ['isRepair', '是否有维修能力'],
            ['isMaintenance', '是否有维保能力'],
            ['isSupportRescue', '是否有道路救援能力'],
            ['isAccidentRepair', '是否支持事故维修'],
            ['isPartOrder', '是否有备附件订购能力']
          ]),
          { props: 'partRecipient', label: '备件收货人姓名', visible: true, width: 140, formatter: () => '-' },
          { props: 'partPhone', label: '备件收货人手机', visible: true, width: 140, formatter: () => '-' },
          { props: 'partAddress', label: '备件收货地', visible: true, width: 200, formatter: () => '-' },
          { props: 'isAllowedThirdDelivered', label: '是否允许第三方收货', visible: true, width: 140, formatter: () => '-' }
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
    buildBoolCols (pairs) {
      return pairs.map(([key, label]) => ({
        props: key,
        label,
        visible: true,
        width: 140,
        formatter: ({ row }) => (row[key] === true || row[key] === 'true' || row[key] === 1 ? '是' : '否')
      }));
    },
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
        businessType: '门店管理',
        dataFetchPath: 'datacenter/web/store/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店管理.xlsx');
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
          console.error('获取门店列表数据失败:', err);
          this.$message.error('获取门店列表数据失败');
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
        if (Array.isArray(data[key]) && !data[key].length) delete data[key];
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
.m-store-list {
}
</style>
