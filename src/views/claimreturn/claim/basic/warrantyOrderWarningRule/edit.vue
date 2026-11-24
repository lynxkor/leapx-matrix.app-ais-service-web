<template>
  <edit-page-layout ref="editLayout" :title="pannelTitle" :width="40">
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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式: el-form 包 rules 用于 EditBaseContainer.validate() -->
              <el-form
                v-if="isEditing || !_id"
                :inline="true"
                :model="form"
                :rules="rules"
                ref="ruleForm"
                label-width="auto"
                class="form-edit"
              >
                <component
                  :is="editorComponent"
                  :form="form"
                  :readonly="false"
                  :options-map="optionsMap"
                  :fetch-options="fetchOptions"
                />
              </el-form>
              <!-- 详情模式: 不挂 rules, 字段全部只读 -->
              <el-form
                v-else
                :inline="true"
                class="form-detail"
              >
                <component
                  :is="editorComponent"
                  :form="form"
                  :readonly="true"
                  :options-map="optionsMap"
                  :fetch-options="fetchOptions"
                />
              </el-form>
            </div>
          </section>

          <!-- BXYJ010 过度更换零件预警: 备件白名单 section -->
          <section v-if="form.ruleType === 'BXYJ010'" class="common-section">
            <div class="common-section-header">
              <h2>备件白名单</h2>
            </div>
            <div class="common-section-body">
              <whitelist-table
                :id="_id"
                :rule-type="form.ruleType"
                :module-key="moduleKey"
                @open-replace="handleOpenReplace"
              />
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <replace-drawer
          :replace-part="currentReplacePart"
          :module-key="moduleKey"
          @close="handleCloseReplace"
        />
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/warrantyOrderWarningRule/index';
import { getList as repairGetList } from '@/api/maintain/basic/repairItemType';
import { vrtlist } from '@/api/claimreturn/claim/basic/vrt';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import WhitelistTable from './WhitelistTable.vue';
import ReplaceDrawer from './ReplaceDrawer.vue';
import { getRuleConfig, parseExtConfigString, needsExtConfigMerge } from './config';

// 默认 form 字段（保留所有可能的独立字段，新增/编辑初始为空）
const defaultForm = {
  judgeDays: '',
  statusList: [],
  judgeTimes: '',
  remindContent: '',
  diffCharCount: '', // BXYJ005
  withinDays: '', // BXYJ006/008/009
  warrantyTypes: [], // BXYJ009
  vrtIds: [], // BXYJ009
  workOrderStatuses: [], // BXYJ009
  checkoutTypeIds: [], // BXYJ009
  partUnitPriceMin: '', // BXYJ010
  changeCountThreshold: '', // BXYJ010
  ratioThreshold: '' // BXYJ010
};

