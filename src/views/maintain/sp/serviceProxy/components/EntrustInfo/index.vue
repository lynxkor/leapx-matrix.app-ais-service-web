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
          <el-switch :active-value="1" :inactive-value="0" v-model="form.isCreateStatementInfo" disabled/>
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
            @focus="handleExpectFinishFocus"
            :readonly="!isExpectFinishEditable"
            :disabled="!_id"
          />
        </el-form-item>
        <el-form-item label="是否直播：" prop="isLive">
          <el-input
            placeholder="请输入"
            v-model="form.isLiveLabel"
            clearable
            disabled
          />
        </el-form-item>
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
        <el-form-item label="未解决问题原因：" prop="unresolvedReason">
          <el-input
            placeholder="请输入"
            v-model="form.unresolvedReason"
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
        <el-form-item label="最早故障施工单（周期内）：" prop="earliestfaultServiceProxy">
          <el-input
            placeholder="请输入"
            v-model="form.earliestfaultServiceProxy"
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
        <el-form-item label="本次进店是否存在故障：" prop="currentFault">
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
          />
        </el-form-item>
        <el-form-item label="作废描述：" prop="invaildDesc" class="form-item-full">
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
        <el-form-item label="是否直播：" prop="isLiveLabel">
          {{ form.isLiveLabel }}
        </el-form-item>
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
        <el-form-item label="预授权信息：" prop="preAuthTypeLabel">
          {{ form.preAuthTypeLabel }}
        </el-form-item>
        <el-form-item label="完成作业时间：" prop="finishAt">
          {{ form.finishAt }}
        </el-form-item>
        <el-form-item label="客户反馈故障是否全部解决：" prop="faultSolveLabel">
          {{ form.faultSolveLabel }}
        </el-form-item>
        <el-form-item label="未解决问题原因：" prop="unresolvedReason">
          {{ form.unresolvedReason }}
        </el-form-item>
        <el-form-item label="本次进店情况（周期内）：" prop="currentSituationLabel">
          {{ form.currentSituationLabel }}
        </el-form-item>
        <el-form-item label="原因说明：" prop="faultDesc">
          {{ form.faultDesc }}
        </el-form-item>
        <el-form-item label="最早故障施工单（周期内）：" prop="earliestfaultServiceProxy">
          {{ form.earliestfaultServiceProxy }}
        </el-form-item>
        <el-form-item label="故障提醒内容：" prop="faultAlert">
          {{ form.faultAlert }}
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
        <el-form-item label="本次进店是否存在故障：" prop="currentFault">
          {{ form.currentFaultLabel }}
        </el-form-item>
        <el-form-item label="客户故障描述：" prop="customerContent" class="form-item-half">
          {{ form.customerContent }}
        </el-form-item>
        <el-form-item label="作废描述：" prop="invaildDesc" class="form-item-full">
          {{ form.invaildDesc }}
        </el-form-item>
        <el-form-item label="异常描述：" prop="anomalyDescription" class="form-item-full">
          {{ form.anomalyDescription }}
        </el-form-item>
      </el-form>
      <div class="table-section" v-if="form.currentFault && _id">
        <div class="table-section-header">
          <h3>添加故障模块</h3>
          <div class="ais-select-group">
            <base-search
              style="width: 350px;"
              filterable
              clearable
              remote
              placeholder="请输入VRT/VFG/CCC模糊搜索"
              :remote-method="getAlertModule"
              @change="handleAlertModuleChange"
              collapse-tags
              value-key="id"
              label-key="name"
              :disabled="formDisabled"
            />
          </div>
        </div>
        <vxe-table
          ref="faultTable"
          :data="form.faultAlertRecordRespList"
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
import { getEnum, getCCCList, updateSpFaultAlertRecord, deleteSpFaultAlertRecord, addFaultRecord } from '@/api/maintain/sp/serviceProxy/index';
import { RepairOrderStatusEnum } from '../../constant';

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
    currentFaultDisabled () {
      // 枚举：是、否，非必填，开单默认为 否；工单为：已作废、已交车或【是否已生成结算单】为是时，该字段锁定不可修改；
      return this.formData.orderStatus === RepairOrderStatusEnum.CANCEL ||
             this.formData.orderStatus === RepairOrderStatusEnum.DELIVERED ||
             this.formData.isCreateStatementInfo === 1;
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
          // 记录初始 currentFault 值
          if (this.form._prevCurrentFault === undefined) {
            this.form._prevCurrentFault = val.currentFault;
          }
        }
      },
      immediate: true
    },
    'form.currentFault': {
      handler (val) {
        if (val) {
          this.rules.customerContent = [
            { required: true, message: '请输入故障描述', trigger: 'change' }
          ];
        } else {
          this.rules.customerContent = [
            { required: false, message: '请输入故障描述', trigger: 'change' }
          ];
        }
      }
    },
    'formData.orderStatus': {
      handler (val) {
        if (val === 110) {
          this.$set(this.rules, 'expectFinishAt', [
            { required: true, message: '请输入预计交车时间', trigger: 'change' }
          ]);
        }
      }
    }
  },
  data () {
    return {
      form: {},
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
          { required: false, message: '请输入故障描述', trigger: 'change' }
        ]
      },
      RepairOrderStatusEnum,
      isExpectFinishEditable: true
    };
  },
  methods: {
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
      this.$refs.ruleForm.clearValidate();
    },
    handleCurrentFaultChange (val) {
      if (val === 0 && this._id) {
        const oldVal = this.form._prevCurrentFault;
        // 记录当前值，供下次对比
        this.form._prevCurrentFault = val;
        // 从是变到否时弹确认
        if (oldVal === 1) {
          const message = '<div class="ais-leave-tips-main warn"><i class="iconfont icon-lxppc-circle"></i>提醒</div><div class="ais-leave-tips-sub">若本次无故障，将自动清空【故障模块】信息，请确认是否操作！</div>';
          this.$confirm(message, '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            customClass: 'ais-leave-tips',
            showClose: false
          }).then(() => {
            addFaultRecord({
              id: this._id,
              currentFault: 0,
              customerContent: null
            }).then(() => {
              this.$message.success('本次故障信息清除成功');
              this.$emit('refresh', false);
              this.$emit('update:isEditing', false);
            });
          }).catch(() => {
            // 取消则恢复为是
            this.$set(this.form, 'currentFault', 1);
            this.form._prevCurrentFault = 1;
          });
          return;
        }
      }
      // 记录当前值
      this.form._prevCurrentFault = val;
    },
    handleAlertModuleChange (val, record) {
      // 确保 faultAlertRecordRespList 存在
      if (!this.form.faultAlertRecordRespList) {
        this.$set(this.form, 'faultAlertRecordRespList', []);
      }

      // 检查是否已存在相同的记录（根据 vrtId 判断）
      const isExist = this.form.faultAlertRecordRespList.some(
        item => item.id === record.id
      );

      // 如果不存在才添加
      if (!isExist && record) {
        this.form.faultAlertRecordRespList.push(record);
        // 强制触发响应式更新
        this.$set(this.form, 'faultAlertRecordRespList', [...this.form.faultAlertRecordRespList]);
        updateSpFaultAlertRecord({ serviceProxyId: this._id, ...record }).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          // 通知父组件刷新数据
          this.$emit('refresh');
          if (res) {
            const message = `<div class="ais-leave-tips-main warn"><i class="iconfont icon-lxppc-circle"></i>故障模块消息提醒</div><div class="ais-leave-tips-sub">${res}</div>`;
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
    },
    handleDeleteFault (row) {
      // 根据主键id查找并删除记录
      const index = this.form.faultAlertRecordRespList.findIndex(
        item => item.id === row.id
      );

      if (index > -1) {
        deleteSpFaultAlertRecord([row.id]).then(res => {
          this.form.faultAlertRecordRespList.splice(index, 1);
          // 强制触发响应式更新
          this.$set(this.form, 'faultAlertRecordRespList', [...this.form.faultAlertRecordRespList]);
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          // 通知父组件刷新数据
          this.$emit('refresh');
        });
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
          resolve(arr);
        });
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
</style>
