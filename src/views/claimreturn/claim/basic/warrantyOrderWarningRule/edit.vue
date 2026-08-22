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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整 label-width="150px"，使得 label 不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="auto" class="form-edit" v-show="isEditing || !_id">
                <!-- OCR 类预警规则（BXYJ002 车主信息不一致 / BXYJ003 系统车辆用途 / BXYJ004 行驶证车辆用途 / BXYJ005 车牌号）：触发时机均为上传行驶证，不需要 judgeDays/judgeTimes -->
                <template v-if="isOcrRule(form.ruleCode)">
                  <el-form-item class="form-item-line">
                    <!-- BXYJ005 车牌号预警: 描述中嵌入可编辑的位数 (参照 BXYJ001 的 365/0 模式) -->
                    <template v-if="form.ruleCode === 'WWR-BXYJ005'">
                      <span>当保修单上传行驶证附件时，若 OCR 行驶证车牌号 与 系统车牌号 不匹配超过 </span>
                      <el-input-number
                        v-model="form.diffCharCount"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="width: 150px;"
                      />
                      <span> 位时：</span>
                    </template>
                    <!-- BXYJ002 / BXYJ003 / BXYJ004: 纯文本描述 -->
                    <template v-else>
                      <span>{{ ocrRuleDescription(form.ruleCode) }}</span>
                    </template>
                    <el-input
                      type="textarea"
                      :rows="4"
                      maxlength="500"
                      show-word-limit
                      placeholder="请输入提醒内容"
                      v-model="form.remindContent"
                      clearable
                      style="width: 400px;"
                    />
                  </el-form-item>
                </template>
                <!-- 其他规则（BXYJ001 重复维修预警等）：保留原描述文案 -->
                <template v-else>
                  <el-form-item class="form-item-line">
                    <span>除当前保修申请单外，创建日期大于等于当前日期- </span>
                    <el-input-number
                      placeholder="请输入天数"
                      v-model="form.judgeDays"
                      :controls = "false"
                      :max="999999999"
                      :min=0
                      clearable
                      style="width: 150px;"
                    />
                    <span> 的其他保修单，若【VIN】【主因故障零件】等于当前保修申请单且是已提交、审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款的记录数大于</span>
                    <el-input-number
                      placeholder="请输入次数"
                      v-model="form.judgeTimes"
                      :controls = "false"
                      :max="999999999"
                      :min="0"
                      clearable
                      style="width: 150px;"
                    />
                    笔记录则提醒
                    <el-input
                      type="textarea"
                      :rows="4"
                      maxlength="500"
                      show-word-limit
                      placeholder="请输入提醒内容"
                      v-model="form.remindContent"
                      clearable
                      style="width: 400px;"
                    />
                  </el-form-item>
                </template>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <!-- OCR 类预警规则详情 (BXYJ002/003/004/005) -->
                <template v-if="isOcrRule(form.ruleCode)">
                  <el-form-item class="form-item-line">
                    <!-- BXYJ005 车牌号预警: 描述中嵌入只读位数 -->
                    <template v-if="form.ruleCode === 'WWR-BXYJ005'">
                      <span>当保修单上传行驶证附件时，若 OCR 行驶证车牌号 与 系统车牌号 不匹配超过 </span>
                      <el-input
                        v-model="form.diffCharCount"
                        clearable
                        style="width: 150px;"
                        disabled
                      />
                      <span> 位时：</span>
                    </template>
                    <!-- BXYJ002 / BXYJ003 / BXYJ004: 纯文本描述 -->
                    <template v-else>
                      <span>{{ ocrRuleDescription(form.ruleCode) }}</span>
                    </template>
                    <el-input
                      type="textarea"
                      :rows="4"
                      maxlength="500"
                      show-word-limit
                      placeholder="请输入提醒内容"
                      v-model="form.remindContent"
                      clearable
                      disabled
                      style="width: 400px;"
                    />
                  </el-form-item>
                </template>
                <!-- 其他规则详情 (BXYJ001 等) -->
                <el-form-item class="form-item-line" v-else prop="judgeDays">
                  <span>除当前保修申请单外，创建日期大于等于当前日期- </span>
                  <el-input
                    placeholder="请输入天数"
                    v-model="form.judgeDays"
                    clearable
                    style="width: 150px;"
                    disabled
                  />
                  <span> 的其他保修单，若【VIN】【主因故障零件】等于当前保修申请单且是已提交、审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款的记录数大于</span>
                  <el-input
                    placeholder="请输入次数"
                    v-model="form.judgeTimes"
                    clearable
                    style="width: 150px;"
                    disabled
                  />
                  笔记录则提醒
                  <el-input
                    type="textarea"
                    :rows="4"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入提醒内容"
                    v-model="form.remindContent"
                    clearable
                    disabled
                    style="width: 400px;"
                  />
                </el-form-item>
              </el-form>
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/warrantyOrderWarningRule/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  judgeDays: '',
  statusList: [],
  judgeTimes: '',
  remindContent: '',
  diffCharCount: ''  // BXYJ005 车牌号预警不匹配位数(独立字段,提交时合并到 extConfig JSON)
};

