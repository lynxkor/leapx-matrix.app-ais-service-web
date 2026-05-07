<template>
  <div>
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
      <vxe-column title="附件类型" field="fileType" width="">
        <template #default="{ row, rowIndex }">
          <el-input
            v-if="eidtRowIndex === rowIndex"
            v-model="row.fileType"
            placeholder="请输入"
            />
          <span v-else>{{ row.fileType }}</span>
        </template>
      </vxe-column>
      <vxe-column field="quantity" width="">
        <template #header>
          <span class="ais-required">数量</span>
        </template>
        <template #default="{ row, rowIndex }">
          <el-input
            v-if="eidtRowIndex === rowIndex"
            v-model="row.quantity"
            placeholder="请输入"
            />
          <span v-else>{{ row.quantity }}</span>
        </template>
      </vxe-column>
      <vxe-column title="操作" :width="120" fixed="right" :resizable="false">
        <template #default="{ row, rowIndex }">
          <template v-if="eidtRowIndex === rowIndex">
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
              confirm-button-text="删除"
              confirm-button-type="danger"
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

import {
  techServiceActivityFileConfigDelete,
  techServiceActivityFileConfigPage,
  techServiceActivityFileConfigUpdate,
} from '@/api/claimreturn/claim/basic/serviceActivity';

import permissions from '@/libs/mixins/permissions';
import { cloneDeep } from 'lodash';

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
  },
  mixins: [permissions],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      // 正在编辑的行
      eidtRowIndex: -1,
      originTableData: [],
      //
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      options: {
      },
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
        this.originTableData = cloneDeep(res.records);
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
      techServiceActivityFileConfigDelete([row.id]).then((d) => {
        this.$message.success('删除成功');
        this.getTablePage();
      }).catch(() => {
      });
    },
    editRow (row, rowIndex) {
      if (this.eidtRowIndex !== -1) {
        this.$message.info('数据未保存');
        return;
      }
      this.eidtRowIndex = rowIndex;
    },
    // 取消
    cancelEdit (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
      } else {
        const originRow = this.getOriginRow(row.id);
        this.tableData.splice(rowIndex, 1, originRow); // 数据还原
      }
      if (rowIndex === this.eidtRowIndex) {
        this.eidtRowIndex = -1;
      }
    },
    // 数量验证
    validateQuantity (quantity) {
      if (!quantity) {
        this.$message.warning('请输入数量');
        return false;
      }

      if (!/^\d+(\.\d+)?$/.test(quantity)) {
        this.$message.warning('请输入有效的数字');
        return false;
      }

      if (parseFloat(quantity) <= 0) {
        this.$message.warning('数量必须大于0');
        return false;
      }
      return true;
    },
    // 行保存
    saveRowEdit (row) {
      const parmas = {};
      Object.keys(this.defaultNewRow).forEach(key => {
        parmas[key] = row[key];
      });
      parmas.activityId = this._id;

      if (!this.validateQuantity(parmas.quantity)) {
        return;
      }

      techServiceActivityFileConfigUpdate(parmas).then(id => {
        this.$message.success('更新成功');
        this.getTablePage();
        this.eidtRowIndex = -1;
      }).catch(e => {
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
    handleAdd (row) {
      if (this.eidtRowIndex !== -1) {
        this.$message.info('请先保存数据，再添加');
        return;
      }
      this.tableData.unshift(row);
      this.$refs.editTable.setEditRow(row);
      this.eidtRowIndex = 0;
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

  .action-button{
    margin: 0 5px;
    cursor: pointer;
    &.btn-edit{
      color:#4C4CD6;
    }
    &.btn-delete{
      color: #b91919 !important;;
    }
    &.disabled{
      cursor: not-allowed;
      color: var(--disabled-color);
    }
  }
</style>
