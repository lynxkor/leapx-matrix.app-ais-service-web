<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>维修零配件</h2>
		</div>
		<div class="common-section-body">
			<div class="common-section-table table-section">
				<vxe-table
          ref="faultTable"
          :data="form.partResps"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="partsCode" title="零件代码" min-width="150" />
          <vxe-column field="partsName" title="零件名称" min-width="150" />
          <vxe-column field="repairItemTypeName" title="维修项目类型" min-width="150" />
          <vxe-column field="checkoutTypeName" title="结算类型" min-width="150" />

          <vxe-column field="warrantyTypeName" title="保修类型" min-width="150" />
          <vxe-column field="isOemPartLabel" title="是否OEM件" min-width="120"/>

          <vxe-column field="price" title="单价" min-width="120"  />
          <vxe-column field="quantity" title="数量" min-width="100" />
          <vxe-column field="discountAmount" title="优惠金额" min-width="120"  />
          <vxe-column field="discountRate" title="折扣率" min-width="120"  />
          <vxe-column field="partsAmount" title="配件金额" min-width="120"  />
          <!-- <vxe-column field="totalAmount" title="总金额" min-width="120" >
            <template v-slot:default="{ row }">
              {{ totalAmount(row) }}
            </template>
            </vxe-column> -->
          <vxe-column field="packageTypeLabel" title="套餐类型" min-width="150"/>
          <vxe-column field="packageName" title="套餐名称" min-width="150" />

          <vxe-column field="packageCode" title="套餐代码" min-width="150" />

          <template #empty>
            <div class="m-vxe-table-empty-text center" >暂无数据</div>
          </template>
        </vxe-table>
			</div>
		</div>
	</section>
</template>
<script>

export default {
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    _id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    // FetchSelect
  },
  watch: {
    formData: {
      handler (val) {
        if (val) {
          this.form = JSON.parse(JSON.stringify(val));
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      form: {},
    };
  },
  methods: {
    totalAmount (row) {
      return (row.price * row.quantity * row.discountRate).toFixed(2);
    }
  }
};

</script>
<style scoped lang="scss">
.table-section{
  &-header {
    h3{
      font-size: 14px;
    }
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .m-vxe-table-empty-text {
    text-align: left;
  }
  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
  }
}
</style>
