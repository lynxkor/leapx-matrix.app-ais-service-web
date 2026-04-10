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
      <vxe-column field="invoiceNo" title="发票号"></vxe-column>
      <vxe-column field="invoiceCompanyName" title="开票公司名称"></vxe-column>
      <vxe-column field="invoiceDate" title="发票开具日期"></vxe-column>
      <vxe-column field="amount" title="金额">
        <template #default="{ row }">
          {{ row.amount }}
        </template>
      </vxe-column>
      <vxe-column field="taxRate" title="税点">
        <template #default="{ row }">
          {{ row.taxRate }}%
        </template>
      </vxe-column>
      <vxe-column field="noTaxAmount" title="不含税金额">
        <template #default="{ row }">
          {{ row.noTaxAmount }}
        </template>
      </vxe-column>
      <vxe-column field="taxAmount" title="税额">
        <template #default="{ row }">
          {{ row.taxAmount }}
        </template>
      </vxe-column>
      <vxe-column field="createTime" title="创建时间"></vxe-column>
      <vxe-column title="操作" width="100" align="center" fixed="right" :resizable="false">
        <template #default="{ row }">
          <el-popconfirm
            title="确定要删除这条记录吗？"
            @confirm="handleDelete(row)"
          >
            <el-button
              class="action-button btn-delete"
              slot="reference"
              type="text">
              删除
            </el-button>
          </el-popconfirm>
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
import { warrantySettleInvoiceRecordPage, warrantySettleInvoiceRecordDelete } from '@/api/claimreturn/claim/warrantysettle/warrantySettleInvoiceRecord';

export default {
  name: 'InvoiceInfoTable',
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
      warrantySettleInvoiceRecordPage({
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
    handleDelete (row) {
      if (!row.id) {
        return;
      }
      warrantySettleInvoiceRecordDelete(row.id).then(() => {
        this.$message.success('删除成功');
        this.getTableData();
        this.$emit('success');
      }).catch(() => {
        this.$message.error('删除失败');
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.btn-delete{
  color: #B91919;
}
</style>
