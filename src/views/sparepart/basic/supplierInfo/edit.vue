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
              <el-form-item label="供应商编码" prop="supplierCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="供应商简称" prop="supplierShortName">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierShortName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态变更描述" prop="statusDesc">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.statusDesc"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  v-model="form.createTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
              <el-form-item label="修改时间" prop="updateTime">
                <el-date-picker
                  v-model="form.updateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
              <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creator"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者名称" prop="creatorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者名称" prop="modifierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="数据来源，140:新销服; 老销服:10" prop="dataSource">
                <el-input
                  placeholder="请输入"
                  v-model="form.dataSource"
                  clearable
                />
              </el-form-item>
              <el-form-item label="拼音简码" prop="pinyinCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.pinyinCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="供应商类型" prop="supplierType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.supplierType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="是否OEM" prop="oemFlag">
                <el-input
                  placeholder="请输入"
                  v-model="form.oemFlag"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店ID（组织ID）" prop="dealerId">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店编码（组织code）" prop="dealerCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店名称（组织名称）" prop="dealerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerName"
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
              <el-form-item label="供应商安全库存系数" prop="supplierSafetyStock">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierSafetyStock"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国家code" prop="countryCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.countryCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国家" prop="countryName">
                <el-input
                  placeholder="请输入"
                  v-model="form.countryName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="省code" prop="provinceCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.provinceCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="省" prop="provinceName">
                <el-input
                  placeholder="请输入"
                  v-model="form.provinceName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="市code" prop="cityCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.cityCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="市" prop="cityName">
                <el-input
                  placeholder="请输入"
                  v-model="form.cityName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="区&#x2F;县编码" prop="districtCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.districtCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="区&#x2F;县名称" prop="districtName">
                <el-input
                  placeholder="请输入"
                  v-model="form.districtName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input
                  placeholder="请输入"
                  v-model="form.address"
                  clearable
                />
              </el-form-item>
              <el-form-item label="省市区+详细地址" prop="fullAddress">
                <el-input
                  placeholder="请输入"
                  v-model="form.fullAddress"
                  clearable
                />
              </el-form-item>
              <el-form-item label="联系人姓名" prop="contactName">
                <el-input
                  placeholder="请输入"
                  v-model="form.contactName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="联系人电话" prop="contactPhone">
                <el-input
                  placeholder="请输入"
                  v-model="form.contactPhone"
                  clearable
                />
              </el-form-item>
              <el-form-item label="联系人邮箱" prop="contactEmail">
                <el-input
                  placeholder="请输入"
                  v-model="form.contactEmail"
                  clearable
                />
              </el-form-item>
              <el-form-item label="联系人传真" prop="contactFax">
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
  countryCode: '',
  countryName: '',
  provinceCode: '',
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
  mixins: [routeGuard, permissions],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-supplierInfo',
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
        supplierShortName: [
          { required: true, message: '请输入供应商简称', trigger: 'blur' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
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
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        pinyinCode: [
          { required: true, message: '请输入拼音简码', trigger: 'blur' }
        ],
        supplierType: [
          { required: true, message: '请选择供应商类型', trigger: 'change' }
        ],
        oemFlag: [
          { required: true, message: '请输入是否OEM', trigger: 'blur' }
        ],
        dealerId: [
          { required: true, message: '请输入门店ID（组织ID）', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'blur' }
        ],
        supplierLevel: [
          { required: true, message: '请输入供应商等级', trigger: 'blur' }
        ],
        supplierSafetyStock: [
          { required: true, message: '请输入供应商安全库存系数', trigger: 'blur' }
        ],
        countryCode: [
          { required: true, message: '请输入国家code', trigger: 'blur' }
        ],
        countryName: [
          { required: true, message: '请输入国家', trigger: 'blur' }
        ],
        provinceCode: [
          { required: true, message: '请输入省code', trigger: 'blur' }
        ],
        provinceName: [
          { required: true, message: '请输入省', trigger: 'blur' }
        ],
        cityCode: [
          { required: true, message: '请输入市code', trigger: 'blur' }
        ],
        cityName: [
          { required: true, message: '请输入市', trigger: 'blur' }
        ],
        districtCode: [
          { required: true, message: '请输入区&#x2F;县编码', trigger: 'blur' }
        ],
        districtName: [
          { required: true, message: '请输入区&#x2F;县名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        fullAddress: [
          { required: true, message: '请输入省市区+详细地址', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        contactEmail: [
          { required: true, message: '请输入联系人邮箱', trigger: 'blur' }
        ],
        contactFax: [
          { required: true, message: '请输入联系人传真', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', `${id ? '编辑' : '新建'}`]);
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
