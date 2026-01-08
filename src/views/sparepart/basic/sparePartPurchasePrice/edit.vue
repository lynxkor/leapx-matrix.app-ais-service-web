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
              <!-- <el-form-item label="价格序号">
                <el-input
                  placeholder=""
                  disabled="true"
                  v-model="form.id"
                  clearable
                />
              </el-form-item> -->
              <el-form-item label="定价模式">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="PricingModelEnum"
                  v-model="form.pricingModel"
                  placeholder="请选择"
                  clearable
                  :disabled="this.$route.query.id"
                  filterable
                />
              </el-form-item>
              <el-form-item label="门店" prop="dealerCode" v-if="form.pricingModel != 'standardPrice'">
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
              <el-form-item label="备件编码" prop="sparePartCode"  v-if="form.pricingModel != 'dealerPriceRatio'">
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
              <el-form-item label="备件名称"  v-if="form.pricingModel != 'dealerPriceRatio'">
                <el-input
                  placeholder="请输入"
                  v-model="form.sparePartName"
                  disabled="true"
                  clearable
                />
              </el-form-item>
              <el-form-item label="采购价格" prop="dealerPurchasePrice" v-if="form.pricingModel != 'dealerPriceRatio'">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerPurchasePrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="调价比例(%)" prop="adjustmentRatio" v-if="form.pricingModel == 'dealerPriceRatio'">
                <el-input
                  placeholder="请输入"
                  v-model="form.adjustmentRatio"
                  clearable
                />
              </el-form-item>
              <el-form-item label="生效开始日期" prop="effectiveStartDate">
                <el-date-picker
                  v-model="form.effectiveStartDate"
                  :picker-options="effectiveStartDate"
                  range-separator="至"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="生效结束时间"  v-if="form.pricingModel != 'standardPrice'">
                <el-date-picker
                  v-model="form.effectiveEndDatetime"
                  disabled="true"
                  :picker-options="effectiveEndDatetime"
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePartPurchasePrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';
import DealerSelect from '@/components/dealer-select/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  sparePartCode: '',
  sparePartName: '',
  pricingModel: 'standardPrice',
  dealerPurchasePrice: '',
  dealerCode: '',
  dealerName: '',
  adjustmentRatio: '',
  effectiveStartDate: '',
  effectiveEndDatetime: '',
  invalidOperator: '',
  invalidReason: '',
  createTime: '',
  updateTime: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  sparePartId: '',
  dealerId: '',
};

export default {
  name: 'sparePartPurchasePriceEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions],
  components: {
    FetchSelect,
    DealerSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePartPurchasePrice',
      storeOptions: [],
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        sparePartCode: [
          { required: true, message: '请输入备件编码', trigger: 'blur' }
        ],
        sparePartName: [
          { required: true, message: '请输入备件名称', trigger: 'blur' }
        ],
        pricingModel: [
          { required: true, message: '请输入定价模式', trigger: 'blur' }
        ],
        dealerPurchasePrice: [
          { required: true, message: '请输入门店采购价格', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'blur' }
        ],
        adjustmentRatio: [
          { required: true, message: '请输入调价比例（%）', trigger: 'blur' }
        ],
        effectiveStartDate: [
          { required: true, message: '请输入生效开始日期', trigger: 'blur' }
        ],
        effectiveEndDatetime: [
          { required: true, message: '请选择生效结束时间', trigger: 'change' }
        ],
        invalidOperator: [
          { required: true, message: '请输入失效操作人', trigger: 'blur' }
        ],
        invalidReason: [
          { required: true, message: '请输入失效原因', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        sparePartId: [
          { required: true, message: '请输入备件ID', trigger: 'blur' }
        ],
        dealerId: [
          { required: true, message: '请输入门店ID（组织ID）', trigger: 'blur' }
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
    },
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件采购价格', `${id ? '编辑' : '新建'}`]);
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
