<template>
  <div>
  <vxe-table
    ref="editTable"
    :data="tableData"
    :class="{isEdit: isEdit}"
    stripe
    show-overflow
    resizable
    :row-config="{ isHover: true }"
    border="inner"
    size="medium"
    min-height="0"
    max-height="400px"
    >
    <vxe-column field="name" title="备件名称" ></vxe-column>
    <vxe-column field="mileageTypeLabel" title="里程类型" ></vxe-column>
    <vxe-column field="nextMaintenanceDate" title="下次保养日期" ></vxe-column>
    <vxe-column field="nextMileage" title="下次保养里程" ></vxe-column>
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
import { vehicleProfileMaintenanceRecordPage } from '@/api/datacenter/vehicle/vehicleProfile';
import permissions from '@/libs/mixins/permissions';

export default {
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    isEdit: {
      type: Boolean,
      default: false,
    }
  },
  components: {
  },
  mixins: [permissions],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
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
      handler (val) {
        this.getDetailPageApi();
      }
    },
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      vehicleProfileMaintenanceRecordPage({
        vehicleProfileId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
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

.isEdit{
  margin-left: 54px;
}
</style>
