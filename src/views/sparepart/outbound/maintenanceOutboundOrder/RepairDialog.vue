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
                  @change="handleWorkstationChange(row, rowIndex, $event)"
                >
                  <el-option
                    v-for="item in getFilteredUserList(rowIndex)"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </vxe-column>
          </vxe-table>
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
      sameAsPreviousId: 0, // 同上选项的固定ID
      sameAsPreviousLabel: '同上',
      // 模拟表格数据
      tableData: [],
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
        pageNum: 1,
        pageSize: 50,
        maintenanceOutboundOrderId: this.id,
        outboundIs: 0
      };
      collarPage(params).then(res => {
        this.tableData = res.records || [];
      });
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
        const list = res?.map(item => {
          return {
            value: item.userId,
            label: item.username
          };
        }) || [];

        this.userList = list;
      }).catch(error => {
        console.log('搜索用户失败:', error);
        this.userList = [];
      });
    },

    // 获取过滤后的用户列表（根据行索引决定是否显示"同上"）
    getFilteredUserList (rowIndex) {
      // 如果是第一行，不显示"同上"选项
      if (rowIndex === 0) {
        return this.userList;
      }

      // 其他行，添加"同上"选项到列表前面
      return [
        {
          value: this.sameAsPreviousId,
          label: this.sameAsPreviousLabel
        },
        ...this.userList
      ];
    },

    // 处理领料人选择变化
    handleWorkstationChange (row, rowIndex, ele) {
      row.picker = ele;
      // 如果选择了"同上"
      if (row.picker === this.sameAsPreviousId) {
        // 获取上一行的值
        const previousRow = this.tableData[rowIndex - 1];

        if (previousRow && previousRow.picker !== this.sameAsPreviousId) {
          // 如果上一行有值且不是"同上"，则使用上一行的值
          row.picker = previousRow.picker;
        } else if (previousRow && previousRow.picker === this.sameAsPreviousId) {
          // 如果上一行也是"同上"，则需要递归找到实际值
          let actualValue = this.findActualWorkstation(rowIndex - 1);
          row.picker = actualValue || '';
        } else {
          // 上一行没有值，重置选择
          row.picker = '';
          this.$message.warning('上一行没有选择领料人，无法选择"同上"');
        }
      };
    },

    // 递归查找实际的工作站值（处理连续"同上"的情况）
    findActualWorkstation (rowIndex) {
      if (rowIndex < 0) return null;

      const currentRow = this.tableData[rowIndex];

      // 如果当前行不是"同上"，返回当前值
      if (currentRow.picker !== this.sameAsPreviousId) {
        return currentRow.picker;
      }

      // 如果是"同上"，继续向上查找
      return this.findActualWorkstation(rowIndex - 1);
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
