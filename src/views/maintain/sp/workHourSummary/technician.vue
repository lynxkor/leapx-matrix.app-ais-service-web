<template>
  <div class="page-common m-work-hour-summary-list" v-loading="loading" element-loading-text="加载中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255,0.7)">
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
      <el-form-item label="完工日期" v-show="this.visibleCount === 3 || show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.finishDate"
          type="daterange"
          unlink-panels
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
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
      <vxe-table
        ref="xTable"
        :data="tableData"
        :loading="loading"
        :auto-resize="true"
        :show-footer="tableData.length > 0"
        :footer-method="footerMethod"
        max-height="800"
        size="small"
        resizable
        stripe
        border="inner"
        show-overflow
        highlight-hover-row
      >
        <vxe-column type="expand" width="60" :show-overflow="false">
          <template #content="{ row }">
            <work-hour-detail-sub-table
              :group-key="row.groupKey"
              :search-params="searchParams"
              :fetch-detail="fetchDetail"
              :columns="detailColumns"
              @loaded="onDetailLoaded"
            />
          </template>
        </vxe-column>
        <vxe-column type="seq" width="60" />
        <vxe-column field="groupName" title="技师姓名" width="200" />
        <vxe-column field="totalWorkHour" title="工时数" width="200">
          <template #default="{ row }">{{ formatDecimal(row.totalWorkHour) }}</template>
        </vxe-column>
        <vxe-column title="工时单价(元)" width="200">
          <template #default>-</template>
        </vxe-column>
        <vxe-column field="totalAmount" title="工时金额(元)" width="200">
          <template #default="{ row }">{{ formatDecimal(row.totalAmount) }}</template>
        </vxe-column>
        <vxe-column field="totalDiscount" title="工时优惠(元)">
          <template #default="{ row }">{{ formatDecimal(row.totalDiscount) }}</template>
        </vxe-column>
        <!-- <vxe-column field="repairItemCode" title="维修项目代码" width="150" />
        <vxe-column field="repairItemName" title="维修项目名称" width="180" />
        <vxe-column field="serviceProxyCode" title="接车施工单" width="180" />
        <vxe-column field="finishAt" title="完工时间" width="180" />
        <vxe-column field="orderStatusLabel" title="工单状态" width="120" />
        <vxe-column field="checkoutTypeName" title="结算类型" width="120" />
        <vxe-column field="dealerName" title="门店名称" width="180" />
        <vxe-column field="carPlate" title="车牌" width="150" />
        <vxe-column field="vehProfileVin" title="VIN" width="200" />
        <vxe-column field="serviceAdvisorName" title="客户经理" width="120" /> -->
      </vxe-table>
      <el-pagination
        v-if="total > 0"
        class="ais-pagination"
        background
        :current-page.sync="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { pageWorkHourSummaryGroupByTechnician, pageWorkHourSummaryDetailByTechnician } from '@/api/maintain/sp/workHourSummary/index';
