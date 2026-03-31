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
          {{ form.code }}
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="备件索赔单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="索赔类型：" prop="claimType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="ClaimTypeEnum"
                    v-model="form.claimType"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="isClaimStatus || isAccountFlag"
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  {{ form.confirmerName }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  {{ form.confirmTime }}
                </el-form-item>
                <el-form-item label="驳回原因：" prop="rejectionDescription">
                  {{ form.rejectionDescription }}
                </el-form-item>
                <el-form-item label="索赔状态：" prop="claimStatus">
                  {{ form.claimStatusLabel }}
                </el-form-item>
                <el-form-item label="责任方：" prop="responsibleParty">
                  {{ form.responsibleParty }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="审批节点：" prop="approvalNode">
                  {{ form.approvalNode }}
                </el-form-item>
                <el-form-item label="理赔方式：" prop="compensationMethod">
                  {{ form.compensationMethod }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    type="textarea"
                    maxlength="500"
                    show-word-limit
                    :disabled="isClaimStatus || isAccountFlag"
                />
                </el-form-item>
              </el-form>
            <div class="common-title" v-show="isEditing || !_id">采购单收货方</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="备件收货人姓名：" prop="receiverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverName"
                    clearable
                    :disabled="isClaimStatus || !accountFlag"
                />
                </el-form-item>
                <el-form-item label="备件收货人手机：" prop="receiverPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                    :disabled="isClaimStatus || !accountFlag"
                />
                </el-form-item>
                <el-form-item label="省市区：" prop="provinceCityCountyCode"
                  >
                    <el-cascader
                      placeholder="请选择省市区"
                      v-model="form.provinceCityCountyCode"
                      :props="orgProps"
                      :options="areaOptions"
                      filterable
                      clearable
                      :disabled="isClaimStatus || !accountFlag"
                    >
                  </el-cascader>
                  </el-form-item>
                <el-form-item label="备件收货地址：" prop="address"  v-show="isEditing || !_id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                    :disabled="isClaimStatus || !accountFlag"
                />
                </el-form-item>
                <el-form-item label="备件收货地址：" prop="address" v-show="!(isEditing || !_id)">
                  {{ form.address }}
                </el-form-item>
              </el-form>
            <div class="common-title" v-show="isEditing || !_id">采购单发货方</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="仓库编码：" prop="deliveryWarehouseCode">
                  {{ form.deliveryWarehouseCode }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="deliveryWarehouseName">
                  {{ form.deliveryWarehouseName }}
                </el-form-item>
                <el-form-item label="省：" prop="deliveryProvinceName">
                  {{ form.deliveryProvinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="deliveryCityName">
                  {{ form.deliveryCityName }}
                </el-form-item>
                <el-form-item label="区：" prop="deliveryDistrictName">
                  {{ form.deliveryDistrictName }}
                </el-form-item>
                <el-form-item label="地址：" prop="deliveryAddress">
                  {{ form.deliveryAddress }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id"></el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件索赔单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="索赔类型：" prop="claimTypeLabel">
                  {{ form.claimTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  {{ form.confirmerName }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  {{ form.confirmTime }}
                </el-form-item>
                <el-form-item label="驳回原因：" prop="rejectionDescription">
                  {{ form.rejectionDescription }}
                </el-form-item>
                <el-form-item label="索赔状态：" prop="claimStatus">
                  {{ form.claimStatusLabel }}
                </el-form-item>
                <el-form-item label="责任方：" prop="responsibleParty">
                  {{ form.responsibleParty }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="审批节点：" prop="approvalNode">
                  {{ form.approvalNode }}
                </el-form-item>
                <el-form-item label="理赔方式：" prop="compensationMethod">
                  {{ form.compensationMethod }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="!(isEditing || !_id)">采购单收货方</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="!(isEditing || !_id) ">
                <el-form-item label="备件收货人姓名：" prop="receiverName">
                  {{ form.receiverName }}
                </el-form-item>
                <el-form-item label="备件收货人手机：" prop="receiverPhone">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="备件收货地址：" prop="address">
                  {{ form.address }}
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="!(isEditing || !_id)">采购单发货方</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="!(isEditing || !_id)">
                <el-form-item label="仓库编码：" prop="deliveryWarehouseCode">
                  {{ form.deliveryWarehouseCode }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="deliveryWarehouseName">
                  {{ form.deliveryWarehouseName }}
                </el-form-item>
                <el-form-item label="省：" prop="deliveryProvinceName">
                  {{ form.deliveryProvinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="deliveryCityName">
                  {{ form.deliveryCityName }}
                </el-form-item>
                <el-form-item label="区：" prop="deliveryDistrictName">
                  {{ form.deliveryDistrictName }}
                </el-form-item>
                <el-form-item label="地址：" prop="deliveryAddress">
                  {{ form.deliveryAddress }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>索赔明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="sparePartCode" title="备件编码" min-width="10%" />
                  <vxe-column field="sparePartName" title="备件名称" min-width="10%" />
                  <vxe-column field="inboundQty" title="已入库数" min-width="10%" />
                  <vxe-column field="claimQty" title="索赔数量" min-width="10%" >
                    <template #default="{ row }">
                      <el-input v-model="row.claimQty" :disabled="isClaimStatus || !accountFlag" :max="row.inboundQty" type="number" min="1" @blur="handleQtyBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="claimDescription" title="索赔说明" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.claimDescription" :disabled="isClaimStatus || !accountFlag" @blur="handleQtyBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无数据</div>
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
          <section class="common-section">
            <div class="common-section-header">
              <h2>附件信息</h2>
            </div>
            <div class="common-section-body">
              <h2 style="padding-bottom: 10px;">附件申请</h2>
              <div class="common-section-table">
                <!-- 附件上传组件 -->
                <AisAttachment
                  :businessId="_id"
                  configCode="mcs_partsclaimorder"
                  attachType="索赔申请附件"
                  :readonly="form.claimStatus !== '10' && form.claimStatus !== '30'"
                />
              </div>
              <h2 style="padding-bottom: 10px;">审批附件</h2>
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
          <section class="common-section">
            <div class="common-section-header">
              <h2>索赔出库缺货明细</h2>
            </div>
            <div class="common-section-body">
              <el-tabs v-model="activeName">
                <el-tab-pane label="出库明细" name="getOutboundDetailList" />
                <el-tab-pane label="缺货明细" name="getBackDetailList" />
              </el-tabs>
              <div class="common-section-table">
                <ComponentTable
                  v-if="activeName === 'getOutboundDetailList'"
                  :columns="outboundColumns"
                  :pagination="true"
                  :api-method="getOutboundDetailList"
                  name="出库明细"
                />
                <ComponentTable
                  v-if="activeName === 'getBackDetailList'"
                  :columns="backColumns"
                  :pagination="true"
                  :api-method="getBackDetailList"
                  name="缺货明细"
                />
                <!-- <edit-table
                  ref="editTable"
                  :columns="claimColumns"
                  :data="claimTableData"
                  :show-toolbar="false"
                  :auth="{edit: false, delete: false}"
                  :showPagination="true"
                  :current="current"
                  :pageSize="pageSize"
                  :total="total"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                /> -->
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>索赔历史</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <ComponentTable
                  :columns="historyColumns"
                  :pagination="true"
                  :api-method="historyPage"
                  name="索赔历史"
                />
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>索赔出库缺货明细</h2>
            </div>
            <div class="common-section-body">
              <el-tabs v-model="tabsName" @tab-click="handleTabClick">
                <el-tab-pane label="索赔物流跟踪" name="claimLogistics" />
                <el-tab-pane label="采购物流跟踪" name="purchaseLogistics" />
              </el-tabs>
              <div class="common-section-table">
                <div v-if="loadingLogistics" class="loading">
                <el-loading-spinner></el-loading-spinner>
                正在加载物流信息...
              </div>
              <div v-else-if="!logisticsData" class="no-data">
                暂无物流信息
              </div>
              <div v-else class="logistics-container" v-for="(logistics, index) in logisticsData" :key="index">
                <!-- 运单号和预计送达时间 -->
                <div class="logistics-header">
                  <span class="label">运单号：</span>
                  <span class="value">{{ logistics?.waybillCode }}</span>
                  <span class="label">预计送达日期：</span>
                  <span class="value">{{ logistics?.promiseAgingDate }}</span>
                </div>

                <!-- 物流节点 -->
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in logistics?.traceDetails || []"
                    :key="index"
                    :timestamp="item.time"
                    :color="'#007fff'"
                    :type="'info'"
                  >
                    <div class="timeline-content">
                      <strong>{{ item.context }}</strong>
                    </div>
                  </el-timeline-item>
                </el-timeline>
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
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  getDetailList, // 索赔明细
  getOutboundDetailList, // 索赔出库明细
  getBackDetailList, // 索赔库缺货明细
  historyPage, // 索赔历史
  claimOrderDetailUpdate,
  claimOrderLogisticsClaim,
  claimOrderLogisticsPurchase
} from '@/api/sparepart/claim/sparePartClaim/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getLoginUser } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AisAttachment from '@/libs/components/AisAttachment';
import ComponentTable from './ComponentTable.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  purchaseOrderCode: '',
  dealerCode: '',
  dealerName: '',
  submitTime: '',
  submitter: '',
  claimType: '',
  claimStatus: '',
  rejectionDescription: '',
  approvalDescription: '',
  completedIs: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  status: '',
  dataSource: '',
  purchaseOrderId: '',
  confirmer: '',
  confirmTime: '',
  approvalTime: '',
  approvalNode: '',
  compensationMethod: '',
  responsibleParty: '',
  receiverName: '',
  receiverPhone: '',
  provinceId: '',
  cityId: '',
  deliveryAddress: '',
};

export default {
  name: 'sparePartClaimEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    ComponentTable,
    AisAttachment,
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
    // EditTable
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    isClaimStatus () {
      const accountFlag = this.accountFlag;
      const hasClaimStatus = this.form.claimStatus === '10' || this.form.claimStatus === '30';
      return !accountFlag && hasClaimStatus;
    },
    isAccountFlag () {
      const accountFlag = this.accountFlag;
      const hasClaimStatus = this.form.claimStatus === '20';
      return accountFlag && hasClaimStatus;
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
    'form.code': {
      handler (val) {
        if (val) {
          // 根据当前 tab 获取对应物流数据
          const fetchApi = this.tabsName === 'claimLogistics'
            ? claimOrderLogisticsClaim
            : claimOrderLogisticsPurchase;
          this.getLogistics(fetchApi);
          // 索赔明细
          this.getDetailList();
        }
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件索赔',
      pageType: 'edit',
      title: '备件索赔单号：' + form.code,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePartClaim',
      loading: false,
      submitLoading: false,
      accountFlag: false, // 账号权限
      pageNum: 1, // 索赔明细
      pageSize: 10,
      total: 0,
      tabsName: 'claimLogistics',
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      areaOptions: JSON.parse(localStorage.areaTree),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      activeName: 'getOutboundDetailList',
      logisticsData: [], // 物流信息
      loadingLogistics: false,
      tableData: [
      ],
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      detailColumns: [
        { field: 'sparePartCode', title: '备件编码', width: '15%' },
        { field: 'sparePartName', title: '备件名称', width: '15%' }, // yapi没找到
        { field: '', title: '已入库数', width: '15%' }, // yapi没找到
        { field: 'claimQty', title: '索赔数量', width: '15%' },
        { field: 'claimDescription', title: '索赔说明', width: '25%' },
        { field: 'createTime', title: '创建时间', width: '15%' },
      ],
      outboundColumns: [
        { field: 'sparePartName', title: '备件名称', width: '15%' }, // yapi没找到
        { field: 'outboundQty', title: '出库数量', width: '15%' },
        { field: 'outboundOrderNo', title: '出库单号', width: '15%' },
        { field: 'outboundDate', title: '出库日期', width: '25%' }, // yapi没找到
        { field: '', title: '发货仓库', width: '15%' },
        { field: 'createTime', title: '创建时间', width: '15%' },
      ],
      backColumns: [
        { field: 'sparePartCode', title: '备件编码', width: '15%' }, // yapi没找到
        { field: 'sparePartName', title: '备件名称', width: '15%' }, // yapi没找到
        { field: 'backQty', title: '缺货数量', width: '15%' },
        { field: 'resolvedQty', title: '已解欠数量', width: '15%' },
        { field: 'createTime', title: '创建时间', width: '15%' },
      ],
      historyColumns: [
        { field: 'sparePartCode', title: '备件编码', width: '15%' },
        { field: 'sparePartName', title: '备件名称', width: '15%' }, // yapi没找到
        { field: 'claimOrderCode', title: '备件索赔单', width: '15%' },
        { field: 'claimTypeLabel', title: '索赔类型', width: '15%' }, // yapi没找到
        { field: 'claimQty', title: '索赔数量', width: '25%' },
        { field: 'updateTime', title: '提交时间', width: '15%' }, // 确认下是否是修改时间
      ],
      claimTableData: [],
      claimColumns: [
        {
          field: 'sparePartCode',
          title: '备件编码',
          width: '11%',
        },
        {
          field: 'sparePartName',
          title: '备件名称',
          width: '16.6%',
        },
        {
          field: 'outboundQty',
          title: '出库数量',
          width: '16.6%',
        },
        {
          field: 'outboundOrderNo',
          title: '出库单号',
          width: '16.6%',
        },
        {
          field: 'outboundDate',
          title: '出库日期',
          width: '16.6%',
        },
        {
          field: 'createTime',
          title: '发货仓库',
          width: '16.6%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '16.6%',
        },
      ],
      rules: {
        code: [
          { required: false, message: '请输入备件索赔单号', trigger: 'change' }
        ],
        purchaseOrderCode: [
          { required: false, message: '请输入备件采购单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: false, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: false, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        rejectionDescription: [
          { required: false, message: '请输入驳回说明', trigger: 'change' }
        ],
        approvalDescription: [
          { required: false, message: '请输入审批说明', trigger: 'change' }
        ],
        completedIs: [
          { required: false, message: '请输入是否完结', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        confirmer: [
          { required: false, message: '请输入确认人', trigger: 'change' }
        ],
        confirmTime: [
          { required: false, message: '请选择确认时间', trigger: 'change' }
        ],
        approvalTime: [
          { required: false, message: '请选择审批时间', trigger: 'change' }
        ],
        approvalNode: [
          { required: false, message: '请输入审批节点', trigger: 'change' }
        ],
        compensationMethod: [
          { required: false, message: '请输入理赔方式', trigger: 'change' }
        ],
        responsibleParty: [
          { required: false, message: '请输入责任方', trigger: 'change' }
        ],
        receiverName: [
          { required: false, message: '请输入备件收货人姓名', trigger: 'change' }
        ],
        receiverPhone: [
          { required: false, message: '请输入备件收货人手机', trigger: 'change' }
        ],
        provinceId: [
          { required: false, message: '请输入省ID', trigger: 'change' }
        ],
        cityId: [
          { required: false, message: '请输入市ID', trigger: 'change' }
        ],
        deliveryAddress: [
          { required: false, message: '请输入备件收货地址', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getLoginUser();
  },
  methods: {
    // 索赔出库明细
    getOutboundDetailList,
    // 索赔库缺货明细
    getBackDetailList,
    // 索赔历史
    historyPage,
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      // 不存在新增所以只有编辑
      const params = {
        id: this._id,
        claimDescription: this.form.claimDescription,
        claimQty: this.form.claimQty,
        statusDesc: this.form.statusDesc,
      };
      return addOrUpdate({ ...params });
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
    // 索赔明细
    async getDetailList () {
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        claimOrderId: this._id,
      };
      const res = await getDetailList(data);
      this.tableData = res.records;
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getDetailList();
    },
    handleCurrentChange (current) {
      this.pageNum = current;
      this.getDetailList();
    },
    // 索赔出库明细
    async getDetailListOutbound () {
      const data = {
        pageNum: 1,
        pageSize: 10,
        claimOrderId: this._id,
      };
      const res = await getOutboundDetailList(data);
      this.claimTableData = res.records;
    },
    async getLoginUser () {
      try {
        const res = await getLoginUser();
        this.accountFlag = res.accountFlag;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 失焦 触发更新
    async handleQtyBlur (row) {
      const params = {
        id: row.id,
        claimQty: row.claimQty,
        claimDescription: row.claimDescription,
      };
      await claimOrderDetailUpdate(params);
      this.getDetailList();
    },
    // 切换tab
    handleTabClick (tab) {
      let fetchApi = claimOrderLogisticsClaim;
      if (tab.name === 'claimLogistics') {
        fetchApi = claimOrderLogisticsClaim;
      } else {
        fetchApi = claimOrderLogisticsPurchase;
      }
      this.getLogistics(fetchApi);
    },
    // 物流信息接口
    async getLogistics (val) {
      this.loadingLogistics = true;
      const res = await val({ id: this._id });
      this.logisticsData = res || [];
      this.loadingLogistics = false;
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

.form-edit {
  text-align: left !important;
  .el-form-item {
    text-align: left !important;
  }
  .el-form-item__content {
    text-align: left !important;
  }
}

.logistics-container {
  margin-top: 16px;
}

.logistics-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}

.timeline-content {
  strong {
    display: block;
    margin-bottom: 4px;
  }
  p {
    font-size: 12px;
    color: #999;
  }
}

</style>
