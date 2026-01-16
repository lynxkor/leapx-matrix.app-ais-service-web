<template>
  <el-dialog
    class="m-start-work-dialog"
    title="添加旧件"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="start-work-content">
      <!-- 顶部时间选择区域 -->
      <div class="time-section">
        <el-form label-width="150px" size="small" :model="batchForm" :inline="true">
          <el-form-item label="保修申请单：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item label="旧件唯一码：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
            />
          </el-form-item>
          <template v-if="visibleForm">
          <el-form-item label="VIN：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item label="保修类型：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item label="旧件编码：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item label="旧件名称：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item label="保修审核通过日期：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
            />
          </el-form-item>
          <el-form-item label="旧件入库时间：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
            />
          </el-form-item>
          </template>
          <page-search-action
            v-model="visibleForm"
            :is-expandable="true"
            :loading="loading"
            align="right"
            @submit="onSubmit"
            @reset="onReset"
          />
        </el-form>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <vxe-table
          ref="workTable"
          :data="tableData"
          stripe
          resizable
          border="inner"
          size="medium"
          :height="500"
          :checkbox-config="{ checkField: 'checked' }"
          @checkbox-change="handleSelectionChange"
          @checkbox-all="handleSelectionChange"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column field="serviceProxyNo" title="接车施工单" width="200" />
          <vxe-column field="warrantyNo" title="保修申请单" width="200" />
          <vxe-column field="oldPartUniqueCode" title="旧件唯一码" width="200" />
          <vxe-column field="dealerName" title="门店名称" width="200" />
          <vxe-column field="dealerStatusLabel" title="门店库存状态" width="120" />
          <vxe-column field="isMainPartLabel" title="是否主因零部件" width="100" />
          <vxe-column field="vin" title="VIN" width="140" />
          <!-- <vxe-column field="oldPartSupplierName" title="零件供应商" width="200" /> -->
          <vxe-column field="mainPartSupplierName" title="主因件供应商" width="150" />
          <vxe-column field="oldPartCode" title="旧件编码" width="120" />
          <vxe-column field="oldPartName" title="旧件名称" width="150" />
          <vxe-column field="partCode" title="换上零件编码" width="200" />
          <vxe-column field="partName" title="换上零件名称" width="220" />
          <!-- <vxe-column field="partCode" title="入库旧件编码" width="200" /> -->
          <vxe-column field="dealerStatusLabel" title="主机厂库存状态" width="120" />
          <vxe-column field="dealerOutTime" title="门店出库时间" width="180" />
          <!-- <vxe-column field="claimTrackNo" title="门店货运单号" width="120" /> -->
          <vxe-column field="oemCheckTime" title="主机厂验收时间" width="180" />
          <vxe-column field="oemOutboundOrderNo" title="主机厂出库单" width="140" />
          <vxe-column field="oemOutTime" title="主机厂出库时间" width="180" />
          <vxe-column field="returnTypeLabel" title="旧件返回类型" width="120" />
          <vxe-column field="remark" title="备注" width="120" />
          <vxe-column field="checkRemark" title="验收备注" width="120" />
        </vxe-table>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import PageSearchAction from '@/libs/components/AisPageSearchAction/index.vue';
import {
  getList, // 旧件库存详情分页查询
} from '@/api/claimreturn/oldpart/inventory/oem/index';

export default {
  name: 'OldPartDialog',
  components: {
    PageSearchAction,
  },
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
    }
  },
  data () {
    return {
      visibleForm: false,
      form: {},
      pageSize: 20,
      pageIndex: 1,
      loading: false,
      selectionList: [],
      //
      dialogVisible: this.visible,
      submitLoading: false,
      batchForm: {
        actualTime: ''
      },
      selectedRows: [],
      // 表格数据
      tableData: [],
      total: 0,
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    }
  },
  methods: {
    initData () {
      // 初始化默认时间为当前时间
      this.batchForm.actualTime = this.formatDate(new Date());
      console.log('初始化批量修改数据', this.info);
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.batchForm = {
        actualTime: ''
      };
      this.$refs.workTable && this.$refs.workTable.clearCheckboxRow();
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    submit () {
      // 批量更新选中行的实际作业时间
      if (this.batchForm.actualTime) {
        this.submitLoading = true;
        setTimeout(() => {
          this.selectedRows.forEach(row => {
            row.actualTime = this.batchForm.actualTime;
            row.checked = false;
          });
          this.$message.success('批量修改成功');
          this.submitLoading = false;
          this.$emit('refresh', this.tableData);
          this.close();
        }, 500);
      } else {
        this.$message.warning('请选择实际作业时间');
      }
    },
    // --------------- 表单查询 -------------------------
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form.page = 1;
      this.form.pageSize = 20;
      this.getData();
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }

      return data;
    },
    getData () {
      this.loading = true;
      this.selectedRows = [];

      getList({ ...this.getFormData(), pageNum: this.pageIndex, pageSize: this.pageSize })
        .then(res => {
          this.tableData = res.records;
          this.total = res.total;
          console.log(this.tableData);
        }).finally(() => {
          this.loading = false;
        });
    },
    // -------------- 表单查询 --------------------------
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {
  ::v-deep .el-dialog__body {
    max-height: 90vh !important;
  }
  .el-form-item {
    width: 33.3% !important;
  }
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }

  .start-work-content {
    .time-section {
      padding-bottom: 8px;
      border-bottom: 1px solid #e8e8e8;

      .el-form {
        .el-form-item {
          margin-bottom: 8px;
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
