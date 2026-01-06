<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="保修月份，来自保修申请单审核通过时间 格式：年+月，如2025年1月，计为：202501" prop="warrantyMonth">
                <el-input
                  placeholder="请输入"
                  v-model="form.warrantyMonth"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件唯一码" prop="oldPartUniqueCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartUniqueCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="接车施工单" prop="serviceProxyNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.serviceProxyNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="保修申请单编码" prop="warrantyNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.warrantyNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件销毁单编码" prop="oldPartDestroyOrderNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartDestroyOrderNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店名称" prop="dealerName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否主因零部件 0:否 1:是" prop="isMainPart">
                <el-input
                  placeholder="请输入"
                  v-model="form.isMainPart"
                  clearable
                />
              </el-form-item>
              <el-form-item label="VIN" prop="vin">
                <el-input
                  placeholder="请输入"
                  v-model="form.vin"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件供应商名称" prop="oldPartSupplierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartSupplierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="主因件供应商名称" prop="mainPartSupplierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.mainPartSupplierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="责任供应商名称" prop="dutySupplierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.dutySupplierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件编码" prop="oldPartCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件名称" prop="oldPartName">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="换上零件编码" prop="partCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.partCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="换上零件名称" prop="partName">
                <el-input
                  placeholder="请输入"
                  v-model="form.partName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="主机厂库存状态 字典 old_part_inventory_oem_status" prop="oemStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.oemStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="门店入库时间" prop="dealerInTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.dealerInTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="门店出库时间" prop="dealerOutTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.dealerOutTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="门店回运单" prop="returnOrderNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.returnOrderNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="主机厂入库时间" prop="oemInTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.oemInTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="主机厂验收时间" prop="oemCheckTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.oemCheckTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="主机厂出库单编码" prop="oemOutboundOrderNo">
                <el-input
                  placeholder="请输入"
                  v-model="form.oemOutboundOrderNo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="主机厂出库时间" prop="oemOutTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.oemOutTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="旧件返还类型 字典:old_part_return_type" prop="returnType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.returnType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="销毁驳回原因" prop="destroyRejectReason">
                <el-input
                  placeholder="请输入"
                  v-model="form.destroyRejectReason"
                  clearable
                />
              </el-form-item>
              <el-form-item label="验收备注" prop="checkRemark">
                <el-input
                  placeholder="请输入"
                  v-model="form.checkRemark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.createTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creator"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者名称" prop="creatorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者名称" prop="modifierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改时间" prop="updateTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.updateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="状态变更描述" prop="statusDesc">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.statusDesc"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="数据来源，150:新销服; 老销服:10" prop="dataSource">
                <el-input
                  placeholder="请输入"
                  v-model="form.dataSource"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件销毁单ID" prop="oldPartDestroyOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartDestroyOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="接车施工单ID" prop="serviceProxyId">
                <el-input
                  placeholder="请输入"
                  v-model="form.serviceProxyId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="保修申请单ID" prop="warrantyId">
                <el-input
                  placeholder="请输入"
                  v-model="form.warrantyId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="保修申请单零件明细ID" prop="warrantyPartId">
                <el-input
                  placeholder="请输入"
                  v-model="form.warrantyPartId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="审批通过时间（保修申请单）" prop="warrantyApproveTime">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.warrantyApproveTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="门店编码" prop="dealerCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dealerCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店库存状态 字典old_inventory_dealer_status" prop="dealerStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.dealerStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="车主档案id" prop="vehOwnerId">
                <el-input
                  placeholder="请输入"
                  v-model="form.vehOwnerId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件供应商ID" prop="oldPartSupplierId">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartSupplierId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件供应商编码" prop="oldPartSupplierCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartSupplierCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="主因件供应商id" prop="mainPartSupplierId">
                <el-input
                  placeholder="请输入"
                  v-model="form.mainPartSupplierId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="主因件供应商编码" prop="mainPartSupplierCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.mainPartSupplierCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="责任供应商，来自二次索赔" prop="dutySupplierId">
                <el-input
                  placeholder="请输入"
                  v-model="form.dutySupplierId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="责任供应商编码" prop="dutySupplierCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.dutySupplierCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="旧件ID" prop="oldPartId">
                <el-input
                  placeholder="请输入"
                  v-model="form.oldPartId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="换上零件ID" prop="partId">
                <el-input
                  placeholder="请输入"
                  v-model="form.partId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="门店回运单ID" prop="returnOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.returnOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="主机厂出库单ID" prop="oemOutboundOrderId">
                <el-input
                  placeholder="请输入"
                  v-model="form.oemOutboundOrderId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="不合格编码" prop="unqualifiedCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.unqualifiedCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="不合格描述" prop="unqualifiedDesc">
                <el-input
                  placeholder="请输入"
                  v-model="form.unqualifiedDesc"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否连带出库" prop="isAssociatedOut">
                <el-input
                  placeholder="请输入"
                  v-model="form.isAssociatedOut"
                  clearable
                />
              </el-form-item>
              <el-form-item label="主机厂仓库" prop="oemWarehouseId">
                <el-input
                  placeholder="请输入"
                  v-model="form.oemWarehouseId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="仓库编码" prop="oemWarehouseCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.oemWarehouseCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="仓库名称" prop="oemWarehouseName">
                <el-input
                  placeholder="请输入"
                  v-model="form.oemWarehouseName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="归属用户ID，当数据权限归属到用户时" prop="ownerUserId">
                <el-input
                  placeholder="请输入"
                  v-model="form.ownerUserId"
                  clearable
                />
              </el-form-item>
              <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级" prop="ownerOrgId">
                <el-input
                  placeholder="请输入"
                  v-model="form.ownerOrgId"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/oldpart/inventory/oem';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  warrantyMonth: '',
  oldPartUniqueCode: '',
  serviceProxyNo: '',
  warrantyNo: '',
  oldPartDestroyOrderNo: '',
  dealerName: '',
  isMainPart: '',
  vin: '',
  oldPartSupplierName: '',
  mainPartSupplierName: '',
  dutySupplierName: '',
  oldPartCode: '',
  oldPartName: '',
  partCode: '',
  partName: '',
  oemStatus: '',
  dealerInTime: '',
  dealerOutTime: '',
  returnOrderNo: '',
  oemInTime: '',
  oemCheckTime: '',
  oemOutboundOrderNo: '',
  oemOutTime: '',
  returnType: '',
  remark: '',
  destroyRejectReason: '',
  checkRemark: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  oldPartDestroyOrderId: '',
  serviceProxyId: '',
  warrantyId: '',
  warrantyPartId: '',
  warrantyApproveTime: '',
  dealerCode: '',
  dealerStatus: '',
  vehOwnerId: '',
  oldPartSupplierId: '',
  oldPartSupplierCode: '',
  mainPartSupplierId: '',
  mainPartSupplierCode: '',
  dutySupplierId: '',
  dutySupplierCode: '',
  oldPartId: '',
  partId: '',
  returnOrderId: '',
  oemOutboundOrderId: '',
  unqualifiedCode: '',
  unqualifiedDesc: '',
  isAssociatedOut: '',
  oemWarehouseId: '',
  oemWarehouseCode: '',
  oemWarehouseName: '',
  ownerUserId: '',
  ownerOrgId: '',
};

