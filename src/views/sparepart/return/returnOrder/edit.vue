<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest" >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <el-main>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>常规信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="退货单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="退货类型：" prop="returnType">
                  <fetch-select :request="fetchOptions" enumCode="ReturnTypeEnum" v-model="form.returnType"
                    placeholder="请选择" clearable filterable />
                </el-form-item>
                <el-form-item label="退货原因：" prop="returnReason">
                  <fetch-select :request="fetchOptions" enumCode="ReturnReasonEnum" v-model="form.returnReason"
                    placeholder="请选择" clearable filterable />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <fetch-select :remote-method="getDealerList" remote v-model="form.dealerCode" placeholder="请输入门店编码或名称"
                    labelKey="orgCode" valueKey="orgCode" subLabelKey="orgName" clearable collapseTags filterable
                    @change="handleDealerChange" />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="退货状态:" prop="returnStatus">
                  {{ form.returnStatusLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" maxlength="500" show-word-limit placeholder="请输入" v-model="form.remark" clearable />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>物流信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="发货时间：" prop="deliveryTime">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  {{ form.logisticsRemark }}
                </el-form-item>
                <el-form-item label="收货主机厂仓库：" prop="receiveWarehouseId">
                  <fetch-select :remote-method="getReceiveWarehouse" remote v-model="form.receiveWarehouseId"
                    placeholder="请选择" labelKey="name" valueKey="id" subLabelKey="code" clearable collapseTags
                    filterable />
                </el-form-item>
                <el-form-item label="收货人：" prop="receiver">
                  <el-input placeholder="请输入" v-model="form.receiver" clearable />
                </el-form-item>
                <el-form-item label="收货人联系电话：" prop="receiverPhone">
                  <el-input placeholder="请输入" v-model="form.receiverPhone" clearable />
                </el-form-item>
                <el-form-item label="收货地址：" prop="receiveAddress">
                  <el-input placeholder="请输入" v-model="form.receiveAddress" clearable />
                </el-form-item>
                <el-form-item label="物流支付方式：" prop="logisticsPaymentMethod">
                  <fetch-select :request="fetchOptions" enumCode="PurchaseLogisticsPaymentMethodEnum"
                    v-model="form.logisticsPaymentMethod" placeholder="请选择" clearable filterable />
                </el-form-item>
                <el-form-item label="退货完成时间：" prop="returnCompleteTime">
                  {{ form.returnCompleteTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>退款信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="退货价格比例：" prop="returnPriceRatio">
                  {{ form.returnPriceRatio }}
                </el-form-item>
                <el-form-item label="退款完成时间：" prop="refundCompleteTime">
                  {{ form.refundCompleteTime }}
                </el-form-item>
                <el-form-item label="预计退货返利总金额：" prop="estimatedReturnRebateAmount">
                  {{ form.estimatedReturnRebateAmount }}
                </el-form-item>
                <el-form-item label="实际退货返利总金额：" prop="actualReturnRebateAmount">
                  {{ form.actualReturnRebateAmount }}
                </el-form-item>
                <el-form-item label="预计退货现金总金额：" prop="estimatedReturnCashAmount">
                  {{ form.estimatedReturnCashAmount }}
                </el-form-item>
                <el-form-item label="实际退货现金总金额：" prop="actualReturnCashAmount">
                  {{ form.actualReturnCashAmount }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="审核人：" prop="reviewer">
                  {{ form.reviewer }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="reviewTime">
                  {{ form.reviewTime }}
                </el-form-item>
                <el-form-item label="审核说明：" prop="reviewDescription">
                  {{ form.reviewDescription }}
                </el-form-item>
                <el-form-item label="作废人：" prop="cancelOperator">
                  {{ form.cancelOperator }}
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelDescription">
                  {{ form.cancelDescription }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>常规信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail">
                <el-form-item label="退货单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="退货类型：" prop="returnType">
                  {{ form.returnTypeLabel }}
                </el-form-item>
                <el-form-item label="退货原因：" prop="returnReason">
                  {{ form.returnReasonLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="退货状态：" prop="returnStatus">
                  {{ form.returnStatusLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>物流信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail">
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="发货时间：" prop="deliveryTime">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  {{ form.logisticsRemark }}
                </el-form-item>
                <el-form-item label="收货主机厂仓库：" prop="receiveWarehouseId">
                  {{ form.receiveWarehouseName }}
                </el-form-item>
                <el-form-item label="收货人：" prop="receiver">
                  {{ form.receiver }}
                </el-form-item>
                <el-form-item label="收货人联系电话：" prop="receiverPhone">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="收货地址：" prop="receiveAddress">
                  {{ form.receiveAddress }}
                </el-form-item>
                <el-form-item label="物流支付方式:" prop="logisticsPaymentMethod">
                  {{ form.logisticsPaymentMethodLabel }}
                </el-form-item>
                <el-form-item label="退货完成时间：" prop="returnCompleteTime">
                  {{ form.returnCompleteTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>退款信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail">
                <el-form-item label="退货价格比例：" prop="returnPriceRatio">
                  {{ form.returnPriceRatio }}
                </el-form-item>
                <el-form-item label="退款完成时间：" prop="refundCompleteTime">
                  {{ form.refundCompleteTime }}
                </el-form-item>
                <el-form-item label="预计退货返利总金额：" prop="estimatedReturnRebateAmount">
                  {{ form.estimatedReturnRebateAmount }}
                </el-form-item>
                <el-form-item label="实际退货返利总金额：" prop="actualReturnRebateAmount">
                  {{ form.actualReturnRebateAmount }}
                </el-form-item>
                <el-form-item label="预计退货现金总金额：" prop="estimatedReturnCashAmount">
                  {{ form.estimatedReturnCashAmount }}
                </el-form-item>
                <el-form-item label="实际退货现金总金额：" prop="actualReturnCashAmount">
                  {{ form.actualReturnCashAmount }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail">
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="审核人：" prop="reviewer">
                  {{ form.reviewer }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="reviewTime">
                  {{ form.reviewTime }}
                </el-form-item>
                <el-form-item label="审核说明：" prop="reviewDescription">
                  {{ form.reviewDescription }}
                </el-form-item>
                <el-form-item label="作废人：" prop="cancelOperator">
                  {{ form.cancelOperator }}
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelDescription">
                  {{ form.cancelDescription }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>出库明细信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                    ref="editTableRight"
                    :data="tableData"
                    stripe
                    show-overflow
                    resizable
                    border="inner"
                    size="medium"
                >
                    <vxe-column field="partCode" title="备件编码" />
                    <vxe-column field="partName" title="备件名称" />
                    <vxe-column field="originalPrice" title="退货数量" />
                    <vxe-column field="purchasePrice" title="合格数量" />
                    <vxe-column field="cashUnitPrice" title="交货单号" />
                    <vxe-column field="cashAmount" title="销售凭证" />
                    <vxe-column field="purchaseQty" title="入库单号" />
                    <vxe-column field="remark" title="采购订单号" />
                    <vxe-column field="originalPriceSource" title="采购现金单价" />
                    <vxe-column field="originalPriceSource" title="采购返利单价" />
                    <vxe-column field="originalPriceSource" title="退货现金单价" />
                    <vxe-column field="originalPriceSource" title="预计退货现金金额" />
                    <vxe-column field="originalPriceSource" title="实际退货现金金额" />
                    <vxe-column field="originalPriceSource" title="退货返利单价" />
                    <vxe-column field="originalPriceSource" title="预计退货返利金额" />
                    <vxe-column field="originalPriceSource" title="实际退货返利金额" />
                    <vxe-column field="originalPriceSource" title="备注" />
                    <vxe-column title="操作" >
                        <template #default="{ row }">
                            <el-popconfirm
                                title="确定删除此出库明细吗？"
                                @confirm="handleDel(row)"
                            >
                                <span
                                class="action-button btn-delete"
                                slot="reference"
                                type="text">
                                删除
                                </span>
                            </el-popconfirm>
                        </template>
                    </vxe-column>
                </vxe-table>
                <div class="table-pagination">
                    <el-pagination
                        @size-change="(val) => pageSizeChange(val)"
                        @current-change="(val) => currentPageChange(val)"
                        :current-page="current"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                    >
                    </el-pagination>
                </div>
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>异常退货明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="abnormalColumns"
                  :data="abnormalTableData"
                  :show-toolbar="false"
                  showPagination
                  :current="abnormal.current"
                  :pageSize="abnormal.pageSize"
                  :total="abnormal.total"
                  @page-size-change="abnormalPageSizeChange"
                  @current-page-change="abnormalCurrentPageChange"
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
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/return/returnOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam, getParentCompany, listWarehouse } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerCode: '',
  dealerName: '',
  warehouseId: '',
  returnReason: '',
  returnStatus: '',
  logisticsOrderNo: '',
  logisticsProvider: '',
  deliveryTime: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  status: '',
  dataSource: '',
  purchaseOrderType: '',
  warehousingStatus: '',
  returnType: '',
  logisticsRemark: '',
  receiveWarehouseId: '',
  receiver: '',
  receiverPhone: '',
  receiveAddress: '',
  logisticsPaymentMethod: '',
  returnCompleteTime: '',
  returnPriceRatio: '',
  refundCompleteTime: '',
  estimatedReturnRebateAmount: '',
  actualReturnRebateAmount: '',
  estimatedReturnCashAmount: '',
  actualReturnCashAmount: '',
  submitter: '',
  submitTime: '',
  reviewer: '',
  reviewTime: '',
  reviewDescription: '',
  outboundOperator: '',
  outboundTime: '',
  cancelOperator: '',
  cancelTime: '',
  cancelDescription: '',
  warehousingOperator: '',
  warehousingTime: '',
};

export default {
  name: 'returnOrderEdit',
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
    FetchSelect
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
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件退货单',
      pageType: 'edit',
      title: '备件退货单号：' + form.code,
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-returnOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      pageSize: 10,
      current: 1,
      total: 0,
      tableData: [],
      abnormal: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      abnormalTableData: [],
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      abnormalColumns: [
        {
          field: 'name',
          title: '备件编码',
          width: '16%',
        },
        {
          field: 'age',
          title: '备件名称',
          width: '16%',
        },
        {
          field: 'email',
          title: '缺货数量',
          width: '16%',
        },
        {
          field: 'email',
          title: '不合格数量',
          width: '16%',
        },
        {
          field: 'email',
          title: 'wms备注',
          width: '16%',
        },
        {
          field: 'email',
          title: '备注',
          width: '16%',
        }
      ],
      rules: {
        code: [
          { required: false, message: '请输入备件退货单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: false, message: '请输入门店名称', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '请输入备件仓库', trigger: 'change' }
        ],
        returnReason: [
          { required: true, message: '请输入退货原因', trigger: 'change' }
        ],
        returnStatus: [
          { required: true, message: '请选择退货状态', trigger: 'change' }
        ],
        logisticsOrderNo: [
          { required: false, message: '请输入物流单号', trigger: 'change' }
        ],
        logisticsProvider: [
          { required: false, message: '请输入物流商', trigger: 'change' }
        ],
        deliveryTime: [
          { required: false, message: '请选择发货时间', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        purchaseOrderType: [
          { required: false, message: '请选择订单类型', trigger: 'change' }
        ],
        warehousingStatus: [
          { required: false, message: '请选择入库状态', trigger: 'change' }
        ],
        returnType: [
          { required: false, message: '请选择退货类型', trigger: 'change' }
        ],
        logisticsRemark: [
          { required: false, message: '请输入物流备注', trigger: 'change' }
        ],
        receiveWarehouseId: [
          { required: true, message: '请输入收货主机厂仓库ID', trigger: 'change' }
        ],
        receiver: [
          { required: false, message: '请输入收货人', trigger: 'change' }
        ],
        receiverPhone: [
          { required: false, message: '请输入收货人联系电话', trigger: 'change' }
        ],
        receiveAddress: [
          { required: false, message: '请输入收货地址', trigger: 'change' }
        ],
        logisticsPaymentMethod: [
          { required: true, message: '请输入物流支付方式', trigger: 'change' }
        ],
        returnCompleteTime: [
          { required: false, message: '请选择退货完成时间', trigger: 'change' }
        ],
        returnPriceRatio: [
          { required: false, message: '请输入退货价格比例', trigger: 'change' }
        ],
        refundCompleteTime: [
          { required: false, message: '请选择退款完成时间', trigger: 'change' }
        ],
        estimatedReturnRebateAmount: [
          { required: false, message: '请输入预计退货返利总金额', trigger: 'change' }
        ],
        actualReturnRebateAmount: [
          { required: false, message: '请输入实际退货返利总金额', trigger: 'change' }
        ],
        estimatedReturnCashAmount: [
          { required: false, message: '请输入预计退货现金总金额', trigger: 'change' }
        ],
        actualReturnCashAmount: [
          { required: false, message: '请输入实际退货现金总金额', trigger: 'change' }
        ],
        submitter: [
          { required: false, message: '请输入提交人', trigger: 'change' }
        ],
        submitTime: [
          { required: false, message: '请选择提交时间', trigger: 'change' }
        ],
        reviewer: [
          { required: false, message: '请输入审核人', trigger: 'change' }
        ],
        reviewTime: [
          { required: false, message: '请选择审核时间', trigger: 'change' }
        ],
        reviewDescription: [
          { required: false, message: '请输入审核说明', trigger: 'change' }
        ],
        outboundOperator: [
          { required: false, message: '请输入出库操作人', trigger: 'change' }
        ],
        outboundTime: [
          { required: false, message: '请选择出库操作时间', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },

    async getReceiveWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 点击带出门店名称
    handleDealerChange (val, ele) {
      this.form.dealerName = ele.orgName;
      this.getPartDealer(ele.orgCode);
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
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailData();
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailData();
    },
    abnormalPageSizeChange (pageSize) {
      this.abnormal.pageSize = pageSize;
      this.abnormal.current = 1;
      this.getList();
    },
    abnormalCurrentPageChange (current) {
      this.abnormal.current = current;
      this.getList();
    },
  }
};
</script>

<style lang="scss" scoped>
.btn-delete{
  color:#B91919;
  cursor: pointer;
}
.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
