<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
   <edit-page-layout ref="editLayout" title="添加方案" >
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`活动编码：${form.activityCode}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :dataTransform="dataTransform"
      >
        <template #extraButtons>
          <el-button
            v-if="form.activityStatus === '0' && permissions.has(moduleKey + '-submitPartsPreparation')"
            size="small"
            @click="handleSubmitPartsPreparation"
          >提交零配件准备</el-button>
          <el-button
            v-if="form.activityStatus === '1' && permissions.has(moduleKey + '-partsPreparationCompleted')"
            size="small"
            @click="handlePartsPreparationCompleted"
          >零配件准备完成</el-button>
        </template>
        <template>
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px"  class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="活动编码：" prop="activityCode">
                    <base-input
                      placeholder="请输入"
                      v-model="form.activityCode"
                      clearable
                      :disabled="form.activityStatus === '2'"
                    />
                  </el-form-item>
                  <el-form-item label="活动名称：" prop="activityName">
                    <base-input
                      placeholder="请输入"
                      v-model="form.activityName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="活动类型：" prop="activityType">
                    <fetch-select
                      v-show="!isServiceCareActivity"
                      :request="fetchOptions"
                      enumCode="claim_activity_type"
                      v-model="form.activityType"
                      :format="filterActivityType"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                    <el-input
                      v-show="isServiceCareActivity"
                      v-model="form.activityTypeLabel"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="自动审批：" prop="autoApprove">
                    <el-switch
                      v-model="form.autoApprove">
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="活动开始时间：" prop="startTime">
                    <el-date-picker
                      v-model="form.startTime"
                      type="datetime"
                      :picker-options="startPickerOptions"
                      placeholder="开始日期"
                      size="small"
                      align="right"
                      :disabled="form.activityStatus === '2'">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="活动结束时间：" prop="endTime">
                    <el-date-picker
                      v-model="form.endTime"
                      type="datetime"
                      :picker-options="endPickerOptions"
                      placeholder="结束日期"
                      size="small"
                      align="right">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="施工单必传附件：" prop="attachmentRequired">
                    <el-switch
                      v-model="form.attachmentRequired">
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="活动数量：" prop="vehicleCount">
                    <!-- <base-input
                      placeholder="请输入"
                      v-model="form.vehicleCount"
                      clearable
                    /> -->
                    {{ form.vehicleCount }}
                  </el-form-item>
                  <el-form-item label="完成数量：" prop="finishedVehicleCount">
                    <!-- <base-input
                      placeholder="请输入"
                      v-model="form.finishedVehicleCount"
                      clearable
                    /> -->
                    {{ form.finishedVehicleCount }}
                  </el-form-item>
                  <el-form-item label="完成情况（%）：" prop="finishedPercent">
                    <!-- <base-input
                      placeholder="请输入"
                      v-model="form.finishedPercent"
                      clearable
                    /> -->
                    {{ form.finishedPercent }}
                  </el-form-item>
                  <el-form-item label="活动状态：" prop="activityStatus">
                    <!-- <fetch-select
                      :request="fetchOptions"
                      enumCode="claim_activity_state"
                      v-model="form.activityStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                    /> -->
                    {{ form.activityStatusLabel }}
                  </el-form-item>
                  <el-form-item class="form-item-full" label="活动描述：" prop="description">
                    <base-input
                      type="textarea"
                      placeholder="请输入"
                      v-model="form.description"
                      clearable
                      :rows="2"
                    />
                  </el-form-item>
                  <el-form-item class="form-item-full" label="活动费用内容：" prop="costContent">
                    <base-input
                      type="textarea"
                      placeholder="请输入"
                      v-model="form.costContent"
                      clearable
                      :rows="2"
                    />
                  </el-form-item>
                  <el-form-item class="form-item-full" label="故障现象描述：" prop="faultPhenomenon">
                    <base-input
                      type="textarea"
                      placeholder="请输入"
                      v-model="form.faultPhenomenon"
                      clearable
                      :rows="2"
                    />
                  </el-form-item>
                  <el-form-item class="form-item-full" label="故障排查流程：" prop="troubleshootingFlow">
                    <base-input
                      type="textarea"
                      placeholder="请输入"
                      v-model="form.troubleshootingFlow"
                      clearable
                      :rows="2"
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="活动编码：">
                    {{ form.activityCode }}
                  </el-form-item>
                  <el-form-item label="活动名称：">
                    {{ form.activityName }}
                  </el-form-item>
                  <el-form-item label="活动类型：">
                    {{ form.activityTypeLabel }}
                  </el-form-item>
                  <el-form-item label="活动开始时间：">
                    {{ form.startTime }}
                  </el-form-item>
                  <el-form-item label="活动结束时间：">
                    {{ form.endTime }}
                  </el-form-item>
                  <el-form-item label="自动审批：">
                    {{ form.autoApprove ? '是' : '否' }}
                  </el-form-item>
                  <el-form-item label="施工单必传附件：">
                    {{ form.attachmentRequired  ? '是' : '否' }}
                  </el-form-item>
                  <el-form-item label="活动数量：">
                    {{ form.vehicleCount }}
                  </el-form-item>
                  <el-form-item label="完成数量：">
                    {{ form.finishedVehicleCount }}
                  </el-form-item>
                  <el-form-item label="完成情况（%）：">
                    {{ form.finishedPercent }}
                  </el-form-item>
                  <el-form-item label="活动状态：">
                    {{ form.activityStatusLabel }}
                  </el-form-item>
                  <el-form-item class="form-item-full" label="活动描述：">
                    {{ form.description }}
                  </el-form-item>
                  <el-form-item class="form-item-full" label="活动费用内容：">
                    {{ form.costContent }}
                  </el-form-item>
                  <el-form-item class="form-item-full" label="故障现象描述：">
                    {{ form.faultPhenomenon }}
                  </el-form-item>
                  <el-form-item class="form-item-full" label="故障排查流程：">
                    {{ form.troubleshootingFlow }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>结算类型</h2>
              </div>
              <div class="common-section-body">
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="结算类型：" prop="checkoutTypeId">
                    <fetch-select
                      v-show="!isServiceCareActivity"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      disabled
                      v-model="form.checkoutTypeId"
                      :remote-method="checkoutTypeRemote"
                      :params="form.checkoutTypeName"
                      @change="handleCheckoutType"
                      value-key="id"
                      label-key="name"
                    />
                    <el-input
                      v-show="isServiceCareActivity"
                      v-model="form.checkoutTypeName"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item v-if="!isServiceCareActivity" label="保修类型：" prop="repairItemTypeId">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="form.repairItemTypeId"
                      :remote-method="repairItemTypeRemote"
                      :params="form.repairItemTypeName"
                      @change="handleRepairItem"
                      value-key="id"
                      label-key="name"
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="结算类型：" prop="checkoutTypeName">
                    {{ form.checkoutTypeName }}
                  </el-form-item>
                  <el-form-item v-if="!isServiceCareActivity" label="保修类型：" prop="repairItemTypeName">
                    {{ form.repairItemTypeName }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <plan-info
              ref="planInfo"
              :id="_id"
              :moduleKey="moduleKey"
              @change="schemeChange"
              :isServiceCareActivity="isServiceCareActivity"
              :activityStatus="form.activityStatus"
              :isEditing="isEditing"
            />
            <fault
              v-if="!isServiceCareActivity"
              :id="_id"
              :moduleKey="moduleKey"
            />
            <vehicle
              :id="_id"
              :moduleKey="moduleKey"
              :isServiceCareActivity="isServiceCareActivity"
            />
            <file-config
              :id="_id"
              :moduleKey="moduleKey"
              :schemeId="schemeId"
            />
          </el-main>
        </template>
      </edit-base-container>
     </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPageLayout from '@/libs/components/EditPageLayout';
import { getList } from '../../../../../api/maintain/basic/checkoutType';
import { listItem as repairGetList } from '../../../../../api/maintain/basic/repairItemType';
import { getDetail, addOrUpdate, submitPartsPreparation, partsPreparationCompleted } from '../../../../../api/claimreturn/claim/basic/serviceActivity';
import PlanInfo from './PlanInfo.vue';
import FileConfig from './FileConfig/index.vue';
import { formatDateTime } from '@/libs/utils';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import Vehicle from './Vehicle';
import Fault from './Fault';

const defaultForm = {
  // 多选时字段有变化，自行修复
  activityCode: '',
  activityName: '',
  activityType: '',
  activityStatus: '',
  startTime: '',
  endTime: '',
  attachmentRequired: false,
  description: '',
  vehicleCount: '',
  updateTime: '',
  finishedVehicleCount: '',
  finishedPercent: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  autoApprove: false,
  costContent: '',
  faultPhenomenon: '',
  troubleshootingFlow: '',
  checkoutTypeId: '392BB70C-82AC-E911-B0BB-FC82BA5F9EDF',
  checkoutTypeName: '保修',
  repairItemTypeId: '64A3066F-82AC-E911-B0BB-FC82BA5F9EDF',
  repairItemTypeName: '',
};

export default {
  name: 'techServiceActivityEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    showBackBtn: {
      type: Boolean,
      default: true,
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    FetchSelect,
    EditPageLayout,
    BaseInput,
    PlanInfo,
    FileConfig,
    Vehicle,
    Fault,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    startPickerOptions () {
      const endTime = this.form.endTime;
      return {
        disabledDate (time) {
          return endTime ? time.getTime() > new Date(endTime).getTime() : false;
        },
      };
    },
    endPickerOptions () {
      const startTime = this.form.startTime;
      return {
        disabledDate (time) {
          return startTime ? time.getTime() < new Date(startTime).getTime() : false;
        },
      };
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
    }
  },
  data () {
    const form = this.getDefautlForm();
    const moduleKey = 'AISCR-' + this.$route.meta.moduleKey;
    const isServiceCareActivity = this.$route.meta.isServiceCareActivity;
    return {
      pageTitle: this.$route.meta.name,
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey,
      isServiceCareActivity,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        activityCode: [
          { required: true, message: '请输入活动编码', trigger: 'blur' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        activityType: [
          { required: !isServiceCareActivity, message: '请选择活动类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择活动开始时间', trigger: 'change' },
        ],
        endTime: [
          { required: true, message: '请选择活动结束时间', trigger: 'change' },
        ],
        attachmentRequired: [
          { required: true, message: '请输入施工单必需上传附件（1&#x3D;是，0&#x3D;否）', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入活动描述', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        autoApprove: [
          { required: true, message: '请输入是否自动审核', trigger: 'blur' }
        ],
        faultPhenomenon: [
          { required: false, message: '请输入故障现象描述', trigger: 'blur' }
        ],
        troubleshootingFlow: [
          { required: false, message: '请输入故障排查流程', trigger: 'blur' }
        ],
        checkoutTypeId: [
          { required: !isServiceCareActivity, message: '请选择结算类型', trigger: 'change' }
        ],
        checkoutTypeName: [
          { required: true, message: '请选择结算类型名称', trigger: 'change' }
        ],
        repairItemTypeId: [
          { required: true, message: '请选择保修类型ID', trigger: 'change' }
        ],
        repairItemTypeName: [
          { required: true, message: '请选择保修类型名称', trigger: 'change' }
        ],
      },
      schemeId: '',
    };
  },
  mounted () {
    if (this.isServiceCareActivity) {
      this.form.checkoutTypeId = '352BB70C-82AC-E911-B0BB-FC82BA5F9EDF';
      this.form.checkoutTypeName = '自费';
      this.form.activityTypeLabel = '服务关爱活动';
      this.form.activityType = '4';
    }
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    dataTransform (data) {
      Object.assign(this.form, data);
      this.form.startTime = data.startTime;
      this.form.endTime = data.endTime;
      this.form.autoApprove = data.autoApprove === '1';
      this.form.attachmentRequired = data.attachmentRequired === '1';
      return this.form;
    },
    async submitRequest () {
      const startTime = formatDateTime(this.form.startTime);
      const endTime = formatDateTime(this.form.endTime);
      const res = await addOrUpdate({
        ...this.form,
        startTime,
        endTime,
        autoApprove: this.form.autoApprove ? '1' : '0',
        attachmentRequired: this.form.attachmentRequired ? '1' : '0',
      });
      if (res && this.schemeId) {
        this.$refs.planInfo.getDetail(this.schemeId);
      }
      return res;
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
    // 结算类型
    checkoutTypeRemote (query) {
      return getList({
        nameLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    // 结算类型
    handleCheckoutType (val, record) {
      if (record) {
        this.form.checkoutTypeName = record.name;
        // 结算类型改变时清空保修类型，触发重新查询
        this.form.repairItemTypeId = '';
        this.form.repairItemTypeName = '';
      }
    },
    // 维修类型
    repairItemTypeRemote (query) {
      const checkoutTypeId = this.form.checkoutTypeId;
      // 如果结算类型没有选择，默认查询 "10", "20"  目前写死 只查询保修类型
      // const checkoutTypeIds = checkoutTypeId ? [checkoutTypeId] : ['10', '20'];
      const categorys = ['20'];
      return new Promise(resolve => {
        repairGetList({
          nameLike: query,
          categorys,
          pageSize: 20,
          pageNum: 1,
        }).then(res => {
          const list = (res || []).filter(
            item => item.checkoutTypeId === checkoutTypeId
          );
          resolve(list);
        }).catch(() => {
          resolve([]);
        });
      });
    },
    // 维修类型
    handleRepairItem (val, record) {
      if (record) {
        this.form.repairItemTypeName = record.name;
      }
    },
    //
    schemeChange (id) {
      this.schemeId = id;
    },
    handleSubmitPartsPreparation () {
      submitPartsPreparation({ id: this._id }).then(() => {
        this.$message.success('提交配件准备成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    handlePartsPreparationCompleted () {
      partsPreparationCompleted({ id: this._id }).then(() => {
        this.$message.success('零配件准备完成');
        this.$refs.containerRef.loadDetail();
      });
    },
    filterActivityType (options) {
      return options.filter(item => item.code !== '4');
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .vxe-table--empty-placeholder {
  justify-content: flex-start;
}
::v-deep .vxe-table--empty-content {
  width: auto;
}
::v-deep .m-vxe-table-empty-text {
  text-align: left;
  padding: 0 12px;
}
</style>
