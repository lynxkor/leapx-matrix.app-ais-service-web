<template>
  <div>
    <el-dialog class="m-submit-settlement-dialog" title="提交结算" width="1200px" :visible="visible" @close="close"
      @closed="closed">
      <div class="settlement-content">
        <!-- 订单信息区域 -->
        <div class="info-section">
          <div class="info-group">
            <div class="info-item">
              <span class="label">委托工单号：</span>
              <span class="value">{{ baseInfo.code }}</span>
            </div>
            <div class="info-item">
              <span class="label">VIN：</span>
              <span class="value">{{ baseInfo.vehProfileVin }}</span>
            </div>
            <div class="info-item">
              <span class="label">结算类型：</span>
              <span class="value">{{ baseInfo.statementTypeLabel }}</span>
            </div>
            <div class="info-item">
              <span class="label">优惠模式：</span>
              <el-select v-model="discountMode" placeholder="请选择" size="small" style="width: 150px;" clearable
                @change="handleDiscountModeChange">
                <el-option :label="item.name" :value="item.id" v-for="item in discountType" :key="item.id"></el-option>
              </el-select>
            </div>
            <div class="info-item">
              <span class="label">项目金额：</span>
              <span class="value">{{ baseInfo.repairItemAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">备件金额：</span>
              <span class="value">{{ baseInfo.partAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">总金额：</span>
              <span class="value">{{ baseInfo.totalAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">去零金额：</span>
              <span class="value">
                <el-input-number style="width: 150px;" :precision="2" :min="0" size="small"
                  v-model="roundAmount" @change="handleRoundAmountChange"></el-input-number>
              </span>
            </div>
            <div class="info-item">
              <span class="label">项目优惠金额：</span>
              <span class="value">{{ baseInfo.repairItemDiscount }}</span>
            </div>
            <div class="info-item">
              <span class="label">备件优惠金额：</span>
              <span class="value">{{ baseInfo.partDiscount }}</span>
            </div>
            <div class="info-item">
              <span class="label">优惠总金额：</span>
              <span class="value">{{ baseInfo.discountAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">权益金额：</span>
              <span class="value">{{ baseInfo.rightsAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">项目应收金额：</span>
              <span class="value">{{ baseInfo.repairItemPayableAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">备件应收金额：</span>
              <span class="value">{{ baseInfo.partPayableAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">应收总金额<el-tooltip class="item" effect="dark" content="应收总金额=项目金额+备件金额-项目优惠金额-备件优惠金额-去零金额"
                  placement="top">
                  <i class="label-tips">说明</i>
                </el-tooltip>：
              </span>
              <span class="value">{{ baseInfo.payableAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">已收款总金额：</span>
              <span class="value">{{ baseInfo.payableAmount - baseInfo.remainAmount }}</span>
            </div>
          </div>
        </div>

        <!-- Tab 切换 -->
        <el-tabs v-model="activeTab" class="settlement-tabs">
          <!-- 维修项目 Tab -->
          <el-tab-pane label="维修项目" name="project">
            <div class="table-section">
              <vxe-table ref="projectTable" :data="projectData" stripe show-overflow :row-config="{ isHover: true }"
                resizable border="inner" size="medium" min-height="0" max-height="400px">
                <vxe-column type="seq" title="序号" width="70" />
                <vxe-column field="repairItemCode" title="维修项目代码" width="140" />
                <vxe-column field="repairItemName" title="维修项目名称" min-width="180" show-overflow />
                <vxe-column field="checkoutTypeName" title="结算类型" width="100" />
                <vxe-column field="warrantyTypeName" title="保修类型" width="120" />
                <vxe-column field="workHour" title="工时" width="80" />
                <vxe-column field="price" title="单价" width="100" />
                <vxe-column field="discountRate" title="折扣率" width="100" />
                <vxe-column field="discountAmount" title="优惠金额" width="160" >
                  <template #default="{ row }">
                    <template v-if="checkoutTypeIncluded(row.checkoutTypeId)">
                      {{ row.discountAmount | tofixed2 }}
                    </template>
                    <el-input-number
                      v-else
                      v-model="row.discountAmount"
                      size="small"
                      :precision="2"
                      :step="0.1"
                      :min="0"
                      :max="calculateMaxDiscount(row, 'project')"
                      controls-position="right"
                      @change="handleItemDiscountAmountChange(row)"
                    />
                  </template>
                </vxe-column>
                <vxe-column field="repairAmount" title="应收金额" width="110" />
                <vxe-column field="packageCode" title="套餐代码" width="140" />
                <template #empty>
                  <div class="m-vxe-table-empty-text">暂无数据</div>
                </template>
              </vxe-table>
            </div>
          </el-tab-pane>

          <!-- 维修备件 Tab -->
          <el-tab-pane label="维修备件" name="parts">
            <div class="table-section">
              <vxe-table ref="partsTable" :data="partsData" stripe show-overflow :row-config="{ isHover: true }" resizable
                border="inner" size="medium" min-height="0" max-height="400px">
                <vxe-column type="seq" title="序号" width="70" />
                <vxe-column field="partsCode" title="备件编码" width="140" />
                <vxe-column field="partsName" title="备件名称" min-width="180" show-overflow />
                <vxe-column field="checkoutTypeName" title="结算类型" width="100" />
                <vxe-column field="warrantyTypeName" title="保修类型" width="120" />
                <vxe-column field="quantity" title="数量" width="80" />
                <vxe-column field="price" title="单价" width="100" />
                <vxe-column field="discountRate" title="折扣率" width="100" />
                <vxe-column field="discountAmount" title="优惠金额" width="160">
                  <template #default="{ row }">
                    <template v-if="checkoutTypeIncluded(row.checkoutTypeId)">
                      {{ row.discountAmount | tofixed2 }}
                    </template>
                    <el-input-number
                      v-else
                      v-model="row.discountAmount"
                      size="small"
                      :precision="2"
                      :step="0.1"
                      :min="0"
                      :max="calculateMaxDiscount(row, 'part')"
                      controls-position="right"
                      @change="handlePartDiscountAmountChange(row)"
                    />
                  </template>
                </vxe-column>
                <vxe-column field="partsAmount" title="应收金额" width="110" />
                <vxe-column field="packageCode" title="套餐代码" width="140" />
                <template #empty>
                  <div class="m-vxe-table-empty-text">暂无数据</div>
                </template>
              </vxe-table>
            </div>
          </el-tab-pane>

          <!-- 权益核销记录 Tab -->
          <el-tab-pane label="权益核销记录" name="rights">
            <div class="table-section">
              <vxe-table ref="rightsTable" :data="rightsData" stripe show-overflow :row-config="{ isHover: true }"
                resizable border="inner" size="medium" min-height="0" max-height="400px">
                <vxe-column type="seq" title="序号" width="70" />
                <vxe-column field="rightsCode" title="权益ID" width="150" />
                <vxe-column field="useId" title="使用ID" width="150" />
                <vxe-column field="rightsName" title="权益名称" min-width="180" show-overflow />
                <vxe-column field="cardTypeLabel" title="卡券类型" width="120">
                  <!-- <template #default="{ row }">
                    <el-tag :type="getRightsTypeColor(row.type)" size="small">
                      {{ row.type }}
                    </el-tag>
                  </template> -->
                </vxe-column>
                <vxe-column field="deductibleAmount" title="满减金额" width="120" />
                <vxe-column field="receiveTime" title="领券时间" width="170" />
                <vxe-column field="expirationTime" title="有效期" width="120" />
                <vxe-column field="rightsUseStateLabel" title="状态" width="120" />
                <template #empty>
                  <div class="m-vxe-table-empty-text">暂无数据</div>
                </template>
              </vxe-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </el-dialog>
    <SignDialog
      :visible.sync="signDialogVisible"
      :info="totalData"
       :serviceProxyCode="info.serviceProxyCode"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script>
import { getDiscountType } from '@/api/maintain/sp/serviceProxy/index';
import { submitSettlement } from '@/api/maintain/sp/serviceStatement/index';
import SignDialog from '../SignDialog';

export default {
  name: 'SubmitSettlemenDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    SignDialog
  },
  data () {
    return {
      activeTab: 'project',
      roundAmount: 0,
      // 优惠模式
      discountType: [],
      discountMode: null,
      // 当前选中的优惠模式详情
      currentDiscountMode: null,
      // 维修项目数据
      projectData: [],
      // 维修备件数据
      partsData: [],
      // 权益核销记录数据
      rightsData: [],
      baseInfo: {},
      // 原始数据备份，用于优惠模式切换时恢复
      originalProjectData: [],
      originalPartsData: [],
      signDialogVisible: false,
      totalData: {},
    };
  },
  filters: {
    tofixed2 (v) {
      if (v && parseFloat(v) !== 'NaN') {
        return parseFloat(v).toFixed(2);
      }
      return v;
    }
  },
  watch: {
    visible: {
      handler (val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true
    },
    info: {
      handler (val) {
        if (val && Object.keys(val).length > 0) {
          const {
            repairItemResps,
            partResps,
            rightsUsageRecordResps,
            ...rest
          } = val;
          // 深拷贝数据，避免修改原始数据
          this.projectData = JSON.parse(JSON.stringify(repairItemResps || []));
          this.partsData = JSON.parse(JSON.stringify(partResps || []));
          this.rightsData = rightsUsageRecordResps || [];
          this.baseInfo = rest || {};
          // 备份原始数据
          this.originalProjectData = JSON.parse(JSON.stringify(this.projectData));
          this.originalPartsData = JSON.parse(JSON.stringify(this.partsData));
          // 初始化去零金额
          this.roundAmount = this.baseInfo.remainAmount || 0;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initData () {
      getDiscountType().then(res => {
        this.discountType = (res || []);
      });
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      // this.activeTab = 'project';
      // this.projectData = [];
      // this.partsData = [];
      // this.rightsData = [];
    },
    // 确认提交
    handleConfirm () {
      // 计算最终金额数据
      const data = this.getFinalData();
      submitSettlement(data).then(res => {
        this.$message.success('提交结算成功');
        this.close();
        if (res.lastRecord) {
          this.signDialogVisible = true;
          this.totalData = data;
        }
      });
    },
    // 关闭弹窗
    handleClose () {
      this.close();
    },
    // 优惠模式切换
    handleDiscountModeChange (value) {
      // 找到选中的优惠模式
      this.currentDiscountMode = this.discountType.find(item => item.id === value) || null;
      // 应用优惠模式折扣率
      this.applyDiscountMode();
    },
    // 去零金额变化
    handleRoundAmountChange (value) {
      this.roundAmount = value || 0;
      // 去零金额变化时重新计算应收总金额
      this.calculateSummaryAmounts();
    },
    // 维修项目优惠金额变化
    handleItemDiscountAmountChange (row) {
      // 计算应收金额 = 单价 * 工时 - 优惠金额
      const price = +row.price || 0;
      const workHour = +row.workHour || 0;
      const discountAmount = +row.discountAmount || 0;
      const totalAmount = price * workHour;
     row.repairAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

      // 重新计算汇总金额
      this.calculateSummaryAmounts();
    },
    // 维修备件优惠金额变化
    handlePartDiscountAmountChange (row) {
      // 计算应收金额 = 单价 * 数量 - 优惠金额
      const price = +row.price || 0;
      const quantity = +row.quantity || 0;
      const discountAmount = +row.discountAmount || 0;
      const totalAmount = price * quantity;
      row.partsAmount = Math.max(0, totalAmount - discountAmount);
      // 重新计算汇总金额
      this.calculateSummaryAmounts();
    },
    // 计算最大优惠金额
    calculateMaxDiscount (row, type) {
      const price = +row.price || 0;
      if (type === 'project') {
        const workHour = +row.workHour || 0;
        return price * workHour;
      } else if (type === 'part') {
        const quantity = +row.quantity || 0;
        return price * quantity;
      }
      return price;
    },
    // 应用优惠模式折扣率
    applyDiscountMode () {
      if (!this.currentDiscountMode) {
        // 如果未选择优惠模式，恢复原始数据
        this.projectData = JSON.parse(JSON.stringify(this.originalProjectData));
        this.partsData = JSON.parse(JSON.stringify(this.originalPartsData));
      } else {
        const { discountWorkhourRate, discountPartRate } = this.currentDiscountMode;
        // 维修项目折扣率（1代表不打折，0表示打折100%）
        const workhourRate = discountWorkhourRate !== undefined ? +discountWorkhourRate : 1;
        // 备件折扣率
        const partRate = discountPartRate !== undefined ? +discountPartRate : 1;

        // 应用维修项目折扣（只影响非保修、非合同的行）
        this.projectData.forEach(row => {
          if (!this.checkoutTypeIncluded(row.checkoutTypeId)) {
            const price = +row.price || 0;
            const workHour = +row.workHour || 0;
            const totalAmount = price * workHour;
            // 折扣金额 = 总金额 * (1 - 折扣率)
            const discountAmount = totalAmount * (1 - workhourRate);
            row.discountAmount = parseFloat(discountAmount.toFixed(2));
            row.repairAmount = parseFloat((totalAmount - row.discountAmount).toFixed(2));
          }
        });

        // 应用维修备件折扣（只影响非保修、非合同的行）
        this.partsData.forEach(row => {
          if (!this.checkoutTypeIncluded(row.checkoutTypeId)) {
            const price = +row.price || 0;
            const quantity = +row.quantity || 0;
            const totalAmount = price * quantity;
            // 折扣金额 = 总金额 * (1 - 折扣率)
            const discountAmount = totalAmount * (1 - partRate);
            row.discountAmount = parseFloat(discountAmount.toFixed(2));
            row.partsAmount = parseFloat((totalAmount - row.discountAmount).toFixed(2));
          }
        });
      }
      // 重新计算汇总金额
      this.calculateSummaryAmounts();
    },
    // 计算汇总金额
    calculateSummaryAmounts () {
      // 项目优惠总金额
      const repairItemDiscount = this.projectData.reduce((sum, row) => {
        return sum + (+row.discountAmount || 0);
      }, 0);

      // 备件优惠总金额
      const partDiscount = this.partsData.reduce((sum, row) => {
        return sum + (+row.discountAmount || 0);
      }, 0);

      // 优惠总金额
      const discountAmount = repairItemDiscount + partDiscount;

      // 项目应收总金额
      const repairItemPayableAmount = this.projectData.reduce((sum, row) => {
        return sum + (+row.repairAmount || 0);
      }, 0);

      // 备件应收总金额
      const partPayableAmount = this.partsData.reduce((sum, row) => {
        return sum + (+row.partsAmount || 0);
      }, 0);

      // 应收总金额 = 项目应收 + 备件应收 - 去零金额
      const payableAmount = repairItemPayableAmount + partPayableAmount - this.roundAmount;

      // 更新 baseInfo
      this.baseInfo = {
        ...this.baseInfo,
        repairItemDiscount: parseFloat(repairItemDiscount.toFixed(2)),
        partDiscount: parseFloat(partDiscount.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        repairItemPayableAmount: parseFloat(repairItemPayableAmount.toFixed(2)),
        partPayableAmount: parseFloat(partPayableAmount.toFixed(2)),
        payableAmount: parseFloat(Math.max(0, payableAmount).toFixed(2)),
        remainAmount: parseFloat(Math.max(0, payableAmount).toFixed(2))
      };
    },
    // 计算最终金额数据（用于提交）
    getFinalData () {
      const data = {
        id: this.info.id,
        serviceProxyCode: this.info.serviceProxyCode,
        noFractionAmount: this.roundAmount,
        discountId: this.discountMode?.id,
        repairItemList: this.projectData,
        partList: this.partsData,
      };
      this.totalData = data;
      return data;
    },
    // 结算类型是否为合同、保修
    checkoutTypeIncluded (type) {
      // SELF_PAY("352BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "自费"),
      // INSURANCE("372BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "保险"),
      // WARRANTY("392BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "保修"),
      // CONTRACT("3B2BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "合同"),
      // INTERNAL_SETTLEMENT("3D2BB70C-82AC-E911-B0BB-FC82BA5F9EDF", "内部结算");
      return type === '392BB70C-82AC-E911-B0BB-FC82BA5F9EDF' || type === '3B2BB70C-82AC-E911-B0BB-FC82BA5F9EDF';
    },
    handleRefresh () {
      this.$emit('refresh');
    },
  }
};
</script>

<style lang="scss" scoped>
.m-submit-settlement-dialog {
  .m-vxe-table-empty-text {
    text-align: left;
  }
  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
  }
  .settlement-content {
    .info-section {
      padding-bottom: 16px;

      .info-group {
        display: flex;
        flex-wrap: wrap;
        gap: 3px 0;

        .info-item {
          display: flex;
          align-items: center;
          width: 25%;
          height: 32px;

          .label {
            color: var(--leap-color-default);
            font-size: 14px;
            white-space: nowrap;
            width: 120px;
            text-align: right;

            &-tips {
              background-color: var(--leap-color-danger);
              font-size: 12px;
              color: #fff;
              border-radius: 8px;
              padding: 0 4px;
              font-style: normal;
              display: inline-block;
            }
          }

          .value {
            color: var(--leap-color-default-dark-1);
            font-weight: 500;
            font-size: 14px;

            &.highlight {
              color: var(--leap-color-primary);
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
</style>
