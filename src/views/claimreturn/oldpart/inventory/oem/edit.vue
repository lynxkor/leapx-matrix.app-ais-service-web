<template>
  <edit-page-layout ref="editLayout" title="" >
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`唯一旧件码：${form.oldPartUniqueCode}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        direction="horizontal"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #extraButtons>
          <!-- 验收不合格的单子才展示 -->
          <el-button v-if="form.oemStatus === '800'" @click="onPrint" size="small">打印标签</el-button>
          <el-button v-if="canAddOrUpdate && form.oemStatus === '800'" @click="onSecondAcceptance" size="small">二次验收</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="旧件唯一码：" prop="oldPartUniqueCode">
                  {{ form.oldPartUniqueCode }}
                </el-form-item>
                <el-form-item label="旧件编码：" prop="oldPartCode">
                  <el-button class="link" @click="$router.push('/sparepart/basic/sparePart/detail?id=' + form.oldPartId)" type="text">{{form.oldPartCode}}</el-button>
                </el-form-item>
                <el-form-item label="旧件名称：" prop="oldPartName">
                  {{form.oldPartName}}
                </el-form-item>
                <el-form-item label="旧件返还类型：" prop="returnTypeLabel">
                  {{form.returnTypeLabel}}
                </el-form-item>
                <el-form-item label="换上零件编码：" prop="partCode">
                  <el-button class="link" @click="$router.push('/sparepart/basic/sparePart/detail?id=' + form.partId)" type="text">{{form.partCode}}</el-button>
                </el-form-item>
                <el-form-item label="换上零件名称：" prop="partName">
                  {{form.partName}}
                </el-form-item>
                <el-form-item label="主机厂库存状态：" prop="oemStatusLabel">
                  {{form.oemStatusLabel}}
                </el-form-item>
                <el-form-item label="门店库存状态：" prop="dealerStatusLabel">
                  {{form.dealerStatusLabel}}
                </el-form-item>
                <el-form-item label="数量：" prop="oldPartQuantity">
                  {{form.oldPartQuantity}}
                </el-form-item>
                <el-form-item label="旧件供应商：" prop="oldPartSupplierName">
                  <el-button class="link" @click="$router.push('/sparepart/basic/supplierInfo/detail?id=' + form.oldPartSupplierId)" type="text">{{form.oldPartSupplierName}}</el-button>
                </el-form-item>
                <el-form-item label="是否主因零部件：" prop="isMainPartLabel">
                  {{form.isMainPartLabel}}
                </el-form-item>
                <el-form-item label="主因件供应商：" prop="mainPartSupplierName">
                  <el-button class="link" @click="$router.push('/sparepart/basic/supplierInfo/detail?id=' + form.mainPartSupplierId)" type="text">{{form.mainPartSupplierName}}</el-button>
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  {{form.vin}}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-button class="link"
                   @click="navigateToRoute({
                      path: '/partner/channelManagement/shopDetail',
                      query: {
                        dealerCode: form.dealerCode,
                      },
                    })"
                   type="text">{{form.dealerName}}</el-button>
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyNo">
                  <el-button class="link" @click="$router.push(`/maintain/sp/serviceProxy/edit?id=${form.serviceProxyId}`)" type="text">{{form.serviceProxyNo}}</el-button>
                </el-form-item>
                <!-- TODO 这里需要跳转 -->
                <el-form-item label="保修申请单：" prop="warrantyNo">
                  {{ form.warrantyNo }}
                </el-form-item>
                <el-form-item label="保修零件明细：" prop="warrantyPartId">
                  {{form.warrantyPartId}}
                </el-form-item>
                <el-form-item label="二次索赔明细：" prop="dutySupplierId">
                  {{form.dutySupplierId}}
                </el-form-item>
                <el-form-item label="索赔追溯单号：" prop="claimTrackNo">
                  {{ form.claimTrackNo }}
                </el-form-item>
                <!--  -->
                <el-form-item v-show="isEditing || !_id" class="form-item-full" label="备注：" prop="remark">
                  <base-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    :rows="2"
                    maxLength="1000"
                  />
                </el-form-item>
                <el-form-item v-show="!(isEditing || !_id)" class="form-item-full" label="备注：" prop="remark">
                   {{form.remark}}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>回运信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" label-width="150px"  class="form-detail">
                <el-form-item label="门店入库时间：" prop="dealerInTime">
                  {{form.dealerInTime}}
                </el-form-item>
                <el-form-item label="门店出库时间：" prop="dealerOutTime">
                  {{form.dealerOutTime}}
                </el-form-item>
                <el-form-item label="门店回运单：" prop="returnOrderNo">
                  {{form.returnOrderNo}}
                </el-form-item>
                <el-form-item label="主机厂验收时间：" prop="oemCheckTime">
                  {{form.oemCheckTime}}
                </el-form-item>
                <el-form-item label="主机厂入库时间：" prop="oemInTime">
                  {{form.oemInTime}}
                </el-form-item>
                <el-form-item class="form-item-full" label="验收备注：" prop="checkRemark">
                  {{form.checkRemark}}
                </el-form-item>
                <el-form-item class="form-item-full" label="不合格描述：" prop="unqualifiedDesc">
                  {{form.unqualifiedDesc}}
                </el-form-item>
                <el-form-item class="form-item-full" label="关联快返回运单号：" prop="returnOrderHisList">
                  <span
                    v-for="(item, index) in form.returnOrderHisList" :key="item.returnOrderId"
                    class="href-link"
                    @click="() => {
                      $router.push({
                        path: '/claimreturn/oldpart/returnorder/edit',
                        query: {
                          id: item.returnOrderId,
                        }
                      });
                    }" >
                    {{ item.returnOrderNo }}
                    <span v-if="index !== form.returnOrderHisList.length - 1">,</span>
                  </span>
                </el-form-item>
                <el-form-item class="form-item-full" label="附件材料：">
                  <AisAttachment
                    ref="attachment"
                    :businessId="_id"
                    :readonly="true"
                  />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>出库信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" label-width="150px"  class="form-detail">
                <el-form-item label="主机厂出库单：" prop="oemOutboundOrderNo">
                  {{ form.oemOutboundOrderNo }}
                </el-form-item>
                <el-form-item label="主机厂仓库：" prop="oemWarehouseId">
                  {{ form.oemWarehouseId }}
                </el-form-item>
                <el-form-item label="主机厂出库时间：" prop="oemOutTime">
                  {{form.oemOutTime}}
                </el-form-item>
                <el-form-item label="是否连带出库：" prop="isAssociatedOutLabel">
                  {{form.isAssociatedOutLabel}}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>销毁信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" label-width="150px"  class="form-detail">
                <el-form-item label="旧件销毁单：" prop="oldPartDestroyOrderNo">
                  <el-button class="link" @click="$router.push(`/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit?id=${form.oldPartDestroyOrderId}`)" type="text">{{form.oldPartDestroyOrderNo}}</el-button>
                </el-form-item>
                <!--  -->
                <el-form-item label="销毁驳回原因：" prop="destroyRejectReason">
                  {{form.destroyRejectReason}}
                </el-form-item>
                <el-form-item class="form-item-full" label="附件材料：">
                  <AisAttachment
                    :businessId="form.oldPartDestroyOrderId || ''"
                    :readonly="true"
                    configCode="mcs_spmusedprtdestory_apply"
                    attachType="其他"
                  />
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
        <second-dialog
          :visible.sync="visible"
          :_id="_id"
          @refresh="refresh"
        />
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/oldpart/inventory/oem';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditPageLayout from '@/libs/components/EditPageLayout';
import commonMixins from '@/libs/mixins/commonMixins';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import AisAttachment from '@/libs/components/AisAttachment';
import SecondDialog from './SecondDialog/index.vue';

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
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    EditPageLayout,
    BaseInput,
    AisAttachment,
    SecondDialog,
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
      pageTitle: this.$route.meta.name,
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: this.$route.meta.moduleKey,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
      },
      visible: false,
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
    },
    onSecondAcceptance () {
      // 二次验收
      this.visible = true;
    },
    onPrint () {
      this.$print.show({
        id: new Date().getTime() + '',
        template: 'OldPartMark',
        title: '保修旧件标签',
        data: [this._id],
        width: 1122,
      });
    },
    refresh () {
      this.$refs.containerRef.loadDetail();
      this.$refs.attachment.update();
    }
  }
};
</script>
