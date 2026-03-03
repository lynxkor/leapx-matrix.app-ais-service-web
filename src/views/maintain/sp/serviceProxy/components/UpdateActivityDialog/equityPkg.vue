<template>
  <div class="equity-pkg-content">
    <!-- 左侧列表 -->
    <div class="left-panel">
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="输入代码、名称"
          prefix-icon="el-icon-search"
          size="small"
          clearable
          @input="handleSearch"
        />
      </div>
      <div class="list-wrapper">
        <div
          v-for="(item) in filteredList"
          :key="item.id"
          :class="['list-item', { 'is-selected': selectedItem.id === item.id }]"
          @click="handleSelectItem(item)"
        >
          <div class="list-item__content">
            <div class="list-item__name">{{ item.name }}</div>
            <div class="list-item__code">{{ item.code }}</div>
            <div class="list-item__count">可用次数 {{ item.usedCount }}/{{ item.totalCount }}</div>
          </div>
          <i v-if="selectedItem.id === item.id" class="el-icon-success selected-icon"></i>
        </div>
      </div>
    </div>

    <!-- 右侧详情 -->
    <div class="right-panel">
      <div v-if="selectedItem.id" class="detail-content">
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
          <el-button type="primary" size="small" @click="handleConfirm">核销使用</el-button>
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
      searchKeyword: '',
      selectedItem: {},
      // Mock 数据 - 套餐列表
      packageList: [
        {
          id: '1',
          name: '省心保养A套餐',
          code: '9AB1030301',
          usedCount: 10,
          totalCount: 20
        },
        {
          id: '2',
          name: '空气滤芯更换空气滤芯更换',
          code: 'ZHDH2549B',
          usedCount: 10,
          totalCount: 20
        },
        {
          id: '3',
          name: '权益套餐名称',
          code: 'ZHDH2549B',
          usedCount: 10,
          totalCount: 20
        },
        {
          id: '4',
          name: '权益套餐名称',
          code: 'ZHDH2549B',
          usedCount: 10,
          totalCount: 20
        },
        {
          id: '5',
          name: '权益套餐名称',
          code: 'ZHDH2549B',
          usedCount: 10,
          totalCount: 20
        },
        {
          id: '6',
          name: '权益套餐名称',
          code: 'ZHDH2549B',
          usedCount: 10,
          totalCount: 20
        }
      ],
      // Mock 数据 - 维修项目
      repairItemData: [
        {
          code: '999999',
          name: '万能工时',
          repairType: '一般维修',
          settlementType: '内部结算',
          warrantyType: '一般整车保修',
          workHours: '1.0'
        },
        {
          code: '9217839293',
          name: '更换风道上部',
          repairType: '保养',
          settlementType: '内部结算',
          warrantyType: '一般整车保修',
          workHours: '1.0'
        }
      ],
      // Mock 数据 - 维修零件
      repairPartData: [
        {
          code: '999999',
          name: '万能工时',
          repairType: '一般维修',
          settlementType: '内部结算',
          warrantyType: '一般整车保修',
          workHours: '1.0'
        },
        {
          code: '9217839293',
          name: '更换风道上部',
          repairType: '保养',
          settlementType: '内部结算',
          warrantyType: '一般整车保修',
          workHours: '1.0'
        }
      ]
    };
  },
  computed: {
    filteredList () {
      if (!this.searchKeyword) {
        return this.packageList;
      }
      const keyword = this.searchKeyword.toLowerCase();
      return this.packageList.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword)
      );
    }
  },
  methods: {
    initData () {
      this.selectedItem = {};
      this.searchKeyword = '';
    },
    handleSearch () {
      // 搜索逻辑已通过 computed 处理
    },
    handleSelectItem (item) {
      this.selectedItem = item;
      // TODO: 加载对应的维修项目和零件数据
    },
    // 确认操作
    async handleConfirm () {
      if (!this.selectedItem?.id) {
        this.$message.warning('请选择套餐');
        return;
      }
      // TODO: 调用核销接口
      this.$message.success('核销成功');
      this.$emit('refresh');
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
        color: $--leap-color-default-light-2;
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
