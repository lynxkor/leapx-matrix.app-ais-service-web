<template>
  <el-dialog
    class="m-dispatch-work-dialog"
    :title="title"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="dispatch-work-content">
      <!-- 筛选区域 -->
      <div class="filter-section" v-if="mode === 'add'">
        <el-form size="small" :model="filterForm" :inline="true" style="width:100%">
          <el-row>
            <el-col :span="6">
              <el-form-item label="工位：">
                <el-select v-model="filterForm.workstation" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="item in workstationOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="班组：">
                <el-select v-model="filterForm.team" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="item in teamOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="技师：">
                <el-select v-model="filterForm.technician" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="item in technicianOptions"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计划作业时间：">
                <el-date-picker
                  v-model="filterForm.plannedTime"
                  type="datetime"
                  :clearable="false"
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
        <el-button
          type="primary"
          size="small"
          :loading="dispatchLoading"
          :disabled="!canDispatch"
          @click="handleDispatch"
          v-if="mode === 'add'"
        >派工</el-button>
        <el-button type="danger" size="small" :disabled="!canDispatch" :loading="deleteLoading" @click="handleDeleteDispatch" v-if="mode === 'delete'">删除派工</el-button>
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
          :checkbox-config="{ checkField: 'checked', checkMethod: checkSelectable }"
          min-height="0"
          max-height="500px"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column field="repairItemCode" title="维修项目代码" width="150" />
          <vxe-column field="repairItemName" title="维修项目名称" min-width="150" show-overflow />
          <vxe-column title="工位" width="150">
            <template #default="{ row }">
              <template v-if="row.isDispatch === 1">
                {{ row.dealerStationName }}
              </template>
              <el-select v-else v-model="row.dealerStationId" size="mini" placeholder="请选择" :disabled="row.isDispatch === 1" @change="handleStationChange(row)">
                <el-option
                  v-for="item in workstationOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column title="班组" width="150">
            <template #default="{ row }">
              <template v-if="row.isDispatch === 1">
                {{ row.dealerWorkTeamName }}
              </template>
              <el-select v-else v-model="row.dealerWorkTeamId" size="mini" placeholder="请选择" :disabled="row.isDispatch === 1" @change="handleTeamChange(row)">
                <el-option
                  v-for="item in teamOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column title="维修技师" width="150">
            <template #default="{ row }">
              <template v-if="row.isDispatch === 1">
                {{ row.repairTechnicianName }}
              </template>
              <el-select v-else v-model="row.repairTechnicianId" size="mini" placeholder="请选择" :disabled="row.isDispatch === 1" @change="handleTechnicianChange(row)">
                <el-option
                  v-for="item in (row.technicianOptions || technicianOptions)"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="startAt" title="计划作业时间" width="200" align="center" >
            <template #default="{ row }">
               <el-date-picker
                  style="width:172px"
                  v-model="row.startAt"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="row.isDispatch === 1"
                />
            </template>
          </vxe-column>
          <vxe-column title="派工" width="80" align="center">
            <template #default="{ row }">
              {{ row.isDispatch === 1 ? '是' : '否' }}
            </template>
          </vxe-column>
          <vxe-column field="dispatchTime" title="派工时间" width="160" show-overflow />
        </vxe-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getRepairWorkRecord, dispatchWorkers, getDealerStation, getDealerWorkTeam, getDealerTeamUserRelation, deleteDispatchWorkers } from '@/api/maintain/sp/serviceProxy/index';
import moment from 'moment';

