<template>
    <el-dialog class="m-start-work-dialog" title="转共享调拨" width="80%" :visible.sync="dialogVisible" @close="close">
        <!-- 提示信息 -->
        <div class="tips-section" style="margin-bottom: 15px;">
            <h4>注: 请确保与对方门店沟通无误后，再进行转调拨操作</h4>
        </div>
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="dealerCode" title="共享门店编码" width="180" />
                <vxe-column field="dealerName" title="共享门店名称" width="180" />
                <vxe-column field="sharedContactPerson" title="共享联系人" width="180" />
                <vxe-column field="sharedContactInfo" title="共享联系方式" width="180" />
                <vxe-column field="partCode" title="备件编码" width="160" />
                <vxe-column field="pendingPartQty" title="待处理逻辑数量" width="160" />
                <vxe-column field="purchasePrice" title="最新采购价格" width="120" />
                <vxe-column field="sharedQty" title="共享数量" width="120" />
                <vxe-column field="suggestedSharedPrice" title="建议共享价格" width="120" />
                <vxe-column field="distance" title="距离" width="100" />
                <vxe-column title="调拨数量" width="100" fixed="right">
                    <template #default="{ row }">
                        <el-input v-model="row.qty" type="number" />
                    </template>
                </vxe-column>
                <vxe-column title="联系方式" width="180" fixed="right">
                    <template #default="{ row }">
                        <el-input v-model="row.contactInfo" />
                    </template>
                </vxe-column>
                <vxe-column title="操作" width="100" fixed="right">
                    <template #default="{ row }">
                      <el-popconfirm
                        title="是否确认申请调拨？"
                        @confirm="handleApplyTransfer(row)"
                      >
                        <span slot="reference" class="action-button btn-edit" size="small">申请调拨</span>
                      </el-popconfirm>
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { boToTransferPage, applyBoToTransfer } from '@/api/sparepart/purchase/backOrder/index';

export default {
  name: 'TransferDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    transferId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      // 模拟表格数据
      tableData: [],
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    transferId (val) {
      if (val) {
        this.getData(val);
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.$emit('getData');
    },
    async getData (val) {
      const res = await boToTransferPage({ id: val });
      this.tableData = (res || []).map(item => ({
        ...item,
        qty: Math.min(item.pendingPartQty || 0, item.sharedQty || 0) // 调拨数量：默认待处理备件数量和共享数量的最小值
      }));
    },
    async handleApplyTransfer (row) {
      const maxQty = Math.min(row.pendingPartQty || 0, row.sharedQty || 0);

      // 调拨数量校验
      if (!row.qty && row.qty !== 0) {
        this.$message.warning('请输入调拨数量');
        return;
      }

      const qty = parseInt(row.qty, 10);
      if (isNaN(qty) || qty <= 0) {
        this.$message.warning('调拨数量必须大于0');
        return;
      }
      if (qty > maxQty) {
        this.$message.warning('调拨数量应小于等于待处理逻辑数量和共享数量的最小值');
        return;
      }

      // 找到当前行在表格中的索引
      const currentIndex = this.tableData.findIndex(item => item.id === row.id);
      if (currentIndex === -1) {
        return;
      }

      let contactInfo = row.contactInfo;

      // 第一行必填校验
      if (currentIndex === 0) {
        if (!contactInfo) {
          this.$message.warning('第一行的联系方式为必填项');
          return;
        }
      } else {
        // 非第一行且未填，向上继承最近一个有值的行
        if (!contactInfo) {
          for (let i = currentIndex - 1; i >= 0; i--) {
            if (this.tableData[i].contactInfo) {
              contactInfo = this.tableData[i].contactInfo;
              break;
            }
          }
          // 如果往上找都没有，则提示必填（因为没有上一行可继承）
          if (!contactInfo) {
            this.$message.warning('联系方式为必填项，请先填写上方行的联系方式');
            return;
          }
        }
      }

      // 构建参数（使用继承后的contactInfo）
      const params = {
        id: this.transferId,
        inventoryId: row.id,
        qty: row.qty,
        contactInfo: contactInfo,
      };

      // 可选：自动回填到当前行，让用户看到继承的值
      if (!row.contactInfo && contactInfo) {
        row.contactInfo = contactInfo;
      }
      try {
        await applyBoToTransfer(params);
        this.getData(this.transferId);
        this.$message.success('调拨成功');
      } catch (error) {
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

    .action-button {
      margin: 0 5px;
      cursor: pointer;

      &.btn-edit {
        color: var(--leap-color-link);
      }
    }
}
</style>
