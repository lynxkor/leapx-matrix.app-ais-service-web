<template>
  <edit-page-layout ref="editLayout" :title="detailTitle" class="purchase-apply">
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="`${title}${form.code}`" :form.sync="form"
        :submitRequest="submitRequest" :isEditing.sync="isEditing" :originalForm.sync="originalForm"
        :detailRequest="detailRequest" :showEditBtn="routeQueryType">
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">{{ form.orderStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="showSubmit" plain size="small" :loading="actionLoading" @click="handleSubmit(form)">提交</el-button>
          <el-button v-if="showAgree" plain size="small" @click="handleAgree(form)">同意</el-button>
          <el-button v-if="showReject" plain size="small" :loading="actionLoading" @click="handleReject(form)">驳回</el-button>
          <el-button v-if="showCopy" type="primary" size="small" :loading="actionLoading" @click="handleCopy(form)">复制</el-button>
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
                    labelKey="orgCode" valueKey="orgCode" subLabelKey="orgName" clearable filterable
                    :disabled="isEditing || accountFlag" @change="handleDealerChange" />
                </el-form-item>
                <el-form-item label="采购申请单：" prop="code">
                  <el-input placeholder="请输入" v-model="form.code" disabled />
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  <el-select v-model="form.purchaseOrderType" placeholder="请选择" clearable filterable
                    @change="handleOrderTypeChange">
                    <el-option v-for="item in purchaseOrderTypeOptions" :key="item.code" :label="item.message"
                      :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <fetch-select :request="fetchOptions" enumCode="PurchaseApplyStatusEnum" v-model="form.orderStatus"
                    placeholder="请选择" disabled clearable filterable />
                </el-form-item>
                <el-form-item label="公司名称：" prop="companyCode">
                  <el-input placeholder="请输入" v-model="form.companyName" disabled />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input placeholder="请输入" v-model="form.dealerName" disabled />
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
                  <el-input placeholder="请输入" v-model="form.warehouseName" disabled />
                </el-form-item>
                <el-form-item label="是否第三方收货：" prop="thirdPartyDeliveryIs">
                  <el-radio-group v-model="form.thirdPartyDeliveryIs" :disabled="!isThirdPartyDelivery">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="收货人姓名：" prop="recipientName">
                  <el-input placeholder="请输入" v-model="form.recipientName" clearable :disabled="isAllowOrNot" />
                </el-form-item>
                <el-form-item label="收货人电话：" prop="recipientPhone">
                  <el-input placeholder="请输入" v-model="form.recipientPhone" clearable :disabled="isAllowOrNot" />
                </el-form-item>
                <el-form-item label="省市区：" prop="provinceCityCountyCode">
                  <el-cascader placeholder="请选择省市区" v-model="form.provinceCityCountyCode" :props="orgProps"
                    :options="areaOptions" filterable clearable :disabled="isAllowOrNot" />
                </el-form-item>
                <el-form-item label="收货地址：" prop="address">
                  <el-input placeholder="请输入" v-model="form.address" clearable :disabled="isAllowOrNot" />
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="isEditing || !_id">审批信息</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="提交人：" prop="submitter">
                  <el-input placeholder="请输入" v-model="form.submitterName" disabled />
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-input placeholder="请输入" v-model="form.submitTime" disabled />
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  <el-input placeholder="请输入" v-model="form.approverName" disabled />
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  <el-input placeholder="请输入" v-model="form.approvalTime" disabled />
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  <el-input type="textarea" maxlength="500" show-word-limit placeholder="请输入" v-model="form.approvalDescription" clearable disabled />
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="isEditing || !_id">资金信息</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="采购金额：" prop="purchaseAmount">
                  <el-input placeholder="请输入" v-model="form.purchaseAmount" disabled />
                </el-form-item>
                <el-form-item label="使用现金：" prop="cashAmount">
                  <el-input placeholder="请输入" v-model="form.cashAmount" disabled />
                </el-form-item>
                <el-form-item label="使用返利：" prop="rebateAmount">
                  <el-input placeholder="请输入" v-model="form.rebateAmount" disabled />
                </el-form-item>
                <el-form-item label="现金可用资金：" prop="cashAvailableAmount">
                  <el-input placeholder="请输入" v-model="form.cashAvailableAmount" disabled />
                </el-form-item>
                <el-form-item label="返利可用资金：" prop="rebateAvailableAmount">
                  <el-input placeholder="请输入" v-model="form.rebateAvailableAmount" disabled />
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="isEditing || !_id">其他信息</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="缺货单号：" prop="backOrderId">
                  <el-input placeholder="请输入" v-model="form.backOrderCode" disabled />
                </el-form-item>
                <el-form-item label="原价券：" prop="originalPriceCouponId">
                  <el-input placeholder="请输入" v-model="form.originalPriceCouponId" disabled />
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <el-input placeholder="请输入" v-model="form.vin" clearable :disabled="orderTypeDisabled" />
                </el-form-item>
                <el-form-item label="特殊编码：" prop="specialCode">
                  <el-input placeholder="请输入" v-model="form.specialCode" clearable :disabled="orderTypeDisabled" />
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="!(isEditing || !_id)">基本信息</div>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
                  <el-link type="success"
                    :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.dealerCode}`"
                    target="_blank">{{ form.dealerName }}</el-link>
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseName">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="!(isEditing || !_id)">收件信息</div>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  {{ form.approverName }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
              </el-form>

              <div class="common-title" v-show="!(isEditing || !_id)">资金信息</div>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="缺货单号：" prop="backOrderCode">
                  <el-link type="success" v-if="form.backOrderCode"
                    :href="`/service/sparepart/purchase/backOrder/edit?id=${form.backOrderId}`" target="_blank">{{
                      form.backOrderCode }}</el-link>
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
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>备件信息</h2>
            </div>
            <div class="common-section-body">
              <div style="margin-bottom: 10px;">
                <el-button size="small" @click="handleAdd" type="primary" plain :disabled="!['0', '3'].includes(form.orderStatus)"><i
                    class="iconfont icon-lxppc-plus"></i>添加备件</el-button>
                <el-button class="ais-button" size="small" :disabled="!['0', '3'].includes(form.orderStatus)" @click="handleRestock">
                  补货预测
                </el-button>
                <el-button size="small" @click="handleImport" :disabled="!routeQueryType">备件导入</el-button>
              </div>
              <div class="common-title">备件列表</div>
              <div class="common-section-table">
                <vxe-table ref="editTableRight" :data="tableData" stripe show-overflow resizable border="inner"
                  size="medium">
                  <vxe-column field="partCode" title="备件编码">
                    <template v-slot="{ row }">
                      <span class="clickable" @click="handleEdit(row)">{{ row.partCode }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="partName" title="备件名称" />
                  <vxe-column field="originalPrice" title="原价" />
                  <vxe-column field="purchasePrice" title="采购价" />
                  <vxe-column field="purchaseAmount" title="采购金额" />
                  <vxe-column field="cashUnitPrice" title="现金单价" />
                  <vxe-column field="cashAmount" title="现金金额" />
                  <vxe-column field="purchaseQty" title="采购数" />
                  <vxe-column field="remark" title="备注" />
                  <vxe-column field="originalPriceSource" title="原价来源">
                    <template v-slot="{ row }">
                      <el-link type="success" target="_blank"
                        :href="`/service/sparepart/basic/sparePartPurchasePrice/edit?id=${row.originalPriceSource}`">{{
                          row.originalPriceSource }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column title="操作" fixed="right" v-if="routeQueryType">
                    <template #default="{ row }">
                      <el-popconfirm title="确定删除此备件吗？" confirm-button-text="删除" confirm-button-type="danger"
                        @confirm="handleDel(row)">
                        <span class="action-button btn-delete" slot="reference" type="text">
                          删除
                        </span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                </vxe-table>
                <div class="table-pagination">
                  <el-pagination @size-change="(val) => pageSizeChange(val)"
                    @current-change="(val) => currentPageChange(val)" :current-page="current"
                    :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </div>
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>附件信息</h2>
            </div>
            <div class="common-section-body">
              <h2 class="common-title">附件申请</h2>
              <div class="common-section-table">
                <!-- 附件上传组件 -->
                <AisAttachment
                  :businessId="_id"
                  configCode="mcs_partsclaimorder"
                  attachType="索赔申请附件"
                  readonly
                />
              </div>
              <h2 class="common-title">审批附件</h2>
              <div class="common-section-table">
                <AisAttachment
                  :businessId="_id"
                  configCode="mcs_partsclaimorder"
                  attachType="索赔审批附件"
                  readonly
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
        <SparePartsDetail :purchase-apply-id="_id" :purchaseApplyDeleteId="purchaseApplyDeleteId" :orderStatus="form.orderStatus"
          @submit="handleRefresh" />
      </div>
    </template>
    <Upload :visible="uploadDialogVisible" :businessParams="_id" id="sparePartPurchaseApplyDetailImport"
      @close="handleUploadDialogClose" @submit="handleRefresh" />
    <!-- 补货预测 弹窗 -->
    <RestockDialog :visible.sync="restockDialog" :id="_id" @update:visible="val => restockDialog = val"
    @submit="handleRefresh" />
    <!-- 提交弹窗 -->
    <SubmitDialog
      ref="submitDialogRef"
      :visible.sync="submitDialogVisible"
      :id="purchaseId"
      :purchaseList="purchaseList"
      @close="handleSubmitDialogClose"
    />
    <!-- 同意弹窗 -->
     <AgreeDialog
      ref="agreeDialogRef"
      :visible.sync="agreeDialogVisible"
      :id="purchaseId"
      :purchaseList="purchaseList"
      @close="handleAgreeDialogClose"
    />
    <!-- 审批同意弹窗 -->
     <ApprovalDialog
      ref="approvalDialogRef"
      :visible.sync="approvalDialogVisible"
      :id="purchaseId"
      :couponObj="couponObj"
      @failure="handleApprovalFailure"
      @success="handleApprovalSuccess"
      @close="handleApprovalDialogClose"
    />
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getPurchaseApplyPage, purchaseApplyDelete, purchaseApplyReject, purchaseApplyListUnPurchaseDetail, purchaseApplySubmit, purchaseApplyCopy, purchaseApplyGetCoupon } from '@/api/sparepart/purchase/purchaseApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getUserByNameOrNo, getEnum, listOrgStoreInfoByParam, listWarehouse, getPartDealer, getLoginUser } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getAreaTree } from '@/utils';
import SparePartsDetail from './SparePartsDetail.vue';
import Upload from '@/libs/components/UploadDialog';
import RestockDialog from './RestockDialog.vue';
import SubmitDialog from './SubmitDialog.vue';
import AgreeDialog from './AgreeDialog.vue';
import ApprovalDialog from './ApprovalDialog.vue';
import AisAttachment from '@/libs/components/AisAttachment';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerCode: '',
  dealerName: '',
  companyCode: '',
  companyName: '',
  warehouseName: '',
  warehouseId: '',
  purchaseOrderType: '0',
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
  thirdPartyDeliveryIs: '0',
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
    SparePartsDetail,
    Upload,
    RestockDialog,
    SubmitDialog,
    AgreeDialog,
    ApprovalDialog,
    AisAttachment
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    isAllowOrNot () {
      return this.form.thirdPartyDeliveryIs === '0';
    },
    isThirdPartyDelivery () {
      return this.isAllowedThirdDelivered === 1;
    },
    showSubmit () { // 必须满足订单状态条件
      if (!this._id || (this.form.orderStatus !== '0' && this.form.orderStatus !== '3')) {
        return false;
      }
      if (this.accountFlag) { // 门店账号需要额外检查订单类型
        return ((this.form.purchaseOrderType === '0' || this.form.purchaseOrderType === '1') && !this.form.backOrderCode) && this.permissions.has('AISPART-purchaseApply-submit');
      }
      return true; // 主机厂账号直接显示
    },
    showAgree () { // 必须满足订单状态条件
      if (!this._id || this.form.orderStatus !== '1') {
        return false;
      }
      if (this.accountFlag) { // 门店账号需要额外检查订单类型
        return ((this.form.purchaseOrderType === '0' || this.form.purchaseOrderType === '1') && !this.form.backOrderCode) && this.permissions.has('AISPART-purchaseApply-agree');
      }
      return true; // 主机厂账号直接显示
    },
    showReject () { // 必须满足订单状态条件
      if (!this._id || this.form.orderStatus !== '1') {
        return false;
      }
      if (this.accountFlag) { // 门店账号需要额外检查订单类型
        return ((this.form.purchaseOrderType === '0' || this.form.purchaseOrderType === '1') && !this.form.backOrderCode) && this.permissions.has('AISPART-purchaseApply-reject');
      }
      return true; // 主机厂账号直接显示
    },
    showCopy () {
      if (!this._id) {
        return false;
      }
      if (this.accountFlag) { // 门店账号需要额外检查订单类型
        return (this.form.purchaseOrderType === '0' || this.form.purchaseOrderType === '1') && this.permissions.has('AISPART-purchaseApply-copy');
      }
      return true; // 主机厂账号直接显示
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
    form: {
      handler (newVal) {
        if (newVal.orderStatus === '0' || newVal.orderStatus === '3') {
          this.routeQueryType = true;
        } else {
          this.routeQueryType = false; // 重置为 false
        };
      },
      immediate: true
    },
    // 监听 订单类型为 铺货订单或定制订单时 做的一系列操作逻辑
    'form.purchaseOrderType': {
      handler (newVal) {
        if (newVal === '2') {
          this.rules.vin[0].required = false;
          this.rules.specialCode[0].required = false;
          this.orderTypeDisabled = false;
        } else if (newVal === '3') {
          this.rules.vin[0].required = true;
          this.rules.specialCode[0].required = true;
          this.orderTypeDisabled = false;
        } else {
          this.orderTypeDisabled = true;
          this.$refs.ruleForm?.clearValidate('vin');
          this.$refs.ruleForm?.clearValidate('specialCode');
        }
      },
      immediate: true
    },
    accountFlag: {
      handler (val) {
        if (val) { // 门店账号，只可以选择普通订单和紧急订单；同时非这两类订单类型以及【缺货单号】非空的单据，门店账号只能查看，所有编辑提交等动作都不允许，主机厂账号不受限，按正常逻辑
          if ((this.form.purchaseOrderType !== '0' || this.form.purchaseOrderType !== '1') && this.form.backOrderCode) {
            this.routeQueryType = false;
          } else {
            this.routeQueryType = true;
          }
        }
      }
    },
    'form.thirdPartyDeliveryIs': {
      handler (val) {
        if (val === '1') {
          this.rules.address[0].required = true;
        } else {
          this.rules.address[0].required = false;
          this.$refs.ruleForm?.clearValidate('address');
        }
      }
    },
    'form.dealerCode': {
      handler (val) {
        if (val) {
          this.getPartDealers(val);
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      areaOptions: getAreaTree(),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      pageTitle: '备件采购申请',
      pageType: 'edit',
      title: '采购申请单：',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchaseApply',
      loading: false,
      submitLoading: false,
      actionLoading: false,
      routeQueryType: false, // 路由参数ID 是否可编辑
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      detailTitle: '添加备件',
      uploadDialogVisible: false,
      purchaseOrderTypeOptions: [], // 采购申请单 订单类型
      orderTypeDisabled: true,
      restockDialog: false, // 补货预测 弹窗控制
      submitDialogVisible: false, // 提交按钮弹窗
      agreeDialogVisible: false, // 同意按钮弹窗.
      approvalDialogVisible: false, // 审批按钮弹窗.
      couponObj: {}, // 优惠券对象
      purchaseId: '', // 采购单ID
      purchaseList: [], // 不可采购清单
      pageSize: 10,
      current: 1,
      total: 0,
      purchaseApplyDeleteId: '', // 采购申请单ID
      tableData: [],
      accountFlag: true, // 查询是否店端 true为门店  false为厂端
      currentDealerCode: '', // 当前门店code
      currentDealerName: '', // 当前门店名称
      isPartOrder: null, // 是否有备附件订购能力,
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
        address: [
          { required: false, message: '请输入收货地址', trigger: 'change' }
        ],
        recipientPhone: [
          { required: true, message: '请输入收货人电话', trigger: 'change' }
        ],
        vin: [
          { required: false, message: '请输入VIN号', trigger: 'change' }
        ],
        specialCode: [
          { required: false, message: '请输入特殊编码', trigger: 'change' }
        ],
      },
      lastDealerCode: '', // 新增：记录上一次的门店编码
      isAllowedThirdDelivered: 1, // 新增：是否第三方收货
    };
  },
  mounted () {
    if (!this._id) {
      this.getLoginUser();
    }
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.getLoginUser();
          this.getDetailData();
          return res;
        });
      }
    },
    // 点击带出门店名称
    handleDealerChange (val, ele) {
      this.$nextTick(() => {
        if (!val) return; // 过滤无效事件

        // 新增页面：首次选择直接赋值
        if (!this._id && !this.lastDealerCode) {
          // 首次选择
          this.form.dealerName = ele.orgName;
          this.getPartDealer(ele.orgCode);
        } else {
          // 切换，弹出确认
          this.$confirm('是否切换门店, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.form.dealerName = ele.orgName;
            this.getPartDealer(ele.orgCode);
          }).catch(() => {
            this.getLoginUser();
          });
        }
        // 更新上一次的编码
        this.lastDealerCode = this.form.dealerCode;
      });
    },
    async getPartDealer (query) {
      try {
        const res = await getPartDealer({ code: query });
        this.form.companyCode = res.parentCompanyCode;
        this.form.companyName = res.parentCompanyName;
        this.form.warehouseId = res.warehouseId;
        this.form.warehouseCode = res.warehouseCode;
        this.form.warehouseName = res.warehouseName;
        this.form.recipientName = res.sparePartReceiving.partRecipient;
        this.form.recipientPhone = res.sparePartReceiving.partPhone;
        this.form.provinceCityCountyCode = res.sparePartReceiving.provinceCityCountyCode;
        this.form.thirdPartyDeliveryIs = String(res.sparePartReceiving.isAllowedThirdDelivered);
        this.form.address = res.sparePartReceiving.partAddress;
        this.isAllowedThirdDelivered = Number(res.sparePartReceiving.isAllowedThirdDelivered);
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 编辑时 去请求此接口
    async getPartDealers (query) {
      try {
        const res = await getPartDealer({ code: query });
        this.isAllowedThirdDelivered = Number(res.sparePartReceiving.isAllowedThirdDelivered);
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getLoginUser () {
      try {
        const res = await getLoginUser();
        this.accountFlag = res.accountFlag;
        this.currentDealerCode = res.currentDealerCode;
        this.currentDealerName = res.currentDealerName;

        if (this.accountFlag === true) {
          const resDealer = await getPartDealer({ code: this.currentDealerCode });
          this.isPartOrder = resDealer.isPartOrder;
        } else {
          this.isPartOrder = true;
        }

        if (res.accountFlag) {
          this.form.dealerCode = res.currentDealerCode;
          this.form.dealerName = res.currentDealerName;
        } else {
          this.form.dealerCode = '';
          this.form.dealerName = '';
        }
        this.getOrderType(); // 先请求 账号权限接口 再请求类型接口
        if (this.form.dealerCode) {
          this.getPartDealer(this.form.dealerCode);
        }
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
    async submitRequest () {
      const result = await addOrUpdate({ ...this.form });
      await this.getDetailData();
      return result;
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query, isPartOrder: true, authority: false });
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
    // 查询是什么账户 来定制订单类型的选择权限
    async getOrderType () {
      let list = [];
      list = await this.fetchOptions('PurchaseOrderTypeEnum');
      if (this.accountFlag) {
        // 保留 code 为0 或 1的数据
        list = list.filter(item => ['0', '1'].includes(item.code));
      }
      this.purchaseOrderTypeOptions = list;
    },
    // 判断 是什么订单类型 联动下面的 vin 和 编辑特殊编码
    handleOrderTypeChange (val) {
      if (val === '2' || val === '3') {
        this.form.vin = '';
        this.form.specialCode = '';
      }
    },
    // 添加备件
    handleAdd () {
      this.purchaseApplyDeleteId = '';
      this.openPane();
    },
    // 编辑备件
    handleEdit (row) {
      this.purchaseApplyDeleteId = row.id;
      this.openPane();
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    // 刷新详情页所有接口
    async handleRefresh () {
      await this.$refs.containerRef.loadDetail();
      this.getDetailData();
    },
    // 请求备件列表表格接口
    async getDetailData () {
      const params = {
        purchaseApplyId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current
      };
      const res = await getPurchaseApplyPage(params);
      this.tableData = res.records || [];
      this.total = res.total;
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
    // 删除事件
    async handleDel (val) {
      await purchaseApplyDelete([val.id]);
      this.getDetailData();
    },
    // 补货预测
    handleRestock () {
      this.restockDialog = true;
    },
    // 提交
    async handleSubmit (val) {
      this.actionLoading = true;
      try {
        const res = await purchaseApplyListUnPurchaseDetail({ id: val.id });
        if (res.records.length > 0) {
          this.purchaseId = val.id;
          this.purchaseList = res.records || [];
          this.submitDialogVisible = true;
        } else {
          const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>确认提交吗？</div>';

          this.$confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            customClass: 'ais-leave-tips',
            showClose: false
          }).then(async () => {
            await purchaseApplySubmit({ id: val.id });
            // 提示成功
            this.$message.success('提交成功!');
            // 执行额外回调（比如刷新列表）
            this.handleRefresh();
          }).catch(() => {
          }).finally(() => {
            this.actionLoading = false;
          });
        }
      } finally {
        if (!this.submitDialogVisible) {
          this.actionLoading = false;
        }
      }
    },
    handleSubmitDialogClose () {
      this.submitDialogVisible = false;
      this.handleRefresh();
      this.actionLoading = false;
    },
    // 同意
    async handleAgree (val) {
      if (!val || !val.id) {
        this.$message.warning('操作失败：缺少采购单ID');
        return;
      }
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>确认同意吗？</div>';

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(async () => {
        const res = await purchaseApplyListUnPurchaseDetail({ id: val.id });
        if (res.records.length > 0) {
        // 确保只设置有效的id值
          if (val.id) {
            this.purchaseId = val.id;
            this.purchaseList = res.records || [];
            this.agreeDialogVisible = true;
          } else {
            this.$message.warning('操作失败：缺少采购单ID');
          }
        } else if (res.records.length === 0) {
          const res = await purchaseApplyGetCoupon({ id: val.id });
          // 确保只设置有效的id值
          if (val.id) {
            this.couponObj = res;
            this.purchaseId = val.id;
            this.approvalDialogVisible = true;
          } else {
            this.$message.warning('操作失败：缺少采购单ID');
          }
        }
      }).catch(() => {
      });
    },
    handleAgreeDialogClose () {
      this.agreeDialogVisible = false;
      this.handleRefresh();
    },
    // 统一成功调按钮 接口
    handleApprovalSuccess () {
      this.approvalDialogVisible = false;
      this.handleRefresh();
    },
    handleApprovalDialogClose () {
      this.approvalDialogVisible = false;
      this.handleRefresh();
    },
    // 审批同意失败时
    handleApprovalFailure (val) {
      this.approvalDialogVisible = false;
      if (val) {
        this.purchaseId = val;
        this.agreeDialogVisible = true;
      } else {
        this.$message.error('操作失败：缺少采购单ID');
      }
    },
    // 驳回
    async handleReject (val) {
      this.actionLoading = true;
      this.$prompt('请输入审批说明', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/, // 校验非空
        inputErrorMessage: '请输入备注',
      }).then(async ({ value }) => {
        // 2. 二次校验：防止通过特殊手段绕过前端限制或处理粘贴超长文本的情况
        if (!value || value.length > 100) {
          this.$message.warning('请输入不超过100个字符的审批说明');
          return Promise.reject(new Error('中断链条')); //  中断链条
        }
        // 调用 API，并传入用户输入的备注
        await purchaseApplyReject({ id: val.id, approvalDescription: value });
        this.$message.success('驳回成功!');
        this.handleRefresh();
      }).catch(() => {
        // 用户取消或校验失败，静默处理
      }).finally(() => {
        this.actionLoading = false;
      });
    },
    // 复制
    async handleCopy (row) {
      this.actionLoading = true;
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>确认复制吗？</div>';

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(async () => {
        const res = await purchaseApplyCopy({ id: row.id });
        this.$router.push({
          path: '/sparepart/purchase/purchaseApply/edit',
          query: {
            id: res
          }
        });
        // 如果是当前页面跳转，强制刷新
        if (this.$route.query.id === res) {
          this.handleRefresh();
        }
      }).catch(() => {
      }).finally(() => {
        this.actionLoading = false;
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.purchase-apply {
  .ais-select-group {
    margin-bottom: 12px;
  }

  .ais-button {
    margin-left: 12px;
    border-radius: 4px;
  }

  .common-title {
    font-size: 14px;
    font-weight: 600;
    color: #0A0E0A;
    margin-bottom: 16px;
    padding-top: 4px;
  }

  .table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }

  .clickable {
    cursor: pointer;
    color: #009100;
  }
}
</style>