export default {
  name: 'DispatchWorkDialog',
  components: {
  },
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
    mode: {
      type: String,
      default: 'add'
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
      tableData: [],
      dispatchLoading: false,
      deleteLoading: false,
      tableLoading: false,
      // 筛选选项
      workstationOptions: [],
      teamOptions: [],
      technicianOptions: [],
      deleteIds: []
    };
  },
  computed: {
    canDispatch () {
      return this.selectedRows.length > 0;
    },
    title () {
      return this.mode === 'add' ? '派工' : '删除派工';
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.loadOptions();
        this.initData();
      }
    },
    'filterForm.workstation': {
      handler (val) {
        this.updateUndispatchedRows('dealerStationId', val);
        const workstation = this.workstationOptions.find(item => item.id === val);
        this.updateUndispatchedRows('dealerStationName', workstation ? workstation.name : '');
      }
    },
    'filterForm.team': {
      handler (val) {
        // 班组变化时清空技师并重新加载
        this.filterForm.technician = '';
        this.updateUndispatchedRows('dealerWorkTeamId', val);
        const team = this.teamOptions.find(item => item.id === val);
        this.updateUndispatchedRows('dealerWorkTeamName', team ? team.name : '');
        this.getTechnicianOptions();
      }
    },
    'filterForm.technician': {
      handler (val) {
        this.updateUndispatchedRows('repairTechnicianId', val);
        const technician = this.technicianOptions.find(item => item.userId === val);
        this.updateUndispatchedRows('repairTechnicianName', technician ? technician.userName : '');
      }
    },
    'filterForm.plannedTime': {
      handler (val) {
        this.updateUndispatchedRows('startAt', val);
      }
    }
  },
  methods: {
    // 根据mode控制checkbox是否可选
    // add模式：禁用已派工的行
    // delete模式：禁用未派工的行
    checkSelectable ({ row }) {
      if (this.mode === 'add') {
        return row.isDispatch !== 1;
      } else {
        return row.isDispatch === 1;
      }
    },
    updateUndispatchedRows (field, value) {
      // 更新所有未派工的行数据
      this.tableData.forEach(row => {
        if (row.isDispatch !== 1) {
          this.$set(row, field, value);
        }
      });
    },
    handleStationChange (row) {
      // 工位变化时更新工位名称
      const station = this.workstationOptions.find(item => item.id === row.dealerStationId);
      this.$set(row, 'dealerStationName', station ? station.name : '');
    },
    async handleTeamChange (row) {
      // 班组变化时更新班组名称并清空该行的技师
      const team = this.teamOptions.find(item => item.id === row.dealerWorkTeamId);
      this.$set(row, 'dealerWorkTeamName', team ? team.name : '');
      this.$set(row, 'repairTechnicianId', '');
      this.$set(row, 'repairTechnicianName', '');
      try {
        const res = await getDealerTeamUserRelation({
          teamId: row.dealerWorkTeamId
        });
        this.$set(row, 'technicianOptions', res || []);
      } catch (e) {
        console.log(e);
      }
    },
    handleTechnicianChange (row) {
      // 技师变化时更新技师名称
      const technician = row.technicianOptions.find(item => item.userId === row.repairTechnicianId);
      this.$set(row, 'repairTechnicianName', technician ? technician.userName : '');
    },
    async initData () {
      try {
        this.tableLoading = true;
        const res = await getRepairWorkRecord({ serviceProxyId: this.vehicleInfo.id });
        this.filterForm.plannedTime = moment().format('YYYY-MM-DD HH:mm:ss');
        this.tableData = res || [];
        this.tableData.forEach(row => {
          if (!row.isDispatch) {
            row.startAt = this.filterForm.qualityCheckAt;
          }
        });
        if (this.mode === 'add') {
          this.$nextTick(() => {
            this.tableData.forEach(row => {
              if (!row.isDispatch) {
                this.$refs.dispatchTable.setCheckboxRow(row, true);
                this.selectedRows.push(row);
              }
            });
          });
        } else if (this.mode === 'delete') {
          this.$nextTick(() => {
            this.tableData.forEach(row => {
              if (row.isDispatch === 1) {
                this.$refs.dispatchTable.setCheckboxRow(row, true);
                this.selectedRows.push(row);
              }
            });
          });
        }
      } catch (error) {
        console.error('获取派工数据失败', error);
        this.$message.error('获取派工数据失败');
      } finally {
        this.tableLoading = false;
      }
    },
    // 获取工位选项
    async getWorkstationOptions () {
      try {
        const res = await getDealerStation();
        this.workstationOptions = res || [];
      } catch (error) {
        console.error('获取工位数据失败', error);
      }
    },
    // 获取班组选项
    async getTeamOptions () {
      try {
        const res = await getDealerWorkTeam();
        this.teamOptions = res || [];
      } catch (error) {
        console.error('获取班组数据失败', error);
      }
    },
    // 获取技师选项
    async getTechnicianOptions () {
      try {
        const res = await getDealerTeamUserRelation({
          teamId: this.filterForm.team
        });
        this.technicianOptions = res || [];
        this.tableData.forEach(row => {
          if (row.isDispatch !== 1) {
            this.$set(row, 'technicianOptions', res || []);
          }
        });
      } catch (error) {
        console.error('获取技师数据失败', error);
      }
    },
    // 加载所有选项数据
    async loadOptions () {
      await Promise.all([
        this.getWorkstationOptions(),
        this.getTeamOptions(),
        this.getTechnicianOptions()
      ]);
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
      this.tableData = [];
      this.selectedRows = [];
    },
    handleSelectionChange ({ records }) {
      this.selectedRows = records;
    },
    async handleDispatch () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请至少选择一条数据进行派工');
        return;
      }

      // 校验是否选择工位、班组、技师
      const invalidRows = this.selectedRows.filter(row => {
        return !row.dealerStationId || (!row.dealerWorkTeamId && !row.repairTechnicianId);
      });

      if (invalidRows.length > 0) {
        if (!invalidRows[0]?.dealerStationId) {
          this.$message.warning(`维修作业:${invalidRows[0]?.repairItemName}，工位不能为空`);
        } else {
          this.$message.warning(`维修作业:${invalidRows[0]?.repairItemName}，班组、维修技师不能同时为空`);
        }
        return;
      }

      try {
        this.dispatchLoading = true;
        dispatchWorkers(this.selectedRows).then(res => {
          this.initData();
          this.$message.success('派工成功');
          this.$refs.dispatchTable.clearCheckboxRow();
          this.selectedRows = [];
          this.$emit('refresh');
          this.close();
        });
      } catch (error) {
        console.error('派工失败', error);
        this.$message.error('派工失败');
      } finally {
        this.dispatchLoading = false;
      }
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
        // 删除派工操作
        let ids = [];
        ids = this.selectedRows.map(row => {
          return row.id;
        });
        deleteDispatchWorkers(ids).then(res => {
          this.$message.success('删除派工成功');
          this.deleteLoading = false;
          this.initData();
          this.$refs.dispatchTable.clearCheckboxRow();
          this.$emit('refresh');
          this.selectedRows = [];
        }).catch(() => {
          this.$message.error('删除派工失败');
          this.deleteLoading = false;
        });
      }).catch(() => {}).finally(() => {
        this.dispatchLoading = false;
      });
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
