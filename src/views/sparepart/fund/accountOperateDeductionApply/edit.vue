<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest"
        :showEditBtn="routeType">
        <template #extraButtons>
          <el-button v-if="showSubmitBtn" size="small" plain :loading="submitBtnLoading" @click="handleSubmit">提交</el-button>
          <el-button v-if="showAgreeBtn" size="small" plain :loading="agreeBtnLoading" @click="handleAgree">通过</el-button>
          <el-button v-if="showRejectBtn" size="small" plain :loading="rejectBtnLoading" @click="handleReject">驳回</el-button>
        </template>
        <el-main>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="充值流水：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <fetch-select :remote-method="getDealerList" remote v-model="form.dealerCode" placeholder="请输入门店编码或名称"
                    labelKey="orgCode" valueKey="orgCode" subLabelKey="orgName" clearable filterable
                    :disabled="isEditing" @change="handleDealerChange" />
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
                <el-form-item label="返利账户：" prop="accountCode">
                  {{ form.accountCode }}
                </el-form-item>
                <el-form-item label="交易金额：" prop="transactionAmount">
                  <el-input placeholder="请输入" v-model="form.transactionAmount" clearable />
                </el-form-item>
                <el-form-item label="费用类别：" prop="expenseCategory">
                  <el-input placeholder="请输入" v-model="form.expenseCategory" clearable />
                </el-form-item>
                <el-form-item label="预算归口：" prop="budgetCenter">
                  <el-input placeholder="请输入" v-model="form.budgetCenter" clearable />
                </el-form-item>
                <el-form-item label="流程审批号：" prop="approvalProcessNo">
                  <el-input placeholder="请输入" v-model="form.approvalProcessNo" clearable />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>提交&审批</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="审批状态：" prop="approvalStatus">
                  {{ form.approvalStatusLabel }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="'返利说明：" prop="rechargeDescription">
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
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="充值流水：" prop="flowNo">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/datacenter/store/store/detail?storeCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
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
                <el-form-item label="返利账户：" prop="accountCode">
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
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>提交&审批</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="审批状态：" prop="approvalStatus">
                  {{ form.approvalStatusLabel }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="返利说明：" prop="rechargeDescription">
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
import { getDetail, addOrUpdate, getCommit, getAgree, getReject } from '@/api/sparepart/fund/accountOperateApply/index';
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
    },
    showSubmitBtn () {
      return (this.form.approvalStatus === '10' || this.form.approvalStatus === '40') && this.permissions.has('AISPART-accountOperateDeductionApply-commit');
    },
    showAgreeBtn () {
      return this.form.approvalStatus === '20' && this.permissions.has('AISPART-accountOperateDeductionApply-agree');
    },
    showRejectBtn () {
      return this.form.approvalStatus === '20' && this.permissions.has('AISPART-accountOperateDeductionApply-reject');
    },
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
          if (this.form.approvalStatus === '10' || this.form.approvalStatus === '40') {
            this.routeType = true;
          }
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件返利扣款管理',
      pageType: 'edit',
      title: '账户编号：' + form.accountCode,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-accountOperateDeductionApply',
      routeType: false,
      loading: false,
      submitLoading: false,
      submitBtnLoading: false,
      agreeBtnLoading: false,
      rejectBtnLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        transactionAmount: [
          { required: true, message: '请输入返利金额', trigger: 'blur' }
        ],
        expenseCategory: [
          { required: true, message: '请选择费用类别', trigger: 'blur' }
        ],
        budgetCenter: [
          { required: true, message: '请选择预算归口', trigger: 'blur' }
        ],
        approvalProcessNo: [
          { required: true, message: '请输入流程审批号', trigger: 'blur' }
        ]
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
        this.form.accountCode = res.rebateAccountCode;
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
    },
    // 提交
    handleSubmit () {
      this.submitBtnLoading = true;
      this.$prompt('请输入扣款说明', '提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: ''
      }).then((reason) => {
        if (!reason.value) {
          this.$message({ type: 'error', message: '请输入扣款说明!' });
          return;
        }
        getCommit({ id: this._id, description: reason.value }).then(() => {
          this.$message({ type: 'success', message: '提交成功!' });
          this.$refs.containerRef.loadDetail();
        }).catch(() => {
          this.$message({ type: 'error', message: '提交失败!' });
        });
      }).catch(() => {}).finally(() => {
        this.submitBtnLoading = false;
      });
    },
    // 通过
    handleAgree () {
      this.$confirm('确定通过吗？', '提示', { type: 'warning' }).then(() => {
        this.agreeBtnLoading = true;
        return getAgree({ id: this._id });
      }).then(() => {
        this.$message({ type: 'success', message: '通过成功!' });
        this.$refs.containerRef.loadDetail();
      }).catch(err => {
        if (err !== 'cancel') {
          this.$message({ type: 'error', message: '操作失败' });
        }
      }).finally(() => {
        this.agreeBtnLoading = false;
      });
    },
    // 驳回
    handleReject () {
      this.rejectBtnLoading = true;
      this.$prompt('请输入审批说明！', '提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: ''
      }).then((reason) => {
        return getReject({ id: this._id, description: reason.value });
      }).then(() => {
        this.$message({ type: 'success', message: '提交成功!' });
        this.$refs.containerRef.loadDetail();
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.rejectBtnLoading = false;
      });
    },
  }
};
</script>
