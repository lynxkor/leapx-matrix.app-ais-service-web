<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="`${title}${form.code}`" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest">
        <template #extraButtons>
          <el-button v-if="_id && permissions.has('AISPART-returnOrder-printReturn')" type="primary" size="small" @click="handlePrint">打印退货单</el-button>
          <el-button v-if="_id && permissions.has('AISPART-returnOrder-printTag')" type="primary" size="small" @click="handlePrintLabel">打印退货标签</el-button>
          <el-button v-if="_id && form.returnStatus === '20' && permissions.has('AISPART-returnOrder-agree')" type="primary" size="small" @click="handleAgree">同意</el-button>
          <el-button v-if="_id && form.returnStatus === '40' && permissions.has('AISPART-returnOrder-revoke')" type="primary" size="small" @click="handleRevoke">撤回</el-button>
          <el-button v-if="_id && ['10', '30'].includes(form.returnStatus) && permissions.has('AISPART-returnOrder-commit')" type="primary" size="small" @click="handleCommit">提交</el-button>
          <el-button v-if="_id && ['10', '30'].includes(form.returnStatus) && permissions.has('AISPART-returnOrder-cancel')" type="primary" size="small" @click="handleCancel">作废</el-button>
          <el-button v-if="_id && form.returnStatus === '20' && permissions.has('AISPART-returnOrder-reject')" type="primary" size="small" @click="handleReject">驳回</el-button>
          <el-button v-if="_id && form.returnStatus === '40' && permissions.has('AISPART-returnOrder-shipping')" type="primary" size="small" @click="handleShipping">发运</el-button>
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
                  <el-input v-model="form.code" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="退货类型：" prop="returnType">
                  <fetch-select :request="fetchOptions" enumCode="ReturnTypeEnum" v-model="form.returnType"
                    placeholder="请选择" clearable filterable :disabled="!!_id && !canEditReturnType" />
                </el-form-item>
                <el-form-item label="退货原因：" prop="returnReason">
                  <fetch-select :request="fetchOptions" enumCode="ReturnReasonEnum" v-model="form.returnReason"
                    placeholder="请选择" clearable filterable :disabled="accountFlag && !isEditable" />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <fetch-select :remote-method="getDealerList" remote v-model="form.dealerCode" placeholder="请输入门店编码或名称"
                    labelKey="orgName" valueKey="orgCode" subLabelKey="orgCode" clearable collapseTags filterable :disabled="isDealerCode"
                    @change="handleDealerChange" />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input v-model="form.dealerName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  <el-input v-model="form.warehouseName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="退货状态：" prop="returnStatus">
                  <el-input v-model="form.returnStatusLabel" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input type="textarea" maxlength="500" show-word-limit placeholder="请输入" v-model="form.remark" clearable :disabled="accountFlag && !isEditable" />
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
                  <el-input v-model="form.logisticsOrderNo" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  <el-input v-model="form.logisticsProvider" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="发货时间：" prop="deliveryTime">
                  <el-input v-model="form.deliveryTime" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  <el-input v-model="form.logisticsRemark" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="收货主机厂仓库：" prop="receiveWarehouseId">
                  <fetch-select :remote-method="getReceiveWarehouse" remote v-model="form.receiveWarehouseId"
                    placeholder="请选择" labelKey="warehouseName" valueKey="id" subLabelKey="warehouseCode" clearable
                    filterable @change="handleReceiveWarehouseChange" :disabled="isReceiveWarehouseDisabled" />
                </el-form-item>
                <el-form-item label="收货人：" prop="receiver">
                  <el-input placeholder="请输入" v-model="form.receiver" clearable :disabled="_id && isReceiveWarehouseDisabled" />
                </el-form-item>
                <el-form-item label="收货人联系电话：" prop="receiverPhone">
                  <el-input placeholder="请输入" v-model="form.receiverPhone" clearable :disabled="_id && isReceiveWarehouseDisabled" />
                </el-form-item>
                <el-form-item label="收货地址：" prop="receiveAddress">
                  <el-input placeholder="请输入" v-model="form.receiveAddress" clearable :disabled="_id && isReceiveWarehouseDisabled" />
                </el-form-item>
                <el-form-item label="物流支付方式：" prop="logisticsPaymentMethod">
                  <fetch-select :request="fetchOptions" enumCode="PurchaseLogisticsPaymentMethodEnum"
                    v-model="form.logisticsPaymentMethod" placeholder="请选择" clearable filterable :disabled="isReceiveWarehouseDisabled" />
                </el-form-item>
                <el-form-item label="退货完成时间：" prop="returnCompleteTime">
                  <el-input v-model="form.returnCompleteTime" placeholder="请输入" disabled></el-input>
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
                  <el-input v-model="form.returnPriceRatio" placeholder="请输入" type="number" disabled></el-input>
                </el-form-item>
                <el-form-item label="退款完成时间：" prop="refundCompleteTime">
                  <el-input v-model="form.refundCompleteTime" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="预计退货返利总金额：" prop="estimatedReturnRebateAmount">
                  <el-input v-model="form.estimatedReturnRebateAmount" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="实际退货返利总金额：" prop="actualReturnRebateAmount">
                  <el-input v-model="form.actualReturnRebateAmount" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="预计退货现金总金额：" prop="estimatedReturnCashAmount">
                  <el-input v-model="form.estimatedReturnCashAmount" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="实际退货现金总金额：" prop="actualReturnCashAmount">
                  <el-input v-model="form.actualReturnCashAmount" placeholder="请输入" disabled></el-input>
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
                  <el-input v-model="form.submitterName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-input v-model="form.submitTime" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="审核人：" prop="reviewer">
                  <el-input v-model="form.reviewerName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="审核时间：" prop="reviewTime">
                  <el-input v-model="form.reviewTime" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="审核说明：" prop="reviewDescription">
                  <el-input v-model="form.reviewDescription" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="作废人：" prop="cancelOperator">
                  <el-input v-model="form.cancelOperatorName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  <el-input v-model="form.cancelTime" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelDescription">
                  <el-input v-model="form.cancelDescription" placeholder="请输入" disabled></el-input>
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>常规信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
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
              <el-form :inline="true" class="form-detail">
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
              <el-form :inline="true" class="form-detail">
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
              <el-form :inline="true" class="form-detail">
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="审核人：" prop="reviewer">
                  {{ form.reviewerName }}
                </el-form-item>
                <el-form-item label="审核时间：" prop="reviewTime">
                  {{ form.reviewTime }}
                </el-form-item>
                <el-form-item label="审核说明：" prop="reviewDescription">
                  {{ form.reviewDescription }}
                </el-form-item>
                <el-form-item label="作废人：" prop="cancelOperator">
                  {{ form.cancelOperatorName }}
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
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>出库明细信息 <el-button size="mini" v-if="isEditable" @click="handleImport">导入备件</el-button> <el-button size="mini" v-if="isEditable" @click="addPart">添加备件</el-button></h2>
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
                    <vxe-column field="partCode" title="备件编码" width="120" />
                    <vxe-column field="partName" title="备件名称" width="120" />
                    <vxe-column field="returnQty" title="退货数量" width="120" />
                    <vxe-column field="qualifiedQty" title="合格数量" width="120" />
                    <vxe-column field="deliveryOrderNo" title="交货单号" width="120" />
                    <vxe-column field="salesVoucher" title="销售凭证" width="120" />
                    <vxe-column field="inboundOrderCode" title="入库单号" width="120" />
                    <vxe-column field="purchaseOrderCode" title="采购订单号" width="130" />
                    <vxe-column field="purchaseCashUnitPrice" title="采购现金单价" width="140" />
                    <vxe-column field="purchaseRebateUnitPrice" title="采购返利单价" width="140" />
                    <vxe-column field="returnCashUnitPrice" title="退货现金单价" width="140" />
                    <vxe-column field="estimatedReturnCashAmount" title="预计退货现金金额" width="160" />
                    <vxe-column field="actualReturnCashAmount" title="实际退货现金金额" width="160" />
                    <vxe-column field="returnRebateUnitPrice" title="退货返利单价" width="140" />
                    <vxe-column field="estimatedReturnRebateAmount" title="预计退货返利金额" width="160" />
                    <vxe-column field="actualReturnRebateAmount" title="实际退货返利金额" width="160" />
                    <vxe-column field="remark" title="备注" width="120" />
                    <vxe-column title="操作" width="100" fixed="right">
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
          <section class="common-section" v-if="_id">
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
        <AddSpareParts ref="addSpareParts" :id="form.warehouseId" :returnOrderId="_id" :visible="sparePartsVisible" @close="dialogClose" @success="dialogSuccess" />
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
    <Upload
      :visible="uploadDialogVisible"
      :businessParams="_id"
      id="sparePartPurchaseReturnDetailImport"
      @close="handleUploadDialogClose"
    />
    <!-- 发运 -->
    <ShipmentDialog
      :visible.sync="shipmentDialogVisible"
      :id="shipmentId"
      @update:visible="val => shipmentDialogVisible = val"
      @success="handleRefresh"
    />
  </edit-page-layout>
