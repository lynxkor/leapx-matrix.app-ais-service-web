<template>
  <el-dialog class="m-coupons-dialog" title="查询卡券&终身权益" width="1000px" :visible.sync="dialogVisible" @close="close"
    @closed="closed">
    <div class="coupons-content">
      <div class="action-section">

      </div>

      <!-- Tab 切换 -->
      <el-tabs v-model="activeTab" class="coupons-tabs">
        <!-- 卡券 Tab -->
        <el-tab-pane label="卡券" name="coupon">
          <div class="table-section">
            <vxe-table ref="couponTable" :data="couponData" stripe show-overflow :row-config="{ isHover: true }"
              resizable border="inner" size="medium" min-height="0" max-height="500px">
              <vxe-column type="seq" title="序号" width="70" align="center" />
              <vxe-column field="rightsCode" title="权益ID" width="250" show-overflow="tooltip" />
              <vxe-column field="rightsName" title="权益名称" width="200" show-overflow="tooltip" />
              <vxe-column field="cardTypeLabel" title="卡券类型" width="120" align="center" />
              <!-- <vxe-column field="applicableMaintenanceType" title="适用维修类型" width="120" align="center">
                <template #default="{ row }">
                  {{ getServiceTypeText(row.relatedRepairTypeList) }}
                </template>
              </vxe-column> -->
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
        </el-tab-pane>

        <!-- 终身权益 Tab -->
        <el-tab-pane label="终身权益" name="lifetime">
          <div class="table-section">
            <vxe-table ref="lifetimeTable" :data="lifetimeData" stripe :row-config="{ isHover: true }"
              resizable border="inner" size="medium" min-height="0" max-height="500px">
              <vxe-column type="seq" title="序号" width="70" align="center" />
              <vxe-column field="rightsCode" title="权益编号" width="300"/>
              <vxe-column field="rightsName" title="权益名称" width="300"/>
              <vxe-column field="rightsDesc" title="权益规则说明" width="300" >
               <template #default="{ row }">
                  <div v-html="row.rightsDesc"></div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import {
  rightsList
} from '@/api/maintain/sp/serviceStatement/index';

export default {
  name: 'CouponsDialog',
  props: {
    visible: {
      type: Boolean,
      default: false

    },
    vehicleInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      activeTab: 'coupon',
      // 卡券数据
      couponData: [],
      // 终身权益数据
      lifetimeData: []
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    },
    activeTab (newVal) {
      // 当切换tab时，加载对应的数据
      this.loadDataByTab(newVal);
    }
  },
  methods: {

    initData () {
      this.loadDataByTab(this.activeTab);
    },
    getList () {
      this.loadDataByTab(this.activeTab);
    },
    loadDataByTab (tabName) {
      // 根据tab名称设置参数
      const params = {
        serviceProxyId: this.vehicleInfo.id, // 使用传入的info参数
        rightsType: tabName === 'coupon' ? 3 : 1
      };

      // 调用API获取数据
      rightsList(params).then(res => {
        if (res) {
          if (tabName === 'coupon') {
            this.couponData = res;
          } else {
            this.lifetimeData = res;
          }
        } else {
          // 设置空数组以确保表格显示正确
          if (tabName === 'coupon') {
            this.couponData = [];
          } else {
            this.lifetimeData = [];
          }
        }
      }).catch(err => {
        console.error(`Failed to load ${tabName} data:`, err);
        // 出错时也设置为空数组
        if (tabName === 'coupon') {
          this.couponData = [];
        } else {
          this.lifetimeData = [];
        }
      });
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.activeTab = 'coupon';
      this.couponData = [];
      this.lifetimeData = [];
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
  }
};
</script>

<style lang="scss" scoped>
.m-coupons-dialog {

  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }

  .coupons-content {
    .action-section {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }

    .info-section {
      display: flex;
      gap: 30px;
      padding-bottom: 16px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e8e8e8;

      .info-item {
        display: flex;
        align-items: center;

        .label {
          color: var(--leap-color-text-secondary);
          margin-right: 8px;
        }

        .value {
          color: var(--leap-color-default);
          font-weight: 500;
        }
      }
    }

    .coupons-tabs {
      ::v-deep .el-tabs__header {
        margin-bottom: 16px;
      }

      ::v-deep .el-tabs__item {
        font-size: 14px;
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
</style>
