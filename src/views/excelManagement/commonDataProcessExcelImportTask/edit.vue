<template>
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="180px">
              <el-form-item label="任务id" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="任务类型" prop="taskType">
                <fetch-select
                  :request="() => fetchOptions('xxx')"
                  v-model="form.taskType"
                  placeholder="请选择"
                  clearable
                  multiple
                />
              </el-form-item>
              <el-form-item label="业务标识" prop="businessType">
                <fetch-select
                  :request="() => fetchOptions('xxx')"
                  v-model="form.businessType"
                  placeholder="请选择"
                  clearable
                  multiple
                />
              </el-form-item>
              <el-form-item label="导出的excel下载地址" prop="excelUrl">
                <el-input
                  placeholder="请输入"
                  v-model="form.excelUrl"
                  clearable
                />
              </el-form-item>
              <el-form-item label="导入结果备注" prop="importRemark">
                <el-input
                  placeholder="请输入"
                  v-model="form.importRemark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="任务状态" prop="taskStatus">
                <fetch-select
                  :request="() => fetchOptions('xxx')"
                  v-model="form.taskStatus"
                  placeholder="请选择"
                  clearable
                  multiple
                />
              </el-form-item>
              <el-form-item label="导入模板的主键id" prop="importModelId">
                <el-input
                  placeholder="请输入"
                  v-model="form.importModelId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="导入失败的数据excel下载地址" prop="importFailUrl">
                <el-input
                  placeholder="请输入"
                  v-model="form.importFailUrl"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="删除状态" prop="deleteStatus">
                <fetch-select
                  :request="() => fetchOptions('xxx')"
                  v-model="form.deleteStatus"
                  placeholder="请选择"
                  clearable
                  multiple
                />
              </el-form-item>
              <el-form-item label="需要转发的请求头" prop="headerMap">
                <el-input
                  placeholder="请输入"
                  v-model="form.headerMap"
                  clearable
                />
              </el-form-item>
              <el-form-item label="业务标题" prop="businessTitle">
                <el-input
                  placeholder="请输入"
                  v-model="form.businessTitle"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/excelManagement/commonDataProcessExcelTask/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  taskType: '',
  businessType: '',
  excelUrl: '',
  importRemark: '',
  taskStatus: '',
  importModelId: '',
  importFailUrl: '',
  modifier: '',
  deleteStatus: '',
  headerMap: '',
  businessTitle: '',
};

export default {
  name: 'commonDataProcessExcelTaskEdit',
  mixins: [routeGuard],
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    FetchSelect,
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        taskType: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '请选择业务标识', trigger: 'change' }
        ],
        excelUrl: [
          { required: true, message: '请输入导出的excel下载地址', trigger: 'blur' }
        ],
        importRemark: [
          { required: true, message: '请输入导入结果备注', trigger: 'blur' }
        ],
        taskStatus: [
          { required: true, message: '请选择任务状态', trigger: 'change' }
        ],
        importModelId: [
          { required: true, message: '请输入导入模板的主键id', trigger: 'blur' }
        ],
        importFailUrl: [
          { required: true, message: '请输入导入失败的数据excel下载地址', trigger: 'blur' }
        ],
        deleteStatus: [
          { required: true, message: '请选择删除状态', trigger: 'change' }
        ],
        headerMap: [
          { required: true, message: '请输入需要转发的请求头', trigger: 'blur' }
        ],
        businessTitle: [
          { required: true, message: '请输入业务标题', trigger: 'blur' }
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['Excel模板导出', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = { ...defaultForm };
    },
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
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
