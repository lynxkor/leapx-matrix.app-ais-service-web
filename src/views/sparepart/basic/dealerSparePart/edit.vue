<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="备件编码：" prop="partCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partCode"
                    clearable
                    :disabled="!!_id"
                  >
                    <span slot="prepend">E-</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="备件名称：" prop="partName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partName"
                    clearable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="拼音简码：" prop="pinyinCode">
                  <el-input
                    placeholder="提交后自动生成"
                    disabled
                    v-model="form.pinyinCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本计量单位：" prop="baseUnit">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BaseUnitEnum"
                    v-model="form.baseUnit"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="baseUnit">
                  {{ form.dealerCode  }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="baseUnit">
                  {{ form.dealerName  }}
                </el-form-item>
                <el-form-item label="采购价格：" prop="purchasePrice">
                  <el-input
                    placeholder="请输入"
                    type="number"
                    v-model="form.purchasePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售价格：" prop="salePrice">
                  <el-input
                    placeholder="请输入"
                    type="number"
                    v-model="form.salePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否OEM件：" prop="oemPart">
                  是
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  {{ form.statusLabel  }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件编码：" prop="partCode">
                  {{ form.partCode  }}
                </el-form-item>
                <el-form-item label="备件名称：" prop="partName">
                  {{ form.partName  }}
                </el-form-item>
                <el-form-item label="拼音简码：" prop="pinyinCode">
                  {{ form.pinyinCode  }}
                </el-form-item>
                <el-form-item label="基本计量单位：" prop="baseUnit">
                  {{ form.baseUnitLabel  }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="baseUnit">
                  {{ form.dealerCode  }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="baseUnit">
                  {{ form.dealerName  }}
                </el-form-item>
                <el-form-item label="采购价格：" prop="purchasePrice">
                  {{ form.purchasePrice  }}
                </el-form-item>
                <el-form-item label="销售价格：" prop="salePrice">
                  {{ form.salePrice  }}
                </el-form-item>
                <el-form-item label="是否OEM件：" prop="oemPart">
                  {{ form.oemPartLabel  }}
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  {{ form.statusLabel  }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark  }}
                </el-form-item>
              </el-form>
            </div>
          </section>

        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdateDealer } from '@/api/sparepart/basic/sparePart/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getLoginUser } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '1',
  statusLabel: '是',
  statusDesc: '',
  partCode: '',
  partName: '',
  oemPart: '1',
  oemRemark: '',
  pinyinCode: '',
  dealerCode: '',
  dealerName: '',
  categorySpareEngineeringId: '',
  categorySpareSalesId: '',
  categorySpareSupplyId: '',
  vrtId: '',
  vfgId: '',
  marketingType: '',
  purchaseType: '',
  oldReturnType: '',
  materialSourceType: '',
  saleableIs: '',
  keyPartIs: '',
  needRepackIs: '',
  expressAvailableIs: '',
  standingInventoryIs: '',
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
  minOrderQuantity: '',
  baseUnit: '',
  supplierMinOrderQuantity: '',
  purchasePrice: '',
  salePrice: '',
  partsEngineer: '',
  sparePartSupplierRespList: '',
  sparePartVehicleModelRespList: '',
  sparePartReplacerRespList: '',
  availableQty: '',
};

export default {
  name: 'dealerSparePartEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '主键：' + this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '外购件主数据',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-dealerSparePart',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        partCode: [
          { required: true, message: '请输入备件编码', trigger: 'change' }
        ],
        partName: [
          { required: true, message: '请输入备件名称', trigger: 'change' }
        ],
        oemPart: [
          { required: true, message: '请输入是否OEM件', trigger: 'change' }
        ],
        oemRemark: [
          { required: true, message: '请输入OEM备注', trigger: 'change' }
        ],
        pinyinCode: [
          { required: false, message: '请输入拼音简码', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        categorySpareEngineeringId: [
          { required: true, message: '请输入物料分类（工程）ID', trigger: 'change' }
        ],
        categorySpareSalesId: [
          { required: true, message: '请输入物料分类（销售）ID', trigger: 'change' }
        ],
        categorySpareSupplyId: [
          { required: true, message: '请输入物料分类（供应）ID', trigger: 'change' }
        ],
        vrtId: [
          { required: true, message: '请输入VRT', trigger: 'change' }
        ],
        vfgId: [
          { required: true, message: '请输入VFG', trigger: 'change' }
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
        saleableIs: [
          { required: true, message: '请输入是否可销售', trigger: 'change' }
        ],
        keyPartIs: [
          { required: true, message: '请输入是否关键件', trigger: 'change' }
        ],
        needRepackIs: [
          { required: true, message: '请输入是否翻包', trigger: 'change' }
        ],
        expressAvailableIs: [
          { required: true, message: '请输入是否可快递', trigger: 'change' }
        ],
        standingInventoryIs: [
          { required: true, message: '请输入是否常备库存件', trigger: 'change' }
        ],
        traceableIs: [
          { required: true, message: '请输入是否追溯件', trigger: 'change' }
        ],
        boTransferIs: [
          { required: true, message: '请输入BO调拨 允许，禁止；默认禁止', trigger: 'change' }
        ],
        technicalIs: [
          { required: true, message: '请输入技术是否启用', trigger: 'change' }
        ],
        maintenanceSplitQuantityIs: [
          { required: true, message: '请输入保修是否拆分数量', trigger: 'change' }
        ],
        domesticPrePackageWeightKg: [
          { required: true, message: '请输入国内包装前重量（kg）', trigger: 'change' }
        ],
        domesticPrePackageLengthMm: [
          { required: true, message: '请输入国内包装前长（mm）', trigger: 'change' }
        ],
        domesticPrePackageWidthMm: [
          { required: true, message: '请输入国内包装前宽（mm）', trigger: 'change' }
        ],
        domesticPrePackageHeightMm: [
          { required: true, message: '请输入国内包装前高（mm）', trigger: 'change' }
        ],
        domesticPrePackageVolumeCm3: [
          { required: true, message: '请输入国内包装前体积（cm³）', trigger: 'change' }
        ],
        domesticPostPackageWeightKg: [
          { required: true, message: '请输入国内包装后重量（kg）', trigger: 'change' }
        ],
        domesticPostPackageLengthMm: [
          { required: true, message: '请输入国内包装后长（mm）', trigger: 'change' }
        ],
        domesticPostPackageWidthMm: [
          { required: true, message: '请输入国内包装后宽（mm）', trigger: 'change' }
        ],
        domesticPostPackageHeightMm: [
          { required: true, message: '请输入国内包装后高（mm）', trigger: 'change' }
        ],
        domesticPostPackageVolumeCm3: [
          { required: true, message: '请输入国内包装后体积（cm³）', trigger: 'change' }
        ],
        minOrderQuantity: [
          { required: true, message: '请输入最小订购量', trigger: 'change' }
        ],
        baseUnit: [
          { required: true, message: '请输入基本计量单位', trigger: 'change' }
        ],
        supplierMinOrderQuantity: [
          { required: true, message: '请输入供应商起订量', trigger: 'change' }
        ],
        purchasePrice: [
          { required: true, message: '请输入采购价格', trigger: 'change' }
        ],
        salePrice: [
          { required: true, message: '请输入销售价格', trigger: 'change' }
        ],
        partsEngineer: [
          { required: true, message: '请输入备件工程师', trigger: 'change' }
        ],
        sparePartSupplierRespList: [
          { required: true, message: '请输入供应商信息', trigger: 'change' }
        ],
        sparePartVehicleModelRespList: [
          { required: true, message: '请输入车型', trigger: 'change' }
        ],
        sparePartReplacerRespList: [
          { required: true, message: '请输入替换件信息', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.initDealerUser();
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdateDealer({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.accountFlag = res.accountFlag;
      this.form.dealerCode = res.currentDealerCode;// 当前门店code
      this.form.dealerName = res.currentDealerName;// 当前门店名称
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
    }
  }
};
</script>
