<template>
  <edit-page-layout ref="editLayout" :title="repairDetailName" showPaneFooter @save="handleSave" :width="60">
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
        :showEditBtn = "canEdit"
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
                <el-form-item label="套餐代码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    @input="handleCodeInput"
                  />
                </el-form-item>
                <el-form-item label="套餐名称：" prop="packageName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.packageName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="拼音简码：" prop="spellCode">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.spellCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="是否下发：" prop="suedDealer" v-show="!accountFlag">
                  <el-radio-group v-model="form.comboStatus">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSourceLabel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSourceLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="套餐类型：" prop="typeId" style="width: 100%;">
                  <el-checkbox-group v-model="form.typeIdList">
                    <el-checkbox v-for="city in repairTypeList" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="套餐代码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="套餐名称：" prop="packageName">
                  {{ form.packageName }}
                </el-form-item>
                <el-form-item label="拼音简码：" prop="spellCode">
                  {{ form.spellCode }}
                </el-form-item>
                <el-form-item label="是否下发：" prop="suedDealer">
                  {{ form.comboStatusLabel }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSourceLabel }}
                </el-form-item>
                <el-form-item label="门店：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>适配车型</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
              <div class="model-select" @click="handleModel" v-if = "canEdit">选择适配车型</div>
              <vxe-table
                  ref="editTable"
                  stripe
                  :data="tableDataModel"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="vehicleSeriesName" title="车系名称" width="30%" />
                  <vxe-column field="vehicleModelName" title="车型名称" width="30%" />
                  <vxe-column field="vehicleYearType" title="车辆年型" width="30%" />
                  <vxe-column title="操作" width="150" fixed="right" v-if="canEdit">
                    <template #default="{ row }">
                      <el-popconfirm title="此操作将删除此 维修套餐-适配车型 信息，您无法撤消此操作，是否继续？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteModel(row)">
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
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>套餐明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <base-search
                    style="width: 360px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="搜索维修项目代码、名称、拼音简码"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                    :disabled = "!canEdit"
                  />
                </div>
                <!-- 右侧：合计信息 -->
                <div class="summary-box">
                  <span class="summary-item">项目金额合计：￥{{ itemAmount }}</span>
                  <span class="summary-item">零件金额合计：￥{{ partsAmount }}</span>
                  <span class="summary-item">费用合计：￥{{ totalAmount }}</span>
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
                  <vxe-column field="repairItemName" title="维修项目" width="14.3%" />
                  <vxe-column field="repairItemCode" title="维修项目代码" width="14.3%" />
                  <vxe-column field="workHour" title="工时" width="14.3%" />
                  <vxe-column field="price" title="工时单价" width="14.3%" />
                  <vxe-column field="discountAmount" title="优惠金额" width="14.3%" />
                  <vxe-column field="actualAmount" title="项目金额" width="14.3%" />
                  <vxe-column title="操作" width="150" fixed="right" v-if="canEdit">
                    <template #default="{ row }">
                      <!-- <span @click="handleEditRow(rowIndex)" class="action-button btn-edit">日志</span> -->
                      <span @click="handleEditRow(row)" class="action-button btn-edit">编辑</span>
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(row)">
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
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>零件明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tablePartData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="repairItemName" title="维修项目" width="14.3%" />
                  <vxe-column field="repairItemCode" title="维修项目代码" width="14.3%" />
                  <vxe-column field="partsName" title="零件名称" width="14.3%" />
                  <vxe-column field="partsCode" title="零件代码" width="14.3%" />
                  <vxe-column field="repairItemTypeName" title="维修类型" width="14.3%" />
                  <vxe-column field="checkoutTypeName" title="结算类型" width="14.3%" />
                  <vxe-column field="quantity" title="数量" width="14.3%" />
                  <vxe-column field="price" title="单价" width="14.3%" />
                  <vxe-column field="discountAmount" title="优惠金额" width="14.3%" />
                  <vxe-column field="actualAmount" title="零件金额" width="14.3%" />
                  <!-- <vxe-column title="操作" width="150" fixed="right" v-if="canDelete">
                    <template #default="{ row }">
                      <span @click="handleEditRow(row)" class="action-button btn-edit">编辑</span>
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(row)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column> -->
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
        <RepairPackagesDetail
          ref="repairPackagesDetail"
          :repairPackagesId="repairItemId"
          :repairItemId="repairDetailId"
          :judgment="judgment"
          @submit="getProjectPackage"
          @refresh="getProjectPackage"
        />
      </div>
    </template>
    <!-- 适配车型组件 -->
    <ModelDialog :visible="modelDialogVisible" :repairId="repairId" :initialData="tableDataModel" @success="handleSuccessModel" @close="handleCloseModel" />
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getRepairType, getModel, getPackagesItem, modelDelete, partDelete, packagesItemDelete, getPackagesPartPage } from '@/api/maintain/basic/repairPackages/index';
import { getPage } from '@/api/maintain/basic/repairItem/index';
import BaseSearch from '@/libs/components/BaseSearch';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getLoginUser } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ModelDialog from './ModelDialog.vue';
import RepairPackagesDetail from './RepairPackagesDetail.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  modifier: '',
  code: '',
  packageName: '',
  typeIdList: [],
  spellCode: '',
  vehicleSeriesId: '',
  vehicleSeriesIds: '',
  dataSource: '',
  dataSourceLabel: '',
  dealerName: '',
  status: '',
  totalAmount: '',
  modifierName: '',
  updateTime: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  remark: '',
  statusDesc: '',
  itemRespList: '',
  partRespList: '',
  typeName: '',
  backoutSuedDate: '',
  comboStatus: '',
  suedDealer: 1,
  ownerOrgId: '',
  dealerCode: '',
  suedDate: '',
  repairPartAmount: '',
  repairProjectAmount: '',
  carModelId: '',
  carModelIds: '',
  used: '',
};

