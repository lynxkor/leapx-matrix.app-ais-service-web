<!--
  NumberField - 数字输入控件
  编辑模式: el-input-number (可输入)
  只读模式: el-input (disabled 显示文本)
  与原 edit.vue 中成对的 el-input-number + disabled el-input 等价
-->
<template>
  <el-input-number
    v-if="!readonly"
    :value="value"
    :controls="false"
    :min="min"
    :max="max"
    :placeholder="placeholder"
    clearable
    :style="{ width, display: inlineDisplay ? 'inline-block' : '', verticalAlign: inlineDisplay ? 'middle' : '' }"
    @input="$emit('input', $event)"
  />
  <el-input
    v-else
    :value="displayValue"
    :placeholder="placeholder"
    clearable
    disabled
    :style="{ width, display: inlineDisplay ? 'inline-block' : '', verticalAlign: inlineDisplay ? 'middle' : '' }"
  />
</template>

<script>
export default {
  name: 'NumberField',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 999999999
    },
    width: {
      type: String,
      default: '150px'
    },
    placeholder: {
      type: String,
      default: ''
    },
    // 是否 inline-block + vertical-align: middle（原 edit.vue 中 fetch-select 旁使用的样式）
    inlineDisplay: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 只读模式下的展示值：null/undefined/'' 显示空字符串（与原 disabled el-input 行为一致）
    displayValue () {
      return this.value === null || this.value === undefined ? '' : this.value;
    }
  }
};
</script>
