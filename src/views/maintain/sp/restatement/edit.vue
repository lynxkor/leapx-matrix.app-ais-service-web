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
        <template #status>
          <div class="status-section">
            <h2>反结算申请单编号：{{ form.code }}</h2>
            <div class="status-item">
              <span class="label">审核状态</span>
              <span class="value">{{ form.approvalStatusLabel || '-' }}</span>
            </div>
            <div class="status-item">
              <span class="label">创建时间</span>
              <span class="value">{{ form.createTime || '-' }}</span>
            </div>
          </div>
        </template>
        <template #extraButtons>

          <el-button size="small" @click="handleAudit" v-if="form.approvalStatus === 20">审核</el-button>
          <el-button size="small" @click="handleFinalAudit" v-if="form.approvalStatus === 30">财务审核</el-button>
          <el-button
            v-if="form.approvalStatus === 10"
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="反结算申请单号:" required>
                  <el-input v-model="form.code" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="结算单号:" required>
                  <el-link type="success" @click.prevent="goToStatementDetail">{{ form.statementCode || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="结算单类型:" required>
                  <el-input v-model="form.statementTypeLabel" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="施工单号:" required>
                  <el-link type="success" @click.prevent="goToServiceProxyDetail">{{ form.serviceProxyCode || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="销账标识:" required>
                  <el-input v-model="form.accountTypeLabel" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="数据来源:" required>
                  <el-input v-model="form.dataSourceLabel" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="厅店:" required>
                  <el-link type="success" @click.prevent="goToDealerDetail">{{ form.dealerName || '-' }}</el-link>
                </el-form-item>
                <el-form-item label="结算单状态:" required>
                  <el-input v-model="form.statementStatusLabel" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="总金额:" required>
                  <el-input v-model="form.totalAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="维修项目金额:" required>
                  <el-input v-model="form.repairItemAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="结算人员:" required>
                  <el-input v-model="form.statementPersonName" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="去零金额:" required>
                  <el-input v-model="form.noFractionAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="维修项目优惠金额:" required>
                  <el-input v-model="form.repairItemDiscount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="结算时间:" required>
                  <el-input v-model="form.statementTime" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="权益金额:" required>
                  <el-input v-model="form.rightsAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="维修项目应付金额:" required>
                  <el-input v-model="form.repairItemPayableAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="收款人:">
                  <el-input v-model="form.payeeName" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="优惠总金额:" required>
                  <el-input v-model="form.discountAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="零件金额:" required>
                  <el-input v-model="form.partAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="收款时间:">
                  <el-input v-model="form.receiveAt" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="实际应付总金额:" required>
                  <el-input v-model="form.payableAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="零件优惠金额:" required>
                  <el-input v-model="form.partDiscount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="剩余应付款金额:" required>
                  <el-input v-model="form.remainAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="零件应付金额:" required>
                  <el-input v-model="form.partPayableAmount" disabled placeholder="请输入" />
                </el-form-item>
                <el-form-item label="原因说明:" prop="reason">
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
            </div>
          </section>

          <section class="common-section audit-section">
            <div class="common-section-header">
              <h2>审核记录</h2>
            </div>
            <div class="common-section-body">
              <el-table :data="form.supportApprovalResps" style="width: 100%" border>
                <el-table-column prop="creatorName" label="审核人" width="150" />
                <el-table-column prop="approvalOn" label="审核时间" width="180" />
                <el-table-column prop="approvalResult" label="审核动作" width="120" />
                <el-table-column prop="statusDesc" label="审核状态" width="120" />
                <el-table-column prop="content" label="审核意见" show-overflow-tooltip />
              </el-table>

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
      <el-form :model="auditForm" :rules="auditRules" ref="auditFormRef" label-width="100px" label-position="left">
        <el-form-item label="审核操作" prop="auditAction" required>
          <el-select v-model="auditForm.auditAction" placeholder="请选择" style="width: 100%" @change="handleAuditActionChange">
            <el-option label="同意" value=1 />
            <el-option label="拒绝" value=2 />
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditOpinion">
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
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAuditConfirm" :loading="auditLoading">确定</el-button>
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
  payeeName: '',
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
  dealerId: ''
};

export default {
  name: 'restatementEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
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
      auditList: [],
      auditPage: 1,
      auditPageSize: 4,
      auditTotal: 0,
      auditDialogVisible: false,
      auditForm: {
        auditAction: '',
        auditOpinion: ''
      },
      auditLoading: false,
      currentAuditType: '' // 当前审核类型：'audit' 或 'financialReview'
    };
  },

  methods: {
    handleSave () {
      this.$refs.containerRef.handleSubmit();
    },
    handleSaveAndClose () {
      this.$refs.containerRef.handleSubmit(true);
    },

    handleAudit () {
      this.currentAuditType = 'audit';
      this.auditDialogVisible = true;
      this.auditForm = {
        auditAction: '',
        auditOpinion: ''
      };
      // 重置表单验证
      this.$nextTick(() => {
        if (this.$refs.auditFormRef) {
          this.$refs.auditFormRef.clearValidate();
        }
      });
    },
    //财务审核
    handleFinalAudit () {
      this.currentAuditType = 'financialReview';
      this.auditDialogVisible = true;
      this.auditForm = {
        auditAction: '',
        auditOpinion: ''
      };
      // 重置表单验证
      this.$nextTick(() => {
        if (this.$refs.auditFormRef) {
          this.$refs.auditFormRef.clearValidate();
        }
      });
    },
    handleAuditActionChange (value) {
      // 当选择拒绝时，强制验证审核意见字段
      if (value === 2) {
        this.$nextTick(() => {
          if (this.$refs.auditFormRef) {
            this.$refs.auditFormRef.validateField('auditOpinion');
          }
        });
      }
    },
    handleAuditConfirm () {
      this.$refs.auditFormRef.validate((valid) => {
        if (!valid) {
          return;
        }

        this.auditLoading = true;

        // 根据审核类型调用不同接口
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
      if (this.form.dealerId) {
        window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${this.form.dealerCode}`, '_blank');
      } else {
        this.$message.warning('未找到厅店信息');
      }
    },

    async handleAuditSubmit () {
      // 二次确认
      this.$confirm('是否确定要提交审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          this.submitLoading = true;
          await submitAudit( this._id );

          this.$message.success('提交审核成功');
          this.$refs.containerRef.loadDetail();
        } catch (error) {
          console.error('提交审核失败:', error);
          this.$message.error(error.msg || '提交审核失败');
        } finally {
          this.submitLoading = false;
        }
      }).catch(() => {
        // 用户取消
        this.$message.info('已取消提交审核');
      });
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
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return { ...defaultForm };
    },
    handleShowLog () {
      this.$auditLog.show({ id: this._id });
    },
  }
};
</script>

<style lang="scss" scoped>
.status-section {
  display: flex;
  gap: 40px;
  padding: 10px 0;

  .status-item {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 4px;
    }

    .value {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
    }
  }
}

.common-section {
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;

  .common-section-header {
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
    background-color: #f5f7fa;
    border-radius: 4px 4px 0 0;

    h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }

  .common-section-body {
    padding: 20px;

    .form-edit {
      width: 100%;

      ::v-deep .el-form-item {
        margin-bottom: 20px;
        width: 33.33%;

        .el-form-item__label {
          font-weight: 400;
        }
      }

      ::v-deep .el-form-item--inline.large {
        .el-form-item__content {
          width: 70%;
        }
      }

      ::v-deep textarea {
        resize: vertical;
      }
    }
  }
}

.audit-section {
  .common-section-body {
    .el-table {
      margin-bottom: 16px;

      ::v-deep .el-table__header th {
        background-color: #f5f7fa;
        color: #606266;
        font-weight: 500;
      }
    }


  }
}
</style>
