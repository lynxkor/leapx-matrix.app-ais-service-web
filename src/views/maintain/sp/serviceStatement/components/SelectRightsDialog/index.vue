<template>
  <el-dialog class="m-select-rights-dialog" title="权益核销" width="1200px" :visible.sync="dialogVisible" @close="close"
    @closed="closed">
    <div class="select-rights-content" v-loading="loading">
      <div class="action-section">
        <em>*权益只适用该施工单对应的维修类型</em>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <vxe-table ref="rightsTable" :data="tableData" stripe :row-config="{ isHover: true }" resizable max-height="500"
          border="inner" size="medium" :checkbox-config="{ checkField: 'checked', checkMethod: checkMethod }"
          @checkbox-change="handleSelectionChange" @checkbox-all="handleSelectionChange"
          :row-class-name="tableRowClassName">
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column field="rightsCode" title="权益ID" width="250" show-overflow="tooltip" />
          <vxe-column field="rightsName" title="权益名称" width="200" show-overflow="tooltip" />
          <vxe-column field="cardTypeLabel" title="卡券类型" width="120" align="center" />
          <vxe-column field="applicableMaintenanceType" title="适用维修类型" width="120" align="center">
            <template #default="{ row }">
              {{ getServiceTypeText(row.relatedRepairTypeList) }}
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
import {
  rightsList,
  rightsFreeze,
} from '@/api/maintain/sp/serviceStatement/index';

