<template>
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
                    placeholder="请输入"
                    v-model="form.applyNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请状态，10:草稿; 20:待一级审批; 30:待最终审批; 40:审批通过; 50:审批驳回; 100:导入中：" prop="applyStatus">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applyStatus"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请人姓名：" prop="applierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  <el-date-picker
                    v-model="form.applyTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="申请数量（车辆明细记录数）：" prop="vehicleCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="一级审批人姓名：" prop="firstApproverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.firstApproverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="一级审批时间：" prop="firstApproveTime">
                  <el-date-picker
                    v-model="form.firstApproveTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="一级审批说明：" prop="firstApproveComment">
                  <el-input
                    placeholder="请输入"
                    v-model="form.firstApproveComment"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="最终审批人姓名：" prop="finalApproverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.finalApproverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="最终审批时间：" prop="finalApproveTime">
                  <el-date-picker
                    v-model="form.finalApproveTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="最终审批说明：" prop="finalApproveComment">
                  <el-input
                    placeholder="请输入"
                    v-model="form.finalApproveComment"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请单号：" prop="applyNo">
                  {{ form.applyNo }}
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  {{ form.applyReason }}
                </el-form-item>
                <el-form-item label="申请状态，10:草稿; 20:待一级审批; 30:待最终审批; 40:审批通过; 50:审批驳回; 100:导入中：" prop="applyStatus">
                  {{ form.applyStatus }}
                </el-form-item>
                <el-form-item label="申请人姓名：" prop="applierName">
                  {{ form.applierName }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="申请数量（车辆明细记录数）：" prop="vehicleCount">
                  {{ form.vehicleCount }}
                </el-form-item>
                <el-form-item label="一级审批人姓名：" prop="firstApproverName">
                  {{ form.firstApproverName }}
                </el-form-item>
                <el-form-item label="一级审批时间：" prop="firstApproveTime">
                  {{ form.firstApproveTime }}
                </el-form-item>
                <el-form-item label="一级审批说明：" prop="firstApproveComment">
                  {{ form.firstApproveComment }}
                </el-form-item>
                <el-form-item label="最终审批人姓名：" prop="finalApproverName">
                  {{ form.finalApproverName }}
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
          <modal-add-table
            ref="modalAddTable"
            :disabled="false"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
            @data-change="() => {}"
            @checkboxChange="checkboxChange"
          />
          <section class="common-section">
            <div class="common-section-header">
              <h2>附件</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <AisAttachment
                  :businessId="_id"
                  configCode="mcs_servicedealerchange"
                  attachType="附件"
                  ref="attachment"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
} from '@/api/datacenter/vehicle/serviceDealerChangeApply/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ModalAddTable from './components/ModalAddTable';
import AisAttachment from '@/libs/components/AisAttachment';

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
    ModalAddTable,
    EditBaseContainer,
    AisAttachment,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '标题xxx';
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
        applyNo: [
          { required: true, message: '请输入申请单号', trigger: 'blur' }
        ],
        applyReason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ],
        applyStatus: [
          { required: true, message: '请输入申请状态，10:草稿; 20:待一级审批; 30:待最终审批; 40:审批通过; 50:审批驳回; 100:导入中', trigger: 'blur' }
        ],
        applierName: [
          { required: true, message: '请输入申请人姓名', trigger: 'blur' }
        ],
        applyTime: [
          { required: true, message: '请选择申请时间', trigger: 'change' }
        ],
        vehicleCount: [
          { required: true, message: '请输入申请数量（车辆明细记录数）', trigger: 'blur' }
        ],
        firstApproverName: [
          { required: true, message: '请输入一级审批人姓名', trigger: 'blur' }
        ],
        firstApproveTime: [
          { required: true, message: '请选择一级审批时间', trigger: 'change' }
        ],
        firstApproveComment: [
          { required: true, message: '请输入一级审批说明', trigger: 'blur' }
        ],
        finalApproverName: [
          { required: true, message: '请输入最终审批人姓名', trigger: 'blur' }
        ],
        finalApproveTime: [
          { required: true, message: '请选择最终审批时间', trigger: 'change' }
        ],
        finalApproveComment: [
          { required: true, message: '请输入最终审批说明', trigger: 'blur' }
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
  }
};
</script>
