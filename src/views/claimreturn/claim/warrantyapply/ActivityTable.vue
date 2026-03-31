<template>
  <div>
    <vxe-table
      ref="editTable"
      :data="tableData"
      stripe
      show-overflow
      resizable
      :row-config="{ isHover: true }"
      border="inner"
      size="medium"
      min-height="0"
      max-height="400px"
    >
      <vxe-column field="activityCode" title="活动编码"></vxe-column>
      <vxe-column field="activityName" title="活动名称"></vxe-column>
      <vxe-column field="startTime" title="活动开始时间"></vxe-column>
      <vxe-column field="endTime" title="活动结束时间"></vxe-column>
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
import { getList } from '@/api/claimreturn/claim/basic/serviceActivityVehicle';

export default {
  props: {
    vin: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    canAddOrUpdate: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  mixins: [],
  data () {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  watch: {
    vin: {
      handler (val) {
        if (val) {
          this.getDetailPageApi();
        }
      }
    },
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {},
  methods: {
    // 表格数据
    getDetailPageApi () {
      getList({
        vin: this.vin,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total;
      });
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi();
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailPageApi();
    },
  },
};
</script>

<style lang="scss" scoped>
.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
