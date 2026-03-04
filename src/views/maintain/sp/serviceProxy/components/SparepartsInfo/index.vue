<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>门店备件出库单</h2>
		</div>
		<div class="common-section-body">
			<div class="common-section-table table-section">
				<vxe-table
          ref="faultTable"
          :data="form.outboundOrderList"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="code" title="出库单号" min-width="200">
            <template v-slot="{ row }">
              <el-link type="success" :href="`/service/sparepart/outbound/maintenanceOutboundOrder/edit?id=${row.id}`" target="_blank">{{ row.code }}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="dealerName" title="门店名称" min-width="200">
            <template v-slot="{ row }">
              <el-link type="success" :href="`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`" target="_blank">{{ row.dealerName }}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="vehProfileVin" title="VIN码" min-width="200">
            <template v-slot="{ row }">
              <el-link type="success" :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${row.vehProfileId}`" target="_blank">{{ row.vehProfileVin }}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="carPlate" title="车牌号" min-width="150"/>
          <vxe-column field="outboundStatusLabel" title="处理状态" min-width="150"/>
          <vxe-column field="remark" title="备注" min-width="150"/>
          <vxe-column field="creatorName" title="负责人" min-width="150"/>
          <vxe-column field="createTime" title="创建时间" min-width="150"/>
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
          this.$set(this.form, 'outboundOrderList', val.outboundOrderList || []);
        }
      },
      immediate: true,
      deep: true
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
