<template>
  <div class="outer-container" :class="{ 'single-condition': conditions.length === 1 }">
    <div class="and-label logic-toggle" v-show="conditions.length > 1" @click="toggleOuterLogic">
      {{ outerLogic }}
    </div>
    <div
      class="conditions-wrapper"
      :class="{ 'has-multiple-conditions': conditions.length > 1 }"
    >
      <div
        v-for="(condition, conditionIndex) in conditions"
        :key="conditionIndex"
        class="main-content"
        :class="{
          'first-condition': conditionIndex === 0,
          'last-condition': conditionIndex === conditions.length - 1 && conditions.length > 1
        }"
      >
        <div class="condition">
          <div class="interior-container" :class="{ 'single-item': condition.dataList.length === 1 }">
            <!--  @click="toggleInnerLogic(conditionIndex)" -->
            <div class="and-label logic-toggle" v-show="condition.dataList.length > 1">
              {{ condition.logic }}
            </div>
            <div
              class="content-container"
              :class="{
                'has-multiple-items': condition.dataList.length >= 2,
                'single-item': condition.dataList.length === 1
              }"
            >
              <div
                v-for="(item, itemIndex) in condition.dataList"
                :key="itemIndex"
                class="data-item"
                :class="{ 'first-item': itemIndex === 0, 'last-item': itemIndex === condition.dataList.length - 1 }"
              >
                <!-- 字段选择 -->
                <fetch-select
                  ref="fieldSelectRef"
                  :options="fieldOptions"
                  v-model="item.field"
                  placeholder="请选择条件项"
                  value-key="value"
                  label-key="label"
                  @change="(val, row) => handleFieldChange(val, row, conditionIndex, itemIndex)"
                  clearable
                  style="margin-right: 10px; width: 200px;"
                />
                <!-- 逻辑判断 -->
                <el-select
                  v-model="item.operator"
                  placeholder="请选择逻辑判断"
                  style="margin-right: 10px;"
                  clearable
                >
                  <el-option
                    v-for="option in getOperatorOptions(item.field)"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>

                <!-- 条件值 - 根据 fieldType 动态展示 -->
                <!-- 文本类型 - 不返件规则下备件编码/供应商编码用内部 wrapper 渲染 TagInput，
                     解决 TagInput watch lazy 导致的回显丢失问题（不修改 libs 公共组件） -->
                <wrapper-tag-input
                  v-if="item.fieldType === 'text' && isNoReturnRule && isBatchTextField(item.field)"
                  :value="item.value"
                  :key="`tag-${item.field}-${conditionIndex}-${itemIndex}`"
                  placeholder="请输入编码"
                  @input="(val) => handleTagChange(val, conditionIndex, itemIndex)"
                  style="margin-right: 10px; width: 320px;"
                />
                <el-input
                  v-else-if="item.fieldType === 'text'"
                  v-model="item.value"
                  :key="`text-${conditionIndex}-${itemIndex}`"
                  placeholder="请输入条件值"
                  clearable
                  style="margin-right: 10px; width: 200px;"
                />
                <!-- 枚举类型 - 使用 fetch-select 远程加载（不返件规则下启用 multiple） -->
                <fetch-select
                  v-else-if="item.fieldType === 'dict'"
                  :request="fetchOptions"
                  :enumCode="item.valueSource"
                  v-model="item.value"
                  :key="`dict-${item.valueSource}-${conditionIndex}-${itemIndex}`"
                  :default-options="item._selectedOptions || []"
                  placeholder="请选择条件值"
                  clearable
                  :multiple="isNoReturnRule"
                  collapse-tags
                  @change="(val, opt) => handleDictChange(val, opt, conditionIndex, itemIndex)"
                  style="margin-right: 10px; width: 200px;"
                />
                <!-- URL 类型 - 远程搜索（不返件规则下启用 multiple） -->
                <fetch-select
                  v-else-if="item.fieldType === 'url'"
                  :remote-method="(keyword) => handleUrlRemoteMethod(keyword, item)"
                  :value-key="getUrlFieldKey(item.field, 'value')"
                  :label-key="getUrlFieldKey(item.field, 'label')"
                  :sub-label-key="getUrlFieldKey(item.field, 'sub')"
                  v-model="item.value"
                  :key="`url-${item.valueSource}-${conditionIndex}-${itemIndex}`"
                  :default-options="item._selectedOptions || []"
                  placeholder="请选择条件值"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  :multiple="isNoReturnRule"
                  collapse-tags
                  @change="(val, opt) => handleUrlChange(val, opt, conditionIndex, itemIndex)"
                  style="margin-right: 10px; width: 200px;"
                />
                <!-- 默认展示输入框 -->
                <el-input
                  v-else
                  v-model="item.value"
                  :key="`default-${conditionIndex}-${itemIndex}`"
                  placeholder="请输入条件值"
                  clearable
                  style="margin-right: 10px; width: 200px;"
                />

                <!-- 操作按钮 -->
                <div class="button-group">
                  <i @click="removeData(conditionIndex, itemIndex)" v-if="condition.dataList.length > 1" class="el-icon-minus" />
                  <i @click="addData(conditionIndex)" class="el-icon-plus" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="button-group outer-button-group">
          <i @click="removeOuterCondition(conditionIndex)" class="el-icon-minus" />
          <i @click="addOuterCondition" class="el-icon-plus" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import { getEnum } from '@/api/common';
