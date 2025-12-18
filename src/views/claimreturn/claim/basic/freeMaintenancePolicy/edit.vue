<template>
  <!-- TIPS: 如果填写项小于15项，使用类名page-common-add替换page-common-edit -->
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项小于15项，去掉 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="政策名称" prop="policyName">
                <el-input
                  placeholder="请输入"
                  v-model="form.policyName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="政策类型" prop="policyType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.policyType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="维修项目代码" prop="repairItemCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.repairItemCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="维修项目名称" prop="repairItemName">
                <el-input
                  placeholder="请输入"
                  v-model="form.repairItemName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="延后天数" prop="delayDays">
                <el-input
                  placeholder="请输入"
                  v-model="form.delayDays"
                  clearable
                />
              </el-form-item>
              <el-form-item label="免保时间（月）" prop="freePeriod">
                <el-input
                  placeholder="请输入"
                  v-model="form.freePeriod"
                  clearable
                />
              </el-form-item>
              <el-form-item label="延后里程" prop="delayMileage">
                <el-input
                  placeholder="请输入"
                  v-model="form.delayMileage"
                  clearable
                />
              </el-form-item>
              <el-form-item label="里程" prop="mileage">
                <el-input
                  placeholder="请输入"
                  v-model="form.mileage"
                  clearable
                />
              </el-form-item>
              <el-form-item label="工时数" prop="workhour">
                <el-input
                  placeholder="请输入"
                  v-model="form.workhour"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>区块标题</h2>
            <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="columns"
                :data="tableData"
                :defaultNewRow="defaultNewRow"
                :show-toolbar="false"
                :options="options"
                :auth="{edit: canAddOrUpdate, delete: canDelete}"
              />
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
        <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
        <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/freeMaintenancePolicy';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { uIntRule } from '@/validation/rule';

const defaultForm = {
  // 多选时字段有变化，自行修复
  policyName: '',
  repairItemCode: '',
  repairItemName: '',
  policyType: '',
  freePeriod: '',
  mileage: '',
  delayDays: '',
  delayMileage: '',
  workhour: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  repairItemId: '',
  parts: '',
};

export default {
  name: 'freeMaintenancePolicyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditTable
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-freeMaintenancePolicy',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
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
        policyName: [
          { required: true, message: '请输入政策名称', trigger: 'blur' }
        ],
        repairItemCode: [
          { required: true, message: '请输入维修项目代码', trigger: 'blur' }
        ],
        // repairItemName: [
        //   { required: true, message: '请输入维修项目名称', trigger: 'blur' }
        // ],
        policyType: [
          { required: true, message: '请选择政策类型（免费保养，终身免费保养）', trigger: 'change' }
        ],
        freePeriod: [
          { required: true, message: '请输入免保时间（月）（最小为0）', trigger: 'blur' },
          uIntRule,
        ],
        mileage: [
          { required: true, message: '请输入里程（最小为0）', trigger: 'blur' },
          uIntRule,
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['免费保养政策', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
            addOrUpdate({ ...this.form, customKey: tableData }).then(res => {
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
      } catch (error) {
        console.log(error);
      }
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
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
