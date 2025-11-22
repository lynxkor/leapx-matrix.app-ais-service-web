<template>
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
              <el-form-item label="工位代码：" prop="code">
                <el-input
                  placeholder="自动生成"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="工位名称：" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="form.name"
                  maxlength="50"
                  clearable
                />
              </el-form-item>
              <el-form-item label="工位类型：" prop="stationType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="StationTypeEnum"
                  v-model="form.stationType"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店名称：" prop="dealerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerName"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="负责人：" prop="ownerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.ownerName"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="说明：" prop="remark">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                  rows="3"
                  maxlength="500"
                  show-word-limit
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerStation/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  // 多选时字段有变化，自行修复
  createTime: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  code: '',
  name: '',
  stationType: '',
  stationTypeDesc: '',
  dealerId: '',
  dealerCode: '',
  dealerName: '',
  ownerId: '',
  ownerName: '',
};

export default {
  name: 'testEdit',
  components: {
    FetchSelect,
    // EditTable
  },
  data () {
    const form = this.getDefautlForm();
    return {
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        name: [
          { required: true, message: '请输入工位名称', trigger: 'blur' }
        ],
        stationType: [
          { required: true, message: '请选择工位类型', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入说明', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['厅店工位信息', `${id ? '编辑' : '新增'}`]);
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
          addOrUpdate({ id: this.info.id, ...this.form }).then(res => {
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
