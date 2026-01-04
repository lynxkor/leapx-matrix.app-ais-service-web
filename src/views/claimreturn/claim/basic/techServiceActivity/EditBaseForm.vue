<script>
/**
  表单配置组件
  @author wangjinqing
  @description 基于JSON Schema的表单配置组件，支持动态表单生成、数据验证、UI组件配置等功能
  @param {Object} schema - JSON Schema配置对象
  @param {String} schema.type - Schema类型，固定为"object"
  @param {Object} schema.properties - 字段属性配置
  @param {Object} schema.properties[fieldName] - 字段配置
  @param {String} schema.properties[fieldName].type - 字段类型
  @param {String} schema.properties[fieldName].title - 字段标题
  @param {Boolean} schema.properties[fieldName].required - 是否必填
  @param {Number} schema.properties[fieldName].minLength - 最小长度
  @param {Number} schema.properties[fieldName].maxLength - 最大长度
  @param {String} schema.properties[fieldName].format - 格式验证（如email）
  @param {Number} schema.properties[fieldName].minimum - 最小值
  @param {Number} schema.properties[fieldName].maximum - 最大值
  @param {String} schema.properties[fieldName]["ui:widget"] - UI组件类型
  @param {String} schema.properties[fieldName]["ui:placeholder"] - 输入框占位符

  @event validate - 表单验证时触发，参数为验证结果
  @event value-change - 字段值变化时触发，参数为{field, value}
  @event submit - 表单提交时触发，参数为表单数据
  @event reset - 表单重置时触发

  @method getFormData - 获取当前表单数据
  @method setFormData - 设置表单数据
  @method clearValidate - 清除验证状态
  @method validate - 验证表单数据
  @method resetForm - 重置表单
*/
</script>
<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>基础信息</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px"  class="form-edit" v-show="isEditing || !id">
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
</template>
<script>
export default {
  props: {
    /**
     * 详情页id
     */
    id: {
      type: String,
    },
    /**
     * 标题
     */
    title: {
      type: String
    },
    /**
     * 是否为编辑状态
     */
    isEditing: {
      type: Boolean,
      default: false,
    },
    /**
     * 表单 schema 配置
     */
    schema: {
      type: Object,
    }
  },
  data () {
    return {
      form: {},
      rules: [],
    }
  },
  watch: {
    schema: {
      handler (val) {
        if (val) {
          //
          var s = {
            type: 'object',
            properties: {
              'activityCode': {
                type: 'string',
                title: '活动编码'
              }
            }
          }
        }
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    handleCancel () {
      this.$emit('cancel');
    },
    handleEdit () {
      this.$emit('edit');
    },
    submitForm () {
      this.$emit('submit');
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
