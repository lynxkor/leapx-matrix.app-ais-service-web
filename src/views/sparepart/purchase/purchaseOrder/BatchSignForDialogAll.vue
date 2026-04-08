<template>
  <el-dialog class="m-start-work-dialog" :title="title" width="80%" :visible.sync="dialogVisible" @close="close">
    <!-- 数据表格 -->
    <div class="table-section">
      <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
        <vxe-column field="purchaseOrderCode" title="采购订单号" />
        <vxe-column field="sparePartCode" title="备件编码" />
        <vxe-column field="sparePartName" title="备件名称" />
        <vxe-column field="qty" title="签收数量">
          <template #default="{ row }">
            <!-- 绑定到当前行的 form.claimQty -->
            <el-input v-model="row.form.qty" type="number" placeholder="请输入签收数量" />
          </template>
        </vxe-column>
        <vxe-column title="操作" width="120">
          <template #default="{ index }">
            <el-popconfirm title="确定删除吗？" v-if="tableData.length > 1" @confirm="handleDel(index)">
              <span class="action-button btn-delete" slot="reference" type="text">删除</span>
            </el-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">关 闭</el-button>
        <el-button size="small" type="primary" @click="submit">签 收</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { batchSign } from '@/api/sparepart/purchase/purchaseOrder/index';

export default {
  name: 'BatchSignForDialogAll',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    signForList: {
      type: Array,
      default: () => []
    },
    inbound: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      title: '批量签收'
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    inbound (val) {
      if (val) {
        this.title = val ? '批量入库签收' : '批量签收';
      }
    },
    signForList: {
      handler (val) {
        if (val && val.length > 0) {
          // 为每行数据初始化 form 字段
          this.tableData = val.map(item => ({
            ...item,
            form: {
              qty: 1, // 默认为空
            }
          }));
        }
      },
      immediate: true
    }
  },
  methods: {
    close () {
      this.$emit('close');
    },
    // 删除当前行数据
    handleDel (index) {
      // 从 tableData 中移除当前行
      this.tableData.splice(index, 1);
    },
    async submit () {
      // 校验索赔数量不得为 0 或负数
      const invalidQty = this.tableData.some(row => {
        const qty = Number(row.form.qty);
        return isNaN(qty) || qty <= 0;
      });
      if (invalidQty) {
        this.$message.warning('签收数量必须大于 0，请修改后再提交！');
        return;
      }
      //  构建参数
      const params = {
        purchaseOrderSignList: this.tableData.map(item => ({
          purchaseOrderDetailId: item.id, // 使用 batchForm 中的 id
          qty: Number(item.form.qty) // 使用用户输入的数量
        })),
        inbound: this.inbound
      };
      await batchSign(params);
      this.tableData = [];
      this.$message.success(this.inbound ? '入库签收成功' : '签收成功');
      this.$emit('submit');
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

  &.btn-delete {
    color: #B91919;
  }
}
</style>
