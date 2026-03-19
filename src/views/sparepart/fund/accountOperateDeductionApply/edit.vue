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
          :showEditBtn="routeType"
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
                  <el-form-item label="充值流水：" prop="flowNo">
                    {{ form.flowNo }}
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    <fetch-select :remote-method="getDealerList" remote v-model="form.dealerCode" placeholder="请输入门店编码或名称"
                      labelKey="orgCode" valueKey="orgCode" subLabelKey="orgName" clearable filterable :disabled="isEditing"
                      @change="handleDealerChange" />
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="公司编码：" prop="companyCode">
                    {{ form.companyCode }}
                  </el-form-item>
                  <el-form-item label="公司名称：" prop="companyName">
                    {{ form.companyName }}
                  </el-form-item>
                  <el-form-item :label="$route.query.type === 'RECHARGE' ? '充值账户：' : '返利账户：'" prop="accountCode">
                    {{ form.accountCode }}
                  </el-form-item>
                  <el-form-item label="交易金额：" prop="transactionAmount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.transactionAmount"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="费用类别：" prop="expenseCategory">
                    <el-input
                      placeholder="请输入"
                      v-model="form.expenseCategory"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="预算归口：" prop="budgetCenter">
                    <el-input
                      placeholder="请输入"
                      v-model="form.budgetCenter"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="流程审批号：" prop="approvalProcessNo">
                    <el-input
                      placeholder="请输入"
                      v-model="form.approvalProcessNo"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="审批状态：" prop="approvalStatus">
                    {{ form.approvalStatusLabel }}
                  </el-form-item>
                  <el-form-item label="提交人：" prop="submitter">
                    {{ form.submitterName }}
                  </el-form-item>
                  <el-form-item label="提交时间：" prop="submitTime">
                    {{ form.submitTime }}
                  </el-form-item>
                  <el-form-item :label="$route.query.type === 'RECHARGE' ? '充值说明：' : '返利说明：'" prop="rechargeDescription">
                    {{ form.rechargeDescription }}
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
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="充值流水：" prop="flowNo">
                    {{ form.flowNo }}
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    {{ form.dealerCode }}
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="公司编码：" prop="companyCode">
                    {{ form.companyCode }}
                  </el-form-item>
                  <el-form-item label="公司名称：" prop="companyName">
                    {{ form.companyName }}
                  </el-form-item>
                  <el-form-item :label="$route.query.type === 'RECHARGE' ? '充值账户：' : '返利账户：'" prop="accountCode">
                    {{ form.accountCode }}
                  </el-form-item>
                  <el-form-item label="交易金额：" prop="transactionAmount">
                    {{ form.transactionAmount }}
                  </el-form-item>
                  <el-form-item label="费用类别：" prop="expenseCategory">
                    {{ form.expenseCategory }}
                  </el-form-item>
                  <el-form-item label="预算归口：" prop="budgetCenter">
                    {{ form.budgetCenter }}
                  </el-form-item>
                  <el-form-item label="流程审批号：" prop="approvalProcessNo">
                    {{ form.approvalProcessNo }}
                  </el-form-item>
                  <el-form-item label="审批状态：" prop="approvalStatus">
                    {{ form.approvalStatusLabel }}
                  </el-form-item>
                  <el-form-item label="提交人：" prop="submitter">
                    {{ form.submitterName }}
                  </el-form-item>
                  <el-form-item label="提交时间：" prop="submitTime">
                    {{ form.submitTime }}
                  </el-form-item>
                  <el-form-item :label="$route.query.type === 'RECHARGE' ? '充值说明：' : '返利说明：'" prop="rechargeDescription">
                    {{ form.rechargeDescription }}
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
                </el-form>
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
import { getDetail, addOrUpdate } from '@/api/sparepart/fund/accountOperateApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam, listWarehouse, getPartDealer, getLoginUser } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  accountCode: '',
  companyCode: '',
  companyName: '',
  flowNo: '',
  dataSource: '',
  dealerCode: '',
  dealerName: '',
  approvalStatus: '',
  expenseCategory: '',
  budgetCenter: '',
  approvalProcessNo: '',
  submitter: '',
  submitTime: '',
  transactionAmount: '',
  rechargeDescription: '',
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
  operateType: 'DEDUCTION',
  accountId: '',
  approver: '',
  approvalTime: '',
  approvalDescription: '',
  archiveTime: '',
};

export default {
  name: 'accountOperateApplyEdit',
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
    '$route.query.type': {
      handler (val) {
        if (val) {
          this.routeType = true;
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: this.$route.query.type === 'RECHARGE' ? '备件返利充值管理' : '备件返利扣款管理',
      pageType: 'edit',
      title: '账户编号：' + form.accountCode,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-accountOperateDeductionApply',
      routeType: false,
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
        accountCode: [
          { required: true, message: '请输入账户编号', trigger: 'change' }
        ],
        companyCode: [
          { required: true, message: '请输入公司编码', trigger: 'change' }
        ],
        companyName: [
          { required: false, message: '请输入公司名称', trigger: 'change' }
        ],
        flowNo: [
          { required: false, message: '请输入流水no', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: false, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        approvalStatus: [
          { required: false, message: '请选择审批状态:草稿,待审批,审批通过,已驳回', trigger: 'change' }
        ],
        expenseCategory: [
          { required: false, message: '请输入费用类别', trigger: 'change' }
        ],
        budgetCenter: [
          { required: false, message: '请输入预算归口', trigger: 'change' }
        ],
        approvalProcessNo: [
          { required: false, message: '请输入流程审批号', trigger: 'change' }
        ],
        submitter: [
          { required: false, message: '请输入提交人', trigger: 'change' }
        ],
        submitTime: [
          { required: false, message: '请选择提交时间', trigger: 'change' }
        ],
        transactionAmount: [
          { required: true, message: '请输入交易金额', trigger: 'change' }
        ],
        rechargeDescription: [
          { required: false, message: '请输入充值、扣款说明', trigger: 'change' }
        ],
        createTime: [
          { required: false, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: false, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: false, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: false, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: false, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: false, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: false, message: '请输入修改者名称', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        operateType: [
          { required: false, message: '请选择操作类型:充值,扣款', trigger: 'change' }
        ],
        accountId: [
          { required: false, message: '请输入备件账户ID', trigger: 'change' }
        ],
        approver: [
          { required: false, message: '请输入审批人', trigger: 'change' }
        ],
        approvalTime: [
          { required: false, message: '请选择审批时间', trigger: 'change' }
        ],
        approvalDescription: [
          { required: false, message: '请输入审批说明', trigger: 'change' }
        ],
        archiveTime: [
          { required: false, message: '请选择归档时间', trigger: 'change' }
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
      return addOrUpdate({ ...this.form, operateType: 'DEDUCTION' });
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
    // 点击带出门店名称
    handleDealerChange (val, ele) {
      this.form.dealerName = ele.orgName;
      this.getPartDealer(ele.orgCode);
    },
    async getPartDealer (query) {
      try {
        const res = await getPartDealer({ code: query });
        this.form.companyCode = res.parentCompanyCode;
        this.form.companyName = res.parentCompanyName;
        if (this.$route.query.type === 'RECHARGE') {
          this.form.accountCode = res.cashAccountCode;
        } else {
          this.form.accountCode = res.rebateAccountCode;
        }
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
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
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
