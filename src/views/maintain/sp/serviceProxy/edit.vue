<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <div class="page-common-edit">
        <el-container>
          <el-main>
            <NavTop />
            <section class="common-title" v-if="_id">
              <div>
                <h2>单据编号：{{ form.code }}</h2>
                <!-- TIPS: 子标题格式如下 -->
                <h5>签字状态：{{ form.activityCode }} | 工单状态：{{ form.activityCode }}</h5>
              </div>
              <div v-if="isEditing">
                <el-button size="small" @click="handleCancel">取消</el-button>
                <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
              </div>
              <div v-else>
                <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
                  <el-form-item label="单据编号：" prop="code">
                    <el-input
                      placeholder="请输入"
                      v-model="form.code"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="数据来源：" prop="dataSource">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dataSource"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="工单状态：" prop="orderStatus">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.orderStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="保修类型：" prop="warrantyTypeCollect">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.warrantyTypeCollect"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="车主姓名：" prop="customerName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.customerName"
                      clearable
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
                  <el-form-item label="基本车型：" prop="vehModelName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.vehModelName"
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
                  <el-form-item label="门店名称：" prop="dealerName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dealerName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="预约单号：" prop="appointmentNo">
                    <el-input
                      placeholder="请输入"
                      v-model="form.appointmentNo"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="进店里程数：" prop="mileage">
                    <el-input
                      placeholder="请输入"
                      v-model="form.mileage"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="上次进店里程数：" prop="lastMileage">
                    <el-input
                      placeholder="请输入"
                      v-model="form.lastMileage"
                      clearable
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
                    />
                  </el-form-item>
                  <el-form-item label="专属服务门店：" prop="exclusiveServiceDealerName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.exclusiveServiceDealerName"
                      clearable
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
                  <el-form-item label="生成结算单时间：" prop="createStatementInfoDate">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.createStatementInfoDate"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="负责人：" prop="serviceOwnerId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.serviceOwnerId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="主键：" prop="id">
                    <el-input
                      placeholder="请输入"
                      v-model="form.id"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="创建者：" prop="creator">
                    <el-input
                      placeholder="请输入"
                      v-model="form.creator"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="创建者名称：" prop="creatorName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.creatorName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="创建时间：" prop="createTime">
                    <el-date-picker
                      :default-time="['00:00:00', '23:59:59']"
                      v-model="form.createTime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                  <el-form-item label="修改者：" prop="modifier">
                    <el-input
                      placeholder="请输入"
                      v-model="form.modifier"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="修改者名称：" prop="modifierName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.modifierName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="修改时间：" prop="updateTime">
                    <el-date-picker
                      :default-time="['00:00:00', '23:59:59']"
                      v-model="form.updateTime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input
                      placeholder="请输入"
                      v-model="form.remark"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="状态：" prop="status">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.status"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="状态变更描述：" prop="statusDesc">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.statusDesc"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="领料状态：" prop="pickStatus">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.pickStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="归属门店ID：" prop="ownerOrgId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.ownerOrgId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dealerCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="送修人：" prop="shuttleName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.shuttleName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="送修人手机：" prop="shuttlePhone">
                    <el-input
                      placeholder="请输入"
                      v-model="form.shuttlePhone"
                      clearable
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
                  <el-form-item label="保险公司名称：" prop="warrantyCompany">
                    <el-input
                      placeholder="请输入"
                      v-model="form.warrantyCompany"
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
                  <el-form-item label="签字状态：" prop="signStatus">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.signStatus"
                      placeholder="请选择"
                      clearable
                      filterable
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
                  <el-form-item label="预约方式：" prop="appointmentType">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.appointmentType"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="客户经理：" prop="serviceAdvisorId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.serviceAdvisorId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="预授权类型：" prop="preAuthType">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.preAuthType"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="是否锁定直播开关：" prop="isLockLive">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isLockLive"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="技术服务活动：" prop="serviceActivityId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.serviceActivityId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="是否已生成保修单：" prop="isCreateWarranty">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isCreateWarranty"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="是否已生成出库单：" prop="isOutboundOrder">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isOutboundOrder"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="是否已提醒留车调查：" prop="isVehRetentionRemind">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isVehRetentionRemind"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="是否作废并入库：" prop="isCancelStorage">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isCancelStorage"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="优惠模式：" prop="discountId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.discountId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="终检时间：" prop="finalCheckAt">
                    <el-date-picker
                      :default-time="['00:00:00', '23:59:59']"
                      v-model="form.finalCheckAt"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                  <el-form-item label="终检人：" prop="finalCheckerId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.finalCheckerId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="终检人：" prop="finalChecker">
                    <el-input
                      placeholder="请输入"
                      v-model="form.finalChecker"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="开单步骤：" prop="ticketStep">
                    <el-input
                      placeholder="请输入"
                      v-model="form.ticketStep"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="电池维修申请单：" prop="batteryApply">
                    <el-input
                      placeholder="请输入"
                      v-model="form.batteryApply"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="保修单状态：" prop="warrantyStatus">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.warrantyStatus"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="索赔工时费用（总）：" prop="claimItemAmount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.claimItemAmount"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="索赔其他费用（总）：" prop="claimOtherAmount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.claimOtherAmount"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="索赔材料费用（总）：" prop="claimPartsAmount">
                    <el-input
                      placeholder="请输入"
                      v-model="form.claimPartsAmount"
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
                  <el-form-item label="进店电量%：" prop="inPower">
                    <el-input
                      placeholder="请输入"
                      v-model="form.inPower"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="离店电量%：" prop="outPower">
                    <el-input
                      placeholder="请输入"
                      v-model="form.outPower"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="车联网里程数（总）：" prop="netMileage">
                    <el-input
                      placeholder="请输入"
                      v-model="form.netMileage"
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
                  <el-form-item label="进店车联网电量%：" prop="inNetPower">
                    <el-input
                      placeholder="请输入"
                      v-model="form.inNetPower"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="离店车联网电量%：" prop="outNetPower">
                    <el-input
                      placeholder="请输入"
                      v-model="form.outNetPower"
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
                  <el-form-item label="离店车联网里程数（增）：" prop="departureNetMileageExtend">
                    <el-input
                      placeholder="请输入"
                      v-model="form.departureNetMileageExtend"
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
                  <el-form-item label="车联网里程数（增）：" prop="netMileageExtend">
                    <el-input
                      placeholder="请输入"
                      v-model="form.netMileageExtend"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="整车档案id：" prop="vehProfileId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.vehProfileId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="VIN码：" prop="vehProfileVin">
                    <el-input
                      placeholder="请输入"
                      v-model="form.vehProfileVin"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="建议保养里程：" prop="maintenanceMileage">
                    <el-input
                      placeholder="请输入"
                      v-model="form.maintenanceMileage"
                      clearable
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
                    />
                  </el-form-item>
                  <el-form-item label="专属服务门店编码：" prop="exclusiveServiceDealerCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.exclusiveServiceDealerCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="车主手机：" prop="customerPhone">
                    <el-input
                      placeholder="请输入"
                      v-model="form.customerPhone"
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
                  <el-form-item label="绑车人姓名：" prop="bindingUser">
                    <el-input
                      placeholder="请输入"
                      v-model="form.bindingUser"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="绑车人用户ID：" prop="bindingUserId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.bindingUserId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="基本车型id：" prop="vehModelId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.vehModelId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="公告车型id：" prop="vehRegisteredModelId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.vehRegisteredModelId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="公告车型：" prop="vehRegisteredModelName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.vehRegisteredModelName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="年型id：" prop="vehYearTypeId">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.vehYearTypeId"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="年型：" prop="vehYearTypeName">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.vehYearTypeName"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="专属客户经理：" prop="dedicatedServiceManagerId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dedicatedServiceManagerId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="专属客户经理：" prop="dedicatedServiceManager">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dedicatedServiceManager"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="电机型号：" prop="motorModel">
                    <el-input
                      placeholder="请输入"
                      v-model="form.motorModel"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="电机序列号：" prop="motorSerialNumber">
                    <el-input
                      placeholder="请输入"
                      v-model="form.motorSerialNumber"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="电池型号：" prop="batteryModel">
                    <el-input
                      placeholder="请输入"
                      v-model="form.batteryModel"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="电池序列号：" prop="batterySerialNumber">
                    <el-input
                      placeholder="请输入"
                      v-model="form.batterySerialNumber"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="发动机号：" prop="engineNumber">
                    <el-input
                      placeholder="请输入"
                      v-model="form.engineNumber"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="维修类型（汇总）：" prop="repairItemTypeDetailCollect">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.repairItemTypeDetailCollect"
                      placeholder="请选择"
                      clearable
                      filterable
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
                    />
                  </el-form-item>
                  <el-form-item label="是否直播：" prop="isLive">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isLive"
                      clearable
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
                  <el-form-item label="是否保留旧件：" prop="isRetainOldParts">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isRetainOldParts"
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
                  <el-form-item label="客户诉求：" prop="customerComment">
                    <el-input
                      placeholder="请输入"
                      v-model="form.customerComment"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="客户经理建议：" prop="testResult">
                    <el-input
                      placeholder="请输入"
                      v-model="form.testResult"
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
                  <el-form-item label="客户故障描述：" prop="customerContent">
                    <el-input
                      placeholder="请输入"
                      v-model="form.customerContent"
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
                  <el-form-item label="异常描述：" prop="anomalyDescription">
                    <el-input
                      placeholder="请输入"
                      v-model="form.anomalyDescription"
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
                  <el-form-item label="客户反馈故障是否全部解决：" prop="faultSolve">
                    <el-input
                      placeholder="请输入"
                      v-model="form.faultSolve"
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
                  <el-form-item label="故障提醒内容：" prop="faultAlert">
                    <el-input
                      placeholder="请输入"
                      v-model="form.faultAlert"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="故障统计周期（天）：" prop="faultPeriod">
                    <el-input
                      placeholder="请输入"
                      v-model="form.faultPeriod"
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
                  <el-form-item label="最近故障施工单（周期内）：" prop="recentlyfaultServiceProxy">
                    <el-input
                      placeholder="请输入"
                      v-model="form.recentlyfaultServiceProxy"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="故障统计模块：" prop="faultModule">
                    <el-input
                      placeholder="请输入"
                      v-model="form.faultModule"
                      clearable
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
                  <el-form-item label="是否需要提报预授权：" prop="isPreAuth">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isPreAuth"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="是否已经生成预授权：" prop="isCreatePreAuth">
                    <el-input
                      placeholder="请输入"
                      v-model="form.isCreatePreAuth"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="预授权信息：" prop="preAuthId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.preAuthId"
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
                  <el-form-item label="原因说明：" prop="faultDesc">
                    <el-input
                      placeholder="请输入"
                      v-model="form.faultDesc"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="电池去向单位：" prop="batteryUnitId">
                    <el-input
                      placeholder="请输入"
                      v-model="form.batteryUnitId"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="去向单位统一代码：" prop="targetUnitCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.targetUnitCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="更换前编号：" prop="beforeChangeCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.beforeChangeCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="更换后编号：" prop="afterChangeCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.afterChangeCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="车外检查：" prop="exteriorPhotos">
                    <el-input
                      placeholder="请输入"
                      v-model="form.exteriorPhotos"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="车内检查：" prop="interiorPhotos">
                    <el-input
                      placeholder="请输入"
                      v-model="form.interiorPhotos"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="维修项目：" prop="repairItemResps">
                    <el-input
                      placeholder="请输入"
                      v-model="form.repairItemResps"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="维修零配件：" prop="sparePartResps">
                    <el-input
                      placeholder="请输入"
                      v-model="form.sparePartResps"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="维修零配件出库单：" prop="partOutboundResps">
                    <el-input
                      placeholder="请输入"
                      v-model="form.partOutboundResps"
                      clearable
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-else>
                  <el-form-item label="单据编号：" prop="code">
                    {{ form.code }}
                  </el-form-item>
                  <el-form-item label="数据来源：" prop="dataSource">
                    {{ form.dataSource }}
                  </el-form-item>
                  <el-form-item label="工单状态：" prop="orderStatus">
                    {{ form.orderStatus }}
                  </el-form-item>
                  <el-form-item label="保修类型（汇总）：" prop="warrantyTypeCollect">
                    {{ form.warrantyTypeCollect }}
                  </el-form-item>
                  <el-form-item label="车主姓名：" prop="customerName">
                    {{ form.customerName }}
                  </el-form-item>
                  <el-form-item label="客户类型：" prop="custType">
                    {{ form.custType }}
                  </el-form-item>
                  <el-form-item label="基本车型：" prop="vehModelName">
                    {{ form.vehModelName }}
                  </el-form-item>
                  <el-form-item label="车牌号：" prop="carPlate">
                    {{ form.carPlate }}
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="预约单号：" prop="appointmentNo">
                    {{ form.appointmentNo }}
                  </el-form-item>
                  <el-form-item label="进店里程数：" prop="mileage">
                    {{ form.mileage }}
                  </el-form-item>
                  <el-form-item label="上次进店里程数：" prop="lastMileage">
                    {{ form.lastMileage }}
                  </el-form-item>
                  <el-form-item label="保修开始日期：" prop="startWarrantyDate">
                    {{ form.startWarrantyDate }}
                  </el-form-item>
                  <el-form-item label="专属服务门店：" prop="exclusiveServiceDealerName">
                    {{ form.exclusiveServiceDealerName }}
                  </el-form-item>
                  <el-form-item label="预计交车时间：" prop="expectFinishAt">
                    {{ form.expectFinishAt }}
                  </el-form-item>
                  <el-form-item label="生成结算单时间：" prop="createStatementInfoDate">
                    {{ form.createStatementInfoDate }}
                  </el-form-item>
                  <el-form-item label="负责人：" prop="serviceOwnerId">
                    {{ form.serviceOwnerId }}
                  </el-form-item>
                  <el-form-item label="主键：" prop="id">
                    {{ form.id }}
                  </el-form-item>
                  <el-form-item label="创建者：" prop="creator">
                    {{ form.creator }}
                  </el-form-item>
                  <el-form-item label="创建者名称：" prop="creatorName">
                    {{ form.creatorName }}
                  </el-form-item>
                  <el-form-item label="创建时间：" prop="createTime">
                    {{ form.createTime }}
                  </el-form-item>
                  <el-form-item label="修改者：" prop="modifier">
                    {{ form.modifier }}
                  </el-form-item>
                  <el-form-item label="修改者名称：" prop="modifierName">
                    {{ form.modifierName }}
                  </el-form-item>
                  <el-form-item label="修改时间：" prop="updateTime">
                    {{ form.updateTime }}
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    {{ form.remark }}
                  </el-form-item>
                  <el-form-item label="状态：" prop="status">
                    {{ form.status }}
                  </el-form-item>
                  <el-form-item label="状态变更描述：" prop="statusDesc">
                    {{ form.statusDesc }}
                  </el-form-item>
                  <el-form-item label="领料状态：" prop="pickStatus">
                    {{ form.pickStatus }}
                  </el-form-item>
                  <el-form-item label="归属门店ID：" prop="ownerOrgId">
                    {{ form.ownerOrgId }}
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    {{ form.dealerCode }}
                  </el-form-item>
                  <el-form-item label="送修人：" prop="shuttleName">
                    {{ form.shuttleName }}
                  </el-form-item>
                  <el-form-item label="送修人手机：" prop="shuttlePhone">
                    {{ form.shuttlePhone }}
                  </el-form-item>
                  <el-form-item label="支付方式：" prop="payType">
                    {{ form.payType }}
                  </el-form-item>
                  <el-form-item label="保险公司名称：" prop="warrantyCompany">
                    {{ form.warrantyCompany }}
                  </el-form-item>
                  <el-form-item label="签字渠道：" prop="signChannel">
                    {{ form.signChannel }}
                  </el-form-item>
                  <el-form-item label="签字完成时间：" prop="signCompletedOn">
                    {{ form.signCompletedOn }}
                  </el-form-item>
                  <el-form-item label="签字生成时间：" prop="signGeneratedOn">
                    {{ form.signGeneratedOn }}
                  </el-form-item>
                  <el-form-item label="签字状态：" prop="signStatus">
                    {{ form.signStatus }}
                  </el-form-item>
                  <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredOn">
                    {{ form.signUrlExpiredOn }}
                  </el-form-item>
                  <el-form-item label="预约方式：" prop="appointmentType">
                    {{ form.appointmentType }}
                  </el-form-item>
                  <el-form-item label="客户经理：" prop="serviceAdvisorId">
                    {{ form.serviceAdvisorId }}
                  </el-form-item>
                  <el-form-item label="预授权类型：" prop="preAuthType">
                    {{ form.preAuthType }}
                  </el-form-item>
                  <el-form-item label="是否锁定直播开关：" prop="isLockLive">
                    {{ form.isLockLive }}
                  </el-form-item>
                  <el-form-item label="技术服务活动：" prop="serviceActivityId">
                    {{ form.serviceActivityId }}
                  </el-form-item>
                  <el-form-item label="是否已生成保修单：" prop="isCreateWarranty">
                    {{ form.isCreateWarranty }}
                  </el-form-item>
                  <el-form-item label="是否已生成出库单：" prop="isOutboundOrder">
                    {{ form.isOutboundOrder }}
                  </el-form-item>
                  <el-form-item label="是否已提醒留车调查：" prop="isVehRetentionRemind">
                    {{ form.isVehRetentionRemind }}
                  </el-form-item>
                  <el-form-item label="是否作废并入库：" prop="isCancelStorage">
                    {{ form.isCancelStorage }}
                  </el-form-item>
                  <el-form-item label="优惠模式：" prop="discountId">
                    {{ form.discountId }}
                  </el-form-item>
                  <el-form-item label="终检时间：" prop="finalCheckAt">
                    {{ form.finalCheckAt }}
                  </el-form-item>
                  <el-form-item label="终检人：" prop="finalCheckerId">
                    {{ form.finalCheckerId }}
                  </el-form-item>
                  <el-form-item label="终检人：" prop="finalChecker">
                    {{ form.finalChecker }}
                  </el-form-item>
                  <el-form-item label="开单步骤：" prop="ticketStep">
                    {{ form.ticketStep }}
                  </el-form-item>
                  <el-form-item label="电池维修申请单：" prop="batteryApply">
                    {{ form.batteryApply }}
                  </el-form-item>
                  <el-form-item label="保修单状态：" prop="warrantyStatus">
                    {{ form.warrantyStatus }}
                  </el-form-item>
                  <el-form-item label="索赔工时费用（总）：" prop="claimItemAmount">
                    {{ form.claimItemAmount }}
                  </el-form-item>
                  <el-form-item label="索赔其他费用（总）：" prop="claimOtherAmount">
                    {{ form.claimOtherAmount }}
                  </el-form-item>
                  <el-form-item label="索赔材料费用（总）：" prop="claimPartsAmount">
                    {{ form.claimPartsAmount }}
                  </el-form-item>
                  <el-form-item label="离店里程数：" prop="departureMileage">
                    {{ form.departureMileage }}
                  </el-form-item>
                  <el-form-item label="进店电量%：" prop="inPower">
                    {{ form.inPower }}
                  </el-form-item>
                  <el-form-item label="离店电量%：" prop="outPower">
                    {{ form.outPower }}
                  </el-form-item>
                  <el-form-item label="车联网里程数（总）：" prop="netMileage">
                    {{ form.netMileage }}
                  </el-form-item>
                  <el-form-item label="离店车联网里程数（总）：" prop="departureNetMileage">
                    {{ form.departureNetMileage }}
                  </el-form-item>
                  <el-form-item label="进店车联网电量%：" prop="inNetPower">
                    {{ form.inNetPower }}
                  </el-form-item>
                  <el-form-item label="离店车联网电量%：" prop="outNetPower">
                    {{ form.outNetPower }}
                  </el-form-item>
                  <el-form-item label="离店车联网里程数（纯）：" prop="departureNetMileageElectricity">
                    {{ form.departureNetMileageElectricity }}
                  </el-form-item>
                  <el-form-item label="离店车联网里程数（增）：" prop="departureNetMileageExtend">
                    {{ form.departureNetMileageExtend }}
                  </el-form-item>
                  <el-form-item label="车联网里程数（纯）：" prop="netMileageElectricity">
                    {{ form.netMileageElectricity }}
                  </el-form-item>
                  <el-form-item label="车联网里程数（增）：" prop="netMileageExtend">
                    {{ form.netMileageExtend }}
                  </el-form-item>
                  <el-form-item label="整车档案id：" prop="vehProfileId">
                    {{ form.vehProfileId }}
                  </el-form-item>
                  <el-form-item label="VIN码：" prop="vehProfileVin">
                    {{ form.vehProfileVin }}
                  </el-form-item>
                  <el-form-item label="建议保养里程：" prop="maintenanceMileage">
                    {{ form.maintenanceMileage }}
                  </el-form-item>
                  <el-form-item label="建议保养时间：" prop="maintenanceTime">
                    {{ form.maintenanceTime }}
                  </el-form-item>
                  <el-form-item label="销售日期：" prop="saleDate">
                    {{ form.saleDate }}
                  </el-form-item>
                  <el-form-item label="专属服务门店编码：" prop="exclusiveServiceDealerCode">
                    {{ form.exclusiveServiceDealerCode }}
                  </el-form-item>
                  <el-form-item label="车主手机：" prop="customerPhone">
                    {{ form.customerPhone }}
                  </el-form-item>
                  <el-form-item label="绑车人手机号码：" prop="bindingPhone">
                    {{ form.bindingPhone }}
                  </el-form-item>
                  <el-form-item label="绑车人姓名：" prop="bindingUser">
                    {{ form.bindingUser }}
                  </el-form-item>
                  <el-form-item label="绑车人用户ID：" prop="bindingUserId">
                    {{ form.bindingUserId }}
                  </el-form-item>
                  <el-form-item label="基本车型id：" prop="vehModelId">
                    {{ form.vehModelId }}
                  </el-form-item>
                  <el-form-item label="公告车型id：" prop="vehRegisteredModelId">
                    {{ form.vehRegisteredModelId }}
                  </el-form-item>
                  <el-form-item label="公告车型：" prop="vehRegisteredModelName">
                    {{ form.vehRegisteredModelName }}
                  </el-form-item>
                  <el-form-item label="年型id：" prop="vehYearTypeId">
                    {{ form.vehYearTypeId }}
                  </el-form-item>
                  <el-form-item label="年型：" prop="vehYearTypeName">
                    {{ form.vehYearTypeName }}
                  </el-form-item>
                  <el-form-item label="专属客户经理：" prop="dedicatedServiceManagerId">
                    {{ form.dedicatedServiceManagerId }}
                  </el-form-item>
                  <el-form-item label="专属客户经理：" prop="dedicatedServiceManager">
                    {{ form.dedicatedServiceManager }}
                  </el-form-item>
                  <el-form-item label="电机型号：" prop="motorModel">
                    {{ form.motorModel }}
                  </el-form-item>
                  <el-form-item label="电机序列号：" prop="motorSerialNumber">
                    {{ form.motorSerialNumber }}
                  </el-form-item>
                  <el-form-item label="电池型号：" prop="batteryModel">
                    {{ form.batteryModel }}
                  </el-form-item>
                  <el-form-item label="电池序列号：" prop="batterySerialNumber">
                    {{ form.batterySerialNumber }}
                  </el-form-item>
                  <el-form-item label="发动机号：" prop="engineNumber">
                    {{ form.engineNumber }}
                  </el-form-item>
                  <el-form-item label="维修类型（汇总）：" prop="repairItemTypeDetailCollect">
                    {{ form.repairItemTypeDetailCollect }}
                  </el-form-item>
                  <el-form-item label="业务类型：" prop="businessType">
                    {{ form.businessType }}
                  </el-form-item>
                  <el-form-item label="三包预警：" prop="alarmLevel">
                    {{ form.alarmLevel }}
                  </el-form-item>
                  <el-form-item label="是否直播：" prop="isLive">
                    {{ form.isLive }}
                  </el-form-item>
                  <el-form-item label="是否返修：" prop="haveRework">
                    {{ form.haveRework }}
                  </el-form-item>
                  <el-form-item label="是否洗车：" prop="isCarWash">
                    {{ form.isCarWash }}
                  </el-form-item>
                  <el-form-item label="是否保留旧件：" prop="isRetainOldParts">
                    {{ form.isRetainOldParts }}
                  </el-form-item>
                  <el-form-item label="车联网故障描述：" prop="inCustomerContent">
                    {{ form.inCustomerContent }}
                  </el-form-item>
                  <el-form-item label="客户诉求：" prop="customerComment">
                    {{ form.customerComment }}
                  </el-form-item>
                  <el-form-item label="客户经理建议：" prop="testResult">
                    {{ form.testResult }}
                  </el-form-item>
                  <el-form-item label="本次进店是否存在故障：" prop="currentFault">
                    {{ form.currentFault }}
                  </el-form-item>
                  <el-form-item label="客户故障描述：" prop="customerContent">
                    {{ form.customerContent }}
                  </el-form-item>
                  <el-form-item label="作废描述：" prop="invaildDesc">
                    {{ form.invaildDesc }}
                  </el-form-item>
                  <el-form-item label="异常描述：" prop="anomalyDescription">
                    {{ form.anomalyDescription }}
                  </el-form-item>
                  <el-form-item label="预检完成时间：" prop="previewingFinishAt">
                    {{ form.previewingFinishAt }}
                  </el-form-item>
                  <el-form-item label="制单完成时间：" prop="confirmedOn">
                    {{ form.confirmedOn }}
                  </el-form-item>
                  <el-form-item label="计划作业时间：" prop="expectStartAt">
                    {{ form.expectStartAt }}
                  </el-form-item>
                  <el-form-item label="实际作业时间：" prop="startAt">
                    {{ form.startAt }}
                  </el-form-item>
                  <el-form-item label="完成作业时间：" prop="finishAt">
                    {{ form.finishAt }}
                  </el-form-item>
                  <el-form-item label="客户反馈故障是否全部解决：" prop="faultSolve">
                    {{ form.faultSolve }}
                  </el-form-item>
                  <el-form-item label="本次进店情况（周期内）：" prop="currentSituation">
                    {{ form.currentSituation }}
                  </el-form-item>
                  <el-form-item label="故障提醒内容：" prop="faultAlert">
                    {{ form.faultAlert }}
                  </el-form-item>
                  <el-form-item label="故障统计周期（天）：" prop="faultPeriod">
                    {{ form.faultPeriod }}
                  </el-form-item>
                  <el-form-item label="最早故障施工单（周期内）：" prop="earliestfaultServiceProxy">
                    {{ form.earliestfaultServiceProxy }}
                  </el-form-item>
                  <el-form-item label="最近故障施工单（周期内）：" prop="recentlyfaultServiceProxy">
                    {{ form.recentlyfaultServiceProxy }}
                  </el-form-item>
                  <el-form-item label="故障统计模块：" prop="faultModule">
                    {{ form.faultModule }}
                  </el-form-item>
                  <el-form-item label="是否已生成结算单：" prop="isCreateStatementInfo">
                    {{ form.isCreateStatementInfo }}
                  </el-form-item>
                  <el-form-item label="是否需要提报预授权：" prop="isPreAuth">
                    {{ form.isPreAuth }}
                  </el-form-item>
                  <el-form-item label="是否已经生成预授权：" prop="isCreatePreAuth">
                    {{ form.isCreatePreAuth }}
                  </el-form-item>
                  <el-form-item label="预授权信息：" prop="preAuthId">
                    {{ form.preAuthId }}
                  </el-form-item>
                  <el-form-item label="未解决问题原因：" prop="unresolvedReason">
                    {{ form.unresolvedReason }}
                  </el-form-item>
                  <el-form-item label="原因说明：" prop="faultDesc">
                    {{ form.faultDesc }}
                  </el-form-item>
                  <el-form-item label="电池去向单位：" prop="batteryUnitId">
                    {{ form.batteryUnitId }}
                  </el-form-item>
                  <el-form-item label="去向单位统一代码：" prop="targetUnitCode">
                    {{ form.targetUnitCode }}
                  </el-form-item>
                  <el-form-item label="更换前编号：" prop="beforeChangeCode">
                    {{ form.beforeChangeCode }}
                  </el-form-item>
                  <el-form-item label="更换后编号：" prop="afterChangeCode">
                    {{ form.afterChangeCode }}
                  </el-form-item>
                  <el-form-item label="车外检查：" prop="exteriorPhotos">
                    {{ form.exteriorPhotos }}
                  </el-form-item>
                  <el-form-item label="车内检查：" prop="interiorPhotos">
                    {{ form.interiorPhotos }}
                  </el-form-item>
                  <el-form-item label="维修项目：" prop="repairItemResps">
                    {{ form.repairItemResps }}
                  </el-form-item>
                  <el-form-item label="维修零配件：" prop="sparePartResps">
                    {{ form.sparePartResps }}
                  </el-form-item>
                  <el-form-item label="维修零配件出库单：" prop="partOutboundResps">
                    {{ form.partOutboundResps }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>区块标题</h2>
                <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
              </div>
              <div class="common-section-body">
                <div class="common-section-table">
                  <edit-table
                    ref="editTable"
                    :columns="columns"
                    :data="tableData"
                    :defaultNewRow="defaultNewRow"
                    :show-toolbar="false"
                    :options="options"
                    :auth="{edit: canAddOrUpdate, delete: canDelete}"
                  />
                </div>
              </div>
            </section>
          </el-main>
          <el-footer height="60px" v-if="!_id">
            <el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
            <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
            <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
            <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
          </el-footer>
        </el-container>
      </div>
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/sp/serviceProxy/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import NavTop from './components/NavTop';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dataSource: '',
  orderStatus: '',
  warrantyTypeCollect: '',
  customerName: '',
  custType: '',
  vehModelName: '',
  carPlate: '',
  dealerName: '',
  appointmentNo: '',
  mileage: '',
  lastMileage: '',
  startWarrantyDate: '',
  exclusiveServiceDealerName: '',
  expectFinishAt: '',
  createStatementInfoDate: '',
  serviceOwnerId: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  pickStatus: '',
  ownerOrgId: '',
  dealerCode: '',
  shuttleName: '',
  shuttlePhone: '',
  payType: '',
  warrantyCompany: '',
  signChannel: '',
  signCompletedOn: '',
  signGeneratedOn: '',
  signStatus: '',
  signUrlExpiredOn: '',
  appointmentType: '',
  serviceAdvisorId: '',
  preAuthType: '',
  isLockLive: '',
  serviceActivityId: '',
  isCreateWarranty: '',
  isOutboundOrder: '',
  isVehRetentionRemind: '',
  isCancelStorage: '',
  discountId: '',
  finalCheckAt: '',
  finalCheckerId: '',
  finalChecker: '',
  ticketStep: '',
  batteryApply: '',
  warrantyStatus: '',
  claimItemAmount: '',
  claimOtherAmount: '',
  claimPartsAmount: '',
  departureMileage: '',
  inPower: '',
  outPower: '',
  netMileage: '',
  departureNetMileage: '',
  inNetPower: '',
  outNetPower: '',
  departureNetMileageElectricity: '',
  departureNetMileageExtend: '',
  netMileageElectricity: '',
  netMileageExtend: '',
  vehProfileId: '',
  vehProfileVin: '',
  maintenanceMileage: '',
  maintenanceTime: '',
  saleDate: '',
  exclusiveServiceDealerCode: '',
  customerPhone: '',
  bindingPhone: '',
  bindingUser: '',
  bindingUserId: '',
  vehModelId: '',
  vehRegisteredModelId: '',
  vehRegisteredModelName: '',
  vehYearTypeId: '',
  vehYearTypeName: '',
  dedicatedServiceManagerId: '',
  dedicatedServiceManager: '',
  motorModel: '',
  motorSerialNumber: '',
  batteryModel: '',
  batterySerialNumber: '',
  engineNumber: '',
  repairItemTypeDetailCollect: '',
  businessType: '',
  alarmLevel: '',
  isLive: '',
  haveRework: '',
  isCarWash: '',
  isRetainOldParts: '',
  inCustomerContent: '',
  customerComment: '',
  testResult: '',
  currentFault: '',
  customerContent: '',
  invaildDesc: '',
  anomalyDescription: '',
  previewingFinishAt: '',
  confirmedOn: '',
  expectStartAt: '',
  startAt: '',
  finishAt: '',
  faultSolve: '',
  currentSituation: '',
  faultAlert: '',
  faultPeriod: '',
  earliestfaultServiceProxy: '',
  recentlyfaultServiceProxy: '',
  faultModule: '',
  isCreateStatementInfo: '',
  isPreAuth: '',
  isCreatePreAuth: '',
  preAuthId: '',
  unresolvedReason: '',
  faultDesc: '',
  batteryUnitId: '',
  targetUnitCode: '',
  beforeChangeCode: '',
  afterChangeCode: '',
  exteriorPhotos: '',
  interiorPhotos: '',
  repairItemResps: '',
  sparePartResps: '',
  partOutboundResps: '',
};

