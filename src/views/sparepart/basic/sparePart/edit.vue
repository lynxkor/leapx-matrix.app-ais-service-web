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
              <el-form-item label="备件编码" prop="partCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.partCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备件名称" prop="partName">
                <el-input
                  placeholder="请输入"
                  v-model="form.partName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="最小订购量" prop="minOrderQuantity">
                <el-input
                  placeholder="请输入"
                  v-model="form.minOrderQuantity"
                  clearable
                />
              </el-form-item>
              <el-form-item label="销售价格" prop="salePrice">
                <el-input
                  placeholder="请输入"
                  v-model="form.salePrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="采购价格" prop="purchasePrice">
                <el-input
                  placeholder="请输入"
                  v-model="form.purchasePrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否OEM件" prop="oemPart">
                <el-input
                  placeholder="请输入"
                  v-model="form.oemPart"
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
              <el-form-item label="是否可销售" prop="saleableIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.saleableIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否常备库存件" prop="standingInventoryIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.standingInventoryIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备件工程师" prop="partsEngineer">
                <el-input
                  placeholder="请输入"
                  v-model="form.partsEngineer"
                  clearable
                />
              </el-form-item>
              <el-form-item label="VFG" prop="vfgId">
                <el-input
                  placeholder="请输入"
                  v-model="form.vfgId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="VRT" prop="vrtId">
                <el-input
                  placeholder="请输入"
                  v-model="form.vrtId"
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
                  enumCode="StatusEnum"
                  v-model="form.statusIncludeList"
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
              <el-form-item label="OEM备注" prop="oemRemark">
                <el-input
                  placeholder="请输入"
                  v-model="form.oemRemark"
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
              <el-form-item label="物料分类（工程）ID" prop="categorySpareEngineeringId">
                <el-input
                  placeholder="请输入"
                  v-model="form.categorySpareEngineeringId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="物料分类（销售）ID" prop="categorySpareSalesId">
                <el-input
                  placeholder="请输入"
                  v-model="form.categorySpareSalesId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="物料分类（供应）ID" prop="categorySpareSupplyId">
                <el-input
                  placeholder="请输入"
                  v-model="form.categorySpareSupplyId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="营销分类" prop="marketingType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.marketingType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="采购状态" prop="purchaseType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.purchaseType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="旧件返还类型" prop="oldReturnType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.oldReturnType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="物料来源" prop="materialSourceType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.materialSourceType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="是否关键件" prop="keyPartIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.keyPartIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否翻包" prop="needRepackIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.needRepackIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否可快递" prop="expressAvailableIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.expressAvailableIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否追溯件" prop="traceableIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.traceableIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="BO调拨 允许，禁止；默认禁止" prop="boTransferIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.boTransferIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="技术是否启用" prop="technicalIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.technicalIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="保修是否拆分数量" prop="maintenanceSplitQuantityIs">
                <el-input
                  placeholder="请输入"
                  v-model="form.maintenanceSplitQuantityIs"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前重量（kg）" prop="domesticPrePackageWeightKg">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPrePackageWeightKg"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前长（mm）" prop="domesticPrePackageLengthMm">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPrePackageLengthMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前宽（mm）" prop="domesticPrePackageWidthMm">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPrePackageWidthMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前高（mm）" prop="domesticPrePackageHeightMm">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPrePackageHeightMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前体积（cm³）" prop="domesticPrePackageVolumeCm3">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPrePackageVolumeCm3"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装后重量（kg）" prop="domesticPostPackageWeightKg">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPostPackageWeightKg"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装后长（mm）" prop="domesticPostPackageLengthMm">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPostPackageLengthMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装后宽（mm）" prop="domesticPostPackageWidthMm">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPostPackageWidthMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装后高（mm）" prop="domesticPostPackageHeightMm">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPostPackageHeightMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装后体积（cm³）" prop="domesticPostPackageVolumeCm3">
                <el-input
                  placeholder="请输入"
                  v-model="form.domesticPostPackageVolumeCm3"
                  clearable
                />
              </el-form-item>
              <el-form-item label="基本计量单位" prop="baseUnit">
                <el-input
                  placeholder="请输入"
                  v-model="form.baseUnit"
                  clearable
                />
              </el-form-item>
              <el-form-item label="供应商起订量" prop="supplierMinOrderQuantity">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierMinOrderQuantity"
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePart/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  partCode: '',
  partName: '',
  minOrderQuantity: '',
  salePrice: '',
  purchasePrice: '',
  oemPart: '',
  dealerName: '',
  saleableIs: '',
  standingInventoryIs: '',
  partsEngineer: '',
  vfgId: '',
  vrtId: '',
  remark: '',
  status: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  statusDesc: '',
  oemRemark: '',
  pinyinCode: '',
  dealerId: '',
  dealerCode: '',
  categorySpareEngineeringId: '',
  categorySpareSalesId: '',
  categorySpareSupplyId: '',
  marketingType: '',
  purchaseType: '',
  oldReturnType: '',
  materialSourceType: '',
  keyPartIs: '',
  needRepackIs: '',
  expressAvailableIs: '',
  traceableIs: '',
  boTransferIs: '',
  technicalIs: '',
  maintenanceSplitQuantityIs: '',
  domesticPrePackageWeightKg: '',
  domesticPrePackageLengthMm: '',
  domesticPrePackageWidthMm: '',
  domesticPrePackageHeightMm: '',
  domesticPrePackageVolumeCm3: '',
  domesticPostPackageWeightKg: '',
  domesticPostPackageLengthMm: '',
  domesticPostPackageWidthMm: '',
  domesticPostPackageHeightMm: '',
  domesticPostPackageVolumeCm3: '',
  baseUnit: '',
  supplierMinOrderQuantity: '',
};

