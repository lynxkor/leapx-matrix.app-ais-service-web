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
            :key="item.id"
            :command="item.id"
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
      <div class="list-wrapper">
         <div
          v-for="item in packageList"
          :key="item.id"
          :class="['list-item', { 'is-selected': selectedPackage?.id === item.id }]"
          @click="handleSelectPackage(item)"
        >
          <div class="list-item__content">
            <div class="list-item__name">{{ item.schemeName }}</div>
            <div class="list-item__code">{{ item.description }}</div>
          </div>
          <i v-if="item.used" class="el-icon-success selected-icon"></i>
        </div>
      </div>
    </div>

    <!-- 右侧详情 -->
    <div class="right-panel">
      <div v-if="selectedPackage" class="detail-content" v-loading="loading">
        <!-- 套餐标题 -->
        <div class="detail-header">{{ selectedPackage.schemeName }}</div>

        <!-- 项目列表 -->
        <div class="project-list">
          <div
            v-for="(project, index) in projectList"
            :key="index"
            class="project-item"
            :class="{ expanded: project.expanded }"
          >
            <!-- 项目标题行 -->
            <!-- <div class="project-title" @click="toggleProject(project)">
              <i class="el-icon-arrow-right expand-icon"></i>
              <span class="project-name">{{ project.activityResponse?.activityName }}</span>
              <span class="project-code">{{ project.activityResponse?.activityCode }}</span>
            </div> -->

            <!-- 项目详情 -->
            <div v-show="project.expanded" class="project-detail">
              <h3>基础信息</h3>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">主因零部件：</span>
                  <span class="value">{{ project.mainPartName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">主因供应商：</span>
                  <span class="value">{{ project.mainSupplierName }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">VRT名称：</span>
                  <span class="value">{{ project.vrtName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">VFG名称：</span>
                  <span class="value">{{ project.vfgName }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">是否允许修改旧件：</span>
                  <span class="value">{{ project.allowModifyOldPart === 1 ? '是': '否' }}</span>
                </div>
              </div>
              <div class="info-row remark-row">
                <span class="label">方案说明：</span>
                <span class="value">{{ project.description }}</span>
              </div>

              <!-- 维修零件表格 -->
              <div class="parts-section">
                <h3>项目零件</h3>
                <div class="parts-tabs">
                  <div :class="{'parts-tabs-item': true, 'active': item.id === curPartTab}" v-for="item in partsList" :key="item.id" @click="handleTabClick(item)">{{ item.repairItemName }}123</div>
                </div>
                <div class="info-row">
                  <div class="info-item">
                    <span class="label">维修类型：</span>
                    <span class="value">{{ curItemList?.repairItemTypeName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">结算类型：</span>
                    <span class="value">{{ response?.activityResponse?.checkoutTypeName }}</span>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-item">
                    <span class="label">保修类型：</span>
                    <span class="value">{{ response?.activityResponse?.repairItemTypeName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">主因工时：</span>
                    <span class="value">{{ curItemList?.amount }}</span>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-item">
                    <span class="label">工时数：</span>
                    <span class="value">{{ curItemList?.workHour }}</span>
                  </div>
                   <div class="info-item">
                    <span class="label">索赔价：</span>
                    <span class="value">{{ curItemList?.quantity }}</span>
                  </div>
                </div>
                <div class="section-title">维修零件</div>
                <vxe-table
                  ref="partsTableRef"
                  :data="partRespList"
                  stripe
                  border="inner"
                  size="small"
                  min-height="0"
                  max-height="200px"
                  :checkbox-config="{ checkMethod: checkMainPartMethod }"
                >
                  <vxe-column type="checkbox" width="50" align="center"/>
                  <vxe-column field="partName" title="零件名称" min-width="140" />
                  <vxe-column field="partCode" title="零件代码" min-width="140" />
                  <vxe-column field="quantity" title="数量" min-width="100" />
                  <vxe-column field="allowDelete" title="是否允许删除" min-width="100" >
                    <template v-slot="{ row }">
                      {{ row.allowDelete == '1' ? '是' : '否' }}
                    </template>
                  </vxe-column>
                  <vxe-column field="mainPart" title="是否主因件" min-width="100"  >
                    <template v-slot="{ row }">
                      {{ row.mainPart == '1' ? '是' : '否' }}
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="footer-bar">
          <el-popconfirm
            :title="popconfirmText"
            @confirm="handleConfirm"
          >
            <el-button :type="response?.activityUsed ? 'plain' : 'primary'" size="small" slot="reference">{{ confirmBtnText }}</el-button>
          </el-popconfirm>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <span>请选择左侧套餐查看详情</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getActivityList, getActivityListType, getActivityDetail, useActivity, cancel } from '@/api/maintain/sp/serviceProxy/special';
import { getEnum } from '@/api/common';

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
      selectedPackage: {},
      projectList: [],
      packageList: [],
      packageTypeList: [],
      selectedType: '',
      loading: false,
      searchTimer: null,
      curPartTab: '',
      curItemList: {},
      response: {},
    };
  },
  computed: {
    selectedTypeName () {
      if (!this.selectedType) {
        return '全部活动';
      }
      const type = this.packageTypeList.find(item => item.id === this.selectedType);
      return type?.message || '全部活动';
    },
    confirmBtnText () {
      return this.response?.activityUsed ? '取消使用方案' : '使用方案';
    },
    partRespList () {
      const res = (this.response?.partResponseList || []).filter(item => item.serviceActivityItemId === this.curPartTab);
      return res;
    },
    popconfirmText () {
      if (this.selectedPackage?.used) {
        if (this.response?.activityUsed) {
          return '确定取消选择使用该方案？';
        } else {
          return '该车辆已使用其他方案，是否确认要替换为本方案';
        }
      } else {
        return '确定选择使用该方案？';
      }
    },
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
      this.loadPackageList();
      this.getActivityListType();
    },
    getActivityListType () {
      getEnum('claim_activity_type').then(res => {
        this.packageTypeList = [{
          id: '',
          message: '全部活动'
        }].concat(res || []);
      });
    },
    // 获取套餐列表
    async loadPackageList () {
      try {
        const params = {
          id: this.vehicleInfo.id
        };
        if (this.selectedType) {
          params.activityType = this.selectedType;
        }
        if (this.searchKey) {
          params.searchKey = this.searchKey;
        }
        const res = await getActivityList(params);
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
      }
    },
    handleSelectPackage (item) {
      if (this.loading) return;
      this.selectedPackage = item;
      this.loadProjectDetail(item);
    },
    // 获取套餐详情
    async loadProjectDetail (pkg) {
      if (!pkg?.id) return;
      try {
        this.loading = true;
        const params = {
          packageId: pkg.id,
          id: this.vehicleInfo.id,
          activityId: pkg.activityId
        };
        const res = await getActivityDetail(params);
        this.response = res || {};
        this.projectList = ([res] || [])?.map(item => ({
          ...item,
          expanded: true
        }));
        this.partsList = res.itemResponseList || [];
        if (this.partsList.length > 0) {
          this.curPartTab = this.partsList[0].id;
          this.curItemList = this.partsList[0];
        }
        // 数据加载完成后设置主因件勾选
        setTimeout(() => {
          this.setCheckedMainParts();
        }, 300);
      } catch (error) {
        console.error('获取套餐详情失败', error);
        this.projectList = [];
      } finally {
        this.loading = false;
      }
    },
    toggleProject (project) {
      project.expanded = !project.expanded;
    },
    // 确认操作
    async handleConfirm () {
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择套餐');
        return;
      }
      let result = false;
      if (this.response.activityUsed) {
        result = await this.cancelPackage();
      } else {
        result = await this.usePackage();
      }
      if (result) {
        this.$emit('refresh');
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
          packageType: 50,
          packageId: this.selectedPackage.activityId + '#' + this.selectedPackage.id,
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
      const tableRef = Array.isArray(this.$refs.partsTableRef)
        ? this.$refs.partsTableRef[0]
        : this.$refs.partsTableRef;
      const selectedParts = tableRef.getCheckboxRecords();
      // 对 itemList 进行字段映射
      const activityRes = this.response?.activityResponse || {};
      const itemList = (this.response.itemResponseList || []).map(item => ({
        serviceProxyId: this.vehicleInfo.id,
        repairItemId: item.id,
        repairItemCode: item.repairItemCode,
        repairItemName: item.repairItemName,
        repairItemTypeId: item.repairItemTypeId,
        repairItemTypeName: item.repairItemTypeName,
        checkoutTypeId: activityRes.checkoutTypeId,
        checkoutTypeName: activityRes.checkoutTypeName,
        warrantyTypeId: activityRes.repairItemTypeId,
        warrantyTypeName: activityRes.repairItemTypeName,
        workHour: item.workHour || 1,
        isAddItems: 0,
        discountAmount: item.discountAmount,
        packageType: 50,
        packageId: this.selectedPackage.activityId + '#' + this.selectedPackage.id,
        packageCode: activityRes.activityCode,
        packageName: activityRes.activityName,
        price: item.amount
      }));
      // 构建 serviceActivityItemId -> repairItem 的映射
      const itemMap = {};
      (this.response.itemResponseList || []).forEach(item => {
        itemMap[item.id] = item;
      });
      // 对 partsList 进行字段映射
      const partsList = selectedParts.map(part => {
        const repairItem = itemMap[part.serviceActivityItemId] || {};
        return {
          serviceProxyId: this.vehicleInfo.id,
          partsId: part.partId,
          partsCode: part.partCode,
          partsName: part.partName,
          isOutstock: 0,
          planPickNumber: part.quantity,
          actualPickNumber: 0,
          refundedNumber: 0,
          repairItemTypeId: part.repairItemTypeId,
          repairItemTypeName: part.repairItemTypeName,
          checkoutTypeId: activityRes.checkoutTypeId,
          checkoutTypeName: activityRes.checkoutTypeName,
          warrantyTypeId: activityRes.repairItemTypeId,
          warrantyTypeName: activityRes.repairItemTypeName,
          isOemPart: 0,
          quantity: part.quantity,
          discountAmount: part.discountAmount,
          spRepairItemId: part.serviceActivityItemId,
          isBindItem: 0,
          repairItemId: part.serviceActivityItemId,
          repairItemCode: repairItem.repairItemCode || '',
          repairItemName: repairItem.repairItemName || '',
          packageType: 50,
          packageId: this.selectedPackage.activityId + '#' + this.selectedPackage.id,
          packageCode: activityRes.activityCode,
          packageName: activityRes.activityName,
        };
      });
      try {
        const params = {
          packageId: this.selectedPackage.id,
          id: this.vehicleInfo.id,
          activityId: this.selectedPackage.activityId,
          itemList: itemList,
          partsList: partsList
        };
        await useActivity(params);
        this.selectedPackage.used = true;
        this.$message.success('使用成功');
        return true;
      } catch (error) {
        console.error('使用套餐失败', error);
        return false;
      }
    },
    handleTabClick (item) {
      this.curPartTab = item.id;
      this.curItemList = item;
    },
    // 主因件强制勾选，禁止取消
    checkMainPartMethod ({ row }) {
      // 主因件禁止取消勾选（checkbox 不可操作）
      return row.mainPart !== '1';
    },
    // 设置主因件为勾选状态
    setCheckedMainParts () {
      // 由于表格在 v-for 循环内，ref 会是数组形式
      const tableRef = Array.isArray(this.$refs.partsTableRef)
        ? this.$refs.partsTableRef[0]
        : this.$refs.partsTableRef;
      if (!tableRef) return;
      // 找出所有主因件并勾选
      const mainPartRows = this.partRespList.filter(row => row.mainPart === '1');
      if (mainPartRows.length > 0) {
        tableRef.setCheckboxRow(mainPartRows, true);
      }
    },
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
  ::v-deep .vxe-table--render-default .vxe-cell--checkbox.is--checked .vxe-checkbox--icon {
    color: var(--leap-color-primary)!important;
  }

  // 左侧面板
  .left-panel {
    width: 204px;
    border-right: 1px solid $--leap-color-default-light-4;
    display: flex;
    flex-direction: column;
    .el-dropdown {
      padding: 12px 12px 0 12px;
      cursor: pointer;
    }
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
        color: var(--leap-color-default-dark-1);
        padding-bottom: 12px;
      }

      h3 {
        font-size: 14px;
        color: var(--leap-color-default-dark-1);
        font-weight: 500;
        margin-bottom: 10px;
      }

      .project-list {
        flex: 1;
        overflow-y: auto;
        max-height: 600px;
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
                color: var(--leap-color-default-light-1);
                margin-bottom: 12px;
              }
            }
          }
        }
      }
      .parts-tabs {
        &-item {
          border: 1px solid #E6E6E5;
          display: inline-block;
          margin: 0 8px 8px 0;
          padding: 3px 10px;
          border-radius: 4px;
          cursor: pointer;
          &.active {
            border: 1px solid var(--leap-color-primary);
            color: var(--leap-color-primary);
          }
        }
      }

      .footer-bar {
        padding: 16px 0 0;
        border-top: 1px solid var(--leap-color-default-light-4);
        text-align: right;
      }
    }
  }
}
</style>
