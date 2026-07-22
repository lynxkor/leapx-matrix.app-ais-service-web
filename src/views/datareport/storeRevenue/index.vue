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
      <vxe-table
        ref="xTable"
        v-loading="loading"
        :data="optionObj.dataList"
        max-height="800"
        size="small"
        resizable
        stripe
        border="inner"
        show-overflow
        highlight-hover-row
        :auto-resize="true"
      >
        <vxe-column
          v-for="col in tableColumns"
          :key="col.props"
          :field="col.props"
          :title="col.label"
          :width="col.width"
          :align="col.align || 'left'"
        />
      </vxe-table>
      <el-pagination
        v-if="optionObj.total > 0"
        class="ais-pagination"
        background
        :current-page.sync="optionObj.form.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="optionObj.form.size"
        :total="optionObj.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import FetchSelect from '@/libs/components/FetchSelect';
import { pageStoreRevenue } from '@/api/datareport/storeRevenue';
import { listOrgStoreInfoByParam, exportTable } from '@/api/common';
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
  components: { PageSearchAction, FetchSelect },
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
      // 字段顺序严格按 Excel 【业务已确认】门店营收报表 sheet(38 字段)
      optionObj: {
        id: 'storeRevenueTable',
        dataList: [],
        form: { page: 1, size: pageSize },
        dataProp: [
          // ===== 门店维度(11)=====
          { props: 'region', label: '区域', visible: true, width: 120 },
          { props: 'province', label: '省', visible: true, width: 100 },
          { props: 'city', label: '市', visible: true, width: 100 },
          { props: 'county', label: '区', visible: true, width: 100 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'dealerCode', label: '门店编号', visible: true, width: 140 },
          { props: 'cooperationTypeLabel', label: '合作伙伴', visible: true, width: 120 },
          { props: 'companyName', label: '母公司名称', visible: true, width: 180 },
          { props: 'companyCode', label: '母公司编码', visible: true, width: 140 },
          // ===== 单据维度(9)=====
          { props: 'vin', label: 'VIN', visible: true, width: 180 },
          { props: 'carPlate', label: '车牌号', visible: true, width: 130 },
          { props: 'creatorName', label: '开单人', visible: true, width: 110 },
          { props: 'serviceProxyCode', label: '工单号', visible: true, width: 200 },
          { props: 'repairType', label: '维修类型', visible: true, width: 150 },
          { props: 'statementCode', label: '结算单号', visible: true, width: 200 },
          { props: 'warrantyApplyCode', label: '保修申请单', visible: true, width: 200 },
          { props: 'serviceOrderCreateTime', label: '开单日期', visible: true, width: 170 },
          { props: 'orderStatusLabel', label: '工单状态', visible: true, width: 110 },
          // ===== 时间维度(3)=====
          { props: 'factoryOutTime', label: '出厂日期', visible: true, width: 170 },
          { props: 'receiveOrApproveTime', label: '收款/审批通过日期', visible: true, width: 170 },
          { props: 'statementTypeLabel', label: '结算类型', visible: true, width: 110 },
          // ===== 金额维度(14)=====
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
  computed: {
    // 表格列定义(取自 optionObj.dataProp,过滤掉 visible: false 的列)
    tableColumns () {
      return this.optionObj.dataProp.filter(c => c.visible !== false);
    }
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
    // 首次进入页面加载数据(commonMixins.activated 故意跳过首次激活,首次加载由页面 created 负责)
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
      // 校验时间范围
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
      // 清除空值(空数组也清掉,让后端走"全权限"分支)
      Object.keys(data).forEach(k => {
        const v = data[k];
        if (v === '' || v === null) delete data[k];
        else if (Array.isArray(v) && v.length === 0) delete data[k];
      });
      // 时间区间拆分
      if (data.receiveTime && data.receiveTime.length === 2) {
        data.receiveStartTime = data.receiveTime[0];
        data.receiveEndTime = data.receiveTime[1];
        delete data.receiveTime;
      }
      return data;
    },
    handleSizeChange (size) {
      this.optionObj.form.size = size;
      this.optionObj.form.page = 1;
      this.getData();
    },
    handlePageChange (page) {
      this.optionObj.form.page = page;
      this.getData();
    },
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
        titleMap: Object.fromEntries(this.tableColumns.map(col => [col.props, col.label])),
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
  .ais-pagination {
    margin-top: 16px;
    text-align: right;
  }
}
</style>
