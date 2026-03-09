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
    @value-change="onValueChange"
    @cell-edit="cellEdit"
  >
  </edit-table>
</template>
<script>
import { decimalRule } from '@/validation/rule';
import {
  techServiceActivityPartPage,
  techServiceActivityPartDelete,
  techServiceActivityPartUpdate,
} from '@/api/claimreturn/claim/basic/techServiceActivity';

import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';
import { getEnum, repairItemType } from '@/api/common';
import { getList as sparePartSupplierList } from '@/api/sparepart/basic/sparePartSupplier';
import { getList as partList } from '@/api/sparepart/basic/sparePart';

export default {
  props: {
    schemeId: {
      type: String,
    },
    id: {
      type: String,
    },
    serviceActivityItemId: {
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
        oldPartCode: [],
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
            decimalRule,
          ],
        },
        {
          field: 'allowDelete',
          title: '是否允许删除',
          width: '160',
          editable: true,
          editRender: {
            name: 'ElSwitch',
          },
          formatter: (cellValue, row, col) => {
            if (cellValue === true || cellValue === '1') {
              return '是';
            }
            return '否';
          }
        },
        {
          field: 'mainPart',
          title: '是否主因件',
          width: '160',
          editable: true,
          editRender: { name: 'ElSwitch' },
          formatter: (cellValue, row, col) => {
            if (cellValue === true || cellValue === '1') {
              return '是';
            }
            return '否';
          }
        },
        {
          field: 'oldPartCode',
          title: '旧件编码',
          width: '160',
          editable: true,
          editRender: {
            name: 'FetchSelect',
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.partRemote,
              placeholder: '请选择',
              'value-key': 'id',
              'label-key': 'partName',
            },
          },
        },
        {
          field: 'oldSupplierId',
          title: '旧件供应商',
          width: '160',
          editable: true,
          editRender: {
            name: 'FetchSelect',
            props: {
              filterable: true,
              clearable: true,
              placeholder: '请选择',
              'value-key': 'value',
              'label-key': 'label',
            },
          },
          formatter: (cellValue, row, col) => {
            if (row.oldSupplierName) {
              return row.oldSupplierName;
            }
            return cellValue;
          }
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
            { required: true, message: '必填', trigger: 'blur' },
          ],
          formatter: (cellValue, row, col) => {
            if (row.returnTypeLabel) {
              return row.returnTypeLabel;
            }
            return cellValue;
          }
        },
        {
          field: 'repairItemTypeId',
          title: '维修类型',
          width: '160',
          editable: true,
          editRender: {
            name: 'FetchSelect',
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.repairItemTypeRemote,
              placeholder: '请选择',
              'value-key': 'id',
              'label-key': 'name',
            },
          },
          formatter (cellValue, row) {
            if (row.repairItemTypeName) {
              return row.repairItemTypeName;
            }
            return cellValue;
          }
        },
      ],
      defaultNewRow: {
        id: '',
        activityId: '',
        schemeId: '',
        serviceActivityItemId: '',
        partId: '',
        partCode: '',
        partName: '',
        repairItemTypeId: '',
        repairItemTypeCode: '',
        repairItemTypeName: '',
        oldPartId: '',
        oldPartCode: '',
        oldPartName: '',
        oldSupplierId: '',
        oldSupplierCode: '',
        oldSupplierName: '',
        quantity: '',
        mainPart: '',
        allowDelete: '',
        returnType: '',
        returnTypeLabel: '',
      },
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
    },
    serviceActivityItemId: {
      handler (val) {
        this.getDetailPageApi();
      }
    }
  },
  mounted () {
    this.getDetailPageApi();
    this.returnTypeRemote();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      techServiceActivityPartPage({
        schemeId: this.schemeId || '',
        activityId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
        serviceActivityItemId: this.serviceActivityItemId,
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
      techServiceActivityPartDelete([row.id]).then((d) => {
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
        if (key === 'allowDelete' || key === 'mainPart') {
          parmas[key] = row[key] ? '1' : '0';
          return;
        }
        parmas[key] = row[key];
      });
      parmas.activityId = this._id;
      parmas.schemeId = this.schemeId;
      parmas.serviceActivityItemId = this.serviceActivityItemId;

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
    sparePartSupplierListApi (partId, row) {
      return sparePartSupplierList({
        sparePartId: partId,
        pageNum: 1,
        pageSize: 20,
      }).then(res => {
        const list = res.records || [];
        const options = list.map(item => {
          return {
            label: item.supplierName,
            value: item.supplierInfoId,
            labelDesc: item.supplierCode,
          };
        });
        // --- 下拉数据
        if (!row.__options__) {
          row.__options__ = {};
        }
        // 默认选择第一个
        if (!row.oldSupplierId && options.length) {
          const item = options[0];
          row.oldSupplierName = item.label;
          row.oldSupplierId = item.value;
          row.oldSupplierCode = item.labelDesc;
        }
        row.__options__.oldSupplierId = options?.length ? options : null;

        this.$refs.editTable.updateRow(row);
        return options;
      });
    },
    handleAdd (partId, row) {
      // 用零件id查找供应商，并填充第一条数据
      this.sparePartSupplierListApi(partId, row).then(() => {
        this.$refs.editTable.addRow(row);
      });
    },
    // 维修类型
    repairItemTypeRemote (query) {
      return repairItemType({
        nameLike: query,
        categorys: [10]
      });
    },
    returnTypeRemote () {
      getEnum('old_part_return_type').then(res => {
        const list = res?.map(item => {
          return {
            value: item.code,
            label: item.message,
            returnType: item.code,
            returnTypeLabel: item.message,
          };
        }) || [];
        this.options.returnType = list;
      });
    },
    // 零部件下拉接口
    partRemote (query) {
      return partList({
        partCodeOrNameLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    onValueChange ({ row, column, value }, option) {
      if (column.field === 'oldPartCode') {
        row.oldPartCode = option?.partCode;
        row.oldPartName = option?.partName;
        row.oldPartId = option?.id;
        this.partChange(row.oldPartId, row);
      } else if (column.field === 'oldSupplierId') {
        row.oldSupplierId = option?.value;
        row.oldSupplierName = option?.label;
        row.oldSupplierCode = option?.labelDesc;
      } else if (column.field === 'repairItemTypeId') {
        row.repairItemTypeName = option?.name;
      }
    },
    // 供应商列表
    partChange (id, row) {
      if (id) {
        this.sparePartSupplierListApi(id, row);
      } else {
        row.oldSupplierId = '';
        row.oldSupplierName = '';
        row.oldSupplierCode = '';
      }
    },
    //
    cellEdit ({ row, column }) {
      // 旧件供应商请求下拉options数据
      this.partChange(row.oldPartId, row);
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
