<template>
    <el-dialog class="m-start-work-dialog" title="补货预测" width="80%" :visible.sync="dialogVisible" @close="close">
        <el-form ref="form" :model="form" inline label-width="150px" size="small">
            <el-form-item label="备件编码：">
                <tag-input v-model="form.partsCodeList" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="备件名称：">
                <el-input v-model="form.partsNameLike" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="一次性满足率（%)：">
                <el-input v-model="form.onceSatisfactionRate" type="number" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="MAX大于等于：">
                <el-input v-model="form.maxForecast" type="number" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="建议采购数大于等于：">
                <el-input v-model="form.suggestedPurchaseQty" type="number" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="预计缺货日期：">
                <el-date-picker :default-time="['00:00:00', '23:59:59']" v-model="form.expectedShortageDate"
                    type="daterange" :picker-options="pickerOptions" range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <page-search-action v-model="show" :isExpandable="false" :loading="loading" @submit="onSubmit"
            @reset="onReset" />
        </el-form>
        <!-- 数据表格 -->
        <div class="table-section">
            <vxe-table ref="workTable" :data="tableData" :checkbox-config="{ checkField: 'checked' }" stripe
                show-overflow resizable border="inner" size="medium" @checkbox-change="handleCheckboxChange"
                @checkbox-all="handleCheckboxChange">
                <vxe-column type="checkbox" width="50" />
                <vxe-column field="partsCode" title="备件编码" width="150" />
                <vxe-column field="partsName" title="备件名称" width="150"/>
                <vxe-column field="replacePartsCodes" title="替换关系集合" width="150" />
                <vxe-column field="planCategory" title="计划分类" width="150" />
                <vxe-column field="partsCategory" title="备件分类" width="150" />
                <vxe-column field="avgWeeklyDemand" title="周平均值需求" width="150" />
                <vxe-column field="riskWarning" title="风险预警" width="150" />
                <vxe-column field="expectedShortageDate" title="预计缺货日期" width="150" />
                <vxe-column field="minTargetAmount" title="Min" width="100" />
                <vxe-column field="maxForecast" title="Max" width="100" />
                <vxe-column field="minOrderQty" title="最小订购量" width="150" />
                <vxe-column field="totalInventory" title="总库存" width="120" />
                <vxe-column field="availableInventory" title="可用库存" width="120" />
                <vxe-column field="inTransitQuantity" title="在途数量" width="120" />
                <vxe-column field="sharedInventory" title="共享库存" width="120" />
                <vxe-column field="suggestedPurchaseQty" title="建议采购数" width="150" />
                <vxe-column field="unitPrice" title="单价" width="100" />
                <vxe-column field="subtotal" title="小计" width="100" />
                <vxe-column field="purchaseQty" title="采购量" fixed="right" width="120">
                    <template #default="{ row }">
                        <el-input v-model="row.purchaseQty" type="number" placeholder="请输入" />
                    </template>
                </vxe-column>
            </vxe-table>
            <div class="table-pagination">
                <el-pagination @size-change="(val) => pageSizeChange(val)"
                    @current-change="(val) => currentPageChange(val)" :current-page="current"
                    :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
                <el-button size="small" @click="close">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { purchaseApplyGetCouponPage, addDetail } from '@/api/sparepart/purchase/purchaseApply/index';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  partsCodeList: [],
  partsNameLike: '',
  onceSatisfactionRate: '80',
  maxForecast: '',
  suggestedPurchaseQty: '',
  expectedShortageDate: [],
};
export default {
  name: 'SubmitDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
  },
  components: {
    PageSearchAction,
    TagInput
  },
  data () {
    return {
      dialogVisible: false,
      loading: false,
      show: false,
      tableData: [],
      submitLoading: false,
      form: { ...defaultForm },
      current: 1,
      pageSize: 10,
      total: 0,
      selectedRows: [],
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    },
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.current = 1;
      this.pageSize = 10;
      this.getData();
    },
    getFormData () {
      const data = { ...this.form };

      if (data.partsCodeList && data.partsCodeList.length === 1) {
        // 只有一个时，转为 Like 查询并删除 List 参数
        data.partsCodeLike = data.partsCodeList[0];
        delete data.partsCodeList;
      } else if (data.partsCodeList && data.partsCodeList.length === 0) {
        // 为空时，直接删除参数
        delete data.partsCodeList;
      }
      // 多个时会保留 data.partsCodeList 参数发送给后端

      if (data.expectedShortageDate && data.expectedShortageDate.length > 1) {
        data.expectedShortageDateStart = data.expectedShortageDate[0];
        data.expectedShortageDateEnd = data.expectedShortageDate[1];
      }
      delete data.expectedShortageDate;

      return data;
    },
    // 请求表格数据
    getData () {
      this.loading = true;
      purchaseApplyGetCouponPage({ ...this.getFormData(), orderId: '019DBD21-5DF1-7134-9D2A-02C7C2EDAE52', pageNum: this.current, pageSize: this.pageSize })
        .then(res => {
          this.tableData = res.records.map(item => {
            return {
              ...item,
            };
          });
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getData();
    },
    currentPageChange (current) {
      this.current = current;
      this.getData();
    },
    // 处理表格勾选变化
    handleCheckboxChange ({ records }) {
      this.selectedRows = records;
    },
    // 提交
    async submit () {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('请选择要添加的备件');
        this.submitLoading = false;
        return;
      }

      this.submitLoading = true;
      try {
        for (const row of this.selectedRows) {
          const params = {
            purchaseApplyId: this.id,
            sparePartId: row.sparePartId,
            purchaseQty: row.purchaseQty || 0
          };
          await addDetail(params);
        }
        this.close();
        this.$emit('submit');
        this.$message.success('添加成功');
      } catch (error) {
        console.error('添加失败', error);
      } finally {
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

 .table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
</style>
