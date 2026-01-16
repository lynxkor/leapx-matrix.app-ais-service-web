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
            <el-form inline :model="form" :rules="rules" ref="ruleForm" label-width="160px">
              <el-form-item label="备件编码" prop="partCode">
                {{form.partCode}}
              </el-form-item>
              <el-form-item label="备件名称" prop="partName">
                {{form.partName}}
              </el-form-item>
              <el-form-item label="拼音简码" prop="pinyinCode">
                <el-input
                  placeholder="提交后自动生成"
                  disabled
                  v-model="form.pinyinCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="基本计量单位" prop="baseUnit">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="BaseUnitEnum"
                  :disabled="!(permissions.has('AISPART-sparePart-salesImport') || permissions.has('AISPART-sparePart-transportImport'))"
                  v-model="form.baseUnit"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="备件工程师" prop="partsEngineer">
                <el-input
                  placeholder="请输入"
                  :disabled="!(permissions.has('AISPART-sparePart-salesImport') || permissions.has('AISPART-sparePart-purchaseImport'))"
                  v-model="form.partsEngineer"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否OEM件" prop="oemPart">
                {{ form.oemPartLabel  }}
              </el-form-item>
              <el-form-item label="是否可销售" prop="saleableIs">
                <el-radio-group
                 :disabled="!permissions.has('AISPART-sparePart-salesImport')"
                 v-model="form.saleableIs">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="最小订购量" prop="minOrderQuantity">
                <el-input
                  type="number"
                  :disabled="!(permissions.has('AISPART-sparePart-salesImport') ||permissions.has('AISPART-sparePart-transportImport')) "
                  placeholder="请输入"
                  v-model="form.minOrderQuantity"
                  clearable
                />
              </el-form-item>
              <el-form-item label="采购价格" prop="purchasePrice">
                <el-input
                  placeholder="请输入"
                  disabled
                  v-model="form.purchasePrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="销售价格" prop="salePrice">
                <el-input
                  placeholder="请输入"
                  disabled
                  v-model="form.salePrice"
                  clearable
                />
              </el-form-item>
              <el-form-item label="BO调拨" prop="boTransferIs">
                {{ form.boTransferIsLabel  }}
              </el-form-item>
              <el-form-item label="是否常备库存件" prop="standingInventoryIs">
                <el-radio-group
                :disabled="!permissions.has('AISPART-sparePart-salesImport')"
                 v-model="form.standingInventoryIs">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="采购状态" prop="purchaseType">
                <fetch-select
                  :request="fetchOptions"
                  :disabled="!(permissions.has('AISPART-sparePart-salesImport') || permissions.has('AISPART-sparePart-purchaseImport'))"
                  enumCode="PurchaseTypeEnum"
                  v-model="form.purchaseType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="旧件返还类型" prop="oldReturnType">
                <fetch-select
                  disabled
                  :request="fetchOptions"
                  enumCode="OldReturnTypeEnum"
                  v-model="form.oldReturnType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="营销分类" prop="marketingType">
                <fetch-select
                  :request="fetchOptions"
                  :disabled="!permissions.has('AISPART-sparePart-salesImport')"
                  enumCode="SparePartMarketingTypeEnum"
                  v-model="form.marketingType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="销售物料分类" prop="categorySpareSalesId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  :disabled="!permissions.has('AISPART-sparePart-salesImport')"
                  reserve-keyword
                  v-model="form.categorySpareSalesId"
                  :remote-method="getSalesList"
                  :params="form.categorySpareSalesName"
                  value-key="id"
                  label-key="name"
                  @change="categorySpareSalesChange"
                />
              </el-form-item>
              <el-form-item label="VRT" prop="vrtId">
                <list-select
                  v-if="!this.$route.query.id||form.id"
                  listUrl="/claimreturn/claim/web/basic/vrt/list"
                  placeholder="请选择"
                  v-model="form.vrtId"
                  :disabled="!permissions.has('AISPART-sparePart-vfgImport')"
                  query-key="vrtNameLike"
                  auto-load-options
                  no-param-load
                  clearable
                  filterable
                  :params="{}" />
              </el-form-item>
              <el-form-item label="VFG" prop="vfgId">
                <list-select
                  v-if="!this.$route.query.id||form.id"
                  listUrl="/claimreturn/claim/web/basic/vfg/list"
                  placeholder="请选择"
                  v-model="form.vfgId"
                  :disabled="!permissions.has('AISPART-sparePart-vfgImport')"
                  query-key="vfgNameLike"
                  auto-load-options
                  clearable
                  filterable
                  :params="{vrtId: form.vrtId}"
                   />
              </el-form-item>
              <el-form-item label="技术是否启用" prop="technicalIs">
                {{ form.technicalIsLabel }}
              </el-form-item>
              <el-form-item label="备注" prop="remark" class="form-item-full">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  :disabled="!permissions.has('AISPART-sparePart-salesImport')"
                  v-model="form.remark"
                  clearable
                  maxLength="500"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="OEM备注" prop="oemRemark" class="form-item-full" v-if="permissions.has('AISPART-sparePart-dealer')">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  :disabled="!(permissions.has('AISPART-sparePart-salesImport') || permissions.has('AISPART-sparePart-transportImport') || permissions.has('AISPART-sparePart-purchaseImport'))"
                  v-model="form.oemRemark"
                  clearable
                  maxLength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>其他信息</h2>
          </div>
          <div class="common-section-body">
            <el-form inline :model="form" :rules="rules" ref="ruleForm" label-width="160px">
              <el-form-item label="门店名称" prop="dealerName">
                <el-select
                  v-model="form.dealerCode"
                  filterable
                  clearable
                  disabled
                  remote
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
              <el-form-item label="是否启用" prop="status">
                {{ form.statusLabel  }}
              </el-form-item>
              <el-form-item label="供应商起订量" prop="supplierMinOrderQuantity">
                <el-input
                  placeholder="请输入"
                  disabled
                  v-model="form.supplierMinOrderQuantity"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否追溯件" prop="traceableIs">
                {{ form.traceableIsLabel }}
              </el-form-item>
              <el-form-item label="是否可快递" prop="expressAvailableIs">
                <el-radio-group
                :disabled="!(permissions.has('AISPART-sparePart-salesImport') || permissions.has('AISPART-sparePart-transportImport'))"
                 v-model="form.expressAvailableIs">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="保修是否拆分" prop="maintenanceSplitQuantityIs">
                {{ form.maintenanceSplitQuantityIsLabel }}
              </el-form-item>
              <el-form-item label="是否关键件" prop="keyPartIs">
                <el-radio-group
                :disabled="!(permissions.has('AISPART-sparePart-salesImport') || permissions.has('AISPART-sparePart-purchaseImport'))"
                 v-model="form.keyPartIs">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="国内包装前长(mm)" prop="domesticPrePackageLengthMm">
                <el-input
                  type="number"
                  placeholder="请输入"
                  :disabled="!permissions.has('AISPART-sparePart-transportImport')"
                  v-model="form.domesticPrePackageLengthMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前宽(mm)" prop="domesticPrePackageWidthMm">
                <el-input
                  type="number"
                  :disabled="!permissions.has('AISPART-sparePart-transportImport')"
                  placeholder="请输入"
                  v-model="form.domesticPrePackageWidthMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前高(mm)" prop="domesticPrePackageHeightMm">
                <el-input
                  type="number"
                  placeholder="请输入"
                  :disabled="!permissions.has('AISPART-sparePart-transportImport')"
                  v-model="form.domesticPrePackageHeightMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前体积(cm³)" prop="domesticPrePackageVolumeCm3">
                <el-input
                  type="number"
                  disabled
                  placeholder="请输入"
                  v-model="form.domesticPrePackageVolumeCm3"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前重量(kg)" prop="domesticPrePackageWeightKg">
                <el-input
                  type="number"
                  placeholder="请输入"
                  :disabled="!permissions.has('AISPART-sparePart-transportImport')"
                  v-model="form.domesticPrePackageWeightKg"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否翻包" prop="needRepackIs">
                <el-radio-group
                :disabled="!(permissions.has('AISPART-sparePart-salesImport')||permissions.has('AISPART-sparePart-transportImport'))"
                 v-model="form.needRepackIs">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="供应物料分类" prop="categorySpareSupplyId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  :disabled="!(permissions.has('AISPART-sparePart-salesImport')||permissions.has('AISPART-sparePart-purchaseImport'))"
                  reserve-keyword
                  v-model="form.categorySpareSupplyId"
                  :remote-method="getSupplyList"
                  :params="form.categorySpareSupplyName"
                  value-key="id"
                  label-key="name"
                  @change="categorySpareSupplyChange"
                />
              </el-form-item>
              <el-form-item label="国内包装后长(mm)" prop="domesticPostPackageLengthMm">
                <el-input
                  type="number"
                  :disabled="!permissions.has('AISPART-sparePart-transportImport')"
                  placeholder="请输入"
                  v-model="form.domesticPostPackageLengthMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装后宽(mm)" prop="domesticPostPackageWidthMm">
                <el-input
                  type="number"
                  :disabled="!permissions.has('AISPART-sparePart-transportImport')"
                  placeholder="请输入"
                  v-model="form.domesticPostPackageWidthMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装前后高(mm)" prop="domesticPostPackageHeightMm">
                <el-input
                  type="number"
                  :disabled="!permissions.has('AISPART-sparePart-transportImport')"
                  placeholder="请输入"
                  v-model="form.domesticPostPackageHeightMm"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装后体积(cm³)" prop="domesticPostPackageVolumeCm3">
                <el-input
                  type="number"
                  disabled
                  placeholder="请输入"
                  v-model="form.domesticPostPackageVolumeCm3"
                  clearable
                />
              </el-form-item>
              <el-form-item label="国内包装后重量(kg)" prop="domesticPostPackageWeightKg">
                <el-input
                  type="number"
                  :disabled="!permissions.has('AISPART-sparePart-transportImport')"
                  placeholder="请输入"
                  v-model="form.domesticPostPackageWeightKg"
                  clearable
                />
              </el-form-item>
              <el-form-item label="工程物料分类" prop="categorySpareEngineeringId">
                <fetch-select
                  filterable
                  clearable
                  remote
                  disabled
                  reserve-keyword
                  v-model="form.categorySpareEngineeringId"
                  :remote-method="getEngineeringList"
                  :params="form.categorySpareEngineeringName"
                  value-key="id"
                  label-key="name"
                  @change="categorySpareEngineeringChange"
                />
              </el-form-item>
              <el-form-item label="物料来源" prop="materialSourceType">
                <fetch-select
                  :request="fetchOptions"
                  disabled
                  enumCode="MaterialSourceTypeEnum"
                  v-model="form.materialSourceType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>供应商信息</h2>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="supplierColumns"
                :data="supplierData"
                :show-toolbar="false"
                :isFocusNewRow="false"
              />
            </div>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header modeZb">
            <h2>车型信息</h2>
            <el-button class="modeBtn" type="primary" size="small" plain v-permission:disabled="'AISPART-sparePartVehicleModel-addOrUpdate'" @click.stop="handleModel">维护车型</el-button>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="modelColumns"
                :data="modelData"
                :show-toolbar="false"
                :isFocusNewRow="false"
              />
            </div>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>替换件信息</h2>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTable"
                :columns="replacementColumns"
                :data="replacementData"
                :show-toolbar="false"
                :isFocusNewRow="false"
              />
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
    <!-- 维护车型弹窗组件 -->
    <ModelDialog :visible="modelDialogVisible" :modelId="modelId" @success="getDetailData" @close="handleCloseModel" />
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePart/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ModelDialog from './model.vue';
import { getSupplyList } from '@/api/sparepart/basic/spareSupplyCategory';
import { getEngineeringList } from '@/api/sparepart/basic/spareEngineeringCategory';
import { getSalesList } from '@/api/sparepart/basic/spareSalesCategory';
import ListSelect from '@/libs/components/list-select/index.vue';
import EditTable from '@/libs/components/EditTable';

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
    ListSelect,
    FetchSelect,
    ModelDialog,
    EditTable
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件主数据',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePart',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      modelId: '', // 备件编辑id
      modelData: [], // 车型信息
      supplierData: [], // 供应商信息
      replacementData: [], // 替换件信息
      modelDialogVisible: false, // 适配车型弹窗
      storeOptions: [], // 门店列表
      supplierColumns: [
        {
          field: 'supplierCode',
          title: '供应商代码',
          width: '30%',
        },
        {
          field: 'supplierName',
          title: '供应商名称',
          width: '70%',
        }
      ],
      modelColumns: [
        {
          field: 'vehicleYearTypeName',
          title: '车辆年型',
          width: '30%',
        },
        {
          field: 'vehicleModelName',
          title: '车型名称',
          width: '70%',
        }
      ],
      replacementColumns: [
        {
          field: 'replacementTypeLabel',
          title: '替换关系',
          width: '20%',
        },
        {
          field: 'beforePartCode',
          title: '替换前件号',
          width: '20%',
        },
        {
          field: 'beforePartName',
          title: '替换前名称',
          width: '20%',
        },
        {
          field: 'afterPartCode',
          title: '替换后件号',
          width: '20%',
        },
        {
          field: 'afterPartName',
          title: '替换后名称',
          width: '20%',
        }
      ],
      rules: {
        partCode: [
          { required: true, message: '请输入备件编码', trigger: 'blur' }
        ],
        partName: [
          { required: true, message: '请输入备件名称', trigger: 'blur' }
        ],
        minOrderQuantity: [
          { required: false, message: '请输入最小订购量', trigger: 'blur' },
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
              // 检查是否为整数
              if (Math.floor(num) !== num) {
                callback(new Error('请输入整数'));
                return;
              }
              // 根据需求选择条件：
              // 1. 大于0的整数：num > 0
              // 2. 大于等于0的整数：num >= 0
              if (num < 0) {
                callback(new Error('请输入大于等于0的整数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        salePrice: [
          { required: false, message: '请输入销售价格', trigger: 'blur' }
        ],
        purchasePrice: [
          { required: false, message: '请输入采购价格', trigger: 'blur' }
        ],
        dealerName: [
          { required: false, message: '请输入门店名称（组织名称）', trigger: 'blur' }
        ],
        saleableIs: [
          { required: false, message: '请输入是否可销售', trigger: 'blur' }
        ],
        standingInventoryIs: [
          { required: false, message: '请输入是否常备库存件', trigger: 'blur' }
        ],
        partsEngineer: [
          { required: false, message: '请输入备件工程师', trigger: 'blur' }
        ],
        vfgId: [
          { required: false, message: '请输入VFG', trigger: 'blur' }
        ],
        vrtId: [
          { required: false, message: '请输入VRT', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        oemRemark: [
          { required: false, message: '请输入OEM备注', trigger: 'blur' }
        ],
        pinyinCode: [
          { required: false, message: '请输入拼音简码', trigger: 'blur' }
        ],
        dealerId: [
          { required: false, message: '请输入门店ID（组织ID）', trigger: 'blur' }
        ],
        dealerCode: [
          { required: false, message: '请输入门店编码（组织code）', trigger: 'blur' }
        ],
        categorySpareEngineeringId: [
          { required: false, message: '请输入物料分类（工程）ID', trigger: 'blur' }
        ],
        categorySpareSalesId: [
          { required: false, message: '请输入物料分类（销售）ID', trigger: 'blur' }
        ],
        categorySpareSupplyId: [
          { required: false, message: '请输入物料分类（供应）ID', trigger: 'blur' }
        ],
        marketingType: [
          { required: false, message: '请选择营销分类', trigger: 'change' }
        ],
        purchaseType: [
          { required: false, message: '请选择采购状态', trigger: 'change' }
        ],
        oldReturnType: [
          { required: false, message: '请选择旧件返还类型', trigger: 'change' }
        ],
        materialSourceType: [
          { required: false, message: '请选择物料来源', trigger: 'change' }
        ],
        boTransferIs: [
          { required: false, message: '请选择BO调拨', trigger: 'blur' }
        ],
        technicalIs: [
          { required: false, message: '请输入技术是否启用', trigger: 'blur' }
        ],
        maintenanceSplitQuantityIs: [
          { required: false, message: '请输入保修是否拆分数量', trigger: 'blur' }
        ],
        // 初始化时调用方法生成规则
        domesticPrePackageWeightKg: this.createNumberRule({
          fieldName: '国内包装前重量',
          unit: 'kg',
          required: false
        }),
        domesticPrePackageLengthMm: this.createNumberRule({
          fieldName: '国内包装前长',
          unit: 'mm',
          required: false
        }),
        domesticPrePackageWidthMm: this.createNumberRule({
          fieldName: '国内包装前宽',
          unit: 'mm',
          required: false
        }),
        domesticPrePackageHeightMm: this.createNumberRule({
          fieldName: '国内包装前高',
          unit: 'mm',
          required: false
        }),
        domesticPostPackageWeightKg: this.createNumberRule({
          fieldName: '国内包装后重量',
          unit: 'kg',
          required: false
        }),
        domesticPostPackageLengthMm: this.createNumberRule({
          fieldName: '国内包装后长',
          unit: 'mm',
          required: false
        }),
        domesticPostPackageWidthMm: this.createNumberRule({
          fieldName: '国内包装后宽',
          unit: 'mm',
          required: false
        }),
        domesticPostPackageHeightMm: this.createNumberRule({
          fieldName: '国内包装后高',
          unit: 'mm',
          required: false
        }),
        baseUnit: [
          { required: false, message: '请输入基本计量单位', trigger: 'blur' }
        ],
        supplierMinOrderQuantity: [
          { required: false, message: '请输入供应商起订量', trigger: 'blur' },
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
              // 检查是否为整数
              if (Math.floor(num) !== num) {
                callback(new Error('请输入整数'));
                return;
              }
              // 根据需求选择条件：
              // 1. 大于0的整数：num > 0
              // 2. 大于等于0的整数：num >= 0
              if (num < 0) {
                callback(new Error('请输入大于等于0的整数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
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
    // 可采购/不可采购门店
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
      this.form.dealerCode = selectedItem.orgCode;
      this.form.dealerName = selectedItem.orgName;
    },
    async getEngineeringList (query) {
      const res = await getEngineeringList({ categoryNameLike: query });
      return res;
    },
    async getSupplyList (query) {
      const res = await getSupplyList({ categoryNameLike: query });
      return res;
    },
    async getSalesList (query) {
      const res = await getSalesList({ categoryNameLike: query });
      return res;
    },
    categorySpareEngineeringChange (val, all) {
      this.form.categorySpareEngineeringId = all.id;
      this.form.categorySpareEngineeringCode = all.code;
      this.form.categorySpareEngineeringName = all.name;
    },
    categorySpareSupplyChange (val, all) {
      this.form.categorySpareSupplyId = all.id;
      this.form.categorySpareSupplyCode = all.code;
      this.form.categorySpareSupplyName = all.name;
    },
    categorySpareSalesChange (val, all) {
      this.form.categorySpareSalesId = all.id;
      this.form.categorySpareSalesCode = all.code;
      this.form.categorySpareSalesName = all.name;
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件主数据', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
          this.supplierData = res.sparePartSupplierRespList || []; // 供应商信息
          this.modelData = res.sparePartVehicleModelRespList || []; // 车型信息
          this.replacementData = res.sparePartReplacerRespList || []; // 替换件信息
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
    },
    // 适配车型弹窗
    handleModel () {
      this.modelId = this.$route.query.id;
      this.modelDialogVisible = true;
    },
    // 处理关闭弹窗事件
    handleCloseModel () {
      this.modelDialogVisible = false;
    },
    /**
     * 创建数值验证规则
     * @param {Object} options 配置选项
     * @returns {Array} 验证规则数组
     */
    createNumberRule ({ fieldName, unit = '', required = false, trigger = 'blur' }) {
      const displayName = unit ? `${fieldName}（${unit}）` : fieldName;

      return [
        {
          required,
          message: `请输入${displayName}`,
          trigger
        },
        {
          validator: (rule, value, callback) => {
            // 非必填且值为空时通过验证
            if (!required && (value === '' || value === undefined || value === null)) {
              callback();
              return;
            }

            // 转换为数字类型
            const numValue = Number(value);

            // 检查是否为有效数字
            if (isNaN(numValue)) {
              callback(new Error(`${displayName}必须为有效数字`));
              return;
            }

            // 检查是否为负数
            if (numValue < 0) {
              callback(new Error(`${displayName}不能为负数`));
              return;
            }

            // 检查小数位数
            const strValue = value.toString();
            const decimalCount = (strValue.split('.')[1] || '').length;
            if (decimalCount > 2) {
              callback(new Error(`${displayName}最多只能保留两位小数`));
              return;
            }

            callback();
          },
          trigger
        }
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
  .modeZb {
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-start !important; /* 居左排列 */
    align-items: center !important; /* 垂直居中 */
  }
  .modeZb .modeBtn {
    margin-left: 10px;
  }
</style>
