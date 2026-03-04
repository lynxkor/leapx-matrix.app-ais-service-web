<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="质量反馈单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="报告类型：" prop="reportType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.reportType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="故障主题：" prop="title">
                  <el-input
                    placeholder="请输入"
                    v-model="form.title"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="服务中心名称：" prop="serviceCenterName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceCenterName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="服务中心代码：" prop="serviceCenterCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceCenterCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="报告人：" prop="applicantId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applicantId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="报告人：" prop="applicantName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applicantName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="报告人职位：" prop="applicantPosition">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applicantPosition"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="报告人电话：" prop="applicantTel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.applicantTel"
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
                <el-form-item label="基本车型：" prop="vehModelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehModelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="动力电池号：" prop="powerBatteryNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.powerBatteryNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="驱动电机号：" prop="motorSerialNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.motorSerialNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="里程数（KM)：" prop="mileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mileage"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售日期：" prop="salesDate">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.salesDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="维修时间：" prop="repairDate">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.repairDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="主因零部件id：" prop="causePartId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.causePartId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="主因零部件：" prop="causePartName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.causePartName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="供应商：" prop="supplierId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="供应商：" prop="supplierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VFG名称：" prop="vrtName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vrtName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VFG名称：" prop="vfgName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vfgName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="CCC名称：" prop="cccName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cccName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="首次提交审核时间：" prop="firstApplicationTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.firstApplicationTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="首次审核结果：" prop="firstAuditResults">
                  <el-input
                    placeholder="请输入"
                    v-model="form.firstAuditResults"
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
                <el-form-item label="提交审核时间：" prop="applicationTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.applicationTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
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
                <el-form-item label="车辆是否修复：" prop="carIsVehicle">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carIsVehicle"
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
                <el-form-item label="备注：" prop="comments">
                  <el-input
                    placeholder="请输入"
                    v-model="form.comments"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="故障现象描述：" prop="customerContent">
                  <el-input
                    placeholder="请输入"
                    v-model="form.customerContent"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="制造日期：" prop="dateOfManufactures">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dateOfManufactures"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
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
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="故障检查过程：" prop="diagnosisContent">
                  <el-input
                    placeholder="请输入"
                    v-model="form.diagnosisContent"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="故障现象：" prop="faultPhenomena">
                  <el-input
                    placeholder="请输入"
                    v-model="form.faultPhenomena"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="反馈日期：" prop="feedbackDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.feedbackDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="能否行驶：" prop="ifDrive">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ifDrive"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="有无DTC：" prop="ifHaveDtc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ifHaveDtc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否改装：" prop="isModifiedParts">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isModifiedParts"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否再现：" prop="isPresent">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isPresent"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="问题是否解决：" prop="isQuestionOk">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isQuestionOk"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="频次：" prop="malfunctionFrequency">
                  <el-input
                    placeholder="请输入"
                    v-model="form.malfunctionFrequency"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="环境：" prop="malfunctionLocations">
                  <el-input
                    placeholder="请输入"
                    v-model="form.malfunctionLocations"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="温度（℃）：" prop="malfunctions">
                  <el-input
                    placeholder="请输入"
                    v-model="form.malfunctions"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="加装描述：" prop="modifiedPartsContent">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifiedPartsContent"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="电池容量：" prop="motorModel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.motorModel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="电机转速：" prop="motorSpeed">
                  <el-input
                    placeholder="请输入"
                    v-model="form.motorSpeed"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="运行模式：" prop="operatingModes">
                  <el-input
                    placeholder="请输入"
                    v-model="form.operatingModes"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="问题重要度：" prop="problemImportance">
                  <el-input
                    placeholder="请输入"
                    v-model="form.problemImportance"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="说明：" prop="replacedParts">
                  <el-input
                    placeholder="请输入"
                    v-model="form.replacedParts"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="主机厂工程师回复：" prop="replyFromEngineer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.replyFromEngineer"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="服务中心id：" prop="serviceCenterId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceCenterId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="接车施工单id：" prop="serviceProxyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="技术经理回复：" prop="technicalManagerResponse">
                  <el-input
                    placeholder="请输入"
                    v-model="form.technicalManagerResponse"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="故障排查流程：" prop="troubleshootingProcess">
                  <el-input
                    placeholder="请输入"
                    v-model="form.troubleshootingProcess"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆工况：" prop="vehicleConditions">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleConditions"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车速（km&#x2F;h)：" prop="vehicleSpeeds">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSpeeds"
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
                <el-form-item label="CCC主键：" prop="cccId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cccId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VFG主键：" prop="vfgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vfgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="VRT主键：" prop="vrtId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vrtId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="首次审核说明：" prop="firstAudit">
                  <el-input
                    placeholder="请输入"
                    v-model="form.firstAudit"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="首次审核人员名称：" prop="firstApproveName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.firstApproveName"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="质量反馈单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  {{ form.serviceProxyCode }}
                </el-form-item>
                <el-form-item label="报告类型：" prop="reportType">
                  {{ form.reportType }}
                </el-form-item>
                <el-form-item label="故障主题：" prop="title">
                  {{ form.title }}
                </el-form-item>
                <el-form-item label="状态：" prop="orderStatus">
                  {{ form.orderStatus }}
                </el-form-item>
                <el-form-item label="服务中心名称：" prop="serviceCenterName">
                  {{ form.serviceCenterName }}
                </el-form-item>
                <el-form-item label="服务中心代码：" prop="serviceCenterCode">
                  {{ form.serviceCenterCode }}
                </el-form-item>
                <el-form-item label="报告人：" prop="applicantId">
                  {{ form.applicantId }}
                </el-form-item>
                <el-form-item label="报告人：" prop="applicantName">
                  {{ form.applicantName }}
                </el-form-item>
                <el-form-item label="报告人职位：" prop="applicantPosition">
                  {{ form.applicantPosition }}
                </el-form-item>
                <el-form-item label="报告人电话：" prop="applicantTel">
                  {{ form.applicantTel }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  {{ form.vehProfileVin }}
                </el-form-item>
                <el-form-item label="基本车型：" prop="vehModelName">
                  {{ form.vehModelName }}
                </el-form-item>
                <el-form-item label="动力电池号：" prop="powerBatteryNumber">
                  {{ form.powerBatteryNumber }}
                </el-form-item>
                <el-form-item label="驱动电机号：" prop="motorSerialNumber">
                  {{ form.motorSerialNumber }}
                </el-form-item>
                <el-form-item label="里程数（KM)：" prop="mileage">
                  {{ form.mileage }}
                </el-form-item>
                <el-form-item label="销售日期：" prop="salesDate">
                  {{ form.salesDate }}
                </el-form-item>
                <el-form-item label="维修时间：" prop="repairDate">
                  {{ form.repairDate }}
                </el-form-item>
                <el-form-item label="主因零部件id：" prop="causePartId">
                  {{ form.causePartId }}
                </el-form-item>
                <el-form-item label="主因零部件：" prop="causePartName">
                  {{ form.causePartName }}
                </el-form-item>
                <el-form-item label="供应商：" prop="supplierId">
                  {{ form.supplierId }}
                </el-form-item>
                <el-form-item label="供应商：" prop="supplierName">
                  {{ form.supplierName }}
                </el-form-item>
                <el-form-item label="VFG名称：" prop="vrtName">
                  {{ form.vrtName }}
                </el-form-item>
                <el-form-item label="VFG名称：" prop="vfgName">
                  {{ form.vfgName }}
                </el-form-item>
                <el-form-item label="CCC名称：" prop="cccName">
                  {{ form.cccName }}
                </el-form-item>
                <el-form-item label="首次提交审核时间：" prop="firstApplicationTime">
                  {{ form.firstApplicationTime }}
                </el-form-item>
                <el-form-item label="首次审核结果：" prop="firstAuditResults">
                  {{ form.firstAuditResults }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="提交审核时间：" prop="applicationTime">
                  {{ form.applicationTime }}
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
                <el-form-item label="车辆是否修复：" prop="carIsVehicle">
                  {{ form.carIsVehicle }}
                </el-form-item>
                <el-form-item label="基本车型id：" prop="vehModelId">
                  {{ form.vehModelId }}
                </el-form-item>
                <el-form-item label="备注：" prop="comments">
                  {{ form.comments }}
                </el-form-item>
                <el-form-item label="故障现象描述：" prop="customerContent">
                  {{ form.customerContent }}
                </el-form-item>
                <el-form-item label="制造日期：" prop="dateOfManufactures">
                  {{ form.dateOfManufactures }}
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="故障检查过程：" prop="diagnosisContent">
                  {{ form.diagnosisContent }}
                </el-form-item>
                <el-form-item label="故障现象：" prop="faultPhenomena">
                  {{ form.faultPhenomena }}
                </el-form-item>
                <el-form-item label="反馈日期：" prop="feedbackDate">
                  {{ form.feedbackDate }}
                </el-form-item>
                <el-form-item label="能否行驶：" prop="ifDrive">
                  {{ form.ifDrive }}
                </el-form-item>
                <el-form-item label="有无DTC：" prop="ifHaveDtc">
                  {{ form.ifHaveDtc }}
                </el-form-item>
                <el-form-item label="是否改装：" prop="isModifiedParts">
                  {{ form.isModifiedParts }}
                </el-form-item>
                <el-form-item label="是否再现：" prop="isPresent">
                  {{ form.isPresent }}
                </el-form-item>
                <el-form-item label="问题是否解决：" prop="isQuestionOk">
                  {{ form.isQuestionOk }}
                </el-form-item>
                <el-form-item label="频次：" prop="malfunctionFrequency">
                  {{ form.malfunctionFrequency }}
                </el-form-item>
                <el-form-item label="环境：" prop="malfunctionLocations">
                  {{ form.malfunctionLocations }}
                </el-form-item>
                <el-form-item label="温度（℃）：" prop="malfunctions">
                  {{ form.malfunctions }}
                </el-form-item>
                <el-form-item label="加装描述：" prop="modifiedPartsContent">
                  {{ form.modifiedPartsContent }}
                </el-form-item>
                <el-form-item label="电池容量：" prop="motorModel">
                  {{ form.motorModel }}
                </el-form-item>
                <el-form-item label="电机转速：" prop="motorSpeed">
                  {{ form.motorSpeed }}
                </el-form-item>
                <el-form-item label="运行模式：" prop="operatingModes">
                  {{ form.operatingModes }}
                </el-form-item>
                <el-form-item label="问题重要度：" prop="problemImportance">
                  {{ form.problemImportance }}
                </el-form-item>
                <el-form-item label="说明：" prop="replacedParts">
                  {{ form.replacedParts }}
                </el-form-item>
                <el-form-item label="主机厂工程师回复：" prop="replyFromEngineer">
                  {{ form.replyFromEngineer }}
                </el-form-item>
                <el-form-item label="服务中心id：" prop="serviceCenterId">
                  {{ form.serviceCenterId }}
                </el-form-item>
                <el-form-item label="接车施工单id：" prop="serviceProxyId">
                  {{ form.serviceProxyId }}
                </el-form-item>
                <el-form-item label="技术经理回复：" prop="technicalManagerResponse">
                  {{ form.technicalManagerResponse }}
                </el-form-item>
                <el-form-item label="故障排查流程：" prop="troubleshootingProcess">
                  {{ form.troubleshootingProcess }}
                </el-form-item>
                <el-form-item label="车辆工况：" prop="vehicleConditions">
                  {{ form.vehicleConditions }}
                </el-form-item>
                <el-form-item label="车速（km&#x2F;h)：" prop="vehicleSpeeds">
                  {{ form.vehicleSpeeds }}
                </el-form-item>
                <el-form-item label="整车档案id：" prop="vehProfileId">
                  {{ form.vehProfileId }}
                </el-form-item>
                <el-form-item label="CCC主键：" prop="cccId">
                  {{ form.cccId }}
                </el-form-item>
                <el-form-item label="VFG主键：" prop="vfgId">
                  {{ form.vfgId }}
                </el-form-item>
                <el-form-item label="VRT主键：" prop="vrtId">
                  {{ form.vrtId }}
                </el-form-item>
                <el-form-item label="首次审核说明：" prop="firstAudit">
                  {{ form.firstAudit }}
                </el-form-item>
                <el-form-item label="首次审核人员名称：" prop="firstApproveName">
                  {{ form.firstApproveName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/sp/qualityOrderReport/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  serviceProxyCode: '',
  reportType: '',
  title: '',
  orderStatus: '',
  serviceCenterName: '',
  serviceCenterCode: '',
  applicantId: '',
  applicantName: '',
  applicantPosition: '',
  applicantTel: '',
  vehProfileVin: '',
  vehModelName: '',
  powerBatteryNumber: '',
  motorSerialNumber: '',
  mileage: '',
  salesDate: '',
  repairDate: '',
  causePartId: '',
  causePartName: '',
  supplierId: '',
  supplierName: '',
  vrtName: '',
  vfgName: '',
  cccName: '',
  firstApplicationTime: '',
  firstAuditResults: '',
  createTime: '',
  applicationTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  carIsVehicle: '',
  vehModelId: '',
  comments: '',
  customerContent: '',
  dateOfManufactures: '',
  ownerOrgId: '',
  dealerCode: '',
  dealerName: '',
  diagnosisContent: '',
  faultPhenomena: '',
  feedbackDate: '',
  ifDrive: '',
  ifHaveDtc: '',
  isModifiedParts: '',
  isPresent: '',
  isQuestionOk: '',
  malfunctionFrequency: '',
  malfunctionLocations: '',
  malfunctions: '',
  modifiedPartsContent: '',
  motorModel: '',
  motorSpeed: '',
  operatingModes: '',
  problemImportance: '',
  replacedParts: '',
  replyFromEngineer: '',
  serviceCenterId: '',
  serviceProxyId: '',
  technicalManagerResponse: '',
  troubleshootingProcess: '',
  vehicleConditions: '',
  vehicleSpeeds: '',
  vehProfileId: '',
  cccId: '',
  vfgId: '',
  vrtId: '',
  firstAudit: '',
  firstApproveName: '',
};

export default {
  name: 'qualityOrderReportEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '质量反馈单号：' + this.form.code;
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
      pageTitle: '质量反馈报告表管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-qualityOrderReport',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        code: [
          { required: true, message: '请输入质量反馈单号', trigger: 'change' }
        ],
        serviceProxyCode: [
          { required: true, message: '请输入接车施工单', trigger: 'change' }
        ],
        reportType: [
          { required: true, message: '请选择报告类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入故障主题', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        serviceCenterName: [
          { required: true, message: '请输入服务中心名称', trigger: 'change' }
        ],
        serviceCenterCode: [
          { required: true, message: '请输入服务中心代码', trigger: 'change' }
        ],
        applicantId: [
          { required: true, message: '请输入报告人', trigger: 'change' }
        ],
        applicantName: [
          { required: true, message: '请输入报告人', trigger: 'change' }
        ],
        applicantPosition: [
          { required: true, message: '请输入报告人职位', trigger: 'change' }
        ],
        applicantTel: [
          { required: true, message: '请输入报告人电话', trigger: 'change' }
        ],
        vehProfileVin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        vehModelName: [
          { required: true, message: '请输入基本车型', trigger: 'change' }
        ],
        powerBatteryNumber: [
          { required: true, message: '请输入动力电池号', trigger: 'change' }
        ],
        motorSerialNumber: [
          { required: true, message: '请输入驱动电机号', trigger: 'change' }
        ],
        mileage: [
          { required: true, message: '请输入里程数（KM)', trigger: 'change' }
        ],
        salesDate: [
          { required: true, message: '请选择销售日期', trigger: 'change' }
        ],
        repairDate: [
          { required: true, message: '请选择维修时间', trigger: 'change' }
        ],
        causePartId: [
          { required: true, message: '请输入主因零部件id', trigger: 'change' }
        ],
        causePartName: [
          { required: true, message: '请输入主因零部件', trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: '请输入供应商', trigger: 'change' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商', trigger: 'change' }
        ],
        vrtName: [
          { required: true, message: '请输入VFG名称', trigger: 'change' }
        ],
        vfgName: [
          { required: true, message: '请输入VFG名称', trigger: 'change' }
        ],
        cccName: [
          { required: true, message: '请输入CCC名称', trigger: 'change' }
        ],
        firstApplicationTime: [
          { required: true, message: '请选择首次提交审核时间', trigger: 'change' }
        ],
        firstAuditResults: [
          { required: true, message: '请输入首次审核结果', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        applicationTime: [
          { required: true, message: '请选择提交审核时间', trigger: 'change' }
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
        carIsVehicle: [
          { required: true, message: '请输入车辆是否修复', trigger: 'change' }
        ],
        vehModelId: [
          { required: true, message: '请输入基本车型id', trigger: 'change' }
        ],
        comments: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        customerContent: [
          { required: true, message: '请输入故障现象描述', trigger: 'change' }
        ],
        dateOfManufactures: [
          { required: true, message: '请输入制造日期', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        diagnosisContent: [
          { required: true, message: '请输入故障检查过程', trigger: 'change' }
        ],
        faultPhenomena: [
          { required: true, message: '请输入故障现象', trigger: 'change' }
        ],
        feedbackDate: [
          { required: true, message: '请输入反馈日期', trigger: 'change' }
        ],
        ifDrive: [
          { required: true, message: '请输入能否行驶', trigger: 'change' }
        ],
        ifHaveDtc: [
          { required: true, message: '请输入有无DTC', trigger: 'change' }
        ],
        isModifiedParts: [
          { required: true, message: '请输入是否改装', trigger: 'change' }
        ],
        isPresent: [
          { required: true, message: '请输入是否再现', trigger: 'change' }
        ],
        isQuestionOk: [
          { required: true, message: '请输入问题是否解决', trigger: 'change' }
        ],
        malfunctionFrequency: [
          { required: true, message: '请输入频次', trigger: 'change' }
        ],
        malfunctionLocations: [
          { required: true, message: '请输入环境', trigger: 'change' }
        ],
        malfunctions: [
          { required: true, message: '请输入温度（℃）', trigger: 'change' }
        ],
        modifiedPartsContent: [
          { required: true, message: '请输入加装描述', trigger: 'change' }
        ],
        motorModel: [
          { required: true, message: '请输入电池容量', trigger: 'change' }
        ],
        motorSpeed: [
          { required: true, message: '请输入电机转速', trigger: 'change' }
        ],
        operatingModes: [
          { required: true, message: '请输入运行模式', trigger: 'change' }
        ],
        problemImportance: [
          { required: true, message: '请输入问题重要度', trigger: 'change' }
        ],
        replacedParts: [
          { required: true, message: '请输入说明', trigger: 'change' }
        ],
        replyFromEngineer: [
          { required: true, message: '请输入主机厂工程师回复', trigger: 'change' }
        ],
        serviceCenterId: [
          { required: true, message: '请输入服务中心id', trigger: 'change' }
        ],
        serviceProxyId: [
          { required: true, message: '请输入接车施工单id', trigger: 'change' }
        ],
        technicalManagerResponse: [
          { required: true, message: '请输入技术经理回复', trigger: 'change' }
        ],
        troubleshootingProcess: [
          { required: true, message: '请输入故障排查流程', trigger: 'change' }
        ],
        vehicleConditions: [
          { required: true, message: '请输入车辆工况', trigger: 'change' }
        ],
        vehicleSpeeds: [
          { required: true, message: '请输入车速（km&#x2F;h)', trigger: 'change' }
        ],
        vehProfileId: [
          { required: true, message: '请输入整车档案id', trigger: 'change' }
        ],
        cccId: [
          { required: true, message: '请输入CCC主键', trigger: 'change' }
        ],
        vfgId: [
          { required: true, message: '请输入VFG主键', trigger: 'change' }
        ],
        vrtId: [
          { required: true, message: '请输入VRT主键', trigger: 'change' }
        ],
        firstAudit: [
          { required: true, message: '请输入首次审核说明', trigger: 'change' }
        ],
        firstApproveName: [
          { required: true, message: '请输入首次审核人员名称', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
