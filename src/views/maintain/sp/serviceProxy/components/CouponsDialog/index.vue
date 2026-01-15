<template>
  <el-dialog
    class="m-coupons-dialog"
    title="查询卡券&终身权益"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="coupons-content">
      <div class="action-section">
       VIN码：<el-link type="success">SO-27283782378347834783</el-link>
      </div>

      <!-- Tab 切换 -->
      <el-tabs v-model="activeTab" class="coupons-tabs">
        <!-- 卡券 Tab -->
        <el-tab-pane label="卡券" name="coupon">
          <div class="table-section">
            <vxe-table
              ref="couponTable"
              :data="couponData"
              stripe
              show-overflow
              :row-config="{isHover: true}"
              resizable
              border="inner"
              size="medium"
            >
              <vxe-column type="seq" title="序号" width="70" align="center" />
              <vxe-column field="code" title="权益编码" width="150" />
              <vxe-column field="name" title="权益名称" min-width="180" show-overflow />
              <vxe-column field="type" title="权益类型" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="getCouponTypeColor(row.type)" size="small">
                    {{ row.type }}
                  </el-tag>
                </template>
              </vxe-column>
              <vxe-column field="target" title="发放对象" width="120" align="center" />
              <vxe-column field="quantity" title="发放数量" width="100" align="center" />
              <vxe-column field="issueTime" title="发放时间" width="170" />
              <vxe-column field="expireTime" title="有效期至" width="170" />
              <vxe-column field="status" title="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)" size="small">
                    {{ row.status }}
                  </el-tag>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </el-tab-pane>

        <!-- 终身权益 Tab -->
        <el-tab-pane label="终身权益" name="lifetime">
          <div class="table-section">
            <vxe-table
              ref="lifetimeTable"
              :data="lifetimeData"
              stripe
              show-overflow
              :row-config="{isHover: true}"
              resizable
              border="inner"
              size="medium"
            >
              <vxe-column type="seq" title="序号" width="70" align="center" />
              <vxe-column field="code" title="权益编码" width="150" />
              <vxe-column field="name" title="权益名称" min-width="180" show-overflow />
              <vxe-column field="type" title="权益类型" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="getCouponTypeColor(row.type)" size="small">
                    {{ row.type }}
                  </el-tag>
                </template>
              </vxe-column>
              <vxe-column field="repairType" title="维修类型" width="120" align="center" />
              <vxe-column field="issueTime" title="发放时间" width="170" />
              <vxe-column field="expireTime" title="有效期至" width="170" />
              <vxe-column field="usageCount" title="车辆使用次数" width="120" align="center" />
              <vxe-column field="status" title="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)" size="small">
                    {{ row.status }}
                  </el-tag>
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
export default {
  name: 'CouponsDialog',
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
    }
  },
  methods: {
    initData () {
      // 获取卡券数据
      this.fetchCouponData();
      // 获取终身权益数据
      this.fetchLifetimeData();
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.activeTab = 'coupon';
      this.couponData = [];
      this.lifetimeData = [];
    },
    // 获取卡券数据
    fetchCouponData () {
      this.couponData = [
        {
          id: 1,
          code: 'COUPON001',
          name: '工时费8折券',
          type: '折扣券',
          target: '个人',
          quantity: 1,
          issueTime: '2024-01-15 10:00:00',
          expireTime: '2024-12-31 23:59:59',
          status: '未使用'
        },
        {
          id: 2,
          code: 'COUPON002',
          name: '免费洗车券',
          type: '服务券',
          target: '个人',
          quantity: 2,
          issueTime: '2024-01-10 14:30:00',
          expireTime: '2024-06-30 23:59:59',
          status: '已使用'
        },
        {
          id: 3,
          code: 'COUPON003',
          name: '保养套餐券',
          type: '套餐券',
          target: '个人',
          quantity: 1,
          issueTime: '2024-02-01 09:00:00',
          expireTime: '2024-08-31 23:59:59',
          status: '已过期'
        }
      ];
    },
    // 获取终身权益数据
    fetchLifetimeData () {
      this.lifetimeData = [
        {
          id: 1,
          code: 'LIFETIME001',
          name: '终身免费救援',
          type: '服务权益',
          repairType: '救援',
          issueTime: '2023-05-15 10:00:00',
          expireTime: '长期有效',
          usageCount: '3/不限',
          status: '生效中'
        },
        {
          id: 2,
          code: 'LIFETIME002',
          name: '终身免费检测',
          type: '服务权益',
          repairType: '检测',
          issueTime: '2023-06-20 14:00:00',
          expireTime: '长期有效',
          usageCount: '5/不限',
          status: '生效中'
        },
        {
          id: 3,
          code: 'LIFETIME003',
          name: '终身工时费8折',
          type: '折扣权益',
          repairType: '维修',
          issueTime: '2023-07-01 09:30:00',
          expireTime: '长期有效',
          usageCount: '10/不限',
          status: '生效中'
        }
      ];
    },
    // 获取卡券类型颜色
    getCouponTypeColor (type) {
      const typeMap = {
        折扣券: 'warning',
        服务券: 'success',
        套餐券: 'primary',
        服务权益: 'success',
        折扣权益: 'warning'
      };
      return typeMap[type] || 'info';
    },
    // 获取状态颜色
    getStatusType (status) {
      const statusMap = {
        未使用: 'success',
        已使用: 'info',
        已过期: 'danger',
        生效中: 'success',
        已失效: 'danger'
      };
      return statusMap[status] || 'info';
    },
    // 查看详情
    handleViewDetail (row) {
      this.$message.info('查看详情功能开发中');
      console.log('查看详情', row);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-coupons-dialog {
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
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
