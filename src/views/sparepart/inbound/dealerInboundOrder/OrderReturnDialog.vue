<template>
    <el-dialog class="m-start-work-dialog" title="外购件入库单退货" width="800px" :visible.sync="dialogVisible" @close="close">
        <el-form :model="form" ref="ruleForm" label-width="80px" class="form-edit">
            <el-form-item label="退货原因：" prop="description">
                <el-input v-model="form.description"   placeholder="请输入退货原因"></el-input>
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="partCode" title="备件编码" />
                <vxe-column field="partName" title="备件名称" />
                <vxe-column field="locationCode" title="库位编码" />
                <vxe-column field="availableStock" title="可用库存" />
                <vxe-column field="returnableQuantity" title="可退数量" />
                <vxe-column field="inboundPrice" title="入库金额" />
                <vxe-column field="returnQuantity" title="本次退货数量">
                  <template #default="{ row }">
                      <el-input v-model="row.returnQuantity" type="number" min="1" />
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 认</el-button>
                <el-button size="small" @click="close">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { dealerInboundOrderReturnApply } from '@/api/sparepart/inbound/dealerInboundOrder/index';

export default {
  name: 'OrderReturnDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderList: {
      type: Array,
      default: () => []
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
    },
    orderList (val) {
      if (val) {
        this.tableData = val.map(item => ({
          ...item,
          returnQuantity: 0
        }));
      }
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
      await dealerInboundOrderReturnApply(params);
      this.$emit('update:visible', false);
      this.$emit('confirm');
      this.$message.success('申请退货成功！');
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
