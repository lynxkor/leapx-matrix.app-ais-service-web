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
          v-for="tab in tabs"
          :key="tab.code"
          :class="['tabs-item', { 'is-active': activeTab === tab.code }]"
          @click="handleTabClick(tab.code)"
        >
          <span class="tabs-item__text">{{ tab.message }}{{ tab.value > 0 ? `(${tab.value})` : '' }}</span>
          <span v-if="activeTab === tab.code" class="tabs-item__indicator"></span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 维修套餐 -->
      <maintain-pkg
        v-if="activeTab == PackageTypeEnum.REPAIR"
        ref="repairRef"
        :vehicle-info="vehicleInfo"
        @refresh="handleRefresh"
      />
      <!-- 权益套餐 -->
      <equity-pkg
        v-else-if="activeTab == PackageTypeEnum.EQUITY"
        ref="equityRef"
        :vehicle-info="vehicleInfo"
        @refresh="handleRefresh"
      />
      <!-- 商城订单 -->
      <StorePkg
        v-else-if="activeTab == PackageTypeEnum.STORE"
        ref="orderRef"
        :vehicle-info="vehicleInfo"
        @refresh="handleRefresh"
      />
      <!-- 免保项目 -->
       <FreePkg
        v-else-if="activeTab == PackageTypeEnum.FREE"
        ref="freeRef"
        :vehicle-info="vehicleInfo"
        @refresh="handleRefresh"
      />
      <!-- 服务活动 -->
       <ActivityPkg
        v-else-if="activeTab == PackageTypeEnum.TECH_ACTIVITY"
        ref="activityRef"
        :vehicle-info="vehicleInfo"
        @refresh="handleRefresh"
      />
    </div>
  </el-dialog>
</template>

<script>
import MaintainPkg from './maintainPkg.vue';
import EquityPkg from './equityPkg.vue';
import ActivityPkg from './activityPkg.vue';
import StorePkg from './storePkg.vue';
import FreePkg from './freePkg.vue';
import { PackageTypeEnum, PackageTypeOptions } from '../../constant';

export default {
  name: 'UpdateActivityDialog',
  components: {
    MaintainPkg,
    EquityPkg,
    ActivityPkg,
    StorePkg,
    FreePkg
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
    currentPackageType: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      activeTab: '',
      tabs: PackageTypeOptions,
      PackageTypeEnum
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
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
        [PackageTypeEnum.REPAIR]: 'repairRef',
        [PackageTypeEnum.EQUITY]: 'equityRef',
        [PackageTypeEnum.STORE]: 'orderRef',
        [PackageTypeEnum.FREE]: 'freeRef',
        [PackageTypeEnum.TECH_ACTIVITY]: 'activityRef'
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
  ::v-deep .el-dialog {
    height: 600px;
    overflow: hidden;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
    overflow: hidden;
  }

  .tabs-wrapper {
    flex-shrink: 0;
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
    flex: 1;
    display: flex;
    height: 495px;
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
