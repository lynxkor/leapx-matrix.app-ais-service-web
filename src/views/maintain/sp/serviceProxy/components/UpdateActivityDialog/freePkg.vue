<template>
  <div class="activity-pkg-content">
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
            v-for="item in packageList"
            :key="item.id"
            :class="['list-item', { 'is-selected': selectedPackage?.id === item.id }]"
            @click="handleSelectPackage(item)"
          >
            <div class="list-item__content">
              <div class="list-item__name">{{ item.repairItemName }}</div>
              <div class="list-item__code">{{ item.repairItemCode }}</div>
            </div>
            <i v-if="item.used" class="el-icon-success selected-icon"></i>
          </div>
        </template>
        <div v-else class="list-empty">
          <div class="empty-text">没有找到相关内容</div>
        </div>
      </div>
    </div>

    <!-- 右侧详情 -->
    <div class="right-panel">
      <div v-if="selectedPackage" class="detail-content">
        <!-- 活动标题 -->
        <div class="detail-header">项目明细</div>
        <div v-if="project" class="project-list">
          <div class="project-item">
            <div class="project-detail">
              <div class="info-row">
                <div class="info-item">
                  <span class="label">项目代码：</span>
                  <span class="value">{{ project.repairItemCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">项目名称：</span>
                  <span class="value">{{ project.repairItemName }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">维修类型：</span>
                  <span class="value">保养</span>
                </div>
                <div class="info-item">
                  <span class="label">结算类型：</span>
                  <span class="value">合同</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">保修类型：</span>
                  <span class="value">{{ project.policyType === '10' ? '免费保养': '终身保养' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">工时数量：</span>
                  <span class="value">{{ project.workhour }}</span>
                </div>
              </div>
              <!-- 维修零件表格 -->
              <div class="parts-section">
                <vxe-table
                  :data="project.partDetailList"
                  stripe
                  border="inner"
                  size="small"
                  min-height="0"
                  max-height="350px"
                >
                  <vxe-column field="partCode" title="零件代码" min-width="140" />
                  <vxe-column field="partName" title="零件名称" min-width="140" />
                  <vxe-column field="repairItemTypeName" title="维修类型" min-width="100">
                    <template #default>
                      保养
                    </template>
                  </vxe-column>
                  <vxe-column field="checkoutTypeName" title="结算类型" min-width="100">
                    <template #default>
                      合同
                    </template>
                  </vxe-column>
                  <vxe-column field="warrantyTypeName" title="保修类型" min-width="100">
                    <template #default>
                      {{ project.policyType === '10' ? '免费保养': '终身保养' }}
                    </template>
                  </vxe-column>
                  <vxe-column field="partQuantity" title="零件数" min-width="80" />
                </vxe-table>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="footer-bar">
          <el-popconfirm
            :title="!selectedPackage?.used ? '确定使用该免保项目？' : '确定取消使用该免保项目？'"
            @confirm="handleConfirm"
          >
            <el-button :type="!selectedPackage?.used ? 'primary' : 'plain'" size="small" slot="reference">{{ confirmBtnText }}</el-button>
          </el-popconfirm>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <span>请选择左侧免保项目查看详情</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getFpList, getFpDetail, useFp, cancel } from '@/api/maintain/sp/serviceProxy/special';

export default {
  name: 'FreePkg',
  props: {
    vehicleInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      searchKey: '',
      selectedPackage: null,
      packageList: [],
      project: null,
      loading: false,
      searchTimer: null
    };
  },
  computed: {
    confirmBtnText () {
      return this.selectedPackage?.used ? '取消选择' : '选择';
    }
  },
  methods: {
    handleSearch () {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(() => {
        this.loadPackageList();
      }, 300);
    },
    initData () {
      this.selectedPackage = null;
      this.project = null;
      this.loadPackageList();
    },
    // 获取免保列表
    async loadPackageList () {
      try {
        this.loading = true;
        const params = {
          id: this.vehicleInfo.id
        };
        if (this.searchKey) {
          params.searchKey = this.searchKey;
        }
        const res = await getFpList(params);
        this.packageList = (res || []).map(item => ({
          ...item,
          selected: item.used || false
        }));
        // 默认选中第一行
        if (this.packageList.length > 0) {
          this.handleSelectPackage(this.packageList[0]);
        } else {
          this.selectedPackage = null;
          this.project = null;
        }
      } catch (error) {
        console.error('获取免保列表失败', error);
        this.packageList = [];
      } finally {
        this.loading = false;
      }
    },
    handleSelectPackage (item) {
      this.selectedPackage = item;
      this.loadProjectDetail(item);
    },
    // 获取免保详情
    async loadProjectDetail (pkg) {
      if (!pkg?.id) return;
      try {
        const params = {
          packageId: pkg.id,
          id: this.vehicleInfo.id
        };
        const res = await getFpDetail(params);
        this.project = res;
      } catch (error) {
        console.error('获取免保详情失败', error);
        this.project = null;
      }
    },
    toggleProject (project) {
      project.expanded = !project.expanded;
    },
    // 确认操作
    async handleConfirm () {
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择免保项目');
        return;
      }
      let result = false;
      if (this.selectedPackage.used) {
        result = await this.cancelFreePackage();
      } else {
        result = await this.useFreePackage();
      }
      if (result) {
        this.$emit('refresh');
      }
    },
    // 取消免保
    async cancelFreePackage () {
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择免保项目');
        return false;
      }
      try {
        await cancel({
          packageId: this.selectedPackage.id,
          id: this.vehicleInfo.id
        });
        this.$message.success('取消成功');
        this.selectedPackage.used = false;
        this.$emit('refresh');
        return true;
      } catch (error) {
        console.error('取消免保失败', error);
        return false;
      }
    },
    // 使用免保
    async useFreePackage () {
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择免保项目');
        return false;
      }
      try {
        const params = {
          packageId: this.selectedPackage.id,
          id: this.vehicleInfo.id
        };
        await useFp(params);
        this.selectedPackage.used = true;
        this.$message.success('使用成功');
        this.$emit('refresh');
        return true;
      } catch (error) {
        console.error('使用免保失败', error);
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/libs/assets/styles/variables.scss';

.activity-pkg-content {
  flex: 1;
  display: flex;
  overflow: hidden;

  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
    text-align: left;
  }

  // 左侧面板
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
      }

      &__content {
        flex: 1;
        min-width: 0;
      }

      &__name {
        font-size: 14px;
        line-height: 22px;
        color: $--leap-color-default;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__code {
        font-size: 12px;
        line-height: 20px;
        color: $--leap-color-default;
      }

      .selected-icon {
        color: $--leap-color-success;
        font-size: 16px;
        margin-left: 8px;
        flex-shrink: 0;
      }
    }
  }

  // 右侧面板
  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #fff;

    .empty-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--leap-color-default-light-1);
      font-size: 14px;
    }

    .detail-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px;

      .detail-header {
        font-size: 16px;
        font-weight: 600;
        color: var(--leap-color-default);
        margin-bottom: 20px;
      }

      .project-list {
        flex: 1;
        overflow-y: auto;

        .project-item {
          margin-bottom: 16px;
          border-radius: 4px;
          overflow: hidden;

          .project-title {
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: background-color 0.3s;

            .expand-icon {
              font-size: 12px;
              color: var(--leap-color-default-light-1);
              margin-right: 8px;
              transition: transform 0.3s;
            }

            .project-name {
              font-size: 14px;
              font-weight: 500;
              color: var(--leap-color-default-dark-1);
              margin-right: 8px;
            }

            .project-code {
              font-size: 12px;
              color: var(--leap-color-default-light-1);
            }
          }

          &.expanded {
            .project-title {
              .expand-icon {
                transform: rotate(90deg);
              }
            }
          }

          .project-detail {
            background-color: #fff;

            .info-row {
              display: flex;
              margin-bottom: 12px;

              .info-item {
                display: flex;
                align-items: center;
                width: 50%;

                .label {
                  color: var(--leap-color-default-light-1);
                  font-size: 14px;
                }

                .value {
                  color: var(--leap-color-default-dark-1);
                  font-size: 14px;
                  font-weight: 500;
                }
              }

              &.remark-row {
                display: flex;
                align-items: flex-start;

                .label {
                  color: var(--leap-color-default-light-1);
                  font-size: 14px;
                  flex-shrink: 0;
                }

                .value {
                  color: var(--leap-color-default);
                  font-size: 14px;
                  line-height: 1.6;
                }
              }
            }

            .parts-section {
              margin-top: 16px;

              .section-title {
                font-size: 14px;
                font-weight: 500;
                color: var(--leap-color-default);
                margin-bottom: 12px;
              }
            }
          }
        }
      }

      .footer-bar {
        flex-shrink: 0;
        padding: 16px 0 12px;
        border-top: 1px solid var(--leap-color-default-light-4);
        text-align: right;
      }
    }
  }
}
</style>
