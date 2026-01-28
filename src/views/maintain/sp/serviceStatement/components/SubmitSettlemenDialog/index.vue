<template>
  <el-dialog class="m-submit-settlement-dialog" title="提交结算" width="1200px" :visible="visible" @close="close"
    @closed="closed">
    <div class="settlement-content">
      <!-- 订单信息区域 -->
      <div class="info-section">
        <div class="info-group">
          <div class="info-item">
            <span class="label">委托工单号：</span>
            <span class="value">{{ info.code }}</span>
          </div>
          <div class="info-item">
            <span class="label">VIN：</span>
            <span class="value">{{ info.vehProfileVin }}</span>
          </div>
          <div class="info-item">
            <span class="label">结算类型：</span>
            <span class="value">{{ info.statementTypeLabel }}</span>
          </div>
          <div class="info-item">
            <span class="label">优惠模式：</span>
            <el-select v-model="discountMode" placeholder="请选择" size="small" style="width: 150px;"
              @change="handleDiscountModeChange">
              <el-option :label="item.name" :value="item.id" v-for="item in discountType" :key="item.id"></el-option>
            </el-select>
          </div>
          <div class="info-item">
            <span class="label">项目金额：</span>
            <span class="value">{{ info.repairItemAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">备件金额：</span>
            <span class="value">{{ info.partAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">总金额：</span>
            <span class="value">{{ info.totalAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">去零金额：</span>
            <span class="value">
              <el-input-number style="width: 150px;" :precision="2" :min="0" size="small"
                v-model="roundAmount"></el-input-number>
            </span>
          </div>
          <div class="info-item">
            <span class="label">项目优惠金额：</span>
            <span class="value">{{ info.repairItemDiscount }}</span>
          </div>
          <div class="info-item">
            <span class="label">备件优惠金额：</span>
            <span class="value">{{ info.partDiscount }}</span>
          </div>
          <div class="info-item">
            <span class="label">优惠总金额：</span>
            <span class="value">{{ info.discountAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">权益金额：</span>
            <span class="value">{{ info.rightsAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">项目应收金额：</span>
            <span class="value">{{ info.repairItemPayableAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">备件应收金额：</span>
            <span class="value">{{ info.partPayableAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">应收总金额<el-tooltip class="item" effect="dark" content="应收总金额=项目金额+备件金额-项目优惠金额-备件优惠金额-去零金额"
                placement="top">
                <i class="label-tips">说明</i>
              </el-tooltip>：
            </span>
            <span class="value">{{ info.payableAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">已收款总金额：</span>
            <span class="value">{{ info.payableAmount - info.remainAmount }}</span>
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
                  <template v-if="checkoutTypeIncluded(row.checkoutTypeId)">{{ row?.discountAmount | tofixed2 }}</template>
                  <el-input-number
                    v-else
                    v-model="row.discountAmount"
                    size="small"
                    :precision="2"
                    :step="0.1"
                    :min="0"
                    :max="+row.price"
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
                  <template v-if="checkoutTypeIncluded(row.checkoutTypeId)">{{ row?.discountAmount | tofixed2 }}</template>
                  <el-input-number
                    v-else
                    v-model="row.discountAmount"
                    size="small"
                    :precision="2"
                    :step="0.1"
                    :min="0"
                    :max="+row.price"
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
              <vxe-column field="cardType" title="卡券类型" width="120">
                <!-- <template #default="{ row }">
                  <el-tag :type="getRightsTypeColor(row.type)" size="small">
                    {{ row.type }}
                  </el-tag>
                </template> -->
              </vxe-column>
              <vxe-column field="paymentAmount" title="满减金额" width="120" />
              <vxe-column field="effectDate" title="领券时间" width="170" />
              <vxe-column field="expiryDate" title="有效期" width="120" />
              <vxe-column field="rightsStatus" title="状态" width="120" />
              <template #empty>
                <div class="m-vxe-table-empty-text">暂无数据</div>
              </template>
            </vxe-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">关闭</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDiscountType } from '@/api/maintain/sp/serviceProxy/index';

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
  data () {
    return {
      activeTab: 'project',
      roundAmount: 0,
      // 优惠模式
      discountType: [],
      discountMode: null,
      // 维修项目数据
      projectData: [],
      // 维修备件数据
      partsData: [],
      // 权益核销记录数据
      rightsData: []
    };
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
          this.projectData = val.repairItemResps || [];
          this.partsData = val.partResps || [];
          this.rightsData = val.rightsUsageRecordResps || [];
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
      this.activeTab = 'project';
      this.projectData = [];
      this.partsData = [];
      this.rightsData = [];
    },
    // 确认提交
    handleConfirm () {
      this.$emit('confirm', {
        // orderInfo: this.orderInfo,
        // amountInfo: this.amountInfo,
        // activeTab: this.activeTab
      });
      this.close();
      this.$message.success('提交结算成功');
    },
    // 关闭弹窗
    handleClose () {
      this.close();
    },
    handleDiscountModeChange (value) {
      // this.discountMode = value;
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
