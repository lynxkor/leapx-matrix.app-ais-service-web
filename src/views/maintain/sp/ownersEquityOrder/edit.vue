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
                <el-form-item label="商城订单编号：" prop="mallOrderNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mallOrderNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益商品类型：" prop="goodInterestsType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.goodInterestsType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="权益商品代码：" prop="interestsGoodsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interestsGoodsCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益商品名称：" prop="interestsGoodsName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interestsGoodsName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.orderStatus"
                    placeholder="请选择"
                    clearable
                    filterable
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
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="施工单号：" prop="serviceProxyCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyCode"
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
                <el-form-item label="购买人：" prop="purchaser">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaser"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购买人电话：" prop="purchaserPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaserPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="购买日期：" prop="saleDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.saleDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="推荐码：" prop="referralCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.referralCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompanies">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsCompanies"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrder">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsOrder"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="工时索赔合计：" prop="claimWorkHourAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.claimWorkHourAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件索赔合计：" prop="claimPartsAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.claimPartsAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="索赔合计：" prop="claimAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.claimAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="核销人：" prop="writeOffUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.writeOffUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="核销时间：" prop="writeOffDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.writeOffDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="退订日期：" prop="unsubscribeDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.unsubscribeDate"
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
                <el-form-item label="失效时间：" prop="invalidDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invalidDate"
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
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
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
                <el-form-item label="名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="权益订单编号：" prop="equityOrderNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.equityOrderNumber"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效操作人：" prop="forceSystemUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.forceSystemUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效操作人：" prop="forceSystemUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.forceSystemUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效时间：" prop="forceTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.forceTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="权益商品id：" prop="interestsGoodsId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.interestsGoodsId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="失效原因：" prop="invalidReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invalidReason"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="失效操作人：" prop="invalidSystemUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invalidSystemUserId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="失效操作人：" prop="invalidSystemUserName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.invalidSystemUserName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否生效：" prop="isEffect">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isEffect"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否退订：" prop="isUnsubscribe">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isUnsubscribe"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否已拆单：" prop="separateBill">
                  <el-input
                    placeholder="请输入"
                    v-model="form.separateBill"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="拆单时间：" prop="separateBillData">
                  <el-input
                    placeholder="请输入"
                    v-model="form.separateBillData"
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
                <el-form-item label="退订原因：" prop="checkoutReason">
                  <el-input
                    placeholder="请输入"
                    v-model="form.checkoutReason"
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
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="施工单id：" prop="serviceProxyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="核销人：" prop="writeOffUserId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.writeOffUserId"
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="商城订单编号：" prop="mallOrderNumber">
                  {{ form.mallOrderNumber }}
                </el-form-item>
                <el-form-item label="权益商品类型：" prop="goodInterestsType">
                  {{ form.goodInterestsType }}
                </el-form-item>
                <el-form-item label="权益商品代码：" prop="interestsGoodsCode">
                  {{ form.interestsGoodsCode }}
                </el-form-item>
                <el-form-item label="权益商品名称：" prop="interestsGoodsName">
                  {{ form.interestsGoodsName }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatus }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="施工单号：" prop="serviceProxyCode">
                  {{ form.serviceProxyCode }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  {{ form.vehProfileVin }}
                </el-form-item>
                <el-form-item label="购买人：" prop="purchaser">
                  {{ form.purchaser }}
                </el-form-item>
                <el-form-item label="购买人电话：" prop="purchaserPhone">
                  {{ form.purchaserPhone }}
                </el-form-item>
                <el-form-item label="购买日期：" prop="saleDate">
                  {{ form.saleDate }}
                </el-form-item>
                <el-form-item label="推荐码：" prop="referralCode">
                  {{ form.referralCode }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompanies">
                  {{ form.logisticsCompanies }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrder">
                  {{ form.logisticsOrder }}
                </el-form-item>
                <el-form-item label="工时索赔合计：" prop="claimWorkHourAmount">
                  {{ form.claimWorkHourAmount }}
                </el-form-item>
                <el-form-item label="零件索赔合计：" prop="claimPartsAmount">
                  {{ form.claimPartsAmount }}
                </el-form-item>
                <el-form-item label="索赔合计：" prop="claimAmount">
                  {{ form.claimAmount }}
                </el-form-item>
                <el-form-item label="核销人：" prop="writeOffUserName">
                  {{ form.writeOffUserName }}
                </el-form-item>
                <el-form-item label="核销时间：" prop="writeOffDate">
                  {{ form.writeOffDate }}
                </el-form-item>
                <el-form-item label="退订日期：" prop="unsubscribeDate">
                  {{ form.unsubscribeDate }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="失效时间：" prop="invalidDate">
                  {{ form.invalidDate }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
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
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="权益订单编号：" prop="equityOrderNumber">
                  {{ form.equityOrderNumber }}
                </el-form-item>
                <el-form-item label="生效操作人：" prop="forceSystemUserId">
                  {{ form.forceSystemUserId }}
                </el-form-item>
                <el-form-item label="生效操作人：" prop="forceSystemUserName">
                  {{ form.forceSystemUserName }}
                </el-form-item>
                <el-form-item label="生效时间：" prop="forceTime">
                  {{ form.forceTime }}
                </el-form-item>
                <el-form-item label="权益商品id：" prop="interestsGoodsId">
                  {{ form.interestsGoodsId }}
                </el-form-item>
                <el-form-item label="失效原因：" prop="invalidReason">
                  {{ form.invalidReason }}
                </el-form-item>
                <el-form-item label="失效操作人：" prop="invalidSystemUserId">
                  {{ form.invalidSystemUserId }}
                </el-form-item>
                <el-form-item label="失效操作人：" prop="invalidSystemUserName">
                  {{ form.invalidSystemUserName }}
                </el-form-item>
                <el-form-item label="是否生效：" prop="isEffect">
                  {{ form.isEffect }}
                </el-form-item>
                <el-form-item label="是否退订：" prop="isUnsubscribe">
                  {{ form.isUnsubscribe }}
                </el-form-item>
                <el-form-item label="是否已拆单：" prop="separateBill">
                  {{ form.separateBill }}
                </el-form-item>
                <el-form-item label="拆单时间：" prop="separateBillData">
                  {{ form.separateBillData }}
                </el-form-item>
                <el-form-item label="整车档案id：" prop="vehProfileId">
                  {{ form.vehProfileId }}
                </el-form-item>
                <el-form-item label="退订原因：" prop="checkoutReason">
                  {{ form.checkoutReason }}
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="施工单id：" prop="serviceProxyId">
                  {{ form.serviceProxyId }}
                </el-form-item>
                <el-form-item label="核销人：" prop="writeOffUserId">
                  {{ form.writeOffUserId }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSource }}
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
import { getDetail, addOrUpdate } from '@/api/maintain/sp/ownersEquityOrder/index';
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
  mallOrderNumber: '',
  goodInterestsType: '',
  interestsGoodsCode: '',
  interestsGoodsName: '',
  orderStatus: '',
  status: '',
  dealerCode: '',
  serviceProxyCode: '',
  vehProfileVin: '',
  purchaser: '',
  purchaserPhone: '',
  saleDate: '',
  referralCode: '',
  logisticsCompanies: '',
  logisticsOrder: '',
  claimWorkHourAmount: '',
  claimPartsAmount: '',
  claimAmount: '',
  writeOffUserName: '',
  writeOffDate: '',
  unsubscribeDate: '',
  remark: '',
  invalidDate: '',
  modifierName: '',
  updateTime: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  modifier: '',
  statusDesc: '',
  name: '',
  equityOrderNumber: '',
  forceSystemUserId: '',
  forceSystemUserName: '',
  forceTime: '',
  interestsGoodsId: '',
  invalidReason: '',
  invalidSystemUserId: '',
  invalidSystemUserName: '',
  isEffect: '',
  isUnsubscribe: '',
  separateBill: '',
  separateBillData: '',
  vehProfileId: '',
  checkoutReason: '',
  ownerOrgId: '',
  dealerName: '',
  serviceProxyId: '',
  writeOffUserId: '',
  dataSource: '',
};

export default {
  name: 'ownersEquityOrderEdit',
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
      return '商城订单编号：' + this.form.mallOrderNumber;
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
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-ownersEquityOrder',
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
        mallOrderNumber: [
          { required: true, message: '请输入商城订单编号', trigger: 'change' }
        ],
        goodInterestsType: [
          { required: true, message: '请选择权益商品类型', trigger: 'change' }
        ],
        interestsGoodsCode: [
          { required: true, message: '请输入权益商品代码', trigger: 'change' }
        ],
        interestsGoodsName: [
          { required: true, message: '请输入权益商品名称', trigger: 'change' }
        ],
        orderStatus: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        serviceProxyCode: [
          { required: true, message: '请输入施工单号', trigger: 'change' }
        ],
        vehProfileVin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        purchaser: [
          { required: true, message: '请输入购买人', trigger: 'change' }
        ],
        purchaserPhone: [
          { required: true, message: '请输入购买人电话', trigger: 'change' }
        ],
        saleDate: [
          { required: true, message: '请输入购买日期', trigger: 'change' }
        ],
        referralCode: [
          { required: true, message: '请输入推荐码', trigger: 'change' }
        ],
        logisticsCompanies: [
          { required: true, message: '请输入物流商', trigger: 'change' }
        ],
        logisticsOrder: [
          { required: true, message: '请输入物流单号', trigger: 'change' }
        ],
        claimWorkHourAmount: [
          { required: true, message: '请输入工时索赔合计', trigger: 'change' }
        ],
        claimPartsAmount: [
          { required: true, message: '请输入零件索赔合计', trigger: 'change' }
        ],
        claimAmount: [
          { required: true, message: '请输入索赔合计', trigger: 'change' }
        ],
        writeOffUserName: [
          { required: true, message: '请输入核销人', trigger: 'change' }
        ],
        writeOffDate: [
          { required: true, message: '请输入核销时间', trigger: 'change' }
        ],
        unsubscribeDate: [
          { required: true, message: '请输入退订日期', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        invalidDate: [
          { required: true, message: '请输入失效时间', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
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
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        equityOrderNumber: [
          { required: true, message: '请输入权益订单编号', trigger: 'change' }
        ],
        forceSystemUserId: [
          { required: true, message: '请输入生效操作人', trigger: 'change' }
        ],
        forceSystemUserName: [
          { required: true, message: '请输入生效操作人', trigger: 'change' }
        ],
        forceTime: [
          { required: true, message: '请选择生效时间', trigger: 'change' }
        ],
        interestsGoodsId: [
          { required: true, message: '请输入权益商品id', trigger: 'change' }
        ],
        invalidReason: [
          { required: true, message: '请输入失效原因', trigger: 'change' }
        ],
        invalidSystemUserId: [
          { required: true, message: '请输入失效操作人', trigger: 'change' }
        ],
        invalidSystemUserName: [
          { required: true, message: '请输入失效操作人', trigger: 'change' }
        ],
        isEffect: [
          { required: true, message: '请输入是否生效', trigger: 'change' }
        ],
        isUnsubscribe: [
          { required: true, message: '请输入是否退订', trigger: 'change' }
        ],
        separateBill: [
          { required: true, message: '请输入是否已拆单', trigger: 'change' }
        ],
        separateBillData: [
          { required: true, message: '请输入拆单时间', trigger: 'change' }
        ],
        vehProfileId: [
          { required: true, message: '请输入整车档案id', trigger: 'change' }
        ],
        checkoutReason: [
          { required: true, message: '请输入退订原因', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        serviceProxyId: [
          { required: true, message: '请输入施工单id', trigger: 'change' }
        ],
        writeOffUserId: [
          { required: true, message: '请输入核销人', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源', trigger: 'change' }
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
