<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest"
        :showEditBtn="stockStatusType">
        <template #status>
          <span v-if="form.status" class="status primary">{{ form.status }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="showApply" type="primary" size="small" @click="handleApply">申请</el-button>
          <el-button v-if="showAgreeLoss" type="primary" size="small" @click="handleAgreeLoss">盘亏同意</el-button>
          <el-button v-if="showRejectLoss" type="primary" size="small" @click="handleRejectLoss">盘亏拒绝</el-button>
          <el-button v-if="showAgreeProfit" type="primary" size="small" @click="handleAgreeProfit">盘盈同意</el-button>
          <el-button v-if="showRejectProfit" type="primary" size="small" @click="handleRejectProfit">盘盈拒绝</el-button>
          <el-button v-if="showInbound" type="primary" size="small" @click="handleInbound">入库</el-button>
          <el-button v-if="showOutbound" type="primary" size="small" @click="handleOutbound">出库</el-button>
        </template>
        <el-main>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="差异单号：" prop="code">
                  <el-input v-model="form.code" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input v-model="form.dealerName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="差异单状态：" prop="orderStatus">
                  <el-input v-model="form.orderStatus" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="盘点单号：" prop="stockTakingCode">
                  <el-input v-model="form.stockTakingCode" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="母公司名称：" prop="companyName">
                  <el-input v-model="form.companyName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="差异类型：" prop="differencesType">
                  <el-input v-model="form.differencesType" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  <el-input v-model="form.warehouseName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="盘点类型：" prop="stockType">
                  <el-input v-model="form.stockType" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input v-model="form.remark" type="textarea" maxlength="500" show-word-limit placeholder="请输入" disabled></el-input>
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="申请人：" prop="apply">
                  <el-input v-model="form.applyName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  <el-input v-model="form.applyTime" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  <el-input v-model="form.approverName" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  <el-input v-model="form.approvalTime" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  <el-input v-model="form.approvalDescription" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="出入库操作人：" prop="operationOperator">
                  <el-input v-model="form.operationOperator" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="出入库操作时间：" prop="operationTime">
                  <el-input v-model="form.operationTime" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="出入库状态：" prop="outInboundStatus">
                  <el-input v-model="form.outInboundStatusLabel" placeholder="请输入" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDescription" style="width: 100%;">
                  <el-input type="textarea" maxlength="500" show-word-limit placeholder="请输入" v-model="form.applyDescription" clearable />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="差异单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="差异单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="盘点单号：" prop="stockTakingCode">
                  {{ form.stockTakingCode }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="companyName">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="差异类型：" prop="differencesType">
                  {{ form.differencesTypeLabel }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="盘点类型：" prop="stockType">
                  {{ form.stockTypeLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="申请人：" prop="apply">
                  {{ form.applyName }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDescription">
                  {{ form.applyDescription }}
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
                <el-form-item label="出入库操作人：" prop="operationOperator">
                  {{ form.operationOperator }}
                </el-form-item>
                <el-form-item label="出入库操作时间：" prop="operationTime">
                  {{ form.operationTime }}
                </el-form-item>
                <el-form-item label="出入库状态：" prop="outInboundStatus">
                  {{ form.outInboundStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>差异明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="sparePartCode" title="备件编码" min-width="11.1%" />
                  <vxe-column field="sparePartName" title="备件名称" min-width="11.1%" />
                  <vxe-column field="locationName" title="库位" min-width="11.1%" />
                  <vxe-column field="totalQty" title="盘点前库存总数" min-width="11.1%" />
                  <vxe-column field="actualQty" title="实盘库存" min-width="11.1%" />
                  <vxe-column field="costUnitPrice" title="成本单价" min-width="11.1%" />
                  <vxe-column field="differencesQty" title="差异数量" min-width="11.1%" />
                  <vxe-column field="remark" title="备注" min-width="11.1%" />
                  <vxe-column field="createTime" title="创建时间" min-width="11.1%" />
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
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, differencesDetailPage, getApply, agreeLoss, rejectLoss, agreeProfit, rejectProfit, getInbound, getOutbound } from '@/api/sparepart/warehouse/stockTakingDifferences/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getPartDealer, getLoginUser } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { handleCommonAction, handleCommonPrompt } from '@/libs/utils';

const defaultForm = {
  applyDescription: '',
  code: '',
  stockTakingCode: '',
  dealerCode: '',
  companyCode: '',
  warehouseId: '',
  stockType: '',
  differencesType: '',
  orderStatus: '',
  outInboundStatus: '',
  createTime: '',
  updateTime: '',
  remark: '',
  dealerName: '',
  companyName: '',
  apply: '',
  applyTime: '',
  approver: '',
  approvalTime: '',
  approvalDescription: '',
  operationOperator: '',
  operationTime: '',
};

const ACTION_CONFIG = {
  apply: { title: '此操作将提交申请, 是否继续?', success: '申请成功' },
  agreeLoss: { title: '此操作将同意盘亏, 是否继续?', success: '同意盘亏成功' },
  rejectLoss: { title: '拒绝盘亏', placeholder: '请输入拒绝原因', success: '拒绝盘亏成功' },
  agreeProfit: { title: '此操作将同意盘盈, 是否继续?', success: '同意盘盈成功' },
  rejectProfit: { title: '拒绝盘盈', placeholder: '请输入拒绝原因', success: '拒绝盘盈成功' },
  inbound: { title: '确定入库吗, 是否继续?', success: '入库成功' },
  outbound: { title: '确定出库吗, 是否继续?', success: '出库成功' }
};

export default {
  name: 'stockTakingDifferencesEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '盘点差异单号：' + this.form.code;
    },
    showApply () {
      return this._id && this.form.orderStatus === '0' && this.permissions.has('AISPART-stockTakingDifferences-apply');
    },
    showAgreeLoss () {
      return this._id && this.form.orderStatus === '1' && this.form.differencesType === '20' && this.permissions.has('AISPART-stockTakingDifferences-agreeLoss');
    },
    showRejectLoss () {
      return this._id && this.form.orderStatus === '1' && this.form.differencesType === '20' && this.permissions.has('AISPART-stockTakingDifferences-rejectLoss');
    },
    showAgreeProfit () {
      return this._id && this.form.orderStatus === '1' && this.form.differencesType === '10' && this.permissions.has('AISPART-stockTakingDifferences-agreeProfit');
    },
    showRejectProfit () {
      return this._id && this.form.orderStatus === '1' && this.form.differencesType === '10' && this.permissions.has('AISPART-stockTakingDifferences-rejectProfit');
    },
    showInbound () {
      return this._id && this.form.orderStatus === '2' && this.form.differencesType === '10' && this.form.outInboundStatus === '2' && this.permissions.has('AISPART-stockTakingDifferences-inbound');
    },
    showOutbound () {
      return this._id && this.form.orderStatus === '2' && this.form.differencesType === '20' && this.form.outInboundStatus === '0' && this.permissions.has('AISPART-stockTakingDifferences-outbound');
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
          if (this.form.orderStatus === '0') {
            this.stockStatusType = true;
          }
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '盘点差异单',
      pageType: 'edit',
      moduleKey: 'AISPART-stockTakingDifferences',
      loading: false,
      submitLoading: false,
      stockStatusType: false, // 是否可编辑
      form: { ...form },
      originalForm: { ...form },
      pageSize: 10,
      pageNum: 1,
      total: 0,
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        warehouseId: [
          { required: false, message: '请选择备件仓库 ID', trigger: 'change' }
        ],
        differencesType: [
          { required: false, message: '请选择差异类型', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.initDealerUser();
  },
  methods: {
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.form.dealerCode = res.currentDealerCode;// 当前门店code
      this.form.dealerName = res.currentDealerName;// 当前门店名称

      // 查询当前门店信息 公司
      const resDealer = await getPartDealer({ code: this.form.dealerCode });

      this.form.companyCode = resDealer.parentCompanyCode;// 当前门店code
      this.form.companyName = resDealer.parentCompanyName;// 当前门店名称

      this.form.warehouseName = resDealer.warehouseName;
      this.form.warehouseId = resDealer.warehouseId;// 当前门店code
      this.form.warehouseCode = resDealer.warehouseCode;// 当前门店名称
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
    handleDeleteRow (index) {
      this.tableData.splice(index, 1);
    },
    queryListData (queryString) {
      return new Promise(resolve => {
        resolve([]);
      });
    },
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      this.tableData.push(record);
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
    // 获取盘点明细
    async getData () {
      const params = {
        stockTakingDifferencesId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await differencesDetailPage(params);
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
    // 申请
    handleApply () {
      if (this.form.differencesType === '10') {
        this.$prompt('请输入申请理由', '申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: ''
        }).then(({ value }) => {
          getApply({
            id: this._id,
            description: value
          }).then(() => {
            this.$message({
              type: 'success',
              message: '申请成功!'
            });
            this.$refs.containerRef.loadDetail();
          });
        }).catch(() => {});
      } else {
        getApply({
          id: this._id,
        }).then(() => {
          this.$message({
            type: 'success',
            message: '申请成功!'
          });
          this.$refs.containerRef.loadDetail();
        }).catch(() => {
        });
      }
    },
    // 盘亏同意
    handleAgreeLoss () {
      this._handleAction(agreeLoss, ACTION_CONFIG.agreeLoss);
    },
    // 盘亏拒绝
    handleRejectLoss () {
      handleCommonPrompt({
        $prompt: this.$prompt,
        $message: this.$message,
        apiFn: rejectLoss,
        id: this._id,
        config: ACTION_CONFIG.rejectLoss,
        onSuccess: () => this.$refs.containerRef.loadDetail()
      });
    },
    // 盘盈同意
    handleAgreeProfit () {
      this._handleAction(agreeProfit, ACTION_CONFIG.agreeProfit);
    },
    // 盘盈拒绝
    handleRejectProfit () {
      handleCommonPrompt({
        $prompt: this.$prompt,
        $message: this.$message,
        apiFn: rejectProfit,
        id: this._id,
        config: ACTION_CONFIG.rejectProfit,
        onSuccess: () => this.$refs.containerRef.loadDetail()
      });
    },
    // 入库
    handleInbound () {
      this._handleAction(getInbound, ACTION_CONFIG.inbound);
    },
    // 出库
    handleOutbound () {
      this._handleAction(getOutbound, ACTION_CONFIG.outbound);
    },
  }
};
</script>
