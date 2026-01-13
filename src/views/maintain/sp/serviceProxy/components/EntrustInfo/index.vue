<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>委托信息</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px" class="form-edit" v-if="isEditing || !_id">
        <el-form-item label="维修类型（汇总）：" prop="repairItemTypeDetailCollect">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.repairItemTypeDetailCollect"
            placeholder="请选择"
            clearable
            filterable
            disabled
          />
        </el-form-item>
        <el-form-item label="业务类型：" prop="businessType">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
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
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.isCreateStatementInfo"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="预计交车时间：" prop="expectFinishAt">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.expectFinishAt"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="是否直播：" prop="isLive">
          <el-input
            placeholder="请输入"
            v-model="form.isLive"
            clearable
          />
        </el-form-item>
        <el-form-item label="预检完成时间：" prop="previewingFinishAt">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.previewingFinishAt"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="生成结算单时间：" prop="createStatementInfoDate">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.createStatementInfoDate"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="是否返修：" prop="haveRework">
          <el-input
            placeholder="请输入"
            v-model="form.haveRework"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否洗车：" prop="isCarWash">
          <el-input
            placeholder="请输入"
            v-model="form.isCarWash"
            clearable
          />
        </el-form-item>
        <el-form-item label="制单完成时间：" prop="confirmedOn">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.confirmedOn"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="是否需要提报预授权：" prop="isPreAuth">
          <el-input
            placeholder="请输入"
            v-model="form.isPreAuth"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否保留旧件：" prop="isRetainOldParts">
          <el-input
            placeholder="请输入"
            v-model="form.isRetainOldParts"
            clearable
          />
        </el-form-item>
        <el-form-item label="计划作业时间：" prop="expectStartAt">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.expectStartAt"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="是否已经生成预授权：" prop="isPreAuth">
          <el-input
            placeholder="请输入"
            v-model="form.isPreAuth"
            clearable
          />
        </el-form-item>
        <el-form-item label="车联网故障描述：" prop="inCustomerContent">
          <el-input
            placeholder="请输入"
            v-model="form.inCustomerContent"
            clearable
          />
        </el-form-item>
        <el-form-item label="实际作业时间：" prop="startAt">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.startAt"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="预授权信息：" prop="preAuthId">
          <el-input
            placeholder="请输入"
            v-model="form.preAuthId"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户诉求：" prop="customerComment">
          <el-input
            placeholder="请输入"
            v-model="form.customerComment"
            clearable
          />
        </el-form-item>
        <el-form-item label="完成作业时间：" prop="finishAt">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.finishAt"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="客户经理建议：" prop="testResult">
          <el-input
            placeholder="请输入"
            v-model="form.testResult"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户反馈故障是否全部解决：" prop="faultSolve">
          <el-input
            placeholder="请输入"
            v-model="form.faultSolve"
            clearable
          />
        </el-form-item>
        <el-form-item label="未解决问题原因：" prop="unresolvedReason">
          <el-input
            placeholder="请输入"
            v-model="form.unresolvedReason"
            clearable
          />
        </el-form-item>
        <el-form-item label="本次进店是否存在故障：" prop="currentFault">
          <el-input
            placeholder="请输入"
            v-model="form.currentFault"
            clearable
          />
        </el-form-item>
        <el-form-item label="本次进店情况（周期内）：" prop="currentSituation">
          <el-input
            placeholder="请输入"
            v-model="form.currentSituation"
            clearable
          />
        </el-form-item>
        <el-form-item label="原因说明：" prop="faultDesc">
          <el-input
            placeholder="请输入"
            v-model="form.faultDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户故障描述：" prop="customerContent">
          <el-input
            placeholder="请输入"
            v-model="form.customerContent"
            clearable
          />
        </el-form-item>
        <el-form-item label="最早故障施工单（周期内）：" prop="earliestfaultServiceProxy">
          <el-input
            placeholder="请输入"
            v-model="form.earliestfaultServiceProxy"
            clearable
          />
        </el-form-item>
        <el-form-item label="作废描述：" prop="invaildDesc">
          <el-input
            placeholder="请输入"
            v-model="form.invaildDesc"
            clearable
          />
        </el-form-item>
        <el-form-item label="故障提醒内容：" prop="faultAlert">
          <el-input
            placeholder="请输入"
            v-model="form.faultAlert"
            clearable
          />
        </el-form-item>
        <el-form-item label="异常描述：" prop="anomalyDescription">
          <el-input
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
        <el-form-item label="业务类型：" prop="businessType">
          {{ form.businessType }}
        </el-form-item>
        <el-form-item label="三包预警：" prop="alarmLevel">
          {{ form.alarmLevel }}
        </el-form-item>
        <el-form-item label="是否已生成结算单：" prop="isCreateStatementInfo">
          {{ form.isCreateStatementInfo }}
        </el-form-item>
        <el-form-item label="预计交车时间：" prop="expectFinishAt">
          {{ form.expectFinishAt }}
        </el-form-item>
        <el-form-item label="是否直播：" prop="isLive">
          {{ form.isLive }}
        </el-form-item>
        <el-form-item label="预检完成时间：" prop="previewingFinishAt">
          {{ form.previewingFinishAt }}
        </el-form-item>
        <el-form-item label="生成结算单时间：" prop="createStatementInfoDate">
          {{ form.createStatementInfoDate }}
        </el-form-item>
        <el-form-item label="是否返修：" prop="haveRework">
          {{ form.haveRework }}
        </el-form-item>
        <el-form-item label="是否洗车：" prop="isCarWash">
          {{ form.isCarWash }}
        </el-form-item>
        <el-form-item label="制单完成时间：" prop="confirmedOn">
          {{ form.confirmedOn }}
        </el-form-item>
        <el-form-item label="是否需要提报预授权：" prop="isPreAuth">
          {{ form.isPreAuth }}
        </el-form-item>
        <el-form-item label="是否保留旧件：" prop="isRetainOldParts">
          {{ form.isRetainOldParts }}
        </el-form-item>
        <el-form-item label="计划作业时间：" prop="expectStartAt">
          {{ form.expectStartAt }}
        </el-form-item>
        <el-form-item label="是否已经生成预授权：" prop="isPreAuth">
          {{ form.isPreAuth }}
        </el-form-item>
        <el-form-item label="车联网故障描述：" prop="inCustomerContent">
          {{ form.inCustomerContent }}
        </el-form-item>
        <el-form-item label="实际作业时间：" prop="startAt">
          {{ form.startAt }}
        </el-form-item>
        <el-form-item label="预授权信息：" prop="preAuthId">
          {{ form.preAuthId }}
        </el-form-item>
        <el-form-item label="客户诉求：" prop="customerComment">
          {{ form.customerComment }}
        </el-form-item>
        <el-form-item label="完成作业时间：" prop="finishAt">
          {{ form.finishAt }}
        </el-form-item>
        <el-form-item label="客户经理建议：" prop="testResult">
          {{ form.testResult }}
        </el-form-item>
        <el-form-item label="客户反馈故障是否全部解决：" prop="faultSolve">
          {{ form.faultSolve }}
        </el-form-item>
        <el-form-item label="未解决问题原因：" prop="unresolvedReason">
          {{ form.unresolvedReason }}
        </el-form-item>
        <el-form-item label="本次进店是否存在故障：" prop="currentFault">
          {{ form.currentFault }}
        </el-form-item>
        <el-form-item label="本次进店情况（周期内）：" prop="currentSituation">
          {{ form.currentSituation }}
        </el-form-item>
        <el-form-item label="原因说明：" prop="faultDesc">
          {{ form.faultDesc }}
        </el-form-item>
        <el-form-item label="客户故障描述：" prop="customerContent">
          {{ form.customerContent }}
        </el-form-item>
        <el-form-item label="最早故障施工单（周期内）：" prop="earliestfaultServiceProxy">
          {{ form.earliestfaultServiceProxy }}
        </el-form-item>
        <el-form-item label="故障提醒内容：" prop="faultAlert">
          {{ form.faultAlert }}
        </el-form-item>
        <el-form-item label="异常描述：" prop="anomalyDescription">
          {{ form.anomalyDescription }}
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
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
    FetchSelect
  },
  watch: {
    formData: {
      handler (val) {
        if (val) {
          this.form = val;
        }
      }
    }
  },
  data () {
    return {
      form: {}
    };
  }
};

</script>
