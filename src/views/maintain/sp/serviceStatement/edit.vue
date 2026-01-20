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
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="结算单号：" prop="code">
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
                <el-form-item label="结算单类型：" prop="statementType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="结算单状态：" prop="statementStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保修类型（汇总）：" prop="warrantyTypeCollect">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.warrantyTypeCollect"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销账标识：" prop="accountType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.accountType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehProfileVin"
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
                <el-form-item label="维修项目金额：" prop="repairItemAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项优惠金额：" prop="repairItemDiscount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemDiscount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项应付金额：" prop="repairItemPayableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemPayableAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件金额：" prop="partAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件优惠金额：" prop="partDiscount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partDiscount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件应付金额：" prop="partPayableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partPayableAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益金额：" prop="rightsAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rightsAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.discountAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="去零金额：" prop="noFractionAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.noFractionAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实际应付总金额：" prop="payableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payableAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="剩余应付款金额：" prop="remainAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remainAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下次保养里程：" prop="nextMaintenanceMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.nextMaintenanceMileage"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下次保养时间：" prop="nextMaintenanceTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.nextMaintenanceTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="是否已创建反结算申请：" prop="createReStatement">
                  <el-radio-group v-model="form.createReStatement">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否已生成保修单：" prop="createWarranty">
                  <el-radio-group v-model="form.createWarranty">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="结算人员：" prop="statementPersonName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementPersonName"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.statementTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementTime"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="收款人：" prop="payeeName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payeeName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收款时间：" prop="receiveTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.receiveTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
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
                <el-form-item label="是否已推送满意度：" prop="isPushVisitResult">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isPushVisitResult"
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
                <el-form-item label="整车档案id：" prop="vehProfileId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehProfileId"
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
                <el-form-item label="负责人：" prop="serviceOwnerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceOwnerId"
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
                <el-form-item label="签字完成时间：" prop="signCompletedTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.signCompletedTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="签字生成时间：" prop="signGeneratedTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.signGeneratedTime"
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
                <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.signUrlExpiredTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="结算人员id：" prop="statementPersonId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statementPersonId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="收款人id：" prop="payeeId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payeeId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保修单状态：" prop="claimStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.claimStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="满意度推送结果：" prop="satisfactionResult">
                  <el-input
                    placeholder="请输入"
                    v-model="form.satisfactionResult"
                    clearable
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
                <el-form-item label="结账记录：" prop="invoiceRecordResps">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invoiceRecordResps"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益核销记录：" prop="rightsUsageRecordResps">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rightsUsageRecordResps"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项目明细：" prop="repairItemResps">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemResps"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修零配件明细：" prop="partResps">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partResps"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件保养信息明细：" prop="partMaintenanceResps">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partMaintenanceResps"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="结算单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="结算单类型：" prop="statementType">
                  {{ form.statementType }}
                </el-form-item>
                <el-form-item label="结算单状态：" prop="statementStatus">
                  {{ form.statementStatus }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  {{ form.serviceProxyCode }}
                </el-form-item>
                <el-form-item label="保修类型（汇总）：" prop="warrantyTypeCollect">
                  {{ form.warrantyTypeCollect }}
                </el-form-item>
                <el-form-item label="销账标识：" prop="accountType">
                  {{ form.accountType }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  {{ form.vehProfileVin }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="维修项目金额：" prop="repairItemAmount">
                  {{ form.repairItemAmount }}
                </el-form-item>
                <el-form-item label="维修项优惠金额：" prop="repairItemDiscount">
                  {{ form.repairItemDiscount }}
                </el-form-item>
                <el-form-item label="维修项应付金额：" prop="repairItemPayableAmount">
                  {{ form.repairItemPayableAmount }}
                </el-form-item>
                <el-form-item label="零件金额：" prop="partAmount">
                  {{ form.partAmount }}
                </el-form-item>
                <el-form-item label="零件优惠金额：" prop="partDiscount">
                  {{ form.partDiscount }}
                </el-form-item>
                <el-form-item label="零件应付金额：" prop="partPayableAmount">
                  {{ form.partPayableAmount }}
                </el-form-item>
                <el-form-item label="权益金额：" prop="rightsAmount">
                  {{ form.rightsAmount }}
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountAmount">
                  {{ form.discountAmount }}
                </el-form-item>
                <el-form-item label="去零金额：" prop="noFractionAmount">
                  {{ form.noFractionAmount }}
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="实际应付总金额：" prop="payableAmount">
                  {{ form.payableAmount }}
                </el-form-item>
                <el-form-item label="剩余应付款金额：" prop="remainAmount">
                  {{ form.remainAmount }}
                </el-form-item>
                <el-form-item label="下次保养里程：" prop="nextMaintenanceMileage">
                  {{ form.nextMaintenanceMileage }}
                </el-form-item>
                <el-form-item label="下次保养时间：" prop="nextMaintenanceTime">
                  {{ form.nextMaintenanceTime }}
                </el-form-item>
                <el-form-item label="是否已创建反结算申请：" prop="createReStatement">
                  {{ yes_no_enum_map[form.createReStatement] }}
                </el-form-item>
                <el-form-item label="是否已生成保修单：" prop="createWarranty">
                  {{ yes_no_enum_map[form.createWarranty] }}
                </el-form-item>
                <el-form-item label="结算人员：" prop="statementPersonName">
                  {{ form.statementPersonName }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="statementTime">
                  {{ form.statementTime }}
                </el-form-item>
                <el-form-item label="收款人：" prop="payeeName">
                  {{ form.payeeName }}
                </el-form-item>
                <el-form-item label="收款时间：" prop="receiveTime">
                  {{ form.receiveTime }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
                <el-form-item label="是否已推送满意度：" prop="isPushVisitResult">
                  {{ form.isPushVisitResult }}
                </el-form-item>
                <el-form-item label="接车施工单id：" prop="serviceProxyId">
                  {{ form.serviceProxyId }}
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="整车档案id：" prop="vehProfileId">
                  {{ form.vehProfileId }}
                </el-form-item>
                <el-form-item label="支付方式：" prop="payType">
                  {{ form.payType }}
                </el-form-item>
                <el-form-item label="负责人：" prop="serviceOwnerId">
                  {{ form.serviceOwnerId }}
                </el-form-item>
                <el-form-item label="签字渠道：" prop="signChannel">
                  {{ form.signChannel }}
                </el-form-item>
                <el-form-item label="签字完成时间：" prop="signCompletedTime">
                  {{ form.signCompletedTime }}
                </el-form-item>
                <el-form-item label="签字生成时间：" prop="signGeneratedTime">
                  {{ form.signGeneratedTime }}
                </el-form-item>
                <el-form-item label="签字状态：" prop="signStatus">
                  {{ form.signStatus }}
                </el-form-item>
                <el-form-item label="短信签字链接过期时间：" prop="signUrlExpiredTime">
                  {{ form.signUrlExpiredTime }}
                </el-form-item>
                <el-form-item label="结算人员id：" prop="statementPersonId">
                  {{ form.statementPersonId }}
                </el-form-item>
                <el-form-item label="收款人id：" prop="payeeId">
                  {{ form.payeeId }}
                </el-form-item>
                <el-form-item label="保修单状态：" prop="claimStatus">
                  {{ form.claimStatus }}
                </el-form-item>
                <el-form-item label="满意度推送结果：" prop="satisfactionResult">
                  {{ form.satisfactionResult }}
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
                <el-form-item label="结账记录：" prop="invoiceRecordResps">
                  {{ form.invoiceRecordResps }}
                </el-form-item>
                <el-form-item label="权益核销记录：" prop="rightsUsageRecordResps">
                  {{ form.rightsUsageRecordResps }}
                </el-form-item>
                <el-form-item label="维修项目明细：" prop="repairItemResps">
                  {{ form.repairItemResps }}
                </el-form-item>
                <el-form-item label="维修零配件明细：" prop="partResps">
                  {{ form.partResps }}
                </el-form-item>
                <el-form-item label="零件保养信息明细：" prop="partMaintenanceResps">
                  {{ form.partMaintenanceResps }}
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
import { getDetail, addOrUpdate } from '@/api/maintain/sp/serviceStatement/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
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
  dataSource: '',
  statementType: '',
  statementStatus: '',
  serviceProxyCode: '',
  warrantyTypeCollect: '',
  accountType: '',
  vehProfileVin: '',
  dealerName: '',
  repairItemAmount: '',
  repairItemDiscount: '',
  repairItemPayableAmount: '',
  partAmount: '',
  partDiscount: '',
  partPayableAmount: '',
  rightsAmount: '',
  discountAmount: '',
  noFractionAmount: '',
  totalAmount: '',
  payableAmount: '',
  remainAmount: '',
  nextMaintenanceMileage: '',
  nextMaintenanceTime: '',
  createReStatement: '',
  createWarranty: '',
  statementPersonName: '',
  statementTime: '',
  payeeName: '',
  receiveTime: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  isPushVisitResult: '',
  serviceProxyId: '',
  ownerOrgId: '',
  dealerCode: '',
  vehProfileId: '',
  payType: '',
  serviceOwnerId: '',
  signChannel: '',
  signCompletedTime: '',
  signGeneratedTime: '',
  signStatus: '',
  signUrlExpiredTime: '',
  statementPersonId: '',
  payeeId: '',
  claimStatus: '',
  satisfactionResult: '',
  claimItemAmount: '',
  claimOtherAmount: '',
  claimPartsAmount: '',
  invoiceRecordResps: '',
  rightsUsageRecordResps: '',
  repairItemResps: '',
  partResps: '',
  partMaintenanceResps: '',
};

export default {
  name: 'serviceStatementEdit',
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
    EditTable,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
      pageTitle: '结算单表管理',
      pageType: 'edit',
      title: '结算单号：' + form.code,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceStatement',
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
          { required: true, message: '请输入结算单号', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源', trigger: 'change' }
        ],
        statementType: [
          { required: true, message: '请选择结算单类型', trigger: 'change' }
        ],
        statementStatus: [
          { required: true, message: '请选择结算单状态', trigger: 'change' }
        ],
        serviceProxyCode: [
          { required: true, message: '请输入接车施工单', trigger: 'change' }
        ],
        warrantyTypeCollect: [
          { required: true, message: '请选择保修类型（汇总）', trigger: 'change' }
        ],
        accountType: [
          { required: true, message: '请选择销账标识', trigger: 'change' }
        ],
        vehProfileVin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        repairItemAmount: [
          { required: true, message: '请输入维修项目金额', trigger: 'change' }
        ],
        repairItemDiscount: [
          { required: true, message: '请输入维修项优惠金额', trigger: 'change' }
        ],
        repairItemPayableAmount: [
          { required: true, message: '请输入维修项应付金额', trigger: 'change' }
        ],
        partAmount: [
          { required: true, message: '请输入零件金额', trigger: 'change' }
        ],
        partDiscount: [
          { required: true, message: '请输入零件优惠金额', trigger: 'change' }
        ],
        partPayableAmount: [
          { required: true, message: '请输入零件应付金额', trigger: 'change' }
        ],
        rightsAmount: [
          { required: true, message: '请输入权益金额', trigger: 'change' }
        ],
        discountAmount: [
          { required: true, message: '请输入优惠总金额', trigger: 'change' }
        ],
        noFractionAmount: [
          { required: true, message: '请输入去零金额', trigger: 'change' }
        ],
        totalAmount: [
          { required: true, message: '请输入总金额', trigger: 'change' }
        ],
        payableAmount: [
          { required: true, message: '请输入实际应付总金额', trigger: 'change' }
        ],
        remainAmount: [
          { required: true, message: '请输入剩余应付款金额', trigger: 'change' }
        ],
        nextMaintenanceMileage: [
          { required: true, message: '请输入下次保养里程', trigger: 'change' }
        ],
        nextMaintenanceTime: [
          { required: true, message: '请选择下次保养时间', trigger: 'change' }
        ],
        statementPersonName: [
          { required: true, message: '请选择结算人员', trigger: 'change' }
        ],
        statementTime: [
          { required: true, message: '请选择结算时间', trigger: 'change' }
        ],
        payeeName: [
          { required: true, message: '请输入收款人', trigger: 'change' }
        ],
        receiveTime: [
          { required: true, message: '请选择收款时间', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
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
        isPushVisitResult: [
          { required: true, message: '请输入是否已推送满意度', trigger: 'change' }
        ],
        serviceProxyId: [
          { required: true, message: '请输入接车施工单id', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        vehProfileId: [
          { required: true, message: '请输入整车档案id', trigger: 'change' }
        ],
        payType: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        serviceOwnerId: [
          { required: true, message: '请输入负责人', trigger: 'change' }
        ],
        signChannel: [
          { required: true, message: '请输入签字渠道', trigger: 'change' }
        ],
        signCompletedTime: [
          { required: true, message: '请选择签字完成时间', trigger: 'change' }
        ],
        signGeneratedTime: [
          { required: true, message: '请选择签字生成时间', trigger: 'change' }
        ],
        signStatus: [
          { required: true, message: '请选择签字状态', trigger: 'change' }
        ],
        signUrlExpiredTime: [
          { required: true, message: '请选择短信签字链接过期时间', trigger: 'change' }
        ],
        statementPersonId: [
          { required: true, message: '请选择结算人员id', trigger: 'change' }
        ],
        payeeId: [
          { required: true, message: '请输入收款人id', trigger: 'change' }
        ],
        claimStatus: [
          { required: true, message: '请选择保修单状态', trigger: 'change' }
        ],
        satisfactionResult: [
          { required: true, message: '请输入满意度推送结果', trigger: 'change' }
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
        invoiceRecordResps: [
          { required: true, message: '请输入结账记录', trigger: 'change' }
        ],
        rightsUsageRecordResps: [
          { required: true, message: '请输入权益核销记录', trigger: 'change' }
        ],
        repairItemResps: [
          { required: true, message: '请输入维修项目明细', trigger: 'change' }
        ],
        partResps: [
          { required: true, message: '请输入维修零配件明细', trigger: 'change' }
        ],
        partMaintenanceResps: [
          { required: true, message: '请输入零件保养信息明细', trigger: 'change' }
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
