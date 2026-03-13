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
              <el-form-item label="结算类型" prop="checkoutTypeId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.checkoutTypeId"
                  :remote-method="settlementSearch"
                  :params="form.checkoutTypeName"
                  @change="handleSettlementChange"
                  value-key="id"
                  label-key="nameAndCategory"
                />
              </el-form-item>
              <el-form-item label="建店类型" prop="dealerType">
                <el-cascader
                  class="cascader"
                  v-model="form.dealerType"
                  :options="storeTypeOptions"
                  @change="handleCascaderChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="保修类型" prop="repairItemTypeId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  v-model="form.repairItemTypeId"
                  :remote-method="repairItemSearch"
                  :params="form.repairItemTypeName"
                  @change="handleRepairItemChange"
                  value-key="id"
                  label-key="name"
                  :disabled="!form.checkoutTypeId"
                />
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
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerPermission/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, getBuildType } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import { listSettlementType } from '@/api/maintain/basic/checkoutType';
import { listItem } from '@/api/maintain/basic/repairItemType';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

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
  mixins: [routeGuard, permissions],
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
      moduleKey: 'AISMC-dealerPermission',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      storeTypeOptions: [], // 建店类型选项
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
        checkoutTypeId: [
          { required: true, message: '请选择结算类型名称', trigger: 'change' }
        ],
        repairItemTypeId: [
          { required: true, message: '请选择维修类型名称', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
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
    this.getStore();
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店施工单权限', `${id ? '编辑' : '新建'}`]);
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
    // 处理建店类型选择变更事件
    async getStore () {
      const res = await getBuildType();
      this.storeTypeOptions = res || [];
    },
    handleCascaderChange (value) {
      if (value && value.length > 0) {
        // 获取最后一级的ID
        const lastValue = value[value.length - 1];
        this.form.dealerType = lastValue;

        // 如果需要保留完整路径（用于显示）
        this.form.dealerTypeArray = value;
      } else {
        this.form.dealerType = '';
        this.form.dealerTypeArray = [];
      }

      // 触发其他业务逻辑
      this.handleChange(this.form.dealerType);
    },

    handleChange (selectedId) {
      // 你的业务逻辑，接收最后一级的ID
      this.form.dealerType = selectedId;
    },
    // 处理结算类型选择变更事件
    handleSettlementChange (val, record) {
      if (record) {
        this.form.checkoutTypeName = record.name;
      }
      this.form.repairItemTypeId = null; // 清空 ID
      this.form.repairItemTypeName = ''; // 如果有对应的名称字段，也一并清空
      this.repairItemSearch();
    },
    // 结算类型模糊搜索方法
    async settlementSearch (query) {
      return listSettlementType({ nameLike: query });
    },
    // 处理维修类型选择变更事件
    handleRepairItemChange (val, record) {
      if (record) {
        this.form.repairItemTypeName = record.name;
      }
    },
    // 维修类型模糊搜索方法
    async repairItemSearch () {
      if (!this.form.checkoutTypeId) {
        return []; // 如果没有结算类型，直接返回空数组，不请求接口
      }
      return listItem({ checkoutTypeId: this.form.checkoutTypeId});
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

<style lang="scss" scoped>
.cascader {
  width: 100%;
}
</style>
