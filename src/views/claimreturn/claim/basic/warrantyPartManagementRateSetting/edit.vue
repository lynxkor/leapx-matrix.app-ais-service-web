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
                <!-- 费率序号 - 新增时置灰，后端自动生成；编辑时不可修改 -->
                <el-form-item label="费率序号：" prop="rateSerialNo">
                  <el-input
                    v-model="form.rateSerialNo"
                    :disabled="true"
                    placeholder="系统自动生成"
                  />
                </el-form-item>
                <!-- 费率模式 - 编辑时不可修改 -->
                <el-form-item label="费率模式：" prop="rateMode">
                  <el-select
                    v-model="form.rateMode"
                    :disabled="isEditMode"
                    placeholder="请选择"
                    clearable
                    @change="handleRateModeChange"
                  >
                    <el-option label="标准费率" value="10" />
                    <el-option label="门店费率" value="20" />
                    <el-option label="保修特殊费率" value="30" />
                  </el-select>
                </el-form-item>
                <!-- 标准费率模式字段 -->
                <template v-if="form.rateMode === '10'">
                  <el-form-item label="管理费率（%）：" prop="managementRate">
                    <el-input-number
                      v-model="form.managementRate"
                      :disabled="!canEditManagementRateForStandard"
                      @focus="validateManagementRateForStandard"
                      :min="0"
                      :precision="2"
                      :controls="false"
                      placeholder="请输入"
                      style="width: 200px;"
                    />
                  </el-form-item>
                  <el-form-item label="最大管理费用（元）：" prop="maxManagementFee">
                    <el-input-number
                      v-model="form.maxManagementFee"
                      :disabled="!canEditMaxManagementFeeForStandard"
                      @focus="validateMaxManagementFeeForStandard"
                      :min="0"
                      :precision="2"
                      :controls="false"
                      placeholder="请输入"
                      style="width: 200px;"
                    />
                  </el-form-item>
                  <el-form-item label="生效开始日期：" prop="effectiveStartTime">
                    <el-date-picker
                      v-model="form.effectiveStartTime"
                      :disabled="!canEditEffectiveStartTimeForStandard"
                      type="date"
                      :picker-options="startDatePickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择生效开始日期"
                    />
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input
                      type="textarea"
                      v-model="form.remark"
                      placeholder="请输入"
                      :rows="3"
                    />
                  </el-form-item>
                </template>
                <!-- 保修特殊费率模式字段 -->
                <template v-if="form.rateMode === '30'">
                  <el-form-item label="保修类型：" prop="warrantyTypeId">
                    <list-select
                    listUrl="/maintain/web/basic/repairItemType/list"
                    placeholder="请输入保修类型编码/名称"
                    v-model="form.warrantyTypeId"
                    :disabled="Boolean(_id)"
                    query-key="codeOrNameLike"
                    auto-load-options
                    no-param-load
                    filterable
                    clearable
                    label-key="name"
                    second-line-key="code"
                    @change="handleWarrantyTypeChange"
                    :params="{'checkoutTypeNames':['合同','保修']}"    />
                  </el-form-item>
                  <el-form-item label="管理费率（%）：" prop="managementRate">
                    <el-input-number
                      v-model="form.managementRate"
                      :disabled="!canEditManagementRateForWarranty"
                      @focus="validateManagementRateForWarranty"
                      :min="0"
                      :precision="2"
                      :controls="false"
                      placeholder="请输入"
                      style="width: 200px;"
                    />
                  </el-form-item>
                  <el-form-item label="最大管理费用（元）：" prop="maxManagementFee">
                    <el-input-number
                      v-model="form.maxManagementFee"
                      :disabled="!canEditMaxManagementFeeForWarranty"
                      @focus="validateMaxManagementFeeForWarranty"
                      :min="0"
                      :precision="2"
                      :controls="false"
                      placeholder="请输入"
                      style="width: 200px;"
                    />
                  </el-form-item>
                  <el-form-item label="生效开始日期：" prop="effectiveStartTime">
                    <el-date-picker
                      v-model="form.effectiveStartTime"
                      :disabled="!canEditEffectiveStartTimeForWarranty"
                      type="date"
                      :picker-options="startDatePickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择生效开始日期"
                    />
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input
                      type="textarea"
                      v-model="form.remark"
                      placeholder="请输入"
                      :rows="3"
                    />
                  </el-form-item>
                </template>
                <!-- 门店费率模式字段 -->
                <template v-if="form.rateMode === '20'">
                  <el-form-item label="门店名称：" prop="dealerCode">
                    <dealer-select v-model="form.dealerCode" :disabled="isEditMode" :defaultDealerName="form.dealerName" />
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    <el-input v-model="form.dealerCode" disabled />
                  </el-form-item>
                  <el-form-item label="管理费率（%）：" prop="managementRate">
                    <el-input-number
                      v-model="form.managementRate"
                      :disabled="!canEditManagementRateForStore"
                      @focus="validateManagementRateForStore"
                      :min="0"
                      :precision="2"
                      :controls="false"
                      placeholder="请输入"
                      style="width: 200px;"
                    />
                  </el-form-item>
                  <el-form-item label="最大管理费用（元）：" prop="maxManagementFee">
                    <el-input-number
                      v-model="form.maxManagementFee"
                      :disabled="!canEditMaxManagementFeeForStore"
                      @focus="validateMaxManagementFeeForStore"
                      :min="0"
                      :precision="2"
                      :controls="false"
                      placeholder="请输入"
                      style="width: 200px;"
                    />
                  </el-form-item>
                  <el-form-item label="生效开始日期：" prop="effectiveStartTime">
                    <el-date-picker
                      v-model="form.effectiveStartTime"
                      :disabled="!canEditEffectiveStartTimeForStore"
                      type="date"
                      :picker-options="startDatePickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择生效开始日期"
                      @change="handleStartDateChange"
                    />
                  </el-form-item>
                  <el-form-item label="生效结束日期：" prop="effectiveEndTime">
                    <el-date-picker
                      v-model="form.effectiveEndTime"
                      :disabled="!canEditEffectiveEndTimeForStore"
                      type="date"
                      :picker-options="endDatePickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      default-time="23:59:59"
                      placeholder="请选择生效结束日期"
                      @change="handleEndDateChange"
                    />
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input
                      type="textarea"
                      v-model="form.remark"
                      placeholder="请输入"
                      :rows="3"
                    />
                  </el-form-item>
                </template>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="费率序号：" prop="rateSerialNo">
                  {{ form.rateSerialNo }}
                </el-form-item>
                <el-form-item label="费率模式：" prop="rateMode">
                  {{ rateModeLabel }}
                </el-form-item>
                <!-- 标准费率模式详情 -->
                <template v-if="form.rateMode === '10'">
                  <el-form-item label="管理费率（%）：" prop="managementRate">
                    {{ form.managementRate }}
                  </el-form-item>
                  <el-form-item label="最大管理费用（元）：" prop="maxManagementFee">
                    {{ form.maxManagementFee }}
                  </el-form-item>
                  <el-form-item label="生效开始日期：" prop="effectiveStartTime">
                    {{ form.effectiveStartTime }}
                  </el-form-item>
                </template>
                <!-- 保修特殊费率模式详情 -->
                <template v-if="form.rateMode === '30'">
                  <el-form-item label="保修类型：" prop="warrantyTypeId">
                    {{ form.warrantyTypeName }}
                  </el-form-item>
                  <el-form-item label="保修类型代码：" prop="warrantyTypeCode">
                    {{ form.warrantyTypeCode }}
                  </el-form-item>
                  <el-form-item label="管理费率（%）：" prop="managementRate">
                    {{ form.managementRate }}
                  </el-form-item>
                  <el-form-item label="最大管理费用（元）：" prop="maxManagementFee">
                    {{ form.maxManagementFee }}
                  </el-form-item>
                  <el-form-item label="生效开始日期：" prop="effectiveStartTime">
                    {{ form.effectiveStartTime }}
                  </el-form-item>
                </template>
                <!-- 门店费率模式详情 -->
                <template v-if="form.rateMode === '20'">
                  <el-form-item label="门店编码：" prop="dealerCode">
                    {{ form.dealerCode }}
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="管理费率（%）：" prop="managementRate">
                    {{ form.managementRate }}
                  </el-form-item>
                  <el-form-item label="最大管理费用（元）：" prop="maxManagementFee">
                    {{ form.maxManagementFee }}
                  </el-form-item>
                  <el-form-item label="生效开始日期：" prop="effectiveStartTime">
                    {{ form.effectiveStartTime }}
                  </el-form-item>
                  <el-form-item label="生效结束日期：" prop="effectiveEndTime">
                    {{ form.effectiveEndTime }}
                  </el-form-item>
                </template>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/warrantyPartManagementRateSetting/index';
