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
              <el-form-item label="单位代码" prop="code">
                <el-input
                  placeholder="自动生成"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="单位名称" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="form.name"
                  clearable
                />
              </el-form-item>
              <el-form-item label="统一社会信用代码" prop="buinessLicense">
                <el-input
                  placeholder="请输入"
                  v-model="form.buinessLicense"
                  clearable
                />
              </el-form-item>
              <el-form-item label="负责人" prop="ownerUserName">
                <el-input
                  placeholder="请输入"
                  v-model="form.ownerUserName"
                  clearable
                  disabled
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button> -->
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/batteryUnit/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  name: '',
  buinessLicense: '',
  statusDesc: '',
  ownerName: '',
  createTime: '',
  updateTime: '',
  status: '',
  ownerId: '',
};

export default {
  name: 'batteryUnitEdit',
  mixins: [routeGuard, permissions],
  components: {
    // FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      moduleKey: 'AISMC-batteryUnit',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: this.getDefautlForm(),
      originalForm: { ...form },
      rules: {
        code: [
          { required: false, message: '请输入单位代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        buinessLicense: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态描述', trigger: 'change' }
        ],
        ownerName: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择工位状态', trigger: 'change' }
        ],
        ownerId: [
          { required: true, message: '请输入负责人ID', trigger: 'blur' }
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
      const id = this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['电池去向单位', `${id ? '编辑' : '新建'}电池去向单位`]);
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
      this.form = this.getDefautlForm();
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        ownerId: userInfo.userId,
        ownerName: userInfo.userName,
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
