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
                <el-form-item label="调拨出库单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库方仓库ID：" prop="outboundWarehouseId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundWarehouseId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundDealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundDealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库方联系人：" prop="inboundContactName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundContactName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库方手机：" prop="inboundContactPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundContactPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="调拨状态:草稿，待审批，同意，驳回：" prop="transferStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.transferStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="出库状态:待出库，已出库：" prop="outboundStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.outboundStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="撤销状态:未申请，待审批，同意，驳回：" prop="cancelStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.cancelStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="入库状态:待入库，已入库：" prop="inboundStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.inboundStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
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
                <el-form-item label="出库门店组织id：" prop="outboundOwnerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundOwnerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库门店组织id：" prop="inboundOwnerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundOwnerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsProvider"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsOrderNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="调出申请人：" prop="transferApply">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transferApply"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="调出申请人名称：" prop="transferApplyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transferApplyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="调出申请时间：" prop="transferApplyTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.transferApplyTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="调出申请说明：" prop="transferApplyDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transferApplyDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="调出审批人：" prop="transferApprover">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transferApprover"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="调出审批人名称：" prop="transferApproverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transferApproverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="调出审批时间：" prop="transferApprovalTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.transferApprovalTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="调出审批说明：" prop="transferApprovalDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.transferApprovalDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库操作人名称：" prop="outboundOperatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.outboundOperatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.outboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="撤销申请人：" prop="cancelApply">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelApply"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="撤销申请人名称：" prop="cancelApplyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelApplyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="撤销申请时间：" prop="cancelApplyTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelApplyTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="撤销申请说明：" prop="cancelApplyDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelApplyDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="撤销审批人：" prop="cancelApprover">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelApprover"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="撤销审批人名称：" prop="cancelApproverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelApproverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="撤销审批时间：" prop="cancelApprovalTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.cancelApprovalTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="撤销审批说明：" prop="cancelApprovalDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cancelApprovalDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.inboundOperator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.inboundTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="调拨出库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  {{ form.outboundDealerCode }}
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="出库方仓库ID：" prop="outboundWarehouseId">
                  {{ form.outboundWarehouseId }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="入库方联系人：" prop="inboundContactName">
                  {{ form.inboundContactName }}
                </el-form-item>
                <el-form-item label="入库方手机：" prop="inboundContactPhone">
                  {{ form.inboundContactPhone }}
                </el-form-item>
                <el-form-item label="调拨状态:草稿，待审批，同意，驳回：" prop="transferStatus">
                  {{ form.transferStatus }}
                </el-form-item>
                <el-form-item label="出库状态:待出库，已出库：" prop="outboundStatus">
                  {{ form.outboundStatus }}
                </el-form-item>
                <el-form-item label="撤销状态:未申请，待审批，同意，驳回：" prop="cancelStatus">
                  {{ form.cancelStatus }}
                </el-form-item>
                <el-form-item label="入库状态:待入库，已入库：" prop="inboundStatus">
                  {{ form.inboundStatus }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
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
                <el-form-item label="出库门店组织id：" prop="outboundOwnerOrgId">
                  {{ form.outboundOwnerOrgId }}
                </el-form-item>
                <el-form-item label="入库门店组织id：" prop="inboundOwnerOrgId">
                  {{ form.inboundOwnerOrgId }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="物流备注：" prop="logisticsRemark">
                  {{ form.logisticsRemark }}
                </el-form-item>
                <el-form-item label="调出申请人：" prop="transferApply">
                  {{ form.transferApply }}
                </el-form-item>
                <el-form-item label="调出申请人名称：" prop="transferApplyName">
                  {{ form.transferApplyName }}
                </el-form-item>
                <el-form-item label="调出申请时间：" prop="transferApplyTime">
                  {{ form.transferApplyTime }}
                </el-form-item>
                <el-form-item label="调出申请说明：" prop="transferApplyDescription">
                  {{ form.transferApplyDescription }}
                </el-form-item>
                <el-form-item label="调出审批人：" prop="transferApprover">
                  {{ form.transferApprover }}
                </el-form-item>
                <el-form-item label="调出审批人名称：" prop="transferApproverName">
                  {{ form.transferApproverName }}
                </el-form-item>
                <el-form-item label="调出审批时间：" prop="transferApprovalTime">
                  {{ form.transferApprovalTime }}
                </el-form-item>
                <el-form-item label="调出审批说明：" prop="transferApprovalDescription">
                  {{ form.transferApprovalDescription }}
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperator">
                  {{ form.outboundOperator }}
                </el-form-item>
                <el-form-item label="出库操作人名称：" prop="outboundOperatorName">
                  {{ form.outboundOperatorName }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="撤销申请人：" prop="cancelApply">
                  {{ form.cancelApply }}
                </el-form-item>
                <el-form-item label="撤销申请人名称：" prop="cancelApplyName">
                  {{ form.cancelApplyName }}
                </el-form-item>
                <el-form-item label="撤销申请时间：" prop="cancelApplyTime">
                  {{ form.cancelApplyTime }}
                </el-form-item>
                <el-form-item label="撤销申请说明：" prop="cancelApplyDescription">
                  {{ form.cancelApplyDescription }}
                </el-form-item>
                <el-form-item label="撤销审批人：" prop="cancelApprover">
                  {{ form.cancelApprover }}
                </el-form-item>
                <el-form-item label="撤销审批人名称：" prop="cancelApproverName">
                  {{ form.cancelApproverName }}
                </el-form-item>
                <el-form-item label="撤销审批时间：" prop="cancelApprovalTime">
                  {{ form.cancelApprovalTime }}
                </el-form-item>
                <el-form-item label="撤销审批说明：" prop="cancelApprovalDescription">
                  {{ form.cancelApprovalDescription }}
                </el-form-item>
                <el-form-item label="入库操作人：" prop="inboundOperator">
                  {{ form.inboundOperator }}
                </el-form-item>
                <el-form-item label="入库操作时间：" prop="inboundTime">
                  {{ form.inboundTime }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/transfer/transferOutbound/index';
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
  outboundDealerCode: '',
  outboundDealerName: '',
  outboundWarehouseId: '',
  inboundDealerCode: '',
  inboundDealerName: '',
  inboundContactName: '',
  inboundContactPhone: '',
  transferStatus: '',
  outboundStatus: '',
  cancelStatus: '',
  inboundStatus: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  outboundOwnerOrgId: '',
  inboundOwnerOrgId: '',
  logisticsProvider: '',
  logisticsOrderNo: '',
  logisticsRemark: '',
  transferApply: '',
  transferApplyName: '',
  transferApplyTime: '',
  transferApplyDescription: '',
  transferApprover: '',
  transferApproverName: '',
  transferApprovalTime: '',
  transferApprovalDescription: '',
  outboundOperator: '',
  outboundOperatorName: '',
  outboundTime: '',
  cancelApply: '',
  cancelApplyName: '',
  cancelApplyTime: '',
  cancelApplyDescription: '',
  cancelApprover: '',
  cancelApproverName: '',
  cancelApprovalTime: '',
  cancelApprovalDescription: '',
  inboundOperator: '',
  inboundTime: '',
};

export default {
  name: 'transferOutboundEdit',
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
      return '调拨出库单号：' + this.form.code;
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
      pageTitle: '备件调拨出库',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-transferOutbound',
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
          { required: true, message: '请输入调拨出库单号', trigger: 'change' }
        ],
        outboundDealerCode: [
          { required: true, message: '请输入出库门店编码', trigger: 'change' }
        ],
        outboundDealerName: [
          { required: true, message: '请输入出库门店名称', trigger: 'change' }
        ],
        outboundWarehouseId: [
          { required: true, message: '请输入出库方仓库ID', trigger: 'change' }
        ],
        inboundDealerCode: [
          { required: true, message: '请输入入库门店编码', trigger: 'change' }
        ],
        inboundDealerName: [
          { required: true, message: '请输入入库门店名称', trigger: 'change' }
        ],
        inboundContactName: [
          { required: true, message: '请输入入库方联系人', trigger: 'change' }
        ],
        inboundContactPhone: [
          { required: true, message: '请输入入库方手机', trigger: 'change' }
        ],
        transferStatus: [
          { required: true, message: '请选择调拨状态:草稿，待审批，同意，驳回', trigger: 'change' }
        ],
        outboundStatus: [
          { required: true, message: '请选择出库状态:待出库，已出库', trigger: 'change' }
        ],
        cancelStatus: [
          { required: true, message: '请选择撤销状态:未申请，待审批，同意，驳回', trigger: 'change' }
        ],
        inboundStatus: [
          { required: true, message: '请选择入库状态:待入库，已入库', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
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
        outboundOwnerOrgId: [
          { required: true, message: '请输入出库门店组织id', trigger: 'change' }
        ],
        inboundOwnerOrgId: [
          { required: true, message: '请输入入库门店组织id', trigger: 'change' }
        ],
        logisticsProvider: [
          { required: true, message: '请输入物流商', trigger: 'change' }
        ],
        logisticsOrderNo: [
          { required: true, message: '请输入物流单号', trigger: 'change' }
        ],
        logisticsRemark: [
          { required: true, message: '请输入物流备注', trigger: 'change' }
        ],
        transferApply: [
          { required: true, message: '请输入调出申请人', trigger: 'change' }
        ],
        transferApplyName: [
          { required: true, message: '请输入调出申请人名称', trigger: 'change' }
        ],
        transferApplyTime: [
          { required: true, message: '请选择调出申请时间', trigger: 'change' }
        ],
        transferApplyDescription: [
          { required: true, message: '请输入调出申请说明', trigger: 'change' }
        ],
        transferApprover: [
          { required: true, message: '请输入调出审批人', trigger: 'change' }
        ],
        transferApproverName: [
          { required: true, message: '请输入调出审批人名称', trigger: 'change' }
        ],
        transferApprovalTime: [
          { required: true, message: '请选择调出审批时间', trigger: 'change' }
        ],
        transferApprovalDescription: [
          { required: true, message: '请输入调出审批说明', trigger: 'change' }
        ],
        outboundOperator: [
          { required: true, message: '请输入出库操作人', trigger: 'change' }
        ],
        outboundOperatorName: [
          { required: true, message: '请输入出库操作人名称', trigger: 'change' }
        ],
        outboundTime: [
          { required: true, message: '请选择出库操作时间', trigger: 'change' }
        ],
        cancelApply: [
          { required: true, message: '请输入撤销申请人', trigger: 'change' }
        ],
        cancelApplyName: [
          { required: true, message: '请输入撤销申请人名称', trigger: 'change' }
        ],
        cancelApplyTime: [
          { required: true, message: '请选择撤销申请时间', trigger: 'change' }
        ],
        cancelApplyDescription: [
          { required: true, message: '请输入撤销申请说明', trigger: 'change' }
        ],
        cancelApprover: [
          { required: true, message: '请输入撤销审批人', trigger: 'change' }
        ],
        cancelApproverName: [
          { required: true, message: '请输入撤销审批人名称', trigger: 'change' }
        ],
        cancelApprovalTime: [
          { required: true, message: '请选择撤销审批时间', trigger: 'change' }
        ],
        cancelApprovalDescription: [
          { required: true, message: '请输入撤销审批说明', trigger: 'change' }
        ],
        inboundOperator: [
          { required: true, message: '请输入入库操作人', trigger: 'change' }
        ],
        inboundTime: [
          { required: true, message: '请选择入库操作时间', trigger: 'change' }
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
