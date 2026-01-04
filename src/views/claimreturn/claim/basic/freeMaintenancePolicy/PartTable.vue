<template>
  <edit-table
    ref="editTable"
    :columns="columns"
    :data="tableData"
    :defaultNewRow="defaultNewRow"
    :show-toolbar="false"
    :options="options"
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
    <template #btn-middle="{ row, rowIndex }">
      <el-button
        type="text"
        @click="onReplace(row, rowIndex)"
        class="action-button btn-edit"
        :disabled="disabled"
        :class="{
          'active': selectedRow.id === row.id,
          'disabled': disabled,
        }"
        >
        替换件
      </el-button>
    </template>
  </edit-table>
</template>
<script>
import { uIntRule } from '@/validation/rule';
import {
  freeMaintenancePolicyPartDetailPage, // 免保零件明细分页查询
  freeMaintenancePolicyPartDetailUpdate, // 免保零件明细新增/编辑
  freeMaintenancePolicyPartDetailDelete,
} from '../../../../../api/claimreturn/claim/basic/freeMaintenancePolicy';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';

export default {
  props: {
    currentVehicleId: {
      type: String,
    },
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
          field: 'partCode',
          title: '零件编码',
          width: '25%',
        },
        {
          field: 'partName',
          title: '零件名称',
          width: '25%',
        },
        {
          field: 'partQuantity',
          title: '数量',
          width: '25%',
          editable: true,
          editRender: {
            name: 'ElInputNumber',
            props: {
              controls: false,
              precision: 0,
            }
          },
          rules: [
            { required: true, message: '请输入数量', trigger: 'blur' },
          ],
        },
        {
          field: 'purchasePrice',
          title: '采购单价',
          width: '25%',
        },
      ],
      selectedRow: {},
    };
  },
  watch: {
    currentVehicleId: {
      handler () {
        this.getDetailPageApi();
      }
    },
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
      freeMaintenancePolicyPartDetailPage({
        vehicleRegisteredModelId: this.currentVehicleId || '',
        freeMaintenancePolicyId: this._id,
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
      freeMaintenancePolicyPartDetailDelete([row.id]).then((d) => {
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
        partQuantity: row.partQuantity, // 零件数量
        freeMaintenancePolicyId: this._id, // 免保政策ID
        vehicleRegisteredModelId: this.currentVehicleId, // 公告车型ID
      };
      freeMaintenancePolicyPartDetailUpdate(parmas).then(id => {
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
    onReplace (row, rowIndex) {
      this.selectedRow = row;
      this.$emit('replace', row, rowIndex);
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
