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
        <template v-if="filteredList.length > 0">
          <div
            v-for="(item) in filteredList"
            :key="item.id"
            :class="['list-item', { 'is-selected': selectedItem.id === item.id }]"
            @click="handleSelectItem(item)"
          >
            <div class="list-item__content">
              <div class="list-item__name">{{ item.name }}</div>
              <div class="list-item__code">{{ item.interestsGoodsCode }}</div>
              <div class="list-item__count">可用次数 {{ item.remainTimes || 0 }}/{{ item.totalRemainTimes || 0 }}</div>
            </div>
            <i v-if="selectedItem.id === item.id" class="el-icon-success selected-icon"></i>
          </div>
        </template>
        <div v-else class="list-empty">
          <div class="empty-text">没有找到相关内容</div>
        </div>
      </div>
    </div>

    <!-- 右侧详情 -->
    <div class="right-panel">
      <div v-if="selectedItem.id" class="detail-content" v-loading="detailLoading">
        <div class="detail-title">{{ selectedItem.name }}</div>

        <!-- 维修项目表格 -->
        <div class="detail-section" v-if="repairItemData.length > 0">
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
            max-height="180px"
          >
            <vxe-column field="code" title="维修项目代码" width="120" />
            <vxe-column field="name" title="维修项目名称" width="114" />
            <vxe-column field="repairType" title="维修类型" width="105" />
            <vxe-column field="settlementType" title="结算类型" width="136" />
            <vxe-column field="warrantyType" title="保修类型" width="165" />
            <vxe-column field="workHours" title="工时" width="100" />
          </vxe-table>
        </div>

        <!-- 维修零件表格 -->
        <div class="detail-section" v-if="repairPartData.length > 0">
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
            max-height="180px"
          >
            <vxe-column field="code" title="零件代码" width="120" />
            <vxe-column field="name" title="零件名称" width="114" />
            <vxe-column field="repairType" title="维修类型" width="105" />
            <vxe-column field="settlementType" title="结算类型" width="136" />
            <vxe-column field="warrantyType" title="保修类型" width="165" />
            <vxe-column field="workHours" title="工时" width="100" />
          </vxe-table>
        </div>

        <!-- 底部操作栏 -->
        <div class="footer-bar">
          <el-button type="primary" size="small" @click="handleConfirm">
            {{ isCancelMode ? '取消使用' : '核销使用' }}
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
import { getEquityList, getEquityDetail, useEquity, cancel } from '@/api/maintain/sp/serviceProxy/special';

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
  computed: {
    filteredList () {
      // 搜索由后端处理,前端直接返回列表
      return this.packageList;
    },
    // 是否为取消模式(左侧列表有选中项时为取消模式)
    isCancelMode () {
      return !!this.selectedItem?.id;
    }
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
        this.packageList = (res || []).map(item => ({
          id: item.useId || item.userId || '', // 使用ID或用户ID
          name: item.rightsName || '', // 权益名称
          interestsGoodsCode: item.rightsCode || '', // 权益编码
          isEffect: item.rightsStatus === 2 ? 1 : 0, // 权益使用状态:2-可使用视为已生效
          remainTimes: item.remainTimes || 0, // 可使用次数
          totalRemainTimes: item.totalRemainTimes || 0, // 可使用总次数
          usedTimes: item.usedTimes || 0, // 已使用总次数
          rightsType: item.rightsType, // 权益类型
          rightsStatus: item.rightsStatus, // 权益使用状态
          effectDate: item.effectDate, // 生效时间
          expiryDate: item.expiryDate, // 失效时间
          repairItemList: item.repairItemList || [], // 维修项目清单
          repairPartList: item.repairPartList || [] // 维修配件清单
        }));
      } catch (error) {
        console.error('获取权益套餐列表失败:', error);
        this.$message.error('获取权益套餐列表失败');
      } finally {
        this.loading = false;
      }
    },
    // 搜索
    handleSearch () {
      // 搜索由后端处理,重新请求列表
      this.fetchEquityList();
    },
    // 选择套餐项
    async handleSelectItem (item) {
      this.selectedItem = item;
      await this.fetchEquityDetail(item.id);
    },
    // 获取权益套餐详情
    async fetchEquityDetail (packageId) {
      if (!packageId) return;
      try {
        this.detailLoading = true;
        // 根据YAPI接口,请求参数为 { packageId: "权益套餐ID" }
        const res = await getEquityDetail({ packageId });
        // YAPI接口返回的是维修配件清单对象数组
        // 包含维修项目和零件信息,字段名需要映射
        this.repairItemData = (res || []).map(item => ({
          code: item.repairItemCode || '', // 维修项目代码
          name: item.repairItemName || '', // 维修项目名称
          repairType: item.repairItemTypeName || '', // 维修类型
          settlementType: item.checkoutTypeName || '', // 结算类型
          warrantyType: item.warrantyTypeName || '', // 保修类型
          workHours: item.workHour || 0 // 工时数
        }));
        // 维修零件数据映射
        this.repairPartData = (res || []).filter(item => item.partsCode).map(item => ({
          code: item.partsCode || '', // 零件代码
          name: item.partsName || '', // 零件名称
          repairType: item.repairItemTypeName || '', // 维修类型
          settlementType: item.checkoutTypeName || '', // 结算类型
          warrantyType: item.warrantyTypeName || '', // 保修类型
          quantity: item.quantity || 0 // 数量
        }));
      } catch (error) {
        console.error('获取权益套餐详情失败:', error);
        this.$message.error('获取权益套餐详情失败');
      } finally {
        this.detailLoading = false;
      }
    },
    // 确认操作 - 核销使用或取消使用
    async handleConfirm () {
      if (this.isCancelMode) {
        // 已选中套餐,执行取消使用
        await this.handleCancel();
      } else {
        // 未选中套餐,执行核销使用
        await this.handleUseEquity();
      }
    },
    // 核销使用
    async handleUseEquity () {
      try {
        await useEquity({ packageId: this.vehicleInfo.id });
        this.$message.success('核销成功');
        this.$emit('refresh');
        // 刷新列表
        await this.fetchEquityList();
      } catch (error) {
        console.error('核销失败:', error);
        this.$message.error(error?.message || '核销失败');
      }
    },
    // 取消使用
    async handleCancel () {
      if (!this.selectedItem?.id) {
        return;
      }
      try {
        await cancel({ packageId: this.selectedItem.id });
        this.$message.success('取消使用成功');
        this.$emit('refresh');
        // 刷新列表
        await this.fetchEquityList();
        // 重置选中状态
        this.selectedItem = {};
        this.repairItemData = [];
        this.repairPartData = [];
      } catch (error) {
        console.error('取消使用失败:', error);
        this.$message.error(error?.message || '取消使用失败');
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
      padding: 0 12px;
      max-height: 620px;
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
