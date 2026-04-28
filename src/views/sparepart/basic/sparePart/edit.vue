<template>
  <edit-page-layout ref="editLayout" :title="title" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="
          permissions.has('AISPART-sparePart-vfgImport') ||
          permissions.has('AISPART-sparePart-modelImport') ||
          permissions.has('AISPART-sparePart-purchaseImport') ||
          permissions.has('AISPART-sparePart-transportImport') ||
          permissions.has('AISPART-sparePart-salesImport')"
      >
        <template #status>
          <span class="status primary">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="备件编码：">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：">
                  {{ form.partName }}
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
                    :disabled="!(permissions.has('AISPART-sparePart-salesImport') || permissions.has('AISPART-sparePart-transportImport'))"
                    v-model="form.baseUnit"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备件工程师：" prop="partsEngineer">
                  <el-input
                    placeholder="请输入"
                    :disabled="!(permissions.has('AISPART-sparePart-salesImport') || permissions.has('AISPART-sparePart-purchaseImport'))"
                    v-model="form.partsEngineer"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否OEM件：">
                  {{ form.oemPartLabel }}
                </el-form-item>
                <el-form-item label="是否可销售：" prop="saleableIs">
                  <el-radio-group
                    :disabled="!permissions.has('AISPART-sparePart-salesImport')"
                    v-model="form.saleableIs">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="最小订购量：" prop="minOrderQuantity">
                  <el-input
                    type="number"
                    :disabled="!(permissions.has('AISPART-sparePart-salesImport') ||permissions.has('AISPART-sparePart-transportImport')) "
                    placeholder="请输入"
                    v-model="form.minOrderQuantity"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购价格：" prop="purchasePrice">
                  <el-input
                    placeholder="请输入"
                    disabled
                    v-model="form.purchasePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售价格：" prop="salePrice">
                  <el-input
                    placeholder="请输入"
                    disabled
                    v-model="form.salePrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="BO调拨：">
                  {{ form.boTransferIsLabel }}
                </el-form-item>
                <el-form-item label="是否常备库存件：" prop="standingInventoryIs">
                  <el-radio-group
                    :disabled="!permissions.has('AISPART-sparePart-salesImport')"
                    v-model="form.standingInventoryIs">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="采购状态：" prop="purchaseType">
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
                <el-form-item label="旧件返还类型：" prop="oldReturnType">
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
                <el-form-item label="营销分类：" prop="marketingType">
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
                <el-form-item label="销售物料分类：" prop="categorySpareSalesId">
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
                <el-form-item label="VRT：" prop="vrtId">
                  <list-select
                    v-if="!_id || form.id"
                    listUrl="/claimreturn/claim/web/basic/vrt/list"
                    placeholder="请选择"
                    v-model="form.vrtId"
                    :disabled="!permissions.has('AISPART-sparePart-vfgImport')"
                    query-key="vrtNameLike"
                    auto-load-options
                    no-param-load
                    clearable
                    filterable
                    :params="{}"
                  />
                </el-form-item>
                <el-form-item label="VFG：" prop="vfgId">
                  <list-select
                    v-if="!_id || form.id"
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
                <el-form-item label="技术是否启用：">
                  {{ form.technicalIsLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
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
                <el-form-item label="OEM备注：" prop="oemRemark" class="form-item-full" v-if="permissions.has('AISPART-sparePart-oem')">
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件编码：">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="拼音简码：">
                  {{ form.pinyinCode }}
                </el-form-item>
                <el-form-item label="基本计量单位：">
                  {{ form.baseUnitLabel }}
                </el-form-item>
                <el-form-item label="备件工程师：">
                  {{ form.partsEngineer }}
                </el-form-item>
                <el-form-item label="是否OEM件：">
                  {{ form.oemPartLabel }}
                </el-form-item>
                <el-form-item label="是否可销售：">
                  {{ form.saleableIsLabel }}
                </el-form-item>
                <el-form-item label="最小订购量：">
                  {{ form.minOrderQuantity }}
                </el-form-item>
                <el-form-item label="采购价格：">
                  {{ form.purchasePrice }}
                </el-form-item>
                <el-form-item label="销售价格：">
                  {{ form.salePrice }}
                </el-form-item>
                <el-form-item label="BO调拨：">
                  {{ form.boTransferIsLabel }}
                </el-form-item>
                <el-form-item label="是否常备库存件：">
                  {{ form.standingInventoryIsLabel }}
                </el-form-item>
                <el-form-item label="采购状态：">
                  {{ form.purchaseTypeLabel }}
                </el-form-item>
                <el-form-item label="旧件返还类型：">
                  {{ form.oldReturnTypeLabel }}
                </el-form-item>
                <el-form-item label="营销分类：">
                  {{ form.marketingTypeLabel }}
                </el-form-item>
                <el-form-item label="销售物料分类：">
                  {{ form.categorySpareSalesName }}
                </el-form-item>
                <el-form-item label="VFG：">
                  {{ form.vfgName }}
                </el-form-item>
                <el-form-item label="VRT：">
                  {{ form.vrtName }}
                </el-form-item>
                <el-form-item label="技术是否启用：">
                  {{ form.technicalIsLabel }}
                </el-form-item>
                <el-form-item label="备注：" class="form-item-full">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="OEM备注：" class="form-item-full" v-if="permissions.has('AISPART-sparePart-oem')">
                  {{ form.oemRemark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>其他信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="是否启用：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="供应商起订量：">
                  {{ form.supplierMinOrderQuantity }}
                </el-form-item>
                <el-form-item label="是否追溯件：">
                  {{ form.traceableIsLabel }}
                </el-form-item>
                <el-form-item label="是否可快递：">
                  {{ form.expressAvailableIs === '1' ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="保修是否拆分：">
                  {{ form.maintenanceSplitQuantityIsLabel }}
                </el-form-item>
                <el-form-item label="是否关键件：">
                  {{ form.keyPartIs === '1' ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="国内包装前长(mm)：">
                  {{ form.domesticPrePackageLengthMm }}
                </el-form-item>
                <el-form-item label="国内包装前宽(mm)：">
                  {{ form.domesticPrePackageWidthMm }}
                </el-form-item>
                <el-form-item label="国内包装前高(mm)：">
                  {{ form.domesticPrePackageHeightMm }}
                </el-form-item>
                <el-form-item label="国内包装前体积(cm³)：">
                  {{ form.domesticPrePackageVolumeCm3 }}
                </el-form-item>
                <el-form-item label="国内包装前重量(kg)：">
                  {{ form.domesticPrePackageWeightKg }}
                </el-form-item>
                <el-form-item label="是否翻包：">
                  {{ form.needRepackIs === '1' ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="供应物料分类：">
                  {{ form.categorySpareSupplyName }}
                </el-form-item>
                <el-form-item label="国内包装后长(mm)：">
                  {{ form.domesticPostPackageLengthMm }}
                </el-form-item>
                <el-form-item label="国内包装后宽(mm)：">
                  {{ form.domesticPostPackageWidthMm }}
                </el-form-item>
                <el-form-item label="国内包装后高(mm)：">
                  {{ form.domesticPostPackageHeightMm }}
                </el-form-item>
                <el-form-item label="国内包装后体积(cm³)：">
                  {{ form.domesticPostPackageVolumeCm3 }}
                </el-form-item>
                <el-form-item label="国内包装后重量(kg)：">
                  {{ form.domesticPostPackageWeightKg }}
                </el-form-item>
                <el-form-item label="工程物料分类：">
                  {{ form.categorySpareEngineeringName }}
                </el-form-item>
                <el-form-item label="物料来源：">
                  {{ form.materialSourceType }}
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
              <el-button class="modeBtn" type="primary" size="small" plain v-permission:disabled="'AISPART-sparePart-modelImport'" @click.stop="handleModel">维护车型</el-button>
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
        <!-- 维护车型弹窗组件 - 保留在edit-base-container外部 -->
        <ModelDialog :visible="modelDialogVisible" :modelId="modelId" @success="getDetailData" @close="handleCloseModel" />
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePart/index';
import FetchSelect from '@/libs/components/FetchSelect';
import ListSelect from '@/libs/components/list-select/index.vue';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ModelDialog from './model.vue';
import { getSupplyList } from '@/api/sparepart/basic/spareSupplyCategory';
import { getEngineeringList } from '@/api/sparepart/basic/spareEngineeringCategory';
import { getSalesList } from '@/api/sparepart/basic/spareSalesCategory';

const defaultForm = {
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
  statusLabel: '',
  oemRemark: '',
  pinyinCode: '',
  dealerId: '',
  dealerCode: '',
  categorySpareEngineeringId: '',
  categorySpareEngineeringName: '',
  categorySpareSalesId: '',
  categorySpareSalesName: '',
  categorySpareSupplyId: '',
  categorySpareSupplyName: '',
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
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    ListSelect,
    FetchSelect,
    ModelDialog,
    EditTable,
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '备件编码：' + (this.form.partCode || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件主数据',
      pageType: 'edit',
      moduleKey: 'AISPART-sparePart',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      modelId: '',
      modelData: [],
      supplierData: [],
      replacementData: [],
      modelDialogVisible: false,
      storeOptions: [],
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
              if (value === null || value === undefined || value === '') {
                callback();
                return;
              }
              const num = Number(value);
              if (isNaN(num)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              if (Math.floor(num) !== num) {
                callback(new Error('请输入整数'));
                return;
              }
              if (num < 0) {
                callback(new Error('请输入大于等于0的整数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    submitRequest () {
      return addOrUpdate({ id: this.form.id, ...this.form });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    getStoreByName (query) {
      listOrgStoreInfoByParam({
        orgCodeOrName: query
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
    handleStoreChange (val) {
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
    handleModel () {
      this.modelId = this.$route.query.id;
      this.modelDialogVisible = true;
    },
    handleCloseModel () {
      this.modelDialogVisible = false;
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
.status.primary {
  color: var(--leap-color-primary);
  font-weight: 500;
}
.modeZb {
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-start !important;
  align-items: center !important;
}
.modeZb .modeBtn {
  margin-left: 10px;
}
</style>
