<template>
  <div class="common-section-table pb-0">
    <vxe-table
      ref="editTable"
      :data="tableData"
      stripe
      show-overflow
      resizable
      :row-config="{ isHover: true }"
      border="inner"
      size="medium"
      min-height="0"
      max-height="400px"
    >
      <vxe-column field="activityCode" title="活动编码">
        <template #default="{ row }">
          <el-link v-if="row.activityId" type="primary" @click="openActivityDetail(row)">{{ row.activityCode }}</el-link>
          <span v-else>{{ row.activityCode }}</span>
        </template>
      </vxe-column>
      <vxe-column field="activityName" title="活动名称"></vxe-column>
      <vxe-column field="startTime" title="活动开始时间"></vxe-column>
      <vxe-column field="endTime" title="活动结束时间"></vxe-column>
      <template #empty>
        <div class="m-vxe-table-empty-text">
          暂无数据
        </div>
      </template>
    </vxe-table>
    <div class="table-pagination">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
        :current-page="current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/claimreturn/claim/basic/serviceActivityVehicle';
import { getDetail as getServiceActivityDetail } from '@/api/claimreturn/claim/basic/serviceActivity';

export default {
  props: {
    vehicleProfileId: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    canAddOrUpdate: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  mixins: [],
  data () {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  watch: {
    vehicleProfileId: {
      handler (val) {
        if (val) {
          this.getDetailPageApi();
        }
      }
    },
  },
  mounted () {
  },
  beforeDestroy () {},
  methods: {
    async openActivityDetail (row) {
      const activityId = row?.activityId;
      if (!activityId) {
        this.$message.warning('该活动未关联活动详情');
        return;
      }
      try {
        const activity = await getServiceActivityDetail(activityId);
        if (!activity) {
          this.$message.error('活动不存在或已被删除');
          return;
        }
        const activityType = String(activity.activityType || '').trim();
        if (!activityType) {
          this.$message.error('活动类型信息缺失，暂无法打开详情');
          return;
        }
        const path = activityType === '4'
          ? '/claimreturn/claim/basic/serviceCareActivity/edit'
          : '/claimreturn/claim/basic/techServiceActivity/edit';
        this.$router.push({
          path,
          query: { id: String(activityId) }
        });
      } catch (error) {
        console.error('获取活动详情失败:', error);
        this.$message.error('活动详情查询失败，请稍后重试');
      }
    },
    // 表格数据
    getDetailPageApi () {
      getList({
        vehicleProfileId: this.vehicleProfileId,
        activityStatuses: ['2'], // 备件准备完成
        finished: '0', // 未完成
        isValid: true, // 有效期内
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total;
      });
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi();
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailPageApi();
    },
  },
};
</script>

<style lang="scss" scoped>
.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
