<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <edit-page-layout ref="editLayout" title="" >
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`活动编码：${form.activityCode}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        direction="vertical"
        :showBackBtn="showBackBtn"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #default="{formApi}">
          <el-main v-loading="loading">
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                 <el-form v-form-register="formApi" :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="活动编码：" prop="activityId">
                    <list-select
                      listUrl="/claimreturn/claim/web/basic/techServiceActivity/listFull"
                      placeholder="请选择"
                      v-model="form.activityId"
                      query-key="activityCodeLike"
                      clearable
                      :disabled="Boolean(_id)"
                      auto-load-options
                      collapseTags
                      no-param-load
                      labelKey="activityCode"
                      @change="handleActivityChange"
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="活动名称：" prop="activityName">
                    {{ form.activityName }}
                  </el-form-item>
                  <el-form-item label="VIN：" prop="vin">
                    <!-- todo 车辆档案 -->
                    <LPEncrypted
                      :value.sync="form.vin"
                      :decryptMethod="() => getDetailDecryptField(form.id, 'vin')"
                    >
                      <el-input
                        placeholder="请输入"
                        v-model="form.vin"
                        :disabled="Boolean(_id)"
                        clearable
                      />
                    </LPEncrypted>
                  </el-form-item>
                  <el-form-item label="计划实施门店名称：" prop="plannedDealerCode">
                    <dealer-select
                      :disabled="form.finished==='1'"
                      v-model="form.plannedDealerCode"
                      :defaultDealerName="form.plannedDealerName"
                    />
                  </el-form-item>
                  <el-form-item label="车主姓名：" prop="ownerName">
                    {{ form.ownerName }}
                  </el-form-item>
                  <el-form-item label="车主手机号码：" prop="ownerPhone">
                    <LPEncrypted
                      :value.sync="form.ownerPhone"
                      :decryptMethod="() => getDetailDecryptField(form.id, 'ownerPhone')"
                    />
                  </el-form-item>
                  <el-form-item label="是否完成：" prop="finished">
                    {{ form.finishedLabel }}
                  </el-form-item>
                  <el-form-item label="完成时间：" prop="finishTime">
                    {{ form.finishTime }}
                  </el-form-item>
                  <el-form-item label="实际施工门店名称：" prop="actualDealerName">
                    {{ form.actualDealerName }}
                  </el-form-item>
                  <el-form-item label="施工单号：" prop="workOrderNo">
                    {{ form.workOrderNo }}
                  </el-form-item>
                  <el-form-item label="施工方案：" prop="schemeName">
                    {{ form.schemeName }}
                  </el-form-item>
                </el-form>
                <el-form :inline="true" label-width="150px"  class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="活动编码：" prop="activityId">
                    {{ form.activityId }}
                  </el-form-item>
                  <el-form-item label="活动名称：" prop="activityName">
                    {{ form.activityName }}
                  </el-form-item>
                  <el-form-item label="VIN：" prop="vin">
                    {{ form.vin }}
                  </el-form-item>
                  <el-form-item label="计划实施门店名称：" prop="plannedDealerCode">
                    {{ form.plannedDealerCode }}
                  </el-form-item>
                  <el-form-item label="车主姓名：" prop="ownerName">
                    {{ form.ownerName }}
                  </el-form-item>
                  <el-form-item label="车主手机号码：" prop="ownerPhone">
                    {{ form.ownerPhone }}
                  </el-form-item>
                  <el-form-item label="是否完成：" prop="finished">
                    {{ form.finished }}
                  </el-form-item>
                  <el-form-item label="完成时间：" prop="finishTime">
                    {{ form.finishTime }}
                  </el-form-item>
                  <el-form-item label="实际施工门店名称：" prop="actualDealerName">
                    {{ form.actualDealerName }}
                  </el-form-item>
                  <el-form-item label="施工单号：" prop="workOrderNo">
                    {{ form.workOrderNo }}
                  </el-form-item>
                  <el-form-item label="施工方案：" prop="schemeName">
                    {{ form.schemeName }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
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
import { getDetail, addOrUpdate, getDetailDecryptField } from '@/api/claimreturn/claim/basic/serviceActivityVehicle';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ListSelect from '@/libs/components/list-select/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';
import LPEncrypted from '@/libs/components/LPEncrypted';
import EditBaseContainer from '@/components/EditBaseContainer';
import EditPageLayout from '@/libs/components/EditPageLayout';

const defaultForm = {
  // 多选时字段有变化，自行修复
  activityId: '',
  activityCode: '',
  vin: '',
  activityName: '',
  activityType: '',
  activityStatus: '',
  startTime: '',
  endTime: '',
  plannedDealerName: '',
  finished: '',
  actualDealerName: '',
  finishTime: '',
  workOrderNo: '',
  ownerPhone: '',
  schemeName: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  autoApprove: '',
  attachmentRequired: '',
  description: '',
  costContent: '',
  faultPhenomenon: '',
  troubleshootingFlow: '',
  settlementTypeId: '',
  settlementTypeName: '',
  warrantyTypeId: '',
  warrantyTypeName: '',
  plannedDealerId: null,
  plannedDealerCode: '',
  manualCompletionNote: '',
  manualOperatorId: '',
  manualOperatorName: '',
  manualOperationTime: '',
  actualDealerId: '',
  actualDealerCode: '',
  workOrderId: '',
  schemeId: '',
  ownerName: '',
};

export default {
  name: 'serviceActivityVehicleEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    showBackBtn: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    EditPageLayout,
    DealerSelect,
    ListSelect,
    LPEncrypted
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
      pageTitle: '服务活动车辆',
      pageType: 'edit',
      moduleKey: 'AISCR-serviceActivityVehicle',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      rules: {
        activityId: [
          { required: true, message: '请输入活动编码', trigger: 'blur' }
        ],
        vin: [
          { required: true, message: '请输入VIN', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    getDetailDecryptField (id, field) {
      return getDetailDecryptField(id, field);
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
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
    handleActivityChange (val, selectedItem) {
      console.log('handleActivityChange', val, selectedItem);
      if (!val) {
        this.form.activityName = null;
      } else {
        this.form.activityName = selectedItem.activityName;
      }
    }
  }
};
</script>
