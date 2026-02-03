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
      min-height="200px"
      max-height="600px"
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
      internalTableData: [], // 内部存储接口返回的数据
      useInternalData: true // 标识是否使用内部数据
    };
  },
  computed: {
  // 计算属性决定显示哪个数据源
    displayTableData () {
      return this.useInternalData ? this.internalTableData : this.tableData;
    }
  },
  mounted () {
    // 如果有API方法且启用分页，则初始化加载数据
    // if (this.apiMethod && this.pagination) {
    this.loadData();
    // }
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
          claimOrderId: this.$route.query.id
        };
        console.log(this.name, queryParams);

        const response = await this.apiMethod(queryParams);
        this.$message.success(this.name + '加载成功');
        console.log('response:', response);
        console.log('this.apiMethod:', this.apiMethod);

        // 更新内部数据和分页信息
        this.total = response.totals || 0;
        this.internalTableData = response.records || [];
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    },
    // 分页大小改变
    handleSizeChange (newSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // 重置到第一页
      this.loadData();
      this.$emit('pagination-change', {
        page: this.currentPage,
        size: this.pageSize
      });
    },
    // 当前页改变
    handleCurrentChange (newPage) {
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
