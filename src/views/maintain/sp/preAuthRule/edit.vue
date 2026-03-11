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
          <span class="status primary" v-if="form.statusLabel">{{ form.statusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button size="small" @click="handleShowLog" v-if="_id">审核日志</el-button>
        </template>
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="申请单号：">
                  <span>{{ form.applyNo || '保存后自动生成' }}</span>
                </el-form-item>
                <el-form-item label="施工单号：" prop="serviceProxyId">
                  <fetch-select
                    :remote-method="queryServiceProxy"
                    remote
                    v-model="form.serviceProxyId"
                    value-key="id"
                    label-key="code"
                    placeholder="请选择施工单"
                    clearable
                    filterable
                    @change="handleServiceProxyChange"
                  />
                </el-form-item>
                <el-form-item label="预授权类型：" prop="preAuthType">
                  <el-radio-group v-model="form.preAuthType">
                    <el-radio label="1">技术预授权</el-radio>
                    <el-radio label="2">保修预授权</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="门店名称：">
                  <span>{{ form.dealerName || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店编码：">
                  <span>{{ form.dealerCode || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店所属区域：">
                  <span>{{ form.regionName || '-' }}</span>
                </el-form-item>
                <el-form-item label="申请原因：" prop="applyReason">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入申请原因，限200字符"
                    v-model="form.applyReason"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="车主姓名：">
                  <span>{{ form.ownerName || '-' }}</span>
                </el-form-item>
                <el-form-item label="送修人：">
                  <span>{{ form.senderName || '-' }}</span>
                </el-form-item>
                <el-form-item label="送修人手机：">
                  <span>{{ form.senderPhone || '-' }}</span>
                </el-form-item>
                <el-form-item label="VIN：">
                  <span>{{ form.vin || '-' }}</span>
                </el-form-item>
                <el-form-item label="车型：">
                  <span>{{ form.vehicleModel || '-' }}</span>
                </el-form-item>
                <el-form-item label="车牌号：">
                  <span>{{ form.plateNo || '-' }}</span>
                </el-form-item>
                <el-form-item label="车辆用途：">
                  <span>{{ form.vehicleUseLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="进店里程数：">
                  <span>{{ form.mileage || '-' }}</span>
                </el-form-item>
                <el-form-item label="生产日期：">
                  <span>{{ form.productionDate || '-' }}</span>
                </el-form-item>
                <el-form-item label="终身免保：">
                  <span>{{ form.isLifetimeFreeLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="终身质保：">
                  <span>{{ form.isLifetimeWarrantyLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="保修开始日期：">
                  <span>{{ form.warrantyStartDate || '-' }}</span>
                </el-form-item>
                <el-form-item label="保修结束日期：">
                  <span>{{ form.warrantyEndDate || '-' }}</span>
                </el-form-item>
                <el-form-item label="服务月份：">
                  <span>{{ form.serviceMonth || '-' }}</span>
                </el-form-item>
                <el-form-item label="三包预警：">
                  <span>{{ form.threePackWarning || '-' }}</span>
                </el-form-item>
                <el-form-item label="预警信息：">
                  <span>{{ form.warningInfo || '-' }}</span>
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="申请单号：">
                  <span>{{ form.applyNo || '-' }}</span>
                </el-form-item>
                <el-form-item label="施工单号：">
                  <span>{{ form.serviceProxyCode || '-' }}</span>
                </el-form-item>
                <el-form-item label="预授权类型：">
                  <span>{{ form.preAuthTypeLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店名称：">
                  <span>{{ form.dealerName || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店编码：">
                  <span>{{ form.dealerCode || '-' }}</span>
                </el-form-item>
                <el-form-item label="门店所属区域：">
                  <span>{{ form.regionName || '-' }}</span>
                </el-form-item>
                <el-form-item label="申请原因：">
                  <span>{{ form.applyReason || '-' }}</span>
                </el-form-item>
                <el-form-item label="车主姓名：">
                  <span>{{ form.ownerName || '-' }}</span>
                </el-form-item>
                <el-form-item label="送修人：">
                  <span>{{ form.senderName || '-' }}</span>
                </el-form-item>
                <el-form-item label="送修人手机：">
                  <span>{{ form.senderPhone || '-' }}</span>
                </el-form-item>
                <el-form-item label="VIN：">
                  <span>{{ form.vin || '-' }}</span>
                </el-form-item>
                <el-form-item label="车型：">
                  <span>{{ form.vehicleModel || '-' }}</span>
                </el-form-item>
                <el-form-item label="车牌号：">
                  <span>{{ form.plateNo || '-' }}</span>
                </el-form-item>
                <el-form-item label="车辆用途：">
                  <span>{{ form.vehicleUseLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="进店里程数：">
                  <span>{{ form.mileage || '-' }}</span>
                </el-form-item>
                <el-form-item label="生产日期：">
                  <span>{{ form.productionDate || '-' }}</span>
                </el-form-item>
                <el-form-item label="终身免保：">
                  <span>{{ form.isLifetimeFreeLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="终身质保：">
                  <span>{{ form.isLifetimeWarrantyLabel || '-' }}</span>
                </el-form-item>
                <el-form-item label="保修开始日期：">
                  <span>{{ form.warrantyStartDate || '-' }}</span>
                </el-form-item>
                <el-form-item label="保修结束日期：">
                  <span>{{ form.warrantyEndDate || '-' }}</span>
                </el-form-item>
                <el-form-item label="服务月份：">
                  <span>{{ form.serviceMonth || '-' }}</span>
                </el-form-item>
                <el-form-item label="三包预警：">
                  <span>{{ form.threePackWarning || '-' }}</span>
                </el-form-item>
                <el-form-item label="预警信息：">
                  <span>{{ form.warningInfo || '-' }}</span>
                </el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 费用信息 -->
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>费用信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="costTableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="repairItemCode" title="维修项目代码" min-width="120" />
                  <vxe-column field="repairItemName" title="维修项目名称" min-width="150" />
                  <vxe-column field="warrantyType" title="保修类型" min-width="100" />
                  <vxe-column field="activityCode" title="活动编号" min-width="120" />
                  <vxe-column field="isAddItemLabel" title="是否增项" min-width="80" />
                  <vxe-column field="laborPrice" title="工时单价" min-width="100" />
                  <vxe-column field="laborCount" title="工时数" min-width="80" />
                  <vxe-column field="discountAmount" title="优惠金额" min-width="100" />
                  <vxe-column field="discountRate" title="折扣率" min-width="80" />
                  <vxe-column field="repairCost" title="维修费用" min-width="100" />
                  <vxe-column field="packageName" title="套餐名称" min-width="150" />
                  <vxe-column field="packageCode" title="套餐代码" min-width="120" />
                  <vxe-column field="serviceRightsCode" title="服务权益代码" min-width="120" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
              </div>
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
import { getDetail, addOrUpdate, getServiceProxyList, checkServiceProxy } from '@/api/maintain/sp/preAuthRule/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  applyNo: '',
  serviceProxyId: '',
  serviceProxyCode: '',
  preAuthType: '',
  preAuthTypeLabel: '',
  dealerName: '',
  dealerCode: '',
  regionName: '',
  applyReason: '',
  ownerName: '',
  senderName: '',
  senderPhone: '',
  vin: '',
  vehicleModel: '',
  plateNo: '',
  vehicleUseLabel: '',
  mileage: '',
  productionDate: '',
  isLifetimeFreeLabel: '',
  isLifetimeWarrantyLabel: '',
  warrantyStartDate: '',
  warrantyEndDate: '',
  serviceMonth: '',
  threePackWarning: '',
  warningInfo: '',
  statusLabel: ''
};

export default {
  name: 'preAuthRuleEdit',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '申请单号：' + (this.form.applyNo || '新增');
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
      pageTitle: '预授权申请',
      pageType: 'edit',
      moduleKey: 'AISMC-preAuthRule',
      loading: false,
      submitLoading: false,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      emptyText: '暂无费用信息',
      costTableData: [],
      rules: {
        serviceProxyId: [
          { required: true, message: '请选择施工单', trigger: 'change' }
        ],
        preAuthType: [
          { required: true, message: '请选择预授权类型', trigger: 'change' }
        ],
        applyReason: [
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
          this.costTableData = res.costList || [];
          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    handleShowLog () {
      this.$auditLog.show({ id: this._id });
    },
    async queryServiceProxy (queryString) {
      return new Promise(resolve => {
        getServiceProxyList({ code: queryString, status: 1, limitSize: 20 }).then(res => {
          const list = res.records || [];
          resolve(list);
        }).catch(() => {
          resolve([]);
        });
      });
    },
    handleServiceProxyChange (val, record) {
      if (!record) {
        return;
      }
      // 选择施工单后进行查重
      this.checkServiceProxy(record.id);
      // 填充关联信息
      this.form.serviceProxyCode = record.code;
      this.form.dealerName = record.dealerName;
      this.form.dealerCode = record.dealerCode;
      this.form.regionName = record.regionName;
      this.form.ownerName = record.ownerName;
      this.form.senderName = record.senderName;
      this.form.senderPhone = record.senderPhone;
      this.form.vin = record.vin;
      this.form.vehicleModel = record.vehicleModel;
      this.form.plateNo = record.plateNo;
      this.form.mileage = record.mileage;
      // 根据预授权提醒逻辑设置默认预授权类型
      if (record.preAuthType) {
        this.form.preAuthType = record.preAuthType;
      }
    },
    checkServiceProxy (serviceProxyId) {
      // 检查该施工单是否已存在生效的预授权申请单
      checkServiceProxy({ serviceProxyId }).then(res => {
        if (res && res.exists) {
          this.$message.warning('该施工单已存在生效的预授权申请单，不可以重复创建预授权申请，请检查确认');
          this.form.serviceProxyId = '';
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-pre-auth-rule-edit {
}
</style>
