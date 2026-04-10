<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <div class="page-common-edit">
        <el-container>
          <el-main>
            <section class="common-title" v-if="_id">
              <div>
                <h2>账户编号：{{ form.code }}</h2>
                <!-- TIPS: 子标题格式如下 -->
                <!-- <h5>活动编码：{{ form.activityCode }}</h5> -->
              </div>
              <div>
                <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button>
              </div>
              <!-- <div v-if="isEditing">
                <el-button size="small" @click="handleCancel">取消</el-button>
                <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
              </div>
              <div v-else>
                <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
              </div> -->
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
                  <el-form-item label="账户编号：" prop="code">
                    <el-input
                      placeholder="请输入"
                      v-model="form.code"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="公司编码：" prop="companyCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.companyCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="公司名称：" prop="companyName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.companyName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="开户银行：" prop="bankName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.bankName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="银行户主：" prop="bankAccountHolder">
                    <el-input
                      placeholder="请输入"
                      v-model="form.bankAccountHolder"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="开户账户：" prop="bankAccount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.bankAccount"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="可用资金：" prop="availableAmount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.availableAmount"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="冻结资金：" prop="frozenAmount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.frozenAmount"
                      clearable
                    />
                  </el-form-item>
                  <!-- <el-form-item label="保证资金：" prop="marginAmount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.marginAmount"
                      clearable
                    />
                  </el-form-item> -->
                  <el-form-item label="账户总额：" prop="totalAmount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.totalAmount"
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
                  <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dataSource"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="账户类型 资金账户 返利账户：" prop="accountType">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.accountType"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-else>
                  <el-form-item label="账户编号：" prop="code">
                    {{ form.code }}
                  </el-form-item>
                  <el-form-item label="公司编码：" prop="companyCode">
                    {{ form.companyCode }}
                  </el-form-item>
                  <el-form-item label="公司名称：" prop="companyName">
                    {{ form.companyName }}
                  </el-form-item>
                  <el-form-item label="开户银行：" prop="bankName">
                    {{ form.bankName }}
                  </el-form-item>
                  <el-form-item label="银行户主：" prop="bankAccountHolder">
                    {{ form.bankAccountHolder }}
                  </el-form-item>
                  <el-form-item label="开户账户：" prop="bankAccount">
                    {{ form.bankAccount }}
                  </el-form-item>
                  <el-form-item label="税号：">
                    {{ form.taxNo }}
                  </el-form-item>
                  <el-form-item label="开票电话：">
                    {{ form.taxPhone }}
                  </el-form-item>
                  <el-form-item label="开票地址：">
                    {{ form.taxAddress }}
                  </el-form-item>
                  <el-form-item label="可用资金：" prop="availableAmount">
                    {{ form.availableAmount }}
                  </el-form-item>
                  <el-form-item label="冻结资金：" prop="frozenAmount">
                    {{ form.frozenAmount }}
                  </el-form-item>
                  <!-- <el-form-item label="保证资金：" prop="marginAmount">
                    {{ form.marginAmount }}
                  </el-form-item> -->
                  <el-form-item label="账户总额：" prop="totalAmount">
                    {{ form.totalAmount }}
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    {{ form.remark }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>账户流水 <el-button size="small" :loading="exportLoading" @click="handleExport" v-permission="'AISPART-account-exportFlow'">导出账户流水</el-button></h2>
              </div>
              <div class="common-section-body">
                <div class="common-section-table">
                  <vxe-table
                    ref="tableExport"
                    :data="tableData"
                    stripe
                    resizable
                    show-overflow
                    border="inner"
                    size="medium"
                    min-height="0"
                    max-height="400px"
                  >
                    <vxe-column
                      v-for="col in columnConfigs"
                      :key="col.field"
                      :field="col.field"
                      :title="col.title"
                      :width="col.width"
                    >
                      <!-- 业务单号可跳转 -->
                      <template v-if="col.field === 'businessNo'" #default="{ row }">
                        <div class="href-link" @click="handleFlowJump(row)">{{ row.businessNo }}</div>
                      </template>
                    </vxe-column>
                  </vxe-table>
                  <el-pagination
                    style="float: right; padding-top: 16px;"
                    :current-page.sync="pagination.current"
                    :page-size="pagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    background
                    layout="total, prev, pager, next, sizes, jumper"
                    :total="pagination.total"
                    @size-change="pageSizeChange"
                    @current-change="currentPageChange"
                  />
                </div>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>冻结流水 <el-button size="small" :loading="exportDjLoading" @click="handleDjExport" v-permission="'AISPART-account-exportFrozen'">导出冻结流水</el-button></h2>
              </div>
              <div class="common-section-body">
                <div class="common-section-table">
                  <vxe-table
                    ref="table"
                    :data="djTableData"
                    stripe
                    resizable
                    show-overflow
                    border="inner"
                    size="medium"
                    min-height="0"
                    max-height="400px"
                  >
                    <vxe-column
                      v-for="col in columnConfigsDj"
                      :key="col.field"
                      :field="col.field"
                      :title="col.title"
                      :width="col.width"
                    >
                      <!-- 业务单号可跳转 -->
                      <template v-if="col.field === 'businessNo'" #default="{ row }">
                        <div class="href-link" @click="handleJump(row)">{{ row.businessNo }}</div>
                      </template>
                    </vxe-column>
                    <!-- <vxe-column field="businessTypeLabel" title="业务类型" width="100" />
                    <vxe-column field="businessNo" title="业务单号" width="200">
                      <template #default="{ row }">
                        <div class="href-link" @click="handleJump(row)">{{ row.businessNo }}</div>
                      </template>
                    </vxe-column>
                    <vxe-column field="dealerCode" title="门店编码" width="150" />
                    <vxe-column field="dealerName" title="门店名称" width="200" />
                    <vxe-column field="partCode" title="零件/商品编码" width="200" />
                    <vxe-column field="partName" title="零件/商品名称" width="160" />
                    <vxe-column field="frozenQty" title="冻结数量" width="100" />
                    <vxe-column field="cashUnitPrice" title="现金单价" width="100" />
                    <vxe-column field="frozenAmount" title="冻结金额" width="100" /> -->
                  </vxe-table>
                  <el-pagination
                    style="float: right; padding-top: 16px;"
                    :current-page.sync="djPagination.current"
                    :page-size="djPagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    background
                    layout="total, prev, pager, next, sizes, jumper"
                    :total="djPagination.total"
                    @size-change="djPageSizeChange"
                    @current-change="djCurrentPageChange"
                  />
                </div>
              </div>
            </section>
          </el-main>
          <el-footer height="60px" v-if="!_id">
            <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
            <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
            <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
            <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
          </el-footer>
        </el-container>
      </div>
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, accountFlowPage, frozenPage } from '@/api/sparepart/fund/account/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import { getEnum, getSparePartOrderIdByCode, exportTable } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { handleCommonExport, downloadExcel, generateTitleMap } from '@/libs/utils';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  companyCode: '',
  companyName: '',
  bankName: '',
  bankAccountHolder: '',
  bankAccount: '',
  availableAmount: '',
  frozenAmount: '',
  marginAmount: '',
  totalAmount: '',
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
  accountType: '',
};

