<template>
  <el-dialog
    class="m-final-check-dialog"
    title="终检"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="final-check-content">
      <!-- 进度条 -->
      <div class="step-progress">
        <div
          v-for="(step, index) in mainTabs"
          :key="index"
          :class="['step-item', { active: currentMainTab === index, completed: index < currentMainTab }]"
        >
          <div class="step-number"></div>
          <div class="step-label">{{ step }}</div>
          <div v-if="index < mainTabs.length - 1" class="step-line" :class="{ completed: index < currentMainTab }"></div>
        </div>
      </div>

      <!-- 子 Tab 导航 -->
      <el-tabs v-model="currentSubTab" class="sub-tabs">
        <el-tab-pane
          v-for="(tab, index) in subTabs"
          :key="index"
          :label="tab"
          :name="index.toString()"
        >
        </el-tab-pane>
      </el-tabs>

      <!-- 维修项目 Tab 内容 -->
      <div v-show="currentSubTab === '0'">
        <!-- 筛选表单 -->
        <div class="filter-section">
          <el-form size="small" :model="filterForm" label-width="80px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="质检时间">
                  <el-date-picker
                    v-model="filterForm.qualityCheckAt"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :clearable="false"
                    style="width: 100%;"
                    @change="handleQualityCheckAtChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="质检人">
                  <fetch-select
                    v-model="filterForm.qualityCheckerId"
                    :remote-method="searchUser"
                    value-key="userId"
                    label-key="username"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请选择质检人"
                    style="width: 100%;"
                    @change="handleQualityCheckerChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="终检时间">
                  <el-date-picker
                    v-model="filterForm.finalCheckTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;"
                    @change="handleFinalCheckTimeChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="终检人">
                  <fetch-select
                    v-model="filterForm.finalChecker"
                    :remote-method="searchUser"
                    value-key="userId"
                    label-key="username"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="请选择终检人"
                    style="width: 100%;"
                    @change="handleFinalCheckerChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <!-- 数据表格 -->
        <div class="table-section">
          <vxe-table
            ref="workTable"
            :data="tableData"
            stripe
            show-overflow
            :row-config="{ isHover: true }"
            resizable
            border="inner"
            size="medium"
          >
            <vxe-column type="seq" title="序号" width="70" align="center" />
            <vxe-column field="qualityCheckAt" title="质检时间" width="180" />
            <vxe-column field="qualityCheckerName" title="质检人" width="120" />
            <vxe-column field="repairItemCode" title="维修项目代码" width="150" />
            <vxe-column field="repairItemName" title="维修项目名称" min-width="150" show-overflow />
            <vxe-column field="dealerStationName" title="工位" width="120" />
            <vxe-column field="dealerWorkTeamName" title="班组" width="140" />
            <vxe-column field="repairTechnicianName" title="维修技师" width="120" />
            <vxe-column title="操作" width="120" align="center" fixed="right" :resizable="false">
              <template #default="{ row }">
                <el-popconfirm
                  title="确定质检吗？"
                  @confirm="handleQualityCheck(row)"
                  :disabled="row.qualityCheckStatus === 30"
                >
                  <span
                    :class="['action-button', 'btn-back', { disabled: row.qualityCheckStatus === 30 }]"
                    slot="reference"
                    type="text">
                    质检
                  </span>
                </el-popconfirm>
                <el-popconfirm
                  title="确定返修吗？"
                  @confirm="handleRepair(row)"
                  :disabled="row.qualityCheckStatus !== 30"
                >
                  <span
                    :class="['action-button', 'btn-back', { disabled: row.qualityCheckStatus !== 30 }]"
                    slot="reference"
                    type="text">
                    返修
                  </span>
                </el-popconfirm>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>

      <!-- 故障模块 Tab 内容 -->
      <div v-show="currentSubTab === '1'" class="fault-module-content">
        <!-- 故障存在询问 -->
        <div class="fault-existence-section">
          <div>
            <span class="fault-label">本次进店是否存在故障</span>
            <el-radio-group v-model="faultForm.faultFlag" @change="handleFaultExistenceChange">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <div v-if="faultForm.faultFlag === 1" class="search-section">
            <el-input
              v-model="faultForm.searchKeyword"
              placeholder="请输入VRT/VFG/CCC模糊搜索"
              clearable
              size="small"
              @clear="handleFaultSearch"
              @keyup.enter.native="handleFaultSearch"
            >
              <i slot="append" class="el-icon-search" @click="handleFaultSearch"></i>
            </el-input>
          </div>
        </div>

        <!-- 搜索区域 -->

        <!-- 故障模块表格 -->
        <div v-if="faultForm.faultFlag === 1" class="table-section">
          <vxe-table
            ref="faultTable"
            :data="faultTableData"
            stripe
            show-overflow
            :row-config="{ isHover: true }"
            resizable
            border="inner"
            size="medium"
          >
            <vxe-column type="seq" title="序号" width="70" align="center" />
            <vxe-column field="vrtName" title="VRT名称" min-width="150" show-overflow />
            <vxe-column field="vfgName" title="VFG名称" min-width="150" show-overflow />
            <vxe-column field="cccName" title="CCC名称" min-width="150" show-overflow />
            <vxe-column field="alertModule" title="是否提醒模块" width="120" align="center">
              <template #default="{ row }">
                <span>{{ row.alertModule === 1 ? '是' : '否' }}</span>
              </template>
            </vxe-column>
            <vxe-column field="currentSituationText" title="本次进店情况(周期内)" min-width="180" show-overflow />
            <vxe-column field="faultAlert" title="故障提醒内容" min-width="250" show-overflow />
            <vxe-column title="操作" width="100" align="center" fixed="right" :resizable="false">
              <template #default="{ row }">
                <el-popconfirm
                  title="确定删除此故障吗？"
                  @confirm="handleDeleteFault(row)"
                >
                  <span
                    class="action-button btn-delete"
                    slot="reference"
                    type="text">
                    删除故障
                  </span>
                </el-popconfirm>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>

       <!-- 电池信息 Tab 内容 -->
      <div v-show="currentSubTab === '2'">
        <!-- 电池信息 -->
        <el-form :inline="true" :rules="rules" :model="formInline" class="battert-form" size="small" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="电池去向单位：" prop="batteryUnitId">
                <fetch-select
                  v-model="formInline.batteryUnitId"
                  :remote-method="searchBatteryUnit"
                  value-key="id"
                  label-key="name"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请选择电池去向单位"
                  style="width: 280px;"
                  @change="handleBatteryUnitChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="去向单位统一代码：" prop="targetUnitCode">
                <el-input v-model="formInline.targetUnitCode" placeholder="请填写去向单位统一代码" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="更换前编号：" prop="beforeChangeCode">
                <el-input v-model="formInline.beforeChangeCode" placeholder="请填写电池更换前编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更换前编号：" prop="afterChangeCode">
                <el-input v-model="formInline.afterChangeCode" placeholder="请填写电池更换后编号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 追溯信息 Tab 内容 -->
      <div v-show="currentSubTab === '3'">
        <vxe-table
          ref="traceTable"
          :data="partsTraceRecordResps"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          border="inner"
          size="medium"
        >
          <vxe-column type="seq" title="序号" width="70" align="center" />
          <vxe-column field="id" title="追溯编码" min-width="150" show-overflow />
          <vxe-column field="partsCode" title="零件代码" min-width="150" show-overflow />
          <vxe-column field="partsName" title="零件名称" min-width="150" show-overflow />
          <vxe-column field="targetUnitName" title="去向单位" width="200" align="center">
            <template #default="{ row }">
              <fetch-select
                v-model="row.targetUnitName"
                :remote-method="searchBatteryUnit"
                value-key="id"
                label-key="name"
                filterable
                remote
                clearable
                reserve-keyword
                size="small"
                placeholder="请选择"
                @change="handleBatteryUnitChange"
              />
            </template>
          </vxe-column>
          <vxe-column field="beforeChangeCode" title="更换前编码" min-width="200" show-overflow >
            <template #default="{ row }">
              <el-input v-model="row.beforeChangeCode" size="small"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="afterChangeCode" title="更换前编码" min-width="200" show-overflow >
            <template #default="{ row }">
              <el-input v-model="row.afterChangeCode" size="small"></el-input>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit">终检</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getFinalInspectionDetail, finalInspection, qualityInspection, repaired } from '@/api/maintain/sp/serviceProxy/index';
