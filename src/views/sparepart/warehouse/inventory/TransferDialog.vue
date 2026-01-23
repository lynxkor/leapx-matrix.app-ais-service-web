<template>
    <el-dialog class="m-start-work-dialog" title="转移库位" width="800px" :visible.sync="dialogVisible" @close="close">
        <el-form :inline="true" :model="formData" size="small" label-width="70px">
            <el-form-item label="库位名称" prop="code">
                <el-input v-model="locationName" style="width: 222px;" placeholder="请输入库位名称" />
            </el-form-item>
            <page-search-action :isExpandable="false" :loading="loading" @submit="onSubmit" @reset="onReset" />
        </el-form>
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="warehouseName" title="仓库名称" />
                <vxe-column field="locationName" title="库位名称" />
                <vxe-column title="操作" width="120">
                    <template #default="{ row }">
                        <el-popconfirm
                            title="确定转移至此库位吗？"
                            @confirm="submit(row)"
                        >
                            <span
                            class="action-button btn-edit"
                            slot="reference"
                            type="text">
                            选择
                            </span>
                        </el-popconfirm>
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" @click="close">关 闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { listAll, addOrUpdate } from '@/api/sparepart/warehouse/inventory/index';
import PageSearchAction from '@/libs/components/AisPageSearchAction';

export default {
  name: 'TransferDialog',
  components: {
    PageSearchAction
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectionId: {
      type: Array,
      default: () => {
        return [];
      }
    },
    warehouseIds: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      selectedRows: [],
      // 领料人
      userList: [],
      tableData: [],
      formData: {},
      locationName: '', // 库位名称
      pageNum: 1,
      pageSize: 20,
      loading: false
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    },
  },
  methods: {
    initData () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        warehouseId: this.warehouseIds,
        codeOrName: this.locationName
      };
      listAll(params).then(res => {
        this.tableData = res || [];
      });
    },
    close () {
      this.$emit('close');
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    onSubmit () {
      this.initData();
    },
    onReset () {
      this.locationName = '';
      this.page = 1;
      this.pageSize = 20;
      this.initData();
    },
    async submit (row) {
      //  构建参数
      const params = {
        inventoryIdList: this.selectionId.map(item => item.id),
        locationId: row.id
      };
      try {
        await addOrUpdate(params);
        this.$message.success('转移库位成功');
        this.close();
      } catch (error) {
        this.$message.error('转移库位失败');
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {

    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
    ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
        padding: 8px 12px !important;
    }

    .start-work-content {
        .time-section {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e8e8e8;

            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        }

        .table-section {
            margin-top: 15px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

.action-button {
    margin: 0 5px;
    cursor: pointer;

    &.btn-edit {
        color: #4C4CD6;
    }
}
</style>
