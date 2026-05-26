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
                <el-form-item label="备件编码：" prop="partCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件名称：" prop="partName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partName"
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
                <el-form-item label="仓库名称：" prop="warehouseName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="库位：" prop="locationName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.locationName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购价格：" prop="purchasePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchasePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售价格：" prop="salePrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.salePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="可用数量：" prop="availableQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.availableQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="库存总数：" prop="totalQty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalQty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="操作类型：" prop="operateType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.operateType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="业务类型：" prop="businessType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.businessType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="流水单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数量：" prop="qty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.qty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="成本单价：" prop="costUnitPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.costUnitPrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="成本金额：" prop="costAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.costAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交易单价：" prop="transactionUnitPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transactionUnitPrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="交易金额：" prop="transactionAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transactionAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="操作人：" prop="operator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.operator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实际业务单号：" prop="businessNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.businessNo"
                    clearable
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件编码：" prop="partCode">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：" prop="partName">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseName">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="库位：" prop="locationName">
                  {{ form.locationName }}
                </el-form-item>
                <el-form-item label="采购价格：" prop="purchasePrice">
                  {{ form.purchasePrice }}
                </el-form-item>
                <el-form-item label="销售价格：" prop="salePrice">
                  {{ form.salePrice }}
                </el-form-item>
                <el-form-item label="可用数量：" prop="availableQty">
                  {{ form.availableQty }}
                </el-form-item>
                <el-form-item label="库存总数：" prop="totalQty">
                  {{ form.totalQty }}
                </el-form-item>
                <el-form-item label="操作类型：" prop="operateType">
                  {{ form.operateType }}
                </el-form-item>
                <el-form-item label="业务类型：" prop="businessType">
                  {{ form.businessType }}
                </el-form-item>
                <el-form-item label="流水单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="数量：" prop="qty">
                  {{ form.qty }}
                </el-form-item>
                <el-form-item label="成本单价：" prop="costUnitPrice">
                  {{ form.costUnitPrice }}
                </el-form-item>
                <el-form-item label="成本金额：" prop="costAmount">
                  {{ form.costAmount }}
                </el-form-item>
                <el-form-item label="交易单价：" prop="transactionUnitPrice">
                  {{ form.transactionUnitPrice }}
                </el-form-item>
                <el-form-item label="交易金额：" prop="transactionAmount">
                  {{ form.transactionAmount }}
                </el-form-item>
                <el-form-item label="操作人：" prop="operator">
                  {{ form.operator }}
                </el-form-item>
                <el-form-item label="实际业务单号：" prop="businessNo">
                  {{ form.businessNo }}
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
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/warehouse/flowReport/index';
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
  partCode: '',
  partName: '',
  dealerCode: '',
  dealerName: '',
  warehouseName: '',
  locationName: '',
  purchasePrice: '',
  salePrice: '',
  availableQty: '',
  totalQty: '',
  operateType: '',
  businessType: '',
  code: '',
  qty: '',
  costUnitPrice: '',
  costAmount: '',
  transactionUnitPrice: '',
  transactionAmount: '',
  operator: '',
  businessNo: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
};

export default {
  name: 'flowReportEdit',
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
      return '备件编码：' + this.form.partCode;
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
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-flowReport',
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
        partCode: [
          { required: true, message: '请输入备件编码', trigger: 'change' }
        ],
        partName: [
          { required: true, message: '请输入备件名称', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        warehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'change' }
        ],
        locationName: [
          { required: true, message: '请输入库位', trigger: 'change' }
        ],
        purchasePrice: [
          { required: true, message: '请输入采购价格', trigger: 'change' }
        ],
        salePrice: [
          { required: true, message: '请输入销售价格', trigger: 'change' }
        ],
        availableQty: [
          { required: true, message: '请输入可用数量', trigger: 'change' }
        ],
        totalQty: [
          { required: true, message: '请输入库存总数', trigger: 'change' }
        ],
        operateType: [
          { required: true, message: '请选择操作类型', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入流水单号', trigger: 'change' }
        ],
        qty: [
          { required: true, message: '请输入数量', trigger: 'change' }
        ],
        costUnitPrice: [
          { required: true, message: '请输入成本单价', trigger: 'change' }
        ],
        costAmount: [
          { required: true, message: '请输入成本金额', trigger: 'change' }
        ],
        transactionUnitPrice: [
          { required: true, message: '请输入交易单价', trigger: 'change' }
        ],
        transactionAmount: [
          { required: true, message: '请输入交易金额', trigger: 'change' }
        ],
        operator: [
          { required: true, message: '请输入操作人', trigger: 'change' }
        ],
        businessNo: [
          { required: true, message: '请输入实际业务单号', trigger: 'change' }
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
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
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
