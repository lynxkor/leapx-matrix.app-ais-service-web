<template>
  <el-dialog class="m-start-work-dialog" :title="title" width="80%" :visible.sync="dialogVisible" @close="close">
    <!-- 数据表格 -->
    <div class="table-section">
      <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
        <vxe-column field="purchaseOrderCode" title="采购订单号" />
        <vxe-column field="sparePartCode" title="备件编码" />
        <vxe-column field="sparePartName" title="备件名称" />
        <vxe-column field="settlementQty" title="结算数量" />
        <vxe-column field="inboundQty" title="已入库数" />
        <vxe-column field="claimQty" title="本次索赔数量">
          <template #default="{ row }">
            <!-- 绑定到当前行的 form.claimQty -->
            <el-input v-model="row.form.claimQty" type="number" placeholder="请输入数量" />
          </template>
        </vxe-column>
        <vxe-column field="claimType" title="本次索赔类型">
          <template #default="{ row }">
            <!-- 绑定到当前行的 form.claimType -->
            <fetch-select :request="fetchOptions" enumCode="ClaimTypeEnum" v-model="row.form.claimType" clearable
              filterable />
          </template>
        </vxe-column>
        <vxe-column field="claimDesc" title="索赔说明">
          <template #default="{ row }">
            <!-- 绑定到当前行的 form.claimDesc -->
            <el-input v-model="row.form.claimDesc" placeholder="请输入索赔说明" />
          </template>
        </vxe-column>
        <vxe-column title="操作" width="120">
          <template #default="{ row, index }">
            <div class="action-button btn-edit" v-if="Number(row.inboundQty) > 1" @click="handleCopy(row)">复制</div>
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
        <el-button size="small" type="primary" @click="submit">确 认</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { purchaseOrderClaim } from '@/api/sparepart/purchase/purchaseOrder/index';

export default {
  name: 'SubmitClaimDialog',
  components: {
    FetchSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    claimList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      title: '提交索赔申请'
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    claimList: {
      handler (val) {
        if (val && val.length > 0) {
          // 为每行数据初始化 form 字段
          this.tableData = val.map(item => ({
            ...item,
            form: {
              claimQty: 1, // 默认为空
              claimType: '20',
              claimDesc: ''
            }
          }));
        }
        this.title = val.length > 1 ? '批量提交索赔申请' : '提交索赔申请';
      },
      immediate: true
    }
  },
  methods: {
    // 复制当前行数据
    handleCopy (row) {
      if (this.tableData.length > 50) {
        this.$message.warning('单次最多支持50笔索赔明细');
        return;
      }
      // 创建新行数据，基于当前行的值
      const newRow = {
        ...row,
        form: {
          claimQty: row.form.claimQty || 1, // 保留原始输入值
          claimType: row.form.claimType || '20',
          claimDesc: row.form.claimDesc || ''
        }
      };

      // 将新行插入到表格数据末尾
      this.tableData.push(newRow);
    },
    // 删除当前行数据
    handleDel (index) {
      // 从 tableData 中移除当前行
      this.tableData.splice(index, 1);
    },
    close () {
      this.$emit('close');
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async submit () {
      // 效验索赔类型不能为空
      const invalidClaimType = this.tableData.some(row => {
        return !row.form.claimType;
      });

      if (invalidClaimType) {
        this.$message.warning('索赔类型不能为空，请修改后再提交！');
        return;
      }
      // 校验索赔数量不得为 0 或负数，且不能大于已入库数
      const invalidQty = this.tableData.some(row => {
        const claimQty = Number(row.form.claimQty);
        const inboundQty = Number(row.inboundQty);

        // 检查是否为有效数字、是否大于 0、是否不超过已入库数
        if (isNaN(claimQty) || claimQty <= 0 || claimQty > inboundQty) {
          this.$message.warning('索赔数量必须大于 0 且不能超过已入库数，请修改后再提交！');
          return true;
        }
        return false;
      });

      if (invalidQty) {
        return;
      }

      // 效验索赔说明不能为空
      const invalidClaimDesc = this.tableData.some(row => {
        return !row.form.claimDesc;
      });

      if (invalidClaimDesc) {
        this.$message.warning('索赔说明不能为空，请修改后再提交！');
        return;
      }

      // 构建参数：遍历 tableData 提取每行的输入值
      const params = {
        claimCreateList: this.tableData.map(row => ({
          purchaseOrderDetailId: row.id,
          claimDescription: row.form.claimDesc,
          claimType: row.form.claimType,
          claimQty: Number(row.form.claimQty)
        }))
      };

      try {
        await purchaseOrderClaim(params);
        this.$message.success('索赔申请成功');
        this.$emit('submit');
      } catch (error) {
        this.$message.error('索赔申请失败');
      }
    },
    handleAdd (row) {
      // 复制当前行逻辑（可根据需求补充）
      console.log('复制行:', row);
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

  &.btn-delete {
    color: #B91919;
  }
}
</style>
