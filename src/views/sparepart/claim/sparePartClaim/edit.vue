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
                  {{ form.claimTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  {{ form.confirmer }}
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
              </el-form>
            <div class="common-title" v-show="isEditing || !_id">采购单收货方</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="备件收货人姓名：" prop="compensationMethod">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverName"
                    clearable
                />
                </el-form-item>
                <el-form-item label="备件收货人手机：" prop="compensationMethod">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                />
                </el-form-item>
                <el-form-item label="省市区" prop="provinceCode"
                  >
                    <el-cascader
                      placeholder="请选择省市区"
                      v-model="form.provinceCityCountyCode"
                      :props="orgProps"
                      :options="areaOptions"
                      filterable
                      clearable>
                  </el-cascader>
                  </el-form-item>
                <el-form-item label="备件收货地址：" prop="address">
                  {{ form.address }}
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                />
                </el-form-item>
              </el-form>
            <div class="common-title" v-show="isEditing || !_id">采购单发货方</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="仓库编码：" prop="compensationMethod">
                  {{ form.receiverName }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="compensationMethod">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="省：" prop="compensationMethod">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="compensationMethod">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="区：" prop="compensationMethod">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="地址：" prop="compensationMethod">
                  {{ form.address }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id"></el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件索赔单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="索赔类型：" prop="claimType">
                  {{ form.claimTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  {{ form.confirmer }}
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
              </el-form>
              <div class="common-title" v-show="!(isEditing || !_id)">采购单收货方</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="!(isEditing || !_id) ">
                <el-form-item label="备件收货人姓名：" prop="compensationMethod">
                  {{ form.receiverName }}
                </el-form-item>
                <el-form-item label="备件收货人手机：" prop="compensationMethod">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="省：" prop="compensationMethod">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="compensationMethod">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="备件收货地址：" prop="compensationMethod">
                  {{ form.address }}
                </el-form-item>
              </el-form>
              <div class="common-title" v-show="!(isEditing || !_id)">采购单发货方</div>
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="!(isEditing || !_id)">
                <el-form-item label="仓库编码：" prop="compensationMethod">
                  {{ form.receiverName }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="compensationMethod">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="省：" prop="compensationMethod">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="compensationMethod">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="区：" prop="compensationMethod">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="地址：" prop="compensationMethod">
                  {{ form.address }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>索赔明细</h2>
            </div>
            <div class="common-section-body">
                <ComponentTable
                  :columns="detailColumns"
                  :pagination="true"
                  :api-method="getDetailList"
                  name="索赔明细"
                />
              <div class="common-section-table">
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
                />
              </div>
              <h2 style="padding-bottom: 10px;">审批附件</h2>
              <div class="common-section-table">
                <!-- 附件上传组件 -->
                <AisAttachment
                  :businessId="_id"
                  configCode="mcs_partsclaimorder"
                  attachType="索赔审批附件"
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
                <el-tab-pane label="库缺货明细" name="getBackDetailList" />
              </el-tabs>
              <div class="common-section-table">
                <ComponentTable
                  :columns="outboundColumns"
                  :pagination="true"
                  :api-method="getOutboundDetailList"
                  name="出库明细"
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
              <h2>物流信息</h2>
            </div>
            <div class="common-section-body">
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>物流信息</h2>
            </div>
            <div class="common-section-body">
              <div v-if="loadingLogistics" class="loading">
                <el-loading-spinner></el-loading-spinner>
                正在加载物流信息...
              </div>
              <div v-else-if="!logisticsData" class="no-data">
                暂无物流信息
              </div>
              <div v-else class="logistics-container">
                <!-- 运单号和预计送达时间 -->
                <div class="logistics-header">
                  <span class="label">运单号：</span>
                  <span class="value">{{ logisticsData.waybillNo }}</span>
                  <span class="label">预计送达日期：</span>
                  <span class="value">{{ logisticsData.estimatedArrivalTime }}</span>
                </div>

                <!-- 物流节点 -->
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in logisticsData.trackingList"
                    :key="index"
                    :timestamp="item.time"
                    :color="item.status === 'completed' ? '#007fff' : '#999'"
                    :type="item.status === 'completed' ? 'primary' : 'info'"
                    :size="item.status === 'completed' ? 'large' : 'normal'"
                  >
                    <div class="timeline-content">
                      <strong>{{ item.description }}</strong>
                      <p v-if="item.phone">{{ item.phone }}</p>
                      <p v-if="item.plateNumber">{{ item.plateNumber }}</p>
                    </div>
                  </el-timeline-item>
                </el-timeline>
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
  historyPage // 索赔历史
} from '@/api/sparepart/claim/sparePartClaim/index';
// import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
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
    // EditTable
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
      pageTitle: '备件索赔',
      pageType: 'edit',
      title: '备件索赔单号：' + form.code,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePartClaim',
      loading: false,
      submitLoading: false,
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
      logisticsData: null, // 物流信息
      loadingLogistics: false,
      tableData: [
      ],
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      detailColumns: [
        { field: 'sparePartCode', title: '备件编码', width: '15%' },
        { field: '', title: '备件名称', width: '15%' }, // yapi没找到
        { field: '', title: '已入库数', width: '15%' }, // yapi没找到
        { field: 'claimQty', title: '索赔数量', width: '15%' },
        { field: 'claimDescription', title: '索赔说明', width: '25%' },
        { field: 'createTime', title: '创建时间', width: '15%' },
      ],
      outboundColumns: [
        { field: '', title: '备件名称', width: '15%' }, // yapi没找到
        { field: '', title: '出库数量', width: '15%' },
        { field: 'outboundOrderNo', title: '出库单号', width: '15%' },
        { field: 'outboundDate', title: '出库日期', width: '25%' }, // yapi没找到
        { field: '', title: '发货仓库', width: '15%' },
        { field: 'createTime', title: '创建时间', width: '15%' },
      ],
      backColumns: [
        { field: '', title: '备件编码', width: '15%' }, // yapi没找到
        { field: '', title: '备件名称', width: '15%' }, // yapi没找到
        { field: 'backQty', title: '缺货数量', width: '15%' },
        { field: 'resolvedQty', title: '已解欠数量', width: '15%' },
        { field: 'createTime', title: '创建时间', width: '15%' },
      ],
      historyColumns: [
        { field: 'sparePartCode', title: '备件编码', width: '15%' },
        { field: '', title: '备件名称', width: '15%' }, // yapi没找到
        { field: 'claimOrderId', title: '备件索赔单', width: '15%' },
        { field: '', title: '索赔类型', width: '15%' }, // yapi没找到
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
        submitTime: [
          { required: false, message: '请选择提交时间', trigger: 'change' }
        ],
        submitter: [
          { required: false, message: '请输入提交人', trigger: 'change' }
        ],
        claimType: [
          { required: false, message: '请选择索赔类型:10货损,20货差（少）,30状态不符,40质量问题', trigger: 'change' }
        ],
        claimStatus: [
          { required: false, message: '请选择索赔状态:10草稿,20待确认,30已驳回,40审批中,50已完结', trigger: 'change' }
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
        createTime: [
          { required: false, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: false, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: false, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: false, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: false, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: false, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: false, message: '请输入修改者名称', trigger: 'change' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: false, message: '请输入数据来源，150:零小跑; 10:E10', trigger: 'change' }
        ],
        purchaseOrderId: [
          { required: false, message: '请输入采购订单号ID', trigger: 'change' }
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
    // this.getDetailList();
    // this.getDetailListOutbound();
  },
  methods: {
    // 索赔出库明细
    getOutboundDetailList,
    // 索赔库缺货明细
    getBackDetailList,
    // 索赔明细
    getDetailList,
    // 索赔历史
    historyPage,
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
    // 索赔明细
    // async getDetailList () {
    //   const data = {
    //     pageNum: 1,
    //     pageSize: 10,
    //     claimOrderId: this._id,
    //   };
    //   const res = await getDetailList(data);
    //   this.tableData = res.records;
    // },
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
    async getLogisticsInfo () {
      this.loadingLogistics = true;
      try {
        // const res = await getLogisticsInfo(this._id); // 假设接口为 getLogisticsInfo
        // this.logisticsData = res.data;
        this.logisticsData = {
          waybillNo: 'JDV23178368877',
          estimatedArrivalTime: '2025-09-30 23:59:59',
          trackingList: [
            {
              time: '2025-09-30 17:46:54',
              description: '您的快件已送达，感谢您使用京东物流，期待再次为您服务。',
              status: 'completed'
            },
            {
              time: '2025-09-30 17:46:30',
              description: '司机已到达目的城市-天津 西青区，请您准备签收，司机电话：15957537605，车牌号：浙G98571',
              status: 'completed'
            },
            {
              time: '2025-09-27 21:19:14',
              description: '司机正在装车中，请耐心等待',
              status: 'pending'
            },
            {
              time: '2025-09-27 21:14:13',
              description: '京东快递已收取快件',
              status: 'completed'
            }
          ]
        };
      } catch (error) {
        console.error('获取物流信息失败:', error);
      } finally {
        this.loadingLogistics = false;
      }
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
