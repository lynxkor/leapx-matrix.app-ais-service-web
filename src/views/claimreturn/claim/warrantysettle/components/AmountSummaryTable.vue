<template>
  <div class="common-section-table">
    <vxe-table
      ref="table"
      :data="tableData"
      stripe
      show-overflow
      resizable
      :row-config="{ isHover: true }"
      border="inner"
      size="medium"
      max-height="300px"
    >
      <vxe-column field="warrantyType" title="保修类型"></vxe-column>
      <vxe-column field="amount" title="金额">
        <template #default="{ row }">
          {{ row.amount }}
        </template>
      </vxe-column>
      <template #empty>
        <div class="m-vxe-table-empty-text">
          暂无数据
        </div>
      </template>
    </vxe-table>
  </div>
</template>

<script>
export default {
  name: 'AmountSummaryTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
