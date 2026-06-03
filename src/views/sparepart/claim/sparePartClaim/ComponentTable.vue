<template>
  <div>
    <vxe-table
      ref="table"
      :data="displayTableData"
      stripe
      resizable
      border="inner"
      size="medium"
      height="auto"
      min-height="0px"
      max-height="400px"
      width="1000px"
      :checkbox-config="{ checkField: 'checked' }"
    >
      <vxe-column
        v-for="column in columns"
        :key="column.field || column.title"
        v-bind="column"
      />
    </vxe-table>

    <!-- 分页组件 -->
    <div v-if="pagination && total > 0" class="pagination-wrapper">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    _id: {
      type: String,
      default: ''
    },
    // 分页相关属性
    pagination: {
      type: Boolean,
      default: false
    },
    // 外部API方法
    apiMethod: {
      type: Function,
      default: null
    },
    // 外部API方法
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      internalTableData: [],
      paginated: false
    };
  },
  computed: {
    displayTableData () {
      return (!this.paginated && this.tableData.length > 0) ? this.tableData : this.internalTableData;
    }
  },
  watch: {
    tableData: {
      handler (val) {
        if (val && val.length > 0) {
          this.total = val.length;
          this.paginated = false;
        }
      },
      immediate: true
    },
    apiMethod: {
      handler (newValue) {
        if (this.tableData.length === 0) {
          this.loadData();
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取选中的行数据
    getSelection () {
      return this.$refs.table ? this.$refs.table.getCheckboxRecords() : [];
    },
    // 清除选中状态
    clearSelection () {
      if (this.$refs.table) {
        this.$refs.table.clearCheckboxRow();
        this.$refs.table.clearCheckboxReserve();
      }
    },
    handleDelete (row, rowIndex) {
      this.$emit('delete-row', row, rowIndex);
    },
    // 加载数据方法
    async loadData (params = {}) {
      if (!this.apiMethod) {
        console.warn('未提供API方法');
        return;
      }
      try {
        const queryParams = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          claimOrderId: this._id
        };
        const response = await this.apiMethod(queryParams);
        // 更新内部数据和分页信息
        this.total = response.total || response.totals || 0;
        this.internalTableData = response.records || [];
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    },
    // 分页大小改变
    handleSizeChange (newSize) {
      this.paginated = true;
      this.pageSize = newSize;
      this.currentPage = 1;
      this.loadData();
      this.$emit('pagination-change', {
        page: this.currentPage,
        size: this.pageSize
      });
    },
    // 当前页改变
    handleCurrentChange (newPage) {
      this.paginated = true;
      this.currentPage = newPage;
      this.loadData();
      this.$emit('pagination-change', {
        page: this.currentPage,
        size: this.pageSize
      });
    },
    // 刷新数据
    refreshData (params = {}) {
      this.loadData(params);
    },
    // 获取当前分页信息
    getCurrentPagination () {
      return {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        total: this.total
      };
    }
  }
};
</script>

<style scoped>
.component-table-container {
  display: flex;
  flex-direction: column;
}

.pagination-wrapper {
  margin-top: 10px;
}
</style>
