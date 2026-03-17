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
          @checkbox-change="handleSelectionChange" @checkbox-all="handleSelectAll"
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
        <el-button size="small" :loading="submitLoading" :disabled="!hasSelectedItems" type="primary" @click="submit">核销选中权益</el-button>
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
  computed: {
    // 是否有选中的项目
    hasSelectedItems () {
      return this.tableData.some(row => row.checked);
    },
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
    },

    // 处理全选事件
    handleSelectAll ({ checked, records }) {
      if (checked) {
        // 全选时，找出最优的优惠券组合
        const optimalCombination = this.findOptimalCouponCombination(records);

        if (!optimalCombination.success) {
          // 如果无法全选，给出提示并阻止
          this.$nextTick(() => {
            this.$message.warning(optimalCombination.message || '部分优惠券无法同时使用');
          });
          return;
        }

        // 按照最优组合设置选中状态
        this.$nextTick(() => {
          this.tableData.forEach(row => {
            row.checked = optimalCombination.selectedIds.includes(row.useId);
          });

          // 打印最优组合信息
          console.group('🎯 全选最优组合');
          console.log('可选优惠券总数：', records.length);
          console.log('实际选中数量：', optimalCombination.selectedIds.length);
          console.table(
            optimalCombination.allocationDetails.map(detail => ({
              维修类型: detail.type,
              总金额: detail.total,
              已抵扣: detail.deducted,
              剩余金额: detail.remaining,
              使用率: detail.usageRate
            }))
          );
          console.groupEnd();
        });
      }
    },

    // 找出最优的优惠券组合（贪心算法）
    findOptimalCouponCombination (allCoupons) {
      // 1. 过滤出基础可用的优惠券
      const availableCoupons = allCoupons.filter(coupon => {
        const validation = this.validateCoupon(coupon);
        return validation.valid;
      });

      if (availableCoupons.length === 0) {
        return {
          success: false,
          message: '没有可用的优惠券'
        };
      }

      // 2. 初始化各维修类型的可用金额
      const typeAmounts = this.initTypeAmounts();

      // 3. 按优先级排序：专用券 > 通用券
      const sortedCoupons = [...availableCoupons].sort((a, b) => {
        const aTypes = (a.relatedRepairTypeList || []).length;
        const bTypes = (b.relatedRepairTypeList || []).length;
        return aTypes - bTypes;
      });

      // 4. 贪心算法：依次尝试选择每张券
      const allocation = {};
      const selectedIds = [];

      for (const coupon of sortedCoupons) {
        // 尝试分配当前优惠券
        const testAllocation = { ...allocation };
        const success = this.tryAllocateCoupon(coupon, typeAmounts, testAllocation);

        if (success) {
          // 可以选择，更新分配结果
          Object.assign(allocation, testAllocation);
          selectedIds.push(coupon.useId);
        }
        // 如果无法分配，跳过这张券
      }

      // 5. 构建分配详情
      const allocationDetails = Object.keys(allocation).map(typeName => {
        const total = typeAmounts[typeName] || 0;
        const deducted = allocation[typeName] || 0;
        const remaining = total - deducted;
        return {
          type: typeName,
          total: total.toFixed(2),
          deducted: deducted.toFixed(2),
          remaining: remaining.toFixed(2),
          usageRate: total > 0 ? ((deducted / total) * 100).toFixed(1) : '0.0'
        };
      });

      return {
        success: true,
        selectedIds: selectedIds,
        allocationDetails: allocationDetails
      };
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
    calculateRepairTypeAmount (repairTypeNames, repairTypeIds = '') {
      if (!repairTypeNames || repairTypeNames.length === 0) return 0;

      const repairItemAmount = (this.formData.repairItemResps || [])
        .filter(item => repairTypeNames.includes(item.repairItemTypeName))
        .reduce((sum, item) => sum + parseFloat(item.repairAmount || 0), 0);

      const partAmount = (this.formData.partResps || [])
        .filter(part => repairTypeNames.includes(part.repairItemTypeName))
        .reduce((sum, part) => sum + parseFloat(part.partsAmount || 0), 0);

      // 减去已核销的券
      const usedCoupons = (this.formData?.typeDeductibleResps || [])
        .filter(item => repairTypeIds.includes(item.repairTypeId))
        .reduce((sum, item) => sum + parseFloat(item.deductibleAmount || 0), 0);

      const res = {
        total: repairItemAmount + partAmount,
        remain: repairItemAmount + partAmount - usedCoupons
      };
      return res;
    },

    // 校验优惠券基础可用性（不考虑累计使用）
    validateCoupon (coupon) {
      const amountInfo = this.parsePaymentAmount(coupon.paymentAmount);

      // 特殊处理：减免金额为0的优惠券无条件通过基础校验
      if (amountInfo.discount === 0) {
        console.log('减免金额为0的优惠券通过基础校验:', coupon.rightsName);
        return { valid: true, amountInfo, totalAmount: 0, repairTypeNames: [], isZeroDiscount: true };
      }

      const repairTypeNames = coupon.relatedRepairTypeList?.map(t => t.repairTypeName) || [];
      const repairTypeIds = coupon.relatedRepairTypeList?.map(t => t.repairTypeId) || [];

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
      const totalAmount = this.calculateRepairTypeAmount(repairTypeNames, repairTypeIds);

      if (amountInfo.threshold > 0 && amountInfo.threshold > totalAmount.total) {
        return {
          valid: false,
          reason: 'amount_not_enough',
          message: `维修类型${repairTypeNames}可用金额为 ${totalAmount.remain} 元，不满满减门槛 ${amountInfo.threshold} 元`
        };
      }

      return { valid: true, amountInfo, totalAmount: totalAmount.remain, repairTypeNames };
    },

    // 初始化各维修类型的可用金额
    initTypeAmounts () {
      const typeAmounts = {};

      // 收集所有维修类型
      const allTypes = new Set();
      (this.formData.repairItemResps || []).forEach(item => {
        allTypes.add(item);
      });
      (this.formData.partResps || []).forEach(part => {
        allTypes.add(part);
      });

      // 计算每个类型的总金额
      allTypes.forEach(el => {
        const amountInfo = this.calculateRepairTypeAmount([el.repairItemTypeName], [el.repairItemTypeId]);
        typeAmounts[el.repairItemTypeName] = amountInfo.remain;
      });

      return typeAmounts;
    },

    // 尝试分配单张优惠券
    tryAllocateCoupon (coupon, typeAmounts, allocation) {
      const amountInfo = this.parsePaymentAmount(coupon.paymentAmount);
      const discount = amountInfo.discount;
      const repairTypes = coupon.relatedRepairTypeList || [];

      // 特殊处理：减免金额为0的优惠券无条件通过
      if (discount === 0) {
        console.log('减免金额为0的优惠券无条件通过:', coupon.rightsName);
        return true;
      }

      let remaining = discount;

      // 按优先级选择维修类型进行分配：优先选择剩余金额最多的类型
      const sortedTypes = [...repairTypes].sort((a, b) => {
        const aAvailable = (typeAmounts[a.repairTypeName] || 0) - (allocation[a.repairTypeName] || 0);
        const bAvailable = (typeAmounts[b.repairTypeName] || 0) - (allocation[b.repairTypeName] || 0);
        return bAvailable - aAvailable; // 降序，剩余多的优先
      });

      for (const type of sortedTypes) {
        if (remaining <= 0) break;

        const typeName = type.repairTypeName;
        const totalAmount = typeAmounts[typeName] || 0;
        const allocated = allocation[typeName] || 0;
        const available = totalAmount - allocated;

        if (available > 0) {
          const deduct = Math.min(remaining, available);
          allocation[typeName] = allocated + deduct;
          remaining -= deduct;
        }
      }

      // 只要能分配一部分就成功，因为实际优惠不会超过订单金额
      const totalAllocated = discount - remaining;
      return totalAllocated > 0;
    },

    // 校验优惠券是否可以被选中（考虑全局最优分配）
    canSelectCoupon (coupon, selectedRows) {
      // 基础校验
      const baseValidation = this.validateCoupon(coupon);
      if (!baseValidation.valid) {
        return baseValidation;
      }

      // 模拟选择：将当前优惠券加入已选列表
      const allSelected = [...selectedRows, coupon];

      // 按优先级排序：适用类型越少，优先级越高（专用券 > 通用券）
      const priorityOrder = (a, b) => {
        const aTypes = (a.relatedRepairTypeList || []).length;
        const bTypes = (b.relatedRepairTypeList || []).length;
        return aTypes - bTypes;
      };

      const sortedCoupons = [...allSelected].sort(priorityOrder);

      // 初始化各维修类型的可用金额
      const typeAmounts = this.initTypeAmounts();

      // 按优先级依次分配，构建抵扣映射表
      const allocation = {};

      for (const item of sortedCoupons) {
        const success = this.tryAllocateCoupon(item, typeAmounts, allocation);
        if (!success) {
          // 分配失败，返回具体错误
          const itemTypes = (item.relatedRepairTypeList || []).map(t => t.repairTypeName).join('、');
          const itemDiscount = this.parsePaymentAmount(item.paymentAmount).discount;

          // 计算各类型的剩余金额和已抵扣金额
          const details = item.relatedRepairTypeList.map(type => {
            const typeName = type.repairTypeName;
            const total = typeAmounts[typeName] || 0;
            const deducted = allocation[typeName] || 0;
            const remaining = total - deducted;
            return `${typeName}(总额${total}元，已抵扣${deducted}元，剩余${remaining}元)`;
          }).join('；');

          return {
            valid: false,
            reason: 'exceed_available_amount',
            message: `优惠券"${item.rightsName}"（减免${itemDiscount}元，适用：${itemTypes}）无法分配。${details}`
          };
        }
      }

      // 分配成功，打印各项目的抵扣情况
      console.group('🎫 优惠券分配成功');
      console.log('已选优惠券数量：', sortedCoupons.length);

      // 打印维修类型抵扣详情表格
      console.table(
        Object.keys(allocation).map(typeName => {
          const total = typeAmounts[typeName] || 0;
          const deducted = allocation[typeName] || 0;
          const remaining = total - deducted;
          return {
            维修类型: typeName,
            总金额: total.toFixed(2),
            已抵扣: deducted.toFixed(2),
            剩余金额: remaining.toFixed(2),
            使用率: total > 0 ? ((deducted / total) * 100).toFixed(1) : '0.0'
          };
        })
      );

      console.log('优惠券明细：');
      // 打印优惠券列表表格
      console.table(
        sortedCoupons.map((item, index) => {
          const discount = this.parsePaymentAmount(item.paymentAmount).discount;
          const types = (item.relatedRepairTypeList || []).map(t => t.repairTypeName).join('、');
          return {
            编码: item.rightsCode,
            优惠券名称: item.rightsName,
            减免金额: discount,
            适用类型: types
          };
        })
      );

      console.groupEnd();

      // 所有优惠券都能成功分配，允许选择
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
