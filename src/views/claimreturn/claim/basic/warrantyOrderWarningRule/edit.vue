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
                    <!-- BXYJ009 事故维修预警-->
                    <template v-else-if="form.ruleType === 'BXYJ009'">
                      <span>当保修单上传附件时,若保修类型为 </span>
                      <fetch-select
                        filterable
                        clearable
                        multiple
                        v-model="form.warrantyTypes"
                        :options="bxyj009WarrantyTypeOptions"
                        value-key="id"
                        label-key="name"
                        sub-label-key="code"
                        style="display: inline-block; width: 260px; vertical-align: middle;"
                      />
                      <span> ,且 VRT 为 </span>
                      <fetch-select
                        filterable
                        clearable
                        multiple
                        v-model="form.vrtIds"
                        :options="bxyj009VrtOptions"
                        value-key="id"
                        label-key="name"
                        sub-label-key="code"
                        style="display: inline-block; width: 260px; vertical-align: middle;"
                      />
                      <span> ,若存在施工单 vin 为当前 vin,且结算日期大于等于当前日期- </span>
                      <el-input-number
                        placeholder="请输入天数"
                        v-model="form.withinDays"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="display: inline-block; width: 130px; vertical-align: middle;"
                      />
                      <span> 天,且工单状态为 </span>
                      <fetch-select
                        :request="fetchOptions"
                        enumCode="OrderStatusEnum"
                        v-model="form.workOrderStatuses"
                        placeholder="请选择"
                        clearable
                        multiple
                        filterable
                        style="display: inline-block; width: 260px; vertical-align: middle;"
                      />
                      <span> ,同时还存在结算类型为 </span>
                      <fetch-select
                        filterable
                        clearable
                        multiple
                        v-model="form.checkoutTypeIds"
                        :options="bxyj009StatementTypeOptions"
                        value-key="code"
                        label-key="message"
                        style="display: inline-block; width: 260px; vertical-align: middle;"
                      />
                      <span> 的维修记录(工时或备件一项即可),则提醒:</span>
                    </template>
                    <!-- BXYJ010 过度更换零件预警: 编辑模式 -->
                    <template v-else-if="form.ruleType === 'BXYJ010'">
                      <span>当前保修单中申请的零件价格大于 </span>
                      <el-input-number
                        placeholder="价格"
                        v-model="form.partUnitPriceMin"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="width: 130px;"
                      />
                      <span> 元的零件，在对应同年款，同车系且当前提交时间大于等于当前时间- </span>
                      <el-input-number
                        placeholder="天数"
                        v-model="form.withinDays"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="width: 130px;"
                      />
                      <span> 天的其他保修单状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，更换了白名单内的零件（替换件视同相同零件）；若当店当前保修单对应零件在周期内更换数量大于等于 </span>
                      <el-input-number
                        placeholder="次数"
                        v-model="form.changeCountThreshold"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="width: 130px;"
                      />
                      <span> ，且当店更换比例大于全国更换比例的 </span>
                      <el-input-number
                        placeholder="倍数"
                        v-model="form.ratioThreshold"
                        :controls="false"
                        :max="999999999"
                        :min="0"
                        clearable
                        style="width: 130px;"
                      />
                      <span> 倍，则提醒=</span>
                    </template>
                    <!-- BXYJ007 不同周期重复附件预警: 配置固定（同车 + 维修周期区间不相交 + 6 状态匹配 + fileId 重复），不暴露输入框 -->
                    <template v-else-if="form.ruleType === 'BXYJ007'">
                      <span>{{ cycleDuplicateRuleDescription }}</span>
                    </template>
                    <!-- 模板提示: BXYJ006 / BXYJ008 支持 ${name} 和 ${names} 两个占位符 -->
                    <!-- ${name}: 第一个命中文件名 (向后兼容); ${names}: 所有命中文件名 (逗号分隔, 推荐使用) -->
                    <!-- BXYJ009 占位符: ${day} 时间窗口天数; 施工单号由前端从 detail.proxyNos 单独渲染为可跳转链接, 不嵌入文案避免重复 -->
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
                  <!-- BXYJ009 事故维修预警: 详情模式(只读, disabled fetch-select 展示实际配置的中文名) -->
                  <template v-else-if="form.ruleType === 'BXYJ009'">
                    <span>当保修单上传附件时,若保修类型为 </span>
                    <fetch-select
                      filterable
                      multiple
                      v-model="form.warrantyTypes"
                      :options="bxyj009WarrantyTypeOptions"
                      value-key="id"
                      label-key="name"
                      sub-label-key="code"
                      disabled
                      style="display: inline-block; width: 260px; vertical-align: middle;"
                    />
                    <span> ,且 VRT 为 </span>
                    <fetch-select
                      filterable
                      multiple
                      v-model="form.vrtIds"
                      :options="bxyj009VrtOptions"
                      value-key="id"
                      label-key="name"
                      sub-label-key="code"
                      disabled
                      style="display: inline-block; width: 260px; vertical-align: middle;"
                    />
                    <span> ,若存在施工单 vin 为当前 vin,且结算日期大于等于当前日期- </span>
                    <el-input
                      placeholder="天数"
                      v-model="form.withinDays"
                      clearable
                      disabled
                      style="display: inline-block; width: 130px; vertical-align: middle;"
                    />
                    <span> 天,且工单状态为 </span>
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="OrderStatusEnum"
                      v-model="form.workOrderStatuses"
                      placeholder="请选择"
                      clearable
                      multiple
                      filterable
                      disabled
                      style="display: inline-block; width: 260px; vertical-align: middle;"
                    />
                    <span> ,同时还存在结算类型为 </span>
                    <fetch-select
                      filterable
                      multiple
                      v-model="form.checkoutTypeIds"
                      :options="bxyj009StatementTypeOptions"
                      value-key="code"
                      label-key="message"
                      disabled
                      style="display: inline-block; width: 260px; vertical-align: middle;"
                    />
                    <span> 的维修记录(工时或备件一项即可),则提醒:</span>
                  </template>
                  <!-- BXYJ010 过度更换零件预警: 详情模式(只读) -->
                  <template v-else-if="form.ruleType === 'BXYJ010'">
                    <span>当前保修单中申请的零件价格大于 </span>
                    <el-input
                      v-model="form.partUnitPriceMin"
                      clearable
                      disabled
                      style="width: 130px;"
                    />
                    <span> 元的零件，在对应同年款，同车系且当前提交时间大于等于当前时间- </span>
                    <el-input
                      v-model="form.withinDays"
                      clearable
                      disabled
                      style="width: 130px;"
                    />
                    <span> 天的其他保修单状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，更换了白名单内的零件（替换件视同相同零件）；若当店当前保修单对应零件在周期内更换数量大于等于 </span>
                    <el-input
                      v-model="form.changeCountThreshold"
                      clearable
                      disabled
                      style="width: 130px;"
                    />
                    <span> ，且当店更换比例大于全国更换比例的 </span>
                    <el-input
                      v-model="form.ratioThreshold"
                      clearable
                      disabled
                      style="width: 130px;"
                    />
                    <span> 倍，则提醒=</span>
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
import { getList as repairGetList } from '@/api/maintain/basic/repairItemType';
import { vrtlist } from '@/api/claimreturn/claim/basic/vrt';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import WhitelistTable from './WhitelistTable.vue';
import ReplaceDrawer from './ReplaceDrawer.vue';

