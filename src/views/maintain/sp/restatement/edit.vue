<template>
  <edit-page-layout ref="editLayout" title="反结算申请单" showPaneFooter>
    <template #left>
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
         <div class="common-sub-title">
          <span>审核状态：{{ form.approvalStatusLabel || '-' }}</span>
          <i>|</i>
          <span>创建时间：{{ form.createTime || '-' }}</span>
        </div>
        <template #extraButtons>
          <el-button size="small" @click="handleAudit" v-if="form.approvalStatus === 20 && permissions.has('AISMC-restatement-audit')">审核</el-button>
          <el-button size="small" @click="handleFinalAudit" v-if="form.approvalStatus === 30 && permissions.has('AISMC-restatement-financialReview')">财务审核</el-button>
          <el-button
            v-if="form.approvalStatus === 10 && permissions.has('AISMC-restatement-submitAudit')"
            size="small"
            type="primary"
            @click="handleAuditSubmit"
          >
            提交审核
          </el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="反结算申请单号：" required>
                  <el-input v-model="form.code" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="结算单号：" required>
                  <el-link type="success" @click.prevent="goToStatementDetail">{{ form.statementCode || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="结算单类型：" required>
                  <el-input v-model="form.statementTypeLabel" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="施工单号：" required>
                  <el-link type="success" @click.prevent="goToServiceProxyDetail">{{ form.serviceProxyCode || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="销账标识：" required>
                  <el-input v-model="form.accountTypeLabel" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="结算人员：" required>
                  <el-input v-model="form.statementPersonName" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="厅店：" required>
                  <el-link type="success" @click.prevent="goToDealerDetail">{{ form.dealerName || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="结算单状态：" required>
                  <el-input v-model="form.statementStatusLabel" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="结算时间：" required>
                  <el-input v-model="form.statementTime" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="总金额：" required>
                  <el-input v-model="form.totalAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="维修项目金额：" required>
                  <el-input v-model="form.repairItemAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="收款人：">
                  <el-input v-model="form.payee" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="优惠总金额：" required>
                  <el-input v-model="form.discountAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="维修项目优惠金额：" required>
                  <el-input v-model="form.repairItemDiscount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="收款时间：">
                  <el-input v-model="form.receiveAt" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="去零金额：" required>
                  <el-input v-model="form.noFractionAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="维修项目应付金额：" required>
                  <el-input v-model="form.repairItemPayableAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="数据来源：" required>
                  <el-input v-model="form.dataSourceLabel" disabled placeholder="请输入" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="form" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="实际应付总金额：" required>
                  <el-input v-model="form.payableAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="零件金额：" required>
                  <el-input v-model="form.partAmount" disabled placeholder="请输入" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="form" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="剩余应付款金额：" required>
                  <el-input v-model="form.remainAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="零件优惠金额：" required>
                  <el-input v-model="form.partDiscount" disabled placeholder="请输入" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="form" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="零件应付金额：" required>
                  <el-input v-model="form.partPayableAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="权益金额：" required>
                  <el-input v-model="form.rightsAmount" disabled placeholder="请输入" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" :model="form"  :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="原因说明：" prop="reason" class="form-item-full">
                  <el-input
                    v-model="form.reason"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入原因说明"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="反结算申请单号：">
                  {{ form.code || '-' }}
                </el-form-item>
                <el-form-item label="结算单号：">
                  <el-link type="success" @click.prevent="goToStatementDetail">{{ form.statementCode || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="结算单类型：">
                  {{ form.statementTypeLabel || '-' }}
                </el-form-item>
                <el-form-item label="施工单号：">
                  <el-link type="success" @click.prevent="goToServiceProxyDetail">{{ form.serviceProxyCode || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="销账标识：">
                  {{ form.accountTypeLabel || '-' }}
                </el-form-item>
                <el-form-item label="结算人员：">
                  {{ form.statementPersonName || '-' }}
                </el-form-item>
                <el-form-item label="厅店：">
                  <el-link type="success" @click.prevent="goToDealerDetail">{{ form.dealerName || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="结算单状态：">
                  {{ form.statementStatusLabel || '-' }}
                </el-form-item>
                <el-form-item label="结算时间：">
                  {{ form.statementTime || '-' }}
                </el-form-item>
                <el-form-item label="总金额：">
                  {{ form.totalAmount || '-' }}
                </el-form-item>
                <el-form-item label="维修项目金额：">
                  {{ form.repairItemAmount || '-' }}
                </el-form-item>
                <el-form-item label="收款人：">
                  {{ form.payee || '-' }}
                </el-form-item>
                <el-form-item label="优惠总金额：">
                  {{ form.discountAmount || '-' }}
                </el-form-item>
                <el-form-item label="维修项目优惠金额：">
                  {{ form.repairItemDiscount || '-' }}
                </el-form-item>
                <el-form-item label="收款时间：">
                  {{ form.receiveAt || '-' }}
                </el-form-item>
                <el-form-item label="去零金额：">
                  {{ form.noFractionAmount || '-' }}
                </el-form-item>
                <el-form-item label="维修项目应付金额：">
                  {{ form.repairItemPayableAmount || '-' }}
                </el-form-item>
                <el-form-item label="数据来源：">
                  {{ form.dataSourceLabel || '-' }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="实际应付总金额：">
                  {{ form.payableAmount || '-' }}
                </el-form-item>
                <el-form-item label="零件金额：">
                  {{ form.partAmount || '-' }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="剩余应付款金额：">
                  {{ form.remainAmount || '-' }}
                </el-form-item>
                <el-form-item label="零件优惠金额：">
                  {{ form.partDiscount || '-' }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="零件应付金额：">
                  {{ form.partPayableAmount || '-' }}
                </el-form-item>
                <el-form-item label="权益金额：">
                  {{ form.rightsAmount || '-' }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="原因说明：" class="form-item-full">
                  {{ form.reason || '-' }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <section class="common-section audit-section">
            <div class="common-section-header">
              <h2>审核记录</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="auditTableRef"
                  stripe
                  :data="form.supportApprovalResps"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="creatorName" title="审核人" min-width="150px" />
                  <vxe-column field="approvalOn" title="审核时间" min-width="180px" />
                  <vxe-column field="approvalResult" title="审核动作" min-width="120px" />
                  <vxe-column field="remark" title="审核状态" min-width="120px" />
                  <vxe-column field="content" title="审核意见" min-width="200px" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">暂无审核记录</div>
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
    <!-- 审核弹窗 -->
    <el-dialog
      :visible.sync="auditDialogVisible"
      title="反结算申请审核"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="auditForm" :rules="auditRules" ref="auditFormRef" label-width="100px" label-position="right">
        <el-form-item label="审核操作" prop="auditAction" required>
          <el-select v-model="auditForm.auditAction" placeholder="请选择" style="width: 100%" @change="handleAuditActionChange">
            <el-option label="同意" :value="1" />
            <el-option label="拒绝" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditOpinion" :required="auditForm.auditAction == 2">
          <el-input
            v-model="auditForm.auditOpinion"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="auditDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleAuditConfirm" :loading="auditLoading">确定</el-button>
      </span>
    </el-dialog>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, audit, submitAudit, financialReview } from '@/api/maintain/sp/restatement/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  statementCode: '',
  statementTypeLabel: '',
  serviceProxyCode: '',
  accountTypeLabel: '',
  dataSourceLabel: '',
  dealerName: '',
  statementStatusLabel: '',
  totalAmount: '',
  repairItemAmount: '',
  statementPersonName: '',
  noFractionAmount: '',
  repairItemDiscount: '',
  statementTime: '',
  rightsAmount: '',
  repairItemPayableAmount: '',
  payee: '',
  discountAmount: '',
  partAmount: '',
  receiveAt: '',
  payableAmount: '',
  partDiscount: '',
  remainAmount: '',
  partPayableAmount: '',
  reason: '',
  statementId: '',
  serviceProxyId: '',
  dealerCode: ''
};

export default {
  name: 'RestatementEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return `反结算申请单编号：${this.form.code}`;
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
      pageTitle: '反结算申请单管理',
      pageType: 'edit',
      moduleKey: 'AISMC-restatement',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        reason: [
          { max: 500, message: '原因说明最多输入 500 字', trigger: 'blur' }
        ]
      },
      auditDialogVisible: false,
      auditForm: {
        auditAction: '',
        auditOpinion: ''
      },
      auditRules: {
        auditAction: [
          { required: true, message: '请选择审核操作', trigger: 'change' }
        ],
        auditOpinion: [
          {
            validator: (rule, value, callback) => {
              if (this.auditForm.auditAction === 2 && !value) {
                callback(new Error('请输入审核意见'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
      },
      auditLoading: false,
      currentAuditType: ''
    };
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
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleAudit () {
      this.currentAuditType = 'audit';
      this.auditDialogVisible = true;
      this.auditForm = {
        auditAction: '',
        auditOpinion: ''
      };
      this.$nextTick(() => {
        if (this.$refs.auditFormRef) {
          this.$refs.auditFormRef.clearValidate();
        }
      });
    },
    handleFinalAudit () {
      this.currentAuditType = 'financialReview';
      this.auditDialogVisible = true;
      this.auditForm = {
        auditAction: '',
        auditOpinion: ''
      };
      this.$nextTick(() => {
        if (this.$refs.auditFormRef) {
          this.$refs.auditFormRef.clearValidate();
        }
      });
    },
    handleAuditActionChange (value) {
      this.$nextTick(() => {
        if (this.$refs.auditFormRef) {
          if (value === 1) {
            this.$refs.auditFormRef.clearValidate('auditOpinion');
          } else {
            this.$refs.auditFormRef.validateField('auditOpinion');
          }
        }
      });
    },
    handleAuditConfirm () {
      this.$refs.auditFormRef.validate((valid) => {
        if (!valid) {
          return;
        }

        this.auditLoading = true;
        const apiFunc = this.currentAuditType === 'audit' ? audit : financialReview;

        apiFunc({
          id: this._id,
          auditStatus: this.auditForm.auditAction,
          auditDesc: this.auditForm.auditOpinion
        }).then(() => {
          this.$message.success('审核成功');
          this.auditDialogVisible = false;
          this.$refs.containerRef.loadDetail();
        }).catch((error) => {
          console.error('审核失败:', error);
          this.$message.error(error.msg || '审核失败');
        }).finally(() => {
          this.auditLoading = false;
        });
      });
    },
    async handleAuditSubmit () {
      this.$confirm('是否确定要提交审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          this.submitLoading = true;
          await submitAudit(this._id);
          this.$message.success('提交审核成功');
          this.$refs.containerRef.loadDetail();
        } catch (error) {
          console.error('提交审核失败:', error);
          this.$message.error(error.msg || '提交审核失败');
        } finally {
          this.submitLoading = false;
        }
      }).catch(() => {
        this.$message.info('已取消提交审核');
      });
    },
    goToStatementDetail () {
      if (this.form.statementId) {
        this.$router.push({
          path: '/maintain/sp/serviceStatement/edit',
          query: { id: this.form.statementId }
        });
      } else {
        this.$message.warning('未找到结算单 ID');
      }
    },
    goToServiceProxyDetail () {
      if (this.form.serviceProxyId) {
        this.$router.push({
          path: '/maintain/sp/serviceProxy/edit',
          query: { id: this.form.serviceProxyId }
        });
      } else {
        this.$message.warning('未找到施工单 ID');
      }
    },
    goToDealerDetail () {
      if (this.form.dealerCode) {
        window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${this.form.dealerCode}`, '_blank');
      } else {
        this.$message.warning('未找到厅店信息');
      }
    },
    getDefautlForm () {
      return { ...defaultForm };
    },
    handleShowLog () {
      this.$auditLog.show({ id: this._id });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
