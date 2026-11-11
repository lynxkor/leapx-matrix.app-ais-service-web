<template>
  <div class="page-common m-purchase-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="采购申请单">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
              <el-form-item label="订单创建时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      <el-form-item label="门店">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.dealerCodeList"
          placeholder="请输入门店编码或名称"
          labelKey="orgName"
          valueKey="orgCode"
          subLabelKey="orgCode"
          clearable
          multiple
          collapseTags
          filterable
            />
      </el-form-item>
      <template v-if="show">
      <el-form-item label="公司" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :remote-method="getParentCompany"
          remote
          v-model="form.companyCodeList"
          placeholder="请选择"
          labelKey="companyName"
          valueKey="companyCode"
          subLabelKey="companyCode"
          clearable
          multiple
          collapseTags
          filterable
        />
      </el-form-item>
        <el-form-item label="仓库">
          <fetch-select
            :remote-method="getWarehouse"
            remote
            v-model="form.warehouseIdList"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            subLabelKey="code"
            clearable
            multiple
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="订单类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="PurchaseOrderTypeEnum"
            v-model="form.purchaseOrderTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="PurchaseApplyApprovalStatusEnum"
            v-model="form.orderStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="缺货单号">
          <el-input
            placeholder="请输入"
            v-model="form.backOrderCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="提交人">
          <fetch-select
            :remote-method="getUser"
            remote
            v-model="form.submitter"
            placeholder="请输入名称"
            labelKey="username"
            valueKey="userId"
            clearable
            collapseTags
            filterable
            />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.submitTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="审批人">
          <fetch-select
            :remote-method="getUser"
            remote
            v-model="form.approver"
            placeholder="请输入名称"
            labelKey="username"
            valueKey="userId"
            clearable
            collapseTags
            filterable
            />
        </el-form-item>
        <el-form-item label="审批时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.approvalTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="订单修改时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="订单备注">
          <el-input
            placeholder="请输入"
            v-model="form.remark"
            clearable
          />
        </el-form-item>
        <!-- ===== 备件列表 tab 专用查询 ===== -->
        <el-form-item label="备件编码" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.partCodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备件名称" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input
            placeholder="请输入"
            v-model="form.partName"
            clearable
          />
        </el-form-item>
        <el-form-item label="明细备注" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input
            placeholder="请输入"
            v-model="form.detailRemark"
            clearable
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :view-scope="activeName"
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
      <el-button size="small" @click="handleBatchSubmit" :disabled="selectionList.length === 0" v-permission="'AISPART-purchaseApply-batchSubmit'">批量提交</el-button>
      <el-button size="small" @click="handleBatchAgree" :disabled="selectionList.length === 0" v-permission="'AISPART-purchaseApply-batchAgree'">批量同意</el-button>
      <el-button size="small" @click="handleBatchReject" :disabled="selectionList.length === 0" v-permission="'AISPART-purchaseApply-batchReject'">批量驳回</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport" v-permission="'AISPART-purchaseApply-importDistribution'">铺货导入</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport2" v-permission="'AISPART-purchaseApply-importDistribution'">铺货导入(相同备件)</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="订单列表" name="homePage"></el-tab-pane>
      <el-tab-pane label="备件列表" name="allSpareParts"></el-tab-pane>
    </el-tabs>
    <div
      class="ais-table-c"
         v-if="activeName === 'homePage'"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <div
      class="ais-table-c"
      v-if="activeName === 'allSpareParts'"
    >
      <LPVxeTable
        :key="2"
        ref="tableRefAll"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObjAll"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      id="sparePartPurchaseApplyDistribution"
      async
      @close="handleUploadDialogClose"
    />
    <Upload
      :visible="uploadDialogVisible2"
      id="sparePartPurchaseApplyDistributionSp"
      async
      :upload-url="'/sp/web/purchase/purchaseApply/import'"
      @close="handleUploadDialogClose2"
    />
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
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList, detailPage, deleteItem, enableItem, purchaseApplyReject,
  purchaseApplyBatchReject, purchaseApplyListUnPurchaseDetail, purchaseApplySubmit, purchaseApplyCopy,
  batchAgree, purchaseApplyGetCoupon, purchaseApplyBatchSubmit
} from '@/api/sparepart/purchase/purchaseApply/index';
import { getUserByNameOrNo, getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, getSparePartCompany, listWarehouse, getPartDealer, getLoginUser } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import SubmitDialog from './SubmitDialog.vue';
import AgreeDialog from './AgreeDialog.vue';
import ApprovalDialog from './ApprovalDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  code: '',
  dealerCode: '',
  dealerCodeList: null,
  dealerName: '',
  companyCode: '',
  companyName: '',
  warehouseName: '',
  warehouseId: '',
  warehouseIdList: null,
  purchaseOrderType: '',
  purchaseOrderTypeList: null,
  orderStatus: '',
  orderStatusList: null,
  backOrderCode: '',
  submitTime: '',
  submitter: '',
  approver: '',
  approvalTime: '',
  remark: '',
  // ===== 备件列表 tab 专用（仅 allSpareParts 用） =====
  partCodeList: null,
  partName: '',
  detailRemark: '',
  createTime: '',
  updateTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload,
    TagInput,
    SubmitDialog,
    AgreeDialog,
    ApprovalDialog
  },
  data () {
    return {
      pageTitle: '备件采购申请',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchaseApply',
      form: {
        ...defaultForm
      },
      activeName: 'homePage',
      isPartOrder: null, // 是否有备附件订购能力
      accountFlag: null, // 是否门店
      currentDealerCode: null, // 当前门店code
      currentDealerName: null, // 当前门店名称
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      uploadDialogVisible2: false,
      submitDialogVisible: false, // 提交按钮弹窗
      agreeDialogVisible: false, // 同意按钮弹窗.
      approvalDialogVisible: false, // 审批按钮弹窗.
      couponObj: {}, // 优惠券对象
      approvalType: '', // 审批类型
      purchaseId: '', // 采购单ID
      purchaseList: [], // 不可采购清单
      clickItemId: '',
      optionObj: {
        id: 'purchaseApplyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '采购申请单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'companyCode', label: '公司编码', visible: true, width: 180 },
          { props: 'companyName', label: '公司名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '仓库名称', visible: true, width: 200 },
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 120 },
          { props: 'purchaseAmount', label: '采购金额', visible: true, align: 'right', width: 120 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 120 },
          {
            props: 'backOrderCode',
            label: '缺货单号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/backOrder/edit',
                  query: {
                    id: row.backOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'submitterName', label: '提交人', visible: true, width: 100 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 200 },
          { props: 'approverName', label: '审批人', visible: true, width: 100 },
          { props: 'approvalTime', label: '审批时间', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              show: (row) => {
                return row.orderStatus === '0' || row.orderStatus === '3';
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseApply/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              show: (row) => {
                return (row.orderStatus === '0' || row.orderStatus === '3') && this.permissions.has('AISPART-purchaseApply-delete');
              },
              popconfirmTitle: '此操作将删除此申请单, 是否继续?',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              click: (rowIndex, row) => {
                deleteItem([row.id]).then(() => {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.getData();
                });
              },
              type: 'danger'
            }, {
              name: '提交',
              show: (row) => {
                // 必须满足订单状态条件
                if (row.orderStatus !== '0' && row.orderStatus !== '3') {
                  return false;
                }
                // 门店账号需要额外检查订单类型
                if (this.accountFlag) {
                  return ((row.purchaseOrderType === '0' || row.purchaseOrderType === '1') && !row.backOrderId) && this.permissions.has('AISPART-purchaseApply-submit');
                }
                // 主机厂账号直接显示
                return true;
              },
              click: (rowIndex, row) => {
                this.handleSubmit(row);
              },
              type: 'info'
            }, {
              name: '同意',
              show: (row) => {
                // 必须满足订单状态条件
                if (row.orderStatus !== '1') {
                  return false;
                }
                // 门店账号需要额外检查订单类型
                if (this.accountFlag) {
                  return ((row.purchaseOrderType === '0' || row.purchaseOrderType === '1') && !row.backOrderId) && this.permissions.has('AISPART-purchaseApply-agree');
                }
                // 主机厂账号直接显示
                return true;
              },
              click: (rowIndex, row) => {
                this.handleAgree(row);
              },
              type: 'info'
            }, {
              name: '驳回',
              show: (row) => {
                // 必须满足订单状态条件
                if (row.orderStatus !== '1') {
                  return false;
                }
                // 门店账号需要额外检查订单类型
                if (this.accountFlag) {
                  return ((row.purchaseOrderType === '0' || row.purchaseOrderType === '1') && !row.backOrderId) && this.permissions.has('AISPART-purchaseApply-reject');
                }
                // 主机厂账号直接显示
                return true;
              },
              click: (rowIndex, row) => {
                this.handleReject(row);
              },
              type: 'info'
            }, {
              name: '复制',
              show: (row) => {
                // 门店账号需要额外检查订单类型
                if (this.accountFlag) {
                  return (row.purchaseOrderType === '0' || row.purchaseOrderType === '1') && this.permissions.has('AISPART-purchaseApply-copy');
                }
                // 主机厂账号直接显示
                return true;
              },
              click: (rowIndex, row) => {
                this.handleCopy(row);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      optionObjAll: {
        id: 'purchaseApplyTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          /* ========== 订单维度 ========== */
          {
            props: 'purchaseApplyCode',
            label: '采购申请单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseApply/edit',
                  query: { id: row.purchaseApplyId || row.id }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'companyCode', label: '公司编码', visible: true, width: 180 },
          { props: 'companyName', label: '公司名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '仓库名称', visible: true, width: 200 },
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 120 },
          { props: 'purchaseAmount', label: '采购金额(订单)', visible: true, align: 'right', width: 140 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 120 },
          {
            props: 'backOrderCode',
            label: '缺货单号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/backOrder/edit',
                  query: { id: row.backOrderId }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'submitterName', label: '提交人', visible: true, width: 100 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 200 },
          { props: 'approverName', label: '审批人', visible: true, width: 100 },
          { props: 'approvalTime', label: '审批时间', visible: true, width: 200 },
          { props: 'remark', label: '订单备注', visible: true, width: 200 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },

          /* ========== 明细维度 ========== */
          {
            props: 'partCode',
            label: '备件编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/detail',
                  query: { id: row.sparePartId }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'partName', label: '备件名称', visible: true, width: 200 },
          { props: 'originalPrice', label: '原价', visible: true, align: 'right', width: 120 },
          {
            props: 'originalPriceSource',
            label: '原价来源',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePartPurchasePrice/detail',
                  query: { id: row.originalPriceSource }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'purchasePrice', label: '采购价', visible: true, align: 'right', width: 120 },
          { props: 'detailPurchaseAmount', label: '采购金额', visible: true, align: 'right', width: 120 },
          { props: 'cashUnitPrice', label: '现金单价', visible: true, align: 'right', width: 120 },
          { props: 'cashAmount', label: '现金金额', visible: true, align: 'right', width: 120 },
          { props: 'rebateUnitPrice', label: '返利单价', visible: true, align: 'right', width: 120 },
          { props: 'rebateAmount', label: '返利金额', visible: true, align: 'right', width: 120 },
          { props: 'purchaseQty', label: '采购数量', visible: true, align: 'right', width: 120 },
          { props: 'priceAdjustmentTypeLabel', label: '调价类型', visible: true, width: 120 },
          { props: 'priceAdjustmentRatio', label: '调价比例', visible: true, align: 'right', width: 120 },
          { props: 'detailRemark', label: '明细备注', visible: true, width: 200 },
          { props: 'boQty', label: 'BO数量', visible: true, align: 'right', width: 120 },
          { props: 'soQty', label: 'SO数量', visible: true, align: 'right', width: 120 },
          { props: 'cancelQty', label: '取消数量', visible: true, align: 'right', width: 120 },
          { props: 'oemOutboundQty', label: 'OEM出库数量', visible: true, align: 'right', width: 140 },
          { props: 'dealerInboundQty', label: '门店入库数量', visible: true, align: 'right', width: 140 }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.initDealerUser();
  },
  methods: {
    async getUser (query) {
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getParentCompany (query) {
      try {
        const res = await getSparePartCompany({ codeOrNameLike: query });
        res.records = res.records?.map(item => ({
          ...item,
          displayName: item.companyName + `(${item.companyCode})`
        }));
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
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.accountFlag = res.accountFlag;
      this.currentDealerCode = res.currentDealerCode;// 当前门店code
      this.currentDealerName = res.currentDealerName;// 当前门店名称

      if (this.accountFlag === true) {
        const res = await getPartDealer({ code: this.currentDealerCode });
        this.isPartOrder = res.isPartOrder;
      }
      if (this.accountFlag === false) {
        this.isPartOrder = true;
      }
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleImport2 () {
      this.uploadDialogVisible2 = true;
    },
    handleUploadDialogClose2 () {
      this.uploadDialogVisible2 = false;
    },

    handleAdd () {
      if (this.isPartOrder === null) {
        this.$message.error('获取用户信息异常，请刷新页面重试');
        return;
      }
      if (this.isPartOrder === false) {
        // 门店名称：XXXX，不具备备附件订购能力，不允许采购
        this.$message.error('门店名称：' + this.currentDealerName + '不具备备附件订购能力，不允许采购');
        return;
      }
      this.$router.push({
        path: '/sparepart/purchase/purchaseApply/edit'
      });
    },
    onSubmit () {
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      this.debouncedGetData();
    },
    onReset () {
      // 备件列表 tab：默认创建时间 = 最近一个月
      const extraDefaults = this.activeName === 'allSpareParts'
        ? { createTime: this.getLastMonthRange() }
        : {};
      this.form = { ...defaultForm, ...extraDefaults };
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      optionObj.form.size = pageSize;
      this.debouncedGetData();
    },
    exportExcel () {
      this.exportLoading = true;
      const formData = this.getFormData();
      if (formData === null) {
        this.exportLoading = false;
        return;
      }
      const reqParams = formData || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      const isAllSpareParts = this.activeName === 'allSpareParts';
      const fetchPath = isAllSpareParts
        ? 'sp/web/purchase/purchaseApply/detailPage'
        : 'sp/web/purchase/purchaseApply/page';
      const tableRef = isAllSpareParts ? this.$refs.tableRefAll : this.$refs.tableRef;
      exportTable({
        businessType: '备件采购申请',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件采购申请.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },

    getOptionObj () {
      if (this.activeName === 'homePage') {
        return this.optionObj;
      } else if (this.activeName === 'allSpareParts') {
        return this.optionObjAll;
      }
      return this.optionObj;
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      let fetchApi = getList;
      if (this.activeName === 'homePage') {
        fetchApi = getList;
      } else if (this.activeName === 'allSpareParts') {
        fetchApi = detailPage;
      }
      let optionObj = this.getOptionObj();
      const formData = this.getFormData();
      // 默认条件校验未通过：getFormData 返回 null，不发请求
      if (formData === null) {
        this.loading = false;
        return;
      }
      fetchApi({ ...formData, pageNum: optionObj.form.page, pageSize: optionObj.form.size })
        .then(res => {
          console.log(res);
          optionObj.dataList = (res?.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      let optionObj = this.getOptionObj();
      return new Promise((resolve, reject) => {
        getTableConfig(optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      let optionObj = this.getOptionObj();
      if (type === 'page') {
        optionObj.form.page = num;
      } else {
        optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 点击tabs栏切换
    handleClick (item) {
      this.activeName = item.name;
      this.show = false;
      // 跨 tab 切换时，把所有 tab 的分页状态都重置为 page 1 + 默认 size，
      // 避免「在 tab2 翻到 page 3 → 切 tab1 → 切回 tab2 还是 page 3」的脏状态
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.optionObjAll.form.page = 1;
      this.optionObjAll.form.size = pageSize;
      this.onReset();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || data[key]?.length === 0) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }

      if (this.form.approvalTime) {
        delete data.approvalTime;
        if (this.form.approvalTime.length > 1) {
          data.approvalTimeStart = this.form.approvalTime[0];
          data.approvalTimeEnd = this.form.approvalTime[1];
        }
      }

      if (this.form.submitTime) {
        delete data.submitTime;
        if (this.form.submitTime.length > 1) {
          data.submitTimeStart = this.form.submitTime[0];
          data.submitTimeEnd = this.form.submitTime[1];
        }
      }

      // ===== 备件列表 tab 默认条件校验 =====
      // 采购申请单（codeList）+ 订单创建时间 不允许同时为空
      if (this.activeName === 'allSpareParts') {
        const hasCode = !!(data.codeList && data.codeList.length);
        const hasCreateTime = !!(data.createTimeStart && data.createTimeEnd);
        if (!hasCode && !hasCreateTime) {
          this.$message.warning('请至少填写【采购申请单】或【订单创建时间】');
          return null;
        }
      }

      return data;
    },
    // 备件列表 tab：默认「最近一个月」的时间区间
    getLastMonthRange () {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      const fmt = (d, isEnd) => {
        const pad = (n) => (n < 10 ? `0${n}` : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${isEnd ? '23:59:59' : '00:00:00'}`;
      };
      return [fmt(start, false), fmt(end, true)];
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {});
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    },
    // 提交
    async handleSubmit (val) {
      const res = await purchaseApplyListUnPurchaseDetail({ id: val.id });
      if ((res?.records || []).length > 0) {
        this.purchaseId = val.id;
        this.purchaseList = res.records || [];
        this.submitDialogVisible = true;
      } else {
        this.$confirm('确认提交吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await purchaseApplySubmit({ id: val.id });
          this.$message.success('提交成功!');
          this.getData();
        }).catch(() => {});
      }
    },
    handleSubmitDialogClose () {
      this.submitDialogVisible = false;
    },
    // 同意
    async handleAgree (val) {
      if (!val || !val.id) {
        this.$message.warning('操作失败：缺少采购单ID');
        return;
      }
      const res = await purchaseApplyListUnPurchaseDetail({ id: val.id });
      if ((res?.records || []).length > 0) {
        // 确保只设置有效的id值
        if (val.id) {
          this.purchaseId = val.id;
          this.purchaseList = res.records || [];
          this.agreeDialogVisible = true;
        } else {
          this.$message.warning('操作失败：缺少采购单ID');
        }
      } else if ((res?.records || []).length === 0) {
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
    },
    // 批量提交
    async handleBatchSubmit () {
      // 检查选中记录的订单状态是否都是草稿/已驳回
      const invalidRecords = this.selectionList.filter(item => {
        return item.orderStatus !== '0' && item.orderStatus !== '3';
      });

      if (invalidRecords.length > 0) {
        this.$message.warning('只能选择草稿/已驳回的单据');
        return;
      }

      // 批量提交逻辑
      const idList = this.selectionList.map(item => item.id);
      this.$confirm('确认批量提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await purchaseApplyBatchSubmit({ ids: idList });

        this.$message.success('批量提交成功!');
        this.getData();
      }).catch(() => {
        this.$message.error('批量提交失败!');
      });
    },
    // 批量同意
    handleBatchAgree () {
      const invalidRows = this.selectionList.filter(item => item.orderStatus !== '1');
      if (invalidRows.length > 0) {
        this.$message.warning('只能同意状态为已提交的数据！');
        return;
      }
      const idList = this.selectionList.map(item => item.id);
      this.$prompt('请输入审批说明', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async (result) => {
        await batchAgree({ idList, approvalDescription: result.value });
        this.getData();
      });
    },
    handleAgreeDialogClose () {
      this.agreeDialogVisible = false;
    },
    // 统一成功调按钮 接口
    handleApprovalSuccess () {
      this.approvalDialogVisible = false;
      this.getData();
    },
    handleApprovalDialogClose () {
      this.approvalDialogVisible = false;
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
    handleReject (val) {
      this.allHandleReject(false, val);
    },
    // 批量驳回
    handleBatchReject () {
      const invalidRows = this.selectionList.filter(item => item.orderStatus !== '1');
      if (invalidRows.length > 0) {
        this.$message.warning('只能驳回状态为已提交的数据！');
        return;
      }
      this.allHandleReject(true);
    },
    // 统一驳回方法
    async allHandleReject (isBatch = false, rowData = null) {
      const idList = isBatch
        ? (this.selectionList.map(item => item.id) || [])
        : [rowData.id];

      if (isBatch && !idList.length) {
        this.$message.warning('请先选择要驳回的记录');
        return;
      }

      try {
        const result = await this.$prompt('请输入审批说明', '驳回', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const approvalDescription = result.value;
        const params = isBatch
          ? { idList, approvalDescription }
          : { id: rowData.id, approvalDescription };

        const response = isBatch
          ? await purchaseApplyBatchReject(params)
          : await purchaseApplyReject(params);

        this.$message.success('驳回成功!');
        this.getData();
        return response;
      } catch (error) {
      }
    },
    // 复制
    async handleCopy (row) {
      const res = await purchaseApplyCopy({ id: row.id });
      this.$router.push({
        path: '/sparepart/purchase/purchaseApply/edit',
        query: {
          id: res
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-purchase-apply-list {
  .ais-table-c {
    height: calc(100% - 168px);
  }
}
</style>
