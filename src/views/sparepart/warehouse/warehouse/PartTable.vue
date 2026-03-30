<template>
    <edit-table
      ref="editTable"
      :columns="columns"
      :data="tableData"
      :defaultNewRow="defaultNewRow"
      :show-toolbar="false"
      :options="options"
      :auth="{ delete: canAddOrUpdate }"
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
      <template #btn-middle="{ row, rowIndex }">
        <el-button
          type="text"
          @click="openPane(row, rowIndex)"
          class="action-button btn-edit"
          :disabled="disabled"
          :class="{
            'active': selectedRow.id === row.id,
            'disabled': disabled,
          }"
          >
          编辑
        </el-button>
      </template>
    </edit-table>
  </template>
<script>
import { uIntRule } from '@/validation/rule';
import { locationPage, locationOrUpdate, locationDel } from '@/api/sparepart/warehouse/warehouse/index';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';

export default {
  props: {
    moduleKey: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    id: {
      type: String,
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
      defaultNewRow: {
        partId: '',
        partCode: '',
        partName: '',
        purchasePrice: '',
        partQuantity: '',
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      options: {
      },
      columns: [
        {
          field: 'locationName',
          title: '库位名称',
          width: '20%',
          editRender: { name: 'ElInput' },
        },
        {
          field: 'remark',
          title: '备注',
          width: '20%',
          editRender: { name: 'ElInput', props: { type: 'string' } }
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '20%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'updateTime',
          title: '修改时间',
          width: '20%',
          editRender: { name: 'ElInput' }
        },
      ],
      selectedRow: {},
    };
  },
  watch: {
    id: {
      handler (val) {
        this.getDetailPageApi();
      }
    }
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      locationPage({
        warehouseId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      locationDel([row.id]).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
        this.getDetailPageApi();
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      const parmas = {
        id: row.id,
        warehouseId: this._id, // 仓库ID
        locationName: row.locationName, // 席位名称
      };
      locationOrUpdate(parmas).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
      }).catch(e => {
        defer.reject();
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
    // -------------
    handleAdd (newItem) {
      this.$refs.editTable.addRow(newItem);
    },
    openPane (row, rowIndex) {
      this.selectedRow = row;
      this.$emit('openPane', row, rowIndex);
    }
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