import ListSelect from '@/libs/components/list-select/index.vue';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import DealerSelect from '@/components/dealer-select/index.vue';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  remark: '',
  rateSerialNo: '',
  rateMode: '',
  warrantyTypeId: '',
  warrantyTypeName: '',
  managementRate: '',
  maxManagementFee: '',
  dealerCode: '',
  dealerName: '',
  effectiveStartTime: '',
  effectiveEndTime: '',
};

export default {
  name: 'warrantyPartManagementRateSettingEdit',
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
    DealerSelect,
    ListSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '费率序号：' + (this.form.rateSerialNo || '-');
    },
    // 费率模式文本
    rateModeLabel () {
      const modeMap = {
        10: '标准费率',
        20: '门店费率',
        30: '保修特殊费率'
      };
      return modeMap[this.form.rateMode] || this.form.rateMode;
    },
    // 是否为编辑模式
    isEditMode () {
      return !!this._id;
    },
    // 原始生效开始日期是否晚于或等于当天
    isOriginalEffectiveStartTimeTodayOrLater () {
      if (!this.originalForm.effectiveStartTime) return false;
      const effectiveDate = new Date(this.originalForm.effectiveStartTime);
      const effectiveDateNormalized = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate());
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return effectiveDateNormalized >= todayNormalized;
    },
    // 原始生效开始日期是否晚于当天
    isOriginalEffectiveStartTimeLaterThanToday () {
      if (!this.originalForm.effectiveStartTime) return false;
      const effectiveDate = new Date(this.originalForm.effectiveStartTime);
      const effectiveDateNormalized = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate());
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return effectiveDateNormalized > todayNormalized;
    },
    // 原始生效结束日期是否晚于或等于当天
    isOriginalEffectiveEndTimeTodayOrLater () {
      if (!this.originalForm.effectiveEndTime) return false;
      const endDate = new Date(this.originalForm.effectiveEndTime);
      const endDateNormalized = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return endDateNormalized >= todayNormalized;
    },
    // 原始生效结束日期是否晚于当天
    isOriginalEffectiveEndTimeLaterThanToday () {
      if (!this.originalForm.effectiveEndTime) return false;
      const endDate = new Date(this.originalForm.effectiveEndTime);
      const endDateNormalized = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return endDateNormalized > todayNormalized;
    },
    // 生效开始日期是否晚于或等于当天（当前值）
    isEffectiveStartTimeTodayOrLater () {
      if (!this.form.effectiveStartTime) return false;
      const effectiveDate = new Date(this.form.effectiveStartTime);
      const effectiveDateNormalized = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate());
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return effectiveDateNormalized >= todayNormalized;
    },
    // 生效开始日期是否晚于当天（当前值）
    isEffectiveStartTimeLaterThanToday () {
      if (!this.form.effectiveStartTime) return false;
      const effectiveDate = new Date(this.form.effectiveStartTime);
      const effectiveDateNormalized = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate());
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return effectiveDateNormalized > todayNormalized;
    },
    // 生效结束日期是否晚于或等于当天（当前值）
    isEffectiveEndTimeTodayOrLater () {
      if (!this.form.effectiveEndTime) return false;
      const endDate = new Date(this.form.effectiveEndTime);
      const endDateNormalized = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return endDateNormalized >= todayNormalized;
    },
    // 生效结束日期是否晚于当天（当前值）
    isEffectiveEndTimeLaterThanToday () {
      if (!this.form.effectiveEndTime) return false;
      const endDate = new Date(this.form.effectiveEndTime);
      const endDateNormalized = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const today = new Date();
      const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return endDateNormalized > todayNormalized;
    },
    // 标准费率模式：管理费率是否可编辑
    canEditManagementRateForStandard () {
      if (!this.isEditMode) return true;
      return this.isOriginalEffectiveStartTimeTodayOrLater;
    },
    // 标准费率模式：最大管理费用是否可编辑
    canEditMaxManagementFeeForStandard () {
      if (!this.isEditMode) return true;
      return this.isOriginalEffectiveStartTimeTodayOrLater;
    },
    // 标准费率模式：生效开始日期是否可编辑
    canEditEffectiveStartTimeForStandard () {
      if (!this.isEditMode) return true;
      return this.isOriginalEffectiveStartTimeLaterThanToday;
    },
    // 保修特殊费率模式：管理费率是否可编辑
    canEditManagementRateForWarranty () {
      if (!this.isEditMode) return true;
      return this.isOriginalEffectiveStartTimeTodayOrLater;
    },
    // 保修特殊费率模式：最大管理费用是否可编辑
    canEditMaxManagementFeeForWarranty () {
      if (!this.isEditMode) return true;
      return this.isOriginalEffectiveStartTimeTodayOrLater;
    },
    // 保修特殊费率模式：生效开始日期是否可编辑
    canEditEffectiveStartTimeForWarranty () {
      if (!this.isEditMode) return true;
      return this.isOriginalEffectiveStartTimeLaterThanToday;
    },
    // 门店费率模式：是否满足编辑前提条件（生效结束时间晚于或等于当天）
    canEditForStorePolicy () {
      if (!this.isEditMode) return true;
      return this.isOriginalEffectiveEndTimeTodayOrLater;
    },
    // 门店费率模式：管理费率是否可编辑
    canEditManagementRateForStore () {
      if (!this.isEditMode) return true;
      if (!this.canEditForStorePolicy) return false;
      return this.isOriginalEffectiveStartTimeTodayOrLater;
    },
    // 门店费率模式：最大管理费用是否可编辑
    canEditMaxManagementFeeForStore () {
      if (!this.isEditMode) return true;
      if (!this.canEditForStorePolicy) return false;
      return this.isOriginalEffectiveStartTimeTodayOrLater;
    },
    // 门店费率模式：生效开始日期是否可编辑
    canEditEffectiveStartTimeForStore () {
      if (!this.isEditMode) return true;
      if (!this.canEditForStorePolicy) return false;
      return this.isOriginalEffectiveStartTimeLaterThanToday;
    },
    // 门店费率模式：生效结束日期是否可编辑
    canEditEffectiveEndTimeForStore () {
      if (!this.isEditMode) return true;
      return this.isOriginalEffectiveEndTimeLaterThanToday;
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
    },
    'form.dealerCode': {
      handler (val) {
        if (val) {
          this.getDealerName(val);
        } else {
          this.form.dealerName = '';
        }
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '保修零部件管理费率设置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-warrantyPartManagementRateSetting',
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
      // 日期选择器配置
      startDatePickerOptions: {
        disabledDate: (time) => {
          // 新增时：只能选择当天及以后的日期
          if (!this.isEditMode) {
            return time.getTime() < new Date().setHours(0, 0, 0, 0);
          }
          // 编辑时：只能选择晚于当天的日期（不能选择今天）
          return time.getTime() <= new Date().setHours(0, 0, 0, 0);
        }
      },
      endDatePickerOptions: {
        disabledDate: (time) => {
          // 必须晚于生效开始日期
          if (this.form.effectiveStartTime) {
            const startTime = new Date(this.form.effectiveStartTime);
            // 只比较日期部分，不比较时间
            const startDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
            const currentDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
            return currentDate < startDate;
          }
          return false;
        }
      },
      rules: {
        rateMode: [
          { required: true, message: '请选择费率模式', trigger: 'change' }
        ],
        managementRate: [
          { required: true, message: '请输入管理费率', trigger: 'change' },
          { validator: this.validatePositiveNumber, trigger: 'change' }
        ],
        maxManagementFee: [
          { required: true, message: '请输入最大管理费用', trigger: 'change' },
          { validator: this.validatePositiveNumber, trigger: 'change' }
        ],
        warrantyTypeId: [
          { required: true, message: '请选择保修类型', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请选择门店编码或名称', trigger: 'change' }
        ],
        effectiveStartTime: [
          { required: true, message: '请选择生效开始日期', trigger: 'change' }
        ],
        effectiveEndTime: [
          { required: true, message: '请选择生效结束日期', trigger: 'change' }
        ]
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
      return {
        ...defaultForm
      };
    },
    // 费率模式切换处理
    handleRateModeChange (val) {
      // 清空相关字段
      this.form.managementRate = '';
      this.form.maxManagementFee = '';
      this.form.effectiveStartTime = '';
      this.form.effectiveEndTime = '';
      this.form.warrantyTypeId = '';
      this.form.warrantyTypeName = '';
      this.form.dealerCode = '';
      this.form.dealerName = '';
      this.form.remark = '';
    },
    // 保修类型变化处理
    handleWarrantyTypeChange (val, selectedItem) {
      if (val && selectedItem) {
        // 根据保修类型ID获取保修类型名称和代码
        this.form.warrantyTypeName = selectedItem.name;
        this.form.warrantyTypeCode = selectedItem.code;
      } else {
        this.form.warrantyTypeName = '';
        this.form.warrantyTypeCode = '';
      }
    },
    // 生效开始日期变化处理
    handleStartDateChange (val) {
      // 如果生效结束日期早于生效开始日期，清空生效结束日期
      if (this.form.effectiveEndTime && new Date(this.form.effectiveEndTime) <= new Date(val)) {
        this.form.effectiveEndTime = '';
      }
    },
    // 生效结束日期变化处理
    handleEndDateChange (val) {
      if (val) {
        // 确保时分秒为23:59:59
        const date = new Date(val);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        this.form.effectiveEndTime = `${year}-${month}-${day} 23:59:59`;
      }
    },
    // 校验正数
    validatePositiveNumber (rule, value, callback) {
      if (value === '' || value === null || value === undefined) {
        callback();
        return;
      }
      if (value < 0) {
        callback(new Error('必须大于等于0'));
      } else {
        callback();
      }
    },
    // 获取门店名称
    getDealerName (dealerCode) {
      listOrgStoreInfo({ name: dealerCode }).then(res => {
        if (res && res.length > 0) {
          const dealer = res.find(item => item.orgCode === dealerCode);
          if (dealer && dealer.orgName) {
            this.form.dealerName = dealer.orgName;
          }
        }
      }).catch(() => {
        this.form.dealerName = '';
      });
    },
    // 验证管理费率编辑权限（标准费率模式）
    validateManagementRateForStandard () {
      if (this.isEditMode && this.form.rateMode === '10' && !this.isEffectiveStartTimeTodayOrLater) {
        this.$message.warning(`在生效开始日期：${this.form.effectiveStartTime}之后的费率信息不允许修改`);
        return false;
      }
      return true;
    },
    // 验证最大管理费用编辑权限（标准费率模式）
    validateMaxManagementFeeForStandard () {
      if (this.isEditMode && this.form.rateMode === '10' && !this.isEffectiveStartTimeTodayOrLater) {
        this.$message.warning(`在生效开始日期：${this.form.effectiveStartTime}之后的费率信息不允许修改`);
        return false;
      }
      return true;
    },
    // 验证管理费率编辑权限（保修特殊费率模式）
    validateManagementRateForWarranty () {
      if (this.isEditMode && this.form.rateMode === '30' && !this.isEffectiveStartTimeTodayOrLater) {
        this.$message.warning(`在生效开始日期：${this.form.effectiveStartTime}之后的费率信息不允许修改`);
        return false;
      }
      return true;
    },
    // 验证最大管理费用编辑权限（保修特殊费率模式）
    validateMaxManagementFeeForWarranty () {
      if (this.isEditMode && this.form.rateMode === '30' && !this.isEffectiveStartTimeTodayOrLater) {
        this.$message.warning(`在生效开始日期：${this.form.effectiveStartTime}之后的费率信息不允许修改`);
        return false;
      }
      return true;
    },
    // 验证管理费率编辑权限（门店费率模式）
    validateManagementRateForStore () {
      if (this.isEditMode && this.form.rateMode === '20') {
        if (!this.canEditForStorePolicy) {
          this.$message.warning('生效结束时间晚于或等于当天，才可以修改');
          return false;
        }
        if (!this.isEffectiveStartTimeTodayOrLater) {
          this.$message.warning(`在生效开始日期：${this.form.effectiveStartTime}之后的费率信息不允许修改`);
          return false;
        }
      }
      return true;
    },
    // 验证最大管理费用编辑权限（门店费率模式）
    validateMaxManagementFeeForStore () {
      if (this.isEditMode && this.form.rateMode === '20') {
        if (!this.canEditForStorePolicy) {
          this.$message.warning('生效结束时间晚于或等于当天，才可以修改');
          return false;
        }
        if (!this.isEffectiveStartTimeTodayOrLater) {
          this.$message.warning(`在生效开始日期：${this.form.effectiveStartTime}之后的费率信息不允许修改`);
          return false;
        }
      }
      return true;
    },
    // 获取保修类型选项
    async fetchWarrantyTypeOptions () {
      // 这里需要根据实际接口调整，只返回结算类型为合同和保修的维修类型记录（除保养套餐外）
      // 示例：return getWarrantyTypes({ settlementType: ['合同', '保修'], excludeMaintenancePackage: true });
      return [];
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
