<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>委托信息</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="190px" class="form-edit" v-if="isEditing || !_id" :disabled="formDisabled">
        <el-form-item label="维修类型（汇总）：" prop="repairItemTypeDetailCollect">
          <el-input
            placeholder="请输入"
            v-model="form.repairItemTypeDetailCollect"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="业务类型：" prop="businessType">
          <fetch-select
            :request="fetchOptions"
            :disabled="!!form.appointmentNo"
            enumCode="BusinessTypeEnum"
            v-model="form.businessType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="三包预警：" prop="alarmLevel">
          <el-input
            placeholder="请输入"
            v-model="form.alarmLevel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="是否已生成结算单：" prop="isCreateStatementInfo">
          <el-input
            placeholder="请输入"
            v-model="form.isCreateStatementInfoLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="预计交车时间：" prop="expectFinishAt">
          <el-date-picker
            ref="expectFinishDatePicker"
            type="datetime"
            placeholder="请选择时间"
            v-model="form.expectFinishAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="expectFinishAtPickerOptions"
            @focus="handleExpectFinishFocus"
            @change="handleExpectFinishChange"
            :readonly="!isExpectFinishEditable"
            :disabled="!_id"
          />
        </el-form-item>
        <!--
        <el-form-item label="是否门店开启直播：" prop="isStoreLive">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isStoreLive"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否锁定直播开关：" prop="isLockLive">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.isLockLive"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="是否直播：" prop="isLive">
          <fetch-select
            :request="fetchOptions"
            enumCode="LiveStatusEnum"
            v-model="form.isLive"
            placeholder="请选择"
            clearable
            filterable
            :disabled="isLiveDisabled"
            @change="handleIsLiveChange"
          />
        </el-form-item> -->
        <el-form-item label="预检完成时间：" prop="previewingFinishAt">
          <el-date-picker
            type="datetime"
            placeholder="请选择时间"
            v-model="form.previewingFinishAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="生成结算单时间：" prop="createStatementInfoDate">
          <el-date-picker
            type="datetime"
            placeholder="请选择时间"
            v-model="form.createStatementInfoDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="是否返修：" prop="haveRework">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.haveRework"/>
        </el-form-item>
        <el-form-item label="是否洗车：" prop="isCarWash">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.isCarWash" />
        </el-form-item>
        <el-form-item label="制单完成时间：" prop="confirmedOn">
          <el-date-picker
            type="datetime"
            placeholder="请选择时间"
            v-model="form.confirmedOn"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="是否需要提报预授权：" prop="isPreAuth">
          <el-input
            placeholder="请输入"
            v-model="form.isPreAuthLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="是否保留旧件：" prop="isRetainOldParts">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.isRetainOldParts" />
        </el-form-item>
        <el-form-item label="计划作业时间：" prop="expectStartAt">
          <el-date-picker
            type="datetime"
            placeholder="请选择时间"
            v-model="form.expectStartAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="是否已经生成预授权：" prop="isCreatePreAuthLabel">
          <el-input
            placeholder="请输入"
            v-model="form.isCreatePreAuthLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="实际作业时间：" prop="startAt">
          <el-date-picker
            type="datetime"
            placeholder="请选择时间"
            v-model="form.startAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="预授权信息：" prop="preAuthTypeLabel">
          <el-input
            placeholder="请输入"
            v-model="form.preAuthTypeLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="完成作业时间：" prop="finishAt">
          <el-date-picker
            type="datetime"
            placeholder="请选择时间"
            v-model="form.finishAt"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="客户反馈故障是否全部解决：" prop="faultSolveLabel">
          <el-input
            placeholder="请输入"
            v-model="form.faultSolveLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="未解决问题原因：" prop="unresolvedReasonLabel">
          <el-input
            placeholder="请输入"
            v-model="form.unresolvedReasonLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="本次进店情况（周期内）：" prop="currentSituationLabel">
          <el-input
            placeholder="请输入"
            v-model="form.currentSituationLabel"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="原因说明：" prop="faultDesc">
          <el-input
            placeholder="请输入"
            v-model="form.faultDesc"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="最近故障施工单（周期内）：" prop="recentlyfaultServiceProxyCode">
          <el-input
            placeholder="请输入"
            v-model="form.recentlyfaultServiceProxyCode"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="最早故障施工单（周期内）：" prop="earliestfaultServiceProxyCode">
          <el-input
            placeholder="请输入"
            v-model="form.earliestfaultServiceProxyCode"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="故障提醒内容：" prop="faultAlert">
          <el-input
            placeholder="请输入"
            v-model="form.faultAlert"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="故障现象确认：" prop="confirmFaultLabel">
          <el-input
            placeholder="请输入"
            v-model="form.confirmFaultLabel"
            disabled
          />
        </el-form-item>
        <el-form-item label="车联网故障描述：" prop="inCustomerContent" class="form-item-full">
          <el-input
            type="textarea"
            show-word-limit
            maxlength="500"
            placeholder="请输入"
            v-model="form.inCustomerContent"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="客户诉求：" prop="customerComment" class="form-item-full">
          <el-input
            type="textarea"
            show-word-limit
            maxlength="500"
            placeholder="请输入"
            v-model="form.customerComment"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户经理建议：" prop="testResult" class="form-item-full">
          <el-input
            type="textarea"
            show-word-limit
            maxlength="500"
            placeholder="请输入"
            v-model="form.testResult"
            clearable
          />
        </el-form-item>
        <el-form-item label="本次是否因故障进店：" prop="currentFault">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.currentFault" :disabled="currentFaultDisabled" @change="handleCurrentFaultChange" />
        </el-form-item>
        <el-form-item label="客户故障描述：" prop="customerContent" class="form-item-half">
          <el-input
            type="textarea"
            show-word-limit
            maxlength="500"
            placeholder="请输入"
            v-model="form.customerContent"
            clearable
            :disabled="!form.currentFault || form.confirmFault === 1"
          />
        </el-form-item>
        <el-form-item label="作废描述：" prop="invaildDesc" class="form-item-full" v-if="form.orderStatus === RepairOrderStatusEnum.CANCEL">
          <el-input
            type="textarea"
            show-word-limit
            maxlength="500"
            placeholder="请输入"
            v-model="form.invaildDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="异常描述：" prop="anomalyDescription" class="form-item-full">
          <el-input
            type="textarea"
            show-word-limit
            maxlength="500"
            placeholder="请输入"
            v-model="form.anomalyDescription"
            clearable
          />
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="form-detail" v-else>
        <el-form-item label="维修类型（汇总）：" prop="repairItemTypeDetailCollect">
          {{ form.repairItemTypeDetailCollect }}
        </el-form-item>
        <el-form-item label="业务类型：" prop="businessTypeLabel">
          {{ form.businessTypeLabel }}
        </el-form-item>
        <el-form-item label="三包预警：" prop="alarmLevelLabel">
          {{ form.alarmLevelLabel }}
        </el-form-item>
        <el-form-item label="是否已生成结算单：" prop="isCreateStatementInfoLabel">
          {{ form.isCreateStatementInfoLabel }}
        </el-form-item>
        <el-form-item label="预计交车时间：" prop="expectFinishAt">
          {{ form.expectFinishAt }}
        </el-form-item>
        <!-- <el-form-item label="是否直播：" prop="isLiveLabel">
          {{ form.isLiveLabel }}
        </el-form-item> -->
        <el-form-item label="预检完成时间：" prop="previewingFinishAt">
          {{ form.previewingFinishAt }}
        </el-form-item>
        <el-form-item label="生成结算单时间：" prop="createStatementInfoDate">
          {{ form.createStatementInfoDate }}
        </el-form-item>
        <el-form-item label="是否返修：" prop="haveReworkLabel">
          {{ form.haveReworkLabel }}
        </el-form-item>
        <el-form-item label="是否洗车：" prop="isCarWashLabel">
          {{ form.isCarWashLabel }}
        </el-form-item>
        <el-form-item label="制单完成时间：" prop="confirmedOn">
          {{ form.confirmedOn }}
        </el-form-item>
        <el-form-item label="是否需要提报预授权：" prop="isPreAuthLabel">
          {{ form.isPreAuthLabel }}
        </el-form-item>
        <el-form-item label="是否保留旧件：" prop="isRetainOldPartsLabel">
          {{ form.isRetainOldPartsLabel }}
        </el-form-item>
        <el-form-item label="计划作业时间：" prop="expectStartAt">
          {{ form.expectStartAt }}
        </el-form-item>
        <el-form-item label="是否已经生成预授权：" prop="isCreatePreAuthLabel">
          {{ form.isCreatePreAuthLabel }}
        </el-form-item>
        <el-form-item label="实际作业时间：" prop="startAt">
          {{ form.startAt }}
        </el-form-item>
        <el-form-item label="预授权信息：" prop="preAuthCode">
          <el-link type="success" :href="`/service/maintain/sp/preAuth/edit?id=${form.preAuthId}`" target="_blank">{{ form.preAuthCode }}</el-link>
        </el-form-item>
        <el-form-item label="完成作业时间：" prop="finishAt">
          {{ form.finishAt }}
        </el-form-item>
        <el-form-item label="客户反馈故障是否全部解决：" prop="faultSolveLabel">
          {{ form.faultSolveLabel }}
        </el-form-item>
        <el-form-item label="未解决问题原因：" prop="unresolvedReasonLabel">
          {{ form.unresolvedReasonLabel }}
        </el-form-item>
        <el-form-item label="本次进店情况（周期内）：" prop="currentSituationLabel">
          {{ form.currentSituationLabel }}
        </el-form-item>
        <el-form-item label="原因说明：" prop="faultDesc">
          {{ form.faultDesc }}
        </el-form-item>
        <el-form-item label="最近故障施工单（周期内）：" prop="recentlyfaultServiceProxyCode">
          <el-link v-if="form.recentlyfaultServiceProxy" type="success" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.recentlyfaultServiceProxy}`" target="_blank">{{ form.recentlyfaultServiceProxyCode }}</el-link>
          <span v-else>{{ form.recentlyfaultServiceProxyCode }}</span>
        </el-form-item>
        <el-form-item label="最早故障施工单（周期内）：" prop="earliestfaultServiceProxyCode">
          <el-link  v-if="form.earliestfaultServiceProxy" type="success" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.earliestfaultServiceProxy}`" target="_blank">{{ form.earliestfaultServiceProxyCode }}</el-link>
          <span v-else>{{ form.earliestfaultServiceProxyCode }}</span>
        </el-form-item>
        <el-form-item label="故障提醒内容：" prop="faultAlert">
          {{ form.faultAlert }}
        </el-form-item>
        <el-form-item label="故障现象确认：" prop="confirmFaultLabel">
          {{ form.confirmFaultLabel }}
        </el-form-item>
        <el-form-item label="车联网故障描述：" prop="inCustomerContent" class="form-item-full">
          {{ form.inCustomerContent }}
        </el-form-item>
        <el-form-item label="客户诉求：" prop="customerComment" class="form-item-full">
          {{ form.customerComment }}
        </el-form-item>
        <el-form-item label="客户经理建议：" prop="testResult" class="form-item-full">
          {{ form.testResult }}
        </el-form-item>
        <el-form-item label="本次是否因故障进店：" prop="currentFault">
          {{ form.currentFaultLabel }}
        </el-form-item>
        <el-form-item label="客户故障描述：" prop="customerContent" class="form-item-half">
          {{ form.customerContent }}
        </el-form-item>
        <el-form-item label="作废描述：" prop="invaildDesc" class="form-item-full" v-if="form.orderStatus === RepairOrderStatusEnum.CANCEL">
          {{ form.invaildDesc }}
        </el-form-item>
        <el-form-item label="异常描述：" prop="anomalyDescription" class="form-item-full">
          {{ form.anomalyDescription }}
        </el-form-item>
      </el-form>
      <div class="table-section">
        <div class="table-section-header">
          <h3>添加故障模块</h3>
        </div>
        <base-search
          style="width: 450px;margin-bottom: 10px;"
          filterable
          clearable
          remote
          :placeholder="form.currentFault ? '请输入VRT/VFG/CCC模糊搜索' : '当前工单为已提交结算或者不存在故障，无需添加CCC'"
          :remote-method="getAlertModule"
          @change="handleAlertModuleChange"
          collapse-tags
          value-key="id"
          label-key="name"
          :disabled="formDisabled || !form.currentFault"
        />
        <vxe-table
          ref="faultTable"
          :data="faultTableData"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="vrtName" title="VRT名称" min-width="150"/>
          <vxe-column field="vfgName" title="VFG名称" min-width="150"/>
          <vxe-column field="cccName" title="CCC名称" min-width="150"/>
          <vxe-column field="alertModule" title="是否提醒模块" width="150" align="center">
            <template #default="{ row }">
              <span>{{ row.alertModule === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="currentSituationLabel" title="本次进店情况(周期内)" min-width="150"/>
          <vxe-column field="faultAlert" title="故障提醒内容" min-width="150"/>
          <vxe-column title="操作" width="150" align="center" fixed="right" :resizable="false">
            <template #default="{ row }">
              <el-popconfirm
                title="确定删除此故障吗？"
                @confirm="handleDeleteFault(row)"
              >
                <span
                  class="action-button btn-delete"
                  slot="reference"
                  type="text">
                  删除故障
                </span>
              </el-popconfirm>
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="创建时间" min-width="150"/>
          <template #empty>
            <div class="m-vxe-table-empty-text">若要启用此内容，请创建记录</div>
          </template>
        </vxe-table>
      </div>
    </div>
  </section>
</template>
<script>
import FetchSelect from '@/libs/components/FetchSelect';
import BaseSearch from '@/libs/components/BaseSearch';
import { getEnum, getCCCList, updateSpFaultAlertRecord, deleteSpFaultAlertRecord, addFaultRecord, getDetail } from '@/api/maintain/sp/serviceProxy/index';
import { RepairOrderStatusEnum } from '../../constant';
import { getLoginUser } from '@/api/common';

export default {
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    // rules: {
    //   type: Object,
    //   default: () => {}
    // },
    isEditing: {
      type: Boolean,
      default: false
    },
    _id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    FetchSelect,
    BaseSearch
  },
  computed: {
    formDisabled () {
      return this.formData.orderStatus === RepairOrderStatusEnum.CANCEL || this.formData.orderStatus === RepairOrderStatusEnum.DELIVERED;
    },
    faultTableData () {
      if (this._id) {
        return this.form.faultAlertRecordRespList || [];
      }
      return this.form.faultAlertRecordParams || [];
    },
    currentFaultDisabled () {
      // 枚举：是、否，非必填，开单默认为 否；工单为：已作废、已交车或【是否已生成结算单】为是时，该字段锁定不可修改；
      return this.formData.orderStatus === RepairOrderStatusEnum.CANCEL ||
             this.formData.orderStatus === RepairOrderStatusEnum.DELIVERED ||
             this.formData.isCreateStatementInfo === 1;
    },
    isLiveDisabled () {
      // 若【是否锁定直播开关】为：是，【是否直播】开关不允许操作；
      // 若【是否锁定直播开关】为：否，【是否直播】开关允许门店操作（工单状态非已作废、生成结算单）；
      return Number(this.form.isLockLive) === 1 || !this.loginUser ||
      (!this.loginUser.admin && this.loginUser.accountFlag && this.loginUser.currentOrgCode !== this.formData.dealerCode) ||
      this.formData.orderStatus === RepairOrderStatusEnum.CANCEL || this.formData.isCreateStatementInfo === 1;
    },
    expectFinishAtPickerOptions () {
      return {
        disabledDate: (time) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return time.getTime() < today.getTime();
        }
      };
    }
  },
  watch: {
    formData: {
      handler (val) {
        if (val) {
          this.form = val;
          // 确保 faultAlertRecordRespList 存在
          if (!this.form.faultAlertRecordRespList) {
            this.$set(this.form, 'faultAlertRecordRespList', []);
          }
          // 新增模式下暂存故障模块
          if (!this._id && !this.form.faultAlertRecordParams) {
            this.$set(this.form, 'faultAlertRecordParams', []);
          }
          // 记录初始 currentFault 值
          if (this.form._prevCurrentFault === undefined) {
            this.form._prevCurrentFault = val.currentFault;
          }
          // 处理预授权字段：为空时显示"否"
          this.$set(this.form, 'isPreAuthLabel', val.isPreAuthLabel || '否');
          this.$set(this.form, 'isCreatePreAuthLabel', val.isCreatePreAuthLabel || '否');
        }
      },
      immediate: true
    },
    'formData.orderStatus': {
      handler (val) {
        if (val === 110) {
          this.$set(this.rules, 'expectFinishAt', [
            { required: true, message: '请输入预计交车时间', trigger: 'change' }
          ]);
        }
      }
    },
    'form.currentFault': {
      handler (val) {
        if (this.rules.customerContent && this.rules.customerContent[0]) {
          if (val) {
            this.rules.customerContent[0].required = true;
          } else {
            this.rules.customerContent[0].required = false;
          }
        }
      }
    },
  },
  data () {
    return {
      form: {},
      loginUser: null,
      rules: {
        businessType: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        testResult: [
          { required: true, message: '请输入客户经理建议', trigger: 'change' }
        ],
        anomalyDescription: [
          { required: true, message: '请输入异常描述', trigger: 'change' }
        ],
        customerContent: [
          { required: true, message: '请输入故障描述', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!value) return callback();
              if (value.trim().length <= 4) {
                callback(new Error('故障描述字段需要大于4个字'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ]
      },
      RepairOrderStatusEnum,
      isExpectFinishEditable: true
    };
  },
  mounted () {
    this.getLoginUser();
  },
  methods: {
    async getLoginUser () {
      try {
        const res = await getLoginUser();
        this.loginUser = res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    handleIsLiveChange (val) {
      if (Number(val) === 20) {
        this.form.isStoreLive = '0';
      } else if (Number(val) === 30) {
        this.form.isStoreLive = '1';
      }
    },
    validateForm () {
      if (this.formData?.costCountResp?.repairItemRespList?.length === 0 && this.formData?.costCountResp?.sparePartRespList?.length === 0) {
        this.$message.warning('请添加维修项目或配件');
        return false;
      } else {
        return true;
      }
    },
    handleExpectFinishFocus () {
      // 校验维修项目和配件是否存在
      const isValid = this.validateForm();
      if (!isValid) {
        // 校验不通过,暂时设置为只读
        this.isExpectFinishEditable = false;
        // 让日期选择器失去焦点
        this.$nextTick(() => {
          if (this.$refs.expectFinishDatePicker) {
            this.$refs.expectFinishDatePicker.blur();
            // 恢复可编辑状态
            setTimeout(() => {
              this.isExpectFinishEditable = true;
            }, 100);
          }
        });
      }
    },
    handleExpectFinishChange (val) {
      if (!val) return;
      // 兼容 iOS Safari:将 - 替换为 /
      const selected = new Date(String(val).replace(/-/g, '/'));
      const now = new Date();
      if (selected.getTime() < now.getTime()) {
        this.$message.warning('预计交车时间不能早于当前时间');
        this.form.expectFinishAt = '';
      }
    },
    scrollToError (invalidFields) {
      if (!invalidFields || !Object.keys(invalidFields).length) return;
      // 查找包含错误信息的表单项
      const errorItem = this.$refs.ruleForm.$el.querySelector('.is-error');
      if (errorItem) {
        // 找到最近的 el-form-item
        const formItem = errorItem.closest('.el-form-item');
        if (formItem) {
          formItem.style.scrollMarginTop = '150px';
          formItem.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
        setTimeout(() => {
          formItem.style.scrollMarginTop = '';
        }, 100);
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getFormData () {
      return new Promise((resolve, reject) => {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.validate((valid, invalidFields) => {
            if (valid) {
              resolve(this.form);
            } else {
              this.$nextTick(() => {
                this.scrollToError(invalidFields);
              });
            }
          });
        } else {
          resolve(this.form);
        }
      });
    },
    clearValidate () {
      this.$refs.ruleForm?.clearValidate();
    },
    handleCurrentFaultChange (val) {
      if (val === 0) {
        const oldVal = this.form._prevCurrentFault;
        const oldCustomerContent = this.form.customerContent;
        // 签字弹框确认：用户点击【准确】后，门店修改本次是否因故障进店，由是修改成否，不用清空【客户故障描述】字段内容
        const newCustomerContent = this.form.confirmFault === 1 ? oldCustomerContent : '本次进店车辆无故障'; // 1 为准确 2 为不准确
        this.form._prevCurrentFault = val;
        if (oldVal === 1) {
          if (this._id) {
            const message = '<div class="ais-leave-tips-main warn"><i class="iconfont icon-lxppc-prompt"></i>提醒</div><div class="ais-leave-tips-sub">若本次无故障，将自动清空【故障模块】信息，请确认是否操作！</div>';
            this.$confirm(message, '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              customClass: 'ais-leave-tips',
              showClose: false
            }).then(() => {
              if (this._id) {
                addFaultRecord({
                  id: this._id,
                  currentFault: 0,
                  customerContent: newCustomerContent
                }).then(() => {
                  this.$message.success('本次故障信息清除成功');
                  this.form.customerContent = newCustomerContent;
                  this.$emit('refresh', false);
                  this.$emit('update:isEditing', false);
                });
              } else {
                this.$set(this.form, 'faultAlertRecordParams', []);
                this.$message.success('本次故障信息清除成功');
              }
            }).catch(() => {
              this.$set(this.form, 'currentFault', 1);
              this.form._prevCurrentFault = 1;
              this.form.customerContent = oldCustomerContent;
            }).finally(() => {
              this.clearValidate();
            });
          } else {
            this.form.customerContent = newCustomerContent;
          }
          return;
        }
      } else {
        // 不准确时，从否切到是，需要清空故障模块描述
        if (this.form.confirmFault !== 1) {
          this.form.customerContent = '';
        }
      }
      this.form._prevCurrentFault = val;
    },
    handleAlertModuleChange (val, record) {
      if (this._id) {
        // 编辑模式：即时保存到后端
        if (!this.form.faultAlertRecordRespList) {
          this.$set(this.form, 'faultAlertRecordRespList', []);
        }
        const isExist = this.form.faultAlertRecordRespList.some(
          item => item.cccId === record.id
        );
        if (!isExist && record) {
          this.form.faultAlertRecordRespList.push({ ...record, cccId: record.id });
          this.$set(this.form, 'faultAlertRecordRespList', [...this.form.faultAlertRecordRespList]);
          updateSpFaultAlertRecord({ serviceProxyId: this._id, ...record, cccId: record.id }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            if (res) {
              const message = `<div class="ais-leave-tips-main warn"><i class="iconfont icon-lxppc-prompt"></i>故障模块消息提醒</div><div class="ais-leave-tips-sub">${res}</div>`;
              this.$confirm(message, '', {
                confirmButtonText: '确定',
                showCancelButton: false,
                cancelButtonText: '取消',
                dangerouslyUseHTMLString: true,
                customClass: 'ais-leave-tips',
                showClose: false
              }).then(() => {
              }).catch(() => {
              });
            }
          });
        } else {
          this.$message({
            message: '请勿重复添加',
            type: 'warning'
          });
        }
      } else {
        // 新增模式：暂存到 faultAlertRecordParams
        if (!this.form.faultAlertRecordParams) {
          this.$set(this.form, 'faultAlertRecordParams', []);
        }
        const isExist = this.form.faultAlertRecordParams.some(
          item => item.cccId === record.id
        );
        if (!isExist && record) {
          record.cccId = record.id;
          delete record.id;
          this.form.faultAlertRecordParams.push(record);
          this.$set(this.form, 'faultAlertRecordParams', [...this.form.faultAlertRecordParams]);
        } else {
          this.$message({
            message: '请勿重复添加',
            type: 'warning'
          });
        }
      }
    },
    handleDeleteFault (row) {
      if (this._id) {
        // 编辑模式：调后端 API 删除
        const index = this.form.faultAlertRecordRespList.findIndex(
          item => item.id === row.id
        );
        if (index > -1) {
          deleteSpFaultAlertRecord([row.id]).then(res => {
            this.form.faultAlertRecordRespList.splice(index, 1);
            this.$set(this.form, 'faultAlertRecordRespList', [...this.form.faultAlertRecordRespList]);
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.refreshFaultList();
          });
        }
      } else {
        // 新增模式：从本地暂存中删除
        const list = this.form.faultAlertRecordParams || [];
        const index = list.findIndex(item => item.cccId === row.cccId);
        if (index > -1) {
          list.splice(index, 1);
          this.$set(this.form, 'faultAlertRecordParams', [...list]);
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }
      }
    },
    getAlertModule (query) {
      if (!query) {
        return [];
      }
      return new Promise((resolve, reject) => {
        getCCCList(query).then(res => {
          const arr = (res || []).map(item => {
            return {
              ...item,
              name: `${item.vrtName}-${item.vfgName}-${item.cccName}`
            };
          });
          if (arr.length === 0) {
            resolve([{
              name: '您当前搜索的CCC不存在，请联系服务部技术支持',
              disabled: true
            }]);
          } else {
            resolve(arr);
          }
        });
      });
    },
    // 刷新故障列表数据
    refreshFaultList () {
      if (!this._id) return;
      getDetail(this._id).then(res => {
        if (res && res.faultAlertRecordRespList) {
          // 只更新故障列表数据，不影响其他字段
          this.$set(this.form, 'faultAlertRecordRespList', res.faultAlertRecordRespList);
          this.$set(this.form, 'currentSituationLabel', res.currentSituationLabel);
          this.$set(this.form, 'faultAlert', res.faultAlert);
          this.$set(this.form, 'recentlyfaultServiceProxyCode', res.recentlyfaultServiceProxyCode);
          this.$set(this.form, 'earliestfaultServiceProxyCode', res.earliestfaultServiceProxyCode);
        }
      }).catch(err => {
        console.error('刷新故障列表失败:', err);
      });
    }
  }
};

</script>
<style scoped lang="scss">
.table-section{
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px!important;
  }
  &-header {
    h3{
      font-size: 14px;
    }
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .m-vxe-table-empty-text {
    text-align: left;
  }
  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
  }
  .btn-delete {
    color: var(--leap-color-danger);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: var(--leap-color-danger-dark-1);
    }
    &.disabled{
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
.form-item-half {
  flex: 1;
}
</style>
