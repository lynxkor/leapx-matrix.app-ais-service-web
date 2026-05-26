<template>
  <div class="common-section-table pb-0">
    <vxe-table
      ref="recordTable"
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
      <vxe-column field="approverUserName" title="审批人"></vxe-column>
      <vxe-column field="approvalTime" title="审批时间"></vxe-column>
      <vxe-column field="approvalResultLabel" title="审批结果"></vxe-column>
      <vxe-column field="approvalRemark" title="审批说明"></vxe-column>
      <vxe-column field="errorCode" title="错误代码"></vxe-column>
      <vxe-column field="errorContent" title="错误内容"></vxe-column>
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
import { warrantyApplyApprovalPage } from '@/api/claimreturn/claim/warrantyapply/warrantyApplyApproval';

export default {
  props: {
    id: {
      type: String,
    },
  },
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
        if (val) {
          this.getDetailPageApi();
        }
      }
    },
  },
  mounted () {
    if (this._id) {
      this.getDetailPageApi();
    }
  },
  methods: {
    getDetailPageApi () {
      warrantyApplyApprovalPage({
        applyId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total;
      });
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
