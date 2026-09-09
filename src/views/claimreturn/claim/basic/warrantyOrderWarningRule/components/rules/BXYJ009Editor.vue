<!--
  BXYJ009Editor - 事故维修预警（多字段 + 下拉选项）
  需要 optionsMap 传递保修类型白名单 / VRT 白名单选项
-->
<template>
  <rule-description
    :description="rule.description"
    :fields="rule.fields"
    :form="form"
    :readonly="readonly"
    :options-map="optionsMap"
    :fetch-options="fetchOptions"
  />
</template>

<script>
import RuleDescription from '../RuleDescription.vue';
import rule from '../../config/rules/BXYJ009';

export default {
  name: 'BXYJ009Editor',
  components: { RuleDescription },
  props: {
    form: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    optionsMap: { type: Object, default: () => ({}) },
    fetchOptions: { type: Function, default: null }
  },
  data () {
    return { rule };
  }
};
</script>
