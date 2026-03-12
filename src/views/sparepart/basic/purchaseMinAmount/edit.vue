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
              <el-form-item label="采购申请单类型" prop="purchaseOrderType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="purchase_order_type"
                  v-model="form.purchaseOrderType"
                  placeholder="请选择"
                  clearable
                  filterable
                  :disabled="isEditing"
                />
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="purchase_min_amount_type"
                  v-model="form.type"
                  placeholder="请选择"
                  clearable
                  filterable
                  :disabled="isEditing"
                />
              </el-form-item>
              <el-form-item label="门店" prop="dealerCode" v-if="form.type == '1'">
                <el-select
                  style="width: 305px;"
                  v-model="form.dealerCode"
                  filterable
                  clearable
                  remote
                  :disabled="this.$route.query.id"
                  placeholder="请选择"
                  :remote-method="getStoreByName"
                  @change="handleStoreChange"
                  collapse-tags
                  >
                  <el-option
                    v-for="item in storeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="起订金额" prop="minimumAmount">
                <el-input
                  placeholder="请输入"
                  v-model="form.minimumAmount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="生效开始日期">
                <el-date-picker
                  v-model="form.effectiveStartDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="StatusEnum"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                  disabled
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/purchaseMinAmount/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  purchaseOrderType: '',
  type: '',
  dealerCode: '',
  dealerName: '',
  minimumAmount: '',
  effectiveStartDate: '',
  status: '1',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  statusDesc: '',
  dataSource: '',
};

export default {
  name: 'purchaseMinAmountEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件起订金额设置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchaseMinAmount',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      storeOptions: [],
      rules: {
        purchaseOrderType: [
          { required: true, message: '请选择采购申请单类型', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        minimumAmount: [
          { required: true, message: '请输入起订金额', trigger: 'change' }
        ],
        effectiveStartDate: [
          { required: true, message: '请输入生效开始日期', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
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
    this.isEditing = !!this._id;
    console.log(this.isEditing);
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件起订金额设置', `${id ? '详情' : '新建'}`]);
      }
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
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 门店
    getStoreByName (query) {
      listOrgStoreInfo({
        name: query
      }).then(res => {
        this.storeOptions = res?.map(item => {
          return {
            ...item,
            value: item.orgCode,
            label: item.orgName
          };
        });
      });
    },

    // 处理选择门店时拿到所有的数据
    handleStoreChange (val) {
      // 根据 value 在 storeOptions 中查找完整的对象
      const selectedItem = this.storeOptions.find(item => item.orgCode === val);
      this.storeParams = {
        dealerCode: selectedItem.orgCode,
        dealerName: selectedItem.orgName,
        categorySpareId: this.partsId
      };
      // 给form dealerName赋值
      this.form.dealerName = selectedItem.orgName;
    }
  }
};
</script>
