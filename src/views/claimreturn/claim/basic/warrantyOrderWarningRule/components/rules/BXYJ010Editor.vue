<!--
  BXYJ010Editor - 过度更换零件预警（4 个阈值字段）
-->
<template>
  <rule-description
    :description="rule.description"
    :fields="rule.fields"
    :form="form"
    :readonly="readonly"
  />
</template>

<script>
import RuleDescription from '../RuleDescription.vue';
import rule from '../../config/rules/BXYJ010';

export default {
  name: 'BXYJ010Editor',
  components: { RuleDescription },
  props: {
    form: { type: Object, required: true },
    readonly: { type: Boolean, default: false }
  },
  data () {
    return { rule };
  }
};
</script>
