<template>
    <el-dialog
      class="m-start-work-dialog"
      title="维修退料入库"
      width="800px"
      :visible.sync="dialogVisible"
      @close="close"
      @closed="closed"
    >
        <!-- 数据表格 -->
        <div class="table-section">
          <vxe-table
            ref="workTable"
            :data="tableData"
            stripe
            show-overflow
            resizable
            border="inner"
            size="medium"
            :checkbox-config="{ checkField: 'checked' }"
            @checkbox-change="handleSelectionChange"
            @checkbox-all="handleSelectionChange"
          >
            <vxe-column type="checkbox" width="60" align="center" />
            <vxe-column field="sparePartCode" title="备件编码" width="180" />
            <vxe-column field="sparePartName" title="备件名称" width="250" show-overflow />
            <vxe-column field="locationName" title="库位" width="150" />
            <vxe-column field="returnApplicationQty" title="入库数量" width="150" />
          </vxe-table>
        </div>

      <!-- 底部按钮 -->
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" :loading="submitLoading" @click="submit">入 库</el-button>
        </div>
      </template>
    </el-dialog>
  </template>

<script>
import { goPage } from '@/api/sparepart/outbound/maintenanceOutboundOrder/index';
import { inboundWarehousing } from '@/api/sparepart/inbound/maintenanceReturnInbound/index';

export default {
  name: 'RepairDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {};
      }
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      selectedRows: [],
      // 模拟表格数据
      tableData: [],
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    },
  },
  methods: {
    initData () {
      const params = {
        pageNum: 1,
        pageSize: 50,
        maintenanceOutboundOrderId: this.id,
        inboundIs: 0
      };
      goPage(params).then(res => {
        this.tableData = res.records || [];
      });
    },
    close () {
      this.$emit('close');
    },
    closed () {
      this.$refs.workTable && this.$refs.workTable.clearCheckboxRow();
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    async submit () {
      if (!this.selectedRows.length) {
        this.$message.warning('请选择需要出库的明细记录');
        return;
      }

      //  构建参数
      const params = {
        maintenanceOutboundOrderId: this.id,
        inboundPartList: this.selectedRows.map(row => ({
          id: row.id, // 行数据的唯一标识
          returnWarehousingOperator: row.returnWarehousingOperator,
          remark: row.remark
        }))
      };
      // 批量更新选中行的实际作业时间
      this.submitLoading = true;
      try {
        await inboundWarehousing(params);
        this.$message.success('入库成功');
        this.submitLoading = false;
        this.selectedRows = [];
        this.$emit('success');
      } catch (error) {
        this.$message.error('入库失败');
        this.submitLoading = false;
      }
    },
  }
};
</script>

  <style lang="scss" scoped>
  .m-start-work-dialog {
    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
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
  </style>
