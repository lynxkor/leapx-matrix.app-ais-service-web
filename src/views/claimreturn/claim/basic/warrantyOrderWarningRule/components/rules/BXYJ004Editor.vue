<!--
  BXYJ004Editor - 行驶证车辆用途预警（OCR 类）
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
import rule from '../../config/rules/BXYJ004';

export default {
  name: 'BXYJ004Editor',
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
