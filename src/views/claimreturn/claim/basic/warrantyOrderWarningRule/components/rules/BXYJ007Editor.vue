<!--
  BXYJ007Editor - 不同周期重复附件预警（固定配置，无字段）
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
import rule from '../../config/rules/BXYJ007';

export default {
  name: 'BXYJ007Editor',
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
