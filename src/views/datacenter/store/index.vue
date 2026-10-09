<template>
  <div class="page-common m-store-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="门店名称/编码">
        <el-input
          placeholder="请输入"
          v-model.trim="form.keyword"
          clearable

        />
      </el-form-item>
      <el-form-item label="门店大区">
        <fetch-select
          filterable
          clearable
          remote
          v-model="form.region"
          :remote-method="getRegionList"
          value-key="orgCode"
          label-key="orgName"
        />
      </el-form-item>
      <template v-if="show">
      <el-form-item label="门店省市区">
        <el-cascader
          placeholder="请选择省市区"
          v-model="form.areaCode"
          :props="orgProps"
          :options="areaOptions"
          filterable
          @change="handleChangeArea"
          clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="建店类型">
        <el-cascader
          class="cascader"
          v-model="form.buildStoreTypeArray"
          placeholder="请选择"
          :options="storeTypeOptions"
          :props="storeTypeProp"
          collapse-tags
          @change="handleCascaderChange"
        />
      </el-form-item>
      <el-form-item label="经营状态">
        <fetch-select
          :options="statusOptions"
          v-model="form.status"
          placeholder="请选择"
          clearable
          filterable
          value-key="code"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="经营状态(销售)">
        <fetch-select
          :options="statusOptions"
          v-model="form.saleStatus"
          placeholder="请选择"
          clearable
          filterable
          value-key="code"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="经营状态(服务)">
        <fetch-select
          :options="statusOptions"
          v-model="form.serviceStatus"
          placeholder="请选择"
          clearable
          filterable
          value-key="code"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="经营状态(交付)">
        <fetch-select
          :options="statusOptions"
          v-model="form.deliveryStatus"
          placeholder="请选择"
          clearable
          filterable
          value-key="code"
          label-key="name"
        />
      </el-form-item>
      <el-form-item label="门店等级">
        <fetch-select
          :options="storeLevelOptions"
          v-model="form.storeLevel"
          placeholder="请选择"
          clearable
          filterable
          value-key="code"
          label-key="name"
        />
      </el-form-item>

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
        <el-form-item label="合作类型">
                 <fetch-select
                    :request="fetchOptions"
                    enumCode="ws_cooperation_type"
                    v-model="form.cooperationType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
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
import { getAreaTree } from '@/utils';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getRegion, getBuildType, getDataDict } from '@/api/common';
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
  buildStoreTypeArray: [],
  status: [],
  saleStatus: [],
  serviceStatus: [],
  deliveryStatus: [],
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
      pageTitle: '门店基础信息查询',
      pageType: 'list',
      moduleKey: 'AISDC-store',
      form: { ...defaultForm },
      show: false,
      loading: false,
      exportLoading: false,
      storeTypeOptions: [],
      storeTypeProp: {
        multiple: true
      },
      statusOptions: [],
      storeLevelOptions: [],
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      areaOptions: getAreaTree(),
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
          {
            props: 'parentCompanyCode',
            label: '公司编码',
            visible: true,
            width: 160,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/store/parentCompany/detail',
                  query: { companyCode: row.parentCompanyCode }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'region', label: '大区', visible: true, width: 120 },
          {
            props: 'storeBuildAddress',
            label: '省市区',
            visible: true,
            width: 200
          },
          { props: 'storeTypeBroadTypeName', label: '建店类型(大类)', visible: true, width: 140 },
          { props: 'buildStoreType', label: '建店类型(小类)', visible: true, width: 140 },
          { props: 'statusName', label: '经营状态', visible: true, width: 120 },
          { props: 'saleStatusName', label: '经营状态(销售)', visible: true, width: 120 },
          { props: 'serviceStatusName', label: '经营状态(服务)', visible: true, width: 120 },
          { props: 'deliveryStatusName', label: '经营状态(交付)', visible: true, width: 120 },
          { props: 'isSales', label: '是否有销售能力', visible: true, width: 180 },
          { props: 'isTestDrive', label: '是否有试驾能力', visible: true, width: 180 },
          { props: 'isWholesaleSale', label: '是否有批售能力', visible: true, width: 180 },
          { props: 'isSupportDeliver', label: '是否有交付能力', visible: true, width: 180 },
          { props: 'isRepair', label: '是否有维修能力', visible: true, width: 180 },
          { props: 'isMaintenance', label: '是否有维保能力', visible: true, width: 180 },
          { props: 'isSupportRescue', label: '是否有道路救援能力', visible: true, width: 180 },
          { props: 'isAccidentRepair', label: '是否支持事故维修', visible: true, width: 180 },
          { props: 'isPartOrder', label: '是否有备附件订购能力', visible: true, width: 180 },
          { props: 'roadRescueAddress', label: '道路救援服务地址', visible: true, width: 220 },
          { props: 'rescuePhone', label: '道路救援电话', visible: true, width: 220 },
          { props: 'acceptanceTime', label: '验收完成时间', visible: true, width: 160 },
          { props: 'storeLevelName', label: '门店等级', visible: true, width: 120 },
          { props: 'exclusiveDeliveryStoreName', label: '专属交付门店', visible: true, width: 160 },
          { props: 'exclusiveServiceStoreName', label: '专属服务门店', visible: true, width: 160 },
          { props: 'businessTime', label: '营业时间', visible: true, width: 160 },
          { props: 'salesHotline', label: '销售热线', visible: true, width: 140 },
          { props: 'serviceHotline', label: '服务热线', visible: true, width: 140 },

          { props: 'partRecipient', label: '备件收货人姓名', visible: true, width: 140 },
          { props: 'partPhone', label: '备件收货人手机', visible: true, width: 140 },
          { props: 'partArea', label: '备件收货省市区', visible: true, width: 140 },
          { props: 'partAddress', label: '备件收货地', visible: true, width: 200 },
          { props: 'isAllowedThirdDelivered', label: '是否允许第三方收货', visible: true, width: 140 },
          { props: 'cooperationTypeLabel', label: '合作类型', visible: true, width: 140 },
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  mounted () {
    this.getStore();
    this.getDictList();
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
        businessType: '门店管理',
        dataFetchPath: 'datacenter/web/store/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店信息查询.xlsx');
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
      delete data.buildStoreTypeArray;
      Object.keys(this.form).forEach(key => {
        if (Array.isArray(data[key]) && !data[key].length) delete data[key];
        if (data[key] === '' || data[key] === null || data[key] === undefined) delete data[key];
      });
      return data;
    },
    async getRegionList (params) {
      return getRegion({ orgName: params });
    },
    async fetchOptions (code) {
      if (code) return getEnum(code);
      return [];
    },
    handleChangeArea (val) {
      this.form.areaCode = val || null;
    },
    handleCascaderChange (value) {
      console.log('handleCascaderChange', value);
      if (value && value.length > 0) {
        let array = [];
        for (let i = 0; i < value.length; i++) {
          array.push(value[i][1]);
        }
        this.form.buildStoreType = array;
      } else {
        this.form.buildStoreType = null;
      }
    },
    async getStore () {
      const res = await getBuildType();
      this.storeTypeOptions = res || [];
    },
    async getDictList () {
      const res = await getDataDict({ storeStatus: 1, storeLevel: 1 });
      if (res) {
        this.statusOptions = res.storeStatus || [];
        this.storeLevelOptions = res.storeLevel || [];
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.m-store-list {
}
</style>
