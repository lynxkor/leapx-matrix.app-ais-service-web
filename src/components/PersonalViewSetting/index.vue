<template>
  <el-dialog
    title="个人视图设置"
    :visible.sync="dialogVisible"
    width="760px"
    append-to-body
    :close-on-click-modal="false"
    class="m-personal-view-setting"
    @opened="onOpened"
    @closed="onClosed"
  >
    <div class="pvs">
      <!-- 视图名称(必填) -->
      <div class="pvs__block">
        <div class="pvs__label">
          <span class="pvs__required">*</span>视图名称
        </div>
        <el-input
          v-model="viewName"
          placeholder="请输入"
          size="small"
          maxlength="20"
          show-word-limit
          class="pvs__name-input"
        />
      </div>

      <!-- 自定义筛选:复用 CustomView 的条件组组件(未改动) -->
      <div class="pvs__block">
        <div class="pvs__label">自定义筛选</div>
        <div v-loading="fieldsLoading" class="pvs__filter">
          <custom-condition-group
            v-if="!fieldsLoading"
            :group="workingTree"
            :fields="fields"
            :depth="0"
            :removable="false"
            @change="onTreeChange"
          />
          <div v-else class="pvs__tip">字段元数据加载中...</div>
        </div>
      </div>

      <!-- 自定义排序:支持添加多个排序字段 -->
      <div class="pvs__block">
        <div class="pvs__label">自定义排序</div>
        <div class="pvs__sort">
          <div v-for="(item, idx) in sortList" :key="idx" class="pvs__sort-row">
            <el-select
              v-model="item.field"
              placeholder="选择排序字段"
              size="small"
              filterable
              clearable
              class="pvs__sort-field"
            >
              <el-option
                v-for="f in fields"
                :key="f.key"
                :value="f.key"
                :label="f.label"
              />
            </el-select>
            <el-radio-group v-model="item.order" size="small" :disabled="!item.field">
              <el-radio-button label="asc">升序</el-radio-button>
              <el-radio-button label="desc">降序</el-radio-button>
            </el-radio-group>
            <el-button
              type="text"
              icon="el-icon-close"
              class="pvs__sort-remove"
              @click="removeSortField(idx)"
            />
          </div>
          <el-button size="mini" icon="el-icon-plus" @click="addSortField">添加排序字段</el-button>
          <div class="pvs__tip">不选字段则按后端默认排序</div>
        </div>
      </div>

      <!-- 自定义表格:复用 design 包 optionModal 的基础设置与显示列逻辑 -->
      <div class="pvs__block option-modal-wrapper">
        <div class="pvs__label">自定义表格</div>

        <p class="modal-wrapper-header">基础设置</p>
        <el-form :model="form" label-width="100px">
          <el-form-item label="表格式标准">
            <el-radio-group v-model="form.layout">
              <el-radio
                v-for="item of LAYOUTS"
                :key="item.value"
                :label="item.value"
                name="layout"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="表格内容折行">
            <el-switch v-model="form.autoWrap" /><span>（开启后页面内容将换行显示完整）</span>
          </el-form-item>
          <el-form-item label="操作列固定">
            <el-switch v-model="form.isOperateFixed" /><span>（开启后操作列在右边固定展示）</span>
          </el-form-item>
        </el-form>

        <p class="modal-wrapper-header">自定义显示示例<em>下方表头字段会按照从左往右，从上往下的排序逻辑排布</em></p>
        <div class="modal-wrapper-search">
          <el-input
            v-model="colLabel"
            size="mini"
            clearable
            prefix-icon="el-icon-search"
            placeholder="搜索列名称"
          />
        </div>
        <div class="m-multi-cols">
          <span>批量控制</span>
          <el-checkbox v-model="checkAll" :indeterminate="isCheckIndeterminate" @change="handleCheckAllChange">全部显示</el-checkbox>
          <el-checkbox v-model="notCheckAll" :indeterminate="isNoCheckIndeterminate" @change="handlenotCheckAllChange">全部隐藏</el-checkbox>
        </div>
        <div class="m-cols">
          <el-checkbox-group v-model="checkedCols" @change="handleCheckedColsChange">
            <div ref="grid" class="grid-container">
              <div v-for="col in filteredCols" :key="col.props" class="grid-item">
                <svg class="icon u-move-icon" aria-hidden="true">
                  <use xlink:href="#icon-leapmotor-design-move"></use>
                </svg><el-checkbox :key="col.props" :label="col.props" :disabled="col.disabled">{{ col.label }}</el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>

      <!-- 校验提示 -->
      <el-alert
        v-if="errorSummary.length > 0"
        :title="errorSummary.join('；')"
        type="error"
        :closable="false"
        class="pvs__alert"
      />
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="onClose">取消</el-button>
        <el-button size="small" type="primary" :loading="applying" @click="onSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
