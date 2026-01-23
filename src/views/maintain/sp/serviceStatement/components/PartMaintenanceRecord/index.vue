<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>零件保养信息</h2>
		</div>
		<div class="common-section-body">
			<div class="common-section-table table-section">
				<vxe-table
          ref="faultTable"
          :data="form.partMaintenanceResps"
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
          <vxe-column field="mileageTypeLabel" title="里程类型" min-width="120"/>

          <vxe-column field="nextMaintenanceDate" title="下次保养时间" min-width="160">
            <template #default="{ row }">
              {{ formatDate(row.nextMaintenanceDate) }}
            </template>
          </vxe-column>
          <vxe-column field="nextMileage" title="下次保养里程" min-width="150" />
          <vxe-column field="createTime" title="创建时间" min-width="150" />

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
