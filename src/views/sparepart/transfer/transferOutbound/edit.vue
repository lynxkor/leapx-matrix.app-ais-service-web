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
                  <vxe-column field="partCode" title="备件编码" min-width="10%" />
                  <vxe-column field="partName" title="备件名称" min-width="10%" />
                  <vxe-column field="locationCode" title="库位" min-width="10%" />
                  <vxe-column field="availableQuantity" title="可用库存" min-width="10%" />
                  <vxe-column field="purchasePriceTax" title="采购价格(含税)" min-width="10%" />
                  <vxe-column field="purchasePriceNotax" title="采购价格(不含税)" min-width="10%" />
                  <vxe-column field="costUnitPriceTax" title="金额(含税)" min-width="10%" />
                  <vxe-column field="inboundQty" title="调拨数量" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.transferQty" type="number" min="1" @blur="handleBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="inboundQty" title="备注" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.remark" @blur="handleBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(rowIndex)">
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
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, transferOutboundPage, transferOutboundDelete } from '@/api/sparepart/transfer/transferOutbound/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getUserByNameOrNo, listOrgStoreInfoByParam, getSparePartCompany, listWarehouse, getPartDealer, getLoginUser } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  outboundDealerCode: '',
  outboundDealerName: '',
  outboundWarehouseId: '',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '调拨出库单号：' + this.form.code;
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
      pageTitle: '备件调拨出库',
      pageType: 'edit',
      moduleKey: 'AISPART-transferOutbound',
      loading: false,
      submitLoading: false,
      orderStatusType: false, // 是否可编辑
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
  methods: {
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
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
    queryListData (queryString) {
      return new Promise(resolve => {
        resolve([]);
      });
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
  }
};
</script>
