<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>
        xxx明细
        <div v-if="_id && !disabled" class="btns">
          <el-button plain type="primary" v-if="canAddOrUpdate" size="small" @click.stop="openAdd"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
          <el-button v-if="canAddOrUpdate" :disabled="!isSelect" size="small" @click.stop="handleRemoveRows">删除</el-button>
        </div>
      </h2>
    </div>
    <div v-if="_id" class="common-section-body">
      <div class="common-section-table">
        <!-- 明细表格 -->
        <edit-table
          ref="editTable"
          :columns="columns"
          :data="tableData"
          :defaultNewRow="disabled ? null : defaultNewRow"
          :show-toolbar="false"
          :options="options"
          :checkbox="true"
          :auth="{ edit: false, delete: canAddOrUpdate && !disabled }"
          :isFocusNewRow="false"
          :enableSingleRowSave="false"
          :showPagination="true"
          :current="current"
          :pageSize="pageSize"
          :total="total"
          @remove-row="handleRemoveRow"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
          @checkboxChange="checkboxChange"
        />
      </div>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
    {{#if isModalAddTable}}
    <add-data-dialog
      type="outbound"
      :visible.sync="visible"
      :_id="_id"
      @update="getTableData"
      />
    {{/if}}
  </section>
</template>
<script>

import {
  getDetailList,
  removeDetail,
} from '@/api/{{modulePath}}/index';
import EditTable from '@/libs/components/EditTable/index.vue';
{{#if isModalAddTable}}
import AddDataDialog from './AddDataDialog';
{{/if}}

export default {
  props: {
    canAddOrUpdate: {
      type: Boolean,
    },
    _id: {
      type: String,
    },
    // 禁用后无法添加和删除
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    EditTable,
    {{#if isModalAddTable}}
    AddDataDialog,
    {{/if}}
  },
  data () {
    return {
      defaultNewRow: {
        {{#each detailTable}}
        {{key}}: '', // {{description}}
        {{/each}}
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      //
      visible: false,
      // 表格内的下拉列表
      options: {
      },
      selectedRows: [],
      columns: [
        {{#each detailTable}}
        {
          field: '{{key}}',
          title: '{{description}}',
          width: '{{calc-width @root.detailTable}}',
        },
        {{/each}}
      ]
    };
  },
  computed: {
    isSelect () {
      return this.selectedRows?.length > 0;
    }
  },
  watch: {
    _id: {
      handler () {
        this.getTableData();
      },
      immediate: true
    }
  },
  mounted () {
    this.getTableData();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getTableData () {
      if (!this._id) {
        return;
      }
      getDetailList({
        // TODO 根据需求进行替换
        // xxxId: this._id,
        //
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
        this.selectedRows = [];
        this.$emit('data-change', this.tableData);
      });
    },
    openAdd () {
      this.visible = true;
    },
    handleRemoveRows () {
      // 您确定要移除选择的【{N}】条数据吗？
      this.$confirm('您确定要移除选择的【' + this.selectedRows.length + '】条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedRows.map(item => item.id);
        this.removeRows(ids);
      }).catch(() => {});
    },
    handleRemoveRow (row) {
      if (!row.id) {
        return;
      }
      this.removeRows([row.id]);
    },
    removeRows (ids) {
      removeDetail({
        id: this._id,
        detailIdList: ids,
      }).then((d) => {
        this.$message.success('删除成功');
        this.selectedRows = [];
        this.getTableData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败!'
        });
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
    checkboxChange (records) {
      this.selectedRows = records;
      this.$emit('checkboxChange', this.selectedRows);
    },
  },
};

</script>
<style lang="scss" scoped>
.btn-delete{
  color: #B91919;
}
</style>