import { exportTable, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import WorkHourDetailSubTable from './components/WorkHourDetailSubTable.vue';

function getDefaultFinishDate () {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return [fmt(start) + ' 00:00:00', fmt(end) + ' 23:59:59'];
}

const defaultForm = {
  dealerCodes: [],
  finishDate: ''
};

// 明细子表列定义（按技师）
const detailColumns = [
  { field: 'repairItemCode', title: '维修项目代码', width: 150 },
  { field: 'repairItemName', title: '维修项目名称', width: 180 },
  { field: 'serviceProxyCode', title: '接车施工单', width: 180 },
  { field: 'finishAt', title: '完工时间', width: 180 },
  { field: 'orderStatusLabel', title: '工单状态', width: 120 },
  { field: 'checkoutTypeName', title: '结算类型', width: 120 },
  { field: 'dealerName', title: '门店名称', width: 180 },
  { field: 'carPlate', title: '车牌', width: 150 },
  { field: 'vehProfileVin', title: 'VIN', width: 200 },
  { field: 'serviceAdvisorName', title: '客户经理', width: 120 }
];

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    FetchSelect,
    WorkHourDetailSubTable
  },
  data () {
    return {
      pageTitle: '技师工时统计（按技师）',
      pageType: 'list',
      moduleKey: 'AISMC-workHourSummaryTechnician',
      form: { ...defaultForm },
      show: false,
      loading: false,
      exportLoading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,
      detailColumns
    };
  },
  computed: {
    // 供展开行子表复用的搜索条件（已清洗，无分页）
    searchParams () {
      return this.getFormData();
    },
    // 本页各分组合计之和，用于底部合计行
    pageTotals () {
      const toNum = v => (v === null || isNaN(v)) ? 0 : Number(v);
      return this.tableData.reduce((acc, g) => {
        acc.workHour += toNum(g.totalWorkHour);
        acc.amount += toNum(g.totalAmount);
        acc.discount += toNum(g.totalDiscount);
        return acc;
      }, { workHour: 0, amount: 0, discount: 0 });
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.form.finishDate = getDefaultFinishDate();
    this.getData();
  },
  methods: {
    async getDealerListByName (params) {
      return listOrgStoreInfo({ name: params });
    },
    // 展开行懒加载：拉取某技师的工时明细（带分页）
    fetchDetail (params) {
      return pageWorkHourSummaryDetailByTechnician({ ...params, groupBy: 'technician' });
    },
    // 明细异步加载完成后触发表格重算，修正展开行高度（vxe 在展开瞬间已重算，此时高度尚未撑开）
    onDetailLoaded () {
      this.$nextTick(() => {
        if (this.$refs.xTable) {
          this.$refs.xTable.recalculate();
        }
      });
    },
    formatDecimal (val) {
      if (val === null || val === '' || isNaN(val)) return '-';
      return Number(val).toFixed(2);
    },
    handleDateChange (val) {
      if (val && val.length === 2) {
        const start = new Date(val[0]);
        const end = new Date(val[1]);
        const maxEnd = new Date(start);
        maxEnd.setMonth(maxEnd.getMonth() + 1);
        if (end > maxEnd) {
          this.$message.warning('完工日期选择间隔不能超过一个月');
          this.form.finishDate = '';
        }
      }
    },
    onSubmit () {
      this.pageNum = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm, finishDate: getDefaultFinishDate() };
      this.pageNum = 1;
      this.pageSize = 20;
      this.getData();
    },
    onSizeChange (size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getData();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getData();
    },
    footerMethod ({ columns }) {
      return [
        columns.map(col => {
          if (col.field === 'groupName') return '本页合计';
          if (col.field === 'totalWorkHour') return this.formatDecimal(this.pageTotals.workHour);
          if (col.field === 'totalAmount') return this.formatDecimal(this.pageTotals.amount);
          if (col.field === 'totalDiscount') return this.formatDecimal(this.pageTotals.discount);
          return '';
        })
      ];
    },
    exportExcel () {
      if (!this.form.dealerCodes || !this.form.dealerCodes.length) {
        this.$message.warning('请选择门店后再导出');
        return;
      }
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '技师工时统计（按技师）',
        dataFetchPath: 'maintain/web/sp/spRepairWorkRecord/pageWorkHourSummaryByTechnician',
        reqParams,
        titleMap: {
          repairTechnicianName: '技师姓名',
          repairItemCode: '维修项目代码',
          repairItemName: '维修项目名称',
          serviceProxyCode: '接车施工单',
          finishAt: '完工时间',
          orderStatusLabel: '工单状态',
          checkoutTypeName: '结算类型',
          dealerName: '门店名称',
          carPlate: '车牌',
          vehProfileVin: 'VIN',
          serviceAdvisorName: '客户经理',
          workHour: '工时',
          price: '工时单价',
          repairAmount: '工时金额',
          discountAmount: '工时优惠金额'
        },
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '技师工时统计（按技师）.xlsx');
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
    },
    getData () {
      this.loading = true;
      pageWorkHourSummaryGroupByTechnician({ ...this.getFormData(), groupBy: 'technician', pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
        this.tableData = (res && res.records) || [];
        this.total = (res && res.total) || 0;
      }).finally(() => {
        this.loading = false;
      });
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });
      if (data.finishDate && data.finishDate.length === 2) {
        data.startDate = data.finishDate[0];
        data.endDate = data.finishDate[1];
        delete data.finishDate;
      }
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.ais-pagination {
  margin-top: 16px;
  text-align: right;
}
// 展开区内边距清零：明细子表列与主表列对齐、宽度撑满展开区，从而随主表横向滚动
// ::v-deep .vxe-body--expanded-cell {
//   padding: 0;
// }
</style>
