<template>
  <div class="equity-pkg-content">
    <!-- 左侧列表 -->
    <div class="left-panel">
      <div class="search-box">
        <el-input
          v-model="searchKey"
          placeholder="输入代码、名称"
          prefix-icon="el-icon-search"
          size="small"
          clearable
          @input="handleSearch"
        />
      </div>
      <div class="list-wrapper" v-loading="loading">
        <template v-if="packageList.length > 0">
          <div
            v-for="(item) in packageList"
            :key="item.useId"
            :class="['list-item', { 'is-selected': selectedItem.useId === item.useId }]"
            @click="handleSelectItem(item)"
          >
            <div class="list-item__content">
              <div class="list-item__name">{{ item.rightsName }}({{ item.remainTimes }}/{{ item.totalRemainTimes }})</div>
              <div class="list-item__code">{{ item.rightsCode }}</div>
            </div>
            <!-- <i v-if="selectedItem.useId === item.useId" class="el-icon-success selected-icon"></i> -->
          </div>
        </template>
        <div v-else class="list-empty">
          <div class="empty-text">没有找到相关内容</div>
        </div>
      </div>
    </div>

    <!-- 右侧详情 -->
    <div class="right-panel">
      <div v-if="selectedItem.useId" class="detail-content" v-loading="detailLoading">
        <div class="detail-title">{{ selectedItem.name }}</div>

        <!-- 维修项目表格 -->
        <div class="detail-section">
          <div class="section-title">维修项目</div>
          <vxe-table
            ref="repairItemTable"
            :data="repairItemData"
            stripe
            show-overflow
            :row-config="{ isHover: true }"
            resizable
            border="inner"
            size="medium"
            min-height="0"
            max-height="180px"
          >
            <vxe-column field="repairItemCode" title="维修项目代码" width="120" />
            <vxe-column field="repairItemName" title="维修项目名称" width="180" />
            <vxe-column field="repairItemTypeName" title="维修类型" width="120" />
            <vxe-column field="checkoutTypeName" title="结算类型" width="120" />
            <vxe-column field="warrantyTypeName" title="保修类型" width="120" />
            <vxe-column field="workHour" title="工时" width="100" />
            <vxe-column field="price" title="单价" width="100" />
            <vxe-column field="discountRate" title="折扣率" width="100" />
            <vxe-column field="discountAmount" title="优惠金额" width="100" />
            <vxe-column field="repairAmount" title="项目金额" width="100" />
          </vxe-table>
        </div>

        <!-- 维修零件表格 -->
        <div class="detail-section">
          <div class="section-title">维修零件</div>
          <vxe-table
            ref="repairPartTable"
            :data="repairPartData"
            stripe
            show-overflow
            :row-config="{ isHover: true }"
            resizable
            border="inner"
            size="medium"
            min-height="0"
            max-height="180px"
          >
            <vxe-column field="partsCode" title="零件代码" width="120" />
            <vxe-column field="partsName" title="零件名称" width="180" />
            <vxe-column field="repairItemTypeName" title="维修类型" width="120" />
            <vxe-column field="checkoutTypeName" title="结算类型" width="120" />
            <vxe-column field="warrantyTypeName" title="保修类型" width="120" />
            <vxe-column field="quantity" title="数量" width="100" />
            <vxe-column field="price" title="单价" width="100" />
            <vxe-column field="discountRate" title="折扣率" width="100" />
            <vxe-column field="discountAmount" title="优惠金额" width="100" />
            <vxe-column field="partsAmount" title="项目金额" width="100" />
          </vxe-table>
        </div>

        <!-- 底部操作栏 -->
        <div class="footer-bar">
          <el-button type="primary" size="small" @click="handleConfirm">
            核销使用
          </el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="right-panel--empty" v-else>
        <div class="empty-text">请选择左侧套餐查看详情</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEquityList, useEquity } from '@/api/maintain/sp/serviceProxy/special';

