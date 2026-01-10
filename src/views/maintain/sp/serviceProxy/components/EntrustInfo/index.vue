<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>委托信息</h2>
    </div>
    <div class="common-section-body">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
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
        <el-form-item label="上次进店里程数：" prop="lastMileage">
          <el-input
            placeholder="请输入"
            v-model="form.lastMileage"
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

        <el-form-item label="离店车联网里程数（增）：" prop="departureNetMileageExtend">
          <el-input
            placeholder="请输入"
            v-model="form.departureNetMileageExtend"
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

        <el-form-item label="专属服务门店编码：" prop="exclusiveServiceDealerCode">
          <el-input
            placeholder="请输入"
            v-model="form.exclusiveServiceDealerCode"
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
        <el-form-item label="工单状态：" prop="orderStatus">
          {{ form.orderStatus }}
        </el-form-item>
        <el-form-item label="保修类型（汇总）：" prop="warrantyTypeCollect">
          {{ form.warrantyTypeCollect }}
        </el-form-item>
        <el-form-item label="上次进店里程数：" prop="lastMileage">
          {{ form.lastMileage }}
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
        <el-form-item label="签字状态：" prop="signStatus">
          {{ form.signStatus }}
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
        <el-form-item label="整车档案id：" prop="vehProfileId">
          {{ form.vehProfileId }}
        </el-form-item>
        <el-form-item label="专属服务门店编码：" prop="exclusiveServiceDealerCode">
          {{ form.exclusiveServiceDealerCode }}
        </el-form-item>
        <el-form-item label="基本车型id：" prop="vehModelId">
          {{ form.vehModelId }}
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
