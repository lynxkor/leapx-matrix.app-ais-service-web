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
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="缺货单code：" prop="backOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.backOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件编码：" prop="sparePartCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.sparePartCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件名称：" prop="sparePartName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.sparePartName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="待处理零件数：" prop="pendingPartQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pendingPartQty"
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
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
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
                <el-form-item label="缺货单ID：" prop="backOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.backOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件ID：" prop="sparePartId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.sparePartId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="处理状态:待处理,处理中,已处理,已终止：" prop="backStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.backStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="已解欠零件数：" prop="resolvedPartQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.resolvedPartQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="已取消零件数：" prop="cancelledPartQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelledPartQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="原价：" prop="originalPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.originalPrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购价：" prop="purchasePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchasePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购金额)：" prop="purchaseAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="现金单价：" prop="cashUnitPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cashUnitPrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="现金金额)：" prop="cashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cashAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="返利单价：" prop="rebateUnitPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rebateUnitPrice"
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
                <el-form-item label="取消时间：" prop="cancelTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="取消人：" prop="cancelOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="取消说明：" prop="cancelDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="预计厂端发货时间：" prop="estimatedFactoryDeliveryTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.estimatedFactoryDeliveryTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="预计到店时间：" prop="estimatedArrivalTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.estimatedArrivalTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="其它解决方案：" prop="otherSolution">
                  <el-input
                    placeholder="请输入"
                    v-model="form.otherSolution"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="厂端缺货说明：" prop="factoryBackDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.factoryBackDescription"
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
                <el-form-item label="门店编码（组织code）：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称（组织名称）：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购订单类型：" prop="purchaseOrderType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.purchaseOrderType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="缺货天数：" prop="backDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.backDays"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="可用库存：" prop="availableQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.availableQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="共享库存：" prop="sharedQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.sharedQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="营销分类：" prop="marketingType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.marketingType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="缺货单code：" prop="backOrderCode">
                  {{ form.backOrderCode }}
                </el-form-item>
                <el-form-item label="备件编码：" prop="sparePartCode">
                  {{ form.sparePartCode }}
                </el-form-item>
                <el-form-item label="备件名称：" prop="sparePartName">
                  {{ form.sparePartName }}
                </el-form-item>
                <el-form-item label="待处理零件数：" prop="pendingPartQty">
                  {{ form.pendingPartQty }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="数据来源，150:零小跑; 10:E10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="缺货单ID：" prop="backOrderId">
                  {{ form.backOrderId }}
                </el-form-item>
                <el-form-item label="备件ID：" prop="sparePartId">
                  {{ form.sparePartId }}
                </el-form-item>
                <el-form-item label="处理状态:待处理,处理中,已处理,已终止：" prop="backStatus">
                  {{ form.backStatus }}
                </el-form-item>
                <el-form-item label="已解欠零件数：" prop="resolvedPartQty">
                  {{ form.resolvedPartQty }}
                </el-form-item>
                <el-form-item label="已取消零件数：" prop="cancelledPartQty">
                  {{ form.cancelledPartQty }}
                </el-form-item>
                <el-form-item label="原价：" prop="originalPrice">
                  {{ form.originalPrice }}
                </el-form-item>
                <el-form-item label="采购价：" prop="purchasePrice">
                  {{ form.purchasePrice }}
                </el-form-item>
                <el-form-item label="采购金额)：" prop="purchaseAmount">
                  {{ form.purchaseAmount }}
                </el-form-item>
                <el-form-item label="现金单价：" prop="cashUnitPrice">
                  {{ form.cashUnitPrice }}
                </el-form-item>
                <el-form-item label="现金金额)：" prop="cashAmount">
                  {{ form.cashAmount }}
                </el-form-item>
                <el-form-item label="返利单价：" prop="rebateUnitPrice">
                  {{ form.rebateUnitPrice }}
                </el-form-item>
                <el-form-item label="返利金额：" prop="rebateAmount">
                  {{ form.rebateAmount }}
                </el-form-item>
                <el-form-item label="取消时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                <el-form-item label="取消人：" prop="cancelOperator">
                  {{ form.cancelOperator }}
                </el-form-item>
                <el-form-item label="取消说明：" prop="cancelDescription">
                  {{ form.cancelDescription }}
                </el-form-item>
                <el-form-item label="预计厂端发货时间：" prop="estimatedFactoryDeliveryTime">
                  {{ form.estimatedFactoryDeliveryTime }}
                </el-form-item>
                <el-form-item label="预计到店时间：" prop="estimatedArrivalTime">
                  {{ form.estimatedArrivalTime }}
                </el-form-item>
                <el-form-item label="其它解决方案：" prop="otherSolution">
                  {{ form.otherSolution }}
                </el-form-item>
                <el-form-item label="厂端缺货说明：" prop="factoryBackDescription">
                  {{ form.factoryBackDescription }}
                </el-form-item>
                <el-form-item label="采购申请单code：" prop="purchaseApplyCode">
                  {{ form.purchaseApplyCode }}
                </el-form-item>
                <el-form-item label="门店编码（组织code）：" prop="dealerCode">
                  <el-link type="primary" :href="`/datacenter/store/store/detail?storeCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="门店名称（组织名称）：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="采购订单类型：" prop="purchaseOrderType">
                  {{ form.purchaseOrderType }}
                </el-form-item>
                <el-form-item label="缺货天数：" prop="backDays">
                  {{ form.backDays }}
                </el-form-item>
                <el-form-item label="可用库存：" prop="availableQty">
                  {{ form.availableQty }}
                </el-form-item>
                <el-form-item label="共享库存：" prop="sharedQty">
                  {{ form.sharedQty }}
                </el-form-item>
                <el-form-item label="营销分类：" prop="marketingType">
                  {{ form.marketingType }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
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
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
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
import { getDetail, addOrUpdate } from '@/api/sparepart/purchase/backOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  backOrderCode: '',
  sparePartCode: '',
  sparePartName: '',
  pendingPartQty: '',
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
  backOrderId: '',
  sparePartId: '',
  backStatus: '',
  resolvedPartQty: '',
  cancelledPartQty: '',
  originalPrice: '',
  purchasePrice: '',
  purchaseAmount: '',
  cashUnitPrice: '',
  cashAmount: '',
  rebateUnitPrice: '',
  rebateAmount: '',
  cancelTime: '',
  cancelOperator: '',
  cancelDescription: '',
  estimatedFactoryDeliveryTime: '',
  estimatedArrivalTime: '',
  otherSolution: '',
  factoryBackDescription: '',
  purchaseApplyCode: '',
  dealerCode: '',
  dealerName: '',
  purchaseOrderType: '',
  backDays: '',
  availableQty: '',
  sharedQty: '',
  marketingType: '',
};

export default {
  name: 'boToShareTransferEdit',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '缺货单code：' + this.form.backOrderCode;
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
      pageTitle: 'BO转共享调拨',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-boToShareTransfer',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        backOrderCode: [
          { required: true, message: '请输入缺货单code', trigger: 'change' }
        ],
        sparePartCode: [
          { required: true, message: '请输入备件编码', trigger: 'change' }
        ],
        sparePartName: [
          { required: true, message: '请输入备件名称', trigger: 'change' }
        ],
        pendingPartQty: [
          { required: true, message: '请输入待处理零件数', trigger: 'change' }
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
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
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
        backOrderId: [
          { required: true, message: '请输入缺货单ID', trigger: 'change' }
        ],
        sparePartId: [
          { required: true, message: '请输入备件ID', trigger: 'change' }
        ],
        backStatus: [
          { required: true, message: '请选择处理状态:待处理,处理中,已处理,已终止', trigger: 'change' }
        ],
        resolvedPartQty: [
          { required: true, message: '请输入已解欠零件数', trigger: 'change' }
        ],
        cancelledPartQty: [
          { required: true, message: '请输入已取消零件数', trigger: 'change' }
        ],
        originalPrice: [
          { required: true, message: '请输入原价', trigger: 'change' }
        ],
        purchasePrice: [
          { required: true, message: '请输入采购价', trigger: 'change' }
        ],
        purchaseAmount: [
          { required: true, message: '请输入采购金额)', trigger: 'change' }
        ],
        cashUnitPrice: [
          { required: true, message: '请输入现金单价', trigger: 'change' }
        ],
        cashAmount: [
          { required: true, message: '请输入现金金额)', trigger: 'change' }
        ],
        rebateUnitPrice: [
          { required: true, message: '请输入返利单价', trigger: 'change' }
        ],
        rebateAmount: [
          { required: true, message: '请输入返利金额', trigger: 'change' }
        ],
        cancelTime: [
          { required: true, message: '请选择取消时间', trigger: 'change' }
        ],
        cancelOperator: [
          { required: true, message: '请输入取消人', trigger: 'change' }
        ],
        cancelDescription: [
          { required: true, message: '请输入取消说明', trigger: 'change' }
        ],
        estimatedFactoryDeliveryTime: [
          { required: true, message: '请选择预计厂端发货时间', trigger: 'change' }
        ],
        estimatedArrivalTime: [
          { required: true, message: '请选择预计到店时间', trigger: 'change' }
        ],
        otherSolution: [
          { required: true, message: '请输入其它解决方案', trigger: 'change' }
        ],
        factoryBackDescription: [
          { required: true, message: '请输入厂端缺货说明', trigger: 'change' }
        ],
        purchaseApplyCode: [
          { required: true, message: '请输入采购申请单code', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        purchaseOrderType: [
          { required: true, message: '请选择采购订单类型', trigger: 'change' }
        ],
        backDays: [
          { required: true, message: '请输入缺货天数', trigger: 'change' }
        ],
        availableQty: [
          { required: true, message: '请输入可用库存', trigger: 'change' }
        ],
        sharedQty: [
          { required: true, message: '请输入共享库存', trigger: 'change' }
        ],
        marketingType: [
          { required: true, message: '请选择营销分类', trigger: 'change' }
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
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
