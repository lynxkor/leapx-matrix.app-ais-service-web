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
      <vxe-column field="applyCode" title="保修申请单" width="160"></vxe-column>
      <vxe-column field="warrantyTypeLabel" title="保修类型" width="120"></vxe-column>
      <vxe-column field="vin" title="VIN" width="180"></vxe-column>
      <vxe-column field="workHourTotal" title="工时总额" width="120">
        <template #default="{ row }">
          {{ row.workHourTotal }}
        </template>
      </vxe-column>
      <vxe-column field="partTotal" title="零件总额" width="120">
        <template #default="{ row }">
          {{ row.partTotal }}
        </template>
      </vxe-column>
      <vxe-column field="otherTotal" title="其他总额" width="120">
        <template #default="{ row }">
          {{ row.otherTotal }}
        </template>
      </vxe-column>
      <vxe-column field="totalAmount" title="总金额" width="120">
        <template #default="{ row }">
          {{ row.totalAmount }}
        </template>
      </vxe-column>
      <vxe-column field="determineAmount" title="判定金额" width="120">
        <template #default="{ row }">
          {{ row.determineAmount }}
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
  name: 'NoticeDetailTable',
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