import { getUserByNameOrNo } from '@/libs/api/common';
import { getListData } from '@/api/maintain/basic/batteryUnit/index';
import FetchSelect from '@/libs/components/FetchSelect';
import moment from 'moment';
export default {
  name: 'FinalCheckDialog',
  components: {
    FetchSelect
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
    }
  },
  data () {

    return {
      dialogVisible: this.visible,
      submitLoading: false,
      loading: false,
      // 主 Tab
      mainTabs: ['质检', '故障模块确认', '电池信息确认', '追溯信息确认', '终检'],
      currentMainTab: 1,
      // 子 Tab
      subTabs: ['维修项目', '故障模块', '电池信息', '追溯信息'],
      currentSubTab: '0',
      // 筛选表单
      filterForm: {
        qualityCheckAt: '',
        qualityCheckerId: '',
        qualityCheckerName: '',
        finalCheckTime: '',
        finalChecker: '',
        finalCheckerName: ''
      },
      formInline: {
        batteryUnitId: '',
        batteryUnitName: '',
        targetUnitCode: '',
        beforeChangeCode: '',
        afterChangeCode: '',
        faultFlag: ''
      },
      rules: {
        batteryUnitId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        beforeChangeCode: [
          { required: true, message: '请填写电池更换前编号', trigger: 'change' }
        ],
        afterChangeCode: [
          { required: true, message: '请填写电池更换后编号', trigger: 'change' }
        ]
      },
      // 表格数据
      tableData: [],
      // 故障模块表单
      faultForm: {
        faultFlag: 1,
        searchKeyword: ''
      },
      // 故障模块表格数据
      faultTableData: [],
      // 追溯信息表格数据
      partsTraceRecordResps: [],
      // 记录ID
      recordId: ''
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
    async initData () {
      this.loading = true;
      try {
        const res = await getFinalInspectionDetail(this.vehicleInfo.id);
        if (res) {
          this.recordId = res.id || '';
          // 设置维修项目数据
          this.tableData = res.repairWorkRecordResps || [];
          // 设置故障模块数据
          this.faultTableData = res.faultAlertRecordResps || [];
          this.filterForm.qualityCheckAt= moment().format('YYYY-MM-DD HH:mm:ss');
          this.tableData.forEach(row => {
            if (row.qualityCheckStatus === 10) { // 假设10表示未质检状态
              row.qualityCheckAt = this.filterForm.qualityCheckAt;
            }
          });
          // 设置故障标志
          this.faultForm.faultFlag = res.faultFlag !== undefined ? res.faultFlag : 1;
          // 设置电池信息
          this.formInline = {
            batteryUnitId: res.batteryUnitId || '',
            batteryUnitName: res.batteryUnitName || '',
            targetUnitCode: res.targetUnitCode || '',
            beforeChangeCode: res.beforeChangeCode || '',
            afterChangeCode: res.afterChangeCode || '',
            faultFlag: res.faultFlag || ''
          };
          // 设置质检人和终检人信息(用于反显)
          // this.filterForm = {
          //   qualityCheckAt: '',
          //   qualityCheckerId: res.qualityCheckerId || '',
          //   qualityCheckerName: res.qualityCheckerName || '',
          //   finalCheckTime: this.formatDate(new Date()),
          //   finalCheckerId: '',
          //   finalCheckerName: ''
          // };
          // 设置追溯信息
          this.partsTraceRecordResps = res.partsTraceRecordResps || [];
        }
      } catch (error) {
        console.error('获取终检详情失败', error);
        this.$message.error('获取数据失败');
      } finally {
        this.loading = false;
      }
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.filterForm = {
        qualityCheckAt: '',
        qualityCheckerId: '',
        qualityCheckerName: '',
        finalCheckTime: '',
        finalChecker: '',
        finalCheckerName: ''
      };
      this.currentSubTab = '0';
      this.faultForm = {
        faultFlag: 1,
        searchKeyword: ''
      };
      this.formInline = {
        batteryUnitId: '',
        batteryUnitName: '',
        targetUnitCode: '',
        beforeChangeCode: '',
        afterChangeCode: '',
        faultFlag: ''
      };
      this.tableData = [];
      this.faultTableData = [];
      this.partsTraceRecordResps = [];
      this.recordId = '';
    },
    // 质检时间变更 - 同步更新未质检表格数据
    handleQualityCheckAtChange (val) {
      this.tableData.forEach(row => {
        // 只更新未质检的数据
        if (row.qualityCheckStatus === 10) {
          row.qualityCheckAt = val;
        }
      });
    },
    // 终检时间变更 - 同步更新未质检表格数据
    handleFinalCheckTimeChange (val) {
      this.tableData.forEach(row => {
        // 只更新未质检的数据
        if (row.qualityCheckStatus === 10) {
          row.finalCheckTime = val;
        }
      });
    },
    handleQualityCheck (row) {
      if (row.qualityCheckStatus === 30) {
        this.$message.warning('已质检完成');
        return;
      }
      if (!this.filterForm.qualityCheckAt) {
        this.$message.warning('请选择质检时间');
        return;
      }

      if (!this.filterForm.qualityCheckerId) {
        this.$message.warning('请选择质检人');
        return;
      }
      // 将质检时间和质检人设置到row对象中
      row.qualityCheckAt = this.filterForm.qualityCheckAt;
      row.qualityCheckerId = this.filterForm.qualityCheckerId;
      row.qualityCheckerName = this.filterForm.qualityCheckerName;
      qualityInspection(row).then(res => {
        this.$message({
          type: 'success',
          message: '质检完成'
        });
        this.initData();
      });
    },
    handleRepair (row) {
      repaired(row).then(res => {
        this.$message({
          type: 'success',
          message: '返修完成'
        });
        this.initData();
      });
    },
    // 质检人变更 - 同步更新未质检表格数据
    handleQualityCheckerChange (val, record) {
      if (record) {
        this.filterForm.qualityCheckerName = record.username;
        this.filterForm.qualityCheckerId = record.userId;
        // 同步更新表格中未质检的质检人信息
        this.tableData.forEach(row => {
          if (row.qualityCheckStatus === 10) {
            row.qualityCheckerId = record.userId;
            row.qualityCheckerName = record.username;
          }
        });
      }
    },
    // 终检人变更 - 同步更新未质检表格数据
    handleFinalCheckerChange (val, record) {
      if (record) {
        this.filterForm.finalCheckerName = record.username;
        this.filterForm.finalChecker = record.userId;
        // 同步更新表格中未质检的终检人信息
        this.tableData.forEach(row => {
          if (row.qualityCheckStatus === 10) {
            row.finalChecker = record.userId;
            row.finalCheckerName = record.username;
          }
        });
      }
    },
    // 电池去向单位变更
    handleBatteryUnitChange (val, record) {
      if (record) {
        this.formInline.batteryUnitName = record.name;
        this.formInline.targetUnitCode = record.unifiedSocialCreditCode || '';
      }
    },
    // 搜索用户(质检人/终检人)
    async searchUser (query) {
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res || [];
      } catch (error) {
        console.error('搜索用户失败', error);
        return [];
      }
    },
    // 搜索电池去向单位
    async searchBatteryUnit (query) {
      try {
        const res = await getListData({ name: query });
        return res || [];
      } catch (error) {
        console.error('搜索电池去向单位失败', error);
        return [];
      }
    },
    // 故障模块相关方法
    handleFaultExistenceChange (val) {
      console.log('故障存在状态变更', val);
      if (val === 0) {
        // 如果选择不存在故障，清空故障列表
        this.faultTableData = [];
      }
    },
    handleFaultSearch () {
      console.log('搜索故障', this.faultForm.searchKeyword);
      this.$message.info('搜索功能开发中');
    },
    handleDeleteFault (row) {
      console.log('删除故障', row);
      const index = this.faultTableData.findIndex(item => item.id === row.id);
      if (index > -1) {
        this.faultTableData.splice(index, 1);
        this.$message.success('删除成功');
      }
    },
    async submit () {
      this.submitLoading = true;
      try {
        // 组装提交数据
        const submitData = {
          id: this.recordId,
          repairWorkRecordResps: this.tableData,
          faultAlertRecordResps: this.faultTableData,
          partsTraceRecordResps: this.partsTraceRecordResps,
          batteryUnitId: this.formInline.batteryUnitId,
          targetUnitCode: this.formInline.targetUnitCode,
          beforeChangeCode: this.formInline.beforeChangeCode,
          afterChangeCode: this.formInline.afterChangeCode,
          faultFlag: this.faultForm.faultFlag,
          finalCheckAt: this.filterForm.finalCheckTime,
          finalChecker: this.filterForm.finalChecker
        };

        const res = await finalInspection(submitData);
        if (res) {
          this.$message.success('终检成功');
          this.$emit('refresh');
          this.close();
        }
      } catch (error) {
        console.error('终检提交失败', error);
        this.$message.error('终检失败');
      } finally {
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-final-check-dialog {
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }

  .final-check-content {
    // 进度条样式
    .step-progress {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      background-color: var(--leap-color-default-light-5);
      border-radius: 4px;
      padding: 6px 20px;
      .step-item {
        display: flex;
        align-items: center;
        flex: 1;
        position: relative;
        &:last-child {
          flex: none;
        }

        .step-number {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          z-index: 1;
          flex-shrink: 0;
          border: 1px solid var(--leap-color-default-light-1);
          // background-color: var(--leap-color-default-light-1);
        }

        .step-label {
          margin-left: 8px;
          color: var(--leap-color-default-light-1);
          font-size: 14px;
          white-space: nowrap;
        }

        .step-line {
          flex: 1;
          height: 2px;
          background-color: #e8e8e8;
          margin-left: 8px;
          margin-right: 8px;

          // &.completed {
          //   background-color: var(--leap-color-primary);
          // }
        }

        // &.active {
        //   .step-number {
        //     border: 1px solid var(--leap-color-primary);
        //     color: #fff;
        //   }

        //   .step-label {
        //     color: var(--leap-color-primary);
        //     font-weight: 500;
        //   }
        // }

        // &.completed {
        //   .step-number {
        //     border: 1px solid var(--leap-color-primary);
        //     color: #fff;
        //   }

        //   .step-label {
        //     color: var(--leap-color-primary);
        //   }
        // }
      }
    }

    // 子 Tab 样式
    .sub-tabs {
      margin-bottom: 12px;

      ::v-deep .el-tabs__header {
        margin-bottom: 0;
      }

      ::v-deep .el-tabs__item {
        color: var(--leap-color-default);

        &.is-active {
          color: var(--leap-color-primary);
        }
      }

      ::v-deep .el-tabs__active-bar {
        background-color: var(--leap-color-primary);
      }
    }

    // 故障模块内容样式
    .fault-module-content {
      .fault-existence-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        height: 32px;

        .fault-label {
          margin-right: 20px;
          font-size: 14px;
          color: var(--leap-color-default);
        }
        .el-icon-search{
          cursor: pointer;
        }
      }
    }
  }

  .battert-form {
    margin-top: 16px;
    .el-select,.el-input {
      width: 280px;
    }
  }

  .btn-back {
    color: var(--leap-color-link);
    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .btn-delete {
    color: var(--leap-color-danger);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: var(--leap-color-danger-dark-1);
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