</template>

<script>
import {
  getDetail, addOrUpdate, returnOrderPage, exceptionPage, returnOrderDel,
  returnOrderCancel, returnOrderAgree, returnOrderRevoke, returnOrderCommit, returnOrderReject
} from '@/api/sparepart/return/returnOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam, listWarehouse, listOemWarehouse, getLoginUser, getPartDealer, listOemFull } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AddSpareParts from './AddSpareParts.vue';
import Upload from '@/libs/components/UploadDialog';
import { handleCommonAction, handleCommonPrompt } from '@/libs/utils/index';
import ShipmentDialog from './ShipmentDialog.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerCode: '',
  dealerName: '',
  warehouseId: '',
  warehouseName: '',
  returnReason: '',
  returnStatus: '10',
  returnStatusLabel: '草稿',
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
  returnType: '20',
  logisticsRemark: '',
  receiveWarehouseId: '',
  receiver: '',
  receiverPhone: '',
  receiveAddress: '',
  logisticsPaymentMethod: '20',
  returnCompleteTime: '',
  returnPriceRatio: 1,
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

const ACTION_CONFIG = { // 按钮配置
  agree: { title: '是否同意退货申请?', success: '同意成功' },
  revoke: { title: '是否撤回退货申请?', success: '撤回成功' },
  commit: { title: '是否提交退货申请?', success: '提交成功' },
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
    FetchSelect,
    AddSpareParts,
    Upload,
    ShipmentDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    isEditable () {
      // 只有在状态为 10 或 30 时才允许编辑
      return this.form.returnStatus === '10' || this.form.returnStatus === '30';
    },
    isReturnStatus () {
      // 只有在状态为 20 时才允许 修改
      return this.form.returnStatus === '20' || this.form.returnStatus === 20;
    },
    // 退货类型、备注 编辑权限：门店(10/30) 或 厂端(20)
    canEditReturnType () {
      return (this.accountFlag && this.isEditable) || (!this.accountFlag && this.isReturnStatus);
    },
    // 收货人信息 编辑权限：只有门店(10/30)可编辑
    canEditReceiver () {
      return this.accountFlag && this.isEditable;
    },
    // 仓库、支付方式 收货人信息 编辑权限：新增都可填，编辑时厂端+20才可编辑
    isReceiveWarehouseDisabled () {
      const hasId = !!(this.id || this.$route.query.id || this.form.id);
      const isFactory = !this.accountFlag; // 厂端账号
      const isStatus20 = this.form.returnStatus === '20' || this.form.returnStatus === 20;
      // 编辑时：厂端+20可编辑(返回false)，其他禁用(返回true)
      return hasId && !(isFactory && isStatus20);
    },
    // 新增时 门店账号禁用  然后 看是否在编辑时 是直接禁用
    isDealerCode () {
      // 1. 判断是否为编辑模式（任意位置有 ID 即为编辑）
      const hasId = this.id || this.$route.query.id || this.form.id;

      // 2. 如果是编辑模式，直接禁用
      if (hasId) {
        return true;
      }

      // 3. 如果是新增模式，看 accountFlag 决定（假设 accountFlag 为 false 时禁用）
      return this.accountFlag;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        } else if (!val) {
          this.getDetailData();
          this.getList();
        }
      },
      immediate: true
    },
    'form.returnType': {
      handler (val) {
        if (val === '20') {
          this.form.returnPriceRatio = 1;
        } else if (val === '10') {
          this.form.returnPriceRatio = 0.75;
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
      title: '备件退货单号：',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-returnOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      accountFlag: false, // 账号类型 true为门店  false为厂端
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
      sparePartsVisible: false,
      warehouseId: '', // 备件仓库ID
      uploadDialogVisible: false,
      shipmentDialogVisible: false, // 发运弹窗
      shipmentId: '', // 发运弹窗id
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      abnormalColumns: [
        {
          field: 'partCode',
          title: '备件编码',
          width: '16%',
        },
        {
          field: 'partName',
          title: '备件名称',
          width: '16%',
        },
        {
          field: 'backQty',
          title: '缺货数量',
          width: '16%',
        },
        {
          field: 'unqualifiedQty',
          title: '不合格数量',
          width: '16%',
        },
        {
          field: 'wmsRemark',
          title: 'wms备注',
          width: '16%',
        },
        {
          field: 'remark',
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
          { required: true, message: '请输入收货主机厂仓库', trigger: 'change' }
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
      },
      lastDealerCode: '', // 新增：记录上一次的门店编码
    };
  },
  async mounted () {
    await this.initDealerUser();
    // 新增页面默认加载 LS02 仓库并赋值
    if (!this._id) {
      await this.loadDefaultWarehouse();
    }
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

    async getWarehouseByDealer (query) {
      try {
        const res = await listWarehouse({ dealerCode: query });
        this.form.warehouseId = res[0].id;
        this.form.warehouseName = res[0].name;
        console.log(JSON.stringify());
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },

    async getReceiveWarehouse (query) {
      try {
        const res = await listOemFull({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 新增页面默认加载 LS02 仓库并赋值
    async loadDefaultWarehouse () {
      try {
        const res = await listOemFull({ warehouseCode: 'LS02' });
        if (res && res.length > 0) {
          const defaultWarehouse = res[0];
          this.form.receiveWarehouseId = defaultWarehouse.id;
          this.handleReceiveWarehouseChange(defaultWarehouse.id, defaultWarehouse);
        }
      } catch (error) {
        console.error('Error loading default warehouse:', error);
      }
    },
    // 点击选择收货主机厂仓库，带出收货人、联系电话、地址、仓库名称、
    handleReceiveWarehouseChange (val, ele) {
      this.form.receiver = ele.contactName;
      this.form.receiverPhone = ele.contactPhone;
      this.form.receiveAddress = ele.address;
      this.form.receiveWarehouseName = ele.warehouseName;
    },
    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.accountFlag = res.accountFlag;
      this.form.dealerCode = res.currentDealerCode;// 当前门店code
      this.form.dealerName = res.currentDealerName;// 当前门店名称
      if (this.accountFlag === true) {
        const res = await getPartDealer({ code: this.form.dealerCode });
        this.form.warehouseId = res.warehouseId;
        this.form.warehouseName = res.warehouseName;
      }
    },
    // 点击带出门店名称
    handleDealerChange (val, ele) {
      this.form.dealerName = ele.orgName;
      this.getWarehouseByDealer(ele.orgCode);
      // this.$nextTick(() => {
      //   if (!val) return; // 过滤无效事件

      //   // 新增页面：首次选择直接赋值
      //   if (!this._id && !this.lastDealerCode) {
      //     this.form.dealerName = ele.orgName;
      //     this.getWarehouseByDealer(ele.orgCode);
      //   } else {
      //   // 编辑页面或非首次选择：弹出确认
      //     this.$confirm('切换门店,将清空所有退货信息,是否继续?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       this.form.dealerName = ele.orgName;
      //       this.getWarehouseByDealer(ele.orgCode);
      //     }).catch(() => {
      //       // 取消操作
      //     });
      //   }
      //   // 更新上一次的编码
      //   this.lastDealerCode = this.form.dealerCode;
      // });
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
    async getDetailData () {
      const res = await returnOrderPage({
        returnOrderId: this._id,
        pageNum: this.current,
        pageSize: this.pageSize
      });
      this.tableData = res.records || [];
      this.total = res.total || 0;
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
    async getList () {
      const res = await exceptionPage({
        returnOrderId: this._id,
        pageNum: this.abnormal.current,
        pageSize: this.abnormal.pageSize
      });
      this.abnormalTableData = res.records || [];
      this.abnormal.total = res.total || 0;
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
    // 打开添加备弹窗
    addPart () {
      this.sparePartsVisible = true;
    },
    dialogClose () {
      this.sparePartsVisible = false;
    },
    // 添加成功 表格接口刷新
    dialogSuccess () {
      this.sparePartsVisible = false;
      this.$refs.containerRef.loadDetail();
      this.getDetailData();
    },
    async handleDel (row) {
      await returnOrderDel([row.id]);
      this.$refs.containerRef.loadDetail();
      this.getDetailData();
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    // 打印退货单
    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'SparePartsReturn', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}备件退货单`// 可选，打印标题
      });
    },
    // 打印退货标签
    handlePrintLabel () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'SparePartsReturnLabel', // 必选，对应 ./template/文件名.vue
        title: '备件退货标签'// 可选，打印标题
      });
    },
    // 调用二次确认弹框
    _handleAction (apiFn, config) {
      handleCommonAction({
        $confirm: this.$confirm,
        $message: this.$message,
        apiFn,
        id: this._id,
        config,
        onSuccess: () => this.$refs.containerRef.loadDetail()
      });
    },
    // 同意退货
    async handleAgree () {
      await this._handleAction(returnOrderAgree, ACTION_CONFIG.agree);
    },
    // 撤回退货
    async handleRevoke () {
      await this._handleAction(returnOrderRevoke, ACTION_CONFIG.revoke);
    },
    // 提交退货
    async handleCommit () {
      await this._handleAction(returnOrderCommit, ACTION_CONFIG.commit);
    },
    // 通用 备注弹窗
    _execPrompt (api, title, placeholder, successMsg) {
      handleCommonPrompt({
        $prompt: this.$prompt,
        $message: this.$message,
        apiFn: api,
        id: this._id,
        config: {
          title,
          placeholder,
          success: successMsg
        },
        onSuccess: () => this.$refs.containerRef.loadDetail()
      });
    },
    // 作废退货
    // async handleCancel () {
    //   this.$prompt('请输入作废说明', '作废', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPattern: /.+/, // 校验非空
    //     inputErrorMessage: '请输入备注',
    //   }).then(async ({ value }) => {
    //     // 调用 API，并传入用户输入的备注
    //     await returnOrderCancel({ id: this._id, reviewDescription: value });
    //     this.$message.success('作废成功');
    //     // 执行额外回调（比如刷新列表）
    //     this.$refs.containerRef.loadDetail();
    //   }).catch(() => {
    //     // 用户取消或校验失败，静默处理
    //   });
    // },
    // 作废
    async handleCancel () {
      const result = await this.$prompt('请输入作废说明', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      const reviewDescription = result.value;
      if (!reviewDescription) {
        return this.$message.warning('请输入作废说明');
      }
      const params = { id: this._id, reviewDescription };
      await returnOrderCancel(params);
      this.handleRefresh();
    },
    // 驳回
    async handleReject () {
      const result = await this.$prompt('请输入审批意见', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      const reviewDescription = result.value;
      if (!reviewDescription) {
        return this.$message.warning('请输入审批意见');
      }
      const params = { id: this._id, reviewDescription };
      await returnOrderReject(params);
      this.handleRefresh();
    },
    // 刷新接口
    handleRefresh () {
      this.$refs.containerRef.loadDetail();
    },
    // 发运
    handleShipping () {
      this.shipmentId = this._id;
      this.shipmentDialogVisible = true;
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
