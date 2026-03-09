<template>
  <edit-table
    ref="editTable"
    :columns="columns"
    :data="tableData"
    :show-toolbar="false"
    :options="options"
    :defaultNewRow="defaultNewRow"
    :auth="{ edit: canAddOrUpdate, delete: canAddOrUpdate }"
    :isFocusNewRow="false"
    :enableSingleRowSave="true"
    :showPagination="true"
    :current="current"
    :pageSize="pageSize"
    :total="total"
    @save-row-edit="saveRowEdit"
    @remove-row="handleRemoveRow"
    @page-size-change="pageSizeChange"
    @current-page-change="currentPageChange"
    :actionWidth="200"
    :emptyText="_id ? '' : '新增后，即可添加'"
    :disabled="disabled"
  >
  </edit-table>
</template>
<script>

import {
  techServiceActivityFileConfigDelete,
  techServiceActivityFileConfigPage,
  techServiceActivityFileConfigUpdate,
} from '@/api/claimreturn/claim/basic/techServiceActivity';

import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';
import { uIntRule } from '../../../../../../validation/rule';

export default {
  props: {
    id: {
      type: String,
    },
    moduleKey: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
  },
  components: {
    EditTable,
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
      options: {
      },
      columns: [
        {
          field: 'fileType',
          title: '附件类型',
          width: '50%',
          editable: true,
          editRender: { name: 'BaseInput' },
        },
        {
          field: 'quantity',
          title: '数量',
          width: '50%',
          editable: true,
          editRender: { name: 'BaseInput' },
          rules: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            uIntRule,
          ],
        },
      ],
      defaultNewRow: {
        id: '',
        activityId: '',
        fileType: '',
        quantity: '',
      },
      selectedRow: {},
    };
  },
  watch: {
    _id: {
      handler (val) {
        this.getTablePage();
      }
    }
  },
  mounted () {
    this.getTablePage();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getTablePage () {
      techServiceActivityFileConfigPage({
        activityId: this._id,
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
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      techServiceActivityFileConfigDelete([row.id]).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      const parmas = {};
      Object.keys(this.defaultNewRow).forEach(key => {
        parmas[key] = row[key];
      });
      parmas.activityId = this._id;

      techServiceActivityFileConfigUpdate(parmas).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
      }).catch(e => {
        defer.reject();
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getTablePage();
    },
    currentPageChange (current) {
      this.current = current;
      this.getTablePage();
    },
    // -------------
    handleAdd (newItem) {
      this.$refs.editTable.addRow(newItem);
    },
  },
};

</script>
<style lang="scss" scoped>
  .action-button{
    margin: 0 5px;
    cursor: pointer;
    &.btn-edit{
      color:#4C4CD6;
    }
    &.active{
      text-decoration: underline;
    }
    &.disabled{
      cursor: not-allowed;
      color: var(--disabled-color);
    }
  }
</style>
