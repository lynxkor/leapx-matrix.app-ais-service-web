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
        <el-form ref="ruleForm" label-width="150px" size="small" :model="form" :inline="true">
          <el-form-item label="保修申请单" prop="warrantyNo">
            <el-input
              placeholder="请输入"
              v-model="form.warrantyNo"
              clearable
            />
          </el-form-item>
          <el-form-item label="旧件唯一码" prop="oldPartUniqueCode">
            <el-input
              placeholder="请输入"
              v-model="form.oldPartUniqueCode"
              clearable
            />
          </el-form-item>
          <template v-if="visibleForm">
          <el-form-item label="VIN" prop="vin">
            <el-input
              placeholder="请输入"
              v-model="form.vin"
              clearable
            />
          </el-form-item>
          <el-form-item label="保修类型" prop="repairItemTypeId">
            <repair-type-select
              v-model="form"
              :form-data="form"
            />
          </el-form-item>
          <el-form-item label="旧件编码" prop="oldPartCode">
            <el-input
              placeholder="请输入"
              v-model="form.oldPartCode"
              clearable
            />
          </el-form-item>
          <el-form-item label="旧件名称" prop="oldPartNameLike">
            <el-input
              placeholder="请输入"
              v-model="form.oldPartNameLike"
              clearable
            />
          </el-form-item>
          <el-form-item class="form-item-half" label="保修审核通过日期" prop="warrantyApproveTime">
            <el-date-picker
              v-model="form.warrantyApproveTime"
              type="daterange"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="form-item-half" label="旧件入库时间" prop="dealerInTime">
            <el-date-picker
              v-model="form.dealerInTime"
              type="daterange"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right">
            </el-date-picker>
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

      <!-- 操作按钮 -->
      <div class="ais-actions" style="margin: 8px 0;">
        <el-button size="small" :loading="exportLoading" @click="exportExcel">导出</el-button>
      </div>

      <!-- 数据表格 -->
      <div class="table-section" :class="{'visibleForm': visibleForm}">
        <vxe-table
          ref="table"
          :data="tableData"
          stripe
          resizable
          border="inner"
          size="medium"
          height="auto"
          :checkbox-config="{ checkField: 'checked' }"
          @checkbox-change="handleSelectionChange"
          @checkbox-all="handleSelectionChange"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column field="serviceProxyNo" title="接车施工单" width="200" />
          <vxe-column field="warrantyNo" title="保修申请单" width="200" />
          <vxe-column field="oldPartUniqueCode" title="旧件唯一码" width="200" />
          <vxe-column field="dealerName" title="门店名称" width="200" />
          <vxe-column field="isMainPartLabel" title="是否主因零部件" width="160" />
          <vxe-column field="repairItemTypeName" title="保修类型" width="160" />
          <vxe-column field="mileage" title="进店里程KM" width="140" />
          <vxe-column field="vin" title="VIN" width="140" />
          <vxe-column field="oldPartSupplierName" title="零件供应商" width="200" />
          <vxe-column field="mainPartSupplierName" title="主因件供应商" width="150" />
          <vxe-column field="oldPartCode" title="旧件编码" width="120" />
          <vxe-column field="oldPartName" title="旧件名称" width="150" />
          <vxe-column field="partCode" title="换上零件编码" width="200" />
          <vxe-column field="partName" title="换上零件名称" width="220" />
          <vxe-column field="oldPartCode" title="入库旧件编码" width="200" />
          <vxe-column field="oemStatusLabel" title="主机厂库存状态" width="140" />
          <vxe-column field="oemCheckTime" title="主机厂验收时间" width="180" />
          <vxe-column field="returnTypeLabel" title="旧件返回类型" width="120" />
          <vxe-column field="remark" title="备注" width="120" />
          <vxe-column field="checkRemark" title="验收备注" width="120" />
        </vxe-table>
        <el-pagination
          style="float: right; padding-top: 16px;"
          :current-page.sync="pageNum"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next, sizes, jumper"
          :page-sizes="pageSizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import PageSearchAction from '@/libs/components/AisPageSearchAction/index.vue';
import {
  getList, // 旧件库存详情分页查询
} from '@/api/claimreturn/oldpart/inventory/oem/index';
import { exportTable } from '@/api/common';
import { addDetail as addDetailReturnorder } from '@/api/claimreturn/oldpart/returnorder/index';
import { addDetail as addDetailOutbound } from '@/api/claimreturn/oldpart/outbound/index';
import RepairTypeSelect from '@/components/RepairTypeSelect';
import { formatDateTime, getEndOfDayString, downloadExcel } from '@/libs/utils';

