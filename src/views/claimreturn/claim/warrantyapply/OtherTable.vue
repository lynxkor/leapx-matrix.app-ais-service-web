<template>
  <div class="common-section-table pb-0">
    <vxe-table
      ref="editTable"
      :data="tableData"
      stripe
      show-overflow
      resizable
      :row-config="{ isHover: true }"
      border="inner"
      size="medium"
      min-height="0"
      max-height="400px"
    >
      <vxe-column field="repairItemCode" title="代码"></vxe-column>
      <vxe-column field="repairItemName" title="名称"></vxe-column>
      <vxe-column field="totalCostAmount" title="总金额"></vxe-column>
      <vxe-column field="remark" title="备注">
        <template #default="{ row, rowIndex }">
          <el-input
            v-if="editRowIndex === rowIndex"
            v-model="row.remark"
            placeholder="请输入备注"
            clearable
          />
          <span v-else>{{ row.remark }}</span>
        </template>
      </vxe-column>
      <vxe-column title="操作" :width="200" align="center" fixed="right" :resizable="false">
        <template #default="{ row, rowIndex }">
          <template v-if="editRowIndex === rowIndex">
            <span
              class="action-button btn-edit"
              @click="saveRowEdit(row, rowIndex)"
              v-if="canAddOrUpdate"
            >
              保存
            </span>
            <span
              class="action-button btn-edit"
              @click="cancelEdit(row, rowIndex)"
              v-if="canAddOrUpdate"
            >
              取消
            </span>
          </template>
          <template v-else>
            <span
              class="action-button btn-edit"
              @click="editRow(row, rowIndex)"
              v-if="canAddOrUpdate"
            >
              编辑
            </span>
            <el-popconfirm
              title="确定要删除这条记录吗？"
              @confirm="handleRemoveRow(row, rowIndex)"
              v-if="canAddOrUpdate"
            >
              <el-button
                class="action-button btn-delete"
                slot="reference"
                type="text">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </template>
      </vxe-column>
      <template #empty>
        <div class="m-vxe-table-empty-text">
          暂无数据
        </div>
      </template>
    </vxe-table>
    <div class="table-pagination">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
        :current-page="current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { warrantyApplyOtherPage, warrantyApplyOtherDelete, warrantyApplyOtherUpdate } from '@/api/claimreturn/claim/warrantyapply/warrantyApplyOther';

export default {
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    canAddOrUpdate: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  mixins: [],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      // 正在编辑的行
      editRowIndex: -1,
      originTableData: [],
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  watch: {
    _id: {
      handler (val) {
        this.getDetailPageApi();
      }
    },
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {},
  methods: {
    // 表格数据
    getDetailPageApi () {
      warrantyApplyOtherPage({
        applyId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.originTableData = cloneDeep(this.tableData);
        this.total = res.total;
      });
    },
    getOriginRow (id) {
      return this.originTableData.find(row => row.id === id);
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    handleRemoveRow (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
        return;
      }
      warrantyApplyOtherDelete([row.id]).then((d) => {
        this.$message.success('删除成功');
        this.getDetailPageApi();
      }).catch(() => {});
    },
    editRow (row, rowIndex) {
      if (this.editRowIndex !== -1) {
        this.$message.info('数据未保存');
        return;
      }
      this.editRowIndex = rowIndex;
    },
    // 取消
    cancelEdit (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
      } else {
        const originRow = this.getOriginRow(row.id);
        this.tableData.splice(rowIndex, 1, originRow);
      }
      if (rowIndex === this.editRowIndex) {
        this.editRowIndex = -1;
      }
    },
    // 行保存
    saveRowEdit (row) {
      warrantyApplyOtherUpdate({
        id: row.id,
        applyId: this._id,
        remark: row.remark,
      }).then(id => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
        this.editRowIndex = -1;
      }).catch(e => {});
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
    handleAdd (row) {
      if (this.editRowIndex !== -1) {
        this.$message.info('请先保存数据，再添加');
        return;
      }
      this.tableData.unshift(row);
      this.$refs.editTable.setEditRow(row);
      this.editRowIndex = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.action-button {
  margin: 0 5px;
  cursor: pointer;
  &.btn-edit {
    color: #4C4CD6;
  }
  &.btn-delete {
    color: #b91919 !important;
  }
  &.disabled {
    cursor: not-allowed;
    color: var(--disabled-color);
  }
}
</style>
