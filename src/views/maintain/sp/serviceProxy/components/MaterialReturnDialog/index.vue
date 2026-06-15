<template>
  <el-dialog
    class="m-material-return-dialog"
    title="退料"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="material-return-content" v-loading="loading">
      <!-- 出库单号 -->
      <div class="action-section">
        出库单号：<el-link type="success">{{ vehicleInfo.outboundOrderList[0]?.code }}</el-link>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <vxe-table
          ref="materialTable"
          :data="tableData"
          stripe
          :row-config="{isHover: true}"
          resizable
          border="inner"
          size="medium"
          min-height="0"
          max-height="500px"
        >
          <vxe-column type="seq" title="序号" width="70" align="center" />
          <vxe-column field="partsCode" title="零配件代码" width="150" show-overflow="tooltip" />
          <vxe-column field="partsName" title="零配件名称" width="150" show-overflow="tooltip" />
          <vxe-column field="isOutstock" title="是否出库" width="100" align="center">
            <template #default="{ row }">
              {{ row.isOutstock === 1 ? '是' : '否' }}
            </template>
          </vxe-column>
          <vxe-column field="planPickNumber" title="出库数量" width="100" align="center" />
          <vxe-column field="refundedNumber" title="退料数量" width="100" align="center" />
          <vxe-column title="剩余可退料数量" width="140" align="center">
            <template #default="{ row }">
              <el-input-number
                v-model="row.returnQuantity"
                :min="0"
                :max="getMaxReturnQuantity(row)"
                :precision="0"
                size="mini"
                controls-position="right"
                style="width: 100%"
              />
            </template>
          </vxe-column>
          <!-- <vxe-column title="退料状态" width="120" align="center">
            <template #default="{ row }">
              {{ getReturnStatusText(row) }}
            </template>
          </vxe-column> -->
          <vxe-column title="操作" width="100" align="center" fixed="right" :resizable="false">
            <template #default="{ row }">
              <el-popconfirm
                title="确定要将该零配件退料吗？"
                :disabled="!canReturn(row) || !!submittingRow"
                @confirm="handleMaterialReturn(row)"
              >
                <span
                  class="action-button btn-back"
                  slot="reference"
                  :class="{ 'is-disabled': !canReturn(row) || !!submittingRow }">
                  退料
                </span>
              </el-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getSpSparePartList, refundPart } from '@/api/maintain/sp/serviceProxy/index';

export default {
  name: 'MaterialReturnDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    vehicleInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      loading: false,
      submittingRow: null,
      tableData: [],
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    }
  },
  methods: {
    async initData () {
      await this.fetchSparePartList();
    },

    // 获取零配件列表
    async fetchSparePartList () {
      try {
        this.loading = true;
        const res = await getSpSparePartList({
          // 根据实际业务传入参数
          pageSize: 500,
          pageNum: 1,
          serviceProxyId: this.vehicleInfo.id
        });

        this.tableData = (res.records || []).map(item => ({
          ...item,
          returnQuantity: this.getInitialReturnQuantity(item)
        }));
      } catch (error) {
        console.error('获取零配件列表异常:', error);
      } finally {
        this.loading = false;
      }
    },

    // 计算初始退料数量
    getInitialReturnQuantity (row) {
      const maxQuantity = this.getMaxReturnQuantity(row);
      return maxQuantity > 0 ? maxQuantity : 0;
    },

    // 计算最大可退料数量（出库数量 - 已退料数量）
    getMaxReturnQuantity (row) {
      const planPickNumber = row.planPickNumber || 0;
      const refundedNumber = row.refundedNumber || 0;
      return Math.max(0, planPickNumber - refundedNumber);
    },

    // 判断是否可以退料
    canReturn (row) {
      const maxQuantity = this.getMaxReturnQuantity(row);
      return maxQuantity > 0 && (row.returnQuantity || 0) > 0 && row.isOutstock;
    },

    // 获取退料状态文本
    getReturnStatusText (row) {
      const isOutstock = +row.returnMaterialStatus || 0;
      if (isOutstock === 0) {
        return '待入库';
      } else if (isOutstock === 1) {
        return '已入库';
      } else if (isOutstock === 2) {
        return '部分入库';
      }
      return '不可退料';
    },

    // 获取退料状态标签类型
    getReturnStatusType (row) {
      const maxQuantity = this.getMaxReturnQuantity(row);
      const refundedNumber = row.refundedNumber || 0;
      const actualPickNumber = row.actualPickNumber || 0;

      if (actualPickNumber === 0) {
        return 'info';
      } else if (refundedNumber >= actualPickNumber) {
        return 'success';
      } else if (refundedNumber > 0) {
        return 'warning';
      } else if (maxQuantity > 0) {
        return 'info';
      }
      return 'danger';
    },

    // 处理退料
    async handleMaterialReturn (row) {
      const returnQuantity = row.returnQuantity || 0;

      if (returnQuantity <= 0) {
        this.$message.warning('请输入退料数量');
        return;
      }

      const maxQuantity = this.getMaxReturnQuantity(row);
      if (returnQuantity > maxQuantity) {
        this.$message.warning(`退料数量不能超过${maxQuantity}`);
        return;
      }

      try {
        this.submittingRow = row;
        row.refundNumber = row.returnQuantity;
        const res = await refundPart({
          ...row

        });
        this.$message.success('退料成功');
        // 刷新列表
        await this.fetchSparePartList();
        this.$emit('refresh');
      } catch (error) {
        console.error('退料异常:', error);
        this.$message.error('退料异常');
      } finally {
        this.submittingRow = null;
      }
    },

    close () {
      this.$emit('update:visible', false);
    },

    closed () {
      this.tableData = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-material-return-dialog {
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }

  .material-return-content {
    .action-section {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
    }

    .table-section {
      margin-top: 15px;
    }
    .btn-back {
      color: var(--leap-color-link);
      cursor: pointer;
      &.is-disabled{
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
