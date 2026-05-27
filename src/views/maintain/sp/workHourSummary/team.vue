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
        :tree-config="{ children: 'children', expandAll: false, treeNodeKey: '_treeKey' }"
        :row-class-name="rowClassName"
        :loading="loading"
        :auto-resize="true"
        max-height="800"
        resizable
        border
        show-overflow
        highlight-hover-row
      >
        <vxe-column type="seq" width="60" tree-node />
        <vxe-column field="groupName" title="班组名称" width="200" />

        <vxe-column title="工时数" width="140">
          <template #default="{ row }">
            {{ row._isSummary ? formatDecimal(row.totalWorkHour) : (isLeaf(row) ? formatDecimal(row.workHour) : '-') }}
          </template>
        </vxe-column>

        <vxe-column title="工时单价(元)" width="140">
          <template #default="{ row }">
            {{ row._isSummary ? '-' : (isLeaf(row) ? formatDecimal(row.price) : '-') }}
          </template>
        </vxe-column>

        <vxe-column title="工时金额(元)" width="140">
          <template #default="{ row }">
            {{ formatDecimal(row._isSummary ? row.totalAmount : (isLeaf(row) ? row.repairAmount : row.totalAmount)) }}
          </template>
        </vxe-column>

        <vxe-column title="工时优惠(元)" width="140">
          <template #default="{ row }">
            {{ formatDecimal(row._isSummary ? row.totalDiscount : (isLeaf(row) ? row.discountAmount : row.totalDiscount)) }}
          </template>
        </vxe-column>

        <vxe-column field="repairItemCode" title="维修项目代码" width="150" />
        <vxe-column field="repairItemName" title="维修项目名称" width="180" />
        <vxe-column field="repairTechnicianName" title="维修技师" width="120" />
        <vxe-column field="serviceProxyCode" title="接车施工单" width="180" />
        <vxe-column field="finishAt" title="完工时间" width="180" />
        <vxe-column field="orderStatusLabel" title="工单状态" width="120" />
        <vxe-column field="checkoutTypeName" title="结算类型" width="120" />
        <vxe-column field="dealerName" title="门店名称" width="180" />
        <vxe-column field="carPlate" title="车牌" width="150" />
        <vxe-column field="vehProfileVin" title="VIN" width="200" />
        <vxe-column field="serviceAdvisorName" title="客户经理" width="120" />
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
import debounce from 'lodash.debounce';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { pageWorkHourSummaryByTeam } from '@/api/maintain/sp/workHourSummary/index';
import { exportTable, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';

function getDefaultFinishDate () {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return [fmt(start) + ' 00:00:00', fmt(end) + ' 23:59:59'];
}

const defaultForm = {
  dealerCodes: [],
  finishDate: ''
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    FetchSelect
  },
  data () {
    return {
      pageTitle: '技师工时统计（按班组）',
      pageType: 'list',
      moduleKey: 'AISMC-workHourSummaryTeam',
      form: { ...defaultForm },
      show: false,
      loading: false,
      exportLoading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 20,
      total: 0
    };
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
    rowClassName ({ row }) {
      return row._isSummary ? 'summary-row' : '';
    },
    isLeaf (row) {
      return row._isSummary || !row.children || row.children.length === 0;
    },
    formatDecimal (val) {
      if (val === null || val === '' || isNaN(val)) return '-';
      return Number(val).toFixed(2);
    },
    onSubmit () {
      this.pageNum = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
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
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '技师工时统计（按班组）',
        dataFetchPath: 'maintain/web/sp/spRepairWorkRecord/pageWorkHourSummaryByTeam',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.xTable.getColumns().filter(c => c.field).map(c => [c.field, c.title])),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '技师工时统计（按班组）.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$message({ type: 'info', message: '请前往导出列表中查询导出结果' });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      pageWorkHourSummaryByTeam({ ...this.getFormData(), pageNum: this.pageNum, pageSize: this.pageSize }).then(res => {
        const records = res.records || [];
        this.total = res.total || 0;
        let keyIdx = 0;
        const rows = records.map(group => ({
          ...group,
          _treeKey: keyIdx++,
          children: (group.detailList || []).map(d => ({ ...d, _treeKey: keyIdx++ }))
        }));
        const toNum = v => (v === null || isNaN(v)) ? 0 : Number(v);
        const pageTotalWorkHour = records.reduce((sum, g) => sum + toNum(g.totalWorkHour), 0);
        const pageTotalAmount = records.reduce((sum, g) => sum + toNum(g.totalAmount), 0);
        const pageTotalDiscount = records.reduce((sum, g) => sum + toNum(g.totalDiscount), 0);
        this.tableData = [
          { groupName: '本页合计', totalWorkHour: pageTotalWorkHour, totalAmount: pageTotalAmount, totalDiscount: pageTotalDiscount, children: [], _isSummary: true, _treeKey: 'summary' },
          ...rows
        ];
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
.m-work-hour-summary-list {
}
.ais-pagination {
  margin-top: 16px;
  text-align: right;
}
::v-deep .summary-row {
  font-weight: bold;
  background-color: #f5f7fa;
}
</style>
