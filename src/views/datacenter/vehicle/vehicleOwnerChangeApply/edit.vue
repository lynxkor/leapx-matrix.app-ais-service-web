<template>
  <div class="container">
  <edit-base-container
    ref="containerRef"
    :id="_id"
    :title="title"
    :isEditing.sync="isEditing"
    :form.sync="form"
    :originalForm.sync="originalForm"
    :submitRequest="submitRequest"
    :detailRequest="detailRequest"
    :showEditBtn="showEditBtn"
  >
    <template #extraButtons>
      <template v-if="!fromLxpApp">
        <el-button v-if="canCancel && (form.applyStatus === APPLY_STATUS.DRAFT || form.applyStatus === APPLY_STATUS.REJECTED)" type="danger" size="small" @click="handleCancel">作废</el-button>
        <el-button v-if="canSubmit && (form.applyStatus === APPLY_STATUS.DRAFT || form.applyStatus === APPLY_STATUS.REJECTED)" type="primary" size="small" @click="handleSubmit">提交</el-button>
        <el-button v-if="canReject && form.applyStatus === APPLY_STATUS.PENDING" type="danger" size="small" @click="handleReject">审批驳回</el-button>
        <el-button v-if="canApprove && form.applyStatus === APPLY_STATUS.PENDING" type="primary" size="small" @click="handleApprove">审批通过</el-button>
      </template>
    </template>
    <el-main>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-sub-header">
            <h3>申请信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="申请单号：" prop="applyNo">
              <el-input
                placeholder="请输入"
                v-model="form.applyNo"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="业务类型：" prop="businessType">
              <fetch-select
                :request="fetchOptions"
                enumCode="vehicle_owner_change_type"
                v-model="form.businessType"
                placeholder="请选择"
                clearable
                filterable
                :format="formatFun"
                :disabled="Boolean(_id)"
                @change="onBusinessType"
              />
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              <fetch-select
                filterable
                clearable
                remote
                reserve-keyword
                v-model="form.vin"
                :remote-method="vinSearch"
                :params="form.vin"
                @change="vinChange"
                value-key="vin"
                label-key="vin"
                placeholder="输入VIN"
                :disabled="Boolean(_id)"
              />
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-input
                placeholder="请输入"
                v-model="form.dealerCode"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              <el-input
                placeholder="请输入"
                v-model="form.dealerName"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="申请人：" prop="applierName">
              <el-input
                placeholder="请输入"
                v-model="form.applierName"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="申请人 ID：" prop="applierId">
              <el-input
                placeholder="请输入"
                v-model="form.applierId"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="申请时间：" prop="applyTime">
              <el-date-picker
                v-model="form.applyTime"
                disabled
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="申请说明：" prop="applyDesc">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model="form.applyDesc"
                clearable
                :rows="2"
                maxLength="500"
              />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="申请单号：" prop="applyNo">
              {{ form.applyNo }}
            </el-form-item>
            <el-form-item label="业务类型：">
              {{ form.businessTypeLabel }}
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              <LPEncrypted
                :value.sync="form.vin"
                :decryptMethod="() => getDecryptField(form.id, 'vin')"
                >
                {{ form.vin }}
              </LPEncrypted>
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              <el-link
                type="primary"
                :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${form.dealerCode}`"
                target="_blank"
              >{{ form.dealerCode }}</el-link>
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
             {{ form.dealerName }}
            </el-form-item>
            <el-form-item label="申请人：" prop="applierName">
              <LPEncrypted
                :value.sync="form.applierName"
                :decryptMethod="() => getDecryptField(form.id, 'applierName')"
                >
                {{ form.applierName }}
              </LPEncrypted>
            </el-form-item>
            <el-form-item label="申请人 ID：" prop="applierId">
              <LPEncrypted
                :value.sync="form.applierId"
                :decryptMethod="() => getDecryptField(form.id, 'applierId')"
                >
                {{ form.applierId }}
              </LPEncrypted>
            </el-form-item>
            <el-form-item label="申请时间：" prop="applyTime">
              {{ form.applyTime }}
            </el-form-item>
            <el-form-item label="申请说明：" prop="applyDesc">
              {{ form.applyDesc }}
            </el-form-item>
          </el-form>
          <div class="common-section-sub-header">
            <h3>审批信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="是否自动审批：" prop="isAutoAudit">
              <el-input
                placeholder="请输入"
                v-model="form.isAutoAudit"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="未满足自动审批原因：" prop="autoApprovalFailReason">
              <el-input
                placeholder="请输入"
                v-model="form.autoApprovalFailReason"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="审批人：" prop="auditorName">
              <el-input
                placeholder="请输入"
                v-model="form.auditorName"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="审批时间：" prop="auditTime">
              <el-date-picker
                v-model="form.auditTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                disabled>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="审批说明：" prop="auditDesc">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model="form.auditDesc"
                clearable
                :rows="2"
                maxLength="500"
                disabled
              />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="是否自动审批：" prop="isAutoAudit">
              {{ form.isAutoAuditLabel }}
            </el-form-item>
            <el-form-item label="未满足自动审批原因：" prop="autoApprovalFailReason">
              {{ form.autoApprovalFailReason }}
            </el-form-item>
            <el-form-item label="审批人：" prop="auditorName">
              {{ form.auditorName }}
            </el-form-item>
            <el-form-item label="审批时间：" prop="auditTime">
              {{ form.auditTime }}
            </el-form-item>
            <el-form-item label="审批说明：" prop="auditDesc">
              {{ form.auditDesc }}
            </el-form-item>
          </el-form>
          <div class="common-section-sub-header">
            <h3>变更信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <template v-if="form.businessType !== BUSINESS_TYPE.SCRAP">
              <el-form-item v-if="form.businessType === BUSINESS_TYPE.SECOND_HAND" label="变更后车主姓名：" prop="targetOwnerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.targetOwnerName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="变更后车主手机号：" prop="targetOwnerPhone">
                <el-input
                  placeholder="请输入"
                  v-model="form.targetOwnerPhone"
                  clearable
                  maxLength="11"
                />
              </el-form-item>
              <el-form-item v-if="form.businessType === BUSINESS_TYPE.SECOND_HAND"  label="变更后车主证件类型：" prop="targetIdType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vehretail_id_card_type"
                  v-model="form.targetIdType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item v-if="form.businessType === BUSINESS_TYPE.SECOND_HAND"  label="变更后车主证件号码：" prop="targetIdNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.targetIdNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="变更后车牌号：" prop="targetPlateNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.targetPlateNo"
                  clearable
                />
              </el-form-item>
            </template>
            <el-form-item label="变更后车辆属性：" prop="targetVehicleProperty">
              <fetch-select
                :key="form.businessType"
                :request="fetchOptions"
                enumCode="claim_vehicle_property"
                v-model="form.targetVehicleProperty"
                placeholder="请选择"
                clearable
                filterable
                :format="formatVehicleProperty"
                :disabled="form.businessType === BUSINESS_TYPE.SCRAP"
              />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <template v-if="form.businessType !== BUSINESS_TYPE.SCRAP">
              <el-form-item v-if="form.businessType === BUSINESS_TYPE.SECOND_HAND" label="变更后车主姓名：" prop="targetOwnerName">
                {{ form.targetOwnerName }}
              </el-form-item>
              <el-form-item label="变更后车主手机号：" prop="targetOwnerPhone">
                {{ form.targetOwnerPhone }}
              </el-form-item>
              <el-form-item v-if="form.businessType === BUSINESS_TYPE.SECOND_HAND" label="变更后车主证件类型：" prop="targetIdTypeLabel">
                {{ form.targetIdTypeLabel }}
              </el-form-item>
              <el-form-item v-if="form.businessType === BUSINESS_TYPE.SECOND_HAND" label="变更后车主证件号码：" prop="targetIdNo">
                {{ form.targetIdNo }}
              </el-form-item>
              <el-form-item label="变更后车牌号：" prop="targetPlateNo">
                {{ form.targetPlateNo }}
              </el-form-item>
            </template>
            <el-form-item label="变更后车辆属性：" prop="targetVehicleProperty">
              {{ form.targetVehiclePropertyLabel }}
            </el-form-item>
          </el-form>
          <div class="common-section-sub-header">
            <h3>作废信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm4" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="作废人：" prop="invalidatorName">
              <el-input
                placeholder="请输入"
                v-model="form.invalidatorName"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="作废时间：" prop="invalidTime">
              <el-input
                placeholder="请输入"
                v-model="form.invalidTime"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="作废说明：" prop="invalidDesc">
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model="form.invalidDesc"
                clearable
                :rows="2"
                maxLength="500"
                disabled
              />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="作废人：" prop="invalidatorName">
              {{ form.invalidatorName }}
            </el-form-item>
            <el-form-item label="作废时间：" prop="invalidTime">
              {{ form.invalidTime }}
            </el-form-item>
            <el-form-item label="作废说明：" prop="invalidDesc">
              {{ form.invalidDesc }}
            </el-form-item>
          </el-form>
          <div class="common-section-sub-header">
            <h3>原车主信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm5" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="车主姓名：" prop="oldOwnerName">
              <el-input
                placeholder="请输入"
                v-model="form.oldOwnerName"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="车主手机号：" prop="oldOwnerPhone">
              <el-input
                placeholder="请输入"
                v-model="form.oldOwnerPhone"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="车主证件类型：" prop="oldIdTypeLabel">
              <el-input
                placeholder="请输入"
                v-model="form.oldIdTypeLabel"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="车主证件号码：" prop="oldIdNo">
              <el-input
                placeholder="请输入"
                v-model="form.oldIdNo"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="车牌号：" prop="oldPlateNo">
              <el-input
                placeholder="请输入"
                v-model="form.oldPlateNo"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="车辆属性：" prop="oldVehiclePropertyLabel">
              <el-input
                placeholder="请输入"
                v-model="form.oldVehiclePropertyLabel"
                clearable
                disabled
              />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="车主姓名：" prop="oldOwnerName">
              {{ form.oldOwnerName }}
            </el-form-item>
            <el-form-item label="车主手机号：" prop="oldOwnerPhone">
              {{ form.oldOwnerPhone }}
            </el-form-item>
            <el-form-item label="车主证件类型：" prop="oldIdTypeLabel">
              {{ form.oldIdTypeLabel }}
            </el-form-item>
            <el-form-item label="车主证件号码：" prop="oldIdNo">
              {{ form.oldIdNo }}
            </el-form-item>
            <el-form-item label="车牌号：" prop="oldPlateNo">
              {{ form.oldPlateNo }}
            </el-form-item>
            <el-form-item label="车辆属性：" prop="oldVehiclePropertyLabel">
              {{ form.oldVehiclePropertyLabel }}
            </el-form-item>
          </el-form>
          <div class="common-section-sub-header">
            <h3>OCR信息</h3>
          </div>
          <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm6" label-width="150px" class="form-edit" v-show="isEditing || !_id">
            <el-form-item label="车主证件类型：" prop="ocrIdTypeLabel">
              <el-input
                placeholder="请输入"
                v-model="form.ocrIdTypeLabel"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="车主证件号码：" prop="ocrIdNo">
              <el-input
                placeholder="请输入"
                v-model="form.ocrIdNo"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="车主名称：" prop="ocrIdUser">
              <el-input
                placeholder="请输入"
                v-model="form.ocrIdUser"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="行驶证所有人：" prop="ocrLicenseOwner">
              <el-input
                placeholder="请输入"
                v-model="form.ocrLicenseOwner"
                clearable
                disabled
              />
            </el-form-item>
            <el-form-item label="行驶证 VIN：" prop="ocrLicenseVin">
              <el-input
                placeholder="请输入"
                v-model="form.ocrLicenseVin"
                clearable
                disabled
              />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item label="车主证件类型：" prop="ocrIdTypeLabel">
              {{ form.ocrIdTypeLabel }}
            </el-form-item>
            <el-form-item label="车主证件号码：" prop="ocrIdNo">
              {{ form.ocrIdNo }}
            </el-form-item>
            <el-form-item label="车主名称：" prop="ocrIdUser">
              {{ form.ocrIdUser }}
            </el-form-item>
            <el-form-item label="行驶证所有人：" prop="ocrLicenseOwner">
              {{ form.ocrLicenseOwner }}
            </el-form-item>
            <el-form-item label="行驶证 VIN：" prop="ocrLicenseVin">
              {{ form.ocrLicenseVin }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>上传附件</h2>
        </div>
        <div v-if="_id" class="common-section-body">
          <div class="common-section-table">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人" name="1" lazy v-if="PERSONAL_ID_TYPES.includes(String(idType))">
                <AisAttachment
                  v-for="type in displayAttachTypes"
                  :key="type"
                  :businessId="_id"
                  :attachType="type"
                  configCode="mcs_vehownerchange"
                  type="card"
                  :title="type"
                  @ocr-success="ocrSuccess"
                  :readonly="attachmentDisabled"
                />
              </el-tab-pane>
              <el-tab-pane label="企业" name="2" lazy v-if="ENTERPRISE_ID_TYPES.includes(String(idType))">
                <AisAttachment
                  v-for="type in displayAttachTypes"
                  :key="type"
                  :businessId="_id"
                  :attachType="type"
                  configCode="mcs_vehownerchange"
                  type="card"
                  :title="type"
                  @ocr-success="ocrSuccess"
                  :readonly="attachmentDisabled"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="common-section-body not-commit" v-else>
          提交新建后，即可添加
        </div>
      </section>
    </el-main>
  </edit-base-container>
  <FormCancelDialog
    :visible.sync="cancelDialogVisible"
    :id="cancelId"
    @update="handleDialogSuccess"
  />
  <FormRejectDialog
    :visible.sync="rejectDialogVisible"
    :id="rejectId"
    @update="handleDialogSuccess"
  />
  </div>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  getDecryptField,
  submit,
  approve,
} from '@/api/datacenter/vehicle/vehicleOwnerChangeApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AisAttachment from '@/libs/components/AisAttachment';
import { getByCode, getFileList } from '@/libs/api/attachment';
import { vehicleListFullByVin } from '@/api/datacenter/vehicle/vehicleProfile';
import { loginUserGet } from '@/libs/api/common';
import LPEncrypted from '@/libs/components/LPEncrypted';
import FormCancelDialog from './FormCancelDialog';
import FormRejectDialog from './FormRejectDialog';
import {
  APPLY_STATUS,
  BUSINESS_TYPE,
  ALLOWED_BUSINESS_TYPES,
  PERSONAL_ID_TYPES,
  ENTERPRISE_ID_TYPES,
  VEHICLE_PROPERTY,
  DATA_SOURCE,
} from './constant';

const defaultForm = {
  // 多选时字段有变化，自行修复
  applyNo: '',
  businessType: '',
  vin: '',
  vehicleProfileId: '',
  applierName: '',
  applierId: '',
  applyTime: '',
  applyDesc: '',
  isAutoAudit: '',
  autoApprovalFailReason: '',
  auditorName: '',
  auditTime: '',
  auditDesc: '',
  targetOwnerName: '',
  targetOwnerPhone: '',
  targetIdType: '',
  targetIdTypeLabel: '',
  targetIdNo: '',
  targetPlateNo: '',
  targetVehicleProperty: '',
  invalidatorName: '',
  invalidTime: '',
  invalidDesc: '',
  oldOwnerName: '',
  oldOwnerPhone: '',
  oldIdType: '',
  oldIdTypeLabel: '',
  oldIdNo: '',
  oldPlateNo: '',
  oldVehicleProperty: '',
  oldVehiclePropertyLabel: '',
  ocrIdType: '',
  ocrIdNo: '',
  ocrIdUser: '',
  ocrLicenseOwner: '',
  ocrLicenseVin: '',
  dealerName: '',
  dealerCode: '',
  ownerOrgId: ''
};
export default {
  name: 'vehicleOwnerChangeApplyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    FetchSelect,
    AisAttachment,
    LPEncrypted,
    FormCancelDialog,
    FormRejectDialog,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '车主信息变更';
    },
    businessData () {
      const data = {
        ...this.form,
      };
      return JSON.stringify(data);
    },
    showEditBtn () {
      if (this.fromLxpApp) { return false; }
      return this.form.applyStatus === APPLY_STATUS.DRAFT || this.form.applyStatus === APPLY_STATUS.REJECTED;
    },
    attachmentDisabled () {
      if (this.fromLxpApp) { return true; }
      return !(this.form.applyStatus === APPLY_STATUS.DRAFT || this.form.applyStatus === APPLY_STATUS.REJECTED);
    },
    displayAttachTypes () {
      const types = new Set();
      if (this.form.businessType === BUSINESS_TYPE.SECOND_HAND) {
        if (PERSONAL_ID_TYPES.includes(this.idType)) {
          ['车主身份证-正面', '车主身份证-反面', '车辆登记证书', '车辆行驶证'].forEach(t => types.add(t));
        }
        if (ENTERPRISE_ID_TYPES.includes(this.idType)) {
          ['营业执照', '车辆登记证书', '车辆行驶证'].forEach(t => types.add(t));
        }
      } else if (this.form.businessType === BUSINESS_TYPE.OWNER_ADJUST) {
        if (PERSONAL_ID_TYPES.includes(this.idType)) {
          ['车主身份证-正面', '车主身份证-反面', '车辆行驶证'].forEach(t => types.add(t));
        }
        if (ENTERPRISE_ID_TYPES.includes(this.idType)) {
          ['营业执照', '车辆行驶证'].forEach(t => types.add(t));
        }
      } else if (this.form.businessType === BUSINESS_TYPE.SCRAP) {
        types.add('报废灭失证明');
      }
      const configured = [...types];
      const configuredSet = new Set(configured);
      const unclassified = this.allFileTypes.filter(t => !configuredSet.has(t));
      return [...configured, ...unclassified];
    },
    idType () {
      if (this.form.businessType === BUSINESS_TYPE.SECOND_HAND) {
        return String(this.form.targetIdType);
      }
      return String(this.form.oldIdType);
    },
    fromLxpApp () {
      return String(this.form.dataSource) === DATA_SOURCE.LXP_APP; // 订单是否来源于LXP APP
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
      APPLY_STATUS,
      BUSINESS_TYPE,
      ALLOWED_BUSINESS_TYPES,
      PERSONAL_ID_TYPES,
      ENTERPRISE_ID_TYPES,
      VEHICLE_PROPERTY,
      activeTab: '1',
      pageTitle: '车主信息变更',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR 根据实际情况修改
      moduleKey: 'AISDC-vehicleOwnerChangeApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        businessType: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请选择VIN', trigger: 'change' }
        ],
        applyDesc: [
          { required: true, message: '请输入申请说明', trigger: 'blur' }
        ],
        targetIdType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        targetOwnerPhone: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      // 权限
      canSubmit: false,
      canCancel: false,
      canApprove: false,
      canReject: false,
      // 作废弹窗
      cancelDialogVisible: false,
      cancelId: '',
      // 驳回弹窗
      rejectDialogVisible: false,
      rejectId: '',
      attachmentConfigs: [],
      allFileTypes: [],
    };
  },
  created () {
    this.canSubmit = this.permissions.has(`${this.moduleKey}-submit`);
    this.canCancel = this.permissions.has(`${this.moduleKey}-cancel`);
    this.canApprove = this.permissions.has(`${this.moduleKey}-approve`);
    this.canReject = this.permissions.has(`${this.moduleKey}-reject`);
  },
  mounted () {
    if (!this._id) {
      loginUserGet().then(data => {
        this.form.dealerName = data.currentOrgName;
        this.form.dealerCode = data.currentOrgCode;
        this.form.ownerOrgId = data.currentOrgId;
      });
    }
  },
  methods: {
    refreshAllAttachments () {
      const find = (vm) => {
        let result = [];
        vm.$children.forEach(child => {
          if (child.$options.name === 'AisAttachment') {
            result.push(child);
          }
          result = result.concat(find(child));
        });
        return result;
      };
      find(this).forEach(a => a.refresh());
    },
    ocrSuccess () {
      this.$refs.containerRef.loadDetail();
    },
    async loadAllFileTypes () {
      if (!this._id) return;
      try {
        const res = await getFileList({ businessId: this._id });
        const allFiles = res || [];
        this.allFileTypes = [...new Set(
          allFiles.map(f => f.attachType).filter(Boolean)
        )];
      } catch (e) {
        console.error('获取附件列表失败:', e);
      }
    },
    async loadAttachmentConfig (config) {
      if (!this._id) return;
      try {
        const data = await getByCode({
          configCode: 'mcs_vehownerchange',
          businessData: JSON.stringify(config),
        });
        if (data && data.detailList) {
          this.attachmentConfigs = data.detailList;
        }
      } catch (e) {
        console.error('获取附件配置失败:', e);
      }
    },
    onBusinessType (value) {
      // 切换业务类型时清空已录入信息
      this.form.targetOwnerName = '';
      this.form.targetOwnerPhone = '';
      this.form.targetIdType = '';
      this.form.targetIdTypeLabel = '';
      this.form.targetIdNo = '';
      this.form.targetPlateNo = '';
      this.form.ocrIdType = '';
      this.form.ocrIdTypeLabel = '';
      this.form.ocrIdNo = '';
      this.form.ocrIdUser = '';
      this.form.ocrLicenseOwner = '';
      this.form.ocrLicenseVin = '';
      this.form.oldOwnerName = '';
      this.form.oldOwnerPhone = '';
      this.form.oldIdType = '';
      this.form.oldIdTypeLabel = '';
      this.form.oldIdNo = '';
      this.form.oldPlateNo = '';
      this.form.oldVehicleProperty = '';
      this.form.oldVehiclePropertyLabel = '';
      this.form.vin = '';
      this.form.vehicleProfileId = '';

      if (value === BUSINESS_TYPE.SCRAP) {
        this.form.targetVehicleProperty = VEHICLE_PROPERTY.SCRAP;
      } else {
        this.form.targetVehicleProperty = '';
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.$nextTick(() => {
            this.loadAttachmentConfig(res);
            this.loadAllFileTypes();
          });
          this.activeTab = PERSONAL_ID_TYPES.includes(String(res.targetIdType || res.oldIdType)) ? '1' : '2';
          return res;
        });
      }
    },
    submitRequest () {
      if (this.form.targetVehicleProperty === VEHICLE_PROPERTY.OPERATIONAL &&
        this.form.oldVehicleProperty !== VEHICLE_PROPERTY.HOUSEHOLD) {
        this.$message.warning('当前只支持从家用车辆属性申请变更为运营车辆属性');
        return Promise.reject(new Error('validation failed'));
      }
      return addOrUpdate({ ...this.form }).then(res => {
        this.$nextTick(() => this.refreshAllAttachments());
        return res;
      });
    },
    // 提交
    handleSubmit () {
      const bt = this.form.businessType;

      if (bt === BUSINESS_TYPE.SECOND_HAND) {
        const hasAny = this.form.targetOwnerName || this.form.targetOwnerPhone ||
          this.form.targetIdType || this.form.targetIdNo;
        if (hasAny) {
          if (!this.form.targetOwnerName || !this.form.targetOwnerPhone ||
            !this.form.targetIdType || !this.form.targetIdNo) {
            this.$message.warning('变更后车主姓名、手机号、证件类型、证件号码需同时填写');
            return;
          }
        }
        if (this.form.targetIdNo && this.form.oldIdNo &&
          this.form.targetIdNo === this.form.oldIdNo) {
          this.$message.warning('变更后车主证件号码和原车主一致，不允许提报二手车调整业务');
          return;
        }
      }

      if (bt === BUSINESS_TYPE.OWNER_ADJUST) {
        if (!this.form.targetOwnerPhone && !this.form.targetPlateNo && !this.form.targetVehicleProperty) {
          this.$message.warning('变更后信息未维护，请维护后再提交');
          return;
        }
      }

      submit({ id: this._id }).then(() => {
        this.$message.success('提交成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    // 作废
    handleCancel () {
      this.cancelId = this._id;
      this.cancelDialogVisible = true;
    },
    // 审批通过
    handleApprove () {
      approve({ id: this._id }).then(() => {
        this.$message.success('审批通过');
        this.$refs.containerRef.loadDetail();
      });
    },
    // 审批驳回
    handleReject () {
      this.rejectId = this._id;
      this.rejectDialogVisible = true;
    },
    // 对话框成功回调
    handleDialogSuccess () {
      this.$refs.containerRef.loadDetail();
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getDecryptField (id, field) {
      return getDecryptField(id, field);
    },
    vinSearch (query) {
      // [
      //   { "家用": "1" },
      //   { "营运": "2" },
      //   { "B级车": "4" },
      //   { "J级车": "10" },
      //   { "J1级车": "20" },
      //   { "专车": "30" },
      //   { "报废灭失": "60" }
      // ]
      // 只允许选择【销售日期】非空，且【车辆属性】不是报废灭失的车辆
      return vehicleListFullByVin({
        searchVin: query,
        pageSize: 20,
        pageNum: 1,
        isSaleDateNull: false,
        usageTypeList: ['1', '2', '4', '10', '20', '30'],
      }).then(res => {
        return res;
      });
    },
    vinChange (val, record) {
      this.form.vehicleProfileId = record?.id; // 车辆档案id
      const owner = record?.vehicleProfileOwnerResp;
      this.form.oldOwnerName = owner?.ownerName; // 车主姓名
      this.form.oldOwnerPhone = owner?.mobilephone; // 车主手机号
      this.form.oldIdType = owner?.idcardType; // 证件类型
      this.form.oldIdTypeLabel = owner?.idcardTypeLabel;
      this.form.oldIdNo = owner?.idcardNo; // 证件号码
      this.form.oldPlateNo = record?.vehiclePlateNo; // 车牌号
      this.form.oldVehicleProperty = record?.usageType; // 车辆属性
      this.form.oldVehiclePropertyLabel = record?.usageTypeLabel;
    },
    formatFun (options) {
      return options.filter(item =>
        ALLOWED_BUSINESS_TYPES.includes(String(item.code)));
    },
    formatVehicleProperty (options) {
      if ([BUSINESS_TYPE.SECOND_HAND, BUSINESS_TYPE.OWNER_ADJUST].includes(this.form.businessType)) {
        return options.filter(item => item.code === VEHICLE_PROPERTY.OPERATIONAL);
      }
      return options;
    }
  }
};
</script>
<style lang="scss" scoped>
.container{
  width: 100%;
  height: 100%;
}
.common-section-sub-header{
  display: flex;
  margin-bottom: 8px;
  h3 {
    color: #0A0E0A;
    font-size: 14px;
    font-weight: 500;
    line-height: 30px;
    margin-right: 15px;
  }
}

</style>