/**
 * 个人视图设置 —— 「表格设置」与「自定义条件查询」合并为一个弹窗。
 *
 * 复用方式(两个来源组件的源码零改动):
 *   1. mixins 继承 @leapmotor/design 的 optionModal.vue —— 拿到表格设置的全部逻辑:
 *      form(autoWrap/layout/columnConfig/isOperateFixed)、checkedCols、checkAll/notCheckAll、
 *      filteredCols、init、initSortable、updateCheck、handleCheckedColsChange、
 *      handleCheckAllChange、handlenotCheckAllChange、LAYOUTS;
 *      同时沿用其 .option-modal-wrapper 全局样式(基础设置/显示列/批量控制的样式完全一致)。
 *   2. mixins 继承 @/libs 的 CustomQueryDialog.vue —— 拿到视图侧的全部逻辑:
 *      workingTree/workingSort/viewName/errorSummary/fieldsMeta、fetchFields、loadPresetDetail、
 *      buildAndSave、validateTree、validateSort、onTreeChange;
 *      条件树 UI 仍由 CustomConditionGroup 组件渲染,未做任何改动。
 *
 * 本组件只负责「把两者拼进同一个弹窗」:模板重排为 视图名称 / 自定义筛选 / 自定义排序 / 自定义表格
 * 四个区块,并新增多字段排序(添加排序字段)与统一的保存出口(save 事件)。
 */
import OptionModal from '@leapmotor/design/packages/table/optionModal.vue';
import CustomQueryDialog from '@/libs/components/CustomView/CustomQueryDialog.vue';