export default {
  name: 'oemInventoryEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
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
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-oldPartOemInventoryDetail',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        warrantyMonth: [
          { required: true, message: '请输入保修月份，来自保修申请单审核通过时间 格式：年+月，如2025年1月，计为：202501', trigger: 'change' }
        ],
        oldPartUniqueCode: [
          { required: true, message: '请输入旧件唯一码', trigger: 'change' }
        ],
        serviceProxyNo: [
          { required: true, message: '请输入接车施工单', trigger: 'change' }
        ],
        warrantyNo: [
          { required: true, message: '请输入保修申请单编码', trigger: 'change' }
        ],
        oldPartDestroyOrderNo: [
          { required: true, message: '请输入旧件销毁单编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        isMainPart: [
          { required: true, message: '请输入是否主因零部件 0:否 1:是', trigger: 'change' }
        ],
        vin: [
          { required: true, message: '请输入VIN', trigger: 'change' }
        ],
        oldPartSupplierName: [
          { required: true, message: '请输入旧件供应商名称', trigger: 'change' }
        ],
        mainPartSupplierName: [
          { required: true, message: '请输入主因件供应商名称', trigger: 'change' }
        ],
        dutySupplierName: [
          { required: true, message: '请输入责任供应商名称', trigger: 'change' }
        ],
        oldPartCode: [
          { required: true, message: '请输入旧件编码', trigger: 'change' }
        ],
        oldPartName: [
          { required: true, message: '请输入旧件名称', trigger: 'change' }
        ],
        partCode: [
          { required: true, message: '请输入换上零件编码', trigger: 'change' }
        ],
        partName: [
          { required: true, message: '请输入换上零件名称', trigger: 'change' }
        ],
        oemStatus: [
          { required: true, message: '请选择主机厂库存状态 字典 old_part_inventory_oem_status', trigger: 'change' }
        ],
        dealerInTime: [
          { required: true, message: '请选择门店入库时间', trigger: 'change' }
        ],
        dealerOutTime: [
          { required: true, message: '请选择门店出库时间', trigger: 'change' }
        ],
        returnOrderNo: [
          { required: true, message: '请输入门店回运单', trigger: 'change' }
        ],
        oemInTime: [
          { required: true, message: '请选择主机厂入库时间', trigger: 'change' }
        ],
        oemCheckTime: [
          { required: true, message: '请选择主机厂验收时间', trigger: 'change' }
        ],
        oemOutboundOrderNo: [
          { required: true, message: '请输入主机厂出库单编码', trigger: 'change' }
        ],
        oemOutTime: [
          { required: true, message: '请选择主机厂出库时间', trigger: 'change' }
        ],
        returnType: [
          { required: true, message: '请选择旧件返还类型 字典:old_part_return_type', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        destroyRejectReason: [
          { required: true, message: '请输入销毁驳回原因', trigger: 'change' }
        ],
        checkRemark: [
          { required: true, message: '请输入验收备注', trigger: 'change' }
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
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        oldPartDestroyOrderId: [
          { required: true, message: '请输入旧件销毁单ID', trigger: 'change' }
        ],
        serviceProxyId: [
          { required: true, message: '请输入接车施工单ID', trigger: 'change' }
        ],
        warrantyId: [
          { required: true, message: '请输入保修申请单ID', trigger: 'change' }
        ],
        warrantyPartId: [
          { required: true, message: '请输入保修申请单零件明细ID', trigger: 'change' }
        ],
        warrantyApproveTime: [
          { required: true, message: '请选择审批通过时间（保修申请单）', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerStatus: [
          { required: true, message: '请选择门店库存状态 字典old_inventory_dealer_status', trigger: 'change' }
        ],
        vehOwnerId: [
          { required: true, message: '请输入车主档案id', trigger: 'change' }
        ],
        oldPartSupplierId: [
          { required: true, message: '请输入旧件供应商ID', trigger: 'change' }
        ],
        oldPartSupplierCode: [
          { required: true, message: '请输入旧件供应商编码', trigger: 'change' }
        ],
        mainPartSupplierId: [
          { required: true, message: '请输入主因件供应商id', trigger: 'change' }
        ],
        mainPartSupplierCode: [
          { required: true, message: '请输入主因件供应商编码', trigger: 'change' }
        ],
        dutySupplierId: [
          { required: true, message: '请输入责任供应商，来自二次索赔', trigger: 'change' }
        ],
        dutySupplierCode: [
          { required: true, message: '请输入责任供应商编码', trigger: 'change' }
        ],
        oldPartId: [
          { required: true, message: '请输入旧件ID', trigger: 'change' }
        ],
        partId: [
          { required: true, message: '请输入换上零件ID', trigger: 'change' }
        ],
        returnOrderId: [
          { required: true, message: '请输入门店回运单ID', trigger: 'change' }
        ],
        oemOutboundOrderId: [
          { required: true, message: '请输入主机厂出库单ID', trigger: 'change' }
        ],
        unqualifiedCode: [
          { required: true, message: '请输入不合格编码', trigger: 'change' }
        ],
        unqualifiedDesc: [
          { required: true, message: '请输入不合格描述', trigger: 'change' }
        ],
        isAssociatedOut: [
          { required: true, message: '请输入是否连带出库', trigger: 'change' }
        ],
        oemWarehouseId: [
          { required: true, message: '请输入主机厂仓库', trigger: 'change' }
        ],
        oemWarehouseCode: [
          { required: true, message: '请输入仓库编码', trigger: 'change' }
        ],
        oemWarehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'change' }
        ],
        ownerUserId: [
          { required: true, message: '请输入归属用户ID，当数据权限归属到用户时', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
