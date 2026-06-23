<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="商城订单号：" prop="mallOrderNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderNumber"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="权益商品类型：" prop="goodInterestsType">
                  <el-input
                    placeholder="请输入"
                    v-model="form.goodInterestsTypeLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="权益商品代码：" prop="interestsGoodsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interestsGoodsCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="权益商品名称：" prop="interestsGoodsName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interestsGoodsName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderStatusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <el-input
                    placeholder="请输入"
                    v-model="form.statusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="服务门店：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  <LPEncrypted
                    :value.sync="form.vehProfileVin"
                    :decryptMethod="() => getDecryptField(form.id, 'vehProfileVin')"
                  >
                    <template v-if="form.vehProfileId">
                      <el-link type="primary" :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${form.vehProfileId}`" target="_blank">{{ form.vehProfileVin }}</el-link>
                    </template>
                    <el-input
                      v-else
                      placeholder="请输入"
                      v-model="form.vehProfileVin"
                      clearable
                      disabled
                    />
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="购买人：" prop="purchaser">
                  <LPEncrypted
                    :value.sync="form.purchaser"
                    :decryptMethod="() => getDecryptField(form.id, 'purchaser')"
                  >
                    <span>{{ form.purchaser || '-' }}</span>
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="购买人电话：" prop="purchaserPhone">
                  <LPEncrypted
                    :value.sync="form.purchaserPhone"
                    :decryptMethod="() => getDecryptField(form.id, 'purchaserPhone')"
                  >
                    <span>{{ form.purchaserPhone || '-' }}</span>
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="购买日期：" prop="saleDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDate"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="推荐码：" prop="referralCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.referralCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="有效截止时间：" prop="validUntil">
                  <el-input
                    placeholder="请输入"
                    v-model="form.validUntil"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompanies">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsCompanies"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSourceLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="施工单号：" prop="serviceProxyCode">
                  <el-link type="primary" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.serviceProxyId}`" target="_blank" v-if="form.serviceProxyId">{{ form.serviceProxyCode }}</el-link>
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyCode"
                    clearable
                    disabled
                    v-else
                  />
                </el-form-item>
                <el-form-item label="核销时间：" prop="writeOffDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.writeOffDate"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="退订日期：" prop="unsubscribeDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.unsubscribeDate"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="商城订单号：" prop="mallOrderNumber">
                  {{ form.mallOrderNumber }}
                </el-form-item>
                <el-form-item label="权益商品类型：" prop="goodInterestsType">
                  {{ form.goodInterestsTypeLabel }}
                </el-form-item>
                <el-form-item label="权益商品代码：" prop="interestsGoodsCode">
                  {{ form.interestsGoodsCode }}
                </el-form-item>
                <el-form-item label="权益商品名称：" prop="interestsGoodsName">
                  {{ form.interestsGoodsName }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="服务门店：" prop="dealerCode">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  <LPEncrypted
                    :value.sync="form.vehProfileVin"
                    :decryptMethod="() => getDecryptField(form.id, 'vehProfileVin')"
                  >
                    <template v-if="form.vehProfileId">
                      <el-link type="primary" :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${form.vehProfileId}`" target="_blank">{{ form.vehProfileVin }}</el-link>
                    </template>
                    <span v-else>{{ form.vehProfileVin || '-' }}</span>
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="购买人：" prop="purchaser">
                  <LPEncrypted
                    :value.sync="form.purchaser"
                    :decryptMethod="() => getDecryptField(form.id, 'purchaser')"
                  >
                    <span>{{ form.purchaser || '-' }}</span>
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="购买人电话：" prop="purchaserPhone">
                  <LPEncrypted
                    :value.sync="form.purchaserPhone"
                    :decryptMethod="() => getDecryptField(form.id, 'purchaserPhone')"
                  >
                    <span>{{ form.purchaserPhone || '-' }}</span>
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="购买日期：" prop="saleDate">
                  {{ form.saleDate }}
                </el-form-item>
                <el-form-item label="推荐码：" prop="referralCode">
                  {{ form.referralCode }}
                </el-form-item>
                <el-form-item label="有效截止时间：" prop="validUntil">
                  {{ form.validUntil }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompanies">
                  {{ form.logisticsCompanies }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrder">
                  {{ form.logisticsOrder }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSourceLabel }}
                </el-form-item>
                <el-form-item label="施工单号：" prop="serviceProxyCode">
                  <el-link type="primary" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.serviceProxyId}`" target="_blank" v-if="form.serviceProxyId">{{ form.serviceProxyCode }}</el-link>
                  <span v-else>{{ form.serviceProxyCode }}</span>
                </el-form-item>
                <el-form-item label="核销时间：" prop="writeOffDate">
                  {{ form.writeOffDate }}
                </el-form-item>
                <el-form-item label="退订日期：" prop="unsubscribeDate">
                  {{ form.unsubscribeDate }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>商品明细</h2>
            </div>
            <div class="common-section-body">
              <!-- 合计金额显示 -->
              <div class="claim-summary">
                <span>项目索赔合计：¥{{ claimItemsTotal }}</span>
                <span>零件索赔合计：¥{{ claimPartsTotal }}</span>
                <span>索赔费用合计：¥{{ totalClaimAmount }}</span>
              </div>
              <!-- 多条明细 -->
              <div class="item-details-list">
                <div
                  v-for="(item, index) in itemDetails"
                  :key="index"
                  class="item-detail-item"
                >
                  <!-- 可折叠头部 -->
                  <div class="item-detail-header" @click="toggleItem(index)">
                    <div class="item-info">
                      <div class="item-code">项目代码：{{ item.repairItemCode }}</div>
                      <div class="item-name">项目名称：{{ item.repairItemName }}</div>
                    </div>
                    <!-- <el-form :inline="true" class="form-detail" label-width="120px">
                      <el-form-item label="*项目代码：">
                        {{ item.repairItemTypeName }}
                      </el-form-item>
                      <el-form-item label="*项目名称：">
                        {{ item.checkoutTypeName }}
                      </el-form-item>
                    </el-form> -->
                    <div class="expand-toggle">
                      <i :class="['el-icon-arrow-down', { 'el-icon-arrow-up': expandedItems.includes(index) }]"></i>
                    </div>
                  </div>

                  <!-- 展开内容 -->
                  <div
                    v-show="expandedItems.includes(index)"
                    class="item-detail-body"
                  >
                    <el-form :inline="true" class="form-detail">
                      <el-form-item label="*维修类型：">
                        {{ item.repairItemTypeName }}
                      </el-form-item>
                      <el-form-item label="结算类型：">
                        {{ item.checkoutTypeName }}
                      </el-form-item>
                      <el-form-item label="工时单价：">
                        ¥{{ item.unitPrice }}
                      </el-form-item>
                      <el-form-item label="工时数量：">
                        {{ item.workingHours }}
                      </el-form-item>
                      <el-form-item label="优惠金额：">
                        ¥{{ item.discountAmount }}
                      </el-form-item>
                      <el-form-item label="项目金额：">
                        ¥{{ item.receivableAmount }}
                      </el-form-item>
                      <el-form-item label="索赔金额：">
                        ¥{{ item.claimPrice }}
                      </el-form-item>
                    </el-form>

                    <!-- 零件列表 -->
                    <div class="parts-table-wrapper">
                      <vxe-table
                        ref="tableRef"
                        stripe
                        :data="item.ownersEquityOrderPartsList"
                        show-overflow
                        resizable
                        border="inner"
                        size="medium"
                        min-height="0"
                        max-height="400px"
                      >
                        <vxe-column field="partsName" title="零件名称" width="150" />
                        <vxe-column field="partsCode" title="零件代码" width="120" />
                        <vxe-column field="repairItemTypeName" title="维修类型" width="150" />
                        <vxe-column field="checkoutTypeName" title="结算类型" width="150" />
                        <vxe-column field="totalAmount" title="数量" width="80" />
                        <vxe-column field="unitPrice" title="单价" width="100" />
                        <vxe-column field="discountAmount" title="优惠金额" width="120" />
                        <vxe-column field="partAmount" title="零件金额" width="120">
                          <template #default="{ row }">
                            {{ (row.totalAmount * row.unitPrice).toFixed(2) }}
                          </template>
                        </vxe-column>
                        <vxe-column field="claimPrice" title="索赔金额" width="120" />
                        <template #empty>
                          <div class="m-vxe-table-empty-text">暂无数据</div>
                        </template>
                      </vxe-table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getDecrypt } from '@/api/maintain/sp/ownersEquityOrder/index';
import LPEncrypted from '@/libs/components/LPEncrypted';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  mallOrderNumber: '',
  goodInterestsType: '',
  interestsGoodsCode: '',
  interestsGoodsName: '',
  orderStatus: '',
  status: '',
  dealerCode: '',
  serviceProxyCode: '',
  vehProfileVin: '',
  purchaser: '',
  purchaserPhone: '',
  saleDate: '',
  referralCode: '',
  logisticsCompanies: '',
  logisticsOrder: '',
  claimWorkHourAmount: '',
  claimPartsAmount: '',
  claimAmount: '',
  writeOffUserName: '',
  writeOffDate: '',
  unsubscribeDate: '',
  remark: '',
  invalidDate: '',
  modifierName: '',
  updateTime: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  statusDesc: '',
  name: '',
  equityOrderNumber: '',
  forceSystemUserId: '',
  forceSystemUserName: '',
  forceTime: '',
  interestsGoodsId: '',
  invalidReason: '',
  invalidSystemUserId: '',
  invalidSystemUserName: '',
  isEffect: '',
  isUnsubscribe: '',
  separateBill: '',
  separateBillData: '',
  vehProfileId: '',
  checkoutReason: '',
  ownerOrgId: '',
  dealerName: '',
  serviceProxyId: '',
  writeOffUserId: '',
  dataSource: '',
};

