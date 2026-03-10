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
                <el-form-item label="应付总金额：" prop="payableTotalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.payableTotalAmount"
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
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店组织id：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="当前里程：" prop="currentMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.currentMileage"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车联网里程：" prop="iotMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.iotMileage"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车牌号：" prop="plateNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.plateNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="最近进店里程：" prop="latestVisitMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.latestVisitMileage"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型ID：" prop="vehicleModelId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleModelId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销售日期：" prop="saleDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开单人：" prop="orderCreator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderCreator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开单人名称：" prop="orderCreatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.orderCreatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开单时间：" prop="orderCreationTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.orderCreationTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.confirmer"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="确认人名称：" prop="confirmerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.confirmerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmationTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.confirmationTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="签收人：" prop="signUser">
                  <el-input
                    placeholder="请输入"
                    v-model="form.signUser"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="签收人名称：" prop="signUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.signUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.signTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="取消签收人：" prop="cancelSignUser">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelSignUser"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="取消签收人名称：" prop="cancelSignUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelSignUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="取消签收时间：" prop="cancelSignTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelSignTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="作废人：" prop="canceller">
                  <el-input
                    placeholder="请输入"
                    v-model="form.canceller"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="作废人名称：" prop="cancellerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancellerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="作废备注：" prop="cancelRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算人：" prop="settler">
                  <el-input
                    placeholder="请输入"
                    v-model="form.settler"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算人名称：" prop="settlerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.settlerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="结算时间：" prop="settlementTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.settlementTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="收款人：" prop="collector">
                  <el-input
                    placeholder="请输入"
                    v-model="form.collector"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收款人名称：" prop="collectorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.collectorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收款时间：" prop="collectionTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.collectionTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="取消结算人：" prop="cancelSettler">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelSettler"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="取消结算人名称：" prop="cancelSettlerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelSettlerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="取消结算时间：" prop="cancelSettlementTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelSettlementTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="取消结算备注：" prop="cancelSettlementRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelSettlementRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退款人：" prop="refundOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退款人名称：" prop="refundOperatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundOperatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退款时间：" prop="refundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.refundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="退款备注：" prop="refundRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.refundRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="反结算操作人：" prop="reverseSettlementOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reverseSettlementOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="反结算操作人名称：" prop="reverseSettlementOperatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reverseSettlementOperatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="反结算操作时间：" prop="reverseSettlementTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.reverseSettlementTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="反结算备注：" prop="reverseSettlementRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reverseSettlementRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备附件销售单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
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
                <el-form-item label="门店合作类型：" prop="cooperationType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.cooperationType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="仓库ID：" prop="warehouseId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warehouseId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="客户类型:车主，对公：" prop="customerType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.customerType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="客户编码：" prop="customerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.customerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="客户名称：" prop="customerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.customerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单状态:待确认，待出库，待签收，待结算，待收款，已收款，待退料，待退款，已退款，已作废：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="订单总金额：" prop="totalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="客户联系方式：" prop="customerContactInfo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.customerContactInfo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountTotalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.discountTotalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="剩余应付金额：" prop="remainingPayableAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remainingPayableAmount"
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="应付总金额：" prop="payableTotalAmount">
                  {{ form.payableTotalAmount }}
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
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="门店组织id：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="当前里程：" prop="currentMileage">
                  {{ form.currentMileage }}
                </el-form-item>
                <el-form-item label="车联网里程：" prop="iotMileage">
                  {{ form.iotMileage }}
                </el-form-item>
                <el-form-item label="车牌号：" prop="plateNumber">
                  {{ form.plateNumber }}
                </el-form-item>
                <el-form-item label="最近进店里程：" prop="latestVisitMileage">
                  {{ form.latestVisitMileage }}
                </el-form-item>
                <el-form-item label="车型ID：" prop="vehicleModelId">
                  {{ form.vehicleModelId }}
                </el-form-item>
                <el-form-item label="销售日期：" prop="saleDate">
                  {{ form.saleDate }}
                </el-form-item>
                <el-form-item label="开单人：" prop="orderCreator">
                  {{ form.orderCreator }}
                </el-form-item>
                <el-form-item label="开单人名称：" prop="orderCreatorName">
                  {{ form.orderCreatorName }}
                </el-form-item>
                <el-form-item label="开单时间：" prop="orderCreationTime">
                  {{ form.orderCreationTime }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  {{ form.confirmer }}
                </el-form-item>
                <el-form-item label="确认人名称：" prop="confirmerName">
                  {{ form.confirmerName }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmationTime">
                  {{ form.confirmationTime }}
                </el-form-item>
                <el-form-item label="签收人：" prop="signUser">
                  {{ form.signUser }}
                </el-form-item>
                <el-form-item label="签收人名称：" prop="signUserName">
                  {{ form.signUserName }}
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  {{ form.signTime }}
                </el-form-item>
                <el-form-item label="取消签收人：" prop="cancelSignUser">
                  {{ form.cancelSignUser }}
                </el-form-item>
                <el-form-item label="取消签收人名称：" prop="cancelSignUserName">
                  {{ form.cancelSignUserName }}
                </el-form-item>
                <el-form-item label="取消签收时间：" prop="cancelSignTime">
                  {{ form.cancelSignTime }}
                </el-form-item>
                <el-form-item label="作废人：" prop="canceller">
                  {{ form.canceller }}
                </el-form-item>
                <el-form-item label="作废人名称：" prop="cancellerName">
                  {{ form.cancellerName }}
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
                <el-form-item label="作废备注：" prop="cancelRemark">
                  {{ form.cancelRemark }}
                </el-form-item>
                <el-form-item label="结算人：" prop="settler">
                  {{ form.settler }}
                </el-form-item>
                <el-form-item label="结算人名称：" prop="settlerName">
                  {{ form.settlerName }}
                </el-form-item>
                <el-form-item label="结算时间：" prop="settlementTime">
                  {{ form.settlementTime }}
                </el-form-item>
                <el-form-item label="收款人：" prop="collector">
                  {{ form.collector }}
                </el-form-item>
                <el-form-item label="收款人名称：" prop="collectorName">
                  {{ form.collectorName }}
                </el-form-item>
                <el-form-item label="收款时间：" prop="collectionTime">
                  {{ form.collectionTime }}
                </el-form-item>
                <el-form-item label="取消结算人：" prop="cancelSettler">
                  {{ form.cancelSettler }}
                </el-form-item>
                <el-form-item label="取消结算人名称：" prop="cancelSettlerName">
                  {{ form.cancelSettlerName }}
                </el-form-item>
                <el-form-item label="取消结算时间：" prop="cancelSettlementTime">
                  {{ form.cancelSettlementTime }}
                </el-form-item>
                <el-form-item label="取消结算备注：" prop="cancelSettlementRemark">
                  {{ form.cancelSettlementRemark }}
                </el-form-item>
                <el-form-item label="退款人：" prop="refundOperator">
                  {{ form.refundOperator }}
                </el-form-item>
                <el-form-item label="退款人名称：" prop="refundOperatorName">
                  {{ form.refundOperatorName }}
                </el-form-item>
                <el-form-item label="退款时间：" prop="refundTime">
                  {{ form.refundTime }}
                </el-form-item>
                <el-form-item label="退款备注：" prop="refundRemark">
                  {{ form.refundRemark }}
                </el-form-item>
                <el-form-item label="反结算操作人：" prop="reverseSettlementOperator">
                  {{ form.reverseSettlementOperator }}
                </el-form-item>
                <el-form-item label="反结算操作人名称：" prop="reverseSettlementOperatorName">
                  {{ form.reverseSettlementOperatorName }}
                </el-form-item>
                <el-form-item label="反结算操作时间：" prop="reverseSettlementTime">
                  {{ form.reverseSettlementTime }}
                </el-form-item>
                <el-form-item label="反结算备注：" prop="reverseSettlementRemark">
                  {{ form.reverseSettlementRemark }}
                </el-form-item>
                <el-form-item label="备附件销售单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="门店合作类型：" prop="cooperationType">
                  {{ form.cooperationType }}
                </el-form-item>
                <el-form-item label="仓库ID：" prop="warehouseId">
                  {{ form.warehouseId }}
                </el-form-item>
                <el-form-item label="客户类型:车主，对公：" prop="customerType">
                  {{ form.customerType }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="客户编码：" prop="customerCode">
                  {{ form.customerCode }}
                </el-form-item>
                <el-form-item label="客户名称：" prop="customerName">
                  {{ form.customerName }}
                </el-form-item>
                <el-form-item label="订单状态:待确认，待出库，待签收，待结算，待收款，已收款，待退料，待退款，已退款，已作废：" prop="orderStatus">
                  {{ form.orderStatus }}
                </el-form-item>
                <el-form-item label="订单总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="客户联系方式：" prop="customerContactInfo">
                  {{ form.customerContactInfo }}
                </el-form-item>
                <el-form-item label="优惠总金额：" prop="discountTotalAmount">
                  {{ form.discountTotalAmount }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="剩余应付金额：" prop="remainingPayableAmount">
                  {{ form.remainingPayableAmount }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/sale/retailOrder/index';
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
  payableTotalAmount: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  ownerOrgId: '',
  currentMileage: '',
  iotMileage: '',
  plateNumber: '',
  latestVisitMileage: '',
  vehicleModelId: '',
  saleDate: '',
  orderCreator: '',
  orderCreatorName: '',
  orderCreationTime: '',
  confirmer: '',
  confirmerName: '',
  confirmationTime: '',
  signUser: '',
  signUserName: '',
  signTime: '',
  cancelSignUser: '',
  cancelSignUserName: '',
  cancelSignTime: '',
  canceller: '',
  cancellerName: '',
  cancelTime: '',
  cancelRemark: '',
  settler: '',
  settlerName: '',
  settlementTime: '',
  collector: '',
  collectorName: '',
  collectionTime: '',
  cancelSettler: '',
  cancelSettlerName: '',
  cancelSettlementTime: '',
  cancelSettlementRemark: '',
  refundOperator: '',
  refundOperatorName: '',
  refundTime: '',
  refundRemark: '',
  reverseSettlementOperator: '',
  reverseSettlementOperatorName: '',
  reverseSettlementTime: '',
  reverseSettlementRemark: '',
  code: '',
  dealerCode: '',
  dealerName: '',
  cooperationType: '',
  warehouseId: '',
  customerType: '',
  vin: '',
  customerCode: '',
  customerName: '',
  orderStatus: '',
  totalAmount: '',
  customerContactInfo: '',
  discountTotalAmount: '',
  remark: '',
  remainingPayableAmount: '',
  updateTime: '',
};

export default {
  name: 'retailOrderEdit',
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
      return '应付总金额：' + this.form.payableTotalAmount;
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
      pageTitle: '备附件销售',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-retailOrder',
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
        payableTotalAmount: [
          { required: true, message: '请输入应付总金额', trigger: 'change' }
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
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入门店组织id', trigger: 'change' }
        ],
        currentMileage: [
          { required: true, message: '请输入当前里程', trigger: 'change' }
        ],
        iotMileage: [
          { required: true, message: '请输入车联网里程', trigger: 'change' }
        ],
        plateNumber: [
          { required: true, message: '请输入车牌号', trigger: 'change' }
        ],
        latestVisitMileage: [
          { required: true, message: '请输入最近进店里程', trigger: 'change' }
        ],
        vehicleModelId: [
          { required: true, message: '请输入车型ID', trigger: 'change' }
        ],
        saleDate: [
          { required: true, message: '请输入销售日期', trigger: 'change' }
        ],
        orderCreator: [
          { required: true, message: '请输入开单人', trigger: 'change' }
        ],
        orderCreatorName: [
          { required: true, message: '请输入开单人名称', trigger: 'change' }
        ],
        orderCreationTime: [
          { required: true, message: '请选择开单时间', trigger: 'change' }
        ],
        confirmer: [
          { required: true, message: '请输入确认人', trigger: 'change' }
        ],
        confirmerName: [
          { required: true, message: '请输入确认人名称', trigger: 'change' }
        ],
        confirmationTime: [
          { required: true, message: '请选择确认时间', trigger: 'change' }
        ],
        signUser: [
          { required: true, message: '请输入签收人', trigger: 'change' }
        ],
        signUserName: [
          { required: true, message: '请输入签收人名称', trigger: 'change' }
        ],
        signTime: [
          { required: true, message: '请选择签收时间', trigger: 'change' }
        ],
        cancelSignUser: [
          { required: true, message: '请输入取消签收人', trigger: 'change' }
        ],
        cancelSignUserName: [
          { required: true, message: '请输入取消签收人名称', trigger: 'change' }
        ],
        cancelSignTime: [
          { required: true, message: '请选择取消签收时间', trigger: 'change' }
        ],
        canceller: [
          { required: true, message: '请输入作废人', trigger: 'change' }
        ],
        cancellerName: [
          { required: true, message: '请输入作废人名称', trigger: 'change' }
        ],
        cancelTime: [
          { required: true, message: '请选择作废时间', trigger: 'change' }
        ],
        cancelRemark: [
          { required: true, message: '请输入作废备注', trigger: 'change' }
        ],
        settler: [
          { required: true, message: '请输入结算人', trigger: 'change' }
        ],
        settlerName: [
          { required: true, message: '请输入结算人名称', trigger: 'change' }
        ],
        settlementTime: [
          { required: true, message: '请选择结算时间', trigger: 'change' }
        ],
        collector: [
          { required: true, message: '请输入收款人', trigger: 'change' }
        ],
        collectorName: [
          { required: true, message: '请输入收款人名称', trigger: 'change' }
        ],
        collectionTime: [
          { required: true, message: '请选择收款时间', trigger: 'change' }
        ],
        cancelSettler: [
          { required: true, message: '请输入取消结算人', trigger: 'change' }
        ],
        cancelSettlerName: [
          { required: true, message: '请输入取消结算人名称', trigger: 'change' }
        ],
        cancelSettlementTime: [
          { required: true, message: '请选择取消结算时间', trigger: 'change' }
        ],
        cancelSettlementRemark: [
          { required: true, message: '请输入取消结算备注', trigger: 'change' }
        ],
        refundOperator: [
          { required: true, message: '请输入退款人', trigger: 'change' }
        ],
        refundOperatorName: [
          { required: true, message: '请输入退款人名称', trigger: 'change' }
        ],
        refundTime: [
          { required: true, message: '请选择退款时间', trigger: 'change' }
        ],
        refundRemark: [
          { required: true, message: '请输入退款备注', trigger: 'change' }
        ],
        reverseSettlementOperator: [
          { required: true, message: '请输入反结算操作人', trigger: 'change' }
        ],
        reverseSettlementOperatorName: [
          { required: true, message: '请输入反结算操作人名称', trigger: 'change' }
        ],
        reverseSettlementTime: [
          { required: true, message: '请选择反结算操作时间', trigger: 'change' }
        ],
        reverseSettlementRemark: [
          { required: true, message: '请输入反结算备注', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入备附件销售单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        cooperationType: [
          { required: true, message: '请选择门店合作类型', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '请输入仓库ID', trigger: 'change' }
        ],
        customerType: [
          { required: true, message: '请选择客户类型:车主，对公', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN', trigger: 'change' }
        ],
        customerCode: [
          { required: true, message: '请输入客户编码', trigger: 'change' }
        ],
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择订单状态:待确认，待出库，待签收，待结算，待收款，已收款，待退料，待退款，已退款，已作废', trigger: 'change' }
        ],
        totalAmount: [
          { required: true, message: '请输入订单总金额', trigger: 'change' }
        ],
        customerContactInfo: [
          { required: true, message: '请输入客户联系方式', trigger: 'change' }
        ],
        discountTotalAmount: [
          { required: true, message: '请输入优惠总金额', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        remainingPayableAmount: [
          { required: true, message: '请输入剩余应付金额', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
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
