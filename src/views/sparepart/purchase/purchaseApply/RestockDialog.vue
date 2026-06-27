<template>
    <el-dialog class="m-start-work-dialog" title="补货预测" width="80%" :visible.sync="dialogVisible" @close="close">
        <el-form ref="form" :model="form" :rules="rules" inline label-width="160px" size="small">
            <el-form-item label="备件编码：">
                <tag-input v-model="form.partsCodeList" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="备件名称：">
                <el-input v-model="form.partsNameLike" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="一次性满足率（%)：" prop="onceSatisfactionRate">
                <el-input v-model="form.onceSatisfactionRate" type="number" placeholder="请输入" :min="60" :max="99" />
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
                    unlink-panels
                    value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <page-search-action v-model="show" :isExpandable="false" :loading="loading" @submit="onSubmit"
            @reset="onReset" />
            <el-form-item>
                <el-button size="small" :loading="exportLoading" v-if="permissions.has('AISPART-purchaseApply-exportPredict')" @click="exportExcel">导出</el-button>
            </el-form-item>
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
                <vxe-column field="riskWarning" title="风险预警" width="150">
                  <template #default="{ row }">
                    <span :style="row.riskWarning === '高' ? 'color: #B91919;' : row.riskWarning === '中' ? 'color: #B96619;' : 'color: #C8A12B;'">{{ row.riskWarning }}</span>
                  </template>
                </vxe-column>
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
                <vxe-column field="subtotal" title="小计" width="100">
                    <template #default="{ row }">
                        {{ calculateSubtotal(row) }}
                    </template>
                </vxe-column>
                <vxe-column field="purchaseQty" title="采购量" fixed="right" width="160">
                    <template #default="{ row }">
                        <el-input-number
                            v-model="row.purchaseQty"
                            :min="0"
                            :step="row.minOrderQty || 1"
                            size="small"
                            placeholder="请输入"
                            @change="handlePurchaseQtyChange(row)"
                        />
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
import permissions from '@/libs/mixins/permissions';
import { purchaseApplyGetCouponPage, addDetail } from '@/api/sparepart/purchase/purchaseApply/index';
import { exportTable } from '@/api/common';
import { downloadExcel } from '@/libs/utils';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  partsCodeList: [],
  partsNameLike: '',
  onceSatisfactionRate: 80,
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
  mixins: [permissions],
  components: {
    PageSearchAction,
    TagInput
  },
  data () {
    return {
      moduleKey: 'AISPART-purchaseApply',
      dialogVisible: false,
      loading: false,
      exportLoading: false,
      show: false,
      tableData: [],
      submitLoading: false,
      form: { ...defaultForm },
      current: 1,
      pageSize: 10,
      total: 0,
      selectedRows: [],
      pickerOptions: {},
      rules: {
        onceSatisfactionRate: [
          { required: true, message: '一次性满足率不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const num = Number(value);
              if (isNaN(num)) {
                callback(new Error('一次性满足率必须是数字'));
              } else if (num < 60 || num > 99) {
                callback(new Error('一次性满足率必须在60-99之间'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      }
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
    calculateSubtotal (row) {
      const purchaseQty = Number(row.purchaseQty) || 0;
      const unitPrice = Number(row.unitPrice) || 0;
      const subtotal = purchaseQty * unitPrice;
      return subtotal.toFixed(2);
    },
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
    handlePurchaseQtyChange (row) {
      const purchaseQty = Number(row.purchaseQty);
      const minOrderQty = Number(row.minOrderQty);

      if (purchaseQty > 0 && minOrderQty > 0) {
        if (purchaseQty % minOrderQty !== 0) {
          this.$message.warning(`采购量必须是最小订购量（${minOrderQty}）的倍数`);
        }
      }
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
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '补货预测',
        dataFetchPath: 'sp/web/purchase/dealerPartsRecommendationT/page',
        reqParams: { ...this.getFormData(), orderId: this.id, pageNum: this.current, pageSize: this.pageSize },
        titleMap: {
          partsCode: '备件编码',
          partsName: '备件名称',
          replacePartsCodes: '替换关系集合',
          planCategory: '计划分类',
          partsCategory: '备件分类',
          avgWeeklyDemand: '周平均值需求',
          riskWarning: '风险预警',
          expectedShortageDate: '预计缺货日期',
          minTargetAmount: 'Min',
          maxForecast: 'Max',
          minOrderQty: '最小订购量',
          totalInventory: '总库存',
          availableInventory: '可用库存',
          inTransitQuantity: '在途数量',
          sharedInventory: '共享库存',
          suggestedPurchaseQty: '建议采购数',
          unitPrice: '单价',
          subtotal: '小计',
          purchaseQty: '采购量'
        },
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '补货预测.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    // 请求表格数据
    getData () {
      this.loading = true;
      purchaseApplyGetCouponPage({ ...this.getFormData(), orderId: this.id, pageNum: this.current, pageSize: this.pageSize })
        .then(res => {
          this.tableData = (res && res.records || []).map(item => {
            return {
              ...item,
              checked: true, // 默认选中
            };
          });
          this.total = res && res.total || 0;
          this.selectedRows = [...this.tableData]; // 默认选中所有数据
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
