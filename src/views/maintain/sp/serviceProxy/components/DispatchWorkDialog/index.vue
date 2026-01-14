<template>
  <el-dialog
    class="m-dispatch-work-dialog"
    title="派工"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="dispatch-work-content">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form size="small" :model="filterForm" :inline="true" style="width:100%">
          <el-row>
            <el-col span="6">
              <el-form-item label="工位：">
                <el-select v-model="filterForm.workstation" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in workstationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="6">
              <el-form-item label="班组：">
                <el-select v-model="filterForm.team" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in teamOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="6">
              <el-form-item label="技师：">
                <el-select v-model="filterForm.technician" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in technicianOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="6">
              <el-form-item label="计划作业时间：">
                <el-date-picker
                  v-model="filterForm.plannedTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" size="small" :loading="dispatchLoading" @click="handleDispatch">派工</el-button>
        <el-button type="danger" size="small" :loading="deleteLoading" @click="handleDeleteDispatch">删除派工</el-button>
      </div>

      <!-- 数据表格 -->
      <div class="table-section">
        <vxe-table
          ref="dispatchTable"
          :data="tableData"
          stripe
          show-overflow
          resizable
          border="inner"
          size="medium"
          @checkbox-change="handleSelectionChange"
          @checkbox-all="handleSelectionChange"
          :checkbox-config="{ checkField: 'checked' }"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column field="code" title="维修项目代码" width="150" />
          <vxe-column field="name" title="维修项目名称" min-width="150" show-overflow />
          <vxe-column title="工位" width="150">
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
          <vxe-column title="班组" width="150">
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
          <vxe-column title="维修技师" width="150">
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
          <vxe-column field="plannedHours" title="计划作业时间" width="150" align="center" />
          <vxe-column title="派工" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.isDispatched ? 'success' : 'info'" size="small">
                {{ row.isDispatched ? '是' : '否' }}
              </el-tag>
            </template>
          </vxe-column>
          <vxe-column field="dispatchTime" title="派工时间" width="160" show-overflow />
        </vxe-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DispatchWorkDialog',
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
      filterForm: {
        workstation: '',
        team: '',
        technician: '',
        plannedTime: ''
      },
      selectedRows: [],
      dispatchLoading: false,
      deleteLoading: false,
      // 筛选选项
      workstationOptions: [
        { label: '保养', value: '保养' },
        { label: '维修', value: '维修' },
        { label: '钣金', value: '钣金' },
        { label: '喷漆', value: '喷漆' }
      ],
      teamOptions: [
        { label: '自费', value: '自费' },
        { label: '自费自', value: '自费自' },
        { label: '保修', value: '保修' },
        { label: '索赔', value: '索赔' }
      ],
      technicianOptions: [
        { label: '无', value: '无' },
        { label: '张三', value: '张三' },
        { label: '李四', value: '李四' },
        { label: '王五', value: '王五' }
      ],
      // 模拟表格数据
      tableData: [
        {
          id: 1,
          code: '999999',
          name: '万能工时',
          workstation: '保养',
          team: '自费',
          technician: '无',
          plannedHours: '1.0',
          isDispatched: true,
          dispatchTime: '2023-10-27 12:30:45'
        },
        {
          id: 2,
          code: '9217839293',
          name: '更换风道上部',
          workstation: '保养',
          team: '自费自',
          technician: '无',
          plannedHours: '1.2',
          isDispatched: false,
          dispatchTime: '2023-10-27 12:35:20'
        },
        {
          id: 3,
          code: '8273618293',
          name: '更换机油滤芯',
          workstation: '维修',
          team: '保修',
          technician: '张三',
          plannedHours: '0.5',
          isDispatched: true,
          dispatchTime: '2023-10-27 13:00:00'
        },
        {
          id: 4,
          code: '7362527281',
          name: '更换空气滤芯',
          workstation: '保养',
          team: '自费',
          technician: '李四',
          plannedHours: '0.3',
          isDispatched: false,
          dispatchTime: ''
        },
        {
          id: 5,
          code: '6351616271',
          name: '更换空调滤芯',
          workstation: '保养',
          team: '索赔',
          technician: '王五',
          plannedHours: '0.4',
          isDispatched: true,
          dispatchTime: '2023-10-27 14:15:30'
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
      // 初始化数据，可以在这里根据props.info加载数据
      console.log('初始化派工数据', this.info);
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.filterForm = {
        workstation: '',
        team: '',
        technician: '',
        plannedTime: ''
      };
      this.$refs.dispatchTable && this.$refs.dispatchTable.clearCheckboxRow();
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    handleDispatch () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请至少选择一条数据进行派工');
        return;
      }

      this.dispatchLoading = true;
      // 模拟派工操作
      setTimeout(() => {
        this.selectedRows.forEach(row => {
          row.isDispatched = true;
          row.dispatchTime = this.formatDate(new Date());
        });
        this.$message.success('派工成功');
        this.dispatchLoading = false;
        this.$refs.dispatchTable.clearCheckboxRow();
        this.$emit('refresh');
      }, 500);
    },
    handleDeleteDispatch () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请至少选择一条数据进行删除派工');
        return;
      }

      this.$confirm('确认删除选中数据的派工信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLoading = true;
        // 模拟删除派工操作
        setTimeout(() => {
          this.selectedRows.forEach(row => {
            row.isDispatched = false;
            row.dispatchTime = '';
            row.workstation = '';
            row.team = '';
            row.technician = '';
          });
          this.$message.success('删除派工成功');
          this.deleteLoading = false;
          this.$refs.dispatchTable.clearCheckboxRow();
          this.$emit('refresh');
        }, 500);
      }).catch(() => {});
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
.m-dispatch-work-dialog {
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px!important;
  }
  .dispatch-work-content {
    .filter-section {
      margin-bottom: 15px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e8e8e8;
      .el-form {
        .el-form-item {
          &:last-child {
            margin-right: 0;
          }
        }

        .el-select,
        .el-date-editor {
          width: 180px;
        }
      }
    }
    .action-buttons {
      margin-bottom: 15px;
      display: flex;
    }
  }
}
</style>
