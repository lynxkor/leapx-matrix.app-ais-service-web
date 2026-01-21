<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>维修履历信息</h2>
		</div>
		<div class="common-section-body">
			<div class="common-section-table table-section">
				<vxe-table
          ref="faultTable"
          :data="form.faultAlertRecordRespList"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="vrtName" title="VRT名称" min-width="150"/>
          <vxe-column field="vfgName" title="VFG名称" min-width="150"/>
          <vxe-column field="cccName" title="CCC名称" min-width="150"/>
          <vxe-column field="alertModule" title="是否提醒模块" width="150" align="center">
            <template #default="{ row }">
              <span>{{ row.alertModule === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="currentSituationText" title="本次进店情况(周期内)" min-width="150"/>
          <vxe-column field="faultAlert" title="故障提醒内容" min-width="150"/>
          <vxe-column title="操作" width="100" align="center" fixed="right" :resizable="false">
            <template #default="{ row }">
              <el-popconfirm
                title="确定删除此故障吗？"
                @confirm="handleDeleteFault(row)"
              >
                <span
                  class="action-button btn-delete"
                  slot="reference"
                  type="text">
                  删除故障
                </span>
              </el-popconfirm>
            </template>
          </vxe-column>
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
