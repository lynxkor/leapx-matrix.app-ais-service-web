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
      <vxe-column field="invoiceNo" title="发票号"></vxe-column>
      <vxe-column field="invoiceCompanyName" title="开票公司名称"></vxe-column>
      <vxe-column field="invoiceDate" title="发票开具日期"></vxe-column>
      <vxe-column field="amount" title="金额">
        <template #default="{ row }">
          {{ row.amount }}
        </template>
      </vxe-column>
      <vxe-column field="taxRate" title="税点">
        <template #default="{ row }">
          {{ row.taxRate }}%
        </template>
      </vxe-column>
      <vxe-column field="excludingTaxAmount" title="不含税金额">
        <template #default="{ row }">
          {{ row.excludingTaxAmount }}
        </template>
      </vxe-column>
      <vxe-column field="taxAmount" title="税费">
        <template #default="{ row }">
          {{ row.taxAmount }}
        </template>
      </vxe-column>
      <vxe-column field="createTime" title="创建时间"></vxe-column>
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
  name: 'InvoiceInfoTable',
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
