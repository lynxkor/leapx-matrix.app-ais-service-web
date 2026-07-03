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
          <el-button v-if="_id && ['10', '30'].includes(form.claimStatus) && permissions.has('AISPART-sparePartClaim-commit')" type="primary" size="small" @click="handleCommit">提交</el-button>
          <el-button v-if="_id && form.claimStatus === '20' && permissions.has('AISPART-sparePartClaim-agree')" type="primary" size="small" @click="handleAgree">同意</el-button>
          <el-button v-if="_id && form.claimStatus === '20' && permissions.has('AISPART-sparePartClaim-reject')" type="primary" size="small" @click="handleReject">驳回</el-button>
          <el-button v-if="_id && ['40', '50'].includes(form.claimStatus) && permissions.has('AISPART-sparePartClaim-printTag')" type="primary" size="small" @click="handlePrint">打印标签</el-button>
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
                  <el-input v-model="form.code" placeholder="请输入" disabled />
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
                  <el-input v-model="form.dealerCode" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input v-model="form.dealerName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  <el-input v-model="form.purchaseOrderCode" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  <el-input v-model="form.submitterName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-input v-model="form.submitTime" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  <el-input v-model="form.confirmerName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  <el-input v-model="form.confirmTime" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="驳回原因：" prop="rejectionDescription">
                  <el-input v-model="form.rejectionDescription" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="索赔状态：" prop="claimStatus">
                  <el-input v-model="form.claimStatusLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="责任方：" prop="responsibleParty">
                  <el-input v-model="form.responsibleParty" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  <el-input v-model="form.approvalTime" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  <el-input v-model="form.approvalDescription" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="审批节点：" prop="approvalNode">
                  <el-input v-model="form.approvalNode" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="理赔方式：" prop="compensationMethod">
                  <el-input v-model="form.compensationMethod" placeholder="请输入" disabled />
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
                  <el-input v-model="form.deliveryWarehouseCode" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="仓库名称：" prop="deliveryWarehouseName">
                  <el-input v-model="form.deliveryWarehouseName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="省：" prop="deliveryProvinceName">
                  <el-input v-model="form.deliveryProvinceName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="市：" prop="deliveryCityName">
                  <el-input v-model="form.deliveryCityName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="区：" prop="deliveryDistrictName">
                  <el-input v-model="form.deliveryDistrictName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="地址：" prop="deliveryAddress">
                  <el-input v-model="form.deliveryAddress" placeholder="请输入" disabled />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件索赔单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="索赔类型：" prop="claimTypeLabel">
                  {{ form.claimTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  <el-link type="primary" :href="`/service/sparepart/purchase/purchaseOrder/edit?id=${form.purchaseOrderId}`" target="_blank">
                    {{ form.purchaseOrderCode }}
                  </el-link>
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" class="form-detail"
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" class="form-detail"
                v-show="!(isEditing || !_id)">
                <el-form-item label="仓库编码：" prop="deliveryWarehouseName">
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
                      <el-input v-model="row.claimQty" :disabled="isClaimStatus || !accountFlag" :max="row.inboundQty" type="number" min="1" @change="handleQtyBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="claimDescription" title="索赔说明" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.claimDescription" :disabled="isClaimStatus || !accountFlag" @change="handleQtyBlur(row)"/>
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
              <h2 class="common-title">附件申请</h2>
              <div class="common-section-table">
                <!-- 附件上传组件 -->
                <AisAttachment
                  ref="claimAttachment"
                  :businessId="_id"
                  configCode="mcs_partsclaimorder"
                  attachType="索赔申请附件"
                  :readonly="form.claimStatus !== '10' && form.claimStatus !== '30'"
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
                <div v-if="activeName === 'getOutboundDetailList'">
                  <vxe-table :data="outboundTableData" stripe resizable border="inner" size="medium" height="auto" min-height="0" max-height="400px">
                    <vxe-column v-for="col in outboundColumns" :key="col.field || col.title" v-bind="col" />
                  </vxe-table>
                  <div v-if="outboundTotal > 0" class="pagination-wrapper">
                    <el-pagination :current-page="outboundPageNum" :page-size="outboundPageSize" :total="outboundTotal" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="outboundSizeChange" @current-change="outboundCurrentChange" />
                  </div>
                </div>
                <div v-if="activeName === 'getBackDetailList'">
                  <vxe-table :data="backTableData" stripe resizable border="inner" size="medium" height="auto" min-height="0" max-height="400px">
                    <vxe-column v-for="col in backColumns" :key="col.field || col.title" v-bind="col" />
                  </vxe-table>
                  <div v-if="backTotal > 0" class="pagination-wrapper">
                    <el-pagination :current-page="backPageNum" :page-size="backPageSize" :total="backTotal" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="backSizeChange" @current-change="backCurrentChange" />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>索赔历史</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table :data="historyTableData" stripe resizable border="inner" size="medium" height="auto" min-height="0" max-height="400px">
                  <vxe-column v-for="col in historyColumns" :key="col.field || col.title" v-bind="col" />
                </vxe-table>
                <div v-if="historyTotal > 0" class="pagination-wrapper">
                  <el-pagination :current-page="historyPageNum" :page-size="historyPageSize" :total="historyTotal" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="historySizeChange" @current-change="historyCurrentChange" />
                </div>
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
  claimOrderLogisticsPurchase,
  getCommit, getAgree, getReject
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
import { getAreaTree } from '@/utils';
import AisAttachment from '@/libs/components/AisAttachment';
import { handleCommonAction } from '@/libs/utils/index';

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

const ACTION_CONFIG = { // 按钮配置
  commit: { title: '是否提交?', success: '提交成功' },
  agree: { title: '是否同意?', success: '同意成功' },
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
      areaOptions: getAreaTree(),
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
      tableData: [],
      outboundTableData: [],
      outboundPageNum: 1,
      outboundPageSize: 10,
      outboundTotal: 0,
      backTableData: [],
      backPageNum: 1,
      backPageSize: 10,
      backTotal: 0,
      historyTableData: [],
      historyPageNum: 1,
      historyPageSize: 10,
      historyTotal: 0,
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      // detailColumns: [
      //   { field: 'sparePartCode', title: '备件编码', width: '15%' },
      //   { field: 'sparePartName', title: '备件名称', width: '15%' }, // yapi没找到
      //   { field: '', title: '已入库数', width: '15%' }, // yapi没找到
      //   { field: 'claimQty', title: '索赔数量', width: '15%' },
      //   { field: 'claimDescription', title: '索赔说明', width: '25%' },
      //   { field: 'createTime', title: '创建时间', width: '15%' },
      // ],
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
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.getLoginUser();
          this.getDetailList();
          this.fetchOutboundList();
          this.fetchBackList();
          this.fetchHistoryList();
          this.getLogistics(claimOrderLogisticsClaim);
          return res;
        });
      }
    },
    submitRequest () {
      // 不存在新增所以只有编辑
      const params = {
        id: this._id,
        claimDescription: this.form.claimDescription,
        claimQty: this.form.claimQty,
        claimType: this.form.claimType,
        statusDesc: this.form.statusDesc,
        receiverName: this.form.receiverName,
        receiverPhone: this.form.receiverPhone,
        provinceCode: this.form.provinceCode,
        cityCode: this.form.cityCode,
        address: this.form.address,
        remark: this.form.remark,
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
      this.total = res.total;
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
    async fetchOutboundList (pageNum = 1, pageSize = 10) {
      const res = await getOutboundDetailList({
        pageNum, pageSize, claimOrderId: this._id,
      });
      this.outboundTableData = res.records || [];
      this.outboundTotal = res.total || 0;
      this.outboundPageNum = pageNum;
      this.outboundPageSize = pageSize;
    },
    outboundSizeChange (val) { this.fetchOutboundList(1, val); },
    outboundCurrentChange (val) { this.fetchOutboundList(val, this.outboundPageSize); },
    // 索赔缺货明细
    async fetchBackList (pageNum = 1, pageSize = 10) {
      const res = await getBackDetailList({
        pageNum, pageSize, claimOrderId: this._id,
      });
      this.backTableData = res.records || [];
      this.backTotal = res.total || 0;
      this.backPageNum = pageNum;
      this.backPageSize = pageSize;
    },
    backSizeChange (val) { this.fetchBackList(1, val); },
    backCurrentChange (val) { this.fetchBackList(val, this.backPageSize); },
    // 索赔历史
    async fetchHistoryList (pageNum = 1, pageSize = 10) {
      const res = await historyPage({
        pageNum, pageSize, claimOrderId: this._id,
      });
      this.historyTableData = res.records || [];
      this.historyTotal = res.total || 0;
      this.historyPageNum = pageNum;
      this.historyPageSize = pageSize;
    },
    historySizeChange (val) { this.fetchHistoryList(1, val); },
    historyCurrentChange (val) { this.fetchHistoryList(val, this.historyPageSize); },
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
    },
    // 打印索赔回运单
    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'SparesClaim', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}备件索赔单`// 可选，打印标题
      });
    },
    // 刷新数据
    handleRefresh () {
      this.$refs.containerRef.loadDetail();
    },
    // 调用二次确认弹框
    _handleAction (apiFn, config) {
      handleCommonAction({
        $confirm: this.$confirm,
        $message: this.$message,
        apiFn,
        id: this._id,
        config,
        onSuccess: () => this.handleRefresh(),
      });
    },
    // 提交
    handleCommit () {
      const fileList = this.$refs.claimAttachment?.getFileList() || [];
      if (fileList.length === 0) {
        this.$message.warning('请上传附件后再提交');
        return;
      }
      this._handleAction(getCommit, ACTION_CONFIG.commit);
    },
    // 同意
    handleAgree () {
      this._handleAction(getAgree, ACTION_CONFIG.agree);
    },
    // 驳回
    handleReject () {
      this.$prompt('请输入驳回原因！', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '驳回原因不能为空',
      }).then(({ value }) => {
        // 调用驳回接口
        getReject({ id: this._id, description: value }).then(() => {
          this.$message({
            type: 'success',
            message: '驳回成功!'
          });
          this.handleRefresh();
        }).catch(() => {
        });
      }).catch(() => { });
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination-wrapper {
  margin-top: 10px;
}

.common-title {
  font-size: 14px;
  font-weight: 500;
  color: #0A0E0A;
  margin-bottom: 16px;
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
