<template>
  <div class="page-common-add">
    <el-container>
      <el-main>
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" size="small">
          <el-form-item label="结算类型代码：" prop="code">
            <el-input
              placeholder="请输入"
              v-model="form.code"
              clearable
            />
          </el-form-item>
          <el-form-item label="结算类型名称：" prop="name">
            <el-input
              placeholder="请输入"
              v-model="form.name"
              clearable
            />
          </el-form-item>
          <el-form-item label="结算类别：" prop="category">
            <el-input
              placeholder="请输入"
              v-model="form.category"
              clearable
            />
          </el-form-item>
          <el-form-item label="是否app展示描述：" prop="appShow">
            <el-input
              placeholder="请输入"
              v-model="form.appShow"
              clearable
            />
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input
              placeholder="请输入"
              v-model="form.sort"
              clearable
            />
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              type="textarea"
              placeholder="请输入"
              v-model="form.remark"
              maxlength="500"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" v-loading="submitLoading">保存</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/checkoutType/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  name: '',
  categoryDesc: '',
  statusDesc: '',
  appShowDesc: '',
  sort: '',
  remark: '',
  createTime: '',
  updateTime: '',
  status: '',
  category: '',
  appShow: '',
};

export default {
  name: 'checkoutTypeEdit',
  components: {
    // FetchSelect,
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: {
        ...defaultForm
      },
      rules: {
        code: [
          { required: true, message: '请输入结算类型代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入结算类型名称', trigger: 'blur' }
        ],
        categoryDesc: [
          { required: true, message: '请输入结算类别描述', trigger: 'blur' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态描述', trigger: 'change' }
        ],
        appShowDesc: [
          { required: true, message: '请输入是否app展示描述', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        category: [
          { required: true, message: '请输入结算类别 CheckoutCategoryEnum ', trigger: 'blur' }
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
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['结算类型管理', '结算类型管理详情']);
    this.getDetailData();
  },
  methods: {
    getDetailData () {
      const id = this.$route.query.id;
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
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
