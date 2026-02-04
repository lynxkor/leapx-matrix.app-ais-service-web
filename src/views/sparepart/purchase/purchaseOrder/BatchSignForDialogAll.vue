<template>
    <el-dialog class="m-start-work-dialog" :title="title" width="500px" :visible.sync="dialogVisible" @close="close">
        <el-form :inline="true" :model="formData" size="small" label-width="70px">
            <el-form-item label="签收数量" prop="code">
                <el-input v-model="formData.qty" type="number" placeholder="请输入签收数量" />
            </el-form-item>
        </el-form>
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
    batchForm: {
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
      formData: {},
      title: '签收'
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    inbound (val) {
      if (val) {
        this.title = val ? '入库签收' : '签收';
      }
    }
  },
  methods: {
    close () {
      this.$emit('close');
    },
    async submit () {
      if (this.formData.qty <= 0) {
        this.$message.warning('请输入正确的签收数量');
        return;
      }
      //  构建参数
      const params = {
        purchaseOrderSignList: this.batchForm.map(item => ({
          purchaseOrderId: item.purchaseOrderId, // 使用 batchForm 中的 id
          qty: this.formData.qty // 使用用户输入的数量
        })),
        inbound: this.inbound
      };
      await batchSign(params);
      this.formData.qty = '';
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
}
</style>
