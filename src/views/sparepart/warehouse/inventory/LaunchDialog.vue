<template>
    <el-dialog class="m-start-work-dialog" title="呆滞件上架" width="75%" :visible.sync="dialogVisible" @close="close">
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column field="partCode" title="备件编码" width="180" />
                <vxe-column field="partName" title="备件名称" width="160" show-overflow />
                <vxe-column field="costUnitPrice" title="最新采购价格" width="120" />
                <vxe-column field="suggestedSharedPrice" title="建议共享价格" width="150">
                    <template #default="{ row }">
                        <el-input v-model="row.suggestedSharedPrice" type="number" />
                    </template>
                </vxe-column>
                <vxe-column field="availableQty" title="可用库存" width="100" />
                <vxe-column title="本次上架库存" width="180">
                    <template #default="{ row }">
                        <el-input v-model="row.operateQty" type="number" />
                    </template>
                </vxe-column>
                <vxe-column title="联系人" width="150">
                    <template #default="{ row }">
                        <el-input v-model="row.sharedContactPerson" />
                    </template>
                </vxe-column>
                <vxe-column title="联系方式" width="180">
                    <template #default="{ row }">
                        <el-input v-model="row.sharedContactInfo" type="number" />
                    </template>
                </vxe-column>
                <vxe-column title="上架说明" width="180">
                    <template #default="{ row }">
                        <el-input v-model="row.sharedDescription" />
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">上 架</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { sharedShelves } from '@/api/sparepart/warehouse/inventory/index';

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
          operateQty: item.availableQty,
        }));
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    async submit () {
      if (this.tableData.some(item => item.operateQty > item.availableQty)) {
        this.$message.warning('上架库存不能大于可用库存');
        return;
      }
      if (this.tableData.some(item => !item.suggestedSharedPrice || item.suggestedSharedPrice <= 0)) {
        this.$message.warning('请输入建议共享价格');
        return;
      }
      // 注意：这里的校验逻辑需要调整。
      // 因为如果允许“继承上一行”，那么当前行为空是合法的。
      // 所以，我们只需要校验【第一行】或者【所有行最终处理后】是否有值。
      // 为了用户体验，建议保留校验，但提示语可以改为“至少第一行或前序行需填写联系人”等，
      // 或者简单点：先执行填充逻辑，再校验填充后的数据。

      // --- 新增步骤：数据填充逻辑 (继承上一行有效值) ---
      const filledTableData = this.tableData.map((item, index) => {
        // 创建副本，避免直接修改页面显示的数据（可选，看你是否希望页面自动填上）
        const newItem = { ...item };

        // 定义需要继承的字段
        const fieldsToInherit = ['sharedContactPerson', 'sharedContactInfo', 'sharedDescription'];

        fieldsToInherit.forEach(field => {
          // 如果当前项该字段为空 (null, undefined, 或 空字符串)
          if (!newItem[field]) {
            // 向上查找最近一个有值的行
            for (let i = index - 1; i >= 0; i--) {
              if (this.tableData[i][field]) {
                newItem[field] = this.tableData[i][field];
                break; // 找到后立即停止查找
              }
            }
            // 如果上面都没找到，newItem[field] 保持为空（后续校验会拦截）
          }
        });

        return newItem;
      });
      // --- 再次校验 (基于填充后的数据) ---
      // 现在校验 filledTableData，确保没有漏网之鱼
      if (filledTableData.some(item => !item.sharedContactPerson)) {
        this.$message.warning('请输入联系人（首行或前序行必须填写）');
        return;
      }
      if (filledTableData.some(item => !item.sharedContactInfo)) {
        this.$message.warning('请输入联系方式（首行或前序行必须填写）');
        return;
      }
      if (filledTableData.some(item => !item.sharedDescription)) {
        this.$message.warning('请输入上架说明（首行或前序行必须填写）');
        return;
      }

      // 2. 构建参数 (使用填充后的数据 filledTableData)
      const params = {
        partList: filledTableData.map(item => ({
          inventoryId: item.id,
          operateQty: item.operateQty,
          sharedContactPerson: item.sharedContactPerson,
          sharedContactInfo: item.sharedContactInfo,
          sharedDescription: item.sharedDescription,
          suggestedSharedPrice: item.suggestedSharedPrice,
        })),
      };
      this.submitLoading = true;
      try {
        await sharedShelves(params);
        this.$message.success('上架成功');
        this.submitLoading = false;
        this.tableData = [];
        this.close();
        this.$emit('submit');
      } catch (error) {
        this.$message.error('上架失败');
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
