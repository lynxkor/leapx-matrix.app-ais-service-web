<template>
    <el-dialog class="m-start-work-dialog" title="呆滞件下架" width="50%" :visible.sync="dialogVisible" @close="close">
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="partCode" title="备件编码" width="200" />
                <vxe-column field="partName" title="备件名称" width="200" />
                <vxe-column field="sharedQty" title="共享库存" width="200" />
                <vxe-column title="本次上架库存" width="200">
                    <template #default="{ row }">
                        <el-input v-model="row.operateQty" type="number" />
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">下 架</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { sharedRemoveShelves } from '@/api/sparepart/warehouse/inventory/index';

export default {
  name: 'RepairDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectionList: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      // 模拟表格数据
      tableData: [],
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    selectionList (val) {
      if (val.length) {
        this.tableData = val.map(item => ({
          ...item,
          operateQty: item.sharedQty,
        }));
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    async submit () {
      if (this.tableData.some(item => item.operateQty > item.sharedQty)) {
        this.$message.warning('下架库存不能大于共享库存');
        return;
      }
      const params = {
        partList: this.tableData.map(item => ({
          inventoryId: item.id,
          operateQty: item.operateQty
        })),
      };
      this.submitLoading = true;
      try {
        await sharedRemoveShelves(params);
        this.$message.success('下架成功');
        this.submitLoading = false;
        this.tableData = [];
        this.close();
        this.$emit('submit');
      } catch (error) {
        this.$message.error('下架失败');
        this.submitLoading = false;
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
</style>
