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
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="orderStatusType"
      >
        <template #extraButtons>
          <el-button
            v-for="btn in visibleButtons"
            :key="btn.key"
            plain
            size="small"
            :loading="actionLoading"
            @click="handleExtraButtonClick(btn.action)"
          >
            {{ btn.label }}
          </el-button>
          <el-button v-if="_id && permissions.has('AISPART-dealerOutboundOrder-printOutbound')" type="primary" size="small" @click="handlePrint">打印出库单</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="内部领料单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="DealerOutboundOrderStatusEnum"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    disabled
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <fetch-select
                    :remote-method="getDealerList"
                    remote
                    v-model="form.dealerCode"
                    placeholder="请输入门店编码或名称"
                    labelKey="orgCode"
                    valueKey="orgCode"
                    subLabelKey="orgName"
                    clearable
                    filterable
                    :disabled="isEditing"
                    @change="handleDealerChange"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input
                    type="textarea"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="内部领料单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>领料信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="领料申请人：" prop="requester">
                  {{ form.requesterName }}
                </el-form-item>
                <el-form-item label="领料申请时间：" prop="requestTime">
                  {{ form.requestTime }}
                </el-form-item>
                <el-form-item label="领料审批人：" prop="approver">
                  {{ form.approverName }}
                </el-form-item>
                <el-form-item label="领料审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="领料审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperator">
                  {{ form.outboundOperatorName }}
                </el-form-item>
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="领料申请说明：" prop="requestDescription" style="width: 100%;">
                  <el-input
                    type="textarea"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入领料申请说明"
                    v-model="form.requestDescription"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="领料申请人：" prop="requester">
                  {{ form.requesterName }}
                </el-form-item>
                <el-form-item label="领料申请时间：" prop="requestTime">
                  {{ form.requestTime }}
                </el-form-item>
                <el-form-item label="领料审批人：" prop="approver">
                  {{ form.approverName }}
                </el-form-item>
                <el-form-item label="领料审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="领料审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperator">
                  {{ form.outboundOperatorName }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
                <el-form-item label="领料申请说明：" prop="requestDescription" style="width: 100%;">
                  {{ form.requestDescription }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>退料信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="退料申请人：" prop="returnRequester">
                  {{ form.returnRequesterName }}
                </el-form-item>
                <el-form-item label="退料申请时间：" prop="returnRequestTime">
                  {{ form.returnRequestTime }}
                </el-form-item>
                <el-form-item label="退料申请说明：" prop="returnRequestDescription">
                  {{ form.returnRequestDescription }}
                </el-form-item>
                <el-form-item label="退料审批人：" prop="returnApprover">
                  {{ form.returnApproverName }}
                </el-form-item>
                <el-form-item label="退料审批时间：" prop="returnApprovalTime">
                  {{ form.returnApprovalTime }}
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperator">
                  {{ form.inboundOperatorName }}
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  {{ form.inboundTime }}
                </el-form-item>
                <el-form-item label="入库状态：" prop="inboundStatus">
                  {{ form.inboundStatusLabel }}
                </el-form-item>
                <el-form-item label="退料审批说明：" prop="returnApprovalDescription" style="width: 100%">
                  {{ form.returnApprovalDescription }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="退料申请人：" prop="returnRequester">
                  {{ form.returnRequesterName }}
                </el-form-item>
                <el-form-item label="退料申请时间：" prop="returnRequestTime">
                  {{ form.returnRequestTime }}
                </el-form-item>
                <el-form-item label="退料申请说明：" prop="returnRequestDescription">
                  {{ form.returnRequestDescription }}
                </el-form-item>
                <el-form-item label="退料审批人：" prop="returnApprover">
                  {{ form.returnApproverName }}
                </el-form-item>
                <el-form-item label="退料审批时间：" prop="returnApprovalTime">
                  {{ form.returnApprovalTime }}
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperator">
                  {{ form.inboundOperatorName }}
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  {{ form.inboundTime }}
                </el-form-item>
                <el-form-item label="入库状态：" prop="inboundStatus">
                  {{ form.inboundStatusLabel }}
                </el-form-item>
                <el-form-item label="退料审批说明：" prop="returnApprovalDescription" style="width: 100%">
                  {{ form.returnApprovalDescription }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>备件清单</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <base-search
                    style="width: 300px;"
                    filterable
                    clearable
                    remote
                    :remote-method="queryListData"
                    @change="handleAddTableData"
                    value-key="partCode"
                    label-key="partCode"
                    sub-label-key="partName"
                    :disabled="!orderStatusType"
                  />
                  <el-button class="search-btn" size="small" @click="handleImport" :disabled="!orderStatusType">导入备件清单</el-button>
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
                  <vxe-column field="locationName" title="库位编码" min-width="10%" />
                  <vxe-column field="availableQty" title="可用库存" min-width="10%" />
                  <vxe-column field="salesUnitPrice" title="销售单价" min-width="10%" />
                  <vxe-column field="costUnitPrice" title="成本单价" min-width="10%" />
                  <vxe-column field="qty" title="数量" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.qty" @input="val => row.qty = formatNumberInput(val, { allowDecimal: false })" :disabled="!isOrderType" @change="handleBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="remark" title="备注" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.remark" :disabled="!orderStatusType" @change="handleRemarkBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <vxe-column title="操作" width="100" v-if="((canDelete && isEditing || !_id) || isOrderType)&&permissions.has('AISPART-dealerOutboundOrder-addOrUpdate')">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
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
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
    <Upload
      :visible="uploadDialogVisible"
      :businessParams="_id"
      id="sparepartDealerOutboundOrderDetail"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </edit-page-layout>
</template>

<script>
import {
  getDetail, addOrUpdate, orderDetailPage, orderDetailDelete, orderDetailAddOrUpdate,
  applyRequest, agreeRequest, rejectRequest, outbound, applyReturn, rejectReturn, inbound, agreeReturn
} from '@/api/sparepart/outbound/dealerOutboundOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam, getPartDealer, getLoginUser, listDealerPartWithOem } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import Upload from '@/libs/components/UploadDialog';
import { handleCommonAction, handleCommonPrompt, formatNumberInput } from '@/libs/utils/index';
import BaseSearch from '@/libs/components/BaseSearch';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerCode: '',
  dealerName: '',
  companyCode: '',
  companyName: '',
  warehouseId: '',
  warehouseName: '',
  orderStatus: '10',
  inboundStatus: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  ownerOrgId: '',
  outboundStatus: '',
  requester: '',
  requesterName: '',
  requestTime: '',
  requestDescription: '',
  approver: '',
  approverName: '',
  approvalTime: '',
  approvalDescription: '',
  outboundOperator: '',
  outboundOperatorName: '',
  outboundTime: '',
  returnRequester: '',
  returnRequesterName: '',
  returnRequestTime: '',
  returnRequestDescription: '',
  returnApprover: '',
  returnApproverName: '',
  returnApprovalTime: '',
  returnApprovalDescription: '',
  inboundOperator: '',
  inboundOperatorName: '',
  inboundTime: '',
  inboundStatusLabel: '',
  outboundStatusLabel: '',
  orderStatusLabel: ''
};

export default {
  name: 'dealerOutboundOrderEdit',
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
    Upload,
    BaseSearch
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '内部领料单号：' + this.form.code;
    },
    // 订单状态 领料同意 / 出库状态 未出库
    isOrderType () {
      return (this.form.orderStatus === '10' || this.form.orderStatus === '30' || this.form.orderStatus === '40') && this.form.outboundStatus === '0';
    },
    // 按钮配置
    extraButtons () {
      const buttons = [
        {
          key: 'applyMaterial',
          label: '申请领料',
          action: 'applyMaterial',
          visible: this._id && ['10', '30'].includes(this.form.orderStatus) && this.permissions.has('AISPART-dealerOutboundOrder-applyRequest')
        },
        {
          key: 'approvalMaterial',
          label: '同意领料',
          action: 'approvalMaterial',
          visible: this._id && this.form.orderStatus === '20' && this.permissions.has('AISPART-dealerOutboundOrder-agreeRequest')
        },
        {
          key: 'rejectMaterialApproval',
          label: '驳回领料',
          action: 'rejectMaterialApproval',
          visible: this._id && this.form.orderStatus === '20' && this.permissions.has('AISPART-dealerOutboundOrder-rejectRequest')
        },
        {
          key: 'ship',
          label: '出库',
          action: 'ship',
          visible: this._id && this.form.orderStatus === '40' && this.form.outboundStatus === '0' && this.permissions.has('AISPART-dealerOutboundOrder-outbound')
        },
        {
          key: 'applyReturnMaterial',
          label: '申请退料',
          action: 'applyReturnMaterial',
          visible: this._id && (this.form.orderStatus === '40' || this.form.outboundStatus === '60') && this.form.outboundStatus === '1' && this.permissions.has('AISPART-dealerOutboundOrder-applyReturn')
        },
        {
          key: 'approveReturnMaterialApproval',
          label: '同意退料',
          action: 'approveReturnMaterialApproval',
          visible: this._id && this.form.orderStatus === '50' && this.permissions.has('AISPART-dealerOutboundOrder-agreeReturn')
        },
        {
          key: 'rejectReturnMaterialApproval',
          label: '驳回退料',
          action: 'rejectReturnMaterialApproval',
          visible: this._id && this.form.orderStatus === '50' && this.permissions.has('AISPART-dealerOutboundOrder-rejectReturn')
        },
        {
          key: 'inbound',
          label: '入库',
          action: 'inbound',
          visible: this._id && this.form.orderStatus === '70' && this.form.inboundStatus === '0' && this.permissions.has('AISPART-dealerOutboundOrder-inbound')
        }
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
          this.pageNum = 1;
          this.getData();
          if (this.form.orderStatus === '10' || this.form.orderStatus === '30') {
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
      pageTitle: '内部领料申请',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-dealerOutboundOrder',
      loading: false,
      submitLoading: false,
      actionLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      orderStatusType: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        requestDescription: [
          { required: true, message: '请输入领料申请描述', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    this.getLoginUser();
  },
  methods: {
    formatNumberInput,
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
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
    // 门店选择变化
    handleDealerChange (val, ele) {
      this.form.dealerName = ele.orgName;
      this.getPartDealer(ele.orgCode);
    },
    // 获取门店详情（仓库信息）
    async getPartDealer (query) {
      try {
        const res = await getPartDealer({ code: query });
        this.form.companyCode = res.parentCompanyCode;
        this.form.companyName = res.parentCompanyName;
        this.form.warehouseId = res.warehouseId;
        this.form.warehouseName = res.warehouseName;
        return res;
      } catch (error) {
        console.error('Error fetching dealer info:', error);
      }
    },
    // 获取当前登录用户信息
    async getLoginUser () {
      try {
        const res = await getLoginUser();
        if (res) {
          this.form.dealerCode = res.currentDealerCode;
          this.form.dealerName = res.currentDealerName;
          if (this.form.dealerCode) {
            this.getPartDealer(this.form.dealerCode);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 门店搜索
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching dealer list:', error);
      }
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      // this.tableData.splice(index, 1);
      // 根据需求调用接口
      orderDetailDelete([item.id]).then(res => {
        this.$message.success('删除成功');
        // this.tableData.splice(index, 1);
        this.handleRefresh();
      });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        listDealerPartWithOem({ partCodeOrNameLike: queryString, status: 1, pageSize: 20 }).then(res => {
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
        dealerOutboundOrderId: this._id,
        dealerOutboundOrderCode: this.form.code,
        sparePartId: record.id,
        qty: 1,
      };
      this.handleAddOrUpdate(params, 'add');
    },
    // 修改备件清单
    handleBlur (val) {
      // 清理末尾小数点并确保是有效数字
      let qty = String(val.qty || '').replace(/\.$/, '');
      if (!qty || isNaN(qty) || Number(qty) <= 0) {
        qty = '1';
      }
      val.qty = qty;

      const params = {
        id: val.id,
        dealerOutboundOrderId: this._id,
        dealerOutboundOrderCode: this.form.code,
        sparePartId: val.id,
        qty: val.qty,
        remark: val.remark,
      };
      this.handleAddOrUpdate(params, 'update');
    },
    handleRemarkBlur (val) {
      const params = {
        id: val.id,
        dealerOutboundOrderId: this._id,
        dealerOutboundOrderCode: this.form.code,
        sparePartId: val.id,
        qty: val.qty,
        remark: val.remark
      };
      this.handleAddOrUpdate(params, 'update');
    },
    // 调取备件接口
    async handleAddOrUpdate (params) {
      await orderDetailAddOrUpdate(params);
      this.$message.success('操作成功');
      this.$refs.containerRef.loadDetail();
      this.getData();
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
    // 获取备件清单
    async getData () {
      const params = {
        dealerOutboundOrderId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await orderDetailPage(params);
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
    // 打印内部领料入库单
    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'InternalMaterialRequisition', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}厅店内部领料入库单`// 可选，打印标题
      });
    },
    // 刷新整个详情页所有数据
    handleRefresh () {
      this.$refs.containerRef.loadDetail();
      this.getData();
    },
    // 处理额外按钮点击事件
    handleExtraButtonClick (action) {
      const actionMap = {
        applyMaterial: 'handleApplyMaterial',
        approvalMaterial: 'handleApprovalMaterial',
        rejectMaterialApproval: 'handleRejectMaterialApproval',
        ship: 'handleShip',
        applyReturnMaterial: 'handleApplyReturnMaterial',
        approveReturnMaterialApproval: 'handleApproveReturnMaterialApproval',
        rejectReturnMaterialApproval: 'handleRejectReturnMaterialApproval',
        inbound: 'handleInbound',
      };
      const handlerName = actionMap[action];
      if (handlerName && typeof this[handlerName] === 'function') {
        this[handlerName]();
      } else {
        console.warn(`未找到处理方法: ${handlerName}`);
      }
    },
    // 二次确认
    _handleAction (apiFn, config) {
      this.actionLoading = true;
      handleCommonAction({
        $confirm: this.$confirm,
        $message: this.$message,
        apiFn,
        id: this._id,
        config,
        onSuccess: () => {
          this.actionLoading = false;
          this.handleRefresh();
        },
        onComplete: () => {
          this.actionLoading = false;
        }
      });
    },
    handleApplyMaterial () {
      this._handleAction(applyRequest, { title: '是否申请领料?', success: '申请成功!' });
    },
    handleApprovalMaterial () {
      this._handleAction(agreeRequest, { title: '是否同意领料?', success: '同意成功!' });
    },
    handleShip () {
      this._handleAction(outbound, { title: '是否出库?', success: '出库成功!' });
    },
    handleApproveReturnMaterialApproval () {
      this._handleAction(agreeReturn, { title: '是否同意退料?', success: '同意退料成功!' });
    },
    handleInbound () {
      this._handleAction(inbound, { title: '是否入库?', success: '入库成功!' });
    },
    // 通用 备注弹窗
    _execPrompt (api, title, placeholder, successMsg) {
      this.actionLoading = true;
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
        onSuccess: () => {
          this.actionLoading = false;
          this.handleRefresh();
        },
        onComplete: () => {
          this.actionLoading = false;
        }
      });
    },
    handleRejectMaterialApproval () {
      this._execPrompt(rejectRequest, '驳回领料', '请输入驳回原因', '驳回成功!');
    },
    handleApplyReturnMaterial () {
      this._execPrompt(applyReturn, '申请退料', '请输入申请退料原因', '申请退料成功!');
    },
    handleRejectReturnMaterialApproval () {
      this._execPrompt(rejectReturn, '驳回退料', '请输入驳回退料原因', '驳回退料成功!');
    },
  }
};
</script>

<style scoped lang="scss">
.search-btn {
  margin-left: 8px;
  border-radius: 4px;
}
</style>
