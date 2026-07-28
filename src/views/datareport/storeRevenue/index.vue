<!--
  门店营收报表
  数据源: 后端 2 路 UNION ALL(自费结算单 + 索赔保修申请单)
  路由: /datareport/storeRevenue
  接口: POST /datareport/web/revenue/storeRevenue/page
-->
<template>
  <div class="page-common m-store-revenue-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <el-form-item label="门店">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.dealerCodes"
          placeholder="请输入门店编码或名称(可多选)"
          label-key="orgName"
          value-key="orgCode"
          sub-label-key="orgCode"
          clearable
          multiple
          collapse-tags
          filterable
          style="width: 280px;"
        />
      </el-form-item>
      <el-form-item label="收款/审批时间">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.receiveTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">
        <i class="iconfont icon-lxppc-export"></i>导出
      </el-button>
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
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import FetchSelect from '@/libs/components/FetchSelect';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import { pageStoreRevenue } from '@/api/datareport/storeRevenue';
import { listOrgStoreInfoByParam, exportTable, getTableConfig, tableAddOrUpdate } from '@/api/common';
import { downloadExcel } from '@/libs/utils';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const pageSize = 20;

const defaultForm = {
  dealerCodes: [],
  receiveTime: []
};

export default {
  name: 'StoreRevenue',
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: { PageSearchAction, FetchSelect, LPVxeTable },
  data () {
    return {
      pageTitle: '门店营收报表',
      pageType: 'list',
      moduleKey: 'AISDR-storeRevenue',
      form: { ...defaultForm },
      loading: false,
      exportLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date(); end.setHours(23, 59, 59, 999);
            const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 7); start.setHours(0, 0, 0, 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date(); end.setHours(23, 59, 59, 999);
            const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 30); start.setHours(0, 0, 0, 0);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      optionObj: {
        id: 'storeRevenueTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          { props: 'region', label: '区域', visible: true, width: 120 },
          { props: 'province', label: '省', visible: true, width: 100 },
          { props: 'city', label: '市', visible: true, width: 100 },
          { props: 'county', label: '区', visible: true, width: 100 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 140 },
          { props: 'cooperationTypeLabel', label: '合作类型', visible: true, width: 120 },
          { props: 'companyName', label: '母公司名称', visible: true, width: 180 },
          { props: 'companyCode', label: '母公司编码', visible: true, width: 140 },
          { props: 'vin', label: 'VIN', visible: true, width: 180 },
          { props: 'carPlate', label: '车牌号', visible: true, width: 130 },
          { props: 'creatorName', label: '开单人', visible: true, width: 110 },
          { props: 'serviceProxyCode', label: '工单号', visible: true, width: 200 },
          { props: 'repairType', label: '维修类型', visible: true, width: 150 },
          { props: 'statementCode', label: '结算单号', visible: true, width: 200 },
          { props: 'warrantyApplyCode', label: '保修申请单', visible: true, width: 200 },
          { props: 'serviceOrderCreateTime', label: '开单日期', visible: true, width: 170 },
          { props: 'orderStatusLabel', label: '工单状态', visible: true, width: 110 },
          { props: 'factoryOutTime', label: '出厂日期', visible: true, width: 170 },
          { props: 'receiveOrApproveTime', label: '收款/审批通过日期', visible: true, width: 170 },
          { props: 'statementTypeLabel', label: '结算类型', visible: true, width: 110 },
          { props: 'itemCustomerPayable', label: '项目客户应付', visible: true, width: 140, align: 'right', sum: true },
          { props: 'itemCustomerDiscount', label: '项目客户优惠', visible: true, width: 140, align: 'right', sum: true },
          { props: 'itemDealerReceivable', label: '项目门店应收', visible: true, width: 140, align: 'right', sum: true },
          { props: 'partCustomerPayable', label: '零件客户应付', visible: true, width: 140, align: 'right', sum: true },
          { props: 'partCustomerDiscount', label: '零件客户优惠', visible: true, width: 140, align: 'right', sum: true },
          { props: 'partDealerReceivable', label: '零件门店应收', visible: true, width: 140, align: 'right', sum: true },
          { props: 'otherDealerReceivable', label: '其他门店应收', visible: true, width: 140, align: 'right', sum: true },
          { props: 'customerTotalPayable', label: '客户总应付', visible: true, width: 140, align: 'right', sum: true },
          { props: 'customerNoFractionAmount', label: '客户去零金额', visible: true, width: 140, align: 'right', sum: true },
          { props: 'customerRightsAmount', label: '客户权益金额', visible: true, width: 140, align: 'right', sum: true },
          { props: 'customerDiscountTotal', label: '客户优惠总金额', visible: true, width: 150, align: 'right', sum: true },
          { props: 'customerActualPayable', label: '客户实付总金额', visible: true, width: 150, align: 'right', sum: true },
          { props: 'dealerActualReceived', label: '门店实收总金额', visible: true, width: 150, align: 'right', sum: true }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    // 默认近一个月
    const now = new Date();
    const start = new Date(now.getTime() - 3600 * 1000 * 24 * 30);
    const pad = n => String(n).padStart(2, '0');
    const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    start.setHours(0, 0, 0, 0); now.setHours(23, 59, 59, 999);
    this.form.receiveTime = [fmt(start), fmt(now)];
    this.getData();
  },
  methods: {
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('门店列表加载失败:', error);
        return [];
      }
    },
    onSubmit () {
      if (!this.form.receiveTime || this.form.receiveTime.length < 2) {
        this.$message({ type: 'warning', message: '请选择收款/审批时间范围(必填)' });
        return;
      }
      const [startStr, endStr] = this.form.receiveTime;
      const start = new Date(startStr).getTime();
      const end = new Date(endStr).getTime();
      const diffDays = Math.ceil((end - start) / (3600 * 1000 * 24));
      if (diffDays > 31) {
        this.$message({ type: 'warning', message: '时间范围不能超过 31 天,请重新选择' });
        return;
      }
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      const now = new Date();
      const start = new Date(now.getTime() - 3600 * 1000 * 24 * 30);
      const pad = n => String(n).padStart(2, '0');
      const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      start.setHours(0, 0, 0, 0); now.setHours(23, 59, 59, 999);
      this.form.receiveTime = [fmt(start), fmt(now)];
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.getData();
    },
    getData () {
      this.loading = true;
      const payload = this.getFormData();
      pageStoreRevenue({ ...payload, pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res.records || []).map(item => ({ ...item }));
          this.optionObj.total = res.total || 0;
        })
        .catch(err => {
          console.error('门店营收报表查询失败:', err);
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(data).forEach(k => {
        const v = data[k];
        if (v === '' || v === null) delete data[k];
        else if (Array.isArray(v) && v.length === 0) delete data[k];
      });
      if (data.receiveTime && data.receiveTime.length === 2) {
        data.receiveStartTime = data.receiveTime[0];
        data.receiveEndTime = data.receiveTime[1];
        delete data.receiveTime;
      }
      return data;
    },
    getConfig () {
      return new Promise((resolve) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          console.error(err);
          resolve({ data: null });
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
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    exportExcel () {
      if (!this.form.receiveTime || this.form.receiveTime.length < 2) {
        this.$message({ type: 'warning', message: '请先选择收款/审批时间范围' });
        return;
      }
      this.exportLoading = true;
      exportTable({
        businessType: '门店营收报表',
        dataFetchPath: 'datareport/web/revenue/storeRevenue/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店营收报表.xlsx');
          } catch (error) {
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
.m-store-revenue-list {
  .ais-actions {
    margin-bottom: 12px;
  }
}
</style>