// BXYJ009 事故维修预警 - 保修类型白名单默认值(与后端 v3.sql / bxyj009_ext_config_v2.sql 对齐)
// UUID 来源: WarrantyTypeEnum.getCode() / warranty_apply.repair_item_type_id
// 仅作"新增"模式初始默认值, 已存量的规则从 ext_config 解析回填
const DEFAULT_BXYJ009_WARRANTY_TYPES = [
  'ED68D3F0-C1FB-E911-B0BB-FC82BA5F9EDF', // 售前保修 PRE_SALE_WARRANTY
  '5EA3066F-82AC-E911-B0BB-FC82BA5F9EDF', // 一般整车保修 GENERAL_VEHICLE_WARRANTY
  '5180E2BE-04AE-EE11-B156-E3C14957A562', // 整车终身质保 LIFETIME_VEHICLE_WARRANTY
  '2D87DFC4-04AE-EE11-B156-E3C14957A562', // 三电终身质保 LIFETIME_BATTERY_MOTOR_ELECTRONICS_WARRANTY
  'B96ED1D0-04AE-EE11-B156-E3C14957A562' // 三电延长质保 EXTENDED_BATTERY_MOTOR_ELECTRONICS_WARRANTY
];

const defaultForm = {
  judgeDays: '',
  statusList: [],
  judgeTimes: '',
  remindContent: '',
  diffCharCount: '', // BXYJ005 车牌号预警不匹配位数(独立字段,提交时合并到 extConfig JSON)
  withinDays: '', // BXYJ006 不同车 / BXYJ008 不同店 / BXYJ009 事故维修 时间窗口(独立字段,提交时合并到 extConfig JSON)
  warrantyTypes: [], // BXYJ009 事故维修预警 保修类型白名单(独立字段, 提交时合并到 extConfig JSON, 新增模式用 DEFAULT_BXYJ009_WARRANTY_TYPES 回填)
  vrtIds: [], // BXYJ009 事故维修预警 VRT 白名单(独立字段, 提交时合并到 extConfig JSON, 空数组=不校验VRT, 新增模式默认=全部启用的VRT id)
  workOrderStatuses: [], // BXYJ009 事故维修预警 工单状态白名单(独立字段, 提交时合并到 extConfig JSON, 新增模式用 DEFAULT_BXYJ009_WORK_ORDER_STATUSES 回填; form 上是字符串数组, 提交时 map(Number) 转数字)
  checkoutTypeIds: [], // BXYJ009 事故维修预警 结算类型白名单 UUID 列表(独立字段, 提交时合并到 extConfig JSON; 数组, 多选; 默认值=保险 UUID)
  partUnitPriceMin: '', // BXYJ010 过度更换零件预警 零件单价门槛(独立字段, 提交时合并到 extConfig JSON)
  changeCountThreshold: '', // BXYJ010 过度更换零件预警 更换数量阈值(独立字段, 提交时合并到 extConfig JSON)
  ratioThreshold: '' // BXYJ010 过度更换零件预警 比例倍数(独立字段, 提交时合并到 extConfig JSON)
};

