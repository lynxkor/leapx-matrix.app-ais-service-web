<template>
    <el-dialog class="m-start-work-dialog" :title="title" width="80%" :visible.sync="dialogVisible" @close="close">
      <!-- 数据表格 -->
      <div class="table-section">
        <vxe-table ref="workTable" :data="tableData" stripe show-overflow resizable border="inner" size="medium" :checkbox-config="{ checkMethod: () => true }" @checkbox-change="handleCheckChange" @checkbox-all="handleCheckAll">
          <vxe-column type="checkbox" width="60" />
          <vxe-column field="purchaseOrderCode" title="采购订单" />
          <vxe-column field="sparePartCode" title="备件编码" />
          <vxe-column field="sparePartName" title="备件名称" />
          <vxe-column field="outboundQty" title="已发运数" />
          <vxe-column field="signedQty" title="已签收数" />
          <vxe-column field="qty" title="本次签收数">
            <template #default="{ row }">
              <!-- 绑定到当前行的 form.claimQty -->
              <el-input v-model="row.form.qty" type="number" placeholder="请输入签收数量" />
            </template>
          </vxe-column>
          <vxe-column field="locationName" title="库位" min-width="180">
            <template #default="{ row }">
              <fetch-select
                v-model="row.form.locationName"
                remote
                filterable
                allow-create
                default-first-option
                value-key="name"
                label-key="name"
                :remote-method="(query) => searchLocation(query, row.receiveWarehouseId)"
                :params="row.locationName"
                placeholder="请输入库位名称"
                clearable
                @change="onLocationChange($event, row)"
              />
            </template>
          </vxe-column>
          <vxe-column title="操作" width="120">
            <template #default="{ index }">
              <el-popconfirm title="确定删除吗？" v-if="tableData.length > 1" @confirm="handleDel(index)">
                <template #reference>
                  <span class="action-button btn-delete" type="text">删除</span>
                </template>
              </el-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="table-pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
      </div>
      <!-- 底部按钮 -->
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button size="small" @click="close">关 闭</el-button>
          <el-button size="small" type="primary" :loading="loading" @click="submit">{{btnText}}</el-button>
        </div>
      </template>
    </el-dialog>
  </template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { batchSign, pageWaitSign } from '@/api/sparepart/purchase/purchaseOrder/index';
import { locationList } from '@/api/sparepart/warehouse/warehouse/index';

export default {
  name: 'BatchEditSignForDialogAll',
  components: {
    FetchSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    purchaseOrderId: {
      type: String,
      default: ''
    },
    inbound: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      checkedRows: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: '签收',
      btnText: '签收',
      loading: false
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.pageNum = 1;
        this.getData();
      }
    },
    inbound (val) {
      this.title = val ? '入库签收' : '签收';
      this.btnText = val ? '入库签收' : '签收';
    }
  },
  methods: {
    async getData () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        purchaseOrderId: this.purchaseOrderId,
      };
      const res = await pageWaitSign(params);
      this.tableData = (res.records || []).map(item => ({
        ...item,
        form: {
          qty: item.operateQty,
          locationName: item.locationName || '' // 回显库存最新库位
        }
      }));
      this.total = res.total || 0;
      this.$nextTick(() => {
        if (this.$refs.workTable) {
          this.$refs.workTable.setCheckboxRow(this.tableData, true);
        }
      });
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getData();
    },
    handleCurrentChange (val) {
      this.pageNum = val;
      this.getData();
    },
    close () {
      this.$emit('update:visible', false);
    },
    handleCheckChange ({ records }) {
      this.checkedRows = records;
    },
    handleCheckAll ({ records }) {
      this.checkedRows = records;
    },
    handleDel (index) {
      this.tableData.splice(index, 1);
    },
    // 库位联想：限当前行的收货仓库
    async searchLocation (query, warehouseId) {
      return locationList({ codeOrName: query || '', warehouseId: warehouseId });
    },
    // LP261751 联动默认：任一行选了库位，同仓库下库位为空的其他行立即填充相同值
    onLocationChange (val, row) {
      if (!val || !row.receiveWarehouseId) {
        return;
      }
      (this.$refs.workTable ? this.$refs.workTable.getCheckboxRecords() : this.tableData).concat(this.tableData).forEach(other => {
        if (other !== row && other.receiveWarehouseId === row.receiveWarehouseId && other.form && !other.form.locationName) {
          other.form.locationName = val;
        }
      });
    },
    // 批量签收：同一收货仓库下库位为空的行默认沿用已填库位
    fillDefaultLocationName (rows) {
      const warehouseFilled = {};
      rows.forEach(row => {
        if (row.form.locationName && row.receiveWarehouseId && !warehouseFilled[row.receiveWarehouseId]) {
          warehouseFilled[row.receiveWarehouseId] = row.form.locationName;
        }
      });
      rows.forEach(row => {
        if (!row.form.locationName && row.receiveWarehouseId && warehouseFilled[row.receiveWarehouseId]) {
          row.form.locationName = warehouseFilled[row.receiveWarehouseId];
        }
      });
    },
    async submit () {
      this.loading = true;
      const checkedRows = this.$refs.workTable ? this.$refs.workTable.getCheckboxRecords() : this.tableData;
      if (checkedRows.length === 0) {
        this.$message.warning('请选择要签收的备件');
        return;
      }
      const invalidQty = checkedRows.some(row => {
        const qty = Number(row.form.qty);
        return isNaN(qty) || qty <= 0;
      });
      if (invalidQty) {
        this.$message.warning('签收数量必须大于 0，请修改后再提交！');
        return;
      }
      this.fillDefaultLocationName(checkedRows);
      const params = {
        purchaseOrderSignList: checkedRows.map(item => ({
          purchaseOrderDetailId: item.id,
          qty: Number(item.form.qty),
          locationName: item.form.locationName || ''
        })),
        inbound: this.inbound
      };
      await batchSign(params);
      this.loading = false;
      this.tableData = [];
      this.$message.success(this.inbound ? '入库签收成功' : '签收成功');
      this.close();
      this.$emit('submit');
    },
  }
};
</script>

  <style lang="scss" scoped>
  .m-start-work-dialog {

    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
    ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
      padding: 8px 12px !important;
    }

    .start-work-content {
      .time-section {
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e8e8e8;

        .el-form {
          .el-form-item {
            margin-bottom: 0;
          }
        }
      }

      .table-section {
        margin-top: 15px;
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }

  .action-button {
    margin: 0 5px;
    cursor: pointer;

    &.btn-edit {
      color: #4C4CD6;
    }

    &.btn-delete {
      color: #B91919;
    }
  }
  </style>
