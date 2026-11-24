<!--
  SelectField - 下拉控件（fetch-select 封装）
  编辑模式: fetch-select 可交互
  只读模式: fetch-select disabled 显示选中项
  与原 edit.vue 中 BXYJ009 的 fetch-select 编辑/详情两套等价

  重要: 当 options 是空数组时, 不传给 fetch-select（保持 undefined）
  因为 fetch-select 的 loadOptions 第一行 `if (!this.request || this.options) return`
  会因 options=[]（truthy）跳过 enum 加载, 导致 disabled 状态下显示原始 value 而非 label
-->
<template>
  <fetch-select
    :value="value"
    :request="request"
    :enum-code="enumCode"
    :options="hasOptions ? options : null"
    :value-key="valueKey"
    :label-key="labelKey"
    :sub-label-key="subLabelKey"
    :placeholder="placeholder"
    :filterable="filterable"
    :clearable="clearable"
    :multiple="multiple"
    :disabled="readonly"
    :style="{ width, display: 'inline-block', verticalAlign: 'middle' }"
    @input="$emit('input', $event)"
  />
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  name: 'SelectField',
  components: { FetchSelect },
  props: {
    value: {},
    readonly: {
      type: Boolean,
      default: false
    },
    // 三种数据源（与 fetch-select 一致）
    request: {
      type: Function,
      default: null
    },
    enumCode: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    subLabelKey: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    filterable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '260px'
    }
  },
  computed: {
    // 仅当 options 真的有内容时才透传给 fetch-select
    // 避免 fetch-select 的 `if (!this.request || this.options) return` 把空数组当成"已传 options"跳过 enum 加载
    hasOptions () {
      return Array.isArray(this.options) && this.options.length > 0;
    }
  }
};
</script>
