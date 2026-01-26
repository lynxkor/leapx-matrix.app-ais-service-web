
<template>
  <el-dialog
    title="结算单信息"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
  >
    <div class="sign-dialog-content">
      <el-form :inline="true" :model="form" label-width="120px">
        <!-- 施工单号 -->
        <el-form-item label="施工单号：" prop="serviceProxyCode">
          <el-input
            placeholder="请输入"
            v-model="form.serviceProxyCode"
            :disabled="true"
            clearable
          />
        </el-form-item>

        <!-- VIN码 -->
        <el-form-item label="VIN码：" prop="vehProfileVin">
          <el-input
            placeholder="请输入"
            v-model="form.vehProfileVin"
            :disabled="true"
            clearable
          />
        </el-form-item>

        <!-- 结算类型 -->
        <el-form-item label="结算类型：" prop="statementType">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.statementType"
            placeholder="请选择"
            :disabled="true"
            clearable
            filterable
          />
        </el-form-item>

        <!-- 优惠模式 -->
        <el-form-item label="优惠模式：" prop="discountMode">
          <fetch-select
            :request="fetchOptions"
            enumCode="discountMode"
            v-model="form.discountMode"
            placeholder="请选择优惠模式"
            clearable
            filterable
          />
        </el-form-item>

        <!-- 去零金额 -->
        <el-form-item label="去零金额：" prop="noFractionAmount">
          <el-input
            placeholder="请输入"
            v-model.number="form.noFractionAmount"
            clearable
          />
        </el-form-item>
      </el-form>

      <!-- 其他内容区域 -->
      <slot name="additional-content"></slot>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'SignDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      form: { ...this.formData }
    };
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal;
    },
    'form.discountMode'(newVal) {
      if (newVal) {
        this.updateRepairItemsWithDiscountMode(newVal);
      }
    }
  },
  computed: {
    // 项目金额 = (工时 * 工时单价) 合计
    projectAmount() {
      return (this.form.repairItemResps || []).reduce((sum, item) => {
        return sum + (item.workHour || 0) * (item.price || 0);
      }, 0);
    },

    // 备件金额 = (数量 * 单价) 合计
    partsAmount() {
      return (this.form.partResps || []).reduce((sum, item) => {
        return sum + (item.quantity || 0) * (item.unitPrice || 0);
      }, 0);
    },

    // 总金额 = 项目金额 + 备件金额
    totalAmount() {
      return this.projectAmount + this.partsAmount;
    },

    // 应收总金额 = 项目金额 + 备件金额 - 项目优惠金额 - 备件优惠金额 - 去零金额
    receivableTotalAmount() {
      return this.projectAmount + this.partsAmount -
             (this.form.repairItemDiscount || 0) -
             (this.form.partDiscount || 0) -
             (this.form.noFractionAmount || 0);
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit('update:visible', false);
    },
    handleSubmit() {
      this.$emit('submit', this.form);
      this.handleClose();
    },
    updateRepairItemsWithDiscountMode(discountMode) {
      if (this.form.repairItemResps) {
        this.form.repairItemResps.forEach(item => {
          if (item.checkoutTypeName !== '保修' && item.checkoutTypeName !== '合同') {
            // 应用优惠模式的折扣率
            item.discountRate = this.getDiscountRateFromMode(discountMode);
            // 重新计算优惠金额
            item.discountAmount = item.workHour * item.price * item.discountRate;
          }
        });
      }
    },
    getDiscountRateFromMode(discountMode) {
      // 实现获取折扣率的逻辑
      return 0.1; // 示例值
    }
  }
};
</script>