export default {
  name: 'accountEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    titleMap () {
      return generateTitleMap(this.columnConfigs);
    },
    titleMapDj () {
      return generateTitleMap(this.columnConfigsDj);
    },
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件现金账户',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-account',
      isEditing: false,
      loading: false,
      submitLoading: false,
      exportLoading: false,
      exportDjLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      djPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      djTableData: [],
      tableData: [],
      columnConfigs: [
        { field: 'code', title: '交易流水号', width: 200 },
        { field: 'transactionAmount', title: '交易金额', width: 100 },
        { field: 'transactionTypeLabel', title: '交易类型', width: 100 },
        { field: 'accountBalance', title: '账户余额', width: 100 },
        { field: 'remark', title: '备注', width: 200 },
        { field: 'sapFlowNo', title: 'SAP流水号', width: 200 },
        { field: 'dealerCode', title: '门店编码', width: 150 },
        { field: 'dealerName', title: '门店名称', width: 200 },
        { field: 'businessTypeLabel', title: '业务类型', width: 150 },
        { field: 'businessNo', title: '业务单号', width: 200 },
        { field: 'taxInvoiceNo', title: '税务发票号', width: 200 },
        { field: 'invoiceDate', title: '开票日期', width: 150 },
        { field: 'postingTime', title: '入账时间', width: 180 }
      ],
      columnConfigsDj: [
        { field: 'businessTypeLabel', title: '业务类型', width: '11%' },
        { field: 'businessNo', title: '业务单号', width: '14%' },
        { field: 'dealerCode', title: '门店编码', width: '11%' },
        { field: 'dealerName', title: '门店名称', width: '11%' },
        { field: 'partCode', title: '零件/商品编码', width: '11%' },
        { field: 'partName', title: '零件/商品名称', width: '11%' },
        { field: 'frozenQty', title: '冻结数量', width: '10%' },
        { field: 'cashUnitPrice', title: '现金单价', width: '10%' },
        { field: 'frozenAmount', title: '冻结金额', width: '10%' }
      ]
    };
  },
  mounted () {
    this.getDetailData();
    this.getAccountFlow();
    this.getFrozenPage();
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleCancel () {
      this.$refs.ruleForm.clearValidate();
      this.isEditing = false;
    },
    handleEdit () {
      this.isEditing = true;
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件现金账户', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    // 账户流水
    async getAccountFlow () {
      const params = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        accountId: this.$route.query.id
      };
      const res = await accountFlowPage(params);
      this.tableData = res.records || [];
      this.pagination.total = res.total;
    },
    // 冻结账户流水
    async getFrozenPage () {
      const params = {
        pageNum: this.djPagination.current,
        pageSize: this.djPagination.pageSize,
        accountId: this.$route.query.id
      };
      const res = await frozenPage(params);
      this.djTableData = res.records || [];
      this.djPagination.total = res.total;
    },
    pageSizeChange (pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.current = 1;
      this.getAccountFlow();
    },
    currentPageChange (current) {
      this.pagination.current = current;
      this.getAccountFlow();
    },
    djPageSizeChange (pageSize) {
      this.djPagination.pageSize = pageSize;
      this.djPagination.current = 1;
      this.getFrozenPage();
    },
    djCurrentPageChange (current) {
      this.djPagination.current = current;
      this.getFrozenPage();
    },
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
            addOrUpdate({ ...this.form, customKey: tableData }).then(res => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              const id = res;
              if (rest || !id) {
                this.resetForm(formName);
              } else {
                if (this.form.id) {
                  this.getDetailData();
                } else {
                  this.$router.push({
                    path: '/sparepart/fund/account/edit',
                    query: {
                      id
                    }
                  });
                }
              }
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
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
    handleJumpAuditLog () {
      this.$auditLog.show({ id: this.form.id });
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async handleFlowJump (row) {
      let path = '';
      let type = '';
      if (row.businessType === 'SPARE_PART_RETURN') {
        path = '/sparepart/return/returnOrder/edit';
        type = 'returnOrder';
      } else if (row.businessType === 'SPARE_PART_PURCHASE') {
        path = '/sparepart/warehouse/oemOutboundOrder/edit';
        type = 'oemOutboundOrder';
      } else {
        return;
      }
      const res = await getSparePartOrderIdByCode({ code: row.businessNo, type: type });
      this.$router.push({
        path: path,
        query: {
          id: res
        }
      });
    },
    // 业务单号跳转
    async handleJump (row) {
      let path = '';
      let type = '';
      if (row.businessTypeLabel === '备件采购（不含缺货）') {
        path = '/sparepart/purchase/purchaseApply/edit';
        type = 'purchaseApply';
      } else if (row.businessTypeLabel === '备件采购（缺货）') {
        path = '/sparepart/purchase/backOrder/edit';
        type = 'backOrder';
      } else {
        return;
      }
      const res = await getSparePartOrderIdByCode({ code: row.businessNo, type: type });
      this.$router.push({
        path: path,
        query: {
          id: res
        }
      });
    },
    // 带出方法
    _executeExport (config) {
      const {
        paginationKey, // 分页数据所在的 key
        loadingKey, // loading 状态所在的 key
        path, // 接口路径
        titleMap, // 表头映射
        fileNameSuffix = '' // 文件名后缀（可选）
      } = config;

      handleCommonExport({
      // 1. 动态获取参数 (使用 this[paginationKey] 访问)
        exportApiParamsFn: () => ({
          pageNum: this[paginationKey].current,
          pageSize: this[paginationKey].pageSize,
          accountId: this.$route.query.id
        }),

        // 2. 基础配置 (固定部分)
        apiFunc: exportTable,
        download: downloadExcel,
        message: this.$message,
        // 动态生成文件名：原名 + 后缀
        fileName: `${this.$route.query.name || '导出数据'}${fileNameSuffix}`,
        titleMap: titleMap,
        dataFetchPath: path,
        businessType: this.$route.query.name,
        httpMethod: 'POST',

        // 3. 动态控制 Loading (使用 this[loadingKey] 访问)
        onStart: () => {
          this[loadingKey] = true;
        },
        onEnd: () => {
          this[loadingKey] = false;
        }
      });
    },
    // 导出账户流水
    handleExport () {
      this._executeExport({
        paginationKey: 'pagination',
        loadingKey: 'exportLoading',
        path: 'sp/web/fund/accountFlow/page',
        titleMap: this.titleMap
      // fileNameSuffix 默认为空，即 "导出数据.xlsx"
      });
    },

    // 导出冻结流水
    handleDjExport () {
      this._executeExport({
        paginationKey: 'djPagination',
        loadingKey: 'exportDjLoading',
        path: 'sp/web/fund/accountFlow/frozenPage',
        titleMap: this.titleMapDj,
        fileNameSuffix: '_冻结' // 可选：区分文件名，如 "导出数据_冻结.xlsx"
      });
    }
    // 导出账户流水
    // handleExport () {
    //   this.exportLoading = true;
    //   const params = {
    //     pageNum: this.pagination.current,
    //     pageSize: this.pagination.pageSize,
    //     accountId: this.$route.query.id
    //   };
    //   exportTable({
    //     businessType: this.$route.query.name,
    //     dataFetchPath: 'sparepart/web/fund/accountFlow/page',
    //     reqParams: params,
    //     titleMap: this.titleMap,
    //     httpMethod: 'POST'
    //   }).then(async res => {
    //     if (res && res.excelUrl) {
    //       try {
    //         await downloadExcel(res.excelUrl, this.$route.query.name + '.xlsx');
    //       } catch (error) {
    //         this.$message({
    //           type: 'error',
    //           message: '文件导出失败'
    //         });
    //       }
    //     } else {
    //       this.$message({
    //         type: 'info',
    //         message: '请前往导出列表中查询导出结果'
    //       });
    //     }
    //   }).finally(() => {
    //     this.exportLoading = false;
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }
</style>