export default {
  name: 'EquityPkg',
  props: {
    vehicleInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      searchKey: '',
      selectedItem: {},
      loading: false,
      detailLoading: false,
      packageList: [],
      repairItemData: [],
      repairPartData: []
    };
  },
  methods: {
    // 初始化数据
    initData () {
      this.selectedItem = {};
      this.searchKey = '';
      this.packageList = [];
      this.repairItemData = [];
      this.repairPartData = [];
      this.fetchEquityList();
    },
    // 获取权益套餐列表
    async fetchEquityList () {
      try {
        this.loading = true;
        // 根据YAPI接口,请求参数包含packageId和searchKey
        const params = {
          id: this.vehicleInfo.id
        };
        // 如果有搜索关键词,传递给后端筛选
        if (this.searchKey) {
          params.searchKey = this.searchKey;
        }
        const res = await getEquityList(params);
        // YAPI接口返回的列表字段映射
        this.packageList = (res || []);
        if (this.packageList.length > 0) {
          this.handleSelectItem(this.packageList[0]);
        }
      } catch (error) {
        console.error('获取权益套餐列表失败:', error);
        this.$message.error('获取权益套餐列表失败');
      } finally {
        this.loading = false;
      }
    },
    // 搜索
    handleSearch () {
      this.fetchEquityList();
    },
    // 选择套餐项
    async handleSelectItem (item) {
      this.selectedItem = item;
      this.repairItemData = item.repairItemList || [];
      this.repairPartData = item.repairPartList || [];
    },
    // 确认操作
    async handleConfirm () {
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>本操作视为您进行核销本次权益套餐，请确认？</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(() => {
        this.handleUseEquity();
      }).catch(() => {
      });
    },
    // 核销使用
    async handleUseEquity () {
      try {
        await useEquity({
          id: this.vehicleInfo.id,
          verificationCityLevel: this.selectedItem.writeOffCityLevel,
          purchaseCityLevel: this.selectedItem.cityLevel,
          verificationEquityCode: this.selectedItem.rightsGrantCode,
          totalRemainingUsage: this.selectedItem.totalRemainTimes,
          remainingUsageCount: this.selectedItem.remainTimes,
          totalUsedCount: this.selectedItem.usedTimes,
          spreadType: this.selectedItem.compensationMode,
          equityUseId: this.selectedItem.useId,
          equityCode: this.selectedItem.rightsCode,
          equityName: this.selectedItem.rightsName,
          suggestedSpreadPrice: this.selectedItem.suggestedSpreadPrice,
          repairItemList: this.selectedItem.repairItemList,
          repairPartList: this.selectedItem.repairPartList,
        });
        this.$message.success('核销成功');
        this.$emit('refresh');
        // 刷新列表
        await this.fetchEquityList();
      } catch (error) {
        console.error('核销失败:', error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/libs/assets/styles/variables.scss';

.equity-pkg-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    text-align: left;
  }
  .left-panel {
    width: 204px;
    border-right: 1px solid $--leap-color-default-light-4;
    display: flex;
    flex-direction: column;

    .search-box {
      padding: 12px;
    }

    .list-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 0 12px 12px 12px;
      max-height: 520px;
    }

    .list-empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 150px;

      .empty-text {
        color: var(--leap-color-default-light-1);
        font-size: 14px;
      }
    }

    .list-item {
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:hover {
        background-color: $--leap-color-default-light-5;
      }

      &.is-selected {
        background-color: $--leap-color-primary-light-9;

        .list-item__name,
        .list-item__code {
          color: $--leap-color-primary;
        }

        .list-item__count {
          color: $--leap-color-primary;
        }
      }

      &__content {
        flex: 1;
        min-width: 0;
      }

      &__name {
        font-size: 14px;
        line-height: 22px;
        color: $--leap-color-default;
      }

      &__code {
        font-size: 12px;
        line-height: 20px;
        color: $--leap-color-default;
      }

      &__count {
        font-size: 12px;
        line-height: 20px;
        color: $--leap-color-default-light-2;
      }

      .selected-icon {
        color: $--leap-color-success;
        font-size: 16px;
        margin-left: 8px;
        flex-shrink: 0;
      }
    }
  }

  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &--empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .empty-text {
        color: $--leap-color-default-light-1;
        font-size: 14px;
      }
    }

    .detail-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px;

      .detail-title {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
        color: $--leap-color-default-dark-1;
        margin-bottom: 16px;
      }

      .detail-section {
        margin-bottom: 28px;

        &:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 22px;
          color: $--leap-color-default-dark-1;
          margin-bottom: 12px;
        }
      }

      .footer-bar {
        padding: 16px 0 0;
        border-top: 1px solid var(--leap-color-default-light-4);
        text-align: right;
        margin-top: auto;
      }
    }
  }
}
</style>
