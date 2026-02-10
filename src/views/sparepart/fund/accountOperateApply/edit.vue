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
                <el-form-item label="账户编号：" prop="accountCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.accountCode"
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
                <el-form-item label="流水no：" prop="flowNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.flowNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
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
                <el-form-item label="审批状态:草稿,待审批,审批通过,已驳回：" prop="approvalStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.approvalStatus"
                    placeholder="请选择"
                    clearable
                    filterable
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
                <el-form-item label="提交人：" prop="submitter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.submitter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.submitTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="交易金额：" prop="transactionAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transactionAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="充值、扣款说明：" prop="rechargeDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rechargeDescription"
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
                <el-form-item label="操作类型:充值,扣款：" prop="operateType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.operateType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备件账户ID：" prop="accountId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.accountId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approver"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.approvalTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approvalDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="归档时间：" prop="archiveTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.archiveTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="账户编号：" prop="accountCode">
                  {{ form.accountCode }}
                </el-form-item>
                <el-form-item label="公司编码：" prop="companyCode">
                  {{ form.companyCode }}
                </el-form-item>
                <el-form-item label="公司名称：" prop="companyName">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="流水no：" prop="flowNo">
                  {{ form.flowNo }}
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="门店编码（组织code）：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称（组织名称）：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="审批状态:草稿,待审批,审批通过,已驳回：" prop="approvalStatus">
                  {{ form.approvalStatus }}
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
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="交易金额：" prop="transactionAmount">
                  {{ form.transactionAmount }}
                </el-form-item>
                <el-form-item label="充值、扣款说明：" prop="rechargeDescription">
                  {{ form.rechargeDescription }}
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
                <el-form-item label="操作类型:充值,扣款：" prop="operateType">
                  {{ form.operateType }}
                </el-form-item>
                <el-form-item label="备件账户ID：" prop="accountId">
                  {{ form.accountId }}
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  {{ form.approver }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="归档时间：" prop="archiveTime">
                  {{ form.archiveTime }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/fund/accountOperateApply/index';
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
  operateType: '',
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
      pageTitle: '备件返利充值管理',
      pageType: 'edit',
      title: '账户编号：' + form.accountCode,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-accountOperateApply',
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
          { required: true, message: '请输入公司名称', trigger: 'change' }
        ],
        flowNo: [
          { required: true, message: '请输入流水no', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        approvalStatus: [
          { required: true, message: '请选择审批状态:草稿,待审批,审批通过,已驳回', trigger: 'change' }
        ],
        expenseCategory: [
          { required: true, message: '请输入费用类别', trigger: 'change' }
        ],
        budgetCenter: [
          { required: true, message: '请输入预算归口', trigger: 'change' }
        ],
        approvalProcessNo: [
          { required: true, message: '请输入流程审批号', trigger: 'change' }
        ],
        submitter: [
          { required: true, message: '请输入提交人', trigger: 'change' }
        ],
        submitTime: [
          { required: true, message: '请选择提交时间', trigger: 'change' }
        ],
        transactionAmount: [
          { required: true, message: '请输入交易金额', trigger: 'change' }
        ],
        rechargeDescription: [
          { required: true, message: '请输入充值、扣款说明', trigger: 'change' }
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
        operateType: [
          { required: true, message: '请选择操作类型:充值,扣款', trigger: 'change' }
        ],
        accountId: [
          { required: true, message: '请输入备件账户ID', trigger: 'change' }
        ],
        approver: [
          { required: true, message: '请输入审批人', trigger: 'change' }
        ],
        approvalTime: [
          { required: true, message: '请选择审批时间', trigger: 'change' }
        ],
        approvalDescription: [
          { required: true, message: '请输入审批说明', trigger: 'change' }
        ],
        archiveTime: [
          { required: true, message: '请选择归档时间', trigger: 'change' }
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
