<template>
  <edit-page-layout ref="editLayout" title="门店详情">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_storeCode"
        :title="`门店编码：${form.storeCode || '-'}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <el-main>
          <!-- section 一：基本信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>基本信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="门店编码：">{{ form.storeCode }}</el-form-item>
                <el-form-item label="门店名称：">{{ form.storeName }}</el-form-item>
                <el-form-item label="公司名称：">{{ form.companyName }}</el-form-item>
                <el-form-item label="所属大区：">{{ form.region }}</el-form-item>
                <el-form-item label="建店类型：">{{ form.buildStoreType }}</el-form-item>
                <el-form-item label="店面地址：">{{ joinArea(form) }}</el-form-item>
                <el-form-item label="经营状态-销售：">{{ form.saleStatus || '-' }}</el-form-item>
                <el-form-item label="经营状态-服务：">{{ form.serviceStatus || '-' }}</el-form-item>
                <el-form-item label="经营状态-交付：">{{ form.deliveryStatus || '-' }}</el-form-item>
                <el-form-item label="店面详细地址：">{{ form.storeAddress }}</el-form-item>
                <el-form-item label="经纬度：">{{ form.addressXy }}</el-form-item>
                <el-form-item label="专属交付门店：">{{ form.exclusiveDeliveryStoreName }}</el-form-item>
                <el-form-item label="专属服务门店：">{{ form.exclusiveServiceStoreName }}</el-form-item>
                <el-form-item label="营业时间：">{{ form.businessTime }}</el-form-item>
                <el-form-item label="销售热线：">{{ form.salesHotline }}</el-form-item>
                <el-form-item label="服务热线：">{{ form.serviceHotline }}</el-form-item>
                <el-form-item label="验收完成时间：">{{ form.acceptanceTime }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 二：服务项目类别 -->
          <section class="common-section">
            <div class="common-section-header"><h2>服务项目类别</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="是否有销售能力：">{{ boolLabel(form.isSales) }}</el-form-item>
                <el-form-item label="是否有试驾能力：">{{ boolLabel(form.isTestDrive) }}</el-form-item>
                <el-form-item label="是否有批售能力：">{{ boolLabel(form.isWholesaleSale) }}</el-form-item>
                <el-form-item label="是否有交付能力：">{{ boolLabel(form.isSupportDeliver) }}</el-form-item>
                <el-form-item label="是否有维修能力：">{{ boolLabel(form.isRepair) }}</el-form-item>
                <el-form-item label="是否有维保能力：">{{ boolLabel(form.isMaintenance) }}</el-form-item>
                <el-form-item label="是否有道路救援能力：">{{ boolLabel(form.isSupportRescue) }}</el-form-item>
                <el-form-item label="是否支持事故维修：">{{ boolLabel(form.isAccidentRepair) }}</el-form-item>
                <el-form-item label="是否有备附件订购能力：">{{ boolLabel(form.isPartOrder) }}</el-form-item>
                <el-form-item label="道路救援服务地址：">{{ form.roadRescueAddress }}</el-form-item>
                <el-form-item label="门店等级：">{{ form.storeLevelName }}</el-form-item>
                <el-form-item label="专属交付门店：">{{ form.exclusiveDeliveryStoreName }}</el-form-item>
                <el-form-item label="专属服务门店：">{{ form.exclusiveServiceStoreName }}</el-form-item>
                <el-form-item label="营业时间：">{{ form.businessTime }}</el-form-item>
                <el-form-item label="销售热线：">{{ form.salesHotline }}</el-form-item>
                <el-form-item label="服务热线：">{{ form.serviceHotline }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 三：备件收货信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>备件收货信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="备件收货人姓名：">{{ form.sparePartReceiving?.partRecipient }}</el-form-item>
                <el-form-item label="备件收货人手机：">{{ form.sparePartReceiving?.partPhone }}</el-form-item>
                <el-form-item label="省市区：">{{ joinSpareArea(form.sparePartReceiving) }}</el-form-item>
                <el-form-item label="备件收货地址：">{{ form.sparePartReceiving?.partAddress }}</el-form-item>
                <el-form-item label="是否允许第三方收货：">{{ spareThirdLabel(form.sparePartReceiving?.isAllowedThirdDelivered) }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 四：整车仓库信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>整车仓库信息</h2></div>
            <div class="common-section-body">
              <vxe-table
                :data="form.warehouseList || []"
                stripe
                show-overflow
                :row-config="{ isHover: true }"
                resizable
                min-height="0"
                max-height="400px"
                border="inner"
                size="medium"
              >
                <vxe-column field="warehouseCode" title="仓库编码" min-width="160" />
                <vxe-column field="warehouseName" title="仓库名称" min-width="180" />
                <vxe-column title="省市区" min-width="200">
                  <template #default="{ row }">{{ joinArea(row) }}</template>
                </vxe-column>
                <vxe-column field="warehouseDetailAddress" title="详细地址" min-width="220" />
                <vxe-column field="warehouseAddressXy" title="经纬度" min-width="160" />
                <vxe-column field="contacts" title="商品车接收联系人" min-width="140" />
                <vxe-column field="contactPhone" title="联系人手机号码" min-width="140" />
                <vxe-column title="是否默认仓库" min-width="120">
                  <template #default="{ row }">{{ row.isDefault === 1 ? '是' : '否' }}</template>
                </vxe-column>
                <vxe-column title="是否冻结" min-width="100">
                  <template #default="{ row }">{{ row.isFrozen ? '是' : '否' }}</template>
                </vxe-column>
              </vxe-table>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getDetail } from '@/api/datacenter/store/index';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  storeCode: '',
  storeName: '',
  companyName: '',
  region: '',
  buildStoreType: '',
  provinceName: '',
  cityName: '',
  countyName: '',
  storeAddress: '',
  addressXy: '',
  exclusiveDeliveryStoreName: '',
  exclusiveServiceStoreName: '',
  businessTime: '',
  salesHotline: '',
  serviceHotline: '',
  acceptanceTime: '',
  saleStatus: '',
  serviceStatus: '',
  deliveryStatus: '',
  isSales: false,
  isTestDrive: false,
  isWholesaleSale: false,
  isSupportDeliver: false,
  isRepair: false,
  isMaintenance: false,
  isSupportRescue: false,
  isAccidentRepair: false,
  isPartOrder: false,
  roadRescueAddress: '',
  storeLevelName: '',
  sparePartReceiving: null,
  warehouseList: []
};

export default {
  name: 'storeDetail',
  props: {
    storeCode: { type: String, default: '' }
  },
  mixins: [permissions, commonMixins],
  components: { EditPageLayout, EditBaseContainer },
  computed: {
    _storeCode () {
      return this.storeCode || this.$route.query.storeCode || '';
    }
  },
  watch: {
    _storeCode: {
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
      pageTitle: '门店详情',
      pageType: 'detail',
      moduleKey: 'AISMC-store',
      isEditing: false,
      form: { ...defaultForm }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店管理', '门店详情']);
  },
  methods: {
    async detailRequest () {
      const code = this._storeCode;
      if (!code) return null;
      const res = await getDetail({ storeCode: code });
      return res || { ...defaultForm };
    },
    joinArea (obj = {}) {
      const arr = [obj.provinceName, obj.cityName, obj.countyName].filter(Boolean);
      return arr.join('/') || '-';
    },
    joinSpareArea (sp) {
      if (!sp || !sp.areaCode || !sp.areaCode.length) return '-';
      return sp.areaCode.join('/');
    },
    boolLabel (v) {
      return v === true || v === 'true' || v === 1 ? '是' : '否';
    },
    spareThirdLabel (v) {
      return v === 1 ? '是' : '否';
    }
  }
};
</script>

<style lang="scss" scoped>
.common-section-table {
  .m-vxe-table-empty-text { text-align: left; }
}
</style>
