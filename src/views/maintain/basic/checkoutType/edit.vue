<template>
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="结算类型代码：" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="form.code"
                  disabled
                />
              </el-form-item>
              <el-form-item label="结算类型名称：" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="form.name"
                  maxlength="50"
                  show-word-limit
                  clearable
                />
              </el-form-item>
              <el-form-item label="结算类别：" prop="category">
                <fetch-select
                  :request="() => fetchOptions('CheckoutCategoryEnum')"
                  v-model="form.category"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否app展示描述：" prop="appShow">
                <el-input
                  v-model="appShowText"
                  placeholder="否"
                  disabled
                />
              </el-form-item>
              <el-form-item label="排序：" prop="sort">
                <el-input
                  type="number"
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
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button> -->
        <el-button size="small" @click="handleBack">取消</el-button>
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
  sort: null,
  remark: '',
  category: [],
  appShow: null,
};

export default {
  name: 'checkoutTypeEdit',
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: {
        ...form
      },
      originalForm: { ...form },
      rules: {
        code: [
          { required: false, message: '请输入结算类型代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入结算类型名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
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
  computed: {
    appShowText () {
      return this.form.appShow ? '是' : '否';
    }
  },
  mounted () {
    this.getDetailData();
  },
  beforeRouteLeave (to, from, next) {
    if (JSON.stringify(this.form) === JSON.stringify(this.originalForm)) {
      next();
    } else {
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
      const id = this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['结算类型管理', `${id ? '编辑' : '新增'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      // 只在新增时设置 appShow = 1
      const id = this.$route.query.id;
      if (!id) {
        this.form.appShow = 1; // 新增时设置为1
      }
      this.form.sort = Number(this.form.sort);
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
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        ownerId: userInfo.userId,
        ownerName: userInfo.userName,
        dealerName: userInfo.orgPostUserList.find(item => item.position === '1')?.orgName,
      };
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
