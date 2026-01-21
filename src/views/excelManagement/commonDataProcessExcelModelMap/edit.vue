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
                <el-form-item label="模板id" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="模板编码" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    maxLength="36"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="excel导入模板下载地址" prop="excelModelUrl">
                  <el-upload
                    class="upload-demo"
                    action="#"
                    :http-request="customUploadRequest"
                    :before-remove="beforeRemove"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    accept=".xlsx"
                    :headers=uploadHeaders
                  >
                    <el-button
                      size="small"
                      type="primary"
                      :loading="uploadLoading"
                      :disabled="uploadLoading"
                     >
                     {{ uploadLoading ? '上传中...' : '点击上传' }}
                    </el-button>
                    <div slot="tip" class="el-upload__tip">只能上传.xlsx,.xls文件，且不超过1MB</div>
                  </el-upload>
                  <el-input
                    placeholder="请输入"
                    v-model="form.excelModelUrl"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="业务标识" prop="businessType">
                  <el-input
                    placeholder="请输入"
                    v-model="form.businessType"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="导入数据的第三方接口信息" prop="postInterface">
                  <el-input
                    placeholder="请输入"
                    v-model="form.postInterface"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="导入参数DTO" prop="postParamDto">
                  <el-input
                    placeholder="请输入"
                    v-model="form.postParamDto"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="每批n条数据" prop="batchSize">
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
import { uploadFile } from '@/libs/api/attachment';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  code: '',
  excelModelUrl: '',
  businessType: '',
  postInterface: '',
  postParamDto: '',
  batchSize: '',
};

export default {
  name: 'commonDataProcessExcelModelMapEdit',
  mixins: [routeGuard],
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
      uploadHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      fileList: [],
      uploadLoading: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        id: [
          { required: false, message: '请输入主键', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入模板编码', trigger: 'blur' }
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
  computed: {
  // 使用计算属性动态获取上传地址
    uploadAction () {
      return process.env.VUE_APP_WORK_ORDER_URL + '/file/fileService/uploadMultipartFile';
    }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['Excel模板导入', `${id ? '编辑' : '新建'}`]);
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
      this.fileList = [];
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
    },

    // 上传前的文件校验 只允许.xlsx文件
    beforeUpload (file) {
      const isExcel = /\.xlsx$/i.test(file.name);
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isExcel) {
        this.$message.error('只能上传 Excel.xlsx 文件!');
        return false;
      }
      if (!isLt1M) {
        this.$message.error('文件大小不能超过 1MB!');
        return false;
      }
      // 开始上传，显示加载状态
      this.uploadLoading = true;
      return true;
    },
    async customUploadRequest (options) {
      const { file } = options;
      const formData = new FormData();
      formData.append('file', file);
      const uploadResult = await uploadFile(formData);
      this.form.excelModelUrl = uploadResult.data.url;
    },
    // 上传成功后的处理
    handleSuccess (res, file) {
      this.uploadLoading = false;
      const excelModelUrl = file.response?.data?.url;
      // 直接赋值
      // this.form.excelModelUrl = excelModelUrl;

      this.$message.success('上传成功');
    },

    beforeRemove (file, fileList) {
      this.uploadLoading = false;
      this.form.excelModelUrl = '';
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handleError () {
      this.uploadLoading = false;
      this.$message.error('上传失败，请重试');
    },

    // 上传时校验
    handleExceed () {
      this.$message.warning('当前限制选择 1 个文件');
    }
  }
};
</script>
