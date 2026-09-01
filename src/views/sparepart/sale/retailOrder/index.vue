<template>
  <div class="page-common m-retail-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="备附件零售单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="VIN">
        <el-input
          placeholder="请输入"
          v-model="form.vin"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店" v-show="this.visibleCount === 3 || show">
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
      <template v-if="show">
        <el-form-item label="门店合作类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerCooperationTypeEnum"
            v-model="form.cooperationTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="客户类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="RetailOrderCustomerTypeStatusEnum"
            v-model="form.customerTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>

        <el-form-item label="客户编码">
          <el-input
            placeholder="请输入"
            v-model="form.customerCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input
            placeholder="请输入"
            v-model="form.customerName"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户联系方式">
          <el-input
            placeholder="请输入"
            v-model="form.customerContactInfo"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="RetailOrderStatusEnum"
            v-model="form.orderStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
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
        <!-- ===== 全部备件 tab 专用 ===== -->
        <el-form-item label="备件编码" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.sparePartCodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备件名称" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input placeholder="请输入" v-model="form.sparePartName" clearable />
        </el-form-item>
        <el-form-item label="库位" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input placeholder="请输入" v-model="form.locationNameLike" clearable />
        </el-form-item>
        <el-form-item label="价格类型" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :request="fetchOptions"
            enumCode="RetailOrderPriceTypeEnum"
            v-model="form.priceTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="是否出库" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.outboundIsList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="出库操作人" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :remote-method="getUser"
            remote
            v-model="form.outboundOperatorList"
            placeholder="请输入名称"
            labelKey="username"
            valueKey="userId"
            clearable
            collapseTags
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="入库操作人" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :remote-method="getUser"
            remote
            v-model="form.inboundOperatorList"
            placeholder="请输入名称"
            labelKey="username"
            valueKey="userId"
            clearable
            collapseTags
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="出库操作时间" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.outboundTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="入库操作时间" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.inboundTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="permissions.has('AISPART-retailOrder-addOrUpdateCar')" size="small" type="primary" @click="handleAdd('10')"><i class="iconfont icon-lxppc-plus"></i>新增（车主）</el-button>
      <el-button v-if="permissions.has('AISPART-retailOrder-addOrUpdateCom') && cooperationType==='0'" size="small" type="primary" @click="handleAdd('20')"><i class="iconfont icon-lxppc-plus"></i>新建（对公）</el-button>
      <el-button v-if="permissions.has('AISPART-retailOrder-export')" size="small" :loading="exportLoading" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="excelSetting" v-permission="'AISPART-retailOrder-print'">出库单打印设置</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="homePage"></el-tab-pane>
      <el-tab-pane label="全部备件" name="allSpareParts"></el-tab-pane>
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
        @sortChange="handleSortChange"
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
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
    <!-- 打印设置 -->
    <PrintSettings
      ref="printSettingsRef"
      :visible.sync="printSettingsVisible"
      @update:visible="val => printSettingsVisible = val"
      @success="getData"
    />
    <!-- 销售出库, 退料入库, 退订入库 -->
    <OutboundDialog
      ref="outboundDialogRef"
      :id="outboundId"
      :titleDialog="titleDialog"
      :visible.sync="outboundDialogVisible"
      @update:visible="val => outboundDialogVisible = val"
      @success="getData"
    />
    <!-- 退料申请 -->
     <ReturnMateriaDialog
      ref="returnDialogRef"
      :id="returnMaterialId"
      :visible.sync="returnMaterialDialogVisible"
      @update:visible="val => returnMaterialDialogVisible = val"
      @success="getData"
    />
    <!-- 收款 -->
    <HarvestDialog
     ref="harvestDialogRef"
     :form="harvestForm"
     :visible.sync="harvestDialogVisible"
     @update:visible="val => harvestDialogVisible = val"
     @success="getData"

    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, detailPage, deleteItem, enableItem, confirmOrder, cancelOrder, signOrder, cancelSignOrder, settleOrder, cancelSettleOrder, reverseSettleOrder, refundOrder } from '@/api/sparepart/sale/retailOrder/index';
