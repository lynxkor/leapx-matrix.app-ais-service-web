<template>
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
                value-key="code"
                label-key="name"
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
              {{ form.vin }}
            </el-form-item>
            <el-form-item label="门店编码：" prop="dealerCode">
              {{ form.dealerCode }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
             {{ form.dealerName }}
            </el-form-item>
            <el-form-item label="申请人：" prop="applierName">
              {{ form.applierName }}
            </el-form-item>
            <el-form-item label="申请人 ID：" prop="applierId">
              {{ form.applierId }}
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
              {{ form.isAutoAudit }}
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
            <template v-if="form.businessType !== '60'">
              <el-form-item v-if="form.businessType === '10'" label="变更后车主姓名：" prop="targetOwnerName">
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
                />
              </el-form-item>
              <el-form-item v-if="form.businessType === '10'"  label="变更后车主证件类型：" prop="targetIdType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="vehretail_id_card_type"
                  v-model="form.targetIdType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item v-if="form.businessType === '10'"  label="变更后车主证件号码：" prop="targetIdNo">
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
            <el-form-item v-else label="变更后车辆属性：" prop="targetVehicleProperty">
              <el-input
                placeholder="请输入"
                v-model="form.targetVehicleProperty"
                clearable
                :disabled="form.businessType === '60'"
              />
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
            <el-form-item v-if="form.businessType === '10'" label="变更后车主姓名：" prop="targetOwnerName">
              {{ form.targetOwnerName }}
            </el-form-item>
            <el-form-item label="变更后车主手机号：" prop="targetOwnerPhone">
              {{ form.targetOwnerPhone }}
            </el-form-item>
            <el-form-item v-if="form.businessType === '10'" label="变更后车主证件类型：" prop="targetIdTypeLabel">
              {{ form.targetIdTypeLabel }}
            </el-form-item>
            <el-form-item v-if="form.businessType === '10'" label="变更后车主证件号码：" prop="targetIdNo">
              {{ form.targetIdNo }}
            </el-form-item>
            <el-form-item label="变更后车牌号：" prop="targetPlateNo">
              {{ form.targetPlateNo }}
            </el-form-item>
            <el-form-item label="变更后车辆属性：" prop="targetVehicleProperty">
              {{ form.targetVehicleProperty }}
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
            <el-form-item label="车辆属性：" prop="oldVehicleProperty">
              <el-input
                placeholder="请输入"
                v-model="form.oldVehicleProperty"
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
            <el-form-item label="车主证件类型：" prop="oldIdType">
              {{ form.oldIdType }}
            </el-form-item>
            <el-form-item label="车主证件号码：" prop="oldIdNo">
              {{ form.oldIdNo }}
            </el-form-item>
            <el-form-item label="车牌号：" prop="oldPlateNo">
              {{ form.oldPlateNo }}
            </el-form-item>
            <el-form-item label="车辆属性：" prop="oldVehicleProperty">
              {{ form.oldVehicleProperty }}
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
            <el-form-item label="车主证件类型：" prop="ocrIdType">
              {{ form.ocrIdType }}
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
          <h2>附件</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <AisAttachment
              :businessId="_id"
              configCode="xxx"
              attachType="xxxx"
              ref="attachment"
            />
          </div>
        </div>
      </section>
    </el-main>
  </edit-base-container>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  vinSearchApi,
} from '@/api/datacenter/vehicle/vehicleOwnerChangeApply/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AisAttachment from '@/libs/components/AisAttachment';

const defaultForm = {
  // 多选时字段有变化，自行修复
  applyNo: '',
  businessType: '',
  vin: '',
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
  ocrIdType: '',
  ocrIdNo: '',
  ocrIdUser: '',
  ocrLicenseOwner: '',
  ocrLicenseVin: '',
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
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '车主信息变更';
    },
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR 根据实际情况修改
      moduleKey: 'AISDC-vehicleOwnerChangeApply',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
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
      },
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
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
    vinSearch (query) {
      return vinSearchApi({
        searchVin: query,
        pageSize: 20,
        pageNum: 1,
      }).then(res => {
        return res;
      });
    },
    vinChange (val, record) {},
  }
};
</script>
<style lang="scss" scoped>
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
