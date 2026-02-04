<template>
  <div class="page-common m-service-proxy-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="采购订单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="采购申请单">
        <tag-input v-model="form.purchaseApplyCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备件编码" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.purchaseApplyCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="缺货单号"  v-show="this.visibleCount === 3 || show" v-if="activeName === 'homePage'">
        <tag-input v-model="form.backOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="备注" v-if="activeName === 'homePage'">
          <el-input
            placeholder="请输入"
            v-model="form.remarkLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="发货仓库" v-if="activeName === 'homePage'">
          <el-input
            placeholder="请输入"
            v-model="form.deliveryWarehouseLike"
            clearable
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
        <el-form-item label="订单类型" v-if="activeName === 'homePage'">
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
        <el-form-item label="订单状态" v-if="activeName === 'homePage'">
          <fetch-select
            :request="fetchOptions"
            enumCode="PurchaseOrderStatusEnum"
            v-model="form.orderStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="发运单">
          <el-input
            placeholder="请输入"
            v-model="form.shippingOrderLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
            type="daterange"
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button> -->
      <el-button v-if="activeName === 'allSpareParts'" size="small" @click="handleBatchClaim" :disabled="selectionList.length === 0">提交索赔</el-button>
      <el-button v-if="activeName === 'proxySign'" size="small" @click="handleBatchSignFor(false)" :disabled="selectionList.length === 0">批量签收</el-button>
      <el-button v-if="activeName === 'proxySign'" size="small" @click="handleBatchSignFor(true)" :disabled="selectionList.length === 0">签收并入库</el-button>
    </div>
    <div class="ais-tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="homePage"></el-tab-pane>
        <el-tab-pane label="全部备件" name="allSpareParts"></el-tab-pane>
        <el-tab-pane label="待签收备件" name="proxySign"></el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="ais-table-c"
      v-if="activeName === 'homePage'"
    >
      <LPVxeTable
        :key="1"
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
      <!-- 使用原生表格 先不优化代码 看最后要不要 表格配置 不要再优化 -->
      <vxe-table
        :key="2"
        ref="tableRefAll"
        :data="optionObjAll.dataList"
        v-loading="loading"
        stripe
        resizable
        border="inner"
        size="medium"
        height="auto"
        min-height="200px"
        max-height="600px"
        width="1000px"
        :checkbox-config="{ checkField: 'checked' }"
        @checkbox-change="handleSelectionChangeBatch"
        @checkbox-all="handleSelectionChangeBatch"
      >
        <vxe-column type="checkbox" fixed="left" width="60" align="center" />
        <vxe-column title="采购订单号" fixed="left" field="purchaseOrderCode" width="200">
          <template #default="{ row }">
            <div class="action-button btn-link" @click="handleJump('/sparepart/purchase/purchaseOrder/edit', row.id)">{{ row.purchaseOrderCode }}</div>
          </template>
        </vxe-column>
        <vxe-column title="采购申请单" fixed="left" field="purchaseApplyCode" width="200">
          <template #default="{ row }">
            <div class="action-button btn-link" @click="handleJump('/sparepart/purchase/purchaseApply/edit', row.purchaseApplyId)">{{ row.purchaseApplyCode }}</div>
          </template>
        </vxe-column>
        <vxe-column title="门店编码" field="dealerCode" width="200"></vxe-column>
        <vxe-column title="门店名称" field="dealerName" width="200"></vxe-column>
        <vxe-column title="备件编码" field="partCode" width="200"></vxe-column>
        <vxe-column title="备件名称" field="partName" width="200"></vxe-column>
        <vxe-column title="结算数量" field="settlementQty" width="200"></vxe-column>
        <vxe-column title="取消数量" field="cancelQty" width="200"></vxe-column>
        <vxe-column title="已发运数" field="outboundQty" width="200"></vxe-column>
        <vxe-column title="已签收数" field="signedQty" width="200"></vxe-column>
        <vxe-column title="已入库数" field="inboundQty" width="200"></vxe-column>
        <vxe-column title="取消人" field="cancelOperator" width="200"></vxe-column>
        <vxe-column title="取消时间" field="cancelTime" width="200"></vxe-column>
        <vxe-column title="原价" field="originalPrice" width="200"></vxe-column>
        <vxe-column title="采购价" field="purchasePrice" width="200"></vxe-column>
        <vxe-column title="采购金额" field="purchaseAmount" width="200"></vxe-column>
        <vxe-column title="折后价" field="cashUnitPrice" width="200"></vxe-column>
        <vxe-column title="折后金额" field="cashAmount" width="200"></vxe-column>
        <vxe-column title="备注" field="detailRemark" width="200"></vxe-column>
        <vxe-column title="创建时间" field="createTime" width="200"></vxe-column>
        <vxe-column title="修改时间" field="updateTime" width="200"></vxe-column>
        <vxe-column title="操作" width="120" fixed="right">
          <template #default="{ row }">
            <div class="action-button btn-edit" @click="handleClaim(row)">提交索赔</div>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="table-pagination">
          <el-pagination
              @size-change="(val) => pageSizeChange(val, 'allSpareParts')"
              @current-change="(val) => currentPageChange(val, 'allSpareParts')"
              :current-page="optionObjAll.form.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="optionObjAll.form.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="optionObjAll.total"
          >
          </el-pagination>
      </div>
      <!-- <LPVxeTable
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
      </LPVxeTable> -->
    </div>
    <div
      class="ais-table-c"
      v-if="activeName === 'proxySign'"
    >
      <!-- 使用原生表格 先不优化代码 看最后要不要 表格配置 不要再优化 -->
      <vxe-table
        :key="3"
        ref="tableRefAll"
        :data="optionObjSign.dataList"
        v-loading="loading"
        stripe
        resizable
        border="inner"
        size="medium"
        height="auto"
        min-height="200px"
        max-height="600px"
        width="1000px"
        :checkbox-config="{ checkField: 'checked' }"
        @checkbox-change="handleSelectionChangeBatch"
        @checkbox-all="handleSelectionChangeBatch"
      >
        <vxe-column type="checkbox" fixed="left" width="60" align="center" />
        <vxe-column title="采购订单号" fixed="left" field="purchaseOrderCode" width="200">
          <template #default="{ row }">
            <div class="action-button btn-link" @click="handleJump('/sparepart/purchase/purchaseOrder/edit', row.id)">{{ row.purchaseOrderCode }}</div>
          </template>
        </vxe-column>
        <vxe-column title="采购申请单" fixed="left" field="purchaseApplyCode" width="200">
          <template #default="{ row }">
            <div class="action-button btn-link" @click="handleJump('/sparepart/purchase/purchaseApply/edit', row.purchaseApplyId)">{{ row.purchaseApplyCode }}</div>
          </template>
        </vxe-column>
        <vxe-column title="运单号" field="dealerCode" width="200"></vxe-column>
        <vxe-column title="备注" field="detailRemark" width="200"></vxe-column>
        <vxe-column title="备件编码" field="dealerName" width="200"></vxe-column>
        <vxe-column title="备件名称" field="dealerName" width="200"></vxe-column>
        <vxe-column title="结算数量" field="settlementQty" width="200"></vxe-column>
        <vxe-column title="取消数量" field="cancelQty" width="200"></vxe-column>
        <vxe-column title="已发运数" field="outboundQty" width="200"></vxe-column>
        <vxe-column title="已签收数" field="signedQty" width="200"></vxe-column>
        <vxe-column title="已入库数" field="inboundQty" width="200"></vxe-column>
        <vxe-column title="仓库名称" field="cancelOperator" width="200"></vxe-column>
        <vxe-column title="本次签收数" field="cancelTime" width="200"></vxe-column>
        <vxe-column title="创建时间" field="createTime" width="200"></vxe-column>
        <vxe-column title="修改时间" field="updateTime" width="200"></vxe-column>
        <vxe-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-button btn-edit" @click="handleSignFor(row, false)">签收</div>
            <div class="action-button btn-edit" @click="handleSignFor(row, true)">签收并入库</div>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="table-pagination">
          <el-pagination
              @size-change="(val) => pageSizeChange(val, 'proxySign')"
              @current-change="(val) => currentPageChange(val, 'proxySign')"
              :current-page="optionObjSign.form.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="optionObjSign.form.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="optionObjSign.total"
          >
          </el-pagination>
      </div>
      <!-- <LPVxeTable
        ref="tableRefSign"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObjSign"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable> -->
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
    />
    <!-- 签收  签收/并入库弹窗 -->
    <SignForDialog
      ref="signForDialogRef"
      :visible="signDialogVisible"
      :signForForm="signForm"
      @close="handleSignDialogClose"
      @submit="handleSignForSubmit"
    />
    <!-- 批量签收  签收/入库弹窗 -->
    <BatchSignForDialogAll
      ref="batchSignForDialogRef"
      :visible="batchSignDialogVisible"
      :batchForm="batchForm"
      :inbound="inbound"
      @close="handleBatchSignDialogClose"
      @submit="handleBatchSignForSubmit"
    />
    <!-- 提交索赔 -->
    <SubmitClaimDialog
      ref="submitClaimDialogRef"
      :visible="submitClaimDialogVisible"
      :claimList="selectionClaim"
      @close="handleSubmitClaimDialogClose"
      @submit="handleSubmitClaimSubmit"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, pageAll, pageWaitSign } from '@/api/sparepart/purchase/purchaseOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, listWarehouse } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import SignForDialog from './SignForDialogAll.vue';
