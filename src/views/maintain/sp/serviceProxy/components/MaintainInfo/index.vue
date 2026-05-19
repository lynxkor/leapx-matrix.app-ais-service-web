<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>维修履历信息</h2>
		</div>
		<div class="common-section-body">
			<div class="common-section-table table-section">
				<vxe-table
          ref="maintainTable"
          :data="formData.historyList"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="serviceProxyCode" title="接车施工单号" min-width="200" >
            <template #default="{ row }">
              <el-link type="success" @click="handleLinkClick(row)">{{ row.serviceProxyCode }}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="dealerName" title="维修门店名称" min-width="200"/>
          <vxe-column field="orderTime" title="开单时间" width="160"/>
          <vxe-column field="repairFinishTime" title="维修完工时间" width="160"/>
          <vxe-column field="vehProfileVin" title="VIN码" min-width="200"/>
          <vxe-column field="carPlate" title="车牌号" width="120"/>
          <vxe-column field="vehModelName" title="车型" min-width="150"/>
          <vxe-column field="mileage" title="进店里程数（KM）" width="130"/>
          <vxe-column field="netMileageExtend" title="车联网里程数（增）" width="140"/>
          <vxe-column field="customerFaultDescription" title="客户故障描述" min-width="150"/>
          <vxe-column field="managerSuggestion" title="客户经理建议" min-width="150"/>
          <vxe-column field="customerRequest" title="客户诉求" min-width="150"/>
          <vxe-column field="servicerecordUpload" title="是否已上传健康档案" width="150">
            <template #default="{ row }">
              <span>{{ row.servicerecordUpload === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="创建时间" width="160"/>
          <template #empty>
            <div class="m-vxe-table-empty-text">暂无数据</div>
          </template>
        </vxe-table>
			</div>
		</div>
	</section>
</template>
<script>
import { getLoginUser } from '@/api/common';

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
          this.$set(this.form, 'historyList', val.historyList || []);
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      form: {},
      loginUser: null
    };
  },
  mounted () {
    this.initLoginUser();
  },
  methods: {
    async initLoginUser () {
      this.loginUser = await getLoginUser();
    },
    handleLinkClick (row) {
      if (this.loginUser?.accountFlag && this.loginUser.currentDealerCode !== row.dealerCode) {
        this.$message.warning('权限不足');
        return;
      }
      window.open(`/service/datacenter/vehicle/serviceProxyHis/edit?id=${row.id}`, '_blank');
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