import { attachmentConfigConditionPage } from '@/libs/api/attachment';
import api from '@/axios';

// 不返件规则 4 个必填字段的中文映射（提交校验用）
const NO_RETURN_RULE_FIELD_LABELS = {
  WARRANTY_TYPE: '保修类型',
  PART_CODE: '备件编码',
  SUPPLIER_CODE: '供应商编码',
  PART_UNIT_PRICE: '零件单价'
};

// 内部 wrapper：解决 TagInput watch lazy 导致的回显丢失问题。
// TagInput 内部的 watch.value 默认 lazy，回显场景下：
//   setConditions 时 item.value 已是 ['B001']，TagInput 又是新建实例，
//   prop value 在 created 之前就到位，watcher 注册后 oldVal === newVal，
//   后续父组件 prop 不再变化 → watch 永远不触发 → tagList 永远是 []。
// libs 是公共组件，不允许改动，所以这里在内部用 innerValue 中转：
// mounted 之后再把真实 value 推下去，人为制造一次 prop value 变化触发子组件 watch。
// 思路与 libs/components/CustomView/ValueTagInput.vue 一致。
const WrapperTagInput = {
  name: 'WrapperTagInput',
  props: {
    value: {
      type: [Array, String],
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return { innerValue: [] };
  },
  watch: {
    value () {
      this.syncDown();
    }
  },
  mounted () {
    this.syncDown();
  },
  methods: {
    normalize (val) {
      if (Array.isArray(val)) return val;
      if (val === null || val === undefined || val === '') return [];
      return [val];
    },
    syncDown () {
      const next = this.normalize(this.value);
      // 内容一致则跳过，避免 input 事件回流形成死循环
      if (JSON.stringify(next) === JSON.stringify(this.innerValue)) return;
      this.innerValue = next;
    }
  },
  render (h) {
    return h(TagInput, {
      props: {
        value: this.innerValue,
        placeholder: this.placeholder,
        disabled: this.disabled
      },
      on: {
        input: (val) => this.$emit('input', val)
      }
    });
  }
};

export default {
  name: 'Condition',
  props: {
    configCode: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    FetchSelect,
    WrapperTagInput
  },
  data () {
    return {
      fieldOptions: [],
      // 存储每个字段的 fieldType 信息
      fieldTypeInfoMap: {},
      // 不返件规则专属字段（写死 4 个）
      // 保修类型是 url 远程搜索下拉（与列表页保修类型筛选器行为一致）；
      // 备件编码/供应商编码改为文本批量输入（TagInput），不再调远程搜索接口；
      // 零件单价保持单值数值输入。
      noReturnRuleFields: [
        { label: '保修类型', value: 'WARRANTY_TYPE', fieldType: 'url', valueSource: '/maintain/web/basic/repairItemType/page' },
        { label: '备件编码', value: 'PART_CODE', fieldType: 'text', valueSource: '' },
        { label: '供应商编码', value: 'SUPPLIER_CODE', fieldType: 'text', valueSource: '' },
        { label: '零件单价', value: 'PART_UNIT_PRICE', fieldType: 'text', valueSource: '' }
      ],
      allOperatorOptions: [
        { label: '等于', value: '=' },
        { label: '不等于', value: '!=' },
        { label: '大于', value: '>' },
        { label: '小于', value: '<' },
        { label: '大于等于', value: '>=' },
        { label: '小于等于', value: '<=' }
      ],
      outerLogic: 'OR',
      conditions: [
        {
          logic: 'AND',
          dataList: [
            { field: '', fieldType: '', operator: '=', value: '', isMultiValue: false }
          ]
        }
      ]
    };
  },
  computed: {
    isNoReturnRule () {
      return this.configCode === 'warranty_no_return_rule';
    }
  },
  mounted () {
    this.loadFieldOptions();
  },
  methods: {
    /**
     * 根据字段返回对应操作符选项
     * 不返件规则场景：保修类型/备件/供应商 → =/!=；零件单价 → >=/<=
     * 其他场景：6 个全开
     */
    getOperatorOptions (field) {
      if (!this.isNoReturnRule || !field) {
        return this.allOperatorOptions;
      }
      if (['WARRANTY_TYPE', 'PART_CODE', 'SUPPLIER_CODE'].includes(field)) {
        return [
          { label: '等于', value: '=' },
          { label: '不等于', value: '!=' }
        ];
      }
      if (field === 'PART_UNIT_PRICE') {
        return [
          { label: '大于等于', value: '>=' },
          { label: '小于等于', value: '<=' }
        ];
      }
      return this.allOperatorOptions;
    },
    /**
     * 根据字段返回默认操作符
     * 不返件规则下：保修类型/备件/供应商 → '='；零件单价 → '>='
     * 其他场景：'='
     * 用于切换字段时把当前 operator 重置为合法默认值，
     * 避免 el-select 的 v-model 值不在新选项列表里造成显示空白。
     */
    getDefaultOperator (field) {
      if (this.isNoReturnRule && field === 'PART_UNIT_PRICE') {
        return '>=';
      }
      return '=';
    },
    /**
     * dict 类型多值变化处理（标记 isMultiValue）
     * selectedOption 由 fetch-select 的 change 事件传入，含 value+label 完整对象，
     * 持久化到 item._selectedOptions，下次打开弹窗时通过 :default-options 传给
     * fetch-select，用于补全 options 中找不到的项（避免 el-select 在 multiple 模式下
     * 因 selectedLabels 为空而显示空白）。
     */
    handleDictChange (val, selectedOption, conditionIndex, itemIndex) {
      const isMulti = this.isNoReturnRule && Array.isArray(val) && val.length > 0;
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'isMultiValue', isMulti);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'value', val);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], '_selectedOptions', Array.isArray(selectedOption) ? selectedOption : []);
    },
    /**
     * url 类型多值变化处理（标记 isMultiValue）
     * selectedOption 由 fetch-select 的 change 事件传入，含 value+label(+code) 完整对象，
     * 持久化到 item._selectedOptions，下次打开弹窗时通过 :default-options 传给
     * fetch-select，用于补全 options 中找不到的项（避免 el-select 在 multiple 模式下
     * 因 selectedLabels 为空而显示空白）。这是保修类型回显看不见值问题的修复点。
     */
    handleUrlChange (val, selectedOption, conditionIndex, itemIndex) {
      const isMulti = this.isNoReturnRule && Array.isArray(val) && val.length > 0;
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'isMultiValue', isMulti);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'value', val);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], '_selectedOptions', Array.isArray(selectedOption) ? selectedOption : []);
    },
    handleFieldChange (_, row, conditionIndex, itemIndex) {
      // 切换字段时根据字段类型决定 value 的初始形态：
      // 1) 不返件规则下 url/dict（multiple 多选下拉）：用 []，否则 Element UI el-select 内部
      //    handleOptionSelect 调用 value.push() 会因字符串没有 push 方法而 TypeError 卡死
      // 2) 不返件规则下 text 批量输入字段（备件编码/供应商编码）：用 []
      // 3) 其他（单值 text / 单值 url/dict）：用 ''
      const isNoReturnRuleMultiSelect = this.isNoReturnRule && (row.fieldType === 'dict' || row.fieldType === 'url');
      const isBatchText = row.fieldType === 'text' && this.isBatchTextField(row.value);
      const initialValue = (isNoReturnRuleMultiSelect || isBatchText) ? [] : '';
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'value', initialValue);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'isMultiValue', false);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'valueSource', row.valueSource);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'fieldType', row.fieldType);
      // 切换字段时同步把 operator 重置为新字段的默认操作符，
      // 避免旧值（如 '='）不在新选项列表里导致 el-select 显示空白
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'operator', this.getDefaultOperator(row.value));
    },
    /**
     * 文本批量输入字段白名单（不返件规则下，备件编码/供应商编码用 TagInput 批量录入）。
     * 数组对应后端 IN/NOT IN 语义（matcher 用 compareValuesWithMulti 解析）。
     */
    isBatchTextField (field) {
      return ['PART_CODE', 'SUPPLIER_CODE'].includes(field);
    },
    /**
     * TagInput 的 @input：用 :value 单向绑定，所以这里把 val 同步写回 item.value，
     * 同时标记 isMultiValue，让后端 matcher 走多值分支。
     */
    handleTagChange (val, conditionIndex, itemIndex) {
      // 兼容 TagInput 偶发传 undefined / null（弹窗关闭时触发）
      const list = Array.isArray(val) ? val : [];
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'value', list);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'isMultiValue', list.length > 0);
    },
    // URL 类型的远程搜索（仅保修类型仍走 url 远程搜索；备件编码/供应商编码已改为 text 批量输入，不再触发此方法）
    async handleUrlRemoteMethod (keyword, item) {
      const url = item.valueSource;
      if (!url) return [];
      try {
        let payload;
        if (this.isNoReturnRule && item.field === 'WARRANTY_TYPE') {
          // 保修类型走维修项目接口，按列表页保修类型筛选器行为双层过滤：
          // 1) 后端 categorys=['20'] 限定维修项目大类；2) 前端 checkoutTypeName 仅保留「保修/合同」
          payload = { nameLike: keyword, pageNum: 1, pageSize: 50, categorys: ['20'] };
        } else {
          // 附件分类场景：保持原有 { keyword } 行为，向后兼容
          payload = { keyword };
        }
        const res = await api.jsonPost(url, payload);
        // api.jsonPost 走 fetch 的 axios.post(...).then(res => res.data) 链路，
        // 最终 resolve 的是 PageResp 对象 { records, total }（不是 axios 原始的 { code, message, data }）
        // 兼容其他服务直传数组的场景，统一解包为数组
        let list = (res && (res.records || res.data || res)) || [];
        if (this.isNoReturnRule && item.field === 'WARRANTY_TYPE') {
          // 与列表页保修类型筛选器保持一致：仅展示 checkoutTypeName 为「保修/合同」的维修项目
          list = (Array.isArray(list) ? list : []).filter(it => it.checkoutTypeName && ['保修', '合同'].includes(it.checkoutTypeName));
        }
        return Array.isArray(list) ? list : [];
      } catch (err) {
        console.error('获取远程数据失败', err);
        return [];
      }
    },
    /**
     * 不返件规则下 url 类型 fetch-select 的字段映射：
     *   - value：实际写入 item.value 的字段（与后端 matcher 比对依据）
     *   - label：下拉框主标签（名称）
     *   - sub：下拉框副标签（编码；与列表页保修类型下拉框 sub-label-key="code" 风格一致）
     *
     * 不同字段对应接口返回的 record 字段名不同，不能写死 value-key="id" label-key="name"：
     *   保修类型 /maintain/web/basic/repairItemType/page      → id / name / code
     *   备件编码 /sp/web/basic/sparePartSupplier/list         → partCode / partName / partCode
     *   供应商编码 /sp/web/basic/supplierInfo/list            → supplierCode / supplierName / supplierCode
     */
    getUrlFieldKey (field, type) {
      const map = {
        WARRANTY_TYPE: { value: 'id', label: 'name', sub: 'code' },
        PART_CODE: { value: 'partCode', label: 'partName', sub: 'partCode' },
        SUPPLIER_CODE: { value: 'supplierCode', label: 'supplierName', sub: 'supplierCode' }
      };
      const cfg = map[field] || { value: 'id', label: 'name', sub: 'code' };
      return cfg[type] || '';
    },
    // 加载字段选项
    loadFieldOptions () {
      // 不返件规则场景：使用写死的字段列表，不调用接口
      if (this.isNoReturnRule) {
        this.fieldOptions = this.noReturnRuleFields;
        return;
      }
      // 附件分类场景：调用 attachmentConfigConditionPage 接口
      const params = { pageNum: 1, pageSize: 100 };
      if (this.configCode) {
        params.configCode = this.configCode;
      }
      attachmentConfigConditionPage(params)
        .then(res => {
          const records = res.records || [];
          this.fieldOptions = records.map(item => ({
            label: item.fieldLabel,
            value: item.fieldName,
            fieldType: item.fieldType,
            valueSource: item.valueSource
          }));
        })
        .catch(err => {
          console.error('加载字段选项失败', err);
        });
    },
    addData (conditionIndex) {
      this.conditions[conditionIndex].dataList.push({
        field: '',
        operator: '',
        value: '',
        isMultiValue: false
      });
    },
    removeData (conditionIndex, itemIndex) {
      this.conditions[conditionIndex].dataList.splice(itemIndex, 1);
    },
    addOuterCondition () {
      this.conditions.push({
        logic: 'AND',
        dataList: [{ field: '', operator: '', value: '', isMultiValue: false }]
      });
    },
    removeOuterCondition (conditionIndex) {
      if (this.conditions.length > 1) {
        this.conditions.splice(conditionIndex, 1);
      }
    },
    // 切换外层逻辑（OR/AND）
    toggleOuterLogic () {
      this.outerLogic = this.outerLogic === 'OR' ? 'AND' : 'OR';
    },
    // 切换内层逻辑（AND/OR）
    toggleInnerLogic (conditionIndex) {
      const condition = this.conditions[conditionIndex];
      const newLogic = condition.logic === 'AND' ? 'OR' : 'AND';
      this.$set(condition, 'logic', newLogic);
    },
    // 获取条件数据（供父组件调用）
    getConditions () {
      // 深拷贝并剔除内存中的回显辅助字段 _selectedOptions，
      // 避免接口返回的完整元数据(code/name/sort/remark/...)污染数据库 condition_json。
      // _selectedOptions 只在内存中给 fetch-select 的 :default-options 用，
      // 不属于业务持久化数据。
      const cleaned = JSON.parse(JSON.stringify(this.conditions));
      cleaned.forEach(condition => {
        if (Array.isArray(condition.dataList)) {
          condition.dataList.forEach(item => {
            delete item._selectedOptions;
          });
        }
      });
      return {
        outerLogic: this.outerLogic,
        conditions: cleaned
      };
    },
    // 设置条件数据（供父组件回显）
    setConditions (data) {
      // 支持两种格式：包含 outerLogic 的新格式 或 只有 conditions 的旧格式
      let conditions = data;
      let outerLogic = 'OR';

      if (data && data.outerLogic !== undefined) {
        // 新格式：{ outerLogic: 'OR', conditions: [...] }
        outerLogic = data.outerLogic;
        conditions = data.conditions;
      }

      this.outerLogic = outerLogic;

      if (conditions && Array.isArray(conditions)) {
        // 关键时序：先在 plain object 上完成规范化（深拷贝 + 补全字段），
        // 再整体赋值给 this.conditions——一次性触发响应式更新。
        // 避免"先赋值再 forEach 修改"的写法：当 item.fieldType 已经是 'text' 时
        // Vue 2 的 reactiveSetter 检测 newVal === value 直接 return，不触发 dep.notify，
        // 而 this.conditions 引用变化触发的 watcher flush 后，模板读取到的 item.fieldType
        // 又是修改过的值——这种时序在某些场景下会让渲染失效。
        const normalized = JSON.parse(JSON.stringify(conditions));
        normalized.forEach(condition => {
          // 确保 logic 有值，默认为 AND
          condition.logic = condition.logic || 'AND';
          condition.dataList.forEach(item => {
            // 兼容旧数据：缺 fieldType 时根据 valueSource 推断
            if (item.field && !item.fieldType) {
              if (item.valueSource && (item.valueSource.startsWith('http') || item.valueSource.startsWith('/'))) {
                item.fieldType = 'url';
              } else if (item.valueSource && item.valueSource.startsWith('dict:')) {
                item.fieldType = 'dict';
              } else {
                item.fieldType = 'text';
              }
            }
            // 不返件规则下，备件编码/供应商编码的值必须规范成数组（TagInput v-model 期望数组）
            if (this.isNoReturnRule && this.isBatchTextField(item.field)) {
              item.fieldType = 'text';
              if (!Array.isArray(item.value)) {
                item.value = item.value !== '' && item.value !== null && item.value !== undefined
                  ? [item.value]
                  : [];
              }
              item.isMultiValue = item.value.length > 0;
            }
            // 不返件规则下，url/dict（multiple 多选下拉）的值必须是数组：
            // Element UI el-select 内部 handleOptionSelect 会调用 value.push(option.value)，
            // 如果 value 是字符串 '' 会抛 TypeError 导致点击失效卡死。
            // 这里把非数组的 value 规范化：单值→[val]，空→[]
            if (this.isNoReturnRule && (item.fieldType === 'dict' || item.fieldType === 'url')) {
              if (!Array.isArray(item.value)) {
                item.value = item.value !== '' && item.value !== null && item.value !== undefined
                  ? [item.value]
                  : [];
              }
              item.isMultiValue = item.value.length > 0;
            }
          });
        });
        // 整体赋值触发响应式（Vue 2 observe 会递归把数组和元素都变成响应式）
        this.conditions = normalized;
      }
    },
    // 重置条件（供父组件调用）
    resetConditions () {
      this.outerLogic = 'OR';
      this.conditions = [
        {
          logic: 'AND',
          dataList: [
            { field: 'carSeries', fieldType: 'text', operator: '=', value: 'B10' },
            { field: 'yearType', fieldType: 'text', operator: '=', value: '2026' }
          ]
        }
      ];
    },
    /**
     * 提交校验入口（供父组件调用）。
     *   - 非不返件规则：保持原有"至少一条完整条件"逻辑
     *   - 不返件规则：4 个必填字段逐行校验（PART_UNIT_PRICE 额外校验数字格式）
     * 返回 { valid, errors }，errors 为所有错误文案（弹窗默认只展示首条）
     */
    validate () {
      if (!this.isNoReturnRule) {
        const hasValidItem = this.conditions.some(g =>
          g.dataList && g.dataList.some(it =>
            it.field && it.operator &&
            (it.value !== '' && it.value !== null && it.value !== undefined) &&
            (!Array.isArray(it.value) || it.value.length > 0)
          )
        );
        return {
          valid: hasValidItem,
          errors: hasValidItem ? [] : ['请至少配置一条完整的条件']
        };
      }

      const errors = [];
      let rowCount = 0;
      this.conditions.forEach((g, gIdx) => {
        if (!g.dataList) return;
        g.dataList.forEach((item, iIdx) => {
          rowCount++;
          // 每一行条件都必须完整填写：条件项/逻辑判断/条件值逐项校验，空行也报错
          if (!item.field || !String(item.field).trim()) {
            errors.push(`第${rowCount}行：请选择条件项`);
            return;
          }
          if (!item.operator || !String(item.operator).trim()) {
            errors.push(`第${rowCount}行：请选择逻辑判断`);
            return;
          }
          if (!this.hasFilledValue(item.value)) {
            errors.push(`第${rowCount}行：条件值不能为空`);
            return;
          }
          const err = this.validateRequiredField(item, gIdx, iIdx);
          if (err) errors.push(err);
        });
      });
      if (rowCount === 0) {
        errors.push('请至少配置一条条件');
      }
      return { valid: errors.length === 0, errors };
    },
    /**
     * 条件值是否有实际内容：数组按"存在非空元素"判定，字符串按 trim 后非空判定
     */
    hasFilledValue (value) {
      if (Array.isArray(value)) {
        return value.some(v => v !== null && v !== undefined && String(v).trim() !== '');
      }
      return value !== null && value !== undefined && String(value).trim() !== '';
    },
    /**
     * 单行字段校验：返回 null 表示通过，返回字符串表示错误文案
     * 仅处理 NO_RETURN_RULE_FIELD_LABELS 中的 4 个字段；条件项/逻辑判断/条件值的必填
     * 已在 validate() 中逐行校验，这里只做字段合法性与格式校验
     */
    validateRequiredField (item, gIdx, iIdx) {
      const label = NO_RETURN_RULE_FIELD_LABELS[item.field];
      if (!label) return null;

      // 空值校验（数组视为空数组；字符串 trim 后纯空格同样视为空）
      const isEmpty = !this.hasFilledValue(item.value);
      if (isEmpty) {
        return `【${label}】不能为空`;
      }

      // 零件单价：必须 ≥ 0 的数字，正则拒绝 99..99、-5、abc、5. 等格式
      if (item.field === 'PART_UNIT_PRICE') {
        const rawVal = Array.isArray(item.value) ? item.value[0] : item.value;
        const strVal = String(rawVal).trim();
        if (!/^\d+(\.\d+)?$/.test(strVal)) {
          return `【${label}】格式错误`;
        }
      }

      return null;
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
.condition {
  width: 100%;
  border-radius: 5px;
  padding: 20px 10px 20px 30px;
}
.outer-container-borde {
  border: 1px solid #ddd;

}
.condition-group {
  padding: 20px;
}
.outer-container {
  padding: 20px 10px 20px 50px;
  margin-left: 20px;
  position: relative;
  min-height: 80px;
}

.outer-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 12px 0 0 12px;
  pointer-events: none;
  box-sizing: border-box;
}

