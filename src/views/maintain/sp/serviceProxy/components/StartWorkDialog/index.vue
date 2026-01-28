<template>
  <el-dialog
    class="m-start-work-dialog"
    :title="dialogTitle"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="start-work-content">
      <!-- 顶部时间选择区域 -->
      <div class="time-section">
        <el-form size="small" :model="batchForm" :inline="true">
          <el-form-item :label="timeLabel">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              style="width: 220px;"
              @change="handleTimeChange"
            />
          </el-form-item>
        </el-form>
      </div>

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
          :checkbox-config="checkboxConfig"
          @checkbox-change="handleSelectionChange"
          @checkbox-all="handleSelectionChange"
          min-height="0"
          max-height="500px"
        >
          <vxe-column type="checkbox" width="60" align="center"/>
          <vxe-column type="seq" title="序号" width="70" align="center"/>
          <vxe-column field="repairItemCode" title="维修项目代码" width="130"/>
          <vxe-column field="repairItemName" title="维修项目名称" min-width="150" show-overflow/>
          <vxe-column :field="timeField" :title="timeColumnLabel" width="200">
            <template #default="{ row }">
              <el-date-picker
                style="width:172px"
                v-model="row[timeField]"
                type="datetime"
                size="mini"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </template>
          </vxe-column>
          <vxe-column field="dealerStationName" title="工位" width="130"/>
          <vxe-column field="dealerWorkTeamName" title="班组" width="140"/>
          <vxe-column field="repairTechnicianName" title="维修技师" width="130"/>
          <vxe-column field="statusLabel" title="作业状态" width="130"/>
<!--          <vxe-column title="作业状态" width="120" align="center">-->
<!--            <template #default="{ row }">-->
<!--              <el-tag :type="getStatusType(row.finishAt)" size="small">-->
<!--                {{ getWorkStatus(row.finishAt) }}-->
<!--              </el-tag>-->
<!--            </template>-->
<!--          </vxe-column>-->
          <vxe-column field="startAt" title="计划作业时间" width="160"/>
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
import { getRepairWorkRecord, startWork, endWork } from '@/api/maintain/sp/serviceProxy/index';
import moment from 'moment';
export default {
  name: 'StartWorkDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    vehicleInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 工作模式: 'start' 作业开始, 'end' 作业结束
    mode: {
      type: String,
      default: 'start'
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      tableLoading: false,
      batchForm: {
        actualTime: ''
      },
      selectedRows: [],
      tableData: [],
      checkboxConfig: {
        checkField: 'checked',
        checkMethod: ({ row }) => {
          return !row.disabled;
        }
      }
    };
  },
  computed: {
    dialogTitle () {
      return this.mode === 'end' ? '作业结束' : '作业开始';
    },
    timeLabel () {
      return this.mode === 'end' ? '作业结束时间：' : '实际作业时间：';
    },
    timeColumnLabel () {
      return this.mode === 'end' ? '作业结束时间' : '实际作业时间';
    },
    timeField () {
      return this.mode === 'end' ? 'finishAt' : 'timeSpend';
    }
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
    async initData () {
      try {
        this.tableLoading = true;
        // 获取维修作业记录数据
        const res = await getRepairWorkRecord({ serviceProxyId: this.vehicleInfo.id });
        this.tableData = (res || []).map(item => ({
          ...item,
          disabled: this.mode === 'end' ? !!item.finishAt : !!item.timeSpend
        }));
        // 设置默认当前时间
        this.batchForm.actualTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const field = this.timeField;
        this.tableData.forEach(row => {
          if (!row?.[field]) {
            this.$set(row, field, this.batchForm.actualTime);
          }
        });
        // 等待表格渲染完成后，默认勾选非禁用的行
        this.$nextTick(() => {
          this.tableData.forEach(row => {
            if (!row.disabled) {
              this.$refs.workTable.setCheckboxRow(row, true);
              this.selectedRows.push(row);
            }
          });
        });
      } catch (error) {
        console.error('获取作业数据失败', error);
        this.$message.error('获取作业数据失败');
      } finally {
        this.tableLoading = false;
      }
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.batchForm = {
        actualTime: ''
      };
      this.$refs.workTable && this.$refs.workTable.clearCheckboxRow();
      this.tableData = [];
      this.selectedRows = [];
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    handleTimeChange (val) {
      // 时间选择器的 change 回调,更新表格中所有行的时间
      this.updateAllRowsTime(val);
    },
    updateAllRowsTime (time) {
      // 更新所有行的时间
      const field = this.timeField;
      this.tableData.forEach(row => {
        if (!row?.[field]) {
          this.$set(row, field, time);
        }
      });
    },
    async submit () {
      if (this.selectedRows.length === 0) {
        this.$message.warning(`请至少选择一条数据进行${this.mode === 'end' ? '作业结束' : '作业开始'}`);
        return;
      }

      try {
        this.submitLoading = true;
        // 提交接口数据
        const idList = this.selectedRows.map(row => row.id);
        const time = this.batchForm.actualTime;
        if (this.mode === 'start') {
          await startWork({ serviceProxyId: this.vehicleInfo.id, ids: idList, timeSpend: time });
        } else {
          await endWork({ serviceProxyId: this.vehicleInfo.id, ids: idList, finishAt: time });
        }

        this.$message.success(this.mode === 'end' ? '作业结束成功' : '作业开始成功');
        this.$emit('refresh');
        this.close();
      } catch (error) {
        console.error('操作失败', error);
      } finally {
        this.submitLoading = false;
      }
    },
    // getWorkStatus(finishAt) {
    //   // 根据 finishAt 判断作业状态
    //   if (finishAt) {
    //     return '已完成';
    //   }
    //   return '作业中';
    // },
    getStatusType (finishAt) {
      // 根据 finishAt 返回对应的 tag 类型
      if (finishAt) {
        return 'success';
      }
      return 'warning';
    }
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
