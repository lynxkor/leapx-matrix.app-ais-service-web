<template>
    <el-dialog class="m-start-work-dialog" title="存在异常清单,需要清空异常清单后才能生成差异单" width="80%" :visible.sync="dialogVisible" @close="close">
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="partCode" title="备件编码" />
                <vxe-column field="partName" title="备件名称" />
                <vxe-column field="locationCode" title="盘点前库存总数" />
                <vxe-column field="availableStock" title="最新库存总数" />
                <vxe-column field="returnableQuantity" title="最新冻结库存" />
                <vxe-column field="inboundPrice" title="最新共享库存" />
                <vxe-column field="returnQuantity" title="最新可用库存" />
                <vxe-column field="returnQuantity" title="实盘数量" />
                <vxe-column field="returnQuantity" title="差异类型" />
                <vxe-column field="returnQuantity" title="差异数" />
                <vxe-column field="returnQuantity" title="不可盘点原因">
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">清空异常清单&生成差异单</el-button>
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">导 出</el-button>
                <el-button size="small" @click="close">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { stockTakingDifferenceApply } from '@/api/sparepart/warehouse/stockTaking/index';

export default {
  name: 'DifferenceDialog',
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
      submitLoading: false,
      form: {
        description: ''
      }
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    async submit () {
      this.submitLoading = true;
      if (!this.form.description) {
        this.$message.error('请填写退货原因！');
        this.submitLoading = false;
        return;
      }
      if (this.tableData.some(item => item.returnQuantity <= 0)) {
        this.$message.error('退货数量必须大于0！');
        this.submitLoading = false;
        return;
      }
      const params = {
        id: this.tableData[0].id,
        description: this.form.description,
        list: this.tableData.map(item => ({
          id: item.id,
          returnQuantity: item.returnQuantity
        }))
      };
      await stockTakingDifferenceApply(params);
      this.$emit('update:visible', false);
      this.$emit('confirm');
      this.$message.success('清空异常清单&生成差异单成功！');
    }
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
