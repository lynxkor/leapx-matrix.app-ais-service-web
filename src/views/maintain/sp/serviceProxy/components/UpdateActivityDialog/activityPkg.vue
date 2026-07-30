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
            :command="item.code"
          >
            {{ item.message }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="search-box">
        <el-input
          v-model="searchKey"
          placeholder="输入名称"
          prefix-icon="el-icon-search"
          size="small"
          clearable
          @input="handleSearch"
        />
      </div>
      <div class="list-wrapper">
        <template v-if="packageList.length">
          <div
            v-for="item in packageList"
            :key="item.id"
            :class="['list-item', { 'is-selected': selectedPackage?.id === item.id, 'is-disabled': item.activityUsed }]"
            @click="handleSelectPackage(item)"
          >
            <div class="list-item__content">
              <div class="list-item__name">{{ item.activityName }}</div>
              <div class="list-item__code">{{ item.schemeName }}</div>
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
      <div v-if="selectedPackage" class="detail-content" v-loading="loading">
        <!-- 套餐标题 -->
        <div class="detail-header">{{ selectedPackage.activityName }}</div>

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
                  <div :class="{'parts-tabs-item': true, 'active': item.id === curPartTab, 'is-disabled': item.allowDelete === 0}" v-for="item in itemList" :key="item.id" @click="handleTabClick(item)">
                    <el-checkbox
                      :value="item.checked"
                      @click.native.prevent="handleItemCheckboxClick(item)"
                      @change="handleItemCheckboxChange(item)"
                    >
                      {{ item.repairItemName }}({{ item.repairItemCode }})
                    </el-checkbox>
                  </div>
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
                    <span class="value">{{ curItemList?.isMainRepairItem === '1' ? '是': '否' }}</span>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-item">
                    <span class="label">工时数：</span>
                    <span class="value">{{ curItemList?.quantity }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">工时单价：</span>
                    <span class="value">{{ curItemList?.unitPrice }}</span>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-item">
                    <span class="label">优惠金额：</span>
                    <span class="value">{{ curItemList?.discountAmount }}</span>
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
                  @checkbox-change="handlePartCheckboxChange"
                  @checkbox-all="handlePartCheckboxAll"
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
            <el-button :type="selectedPackage?.used && !hasNewPart ? 'plain' : 'primary'" size="small" slot="reference" :disabled="selectedPackage.activityUsed" :loading="submitLoading">{{ confirmBtnText }}</el-button>
          </el-popconfirm>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <span>请选择左侧活动查看详情</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getActivityList, getActivityListType, getActivityDetail, useActivity, cancel } from '@/api/maintain/sp/serviceProxy/special';
import { getEnum } from '@/api/common';
import { PackageTypeEnum, ActivityTypeEnum } from '../../constant';

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
      submitLoading: false,
      searchTimer: null,
      curPartTab: '',
      curItemList: {},
      response: {},
      hasNewPart: false,
      itemList: []
    };
  },
  computed: {
    selectedTypeName () {
      if (!this.selectedType) {
        return '全部活动';
      }
      const type = this.packageTypeList.find(item => item.code === this.selectedType);
      return type?.message || '全部活动';
    },
    confirmBtnText () {
      if (this.hasNewPart) {
        return '使用方案';
      }
      return this.selectedPackage?.used ? '取消使用方案' : '使用方案';
    },
    partRespList () {
      const res = (this.response?.partResponseList || []).filter(item => item.serviceActivityItemId === this.curPartTab);
      return res;
    },
    popconfirmText () {
      if (this.response?.activityUsed) {
        if (this.selectedPackage?.used) {
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
    handlePartCheckboxChange ({ checked, row }) {
      row.checked = checked;
      const el = this.partRespList.some(item => item.checked);
      this.curItemList.checked = this.curItemList.allowDelete === 0 || !!el;
      this.hasNewPart = this.response.partResponseList.some(item => {
        return (item.checked && item.allowDelete === 1 && !item.used) || (item.used && !item.checked);
      });
    },
    handlePartCheckboxAll ({ checked, records }) {
      this.partRespList.forEach(row => {
        row.checked = checked;
      });
      this.curItemList.checked = this.curItemList.allowDelete === 0 || checked;
      this.hasNewPart = this.response.partResponseList.some(item => {
        return (item.checked && item.allowDelete === 1 && !item.used) || (item.used && !item.checked);
      });
    },
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
      this.hasNewPart = false;
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
      this.hasNewPart = false;
      this.selectedPackage = item;
      this.loadProjectDetail(item);
      if (item.activityUsed) {
        this.$message.warning(`该活动已被${item.actualDealerName ? item.actualDealerName : ''}使用，您不可重复使用`);
      }
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
        this.itemList = (res.itemResponseList || []).map(item => ({
          ...item,
          checked: item.allowDelete === 0 || item.used || false
        }));
        if (this.itemList.length > 0) {
          this.curPartTab = this.itemList[0].id;
          this.curItemList = this.itemList[0];
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
      if (this.submitLoading) return;
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择套餐');
        return;
      }
      this.submitLoading = true;
      try {
        let result = false;
        if (this.selectedPackage?.used && !this.hasNewPart) {
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
          packageType: 50,
          packageId: this.selectedPackage.activityId + '#' + this.selectedPackage.id,
          id: this.vehicleInfo.id
        });
        this.$message.success('取消成功');
        return true;
      } catch (error) {
        console.error('取消套餐失败', error);
        return false;
      }
    },
    checkItemCanAdd (item) {
      // 如果是维修项目对象
      if (item.repairItemCode) {
        return !item.used || item.allowDelete === 0 || item.checked;
      }
      // 如果是零件对象
      if (item.used) {
        return false;
      } else {
        return item.allowDelete === 0 || item.checked;
      }
    },
    // 使用套餐
    async usePackage () {
      if (!this.selectedPackage?.id) {
        this.$message.warning('请选择套餐');
        return false;
      }
      // 对 itemList 进行字段映射，只获取被勾选的维修项目
      const activityRes = this.response?.activityResponse || {};
      const itemList = (this.itemList || []).filter(item => item.checked && !item.used).map(item => ({
        serviceProxyId: this.vehicleInfo.id,
        repairItemId: item.repairItemId,
        repairItemCode: item.repairItemCode,
        repairItemName: item.repairItemName,
        repairItemTypeId: item.repairItemTypeId,
        repairItemTypeName: item.repairItemTypeName,
        checkoutTypeId: activityRes.checkoutTypeId,
        checkoutTypeName: activityRes.checkoutTypeName,
        warrantyTypeId: activityRes.repairItemTypeId,
        warrantyTypeName: activityRes.repairItemTypeName,
        workHour: item.quantity || 1,
        isAddItems: this.vehicleInfo.isAddItems,
        discountAmount: item.discountAmount || 0,
        packageType: String(activityRes.activityType) === ActivityTypeEnum.SERVICE_CARE ? PackageTypeEnum.CARE_ACTIVITY : PackageTypeEnum.TECH_ACTIVITY,
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
      // 对 partsList 进行字段映射，只提交被勾选的维修项目相关的零件
      const checkedItemIds = (this.itemList || [])
        .filter(item => item.checked)
        .map(item => item.id);

      const partsList = (this.response?.partResponseList || [])
        .filter(item => checkedItemIds.includes(item.serviceActivityItemId) && this.checkItemCanAdd(item))
        .map(part => {
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
            isOemPart: part.isOemPart || part.oemPart || 0,
            quantity: part.quantity,
            discountAmount: part.discountAmount || 0,
            spRepairItemId: part.serviceActivityItemId,
            isBindItem: 0,
            repairItemId: part.serviceActivityItemId,
            repairItemCode: repairItem.repairItemCode || '',
            repairItemName: repairItem.repairItemName || '',
            packageType: String(activityRes.activityType) === ActivityTypeEnum.SERVICE_CARE ? PackageTypeEnum.CARE_ACTIVITY : PackageTypeEnum.TECH_ACTIVITY,
            packageId: this.selectedPackage.activityId + '#' + this.selectedPackage.id,
            packageCode: activityRes.activityCode,
            packageName: activityRes.activityName,
          };
        });

      // 如果未勾选项目和配件，提示不允许保存
      if (itemList.length === 0 && partsList.length === 0) {
        this.$message.warning('请选择项目和零件');
        return false;
      }
      try {
        const params = {
          packageId: this.selectedPackage.id,
          id: this.vehicleInfo.id,
          activityId: this.selectedPackage.activityId,
          itemList: itemList,
          partsList: partsList
        };
        await useActivity(params);
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
      setTimeout(() => {
        this.setCheckedMainParts();
      }, 300);
    },
    // 处理维修项目checkbox点击
    handleItemCheckboxClick (item) {
      if (item.allowDelete === 0) {
        return false;
      } else {
        item.checked = !item.checked;
      }
    },
    // 处理维修项目checkbox变化
    handleItemCheckboxChange (item) {
      // console.log('handleItemCheckboxChange', item);
      // if (item.allowDelete === 0) {
      //   item.checked = true;
      //   return;
      // }
      // item.checked = !item.checked;
      // // 更新该项目下所有零件的选中状态
      // const relatedParts = this.response.partResponseList.filter(part => part.serviceActivityItemId === item.id);
      // relatedParts.forEach(part => {
      //   part.checked = item.checked;
      // });
      // // 刷新表格选中状态
      // setTimeout(() => {
      //   this.setCheckedMainParts();
      // }, 100);
      // this.hasNewPart = this.response.partResponseList.some(part => part.checked && part.allowDelete === '1');
    },
    // 主因件强制勾选，禁止取消
    checkMainPartMethod ({ row }) {
      return row.allowDelete !== 0;
    },
    // 设置主因件为勾选状态
    setCheckedMainParts () {
      // 由于表格在 v-for 循环内，ref 会是数组形式
      const tableRef = Array.isArray(this.$refs.partsTableRef)
        ? this.$refs.partsTableRef[0]
        : this.$refs.partsTableRef;
      if (!tableRef) return;
      // 找出所有不允许删除的项目并勾选
      const mainPartRows = this.partRespList.filter(row => row.allowDelete === 0 || row.used || row.checked);
      if (mainPartRows.length > 0) {
        tableRef.setCheckboxRow(mainPartRows, true);
      }
      // 同步维修项目的选中状态
      this.partRespList.forEach(part => {
        if (part.checked && part.allowDelete === 1) {
          const repairItem = this.itemList.find(item => item.id === part.serviceActivityItemId);
          if (repairItem && !repairItem.checked) {
            repairItem.checked = true;
          }
        }
      });
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
      &.is-disabled {
        background-color: $--leap-color-default-light-4;
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
          &.is-disabled {
            // cursor: not-allowed;
            background-color: var(--leap-color-default-light-5);
            ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
              background-color: var(--leap-color-default-light-3);
              border-color: var(--leap-color-default-light-3);
            }
            ::v-deep .el-checkbox__input.is-disabled + .el-checkbox__label {
              color: var(--leap-color-default-light-1);
            }
          }
          ::v-deep .el-checkbox {
            margin: 0;
          }
          ::v-deep .el-checkbox__label {
            padding-left: 8px;
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
