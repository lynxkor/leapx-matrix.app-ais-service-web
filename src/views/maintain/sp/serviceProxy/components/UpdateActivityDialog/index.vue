<template>
  <el-dialog
    class="m-update-activity-dialog"
    title="快捷添加"
    width="1000px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="close"
    @closed="closed"
  >
    <!-- Tabs 标签页 -->
    <div class="tabs-wrapper">
      <div class="tabs-list">
        <div
          v-for="tab in packageType"
          :key="tab.code"
          :class="['tabs-item', { 'is-active': activeTab === tab.code }]"
          @click="handleTabClick(tab.code)"
        >
          <span class="tabs-item__text">{{ tab.message }}({{ tab.value }})</span>
          <span v-if="activeTab === tab.code" class="tabs-item__indicator"></span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 维修套餐 -->
      <maintain-pkg
        v-if="activeTab == 10"
        ref="repairRef"
        :vehicle-info="vehicleInfo"
        @refresh="handleRefresh"
      />
      <!-- 权益套餐 -->
      <equity-pkg
        v-else-if="activeTab == 20"
        ref="equityRef"
        :vehicle-info="vehicleInfo"
        @refresh="handleRefresh"
      />
      <!-- 商城订单 -->
      <div v-else-if="activeTab == 30" class="placeholder-content">
        <span>商城订单功能开发中...</span>
      </div>
      <!-- 免保项目 -->
      <div v-else-if="activeTab == 40" class="placeholder-content">
        <span>免保项目功能开发中...</span>
      </div>
      <!-- 服务活动 -->
      <div v-else-if="activeTab == 50" class="placeholder-content">
        <span>服务活动功能开发中...</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import MaintainPkg from './maintainPkg.vue';
import EquityPkg from './equityPkg.vue';

export default {
  name: 'UpdateActivityDialog',
  components: {
    MaintainPkg,
    EquityPkg
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    vehicleInfo: {
      type: Object,
      default: () => ({})
    },
    packageType: {
      type: Array,
      default: () => ([])
    },
    currentPackageType: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      activeTab: '',
      tabs: [
        { code: '10', message: '维修套餐' },
        { code: '20', message: '权益套餐' },
        { code: '30', message: '商城订单' },
        { code: '40', message: '免保项目' },
        { code: '50', message: '服务活动' }
      ]
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        console.log(this.packageType);
        this.activeTab = this.currentPackageType;
        this.initData();
      }
    }
  },
  methods: {
    initData () {
      this.$nextTick(() => {
        const ref = this.getCurrentRef();
        if (ref && ref.initData) {
          ref.initData();
        }
      });
    },
    handleTabClick (value) {
      this.activeTab = value;
      this.$nextTick(() => {
        const ref = this.getCurrentRef();
        if (ref && ref.initData) {
          ref.initData();
        }
      });
    },
    getCurrentRef () {
      const refMap = {
        10: 'repairRef',
        20: 'equityRef',
        30: 'orderRef',
        40: 'freeRef',
        50: 'activityRef'
      };
      return this.$refs[refMap[this.activeTab]];
    },
    handleRefresh () {
      this.initData();
      this.$emit('refresh');
      // this.close();
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      // 重置状态
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/libs/assets/styles/variables.scss';

.m-update-activity-dialog {
  ::v-deep .el-dialog__body {
    padding: 0;
    overflow: hidden;
  }

  .tabs-wrapper {
    padding: 12px 20px 0;
    border-bottom: 1px solid $--leap-color-default-light-4;
  }

  .tabs-list {
    display: flex;
  }

  .tabs-item {
    position: relative;
    padding: 9px 0 8px;
    margin-right: 24px;
    cursor: pointer;
    color: $--leap-color-default;
    font-size: 14px;
    line-height: 22px;

    &:hover {
      color: $--leap-color-primary;
    }

    &.is-active {
      color: $--leap-color-primary;
      font-weight: 700;

      .tabs-item__indicator {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $--leap-color-primary;
      }
    }
  }

  .content-wrapper {
    display: flex;
    overflow: hidden;
    min-height: 500px;
  }

  .placeholder-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $--leap-color-default-light-2;
    font-size: 14px;
  }
}
</style>
