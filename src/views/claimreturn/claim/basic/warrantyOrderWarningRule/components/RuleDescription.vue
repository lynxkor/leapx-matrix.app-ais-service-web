<!--
  RuleDescription - 描述片段渲染器
  按 description 模板（{key} 占位符）渲染：静态文本 + 嵌入字段控件交替

  Props:
    - description: 描述模板字符串，如 "除当前保修单外，时间窗口 {withinDays} 天..."
    - fields: FieldDef[]，包含 key/type/props
    - form: 父 form 对象（双向绑定）
    - readonly: 是否只读模式
    - optionsMap: BXYJ009 字段需要的选项数据 { warrantyTypeOptions, vrtOptions, checkoutTypeOptions }
    - fetchOptions: BXYJ009 工单状态的远程获取方法（OrderStatusEnum）

  Behavior:
    - 解析 description，按 {key} 切分为 segments（text/field）
    - 按 segments 顺序渲染
-->
<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <!-- 父组件传入 form 对象并由本组件直接修改（与项目内其他子组件的模式一致） -->
  <!-- 使用 ::v-deep 让所有子元素 inline-block + vertical-align: middle
       保证控件（input/select）与文字 baseline 对齐，避免"歪歪扭扭" -->
  <el-form-item class="form-item-line rule-description-row">
    <template v-for="(seg, idx) in segments">
      <span v-if="seg.type === 'text'" :key="`t-${idx}`" class="rule-description-text">{{ seg.text }}</span>
      <component
        v-else
        :is="seg.component"
        :key="`f-${idx}`"
        v-model="form[seg.field.key]"
        :readonly="readonly"
        v-bind="seg.props"
      />
    </template>
    <!-- remindContent 文本域（编辑/只读合一）
         vertical-align: top 让 textarea 顶部与描述文字顶部对齐 -->
    <el-input
      type="textarea"
      :rows="4"
      maxlength="500"
      show-word-limit
      placeholder="请输入提醒内容"
      v-model="form.remindContent"
      clearable
      :disabled="readonly"
      class="rule-description-textarea"
      style="width: 400px;"
    />
  </el-form-item>
</template>

<script>
import NumberField from './fields/NumberField.vue';
import SelectField from './fields/SelectField.vue';
import { BXYJ009_STATEMENT_TYPE_OPTIONS } from '../config/defaults';

export default {
  name: 'RuleDescription',
  components: { NumberField, SelectField },
  props: {
    description: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    // BXYJ009 需要：保修类型白名单 / VRT 白名单 / 结算类型白名单
    optionsMap: {
      type: Object,
      default: () => ({})
    },
    // BXYJ009 工单状态从 enum 拉取
    fetchOptions: {
      type: Function,
      default: null
    }
  },
  computed: {
    /**
     * 解析 description 为 segments 数组
     * 每个 segment: { type: 'text', text: '...' } 或 { type: 'field', field, component, props }
     */
    segments () {
      const result = [];
      const regex = /\{([a-zA-Z][a-zA-Z0-9_]*)\}/g;
      let lastIdx = 0;
      let match;
      const fieldMap = this.buildFieldMap();
      while ((match = regex.exec(this.description)) !== null) {
        // 前置文本
        if (match.index > lastIdx) {
          result.push({ type: 'text', text: this.description.slice(lastIdx, match.index) });
        }
        // 字段片段
        const key = match[1];
        const field = fieldMap[key];
        if (field) {
          result.push({
            type: 'field',
            field,
            component: this.getFieldComponent(field.type),
            props: this.getFieldProps(field)
          });
        } else {
          // 未注册的字段 key，原样输出（防御性）
          result.push({ type: 'text', text: match[0] });
        }
        lastIdx = regex.lastIndex;
      }
      // 尾部文本
      if (lastIdx < this.description.length) {
        result.push({ type: 'text', text: this.description.slice(lastIdx) });
      }
      return result;
    }
  },
  methods: {
    buildFieldMap () {
      const map = {};
      this.fields.forEach(f => { map[f.key] = f; });
      return map;
    },
    getFieldComponent (type) {
      if (type === 'number') return NumberField;
      if (type === 'select-multiple' || type === 'select-single') return SelectField;
      return null;
    },
    getFieldProps (field) {
      const base = {
        placeholder: field.placeholder || '',
        width: field.width || '150px',
        multiple: field.type === 'select-multiple'
      };
      if (field.type === 'number') {
        return base;
      }
      // select 类
      const opts = {
        ...base,
        filterable: true,
        clearable: true,
        valueKey: field.valueKey || 'id',
        labelKey: field.labelKey || 'name',
        subLabelKey: field.subLabelKey || ''
      };
      if (field.enumCode) {
        opts.enumCode = field.enumCode;
        opts.request = this.fetchOptions;
        opts.valueKey = 'code';
        opts.labelKey = 'message';
      }
      if (field.optionsKey) {
        // BXYJ009 的保修类型 / VRT / 结算类型
        if (field.optionsKey === 'checkoutTypeOptions') {
          opts.options = BXYJ009_STATEMENT_TYPE_OPTIONS;
          opts.valueKey = 'code';
          opts.labelKey = 'message';
        } else {
          opts.options = this.optionsMap[field.optionsKey] || [];
        }
      }
      return opts;
    }
  }
};
</script>

<style scoped>
/* 让 description 片段保持内联流式布局，所有元素 baseline 对齐
   - .rule-description-text：纯文字片段，行内显示
   - 字段组件：本身已 inline-block + vertical-align: middle（NumberField/SelectField 内部设置）
   - .rule-description-textarea：inline-block + vertical-align: top，与文字顶部对齐 */
.rule-description-row {
  display: block;
}
.rule-description-row >>> .rule-description-text {
  display: inline-block;
  vertical-align: middle;
  line-height: 40px;
  margin-right: 4px;
}
.rule-description-row >>> .el-input-number,
.rule-description-row >>> .el-select,
.rule-description-row >>> .el-textarea {
  vertical-align: middle;
}
.rule-description-textarea {
  vertical-align: top !important;
  margin-left: 8px;
}
</style>
