<template>
  <edit-page-layout
    ref="editLayout"
    title="添加车辆"
    showPaneFooter
    >
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
        :showEditBtn="canEdit"
      >
        <template #extraButtons>
          <el-button v-if="canSubmit && (form.applyStatus === APPLY_STATUS.DRAFT || form.applyStatus === APPLY_STATUS.REJECTED)" type="primary" size="small" @click="handleSubmit">提交</el-button>
          <el-button v-if="canFirstApprove && form.applyStatus === APPLY_STATUS.FIRST_PENDING" type="primary" size="small" @click="handleFirstApprovePass">一级审批通过</el-button>
          <el-button v-if="canFirstApprove && form.applyStatus === APPLY_STATUS.FIRST_PENDING" type="danger" size="small" @click="handleFirstApproveReject">一级审批驳回</el-button>
          <el-button v-if="canFinalApprove && form.applyStatus === APPLY_STATUS.FINAL_PENDING" type="primary" size="small" @click="handleFinalApprovePass">最终审批通过</el-button>
          <el-button v-if="canFinalApprove && form.applyStatus === APPLY_STATUS.FINAL_PENDING" type="danger" size="small" @click="handleFinalApproveReject">最终审批驳回</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="申请单号：" prop="applyNo">
                  <el-input
                    v-model="form.applyNo"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="申请数量：" prop="vehicleCount">
                  <el-input
                    disabled
                    v-model="form.vehicleCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请状态：" prop="applyStatusLabel">
                  <el-input
                    v-model="form.applyStatusLabel"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="申请人：" prop="applierName">
                  <el-input
                    v-model="form.applierName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  <el-date-picker
                    disabled
                    v-model="form.applyTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="一级审批人：" prop="firstApproverName">
                  <el-input
                    v-model="form.firstApproverName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="一级审批时间：" prop="firstApproveTime">
                  <el-date-picker
                    disabled
                    v-model="form.firstApproveTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="一级审批说明：" prop="firstApproveComment">
                  <el-input
                    disabled
                    v-model="form.firstApproveComment"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="最终审批人：" prop="finalApproverName">
                  <el-input
                    disabled
                    v-model="form.finalApproverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  <base-input
                    v-model="form.applyReason"
                    clearable
                    type="textarea"
                    :disabled="!canEdit"
                  />
                </el-form-item>
                <el-form-item label="最终审批时间：" prop="finalApproveTime">
                  <el-date-picker
                    disabled
                    v-model="form.finalApproveTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="最终审批说明：" prop="finalApproveComment">
                  <el-input
                    v-model="form.finalApproveComment"
                    clearable
                    disabled
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请单号：">
                  {{ form.applyNo }}
                </el-form-item>
                <el-form-item label="申请数量：">
                  {{ form.vehicleCount }}
                </el-form-item>
                <el-form-item label="申请状态：">
                  {{ form.applyStatusLabel }}
                </el-form-item>
                <el-form-item label="申请人：">
                  {{ form.applierName }}
                </el-form-item>
                <el-form-item label="申请时间：">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="一级审批人：">
                  {{ form.firstApproverName }}
                </el-form-item>
                <el-form-item label="一级审批时间：">
                  {{ form.firstApproveTime }}
                </el-form-item>
                <el-form-item label="一级审批说明：">
                  {{ form.firstApproveComment }}
                </el-form-item>
                <el-form-item label="最终审批人：">
                  {{ form.finalApproverName }}
                </el-form-item>
                <el-form-item label="申请原因：">
                  {{ form.applyReason }}
                </el-form-item>
                <el-form-item label="最终审批时间：">
                  {{ form.finalApproveTime }}
                </el-form-item>
                <el-form-item label="最终审批说明：">
                  {{ form.finalApproveComment }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <detail-table
            ref="modalAddTable"
            :disabled="!canEdit"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
            @data-change="() => {}"
            @checkboxChange="checkboxChange"
            @open-add="openPane"
          />
          <section class="common-section">
            <div class="common-section-header">
              <h2>附件信息</h2>
            </div>
            <div v-if="_id" class="common-section-body">
              <div class="common-section-table">
                <AisAttachment
                  :businessId="_id"
                  configCode="mcs_servicedealerchange"
                  ref="attachment"
                  :readonly="!canEdit"
                />
              </div>
            </div>
            <div class="common-section-body not-commit" v-else>
              提交新建后，即可添加
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div v-if="canEdit" class="page-common-edit">
        <add-vehicle-form
          ref="addVehicleForm"
          v-if="_id"
          :applyId="_id"
        />
      </div>
    </template>
    <template #footer v-if="canEdit">
      <el-button size="small" type="primary" @click="handleSubmitVehicle(true)">保存&关闭</el-button>
      <el-button size="small" type="primary" @click="handleSubmitVehicle(false)">保存&再建一个</el-button>
      <el-button size="small" @click="handleCancelVehicle">取消</el-button>
    </template>
    <FirstApproveRejectDialog
      :visible.sync="firstApproveDialogVisible"
      :id="currentApproveId"
      @success="handleDialogSuccess"
    />
    <FinalApproveRejectDialog
      :visible.sync="finalApproveDialogVisible"
      :id="currentApproveId"
      @success="handleDialogSuccess"
    />
  </edit-page-layout>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  submit,
  firstApprovePass,
  finalApprovePass,
} from '@/api/datacenter/vehicle/serviceDealerChangeApply/index';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import DetailTable from './components/DetailTable';
import AddVehicleForm from './components/AddVehicleForm';
import AisAttachment from '@/libs/components/AisAttachment';
import EditPageLayout from '@/libs/components/EditPageLayout';
import BaseInput from '@/libs/components/BaseInput';
import FirstApproveRejectDialog from './FirstApproveRejectDialog/index.vue';
import FinalApproveRejectDialog from './FinalApproveRejectDialog/index.vue';
import { APPLY_STATUS, EDITABLE_STATUS } from './constant';

