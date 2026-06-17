<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`${title}${form.code}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :originalForm.sync="originalForm"
        :showEditBtn="false"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">{{ form.orderStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button plain size="small" v-if="form.orderStatus === '2'" @click="handleSign(false)">签收</el-button>
          <el-button plain size="small" v-if="form.orderStatus === '2'" @click="handleSign(true)">签收并入库</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购申请单code：" prop="purchaseApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseApplyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="缺货单号：" prop="backOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.backOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发货仓库：" prop="deliveryWarehouse">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryWarehouse"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收货备件仓库ID：" prop="receiveWarehouseId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiveWarehouseId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.purchaseOrderType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="采购金额：" prop="purchaseAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="现金金额：" prop="cashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cashAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="返利金额：" prop="rebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rebateAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="采购申请单ID：" prop="purchaseApplyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseApplyId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="缺货单ID：" prop="backOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.backOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发货仓库名称：" prop="receiveWarehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiveWarehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发运单：" prop="shippingOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.shippingOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="承运商：" prop="carrier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carrier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="税率：" prop="taxRate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.taxRate"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="采购申请单：" prop="purchaseApplyCode">
                  <el-link type="success" :href="`/service/sparepart/purchase/purchaseApply/edit?id=${form.purchaseApplyId}`" target="_blank">{{ form.purchaseApplyCode }}</el-link>
                </el-form-item>
                <el-form-item label="仓库名称：" prop="receiveWarehouseId">
                  {{ form.receiveWarehouseName }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  {{ form.purchaseOrderTypeLabel }}
                </el-form-item>
                <el-form-item label="缺货单号：" prop="backOrderCode">
                  <el-link type="success" :href="`/service/sparepart/purchase/backOrder/edit?id=${form.backOrderId}`" target="_blank">{{ form.backOrderCode }}</el-link>
                </el-form-item>
                <el-form-item label="订单金额：" prop="purchaseAmount">
                  {{ form.purchaseAmount }}
                </el-form-item>
                <el-form-item label="是否第三方收货：">
                  {{ form.thirdPartyDeliveryIsLabel }}
                </el-form-item>
                <el-form-item label="发货仓库：" prop="deliveryWarehouse">
                  {{ form.deliveryWarehouseName }}
                </el-form-item>
                <el-form-item label="收货人姓名：" prop="recipientName">
                  {{ form.recipientName }}
                </el-form-item>
                <el-form-item label="使用现金：" prop="cashAmount">
                  {{ form.cashAmount }}
                </el-form-item>
                <el-form-item label="发运单：" prop="shippingOrder">
                  <div class="shipping-order" @click="handleLogisticsClick">{{ form.shippingOrder }}</div>
                </el-form-item>
                <el-form-item label="收货人电话：" prop="recipientPhone">
                  {{ form.recipientPhone }}
                </el-form-item>
                <el-form-item label="使用返利：" prop="rebateAmount">
                  {{ form.rebateAmount }}
                </el-form-item>
                <el-form-item label="承运商：" prop="carrier">
                  {{ form.carrier }}
                </el-form-item>
                <el-form-item label="收货地址：">
                  {{ form.fullAddress }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>销售明细信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :show-toolbar="false"
                  showPagination
                  :current="sales.current"
                  :pageSize="sales.pageSize"
                  :total="sales.total"
                  @page-size-change="salesPageSizeChange"
                  @current-page-change="salesCurrentPageChange"
                />
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>采购申请明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="procurementColumns"
                  :data="procurementTableData"
                  :show-toolbar="false"
                  showPagination
                  :current="procurement.current"
                  :pageSize="procurement.pageSize"
                  :total="procurement.total"
                  @page-size-change="procurementPageSizeChange"
                  @current-page-change="procurementCurrentPageChange"
                />
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
     <!-- 物流信息抽屉 -->
    <LogisticsDrawer
      ref="logisticsDrawerRef"
      :visible.sync="logisticsDrawerVisible"
      :drawerData="logisticsData"
      @update:visible="val => logisticsDrawerVisible = val"
    />
    <!-- 签收/入库弹窗 -->
    <BatchEditSignForDialogAll
      ref="batchSignForDialogRef"
      :visible="signDialogVisible"
      :purchaseOrderId="_id"
      :inbound="signInbound"
      @update:visible="val => signDialogVisible = val"
      @submit="handleSignDialogSubmit"
    />
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, purchaseOrderDetail } from '@/api/sparepart/purchase/purchaseOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getPurchaseApplyPage } from '@/api/sparepart/purchase/purchaseApply/index';
import LogisticsDrawer from '@/libs/components/LogisticsDrawer';
import BatchEditSignForDialogAll from './BatchEditSignForDialogAll.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  purchaseApplyCode: '',
  backOrderCode: '',
  remark: '',
  deliveryWarehouse: '',
  dealerCode: '',
  dealerName: '',
  receiveWarehouseId: '',
  purchaseOrderType: '',
  orderStatus: '',
  purchaseAmount: '',
  cashAmount: '',
  rebateAmount: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  purchaseApplyId: '',
  backOrderId: '',
  receiveWarehouseName: '',
  shippingOrder: '',
  carrier: '',
  taxRate: '',
};

export default {
  name: 'purchaseOrderEdit',
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
    EditTable,
    FetchSelect,
    LogisticsDrawer,
    BatchEditSignForDialogAll
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    type () {
      return this.$route.query.type;
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
    'form.purchaseApplyId': {
      handler (val) {
        if (val) {
          this.purchaseApplyIdData = val;
          this.getList();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件采购订单',
      pageType: 'edit',
      title: '订单号：',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-purchaseOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      logisticsData: {}, // 物流信息
      logisticsDrawerVisible: false, // 物流信息抽屉
      signDialogVisible: false, // 签收/入库弹窗
      signInbound: false, // 是否签收并入库
      sales: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'sparePartCode',
          title: '备件编码',
          width: '7%',
        },
        {
          field: 'sparePartName',
          title: '备件名称',
          width: '7%',
        },
        {
          field: 'settlementQty',
          title: '结算数量',
          width: '7%',
        },
        {
          field: 'cancelQty',
          title: '取消数量',
          width: '7%',
        },
        {
          field: 'outboundQty',
          title: '已发运数',
          width: '7%',
        },
        {
          field: 'signedQty',
          title: '已签收数',
          width: '7%',
        },
        {
          field: 'inboundQty',
          title: '已入库数',
          width: '7%',
        },
        {
          field: 'cancelOperator',
          title: '取消人',
          width: '7%',
        },
        {
          field: 'cancelTime',
          title: '取消时间',
          width: '7%',
        },
        {
          field: 'cancelDescription',
          title: '取消说明',
          width: '7%',
        },
        {
          field: 'originalPrice',
          title: '原价',
          width: '7%',
        },
        {
          field: 'purchasePrice',
          title: '采购价',
          width: '7%',
        },
        {
          field: 'purchaseAmount',
          title: '采购金额',
          width: '7%',
        },
        {
          field: 'cashUnitPrice',
          title: '现金单价',
          width: '7%',
        },
        {
          field: 'cashAmount',
          title: '现金金额',
          width: '7%',
        },
        {
          field: 'detailRemark',
          title: '备注',
          width: '7%',
        }
      ],
      procurement: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      purchaseApplyIdData: '',
      procurementTableData: [],
      procurementColumns: [
        {
          field: 'partCode',
          title: '备件编码',
          width: '11%',
        },
        {
          field: 'partName',
          title: '备件名称',
          width: '11%',
        },
        {
          field: 'purchaseQty',
          title: '采购数',
          width: '11%',
        },
        {
          field: 'originalPrice',
          title: '原价',
          width: '11%',
        },
        {
          field: 'purchasePrice',
          title: '采购价',
          width: '11%',
        },
        {
          field: 'purchaseAmount',
          title: '采购金额',
          width: '11%',
        },
        {
          field: 'cashUnitPrice',
          title: '现金单价',
          width: '11%',
        },
        {
          field: 'cashAmount',
          title: '现金金额',
          width: '11%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '11%',
        }
      ],
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.getData();
          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
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
    // 获取销售明细信息表格
    async getData () {
      const params = {
        pageNum: this.sales.current,
        pageSize: this.sales.pageSize,
        purchaseOrderId: this._id,
      };
      const res = await purchaseOrderDetail(params);
      this.tableData = res.records || [];
      this.sales.total = res.total || 0;
    },
    // 获取采购明细信息表格
    async getList () {
      const params = {
        pageNum: this.procurement.current,
        pageSize: this.procurement.pageSize,
        purchaseApplyId: this.purchaseApplyIdData, // 采购申请单ID
      };
      const res = await getPurchaseApplyPage(params);
      this.procurementTableData = res.records || [];
      this.procurement.total = res.total || 0;
    },
    salesPageSizeChange (pageSize) {
      this.sales.pageSize = pageSize;
      this.sales.current = 1;
      this.getData();
    },
    salesCurrentPageChange (current) {
      this.sales.current = current;
      this.getData();
    },
    procurementPageSizeChange (pageSize) {
      this.procurement.pageSize = pageSize;
      this.procurement.current = 1;
      this.getList();
    },
    procurementCurrentPageChange (current) {
      this.procurement.current = current;
      this.getList();
    },
    // 签收/入库
    async handleSign (val) {
      this.signInbound = val;
      this.signDialogVisible = true;
    },
    handleSignDialogSubmit () {
      this.$refs.containerRef.loadDetail();
      this.getData();
      this.getList();
    },
    // 打开物流信息抽屉
    handleLogisticsClick () {
      this.logisticsData = {
        logisticsProvider: this.form.carrier,
        logisticsOrderNo: this.form.shippingOrder,
      };
      this.logisticsDrawerVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.shipping-order {
  cursor: pointer;
  color: #009100;
}
</style>
