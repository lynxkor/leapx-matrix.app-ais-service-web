<template>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :showEditBtn="false"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <div v-if="_id" class="header-desc">
            留车单状态：{{ form.retentionStatusLabel }}&nbsp;&nbsp;|&nbsp;&nbsp;创建时间：{{ form.createTime }}
          </div>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    v-model="form.createTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="留车单编码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="vehModelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehModelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年型：" prop="vehYearTypeName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehYearTypeName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="工程师姓名：" prop="engineerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.engineerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="预计到店时间：" prop="estimatedArrivedOn">
                  <el-date-picker
                    v-model="form.estimatedArrivedOn"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="故障描述：" prop="faultDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.faultDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="作废理由：" prop="invalidReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invalidReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="制造日期：" prop="manufactureOn">
                  <el-date-picker
                    v-model="form.manufactureOn"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="不现调理由：" prop="noFieldSurveyReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.noFieldSurveyReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="现调备注：" prop="onsiteSurveyRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.onsiteSurveyRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="留车单状态：" prop="retentionStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="VehRetentionStatusEnum"
                    v-model="form.retentionStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehProfileVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="留车配置项编码：" prop="configCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.configCode"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="留车单编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="留车配置项编码：" prop="configCode">
                  {{ form.configCode }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  {{ form.vehProfileVin }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  {{ form.serviceProxyCode }}
                </el-form-item>
                <el-form-item label="年款：" prop="vehYearTypeName">
                  {{ form.vehYearTypeName }}
                </el-form-item>
                <el-form-item label="车型：" prop="vehModelName">
                  {{ form.vehModelName }}
                </el-form-item>
                <el-form-item label="制造日期：" prop="manufactureOn">
                  {{ form.manufactureOn }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="故障描述：" prop="faultDesc">
                  {{ form.faultDesc }}
                </el-form-item>
                <el-form-item label="作废理由：" prop="invalidReason">
                  {{ form.invalidReason }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>现调信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail" v-show="_id">
                <el-form-item label="工程师姓名：" prop="engineerName">
                  {{ form.engineerName }}
                </el-form-item>
                <el-form-item label="预计到店时间：" prop="estimatedArrivedOn">
                  {{ form.estimatedArrivedOn }}
                </el-form-item>
                <el-form-item label="现调备注：" prop="onsiteSurveyRemark">
                  {{ form.onsiteSurveyRemark }}
                </el-form-item>
                <el-form-item label="不现调理由：" prop="noFieldSurveyReason">
                  {{ form.noFieldSurveyReason }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <fault-table
            :disabled="true"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
          />
          <parts-table
            :disabled="true"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
          />
        </el-main>
      </edit-base-container>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
} from '@/api/maintain/sp/vehRetentionList/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import FaultTable from './components/FaultTable';
import PartsTable from './components/PartsTable';

const defaultForm = {
  // 多选时字段有变化，自行修复
  createTime: '',
  code: '',
  vehModelName: '',
  vehYearTypeName: '',
  dealerName: '',
  engineerName: '',
  estimatedArrivedOn: '',
  faultDesc: '',
  invalidReason: '',
  manufactureOn: '',
  noFieldSurveyReason: '',
  onsiteSurveyRemark: '',
  serviceProxyCode: '',
  retentionStatus: '',
  vehProfileVin: '',
  configCode: '',
};

export default {
  name: 'vehRetentionListEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FaultTable,
    PartsTable,
    EditBaseContainer,
    FetchSelect,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '留车单代码：' + this.form.code;
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
      pageTitle: '留车清单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR 根据实际情况修改
      moduleKey: 'AISMC-vehRetentionList',
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
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入留车单编码', trigger: 'blur' }
        ],
        vehModelName: [
          { required: true, message: '请输入基本车型', trigger: 'blur' }
        ],
        vehYearTypeName: [
          { required: true, message: '请输入年型', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        engineerName: [
          { required: true, message: '请输入工程师姓名', trigger: 'blur' }
        ],
        estimatedArrivedOn: [
          { required: true, message: '请选择预计到店时间', trigger: 'change' }
        ],
        faultDesc: [
          { required: true, message: '请输入故障描述', trigger: 'blur' }
        ],
        invalidReason: [
          { required: true, message: '请输入作废理由', trigger: 'blur' }
        ],
        manufactureOn: [
          { required: true, message: '请选择制造日期', trigger: 'change' }
        ],
        noFieldSurveyReason: [
          { required: true, message: '请输入不现调理由', trigger: 'blur' }
        ],
        onsiteSurveyRemark: [
          { required: true, message: '请输入现调备注', trigger: 'blur' }
        ],
        serviceProxyCode: [
          { required: true, message: '请输入接车施工单', trigger: 'blur' }
        ],
        retentionStatus: [
          { required: true, message: '请输入留车单状态', trigger: 'blur' }
        ],
        vehProfileVin: [
          { required: true, message: '请输入VIN码', trigger: 'blur' }
        ],
        configCode: [
          { required: true, message: '请输入留车配置项编码', trigger: 'blur' }
        ],
      },
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
  }
};
</script>
<style scoped lang="scss">
.header-desc{
  color: var(--leap-color-default-light-1);
}
</style>
