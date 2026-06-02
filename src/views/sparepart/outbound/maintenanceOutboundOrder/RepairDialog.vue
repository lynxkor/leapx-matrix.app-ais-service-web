<template>
    <el-dialog
      class="m-start-work-dialog"
      title="维修出库"
      width="1000px"
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
            <vxe-column field="sparePartName" title="备件名称" width="180" show-overflow />
            <vxe-column field="availableQty" title="可用库存" width="180" />
            <vxe-column field="outboundQty" title="出库数量" width="180" />
            <vxe-column title="领料人" width="180">
              <template #default="{ row, rowIndex }">
                <el-select
                  v-model="row.picker"
                  size="mini"
                  placeholder="请选择"
                  filterable
                  remote
                  :remote-method="(query) => querySearchAsync(query, rowIndex)"
                  @visible-change="handleSelectVisible"
                  @change="handleWorkstationChange(row, rowIndex, $event)"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </vxe-column>
          </vxe-table>
          <div class="table-pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>

      <!-- 底部按钮 -->
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" :loading="submitLoading" @click="submit">出 库</el-button>
        </div>
      </template>
    </el-dialog>
  </template>

<script>
import { collarPage, OutboundPeople } from '@/api/sparepart/outbound/maintenanceOutboundOrder/index';
import { getUserByNameOrNo } from '@/api/common';

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
      // 领料人
      userList: [],
      // 模拟表格数据
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      this.initData();
    },
  },
  methods: {
    initData () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        maintenanceOutboundOrderId: this.id,
        outboundIs: 0
      };
      collarPage(params).then(res => {
        this.tableData = res.records || [];
        this.total = res.total || 0;
        // 默认勾选所有行
        this.$nextTick(() => {
          if (this.$refs.workTable) {
            this.$refs.workTable.setAllCheckboxRow(true);
          }
          // 手动设置 selectedRows，因为 setAllCheckboxRow 不会触发 checkbox-change 事件
          this.selectedRows = [...this.tableData];
        });
      });
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.initData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.initData();
    },
    close () {
      this.$emit('update:visible', false);
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
      // 2. 检查所有勾选行是否都选择了领料人
      const rowsWithoutPicker = this.selectedRows.filter(row => !row.picker);
      if (rowsWithoutPicker.length > 0) {
        const rowNumbers = rowsWithoutPicker.map((row, index) => index + 1);
        this.$message.warning(`第 ${rowNumbers.join('、')} 行未选择领料人`);
        return;
      }

      //  构建参数
      const params = {
        maintenanceOutboundOrderId: this.id,
        outboundPartList: this.selectedRows.map(row => ({
          id: row.id, // 行数据的唯一标识
          picker: row.picker // 领料人ID
        }))
      };
      // 批量更新选中行的实际作业时间
      this.submitLoading = true;
      try {
        await OutboundPeople(params);
        this.$message.success('出库成功');
        this.submitLoading = false;
        this.selectedRows = [];
        this.close();
        this.$emit('success');
      } catch (error) {
        this.submitLoading = false;
      }
    },
    // 远程搜索方法，接收行索引参数
    querySearchAsync (queryString, rowIndex) {
      getUserByNameOrNo({ name: queryString }).then(res => {
        this.userList = (res || []).map(item => ({
          value: item.userId,
          label: item.username
        }));
      }).catch(error => {
        console.log('搜索用户失败:', error);
        this.userList = [];
      });
    },
    // 下拉框展开时，如果无数据则默认加载20条
    handleSelectVisible (visible) {
      if (visible && !this.userList.length) {
        getUserByNameOrNo({ pageSize: 20 }).then(res => {
          this.userList = (res || []).map(item => ({
            value: item.userId,
            label: item.username
          }));
        }).catch(error => {
          console.log('获取用户列表失败:', error);
        });
      }
    },

    // 处理领料人选择变化
    handleWorkstationChange (row, rowIndex, ele) {
      // 设置当前行的领料人
      row.picker = ele;

      // 检查是否所有其他行都没有领料人值
      const allEmpty = this.tableData.every((r, idx) => idx === rowIndex || !r.picker);

      if (allEmpty && this.tableData.length > 1) {
        // 如果所有其他行都没有值，则将所有行设置为当前选择的值
        this.tableData.forEach((r, idx) => {
          if (idx !== rowIndex) {
            r.picker = ele;
          }
        });
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
