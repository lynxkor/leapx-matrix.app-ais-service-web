<template>
  <div class="no-return-rule-condition">
    <Condition
      ref="conditionRef"
      :config-code="'warranty_no_return_rule'"
    />
  </div>
</template>

<script>
import Condition from '@/views/file/attachmentConfig/components/Condition.vue';

export default {
  name: 'NoReturnRuleCondition',
  components: { Condition },
  methods: {
    /**
     * 获取条件 JSON 数据（外层结构）
     */
    getConditions () {
      return this.$refs.conditionRef.getConditions();
    },
    /**
     * 回显条件数据
     */
    setConditions (data) {
      this.$refs.conditionRef.setConditions(data);
    },
    /**
     * 重置为默认状态
     */
    resetConditions () {
      this.$refs.conditionRef.resetConditions();
    }
  }
};
</script>

<style lang="scss" scoped>
.no-return-rule-condition {
  padding: 10px 0;
}
</style>
