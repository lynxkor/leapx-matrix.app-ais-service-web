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
              <el-form-item label="班组代码" prop="code">
                <el-input
                  placeholder="自动生成"
                  v-model="form.code"
                  disabled
                  clearable
                />
              </el-form-item>
              <el-form-item label="班组名称" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="form.name"
                  maxlength="50"
                  show-word-limit
                  clearable
                />
              </el-form-item>
              <el-form-item label="班组类型" prop="teamType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="mc_station_type"
                  v-model="form.teamType"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店名称" prop="dealerName">
                <InputLink
                  v-model="form.dealerName"
                  :link="`/partner/channelManagement/shopBasicsMessageDetails?num=2&id=${form.dealerId}&_blank=true`"
                  placeholder="请输入"
                  readonly
                />
              </el-form-item>
              <el-form-item label="负责人" prop="ownerName">
                <InputLink
                  v-model="form.ownerName"
                  :link="`/partner/user/list/detail?&userId=${form.ownerId}`"
                  placeholder="请输入"
                  readonly
                />
              </el-form-item>
              <el-form-item label="说明" prop="remark" class="form-item-full">
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
        <section class="common-section">
          <div class="common-section-header">
            <h2>维修工程师信息</h2>
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
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button> -->
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerWorkTeam/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import { getEnum, getUserByNameOrNo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import InputLink from '@/libs/components/InputLink';

const defaultForm = {
  code: '',
  name: '',
  teamTypeDesc: '',
  statusDesc: '',
  dealerName: '',
  remark: '',
  status: '',
  teamType: '',
  dealerId: '',
  dealerCode: '',
  ownerOrgId: '',
  ownerId: '',
  ownerName: '',
  userRelations: '',
};

export default {
  name: 'dealerWorkTeamEdit',
  mixins: [routeGuard, permissions],
  components: {
    FetchSelect,
    EditTable,
    InputLink
  },
  data () {
    const form = this.getDefautlForm();
    return {
      moduleKey: 'AISMC-dealerWorkTeam',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        userName: '',
        userId: '',
        createTime: ''
      },
      tableData: [
        // { userName: '张三', userId: 25, createTime: '' },
      ],
      options: {
        userName: []
      },
      columns: [
        {
          field: 'userName',
          title: '姓名',
          width: '30%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择姓名',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: '姓名不能为空' }
          ]
        },
        {
          field: 'userId',
          title: '工号',
          width: '25%',
          editRender: { name: 'ElInput', props: { type: 'number' } },
          rules: [
            { required: true, message: '工号不能为空' }
          ]
        },
        {
          field: 'createTime',
          title: '创建时间',
          // width: '20%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        code: [
          { required: false, message: '请输入班组代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入班组名称', trigger: 'blur' },
          { min: 0, max: 50, message: '最多50个字符', trigger: 'blur' }
        ],
        teamTypeDesc: [
          { required: true, message: '请选择班组类型描述', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择班组状态描述', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择班组状态', trigger: 'change' }
        ],
        teamType: [
          { required: true, message: '请选择类型TeamTypeEnum', trigger: 'change' }
        ],
        dealerId: [
          { required: true, message: '请输入门店ID', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属组织ID', trigger: 'blur' }
        ],
        ownerId: [
          { required: true, message: '请输入负责人ID', trigger: 'blur' }
        ],
        ownerName: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ],
        userRelations: [
          { required: true, message: '请输入维修工程师列表', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['厅店班组信息', `${id ? '编辑' : '新增'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
          this.tableData = res.userRelations;
        });
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            addOrUpdate({ ...this.form, teamUsers: tableData }).then(res => {
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
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
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
    },
    querySearchAsync (queryString, cb) {
      getUserByNameOrNo({ name: queryString }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.userId,
            label: item.username,
            userName: item.username
          };
        }) || [];
        this.options.userName = list;
      });
    }
  }
};
</script>
