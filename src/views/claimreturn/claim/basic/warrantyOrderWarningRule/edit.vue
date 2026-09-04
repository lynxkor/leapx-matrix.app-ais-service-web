<template>
  <edit-page-layout ref="editLayout" :title="pannelTitle" :width="40">
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
                <template v-if="isOcrRule(form.ruleType)">
                  <el-form-item class="form-item-line">
                    <!-- BXYJ005 车牌号预警: 描述中嵌入可编辑的位数 (参照 BXYJ001 的 365/0 模式) -->
                    <template v-if="form.ruleType === 'BXYJ005'">
                      <span>当保修单上传行驶证附件时，若 OCR 行驶证车牌号 与 系统车牌号 不匹配超过 </span>
                      <el-input-number
                        v-model="form.diffCharCount"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="width: 150px;"
                      />
                      <span> 位时，则提醒：</span>
                    </template>
                    <!-- BXYJ002 / BXYJ003 / BXYJ004: 纯文本描述 -->
                    <template v-else>
                      <span>{{ ocrRuleDescription(form.ruleType) }}</span>
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
                <!-- 其他规则（BXYJ001 重复维修预警 / BXYJ006 不同车重复附件预警）：保留原描述文案 -->
                <template v-else>
                  <el-form-item class="form-item-line">
                    <!-- BXYJ006 不同车重复附件预警: 描述中嵌入可编辑的天数 (参照 BXYJ001 的 365/0 模式) -->
                    <template v-if="form.ruleType === 'BXYJ006'">
                      <span>当前保修单所属门店中，创建日期大于等于当前日期- </span>
                      <el-input-number
                        placeholder="请输入天数"
                        v-model="form.withinDays"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="width: 150px;"
                      />
                      <span> 天，且 VIN 不等于当前车辆，同时保修状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，当前保修单相关附件在上述保修单中已使用，则提醒：</span>
                    </template>
                    <!-- BXYJ008 不同店重复附件预警: 复用 withinDays 输入控件, 文案改为跨店 -->
                    <template v-else-if="form.ruleType === 'BXYJ008'">
                      <span>创建日期大于等于当前日期- </span>
                      <el-input-number
                        placeholder="请输入天数"
                        v-model="form.withinDays"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="width: 150px;"
                      />
                      <span> 天，且不是当前保修单所属门店，同时保修状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，当前保修单相关附件在上述保修单中已使用，则提醒：</span>
                    </template>
                    <!-- BXYJ009 事故维修预警: 配置固定（90 天 + 5 种保修类型白名单 + 工单状态 + 保险），不暴露输入框 -->
                    <template v-else-if="form.ruleType === 'BXYJ009'">
                      <span>{{ accidentRuleDescription }}</span>
                    </template>
                    <!-- BXYJ007 不同周期重复附件预警: 配置固定（同车 + 维修周期区间不相交 + 6 状态匹配 + fileId 重复），不暴露输入框 -->
                    <template v-else-if="form.ruleType === 'BXYJ007'">
                      <span>{{ cycleDuplicateRuleDescription }}</span>
                    </template>
                    <!-- 模板提示: BXYJ006 / BXYJ008 支持 ${name} 和 ${names} 两个占位符 -->
                    <!-- ${name}: 第一个命中文件名 (向后兼容); ${names}: 所有命中文件名 (逗号分隔, 推荐使用) -->
                    <!-- BXYJ009 占位符: ${day} 时间窗口天数, ${workOrderNos} 命中的施工单号列表 (；分隔) -->
                    <!-- BXYJ001 重复维修预警等: 原有描述 -->
                    <template v-else>
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
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <!-- OCR 类预警规则详情 (BXYJ002/003/004/005) -->
                <template v-if="isOcrRule(form.ruleType)">
                  <el-form-item class="form-item-line">
                    <!-- BXYJ005 车牌号预警: 描述中嵌入只读位数 -->
                    <template v-if="form.ruleType === 'BXYJ005'">
                      <span>当保修单上传行驶证附件时，若 OCR 行驶证车牌号 与 系统车牌号 不匹配超过 </span>
                      <el-input
                        v-model="form.diffCharCount"
                        clearable
                        style="width: 150px;"
                        disabled
                      />
                      <span> 位时，则提醒：</span>
                    </template>
                    <!-- BXYJ002 / BXYJ003 / BXYJ004: 纯文本描述 -->
                    <template v-else>
                      <span>{{ ocrRuleDescription(form.ruleType) }}</span>
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
                <!-- 其他规则详情 (BXYJ001 / BXYJ006 等) -->
                <el-form-item class="form-item-line" v-else prop="judgeDays">
                  <!-- BXYJ006 不同车重复附件预警: 只读天数 -->
                  <template v-if="form.ruleType === 'BXYJ006'">
                    <span>当前保修单所属门店中，创建日期大于等于当前日期- </span>
                    <el-input
                      placeholder="天数"
                      v-model="form.withinDays"
                      clearable
                      style="width: 150px;"
                      disabled
                    />
                    <span> 天，且 VIN 不等于当前车辆，同时保修状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，当前保修单相关附件在上述保修单中已使用，则提醒：</span>
                  </template>
                  <!-- BXYJ008 不同店重复附件预警: 只读天数 -->
                  <template v-else-if="form.ruleType === 'BXYJ008'">
                    <span>创建日期大于等于当前日期- </span>
                    <el-input
                      placeholder="天数"
                      v-model="form.withinDays"
                      clearable
                      style="width: 150px;"
                      disabled
                    />
                    <span> 天，且不是当前保修单所属门店，同时保修状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，当前保修单相关附件在上述保修单中已使用，则提醒：</span>
                  </template>
                  <!-- BXYJ009 事故维修预警: 配置固定(只读展示) -->
                  <template v-else-if="form.ruleType === 'BXYJ009'">
                    <span>{{ accidentRuleDescription }}</span>
                  </template>
                  <!-- BXYJ007 不同周期重复附件预警: 配置固定(只读展示) -->
                  <template v-else-if="form.ruleType === 'BXYJ007'">
                    <span>{{ cycleDuplicateRuleDescription }}</span>
                  </template>
                  <!-- BXYJ001 重复维修预警等: 原有描述 -->
                  <template v-else>
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
              </el-form>
            </div>
          </section>

          <!-- BXYJ010 过度更换零件预警: 备件白名单 section（独立于基础信息表单，配置固定） -->
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
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import WhitelistTable from './WhitelistTable.vue';
import ReplaceDrawer from './ReplaceDrawer.vue';