import BatchSignForDialogAll from './BatchSignForDialogAll.vue';
import SubmitClaimDialog from './SubmitClaimDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
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
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    FetchSelect,
    Upload,
    TagInput,
    LPVxeTable,
    EditPage,
    SignForDialog,
    BatchSignForDialogAll,
    SubmitClaimDialog
  },
  data () {
    return {
      pageTitle: '备件采购订单',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-purchaseOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      activeName: 'homePage',
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      signDialogVisible: false, // 签收弹窗
      signForm: {}, // 签收/入库
      batchSignDialogVisible: false, // 批量签收/入库弹窗
      inbound: false, // 批量签收/入库
      batchForm: [], // 批量签收/入库
      submitClaimDialogVisible: false, // 提交索赔弹窗
      selectionClaim: [], // 选中的采购订单
      clickItemId: '',
      optionObj: {
        id: 'purchaseOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: 20
        },
        dataProp: [
          {
            props: 'code',
            label: '采购订单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
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
                  query: {
                    id: row.purchaseApplyId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'backOrderCode', label: '缺货单号', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'deliveryWarehouse', label: '发货仓库', visible: true, width: 200 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 200 },
          { props: 'shippingOrder', label: '发运单', visible: true, width: 200 },
          { props: 'purchaseAmount', label: '采购金额', visible: true, width: 200 },
          { props: 'cashAmount', label: '使用现金', visible: true, width: 200 },
          { props: 'rebateAmount', label: '使用返利', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
        ],
        total: 0
      },
      optionObjAll: {
        form: {
          page: 1,
          size: 20
        },
        dataList: [],
        total: 0
      },
      optionObjSign: {
        form: {
          page: 1,
          size: 20
        },
        dataList: [],
        total: 0
      }
      // 暂注释 使用另外一种表格 看最后要不要 表格配置
      // optionObjAll: {
      //   id: 'purchaseOrderTableAll',
      //   dataList: [],
      //   form: {
      //     page: 1,
      //     size: pageSize
      //   },
      //   dataProp: [
      //     {
      //       props: 'code',
      //       label: '采购订单号',
      //       visible: true,
      //       width: 200,
      //       fixed: 'left',
      //       buttons: [{
      //         click: (rowIndex, row) => {
      //           this.$router.push({
      //             path: '/sparepart/purchase/purchaseOrder/edit',
      //             query: {
      //               id: row.id
      //             }
      //           });
      //         },
      //         type: 'primary'
      //       }]
      //     },
      //     {
      //       props: 'purchaseApplyCode',
      //       label: '采购申请单',
      //       visible: true,
      //       width: 200,
      //       fixed: 'left',
      //       buttons: [{
      //         click: (rowIndex, row) => {
      //           this.$router.push({
      //             path: '/sparepart/purchase/purchaseApply/edit',
      //             query: {
      //               id: row.purchaseApplyId
      //             }
      //           });
      //         },
      //         type: 'primary'
      //       }]
      //     },
      //     { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
      //     { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
      //     { props: 'sparePartCode', label: '备件编码', visible: true, width: 200 },
      //     { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
      //     { props: 'settlementQty', label: '结算数量', visible: true, width: 200 },
      //     { props: 'cancelQty', label: '取消数量', visible: true, width: 200 },
      //     { props: 'outboundQty', label: '已发运数', visible: true, width: 200 },
      //     { props: 'signedQty', label: '已签收数', visible: true, width: 200 },
      //     { props: 'inboundQty', label: '已入库数', visible: true, width: 200 },
      //     { props: 'cancelOperator', label: '取消人', visible: true, width: 200 },
      //     { props: 'cancelTime', label: '取消时间', visible: true, width: 200 },
      //     { props: 'cancelDescription', label: '取消说明', visible: true, width: 200 },
      //     { props: 'originalPrice', label: '原价', visible: true, width: 200 },
      //     { props: 'purchasePrice', label: '采购价', visible: true, width: 200 },
      //     { props: 'purchaseAmount', label: '采购金额', visible: true, width: 200 },
      //     { props: 'rebateUnitPrice', label: '折后价', visible: true, width: 200 },
      //     { props: 'rebateAmount', label: '折后金额', visible: true, width: 200 },
      //     { props: 'detailRemark', label: '备注', visible: true, width: 200 },
      //     { props: 'createTime', label: '创建时间', visible: true, width: 200 },
      //     { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
      //     {
      //       props: 'operate',
      //       label: '操作',
      //       type: 'operate',
      //       visible: true,
      //       fixed: 'right',
      //       buttons: [{
      //         name: '提交索赔',
      //         click: (rowIndex, row) => {
      //         },
      //         type: 'info'
      //       }]
      //     }
      //   ],
      //   total: 0
      // },
      // optionObjSign: {
      //   id: 'purchaseOrderTableSign',
      //   dataList: [],
      //   form: {
      //     page: 1,
      //     size: pageSize
      //   },
      //   dataProp: [
      //     {
      //       props: 'code',
      //       label: '采购订单号',
      //       visible: true,
      //       width: 200,
      //       fixed: 'left',
      //       buttons: [{
      //         click: (rowIndex, row) => {
      //           this.$router.push({
      //             path: '/sparepart/purchase/purchaseOrder/edit',
      //             query: {
      //               id: row.id
      //             }
      //           });
      //         },
      //         type: 'primary'
      //       }]
      //     },
      //     {
      //       props: 'purchaseApplyCode',
      //       label: '采购申请单',
      //       visible: true,
      //       width: 200,
      //       fixed: 'left',
      //       buttons: [{
      //         click: (rowIndex, row) => {
      //           this.$router.push({
      //             path: '/sparepart/purchase/purchaseApply/edit',
      //             query: {
      //               id: row.purchaseApplyId
      //             }
      //           });
      //         },
      //         type: 'primary'
      //       }]
      //     },
      //     { props: 'dealerCode', label: '运单号', visible: true, width: 200 },
      //     { props: 'detailRemark', label: '备注', visible: true, width: 200 },
      //     { props: 'sparePartCode', label: '备件编码', visible: true, width: 200 },
      //     { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
      //     { props: 'settlementQty', label: '结算数量', visible: true, width: 200 },
      //     { props: 'cancelQty', label: '取消数量', visible: true, width: 200 },
      //     { props: 'outboundQty', label: '已发运数', visible: true, width: 200 },
      //     { props: 'signedQty', label: '已签收数', visible: true, width: 200 },
      //     { props: 'inboundQty', label: '已入库数', visible: true, width: 200 },
      //     { props: 'cancelOperator', label: '仓库名称', visible: true, width: 200 },
      //     { props: 'cancelTime', label: '本次签收数', visible: true, width: 200 },
      //     { props: 'createTime', label: '创建时间', visible: true, width: 200 },
      //     { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
      //     {
      //       props: 'operate',
      //       label: '操作',
      //       type: 'operate',
      //       visible: true,
      //       fixed: 'right',
      //       buttons: [{
      //         name: '签收',
      //         click: (rowIndex, row) => {
      //         },
      //         type: 'info'
      //       }, {
      //         name: '签收并入库',
      //         click: (rowIndex, row) => {
      //         },
      //         type: 'info'
      //       }]
      //     }
      //   ],
      //   total: 0
      // }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/purchase/purchaseOrder/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else if (this.activeName === 'allSpareParts') {
        optionObj = this.optionObjAll;
      } else if (this.activeName === 'proxySign') {
        optionObj = this.optionObjSign;
      }
      optionObj.form.page = 1;
      optionObj.form.size = 20;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: '备件采购订单',
        dataFetchPath: 'sparepart/web/purchase/purchaseOrder/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件采购订单.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      let fetchApi = getList;
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        fetchApi = getList;
        optionObj = this.optionObj;
      } else if (this.activeName === 'allSpareParts') {
        fetchApi = pageAll;
        optionObj = this.optionObjAll;
      } else if (this.activeName === 'proxySign') {
        fetchApi = pageWaitSign;
        optionObj = this.optionObjSign;
      }
      fetchApi({ ...this.getFormData(), pageNum: optionObj.form.page, pageSize: optionObj.form.size })
        .then(res => {
          optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          optionObj.total = res.total;
          console.log('optionObj', optionObj.total);
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
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
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
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
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    // 批量签收 批量签收入库  提交索赔
    handleSelectionChangeBatch ({ records }) {
      this.selectionList = records;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || data[key].length === 0) {
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
    // 点击tabs栏切换
    handleClick (item) {
      this.activeName = item.name;
      this.getData();
    },
    // 跳转详情页
    handleJump (val, ele) {
      this.$router.push({
        path: val,
        query: {
          id: ele
        }
      });
    },
    pageSizeChange (pageSize, type) {
      if (type === 'allSpareParts') {
        this.optionObjAll.form.size = pageSize;
        this.optionObjAll.form.page = 1;
      } else if (type === 'proxySign') {
        this.optionObjSign.form.size = pageSize;
        this.optionObjSign.form.page = 1;
      }
      this.getData();
    },
    currentPageChange (current, type) {
      if (type === 'allSpareParts') {
        this.optionObjAll.form.page = current;
      } else if (type === 'proxySign') {
        this.optionObjSign.form.page = current;
      }
      this.getData();
    },
    // 签收  签收并入库
    handleSignFor (val, type) {
      this.signForm = {
        purchaseOrderId: val.purchaseOrderId,
        inbound: type
      };
      this.signDialogVisible = true;
    },
    handleSignDialogClose () {
      this.signDialogVisible = false;
    },
    handleSignForSubmit () {
      this.signDialogVisible = false;
      this.getData();
    },
    // 批量签收  批量并入库
    handleBatchSignFor (type) {
      this.batchForm = this.selectionList.map(item => ({
        purchaseOrderId: item.purchaseOrderId,
      }));
      this.inbound = type;
      this.batchSignDialogVisible = true;
    },
    handleBatchSignDialogClose () {
      this.batchSignDialogVisible = false;
    },
    handleBatchSignForSubmit () {
      this.batchSignDialogVisible = false;
      this.selectionList = [];
      this.getData();
    },
    // 提交索赔
    handleClaim (row) {
      this.selectionClaim = [row] || [];
      this.submitClaimDialogVisible = true;
    },
    handleBatchClaim () {
      this.selectionClaim = this.selectionList;
      this.submitClaimDialogVisible = true;
    },
    handleSubmitClaimDialogClose () {
      this.submitClaimDialogVisible = false;
    },
    handleSubmitClaimSubmit () {
      this.submitClaimDialogVisible = false;
      this.selectionList = [];
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.m-service-proxy-list {
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  .ais-table-c {
    height: calc(100% - 168px);
  }
  .table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
  .action-button{
    margin: 0 5px;
    cursor: pointer;
    &.btn-edit{
      color:#4C4CD6;
    }
    &.btn-link {
      color: #009100;
    }
    &.active{
      text-decoration: underline;
    }
  }
}
</style>