export default {
  name: 'serviceProxyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditTable,
    FetchSelect,
    NavTop
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
      pageTitle: '接车施工单管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceProxy',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
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
        code: [
          { required: true, message: '请输入单据编号', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择工单状态', trigger: 'change' }
        ],
        warrantyTypeCollect: [
          { required: true, message: '请选择保修类型（汇总）', trigger: 'change' }
        ],
        customerName: [
          { required: true, message: '请输入车主姓名', trigger: 'change' }
        ],
        custType: [
          { required: true, message: '请选择客户类型', trigger: 'change' }
        ],
        vehModelName: [
          { required: true, message: '请输入基本车型', trigger: 'change' }
        ],
        carPlate: [
          { required: true, message: '请输入车牌号', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        appointmentNo: [
          { required: true, message: '请输入预约单号', trigger: 'change' }
        ],
        mileage: [
          { required: true, message: '请输入进店里程数', trigger: 'change' }
        ],
        lastMileage: [
          { required: true, message: '请输入上次进店里程数', trigger: 'change' }
        ],
        startWarrantyDate: [
          { required: true, message: '请选择保修开始日期', trigger: 'change' }
        ],
        exclusiveServiceDealerName: [
          { required: true, message: '请输入专属服务���店名称', trigger: 'change' }
        ],
        expectFinishAt: [
          { required: true, message: '请选择预计交车时间', trigger: 'change' }
        ],
        createStatementInfoDate: [
          { required: true, message: '请选择生成结算单时间', trigger: 'change' }
        ],
        serviceOwnerId: [
          { required: true, message: '请输入负责人', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        pickStatus: [
          { required: true, message: '请选择领料状态', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        shuttleName: [
          { required: true, message: '请输入送修人', trigger: 'change' }
        ],
        shuttlePhone: [
          { required: true, message: '请输入送修人手机', trigger: 'change' }
        ],
        payType: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        warrantyCompany: [
          { required: true, message: '请输入保险公司名称', trigger: 'change' }
        ],
        signChannel: [
          { required: true, message: '请输入签字渠道（1、短信 2、APP  3、零小跑）', trigger: 'change' }
        ],
        signCompletedOn: [
          { required: true, message: '请选择签字完成时间', trigger: 'change' }
        ],
        signGeneratedOn: [
          { required: true, message: '请选择签字生成时间', trigger: 'change' }
        ],
        signStatus: [
          { required: true, message: '请选择签字状态（1、待签字 2、已签字）', trigger: 'change' }
        ],
        signUrlExpiredOn: [
          { required: true, message: '请选择短信签字链接过期时间', trigger: 'change' }
        ],
        appointmentType: [
          { required: true, message: '请选择预约方式', trigger: 'change' }
        ],
        serviceAdvisorId: [
          { required: true, message: '请输入客户经理', trigger: 'change' }
        ],
        preAuthType: [
          { required: true, message: '请选择预授权类型', trigger: 'change' }
        ],
        isLockLive: [
          { required: true, message: '请输入是否锁定直播开关', trigger: 'change' }
        ],
        serviceActivityId: [
          { required: true, message: '请输入技术服务活动', trigger: 'change' }
        ],
        isCreateWarranty: [
          { required: true, message: '请输入是否已生成保修单', trigger: 'change' }
        ],
        isOutboundOrder: [
          { required: true, message: '请输入是否已生成出库单', trigger: 'change' }
        ],
        isVehRetentionRemind: [
          { required: true, message: '请输入是否已提醒留车调查', trigger: 'change' }
        ],
        isCancelStorage: [
          { required: true, message: '请输入是否作废并入库', trigger: 'change' }
        ],
        discountId: [
          { required: true, message: '请输入优惠模式', trigger: 'change' }
        ],
        finalCheckAt: [
          { required: true, message: '请选择终检时间', trigger: 'change' }
        ],
        finalCheckerId: [
          { required: true, message: '请输入终检人', trigger: 'change' }
        ],
        finalChecker: [
          { required: true, message: '请输入终检人', trigger: 'change' }
        ],
        ticketStep: [
          { required: true, message: '请输入开单步骤', trigger: 'change' }
        ],
        batteryApply: [
          { required: true, message: '请输入电池维修申请单', trigger: 'change' }
        ],
        warrantyStatus: [
          { required: true, message: '请选择保修单状态', trigger: 'change' }
        ],
        claimItemAmount: [
          { required: true, message: '请输入索赔工时费用（总）', trigger: 'change' }
        ],
        claimOtherAmount: [
          { required: true, message: '请输入索赔其他费用（总）', trigger: 'change' }
        ],
        claimPartsAmount: [
          { required: true, message: '请输入索赔材料费用（总）', trigger: 'change' }
        ],
        departureMileage: [
          { required: true, message: '请输入离店里程数', trigger: 'change' }
        ],
        inPower: [
          { required: true, message: '请输入进店电量%', trigger: 'change' }
        ],
        outPower: [
          { required: true, message: '请输入离店电量%', trigger: 'change' }
        ],
        netMileage: [
          { required: true, message: '请输入车联网里程数（总）', trigger: 'change' }
        ],
        departureNetMileage: [
          { required: true, message: '请输入离店车联网里程数（总）', trigger: 'change' }
        ],
        inNetPower: [
          { required: true, message: '请输入进店车联网电量%', trigger: 'change' }
        ],
        outNetPower: [
          { required: true, message: '请输入离店车联网电量%', trigger: 'change' }
        ],
        departureNetMileageElectricity: [
          { required: true, message: '请输入离店车联网里程数（纯）', trigger: 'change' }
        ],
        departureNetMileageExtend: [
          { required: true, message: '请输入离店车联网里程数（增）', trigger: 'change' }
        ],
        netMileageElectricity: [
          { required: true, message: '请输入车联网里程数（纯）', trigger: 'change' }
        ],
        netMileageExtend: [
          { required: true, message: '请输入车联网里程数（增）', trigger: 'change' }
        ],
        vehProfileId: [
          { required: true, message: '请输入整车档案id', trigger: 'change' }
        ],
        vehProfileVin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        maintenanceMileage: [
          { required: true, message: '请输入建议保养里程', trigger: 'change' }
        ],
        maintenanceTime: [
          { required: true, message: '请选择建议保养时间', trigger: 'change' }
        ],
        saleDate: [
          { required: true, message: '请选择销售日期', trigger: 'change' }
        ],
        exclusiveServiceDealerCode: [
          { required: true, message: '请输入专属服务门店编码', trigger: 'change' }
        ],
        customerPhone: [
          { required: true, message: '请输入车主手机', trigger: 'change' }
        ],
        bindingPhone: [
          { required: true, message: '请输入绑车人手机号码', trigger: 'change' }
        ],
        bindingUser: [
          { required: true, message: '请输入绑车人姓名', trigger: 'change' }
        ],
        bindingUserId: [
          { required: true, message: '请输入绑车人用户ID', trigger: 'change' }
        ],
        vehModelId: [
          { required: true, message: '请输入基本车型id', trigger: 'change' }
        ],
        vehRegisteredModelId: [
          { required: true, message: '请输入公告车型id', trigger: 'change' }
        ],
        vehRegisteredModelName: [
          { required: true, message: '请输入公告车型', trigger: 'change' }
        ],
        vehYearTypeId: [
          { required: true, message: '请选择年型id', trigger: 'change' }
        ],
        vehYearTypeName: [
          { required: true, message: '请选择年型', trigger: 'change' }
        ],
        dedicatedServiceManagerId: [
          { required: true, message: '请输入专属客户经理', trigger: 'change' }
        ],
        dedicatedServiceManager: [
          { required: true, message: '请输入专属客户经理', trigger: 'change' }
        ],
        motorModel: [
          { required: true, message: '请输入电机型号', trigger: 'change' }
        ],
        motorSerialNumber: [
          { required: true, message: '请输入电机序列号', trigger: 'change' }
        ],
        batteryModel: [
          { required: true, message: '请输入电池型号', trigger: 'change' }
        ],
        batterySerialNumber: [
          { required: true, message: '请输入电池序列号', trigger: 'change' }
        ],
        engineNumber: [
          { required: true, message: '请输入发动机号', trigger: 'change' }
        ],
        repairItemTypeDetailCollect: [
          { required: true, message: '请选择维修类型（汇总）', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        alarmLevel: [
          { required: true, message: '请输入三包预警', trigger: 'change' }
        ],
        isLive: [
          { required: true, message: '请输入是否直播', trigger: 'change' }
        ],
        haveRework: [
          { required: true, message: '请输入是否返修', trigger: 'change' }
        ],
        isCarWash: [
          { required: true, message: '请输入是否洗车', trigger: 'change' }
        ],
        isRetainOldParts: [
          { required: true, message: '请输入是否保留旧件', trigger: 'change' }
        ],
        inCustomerContent: [
          { required: true, message: '请输入车联网故障描述', trigger: 'change' }
        ],
        customerComment: [
          { required: true, message: '请输入客户诉求', trigger: 'change' }
        ],
        testResult: [
          { required: true, message: '请输入客户经理建议', trigger: 'change' }
        ],
        currentFault: [
          { required: true, message: '请输入本次进店是否存在故障', trigger: 'change' }
        ],
        customerContent: [
          { required: true, message: '请输入客户故障描述', trigger: 'change' }
        ],
        invaildDesc: [
          { required: true, message: '请输入作废描述', trigger: 'change' }
        ],
        anomalyDescription: [
          { required: true, message: '请输入异常描述', trigger: 'change' }
        ],
        previewingFinishAt: [
          { required: true, message: '请选择预检完成时间', trigger: 'change' }
        ],
        confirmedOn: [
          { required: true, message: '请选择制单完成时间', trigger: 'change' }
        ],
        expectStartAt: [
          { required: true, message: '请选择计划作业时间', trigger: 'change' }
        ],
        startAt: [
          { required: true, message: '请选择实际作业时间', trigger: 'change' }
        ],
        finishAt: [
          { required: true, message: '请选择完成作业时间', trigger: 'change' }
        ],
        faultSolve: [
          { required: true, message: '请输入客户反馈故障是否全部解决', trigger: 'change' }
        ],
        currentSituation: [
          { required: true, message: '请输入本次进店情况（周期内）', trigger: 'change' }
        ],
        faultAlert: [
          { required: true, message: '请输入故障提醒内容', trigger: 'change' }
        ],
        faultPeriod: [
          { required: true, message: '请输入故障统计周期（天）', trigger: 'change' }
        ],
        earliestfaultServiceProxy: [
          { required: true, message: '请输入最早故障施工单（周期内）', trigger: 'change' }
        ],
        recentlyfaultServiceProxy: [
          { required: true, message: '请输入最近故障施工单（周期内）', trigger: 'change' }
        ],
        faultModule: [
          { required: true, message: '请输入故障统计模块', trigger: 'change' }
        ],
        isCreateStatementInfo: [
          { required: true, message: '请选择是否已生成结算单', trigger: 'change' }
        ],
        isPreAuth: [
          { required: true, message: '请输入是否需要提报预授权', trigger: 'change' }
        ],
        isCreatePreAuth: [
          { required: true, message: '请输入是否已经生成预授权', trigger: 'change' }
        ],
        preAuthId: [
          { required: true, message: '请输入预授权信息', trigger: 'change' }
        ],
        unresolvedReason: [
          { required: true, message: '请输入未解决问题原因', trigger: 'change' }
        ],
        faultDesc: [
          { required: true, message: '请输入原因说明', trigger: 'change' }
        ],
        batteryUnitId: [
          { required: true, message: '请输入电池去向单位', trigger: 'change' }
        ],
        targetUnitCode: [
          { required: true, message: '请输入去向单位统一代码', trigger: 'change' }
        ],
        beforeChangeCode: [
          { required: true, message: '请输入更换前编号', trigger: 'change' }
        ],
        afterChangeCode: [
          { required: true, message: '请输入更换后编号', trigger: 'change' }
        ],
        exteriorPhotos: [
          { required: true, message: '请输入车外检查', trigger: 'change' }
        ],
        interiorPhotos: [
          { required: true, message: '请输入车内检查', trigger: 'change' }
        ],
        repairItemResps: [
          { required: true, message: '请输入维修项目', trigger: 'change' }
        ],
        sparePartResps: [
          { required: true, message: '请输入维修零配件', trigger: 'change' }
        ],
        partOutboundResps: [
          { required: true, message: '请输入维修零配件出库单', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleCancel () {
      this.$refs.ruleForm.clearValidate();
      this.isEditing = false;
    },
    handleEdit () {
      this.isEditing = true;
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['接车施工单管理', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
            addOrUpdate({ ...this.form, customKey: tableData }).then(res => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              const id = res;
              if (rest || !id) {
                this.resetForm(formName);
              } else {
                if (this.form.id) {
                  this.getDetailData();
                } else {
                  this.$router.push({
                    path: '/maintain/sp/serviceProxy/edit',
                    query: {
                      id
                    }
                  });
                }
              }
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
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
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
<style lang="scss" scoped>
.page-common-edit .common-title {
  position: sticky;
  top: 48px;
}
</style>