// BXYJ009 工单状态白名单默认值(与后端 v3.sql 对齐: 160=待交车, 180=已交车)
// form 上是字符串(对应 OrderStatusEnum.code), 提交时转数字
const DEFAULT_BXYJ009_WORK_ORDER_STATUSES = ['160', '180'];

// BXYJ009 结算类型白名单默认值(对齐后端 Java StatementTypeEnum.INSURANCE.getCode() = 保险 UUID)
const DEFAULT_BXYJ009_CHECKOUT_TYPE_IDS = ['372BB70C-82AC-E911-B0BB-FC82BA5F9EDF'];

// BXYJ009 结算类型选项(对应后端 Java StatementTypeEnum 枚举, 下拉框直接使用, 不依赖数据中心字典)
const BXYJ009_STATEMENT_TYPE_OPTIONS = [
  { code: '352BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '自费' },
  { code: '372BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '保险' },
  { code: '392BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '保修' },
  { code: '3B2BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '合同' },
  { code: '3D2BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '内部结算' }
];

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
    FetchSelect,
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
        // BXYJ009 切换进来时, 加载保修类型白名单 + VRT 白名单选项(供 fetch-select :options 使用)
        if (val === 'BXYJ009') {
          this.loadBxyj009WarrantyTypeOptions();
          this.loadBxyj009VrtOptions();
        }
      },
      immediate: false
    },
    // 整体 form 被替换时(如保存后 EditBaseContainer loadDetail 触发 update:form),
    // 重新解析 extConfig 填充独立字段。当 extConfig 值不变时 form.extConfig watch 不会触发,
    // 但 form 对象引用变化会触发此 watch，确保 syncExtConfigFields 在新 form 对象上执行。
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
      // BXYJ009 保修类型白名单选项缓存(由 loadBxyj009WarrantyTypeOptions 加载)
      bxyj009WarrantyTypeOptions: [],
      // BXYJ009 VRT 白名单选项缓存(由 loadBxyj009VrtOptions 加载)
      bxyj009VrtOptions: [],
      // BXYJ009 结算类型选项(静态常量, 对应后端 Java StatementTypeEnum 枚举)
      bxyj009StatementTypeOptions: BXYJ009_STATEMENT_TYPE_OPTIONS,
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
      // BXYJ009 事故维修预警: 保修类型白名单前端可配(校验 warrantyTypes 至少 1 个),
      //                   其他条件后端固定, 不需要 judgeDays/judgeTimes 校验
      // BXYJ007 不同周期重复附件预警: 配置全部固定（同车 + 维修周期区间不相交 + 6 状态）,
      //                   前端不暴露任何输入框, 也不需要 judgeDays/judgeTimes/withinDays 校验
      const isOcr = this.isOcrRule(this.form.ruleType);
      const isBxyj006 = this.form.ruleType === 'BXYJ006';
      const isBxyj008 = this.form.ruleType === 'BXYJ008';
      const isBxyj009 = this.form.ruleType === 'BXYJ009';
      const isBxyj007 = this.form.ruleType === 'BXYJ007';
      const isBxyj010 = this.form.ruleType === 'BXYJ010';
      if (!isOcr && !isBxyj006 && !isBxyj008 && !isBxyj009 && !isBxyj007 && !isBxyj010) {
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

      // BXYJ009 事故维修预警: 保修类型白名单至少选 1 个 + 工单状态至少选 1 个 + 时间窗口天数必填且 ≥ 0
      if (isBxyj009) {
        if (!Array.isArray(this.form.warrantyTypes) || this.form.warrantyTypes.length === 0) {
          this.$message.error('请至少选择一种保修类型');
          return;
        }
        if (!Array.isArray(this.form.workOrderStatuses) || this.form.workOrderStatuses.length === 0) {
          this.$message.error('请至少选择一个工单状态');
          return;
        }
        if (this.form.withinDays === '' || this.form.withinDays === null || this.form.withinDays === undefined) {
          this.$message.error('请输入结算日期时间窗口天数');
          return;
        }
        if (Number(this.form.withinDays) < 0) {
          this.$message.error('结算日期时间窗口不能小于 0 天');
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

      // BXYJ010 过度更换零件预警: withinDays + partUnitPriceMin + changeCountThreshold + ratioThreshold 必填且 ≥ 0
      if (isBxyj010) {
        if (this.form.withinDays === '' || this.form.withinDays === null || this.form.withinDays === undefined) {
          this.$message.error('请输入时间窗口天数');
          return;
        }
        if (Number(this.form.withinDays) < 0) {
          this.$message.error('时间窗口天数不能小于 0');
          return;
        }
        if (this.form.partUnitPriceMin === '' || this.form.partUnitPriceMin === null || this.form.partUnitPriceMin === undefined) {
          this.$message.error('请输入零件单价门槛');
          return;
        }
        if (Number(this.form.partUnitPriceMin) < 0) {
          this.$message.error('零件单价门槛不能小于 0');
          return;
        }
        if (this.form.changeCountThreshold === '' || this.form.changeCountThreshold === null || this.form.changeCountThreshold === undefined) {
          this.$message.error('请输入更换数量阈值');
          return;
        }
        if (Number(this.form.changeCountThreshold) < 0) {
          this.$message.error('更换数量阈值不能小于 0');
          return;
        }
        if (this.form.ratioThreshold === '' || this.form.ratioThreshold === null || this.form.ratioThreshold === undefined) {
          this.$message.error('请输入比例倍数');
          return;
        }
        if (Number(this.form.ratioThreshold) < 0) {
          this.$message.error('比例倍数不能小于 0');
          return;
        }
      }

      // BXYJ009 事故维修预警: 保修类型白名单已校验(至少 1 个, 见上方 if(isBxyj009)),
      //                   其他条件后端固定, 提醒内容必填(见上方校验)

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
      // BXYJ009: warrantyTypes + vrtIds + withinDays + workOrderStatuses + checkoutTypeIds 合并到 extConfig JSON
      // vrtIds 允许空数组(表示不校验VRT), 不强制至少 1 个
      // workOrderStatuses: form 上是字符串数组(对应 enum code), 提交时 map(Number) 转数字(对齐后端 Builder)
      // checkoutTypeIds: form 是 UUID 字符串数组, 多选; 提交时透传(后端 Builder + Gateway + maintain SQL 都需要数组)
      if (isBxyj009) {
        cfg.warrantyTypes = [...(this.form.warrantyTypes || [])];
        cfg.vrtIds = [...(this.form.vrtIds || [])];
        cfg.withinDays = Number(this.form.withinDays);
        cfg.workOrderStatuses = (this.form.workOrderStatuses || []).map(Number);
        cfg.checkoutTypeIds = [...(this.form.checkoutTypeIds || [])];
        delete submitForm.warrantyTypes;
        delete submitForm.vrtIds;
        delete submitForm.withinDays;
        delete submitForm.workOrderStatuses;
        delete submitForm.checkoutTypeIds;
      }
      // BXYJ010: withinDays + partUnitPriceMin + changeCountThreshold + ratioThreshold 合并到 extConfig JSON
      if (isBxyj010) {
        cfg.withinDays = Number(this.form.withinDays);
        cfg.partUnitPriceMin = Number(this.form.partUnitPriceMin);
        cfg.changeCountThreshold = Number(this.form.changeCountThreshold);
        cfg.ratioThreshold = Number(this.form.ratioThreshold);
        delete submitForm.withinDays;
        delete submitForm.partUnitPriceMin;
        delete submitForm.changeCountThreshold;
        delete submitForm.ratioThreshold;
      }
      // BXYJ007 同样不需要合并任何独立字段, 配置全部后端固定
      if (this.form.ruleType === 'BXYJ005' || isBxyj006 || isBxyj008 || this.form.ruleType === 'BXYJ001' || isBxyj009 || isBxyj010) {
        submitForm.extConfig = JSON.stringify(cfg);
      }

      return addOrUpdate(submitForm).then(res => {
        // 保存成功后立即同步独立字段到 form（双保险: form watch + 此处显式赋值,
        // 避免依赖 'form.extConfig' watch 在 extConfig 值不变时不触发的缺陷）
        if (this.form.ruleType === 'BXYJ005') {
          this.$set(this.form, 'diffCharCount', cfg.diffCharCount);
        }
        if (isBxyj006 || isBxyj008) {
          this.$set(this.form, 'withinDays', cfg.withinDays);
        }
        if (this.form.ruleType === 'BXYJ001') {
          this.$set(this.form, 'judgeDays', cfg.judgeDays);
          this.$set(this.form, 'judgeTimes', cfg.judgeTimes);
        }
        if (isBxyj009) {
          this.$set(this.form, 'warrantyTypes', cfg.warrantyTypes);
          this.$set(this.form, 'vrtIds', cfg.vrtIds);
          this.$set(this.form, 'withinDays', cfg.withinDays);
          // 后端存的是数字数组, 前端 v-model 是字符串, 回填时转字符串给 fetch-select 选中
          this.$set(this.form, 'workOrderStatuses', (cfg.workOrderStatuses || []).map(String));
          // checkoutTypeIds 后端存 UUID 数组, 前端 v-model 直接是 UUID 字符串数组, 透传即可
          this.$set(this.form, 'checkoutTypeIds', [...(cfg.checkoutTypeIds || [])]);
        }
        if (isBxyj010) {
          this.$set(this.form, 'withinDays', cfg.withinDays);
          this.$set(this.form, 'partUnitPriceMin', cfg.partUnitPriceMin);
          this.$set(this.form, 'changeCountThreshold', cfg.changeCountThreshold);
          this.$set(this.form, 'ratioThreshold', cfg.ratioThreshold);
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
        if (ruleType === 'BXYJ009') {
          // extConfig 为空时, 重置为默认值(与后端 v3.sql 对齐, 5 种保修类型)
          this.form.warrantyTypes = [...DEFAULT_BXYJ009_WARRANTY_TYPES];
        }
        if (ruleType === 'BXYJ010') {
          this.form.withinDays = '';
          this.form.partUnitPriceMin = '';
          this.form.changeCountThreshold = '';
          this.form.ratioThreshold = '';
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
        this.$set(this.form, 'diffCharCount', cfg.diffCharCount !== undefined && cfg.diffCharCount !== null ? cfg.diffCharCount : '');
      }
      if (ruleType === 'BXYJ006') {
        this.$set(this.form, 'withinDays', cfg.withinDays !== undefined && cfg.withinDays !== null ? cfg.withinDays : '');
      }
      if (ruleType === 'BXYJ008') {
        this.$set(this.form, 'withinDays', cfg.withinDays !== undefined && cfg.withinDays !== null ? cfg.withinDays : '');
      }
      if (ruleType === 'BXYJ001') {
        // judgeDays/judgeTimes 改由 ext_config 管理,主表字段已删除
        this.$set(this.form, 'judgeDays', cfg.judgeDays !== undefined && cfg.judgeDays !== null ? cfg.judgeDays : '');
        this.$set(this.form, 'judgeTimes', cfg.judgeTimes !== undefined && cfg.judgeTimes !== null ? cfg.judgeTimes : '');
      }
      if (ruleType === 'BXYJ009') {
        // warrantyTypes 由 ext_config 管理(主表字段已删除); 缺失则用默认值兜底(新增模式 / 历史脏数据)
        this.$set(this.form, 'warrantyTypes', Array.isArray(cfg.warrantyTypes) && cfg.warrantyTypes.length > 0
          ? [...cfg.warrantyTypes]
          : [...DEFAULT_BXYJ009_WARRANTY_TYPES]);
        // vrtIds 由 ext_config 管理; 允许空数组(语义:不校验VRT), 不主动赋默认值
        this.$set(this.form, 'vrtIds', Array.isArray(cfg.vrtIds) ? [...cfg.vrtIds] : []);
        // withinDays 由 ext_config 管理; 缺失则默认 90(对齐后端 v3.sql 默认值)
        this.$set(this.form, 'withinDays', (cfg.withinDays !== undefined && cfg.withinDays !== null && cfg.withinDays !== '')
          ? cfg.withinDays
          : 90);
        // workOrderStatuses 由 ext_config 管理; 后端存数字数组, 前端 v-model 是字符串数组, 解析时 map(String)
        this.$set(this.form, 'workOrderStatuses', Array.isArray(cfg.workOrderStatuses) && cfg.workOrderStatuses.length > 0
          ? cfg.workOrderStatuses.map(String)
          : [...DEFAULT_BXYJ009_WORK_ORDER_STATUSES]);
        // checkoutTypeIds 由 ext_config 管理; 默认 [保险 UUID](对齐后端 v3.sql 默认值 + 后端 Builder 硬编码)
        this.$set(this.form, 'checkoutTypeIds', Array.isArray(cfg.checkoutTypeIds) && cfg.checkoutTypeIds.length > 0
          ? [...cfg.checkoutTypeIds]
          : [...DEFAULT_BXYJ009_CHECKOUT_TYPE_IDS]);
      }
      // BXYJ010: partUnitPriceMin / withinDays / changeCountThreshold / ratioThreshold 由 ext_config 管理
      // 使用 this.$set 确保保存后 form 被替换为新对象时仍能触发响应式更新(见上方 syncExtConfigFields 注释)
      if (ruleType === 'BXYJ010') {
        this.$set(this.form, 'partUnitPriceMin', (cfg.partUnitPriceMin !== undefined && cfg.partUnitPriceMin !== null && cfg.partUnitPriceMin !== '')
          ? cfg.partUnitPriceMin
          : 50);
        this.$set(this.form, 'withinDays', (cfg.withinDays !== undefined && cfg.withinDays !== null && cfg.withinDays !== '')
          ? cfg.withinDays
          : 90);
        this.$set(this.form, 'changeCountThreshold', (cfg.changeCountThreshold !== undefined && cfg.changeCountThreshold !== null && cfg.changeCountThreshold !== '')
          ? cfg.changeCountThreshold
          : 15);
        this.$set(this.form, 'ratioThreshold', (cfg.ratioThreshold !== undefined && cfg.ratioThreshold !== null && cfg.ratioThreshold !== '')
          ? cfg.ratioThreshold
          : 3);
      }
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
    },
    /**
     * BXYJ009 事故维修预警: 加载保修类型白名单选项到 bxyj009WarrantyTypeOptions
     * <p>供 fetch-select :options 使用, 调用方在 form.ruleType === 'BXYJ009' 时触发</p>
     */
    async loadBxyj009WarrantyTypeOptions () {
      try {
        const res = await repairGetList({ nameLike: '', pageSize: 99, pageNum: 1 });
        this.bxyj009WarrantyTypeOptions = (res && res.records) || [];
      } catch (err) {
        console.error('BXYJ009 保修类型加载失败:', err);
        this.bxyj009WarrantyTypeOptions = [];
      }
    },
    /**
     * BXYJ009 事故维修预警: 加载全部启用的 VRT 选项到 bxyj009VrtOptions
     * <p>供 fetch-select :options 使用, 调用方在 form.ruleType === 'BXYJ009' 时触发</p>
     * <p>传 statusIncludeList=[1] 只取启用的 VRT</p>
     */
    async loadBxyj009VrtOptions () {
      try {
        const res = await vrtlist({ statusIncludeList: [1], pageSize: 99, pageNum: 1 });
        const list = (res && (res.data || res.records || res)) || [];
        // vrtlist 可能返回 { value, label } 或 { id, name }, 统一映射成 { id, name } 给 fetch-select 用
        const options = (Array.isArray(list) ? list : []).map(item => ({
          id: item.id !== undefined ? item.id : item.value,
          name: item.name !== undefined ? item.name : item.label,
          code: item.code || ''
        }));
        this.bxyj009VrtOptions = options;
        // 默认行为: 加载完成后, 如果 form.vrtIds 是空数组(新增模式 / 后端默认空数组=不校验),
        //           自动填上所有启用的 VRT id, 实现"默认选中全部启用配置"
        // 注意: 只在空数组时填, 避免覆盖用户主动配置的非空数组(包括明确选择"不校验")
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
