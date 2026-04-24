<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="orderStatusType"
      >
        <template #status>
          <span v-if="form.status" class="status primary">{{ form.status }}</span>
        </template>
        <template #extraButtons>
          <el-button
            v-for="btn in visibleButtons"
            :key="btn.key"
            type="primary"
            size="small"
            @click="handleExtraButtonClick(btn.action)"
          >
            {{ btn.label }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handlePrint"
          >
            打印
          </el-button>
        </template>
        <el-main>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="调拨出库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  <fetch-select
                    :remote-method="getDealerList"
                    remote
                    v-model="form.inboundDealerCode"
                    placeholder="请输入门店编码或名称"
                    labelKey="orgCode"
                    valueKey="orgCode"
                    subLabelKey="orgName"
                    clearable
                    collapseTags
                    filterable
                    @change="listDealerChange"
                      />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="出库方仓库：" prop="outboundWarehouseId">
                  {{ form.outboundWarehouseName }}
                </el-form-item>
                <el-form-item label="入库方联系人：" prop="inboundContactName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundContactName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库方手机：" prop="inboundContactPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundContactPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  {{ form.logisticsRemark }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>调拨信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="调出申请人：" prop="transferApplyName">
                  {{ form.transferApplyName }}
                </el-form-item>
                <el-form-item label="调出申请时间：" prop="transferApplyTime">
                  {{ form.transferApplyTime }}
                </el-form-item>
                <el-form-item label="调拨状态：" prop="transferStatus">
                  {{ form.transferStatusLabel }}
                </el-form-item>
                <el-form-item label="调出审批人：" prop="transferApproverName">
                  {{ form.transferApproverName }}
                </el-form-item>
                <el-form-item label="调出审批时间：" prop="transferApprovalTime">
                  {{ form.transferApprovalTime }}
                </el-form-item>
                <el-form-item label="调出审批说明：" prop="transferApprovalDescription">
                  {{ form.transferApprovalDescription }}
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperatorName">
                  {{ form.outboundOperatorName }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
                <el-form-item label="调出申请说明：" prop="transferApplyDescription" style="width: 100%;">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.transferApplyDescription"
                    clearable
                  />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>撤销信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="撤销申请人：" prop="cancelApplyName">
                  {{ form.cancelApplyName }}
                </el-form-item>
                <el-form-item label="撤销申请时间：" prop="cancelApplyTime">
                  {{ form.cancelApplyTime }}
                </el-form-item>
                <el-form-item label="撤销申请说明：" prop="cancelApplyDescription">
                  {{ form.cancelApplyDescription }}
                </el-form-item>
                <el-form-item label="撤销状态：" prop="cancelStatus">
                  {{ form.cancelStatusLabel }}
                </el-form-item>
                <el-form-item label="撤销审批人：" prop="cancelApproverName">
                  {{ form.cancelApproverName }}
                </el-form-item>
                <el-form-item label="撤销审批时间：" prop="cancelApprovalTime">
                  {{ form.cancelApprovalTime }}
                </el-form-item>
                <el-form-item label="撤销审批说明：" prop="cancelApprovalDescription">
                  {{ form.cancelApprovalDescription }}
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperatorName">
                  {{ form.inboundOperatorName }}
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  {{ form.inboundTime }}
                </el-form-item>
                <el-form-item label="入库状态：" prop="inboundStatus">
                  {{ form.inboundStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" >
                <el-form-item label="调拨出库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="出库方仓库：" prop="outboundWarehouseId">
                  {{ form.outboundWarehouseName }}
                </el-form-item>
                <el-form-item label="入库方联系人：" prop="inboundContactName">
                  {{ form.inboundContactName }}
                </el-form-item>
                <el-form-item label="入库方手机：" prop="inboundContactPhone">
                  {{ form.inboundContactPhone }}
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  {{ form.logisticsRemark }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>调拨信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" >
                <el-form-item label="调出申请人：" prop="transferApplyName">
                  {{ form.transferApplyName }}
                </el-form-item>
                <el-form-item label="调出申请时间：" prop="transferApplyTime">
                  {{ form.transferApplyTime }}
                </el-form-item>
                <el-form-item label="调出申请说明：" prop="transferApplyDescription">
                  {{ form.transferApplyDescription }}
                </el-form-item>
                <el-form-item label="调拨状态：" prop="transferStatus">
                  {{ form.transferStatusLabel }}
                </el-form-item>
                <el-form-item label="调出审批人：" prop="transferApproverName">
                  {{ form.transferApproverName }}
                </el-form-item>
                <el-form-item label="调出审批时间：" prop="transferApprovalTime">
                  {{ form.transferApprovalTime }}
                </el-form-item>
                <el-form-item label="调出审批说明：" prop="transferApprovalDescription">
                  {{ form.transferApprovalDescription }}
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperatorName">
                  {{ form.outboundOperatorName }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>撤销信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" >
                <el-form-item label="撤销申请人：" prop="cancelApplyName">
                  {{ form.cancelApplyName }}
                </el-form-item>
                <el-form-item label="撤销申请时间：" prop="cancelApplyTime">
                  {{ form.cancelApplyTime }}
                </el-form-item>
                <el-form-item label="撤销申请说明：" prop="cancelApplyDescription">
                  {{ form.cancelApplyDescription }}
                </el-form-item>
                <el-form-item label="撤销状态：" prop="cancelStatus">
                  {{ form.cancelStatusLabel }}
                </el-form-item>
                <el-form-item label="撤销审批人：" prop="cancelApproverName">
                  {{ form.cancelApproverName }}
                </el-form-item>
                <el-form-item label="撤销审批时间：" prop="cancelApprovalTime">
                  {{ form.cancelApprovalTime }}
                </el-form-item>
                <el-form-item label="撤销审批说明：" prop="cancelApprovalDescription">
                  {{ form.cancelApprovalDescription }}
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperatorName">
                  {{ form.inboundOperatorName }}
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  {{ form.inboundTime }}
                </el-form-item>
                <el-form-item label="入库状态：" prop="inboundStatus">
                  {{ form.inboundStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>调拨明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select style="width: 300px;" :remote-method="queryListData" remote placeholder="请选择" clearable
                    value-key="id" label-key="name" subLabelKey="code" :disabled="!orderStatusType"
                    @change="handleAddTableData" />
                  <el-button type="primary" size="small">添加</el-button>
                  <el-button size="small" @click="handleImport" :disabled="!orderStatusType">导入备件清单</el-button>
                </div>
              </div>
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
                  <vxe-column field="locationName" title="库位" min-width="10%" />
                  <vxe-column field="availableQty" title="可用库存" min-width="10%" />
                  <vxe-column field="purchasePriceTax" title="采购价格(含税)" min-width="10%" />
                  <vxe-column field="purchasePriceNotax" title="采购价格(不含税)" min-width="10%" />
                  <vxe-column field="costUnitPriceTax" title="金额(含税)" min-width="10%" />
                  <vxe-column field="transferQty" title="调拨数量" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.transferQty" :disabled="!orderStatusType" :max="row.availableQuantity" type="number" min="1" @blur="handleQtyBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="remark" title="备注" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.remark" :disabled="!orderStatusType" @blur="handleRemarkBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="orderStatusType">
                    <template #default="{ row }">
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(row.id)">
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
      </div>
    </template>
    <Upload
      :visible="uploadDialogVisible"
      :businessParams="_id"
      id="sparepartTransferOutboundDetail"
      @close="handleUploadDialogClose"
      @submit="handleRefresh"
    />
    <!-- 发运弹窗 -->
    <ShipmentDialog
      :visible.sync="shipmentDialogVisible"
      :id="_id"
      @update:visible="val => shipmentDialogVisible = val"
      @success="handleRefresh"
    />
  </edit-page-layout>
</template>

<script>
import {
  getDetail, addOrUpdate, transferOutboundPage, transferOutboundAddOrUpdate, transferOutboundDelete,
  getSubmit, getApprove, getReject, getRevoke, applyCancel, approveCancel, rejectCancel, getInbound
} from '@/api/sparepart/transfer/transferOutbound/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam, getPartDealer, getLoginUser } from '@/api/common';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import Upload from '@/libs/components/UploadDialog';
import { handleCommonAction, handleCommonPrompt } from '@/libs/utils/index';
import ShipmentDialog from './ShipmentDialog';

const defaultForm = {
  code: '',
  outboundDealerCode: '',
  outboundDealerName: '',
  outboundWarehouseId: '',
  outboundWarehouseCode: '',
  outboundWarehouseName: '',
  inboundDealerCode: '',
  inboundDealerName: '',
  inboundContactName: '',
  inboundContactPhone: '',
  transferStatus: '',
  outboundStatus: '',
  cancelStatus: '',
  inboundStatus: '',
  remark: '',
  createTime: '',
  updateTime: '',
  logisticsProvider: '',
  logisticsOrderNo: '',
  logisticsRemark: '',
  transferApplyTime: '',
  transferApplyDescription: '',
  transferApprovalTime: '',
  transferApprovalDescription: '',
  outboundTime: '',
  cancelApplyTime: '',
  cancelApplyDescription: '',
  cancelApprovalTime: '',
  cancelApprovalDescription: '',
  inboundTime: '',
};

const ACTION_CONFIG = { // 按钮配置
  submit: { title: '此操作将提交, 是否继续?', success: '提交成功' },
  approve: { title: '此操作将同意, 是否继续?', success: '同意成功' },
  revoke: { title: '此操作将撤回该出库单, 是否继续?', success: '撤回成功' },
  approveCancel: { title: '此操作将同意撤销, 是否继续?', success: '同意撤销成功' },
  inbound: { title: '此操作将入库, 是否继续?', success: '入库成功' },
};

export default {
  name: 'transferOutboundEdit',
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
    Upload,
    ShipmentDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '调拨出库单号：' + this.form.code;
    },
    extraButtons () {
      const buttons = [
        {
          key: 'submit',
          label: '提交',
          action: 'submit',
          visible: this._id && (this.form.transferStatus === '0' || this.form.transferStatus === '3')
        },
        {
          key: 'approve',
          label: '同意',
          action: 'approve',
          visible: this._id && this.form.transferStatus === '1'
        },
        {
          key: 'reject',
          label: '驳回',
          action: 'reject',
          visible: this._id && this.form.transferStatus === '1'
        },
        {
          key: 'revoke',
          label: '撤回',
          action: 'revoke',
          visible: this._id && this.form.transferStatus === '2' && this.form.outboundStatus === '0'
        },
        {
          key: 'ship',
          label: '发运',
          action: 'ship',
          visible: this._id && this.form.transferStatus === '2' && this.form.outboundStatus === '0'
        },
        {
          key: 'applyCancel',
          label: '申请撤销',
          action: 'applyCancel',
          visible: this._id && (this.form.cancelStatus === '10' || this.form.cancelStatus === '40') && this.form.outboundStatus === '1'
        },
        {
          key: 'approveCancel',
          label: '同意撤销',
          action: 'approveCancel',
          visible: this._id && this.form.cancelStatus === '20'
        },
        {
          key: 'rejectCancel',
          label: '驳回撤销',
          action: 'rejectCancel',
          visible: this._id && this.form.cancelStatus === '20'
        },
        {
          key: 'inbound',
          label: '入库',
          action: 'inbound',
          visible: this._id && this.form.cancelStatus === '30' && this.form.inboundStatus === '0'
        },
      ];
      return buttons;
    },
    visibleButtons () {
      return this.extraButtons.filter(btn => btn.visible);
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
    'form.code': {
      handler (val) {
        if (val) {
          this.getData();
          if (this.form.transferStatus === '0') {
            this.orderStatusType = true;
          }
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      uploadDialogVisible: false,
      pageTitle: '备件调拨出库',
      pageType: 'edit',
      moduleKey: 'AISPART-transferOutbound',
      loading: false,
      submitLoading: false,
      orderStatusType: false, // 是否可编辑
      shipmentDialogVisible: false, // 发运弹窗是否显示
      pageNum: 1,
      pageSize: 10,
      total: 0,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        outboundWarehouseId: [
          { required: true, message: '请选择出库方仓库', trigger: 'change' }
        ],
        inboundDealerCode: [
          { required: true, message: '请输入入库门店编码', trigger: 'change' }
        ],
        inboundContactName: [
          { required: true, message: '请输入入库方联系人', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getLoginUser();
  },
  methods: {
    async getLoginUser () {
      try {
        const res = await getLoginUser();
        this.form.outboundDealerCode = res.currentDealerCode;
        this.form.outboundDealerName = res.currentDealerName;
        this.accountPermissions = res.accountFlag;
        if (this.form.outboundDealerCode) {
          this.getPartDealer(this.form.outboundDealerCode);
        }
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getPartDealer (query) {
      try {
        const res = await getPartDealer({ code: query });
        this.form.outboundWarehouseId = res.warehouseId;
        this.form.outboundWarehouseCode = res.warehouseCode;
        this.form.outboundWarehouseName = res.warehouseName;
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query, isPartOrder: true, authority: false });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    listDealerChange (val, all) {
      this.form.inboundDealerCode = all.orgCode;
      this.form.inboundDealerName = all.orgName;
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
    openPane () {
      this.$refs.editLayout.openPane();
    },
    async queryListData (queryString) {
      // 查询当前门店备件列表
      return new Promise(resolve => {
        // 根据需求调用接口
        getSparePart({ partCodeOrNameLike: queryString }).then(res => {
          const list = res || [];
          resolve(list);
        });
      });
    },
    // 新增备件清单
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.partCode === record.partCode);
      if (exists) {
        this.$message.warning('请勿重复添加');
      }
      const params = {
        transferOutboundId: this._id,
        sparePartId: record.id,
        transferQty: 1
      };
      this.handleAddOrUpdate(params);
    },
    // 数量输入框失去焦点时触发
    handleQtyBlur (row) {
      const params = {
        transferOutboundId: this._id,
        id: row.id,
        transferQty: row.transferQty
      };
      this.handleAddOrUpdate(params);
    },
    // 备注输入框失去焦点时触发
    handleRemarkBlur (row) {
      const params = {
        transferOutboundId: this._id,
        id: row.id,
        remark: row.remark
      };
      this.handleAddOrUpdate(params);
    },
    // 新增/编辑备件清单
    async handleAddOrUpdate (params) {
      try {
        await transferOutboundAddOrUpdate(params);
        this.$message.success('操作成功');
        this.getData();
      } catch (error) {
        this.$message.error('操作失败');
      }
    },
    // 删除备件
    async handleDeleteRow (id) {
      try {
        await transferOutboundDelete([id]);
        this.$message.success('删除成功');
        this.getData();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 获取调拨明细
    async getData () {
      const params = {
        transferOutboundId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await transferOutboundPage(params);
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
    // 导入备件清单
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
      this.getData();
    },
    // 处理额外按钮点击事件
    handleExtraButtonClick (action) {
      const actionMap = {
        submit: 'handleSubmit',
        approve: 'handleApprove',
        reject: 'handleReject',
        revoke: 'handleRevoke',
        ship: 'handleShip',
        applyCancel: 'handleApplyCancel',
        approveCancel: 'handleApproveCancel',
        rejectCancel: 'handleRejectCancel',
        inbound: 'handleInbound',
      };
      const handlerName = actionMap[action];
      if (handlerName && typeof this[handlerName] === 'function') {
        this[handlerName]();
      } else {
        console.warn(`未找到处理方法: ${handlerName}`);
      }
    },
    // 刷新接口
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
        onSuccess: () => this.$refs.containerRef.loadDetail()
      });
    },
    // --- 业务方法调用 ---
    handleSubmit () {
      this._handleAction(getSubmit, ACTION_CONFIG.submit);
    },
    handleApprove () {
      this._handleAction(getApprove, ACTION_CONFIG.approve);
    },
    handleRevoke () {
      this._handleAction(getRevoke, ACTION_CONFIG.revoke);
    },
    handleApproveCancel () {
      this._handleAction(approveCancel, ACTION_CONFIG.approveCancel);
    },
    handleInbound () {
      this._handleAction(getInbound, ACTION_CONFIG.inbound);
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
    handleReject () {
      this._execPrompt(getReject, '驳回', '请输入驳回原因！', '驳回成功!');
    },
    handleApplyCancel () {
      this._execPrompt(applyCancel, '申请撤销', '请输入申请撤销原因！', '申请撤销成功!');
    },
    handleRejectCancel () {
      this._execPrompt(rejectCancel, '驳回撤销', '请输入驳回撤销原因！', '驳回撤销成功!');
    },
    // 打印调拨出库单
    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'TransferOutbound', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}厅店调拨出库单`// 可选，打印标题
      });
    },
    // 发运弹窗
    handleShip () {
      this.shipmentDialogVisible = true;
    }
  }
};
</script>
