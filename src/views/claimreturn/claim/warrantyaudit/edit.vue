<template>
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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
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
                    v-model="form.createTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
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
                    v-model="form.updateTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.statusDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保修审计单编码：" prop="auditCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保修审计主题：" prop="auditTheme">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditTheme"
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
                <el-form-item label="归属门店 ID（组织 ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保修审批开始日期：" prop="warrantyApprovalStartDate">
                  <el-date-picker
                    v-model="form.warrantyApprovalStartDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="保修审批结束日期：" prop="warrantyApprovalEndDate">
                  <el-date-picker
                    v-model="form.warrantyApprovalEndDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="审计类型 字典 warranty_audit_type：" prop="auditType">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditType"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审计开始日期：" prop="auditStartDate">
                  <el-date-picker
                    v-model="form.auditStartDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="审计专员1 用户ID：" prop="auditor1Id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditor1Id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审计专员1姓名：" prop="auditor1Name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditor1Name"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审计专员1签名：" prop="auditor1Sign">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditor1Sign"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审计专员2 用户ID：" prop="auditor2Id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditor2Id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审计专员2姓名：" prop="auditor2Name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditor2Name"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审计专员2签名：" prop="auditor2Sign">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditor2Sign"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="计划审计数量，大于0：" prop="planAuditCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.planAuditCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="实际审计数量，大于等于0：" prop="actualAuditCount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.actualAuditCount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审计单状态 字典 warranty_audit_status：" prop="auditStatus">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditStatus"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下发人ID：" prop="issuerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.issuerId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下发人姓名：" prop="issuerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.issuerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下发时间：" prop="issueTime">
                  <el-date-picker
                    v-model="form.issueTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="总结签署时间：" prop="summarySignTime">
                  <el-date-picker
                    v-model="form.summarySignTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="总结签署人ID：" prop="summarySignerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.summarySignerId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="总结签署人姓名：" prop="summarySignerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.summarySignerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="总结签署说明：" prop="summarySignDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.summarySignDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="总结审批人ID：" prop="summaryApproverId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.summaryApproverId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="总结审批人姓名：" prop="summaryApproverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.summaryApproverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="总结审批时间：" prop="summaryApproveTime">
                  <el-date-picker
                    v-model="form.summaryApproveTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="总结审批说明：" prop="summaryApproveDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.summaryApproveDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整改签署时间：" prop="rectifySignTime">
                  <el-date-picker
                    v-model="form.rectifySignTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="整改签署人ID：" prop="rectifySignerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rectifySignerId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整改签署人姓名：" prop="rectifySignerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rectifySignerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整改签署说明：" prop="rectifySignDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rectifySignDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整改审批人：" prop="rectifyApproverId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rectifyApproverId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整改审批人：" prop="rectifyApproverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rectifyApproverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整改审批时间：" prop="rectifyApproveTime">
                  <el-date-picker
                    v-model="form.rectifyApproveTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="整改审批说明：" prop="rectifyApproveDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rectifyApproveDesc"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提交截止日期：" prop="submitDeadline">
                  <el-date-picker
                    v-model="form.submitDeadline"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="计划扣款金额，明细的汇总：" prop="planDeductAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.planDeductAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="已扣款金额，明细的汇总：" prop="deductedAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deductedAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="未扣款金额，明细的汇总：" prop="undeductAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.undeductAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保修审批区间金额：" prop="warrantyApprovalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warrantyApprovalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审计明细总金额：" prop="auditDetailTotalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.auditDetailTotalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="法人：" prop="legalPerson">
                  <el-input
                    placeholder="请输入"
                    v-model="form.legalPerson"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="投资人：" prop="investor">
                  <el-input
                    placeholder="请输入"
                    v-model="form.investor"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="服务店长：" prop="serviceManager">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceManager"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="配件经理：" prop="partsManager">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partsManager"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保修经理：" prop="warrantyManager">
                  <el-input
                    placeholder="请输入"
                    v-model="form.warrantyManager"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="技术经理：" prop="techManager">
                  <el-input
                    placeholder="请输入"
                    v-model="form.techManager"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
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
                  否
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="保修审计单编码：" prop="auditCode">
                  {{ form.auditCode }}
                </el-form-item>
                <el-form-item label="保修审计主题：" prop="auditTheme">
                  {{ form.auditTheme }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="归属门店 ID（组织 ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="保修审批开始日期：" prop="warrantyApprovalStartDate">
                  {{ form.warrantyApprovalStartDate }}
                </el-form-item>
                <el-form-item label="保修审批结束日期：" prop="warrantyApprovalEndDate">
                  {{ form.warrantyApprovalEndDate }}
                </el-form-item>
                <el-form-item label="审计类型 字典 warranty_audit_type：" prop="auditType">
                  {{ form.auditType }}
                </el-form-item>
                <el-form-item label="审计开始日期：" prop="auditStartDate">
                  {{ form.auditStartDate }}
                </el-form-item>
                <el-form-item label="审计专员1 用户ID：" prop="auditor1Id">
                  {{ form.auditor1Id }}
                </el-form-item>
                <el-form-item label="审计专员1姓名：" prop="auditor1Name">
                  {{ form.auditor1Name }}
                </el-form-item>
                <el-form-item label="审计专员1签名：" prop="auditor1Sign">
                  {{ form.auditor1Sign }}
                </el-form-item>
                <el-form-item label="审计专员2 用户ID：" prop="auditor2Id">
                  {{ form.auditor2Id }}
                </el-form-item>
                <el-form-item label="审计专员2姓名：" prop="auditor2Name">
                  {{ form.auditor2Name }}
                </el-form-item>
                <el-form-item label="审计专员2签名：" prop="auditor2Sign">
                  {{ form.auditor2Sign }}
                </el-form-item>
                <el-form-item label="计划审计数量，大于0：" prop="planAuditCount">
                  {{ form.planAuditCount }}
                </el-form-item>
                <el-form-item label="实际审计数量，大于等于0：" prop="actualAuditCount">
                  {{ form.actualAuditCount }}
                </el-form-item>
                <el-form-item label="审计单状态 字典 warranty_audit_status：" prop="auditStatus">
                  {{ form.auditStatus }}
                </el-form-item>
                <el-form-item label="下发人ID：" prop="issuerId">
                  {{ form.issuerId }}
                </el-form-item>
                <el-form-item label="下发人姓名：" prop="issuerName">
                  {{ form.issuerName }}
                </el-form-item>
                <el-form-item label="下发时间：" prop="issueTime">
                  {{ form.issueTime }}
                </el-form-item>
                <el-form-item label="总结签署时间：" prop="summarySignTime">
                  {{ form.summarySignTime }}
                </el-form-item>
                <el-form-item label="总结签署人ID：" prop="summarySignerId">
                  {{ form.summarySignerId }}
                </el-form-item>
                <el-form-item label="总结签署人姓名：" prop="summarySignerName">
                  {{ form.summarySignerName }}
                </el-form-item>
                <el-form-item label="总结签署说明：" prop="summarySignDesc">
                  {{ form.summarySignDesc }}
                </el-form-item>
                <el-form-item label="总结审批人ID：" prop="summaryApproverId">
                  {{ form.summaryApproverId }}
                </el-form-item>
                <el-form-item label="总结审批人姓名：" prop="summaryApproverName">
                  {{ form.summaryApproverName }}
                </el-form-item>
                <el-form-item label="总结审批时间：" prop="summaryApproveTime">
                  {{ form.summaryApproveTime }}
                </el-form-item>
                <el-form-item label="总结审批说明：" prop="summaryApproveDesc">
                  {{ form.summaryApproveDesc }}
                </el-form-item>
                <el-form-item label="整改签署时间：" prop="rectifySignTime">
                  {{ form.rectifySignTime }}
                </el-form-item>
                <el-form-item label="整改签署人ID：" prop="rectifySignerId">
                  {{ form.rectifySignerId }}
                </el-form-item>
                <el-form-item label="整改签署人姓名：" prop="rectifySignerName">
                  {{ form.rectifySignerName }}
                </el-form-item>
                <el-form-item label="整改签署说明：" prop="rectifySignDesc">
                  {{ form.rectifySignDesc }}
                </el-form-item>
                <el-form-item label="整改审批人：" prop="rectifyApproverId">
                  {{ form.rectifyApproverId }}
                </el-form-item>
                <el-form-item label="整改审批人：" prop="rectifyApproverName">
                  {{ form.rectifyApproverName }}
                </el-form-item>
                <el-form-item label="整改审批时间：" prop="rectifyApproveTime">
                  {{ form.rectifyApproveTime }}
                </el-form-item>
                <el-form-item label="整改审批说明：" prop="rectifyApproveDesc">
                  {{ form.rectifyApproveDesc }}
                </el-form-item>
                <el-form-item label="提交截止日期：" prop="submitDeadline">
                  {{ form.submitDeadline }}
                </el-form-item>
                <el-form-item label="计划扣款金额，明细的汇总：" prop="planDeductAmount">
                  {{ form.planDeductAmount }}
                </el-form-item>
                <el-form-item label="已扣款金额，明细的汇总：" prop="deductedAmount">
                  {{ form.deductedAmount }}
                </el-form-item>
                <el-form-item label="未扣款金额，明细的汇总：" prop="undeductAmount">
                  {{ form.undeductAmount }}
                </el-form-item>
                <el-form-item label="保修审批区间金额：" prop="warrantyApprovalAmount">
                  {{ form.warrantyApprovalAmount }}
                </el-form-item>
                <el-form-item label="审计明细总金额：" prop="auditDetailTotalAmount">
                  {{ form.auditDetailTotalAmount }}
                </el-form-item>
                <el-form-item label="法人：" prop="legalPerson">
                  {{ form.legalPerson }}
                </el-form-item>
                <el-form-item label="投资人：" prop="investor">
                  {{ form.investor }}
                </el-form-item>
                <el-form-item label="服务店长：" prop="serviceManager">
                  {{ form.serviceManager }}
                </el-form-item>
                <el-form-item label="配件经理：" prop="partsManager">
                  {{ form.partsManager }}
                </el-form-item>
                <el-form-item label="保修经理：" prop="warrantyManager">
                  {{ form.warrantyManager }}
                </el-form-item>
                <el-form-item label="技术经理：" prop="techManager">
                  {{ form.techManager }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <search-add-table
            :_id="_id"
            :canAddOrUpdate="canAddOrUpdate"
            @data-change="() => {}"
            @checkboxChange="checkboxChange"
          />
        </el-main>
      </edit-base-container>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
} from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import SearchAddTable from './components/SearchAddTable';

const defaultForm = {
  // 多选时字段有变化，自行修复
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
  dataSource: '',
  auditCode: '',
  auditTheme: '',
  dealerCode: '',
  dealerName: '',
  ownerOrgId: '',
  warrantyApprovalStartDate: '',
  warrantyApprovalEndDate: '',
  auditType: '',
  auditStartDate: '',
  auditor1Id: '',
  auditor1Name: '',
  auditor1Sign: '',
  auditor2Id: '',
  auditor2Name: '',
  auditor2Sign: '',
  planAuditCount: '',
  actualAuditCount: '',
  auditStatus: '',
  issuerId: '',
  issuerName: '',
  issueTime: '',
  summarySignTime: '',
  summarySignerId: '',
  summarySignerName: '',
  summarySignDesc: '',
  summaryApproverId: '',
  summaryApproverName: '',
  summaryApproveTime: '',
  summaryApproveDesc: '',
  rectifySignTime: '',
  rectifySignerId: '',
  rectifySignerName: '',
  rectifySignDesc: '',
  rectifyApproverId: '',
  rectifyApproverName: '',
  rectifyApproveTime: '',
  rectifyApproveDesc: '',
  submitDeadline: '',
  planDeductAmount: '',
  deductedAmount: '',
  undeductAmount: '',
  warrantyApprovalAmount: '',
  auditDetailTotalAmount: '',
  legalPerson: '',
  investor: '',
  serviceManager: '',
  partsManager: '',
  warrantyManager: '',
  techManager: '',
};

export default {
  name: 'warrantyAuditEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    SearchAddTable,
    EditBaseContainer,
    // FetchSelect,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '标题xxx';
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
      pageTitle: '保修审计发布',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR 根据实际情况修改
      moduleKey: 'AISCR-warrantyAudit',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
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
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请输入状态变更描述', trigger: 'blur' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'blur' }
        ],
        auditCode: [
          { required: true, message: '请输入保修审计单编码', trigger: 'blur' }
        ],
        auditTheme: [
          { required: true, message: '请输入保修审计主题', trigger: 'blur' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店 ID（组织 ID），当数据权限归属到本组织以及本下级', trigger: 'blur' }
        ],
        warrantyApprovalStartDate: [
          { required: true, message: '请选择保修审批开始日期', trigger: 'change' }
        ],
        warrantyApprovalEndDate: [
          { required: true, message: '请选择保修审批结束日期', trigger: 'change' }
        ],
        auditType: [
          { required: true, message: '请输入审计类型 字典 warranty_audit_type', trigger: 'blur' }
        ],
        auditStartDate: [
          { required: true, message: '请选择审计开始日期', trigger: 'change' }
        ],
        auditor1Id: [
          { required: true, message: '请输入审计专员1 用户ID', trigger: 'blur' }
        ],
        auditor1Name: [
          { required: true, message: '请输入审计专员1姓名', trigger: 'blur' }
        ],
        auditor1Sign: [
          { required: true, message: '请输入审计专员1签名', trigger: 'blur' }
        ],
        auditor2Id: [
          { required: true, message: '请输入审计专员2 用户ID', trigger: 'blur' }
        ],
        auditor2Name: [
          { required: true, message: '请输入审计专员2姓名', trigger: 'blur' }
        ],
        auditor2Sign: [
          { required: true, message: '请输入审计专员2签名', trigger: 'blur' }
        ],
        planAuditCount: [
          { required: true, message: '请输入计划审计数量，大于0', trigger: 'blur' }
        ],
        actualAuditCount: [
          { required: true, message: '请输入实际审计数量，大于等于0', trigger: 'blur' }
        ],
        auditStatus: [
          { required: true, message: '请输入审计单状态 字典 warranty_audit_status', trigger: 'blur' }
        ],
        issuerId: [
          { required: true, message: '请输入下发人ID', trigger: 'blur' }
        ],
        issuerName: [
          { required: true, message: '请输入下发人姓名', trigger: 'blur' }
        ],
        issueTime: [
          { required: true, message: '请选择下发时间', trigger: 'change' }
        ],
        summarySignTime: [
          { required: true, message: '请选择总结签署时间', trigger: 'change' }
        ],
        summarySignerId: [
          { required: true, message: '请输入总结签署人ID', trigger: 'blur' }
        ],
        summarySignerName: [
          { required: true, message: '请输入总结签署人姓名', trigger: 'blur' }
        ],
        summarySignDesc: [
          { required: true, message: '请输入总结签署说明', trigger: 'blur' }
        ],
        summaryApproverId: [
          { required: true, message: '请输入总结审批人ID', trigger: 'blur' }
        ],
        summaryApproverName: [
          { required: true, message: '请输入总结审批人姓名', trigger: 'blur' }
        ],
        summaryApproveTime: [
          { required: true, message: '请选择总结审批时间', trigger: 'change' }
        ],
        summaryApproveDesc: [
          { required: true, message: '请输入总结审批说明', trigger: 'blur' }
        ],
        rectifySignTime: [
          { required: true, message: '请选择整改签署时间', trigger: 'change' }
        ],
        rectifySignerId: [
          { required: true, message: '请输入整改签署人ID', trigger: 'blur' }
        ],
        rectifySignerName: [
          { required: true, message: '请输入整改签署人姓名', trigger: 'blur' }
        ],
        rectifySignDesc: [
          { required: true, message: '请输入整改签署说明', trigger: 'blur' }
        ],
        rectifyApproverId: [
          { required: true, message: '请输入整改审批人', trigger: 'blur' }
        ],
        rectifyApproverName: [
          { required: true, message: '请输入整改审批人', trigger: 'blur' }
        ],
        rectifyApproveTime: [
          { required: true, message: '请选择整改审批时间', trigger: 'change' }
        ],
        rectifyApproveDesc: [
          { required: true, message: '请输入整改审批说明', trigger: 'blur' }
        ],
        submitDeadline: [
          { required: true, message: '请选择提交截止日期', trigger: 'change' }
        ],
        planDeductAmount: [
          { required: true, message: '请输入计划扣款金额，明细的汇总', trigger: 'blur' }
        ],
        deductedAmount: [
          { required: true, message: '请输入已扣款金额，明细的汇总', trigger: 'blur' }
        ],
        undeductAmount: [
          { required: true, message: '请输入未扣款金额，明细的汇总', trigger: 'blur' }
        ],
        warrantyApprovalAmount: [
          { required: true, message: '请输入保修审批区间金额', trigger: 'blur' }
        ],
        auditDetailTotalAmount: [
          { required: true, message: '请输入审计明细总金额', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' }
        ],
        investor: [
          { required: true, message: '请输入投资人', trigger: 'blur' }
        ],
        serviceManager: [
          { required: true, message: '请输入服务店长', trigger: 'blur' }
        ],
        partsManager: [
          { required: true, message: '请输入配件经理', trigger: 'blur' }
        ],
        warrantyManager: [
          { required: true, message: '请输入保修经理', trigger: 'blur' }
        ],
        techManager: [
          { required: true, message: '请输入技术经理', trigger: 'blur' }
        ],
      },
      selectedRows: [],
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
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    checkboxChange (records) {
      this.selectedRows = records;
    },
  }
};
</script>