export default {
  name: 'warrantyOrderWarningRuleEdit',
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
    WhitelistTable,
    ReplaceDrawer,
    // 注册所有 10 个 BXYJ Editor 子组件
    BXYJ001Editor: () => import('./components/rules/BXYJ001Editor.vue'),
    BXYJ002Editor: () => import('./components/rules/BXYJ002Editor.vue'),
    BXYJ003Editor: () => import('./components/rules/BXYJ003Editor.vue'),
    BXYJ004Editor: () => import('./components/rules/BXYJ004Editor.vue'),
    BXYJ005Editor: () => import('./components/rules/BXYJ005Editor.vue'),
    BXYJ006Editor: () => import('./components/rules/BXYJ006Editor.vue'),
    BXYJ007Editor: () => import('./components/rules/BXYJ007Editor.vue'),
    BXYJ008Editor: () => import('./components/rules/BXYJ008Editor.vue'),
    BXYJ009Editor: () => import('./components/rules/BXYJ009Editor.vue'),
    BXYJ010Editor: () => import('./components/rules/BXYJ010Editor.vue')
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return this.form.ruleName || '保修单预警规则';
    },
    /**
     * 根据当前 form.ruleType 动态选择 Editor 组件
     */
    editorComponent () {
      if (!this.form.ruleType) return null;
      return `${this.form.ruleType}Editor`;
    },
    /**
     * BXYJ009 字段需要的选项数据
     */
    optionsMap () {
      return {
        warrantyTypeOptions: this.bxyj009WarrantyTypeOptions,
        vrtOptions: this.bxyj009VrtOptions,
        checkoutTypeOptions: [] // checkoutTypeOptions 在 RuleDescription 中直接从 BXYJ009_STATEMENT_TYPE_OPTIONS 读取
      };
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
    // extConfig 变化时回填独立字段
    'form.extConfig': {
      handler (val) {
        this.syncExtConfigFields(val);
      },
      immediate: false
    },
    // 切换 ruleType 时也重新加载
    'form.ruleType': {
      handler (val) {
        if (this.form.extConfig) {
          this.syncExtConfigFields(this.form.extConfig);
        }
        if (val === 'BXYJ009') {
          this.loadBxyj009WarrantyTypeOptions();
          this.loadBxyj009VrtOptions();
        }
      },
      immediate: false
    },
    // 整体 form 替换时也重新解析
    form: {
      handler (newForm) {
        if (newForm && newForm.extConfig) {
          this.syncExtConfigFields(newForm.extConfig);
        }
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '保修单预警规则',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantyOrderWarningRule',
      pannelTitle: '',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      replaceDrawerVisible: false,
      currentReplacePart: {},
      bxyj009WarrantyTypeOptions: [],
      bxyj009VrtOptions: [],
      rules: {
        judgeDays: [{ required: true, message: '请输入判定天数', trigger: 'change' }],
        statusList: [{ required: true, message: '请选择状态', trigger: 'change' }],
        judgeTimes: [{ required: true, message: '请输入判定次数', trigger: 'change' }],
        remindContent: [{ required: true, message: '请输入提醒内容', trigger: 'change' }]
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    handleOpenReplace (row) {
      this.currentReplacePart = row;
      this.pannelTitle = `零件编码：${row.partCode}`;
      if (this.$refs.editLayout && typeof this.$refs.editLayout.openPane === 'function') {
        this.$refs.editLayout.openPane();
      }
    },
    handleCloseReplace () {
      this.currentReplacePart = {};
      if (this.$refs.editLayout && typeof this.$refs.editLayout.closePane === 'function') {
        this.$refs.editLayout.closePane();
      }
    },
    /**
     * 提交 - 由 RULE_REGISTRY 驱动
     */
    submitRequest () {
      const ruleType = this.form.ruleType;
      const rule = getRuleConfig(ruleType);
      if (!rule) {
        this.$message.error('未知规则类型');
        return;
      }
      // 通用校验：remindContent 必填
      if (!this.form.remindContent) {
        this.$message.error('请输入提醒内容');
        return;
      }
      // 规则自定义校验
      const errs = rule.validate(this.form);
      if (errs.length > 0) {
        this.$message.error(errs[0]);
        return;
      }
      // 通用合并：独立字段 → extConfig
      const submitForm = { ...this.form };
      let cfg = parseExtConfigString(this.form.extConfig);
      if (needsExtConfigMerge(ruleType)) {
        const { cfg: newCfg, deleteFromForm } = rule.mergeToExtConfig(this.form, cfg);
        cfg = newCfg;
        deleteFromForm.forEach(k => delete submitForm[k]);
        submitForm.extConfig = JSON.stringify(cfg);
      }
      return addOrUpdate(submitForm).then(res => {
        // 保存成功后立即同步独立字段回 form（双保险）
        if (needsExtConfigMerge(ruleType)) {
          // 重新解析回独立字段（包括默认值）
          const extCfgParsed = parseExtConfigString(submitForm.extConfig);
          const fields = rule.parseExtConfig(extCfgParsed);
          Object.keys(fields).forEach(k => {
            this.$set(this.form, k, fields[k]);
          });
        }
        return res;
      });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    /**
     * 从 extConfig 反向解析到独立字段
     * 由 RULE_REGISTRY 驱动
     */
    syncExtConfigFields (val) {
      const ruleType = this.form.ruleType;
      if (!ruleType) return;
      const rule = getRuleConfig(ruleType);
      if (!rule || typeof rule.parseExtConfig !== 'function') return;
      const cfg = parseExtConfigString(val);
      const fields = rule.parseExtConfig(cfg);
      Object.keys(fields).forEach(k => {
        this.$set(this.form, k, fields[k]);
      });
    },
    getDefautlForm () {
      return { ...defaultForm };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async loadBxyj009WarrantyTypeOptions () {
      try {
        const res = await repairGetList({ nameLike: '', pageSize: 99, pageNum: 1 });
        this.bxyj009WarrantyTypeOptions = (res && res.records) || [];
      } catch (err) {
        console.error('BXYJ009 保修类型加载失败:', err);
        this.bxyj009WarrantyTypeOptions = [];
      }
    },
    async loadBxyj009VrtOptions () {
      try {
        const res = await vrtlist({ statusIncludeList: [1], pageSize: 99, pageNum: 1 });
        const list = (res && (res.data || res.records || res)) || [];
        const options = (Array.isArray(list) ? list : []).map(item => ({
          id: item.id !== undefined ? item.id : item.value,
          name: item.name !== undefined ? item.name : item.label,
          code: item.code || ''
        }));
        this.bxyj009VrtOptions = options;
        // 默认行为：空数组时自动填上所有启用的 VRT id
        if (Array.isArray(this.form.vrtIds) && this.form.vrtIds.length === 0 && options.length > 0) {
          this.form.vrtIds = options.map(o => o.id);
        }
      } catch (err) {
        console.error('BXYJ009 VRT 加载失败:', err);
        this.bxyj009VrtOptions = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-common-edit .el-form-item {
  width: auto;
  line-height: 22px;
  ::v-deep .el-form-item__content{
    line-height: 40px;
  }
}
.el-textarea{
  width: auto;
  vertical-align: top;
}
</style>
