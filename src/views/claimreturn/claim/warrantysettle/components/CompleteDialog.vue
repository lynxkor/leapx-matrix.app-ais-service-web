<template>
  <el-dialog
    title="开票完成"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
    :append-to-body="true"
    class="complete-dialog"
  >
    <div class="page-common-edit">
      <section class="common-section">
        <div class="common-section-body">
          <div>
            <AttachmentList
              ref="attachmentListRef"
              :business-id="id"
              config-code="mcs_settleaccount"
              type="card"
              @ocr-success="ocrSuccess"
              />
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="form-edit" >
            <el-form-item class="form-item-full" label="开票说明：" prop="invoiceDesc">
              <base-input
                type="textarea"
                placeholder="请输入开票说明"
                v-model="form.invoiceDesc"
                clearable
              />
            </el-form-item>
            <el-form-item label="快递公司：" prop="expressCompany">
              <el-input
                v-model="form.expressCompany"
                placeholder="请输入快递公司"
                clearable
              />
            </el-form-item>
            <el-form-item label="快递单号：" prop="expressCode">
              <el-input
                v-model="form.expressCode"
                placeholder="请输入快递单号"
                clearable
              />
            </el-form-item>
            <el-form-item label="邮寄时间：" prop="expressTime">
              <el-date-picker
                v-model="form.expressTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
              />
            </el-form-item>
            <el-form-item label="收款方式：" prop="paymentMethod">
              <fetch-select
                :request="fetchOptions"
                enumCode="payment_method"
                v-model="form.paymentMethod"
                placeholder="请选择"
                clearable
                filterable
              />
            </el-form-item>
          </el-form>
        </div>
      </section>

      <section class="common-section">
        <div class="common-section-body">
          <vxe-table
            ref="table"
            :data="tableData"
            stripe
            show-overflow
            resizable
            :row-config="{ isHover: true }"
            border="inner"
            size="medium"
            max-height="250px"
          >
            <vxe-column field="projectName" title="项目名称"></vxe-column>
            <vxe-column field="invoiceNo" title="发票号"></vxe-column>
            <vxe-column field="invoiceCompanyName" title="开票公司名称"></vxe-column>
            <vxe-column field="invoiceDate" title="发票开具日期"></vxe-column>
            <vxe-column field="amount" title="金额">
              <template #default="{ row }">
                {{ row.amount }}
              </template>
            </vxe-column>
            <vxe-column field="taxRate" title="税点">
              <template #default="{ row }">
                {{ row.taxRate }}%
              </template>
            </vxe-column>
            <vxe-column field="noTaxAmount" title="不含税金额">
              <template #default="{ row }">
                {{ row.noTaxAmount }}
              </template>
            </vxe-column>
            <vxe-column field="taxAmount" title="税额">
              <template #default="{ row }">
                {{ row.taxAmount }}
              </template>
            </vxe-column>
            <vxe-column title="操作" width="100" align="center" fixed="right" :resizable="false">
              <template #default="{ row }">
                <el-popconfirm
                  title="确定要删除这条记录吗？"
                  @confirm="handleDelete(row)"
                >
                  <el-button
                    class="action-button btn-delete"
                    slot="reference"
                    type="text">
                    删除
                  </el-button>
                </el-popconfirm>
              </template>
            </vxe-column>
            <template #empty>
              <div class="m-vxe-table-empty-text">
                暂无数据
              </div>
            </template>
          </vxe-table>
          <div class="table-pagination">
            <el-pagination
              @size-change="pageSizeChange"
              @current-change="currentPageChange"
              :current-page="current"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </section>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { complete } from '@/api/claimreturn/claim/warrantysettle/index';
import { warrantySettleInvoiceRecordPage, warrantySettleInvoiceRecordDelete } from '@/api/claimreturn/claim/warrantysettle/warrantySettleInvoiceRecord';
import { getEnum } from '@/api/common';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect';
import AttachmentList from '@/libs/components/AttachmentList';

const defaultForm = {
  invoiceDesc: '',
  expressCompany: '',
  expressCode: '',
  expressTime: '',
  paymentMethod: '',
};

export default {
  name: 'CompleteDialog',
  components: {
    BaseInput,
    FetchSelect,
    AttachmentList,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    detailData: {
      type: Object,
      default: () => ({})
    },
    paymentMethod: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: { ...defaultForm },
      dialogVisible: this.visible,
      submitLoading: false,
      rules: {
        paymentMethod: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        if (Object.keys(this.detailData).length > 0) {
          this.setFormFromDetail();
        }
        this.form.paymentMethod = this.paymentMethod || this.detailData.paymentMethod || '';
      } else {
        this.onReset();
      }
    },
    id: {
      handler () {
        this.getTableData();
      },
      immediate: true
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.onReset();
    },
    submit () {
      this.$refs.ruleForm?.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.submitLoading = true;
        complete({
          id: this.id,
          invoiceDesc: this.form.invoiceDesc,
          expressCompany: this.form.expressCompany,
          expressCode: this.form.expressCode,
          expressTime: this.form.expressTime,
          paymentMethod: this.form.paymentMethod,
        }).then(res => {
          this.close();
          this.$message.success('开票完成成功！');
          this.$emit('success');
        }).finally(() => {
          this.submitLoading = false;
        });
      });
    },
    onReset () {
      this.$refs.ruleForm?.resetFields();
      this.form = {
        ...defaultForm,
      };
    },
    setFormFromDetail () {
      if (this.detailData) {
        this.form.invoiceDesc = this.detailData.invoiceDesc || '';
        this.form.expressCompany = this.detailData.expressCompany || '';
        this.form.expressCode = this.detailData.expressCode || '';
        this.form.expressTime = this.detailData.expressTime || '';
        this.form.paymentMethod = this.detailData.paymentMethod || '';
      }
    },
    getTableData () {
      if (!this.id) {
        return;
      }
      warrantySettleInvoiceRecordPage({
        settleId: this.id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total || 0;
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getTableData();
    },
    currentPageChange (current) {
      this.current = current;
      this.getTableData();
    },
    ocrSuccess () {
      this.getTableData();
    },
    handleDelete (row) {
      if (!row.id) {
        return;
      }
      warrantySettleInvoiceRecordDelete([row.id]).then(() => {
        this.$message.success('删除成功');
        this.getTableData();
        this.$refs.attachmentListRef?.refresh();
      }).catch(() => {
        this.$message.error('删除失败');
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>

<style lang="scss" scoped>
.complete-dialog{
  // 附件
  .attachment-list{
    padding-left: 48px;
  }
  .btn-delete{
    color: #B91919;
  }

  ::v-deep .el-dialog .el-dialog__body{
    max-height: inherit !important;
  }
  .business-upload{
    margin-top: 6px;
  }
}

</style>
