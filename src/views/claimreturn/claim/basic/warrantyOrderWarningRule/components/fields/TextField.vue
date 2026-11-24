<!--
  TextField - 文本输入控件（编辑模式可输入 / 只读模式 disabled）
  用于 BXYJ010 等场景中需要单独使用 el-input 的场景
  （重构后大部分场景会被 NumberField/SelectField 替代，本组件作为保留）
-->
<template>
  <el-input
    :value="value"
    :placeholder="placeholder"
    clearable
    :disabled="readonly"
    :style="{ width, display: inlineDisplay ? 'inline-block' : '', verticalAlign: inlineDisplay ? 'middle' : '' }"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'TextField',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '150px'
    },
    placeholder: {
      type: String,
      default: ''
    },
    inlineDisplay: {
      type: Boolean,
      default: false
    }
  }
};
</script>