export default {
  name: 'repairPackagesEdit',
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
    BaseSearch,
    ModelDialog,
    RepairPackagesDetail
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '套餐代码：' + this.form.code;
    },
    canEdit () {
      console.log('accountFlag:' + this.accountFlag, (this.accountFlag && this.form.dataSource === 10), (!this.accountFlag && this.form.dataSource === 20));
      return (this.accountFlag && this.form.dataSource === 10) || (!this.accountFlag && this.form.dataSource === 20);
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
    'form.id': {
      handler (val) {
        if (val) {
          this.getModelList();
          this.getProjectPackage();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '维修套餐管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-repairPackages',
      loading: false,
      submitLoading: false,
      yes_no_enum: [
        {
          message: '是',
          code: 20
        },
        {
          message: '否',
          code: 10
        }
      ],
      form: { ...form },
      originalForm: { ...form },
      emptyText: '暂无数据',
      tableData: [],
      tablePartData: [],
      accountFlag: true,
      itemAmount: 0,
      partsAmount: 0,
      totalAmount: 0,
      rules: {
        code: [
          { required: true, message: '请输入套餐代码', trigger: 'change' }
        ],
        packageName: [
          { required: true, message: '请输入套餐名称', trigger: 'change' }
        ],
        repairPackagesId: [
          { required: true, message: '请选择套餐类型', trigger: 'change' }
        ],
        spellCode: [
          { required: false, message: '请输入拼音简码', trigger: 'change' }
        ],
        dataSource: [
          { required: false, message: '请选择数据来源', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: false, message: '请选择门店', trigger: 'change' }
        ],
        typeIdList: [
          { required: true, message: '请选择套餐类型', trigger: 'change' }
        ],
        suedDealer: [
          { required: true, message: '请输入是否下发门店', trigger: 'change' }
        ],
      },
      modelDialogVisible: false, // 适配车型弹窗
      repairTypeList: [], // 维修套餐列表
      tableDataModel: [],
      repairDetailId: '', // 维修项目明细ID
      repairDetailName: '', // 维修项目名称
      repairId: '', // 维修套餐ID
      repairItemId: '', // 维修套餐ID 传入子组件
      judgment: 'add', // 判断是下拉还是编辑 进入的侧边栏详情
    };
  },
  mounted () {
    this.initDealerUser();
    this.getType();
  },
  methods: {
    handleCodeInput (val) {
      this.form.code = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
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
    // 关闭侧边栏
    closePane () {
      this.$refs.editLayout.closePane();
    },
    // 删除套餐明细  适配车型
    async handleDeleteModel (val) {
      console.log('删除套餐明细', val);
      await modelDelete([val.id]);
      this.$message.success('删除成功');
      this.getModelList();
    },
    // 删除套餐明细 维修项目
    handleDeleteRow (val) {
      packagesItemDelete([val.id]).then(() => {
        this.$message.success('删除成功');
        this.getProjectPackage();
      });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        getPage({ nameOrCodeOrPinyinLike: queryString, status: 1, limitSize: 20 }).then(res => {
          const list = res || [];
          resolve(list);
        });
      });
    },
    // 新增维修项目
    handleAddTableData (val, record) {
      // 检查是否已存在
      const exists = this.tableData.some(item => item.repairItemId === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      this.judgment = 'add';
      this.repairDetailName = record.name || '';
      this.repairDetailId = record.id || '';
      this.repairItemId = this._id;
      this.openPane();
    },
    // 编辑维修项目
    handleEditRow (row) {
      this.repairDetailId = row.id;
      this.repairItemId = this._id;
      this.judgment = 'edit';
      this.openPane();
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
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.accountFlag = res.accountFlag;
      if (!this._id) {
        this.form.ownerOrgId = res.currentOrgId;// 当前门店code
        this.form.dealerCode = res.currentDealerCode;// 当前门店编码
        this.form.dealerName = res.currentDealerName;// 当前门店名称
        if (this.accountFlag) {
          this.form.dataSource = 10;
          this.form.dataSourceLabel = '门店';
        } else {
          this.form.dataSource = 20;
          this.form.dataSourceLabel = '主机厂';
        }
      }
    },
    // 维修套餐--类型表列表查询
    async getType () {
      const res = await getRepairType({ status: 1 });
      this.repairTypeList = res || [];
    },
    // 适配车型接口
    async getModelList () {
      const res = await getModel({ repairPackagesId: this._id });
      this.tableDataModel = res.records || [];
    },
    // 维修项目套餐列表
    async getProjectPackage () {
      const res = await getPackagesItem({ repairPackagesId: this._id });
      this.tableData = res.records || [];
      // 计算项目金额
      this.itemAmount = 0;
      this.tableData.forEach(item => {
        const actualAmount = Number(item.actualAmount) || 0;
        this.itemAmount = this.itemAmount + actualAmount;
      });
      // 同时刷新零件列表
      await this.getPartData();
    },
    async getPartData () {
      const res = await getPackagesPartPage({ repairPackagesId: this._id, pageSize: 5000, sortColumns: [{ column: 'repair_item_id', sort: 'ASC' }] });
      this.tablePartData = res.records || [];
      // 计算零件金额
      this.partsAmount = 0;
      this.tablePartData.forEach(item => {
        const number = Number(item.quantity) || 0;
        const unitPrice = Number(item.price) || 0;
        const discountAmount = Number(item.discountAmount) || 0;
        let receivable = number * unitPrice;
        receivable = receivable - discountAmount;
        item.actualAmount = Math.max(0, receivable.toFixed(2));
        this.partsAmount = this.partsAmount + item.actualAmount;
      });
      this.totalAmount = this.itemAmount + this.partsAmount;
    },
    // 适配车型弹窗
    handleModel () {
      this.repairId = this._id;
      this.modelDialogVisible = true;
    },
    // 处理更新表格数据事件
    handleSuccessModel () {
      this.modelDialogVisible = false;
      this.getModelList();
    },
    // 处理关闭弹窗事件
    handleCloseModel () {
      this.modelDialogVisible = false;
    },
    // 保存侧边栏事件
    async handleSave () {
      await this.$refs.repairPackagesDetail?.handleSave();
      this.closePane();
      this.getModelList();
      this.getProjectPackage();
    }
  }
};
</script>

<style lang="scss" scoped>
.model-select {
  width: 114px;
  height: 32px;
  border-radius: 4px;
  box-sizing: border-box;
  /* 功能色/零跑绿 */
  border: 1px solid #009100;
  color: #009100;
  font-size: 14px;
  line-height: 32px;
  text-align: center;
  margin-bottom: 8px;
  cursor: pointer;
}
.action-button{
    margin: 0 5px;
    cursor: pointer;
    &.btn-edit{
      color:#4C4CD6;
    }
    &.btn-delete{
      color: #b91919 !important;;
    }
    &.disabled{
      cursor: not-allowed;
      color: var(--disabled-color);
    }
  }
  .btn-delete {
    margin-left: 5px;
  }
.summary-box {
  display: flex;
  gap: 8px;
  font-size: 14px;
  margin-right: 10px;
}

.summary-item {
  white-space: nowrap;
}
</style>