export default {
  name: 'sparePartEdit',
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
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePart',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        partCode: [
          { required: true, message: '请输入备件编码', trigger: 'blur' }
        ],
        partName: [
          { required: true, message: '请输入备件名称', trigger: 'blur' }
        ],
        minOrderQuantity: [
          { required: true, message: '请输入最小订购量', trigger: 'blur' }
        ],
        salePrice: [
          { required: true, message: '请输入销售价格', trigger: 'blur' }
        ],
        purchasePrice: [
          { required: true, message: '请输入采购价格', trigger: 'blur' }
        ],
        oemPart: [
          { required: true, message: '请输入是否OEM件', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'blur' }
        ],
        saleableIs: [
          { required: true, message: '请输入是否可销售', trigger: 'blur' }
        ],
        standingInventoryIs: [
          { required: true, message: '请输入是否常备库存件', trigger: 'blur' }
        ],
        partsEngineer: [
          { required: true, message: '请输入备件工程师', trigger: 'blur' }
        ],
        vfgId: [
          { required: true, message: '请输入VFG', trigger: 'blur' }
        ],
        vrtId: [
          { required: true, message: '请输入VRT', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        oemRemark: [
          { required: true, message: '请输入OEM备注', trigger: 'blur' }
        ],
        pinyinCode: [
          { required: true, message: '请输入拼音简码', trigger: 'blur' }
        ],
        dealerId: [
          { required: true, message: '请输入门店ID（组织ID）', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'blur' }
        ],
        categorySpareEngineeringId: [
          { required: true, message: '请输入物料分类（工程）ID', trigger: 'blur' }
        ],
        categorySpareSalesId: [
          { required: true, message: '请输入物料分类（销售）ID', trigger: 'blur' }
        ],
        categorySpareSupplyId: [
          { required: true, message: '请输入物料分类（供应）ID', trigger: 'blur' }
        ],
        marketingType: [
          { required: true, message: '请选择营销分类', trigger: 'change' }
        ],
        purchaseType: [
          { required: true, message: '请选择采购状态', trigger: 'change' }
        ],
        oldReturnType: [
          { required: true, message: '请选择旧件返还类型', trigger: 'change' }
        ],
        materialSourceType: [
          { required: true, message: '请选择物料来源', trigger: 'change' }
        ],
        keyPartIs: [
          { required: true, message: '请输入是否关键件', trigger: 'blur' }
        ],
        needRepackIs: [
          { required: true, message: '请输入是否翻包', trigger: 'blur' }
        ],
        expressAvailableIs: [
          { required: true, message: '请输入是否可快递', trigger: 'blur' }
        ],
        traceableIs: [
          { required: true, message: '请输入是否追溯件', trigger: 'blur' }
        ],
        boTransferIs: [
          { required: true, message: '请输入BO调拨 允许，禁止；默认禁止', trigger: 'blur' }
        ],
        technicalIs: [
          { required: true, message: '请输入技术是否启用', trigger: 'blur' }
        ],
        maintenanceSplitQuantityIs: [
          { required: true, message: '请输入保修是否拆分数量', trigger: 'blur' }
        ],
        domesticPrePackageWeightKg: [
          { required: true, message: '请输入国内包装前重量（kg）', trigger: 'blur' }
        ],
        domesticPrePackageLengthMm: [
          { required: true, message: '请输入国内包装前长（mm）', trigger: 'blur' }
        ],
        domesticPrePackageWidthMm: [
          { required: true, message: '请输入国内包装前宽（mm）', trigger: 'blur' }
        ],
        domesticPrePackageHeightMm: [
          { required: true, message: '请输入国内包装前高（mm）', trigger: 'blur' }
        ],
        domesticPrePackageVolumeCm3: [
          { required: true, message: '请输入国内包装前体积（cm³）', trigger: 'blur' }
        ],
        domesticPostPackageWeightKg: [
          { required: true, message: '请输入国内包装后重量（kg）', trigger: 'blur' }
        ],
        domesticPostPackageLengthMm: [
          { required: true, message: '请输入国内包装后长（mm）', trigger: 'blur' }
        ],
        domesticPostPackageWidthMm: [
          { required: true, message: '请输入国内包装后宽（mm）', trigger: 'blur' }
        ],
        domesticPostPackageHeightMm: [
          { required: true, message: '请输入国内包装后高（mm）', trigger: 'blur' }
        ],
        domesticPostPackageVolumeCm3: [
          { required: true, message: '请输入国内包装后体积（cm³）', trigger: 'blur' }
        ],
        baseUnit: [
          { required: true, message: '请输入基本计量单位', trigger: 'blur' }
        ],
        supplierMinOrderQuantity: [
          { required: true, message: '请输入供应商起订量', trigger: 'blur' }
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
