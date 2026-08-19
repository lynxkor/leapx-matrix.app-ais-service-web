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
        :showEditBtn = "canEdit"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
        </template>
        <template #extraButtons>
          <el-button size="small" v-if="canSubmitApproval" :loading="submitApprovalLoading" @click="handleSubmitApproval()">提交审批</el-button>
          <el-button size="small" v-if="canApproval" @click="clickApproval()">审批</el-button>
        </template>
        <template v-if="_id">
          <h5>
          <span>状态：{{ form.orderStatusLabel || '-' }}</span>
          <i> | </i>
          <span>报告创建时间：{{ form.createTime || '-' }}</span>
        </h5>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <section class="common-section">
                <div class="common-section-header">
                  <h3>报告主题</h3>
                </div>
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="报告类型：" prop="reportType">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="QualityReportTypeEnum"
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
                  <el-form-item label="问题重要度：" prop="problemImportance">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="QualityReportImportanceEnum"
                      v-model="form.problemImportance"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="车辆是否修复：" prop="carIsVehicle">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.carIsVehicle"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="问题是否解决：" prop="isQuestionOk">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.isQuestionOk"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="质量反馈单号：" prop="code">
                    {{ form.code }}
                  </el-form-item>
                  <el-form-item label="报告类型：" prop="reportType">
                    {{ form.reportTypeLabel }}
                  </el-form-item>
                  <el-form-item label="问题重要度：" prop="problemImportance">
                    {{ form.problemImportanceLabel }}
                  </el-form-item>
                  <el-form-item label="故障主题：" prop="title">
                    {{ form.title }}
                  </el-form-item>
                  <el-form-item label="车辆是否修复：" prop="carIsVehicle">
                    {{ form.carIsVehicleLabel }}
                  </el-form-item>
                  <el-form-item label="问题是否解决：" prop="isQuestionOk">
                    {{ form.isQuestionOkLabel }}
                  </el-form-item>
                  <el-form-item label="创建时间：" prop="createTime">
                    {{ form.createTime }}
                  </el-form-item>
                </el-form>
                <div class="common-section-header">
                  <h3>质量反馈</h3>
                </div>
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="接车施工单：" prop="serviceProxyCode">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="form.serviceProxyCode"
                      :remote-method="serviceProxySearch"
                      :params="form.serviceProxyCode"
                      @change="handleServiceProxyChange"
                      value-key="id"
                      label-key="code"
                      placeholder="请输入施工单号"
                    />
                  </el-form-item>
                  <el-form-item label="VIN码：" prop="vehProfileVin">
                    <LPEncrypted
                      :value.sync="form.vehProfileVin"
                      :decryptMethod="() => getDecryptField(form.serviceProxyId, 'vehProfileVin')"
                    >
                      <fetch-select
                        filterable
                        clearable
                        remote
                        reserve-keyword
                        v-model="form.vehProfileVin"
                        :remote-method="searchVehicle"
                        @change="handleVinChange"
                        :disabled="vinDisabled"
                        value-key="vin"
                        label-key="vin"
                      />
                    </LPEncrypted>
                  </el-form-item>
                  <el-form-item label="基本车型：" prop="vehModelName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.vehModelName"
                      clearable
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="里程数（KM)：" prop="mileage">
                    <el-input
                      placeholder="请输入"
                      v-model="form.mileage"
                      clearable
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="电池序列号：" prop="powerBatteryNumber">
                    <el-input
                      placeholder="请输入"
                      v-model="form.powerBatteryNumber"
                      clearable
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="电机序列号：" prop="motorSerialNumber">
                    <el-input
                      placeholder="请输入"
                      v-model="form.motorSerialNumber"
                      clearable
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="VRT名称：" prop="vrtName">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="form.vrtName"
                      :remote-method="listVrt"
                      @change="handleVrtChange"
                      value-key="id"
                      label-key="name"
                    />
                  </el-form-item>
                  <el-form-item label="VFG名称：" prop="vfgName">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="form.vfgName"
                      :remote-method="listVfg"
                      @change="handleVfgChange"
                      value-key="id"
                      label-key="name"
                      :disabled="vfgDisabled"
                    />
                  </el-form-item>
                  <el-form-item label="CCC名称：" prop="cccName">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="form.cccName"
                      :remote-method="listCcc"
                      @change="handleCccChange"
                      value-key="id"
                      label-key="cccName"
                      :disabled="cccDisabled"
                    />
                  </el-form-item>
                  <el-form-item label="主因零部件：" prop="causePartId">
                    <fetch-select
                      placeholder="搜索维修零件代码、名称"
                      remote
                      reserve-keyword
                      v-model="form.causePartName"
                      :remote-method="listSparePart"
                      @change="handleSparePartChange"
                      value-key="partCode"
                      label-key="partName"
                    />
                  </el-form-item>
                  <el-form-item label="供应商：" prop="supplierName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.supplierName"
                      clearable
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="销售日期：" prop="salesDate">
                    <el-input
                      placeholder="请输入"
                      v-model="form.salesDate"
                      clearable
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="维修时间：" prop="repairDate">
                    <el-date-picker
                      type="datetime"
                      v-model="form.repairDate"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      align="right"
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="接车施工单：" prop="serviceProxyCode">
                    <el-link type="success" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.serviceProxyId}`" target="_blank">{{ form.serviceProxyCode }}</el-link>
                  </el-form-item>
                  <el-form-item label="VIN码：" prop="vehProfileVin">
                    <LPEncrypted
                      :value.sync="form.vehProfileVin"
                      :decryptMethod="() => getDecryptField(form.serviceProxyId, 'vehProfileVin')"
                    >
                      <el-link type="success" :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${form.vehProfileId}`" target="_blank">{{ form.vehProfileVin }}</el-link>
                    </LPEncrypted>
                  </el-form-item>
                  <el-form-item label="基本车型：" prop="vehModelName">
                    <el-link type="success" :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.vehModelId}`" target="_blank">{{ form.vehModelName }}</el-link>
                  </el-form-item>
                  <el-form-item label="里程数（KM)：" prop="mileage">
                    {{ form.mileage }}
                  </el-form-item>
                  <el-form-item label="电池序列号：" prop="powerBatteryNumber">
                    {{ form.powerBatteryNumber }}
                  </el-form-item>
                  <el-form-item label="电机序列号：" prop="motorSerialNumber">
                    {{ form.motorSerialNumber }}
                  </el-form-item>
                  <el-form-item label="VRT名称：" prop="vrtName">
                    {{ form.vrtName }}
                  </el-form-item>
                  <el-form-item label="VFG名称：" prop="vfgName">
                    {{ form.vfgName }}
                  </el-form-item>
                  <el-form-item label="CCC名称：" prop="cccName">
                    {{ form.cccName }}
                  </el-form-item>
                  <el-form-item label="主因零部件：" prop="causePartName">
                    {{ form.causePartName }}
                  </el-form-item>
                  <el-form-item label="供应商：" prop="supplierName">
                    {{ form.supplierName }}
                  </el-form-item>
                  <el-form-item label="销售日期：" prop="salesDate">
                    {{ form.salesDate }}
                  </el-form-item>
                  <el-form-item label="维修时间：" prop="repairDate">
                    {{ form.repairDate }}
                  </el-form-item>
                </el-form>
                <div class="common-section-header">
                  <h3>主因零部件</h3>
                </div>
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm3" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="零件编码：" prop="causePartCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.causePartCode"
                      clearable
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="零件名称：" prop="causePartName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.causePartName"
                      clearable
                      disabled
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="零件编码：" prop="causePartCode">
                    <el-link type="success" :href="`/service/sparepart/basic/sparePart/edit?id=${form.causePartId}`" target="_blank">{{ form.causePartCode }}</el-link>
                  </el-form-item>
                  <el-form-item label="零件名称：" prop="causePartName">
                    {{ form.causePartName }}
                  </el-form-item>
                </el-form>
                <div class="common-section-header">
                  <h3>服务中心</h3>
                </div>
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm4" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="服务中心代码：" prop="serviceCenterCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.serviceCenterCode"
                      clearable
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="服务中心名称：" prop="serviceCenterName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.serviceCenterName"
                      clearable
                      disabled
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
                      maxlength="11"
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="服务中心名称：" prop="serviceCenterName">
                    <el-link type="success" :href="`/datacenter/store/store/detail?storeCode=${form.serviceCenterCode}`" target="_blank">{{ form.serviceCenterName }}</el-link>
                  </el-form-item>
                  <el-form-item label="服务中心代码：" prop="serviceCenterCode">
                    {{ form.serviceCenterCode }}
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
                </el-form>
                <div class="common-section-header">
                  <h3>参数选择</h3>
                </div>
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm5" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="温度（℃）：" prop="malfunctions">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="QualityReportTemperatureEnum"
                      v-model="form.malfunctions"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="车速（km/h)：" prop="vehicleSpeeds">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="QualityReportSpeedEnum"
                      v-model="form.vehicleSpeeds"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="频次：" prop="malfunctionFrequency">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="QualityReportMalfunctionFrequencyEnum"
                      v-model="form.malfunctionFrequency"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="能否行驶：" prop="ifDrive">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.ifDrive"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="是否再现：" prop="isPresent">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.isPresent"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="运行模式：" prop="operatingModes">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="QualityReportOperatingModesEnum"
                      v-model="form.operatingModes"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="车辆工况：" prop="vehicleConditions">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="QualityReportVehicleConditionEnum"
                      v-model="form.vehicleConditions"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="环境：" prop="malfunctionLocations">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="QualityReportMalfunctionLocationsEnum"
                      v-model="form.malfunctionLocations"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="是否改装：" prop="isModifiedParts">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.isModifiedParts"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="说明：" prop="replacedParts">
                    <el-input
                      placeholder="请输入"
                      v-model="form.replacedParts"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="是否有DTC：" prop="ifHaveDtc">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="BooleanEnum"
                      v-model="form.ifHaveDtc"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="加装描述：" prop="modifiedPartsContent">
                    <el-input
                      placeholder="请输入"
                      v-model="form.modifiedPartsContent"
                      clearable
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="温度（℃）：" prop="malfunctions">
                    {{ form.malfunctionsLabel }}
                  </el-form-item>
                  <el-form-item label="车速（km/h)：" prop="vehicleSpeeds">
                    {{ form.vehicleSpeedsLabel }}
                  </el-form-item>
                  <el-form-item label="频次：" prop="malfunctionFrequency">
                    {{ form.malfunctionFrequencyLabel }}
                  </el-form-item>
                  <el-form-item label="能否行驶：" prop="ifDrive">
                    {{ form.ifDriveLabel }}
                  </el-form-item>
                  <el-form-item label="是否再现：" prop="isPresent">
                    {{ form.isPresentLabel }}
                  </el-form-item>
                  <el-form-item label="运行模式：" prop="operatingModes">
                    {{ form.operatingModesLabel }}
                  </el-form-item>
                  <el-form-item label="车辆工况：" prop="vehicleConditions">
                    {{ form.vehicleConditionsLabel }}
                  </el-form-item>
                  <el-form-item label="环境：" prop="malfunctionLocations">
                    {{ form.malfunctionLocationsLabel }}
                  </el-form-item>
                  <el-form-item label="是否改装：" prop="isModifiedParts">
                    {{ form.isModifiedPartsLabel }}
                  </el-form-item>
                  <el-form-item label="说明：" prop="replacedParts">
                    {{ form.replacedParts }}
                  </el-form-item>
                  <el-form-item label="加装描述：" prop="modifiedPartsContent">
                    {{ form.modifiedPartsContent }}
                  </el-form-item>
                  <el-form-item label="是否有DTC：" prop="ifHaveDtc">
                    {{ form.ifHaveDtcLabel }}
                  </el-form-item>
                </el-form>
                <div class="common-section-header" v-show="!(isEditing || !_id)">
                  <h3>审核信息</h3>
                </div>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="提交审核时间：" prop="applicationTime">
                    {{ form.applicationTime }}
                  </el-form-item>
                  <el-form-item label="首次提交审核时间：" prop="firstApplicationTime">
                    {{ form.firstApplicationTime }}
                  </el-form-item>
                  <el-form-item label="首次审核人员名称：" prop="firstApproveName">
                    {{ form.firstApproveName }}
                  </el-form-item>
                  <el-form-item label="首次审核结果：" prop="firstAuditResults">
                    {{ form.firstAuditResultsLabel }}
                  </el-form-item>
                  <el-form-item label="首次审核说明：" prop="firstAudit">
                    {{ form.firstAudit }}
                  </el-form-item>
                </el-form>
              </section>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>问题详细描述</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm6" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="故障现象描述：" prop="customerContent" class="form-item-full">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.customerContent"
                    maxlength="500"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="故障排查流程：" prop="troubleshootingProcess" class="form-item-full">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.troubleshootingProcess"
                    maxlength="500"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="故障现象描述：" prop="customerContent" class="form-item-full">
                  {{ form.customerContent }}
                </el-form-item>
                <el-form-item label="故障排查流程：" prop="troubleshootingProcess" class="form-item-full">
                  {{ form.troubleshootingProcess }}
                </el-form-item>
                <el-form-item label="技术经理回复：" prop="technicalManagerResponse">
                  {{ form.technicalManagerResponse }}
                </el-form-item>
                <el-form-item label="主机厂工程师回复：" prop="replyFromEngineer">
                  {{ form.replyFromEngineer }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>故障代码</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header" v-show="canEdit">
                <el-button size="small" type="primary" plain @click="handleAddRow()">添加</el-button>
              </div>
              <div class="common-section-table">
                <edit-table
                  ref="editTableFault"
                  :columns="columnsFault"
                  :data="tableDataFault"
                  :defaultNewRow="defaultNewRowFault"
                  :show-toolbar="false"
                  :delTitle="delTitleFault"
                  :auth="{edit: canAddOrUpdate && canEdit, delete: canDelete && canEdit}"
                  :enableSingleRowSave="true"
                  @save-row-edit="saveRowEdit"
                  @remove-row="saveRowEdit"
                />
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>附件材料</h2>
            </div>
            <div class="common-section-body">
              <Attachment v-if="_id" :_id="_id" :show-upload="canEdit" ref="attachmentRef"/>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>审批记录</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="supportApprovalTableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="statusLabel" title="审批状态" width="25%" />
                  <vxe-column field="content" title="审批意见" width="25%" />
                  <vxe-column field="approver" title="操作人" width="25%" />
                  <vxe-column field="createTime" title="创建时间" width="25%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ supportApprovalEmptyText }}</div>
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
      <!-- 审批弹窗 -->
    <el-dialog
      title="质量反馈报告审批"
      :visible.sync="approvalDialogVisible"
      width="600px"
      @close="resetApprovalForm"
    >
      <el-form :model="approvalForm" :rules="approvalRules" ref="approvalForm" label-width="150px">
        <el-form-item label="审批结果：" prop="approvalResult">
          <fetch-select
            :request="fetchOptions"
            enumCode="QualityReportApprovalResultEnum"
            v-model="approvalForm.approvalResult"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>

        <el-form-item label="审批意见：" prop="approvalOpinion">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入审批意见"
            v-model="approvalForm.approvalOpinion"
          ></el-input>
        </el-form-item>

        <el-form-item label="技术经理回复：" prop="technicalManagerResponse">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入技术经理回复"
            v-model="approvalForm.technicalManagerResponse"
          ></el-input>
        </el-form-item>

        <el-form-item label="主机厂工程师回复：" prop="replyFromEngineer">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入主机厂工程师回复"
            v-model="approvalForm.replyFromEngineer"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="approvalDialogVisible = false" size="small">取消</el-button>
        <el-button type="primary" :loading="approvalLoading" @click="handleApproval" size="small">保存</el-button>
      </div>
    </el-dialog>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getServiceProxyList, submitApproval, approval } from '@/api/maintain/sp/qualityOrderReport/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditTable from '@/libs/components/EditTable';
import LPEncrypted from '@/libs/components/LPEncrypted';
import { getEnum, sparePartList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getVehicleProfile, checkVinTag, getCarInfo, getDecrypt } from '@/api/maintain/sp/serviceProxy/index';
import { vfglist } from '@/api/claimreturn/claim/basic/vfg';
import { vrtlist } from '@/api/claimreturn/claim/basic/vrt';
import { getList as ccclist } from '@/api/claimreturn/claim/basic/ccc';
import Attachment from '@/views/maintain/sp/serviceProxy/components/Attachment/index.vue';
import { loginUserGet } from '@/libs/api/common';
import api from '@/axios';

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
  carIsVehicle: 0,
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
  ifDrive: 0,
  ifHaveDtc: '',
  isModifiedParts: 0,
  isPresent: 0,
  isQuestionOk: 0,
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
  accountFlag: '',
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
    FetchSelect,
    EditTable,
    Attachment,
    LPEncrypted
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '质量反馈单号：' + this.form.code;
    },
    vinDisabled () {
      return !!this.form.serviceProxyCode;
    },
    vfgDisabled () {
      return !this.form.vrtId;
    },
    cccDisabled () {
      return !this.form.vfgId;
    },
    canEdit () {
      return this.form.orderStatus === 10 || this.form.orderStatus === 40;
    },
    canSubmitApproval () {
      return this.form.orderStatus === 10 || this.form.orderStatus === 40;
    },
    canApproval () {
      return !this.accountFlag && this.form.orderStatus === 20;
    },
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
      submitApprovalLoading: false,
      approvalLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      supportApprovalEmptyText: '暂无审批记录',
      delTitleFault: '此操作将删除此 故障代码信息，您无法撤消此操作，是否继续？',
      tableDataFault: [],
      supportApprovalTableData: [],
      columnsFault: [
        {
          field: 'controller',
          title: '控制器',
          width: '30%',
          editable: this.isEditing || !this.id,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '控制器不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'code',
          title: 'DTC代码',
          width: '30%',
          editable: this.isEditing || !this.id,
          editRender: { name: 'ElInput' },
        },
        {
          field: 'description',
          title: 'DTC描述',
          width: '30%',
          editable: this.isEditing || !this.id,
          editRender: { name: 'ElInput' }
        }
      ],
      defaultNewRowFault: {
        controller: '',
        code: '',
        description: '',
      },
      rules: {
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
          { required: true, message: '请输入报告人电话', trigger: 'change' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        vehProfileVin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        vehModelName: [
          { required: true, message: '请输入基本车型', trigger: 'change' }
        ],
        mileage: [
          { required: true, message: '请输入里程数（KM)', trigger: 'change' }
        ],
        salesDate: [
          { required: false, message: '请选择销售日期', trigger: 'change' }
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
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
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
        isQuestionOk: [
          { required: true, message: '请输入问题是否解决', trigger: 'change' }
        ],
        replacedParts: [
          { required: true, message: '请输入说明', trigger: 'change' }
        ],
        motorSpeed: [
          { required: true, message: '请输入电机转速', trigger: 'change' }
        ],
        problemImportance: [
          { required: true, message: '请输入问题重要度', trigger: 'change' }
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
      accountFlag: false,
      approvalDialogVisible: false,
      approvalForm: {
        approvalResult: '',
        approvalOpinion: '',
        technicalManagerResponse: '',
        replyFromEngineer: ''
      },
      approvalRules: {
        approvalResult: [
          { required: true, message: '请选择审批结果', trigger: 'change' }
        ],
        approvalOpinion: [
          { required: true, message: '请输入审批意见', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    loginUserGet().then(res => {
      this.accountFlag = res.accountFlag;
    });
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return new Promise(resolve => {
          getDetail(id).then(res => {
            this.tableDataFault = res.qualityOrderReportFaultRespList || [];
            this.supportApprovalTableData = res.supportApprovalRespList || [];
            resolve(res);
          });
        });
      }
    },
    async submitRequest () {
      const tableDataFault = await this.handleSaveTableFault();
      return addOrUpdate({ ...this.form, qualityOrderReportFaultList: tableDataFault });
    },
    // 行保存
    async saveRowEdit (row, defer) {
      const tableDataFault = await this.handleSaveTableFault();
      addOrUpdate({ ...this.form, qualityOrderReportFaultList: tableDataFault }).then(res => {
        this.$refs.containerRef?.loadDetail();
        // defer.resolve(res);
        this.$message.success('更新成功');
      }).catch(e => {
        defer.reject();
      });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
        serviceCenterId: userInfo.orgPostUserList.find(item => item.position === '1')?.orgId,
        serviceCenterCode: userInfo.orgPostUserList.find(item => item.position === '1')?.orgCode,
        serviceCenterName: userInfo.orgPostUserList.find(item => item.position === '1')?.orgName,
        ownerOrgId: userInfo.orgPostUserList.find(item => item.position === '1')?.orgId,
        dealerCode: userInfo.orgPostUserList.find(item => item.position === '1')?.orgCode,
        dealerName: userInfo.orgPostUserList.find(item => item.position === '1')?.orgName,
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
    },
    async serviceProxySearch (query) {
      if (!query) {
        return [];
      }
      const res = await getServiceProxyList(query);
      return res || [];
    },
    // 项目维修代码
    handleServiceProxyChange (val, record) {
      if (record.createTime) {
        const createTime = new Date(record.createTime);
        const now = new Date();
        // 计算两个日期的月份差
        const monthDiff = (now.getFullYear() - createTime.getFullYear()) * 12 + (now.getMonth() - createTime.getMonth());

        // 如果月份差大于等于2，或者虽然月份差小于2但具体天数导致实际超过2个月（更精确的判断）
        // 这里使用简单的时间戳比较：2个月约为 60天 (30*2) 或更精确的日期计算
        // 更严谨的做法是设置一个2个月前的时间点进行比较
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        if (createTime < twoMonthsAgo) {
          this.$message({
            type: 'error',
            message: '施工单开单时间超过2个月，不能创建!'
          });
          // 清空已选择的施工单相关数据，防止用户继续操作
          this.form.serviceProxyCode = '';
          this.form.serviceProxyId = '';
          return;
        }
      }

      if (record) {
        this.form.serviceProxyId = record.id;
        this.form.serviceProxyCode = record.code;
        this.form.vehProfileVin = record.vehProfileVin;
        this.form.vehProfileId = record.vehProfileId;
        this.form.vehModelName = record.vehModelName;
        this.form.vehModelId = record.vehModelId;
        this.form.mileage = record.mileage;
        this.form.powerBatteryNumber = record.batterySerialNumber;
        this.form.motorSerialNumber = record.motorSerialNumber;
        this.form.salesDate = record.saleDate;
        this.form.repairDate = record.finishAt;
      }
    },
    searchVehicle (query) {
      if (!query) {
        return Promise.resolve([]);
      }
      return getVehicleProfile({ searchVin: query });
    },
    handleVinChange (val, record) {
      if (record.vin) {
        this.form.vehProfileVin = record.vin;
        this.form.vehProfileId = record.id;
        this.form.vehModelName = record.vehicleModelName;
        this.form.vehModelId = record.vehicleModelId;
        this.form.mileage = record.mileage;
        this.form.powerBatteryNumber = record.batterySerialNumber;
        this.form.motorSerialNumber = record.motorSerialNumber;
        this.form.salesDate = record.salesDate;
        this.getNetworkCarInfo();
      }
    },
    getNetworkCarInfo () {
      getCarInfo(this.form.vehProfileVin).then(res => {
        this.form.mileage = res.mileage;
      });
    },
    listVrt (query) {
      return vrtlist({ vrtNameLike: query });
    },
    handleVrtChange (val, record) {
      if (record) {
        this.form.vrtId = record.id;
        this.form.vrtName = record.name;
      }
    },
    listVfg (query) {
      return vfglist({ vfgNameLike: query, vrtId: this.form.vrtId });
    },
    handleVfgChange (val, record) {
      if (record) {
        this.form.vfgId = record.id;
        this.form.vfgName = record.name;
      }
    },
    listCcc (query) {
      return ccclist({ cccNameLike: query, vfgId: this.form.vfgId });
    },
    handleCccChange (val, record) {
      if (record) {
        this.form.cccId = record.id;
        this.form.cccName = record.cccName;
      }
    },
    // 零件信息模糊搜索方法
    async listSparePart (queryString) {
      return sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 50 });
    },
    handleSparePartChange (val, record) {
      if (record) {
        this.form.causePartId = record.id;
        this.form.causePartName = record.partName;
        this.form.causePartCode = record.partCode;
        this.getSparePartSupplier({ sparePartId: record.id }).then(res => {
          console.log(res.records);
          if (res.records && Array.isArray(res.records) && res.records.length > 0) {
            const sortedList = res.records.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            console.log(sortedList[0]);
            this.form.supplierId = sortedList[0].supplierInfoId;
            this.form.supplierName = sortedList[0].supplierName;
          }
        });
      }
    },
    getSparePartSupplier (data) {
      return api.jsonPost('/sp/web/basic/sparePartSupplier/page', data);
    },
    handleAddRow (val) {
      // 通过引用直接调用子组件方法
      this.$refs.editTableFault.addRow();
    },
    handleSaveTableFault (data) {
      if (!this._id) {
        return [];
      }
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTableFault.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 打开上传附件对话框
    // 上传成功后刷新列表
    handleUploadRefresh () {
      this.$refs.attachmentRef?.loadAttachmentList();
    },
    handleSubmitApproval () {
      this.$confirm('确定提交审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitApprovalLoading = true;
        submitApproval(this._id).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.$refs.containerRef?.loadDetail();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
        }).finally(() => {
          this.submitApprovalLoading = false;
        });
      }).catch(() => {});
    },
    clickApproval () {
      this.approvalDialogVisible = true;
      // 可选：初始化表单数据
      this.resetApprovalForm();
    },
    resetApprovalForm () {
      this.approvalForm = {
        approvalResult: '',
        approvalOpinion: '',
        technicalManagerResponse: '',
        replyFromEngineer: ''
      };
    },

    handleApproval () {
      this.$refs.approvalForm.validate(valid => {
        if (valid) {
          const params = {
            id: this._id,
            approvalResult: this.approvalForm.approvalResult,
            approvalOpinion: this.approvalForm.approvalOpinion,
            technicalManagerResponse: this.approvalForm.technicalManagerResponse,
            replyFromEngineer: this.approvalForm.replyFromEngineer
          };

          this.approvalLoading = true;
          approval(params).then(res => {
            this.$message.success('审批成功！');
            this.approvalDialogVisible = false;
            // this.detailRequest(); // 刷新详情页数据
            this.$refs.containerRef?.loadDetail();
          }).catch(() => {
            this.$message.error('审批失败！');
          }).finally(() => {
            this.approvalLoading = false;
          });
        }
      });
    },
    getDecryptField (id, field) {
      return getDecrypt(id, field);
    },
  }
};
</script>
<style scoped lang="scss">
.common-section-header h3 {
  font-size: 14px;
}
.btn-delete {
  color: var(--leap-color-danger);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: var(--leap-color-danger-dark-1);
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
.m-vxe-table-empty-text {
  text-align: left;
}
::v-deep .vxe-table--empty-content {
  color: var(--leap-color-default-light-2);
  width: 100%;
  padding: 0 16px;
}
h5 {
  color: var(--leap-color-default-light-1);
  font-size: 12px;
  font-weight: normal;
  margin-top: 8px;
  padding-left: 16px;
}
h5 i {
    margin: 0 5px;
    font-style: normal;
}
</style>
