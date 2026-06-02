<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`${title}${form.code}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :originalForm.sync="originalForm"
        :showEditBtn="false"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="缺货单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购申请单：" prop="purchaseApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseApplyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.purchaseOrderType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="待处理品种数：" prop="pendingVarietyCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pendingVarietyCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="已处理品种数：" prop="processedVarietyCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.processedVarietyCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="缺货单状态：" prop="backStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.backStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="采购申请单：" prop="purchaseApplyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseApplyId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="已处理零件总数：" prop="processedPartTotal">
                  <el-input
                    placeholder="请输入"
                    v-model="form.processedPartTotal"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="待处理零件总数：" prop="pendingPartTotal">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pendingPartTotal"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购金额：" prop="purchaseAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="现金金额：" prop="cashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cashAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="返利金额：" prop="rebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rebateAmount"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="缺货单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="缺货单状态：" prop="backStatus">
                  {{ form.backStatusLabel }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  {{ form.purchaseOrderTypeLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="待处理零件总数：" prop="pendingPartTotal">
                  {{ form.pendingPartTotal }}
                </el-form-item>
                <el-form-item label="已处理零件总数：" prop="pendingPartTotal">
                  {{ form.processedPartTotal }}
                </el-form-item>
                <el-form-item label="待处理品种数：" prop="pendingVarietyCount">
                  {{ form.pendingVarietyCount }}
                </el-form-item>
                <el-form-item label="已处理品种数：" prop="processedVarietyCount">
                  {{ form.processedVarietyCount }}
                </el-form-item>
                <el-form-item label="采购申请单：" prop="purchaseApplyCode">
                  {{ form.purchaseApplyCode }}
                </el-form-item>
                <!-- <el-form-item label="收货人姓名：" prop="recipientName">
                  {{ form.recipientName }}
                </el-form-item>
                <el-form-item label="收货人电话：" prop="recipientPhone">
                  {{ form.recipientPhone }}
                </el-form-item>
                <el-form-item label="收货地址：" prop="address">
                  {{ form.address }}
                </el-form-item> -->
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>缺货明细信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :show-toolbar="false"
                  showPagination
                  :current="current"
                  :pageSize="pageSize"
                  :total="total"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                />
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>采购申请明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="procurementColumns"
                  :data="procurementTableData"
                  :show-toolbar="false"
                  showPagination
                  :current="procurement.current"
                  :pageSize="procurement.pageSize"
                  :total="procurement.total"
                  @page-size-change="procurementPageSizeChange"
                  @current-page-change="procurementCurrentPageChange"
                />
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
import { getDetail, addOrUpdate, getBackOrderDetailList } from '@/api/sparepart/purchase/backOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam, listWarehouse } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getPurchaseApplyPage } from '@/api/sparepart/purchase/purchaseApply/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  purchaseApplyCode: '',
  dealerCode: '',
  dealerName: '',
  purchaseOrderType: '',
  pendingVarietyCount: '',
  processedVarietyCount: '',
  backStatus: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  status: '',
  statusDesc: '',
  purchaseApplyId: '',
  processedPartTotal: '',
  pendingPartTotal: '',
  purchaseAmount: '',
  cashAmount: '',
  rebateAmount: '',
};

export default {
  name: 'backOrderEdit',
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
    EditTable,
    FetchSelect
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
    },
    form: {
      handler (val) {
        if (val.purchaseApplyId) {
          this.purchaseApplyId = val.purchaseApplyId;
          this.getList();
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件缺货订单',
      pageType: 'edit',
      title: '缺货单号：',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-backOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'sparePartCode',
          title: '备件编码',
          width: '7%',
        },
        {
          field: 'sparePartName',
          title: '备件名称',
          width: '7%',
        },
        {
          field: 'backStatusLabel',
          title: '处理状态',
          width: '7%',
        },
        {
          field: 'pendingPartQty',
          title: '待处理备件数',
          width: '7%',
        },
        {
          field: 'resolvedPartQty',
          title: '已解欠备件数',
          width: '7%',
        },
        {
          field: 'cancelledPartQty',
          title: '已取消备件数',
          width: '7%',
        },
        {
          field: 'cancelOperator',
          title: '取消人',
          width: '7%',
        },
        {
          field: 'cancelTime',
          title: '取消时间',
          width: '7%',
        },
        {
          field: 'cancelDescription',
          title: '取消说明',
          width: '7%',
        },
        {
          field: 'purchasePrice',
          title: '采购价',
          width: '7%',
        },
        {
          field: 'purchaseAmount',
          title: '采购金额',
          width: '7%',
        },
        {
          field: 'cashUnitPrice',
          title: '现金单价',
          width: '7%',
        },
        {
          field: 'cashAmount',
          title: '现金金额',
          width: '7%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '7%',
        }
      ],
      procurement: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      purchaseApplyId: '', // 采购申请明细ID
      procurementTableData: [],
      procurementColumns: [
        {
          field: 'partCode',
          title: '备件编码',
          width: '11%',
        },
        {
          field: 'partName',
          title: '备件名称',
          width: '11%',
        },
        {
          field: 'originalPrice',
          title: '原价',
          width: '11%',
        },
        {
          field: 'purchasePrice',
          title: '采购价',
          width: '11%',
        },
        {
          field: 'purchaseAmount',
          title: '采购金额',
          width: '11%',
        },
        {
          field: 'cashUnitPrice',
          title: '现金单价',
          width: '11%',
        },
        {
          field: 'cashAmount',
          title: '现金金额',
          width: '11%',
        },
        {
          field: 'purchaseQty',
          title: '采购数',
          width: '11%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '11%',
        }
      ],
      rules: {
        code: [
          { required: true, message: '请输入缺货单号', trigger: 'change' }
        ],
        purchaseApplyCode: [
          { required: true, message: '请输入采购申请单', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        purchaseOrderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        pendingVarietyCount: [
          { required: true, message: '请输入待处理品种数', trigger: 'change' }
        ],
        processedVarietyCount: [
          { required: true, message: '请输入已处理品种数', trigger: 'change' }
        ],
        backStatus: [
          { required: true, message: '请选择缺货单状态', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        purchaseApplyId: [
          { required: true, message: '请输入采购申请单', trigger: 'change' }
        ],
        processedPartTotal: [
          { required: true, message: '请输入已处理零件总数', trigger: 'change' }
        ],
        pendingPartTotal: [
          { required: true, message: '请输入待处理零件总数', trigger: 'change' }
        ],
        purchaseAmount: [
          { required: true, message: '请输入采购金额', trigger: 'change' }
        ],
        cashAmount: [
          { required: true, message: '请输入现金金额', trigger: 'change' }
        ],
        rebateAmount: [
          { required: true, message: '请输入返利金额', trigger: 'change' }
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
          this.getData();
          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
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
    // 获取缺货明细信息
    async getData () {
      const params = {
        pageNum: this.current,
        pageSize: this.pageSize,
        backOrderId: this._id
      };
      const res = await getBackOrderDetailList(params);
      this.tableData = res.records || [];
      this.total = res.total || 0;
    },
    // 获取采购明细信息表格
    async getList () {
      const params = {
        pageNum: this.procurement.current,
        pageSize: this.procurement.pageSize,
        purchaseApplyId: this.purchaseApplyId,
      };
      const res = await getPurchaseApplyPage(params);
      this.procurementTableData = res.records || [];
      this.procurement.total = res.total || 0;
    },
    pageSizeChange (val) {
      this.pageSize = val;
      this.current = 1;
      this.getData();
    },
    currentPageChange (val) {
      this.current = val;
      this.getData();
    },
    procurementPageSizeChange (pageSize) {
      this.procurement.pageSize = pageSize;
      this.procurement.current = 1;
      this.getList();
    },
    procurementCurrentPageChange (current) {
      this.procurement.current = current;
      this.getList();
    },
  }
};
</script>