const defaultForm = {
  applyNo: '',
  applyReason: '',
  applyStatus: '',
  applierName: '',
  applyTime: '',
  vehicleCount: '',
  firstApproverName: '',
  firstApproveTime: '',
  firstApproveComment: '',
  finalApproverName: '',
  finalApproveTime: '',
  finalApproveComment: '',
};

export default {
  name: 'serviceDealerChangeApplyEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    DetailTable,
    EditBaseContainer,
    AisAttachment,
    EditPageLayout,
    AddVehicleForm,
    BaseInput,
    FirstApproveRejectDialog,
    FinalApproveRejectDialog,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id || '';
    },
    title () {
      return '申请单号：' + this.form.applyNo;
    },
    canEdit () {
      return EDITABLE_STATUS.includes(this.form.applyStatus) || !this._id;
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
      APPLY_STATUS,
      pageTitle: '专属服务门店变更',
      pageType: 'edit',
      moduleKey: 'AISMC-serviceDealerChangeApply',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      selectedRows: [],
      firstApproveDialogVisible: false,
      currentApproveId: '',
      finalApproveDialogVisible: false,
    };
  },
  created () {
    this.canSubmit = this.permissions.has(`${this.moduleKey}-submit`);
    this.canFirstApprove = this.permissions.has(`${this.moduleKey}-firstApprove`);
    this.canFinalApprove = this.permissions.has(`${this.moduleKey}-finalApprove`);
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
    closePane () {
      this.$refs.editLayout.closePane();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        applierName: userInfo.userName,
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    checkboxChange (records) {
      this.selectedRows = records;
    },
    // 提交
    handleSubmit () {
      submit({ id: this._id }).then(() => {
        this.$message.success('提交成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    // 一级审批通过
    handleFirstApprovePass () {
      firstApprovePass({ id: this._id }).then(() => {
        this.$message.success('操作成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    // 一级审批驳回
    handleFirstApproveReject () {
      this.currentApproveId = this._id;
      this.firstApproveDialogVisible = true;
    },
    // 最终审批通过
    handleFinalApprovePass () {
      finalApprovePass({ id: this._id }).then(() => {
        this.$message.success('操作成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    // 最终审批驳回
    handleFinalApproveReject () {
      this.currentApproveId = this._id;
      this.finalApproveDialogVisible = true;
    },
    // 对话框成功回调
    handleDialogSuccess () {
      this.$refs.containerRef.loadDetail();
    },
    handleCancelVehicle () {
      this.$refs.addVehicleForm.resetForm();
      this.$refs.editLayout.closePane();
    },
    async handleSubmitVehicle (isClose) {
      try {
        await this.$refs.addVehicleForm.onAddSave();
        this.$refs.modalAddTable.getTableData();
        if (isClose) {
          this.$refs.editLayout.closePane();
        }
      } catch (e) {
        // validation failed or API error
      }
    }
  }
};
</script>