export default {
  name: 'PersonalViewSetting',
  mixins: [OptionModal, CustomQueryDialog],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 视图业务键:CustomQueryDialog 加载字段元数据与保存视图都需要
    bizKey: {
      type: String,
      required: true
    },
    // 表格列配置(含 columnConfig / autoWrap / layout / isOperateFixed)。
    // optionModal 的 init() 依赖该 prop,这里覆盖其默认值,保证未传时也不报错。
    config: {
      type: Object,
      default: () => ({
        autoWrap: false,
        layout: 3,
        columnConfig: [],
        isOperateFixed: true
      })
    }
  },
  data () {
    return {
      // 弹窗显隐(optionModal 与 CustomQueryDialog 都有同名 data,此处显式声明以确定语义)
      dialogVisible: this.visible,
      // 多字段排序项
      sortList: []
    };
  },
  watch: {
    /**
     * 打开时初始化。
     *
     * CustomQueryDialog 的 visible watch 只在「false → true」变化时触发,
     * 若宿主初始就把 visible 置为 true,字段元数据与条件树不会被初始化。
     * 这里用 immediate 补上初始即打开的分支,内部全部调用继承来的方法,不复制逻辑。
     */
    visible: {
      immediate: true,
      handler (val, oldVal) {
        this.dialogVisible = val;
        if (!val) return;
        if (oldVal === undefined) {
          // 初始即打开:走一遍与 CustomQueryDialog 相同的初始化
          this.workingTree = this.makeInitialTree();
          this.workingSort = this.makeInitialSort();
          this.errorSummary = [];
          this.viewName = '';
          this.currentPresetId = this.activePresetId || null;
          this.fetchFields();
          if (this.currentPresetId) {
            this.loadPresetDetail(this.currentPresetId);
          }
        }
        // 每次打开重置排序项,随后由 workingSort 的 watch 回填
        this.sortList = [];
      }
    },
    // 表格配置变化时,复用 optionModal 的 init() 重新初始化表格设置区
    config () {
      this.init();
    },
    // 视图详情回填(继承自 CustomQueryDialog 的 loadPresetDetail)后同步排序项
    workingSort: {
      deep: true,
      handler () {
        this.syncSortListFromWorking();
      }
    },
    // 排序项变化时回写继承的 workingSort,使 validateSort / buildAndSave 继续可用
    sortList: {
      deep: true,
      handler () {
        this.syncWorkingFromSortList();
      }
    }
  },
  created () {
    // mixins 的 created 先执行(CustomQueryDialog 用 props.sort 初始化 workingSort),
    // 此处把已有排序同步成多行展示
    this.syncSortListFromWorking();
  },
  methods: {
    /**
     * workingSort → sortList。
     * 仅当 sortList 为空时回填,避免用户手动调整后被覆盖。
     */
    syncSortListFromWorking () {
      if (this.sortList.length > 0) return;
      if (this.workingSort && this.workingSort.field) {
        this.sortList = [{ field: this.workingSort.field, order: this.workingSort.order }];
      }
    },
    /**
     * sortList → workingSort。
     * 后端 addOrUpdate 只接受单字段排序(sortField/sortOrder),
     * 故以第一项为准回写,完整的多字段列表随 save 事件一并抛出。
     */
    syncWorkingFromSortList () {
      const first = this.sortList[0];
      const next = first
        ? { field: first.field, order: first.order }
        : { field: null, order: null };
      if (!this.workingSort ||
        this.workingSort.field !== next.field ||
        this.workingSort.order !== next.order) {
        this.workingSort = next;
      }
    },
    addSortField () {
      this.sortList.push({ field: null, order: null });
    },
    removeSortField (idx) {
      this.sortList.splice(idx, 1);
    },
    /**
     * 校验排序项:字段必填 + 已选字段必须选顺序。
     * 继承的 validateSort 只覆盖 workingSort(第一项),多字段场景在此补充。
     */
    validateSortList () {
      const summary = [];
      this.sortList.forEach((item, idx) => {
        if (!item.field) {
          summary.push(`排序第 ${idx + 1} 行:请选择字段`);
        } else if (!item.order) {
          summary.push(`排序第 ${idx + 1} 行:请选择顺序`);
        }
      });
      return summary;
    },
    /**
     * 保存入口:在 CustomQueryDialog 原生保存流程(校验 → 存视图 → 性能测试 → 关闭)
     * 之上补两件事 —— 多字段排序校验,以及把表格设置区一并交出去落库。
     *
     * 视图侧全部复用继承来的方法:validateTree / validateSort / buildAndSave / onRunPerfTest。
     */
    async onSave () {
      if (this.applying) return;
      const extra = this.validateSortList();
      if (extra.length > 0) {
        this.errorSummary = extra;
        return;
      }
      await this.onApply();
    },
    /**
     * 覆盖 CustomQueryDialog 的 onApply:在其原有流程中插入「表格设置」落库出口。
     */
    async onApply () {
      if (this.applying || this.perfTesting) return;
      const name = (this.viewName || '').trim();
      // 复用继承的 validateTree / validateSort
      const summary = [];
      if (!name) summary.push('请输入视图名称');
      summary.push(...this.validateTree(this.workingTree).summary);
      summary.push(...this.validateSort().summary);
      if (summary.length > 0) {
        this.errorSummary = summary;
        return;
      }
      this.errorSummary = [];
      this.applying = true;
      try {
        // 复用继承的 buildAndSave(视图名 + 条件树 + 排序)
        const newId = await this.buildAndSave(this.currentPresetId, name);
        if (!newId) {
          this.$message.error('保存视图失败');
          return;
        }
        this.currentPresetId = newId;
        // 表格设置区(optionModal 的 form)一并交出,由宿主页面落库
        this.$emit('save', {
          id: newId,
          viewName: name,
          conditionTree: this.workingTree,
          sortFields: this.sortList.map(item => ({
            column: item.field,
            sort: item.order ? item.order.toUpperCase() : ''
          })),
          tableConfig: this.form
        });
        // 复用继承的 onRunPerfTest(视图需通过性能测试方可使用)
        const passed = await this.onRunPerfTest();
        // 性能测试未通过:弹窗保持打开便于修改条件,不触发页面刷新
        if (!passed) return;
        this.$emit('update:active-preset-id', newId);
        this.$emit('update:visible', false);
      } finally {
        this.applying = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-personal-view-setting {
  ::v-deep .el-dialog__body {
    max-height: calc(100vh - 160px);
    overflow-y: auto;
  }
}
.pvs {
  &__block {
    padding: 14px 0;
    border-bottom: 1px solid #ebeef5;
    &:last-of-type {
      border-bottom: none;
    }
  }
  &__label {
    font-weight: 600;
    color: #606266;
    font-size: 14px;
    margin-bottom: 12px;
  }
  &__required {
    color: #f56c6c;
    margin-right: 2px;
  }
  &__name-input {
    width: 280px;
  }
  &__filter {
    min-height: 60px;
  }
  &__tip {
    color: #909399;
    font-size: 12px;
    margin-top: 6px;
  }
  &__sort {
    &-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    &-field {
      width: 240px;
    }
    &-remove {
      color: #c0c4cc;
      padding: 4px;
    }
  }
  &__alert {
    margin-top: 12px;
  }
}
.dialog-footer {
  text-align: right;
}
</style>
