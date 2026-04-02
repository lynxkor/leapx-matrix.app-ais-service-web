<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>维修信息</h2>
		</div>
		<div class="common-section-body">
      <div class="table-section">
        <div class="table-section-header">
          <h3>费用估算</h3>
        </div>
        <el-form :inline="true" label-width="150px" class="form-edit">
          <el-form-item label="本次维修估算费用：">
            {{ costCountResp.maintenanceCostEstimation }}
          </el-form-item>
          <el-form-item label="工时费用小计：">
            {{ costCountResp.workCostCount }}
          </el-form-item>
          <el-form-item label="自费金额估算：">
            {{ costCountResp.ownMoneyEstimation }}
          </el-form-item>
          <el-form-item label="内结金额估算：">
            {{ costCountResp.innerTurnMoneyEstimation }}
          </el-form-item>
          <el-form-item label="优惠金额小计：">
            {{ costCountResp.preferentialMoneyCount }}
          </el-form-item>
          <el-form-item label="备件费用小计：">
            {{ costCountResp.barkCostCount }}
          </el-form-item>
          <el-form-item label="保险金额估算：">
            {{ costCountResp.insuranceMoneyEstimation }}
          </el-form-item>
        </el-form>
      </div>
			<div class="table-section">
        <div class="table-section-header">
          <h3>维修项目</h3>
        </div>
        <vxe-table
          ref="faultTable"
          :data="repairItemRespList"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="repairItemCode" title="维修项目代码" width="200px">
            <template #default="{ row }">
              <el-link type="success" :href="`/service/maintain/basic/repairItem/detail?id=${row.repairItemId}`" target="_blank">{{ row.repairItemCode }}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="repairItemName" title="维修项目名称" width="200px" />
          <vxe-column field="repairItemTypeName" title="维修类型" width="200px" />
          <vxe-column field="checkoutTypeName" title="结算类型" width="200px" />
          <vxe-column field="warrantyTypeName" title="保修类型" width="200px" />
          <vxe-column field="isAddItems" title="是否增项" width="200px" >
            <template #default="{ row }">
              <span>{{ row.isAddItems === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="price" title="工时单价" width="200px" />
          <vxe-column field="workHour" title="工时数" width="200px" />
          <vxe-column field="discountAmount" title="优惠金额" width="200px" />
          <vxe-column field="discountRate" title="折扣率" width="200px" />
          <vxe-column field="repairAmount" title="项目金额" width="200px" />
          <vxe-column field="packageCode" title="套餐代码" width="200px"  >
            <template #default="{ row }">
              <el-link v-if="linkMap[row.packageType]" type="success" :href="`${linkMap[row.packageType]}?id=${row.packageId}`" target="_blank">{{ row.packageCode }}</el-link>
              <span v-else>{{ row.packageCode }}</span>
            </template>
          </vxe-column>
          <!-- <vxe-column field="packageType" title="服务权益代码" width="200px" /> -->
          <!-- <vxe-column field="packageCode" title="车主服务权益明细" width="200px" /> -->
          <vxe-column field="createTime" title="创建时间" width="200px" sortable/>
          <template #empty>
            <div class="m-vxe-table-empty-text">若要启用此内容，请创建记录</div>
          </template>
        </vxe-table>
      </div>
      <div class="table-section">
        <div class="table-section-header">
          <h3>维修零配件</h3>
        </div>
        <vxe-table
          ref="faultTable"
          :data="sparePartRespList"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="partsCode" title="零件代码" width="200px" >
            <template #default="{ row }">
              <el-link type="success" :href="`/service/sparepart/basic/sparePart/detail?id=${row.partsId}`" target="_blank">{{ row.partsCode }}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="partsName" title="零件名称" width="200px" />
          <vxe-column field="repairItemTypeName" title="维修类型" width="200px" />
          <vxe-column field="isOutstock" title="是否出库" width="200px">
            <template #default="{ row }">
              <span>{{ row.isOutstock === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="planPickNumber" title="计划领料数" width="200px" />
          <vxe-column field="actualPickNumber" title="实际领料数" width="200px" />
          <vxe-column field="refundedNumber" title="已退数" width="200px" />
          <vxe-column field="checkoutTypeName" title="结算类型" width="200px" />
          <vxe-column field="warrantyTypeName" title="保修类型" width="200px" />
          <vxe-column field="isAddItems" title="是否增项" width="200px" >
            <template #default="{ row }">
              <span>{{ row.isAddItems === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="isOemPart" title="是否原厂" width="200px" >
            <template #default="{ row }">
              <span>{{ row.isOemPart === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="quantity" title="数量" width="200px"/>
          <vxe-column field="price" title="单价" width="200px" />
          <vxe-column field="discountAmount" title="优惠金额" width="200px"/>
          <vxe-column field="discountRate" title="折扣率" width="200px" />
          <vxe-column field="partsAmount" title="配件金额" width="200px"/>
          <vxe-column field="isBindItem" title="是否与工时组合" width="200px" >
            <template #default="{ row }">
              <span>{{ row.isBindItem === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="repairItemCode" title="维修项目代码" width="200px"/>
          <vxe-column field="repairItemName" title="维修项目名称" width="200px"/>
          <vxe-column field="packageCode" title="套餐代码" width="200px"  >
            <template #default="{ row }">
              <el-link v-if="linkMap[row.packageType]" type="success" :href="`${linkMap[row.packageType]}?id=${row.packageId}`" target="_blank">{{ row.packageCode }}</el-link>
              <span v-else>{{ row.packageCode }}</span>
            </template>
          </vxe-column>
          <vxe-column field="packageName" title="套餐名称" width="200px" />
          <!-- <vxe-column field="packageCode" title="服务权益代码" width="200px" /> -->
          <!-- <vxe-column field="packageCode" title="车主服务权益明细" width="200px" /> -->
          <vxe-column field="createTime" title="创建时间" width="200px" />
          <template #empty>
            <div class="m-vxe-table-empty-text">若要启用此内容，请创建记录</div>
          </template>
        </vxe-table>
      </div>
      <div class="table-section">
        <div class="table-section-header">
          <h3>零件维修追溯</h3>
        </div>
        <vxe-table
          ref="faultTable"
          :data="partsTraceRecordRespList"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="code" title="追溯编码" width="350px"/>
          <vxe-column field="partsCode" title="零件代码" width="300px"/>
          <vxe-column field="partsName" title="零件名称" width="300px"/>
          <vxe-column field="targetUnitName" title="去向单位" width="350px"/>
          <vxe-column field="beforeChangeCode" title="更换前编码" width="200px"/>
          <vxe-column field="afterChangeCode" title="更换后编码" width="200px"/>
          <vxe-column field="updateTime" title="修改时间" width="200px"/>
          <vxe-column field="createTime" title="创建时间" width="200px"/>
          <template #empty>
            <div class="m-vxe-table-empty-text">若要启用此内容，请创建记录</div>
          </template>
        </vxe-table>
      </div>
      <div class="table-section">
        <div class="table-section-header">
          <h3>维修作业记录</h3>
        </div>
        <vxe-table
          ref="faultTable"
          :data="workRecordRespList"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          :checkbox-config="{ checkField: 'checked' }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="code" title="编号" width="180px" />
          <vxe-column field="dealerName" title="厅店名称" width="180px" />
          <vxe-column field="repairItemName" title="维修项目名称" width="200px" />
          <vxe-column field="repairItemCode" title="维修项目代码" width="180px" />
          <vxe-column field="statusLabel" title="作业状态" width="120px" />
          <vxe-column field="isDispatch" title="是否已派工" width="120px" align="center">
            <template #default="{ row }">
              <span>{{ row.isDispatch === 1 ? '是' : '否' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="dealerStationName" title="工位" width="150px" />
          <vxe-column field="dealerWorkTeamName" title="班组信息" width="180px" />
          <vxe-column field="repairTechnicianName" title="维修技师" width="150px" />
          <vxe-column field="dispatchTime" title="派工时间" width="160px" />
          <vxe-column field="startAt" title="计划作业时间" width="160px" />
          <vxe-column field="timeSpend" title="实际作业时间" width="160px" />
          <vxe-column field="finishAt" title="作业结束时间" width="160px" />

          <vxe-column field="reworkTypeLabel" title="返修类型" width="120px" />
          <vxe-column field="qualityCheckerName" title="质检人" width="150px" />
          <vxe-column field="qualityCheckAt" title="质检时间" width="160px" />
          <vxe-column field="qualityCheckStatusLabel" title="质检状态" width="120px" />

          <vxe-column field="createTime" title="创建时间" width="160px" />
          <template #empty>
            <div class="m-vxe-table-empty-text">若要启用此内容，请创建记录</div>
          </template>
        </vxe-table>
      </div>
		</div>
	</section>
</template>
<script>
import { PackageTypeEnum } from '../../constant';

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
        if (val && Object.keys(val).length > 0) {
          this.workRecordRespList = val.workRecordRespList || [];
          this.partsTraceRecordRespList = val.partsTraceRecordRespList || [];
          this.repairItemRespList = val.costCountResp?.repairItemRespList || [];
          this.sparePartRespList = val.costCountResp?.sparePartRespList || [];
          this.costCountResp = val.costCountResp || {};
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      workRecordRespList: [],
      partsTraceRecordRespList: [],
      repairItemRespList: [],
      sparePartRespList: [],
      costCountResp: {},
      linkMap: {
        [PackageTypeEnum.REPAIR]: '/service/maintain/basic/repairPackages/edit',
        [PackageTypeEnum.EQUITY]: '',
        [PackageTypeEnum.STORE]: '/service/maintain/sp/interestsGoods/edit',
        [PackageTypeEnum.FREE]: '/service/claimreturn/claim/basic/freeMaintenancePolicy/edit',
        [PackageTypeEnum.TECH_ACTIVITY]: '/service/claimreturn/claim/basic/techServiceActivity/edit',
        [PackageTypeEnum.CARE_ACTIVITY]: '/service/claimreturn/claim/basic/serviceCareActivity/edit',
      }
    };
  },
  methods: {
  }
};

</script>
<style scoped lang="scss">
.table-section{
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px!important;
  }
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
