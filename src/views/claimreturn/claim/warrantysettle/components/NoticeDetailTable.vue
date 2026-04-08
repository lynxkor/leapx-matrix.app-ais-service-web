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
      <vxe-column field="warrantyApply" title="保修申请单"></vxe-column>
      <vxe-column field="warrantyTypeName" title="保修类型"></vxe-column>
      <vxe-column field="vin" title="VIN"></vxe-column>
      <vxe-column field="workHourTotal" title="工时总额">
        <template #default="{ row }">
          {{ row.workHourTotal }}
        </template>
      </vxe-column>
      <vxe-column field="partTotal" title="零件总额">
        <template #default="{ row }">
          {{ row.partTotal }}
        </template>
      </vxe-column>
      <vxe-column field="otherTotal" title="其他总额">
        <template #default="{ row }">
          {{ row.otherTotal }}
        </template>
      </vxe-column>
      <vxe-column field="totalAmount" title="总金额">
        <template #default="{ row }">
          {{ row.totalAmount }}
        </template>
      </vxe-column>
      <vxe-column field="determineAmount" title="判定金额">
        <template #default="{ row }">
          {{ row.determineAmount }}
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
import { getList } from '@/api/claimreturn/claim/warrantysettle/warrantySettleClaimDetail';

export default {
  name: 'NoticeDetailTable',
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
      getList({
        settleId: this._id,
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