// 当只有一个条件且该条件只有一条数据时隐藏外层边框
.outer-container.single-condition::before {
  display: none;
}
.interior-container {
  // 确保没有完整的边框
  border: none;
  border-radius: 12px;
  padding: 20px 30px;
  padding-right: 0;
  position: relative;
  min-height: 80px;
}

.interior-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
  border: 1px solid #ddd;
  border-right: none; // 明确取消右边框
  border-radius: 12px 0 0 12px;
  pointer-events: none;
  box-sizing: border-box;
}

// 当只有一条数据时隐藏边框
.interior-container.single-item::before {
  display: none;
}

.and-label {
  position: absolute;
  top: 50%;
  left: -20px;
  transform: translateY(-50%);
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  padding: 5px 10px;
  // font-size: 14px;
  color: #666;
  font-weight: bold;
}

// 可切换的逻辑标签样式
.and-label.logic-toggle {
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: var(--leap-color-primary);
    color: white;
    border-color: var(--leap-color-primary);
  }
}

.conditions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  // 调整对齐方式
  align-items: center;
}

// 修改 main-content 的条件样式逻辑
// 只有当 conditions 长度大于 1 时才应用特殊样式
.main-content {
  &.first-condition {
    margin-top: 0;
  }

  &.last-condition {
    margin-bottom: -0;
  }
}

// 新增：当有多个条件时的特殊处理
.conditions-wrapper.has-multiple-conditions {
  .main-content.first-condition {
    margin-top: -20px;
  }

  .main-content.last-condition {
    margin-bottom: -20px;
  }
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 60px;
  position: relative;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-left: 20px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  // box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

// 修改 first-item 和 last-item 的样式
.data-item.first-item {
  margin-top: 0; // 移除负边距
}

.data-item.last-item {
  margin-bottom: 0; // 移除负边距
}

// 如果 dataList 长度大于等于 2，才应用特殊样式
.content-container.has-multiple-items {
  .data-item:first-child {
    margin-top: -20px; // 适度的向上偏移
  }
  .data-item:last-child {
    margin-bottom: -20px; // 适度的向下偏移
  }
}

.button-group {
  display: flex;
  gap: 8px;
  i {
    border: 0.9px solid #D8D8D8;
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
    color: var(--leap-color-defaul);
    font-size: 700;
  }
}

.outer-button-group {
  align-self: center;
  margin-left: 10px;
}
</style>
