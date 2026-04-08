<template>
  <div class="common-section-table">
    <vxe-table
      ref="table"
      :data="tableData"
      stripe
      show-overflow
      resizable
      :row-config="{ isHover: true }"
      border="inner"
      size="medium"
      max-height="300px"
    >
      <vxe-column field="traceDetailCode" title="追溯明细"></vxe-column>
      <vxe-column field="traceTypeLabel" title="追溯类型"></vxe-column>
      <vxe-column field="businessCode" title="业务单据"></vxe-column>
      <vxe-column field="warrantyCode" title="保修申请单"></vxe-column>
      <vxe-column field="vin" title="VIN"></vxe-column>
      <vxe-column field="currentTraceAmount" title="本次追溯金额">
        <template #default="{ row }">
          {{ row.currentTraceAmount }}
        </template>
      </vxe-column>
      <template #empty>
        <div class="m-vxe-table-empty-text">
          暂无数据
        </div>
      </template>
    </vxe-table>
    <div class="table-pagination">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
        :current-page="current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { claimTraceOrderDetailList } from '@/api/claimreturn/claim/claimtrace/claimTraceOrderDetail';

export default {
  name: 'TraceDetailTable',
  props: {
    _id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  watch: {
    _id: {
      handler () {
        this.getTableData();
      },
      immediate: true
    }
  },
  methods: {
    getTableData () {
      if (!this._id) {
        return;
      }
      claimTraceOrderDetailList({
        settleAccountId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total || 0;
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getTableData();
    },
    currentPageChange (current) {
      this.current = current;
      this.getTableData();
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