import {
  getTableConfig, tableAddOrUpdate, exportTable, getEnum,
  getUserByNameOrNo, listOrgStoreInfoByParam, getSparePartCompany,
  listWarehouse, getPartDealer, getLoginUser, getDesensitize
} from '@/api/common';
import TagInput from '@/libs/components/TagInput';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import PrintSettings from './PrintSettings.vue';
import OutboundDialog from './OutboundDialog.vue';
import ReturnMateriaDialog from './ReturnMateriaDialog.vue';
import HarvestDialog from './HarvestDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  codeList: [],
  dealerCodeList: [],
  dealerName: '',
  cooperationTypeList: [],
  warehouseId: '',
  customerTypeList: [],
  vin: '',
  customerCode: '',
  customerName: '',
  orderStatusList: [],
  customerContactInfo: '',
  remark: '',
  updateTime: '',

  // ===== 全部备件 tab 专用（仅 allSpareParts 用） =====
  // 注意：被 <tag-input> 绑定的字段必须用 [] 而非 null，否则 reset 时
  // TagInput 内部 tagList = null 会导致 slice()/length 抛错，UI 无法清空。
  sparePartCodeList: [],
  sparePartName: '',
  deliveryNoList: null,
  saleVoucherList: null,
  inboundNoList: null,
  purchaseOrderNoList: null,
  locationNameLike: '',
  priceTypeList: [],
  outboundIsList: [],
  outboundOperatorList: [],
  inboundOperatorList: [],
  outboundTime: '',
  inboundTime: '',
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
    PrintSettings,
    OutboundDialog,
    ReturnMateriaDialog,
    HarvestDialog
  },
  data () {
    return {
      isPartOrder: false,
      cooperationType: null,
      pageTitle: '备附件零售',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-retailOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      printSettingsVisible: false, // 打印设置
      outboundDialogVisible: false, // 销售出库单
      titleDialog: '1',
      outboundId: '', // 销售出库单id 备附件销售单ID
      returnMaterialDialogVisible: false, // 退料申请
      returnMaterialId: '', // 退料申请id 备附件销售单ID
      harvestDialogVisible: false, // 收款
      harvestForm: {}, // 收款表单
      clickItemId: '',
      activeName: 'homePage',
      optionObj: {
        id: 'retailOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '备附件销售单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/sale/retailOrder/edit',
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
          { props: 'cooperationTypeLabel', label: '门店合作类型', visible: true, width: 120 },
          { props: 'warehouseName', label: '仓库名称', visible: true, width: 200 },
          { props: 'customerTypeLabel', label: '客户类型', visible: true, width: 120 },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDesensitize(row.id, 'retailOrder', 'vin')
          },
          { props: 'customerCode', label: '客户编码', visible: true, width: 180 },
          {
            props: 'customerName',
            label: '客户名称',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDesensitize(row.id, 'retailOrder', 'customerName')
          },
          {
            props: 'customerContactInfo',
            label: '客户联系方式',
            visible: true,
            width: 160,
            mask: true,
            getValue: (row) => getDesensitize(row.id, 'retailOrder', 'customerContactInfo')
          },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 120 },
          { props: 'totalAmount', label: '订单总金额', visible: true, width: 130, align: 'right' },
          { props: 'discountTotalAmount', label: '优惠总金额', visible: true, width: 130, align: 'right' },
          { props: 'payableTotalAmount', label: '应付总金额', visible: true, width: 130, align: 'right' },
          { props: 'remainingPayableAmount', label: '剩余应付金额', visible: true, width: 130, align: 'right' },
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
                // 定义允许显示的状态码列表
                const validStatuses = ['20', '30', '40', '50', '10'];

                // 安全处理：防止 row.orderStatus 为 null/undefined 导致报错
                if (!row.orderStatus) return false;

                // 判断 orderStatus 是否包含列表中的任意一个值
                return validStatuses.some(status => row.orderStatus.includes(status));
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/sale/retailOrder/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '确认',
              popconfirmTitle: '是否确认该订单?',
              show: (row) => {
                return row.orderStatus === '10' && this.permissions.has('AISPART-retailOrder-confirm');
              },
              click: (rowIndex, row) => {
                confirmOrder({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '确认成功!'
                  });
                  this.getData();
                }).catch(() => {
                });
              },
              type: 'info',
            }, {
              name: '作废',
              show: (row) => {
                return (row.orderStatus === '10' || row.orderStatus === '20') && this.permissions.has('AISPART-retailOrder-cancel');
              },
              click: (rowIndex, row) => {
                this.$prompt('请输入作废备注', '作废', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(({ value }) => {
                  cancelOrder({ id: row.id, description: value }).then(() => {
                    this.$message({
                      type: 'success',
                      message: '作废成功!'
                    });
                    this.getData();
                  });
                });
              },
              type: 'info',
            }, {
              name: '出库',
              show: (row) => {
                return row.orderStatus === '20' && this.permissions.has('AISPART-retailOrder-ship');
              },
              click: (rowIndex, row) => {
                this.handleOutbound(row, '1');
              },
              type: 'info',
            }, {
              name: '打印出库单',
              show: (row) => {
                // 定义允许显示的状态码列表
                const validStatuses = ['20', '30', '40', '50', '60', '100'];

                // 安全处理：防止 row.orderStatus 为 null/undefined 导致报错
                if (!row.orderStatus) return false;

                // 判断 orderStatus 是否包含列表中的任意一个值
                return validStatuses.some(status => row.orderStatus.includes(status)) && this.permissions.has('AISPART-retailOrder-printOut');
              },
              click: (rowIndex, row) => {
                this.handlePrint(row);
              },
              type: 'info',
            }, {
              name: '签收',
              popconfirmTitle: '是否签收该订单?',
              show: (row) => {
                return row.orderStatus === '30' && this.permissions.has('AISPART-retailOrder-sign');
              },
              click: (rowIndex, row) => {
                signOrder({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '签收成功!'
                  });
                  this.getData();
                }).catch(() => {
                });
              },
              type: 'info',
            }, {
              name: '取消签收',
              popconfirmTitle: '是否取消签收该订单?',
              show: (row) => {
                return row.orderStatus === '40' && this.permissions.has('AISPART-retailOrder-cancelSign');
              },
              click: (rowIndex, row) => {
                cancelSignOrder({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '取消签收成功!'
                  });
                  this.getData();
                }).catch(() => {
                });
              },
              type: 'info',
            }, {
              name: '退料申请',
              show: (row) => {
                return row.orderStatus === '30' && this.permissions.has('AISPART-retailOrder-applyReturnMaterial');
              },
              click: (rowIndex, row) => {
                this.handleReturnMaterial(row);
              },
              type: 'info',
            }, {
              name: '退料入库',
              show: (row) => {
                return (row.orderStatus === '30' && row.applyReturnMaterialIs === '1') && this.permissions.has('AISPART-retailOrder-returnMaterialInbound');
              },
              click: (rowIndex, row) => {
                this.handleOutbound(row, '2');
              },
              type: 'info',
            }, {
              name: '结算',
              show: (row) => {
                return row.orderStatus === '40' && this.permissions.has('AISPART-retailOrder-settle');
              },
              click: (rowIndex, row) => {
                settleOrder({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '结算成功!'
                  });
                  this.getData();
                }).catch(() => {
                });
              },
              type: 'info',
            }, {
              name: '取消结算',
              show: (row) => {
                return row.orderStatus === '50' && this.permissions.has('AISPART-retailOrder-cancelSettle');
              },
              click: (rowIndex, row) => {
                cancelSettleOrder({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '取消结算成功!'
                  });
                  this.getData();
                }).catch(() => {
                });
              },
              type: 'info',
            }, {
              name: '收款',
              show: (row) => {
                return row.orderStatus === '50' && this.permissions.has('AISPART-retailOrder-collectPayment');
              },
              click: (rowIndex, row) => {
                this.handleHarvest(row);
              },
              type: 'info',
            }, {
              name: '打印结算单',
              show: (row) => {
                return (row.orderStatus === '50' || row.orderStatus === '60') && this.permissions.has('AISPART-retailOrder-printSettle');
              },
              click: (rowIndex, row) => {
                this.handlePrintSettlementStatement(row);
              },
              type: 'info',
            }, {
              name: '反结算',
              show: (row) => {
                return row.orderStatus === '60' && this.permissions.has('AISPART-retailOrder-reverseSettle');
              },
              click: (rowIndex, row) => {
                this.$prompt('请输入备注', '反结算', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(({ value }) => {
                  reverseSettleOrder({ id: row.id, description: value }).then(() => {
                    this.$message({
                      type: 'success',
                      message: '反结算成功!'
                    });
                    this.getData();
                  });
                });
              },
              type: 'info',
            }, {
              name: '退订入库',
              show: (row) => {
                return row.orderStatus === '100' && this.permissions.has('AISPART-retailOrder-cancelOrderInbound');
              },
              click: (rowIndex, row) => {
                this.handleOutbound(row, '3');
              },
              type: 'info',
            }, {
              name: '退款',
              show: (row) => {
                return row.orderStatus === '70' && this.permissions.has('AISPART-retailOrder-refund');
              },
              click: (rowIndex, row) => {
                this.$prompt('请输入退款备注', '退款', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(({ value }) => {
                  refundOrder({ id: row.id, description: value }).then(() => {
                    this.$message({
                      type: 'success',
                      message: '退款成功!'
                    });
                    this.getData();
                  });
                });
              },
              type: 'info',
            }]
          }
        ],
        total: 0
      },
      optionObjAll: {
        id: 'retailOrderTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          /* ========== 订单维度 ========== */
          {
            props: 'code',
            label: '备附件销售单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/sale/retailOrder/edit', query: { id: row.retailOrderId || row.id } }); }, type: 'primary' }]
          },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 180 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'cooperationTypeLabel', label: '门店合作类型', visible: true, width: 120 },
          { props: 'warehouseName', label: '仓库名称', visible: true, width: 200 },
          { props: 'customerTypeLabel', label: '客户类型', visible: true, width: 120 },
          { props: 'vin', label: 'VIN', visible: true, width: 200 },
          { props: 'customerCode', label: '客户编码', visible: true, width: 180 },
          {
            props: 'customerName',
            label: '客户名称',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDesensitize(row.retailOrderId, 'retailOrder', 'customerName')
          },
          {
            props: 'customerContactInfo',
            label: '客户联系方式',
            visible: true,
            width: 160,
            mask: true,
            getValue: (row) => getDesensitize(row.retailOrderId, 'retailOrder', 'customerContactInfo')
          },
          { props: 'customerRemark', label: '客户备注', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 120 },
          {
            props: 'totalAmount',
            label: '订单总金额',
            visible: true,
            width: 140,
            align: 'right'
          },
          {
            props: 'discountAmount',
            label: '优惠总金额',
            visible: true,
            width: 140,
            align: 'right'
          },
          {
            props: 'payableAmount',
            label: '应付总金额',
            visible: true,
            width: 140,
            align: 'right'
          },
          {
            props: 'remainingPayableAmount',
            label: '剩余应付金额',
            visible: true,
            width: 140,
            align: 'right'
          },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },

          /* ========== 明细维度 ========== */
          { props: 'sparePartCode', label: '备件编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/basic/sparePart/detail', query: { id: row.sparePartId } }); }, type: 'primary' }] },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'locationName', label: '库位', visible: true, width: 120 },
          {
            props: 'availableQty',
            label: '可用库存',
            visible: true,
            width: 120,
            align: 'right'
          },
          { props: 'priceTypeLabel', label: '价格类型', visible: true, width: 120 },
          {
            props: 'unitPrice',
            label: '单价',
            visible: true,
            width: 120,
            align: 'right'
          },
          {
            props: 'discountAmountDetail',
            label: '优惠金额',
            visible: true,
            width: 120,
            align: 'right'
          },
          {
            props: 'payableAmountDetail',
            label: '应付金额',
            visible: true,
            width: 120,
            align: 'right'
          },
          {
            props: 'qty',
            label: '数量',
            visible: true,
            width: 120,
            align: 'right'
          },
          { props: 'outboundIsLabel', label: '是否出库', visible: true, width: 120 },
          {
            props: 'outboundOperatorName',
            label: '出库操作人',
            visible: true,
            width: 120,
            mask: true,
            getValue: (row) => getDesensitize(row.retailOrderId, 'retailOrder', 'outboundOperatorName')
          },
          { props: 'outboundTime', label: '出库操作时间', visible: true, width: 200 },
          {
            props: 'inboundOperatorName',
            label: '入库操作人',
            visible: true,
            width: 120,
            mask: true,
            getValue: (row) => getDesensitize(row.retailOrderId, 'retailOrder', 'inboundOperatorName')
          },
          { props: 'inboundTime', label: '入库操作时间', visible: true, width: 200 },
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
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
        this.cooperationType = res.cooperationType;
      }
      if (this.accountFlag === false) {
        this.isPartOrder = true;
      }
    },
    // 排序
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    getOptionObj () {
      if (this.activeName === 'homePage') {
        return this.optionObj;
      } else if (this.activeName === 'allSpareParts') {
        return this.optionObjAll;
      }
      return this.optionObj;
    },
    handleClick (item) {
      this.activeName = item.name;
      this.show = false;
      // 跨 tab 切换时，把所有 tab 的分页状态都重置为 page 1 + 默认 size
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.optionObjAll.form.page = 1;
      this.optionObjAll.form.size = pageSize;
      this.onReset();
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd (val) {
      this.$router.push({
        path: '/sparepart/sale/retailOrder/edit',
        query: {
          customerType: val
        }
      });
    },
    onSubmit () {
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      // 全部备件 tab：默认创建时间 = 最近一个月（end 用 23:59:59）
      const extraDefaults = this.activeName === 'allSpareParts'
        ? { createTime: this.getLastMonthRange() }
        : {};
      // 注意：不要整体替换 this.form —— 会丢失 Vue 2 响应性，导致子组件 watch 失效。
      // 必须用 Object.assign 原地写入响应式对象，触发 setter 让 watcher 重新执行。
      Object.assign(this.form, defaultForm, extraDefaults);
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      optionObj.form.size = pageSize;
      this.getData();
    },
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
    exportExcel () {
      this.exportLoading = true;
      const formData = this.getFormData();
      if (formData === null) {
        this.exportLoading = false;
        return;
      }
      const reqParams = formData || {};
      let fetchPath = 'sp/web/dealer/retailOrder/page';
      let tableRef = this.$refs.tableRef;
      if (this.activeName === 'homePage') {
        tableRef = this.$refs.tableRef;
        fetchPath = 'sp/web/dealer/retailOrder/page';
      } else {
        tableRef = this.$refs.tableRefAll;
        fetchPath = 'sp/web/dealer/retailOrder/detailPage';
      }
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '备附件零售',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备附件零售.xlsx');
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
    getData () {
      this.loading = true;
      this.selectionList = [];
      const optionObj = this.getOptionObj();

      const fetchApi = this.activeName === 'allSpareParts' ? detailPage : getList;
      const formData = this.getFormData();
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
          optionObj.total = res?.total || 0;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      const optionObj = this.getOptionObj();
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
      const optionObj = this.getOptionObj();
      if (type === 'page') {
        optionObj.form.page = num;
      } else {
        optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        const val = data[key];

        // 情况 A: 值为 null, undefined, 或 空字符串 ''
        if (val === '' || val === null || val === undefined) {
          delete data[key];
          return;
        }

        // 情况 B: 值为空数组 [] 或 空字符串 '' (再次确认 length)
        // 注意：上面 !val 已经处理了 ''，这里主要处理 []
        if (Array.isArray(val) && val.length === 0) {
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
      if (this.form.outboundTime) {
        delete data.outboundTime;
        if (this.form.outboundTime.length > 1) {
          data.outboundTimeStart = this.form.outboundTime[0];
          data.outboundTimeEnd = this.form.outboundTime[1];
        }
      }
      if (this.form.inboundTime) {
        delete data.inboundTime;
        if (this.form.inboundTime.length > 1) {
          data.inboundTimeStart = this.form.inboundTime[0];
          data.inboundTimeEnd = this.form.inboundTime[1];
        }
      }
      // ===== 全部备件 tab：订单创建时间跨度校验（不超过半年） =====
      if (this.activeName === 'allSpareParts' && data.createTimeStart && data.createTimeEnd) {
        const start = new Date(data.createTimeStart);
        const end = new Date(data.createTimeEnd);
        const sixMonthsLater = new Date(start);
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        if (end > sixMonthsLater) {
          this.$message.warning('【订单创建时间】跨度不能超过半年');
          return null;
        }
      }
      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
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
    // 打印设置
    excelSetting () {
      this.printSettingsVisible = true;
    },
    // 出库
    handleOutbound (row, ele) {
      this.outboundId = row.id;
      this.titleDialog = ele;
      this.outboundDialogVisible = true;
    },
    // 退料申请
    handleReturnMaterial (row) {
      this.returnMaterialId = row.id;
      this.returnMaterialDialogVisible = true;
    },
    // 收款
    handleHarvest (row) {
      this.harvestForm = row;
      this.harvestDialogVisible = true;
    },
    // 打印出库单
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'SparesOutbound', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}备件出库单`// 可选，打印标题
      });
    },
    // 打印结算单
    handlePrintSettlementStatement (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'SettlementStatement', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}厅店结算单`// 可选，打印标题
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-retail-order-list {
}
</style>
