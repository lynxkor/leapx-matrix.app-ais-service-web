<template>
  <div class="maintain-pkg-content">
    <!-- 左侧列表 -->
    <div class="left-panel">
      <el-dropdown trigger="click" placement="bottom-start" @command="handleTypeChange">
        <span class="el-dropdown-link">
          {{ selectedTypeName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in packageTypeList"
            :key="item.code"
            :command="item.code"
          >
            {{ item.message }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
      <div class="list-wrapper" v-loading="listLoading">
        <template v-if="packageList.length > 0">
          <div
            v-for="item in packageList"
            :key="item.id"
            :class="['list-item', { 'is-selected': selectedPackage?.id === item.id, 'is-disabled': detailLoading }]"
            @click="handleSelectPackage(item)"
          >
            <div class="list-item__content">
              <div class="list-item__name">{{ item.interestsGoodsName }}</div>
              <div class="list-item__code">{{ item.interestsGoodsCode }}</div>
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
    <div class="right-panel" v-loading="detailLoading">
      <div v-if="selectedPackage" class="detail-content">
        <!-- 套餐标题 -->
        <div class="detail-header">商品明细</div>

        <!-- 项目列表 -->
        <div class="project-list" v-if="projectList.length">
          <div
            v-for="(project, index) in projectList"
            :key="index"
            class="project-item"
            :class="{ expanded: project.expanded }"
          >
            <!-- 项目标题行 -->
            <div class="project-title" @click="toggleProject(project)">
              <i class="el-icon-arrow-right expand-icon"></i>
              <span class="project-name">{{ project.repairItemName }}</span>
              <span class="project-code">{{ project.repairItemCode }}</span>
            </div>

            <!-- 项目详情 -->
            <div v-show="project.expanded" class="project-detail">
              <div class="info-row">
                <div class="info-item">
                  <span class="label">维修类型：</span>
                  <span class="value">{{ project.repairItemTypeName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">结算类型：</span>
                  <span class="value">{{ project.checkoutTypeName }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
									<span class="label">工时单价：</span>
									<span class="value">{{ project.unitPrice }}</span>
                </div>
                <div class="info-item">
									<span class="label">工时数：</span>
									<span class="value">{{ project.workingHours }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">优惠金额：</span>
                  <span class="value">{{ project.discountAmount }}</span>
                </div>
                <div class="info-item">
                  <span class="label">项目金额：</span>
                  <span class="value">{{ project.receivableAmount }}</span>
                </div>
              </div>
              <div class="info-row remark-row">
                <span class="label">索赔金额：</span>
                <span class="value">{{ project.claimPrice }}</span>
              </div>

              <!-- 维修零件表格 -->
              <div class="parts-section">
                <div class="section-title">维修零件</div>
                <vxe-table
                  :data="project.ownersEquityOrderPartsList"
                  stripe
                  resizable
                  border="inner"
                  size="small"
                  min-height="0"
                  max-height="3000px"
                  show-overflow
                >
									<vxe-column field="partsName" title="零件名称" min-width="200" />
                  <vxe-column field="partsCode" title="零件代码" min-width="140" />
                  <vxe-column field="repairItemTypeName" title="维修类型" min-width="100" />
                  <vxe-column field="checkoutTypeName" title="结算类型" min-width="100" />
                  <vxe-column field="totalAmount" title="数量" min-width="100" />
                  <vxe-column field="unitPrice" title="单价" min-width="100" />
                  <vxe-column field="discountAmount" title="优惠金额" min-width="100" />
                  <vxe-column field="receivableAmount" title="零件金额" min-width="100" />
                  <vxe-column field="claimPrice" title="索赔金额" min-width="100" />
                </vxe-table>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <span>暂无数据</span>
        </div>

        <!-- 底部操作栏 -->
        <div class="footer-bar">
          <el-popconfirm
            :title="selectedPackage?.used ? '确定取消使用该商城订单？' : '确定选择使用该商城订单？'"
            @confirm="handleConfirm"
          >
            <el-button :disabled="projectList.length === 0" :type="selectedPackage?.used ? 'plain' : 'primary'" size="small" slot="reference" :loading="submitLoading">{{ confirmBtnText }}</el-button>
          </el-popconfirm>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <span>请选择左侧商城订单查看详情</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getEoList, getEoListType, getEoDetail, useEo, cancel, getEnum } from '@/api/maintain/sp/serviceProxy/special';

export default {
  name: 'MaintainPkg',
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
      packageTypeList: [],
      selectedType: '',
      projectList: [],
      listLoading: false,
      detailLoading: false,
      submitLoading: false,
      searchTimer: null
    };
  },
  computed: {
    selectedTypeName () {
      if (!this.selectedType) {
        return '全部订单';
      }
      const type = this.packageTypeList.find(item => item.code === this.selectedType);
      return type?.message || '全部订单';
    },
    confirmBtnText () {
      return this.selectedPackage?.used ? '取消选择' : '核销使用';
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
    // 选择套餐类型
    handleTypeChange (typeId) {
      this.selectedType = typeId;
      this.loadPackageList();
    },
    initData () {
      this.selectedPackage = null;
      this.projectList = [];
      this.loadPackageType();
      this.loadPackageList();
    },
    // 获取套餐类型
    async loadPackageType () {
      try {
        const res = await getEnum('InterestsTypeEnum');
        this.packageTypeList = [{
          code: '',
          message: '全部订单'
        }].concat(res || []);
      } catch (error) {
        console.error('获取套餐类型失败', error);
      }
    },
    // 获取套餐列表
    async loadPackageList () {
      try {
        this.listLoading = true;
        const params = {
          id: this.vehicleInfo.id
        };
        if (this.selectedType) {
          params.typeId = this.selectedType;
        }
        if (this.searchKey) {
          params.searchKey = this.searchKey;
        }
        const res = await getEoList(params);
        this.packageList = (res || []).map(item => ({
          ...item,
          selected: item.selected || false
        }));
        // 默认选中第一行
        if (this.packageList.length > 0) {
          this.handleSelectPackage(this.packageList[0]);
        } else {
          this.selectedPackage = null;
          this.projectList = [];
        }
      } catch (error) {
        console.error('获取套餐列表失败', error);
        this.packageList = [];
      } finally {
        this.listLoading = false;
      }
    },
    handleSelectPackage (item) {
      if (this.detailLoading) return;
      this.selectedPackage = item;
      this.loadProjectDetail(item);
    },
    // 获取套餐详情
    async loadProjectDetail (pkg) {
      if (!pkg?.id) return;
      try {
        this.detailLoading = true;
        const params = {
          packageId: pkg.id,
          id: this.vehicleInfo.id
        };
        const res = await getEoDetail(params);
        this.projectList = res?.ownersEquityOrderItemList?.map(item => ({
          ...item,
          expanded: true,
        })) || [];
      } catch (error) {
        console.error('获取套餐详情失败', error);
        this.projectList = [];
      } finally {
        this.detailLoading = false;
      }
    },
    toggleProject (project) {
      project.expanded = !project.expanded;
    },
    // 确认操作
    async handleConfirm () {
      if (this.submitLoading) return;
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择套餐');
        return;
      }
      this.submitLoading = true;
      try {
        let result = false;
        if (this.selectedPackage.used) {
          result = await this.cancelPackage();
        } else {
          result = await this.usePackage();
        }
        if (result) {
          this.$emit('refresh');
        }
      } finally {
        this.submitLoading = false;
      }
    },
    // 取消套餐
    async cancelPackage () {
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择套餐');
        return;
      }
      try {
        await cancel({
          packageId: this.selectedPackage.id,
          id: this.vehicleInfo.id
        });
        this.$message.success('取消成功');
        this.selectedPackage.used = false;
        return true;
      } catch (error) {
        console.error('取消套餐失败', error);
        return false;
      }
    },
    // 使用套餐
    async usePackage () {
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择套餐');
        return false;
      }
      try {
        const params = {
          packageId: this.selectedPackage.id,
          id: this.vehicleInfo.id,
        };
        await useEo(params);
        this.selectedPackage.used = true;
        this.$message.success('使用成功');
        return true;
      } catch (error) {
        console.error('使用套餐失败', error);
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/libs/assets/styles/variables.scss';

.maintain-pkg-content {
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
    .el-dropdown {
      padding: 12px 12px 0 12px;
    }
    .search-box {
      padding: 12px;
    }

    .list-wrapper {
      flex: 1;
      overflow-y: auto;
      padding: 0 12px;

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
      padding: 16px 16px 0 16px;

      .detail-header {
        font-size: 16px;
        font-weight: 600;
        color: var(--leap-color-default);
        padding-bottom: 12px;
      }

      .project-list {
        flex: 1;
        overflow-y: auto;
        .project-item {
          margin-bottom: 16px;
          // border: 1px solid var(--leap-color-default-light-4);
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
            padding: 16px;
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
        padding: 16px 20px;
        margin: 0 -20px;
        border-top: 1px solid var(--leap-color-default-light-4);
        text-align: right;
      }
    }
  }
}
</style>
