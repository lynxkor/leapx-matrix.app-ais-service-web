<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="VRT名称" prop="vrtId">
                <list-select
                  v-if="!this.$route.query.id||form.id"
                  listUrl="/claimreturn/claim/web/basic/vrt/list"
                  placeholder="请选择"
                  v-model="form.vrtId"
                  query-key="vrtNameLike"
                  auto-load-options
                  no-param-load
                  filterable
                  clearable
                  :params="{}" />
              </el-form-item>
              <el-form-item label="VFG编码" prop="vfgCode">
                <el-input
                  placeholder="请输入"
                  :disabled="form.id!==''"
                  v-model="form.vfgCode"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
              <el-form-item label="VFG名称" prop="vfgName">
                <el-input
                  placeholder="请输入"
                  v-model="form.vfgName"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')"
                   :loading="submitLoading">保存
        </el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/vfg';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import ListSelect from '@/libs/components/list-select/index.vue';
const defaultForm = {
  // 多选时字段有变化，自行修复
  vfgCode: '',
  vfgName: '',
  vrtCode: '',
  vrtName: '',
  status: '',
  createTime: '',
  modifierName: '',
  id: null,
  creator: '',
  creatorName: '',
  modifier: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  dataSource: '',
  vrtId: '',
};

export default {
  name: 'vfgEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions],
  components: {
    ListSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-vfg',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        vfgCode: [
          { required: true, message: '请输入VFG编码', trigger: 'blur' }
        ],
        vfgName: [
          { required: true, message: '请输入VFG名称', trigger: 'blur' }
        ],
        vrtId: [
          { required: true, message: '请输入VRT名称', trigger: 'blur' }
        ]
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['VFG', `${id ? '编辑' : '新建'}`]);
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
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
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
    },
    async fetchVrt () {
    }
  }
};
</script>
