<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>基础信息</h2>
    </div>
    <div class="common-section-body">
      <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
      <el-form :inline="true" :model="form" :rules="rules" ref="basicForm" label-width="180px" class="form-edit" v-if="isEditing || !_id">
        <el-form-item label="单据编号：" prop="code">
          <el-input
            placeholder="请输入"
            v-model="form.code"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="VIN码：" prop="vehProfileVin">
          <el-input
            placeholder="请输入"
            v-model="form.vehProfileVin"
            clearable
          />
        </el-form-item>
        <el-form-item label="车牌号：" prop="carPlate">
          <el-input
            placeholder="请输入"
            v-model="form.carPlate"
            clearable
          />
        </el-form-item>
        <el-form-item label="数据来源：" prop="dataSource">
          <el-input
            placeholder="请输入"
            v-model="form.dataSource"
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
        <el-form-item label="客户类型：" prop="custType">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.custType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="建议保养里程：" prop="maintenanceMileage">
          <el-input
            placeholder="请输入"
            v-model="form.maintenanceMileage"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="销售日期：" prop="saleDate">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.saleDate"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="专属服务门店：" prop="exclusiveServiceDealerName">
          <el-input
            placeholder="请输入"
            v-model="form.exclusiveServiceDealerName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="预约单号：" prop="appointmentNo">
          <el-input
            placeholder="请输入"
            v-model="form.appointmentNo"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="建议保养时间：" prop="maintenanceTime">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.maintenanceTime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="保修开始日期：" prop="startWarrantyDate">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.startWarrantyDate"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>
        <el-form-item label="登记人：" prop="customerName">
          <el-input
            placeholder="请输入"
            v-model="form.customerName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="车主姓名：" prop="customerName">
          <el-input
            placeholder="请输入"
            v-model="form.customerName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="上次进店里程数：" prop="lastMileage">
          <el-input
            placeholder="请输入"
            v-model="form.lastMileage"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="绑车人用户ID：" prop="bindingUserId">
          <el-input
            placeholder="请输入"
            v-model="form.bindingUserId"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="基本车型：" prop="vehModelName">
          <el-input
            placeholder="请输入"
            v-model="form.vehModelName"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="车主手机：" prop="customerPhone">
          <el-input
            placeholder="请输入"
            v-model="form.customerPhone"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="进店里程数：" prop="mileage">
          <el-input
            placeholder="请输入"
            v-model="form.mileage"
            clearable
          />
        </el-form-item>
        <el-form-item label="车联网里程数（总）：" prop="netMileage">
          <el-input
            placeholder="请输入"
            v-model="form.netMileage"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="公告车型：" prop="vehRegisteredModelId">
          <el-input
            placeholder="请输入"
            v-model="form.vehRegisteredModelId"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="送修人：" prop="shuttleName">
          <el-input
            placeholder="请输入"
            v-model="form.shuttleName"
            clearable
          />
        </el-form-item>
        <el-form-item label="离店里程数：" prop="departureMileage">
          <el-input
            placeholder="请输入"
            v-model="form.departureMileage"
            clearable
          />
        </el-form-item>
        <el-form-item label="离店车联网里程数（总）：" prop="departureNetMileage">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileage"
            clearable
          />
        </el-form-item>
        <el-form-item label="车辆车型（L）：" prop="departureNetMileage">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileage"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="送修人手机：" prop="shuttlePhone">
          <el-input
            placeholder="请输入"
            v-model="form.shuttlePhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="进店电量%：" prop="inPower">
          <el-input
            placeholder="请输入"
            v-model="form.inPower"
            clearable
          />
        </el-form-item>
        <el-form-item label="进店车联网电量%：" prop="inNetPower">
          <el-input
            placeholder="请输入"
            v-model="form.inNetPower"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="支付方式：" prop="payType">
          <fetch-select
            :request="fetchOptions"
            enumCode="xxx"
            v-model="form.payType"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="绑车人姓名：" prop="bindingUser">
          <el-input
            placeholder="请输入"
            v-model="form.bindingUser"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="离店电量%：" prop="outPower">
          <el-input
            placeholder="请输入"
            v-model="form.outPower"
            clearable
          />
        </el-form-item>
        <el-form-item label="离店车联网电量%：" prop="outNetPower">
          <el-input
            placeholder="请输入"
            v-model="form.outNetPower"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="保险公司名称：" prop="warrantyCompany">
          <el-input
            placeholder="请输入"
            v-model="form.warrantyCompany"
            clearable
          />
        </el-form-item>
        <el-form-item label="绑车人手机号码：" prop="bindingPhone">
          <el-input
            placeholder="请输入"
            v-model="form.bindingPhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="车联网里程数（纯）：" prop="netMileageElectricity">
          <el-input
            placeholder="请输入"
            v-model="form.netMileageElectricity"
            clearable
          />
        </el-form-item>
        <el-form-item label="离店车联网里程数（纯）：" prop="departureNetMileageElectricity">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileageElectricity"
            clearable
          />
        </el-form-item>
        <el-form-item label="车联网里程数（增）：" prop="netMileageExtend">
          <el-input
            placeholder="请输入"
            v-model="form.netMileageExtend"
            clearable
          />
        </el-form-item>
        <el-form-item label="离店车联网里程数（增）：" prop="departureNetMileageExtend">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileageExtend"
            clearable
          />
        </el-form-item>
          <el-form-item label="签字渠道：" prop="signChannel">
          <el-input
            placeholder="请输入"
            v-model="form.signChannel"
            clearable
          />
        </el-form-item>
        <el-form-item label="签字生成时间：" prop="signGeneratedOn">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.signGeneratedOn"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="签字完成时间：" prop="signCompletedOn">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.signCompletedOn"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredOn">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.signUrlExpiredOn"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="form-detail" v-else>
        <el-form-item label="单据编号：" prop="code">
          {{ form.code }}
        </el-form-item>
        <el-form-item label="VIN码：" prop="vehProfileVin">
          {{ form.vehProfileVin }}
        </el-form-item>
        <el-form-item label="车牌号：" prop="carPlate">
          {{ form.carPlate }}
        </el-form-item>
        <el-form-item label="数据来源：" prop="dataSource">
          {{ form.dataSource }}
        </el-form-item>
        <el-form-item label="门店名称：" prop="dealerName">
          {{ form.dealerName }}
        </el-form-item>
        <el-form-item label="客户类型：" prop="custType">
          {{ form.custType }}
        </el-form-item>
        <el-form-item label="建议保养里程：" prop="maintenanceMileage">
          {{ form.maintenanceMileage }}
        </el-form-item>
        <el-form-item label="销售日期：" prop="saleDate">
          {{ form.saleDate }}
        </el-form-item>
        <el-form-item label="专属服务门店：" prop="exclusiveServiceDealerName">
          {{ form.exclusiveServiceDealerName }}
        </el-form-item>
        <el-form-item label="预约单号：" prop="appointmentNo">
          {{ form.appointmentNo }}
        </el-form-item>
        <el-form-item label="建议保养时间：" prop="maintenanceTime">
          {{ form.maintenanceTime }}
        </el-form-item>
        <el-form-item label="保修开始日期：" prop="startWarrantyDate">
          {{ form.startWarrantyDate }}
        </el-form-item>
        <el-form-item label="登记人：" prop="orderStatus">
          {{ form.orderStatus }}
        </el-form-item>
        <el-form-item label="车主姓名：" prop="customerName">
          {{ form.customerName }}
        </el-form-item>
        <el-form-item label="上次进店里程数：" prop="lastMileage">
          {{ form.lastMileage }}
        </el-form-item>
        <el-form-item label="绑车人用户ID：" prop="bindingUserId">
          {{ form.bindingUserId }}
        </el-form-item>
        <el-form-item label="基本车型：" prop="vehModelName">
          {{ form.vehModelName }}
        </el-form-item>
        <el-form-item label="车主手机：" prop="customerPhone">
          {{ form.customerPhone }}
        </el-form-item>
        <el-form-item label="进店里程数：" prop="mileage">
          {{ form.mileage }}
        </el-form-item>
        <el-form-item label="车联网里程数（总）：" prop="netMileage">
          {{ form.netMileage }}
        </el-form-item>
        <el-form-item label="公告车型：" prop="vehRegisteredModelId">
          {{ form.vehRegisteredModelId }}
        </el-form-item>
        <el-form-item label="送修人：" prop="shuttleName">
          {{ form.shuttleName }}
        </el-form-item>
        <el-form-item label="离店里程数：" prop="departureMileage">
          {{ form.departureMileage }}
        </el-form-item>
        <el-form-item label="离店车联网里程数（总）：" prop="departureNetMileage">
          {{ form.departureNetMileage }}
        </el-form-item>
        <el-form-item label="车辆车型（L）：" prop="departureNetMileage">
          {{ form.departureNetMileage }}
        </el-form-item>
        <el-form-item label="送修人手机：" prop="shuttlePhone">
          {{ form.shuttlePhone }}
        </el-form-item>
        <el-form-item label="进店电量%：" prop="inPower">
          {{ form.inPower }}
        </el-form-item>
        <el-form-item label="进店车联网电量%：" prop="inNetPower">
          {{ form.inNetPower }}
        </el-form-item>
        <el-form-item label="支付方式：" prop="payType">
          {{ form.payType }}
        </el-form-item>
        <el-form-item label="绑车人姓名：" prop="bindingUser">
          {{ form.bindingUser }}
        </el-form-item>
        <el-form-item label="离店电量%：" prop="outPower">
          {{ form.outPower }}
        </el-form-item>
        <el-form-item label="离店车联网电量%：" prop="outNetPower">
          {{ form.outNetPower }}
        </el-form-item>
        <el-form-item label="保险公司名称：" prop="warrantyCompany">
          {{ form.warrantyCompany }}
        </el-form-item>
        <el-form-item label="绑车人手机号码：" prop="bindingPhone">
          {{ form.bindingPhone }}
        </el-form-item>
        <el-form-item label="车联网里程数（纯）：" prop="netMileageElectricity">
          {{ form.netMileageElectricity }}
        </el-form-item>
        <el-form-item label="离店车联网里程数（纯）：" prop="departureNetMileageElectricity">
          {{ form.departureNetMileageElectricity }}
        </el-form-item>
        <el-form-item label="车联网里程数（增）：" prop="netMileageExtend">
          {{ form.netMileageExtend }}
        </el-form-item>
        <el-form-item label="离店车联网里程数（增）：" prop="departureNetMileageExtend">
          {{ form.departureNetMileageExtend }}
        </el-form-item>
        <el-form-item label="签字渠道：" prop="signChannel">
          {{ form.signChannel }}
        </el-form-item>
        <el-form-item label="签字生成时间：" prop="signGeneratedOn">
          {{ form.signGeneratedOn }}
        </el-form-item>
        <el-form-item label="签字完成时间：" prop="signCompletedOn">
          {{ form.signCompletedOn }}
        </el-form-item>
        <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredOn">
          {{ form.signUrlExpiredOn }}
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
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
