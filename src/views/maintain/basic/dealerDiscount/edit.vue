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
              <el-form-item label="优惠代码：" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="优惠名称：" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="form.name"
                  clearable
                  maxLength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="门店名称：" prop="dealerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="工时折扣率" prop="discountWorkhourRate">
                <el-input
                  placeholder="请输入"
                  v-model="form.discountWorkhourRate"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备件折扣率" prop="discountPartRate">
                <el-input
                  placeholder="请输入"
                  v-model="form.discountPartRate"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>可使用对象</h2>
            <el-button size="small" icon="el-icon-plus" @click="handleAddRow">添加</el-button>
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
              />
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <!-- <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button> -->
        <el-button size="small" @click="handleBack">取消</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerDiscount/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import { getEnum, getUserByNameOrNo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  name: '',
  dealerName: '',
  discountWorkhourRate: '',
  discountPartRate: '',
};

export default {
  name: 'dealerDiscountEdit',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    FetchSelect,
    EditTable
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
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, userName: '张三', createTime: '' },
        { id: 2, userName: '李四', createTime: '' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
        userName: [],
      },
      columns: [
        {
          field: 'userName',
          title: '账号',
          width: '40%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择账号',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '40%',
          editRender: { name: 'ElInput' }
        }
      ],
      rules: {
        code: [
          { required: false, message: '请输入优惠代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入优惠名称', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        discountWorkhourRate: [
          { required: true, message: '请输入工时折扣率:介入0-1之间，包含0、1', trigger: 'blur' }
        ],
        discountPartRate: [
          { required: true, message: '请输入备件折扣率:介入0-1之间，包含0、1', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店优惠模式管理', `${id ? '编辑' : '新增'}`]);
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
            value: item.userId,
            label: item.username,
            ...item
          };
        }) || [];
        this.options.userName = list;
      });
    }
  }
};
</script>
