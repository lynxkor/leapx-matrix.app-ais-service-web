<template>
  <el-dialog class="m-start-work-dialog" title="外购件入库单退货" width="800px" :visible.sync="dialogVisible" @close="close">
    <el-form :model="form" ref="ruleForm" label-width="80px" class="form-edit">
      <el-form-item label="退货原因：" prop="description">
        <el-input v-model="form.description" placeholder="请输入退货原因"></el-input>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <div class="table-section">
      <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
        <vxe-column field="sparePartCode" title="备件编码" />
        <vxe-column field="sparePartName" title="备件名称" />
        <vxe-column field="locationName" title="库位编码" />
        <vxe-column field="availableQty" title="可用库存" />
        <vxe-column field="returnableQty" title="可退数量" />
        <vxe-column field="inboundAmount" title="入库金额" />
        <vxe-column field="qty" title="本次退货数量">
          <template #default="{ row }">
            <el-input
              v-model="row.qty"
              type="number"
              :min="1"
              :max="Math.min(row.availableQty, row.returnableQty)"
              @input="val => onQtyChange(row, val)"
            />
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
import { dealerInboundOrderDetailPage, dealerInboundOrderReturnApply } from '@/api/sparepart/inbound/dealerInboundOrder/index';

export default {
  name: 'OrderReturnDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
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
      if (val) {
        this.dialogVisible = val;
        this.getData();
      }
    },
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    // 获取最大可退数量
    getMaxQty (row) {
      return Math.min(row.availableQty, row.returnableQty);
    },
    // 处理数量变化
    onQtyChange (row, val) {
      const num = parseInt(val);
      const maxQty = this.getMaxQty(row);
      if (isNaN(num)) {
        row.qty = 1;
      } else if (num < 1) {
        row.qty = 1;
      } else if (num > maxQty) {
        row.qty = maxQty;
      } else {
        row.qty = num;
      }
    },
    // 请求数据
    async getData () {
      const params = {
        dealerInboundOrderId: this.orderId,
        pageNum: 1,
        pageSize: 1000
      };
      const res = await dealerInboundOrderDetailPage(params);
      this.tableData = res.records.map(item => ({
        ...item,
        qty: Math.min(item.availableQty, item.returnableQty)
      }));
    },
    async submit () {
      if (!this.form.description) {
        this.$message.warning('请填写退货原因！');
        return;
      }
      // 验证所有数量
      for (const item of this.tableData) {
        const maxQty = this.getMaxQty(item);
        if (item.qty < 1) {
          this.$message.warning('退货数量必须大于 0！');
          return;
        }
        if (item.qty > maxQty) {
          this.$message.warning('退货数量不允许大于可用库存和可退数量的最小值！');
          return;
        }
      }
      this.submitLoading = true;
      const params = {
        dealerInboundOrderId: this.orderId,
        description: this.form.description,
        details: this.tableData.map(item => ({
          sparePartId: item.sparePartId,
          qty: item.qty
        }))
      };
      await dealerInboundOrderReturnApply(params);
      this.submitLoading = false;
      this.close();
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