const defaultForm = {
  judgeDays: '',
  statusList: [],
  judgeTimes: '',
  remindContent: '',
  diffCharCount: '', // BXYJ005 车牌号预警不匹配位数(独立字段,提交时合并到 extConfig JSON)
  withinDays: '' // BXYJ006 不同车 / BXYJ008 不同店 重复附件预警时间窗口(独立字段,提交时合并到 extConfig JSON)
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
    EditBaseContainer,
    WhitelistTable,
    ReplaceDrawer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return this.form.ruleName || '保修单预警规则';
    },
    /**
     * BXYJ009 事故维修预警的说明文案（前后端配置固定）
     * 触发时机：保修单上传附件时
     * 条件：保修类型在白名单 && VRT=全部 && 90天内有保险结算+待交车/已交车+工时/备件维修记录
     */
    accidentRuleDescription () {
      return '当保修单上传附件时，若保修类型为【售前保修、一般整车保修、整车终身质保、三电终身质保、三电延长保修】，且 VRT 为【全部】，若存在施工单 vin 为当前 vin，且结算日期大于等于当前日期-【90】天，且工单状态为【待交车，已交车】，同时还存在结算类型为【保险】的维修记录（工时或备件一项即可），则提醒：';
    },
    /**
     * BXYJ007 不同周期重复附件预警的说明文案（前后端配置固定）
     * 触发时机：上传/删除附件（含行驶证）
     * 条件：VIN 等于当前车辆 + 维修周期区间不相交（任一为 NULL 不命中）+ 6 种保修状态匹配 + fileId 已被历史单使用
     */
    cycleDuplicateRuleDescription () {
      return '当保修单上传或删除附件时，若 VIN 等于当前车辆，且维修周期与当前保修单不相同（维修开始-结束日期只要有交集，就当做是相同周期，任一端为空时按周期信息不处理），同时保修状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，当前保修单相关附件在上述保修单中已使用，则提醒：';
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
    // 当 extConfig 加载完成后, 把 diffCharCount / withinDays 提取到独立字段
    'form.extConfig': {
      handler (val) {
        this.syncExtConfigFields(val);
      },
      immediate: false
    },
    // 当切换规则 code 时, 也需要从 extConfig 加载对应字段
    'form.ruleType': {
      handler (val) {
        if (this.form.extConfig) {
          this.syncExtConfigFields(this.form.extConfig);
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
      // 右抽屉标题（参考 freeMaintenancePolicy 的 pannelTitle 模式）
      pannelTitle: '',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      // 替换件抽屉（BXYJ010）
      replaceDrawerVisible: false,
      currentReplacePart: {},
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
    /**
     * BXYJ010 备件白名单：点击"替换件"按钮 → 触发 EditPageLayout 右抽屉 + 设置替换件数据
     * 参考 freeMaintenancePolicy/edit.vue 的 onReplace：openPane() + replacePart
     */
    handleOpenReplace (row) {
      this.currentReplacePart = row;
      // 参考 freeMaintenancePolicy/edit.vue onReplace：动态设置标题 + 打开右抽屉
      this.pannelTitle = `零件编码：${row.partCode}`;
      if (this.$refs.editLayout && typeof this.$refs.editLayout.openPane === 'function') {
        this.$refs.editLayout.openPane();
      }
    },
    /**
     * 关闭右抽屉（替换件面板的 X 按钮触发）
     */
    handleCloseReplace () {
      this.currentReplacePart = {};
      if (this.$refs.editLayout && typeof this.$refs.editLayout.closePane === 'function') {
        this.$refs.editLayout.closePane();
      }
    },
    submitRequest () {
      // OCR 类规则（BXYJ002/003/004/005）不需要 judgeDays/judgeTimes，仅校验提醒内容
      // BXYJ006 / BXYJ008 也不需要 judgeDays/judgeTimes, 它们使用 withinDays
      // BXYJ009 事故维修预警: 配置全部固定（90天 + 5 种保修类型白名单 + 工单状态 + 保险）,
      //                   前端不暴露任何输入框, 也不需要 judgeDays/judgeTimes/withinDays 校验
      // BXYJ007 不同周期重复附件预警: 配置全部固定（同车 + 维修周期区间不相交 + 6 状态）,
      //                   前端不暴露任何输入框, 也不需要 judgeDays/judgeTimes/withinDays 校验
      const isOcr = this.isOcrRule(this.form.ruleType);
      const isBxyj006 = this.form.ruleType === 'BXYJ006';
      const isBxyj008 = this.form.ruleType === 'BXYJ008';
      const isBxyj009 = this.form.ruleType === 'BXYJ009';
      const isBxyj007 = this.form.ruleType === 'BXYJ007';
      if (!isOcr && !isBxyj006 && !isBxyj008 && !isBxyj009 && !isBxyj007) {
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
      if (this.form.ruleType === 'BXYJ005') {
        if (this.form.diffCharCount === '' || this.form.diffCharCount === null || this.form.diffCharCount === undefined) {
          this.$message.error('请输入不匹配位数');
          return;
        }
        if (Number(this.form.diffCharCount) < 0) {
          this.$message.error('不匹配位数不能小于 0');
          return;
        }
      }

      // BXYJ006 不同车重复附件预警必须输入时间窗口(天数)
      if (isBxyj006) {
        if (this.form.withinDays === '' || this.form.withinDays === null || this.form.withinDays === undefined) {
          this.$message.error('请输入时间窗口天数');
          return;
        }
        if (Number(this.form.withinDays) < 0) {
          this.$message.error('时间窗口不能小于 0');
          return;
        }
      }

      // BXYJ008 不同店重复附件预警: 同样要求输入时间窗口(天数)
      if (isBxyj008) {
        if (this.form.withinDays === '' || this.form.withinDays === null || this.form.withinDays === undefined) {
          this.$message.error('请输入时间窗口天数');
          return;
        }
        if (Number(this.form.withinDays) < 0) {
          this.$message.error('时间窗口不能小于 0');
          return;
        }
      }

      // BXYJ001 重复维修预警: judgeDays/judgeTimes 由后端 Builder 从 ext_config 读取,
      //                     前端继续保留这两个输入框, 但提交时合并到 extConfig JSON,
      //                     不再走主表字段(主表字段已删除, 单字段名会触发后端未知字段拒绝).
      if (this.form.ruleType === 'BXYJ001') {
        if (this.form.judgeDays === '' || this.form.judgeDays === null || this.form.judgeDays === undefined) {
          this.$message.error('请输入判定天数');
          return;
        }
        if (Number(this.form.judgeDays) < 0) {
          this.$message.error('判定天数不能小于 0');
          return;
        }
        if (this.form.judgeTimes === '' || this.form.judgeTimes === null || this.form.judgeTimes === undefined) {
          this.$message.error('请输入判定次数');
          return;
        }
        if (Number(this.form.judgeTimes) < 0) {
          this.$message.error('判定次数不能小于 0');
          return;
        }
      }

      // BXYJ009 事故维修预警: 所有参数后端固定, 前端不做额外校验, 提醒内容必填(上面已校验)

      // 把独立字段(diffCharCount / withinDays / judgeDays / judgeTimes)合并到 extConfig JSON 字符串(后端 ext_config 是 JSON 字段)
      const submitForm = { ...this.form };
      let cfg = {};
      try {
        if (this.form.extConfig) cfg = JSON.parse(this.form.extConfig);
      } catch (e) {
        cfg = {};
      }
      if (this.form.ruleType === 'BXYJ005') {
        cfg.diffCharCount = Number(this.form.diffCharCount);
        delete submitForm.diffCharCount;
      }
      if (isBxyj006) {
        cfg.withinDays = Number(this.form.withinDays);
        delete submitForm.withinDays;
      }
      if (isBxyj008) {
        cfg.withinDays = Number(this.form.withinDays);
        delete submitForm.withinDays;
      }
      // BXYJ001: judgeDays/judgeTimes 改由 ext_config 管理(主表字段已删除)
      if (this.form.ruleType === 'BXYJ001') {
        cfg.judgeDays = Number(this.form.judgeDays);
        cfg.judgeTimes = Number(this.form.judgeTimes);
        delete submitForm.judgeDays;
        delete submitForm.judgeTimes;
      }
      // BXYJ009 不需要合并任何独立字段, 直接透传后端的 extConfig (90/白名单/工单状态/保险)
      // BXYJ007 同样不需要合并任何独立字段, 配置全部后端固定
      if (this.form.ruleType === 'BXYJ005' || isBxyj006 || isBxyj008 || this.form.ruleType === 'BXYJ001') {
        submitForm.extConfig = JSON.stringify(cfg);
      }

      return addOrUpdate(submitForm).then(res => {
        // 保存成功后立即同步 judgeDays/judgeTimes / diffCharCount / withinDays 到 form,
        // 避免依赖 'form.extConfig' watch 时机失效(Vue 2 整体替换 form 对象时新对象未 reactive,
        // EditBaseContainer.loadDetail() 触发的 update:form 会让 watch 失效,导致输入框回退到默认 0).
        // 这一步是显式赋值,不依赖响应式追踪.
        if (this.form.ruleType === 'BXYJ005') {
          this.form.diffCharCount = cfg.diffCharCount;
        }
        if (isBxyj006 || isBxyj008) {
          this.form.withinDays = cfg.withinDays;
        }
        if (this.form.ruleType === 'BXYJ001') {
          this.form.judgeDays = cfg.judgeDays;
          this.form.judgeTimes = cfg.judgeTimes;
        }
        return res;
      });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    /**
     * 是否为 OCR 类预警规则（触发时机为上传行驶证，不需要 judgeDays/judgeTimes）
     */
    isOcrRule (ruleType) {
      if (!ruleType) return false;
      return ['BXYJ002', 'BXYJ003', 'BXYJ004', 'BXYJ005'].includes(ruleType);
    },
    /**
     * OCR 类预警规则的描述文案（按规则 code 返回，严格按需求原文）
     * BXYJ005 因为需要在描述中嵌入可编辑位数输入框，文案已硬编码在模板中，本方法不返回 BXYJ005
     */
    ocrRuleDescription (ruleType) {
      const map = {
        // BXYJ002: 需求原文 "OCR识别行驶证所有人与系统车主姓名不一致"
        BXYJ002: '当保修单上传行驶证附件时，若 OCR 行驶证所有人 与 系统车主姓名 不一致时，则提醒：',
        // BXYJ003: 需求原文 "OCR识别行驶证使用性质为"非营运"，系统里不是家用"
        BXYJ003: '当保修单上传行驶证附件时，若 OCR 行驶证使用性质 为"非营运"、且系统车辆用途 不是家用时，则提醒：',
        // BXYJ004: 需求原文 "OCR识别行驶证使用性质不为"非营运"，对应系统属性为家用"
        BXYJ004: '当保修单上传行驶证附件时，若 OCR 行驶证使用性质 不为"非营运"、且系统车辆用途 为家用时，则提醒：'
      };
      return map[ruleType] || '';
    },
    /**
     * 从 extConfig 中解析 diffCharCount (BXYJ005) / withinDays (BXYJ006/008) /
     * judgeDays (BXYJ001) / judgeTimes (BXYJ001) 到独立字段
     * <p>
     * 入参兼容两种类型: String (后端 Resp.extConfig 原始 JSON 字符串) / Object (已 JSON.parse 的对象).
     * BXYJ009 / BXYJ007 配置后端固定,无独立字段需要解析.
     * </p>
     */
    syncExtConfigFields (val) {
      const ruleType = this.form.ruleType;
      if (!val) {
        if (ruleType === 'BXYJ005') this.form.diffCharCount = '';
        if (ruleType === 'BXYJ006') this.form.withinDays = '';
        if (ruleType === 'BXYJ008') this.form.withinDays = '';
        if (ruleType === 'BXYJ001') {
          this.form.judgeDays = '';
          this.form.judgeTimes = '';
        }
        return;
      }
      // 容错: 入参可能是 string (JSON 字符串) 也可能是 object (已被 JSON.parse)
      let cfg = {};
      if (typeof val === 'string') {
        try {
          cfg = JSON.parse(val);
        } catch (e) {
          cfg = {};
        }
      } else if (typeof val === 'object') {
        cfg = val;
      }
      if (ruleType === 'BXYJ005') {
        this.form.diffCharCount = cfg.diffCharCount !== undefined && cfg.diffCharCount !== null ? cfg.diffCharCount : '';
      }
      if (ruleType === 'BXYJ006') {
        this.form.withinDays = cfg.withinDays !== undefined && cfg.withinDays !== null ? cfg.withinDays : '';
      }
      if (ruleType === 'BXYJ008') {
        this.form.withinDays = cfg.withinDays !== undefined && cfg.withinDays !== null ? cfg.withinDays : '';
      }
      if (ruleType === 'BXYJ001') {
        // judgeDays/judgeTimes 改由 ext_config 管理,主表字段已删除
        this.form.judgeDays = cfg.judgeDays !== undefined && cfg.judgeDays !== null ? cfg.judgeDays : '';
        this.form.judgeTimes = cfg.judgeTimes !== undefined && cfg.judgeTimes !== null ? cfg.judgeTimes : '';
      }
      // BXYJ009 不需要解析独立字段, 后端 extConfig 完全透传
      // BXYJ007 不需要解析独立字段, 后端 extConfig 完全透传
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
