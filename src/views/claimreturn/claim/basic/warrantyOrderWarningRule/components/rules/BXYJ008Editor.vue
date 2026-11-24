<!--
  BXYJ008Editor - 不同店重复附件预警（跨店）
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
import rule from '../../config/rules/BXYJ008';

export default {
  name: 'BXYJ008Editor',
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
