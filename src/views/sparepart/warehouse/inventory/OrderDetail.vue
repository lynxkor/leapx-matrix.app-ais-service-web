<template>
    <section class="common-section">
      <div class="common-section-body">
        <div class="common-section-table">
            <vxe-table
                ref="inventoryFlowTable"
                :data="tableData"
                stripe
                show-overflow
                resizable
                border="inner"
                size="medium"
            >
                <vxe-column field="orderType" title="业务类型" />
                <vxe-column field="orderCode" title="业务单号" width="200">
                  <template #default="{ row }">
                    <div class="href-link" @click="handleJump(row)">{{ row.orderCode }}</div>
                  </template>
                </vxe-column>
                <vxe-column v-if="orderType === '冻结订单'" field="qty" title="冻结数量" />
                <vxe-column v-else field="qty" title="在途数量" />
                <vxe-column field="createTime" title="创建时间" />
            </vxe-table>
            <div class="table-pagination">
                <el-pagination
                    @size-change="(val) => pageSizeChange(val)"
                    @current-change="(val) => currentPageChange(val)"
                    :current-page="current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
      </div>
    </section>
  </template>
<script>
import { getFrozenOrders, getInTransitOrders } from '@/api/sparepart/warehouse/inventory/index';
import permissions from '@/libs/mixins/permissions';

export default {
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
    orderType: {
      type: [String, Number],
      default: null,
    },
  },
  components: {
  },
  mixins: [permissions],
  data () {
    return {
      form: {},
      inventoryId: null,
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  watch: {
    id: {
      handler (newVal) {
        this.inventoryId = newVal;
      },
      immediate: true, // 立即执行一次
      deep: true, // 深度监听
    },
    orderType: {
      handler () {
        this.getDetailPageApi();
      },
      immediate: true, // 立即执行一次
      deep: true, // 深度监听
    },
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    // 业务单号跳转
    handleJump (row) {
      let path = '';
      if (row.orderType === '采购订单未入库') {
        path = '/sparepart/purchase/purchaseOrder/edit';
      } else if (row.orderType === '采购缺货未解欠') {
        path = '/sparepart/purchase/backOrder/edit';
      } else if (row.orderType === '退货不合格退回') {
        path = '/sparepart/return/returnOrder/edit';
      } else if (row.orderType === '调拨方出库') {
        path = '/sparepart/transfer/transferinbound/edit';
      } else if (row.orderType === '共享调拨方出库') {
        path = '/sparepart/transfer/sharedTransferinbound/edit';
      } else if (row.orderType === '采购退货提交') {
        path = '/sparepart/return/returnOrder/edit';
      } else if (row.orderType === '调拨申请') {
        path = '/sparepart/transfer/transferoutbound/edit';
      } else if (row.orderType === '共享调拨申请') {
        path = '/sparepart/transfer/sharedTransferOutbound/edit';
      } else {
        return;
      }

      this.$router.push({
        path: path,
        query: {
          id: row.orderId
        }
      });
    },

    getId () {
      return this.id || this.$route.query.id;
    },
    // 表格数据
    getDetailPageApi () {
      let fetchApi = getFrozenOrders;
      if (this.orderType === '冻结订单') {
        fetchApi = getFrozenOrders;
      } else {
        fetchApi = getInTransitOrders;
      }
      fetchApi({
        id: this.inventoryId,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total;
      });
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
