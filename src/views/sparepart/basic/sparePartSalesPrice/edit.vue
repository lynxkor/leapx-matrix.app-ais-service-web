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
              <el-form-item label="备件编码">
                <fetch-select
                  prop="sparePartCode"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  v-model="form.sparePartCode"
                  :remote-method="listSparePart"
                  :disabled="this.$route.query.id"
                  value-key="id"
                  label-key="name"
                  @change="listSparePartChange"
                />
              </el-form-item>
              <el-form-item label="备件名称" prop="sparePartName">
                <el-input
                  placeholder="请输入"
                  v-model="form.sparePartName"
                  disabled="true"
                  clearable
                />
              </el-form-item>
              <el-form-item label="销售价格" prop="dealerSalesPrice">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerSalesPrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="生效开始日期">
                <el-date-picker
                  v-model="form.effectiveStartDate"
                  :picker-options="effectiveStartDate"
                  range-separator="至"
                  value-format="yyyy-MM-dd HH:mm:ss"
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePartSalesPrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  sparePartCode: '',
  sparePartName: '',
  dealerSalesPrice: '',
  effectiveStartDate: '',
};

export default {
  name: 'sparePartSalesPriceEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions],
  components: {
    FetchSelect
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePartSalesPrice',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        sparePartCode: [
          { required: true, message: '请输入备件编码', trigger: 'blur' }
        ],
        sparePartName: [
          { required: true, message: '请输入备件名称', trigger: 'blur' }
        ],
        dealerSalesPrice: [
          { required: true, message: '请输入销售价格', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // 非必填，允许为空
              if (value === null || value === undefined || value === '') {
                callback();
                return;
              }
              // 转换为数字
              const num = Number(value);
              // 检查转换是否有效
              if (isNaN(num)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              // 根据需求选择条件：
              // 1. 大于0的整数：num > 0
              // 2. 大于等于0的整数：num >= 0
              if (num <= 0) {
                callback(new Error('请输入大于0的数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        effectiveStartDate: [
          { required: true, message: '请输入生效开始日期', trigger: 'blur' }
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

    async listSparePart (query) {
      var a = await getSparePart({ partCodeOrNameLike: query });
      return a;
    },
    listSparePartChange (val, all) {
      this.form.sparePartId = all.id;
      this.form.sparePartCode = all.code;
      this.form.sparePartName = all.name;
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件销售价格', `${id ? '编辑' : '新建'}`]);
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
    }
  }
};
</script>
