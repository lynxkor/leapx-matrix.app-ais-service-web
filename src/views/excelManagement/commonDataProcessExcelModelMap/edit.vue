<template>
    <div class="page-common-add">
      <el-container>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :model="form" :rules="rules" ref="ruleForm" label-width="220px">
                <el-form-item label="模板id：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="excel导入模板下载地址：" prop="excelModelUrl">
                  <el-input
                    placeholder="请输入"
                    v-model="form.excelModelUrl"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="业务标识：" prop="businessType">
                  <el-input
                    placeholder="请输入"
                    v-model="form.businessType"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="导入数据的第三方接口信息：" prop="postInterface">
                  <el-input
                    placeholder="请输入"
                    v-model="form.postInterface"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="导入参数DTO：" prop="postParamDto">
                  <el-input
                    placeholder="请输入"
                    v-model="form.postParamDto"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="每批n条数据：" prop="batchSize">
                  <el-input
                    placeholder="请输入"
                    v-model="form.batchSize"
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
import { getDetail, addOrUpdate } from '@/api/excelManagement/commonDataProcessExcelModelMap/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  excelModelUrl: '',
  businessType: '',
  postInterface: '',
  postParamDto: '',
  batchSize: '',
};

export default {
  name: 'commonDataProcessExcelModelMapEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
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
          { required: false, message: '请输入主键', trigger: 'blur' }
        ],
        excelModelUrl: [
          { required: true, message: '请输入excel导入模板下载地址', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请选择业务标识', trigger: 'change' }
        ],
        postInterface: [
          { required: true, message: '请输入导入数据的第三方接口信息', trigger: 'blur' }
        ],
        postParamDto: [
          { required: true, message: '请输入导入参数DTO', trigger: 'blur' }
        ],
        batchSize: [
          { required: true, message: '请输入每批n条数据', trigger: 'blur' }
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
  beforeRouteLeave (to, from, next) {
    if (JSON.stringify(this.form) === JSON.stringify(this.originalForm)) {
      next();
    } else {
      console.log('form', this.form);
      console.log('originalForm', this.originalForm);
      this.$confirm('确定要放弃修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next();
      }).catch(() => {
        next(false);
      });
    }
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', `${id ? '编辑' : '新建'}`]);
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
