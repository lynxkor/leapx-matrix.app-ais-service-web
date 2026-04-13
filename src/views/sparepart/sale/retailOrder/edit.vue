<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter @save="handleSave">
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest" :showEditBtn="isEditSpare">
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="备附件销售单：" prop="code">
                  <el-input placeholder="请输入" v-model="form.code" disabled />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input placeholder="请输入" v-model="form.dealerName" disabled />
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <fetch-select :request="fetchOptions" enumCode="RetailOrderStatusEnum" v-model="form.orderStatus"
                    placeholder="请选择" clearable filterable disabled />
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseName">
                  <el-input placeholder="请输入" v-model="form.warehouseName" disabled />
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <fetch-select :remote-method="getVinList" remote v-model="form.vin" placeholder="请输入vin"
                    labelKey="vin" valueKey="vin" clearable filterable :disabled="isEditing"
                    @change="handleVinChange" />
                </el-form-item>
                <el-form-item label="客户名称：" prop="customerName">
                  <el-input placeholder="请输入" v-model="form.customerName" disabled />
                </el-form-item>
                <el-form-item label="客户类型：" prop="customerType">
                  <el-input placeholder="请输入" v-model="form.customerTypeLabel" disabled />
                </el-form-item>
                <el-form-item label="订单总金额：" prop="totalAmount">
                  <el-input placeholder="请输入" v-model="form.totalAmount" disabled />
                </el-form-item>
                <el-form-item label="客户联系方式：" prop="customerContactInfo">
                  <el-input placeholder="请输入" v-model="form.customerContactInfo" clearable />
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountTotalAmount">
                  <el-input placeholder="请输入" v-model="form.discountTotalAmount" disabled />
                </el-form-item>
                <el-form-item label="应付总金额：" prop="payableTotalAmount">
                  <el-input placeholder="请输入" v-model="form.payableTotalAmount" disabled />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input placeholder="请输入" type="textarea" maxlength="500" show-word-limit v-model="form.remark" clearable />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="routeCustomerType === '10' && (isEditing || !_id)">
            <div class="common-section-header">
              <h2>车辆信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="当前里程：" prop="currentMileage">
                  <el-input placeholder="请输入" v-model="form.currentMileage" type="number" clearable />
                </el-form-item>
                <el-form-item label="车联网里程(KM)：" prop="iotMileage">
                  <el-input placeholder="请输入" v-model="form.iotMileage" disabled />
                </el-form-item>
                <el-form-item label="车牌号：" prop="plateNumber">
                  <el-input placeholder="请输入" v-model="form.plateNumber" disabled />
                </el-form-item>
                <el-form-item label="最近进店里程：" prop="latestVisitMileage">
                  <el-input placeholder="请输入" v-model="form.latestVisitMileage" disabled />
                </el-form-item>
                <el-form-item label="车型名称：" prop="vehicleModelName">
                  <el-input placeholder="请输入" v-model="form.vehicleModelName" disabled />
                </el-form-item>
                <el-form-item label="销售日期：" prop="saleDate">
                  <el-input placeholder="请输入" v-model="form.saleDate" disabled />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>开单签收信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="开单人：" prop="orderCreatorName">
                  <el-input placeholder="请输入" v-model="form.orderCreatorName" disabled />
                </el-form-item>
                <el-form-item label="开单时间：" prop="orderCreationTime">
                  <el-input placeholder="请输入" v-model="form.orderCreationTime" disabled />
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmerName">
                  <el-input placeholder="请输入" v-model="form.confirmerName" disabled />
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmationTime">
                  <el-input placeholder="请输入" v-model="form.confirmationTime" disabled />
                </el-form-item>
                <el-form-item label="签收人：" prop="signUserName">
                  <el-input placeholder="请输入" v-model="form.signUserName" disabled />
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  <el-input placeholder="请输入" v-model="form.signTime" disabled />
                </el-form-item>
                <el-form-item label="取消签收人：" prop="cancelSignUserName">
                  <el-input placeholder="请输入" v-model="form.cancelSignUserName" disabled />
                </el-form-item>
                <el-form-item label="取消签收时间：" prop="cancelSignTime">
                  <el-input placeholder="请输入" v-model="form.cancelSignTime" disabled />
                </el-form-item>
                <el-form-item label="作废人：" prop="cancellerName">
                  <el-input placeholder="请输入" v-model="form.cancellerName" disabled />
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  <el-input placeholder="请输入" v-model="form.cancelTime" disabled />
                </el-form-item>
                <el-form-item label="作废备注：" prop="cancelRemark">
                  <el-input placeholder="请输入" v-model="form.cancelRemark" disabled />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>结算收款信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="剩余应付金额：" prop="remainingPayableAmount">
                  <el-input placeholder="请输入" v-model="form.remainingPayableAmount" disabled />
                </el-form-item>
                <el-form-item label="结算操作人：" prop="settlerName">
                  <el-input placeholder="请输入" v-model="form.settlerName" disabled />
                </el-form-item>
                <el-form-item label="结算时间：" prop="settlementTime">
                  <el-input placeholder="请输入" v-model="form.settlementTime" disabled />
                </el-form-item>
                <el-form-item label="收款人：" prop="collectorName">
                  <el-input placeholder="请输入" v-model="form.collectorName" disabled />
                </el-form-item>
                <el-form-item label="收款时间：" prop="collectionTime">
                  <el-input placeholder="请输入" v-model="form.collectionTime" disabled />
                </el-form-item>
                <el-form-item label="取消结算人：" prop="cancelSettlerName">
                  <el-input placeholder="请输入" v-model="form.cancelSettlerName" disabled />
                </el-form-item>
                <el-form-item label="取消结算时间：" prop="cancelSettlementTime">
                  <el-input placeholder="请输入" v-model="form.cancelSettlementTime" disabled />
                </el-form-item>
                <el-form-item label="取消结算备注：" prop="cancelSettlementRemark">
                  <el-input placeholder="请输入" v-model="form.cancelSettlementRemark" disabled />
                </el-form-item>
                <el-form-item label="退款操作人：" prop="refundOperatorName">
                  <el-input placeholder="请输入" v-model="form.refundOperatorName" disabled />
                </el-form-item>
                <el-form-item label="退款操作时间：" prop="refundTime">
                  <el-input placeholder="请输入" v-model="form.refundTime" disabled />
                </el-form-item>
                <el-form-item label="退款备注：" prop="refundRemark">
                  <el-input placeholder="请输入" v-model="form.refundRemark" disabled />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail">
                <el-form-item label="备附件销售单：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseName">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="客户名称：" prop="customerName">
                  {{ form.customerName }}
                </el-form-item>
                <el-form-item label="客户类型：" prop="customerType">
                  {{ form.customerTypeLabel }}
                </el-form-item>
                <el-form-item label="客户联系方式：" prop="customerContactInfo">
                  {{ form.customerContactInfo }}
                </el-form-item>
                <el-form-item label="订单总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountTotalAmount">
                  {{ form.discountTotalAmount }}
                </el-form-item>
                <el-form-item label="应付总金额：" prop="payableTotalAmount">
                  {{ form.payableTotalAmount }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="routeCustomerType === '10' && !(isEditing || !_id)">
            <div class="common-section-header">
              <h2>车辆信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail">
                <el-form-item label="当前里程：" prop="currentMileage">
                  {{ form.currentMileage }}
                </el-form-item>
                <el-form-item label="车联网里程(KM)：" prop="iotMileage">
                  {{ form.iotMileage }}
                </el-form-item>
                <el-form-item label="车牌号：" prop="plateNumber">
                  {{ form.plateNumber }}
                </el-form-item>
                <el-form-item label="最近进店里程：" prop="latestVisitMileage">
                  {{ form.latestVisitMileage }}
                </el-form-item>
                <el-form-item label="车型名称：" prop="vehicleModelName">
                  {{ form.vehicleModelName }}
                </el-form-item>
                <el-form-item label="销售日期：" prop="saleDate">
                  {{ form.saleDate }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>开单签收信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail">
                <el-form-item label="开单人：" prop="orderCreatorName">
                  {{ form.orderCreatorName }}
                </el-form-item>
                <el-form-item label="开单时间：" prop="orderCreationTime">
                  {{ form.orderCreationTime }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmerName">
                  {{ form.confirmerName }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmationTime">
                  {{ form.confirmationTime }}
                </el-form-item>
                <el-form-item label="签收人：" prop="signUserName">
                  {{ form.signUserName }}
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  {{ form.signTime }}
                </el-form-item>
                <el-form-item label="取消签收人：" prop="cancelSignUserName">
                  {{ form.cancelSignUserName }}
                </el-form-item>
                <el-form-item label="取消签收时间：" prop="cancelSignTime">
                  {{ form.cancelSignTime }}
                </el-form-item>
                <el-form-item label="作废人：" prop="cancellerName">
                  {{ form.cancellerName }}
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                <el-form-item label="作废备注：" prop="cancelRemark">
                  {{ form.cancelRemark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>结算收款信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" class="form-detail">
                <el-form-item label="剩余应付金额：" prop="remainingPayableAmount">
                  {{ form.remainingPayableAmount }}
                </el-form-item>
                <el-form-item label="结算操作人：" prop="settlerName">
                  {{ form.settlerName }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="settlementTime">
                  {{ form.settlementTime }}
                </el-form-item>
                <el-form-item label="收款人：" prop="collectorName">
                  {{ form.collectorName }}
                </el-form-item>
                <el-form-item label="收款时间：" prop="collectionTime">
                  {{ form.collectionTime }}
                </el-form-item>
                <el-form-item label="取消结算人：" prop="cancelSettlerName">
                  {{ form.cancelSettlerName }}
                </el-form-item>
                <el-form-item label="取消结算时间：" prop="cancelSettlementTime">
                  {{ form.cancelSettlementTime }}
                </el-form-item>
                <el-form-item label="取消结算备注：" prop="cancelSettlementRemark">
                  {{ form.cancelSettlementRemark }}
                </el-form-item>
                <el-form-item label="退款操作人：" prop="refundOperatorName">
                  {{ form.refundOperatorName }}
                </el-form-item>
                <el-form-item label="退款操作时间：" prop="refundTime">
                  {{ form.refundTime }}
                </el-form-item>
                <el-form-item label="退款备注：" prop="refundRemark">
                  {{ form.refundRemark }}
                </el-form-item>
                <!-- <el-form-item label="反结算操作人：" prop="reverseSettlementOperator">
                  {{ form.reverseSettlementOperator }}
                </el-form-item>
                <el-form-item label="反结算操作人名称：" prop="reverseSettlementOperatorName">
                  {{ form.reverseSettlementOperatorName }}
                </el-form-item>
                <el-form-item label="反结算操作时间：" prop="reverseSettlementTime">
                  {{ form.reverseSettlementTime }}
                </el-form-item>
                <el-form-item label="反结算备注：" prop="reverseSettlementRemark">
                  {{ form.reverseSettlementRemark }}
                </el-form-item> -->

              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>收款明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="paymentData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="actualPaymentAmount" title="实付总额" min-width="20%" />
                  <vxe-column field="paymentMethodLabel" title="支付方式" min-width="20%" />
                  <vxe-column field="invoiceTypeLabel" title="发票类型" min-width="20%" />
                  <vxe-column field="invoiceNumber" title="发票号码" min-width="20%" />
                  <vxe-column field="createTime" title="创建时间" min-width="20%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>备附件明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select style="width: 300px;" :remote-method="queryListData" remote placeholder="请输入编码或名称" clearable
                    value-key="id" label-key="partName" subLabelKey="partCode" @change="handleAddTableData" filterable :disabled="!isOrderStatus" />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="sparePartCode" title="备件编码" width="200" />
                  <vxe-column field="sparePartName" title="备件名称" width="160" />
                  <vxe-column field="locationName" title="库位" width="120" />
                  <vxe-column field="availableQty" title="可用库存" width="100" />
                  <vxe-column field="priceTypeLabel" title="价格类型" width="100" />
                  <vxe-column field="unitPrice" title="单价" width="100" />
                  <vxe-column field="discountAmount" title="优惠金额" width="100" />
                  <vxe-column field="payableAmount" title="应付金额" width="100" />
                  <vxe-column field="qty" title="数量" width="100" />
                  <vxe-column field="outboundIsLabel" title="是否出库" width="100" />
                  <vxe-column field="operationOperatorName" title="出入库操作人" width="160" />
                  <vxe-column field="operationTime" title="出入库操作时间" width="160" />
                  <vxe-column field="createTime" title="创建时间" width="160" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="canDelete">
                    <template #default="{ row }">
                      <span
                        class="btn-edit"
                        v-if="(isDelete && row.outboundIs === '0') || (isEditSpare)"
                        @click="handleEdit(row)"
                      >
                        编辑
                      </span>
                      <el-popconfirm title="确定要删除吗？" v-if="isDelete && row.outboundIs === '0'" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(row)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
                <div class="table-pagination">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
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
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
        <SparePartsDetail
          ref="detailRef"
          :sparePartId="sparePartId"
          :isEditSpare="isEditSpare"
          :isNumber="isDelete"
          :outboundIs="outboundIs"
        />
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { spareParkList, getMileage, getVehicleProfile, getDetail, addOrUpdate, retailPaymentRecordPage, retailOrderDetailPage, addOrUpdateRetailOrderDetail, deleteRetailOrderDetail } from '@/api/sparepart/sale/retailOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getPartDealer, getLoginUser } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import SparePartsDetail from './SparePartsDetail';

const defaultForm = {
  // 多选时字段有变化，自行修复
  payableTotalAmount: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  ownerOrgId: '',
  currentMileage: '',
  iotMileage: '',
  plateNumber: '',
  latestVisitMileage: '',
  vehicleModelId: '',
  saleDate: '',
  orderCreator: '',
  orderCreatorName: '',
  orderCreationTime: '',
  confirmer: '',
  confirmerName: '',
  confirmationTime: '',
  signUser: '',
  signUserName: '',
  signTime: '',
  cancelSignUser: '',
  cancelSignUserName: '',
  cancelSignTime: '',
  canceller: '',
  cancellerName: '',
  cancelTime: '',
  cancelRemark: '',
  settler: '',
  settlerName: '',
  settlementTime: '',
  collector: '',
  collectorName: '',
  collectionTime: '',
  cancelSettler: '',
  cancelSettlerName: '',
  cancelSettlementTime: '',
  cancelSettlementRemark: '',
  refundOperator: '',
  refundOperatorName: '',
  refundTime: '',
  refundRemark: '',
  reverseSettlementOperator: '',
  reverseSettlementOperatorName: '',
  reverseSettlementTime: '',
  reverseSettlementRemark: '',
  code: '',
  dealerCode: '',
  dealerName: '',
  cooperationType: '',
  warehouseId: '',
  customerType: '',
  vin: '',
  customerCode: '',
  customerName: '',
  warehouseName: '',
  orderStatus: '10',
  totalAmount: '',
  customerContactInfo: '',
  discountTotalAmount: '',
  remark: '',
  remainingPayableAmount: '',
  updateTime: '',
};

export default {
  name: 'retailOrderEdit',
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
    },
    title () {
      return '应付总金额：' + this.form.payableTotalAmount;
    },
    isOrderStatus () { // 是够可添加备件
      return ['10', '20', '330'].includes(this.form.orderStatus);
    },
    isDelete () { // 是否可删除 备件   可以编辑备件的【销售数量】
      return ['10', '20'].includes(this.form.orderStatus);
    },
    isEditSpare () { // 是否可编辑备件 【价格类型】【优惠金额】
      return ['10', '20', '30', '40', '50'].includes(this.form.orderStatus);
    },
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
    $route: {
      handler (newRoute) { // 直接监听整个路由 去获取 路由值 判断是对公还是对车主
        const newType = newRoute.query.customerType;
        if (newType) {
          this.routeCustomerType = newRoute.query.customerType;
          this.form.customerType = newType;
          this.form.customerTypeLabel = newType === '10' ? '车主' : '对公';
        }
      },
      immediate: true
    },
    'form.code': {
      handler (val) {
        if (val) {
          this.routeCustomerType = this.form.customerType;
        }
      },
      immediate: false,
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备附件销售',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-retailOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      routeCustomerType: '',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        vin: [
          { required: true, message: '请输入后6位VIN', trigger: 'blur' }
        ],
        currentMileage: [
          { required: true, message: '请输入当前里程', trigger: 'blur' }
        ],
        customerContactInfo: [
          { required: true, message: '请输入客户联系信息', trigger: 'blur' }
        ],
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      paymentData: [], // 收款明细
      sparePartId: '', // 备件详情ID
      outboundIs: '', // 是否出库
    };
  },
  mounted () {
    this.initDealerUser();
  },
  methods: {
    async handleVinChange (val, ele) {
      this.form.customerName = ele.vehicleProfileOwnerResp.ownerName;
      this.form.plateNumber = ele.vehiclePlateNo;
      this.form.vehicleModelId = ele.vehicleModelId;
      this.form.vehicleModelName = ele.vehicleModelName;
      this.form.saleDate = ele.saleDate;
      try {
        const res = await getMileage({ vin: val });
        console.log('res', JSON.stringify(res));
        this.form.latestVisitMileage = res.latestVisitMileage;
        this.form.iotMileage = res.iotMileage;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getVinList (query) {
      if (!query || query.length < 6) {
        return [];
      }
      try {
        const res = await getVehicleProfile({ searchVin: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.form.dealerCode = res.currentDealerCode;// 当前门店code
      this.form.dealerName = res.currentDealerName;// 当前门店名称

      // 查询当前门店信息 公司
      const resDealer = await getPartDealer({ code: this.form.dealerCode });

      this.form.companyCode = resDealer.parentCompanyCode;// 当前门店code
      this.form.companyName = resDealer.parentCompanyName;// 当前门店名称

      this.form.warehouseName = resDealer.warehouseName;
      this.form.warehouseId = resDealer.warehouseId;// 当前门店code
      this.form.warehouseCode = resDealer.warehouseCode;// 当前门店名称
    },
    async detailRequest () {
      const id = this._id;

      if (!id) return;

      try {
        const res = await getDetail(id);
        this.form = res;
        this.routeCustomerType = res.customerType;
        this.getPayment();
        this.getData();

        return res;
      } catch (error) {
        console.log('error', error);
      }
    },
    // 请求收款明细接口
    async getPayment () {
      const res = await retailPaymentRecordPage({ retailOrderId: this._id });
      this.paymentData = res.records || [];
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 编辑详情
    handleEdit (row) {
      this.sparePartId = row.id;
      this.outboundIs = row.outboundIs;
      this.openPane();
    },
    // 删除子表数据
    handleDeleteRow (val) {
      // 根据需求调用接口
      deleteRetailOrderDetail([val.id]).then(res => {
        this.$message.success('删除成功');
        this.getData();
      });
    },
    // 备件远程搜索
    async queryListData (query) {
      try {
        const res = await spareParkList({ partCodeOrNameLike: query, id: this._id });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
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
      this.sparePartId = val;
      const params = {
        retailOrderId: this._id,
        sparePartId: val
      };
      addOrUpdateRetailOrderDetail(params).then(res => {
        this.getData();
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
    // 获取调拨明细
    async getData () {
      const params = {
        retailOrderId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await retailOrderDetailPage(params);
      this.total = res.total || 0;
      this.tableData = res.records || [];
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    },
    // 保存侧边栏数据
    handleSave () {
      this.$refs.detailRef.handleSave();
      this.$refs.containerRef.loadDetail();
      this.$refs.editLayout.closePane();
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-edit{
  margin: 0 5px;
  cursor: pointer;
  color:#4C4CD6;
}
</style>
