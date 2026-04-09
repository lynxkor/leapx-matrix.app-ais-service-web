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
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请单号：" prop="applyNo">
                  {{ form.applyNo }}
                </el-form-item>
                <el-form-item label="申请数量：" prop="vehicleCount">
                  {{ form.vehicleCount }}
                </el-form-item>
                <el-form-item label="申请状态：" prop="applyStatusLabel">
                  {{ form.applyStatusLabel }}
                </el-form-item>
                <el-form-item label="申请人：" prop="applierName">
                  {{ form.applierName }}
                </el-form-item>
                <el-form-item label="一级审批人：" prop="firstApproverName">
                  {{ form.firstApproverName }}
                </el-form-item>
                <el-form-item label="最终审批人：" prop="finalApproverName">
                  {{ form.finalApproverName }}
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  {{ form.applyReason }}
                </el-form-item>
                <el-form-item label="一级审批时间：" prop="firstApproveTime">
                  {{ form.firstApproveTime }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="一级审批说明：" prop="firstApproveComment">
                  {{ form.firstApproveComment }}
                </el-form-item>
                <el-form-item label="最终审批时间：" prop="finalApproveTime">
                  {{ form.finalApproveTime }}
                </el-form-item>
                <el-form-item label="最终审批说明：" prop="finalApproveComment">
                  {{ form.finalApproveComment }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <detail-table
            ref="modalAddTable"
            :disabled="false"
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
                  attachType="附件"
                  ref="attachment"
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
      <div class="page-common-edit">
        <add-vehicle-form
          ref="addVehicleForm"
          v-if="_id"
          :applyId="_id"
        />
      </div>
    </template>
    <template #footer>
      <el-button size="small" type="primary" @click="handleSubmitVehicle(true)">保存&关闭</el-button>
      <el-button size="small" type="primary" @click="handleSubmitVehicle(false)">保存&再建一个</el-button>
      <el-button size="small" @click="handleCancelVehicle">取消</el-button>
    </template>
  </edit-page-layout>
</template>

<script>

// 1. 申请单号
// 2. 申请数量
// 3. 申请状态
// 4. 申请人
// 5. 一级审批人
// 6. 最终审批人
// 7. 申请原因
// 8. 一级审批时间
// 9. 申请时间
// 10. 一级审批说明
// 11. 最终审批时间
// 12. 最终审批说明
import {
  getDetail,
  addOrUpdate,
} from '@/api/datacenter/vehicle/serviceDealerChangeApply/index';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import DetailTable from './components/DetailTable';
import AddVehicleForm from './components/AddVehicleForm';
import AisAttachment from '@/libs/components/AisAttachment';
import EditPageLayout from '@/libs/components/EditPageLayout';
import BaseInput from '@/libs/components/BaseInput';

const defaultForm = {
  // 多选时字段有变化，自行修复
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
  // 集中视图预留
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
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '申请单号：' + this.form.applyNo;
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
      pageTitle: '专属服务门店变更',
      pageType: 'edit',
      moduleKey: 'AISMC-serviceDealerChangeApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
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
        applyReason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ],
      },
      selectedRows: [],
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
    closePane () {
      this.$refs.editLayout.closePane();
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    checkboxChange (records) {
      this.selectedRows = records;
    },
    handleCancelVehicle () {
      this.$refs.addVehicleForm.resetForm();
      this.$refs.editLayout.closePane();
    },
    async handleSubmitVehicle (isClose) {
      console.log(isClose);
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