export default {
  name: 'SelectRightsDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    statementId: {
      type: String,
      default: '',
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      loading: false,
      submitLoading: false,
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
    handleSelectionChange ({ checked, row }) {
      // 如果是选中操作，先进行校验
      if (checked) {
        const selectedRows = this.tableData.filter(r => r.checked && r.useId !== row.useId);
        const validationResult = this.canSelectCoupon(row, selectedRows);

        if (!validationResult.valid) {
          // 阻止选中，恢复复选框状态
          this.$nextTick(() => {
            row.checked = false;
            this.$message.warning(validationResult.message || '该优惠券不可用');
          });
        }
      }

      // 更新所有行的选择状态
      // this.tableData.forEach((r) => {
      //   r.checked = this.tableData.some(item => item.checked && item.useId === r.useId);
      // });
    },

    // 获取权益列表
    async initData () {
      try {
        this.loading = true;
        const params = {
          statementId: this.statementId,
          rightsType: 3
          // 可以在这里添加其他参数
        };
        const res = await rightsList(params);
        this.tableData = (res || []).map((item) => ({
          ...item,
          checked: false,
          // 设置初始是否可用状态
          isChange: item.isChange && this.validateCoupon(item).valid,
        }));
      } catch (error) {
        console.error('获取权益列表异常:', error);
        this.$message.error('获取权益列表失败');
      } finally {
        this.loading = false;
      }
    },

    // 解析满减金额 "(0,150)" -> { threshold: 0, discount: 150 }
    parsePaymentAmount (paymentAmount) {
      if (!paymentAmount) return { threshold: 0, discount: 0 };
      const match = paymentAmount.match(/\((\d+),(\d+)\)/);
      // 格式为 "(0,150)" 表示满0减150
      // 第一位是最小消费金额（满减门槛），第二位是减免金额
      if (match) {
        return {
          threshold: parseFloat(match[1]), // 满减门槛
          discount: parseFloat(match[2]), // 减免金额
        };
      }
      return { threshold: 0, discount: 0 };
    },

    // 计算指定维修类型的项目+零件总金额
    calculateRepairTypeAmount (repairTypeNames) {
      if (!repairTypeNames || repairTypeNames.length === 0) return 0;

      const repairItemAmount = (this.formData.repairItemResps || [])
        .filter(item => repairTypeNames.includes(item.repairItemTypeName))
        .reduce((sum, item) => sum + parseFloat(item.repairAmount || 0), 0);

      const partAmount = (this.formData.partResps || [])
        .filter(part => repairTypeNames.includes(part.repairItemTypeName))
        .reduce((sum, part) => sum + parseFloat(part.partsAmount || 0), 0);

      // 减去已核销的券
      const usedCoupons = (this.formData?.rightsUsageRecordResps || [])
        .filter(item => repairTypeNames.includes(item.applicableMaintenanceType))
        .reduce((sum, item) => sum + parseFloat(item.deductibleAmount || 0), 0);

      const res = {
        total: repairItemAmount + partAmount,
        remain: repairItemAmount + partAmount - usedCoupons
      };
      console.log(repairTypeNames, res);
      return res;
    },

    // 校验优惠券基础可用性（不考虑累计使用）
    validateCoupon (coupon) {
      const repairTypeNames = coupon.relatedRepairTypeList?.map(t => t.repairTypeName) || [];

      // 校验1: 检查是否有对应维修类型的项目或零件
      const hasMatchingItems = (this.formData.repairItemResps || []).some(item =>
        repairTypeNames.includes(item.repairItemTypeName)
      ) || (this.formData.partResps || []).some(part =>
        repairTypeNames.includes(part.repairItemTypeName)
      );

      if (!hasMatchingItems) {
        const typeNames = coupon.relatedRepairTypeList?.map(t => t.repairTypeName).join('、') || '';
        return {
          valid: false,
          reason: 'no_matching_type',
          message: `该优惠券适用的维修类型（${typeNames}）在当前单据中不存在`
        };
      }

      // 校验2: 满减金额校验（基础校验，检查单次使用是否满足门槛）
      const amountInfo = this.parsePaymentAmount(coupon.paymentAmount);
      const totalAmount = this.calculateRepairTypeAmount(repairTypeNames);

      if (amountInfo.threshold > 0 && amountInfo.threshold > totalAmount.total) {
        return {
          valid: false,
          reason: 'amount_not_enough',
          message: `维修类型${repairTypeNames}可用金额为 ${totalAmount.remain} 元，不满满减门槛 ${amountInfo.threshold} 元`
        };
      }

      return { valid: true, amountInfo, totalAmount: totalAmount.remain, repairTypeNames };
    },

    // 校验优惠券是否可以被选中（考虑同类优惠券的重复使用）
    canSelectCoupon (coupon, selectedRows) {
      // 基础校验
      const baseValidation = this.validateCoupon(coupon);
      if (!baseValidation.valid) {
        return baseValidation;
      }

      // 计算已选同类优惠券（rightsCode相同）的累计减免金额
      const sameTypeCoupons = selectedRows.filter(row => row.rightsCode === coupon.rightsCode);
      const usedDiscountAmount = sameTypeCoupons.reduce((sum, row) => {
        const rowAmountInfo = this.parsePaymentAmount(row.paymentAmount);
        return sum + rowAmountInfo.discount;
      }, 0);

      const availableAmount = baseValidation.totalAmount; // 可用金额
      console.log('availableAmount', availableAmount, usedDiscountAmount);

      // 校验：只有当累计减免金额已经超过可用金额，且再选一张还会增加时才阻止
      // 也就是说，如果当前累计已经超过可用金额，就不再允许选更多
      if (usedDiscountAmount > availableAmount) {
        return {
          valid: false,
          reason: 'exceed_available_amount',
          message: `维修类型:${baseValidation.repairTypeNames}总金额为 ${availableAmount} 元，已使用优惠券减免 ${usedDiscountAmount} 元，已超出可用金额`
        };
      }

      return { valid: true };
    },

    // 获取维修类型文本
    getServiceTypeText (serviceType) {
      if (!serviceType || !Array.isArray(serviceType)) {
        return '-';
      }
      // 循环获取每个维修类型的名称并用逗号拼接
      const typeNames = serviceType.map((item) => {
        // 如果是对象，取repairTypeName字段；如果是数字，直接映射
        if (typeof item === 'object' && item.repairTypeName) {
          return item.repairTypeName;
        }
      });

      return typeNames.join(',') || '-';
    },

    // 获取有效期文本
    getValidityPeriodText (row) {
      const effectDate = row.effectDate || '';
      const expiryDate = row.expiryDate || '';
      return `${effectDate} ~ ${expiryDate}`;
    },

    // 提交核销
    async submit () {
      const selectedRows = this.tableData.filter((row) => row.checked);

      if (selectedRows.length === 0) {
        this.$message.warning('请选择要核销的权益');
        return;
      }
      try {
        this.submitLoading = true;
        const params = {
          statementId: this.statementId,
          writeOffReqList: selectedRows,
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
  },
};
</script>

<style lang="scss" scoped>
.m-select-rights-dialog {

  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
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
