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
      <vxe-column field="traceDetailCode" title="追溯明细" width="160"></vxe-column>
      <vxe-column field="traceTypeLabel" title="追溯类型" width="120"></vxe-column>
      <vxe-column field="businessDocNo" title="业务单据" width="160"></vxe-column>
      <vxe-column field="applyCode" title="保修申请单" width="160"></vxe-column>
      <vxe-column field="vin" title="VIN" width="180"></vxe-column>
      <vxe-column field="traceAmount" title="本次追溯金额" width="120">
        <template #default="{ row }">
          {{ row.traceAmount }}
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
  name: 'TraceDetailTable',
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
