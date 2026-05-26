<template>
    <el-dialog class="m-start-work-dialog" title="收款" width="70%" :visible.sync="dialogVisible" @close="close">
        <el-form ref="workForm" :model="formData" inline label-width="120px">
            <el-form-item label="备附件销售单号">
                {{formData.code}}
            </el-form-item>
            <el-form-item label="应付总金额">
                {{formData.payableTotalAmount}}
            </el-form-item>
            <el-form-item label="剩余应付金额">
                {{remainingPayableAmount}}
            </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <div class="table-section" v-loading="loading">
            <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium">
                <vxe-column title="序号" width="12.5%" align="center">
                    <template #default="{ rowIndex }">
                        {{ rowIndex + 1 }}
                    </template>
                </vxe-column>
                <vxe-column field="paymentMethod" title="支付方式" width="12.5%">
                    <template #default="{ row }">
                        <fetch-select :request="fetchOptions" enumCode="RetailPayMethodEnum"
                            v-model="row.paymentMethod" placeholder="请选择" clearable filterable />
                    </template>
                </vxe-column>
                <vxe-column title="实付金额" width="12.5%">
                    <template #default="{ row }">
                        <el-input v-model="row.actualPaymentAmount" />
                    </template>
                </vxe-column>
                <vxe-column field="invoiceType" title="发票类型" width="12.5%">
                    <template #default="{ row }">
                        <fetch-select :request="fetchOptions" enumCode="RetailInvoiceTypeEnum"
                            v-model="row.invoiceType" placeholder="请选择" clearable filterable />
                    </template>
                </vxe-column>
                <vxe-column title="发票号码" width="12.5%">
                    <template #default="{ row }">
                        <el-input v-model="row.invoiceNumber" />
                    </template>
                </vxe-column>
                <vxe-column title="操作" width="150" fixed="right">
                    <template #default="{ rowIndex }">
                    <!-- 新增按钮：所有行都显示 -->
                    <el-button type="text" size="small" @click="handleAddRow">新增</el-button>

                    <!-- 删除按钮：仅非第一行显示 -->
                    <template v-if="rowIndex !== 0">
                        <el-popconfirm title="确定删除？" @confirm="handleDel(rowIndex)">
                            <span slot="reference" type="text" size="small" class="btn-del">删除</span>
                        </el-popconfirm>
                    </template>
                    </template>
                </vxe-column>
            </vxe-table>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" :loading="submitLoading" type="primary" @click="saveSubmit">暂 存</el-button>
                <el-button size="small" :loading="submitLoading" type="primary" @click="handleSubmit">收款完成</el-button>
                <el-button size="small" @click="close">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { collectPayment, retailPaymentRecordPage } from '@/api/sparepart/sale/retailOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

export default {
  name: 'HarvestDialog',
  components: {
    FetchSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      // 模拟表格数据
      tableData: [],
      formData: {},
      loading: false
    };
  },
  computed: {
    remainingPayableAmount () {
      const totalPayable = parseFloat(this.formData.payableTotalAmount) || 0;
      const receivedAmount = this.tableData.reduce((sum, row) => {
        return sum + (parseFloat(row.actualPaymentAmount) || 0);
      }, 0);
      return (totalPayable - receivedAmount).toFixed(2);
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    form: {
      handler (val) {
        this.formData = val;
        this.open();
      }
    }
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 1. 初始化：先调用收款明细接口，如果有数据就直接赋值，没有数据再初始化一条空记录
    async open () {
      this.loading = true;
      try {
        const res = await retailPaymentRecordPage({ retailOrderId: this.form.id });
        // 如果有数据，直接赋值到表格
        if (res.records && res.records.length > 0) {
          this.tableData = res.records;
        } else {
          // 没有数据，初始化一条空记录
          this.tableData = [
            {
              paymentMethod: '60', // 默认为其他
              actualPaymentAmount: '', // 空值
              invoiceType: '',
              invoiceNumber: ''
            }
          ];
        }
        this.loading = false;
      } catch (error) {
        // 接口调用失败，初始化一条空记录
        this.tableData = [
          {
            paymentMethod: '60',
            actualPaymentAmount: '',
            invoiceType: '',
            invoiceNumber: ''
          }
        ];
        this.loading = false;
      }
    },

    // 2. 新增：点击新增，追加一行空记录
    handleAddRow () {
      this.tableData.push({
        paymentMethod: '',
        actualPaymentAmount: '',
        invoiceType: '',
        invoiceNumber: ''
      });
    },

    // 3. 删除：删除指定行
    handleDel (index) {
      this.tableData.splice(index, 1);
    },
    close () {
      this.$emit('update:visible', false);
    },
    // 暂存
    async saveSubmit () {
      this.submitLoading = true;
      const params = {
        id: this.formData.id,
        isTemp: true,
        payList: this.tableData
      };
      try {
        await collectPayment(params);
        this.$message.success('收款成功');
        this.$emit('update:visible', false);
        this.$emit('success');
      } finally {
        // 无论成功还是失败，都会执行这里
        this.submitLoading = false;
      }
    },
    // 收款完成
    async handleSubmit () {
      this.submitLoading = true;
      const params = {
        id: this.formData.id,
        isTemp: false,
        payList: this.tableData
      };
      try {
        await collectPayment(params);
        this.$message.success('收款成功');
        this.$emit('update:visible', false);
        this.$emit('success');
      } finally {
        // 无论成功还是失败，都会执行这里
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

    .btn-del {
        color: #B91919;
        cursor: pointer;
    }
}
</style>
