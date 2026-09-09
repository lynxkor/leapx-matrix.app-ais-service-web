<!--
  BXYJ006Editor - 不同车重复附件预警（同店）
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
import rule from '../../config/rules/BXYJ006';

export default {
  name: 'BXYJ006Editor',
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
