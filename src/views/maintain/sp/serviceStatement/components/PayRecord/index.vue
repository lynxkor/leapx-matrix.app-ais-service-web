<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>结账记录</h2>
		</div>
		<div class="common-section-body">
			<div class="common-section-table table-section">
				<vxe-table
          ref="faultTable"
          :data="form.invoiceRecordResps"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="payAmount" title="实际付款总额" min-width="150"/>
          <vxe-column field="payTypeLabel" title="支付方式" min-width="150"/>
          <vxe-column field="rightsCode" title="权益代码" min-width="150"/>
          <vxe-column field="invoiceNumber" title="发票号码" width="150" />

          <vxe-column field="invoiceType" title="发票类型" min-width="150"/>

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
