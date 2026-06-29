<template>
  <div class="m-work-hour-detail-sub" v-loading="loading" element-loading-background="rgba(255,255,255,0.7)">
    <vxe-table
      :data="list"
      size="small"
      border="inner"
      show-overflow
      highlight-hover-row
      max-height="320px"
      :show-header="true"
    >
      <vxe-column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :title="col.title"
        :width="col.width"
        show-overflow
      >
        <template v-if="col.numeric" #default="{ row }">{{ formatDecimal(row[col.field]) }}</template>
      </vxe-column>
    </vxe-table>
    <el-pagination
      v-if="total > 0"
      class="sub-pagination"
      background
      small
      :current-page.sync="pageNum"
      :page-size.sync="pageSize"
      :page-sizes="[10, 20, 50]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    />
  </div>
</template>

<script>
export default {
  name: 'WorkHourDetailSubTable',
  props: {
    // 分组键(技师ID/班组ID)，由父级传入
    groupKey: {
      type: String,
      default: ''
    },
    // 已清洗的搜索条件(无分页)
    searchParams: {
      type: Object,
      default: () => ({})
    },
    // 父级提供的明细拉取方法，内部已封装 detailApi + groupBy
    fetchDetail: {
      type: Function,
      required: true
    },
    // 明细列定义 [{ field, title, width, numeric? }]
    columns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      list: [],
      loading: false
    };
  },
  created () {
    this.loadDetail();
  },
  methods: {
    loadDetail () {
      this.loading = true;
      this.fetchDetail({
        ...this.searchParams,
        groupKey: this.groupKey,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.list = (res && res.records) || [];
        this.total = (res && res.total) || 0;
        this.$emit('loaded');
      }).finally(() => {
        this.loading = false;
      });
    },
    onSizeChange (size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.loadDetail();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.loadDetail();
    },
    formatDecimal (val) {
      if (val === null || val === '' || isNaN(val)) return '-';
      return Number(val).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-work-hour-detail-sub{
  padding: 8px 8px 20px 8px;
}
.sub-pagination {
  margin-top: 8px;
  padding: 0 8px;
  text-align: right;
}
</style>
