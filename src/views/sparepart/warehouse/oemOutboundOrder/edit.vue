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
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="出库单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购订单code：" prop="purchaseOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购申请单code：" prop="purchaseApplyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseApplyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发货仓库：" prop="deliveryWarehouse">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryWarehouse"
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
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsOrderNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单同步是否成功：" prop="orderSyncSuccessIs">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderSyncSuccessIs"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="SAP返回信息：" prop="sapReturnInfo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.sapReturnInfo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售凭证：" prop="salesVoucher">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salesVoucher"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交货凭证：" prop="deliveryVoucher">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryVoucher"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发票号：" prop="invoiceNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开票日期：" prop="invoiceDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="税务发票号：" prop="taxInvoiceNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.taxInvoiceNo"
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
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
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
                <el-form-item label="数据来源，150:零小跑; 10:E10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购申请单ID：" prop="purchaseApplyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseApplyId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购订单ID：" prop="purchaseOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="发货日期：" prop="deliveryDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsProvider"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库同步是否成功：" prop="outboundSyncSuccessIs">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundSyncSuccessIs"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开票同步是否成功：" prop="invoiceSyncSuccessIs">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceSyncSuccessIs"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="出库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="采购申请单：" prop="purchaseApplyCode">
                  {{ form.purchaseApplyCode }}
                </el-form-item>
                <el-form-item label="发货仓库：" prop="deliveryWarehouse">
                  {{ form.deliveryWarehouse }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  {{ form.purchaseOrderTypeLabel }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="订单同步是否成功：" prop="orderSyncSuccessIs">
                  {{ form.orderSyncSuccessIsLabel }}
                </el-form-item>
                <el-form-item label="SAP返回信息：" prop="sapReturnInfo">
                  {{ form.sapReturnInfo }}
                </el-form-item>
                <el-form-item label="销售凭证：" prop="salesVoucher">
                  {{ form.salesVoucher }}
                </el-form-item>
                <el-form-item label="交货凭证：" prop="deliveryVoucher">
                  {{ form.deliveryVoucher }}
                </el-form-item>
                <el-form-item label="发票号：" prop="invoiceNo">
                  {{ form.invoiceNo }}
                </el-form-item>
                <el-form-item label="开票日期：" prop="invoiceDate">
                  {{ form.invoiceDate }}
                </el-form-item>
                <el-form-item label="税务发票号：" prop="taxInvoiceNo">
                  {{ form.taxInvoiceNo }}
                </el-form-item>
                <el-form-item label="采购金额：" prop="purchaseAmount">
                  {{ form.purchaseAmount }}
                </el-form-item>
                <el-form-item label="现金金额：" prop="cashAmount">
                  {{ form.cashAmount }}
                </el-form-item>
                <el-form-item label="返利金额：" prop="rebateAmount">
                  {{ form.rebateAmount }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="发货日期：" prop="deliveryDate">
                  {{ form.deliveryDate }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="出库同步是否成功：" prop="outboundSyncSuccessIs">
                  {{ form.outboundSyncSuccessIsLabel }}
                </el-form-item>
                <el-form-item label="开票同步是否成功：" prop="invoiceSyncSuccessIs">
                  {{ form.invoiceSyncSuccessIsLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
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
import { getDetail, addOrUpdate } from '@/api/sparepart/warehouse/oemOutboundOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam, getParentCompany, listWarehouse } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  purchaseOrderCode: '',
  purchaseApplyCode: '',
  deliveryWarehouse: '',
  dealerCode: '',
  dealerName: '',
  purchaseOrderType: '',
  logisticsOrderNo: '',
  orderSyncSuccessIs: '',
  sapReturnInfo: '',
  salesVoucher: '',
  deliveryVoucher: '',
  invoiceNo: '',
  invoiceDate: '',
  taxInvoiceNo: '',
  purchaseAmount: '',
  cashAmount: '',
  rebateAmount: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  purchaseApplyId: '',
  purchaseOrderId: '',
  deliveryDate: '',
  logisticsProvider: '',
  outboundSyncSuccessIs: '',
  invoiceSyncSuccessIs: '',
};

export default {
  name: 'oemOutboundOrderEdit',
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
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: 'OEM出库单',
      pageType: 'edit',
      title: '出库单号：' + form.code,
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-oemOutboundOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        code: [
          { required: true, message: '请输入出库单号', trigger: 'change' }
        ],
        purchaseOrderCode: [
          { required: true, message: '请输入采购订单code', trigger: 'change' }
        ],
        purchaseApplyCode: [
          { required: true, message: '请输入采购申请单code', trigger: 'change' }
        ],
        deliveryWarehouse: [
          { required: true, message: '请输入发货仓库', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        purchaseOrderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        logisticsOrderNo: [
          { required: true, message: '请输入物流单号', trigger: 'change' }
        ],
        orderSyncSuccessIs: [
          { required: true, message: '请输入订单同步是否成功', trigger: 'change' }
        ],
        sapReturnInfo: [
          { required: true, message: '请输入SAP返回信息', trigger: 'change' }
        ],
        salesVoucher: [
          { required: true, message: '请输入销售凭证', trigger: 'change' }
        ],
        deliveryVoucher: [
          { required: true, message: '请输入交货凭证', trigger: 'change' }
        ],
        invoiceNo: [
          { required: true, message: '请输入发票号', trigger: 'change' }
        ],
        invoiceDate: [
          { required: true, message: '请输入开票日期', trigger: 'change' }
        ],
        taxInvoiceNo: [
          { required: true, message: '请输入税务发票号', trigger: 'change' }
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
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:零小跑; 10:E10', trigger: 'change' }
        ],
        purchaseApplyId: [
          { required: true, message: '请输入采购申请单ID', trigger: 'change' }
        ],
        purchaseOrderId: [
          { required: true, message: '请输入采购订单ID', trigger: 'change' }
        ],
        deliveryDate: [
          { required: true, message: '请输入发货日期', trigger: 'change' }
        ],
        logisticsProvider: [
          { required: true, message: '请输入物流商', trigger: 'change' }
        ],
        outboundSyncSuccessIs: [
          { required: true, message: '请输入出库同步是否成功', trigger: 'change' }
        ],
        invoiceSyncSuccessIs: [
          { required: true, message: '请输入开票同步是否成功', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
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

    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
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
    }
  }
};
</script>
