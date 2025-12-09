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
              <el-form-item label="维修类型代码" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="类别">
                <fetch-select
                 :request="fetchOptions"
                  enumCode="mc_type_category"
                  v-model="form.category"
                  placeholder="请选择"
                  clearable
                  @change="handleCategoryChange"
                />
              </el-form-item>
              <el-form-item label="维修类型名称" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="form.name"
                  clearable
                  maxLength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="结算类型名称" prop="checkoutTypeName">
                <el-select
                  v-model="form.checkoutTypeName"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  :disabled="form.category == 10"
                  @change="handleSettlementChange"
                  :remote-method="settlementSearch"
                  :loading="settlementLoading">
                  <el-option
                    v-for="item in settlementOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input
                  type="number"
                  placeholder="请输入"
                  v-model="form.sort"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                  maxLength="500"
                  show-word-limit
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/repairItemType/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import { listSettlementType } from '@/api/maintain/basic/checkoutType';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  category: null,
  name: '',
  sort: null,
  remark: '',
  checkoutTypeId: null,
  checkoutTypeName: '',
};

export default {
  name: 'repairItemTypeEdit',
  mixins: [routeGuard, permissions],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      moduleKey: 'AISMC-repairItemType',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      settlementLoading: false, // 结算类型搜索加载状态
      settlementOptions: [], // 结算类型选项列表
      settlementTimer: null, // 结算类型搜索防抖定时器
      form: {
        ...form
      },
      originalForm: { ...form },
      rules: {
        code: [
          { required: false, message: '请输入维修类型代码', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择维修类别', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入维修类型名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '' || value === null || value === undefined) {
                callback(new Error('请输入排序'));
                return;
              }

              // 检查是否是数字
              const num = Number(value);
              if (isNaN(num)) {
                callback(new Error('排序必须为数字'));
                return;
              }

              // 检查是否是整数
              if (!Number.isInteger(num)) {
                callback(new Error('排序必须为整数'));
                return;
              }

              // 检查是否是正整数
              if (num <= 0) {
                callback(new Error('排序必须为正整数'));
                return;
              }

              // 检查是否过大（可选）
              if (num > 9999) {
                callback(new Error('排序不能超过9999'));
                return;
              }

              callback();
            },
          }
        ],
        checkoutTypeId: [
          { required: false, message: '请选择结算类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ]
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['维修类型', `${id ? '编辑' : '新建'}`]);
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
    },
    // 处理维修类别选择变更事件 如果选择为10（保修），则清空结算类型
    handleCategoryChange (val) {
      if (val === 10) {
        this.form.checkoutTypeId = '';
        this.form.checkoutTypeName = '';
      }
    },
    // 处理结算类型选择变更事件
    handleSettlementChange (val) {
      const selectedVal = this.settlementOptions.find(option => option.value === val);
      if (selectedVal) {
        this.form.checkoutTypeName = selectedVal.label;
        this.form.checkoutTypeId = val;
      }
    },
    // 结算类型模糊搜索方法（带防抖）
    async settlementSearch (query) {
      if (query !== '' && query.length < 2) {
        this.settlementOptions = [];
        return;
      }

      // 防抖处理，避免频繁请求
      if (this.settlementTimer) {
        clearTimeout(this.settlementTimer);
      }

      this.settlementTimer = setTimeout(async () => {
        this.settlementLoading = true;
        try {
          // 调用搜索接口，传递搜索关键词
          const res = await listSettlementType({ name: query });
          if (res) {
            this.settlementOptions = res?.map(item => ({
              value: item.id, // 结算类型ID
              label: item.name // 结算类型名称
            }));
          } else {
            this.settlementOptions = [];
          }
        } catch (error) {
          this.settlementOptions = [];
          this.$message.error('搜索失败');
        } finally {
          this.settlementLoading = false;
        }
      }, 300); // 300ms防抖延迟
    },
  }
};
</script>
