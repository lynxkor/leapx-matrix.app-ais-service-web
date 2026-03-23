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
        :showEditBtn="false"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="入库单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="业务单号code：" prop="businessOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.businessOrderCode"
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
                <el-form-item label="备件仓库ID：" prop="warehouseId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warehouseId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库类型:采购入库,调拨入库：" prop="inboundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.inboundType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="入库状态:未入库,已入库：" prop="inboundStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.inboundStatus"
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
                <el-form-item label="业务单号ID：" prop="businessOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.businessOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundOperatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.inboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="使用现金：" prop="cashAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cashAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="使用返利：" prop="rebateAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rebateAmount"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="入库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="业务单号：" prop="businessOrderCode">
                  {{ form.businessOrderCode }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="入库类型：" prop="inboundType">
                  {{ form.inboundTypeLabel }}
                </el-form-item>
                <el-form-item label="入库状态：" prop="inboundStatus">
                  {{ form.inboundStatusLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperator">
                  {{ form.inboundOperator }}
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  {{ form.inboundTime }}
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="使用现金：" prop="cashAmount">
                  {{ form.cashAmount }}
                </el-form-item>
                <el-form-item label="使用返利：" prop="rebateAmount">
                  {{ form.rebateAmount }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>入库明细信息</h2>
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
import { getDetail, addOrUpdate, inboundOrderDetail } from '@/api/sparepart/inbound/inboundOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  businessOrderCode: '',
  dealerCode: '',
  dealerName: '',
  warehouseId: '',
  inboundType: '',
  inboundStatus: '',
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
  businessOrderId: '',
  inboundOperator: '',
  inboundTime: '',
  taxRate: '',
  totalAmount: '',
  cashAmount: '',
  rebateAmount: '',
};

export default {
  name: 'inboundOrderEdit',
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
      pageTitle: '备件入库单',
      pageType: 'edit',
      title: '入库单号：',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-inboundOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      pageSize: 10,
      current: 1,
      total: 0,
      tableData: [],
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'sparePartCode',
          title: '备件编码',
          width: '10%',
        },
        {
          field: 'sparePartName',
          title: '备件名称',
          width: '10%',
        },
        {
          field: 'inboundQty',
          title: '入库数量',
          width: '10%',
        },
        {
          field: 'price',
          title: '价格',
          width: '10%',
        },
        {
          field: 'amount',
          title: '金额',
          width: '10%',
        },
        {
          field: 'cashUnitPrice',
          title: '现金单价',
          width: '10%',
        },
        {
          field: 'cashAmount',
          title: '现金金额',
          width: '10%',
        },
        {
          field: 'rebateUnitPrice',
          title: '返利单价',
          width: '10%',
        },
        {
          field: 'rebateAmount',
          title: '返利金额',
          width: '10%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '10%',
        },
      ],
      rules: {
        code: [
          { required: true, message: '请输入入库单号', trigger: 'change' }
        ],
        businessOrderCode: [
          { required: true, message: '请输入业务单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '请输入备件仓库', trigger: 'change' }
        ],
        inboundType: [
          { required: true, message: '请选择入库类型', trigger: 'change' }
        ],
        inboundStatus: [
          { required: true, message: '请选择入库状态', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        businessOrderId: [
          { required: true, message: '请输入业务单号', trigger: 'change' }
        ],
        inboundOperator: [
          { required: true, message: '请输入入库操作人', trigger: 'change' }
        ],
        inboundTime: [
          { required: true, message: '请选择入库操作时间', trigger: 'change' }
        ],
        taxRate: [
          { required: true, message: '请输入税率', trigger: 'change' }
        ],
        totalAmount: [
          { required: true, message: '请输入总金额', trigger: 'change' }
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
    this.getData();
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
    async getData () {
      const params = {
        pageNum: this.current,
        pageSize: this.pageSize,
        inboundOrderId: this._id
      };
      const res = await inboundOrderDetail(params);
      this.tableData = res.records || [];
      this.total = res.total || 0;
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getData();
    },
    currentPageChange (current) {
      this.current = current;
      this.getData();
    },
  }
};
</script>
