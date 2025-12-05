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
              <el-form-item label="差价设置代码" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="form.code"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="车型名称" prop="vehicleModelName">
                <el-select
                  v-model="form.vehicleModelName"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请输入"
                  @change="handleModelChange"
                  :remote-method="modelSearch"
                  :loading="modelLoading">
                  <el-option
                    v-for="item in modelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单次需补差价" prop="spreadPrice">
                <el-input
                  placeholder="请输入"
                  v-model="form.spreadPrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="购买城市等级" prop="buyCityLevel">
                <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_city_level"
                    v-model="form.buyCityLevel"
                    placeholder="请选择"
                    clearable
                />
              </el-form-item>
              <el-form-item label="核销城市等级" prop="verificationCityLevel">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="mc_city_level"
                  v-model="form.verificationCityLevel"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="生效开始日期" prop="effectiveon">
                <el-date-picker
                  v-model="form.effectiveon"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" v-loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/spreadsSetting/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listVehicleModel } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import { createDebouncedSearch } from '@/utils/index.js';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  vehicleModelId: null,
  vehicleModelName: '',
  buyCityLevel: '',
  verificationCityLevel: '',
  spreadPrice: '',
  effectiveon: '',
};

// 创建防抖搜索实例
const debouncedSearch = createDebouncedSearch({
  delay: 300,
  minLength: 2,
  onError: (error) => {
    // 这里可以统一处理错误
    console.error('搜索失败:', error);
  }
});

export default {
  name: 'spreadsSettingEdit',
  // 集中视图预留
  mixins: [routeGuard, permissions],
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
      moduleKey: 'AISMC-spreadsSetting',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      modelLoading: false, // 车型搜索加载状态
      modelOptions: [], // 车型选项列表
      searchTimer: null, // 车型搜索防抖定时器
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        code: [
          { required: false, message: '请输入差价设置代码', trigger: 'blur' }
        ],
        vehicleModelName: [
          { required: true, message: '请输入车型', trigger: 'blur' }
        ],
        buyCityLevel: [
          { required: true, message: '请输入购买城市等级', trigger: 'blur' }
        ],
        verificationCityLevel: [
          { required: true, message: '请输入核销城市等级', trigger: 'blur' }
        ],
        spreadPrice: [
          { required: true, message: '请输入单次需补差价', trigger: 'blur' }
        ],
        effectiveon: [
          { required: true, message: '请选择生效开始日期', trigger: 'change' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['保养套餐差价设置管理', `${id ? '编辑' : '新建'}`]);
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
    handleModelChange (val) {
      const selectedVal = this.modelOptions.find(option => option.value === val);
      if (selectedVal) {
        this.form.vehicleModelName = selectedVal.label;
        this.form.vehicleModelId = val;
      }
    },
    // 车型模糊搜索方法（带防抖)
    async modelSearch (query) {
      await debouncedSearch.call(
        this,
        this.searchVehicleModel, // 搜索函数
        query, // 查询参数
        this.handleModelResult // 结果处理回调
      );
    },

    // 具体的搜索API调用
    async searchVehicleModel (query) {
      const res = await listVehicleModel({ name: query });
      return res;
    },

    // 处理搜索结果
    handleModelResult (result) {
      if (result) {
        this.modelOptions = result.map(item => ({
          value: item.id,
          label: item.modelName
        }));
      } else {
        this.modelOptions = [];
      }
    }
  }
};
</script>
