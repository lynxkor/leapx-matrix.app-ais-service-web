<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="供应商编码" prop="supplierCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierCode"
                  clearable
                  :disabled="this.$route.query.id"
                />
              </el-form-item>
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierName"
                  @change="handleSupplierNameChange()"
                  clearable
                />
              </el-form-item>
              <el-form-item label="拼音简码">
                <el-input
                  placeholder="保存后自动生成"
                  v-model="form.pinyincode"
                  clearable
                  disabled="true"
                />
              </el-form-item>
              <el-form-item label="供应商简称" prop="supplierShortName">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierShortName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国家" prop="countryName">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="CountryEnum"
                  v-model="form.countryCode"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="省市区" prop="provinceCode"
              v-if="oem"
              >
                <el-cascader
                  placeholder="请选择省市区"
                  v-model="form.provinceCityCountyCode"
                  :props="orgProps"
                  :options="areaOptions"
                  filterable
                  clearable>
                </el-cascader>
              </el-form-item>
              <el-form-item label="地址" prop="address"
              v-if="oem">
                <el-input
                  placeholder="请输入"
                  v-model="form.address"
                  clearable
                />
              </el-form-item>
              <el-form-item label="供应商等级" prop="supplierLevel">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierLevel"
                  clearable
                />
              </el-form-item>
              <el-form-item label="联系人姓名" prop="contactName"
              v-if="oem">
                <el-input
                  placeholder="请输入"
                  v-model="form.contactName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="联系人电话" prop="contactPhone"
              v-if="oem">
                <el-input
                  placeholder="请输入"
                  v-model="form.contactPhone"
                  clearable
                />
              </el-form-item>
              <el-form-item label="联系人邮箱" prop="contactEmail"
              v-if="oem">
                <el-input
                  placeholder="请输入"
                  v-model="form.contactEmail"
                  clearable
                />
              </el-form-item>
              <el-form-item label="联系人传真" prop="contactFax"
              v-if="oem">
                <el-input
                  placeholder="请输入"
                  v-model="form.contactFax"
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/supplierInfo/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  supplierCode: '',
  supplierName: '',
  supplierShortName: '',
  statusDesc: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  dataSource: '',
  pinyinCode: '',
  supplierType: '',
  oemFlag: '',
  dealerId: '',
  dealerCode: '',
  dealerName: '',
  supplierLevel: '',
  supplierSafetyStock: '',
  countryCode: 'CN',
  countryName: '中国',
  provinceCityCountyCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  fullAddress: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  contactFax: '',
  areaCode: [],
};

export default {
  name: 'supplierInfoEdit',
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
  },
  data () {
    const form = this.getDefautlForm();
    return {
      oem: false,
      areaOptions: JSON.parse(localStorage.areaTree),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-supplierInfo',
      pageType: 'edit',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        supplierCode: [
          { required: true, message: '请输入供应商编码', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        // supplierShortName: [
        //   { required: true, message: '请输入供应商简称', trigger: 'blur' }
        // ],
        // statusDesc: [
        //   { required: true, message: '请选择状态变更描述', trigger: 'change' }
        // ],
        // createTime: [
        //   { required: true, message: '请选择创建时间', trigger: 'change' }
        // ],
        // updateTime: [
        //   { required: true, message: '请选择修改时间', trigger: 'change' }
        // ],
        // id: [
        //   { required: true, message: '请输入主键', trigger: 'blur' }
        // ],
        // creator: [
        //   { required: true, message: '请输入创建者', trigger: 'blur' }
        // ],
        // creatorName: [
        //   { required: true, message: '请输入创建者名称', trigger: 'blur' }
        // ],
        // modifier: [
        //   { required: true, message: '请输入修改者', trigger: 'blur' }
        // ],
        // modifierName: [
        //   { required: true, message: '请输入修改者名称', trigger: 'blur' }
        // ],
        // remark: [
        //   { required: true, message: '请输入备注', trigger: 'blur' }
        // ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        // dataSource: [
        //   { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        // ],
        // pinyinCode: [
        //   { required: true, message: '请输入拼音简码', trigger: 'blur' }
        // ],
        // supplierType: [
        //   { required: true, message: '请选择供应商类型', trigger: 'change' }
        // ],
        // oemFlag: [
        //   { required: true, message: '请输入是否OEM', trigger: 'blur' }
        // ],
        // dealerId: [
        //   { required: true, message: '请输入门店ID（组织ID）', trigger: 'blur' }
        // ],
        // dealerCode: [
        //   { required: true, message: '请输入门店编码（组织code）', trigger: 'blur' }
        // ],
        // dealerName: [
        //   { required: true, message: '请输入门店名称（组织名称）', trigger: 'blur' }
        // ],
        // supplierLevel: [
        //   { required: true, message: '请输入供应商等级', trigger: 'blur' }
        // ],
        // supplierSafetyStock: [
        //   { required: true, message: '请输入供应商安全库存系数', trigger: 'blur' }
        // ],
        // countryCode: [
        //   { required: true, message: '请输入国家code', trigger: 'blur' }
        // ],
        // countryName: [
        //   { required: true, message: '请输入国家', trigger: 'blur' }
        // ],
        // provinceCode: [
        //   { required: true, message: '请输入省code', trigger: 'blur' }
        // ],
        // provinceName: [
        //   { required: true, message: '请输入省', trigger: 'blur' }
        // ],
        // cityCode: [
        //   { required: true, message: '请输入市code', trigger: 'blur' }
        // ],
        // cityName: [
        //   { required: true, message: '请输入市', trigger: 'blur' }
        // ],
        // districtCode: [
        //   { required: true, message: '请输入区&#x2F;县编码', trigger: 'blur' }
        // ],
        // districtName: [
        //   { required: true, message: '请输入区&#x2F;县名称', trigger: 'blur' }
        // ],
        // address: [
        //   { required: true, message: '请输入详细地址', trigger: 'blur' }
        // ],
        // fullAddress: [
        //   { required: true, message: '请输入省市区+详细地址', trigger: 'blur' }
        // ],
        // contactName: [
        //   { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        // ],
        // contactPhone: [
        //   { required: true, message: '请输入联系人电话', trigger: 'blur' }
        // ],
        // contactEmail: [
        //   { required: true, message: '请输入联系人邮箱', trigger: 'blur' }
        // ],
        // contactFax: [
        //   { required: true, message: '请输入联系人传真', trigger: 'blur' }
        // ],
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
    this.oem = this.$store.state.pageSource?.aisPageSource.includes('AISPART-sparePart-oem');
  },
  methods: {

    handleSupplierNameChange () {
      console.log('handleSupplierNameChange');
      this.form.pinyinCode = this.form.supplierName;
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['供应商主数据', `${id ? '编辑' : '新建'}`]);
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
