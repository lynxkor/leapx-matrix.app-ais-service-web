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

      <!-- 筛选表单 -->
      <div class="filter-section">
        <el-form size="small" :model="filterForm" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="质检时间">
                <el-date-picker
                  v-model="filterForm.qualityCheckTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="质检人">
                <el-select v-model="filterForm.qualityChecker" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in qualityCheckerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终检人">
                <el-select v-model="filterForm.finalChecker" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in finalCheckerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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
          <vxe-column field="qualityCheckTime" title="质检时间" width="180" />
          <vxe-column field="qualityChecker" title="质检人" width="120" />
          <vxe-column field="itemCode" title="维修项目代码" width="150" />
          <vxe-column field="itemName" title="维修项目名称" min-width="150" show-overflow />
          <vxe-column field="workstation" title="工位" width="120" />
          <vxe-column field="team" title="班组" width="140" />
          <vxe-column field="technician" title="维修技师" width="120" />
          <vxe-column title="操作" width="120" align="center" fixed="right" :resizable="false">
            <template #default="{ row }">
              <el-popconfirm
                title="确定质检吗？"
                @confirm="handleQualityCheck(row, rowIndex)"
              >
                <span
                  class="action-button btn-back"
                  slot="reference"
                  type="text">
                  质检
                </span>
              </el-popconfirm>
              <el-popconfirm
                title="确定返修吗？"
                @confirm="handleRepair(row, rowIndex)"
              >
                <span
                  class="action-button btn-back"
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

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" :loading="submitLoading" type="primary" @click="submit">终检</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'FinalCheckDialog',
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
      // 主 Tab
      mainTabs: ['质检', '故障模块确认', '电池信息确认', '追溯信息确认', '终检'],
      currentMainTab: 1,
      // 子 Tab
      subTabs: ['维修项目', '故障模块', '电池信息', '追溯信息'],
      currentSubTab: '0',
      // 筛选表单
      filterForm: {
        qualityCheckTime: '',
        qualityChecker: '',
        finalCheckTime: '',
        finalChecker: ''
      },
      // 质检人选项
      qualityCheckerOptions: [
        { label: '刘榕汕', value: '刘榕汕' },
        { label: '岑润丽', value: '岑润丽' },
        { label: '张三', value: '张三' },
        { label: '李四', value: '李四' }
      ],
      // 终检人选项
      finalCheckerOptions: [
        { label: '刘榕汕', value: '刘榕汕' },
        { label: '岑润丽', value: '岑润丽' },
        { label: '张三', value: '张三' },
        { label: '李四', value: '李四' }
      ],
      // 表格数据
      tableData: [
        {
          id: 1,
          qualityCheckTime: '2025-11-25 13:35:28',
          qualityChecker: '刘榕汕',
          itemCode: '999999',
          itemName: '万能工时',
          workstation: '零跑机电',
          team: '机电罗海民',
          technician: '2323'
        },
        {
          id: 2,
          qualityCheckTime: '2025-11-25 13:35:28',
          qualityChecker: '岑润丽',
          itemCode: '9217839293',
          itemName: '更换风道上部',
          workstation: '零跑机电',
          team: '机电罗海民',
          technician: '罗海民'
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
      console.log('初始化终检数据', this.info);
      // 设置默认终检时间为当前时间
      this.filterForm.finalCheckTime = this.formatDate(new Date());
    },
    close () {
      this.$emit('update:visible', false);
    },
    closed () {
      this.filterForm = {
        qualityCheckTime: '',
        qualityChecker: '',
        finalCheckTime: '',
        finalChecker: ''
      };
      // this.currentMainTab = 4;
      this.currentSubTab = '0';
    },
    handleMainTabChange (index) {
      this.currentMainTab = index;
    },
    handleQualityCheck (row) {
      console.log('质检', row);
      this.$message.info('质检操作');
    },
    handleRepair (row) {
      console.log('返修', row);
      this.$message.info('返修操作');
    },
    submit () {
      this.submitLoading = true;
      setTimeout(() => {
        this.$message.success('终检成功');
        this.$emit('refresh');
        this.close();
        this.submitLoading = false;
      }, 500);
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

          &.completed {
            background-color: var(--leap-color-primary);
          }
        }

        &.active {
          .step-number {
            border: 1px solid var(--leap-color-primary);
            color: #fff;
          }

          .step-label {
            color: var(--leap-color-primary);
            font-weight: 500;
          }
        }

        &.completed {
          .step-number {
            border: 1px solid var(--leap-color-primary);
            color: #fff;
          }

          .step-label {
            color: var(--leap-color-primary);
          }
        }
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
  }

  .btn-back {
    color: var(--leap-color-link);
    cursor: pointer;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
