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
          <!-- 支持 primary,warning,success,danger 等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮 1</el-button>
          <el-button size="small">按钮 2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整 label-width="150px"，使得 label 不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="160px" class="form-edit" v-show="isEditing || !_id">
                <!-- 序号 - 新增时置灰，后端自动生成；编辑时不可修改 -->
                <el-form-item label="序号：" prop="serialNo">
                  <el-input
                    v-model="form.serialNo"
                    :disabled="true"
                    placeholder="系统自动生成"
                  />
                </el-form-item>
                <!-- 日历模式 - 编辑时不可修改 -->
                <el-form-item label="日历模式：" prop="calendarMode">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="warranty_calendar_mode"
                    v-model="form.calendarMode"
                    :disabled="isEditMode"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="handleCalendarModeChange"
                  />
                </el-form-item>
                <!-- 标准日历模式字段 -->
                <template v-if="form.calendarMode === '10'">
                  <el-form-item label="每月第几日保修结算：" prop="settlementDay">
                    <el-input-number
                      size="small"
                      v-model="form.settlementDay"
                      :min="1"
                      :max="28"
                      :precision="0"
                      :controls="true"
                      placeholder="请输入 1-28 的整数"
                      @change="validateStandardCalendarDuplicate"
                    />
                  </el-form-item>
                  <el-form-item label="月度：" prop="monthType">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="warranty_month_type"
                      v-model="form.monthType"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                <!-- 是否启用 - 新增和编辑时都显示 -->
                <el-form-item label="是否启用：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    :disabled="true"
                    clearable
                    filterable
                  />
                </el-form-item>
                </template>
                <!-- 门店日历模式字段 -->
                <template v-if="form.calendarMode === '20'">
                  <el-form-item label="门店名称：" prop="dealerCode">
                    <dealer-select v-model="form.dealerCode" :disabled="isEditMode" />
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    <el-input v-model="form.dealerCode" disabled/>
                  </el-form-item>
                  <el-form-item label="每月第几日保修结算：" prop="settlementDay">
                    <el-input-number
                      size="small"
                      v-model="form.settlementDay"
                      :min="1"
                      :max="28"
                      :precision="0"
                      :controls="true"
                      placeholder="请输入 1-28 的整数"
                      @change="validateStoreCalendarDuplicate"
                    />
                  </el-form-item>
                  <el-form-item label="月度：" prop="monthType">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="warranty_month_type"
                      v-model="form.monthType"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                <!-- 是否启用 - 新增和编辑时都显示 -->
                <el-form-item label="是否启用：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    placeholder="请选择"
                    :disabled="true"
                    clearable
                    filterable
                  />
                </el-form-item>
                </template>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="序号：" prop="serialNo">
                  {{ form.serialNo }}
                </el-form-item>
                <el-form-item label="日历模式：" prop="calendarMode">
                  {{ calendarModeLabel }}
                </el-form-item>
                <el-form-item label="每月第几日保修结算：" prop="settlementDay">
                  {{ form.settlementDay }}
                </el-form-item>
                <el-form-item label="月度：" prop="monthType">
                  {{ monthTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode" v-if="form.calendarMode === '20'">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName" v-if="form.calendarMode === '20'">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="说明：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
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
import { getDetail, addOrUpdate, checkStandardCalendarDuplicate, checkStoreCalendarDuplicate, getEnabledStandardCalendarCount } from '@/api/claimreturn/claim/basic/warrantySettlementCalendar/index';
import FetchSelect from '@/libs/components/FetchSelect';
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
  serialNo: '',
  calendarMode: '',
  settlementDay: '',
  dealerCode: '',
  dealerName: '',
  monthType: '',
  status: '1', // 默认为启用
  createTime: '',
  updateTime: '',
};

export default {
  name: 'warrantySettlementCalendarEdit',
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
    FetchSelect,
    DealerSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修结算日历 - 序号：' + (this.form.serialNo || '新增');
    },
    // 是否为编辑模式
    isEditMode () {
      return !!this._id;
    },
    // 日历模式文本
    calendarModeLabel () {
      const modeMap = {
        10: '标准日历',
        20: '门店日历'
      };
      return modeMap[this.form.calendarMode] || this.form.calendarMode;
    },
    // 月度文本
    monthTypeLabel () {
      const typeMap = {
        10: '上个月',
        20: '当前月'
      };
      return typeMap[this.form.monthType] || this.form.monthType;
    },
    // 是否启用文本
    statusLabel () {
      return this.form.status === '1' ? '是' : '否';
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
      pageTitle: '保修结算日历',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-warrantySettlementCalendar',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        calendarMode: [
          { required: true, message: '请选择日历模式', trigger: 'change' }
        ],
        settlementDay: [
          { required: true, message: '请输入每月第几日保修结算', trigger: 'change' }
        ],
        monthType: [
          { required: true, message: '请选择月度', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请选择门店编码或名称', trigger: 'change', validator: this.validateDealerCode }
        ],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
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
    async submitRequest () {
      // 提交前进行重复校验
      if (this.form.calendarMode === '10') {
        // 标准日历校验
        const isDuplicate = await this.checkStandardDuplicate();
        if (isDuplicate) {
          return Promise.reject(new Error('标准日历已存在重复记录'));
        }
      } else if (this.form.calendarMode === '20') {
        // 门店日历校验
        const isDuplicate = await this.checkStoreDuplicate();
        if (isDuplicate) {
          return Promise.reject(new Error('门店日历已存在重复记录'));
        }
      }
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
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
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
      this.tableData.push(record);
    },
    getDefautlForm () {
      return {
        ...defaultForm,
        calendarMode: '10' // 默认为标准日历
      };
    },
    // 日历模式切换处理
    handleCalendarModeChange (val) {
      // 清空相关字段
      this.form.settlementDay = '';
      this.form.dealerCode = '';
      this.form.dealerName = '';
      this.form.monthType = '';
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
    // 标准日历重复校验
    async checkStandardDuplicate () {
      if (!this.form.settlementDay) return false;
      try {
        const res = await checkStandardCalendarDuplicate(this.form.settlementDay);
        if (res) {
          this.$message.warning(`${this.form.settlementDay}号保修结算日期已存在标准结算日历，不允许重复添加`);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    // 门店日历重复校验
    async checkStoreDuplicate () {
      if (!this.form.dealerCode || !this.form.settlementDay) return false;
      try {
        const res = await checkStoreCalendarDuplicate(this.form.dealerCode, this.form.settlementDay);
        if (res) {
          this.$message.warning(`门店：${this.form.dealerCode}，在${this.form.settlementDay}号保修结算日期已存在门店结算日历，不允许重复添加`);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    // 标准日历重复校验（失焦时）
    async validateStandardCalendarDuplicate () {
      if (this.form.calendarMode !== '10' || !this.form.settlementDay) return;
      await this.checkStandardDuplicate();
    },
    // 门店日历重复校验（失焦时）
    async validateStoreCalendarDuplicate () {
      if (this.form.calendarMode !== '20' || !this.form.dealerCode || !this.form.settlementDay) return;
      await this.checkStoreDuplicate();
    },
    // 门店编码校验器
    validateDealerCode (rule, value, callback) {
      if (this.form.calendarMode === '20' && !value) {
        callback(new Error('请选择门店编码'));
      } else {
        callback();
      }
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
