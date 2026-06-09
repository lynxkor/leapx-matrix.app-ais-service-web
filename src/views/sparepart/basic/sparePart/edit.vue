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
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button
            v-if="canShowAllowBoTransfer"
            size="small"
            plain
            :loading="actionLoading"
            @click="handleAllowBoTransfer">允许BO调拨</el-button>
          <el-button
            v-if="canShowForbidBoTransfer"
            size="small"
            plain
            :loading="actionLoading"
            @click="handleForbidBoTransfer">禁止BO调拨</el-button>
          <el-button
            v-if="canShowAllowSales"
            plain
            size="small"
            :loading="actionLoading"
            @click="handleAllowPartsAttachmentSales">允许备附件销售</el-button>
          <el-button
            v-if="canShowForbidSales"
            plain
            size="small"
            :loading="actionLoading"
            @click="handleForbidPartsAttachmentSales">禁止备附件销售</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="备件编码：">
                  <el-input
                    placeholder="请输入"
                    disabled
                    v-model="form.partCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件名称：">
                  <el-input
                    placeholder="请输入"
                    disabled
                    v-model="form.partName"
                    clearable
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
                  <el-input
                    placeholder="请输入"
                    disabled
                    v-model="form.oemPart"
                    clearable
                  />
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
                  <el-input
                    placeholder="请输入"
                    disabled
                    v-model="form.boTransferIs"
                    clearable
                  />
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
                  <el-input
                    placeholder="请输入"
                    disabled
                    v-model="form.technicalIsLabel"
                    clearable
                  />
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
                <el-form-item label="OEM备注：" prop="oemRemark" class="form-item-full" v-if="oem">
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
                  <!-- {{ form.partCode }} -->
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span>{{ form.partCode }}</span>
                    <el-button size="mini" @click="handleDigitalModel">数模</el-button>
                  </div>
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
                <el-form-item label="OEM备注：" class="form-item-full" v-if="oem">
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
              <el-form inline :model="form" :rules="rules" ref="ruleForm" label-width="160px" v-show="isEditing || !_id">
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
              <el-form :inline="true" :model="form" class="form-detail" v-show="!(isEditing || !_id)">
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
                  {{ form.materialSourceTypeLabel }}
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
import { getDetail, addOrUpdate, allowBoTransfer, forbidBoTransfer, allowPartsAttachmentSales, forbidPartsAttachmentSales } from '@/api/sparepart/basic/sparePart/index';
import FetchSelect from '@/libs/components/FetchSelect';
import ListSelect from '@/libs/components/list-select/index.vue';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getLoginUser } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ModelDialog from './model.vue';
import { getSupplyList } from '@/api/sparepart/basic/spareSupplyCategory';
import { getEngineeringList } from '@/api/sparepart/basic/spareEngineeringCategory';
import { getSalesList } from '@/api/sparepart/basic/spareSalesCategory';
import { handleCommonAction } from '@/libs/utils/index';

const ACTION_CONFIG = {
  allowBoTransfer: { title: '此操作将允许BO调拨, 是否继续?', success: '操作成功' },
  forbidBoTransfer: { title: '此操作将禁止BO调拨, 是否继续?', success: '操作成功' },
  allowPartsAttachmentSales: { title: '此操作将允许备附件销售, 是否继续?', success: '操作成功' },
  forbidPartsAttachmentSales: { title: '此操作将禁止备附件销售, 是否继续?', success: '操作成功' }
};

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
  retailIs: '',
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
    },
  },
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
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '备件编码：' + (this.form.partCode || '');
    },
    canShowAllowBoTransfer () {
      return this.form.oemPart === '1' && this.form.boTransferIs === '0' && this.permissions.has('AISPART-sparePart-canBoTransfer');
    },
    canShowForbidBoTransfer () {
      return this.form.oemPart === '1' && this.form.boTransferIs === '1' && this.permissions.has('AISPART-sparePart-canBoTransfer');
    },
    canShowAllowSales () {
      return this.form.oemPart === '1' && this.form.retailIs === '0' && this.permissions.has('AISPART-sparePart-canCetail');
    },
    canShowForbidSales () {
      return this.form.oemPart === '1' && this.form.retailIs === '1' && this.permissions.has('AISPART-sparePart-canCetail');
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
      oem: false,
      pageTitle: '备件主数据',
      pageType: 'edit',
      moduleKey: 'AISPART-sparePart',
      loading: false,
      submitLoading: false,
      actionLoading: false,
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
  mounted () {
    this.getLoginUser();
  },
  methods: {
    async getLoginUser () {
      try {
        const res = await getLoginUser();
        this.oem = !res.accountFlag;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
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
    async detailRequest () {
      const id = this._id;
      if (id) {
        const res = await getDetail(id);
        this.supplierData = res.sparePartSupplierRespList || []; // 供应商信息
        this.modelData = res.sparePartVehicleModelRespList || []; // 车型信息
        this.replacementData = res.sparePartReplacerRespList || []; // 替换件信息
        return res;
      }
    },
    submitRequest () {
      return addOrUpdate({ id: this.form.id, ...this.form });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
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
    },
    _handleAction (apiFn, config) {
      this.actionLoading = true;
      handleCommonAction({
        $confirm: this.$confirm,
        $message: this.$message,
        apiFn,
        id: this._id,
        config,
        onSuccess: () => {
          this.actionLoading = false;
          this.$refs.containerRef.loadDetail();
        },
        onComplete: () => {
          this.actionLoading = false;
        }
      });
    },
    handleAllowBoTransfer () {
      this._handleAction(allowBoTransfer, ACTION_CONFIG.allowBoTransfer);
    },
    handleForbidBoTransfer () {
      this._handleAction(forbidBoTransfer, ACTION_CONFIG.forbidBoTransfer);
    },
    handleAllowPartsAttachmentSales () {
      this._handleAction(allowPartsAttachmentSales, ACTION_CONFIG.allowPartsAttachmentSales);
    },
    handleForbidPartsAttachmentSales () {
      this._handleAction(forbidPartsAttachmentSales, ACTION_CONFIG.forbidPartsAttachmentSales);
    },
    // 跳转数模
    handleDigitalModel () {
      window.open(`https://usercenter-uat.leapmotor.com/auth/oauth/authorize?response_type=code&client_id=ITP&redirect_uri=https://itpuat.leapmotor.com/#/detailsPart?detailsPartCode=${this.form.partCode}`, '_blank');
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
