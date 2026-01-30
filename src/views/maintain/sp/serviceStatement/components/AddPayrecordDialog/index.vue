<template>
  <div>
    <el-dialog
      class="m-add-payrecord-dialog"
      title="添加收款记录"
      width="1000px"
      :visible="visible"
      @close="close"
      @closed="closed"
    >
      <div class="payrecord-content">
        <!-- 头部信息区域 -->
        <div class="info-section">
          <div class="info-group">
            <div class="info-item">
              <span class="label">结算单号：</span>
              <span class="value">{{ baseInfo.code }}</span>
            </div>
            <div class="info-item">
              <span class="label">实际应付总金额：</span>
              <span class="value">{{
                formatAmount(baseInfo.payableAmount)
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">收款总金额：</span>
              <span class="value">{{ formatAmount(totalPayAmount) }}</span>
            </div>
          </div>
        </div>
        <!-- 新增按钮 -->
        <div class="action-section">
          <el-button size="small" type="primary" @click="handleAdd"
            >添加收款记录</el-button
          >
        </div>

        <!-- 表格区域 -->
        <div class="table-section">
          <vxe-table
            ref="payRecordTable"
            :data="tableData"
            stripe
            show-overflow
            :row-config="{ isHover: true }"
            resizable
            border="inner"
            size="medium"
            min-height="0"
            max-height="400px"
          >
            <vxe-column type="seq" title="序号" width="70" />
            <vxe-column field="payType" title="支付方式" width="150">
              <template #default="{ row }">
                <fetch-select
                  v-model="row.payType"
                  :options="payTypeOptions"
                  placeholder="请选择"
                  size="small"
                  clearable
                />
              </template>
            </vxe-column>
            <vxe-column field="payAmount" title="实际付款总额" width="150">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.payAmount"
                  size="small"
                  :precision="2"
                  :min="0"
                  controls-position="right"
                  @change="handlePayAmountChange"
                  style="width: 100%"
                ></el-input-number>
              </template>
            </vxe-column>
            <vxe-column field="invoiceType" title="发票类型" width="150">
              <template #default="{ row }">
                <fetch-select
                  v-model="row.invoiceType"
                  :options="invoiceTypeOptions"
                  :disabled="row.payType === 50"
                  placeholder="请选择"
                  size="small"
                  clearable
                />
              </template>
            </vxe-column>
            <vxe-column field="invoiceNumber" title="发票号码" width="150">
              <template #default="{ row }">
                <el-input
                  v-model="row.invoiceNumber"
                  size="small"
                  :disabled="row.payType === 50"
                  placeholder="请输入"
                ></el-input>
              </template>
            </vxe-column>
            <vxe-column field="rightsCode" title="权益代码" min-width="150">
              <template #default="{ row }">
                <el-input
                  v-model="row.rightsCode"
                  size="small"
                  placeholder="请输入"
                ></el-input>
              </template>
            </vxe-column>
            <vxe-column title="操作" width="80" fixed="right">
              <template #default="{ row, rowIndex }">
                <el-popconfirm
                  title="确定要删除这条记录吗？"
                  :disabled="row.payType === 50"
                  @confirm="handleDelete(row, rowIndex)"
                >
                  <span
                    slot="reference"
                    type="text"
                    size="small"
                    :class="['btn-delete', { disabled: row.payType === 50 }]"
                    >删除</span
                  >
                </el-popconfirm>
              </template>
            </vxe-column>
            <template #empty>
              <div class="m-vxe-table-empty-text">暂无数据</div>
            </template>
          </vxe-table>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FetchSelect from "@/libs/components/FetchSelect/index.vue";
import { getEnum } from "@/api/maintain/sp/serviceProxy/index";
import {
  addReceiptRecord,
  getStatementPayRecord,
  deleteRecord,
} from "@/api/maintain/sp/serviceStatement/index";

export default {
  name: "AddPayrecordDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    FetchSelect,
  },
  data() {
    return {
      tableData: [],
      baseInfo: {},
      // 支付方式选项
      payTypeOptions: [
        // { id: 1, name: '现金' },
        // { id: 2, name: '微信' },
        // { id: 3, name: '支付宝' },
        // { id: 4, name: '银行卡' },
        // { id: 5, name: '支票' },
        // { id: 6, name: '其他' }
      ],
      // 发票类型选项
      invoiceTypeOptions: [
        // { id: 1, name: '增值税专用发票' },
        // { id: 2, name: '增值税普通发票' },
        // { id: 3, name: '其他发票' }
      ],
    };
  },
  computed: {
    // 收款总金额
    totalPayAmount() {
      return this.tableData.reduce((sum, row) => {
        return sum + (+row.payAmount || 0);
      }, 0);
    },
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true,
    },
    info: {
      handler(val) {
        if (val && Object.keys(val).length > 0) {
          const { invoiceRecordResps, ...rest } = val;
          this.baseInfo = rest || {};
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initData() {
      // this.handleAdd();
      this.fetchOptions();
      this.getPayList();
    },
    getPayList() {
      getStatementPayRecord({
        statementId: this.baseInfo.id || "",
        page: 1,
        pageSize: 500,
      }).then((res) => {
        this.tableData = res.records || [];
        console.log(this.tableData);
      });
    },
    async fetchOptions(code) {
      getEnum("PaymentMethodEnum").then((res) => {
        this.payTypeOptions = res || [];
      });
      getEnum("InvoiceTypeEnum").then((res) => {
        this.invoiceTypeOptions = res || [];
      });
    },
    close() {
      this.$emit("update:visible", false);
    },
    closed() {
      // this.tableData = [];
      // this.baseInfo = {};
    },
    // 确认提交
    handleConfirm() {
      // 校验数据
      const isValid = this.validateData();
      if (!isValid) {
        return;
      }

      // 构建提交数据
      this.getSubmitData();
    },
    // 关闭弹窗
    handleClose() {
      this.close();
      this.clearFormData();
    },
    // 新增收款记录
    handleAdd() {
      // 计算剩余需付款金额
      const remainingAmount =
        (this.baseInfo.payableAmount || 0) - this.totalPayAmount;
      this.tableData.push({
        code: "",
        statementId: this.baseInfo.id || "",
        statementCode: this.baseInfo.code || "",
        payAmount: remainingAmount > 0 ? remainingAmount : 0,
        payType: null,
        rightsCode: "",
        invoiceNumber: "",
        invoiceType: null,
      });
    },
    // 删除收款记录
    handleDelete(row, index) {
      this.tableData.splice(index, 1);
      // deleteRecord(row.id).then(res => {
      //   this.$message.success('删除成功');
      // });
    },
    // 实际付款总额变化
    handlePayAmountChange() {
      // 可以在这里添加金额变化的逻辑处理
    },
    // 校验数据
    validateData(val) {
      for (let i = 0; i < this.tableData.length; i++) {
        const row = this.tableData[i];
        if (!row.payType && row.payType !== 0) {
          this.$message.warning(`第${i + 1}行请选择支付方式`);
          return false;
        }
        //支付类型为 权益抵扣时不校验金额
        if (row.payType !== 50 && (!row.payAmount || row.payAmount <= 0)) {
          this.$message.warning(`第${i + 1}行请输入实际付款总额`);
          return false;
        }
      }
      // 计算已有收款记录的总金额
      const payAmount = this.tableData.reduce((sum, row) => {
        return sum;
      }, 0);

      // 检查总收款金额是否超过实际应付金额
      if (payAmount > this.baseInfo.payableAmount) {
        this.$message.warning(
          `收款总金额不能超过实际应付总金额 ${this.formatAmount(
            this.baseInfo.payableAmount
          )}`
        );
        return false;
      }
      return true;
    },
    // 获取提交数据
    getSubmitData() {
      const data = {
        statementId: this.baseInfo.id || "",
        invoiceRecordList: this.tableData,
      };
      addReceiptRecord(data).then((res) => {
        this.$message.success("保存成功");
        this.close();
        this.$emit("refresh");
      });
    },
    // 格式化金额
    formatAmount(amount) {
      if (amount === null || amount === undefined) {
        return "0.00";
      }
      return parseFloat(amount).toFixed(2);
    },
  },
};
</script>

<style lang="scss" scoped>
.m-add-payrecord-dialog {
  .m-vxe-table-empty-text {
    text-align: left;
  }

  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
  }

  .btn-delete {
    color: var(--leap-color-danger);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: var(--leap-color-danger-dark-1);
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .payrecord-content {
    .info-section {
      padding-bottom: 16px;
      border-bottom: 1px solid var(--leap-color-border-light-1);

      .info-group {
        display: flex;
        flex-wrap: wrap;
        gap: 3px 0;

        .info-item {
          display: flex;
          align-items: center;
          width: 33.33%;
          height: 32px;

          .label {
            color: var(--leap-color-default);
            font-size: 14px;
            white-space: nowrap;
            width: 120px;
            text-align: right;
          }

          .value {
            color: var(--leap-color-default-dark-1);
            font-weight: 500;
            font-size: 14px;
          }
        }
      }
    }

    .table-section {
      margin-top: 4px;
    }

    .action-section {
      display: flex;
      justify-content: flex-start;
      padding: 8px 0;
    }
  }
}
</style>
