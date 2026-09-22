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
                    :disabled="isEdit"
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
                    accept=".xlsx, .xls"
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
                <el-form-item label="每批N条数据" prop="batchSize">
                  <el-input
                    placeholder="请输入"
                    v-model="form.batchSize"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="表头起始行" prop="titleStartRow">
                  <el-input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="请输入"
                    v-model="form.titleStartRow"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据起始行" prop="dataStartRow">
                  <el-input
                    type="number"
                    min="2"
                    max="999999"
                    placeholder="请输入"
                    v-model="form.dataStartRow"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="导入业务" prop="importBusiness">
                  <el-input
                    placeholder="请输入"
                    v-model="form.importBusiness"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="导入策略" prop="importStrategy">
                  <el-select v-model="form.importStrategy" placeholder="请选择">
                    <el-option label="跳过错误行" value="SKIP_ERROR_ROWS" />
                    <el-option label="全有全无" value="ALL_OR_NOTHING" />
                  </el-select>
                </el-form-item>
                <el-form-item label="文件大小限制（MB）" prop="fileSizeLimitMb">
                  <el-input
                    type="number"
                    min="1"
                    placeholder="请输入"
                    v-model="form.fileSizeLimitMb"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="最大行数" prop="maxRows">
                  <el-input
                    type="number"
                    min="1"
                    placeholder="请输入"
                    v-model="form.maxRows"
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
import { getDetail, addOrUpdate, checkCodeUnique } from '@/api/excelManagement/commonDataProcessExcelModelMap/index';
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
  titleStartRow: '',
  dataStartRow: '',
  importBusiness: '',
  importStrategy: 'SKIP_ERROR_ROWS',
  fileSizeLimitMb: '',
  maxRows: ''
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
          { required: true, message: '请输入每批N条数据', trigger: 'blur' },
          { validator: this.validatePositiveInteger, trigger: 'blur' }
        ],
        titleStartRow: [
          { required: true, message: '请输入表头起始行', trigger: 'blur' },
          { validator: this.validatePositiveInteger, trigger: 'blur' }
        ],
        dataStartRow: [
          { required: true, message: '请输入数据起始行', trigger: 'blur' },
          { validator: this.validatePositiveInteger, trigger: 'blur' }
        ],
        fileSizeLimitMb: [
          { validator: this.validatePositiveInteger, trigger: 'blur' }
        ],
        maxRows: [
          { validator: this.validatePositiveInteger, trigger: 'blur' }
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
      return window.APP_AIS_WEB_CONFIG.VUE_APP_WORK_ORDER_URL + '/file/fileService/uploadMultipartFile';
    },
    // 编辑态：模板编码是唯一标识，禁止修改（checkCodeUnique 编辑态也按排除自身校验）
    isEdit () {
      return !!(this.id || this.$route.query.id);
    }
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    // 数值字段正整数校验：batchSize/表头起始行/数据起始行必填，文件大小限制MB/最大行数可空，填值均须为正整数
    validatePositiveInteger (rule, value, callback) {
      if (value === '' || value === null || value === undefined) {
        callback();
        return;
      }
      if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
        callback(new Error('请输入正整数'));
        return;
      }
      callback();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['导入模板', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          try {
            // 保存前模板编码唯一性校验（编辑态排除自身；后端应用层校验 + DB uk_code 兜底）
            const checkRes = await checkCodeUnique({ code: this.form.code, id: (this.id || this.$route.query.id) || undefined });
            // 后端契约：Boolean 或 { unique: Boolean }（t3 定稿），前端两形态兼容，异常形态按重码阻断
            const unique = checkRes === true || (checkRes && checkRes.unique === true);
            if (!unique) {
              this.$message({
                message: '模板编码已存在',
                type: 'error'
              });
              return;
            }
            const payload = { ...this.form };
            // 数值可空字段空串不下发，避免后端 Integer 反序列化失败
            if (payload.fileSizeLimitMb === '') {
              delete payload.fileSizeLimitMb;
            }
            if (payload.maxRows === '') {
              delete payload.maxRows;
            }
            await addOrUpdate(payload);
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.id || this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              // 编辑态：保存成功后跳转详情页，不再留在编辑页刷新数据
              this.$router.push({
                path: '/excelManagement/commonDataProcessExcelModelMap/detail',
                query: { id }
              });
            }
          } catch (error) {
            // 报错已由全局拦截器 toast（唯一性校验/保存失败），此处静默
          } finally {
            this.submitLoading = false;
          }
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
      const isExcel = /\.xlsx$|\.xls$/i.test(file.name);
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isExcel) {
        this.$message.error('只能上传 Excel.xlsx 或者.xls 文件!');
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
