<template>
  <el-dialog
    class="m-start-work-dialog"
    title="作业开始"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="start-work-content">
      <!-- 顶部时间选择区域 -->
      <div class="time-section">
        <el-form size="small" :model="batchForm" :inline="true">
          <el-form-item label="实际作业时间：">
            <el-date-picker
              v-model="batchForm.actualTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 220px;"
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
          :checkbox-config="{ checkField: 'checked' }"
          @checkbox-change="handleSelectionChange"
          @checkbox-all="handleSelectionChange"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column type="seq" title="序号" width="70" align="center" />
          <vxe-column field="code" title="维修项目代码" width="130" />
          <vxe-column field="name" title="维修项目名称" min-width="150" show-overflow />
          <vxe-column field="actualTime" title="实际作业时间" width="170" />
          <vxe-column title="工位" width="130">
            <template #default="{ row }">
              <el-select v-model="row.workstation" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in workstationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column title="班组" width="140">
            <template #default="{ row }">
              <el-select v-model="row.team" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in teamOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column title="维修技师" width="130">
            <template #default="{ row }">
              <el-select v-model="row.technician" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in technicianOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column title="作业状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ row.status }}
              </el-tag>
            </template>
          </vxe-column>
          <vxe-column field="planHours" title="计划" width="80" align="center" />
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
export default {
  name: 'StartWorkDialog',
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
      dialogVisible: this.visible,
      submitLoading: false,
      batchForm: {
        actualTime: ''
      },
      selectedRows: [],
      // 工位选项
      workstationOptions: [
        { label: '零路机电', value: '零路机电' },
        { label: '保养', value: '保养' },
        { label: '维修', value: '维修' },
        { label: '钣金', value: '钣金' },
        { label: '喷漆', value: '喷漆' }
      ],
      // 班组选项
      teamOptions: [
        { label: '机电罗海民', value: '机电罗海民' },
        { label: '自费', value: '自费' },
        { label: '自费自', value: '自费自' },
        { label: '保修', value: '保修' },
        { label: '索赔', value: '索赔' }
      ],
      // 技师选项
      technicianOptions: [
        { label: '罗海民', value: '罗海民' },
        { label: '无', value: '无' },
        { label: '张三', value: '张三' },
        { label: '李四', value: '李四' },
        { label: '王五', value: '王五' }
      ],
      // 模拟表格数据
      tableData: [
        {
          id: 1,
          checked: true,
          code: '999999',
          name: '万维工时',
          actualTime: '2023-10-27 12:12:12',
          workstation: '零路机电',
          team: '机电罗海民',
          technician: '罗海民',
          status: '作业未开始',
          planHours: '20'
        },
        {
          id: 2,
          checked: false,
          code: '9217839293',
          name: '更换风道上部',
          actualTime: '2023-10-27 12:12:12',
          workstation: '零路机电',
          team: '机电罗海民',
          technician: '罗海民',
          status: '作业未开始',
          planHours: '20'
        },
        {
          id: 3,
          checked: false,
          code: '8273618293',
          name: '更换机油滤芯',
          actualTime: '2023-10-27 13:00:00',
          workstation: '保养',
          team: '机电罗海民',
          technician: '张三',
          status: '作业中',
          planHours: '15'
        },
        {
          id: 4,
          checked: false,
          code: '7362527281',
          name: '更换空气滤芯',
          actualTime: '2023-10-27 14:15:30',
          workstation: '保养',
          team: '自费',
          technician: '李四',
          status: '已完成',
          planHours: '10'
        },
        {
          id: 5,
          checked: false,
          code: '6351616271',
          name: '更换空调滤芯',
          actualTime: '',
          workstation: '保养',
          team: '索赔',
          technician: '王五',
          status: '作业未开始',
          planHours: '12'
        }
      ]
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
    getStatusType (status) {
      const statusMap = {
        作业未开始: 'info',
        作业中: 'warning',
        已完成: 'success'
      };
      return statusMap[status] || 'info';
    },
    formatDate (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