export default {
  name: 'ownersEquityOrderEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    LPEncrypted
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '商城订单编号：' + this.form.mallOrderNumber;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    },
    'form.id': {
      handler (val) {
        if (val) {
          this.getRepairItemList();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '商城订单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-ownersEquityOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      itemDetails: [], // 商品明细列表
      expandedItems: [], // 展开的明细索引
      claimItemsTotal: 0,
      claimPartsTotal: 0,
      totalClaimAmount: 0,
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        logisticsCompanies: [
          { required: true, message: '请输入物流商', trigger: 'change' }
        ],
        logisticsOrder: [
          { required: true, message: '请输入物流单号', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    getDecryptField (id, field) {
      return getDecrypt(id, field);
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },

    // 切换明细展开状态
    toggleItem (index) {
      const currentIndex = this.expandedItems.indexOf(index);
      if (currentIndex === -1) {
        this.expandedItems.push(index);
      } else {
        this.expandedItems.splice(currentIndex, 1);
      }
    },
    // 删除零件
    handleDeletePart (partIndex, itemIndex) {
      this.$confirm('确定要删除该零件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.itemDetails[itemIndex].ownersEquityOrderPartsList.splice(partIndex, 1);
        this.calculateTotals();
        this.$message.success('删除成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 计算合计金额
    calculateTotals () {
      // let workHourTotal = 0;
      // let partsTotal = 0;
      let claimItemsTotal = 0;
      let claimPartsTotal = 0;
      this.itemDetails.forEach(item => {
        // workHourTotal += item.unitPrice * item.workingHours;
        console.log('项目索赔金额' + item.claimPrice);
        const claimPrice = Number(item.claimPrice) || 0;
        claimItemsTotal += claimPrice;
        (item.ownersEquityOrderPartsList || []).forEach(part => {
          // partsTotal += part.unitPrice * part.totalAmount;
          const partClaimPrice = Number(part.claimPrice) || 0;
          claimPartsTotal += partClaimPrice;
        });
      });
      // this.totalWorkHourClaim = workHourTotal;
      // this.totalPartsClaim = partsTotal;
      this.totalClaimAmount = claimItemsTotal + claimPartsTotal;
      this.claimItemsTotal = claimItemsTotal;
      this.claimPartsTotal = claimPartsTotal;
    },
    // 获取维修项目列表
    async getRepairItemList () {
      const res = await this.detailRequest();
      if (res && res.ownersEquityOrderItemList) {
        this.itemDetails = res.ownersEquityOrderItemList;
        // 计算合计金额
        this.calculateTotals();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// 商品明细样式
.item-details-list {
  margin-top: 20px;
}

.item-detail-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 10px;
}

.item-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: var(--leap-color-default-light-6);
  cursor: pointer;
  // border-bottom: 1px solid #ebeef5;

  &:hover {
    background-color: var(--leap-color-primary-light-9);
  }
}

.item-info {
  display: flex;
  flex-direction: row;
  font-size: 14px;
}

.item-info-inline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-code {
  font-weight: bold;
  color: var(--leap-color-default-dark-1);
  white-space: nowrap;
  width: 300px;
}

.item-name {
  color: var(--leap-color-default);
  white-space: nowrap;
  width: 300px;
}

.expand-toggle {
  font-size: 14px;
  color: var(--leap-color-default);
  transition: transform 0.3s ease;
}

.item-detail-body {
  padding: 15px;
  background-color: #fff;
}

.item-detail-content {
  margin-bottom: 15px;
}

.item-detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
  &:last-child {
    border-bottom: none;
  }
}

.label {
  width: 100px;
  font-weight: 500;
  color: var(--leap-color-default);
}

.value {
  flex: 1;
  color: var(--leap-color-default-dark-1);
}

.parts-table-wrapper {
  margin-top: 10px;
}

// 合计金额样式
.claim-summary {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  margin-bottom: 15px;
  font-size: 14px;
  color: var(--leap-color-default);
}

.claim-summary span {
  padding: 5px 10px;
  background-color: var(--leap-color-default-light-5);
  border-radius: 4px;
}
</style>
