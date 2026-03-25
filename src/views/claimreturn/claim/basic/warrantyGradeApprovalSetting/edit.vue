<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
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
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="编码：" prop="gradeApprovalCode">
                  <el-input
                    placeholder="系统自动生成"
                    v-model="form.gradeApprovalCode"
                    clearable
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="名称：" prop="gradeApprovalName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.gradeApprovalName"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="保修类型：" prop="warrantyTypeId">
                  <list-select
                    listUrl="/maintain/web/basic/repairItemType/list"
                    placeholder="请输入保修类型编码/名称"
                    v-model="form.warrantyTypeId"
                    :disabled="Boolean(_id)"
                    query-key="codeOrNameLike"
                    auto-load-options
                    no-param-load
                    filterable
                    clearable
                    label-key="name"
                    second-line-key="code"
                    @change="handleWarrantyTypeChange"
                    :params="{'checkoutTypeNames':['合同','保修'],'excludeMaintenancePackage':true}" />
              </el-form-item>
                <el-form-item label="审批级别：" prop="approvalGrade">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="warranty_approval_grade"
                    v-model="form.approvalGrade"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="索赔金额区间：" prop="claimAmount1">
                  <el-input-number
                    placeholder="请输入索赔金额 1"
                    v-model="form.claimAmount1"
                    clearable
                    :controls = "false"
                    :max="999999999"
                    :min="0"
                    style="width: calc(50% - 15px);"
                  />
                  <span style="margin: 0 8px;">至</span>
                  <el-input-number
                    placeholder="请输入索赔金额 2"
                    v-model="form.claimAmount2"
                    clearable
                    :controls = "false"
                    :max="999999999"
                    :min="0"
                    style="width: calc(50% - 15px);"
                  />
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    :disabled="true"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="编码：" prop="gradeApprovalCode">
                  {{ form.gradeApprovalCode }}
                </el-form-item>
                <el-form-item label="名称：" prop="gradeApprovalName">
                  {{ form.gradeApprovalName }}
                </el-form-item>
                <el-form-item label="保修类型：" prop="warrantyTypeName">
                  {{ form.warrantyTypeName }}
                </el-form-item>
                <el-form-item label="审批级别：" prop="approvalGrade">
                  {{ form.approvalGradeLabel }}
                </el-form-item>
                <el-form-item label="索赔金额区间：" prop="claimAmountRange">
                  {{ form.claimAmount1 }} 至 {{ form.claimAmount2 }}
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="说明：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="更新时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>状态变化</h2>
            </div>
            <div class="common-section-body">
              <grade-table
                ref="gradeTable"
                :id="_id"
                :moduleKey="moduleKey"
              />
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/warrantyGradeApprovalSetting/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ListSelect from '@/libs/components/list-select/index.vue';
import GradeTable from './GradeTable';

const defaultForm = {
  gradeApprovalCode: '',
  gradeApprovalName: '',
  warrantyTypeId: '',
  warrantyTypeName: '',
  warrantyTypeCode: '',
  approvalGrade: '',
  claimAmount1: '',
  claimAmount2: '',
  status: '0',
};

export default {
  name: 'warrantyGradeApprovalSettingEdit',
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
    ListSelect,
    FetchSelect,
    GradeTable,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    isEditMode () {
      return !!this._id;
    },
    title () {
      return '分级审批编码：' + this.form.gradeApprovalCode;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
        if (val && this.$refs.gradeTable) {
          this.$refs.gradeTable.getDetailPageApi();
        }
      },
      immediate: true
    },
    'form.approvalGrade': {
      handler (newVal, oldVal) {
        if (this.isEditMode && oldVal && newVal && oldVal !== newVal) {
          this.$notify({
            title: '提示',
            message: '规则调整后，要重新启用，规则才会生效',
            type: 'warning'
          });
        }
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '保修分级审批设置',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantyGradeApprovalSetting',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        gradeApprovalName: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        warrantyTypeId: [
          { required: true, message: '请选择保修类型', trigger: 'change' }
        ],
        approvalGrade: [
          { required: true, message: '请输入审批级别', trigger: 'change' }
        ],
        claimAmount1: [
          { required: true, message: '请输入索赔金额区间', trigger: 'change' },
          { validator: this.validateClaimAmount, trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    // 新增模式：提示启用默认为否
    if (!this._id) {
      this.$notify({
        title: '提示',
        message: '默认为停用，需要自行启用',
        type: 'warning'
      });
    }
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      const that = this;
      return addOrUpdate({ ...this.form }).then(res => {
        if (that.$refs.gradeTable) {
          that.$refs.gradeTable.getDetailPageApi();
        }
        return res;
      });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleWarrantyTypeChange (val, selectedItem) {
      this.form.warrantyTypeId = val;
      this.form.warrantyTypeName = selectedItem ? selectedItem.name : '';
      this.form.warrantyTypeCode = selectedItem ? selectedItem.code : '';
    },
    validateClaimAmount (rule, value, callback) {
      const amount1 = parseFloat(value);
      const amount2 = parseFloat(this.form.claimAmount2);
      if (amount1 && amount2 && amount1 >= amount2) {
        callback(new Error('索赔金额 1 必须小于索赔金额 2'));
      } else {
        callback();
      }
    },
    queryListData (queryString) {
      return new Promise(resolve => {
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      this.tableData.push(record);
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
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
