<template>
	<section class="common-section">

		<div class="common-section-body">

      <div class="table-section">
        <div class="table-section-header">
          <h3>维修作业记录</h3>
        </div>
        <vxe-table
          ref="faultTable"
          :data="form.repairItemResps"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="repairItemCode" title="维修项目代码" min-width="150"/>
          <vxe-column field="repairItemName" title="维修项目名称" min-width="150"/>
          <vxe-column field="repairItemTypeName" title="维修项目类型" min-width="150"/>
          <vxe-column field="checkoutTypeName" title="结算类型名称" min-width="150"/>
          <vxe-column field="warrantyTypeName" title="保修类型" min-width="150"/>
          <vxe-column field="price" title="工时单价" min-width="150"/>
          <vxe-column field="workHour" title="工时数" min-width="150"/>
          <vxe-column field="discountAmount" title="优惠金额" min-width="150"/>
          <vxe-column field="discountRate" title="折扣率" min-width="150"/>
          <vxe-column field="repairAmount" title="维修项目费用" min-width="150"/>
          <vxe-column field="packageCode" title="套餐代码" min-width="150"/>
          <vxe-column field="repairAmount" title="维修项目费用" min-width="150"/>
          <vxe-column field="repairAmount" title="维修项目费用" min-width="150"/>
          <template #empty>
            <div class="m-vxe-table-empty-text">若要启用此内容，请创建记录</div>
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
          this.form = val;
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