const defaultForm = {
  warrantyNo: '',
  oldPartUniqueCode: '',
  repairItemTypeId: '',
  repairItemTypeName: '',
  vin: '',
  oldPartCode: '',
  oldPartName: '',
  warrantyApproveTime: null,
  warrantyApproveTimeStart: '',
  warrantyApproveTimeEnd: '',
  dealerInTime: null,
  dealerInTimeStart: '',
  dealerInTimeEnd: '',
};
export default {
  name: 'OldPartDialog',
  components: {
    PageSearchAction,
    RepairTypeSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    _id: {
      type: String,
    },
    dealerCode: {
      type: String,
    },
    supplierId: {
      type: String,
    },
    type: {
      type: String// ['outbound', 'returnorder'],
    }
  },
  data () {
    return {
      pageSizes: [10, 20, 50, 100],
      visibleForm: false,
      form: { ...defaultForm },
      pageSize: 20,
      pageNum: 1,
      loading: false,
      exportLoading: false,
      //
      dialogVisible: this.visible,
      submitLoading: false,
      selectedRows: [],
      // 表格数据
      tableData: [],
      total: 0,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            end.setHours(23, 59, 59, 999); // 设置为当天的 23:59:59
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            start.setHours(0, 0, 0, 0); // 设置为前七天的 00:00:00
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            end.setHours(23, 59, 59, 999); // 设置为当天的 23:59:59
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            start.setHours(0, 0, 0, 0); // 设置为前30天的 00:00:00
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            end.setHours(23, 59, 59, 999); // 设置为当天的 23:59:59
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            start.setHours(0, 0, 0, 0); // 设置为前90天的 00:00:00
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.form = {
        ...defaultForm,
      };
      this.selectedRows = [];
      this.$refs.table && this.$refs.table.clearCheckboxRow();
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    submit () {
      //
      this.submitLoading = true;
      const addDetail = this.type === 'outbound' ? addDetailOutbound : addDetailReturnorder;
      addDetail({
        id: this._id,
        detailIdList: this.selectedRows.map(item => item.id),
      }).then(res => {
        this.$emit('update');
        this.close();
        this.$message.success('添加成功');
      }).finally(() => {
        this.submitLoading = false;
      });
    },
    pageChange (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectedRows = [];
      getList(this.getQueryData())
        .then(res => {
          this.tableData = res.records;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // --------------- 表单查询 -------------------------
    onSubmit () {
      this.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form.page = 1;
      this.form.pageSize = 20;
      this.$refs.ruleForm.resetFields();
      this.getData();
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      const rangeTimeKeys = ['warrantyApproveTime', 'dealerInTime'];
      rangeTimeKeys.forEach(key => {
        if (this.form[key]) {
          delete data[key];
          if (this.form[key].length > 1) {
            data[`${key}Start`] = formatDateTime(this.form[key][0]);
            data[`${key}End`] = getEndOfDayString(formatDateTime(this.form[key][1]));
          }
        }
      });
      return data;
    },
    // -------------- 表单查询 --------------------------
    exportExcel () {
      this.exportLoading = true;
      const titleMap = {
        serviceProxyNo: '接车施工单',
        warrantyNo: '保修申请单',
        oldPartUniqueCode: '旧件唯一码',
        dealerName: '门店名称',
        isMainPartLabel: '是否主因零部件',
        repairItemTypeName: '保修类型',
        mileage: '进店里程KM',
        vin: 'VIN',
        oldPartSupplierName: '零件供应商',
        mainPartSupplierName: '主因件供应商',
        oldPartCode: '旧件编码',
        oldPartName: '旧件名称',
        partCode: '换上零件编码',
        partName: '换上零件名称',
        oemStatusLabel: '主机厂库存状态',
        oemCheckTime: '主机厂验收时间',
        returnTypeLabel: '旧件返回类型',
        remark: '备注',
        checkRemark: '验收备注',
      };
      exportTable({
        businessType: '旧件库存',
        dataFetchPath: '/claimreturn/oldpart/web/inventory/oldPartOemInventory/page',
        reqParams: this.getQueryData(),
        titleMap,
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '旧件库存.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$message({ type: 'info', message: '请前往导出列表中查询导出结果' });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getQueryData () {
      const data = {
        ...this.getFormData(),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      if (this.type === 'outbound') {
        Object.assign(data, {
          mainPartSupplierId: this.supplierId,
          oemStatus: '700',
          oemOutboundOrderIdIsNull: true,
        });
      } else {
        Object.assign(data, {
          dealerCode: this.dealerCode,
          dealerStatus: '300',
          returnOrderIdIsNull: true,
          returnType: '30',
        });
      }
      return data;
    },
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {

  ::v-deep .el-dialog{
    height: 560px;
  }
  ::v-deep .el-dialog__body {
    height: 448px;
    padding: 20px;
    max-height: 448px;
    .start-work-content {
      height: 100%;
    }
  }
  .el-form-item {
    width: 33.3% !important;
    ::v-deep .el-form-item__label{
      color: #3B3E3B;
    }
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
      height: 80%;
      &.visibleForm{
        height: 68%;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 2px;
  }
}
</style>