export default {
  name: 'warrantyOrderWarningRuleEdit',
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
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return this.form.ruleName || '保修单预警规则';
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
    // 当 extConfig 加载完成后, 把 diffCharCount 提取到 form.diffCharCount 独立字段
    'form.extConfig': {
      handler (val) {
        this.syncDiffCharCountFromExtConfig(val);
      },
      immediate: false
    },
    // 当切换到 BXYJ005 时, 也需要从 extConfig 加载 diffCharCount
    'form.ruleCode': {
      handler (val) {
        if (val === 'WWR-BXYJ005' && this.form.extConfig) {
          this.syncDiffCharCountFromExtConfig(this.form.extConfig);
        }
      },
      immediate: false
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '保修单预警规则',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-warrantyOrderWarningRule',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        judgeDays: [
          { required: true, message: '请输入判定天数', trigger: 'change' }
        ],
        statusList: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        judgeTimes: [
          { required: true, message: '请输入判定次数', trigger: 'change' }
        ],
        remindContent: [
          { required: true, message: '请输入提醒内容', trigger: 'change' }
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
      // OCR 类规则（BXYJ002/003/004/005）不需要 judgeDays/judgeTimes，仅校验提醒内容
      if (!this.isOcrRule(this.form.ruleCode)) {
        if (this.form.judgeDays === '' || this.form.judgeDays === null || this.form.judgeDays === undefined) {
          this.$message.error('请输入判定天数');
          return;
        }
        if (this.form.judgeTimes === '' || this.form.judgeTimes === null || this.form.judgeTimes === undefined) {
          this.$message.error('请输入判定次数');
          return;
        }
      }
      if (!this.form.remindContent) {
        this.$message.error('请输入提醒内容');
        return;
      }

      // BXYJ005 车牌号预警必须输入不匹配位数
      if (this.form.ruleCode === 'WWR-BXYJ005') {
        if (this.form.diffCharCount === '' || this.form.diffCharCount === null || this.form.diffCharCount === undefined) {
          this.$message.error('请输入不匹配位数');
          return;
        }
        if (Number(this.form.diffCharCount) < 0) {
          this.$message.error('不匹配位数不能小于 0');
          return;
        }
      }

      // 把 diffCharCount 合并到 extConfig JSON 字符串(后端 ext_config 是 JSON 字段)
      const submitForm = { ...this.form };
      if (this.form.ruleCode === 'WWR-BXYJ005') {
        let cfg = {};
        try {
          if (this.form.extConfig) cfg = JSON.parse(this.form.extConfig);
        } catch (e) {
          cfg = {};
        }
        cfg.diffCharCount = Number(this.form.diffCharCount);
        submitForm.extConfig = JSON.stringify(cfg);
        delete submitForm.diffCharCount;  // 移除冗余顶级字段
      }

      return addOrUpdate(submitForm);
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    /**
     * 是否为 OCR 类预警规则（触发时机为上传行驶证，不需要 judgeDays/judgeTimes）
     */
    isOcrRule (ruleCode) {
      if (!ruleCode) return false;
      return ['WWR-BXYJ002', 'WWR-BXYJ003', 'WWR-BXYJ004', 'WWR-BXYJ005'].includes(ruleCode);
    },
    /**
     * OCR 类预警规则的描述文案（按规则 code 返回，严格按需求原文）
     * BXYJ005 因为需要在描述中嵌入可编辑位数输入框，文案已硬编码在模板中，本方法不返回 BXYJ005
     */
    ocrRuleDescription (ruleCode) {
      const map = {
        // BXYJ002: 需求原文 "OCR识别行驶证所有人与系统车主姓名不一致"
        'WWR-BXYJ002': '当保修单上传行驶证附件时，若 OCR 行驶证所有人 与 系统车主姓名 不一致时：',
        // BXYJ003: 需求原文 "OCR识别行驶证使用性质为"非营运"，系统里不是家用"
        'WWR-BXYJ003': '当保修单上传行驶证附件时，若 OCR 行驶证使用性质 为"非营运"、且系统车辆用途 不是家用时：',
        // BXYJ004: 需求原文 "OCR识别行驶证使用性质不为"非营运"，对应系统属性为家用"
        'WWR-BXYJ004': '当保修单上传行驶证附件时，若 OCR 行驶证使用性质 不为"非营运"、且系统车辆用途 为家用时：'
      };
      return map[ruleCode] || '';
    },
    /**
     * 从 extConfig JSON 中解析 diffCharCount 到独立字段 (BXYJ005)
     */
    syncDiffCharCountFromExtConfig (val) {
      if (!val) {
        this.form.diffCharCount = '';
        return;
      }
      try {
        const cfg = JSON.parse(val);
        this.form.diffCharCount = cfg && cfg.diffCharCount !== undefined ? cfg.diffCharCount : '';
      } catch (e) {
        this.form.diffCharCount = '';
      }
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
      };
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
