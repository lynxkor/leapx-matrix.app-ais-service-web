<template>
  <edit-page-layout ref="editLayout" :title="detailTitle" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :form.sync="form" :submitRequest="submitRequest"
        :isEditing.sync="isEditing" :originalForm.sync="originalForm" :detailRequest="detailRequest"  :showEditBtn="routeQueryType">
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>常规信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-title" v-show="isEditing || !_id">基本信息</div>
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="门店编码：" prop="dealerCode">
                  <fetch-select :remote-method="getDealerList" remote v-model="form.dealerCode" placeholder="请输入门店编码或名称"
                    labelKey="orgCode" valueKey="orgCode" subLabelKey="orgName" clearable collapseTags filterable
                    @change="handleDealerChange" />
                </el-form-item>
                <el-form-item label="采购申请单：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  <fetch-select :request="fetchOptions" enumCode="PurchaseOrderTypeEnum"
                    v-model="form.purchaseOrderType" placeholder="请选择" clearable filterable />
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <fetch-select :request="fetchOptions" enumCode="PurchaseApplyStatusEnum" v-model="form.orderStatus"
                    placeholder="请选择" disabled clearable filterable />
                </el-form-item>
                <el-form-item label="公司名称：" prop="companyCode">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" maxlength="500" show-word-limit placeholder="请输入" v-model="form.remark"
                    clearable />
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="isEditing || !_id">收件信息</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="仓库名称：">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="是否第三方收货：" prop="thirdPartyDeliveryIs">
                  <el-radio-group v-model="form.thirdPartyDeliveryIs">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="收货人姓名：" prop="recipientName">
                  <el-input placeholder="请输入" v-model="form.recipientName" clearable />
                </el-form-item>
                <el-form-item label="收货人电话：" prop="recipientPhone">
                  <el-input placeholder="请输入" v-model="form.recipientPhone" clearable />
                </el-form-item>
                <el-form-item label="省市区：" prop="provinceCityCountyCode">
                  <el-cascader placeholder="请选择省市区" v-model="form.provinceCityCountyCode" :props="orgProps"
                    :options="areaOptions" filterable clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item label="收货地址：" prop="address">
                  <el-input placeholder="请输入" v-model="form.address" clearable />
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="isEditing || !_id">审批信息</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  {{ form.approver }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="isEditing || !_id">资金信息</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="采购金额：" prop="purchaseAmount">
                  {{ form.purchaseAmount }}
                </el-form-item>
                <el-form-item label="使用现金：" prop="cashAmount">
                  {{ form.cashAmount }}
                </el-form-item>
                <el-form-item label="使用返利：" prop="rebateAmount">
                  {{ form.rebateAmount }}
                </el-form-item>
                <el-form-item label="现金可用资金：" prop="cashAvailableAmount">
                  {{ form.cashAvailableAmount }}
                </el-form-item>
                <el-form-item label="返利可用资金：" prop="rebateAvailableAmount">
                  {{ form.rebateAvailableAmount }}
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="isEditing || !_id">其他信息</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="缺货单号：" prop="backOrderId">
                  {{ form.backOrderCode }}
                </el-form-item>
                <el-form-item label="原价券：" prop="originalPriceCouponId">
                  {{ form.originalPriceCouponId }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <el-input placeholder="请输入" v-model="form.vin" clearable />
                </el-form-item>
                <el-form-item label="特殊编码：" prop="specialCode">
                  <el-input placeholder="请输入" v-model="form.specialCode" clearable />
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="!(isEditing || !_id)">基本信息</div>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="采购申请单：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  {{ form.purchaseOrderTypeLabel }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="公司名称：" prop="companyName">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseName">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="!(isEditing || !_id)">收件信息</div>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="仓库名称：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="是否第三方收货：" prop="thirdPartyDeliveryIs">
                  {{ form.thirdPartyDeliveryIsLabel }}
                </el-form-item>
                <el-form-item label="收货人姓名：" prop="recipientName">
                  {{ form.recipientName }}
                </el-form-item>
                <el-form-item label="收货人电话：" prop="recipientPhone">
                  {{ form.recipientPhone }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="收货地址：" prop="address">
                  {{ form.address }}
                </el-form-item>
              </el-form>

              <div class="common-title" v-show="!(isEditing || !_id)">审批信息</div>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  {{ form.approver }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
              </el-form>

              <div class="common-title" v-show="!(isEditing || !_id)">资金信息</div>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="采购金额：" prop="purchaseAmount">
                  {{ form.purchaseAmount }}
                </el-form-item>
                <el-form-item label="使用现金：" prop="cashAmount">
                  {{ form.cashAmount }}
                </el-form-item>
                <el-form-item label="使用返利：" prop="rebateAmount">
                  {{ form.rebateAmount }}
                </el-form-item>
                <el-form-item label="现金可用资金：" prop="cashAvailableAmount">
                  {{ form.cashAvailableAmount }}
                </el-form-item>
                <el-form-item label="返利可用资金：" prop="rebateAvailableAmount">
                  {{ form.rebateAvailableAmount }}
                </el-form-item>
              </el-form>

              <div class="common-title" v-show="!(isEditing || !_id)">其他信息</div>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="缺货单号：" prop="backOrderId">
                  {{ form.backOrderCode }}
                </el-form-item>
                <el-form-item label="原价券：" prop="originalPriceCouponId">
                  {{ form.originalPriceCouponId }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="特殊编码：" prop="specialCode">
                  {{ form.specialCode }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>备件信息</h2>
            </div>
            <div class="common-section-body">
              <div class="ais-select-group">
                <el-button size="small" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>添加备件</el-button>
                <el-button class="ais-button" size="small">
                  补货预测
                </el-button>
                <el-button size="small">备件导入</el-button>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
        <SparePartsDetail
          :purchase-apply-id="_id"
        />
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/purchase/purchaseApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getUserByNameOrNo, getEnum, listOrgStoreInfoByParam, listWarehouse, getPartDealer, getPartUser } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import SparePartsDetail from './SparePartsDetail.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerCode: '',
  dealerName: '',
  companyCode: '',
  companyName: '',
  warehouseName: '',
  warehouseId: '',
  purchaseOrderType: '',
  purchaseAmount: '',
  orderStatus: '0',
  submitTime: '',
  submitter: '',
  approver: '',
  approvalTime: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  status: '',
  statusDesc: '',
  provinceCityCountyCode: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  dataSource: '',
  backOrderId: '',
  originalPriceCouponId: '',
  thirdPartyDeliveryIs: '',
  recipientName: '',
  recipientPhone: '',
  cashAmount: '',
  cashAvailableAmount: '',
  rebateAmount: '',
  rebateAvailableAmount: '',
  taxRate: '',
  vin: '',
  specialCode: '',
  emptyIs: '',
  approvalDescription: '',
  logisticsPaymentMethod: '',
};

export default {
  name: 'purchaseApplyEdit',
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
    FetchSelect,
    SparePartsDetail
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
    },
    // 监听路由变化
    '$route.query.orderType': {
      handler (newVal) {
        if (newVal === '1') {
          this.routeQueryType = true;
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      oem: false,
      areaOptions: JSON.parse(localStorage.areaTree),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      pageTitle: '备件采购申请',
      pageType: 'edit',
      title: '采购申请单：' + form.code,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchaseApply',
      loading: false,
      submitLoading: false,
      routeQueryType: false, // 路由参数ID 是否可编辑
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      detailTitle: '添加备件',
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      rules: {
        purchaseOrderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        provinceCityCountyCode: [
          { required: true, message: '请输入省市区', trigger: 'change' }
        ],
        thirdPartyDeliveryIs: [
          { required: true, message: '请输入是否第三方收货', trigger: 'change' }
        ],
        recipientName: [
          { required: true, message: '请输入收货人姓名', trigger: 'change' }
        ],
        recipientPhone: [
          { required: true, message: '请输入收货人电话', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.oem = this.$store.state.pageSource?.aisPageSource.includes('AISPART-sparePart-oem');
    console.log('this.oem  ', this.isEditing);
    if (!this.isEditing) {
      this.getPartUser();
    }
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    // 点击带出门店名称
    handleDealerChange (val, ele) {
      this.form.dealerName = ele.orgName;
      this.getPartDealer(ele.orgCode);
    },

    async getPartDealer (query) {
      try {
        const res = await getPartDealer({ code: query });
        this.form.companyCode = res.parentCompanyCode;
        this.form.companyName = res.parentCompanyName;
        this.form.warehouseId = res.warehouseId;
        this.form.warehouseCode = res.warehouseCode;
        this.form.warehouseName = res.warehouseName;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getPartUser (query) {
      try {
        const res = await getPartUser();
        this.form.dealerCode = res.currentDealerCode;
        this.form.dealerName = res.currentDealerName;
        if (this.form.dealerCode) {
          this.getPartDealer(this.form.dealerCode);
        }
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    handleWarehouseChange (val, ele) {
      this.form.warehouseName = ele.name;
    },
    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getUser (query) {
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 添加备件
    handleAdd () {
      this.openPane();
    }
  }
};
</script>
<style lang="scss" scoped>
.common-title {
  font-size: 14px;
  font-weight: 500;
  color: #0A0E0A;
}
.ais-select-group {
  margin-bottom: 12px;
}
.ais-button {
  margin-left: 12px;
  border-radius: 4px;
}
</style>
