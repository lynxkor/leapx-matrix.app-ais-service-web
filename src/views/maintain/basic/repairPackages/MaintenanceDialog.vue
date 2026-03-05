<template>
    <el-dialog class="m-start-work-dialog" title="套餐类型维护" width="60%" :visible.sync="dialogVisible" @close="close">
        <div class="ais-button">
            <el-button size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
        </div>
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="partCode" title="序号">
                  <template #default="{ rowIndex }">
                    {{ rowIndex + 1 }}
                  </template>
                </vxe-column>
                <vxe-column field="name" title="套餐类型名称">
                  <template #default="{ row }">
                    <el-input v-model="row.name" size="small" placeholder="请输入内容" />
                  </template>
                </vxe-column>
                <vxe-column field="partName" title="状态">
                  <template #default="{ row }">
                    <el-popconfirm :title="`确定要${row.status === 1 ? '停用' : '启用'}该套餐类型吗？`" @confirm="handleEdit(row)">
                        <span slot="reference" type="text" :style="{ color: row.status === 1 ? '#B91919' : '#009100' }" size="small" class="btn-delete">{{ row.status === 1 ? '停用' : '启用' }}</span>
                    </el-popconfirm>
                  </template>
                </vxe-column>
                <vxe-column field="unPurchaseReason" title="操作">
                    <template #default="{ row,rowIndex }">
                        <el-button type="text" class="action-button btn-edit" @click="handleUpDown(row, 'UP')">上移</el-button>
                        <el-button type="text" class="action-button btn-edit" @click="handleUpDown(row, 'DOWN')">下移</el-button>
                        <el-popconfirm title="确定要删除该套餐类型吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(rowIndex)">
                            <span slot="reference" type="text" size="small" class="btn-delete">删除</span></el-popconfirm>
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button type="primary" size="small" :loading="loading" @click="handleSave">保 存</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { repairList, moveSort, addOrUpdateBatch, enableOrDisable } from '@/api/maintain/basic/repairPackages/index';

export default {
  name: 'MaintenanceDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      loading: false
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      this.getRepairList();
    }
  },
  methods: {
    close () {
      this.$emit('close');
    },
    handleAdd () {
      this.tableData.push({
        name: '',
        status: 1
      });
    },
    // 请求维修套餐类型维护接口
    async getRepairList () {
      const res = await repairList({});
      this.tableData = res || [];
    },
    // 启用停用套餐类型
    async handleEdit (row) {
      let status = row.status === 1 ? 0 : 1;
      const params = { idSet: [row.id], status: status };
      await enableOrDisable(params);
      this.$message.success('操作成功');
      this.getRepairList();
    },
    // 删除套餐类型
    handleDeleteRow (rowIndex) {
      this.tableData.splice(rowIndex, 1);
    },
    // 上移和下移
    async handleUpDown (row, direction) {
      await moveSort({ id: row.id, direction: direction });
      this.$message.success('操作成功');
      this.getRepairList();
    },
    async handleSave () {
      await addOrUpdateBatch(this.tableData);
      this.getRepairList();
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

.ais-button {
    margin-bottom: 12px;
}

.btn-delete {
    color: #B91919;
    cursor: pointer;
    margin-left: 5px;
}

</style>
