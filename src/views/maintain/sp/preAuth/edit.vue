<template>
  <edit-page-layout ref="editLayout" title="预授权申请" showPaneFooter>
    <template #left>
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
          <span class="status primary" v-if="form.statusDesc">{{ form.statusDesc }}</span>
        </template>
        <template #extraButtons>
          <el-button size="small" @click="handleShowLog" v-if="_id">审核日志</el-button>
        </template>
        <template #footer>
          <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitRequest(0)" :loading="loading">保存</el-button>
          <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitRequest(1)" :loading="loading">提交</el-button>
        </template>
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="申请单号：">
                  <el-input v-model="form.code" :disabled="true" placeholder="保存后自动生成" />
                </el-form-item>
                <el-form-item label="施工单号：" prop="serviceProxyCode">
                  <fetch-select
                    :remote-method="queryServiceProxy"
                    remote
                    v-model="form.serviceProxyCode"
                    value-key="id"
                    label-key="code"
                    placeholder="请选择施工单"
                    clearable
                    filterable
                    @change="handleServiceProxyChange"
                  />
                </el-form-item>
                <el-form-item label="预授权类型：" prop="preAuthType">
                  <!-- <el-radio-group v-model="form.preAuthType">
                    <el-radio :label="1">技术预授权</el-radio>
                    <el-radio :label="2">保修预授权</el-radio>
                  </el-radio-group> -->
                <fetch-select
                  :request="fetchOptions"
                  enumCode="PreAuthTypeEnum"
                  v-model="form.preAuthType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
                </el-form-item>
                <el-form-item label="门店名称：">
                  <el-input v-model="form.dealerName" disabled />
                </el-form-item>
                <el-form-item label="门店编码：">
                  <el-input v-model="form.dealerCode" disabled />
                </el-form-item>
                <el-form-item label="门店所属区域：">
                  <el-input v-model="form.dealerUnitName" disabled />
                </el-form-item>
                <el-form-item label="申请原因：" prop="reason" class="form-item-full">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入申请原因，限200字符"
                    v-model="form.reason"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请单号：">
                  <span>{{ form.code || '-' }}</span>
                </el-form-item>
                <el-form-item label="施工单号：">
                  <span>{{ form.serviceProxyCode || '-' }}</span>
                </el-form-item>
                <el-form-item label="预授权类型：">
                  <span>{{ form.preAuthType === 1 ? '技术预授权' : form.preAuthType === 2 ? '保修预授权' : '-' }}</span>
                </el-form-item>
                <el-form-item label="门店名称：">
                  <span>{{ form.dealerName || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店编码：">
                  <span>{{ form.dealerCode || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店所属区域：">
                  <span>{{ form.dealerUnitName || '-' }}</span>
                </el-form-item>
                <el-form-item label="申请原因：">
                  <span>{{ form.reason || '-' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 车辆信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>车辆信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="车主姓名：">
                  <span>{{ serviceProxyDetail?.customerName || '-' }}</span>
                </el-form-item>
                <el-form-item label="送修人：">
                  <span>{{ serviceProxyDetail?.shuttleName || '-' }}</span>
                </el-form-item>
                <el-form-item label="送修人手机：">
                  <span>{{ serviceProxyDetail?.shuttlePhone || '-' }}</span>
                </el-form-item>
                <el-form-item label="VIN：">
                  <span>{{ serviceProxyDetail?.vehProfileVin || '-' }}</span>
                </el-form-item>
                <el-form-item label="车型：">
                  <span>{{ serviceProxyDetail?.vehModelName || '-' }}</span>
                </el-form-item>
                <el-form-item label="车牌号：">
                  <span>{{ serviceProxyDetail?.carPlate || '-' }}</span>
                </el-form-item>
                <el-form-item label="车辆用途：">
                  <span>{{ serviceProxyDetail?.carPropertyLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="进店里程数：">
                  <span>{{ serviceProxyDetail?.mileage || '-' }}</span>
                </el-form-item>
                <el-form-item label="生产日期：">
                  <span>{{ serviceProxyDetail?.productionTime || '-' }}</span>
                </el-form-item>
                <el-form-item label="终身免保：">
                  <span>{{ serviceProxyDetail?.warrantyLifeLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="终身质保：">
                  <span>{{ serviceProxyDetail?.isLifetimeLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="保修开始日期：">
                  <span>{{ serviceProxyDetail?.startWarrantyDate || '-' }}</span>
                </el-form-item>
                <el-form-item label="保修结束日期：">
                  <span>{{ serviceProxyDetail?.endWarrantyDate || '-' }}</span>
                </el-form-item>
                <el-form-item label="服务月份：">
                  <span>{{ serviceProxyDetail?.serviceMonth || '-' }}</span>
                </el-form-item>
                <el-form-item label="三包预警：">
                  <span>{{ serviceProxyDetail?.alarmLevelLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="预警信息：">
                  <span>{{ serviceProxyDetail?.alarmInfo || '-' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 质量反馈信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>质量反馈信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="质量反馈单号：" prop="qualityOrderReportId">
                  <fetch-select
                    :remote-method="queryQualityReport"
                    remote
                    v-model="form.qualityOrderReportId"
                    value-key="id"
                    label-key="code"
                    placeholder="请选择质量反馈单"
                    clearable
                    filterable
                    @change="handleQualityReportChange"
                  />
                </el-form-item>
                <el-form-item label="故障现象描述：">
                  <el-input
                    type="text"
                    placeholder="故障现象描述"
                    v-model="form.faultInfo"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="故障排查流程：">
                  <el-input
                    type="text"
                    placeholder="故障排查流程"
                    v-model="form.troubleshootingProcess"
                    disabled
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="质量反馈单号：">
                  <span>{{ form.qualityOrderReport || '-' }}</span>
                </el-form-item>
                <el-form-item label="故障现象描述：">
                  <span>{{ form?.qualityOrderReportResp?.customerContent || '-' }}</span>
                </el-form-item>
                <el-form-item label="故障排查流程：">
                  <span>{{ form?.qualityOrderReportResp?.troubleshootingProcess || '-' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 费用信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>费用信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="repairTableRef"
                  stripe
                  :data="serviceProxyDetail?.costCountResp?.repairItemRespList || serviceProxyDetail?.spRepairItemResps || []"
                  show-overflow
                  :row-config="{ isHover: true }"
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="500px"
                >
                  <vxe-column field="repairItemCode" title="维修项目代码" width="200px">
                    <template #default="{ row }">
                      <el-link type="success" :href="`/service/maintain/basic/repairItem/detail?id=${row.repairItemId}`" target="_blank">{{ row.repairItemCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="repairItemName" title="维修项目名称" min-width="150" />
                  <vxe-column field="repairItemTypeName" title="维修类型" min-width="100" />
                  <vxe-column field="checkoutTypeName" title="结算类型" min-width="100" />
                  <vxe-column field="warrantyTypeName" title="保修类型" min-width="100" />
                  <vxe-column field="isAddItems" title="是否增项" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.isAddItems === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="price" title="工时单价" min-width="100" />
                  <vxe-column field="workHour" title="工时数" min-width="80" />
                  <vxe-column field="discountAmount" title="优惠金额" min-width="100" />
                  <vxe-column field="discountRate" title="折扣率" min-width="80" />
                  <vxe-column field="repairAmount" title="项目金额" min-width="100" />
                  <vxe-column field="packageCode" title="套餐代码" min-width="120" />
                  <vxe-column field="createTime" title="创建时间" min-width="160" sortable />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
              </div>
              <div class="common-section-table" style="margin-top: 20px;">
                <vxe-table
                  ref="partsTableRef"
                  stripe
                  :data="serviceProxyDetail?.costCountResp?.sparePartRespList || []"
                  show-overflow
                  :row-config="{ isHover: true }"
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="500px"
                >
                  <vxe-column field="partsCode" title="零件代码" width="200px" >
                    <template #default="{ row }">
                      <el-link type="success" :href="`/service/sparepart/basic/sparePart/detail?id=${row.partsId}`" target="_blank">{{ row.partsCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="partsName" title="零件名称" min-width="150" />
                  <vxe-column field="repairItemTypeName" title="维修类型" min-width="100" />
                  <vxe-column field="isOutstock" title="是否出库" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.isOutstock === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="checkoutTypeName" title="结算类型" min-width="100" />
                  <vxe-column field="warrantyTypeName" title="保修类型" min-width="100" />
                  <vxe-column field="isAddItems" title="是否增项" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.isAddItems === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="isOemPart" title="是否原厂" min-width="80">
                    <template #default="{ row }">
                      <span>{{ row.isOemPart === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="quantity" title="数量" min-width="80" />
                  <vxe-column field="price" title="单价" min-width="100" />
                  <vxe-column field="discountAmount" title="优惠金额" min-width="100" />
                  <vxe-column field="discountRate" title="折扣率" min-width="80" />
                  <vxe-column field="partsAmount" title="配件金额" min-width="100" />
                  <vxe-column field="isBindItem" title="是否与工时组合" min-width="120">
                    <template #default="{ row }">
                      <span>{{ row.isBindItem === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="repairItemCode" title="维修项目代码" min-width="120" />
                  <vxe-column field="repairItemName" title="维修项目名称" min-width="150" />
                  <vxe-column field="packageCode" title="套餐代码" min-width="120" />
                  <vxe-column field="packageName" title="套餐名称" min-width="120" />
                  <vxe-column field="createTime" title="创建时间" min-width="160" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
              </div>
            </div>
          </section>

          <!-- 审批信息 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="审批状态：">
                  <span>{{ form.approvalStatusLabel }}</span>
                </el-form-item>
                <el-form-item label="审批人：">
                  <span>{{ form.approver || '-' }}</span>
                </el-form-item>
                <el-form-item label="审批时间：">
                  <span>{{ form.approvalOn || '-' }}</span>
                </el-form-item>
                <el-form-item label="审批意见：">
                  <span>{{ form.approvalContent || '-' }}</span>
                </el-form-item>
                <el-form-item label="提交人：">
                  <span>{{ form.subUser || '-' }}</span>
                </el-form-item>
                <el-form-item label="提交时间：">
                  <span>{{ form.subDateTime || '-' }}</span>
                </el-form-item>
                <el-form-item label="审批单号：">
                  <span>{{ form.auditNo || '-' }}</span>
                </el-form-item>
                <el-form-item label="申请驳回状态：">
                  <span>{{ form.applyRejectStatus === 1 ? '是' : form.applyRejectStatus === 0 ? '否' : '-' }}</span>
                </el-form-item>
                <el-form-item label="申请驳回原因：" v-if="form.applyRejectStatus">
                  <span>{{ form.rejectReason || '-' }}</span>
                </el-form-item>
                <el-form-item label="申请驳回时间：" v-if="form.applyRejectStatus">
                  <span>{{ form.rejectTime || '-' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 附件信息 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件信息</h2>
            </div>
            <div class="common-section-body">
              <Attachment :_id="_id" :attachType="'PRE_AUTH'" ref="attachmentRef"/>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getServiceProxyList, getServiceProxyDetail } from '@/api/maintain/sp/preAuth/index';
import { getList as getQualityReportList } from '@/api/maintain/sp/qualityOrderReport/index';
import { selectServiceProxy as selectServiceProxyApi, getEnum } from '@/api/maintain/sp/serviceProxy/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import Attachment from '@/views/maintain/sp/serviceProxy/components/Attachment/index.vue';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  serviceProxyId: '',
  serviceProxyCode: '',
  preAuthType: '',
  dealerName: '',
  dealerCode: '',
  dealerUnitName: '',
  reason: '',
  // 车辆信息
  ownerName: '',
  senderName: '',
  senderPhone: '',
  vehProfileVin: '',
  vehicleModel: '',
  licensePlateNo: '',
  carPropertyLabel: '',
  mileage: '',
  productionTime: '',
  warrantyLifeLabel: '',
  isLifetimeLabel: '',
  guaranteeStartDate: '',
  warrantyEndTime: '',
  serviceMonth: '',
  alarmLevelLabel: '',
  alarmInfo: '',
  // 质量反馈
  qualityOrderReportId: '',
  qualityOrderReport: '',
  faultInfo: '',
  troubleshootingProcess: '',
  // 状态信息
  statusDesc: '',
  approver: '',
  approvalOn: '',
  modifierName: '',
  updateTime: '',
  creatorName: '',
  createTime: '',
  // 审批相关
  approvalContent: '',
  approvalStatus: '',
  approverId: '',
  subDateTime: '',
  subUser: '',
  approvedLaborClaimTotal: '',
  approvedOtherClaimTotal: '',
  approvedPartsClaimTotal: '',
  auditNo: '',
  laborCostRatio: '',
  otherCostSharingRatio: '',
  partsCostRatio: '',
  applyReject: '',
  applyRejectStatus: '',
  approvalSource: '',
  carProperty: '',
  rejectReason: '',
  rejectTime: '',
  warrantyLife: ''
};

export default {
  name: 'preAuthEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
    Attachment
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '申请单号：' + (this.form.code || '新增');
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
    return {
      pageTitle: '预授权申请表管理',
      pageType: 'edit',
      moduleKey: 'AISMC-preAuth',
      loading: false,
      submitLoading: false,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      emptyText: '暂无数据',
      serviceProxyDetail: {}, // 施工单详情数据（仅用于展示）
      rules: {
        serviceProxyId: [
          { required: true, message: '请选择施工单', trigger: 'change' }
        ],
        preAuthType: [
          { required: true, message: '请选择预授权类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' },
          { max: 200, message: '申请原因不能超过200字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 直接保存预授权详情数据（包含费用信息和审批信息）
          this.serviceProxyDetail = res;
          // 将审批相关数据合并到form中（用于提交）
          Object.assign(this.form, res);
          return res;
        });
      }
    },
    submitRequest (v) {
      // 表单校验
      return this.$refs.ruleForm.validate().then(() => {
        addOrUpdate({
          saveOrSubmit: v,
          reason: this.form.reason,
          serviceProxyId: this.form.serviceProxyId,
          serviceProxyCode: this.form.serviceProxyCode,
          preAuthType: this.form.preAuthType,
          qualityOrderReportId: this.form.qualityOrderReportId || '019CFA53-2731-7B3B-9D95-F7F541872B46',
          qualityOrderReport: this.form.qualityOrderReport || 'ZLR-202603171344380001',
        }).then(res => {
          this.$message.success('保存成功');
          this.$router.replace({ path: '/maintain/sp/preAuth/edit', query: { id: res } });
        });
      });
    },
    handleShowLog () {
      this.$auditLog.show({ id: this._id });
    },
    async queryServiceProxy (queryString) {
      if (!queryString) {
        return;
      }
      return new Promise(resolve => {
        selectServiceProxyApi({ code: queryString, pageSize: 20, pageNum: 1 }).then(res => {
          const list = res || [];
          resolve(list);
        }).catch(() => {
          resolve([]);
        });
      });
    },
    async queryQualityReport (queryString) {
      return new Promise(resolve => {
        if (!queryString) {
          resolve([]);
          return;
        }
        // 调用质量反馈单分页查询接口
        getQualityReportList({
          codeLike: queryString,
          pageSize: 20,
          pageNum: 1
        }).then(res => {
          const list = res?.records || [];
          resolve(list);
        }).catch(() => {
          resolve([]);
        });
      });
    },
    handleServiceProxyChange (val, record) {
      if (!record || !record.id) {
        return;
      }

      // 填充施工单基础信息到form（用于提交）
      this.form.serviceProxyCode = record.code;
      this.form.serviceProxyId = record.id;

      // 如果是新增模式，根据施工单ID获取详细信息
      if (!this._id && record.id) {
        getServiceProxyDetail(record.id).then(detailRes => {
          if (detailRes) {
            // 直接保存接口返回的数据，用于展示
            this.serviceProxyDetail = detailRes;

            // 设置预授权类型（如果有）
            if (detailRes.preAuthType) {
              this.form.preAuthType = detailRes.preAuthType;
            }
          }
        }).catch(error => {
          console.error('获取施工单详情失败:', error);
        });
      }
    },
    handleQualityReportChange (val, record) {
      if (!record) {
        // 清空选择时，同时清空反显的值
        this.form.qualityOrderReportId = '';
        this.form.qualityOrderReport = '';
        this.form.faultInfo = '';
        this.form.troubleshootingProcess = '';
        return;
      }
      // 关联质量反馈信息
      this.form.qualityOrderReportId = record.id || '';
      this.form.qualityOrderReport = record.code || '';
      // 反显字段：故障现象描述（customerContent）、故障检查过程（diagnosisContent）、故障排查流程（troubleshootingProcess）
      this.form.faultInfo = record.customerContent || '';
      this.form.troubleshootingProcess = record.diagnosisContent || record.troubleshootingProcess || '';
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-pre-auth-edit {
}
</style>
