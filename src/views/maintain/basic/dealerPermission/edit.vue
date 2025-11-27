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
              <el-form-item label="建店类型代码" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="权限类型" prop="permissionType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="mc_permission_type"
                  v-model="form.permissionType"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="结算类型名称" prop="checkoutTypeId">
                <el-select
                  v-model="form.checkoutTypeName"
                  filterable
                  clearable
                  remote
                  reserve-keyword
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
              <el-form-item label="建店类型" prop="dealerType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="mc_dealer_type"
                  v-model="form.dealerType"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="保修类型名称" prop="repairItemTypeName">
                <el-select
                  v-model="form.repairItemTypeName"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  @change="handleRepairItemChange"
                  :remote-method="repairItemSearch"
                  :loading="repairItemLoading">
                  <el-option
                    v-for="item in repairItemOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerPermission/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import { listSettlementType } from '@/api/maintain/basic/checkoutType';
import { listItem } from '@/api/maintain/basic/repairItemType';
import routeGuard from '@/libs/mixins/routeGuard';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  permissionType: '',
  dealerType: '',
  checkoutTypeName: '',
  repairItemTypeName: '',
  remark: '',
  checkoutTypeId: '',
  repairItemTypeId: '',
};

export default {
  name: 'dealerPermissionEdit',
  mixins: [routeGuard],
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    FetchSelect,
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      settlementLoading: false, // 结算类型搜索加载状态
      settlementOptions: [], // 结算类型选项列表
      settlementTimer: null, // 结算类型搜索防抖定时器
      repairItemLoading: false, // 维修类型搜索加载状态
      repairItemOptions: [], // 维修类型选项列表
      repairItemTimer: null, // 维修类型搜索防抖定时器
      rules: {
        code: [
          { required: false, message: '请输入建店类型代码', trigger: 'blur' }
        ],
        permissionType: [
          { required: true, message: '请选择权限类型', trigger: 'change' }
        ],
        dealerType: [
          { required: true, message: '请选择建店类型', trigger: 'change' }
        ],
        checkoutTypeName: [
          { required: true, message: '请选择结算类型名称', trigger: 'change' }
        ],
        repairItemTypeName: [
          { required: false, message: '请选择维修类型名称', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店施工单权限管理', `${id ? '编辑' : '新建'}`]);
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
    // 处理结算类型选择变更事件
    handleSettlementChange (val) {
      const selectedVal = this.settlementOptions.find(option => option.value === val);
      if (selectedVal) {
        this.form.checkoutTypeId = selectedVal.value;
        this.form.checkoutTypeName = selectedVal.label;
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
    // 处理维修类型选择变更事件
    handleRepairItemChange (val) {
      const selectedVal = this.repairItemOptions.find(option => option.value === val);
      if (selectedVal) {
        this.form.repairItemTypeId = selectedVal.value;
        this.form.repairItemTypeName = selectedVal.label;
      }
    },
    // 维修类型模糊搜索方法（带防抖）
    async repairItemSearch (query) {
      if (query !== '' && query.length < 2) {
        this.repairItemOptions = [];
        return;
      }

      // 防抖处理，避免频繁请求
      if (this.repairItemTimer) {
        clearTimeout(this.repairItemTimer);
      }

      this.repairItemTimer = setTimeout(async () => {
        this.repairItemLoading = true;
        try {
          // 调用搜索接口，传递搜索关键词
          const res = await listItem({ name: query });
          console.log('res', res);
          if (res) {
            this.repairItemOptions = res?.map(item => ({
              value: item.id, // 维修类型ID
              label: item.name // 维修类型名称
            }));
          } else {
            this.repairItemOptions = [];
          }
        } catch (error) {
          this.repairItemOptions = [];
          this.$message.error('搜索失败');
        } finally {
          this.repairItemLoading = false;
        }
      }, 300); // 300ms防抖延迟
    }
  }
};
</script>
