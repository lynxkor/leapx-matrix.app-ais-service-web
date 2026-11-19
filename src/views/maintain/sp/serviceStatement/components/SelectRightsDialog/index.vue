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
          border="inner" size="medium" :checkbox-config="{ checkField: 'checked', checkMethod: checkMethod, showHeader: false }"
          @checkbox-change="handleSelectionChange"
          :row-class-name="tableRowClassName">
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column field="useId" title="权益ID" width="250" show-overflow="tooltip" />
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
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" :loading="submitLoading" :disabled="!hasSelectedItems" type="primary" @click="confirmSubmit">核销选中权益</el-button>
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
        // 校验：剩余应付款金额为0时，只允许选择满减金额为(0,0)的券
        if (this.isRemainAmountZero()) {
          const amountInfo = this.parsePaymentAmount(row.paymentAmount);
          if (!(amountInfo.threshold === 0 && amountInfo.discount === 0)) {
            this.$nextTick(() => {
              row.checked = false;
              // 数据驱动模式下，手动改 checked 字段后需刷新表头全选框三态
              this.$refs.rightsTable.checkSelectionStatus();
              this.$message.warning('剩余应付款金额为0，不能再选择新的抵扣券');
            });
            return;
          }
        }

        // 候选集 = 已勾选券 + 本次勾选券，整体做可行性判定
        const candidateRows = [
          ...this.tableData.filter(r => r.checked && r.useId !== row.useId),
          row
        ];
        const result = this.validateSelection(candidateRows);

        if (!result.valid) {
          // 阻止选中，恢复复选框状态
          this.$nextTick(() => {
            row.checked = false;
            this.$refs.rightsTable.checkSelectionStatus();
            this.$message.warning(result.message || '该优惠券不可用');
          });
        }
      }
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

    // 计算指定维修类型的金额：gross=项目+零件原值(毛额)，net=毛额−该类型已核销券(净额)
    calculateRepairTypeAmount (repairTypeNames, repairTypeIds = []) {
      if (!repairTypeNames || repairTypeNames.length === 0) return { gross: 0, net: 0 };

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

      const gross = repairItemAmount + partAmount;
      return { gross: gross, net: gross - usedCoupons };
    },

    // 校验优惠券基础可用性（不考虑累计使用）
    validateCoupon (coupon) {
      const amountInfo = this.parsePaymentAmount(coupon.paymentAmount);

      // 特殊处理：减免金额为0的优惠券无条件通过基础校验
      if (amountInfo.discount === 0) {
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

      // 校验2: 满减金额校验（基础校验，检查单次使用是否满足门槛），门槛按各类型毛额判定
      const amountInfoCalc = this.calculateRepairTypeAmount(repairTypeNames, repairTypeIds);

      if (amountInfo.threshold > 0 && amountInfo.threshold > amountInfoCalc.gross) {
        return {
          valid: false,
          reason: 'amount_not_enough',
          message: `维修类型${repairTypeNames}订单金额为 ${amountInfoCalc.gross} 元，不满满减门槛 ${amountInfo.threshold} 元`
        };
      }

      return { valid: true, amountInfo, totalAmount: amountInfoCalc.net, repairTypeNames };
    },

    // 各维修类型的毛额容量（项目 repairAmount + 零件 partsAmount，不减已核销）
    // 已核销券不在此预扣，而是作为可重排资源参与 isFeasible 的整体分配（通用券可让位给专用券）
    // 以维修类型名为键（与 relatedRepairTypeList[].repairTypeName / applicableMaintenanceType 对齐）
    computeTypeCaps () {
      const round2 = n => Math.round(n * 100) / 100;
      const typeCaps = {};

      // 收集本单出现的所有维修类型名（去重）
      const typeNameSet = {};
      (this.formData.repairItemResps || []).forEach(item => {
        if (item.repairItemTypeName) typeNameSet[item.repairItemTypeName] = true;
      });
      (this.formData.partResps || []).forEach(part => {
        if (part.repairItemTypeName) typeNameSet[part.repairItemTypeName] = true;
      });

      Object.keys(typeNameSet).forEach(typeName => {
        const gross = this.calculateRepairTypeAmount([typeName], []).gross;
        typeCaps[typeName] = round2(Math.max(0, gross));
      });

      return typeCaps;
    },

    // 解析已核销券（rightsUsageRecordResps）为统一券结构 { deduction, typeNames[] }
    // 适用类型直接取自 applicableMaintenanceType（逗号/全角逗号分隔的名字），无需映射 ID
    getWrittenOffCoupons () {
      const list = [];
      (this.formData.rightsUsageRecordResps || []).forEach(record => {
        const deduction = parseFloat(record.deductionAmount || 0);
        if (deduction <= 0) return;
        const typeNames = String(record.applicableMaintenanceType || '')
          .split(/[,，]/)
          .map(s => s.trim())
          .filter(Boolean);
        if (typeNames.length === 0) return;
        list.push({ deduction, typeNames });
      });
      return list;
    },

    // 判断结算单剩余应付款金额是否为0
    isRemainAmountZero () {
      return parseFloat(this.formData.remainAmount || 0) === 0;
    },

    // 按给定顺序对券做"按面值贪心扣减"分配，返回每张券实际抵扣额数组
    // 业务规则：每张券尽量按面值核销（可部分核销，超出部分浪费），优先扣减适用类型中剩余可抵额最多的类型
    // 类型容量为毛额（项目+零件），逐张消耗；券面值与 relatedRepairTypeList.repairTypeName / applicableMaintenanceType 对齐
    allocateCoupons (orderedCoupons, typeCaps) {
      const round2 = n => Math.round(n * 100) / 100;
      const remain = {};
      Object.keys(typeCaps).forEach(name => { remain[name] = typeCaps[name]; });

      return orderedCoupons.map(coupon => {
        let need = coupon.deduction;
        let allocated = 0;
        const types = [...coupon.typeNames].sort((a, b) => (remain[b] || 0) - (remain[a] || 0));
        for (const typeName of types) {
          if (allocated >= need) break;
          const available = remain[typeName] || 0;
          if (available > 0) {
            const deduct = Math.min(need - allocated, available);
            allocated += deduct;
            remain[typeName] -= deduct;
          }
        }
        return round2(allocated);
      });
    },

    // 整体可行性判定：勾选时全局重算——候选券优先于已核销券占用类型额度，使已核销的通用券
    // 可让位到其他类型，从而给候选的专用券腾出额度。每组内按专用优先（适用类型数升序）排序。
    // 候选券仅取减免>0（减免0的券不影响额度，单独放行）；检查每张候选券是否都抵到 >0
    isFeasible (candidateCoupons, typeCaps) {
      const byPriority = (a, b) => a.typeNames.length - b.typeNames.length;

      const writtenOff = this.getWrittenOffCoupons().slice().sort(byPriority);
      const activeCandidates = candidateCoupons
        .filter(c => this.parsePaymentAmount(c.paymentAmount).discount > 0)
        .map(c => ({
          deduction: this.parsePaymentAmount(c.paymentAmount).discount,
          typeNames: (c.relatedRepairTypeList || []).map(t => t.repairTypeName).filter(Boolean)
        }))
        .sort(byPriority);

      if (activeCandidates.length === 0) return { feasible: true };

      // 候选券先分配（优先占额度），已核销券后分配（让位）
      const got = this.allocateCoupons([...activeCandidates, ...writtenOff], typeCaps);
      // 只检查候选券部分（前 activeCandidates.length 张）每张>0
      const candidateGot = got.slice(0, activeCandidates.length);
      const feasible = candidateGot.every(g => g > 0);
      return { feasible };
    },

    // 单选整体校验：逐券门禁 + 整体可行性判定
    validateSelection (candidateRows) {
      // 逐券基础门禁
      for (const row of candidateRows) {
        const base = this.validateCoupon(row);
        if (!base.valid) return base;
      }

      // 整体可行性
      const result = this.isFeasible(candidateRows, this.computeTypeCaps());
      if (!result.feasible) {
        return {
          valid: false,
          reason: 'exceed_available_amount',
          message: '所选权益减免金额已超过适用维修类型的剩余应付款，券多余'
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
    async submit (selectedRows) {
      try {
        this.submitLoading = true;
        const params = {
          statementId: this.statementId,
          writeOffReqList: selectedRows,
        };

        await rightsFreeze(params);
        this.$message.success('操作成功');
        this.$emit('refresh');
        this.close();
      } catch (error) {
        console.error('权益核销异常:', error);
      } finally {
        this.submitLoading = false;
      }
    },
    confirmSubmit () {
      const selectedRows = this.tableData.filter((row) => row.checked);
      if (selectedRows.length === 0) {
        this.$message.warning('请选择要核销的权益');
        return;
      }
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>是否确定要核销选中权益？</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        this.submit(selectedRows);
      }).catch(() => {
      });
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
