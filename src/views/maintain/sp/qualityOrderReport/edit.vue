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
              <section class="common-section">
                <div class="common-section-header">
                  <h3>报告主题</h3>
                </div>
                <div class="common-section-body">
                  <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                      {{ form.reportType }}
                    </el-form-item>
                    <el-form-item label="问题重要度：" prop="problemImportance">
                      {{ form.problemImportance }}
                    </el-form-item>
                    <el-form-item label="故障主题：" prop="title">
                      {{ form.title }}
                    </el-form-item>
                    <el-form-item label="车辆是否修复：" prop="carIsVehicle">
                      {{ form.carIsVehicle }}
                    </el-form-item>
                    <el-form-item label="问题是否解决：" prop="isQuestionOk">
                      {{ form.isQuestionOk }}
                    </el-form-item>
                    <el-form-item label="创建时间：" prop="createTime">
                      {{ form.createTime }}
                    </el-form-item>
                  </el-form>
                </div>
                <div class="common-section-header">
                  <h3>质量反馈</h3>
                </div>
                <div class="common-section-body">
                  <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                    <el-form-item label="动力电池号：" prop="powerBatteryNumber">
                      <el-input
                        placeholder="请输入"
                        v-model="form.powerBatteryNumber"
                        clearable
                        disabled
                      />
                    </el-form-item>
                    <el-form-item label="驱动电机号：" prop="motorSerialNumber">
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
                        v-model="form.repairDate"
                        range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="right"
                      />
                    </el-form-item>
                  </el-form>
                  <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                    <el-form-item label="接车施工单：" prop="serviceProxyCode">
                      {{ form.serviceProxyCode }}
                    </el-form-item>
                    <el-form-item label="VIN码：" prop="vehProfileVin">
                      {{ form.vehProfileVin }}
                    </el-form-item>
                    <el-form-item label="基本车型：" prop="vehModelName">
                      {{ form.vehModelName }}
                    </el-form-item>
                    <el-form-item label="里程数（KM)：" prop="mileage">
                      {{ form.mileage }}
                    </el-form-item>
                    <el-form-item label="动力电池号：" prop="powerBatteryNumber">
                      {{ form.powerBatteryNumber }}
                    </el-form-item>
                    <el-form-item label="驱动电机号：" prop="motorSerialNumber">
                      {{ form.motorSerialNumber }}
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
                    <el-form-item label="主因零部件：" prop="causePartName">
                      {{ form.causePartName }}
                    </el-form-item>
                    <el-form-item label="供应商：" prop="supplierId">
                      {{ form.supplierId }}
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
                </div>
                <div class="common-section-header">
                  <h3>主因零部件</h3>
                </div>
                <div class="common-section-body">
                  <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                    <el-form-item label="零件编码：" prop="causePartCode">
                      <el-input
                        placeholder="请输入"
                        v-model="form.causePartCode"
                        clearable
                        disabled
                      />
                    </el-form-item>
                    <el-form-item label="零件编码：" prop="causePartName">
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
                      {{ form.causePartCode }}
                    </el-form-item>
                    <el-form-item label="零件名称：" prop="causePartName">
                      {{ form.causePartName }}
                    </el-form-item>
                  </el-form>
                </div>
                <div class="common-section-header">
                  <h3>服务中心</h3>
                </div>
                <div class="common-section-body">
                  <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                      />
                    </el-form-item>
                  </el-form>
                  <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
                  </el-form>
                </div>
                <div class="common-section-header">
                  <h3>参数选择</h3>
                </div>
                <div class="common-section-body">
                  <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                    <el-form-item label="有无DTC：" prop="ifHaveDtc">
                      <el-input
                        placeholder="请输入"
                        v-model="form.ifHaveDtc"
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
                  </el-form>
                  <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                    <el-form-item label="温度（℃）：" prop="malfunctions">
                      {{ form.malfunctions }}
                    </el-form-item>
                    <el-form-item label="车速（km/h)：" prop="vehicleSpeeds">
                      {{ form.vehicleSpeeds }}
                    </el-form-item>
                    <el-form-item label="频次：" prop="malfunctionFrequency">
                      {{ form.malfunctionFrequency }}
                    </el-form-item>
                    <el-form-item label="能否行驶：" prop="ifDrive">
                      {{ form.ifDrive }}
                    </el-form-item>
                    <el-form-item label="是否再现：" prop="isPresent">
                      {{ form.isPresent }}
                    </el-form-item>
                    <el-form-item label="运行模式：" prop="operatingModes">
                      {{ form.operatingModes }}
                    </el-form-item>
                    <el-form-item label="车辆工况：" prop="vehicleConditions">
                      {{ form.vehicleConditions }}
                    </el-form-item>
                    <el-form-item label="环境：" prop="malfunctionLocations">
                      {{ form.malfunctionLocations }}
                    </el-form-item>
                    <el-form-item label="是否改装：" prop="isModifiedParts">
                      {{ form.isModifiedParts }}
                    </el-form-item>
                    <el-form-item label="说明：" prop="replacedParts">
                      {{ form.replacedParts }}
                    </el-form-item>
                    <el-form-item label="加装描述：" prop="modifiedPartsContent">
                      {{ form.modifiedPartsContent }}
                    </el-form-item>
                    <el-form-item label="有无DTC：" prop="ifHaveDtc">
                      {{ form.ifHaveDtc }}
                    </el-form-item>
                  </el-form>
                </div>
                <div class="common-section-header" v-show="!(isEditing || !_id)">
                  <h3>审核信息</h3>
                </div>
                <div class="common-section-body">
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
                      {{ form.firstAuditResults }}
                    </el-form-item>
                    <el-form-item label="首次审核说明：" prop="firstAudit">
                      {{ form.firstAudit }}
                    </el-form-item>
                  </el-form>
                </div>
              </section>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>问题详细描述</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="故障现象：" prop="faultPhenomena">
                  <el-input
                    placeholder="请输入"
                    v-model="form.faultPhenomena"
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
                <el-form-item label="故障检查过程：" prop="diagnosisContent">
                  <el-input
                    placeholder="请输入"
                    v-model="form.diagnosisContent"
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
                <el-form-item label="技术经理回复：" prop="technicalManagerResponse">
                  <el-input
                    placeholder="请输入"
                    v-model="form.technicalManagerResponse"
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="故障检查过程：" prop="diagnosisContent">
                  {{ form.diagnosisContent }}
                </el-form-item>
                <el-form-item label="故障现象：" prop="faultPhenomena">
                  {{ form.faultPhenomena }}
                </el-form-item>
                <el-form-item label="技术经理回复：" prop="technicalManagerResponse">
                  {{ form.technicalManagerResponse }}
                </el-form-item>
                <el-form-item label="故障排查流程：" prop="troubleshootingProcess">
                  {{ form.troubleshootingProcess }}
                </el-form-item>
                <el-form-item label="主机厂工程师回复：" prop="replyFromEngineer">
                  {{ form.replyFromEngineer }}
                </el-form-item>
                <el-form-item label="故障现象描述：" prop="customerContent">
                  {{ form.customerContent }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>故障代码</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <el-button size="small" type="primary" @click="handleAddRow()">添加</el-button>
              </div>
              <div class="common-section-table">
                <edit-table
                  ref="editTableFault"
                  :columns="columnsFault"
                  :data="tableDataFault"
                  :defaultNewRow="defaultNewRowFault"
                  :show-toolbar="false"
                  :delTitle="delTitleFault"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                  :enableSingleRowSave="true"
                  @save-row-edit="saveRowEdit"
                />
              </div>
            </div>
          </section>
          <Attachment v-if="_id" :_id="_id" :show-upload="true" ref="attachmentRef"/>
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
import { getDetail, addOrUpdate, getServiceProxyList } from '@/api/maintain/sp/qualityOrderReport/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditTable from '@/libs/components/EditTable';
import { getEnum, sparePartList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getVehicleProfile, checkVinTag, getCarInfo } from '@/api/maintain/sp/serviceProxy/index';
import { vfglist } from '@/api/claimreturn/claim/basic/vfg';
import { vrtlist } from '@/api/claimreturn/claim/basic/vrt';
import { getList as ccclist } from '@/api/claimreturn/claim/basic/ccc';
import Attachment from '@/views/maintain/sp/serviceProxy/components/Attachment/index.vue';

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
    FetchSelect,
    EditTable,
    Attachment
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
      delTitleFault: '此操作将删除此 故障代码信息，您无法撤消此操作，是否继续？',
      tableDataFault: [],
      columnsFault: [
        {
          field: 'controller',
          title: '控制器',
          width: '30%',
          editable: this.isEditing || !this.id,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '车型不能为空', trigger: 'blur' }
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
        code: [
          { required: true, message: '请输入质量反馈单号', trigger: 'change' }
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
        // powerBatteryNumber: [
        //   { required: true, message: '请输入动力电池号', trigger: 'change' }
        // ],
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
          { required: true, message: '请输入车速（km/h)', trigger: 'change' }
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
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return new Promise(resolve => {
          getDetail(id).then(res => {
            this.tableDataFault = res.qualityOrderReportFaultRespList || [];
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
        defer.resolve(res);
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
        serviceCenterCode: userInfo.orgPostUserList.find(item => item.position === '1')?.orgCode,
        serviceCenterName: userInfo.orgPostUserList.find(item => item.position === '1')?.orgName
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
      console.log(record);
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
      }
    },
    handleAddRow (val) {
      // 通过引用直接调用子组件方法
      this.$refs.editTableFault.addRow();
    },
    handleSaveTableFault (data) {
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
    }
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
</style>
