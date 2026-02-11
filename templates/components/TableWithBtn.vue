<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>
        旧件明细
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
          @save-row-edit="saveRowEdit"
          @remove-row="handleRemoveRow"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
          @checkboxChange="checkboxChange"
          @mask="mask"
        />
      </div>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
  </section>
</template>
<script>
import {
  getList, // 旧件库存详情分页查询
  getDetailDecryptField,
} from '@/api/claimreturn/oldpart/inventory/oem/index';
import {
  addDetail,
  removeDetail,
} from '@/api/claimreturn/oldpart/returnorder/index';
import EditTable from '@/libs/components/EditTable/index.vue';
import OldPartDialog from '../components/OldPartDialog';

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
    // OldPartDialog,
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
          width: '160',
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
      getList({
        // 根据需求进行替换
        // returnOrderId: this._id,
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
    // 行保存
    saveRowEdit (row, defer) {
    //   const parmas = {
    //     id: this._id,
    //     detailIdList: [],
    //   };
    //   addDetail(parmas).then(id => {
    //     defer.resolve(id);
    //     this.$message.success('更新成功');
    //   }).catch(e => {
    //     defer.reject();
    //   });
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
