<template>
  <el-dialog
    class="m-select-rights-dialog"
    title="权益核销"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="select-rights-content" v-loading="loading">
      <div class="action-section">
        <em>*权益只适用该施工单对应的维修类型</em>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <vxe-table
          ref="rightsTable"
          :data="tableData"
          stripe
          :row-config="{isHover: true}"
          resizable
          max-height="500"
          border="inner"
          size="medium"
          :checkbox-config="{checkField: 'checked', checkMethod: checkMethod}"          @checkbox-change="handleSelectionChange"
          @checkbox-all="handleSelectionChange"
          :row-class-name="tableRowClassName"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column field="rightsCode" title="权益ID" width="250" show-overflow="tooltip" />
          <vxe-column field="rightsName" title="权益名称" width="200" show-overflow="tooltip" />
          <vxe-column field="cardTypeLabel" title="卡券类型" width="120" align="center" />
          <vxe-column field="serviceType" title="适用维修类型" width="120" align="center">
            <template #default="{ row }">
              {{ getServiceTypeText(row.serviceType) }}
            </template>
          </vxe-column>
          <vxe-column field="cardDiscount" title="卡券折扣" width="100" align="right" />
          <vxe-column field="paymentAmount" title="满减金额" width="100" align="right">

          </vxe-column>
          <vxe-column field="createDate" title="领券时间" width="160" align="center" />
          <vxe-column field="effectDate" title="有效期" width="320" align="center">
            <template #default="{ row }">
              {{ getValidityPeriodText(row) }}
            </template>
          </vxe-column>
          <vxe-column field="rightsStatusLabel" title="状态" width="100" align="center">
          </vxe-column>
        </vxe-table>
      </div>
    </div>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit">核销选中权益</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { rightsList, rightsFreeze } from '@/api/maintain/sp/serviceStatement/index';

export default {
  name: 'SelectRightsDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    serviceProxyId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      loading: false,
      submitLoading: false,
      tableData: []
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
    handleSelectionChange ({ records }) {
      this.tableData.forEach(row => {
        // 否则正常处理选择状态
        row.checked = records.some(item => item.rightsCode === row.rightsCode);
      });
    },

    // 获取权益列表
    async initData () {
      try {
        this.loading = true;
        const res = await rightsList(this.serviceProxyId);
        this.tableData = (res || []).map(item => ({ ...item, checked: false }));
      } catch (error) {
        console.error('获取权益列表异常:', error);
        this.$message.error('获取权益列表失败');
      } finally {
        this.loading = false;
      }
    },

    // 获取维修类型文本
    getServiceTypeText (serviceType) {
      const typeMap = {
        1: '保养',
        2: '维修',
        3: '喷漆',
        4: '钣金'
      };
      return typeMap[serviceType] || '-';
    },

    // 格式化金额
    formatAmount (amount) {
      if (!amount) return '-';
      return parseFloat(amount).toFixed(2);
    },

    // 获取有效期文本
    getValidityPeriodText (row) {
      const effectDate = row.effectDate || '';
      const expiryDate = row.expiryDate || '';
      return `${effectDate} ~ ${expiryDate}`;
    },

    // 获取状态文本
    getStatusText (status) {
      const statusMap = {
        1: '未使用',
        2: '已使用',
        3: '已过期',
        4: '已冻结'
      };
      return statusMap[status] || '未知';
    },

    // 获取状态标签类型
    getStatusType (status) {
      const typeMap = {
        1: 'success',
        2: 'info',
        3: 'warning',
        4: 'danger'
      };
      return typeMap[status] || 'info';
    },

    // 提交核销
    async submit () {
      const selectedRows = this.tableData.filter(row => row.checked);

      if (selectedRows.length === 0) {
        this.$message.warning('请选择要核销的权益');
        return;
      }

      try {
        this.submitLoading = true;
        const params = {
          statementId: this.serviceProxyId,
          writeOffReqList: selectedRows
        };

        await rightsFreeze(params);
        this.$message.success('权益核销成功');
        this.$emit('refresh');
        this.close();
      } catch (error) {
        console.error('权益核销异常:', error);
        this.$message.error('权益核销失败');
      } finally {
        this.submitLoading = false;
      }
    },

    close () {
      this.$emit('update:visible', false);
    },

    closed () {
      this.tableData = [];
    },
    // 设置行的CSS类名
    tableRowClassName ({ row }) {
      if (row.isChange === false) {
        return 'disabled-row';
      }
      return '';
    },

    // 控制复选框是否可用
    checkMethod ({ row }) {
      return row.isChange === true; // 当isChange为false时，复选框不可选
    },
  }
};
</script>

<style lang="scss" scoped>
.m-select-rights-dialog {
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }

  .select-rights-content {
    .action-section {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      font-weight: 500;
      align-items: center;
      em {
        color: var(--leap-color-danger);
        margin-left: 5px;
        font-style: normal;
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
  ::v-deep .vxe-table .disabled-row {
    background-color: #f5f7fa !important;
    color: #c0c4cc !important;
  }

  ::v-deep .vxe-table .disabled-row .vxe-checkbox--icon {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  ::v-deep .vxe-table .disabled-row .vxe-cell {
    cursor: not-allowed !important;
  }
}
</style>
