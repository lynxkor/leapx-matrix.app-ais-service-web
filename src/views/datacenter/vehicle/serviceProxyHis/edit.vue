<template>
  <edit-page-layout ref="editLayout" title="维修履历详情">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`维修履历编号：${form.serviceProxyCode || '-'}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <el-main>
          <!-- 第一段：基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="接车施工单号：">
                  <el-link type="success" @click="handleLinkClick()">{{ form.serviceProxyCode }}</el-link>
                </el-form-item>
                <el-form-item label="VIN码：">
                  <LPEncrypted
                    :value.sync="form.vehProfileVin"
                    :decryptMethod="() => getDecryptField(form.id, 'vehProfileVin')"
                  >
                    <el-link
                      type="primary"
                      :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${form.vehProfileId}`"
                      target="_blank"
                    >{{ form.vehProfileVin }}</el-link>
                  </LPEncrypted>
                </el-form-item>
                <el-form-item label="车型：">
                  <el-link
                    type="primary"
                    :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.vehModelId}`"
                    target="_blank"
                  >{{ form.vehModelName }}</el-link>
                </el-form-item>
                <el-form-item label="维修门店名称：">
                  <el-link
                    type="primary"
                    :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.dealerCode}`"
                    target="_blank"
                  >{{ form.dealerName }}</el-link>
                </el-form-item>
                <el-form-item label="车牌号：">
                  <LPEncrypted
                    :value.sync="form.carPlate"
                    :decryptMethod="() => getDecryptField(form.id, 'carPlate')"
                  />
                </el-form-item>
                <el-form-item label="进店里程数（KM）：">
                  {{ form.mileage }}
                </el-form-item>
                <el-form-item label="开单时间：">
                  {{ form.orderTime }}
                </el-form-item>
                <el-form-item label="维修完工时间：">
                  {{ form.repairFinishTime }}
                </el-form-item>
                <el-form-item label="车联网里程数（增）：">
                  {{ form.netMileageExtend }}
                </el-form-item>
                <el-form-item label="客户诉求：" class="form-item-full">
                  {{ form.customerRequest }}
                </el-form-item>
                <el-form-item label="客户故障描述：" class="form-item-full">
                  {{ form.customerFaultDescription }}
                </el-form-item>
                <el-form-item label="客户经理建议：" class="form-item-full">
                  {{ form.managerSuggestion }}
                </el-form-item>
                <el-form-item label="维修类型（汇总）：">
                  {{ form.repairItemTypeDetailCollect }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 第二段：维修项目 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>维修项目</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="repairItemTable"
                  :data="repairItemRespList"
                  stripe
                  show-overflow
                  :row-config="{ isHover: true }"
                  resizable
                  min-height="0"
                  max-height="400px"
                  border="inner"
                  size="medium"
                >
                  <vxe-column field="repairItemCode" title="维修项目代码" min-width="180">
                    <template #default="{ row }">
                      <el-link
                        type="primary"
                        :href="`/service/maintain/basic/repairItem/edit?id=${row.repairItemId}`"
                        target="_blank"
                      >{{ row.repairItemCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="repairItemName" title="维修项目名称" min-width="180" />
                  <vxe-column field="repairItemTypeName" title="维修类型" min-width="120" />
                  <vxe-column field="checkoutTypeName" title="结算类型" min-width="120" />
                  <vxe-column field="warrantyTypeName" title="保修类型" min-width="120" />
                  <!-- <vxe-column field="price" title="工时单价" min-width="120" />
                  <vxe-column field="workHour" title="工时数" min-width="100" />
                  <vxe-column field="discountAmount" title="优惠金额" min-width="120" />
                  <vxe-column field="discountRate" title="折扣率" min-width="100" />
                  <vxe-column field="repairAmount" title="项目金额" min-width="120" /> -->
                  <!-- <vxe-column field="packageCode" title="活动编号" min-width="150" /> -->
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无维修项目数据</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>

          <!-- 第三段：维修配件 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>维修配件</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="sparePartTable"
                  :data="sparePartRespList"
                  stripe
                  show-overflow
                  :row-config="{ isHover: true }"
                  resizable
                  min-height="0"
                  max-height="400px"
                  border="inner"
                  size="medium"
                >
                  <vxe-column field="partsCode" title="配件代码" min-width="180">
                    <template #default="{ row }">
                      <el-link
                        type="primary"
                        :href="`/service/sparepart/basic/sparePart/edit?id=${row.partsId}`"
                        target="_blank"
                      >{{ row.partsCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="partsName" title="配件名称" min-width="180" />
                  <vxe-column field="quantity" title="数量" min-width="120" />
                  <vxe-column field="repairItemTypeName" title="维修类型" min-width="120" />
                  <vxe-column field="checkoutTypeName" title="结算类型" min-width="120" />
                  <vxe-column field="warrantyTypeName" title="保修类型" min-width="120" />
                  <!-- <vxe-column field="price" title="单价" min-width="120" />
                  <vxe-column field="quantity" title="数量" min-width="100" />
                  <vxe-column field="discountAmount" title="优惠金额" min-width="120" />
                  <vxe-column field="discountRate" title="折扣率" min-width="100" />
                  <vxe-column field="partsAmount" title="配件金额" min-width="120" /> -->
                  <!-- <vxe-column field="packageCode" title="活动编号" min-width="150" /> -->
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无维修配件数据</div>
                  </template>
                </vxe-table>
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
import { getDetail, getDecrypt } from '@/api/datacenter/vehicle/serviceProxyHis/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import LPEncrypted from '@/libs/components/LPEncrypted';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getLoginUser } from '@/api/common';

const defaultForm = {
  id: '',
  serviceProxyId: '',
  serviceProxyCode: '',
  ownerOrgId: '',
  dealerCode: '',
  dealerName: '',
  orderTime: '',
  repairFinishTime: '',
  vehProfileId: '',
  vehProfileVin: '',
  carPlate: '',
  vehModelId: '',
  vehModelName: '',
  mileage: '',
  netMileageExtend: '',
  customerRequest: '',
  managerSuggestion: '',
  customerFaultDescription: '',
  servicerecordUpload: '',
  isPreSales: '',
  isOwnDealer: true,
  costCountResp: {
    repairItemRespList: [],
    sparePartRespList: []
  }
};

export default {
  name: 'serviceProxyHisEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
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
    }
  },
  data () {
    return {
      pageTitle: '维修履历详情',
      pageType: 'edit',
      moduleKey: 'AISMC-serviceProxyHis',
      loading: false,
      isEditing: false,
      form: { ...defaultForm },
      repairItemRespList: [],
      sparePartRespList: [],
      loginUser: null
    };
  },
  mounted () {
    this.initLoginUser();
  },
  methods: {
    async detailRequest () {
      const id = this._id;
      if (id) {
        const res = await getDetail(id);
        // 处理子表数据
        if (res) {
          this.repairItemRespList = res.costCountResp?.repairItemRespList || [];
          this.sparePartRespList = res.costCountResp?.sparePartRespList || [];
        } else {
          this.repairItemRespList = [];
          this.sparePartRespList = [];
        }
        return res;
      }
    },
    async initLoginUser () {
      this.loginUser = await getLoginUser();
    },
    getDecryptField (id, field) {
      return getDecrypt(id, field);
    },
    handleLinkClick () {
      if (this.loginUser?.accountFlag && this.loginUser.currentDealerCode !== this.form.dealerCode) {
        this.$message.warning('权限不足');
        return;
      }
      window.open(`/service/maintain/sp/serviceProxy/edit?id=${this.form.serviceProxyId}`, '_blank');
    }
  }
};
</script>

<style lang="scss" scoped>
.link-disabled {
  color: var(--leap-color-primary);
  cursor: pointer;
}
.common-section-table {
  .m-vxe-table-empty-text {
    text-align: left;
  }
}
</style>
