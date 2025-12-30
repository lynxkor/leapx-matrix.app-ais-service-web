<template>
  <edit-table
    ref="editTable"
    :columns="columns"
    :data="tableData"
    :show-toolbar="false"
    :options="options"
    :defaultNewRow="{}"
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
import { uIntRule } from '@/validation/rule';
import {
  techServiceActivityPartPage,
  techServiceActivityPartDelete,
  techServiceActivityPartUpdate,
} from '../../../../../api/claimreturn/claim/basic/techServiceActivity';

import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';
import { getEnum } from '../../../../../api/common';
import { getList as sparePartSupplierList } from '../../../../../api/sparepart/basic/sparePartSupplier';

export default {
  props: {
    schemeId: {
      type: String,
    },
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
        returnType: [],
      },
      columns: [
        {
          field: 'partCode',
          title: '零件编码',
          width: '160',
        },
        {
          field: 'partName',
          title: '零件名称',
          width: '160',
        },
        {
          field: 'quantity',
          title: '数量',
          width: '160',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            uIntRule,
          ],
        },
        {
          field: 'allowDelete',
          title: '是否允许删除',
          width: '160',
          editable: true,
          editRender: {
            name: 'ElSwitch',
            formatter: this.formatter,
          },
          formatter: this.formatter,
        },
        {
          field: 'mainPart',
          title: '是否主因件',
          width: '160',
          editable: true,
          editRender: { name: 'ElSwitch' },
        },
        {
          field: 'oldPartCode',
          title: '旧件编码',
          width: '160',
          editable: true,
          editRender: {
            name: 'ElSelect',
            multiRow: true,
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.sparePartListApi,
              placeholder: '请选择',
              'suffix-icon': 'el-icon-search',
            },
          },
        },
        {
          field: 'oldSupplierName',
          title: '旧件供应商',
          width: '160',
          editable: true,
          editRender: {
            name: 'ElSelect',
            multiRow: true,
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.sparePartListApi,
              placeholder: '请选择',
              'suffix-icon': 'el-icon-search',
            },
          },
        },
        {
          field: 'returnType',
          title: '旧件返还类型',
          width: '160',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              filterable: true,
              clearable: true,
              placeholder: '请选择',
              'suffix-icon': 'el-icon-search',
            },
          },
          rules: [
            { required: true, message: '零件编码不能为空', trigger: 'blur' },
          ],
        },
        {
          field: 'repairItemTypeName',
          title: '维修类型',
          width: '160',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.sparePartListApi,
              placeholder: '请选择',
              'suffix-icon': 'el-icon-search',
            },
          },
        },
      ],
      selectedRow: {},
    };
  },
  watch: {
    schemeId: {
      handler () {
        this.getDetailPageApi();
      }
    },
    _id: {
      handler (val) {
        this.getDetailPageApi();
      }
    }
  },
  mounted () {
    this.getDetailPageApi();
    this.returnTypeRemote();
    console.log(this.moduleKey, 'moduleKey');
  },
  beforeDestroy () {
  },
  methods: {
    formatter () {
      return 'sdfsf';
    },
    // 表格数据
    getDetailPageApi () {
      techServiceActivityPartPage({
        schemeId: this.schemeId || '',
        activityId: this._id,
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
      techServiceActivityPartDelete([row.id]).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      const parmas = {
        id: row.id,
        partId: row.partId, // 零件ID
        quantity: row.quantity, // 数量
        activityId: this._id,
        schemeId: this.schemeId,
      };
      techServiceActivityPartUpdate(parmas).then(id => {
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
      sparePartSupplierList({
        sparePartId: newItem.partId,
        pageNum: 1,
        pageSize: 20,
      }).then(res => {
        const list = res.records || [];
        if (list.length) {
          const item = list[0];
          newItem.oldSupplierName = item.supplierName;
          newItem.oldSupplierId = item.supplierInfoId;
          newItem.oldSupplierCode = item.supplierCode;
        }
        console.log(newItem);
        this.$refs.editTable.addRow(newItem);
      });
    },
    onReplace (row, rowIndex) {
      this.selectedRow = row;
      this.$emit('replace', row, rowIndex);
    },
    // 旧件编码
    sparePartListApi () {},
    returnTypeRemote () {
      getEnum('old_part_return_type').then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.message,
            returnType: item.message,
          };
        }) || [];
        this.options.returnType = list;
      });
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
