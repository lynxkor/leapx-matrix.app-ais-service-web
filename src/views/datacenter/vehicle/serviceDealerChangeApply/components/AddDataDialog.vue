<template>
  <el-dialog
    class="m-start-work-dialog"
    title="标题"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="start-work-content">
      <!-- 顶部时间选择区域 -->
      <div class="time-section">
        <el-form ref="ruleForm" label-width="150px" size="small" :model="form" :inline="true">
          <el-form-item label="创建者">
            <el-input
              placeholder="请输入"
              v-model="form.creator"
              clearable
            />
          </el-form-item>
          <template v-if="visibleForm">
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
          <vxe-column field="updateTime" title="修改时间" width=""/>
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
  getDialogList,
  addDetail,
} from '@/api/datacenter/vehicle/serviceDealerChangeApply/index';

const defaultForm = {
  updateTime: '',
};
export default {
  name: 'AddDataDialog',
  components: {
    PageSearchAction,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    _id: {
      type: String,
    },
  },
  data () {
    return {
      pageSizes: [10, 20, 50, 100],
      visibleForm: false,
      form: { ...defaultForm },
      pageSize: 20,
      pageNum: 1,
      loading: false,
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
      let data = {
        ...this.getFormData(),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      getDialogList(data)
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

      // 动态处理所有日期范围字段

      return data;
    },
    // -------------- 表单查询 --------------------------
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
