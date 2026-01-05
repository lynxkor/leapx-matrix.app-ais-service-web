<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
   <edit-page-layout ref="editLayout" title="添加方案" >
    <template #left>
      <div class="page-common-edit">
        <edit-base-container
          :id="_id"
          :title="`活动编码：${form.activityCode}`"
          :isEditing="isEditing"
          :submitLoading="submitLoading"
          :canAddOrUpdate="canAddOrUpdate"
          @submit="submitForm"
          @edit="baseMixinEdit"
          @cancel="baseMixinCancel"
          @refresh="baseMixinRefresh"
          @reset="baseMixinReset"
        >
        <template #default="{formApi}">
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <el-form v-form-register="formApi" :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px"  class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="活动编码：" prop="activityCode">
                    <base-input
                      placeholder="请输入"
                      v-model="form.activityCode"
                      clearable
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
                      :request="fetchOptions"
                      enumCode="claim_activity_type"
                      v-model="form.activityType"
                      :format="filterActivityType"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="自动审批：" prop="autoApprove">
                    <el-switch
                      v-model="form.autoApprove">
                    </el-switch>
                  </el-form-item>
                  <el-form-item class="form-item-half" label="活动时间：" prop="activityTime">
                    <el-date-picker
                      v-model="form.activityTime"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
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
                <el-form v-form-register="formApi" :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="结算类型：" prop="checkoutTypeName">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="form.checkoutTypeId"
                      :remote-method="checkoutTypeRemote"
                      :params="form.checkoutTypeName"
                      @change="handleCheckoutType"
                      value-key="id"
                      label-key="name"
                    />
                  </el-form-item>
                  <el-form-item label="保修类型：" prop="repairItemTypeName">
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
                  <el-form-item label="保修类型：" prop="repairItemTypeName">
                    {{ form.repairItemTypeName }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <plan-info
              :id="_id"
              :moduleKey="moduleKey"
              @change="schemeChange"
            />
            <file-config
              :id="_id"
              :moduleKey="moduleKey"
              :schemeId="schemeId"
            />
          </el-main>
        </template>
        </edit-base-container>
      </div>
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
import { getList as repairGetList } from '../../../../../api/maintain/basic/repairItemType';
import { getDetail, addOrUpdate } from '../../../../../api/claimreturn/claim/basic/techServiceActivity';
import PlanInfo from './PlanInfo.vue';
import FileConfig from './FileConfig/index.vue';
import { formatDateTime } from '@/libs/utils';
import editContainerMixin from '@/components/EditBaseContainer/editContainerMixin';
import EditBaseContainer from '@/components/EditBaseContainer';

const defaultForm = {
  // 多选时字段有变化，自行修复
  activityCode: '',
  activityName: '',
  activityType: '',
  activityStatus: '',
  startTime: '',
  endTime: '',
  activityTime: [],
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
  checkoutTypeId: '',
  checkoutTypeName: '',
  repairItemTypeId: '',
  repairItemTypeName: '',
};

export default {
  name: 'techServiceActivityEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins, editContainerMixin],
  components: {
    EditBaseContainer,
    FetchSelect,
    EditPageLayout,
    BaseInput,
    PlanInfo,
    FileConfig,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-techServiceActivity',
      loading: false,
      submitLoading: false,
      isEditing: false,
      yes_no_enum: YES_NO_ENUM,
      defaultForm: defaultForm,
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
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        activityTime: [
          { required: true, message: '请选择活动时间', trigger: 'change' },
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
        costContent: [
          { required: true, message: '请输入活动费用内容', trigger: 'blur' }
        ],
        faultPhenomenon: [
          { required: true, message: '请输入故障现象描述', trigger: 'blur' }
        ],
        troubleshootingFlow: [
          { required: true, message: '请输入故障排查流程', trigger: 'blur' }
        ],
        checkoutTypeId: [
          { required: true, message: '请选择结算类型ID', trigger: 'change' }
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
      },
      schemeId: '',
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    getDetailData () {
      const id = this._id;
      if (!this.id) { // 非嵌入集中视图时才更新标题
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['技术服务活动', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          this.form.activityTime = [
            new Date(res.startTime),
            new Date(res.endTime),
          ];
          this.form.autoApprove = res.autoApprove === '1';
          this.form.attachmentRequired = res.attachmentRequired === '1';
          //
          Object.assign(this.originalForm, this.form);
        });
      }
    },
    async submitForm (defer) {
      try {
        this.submitLoading = true;
        const startTime = formatDateTime(this.form.activityTime[0]);
        const endTime = formatDateTime(this.form.activityTime[1]);
        return addOrUpdate({
          ...this.form,
          startTime,
          endTime,
          autoApprove: this.form.autoApprove ? '1' : '0',
          attachmentRequired: this.form.attachmentRequired ? '1' : '0',
        }).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });

          const id = res;
          // 编辑时必须调用
          if (this.form.id) {
            if (defer) {
              defer.resolve();
            } else {
              this.getDetailData();
            }
          } else if (defer && id) {
            // 新建时必须调用
            defer.resolve(id);
          }
        }).finally(() => {
          this.submitLoading = false;
        });
      } catch (e) {
        //
      }
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
      }
    },
    // 维修类型
    repairItemTypeRemote (query) {
      return repairGetList({
        nameLike: query,
        pageSize: 20,
        pageNum: 1,
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
    filterActivityType (options) {
      return options.filter(item => item.code !== '4');
    },
  }
};
</script>
