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
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="备件退货单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
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
                <el-form-item label="备件仓库ID：" prop="warehouseId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warehouseId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退货原因:滞销件回购,门店退网,活动件回购,错发,重复铺货,系统信息错误,其他：" prop="returnReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退货状态:草稿,审核中,已驳回,审核通过,已发运,已退货,已退款,已作废：" prop="returnStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.returnStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsOrderNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsProvider"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发货时间：" prop="deliveryTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.deliveryTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
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
                <el-form-item label="数据来源，150:零小跑; 10:E10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
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
                <el-form-item label="入库状态:无需入库,待入库,已入库：" prop="warehousingStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.warehousingStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="退货类型:被动退货,主动退货：" prop="returnType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.returnType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收货主机厂仓库ID：" prop="receiveWarehouseId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiveWarehouseId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收货人：" prop="receiver">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiver"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收货人联系电话：" prop="receiverPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收货地址：" prop="receiveAddress">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiveAddress"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流支付方式:寄付,到付：" prop="logisticsPaymentMethod">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsPaymentMethod"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退货完成时间：" prop="returnCompleteTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.returnCompleteTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="退货价格比例:1.00,0.75：" prop="returnPriceRatio">
                  <el-input
                    placeholder="请输入"
                    v-model="form.returnPriceRatio"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退款完成时间：" prop="refundCompleteTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.refundCompleteTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="预计退货返利总金额：" prop="estimatedReturnRebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.estimatedReturnRebateAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实际退货返利总金额：" prop="actualReturnRebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.actualReturnRebateAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="预计退货现金总金额：" prop="estimatedReturnCashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.estimatedReturnCashAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实际退货现金总金额：" prop="actualReturnCashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.actualReturnCashAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.submitter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.submitTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="审核人：" prop="reviewer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reviewer"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审核时间：" prop="reviewTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.reviewTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="审核说明：" prop="reviewDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reviewDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.outboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="作废人：" prop="cancelOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作人：" prop="warehousingOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warehousingOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="warehousingTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.warehousingTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件退货单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库ID：" prop="warehouseId">
                  {{ form.warehouseId }}
                </el-form-item>
                <el-form-item label="退货原因:滞销件回购,门店退网,活动件回购,错发,重复铺货,系统信息错误,其他：" prop="returnReason">
                  {{ form.returnReason }}
                </el-form-item>
                <el-form-item label="退货状态:草稿,审核中,已驳回,审核通过,已发运,已退货,已退款,已作废：" prop="returnStatus">
                  {{ form.returnStatus }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="发货时间：" prop="deliveryTime">
                  {{ form.deliveryTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="数据来源，150:零小跑; 10:E10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  {{ form.purchaseOrderType }}
                </el-form-item>
                <el-form-item label="入库状态:无需入库,待入库,已入库：" prop="warehousingStatus">
                  {{ form.warehousingStatus }}
                </el-form-item>
                <el-form-item label="退货类型:被动退货,主动退货：" prop="returnType">
                  {{ form.returnType }}
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  {{ form.logisticsRemark }}
                </el-form-item>
                <el-form-item label="收货主机厂仓库ID：" prop="receiveWarehouseId">
                  {{ form.receiveWarehouseId }}
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
                <el-form-item label="物流支付方式:寄付,到付：" prop="logisticsPaymentMethod">
                  {{ form.logisticsPaymentMethod }}
                </el-form-item>
                <el-form-item label="退货完成时间：" prop="returnCompleteTime">
                  {{ form.returnCompleteTime }}
                </el-form-item>
                <el-form-item label="退货价格比例:1.00,0.75：" prop="returnPriceRatio">
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
                <el-form-item label="出库操作人：" prop="outboundOperator">
                  {{ form.outboundOperator }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
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
                <el-form-item label="入库操作人：" prop="warehousingOperator">
                  {{ form.warehousingOperator }}
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="warehousingTime">
                  {{ form.warehousingTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
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
import { getEnum } from '@/api/common';
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
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
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
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        code: [
          { required: true, message: '请输入备件退货单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '请输入备件仓库ID', trigger: 'change' }
        ],
        returnReason: [
          { required: true, message: '请输入退货原因:滞销件回购,门店退网,活动件回购,错发,重复铺货,系统信息错误,其他', trigger: 'change' }
        ],
        returnStatus: [
          { required: true, message: '请选择退货状态:草稿,审核中,已驳回,审核通过,已发运,已退货,已退款,已作废', trigger: 'change' }
        ],
        logisticsOrderNo: [
          { required: true, message: '请输入物流单号', trigger: 'change' }
        ],
        logisticsProvider: [
          { required: true, message: '请输入物流商', trigger: 'change' }
        ],
        deliveryTime: [
          { required: true, message: '请选择发货时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:零小跑; 10:E10', trigger: 'change' }
        ],
        purchaseOrderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        warehousingStatus: [
          { required: true, message: '请选择入库状态:无需入库,待入库,已入库', trigger: 'change' }
        ],
        returnType: [
          { required: true, message: '请选择退货类型:被动退货,主动退货', trigger: 'change' }
        ],
        logisticsRemark: [
          { required: true, message: '请输入物流备注', trigger: 'change' }
        ],
        receiveWarehouseId: [
          { required: true, message: '请输入收货主机厂仓库ID', trigger: 'change' }
        ],
        receiver: [
          { required: true, message: '请输入收货人', trigger: 'change' }
        ],
        receiverPhone: [
          { required: true, message: '请输入收货人联系电话', trigger: 'change' }
        ],
        receiveAddress: [
          { required: true, message: '请输入收货地址', trigger: 'change' }
        ],
        logisticsPaymentMethod: [
          { required: true, message: '请输入物流支付方式:寄付,到付', trigger: 'change' }
        ],
        returnCompleteTime: [
          { required: true, message: '请选择退货完成时间', trigger: 'change' }
        ],
        returnPriceRatio: [
          { required: true, message: '请输入退货价格比例:1.00,0.75', trigger: 'change' }
        ],
        refundCompleteTime: [
          { required: true, message: '请选择退款完成时间', trigger: 'change' }
        ],
        estimatedReturnRebateAmount: [
          { required: true, message: '请输入预计退货返利总金额', trigger: 'change' }
        ],
        actualReturnRebateAmount: [
          { required: true, message: '请输入实际退货返利总金额', trigger: 'change' }
        ],
        estimatedReturnCashAmount: [
          { required: true, message: '请输入预计退货现金总金额', trigger: 'change' }
        ],
        actualReturnCashAmount: [
          { required: true, message: '请输入实际退货现金总金额', trigger: 'change' }
        ],
        submitter: [
          { required: true, message: '请输入提交人', trigger: 'change' }
        ],
        submitTime: [
          { required: true, message: '请选择提交时间', trigger: 'change' }
        ],
        reviewer: [
          { required: true, message: '请输入审核人', trigger: 'change' }
        ],
        reviewTime: [
          { required: true, message: '请选择审核时间', trigger: 'change' }
        ],
        reviewDescription: [
          { required: true, message: '请输入审核说明', trigger: 'change' }
        ],
        outboundOperator: [
          { required: true, message: '请输入出库操作人', trigger: 'change' }
        ],
        outboundTime: [
          { required: true, message: '请选择出库操作时间', trigger: 'change' }
        ],
        cancelOperator: [
          { required: true, message: '请输入作废人', trigger: 'change' }
        ],
        cancelTime: [
          { required: true, message: '请选择作废时间', trigger: 'change' }
        ],
        cancelDescription: [
          { required: true, message: '请输入作废说明', trigger: 'change' }
        ],
        warehousingOperator: [
          { required: true, message: '请输入入库操作人', trigger: 'change' }
        ],
        warehousingTime: [
          { required: true, message: '请选择入库操作时间', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
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
    }
  }
};
</script>
