<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>权益核销记录</h2>
    </div>
    <div class="common-section-body">
      <div class="common-section-table table-section">
        <vxe-table
          ref="faultTable"
          :data="form.rightsUsageRecordResps"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="rightsName" title="权益名称" min-width="150" />
          <vxe-column field="rightsUseStateLabel" title="权益状态" min-width="150" />
          <vxe-column field="rightsCode" title="权益代码" min-width="150" />
          <vxe-column field="useId" title="权益ID" min-width="150" />

          <vxe-column
            field="cardTypeLabel"
            title="卡券类型"
            min-width="150"
          />
          <vxe-column
            field="availableQuantity"
            title="可用数量"
            min-width="150"
          />
          <vxe-column
            field="rightsUseStateLabel"
            title="权益状态"
            min-width="150"
          />
          <vxe-column
            field="deductionAmount"
            title="券面满减金额"
            min-width="150"
          />
          <vxe-column
            field="deductibleAmount"
            title="实际抵扣金额"
            min-width="150"
          />
          <vxe-column field="receiveTime" title="领券时间" min-width="150" />
          <vxe-column field="expirationTime" title="过期时间" min-width="150" />
          <vxe-column field="customerName" title="车主姓名" min-width="150" />
          <vxe-column field="carPlate" title="车牌号" min-width="150" />
          <vxe-column
            field="applicableMaintenanceType"
            title="适用维修类型"
            min-width="150"
          />
          <template #empty>
            <div class="m-vxe-table-empty-text">暂无数据</div>
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
      default: () => {},
    },
    _id: {
      type: [String, Number],
      default: null,
    },
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
      immediate: true,
    },
  },
  data () {
    return {
      form: {},
    };
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.table-section {
  &-header {
    h3 {
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
