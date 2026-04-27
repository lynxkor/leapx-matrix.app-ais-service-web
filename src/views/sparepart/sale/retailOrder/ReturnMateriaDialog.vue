<template>
    <el-dialog class="m-start-work-dialog" title="申请退料" width="70%" :visible.sync="dialogVisible" @close="close">
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="sparePartCode" title="备件编码" width="12.5%" />
                <vxe-column field="sparePartName" title="备件名称" width="12.5%" />
                <vxe-column field="locationName" title="库位" width="12.5%" />
                <vxe-column field="availableQty" title="可用库存" width="12.5%" />
                <vxe-column field="qty" title="出库数量" width="12.5%" />
                <vxe-column field="applyReturnMaterialIsLabel" title="是否已申请" width="12.5%">
                    <template #default="{ row }">
                        <span v-if="row.applyReturnMaterialIs === '1'">是</span>
                        <span v-else>否</span>
                    </template>
                </vxe-column>
                <vxe-column title="退料原因" width="12.5%">
                    <template #default="{ row }">
                        <el-input v-model="row.returnMaterialReason" />
                    </template>
                </vxe-column>
                <vxe-column title="操作" width="120">
                    <template #default="{ rowIndex, row }">
                        <el-popconfirm :title="`确定要${row.applyReturnMaterialIs === '1' ? '取消退料申请' : '申请退料'}吗？`" @confirm="handleSubmitRow(rowIndex, row)">
                            <span slot="reference" type="text" size="small" class="btn-submit">{{ row.applyReturnMaterialIs === '1' ? '取消退料申请' : '申请退料' }}</span>
                        </el-popconfirm>
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { retailOrderDetailPage, applyReturnMaterial } from '@/api/sparepart/sale/retailOrder/index';

export default {
  name: 'RepairDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
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
      if (val) {
        this.initData();
      }
    },
  },
  methods: {
    async initData () {
      const params = {
        pageNum: 1,
        pageSize: 50,
        retailOrderId: this.id,
        outboundIs: 1
      };
      const res = await retailOrderDetailPage(params);
      this.tableData = res.records || [];
    },
    close () {
      this.$emit('success');
      this.$emit('update:visible', false);
    },
    async handleSubmitRow (rowIndex, row) {
      // 1. 获取当前填写的描述
      let description = (row.returnMaterialReason || '').trim();

      // 2. 如果当前没填，尝试继承
      if (!description) {
        let foundReason = '';

        // 【核心改进】从上一行开始往前找，直到找到有内容的为止
        // 不管是已申请还是未申请，只要有 returnMaterialReason 就算有效
        for (let i = rowIndex - 1; i >= 0; i--) {
          const prevDesc = (this.tableData[i].returnMaterialReason || '').trim();
          if (prevDesc) {
            foundReason = prevDesc;
            break; // 找到最近的非空描述，停止
          }
        }

        if (foundReason) {
          // 情况 A: 找到了，自动继承 (同时更新 row 对象，界面也会变)
          description = foundReason;
          row.returnMaterialReason = foundReason;
        } else {
          // 情况 B: 前面所有行都没填 (包括这是第一行)
          this.$message.error('请输入退料原因（首条或前序未填时必须手动填写）');
          return; // 阻止提交
        }
      }

      // 3. 执行提交
      this.submitLoading = true;
      const params = {
        id: row.id,
        applyReturnMaterialIs: row.applyReturnMaterialIs === '1' ? '0' : '1',
        returnMaterialReason: description
      };

      try {
        await applyReturnMaterial(params);
        this.$message.success('操作成功');
        this.initData();
      } catch (error) {
        this.$message.error('操作失败');
      } finally {
        this.submitLoading = false;
      }
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

    .btn-submit {
        color: #009100;
        cursor: pointer;
    }
}
</style>
