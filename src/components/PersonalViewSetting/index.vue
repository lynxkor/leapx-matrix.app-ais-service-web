<template>
  <!--
    个人视图设置(容器)。

    结构:
      上半 —— 引用原「自定义条件查询」组件(CustomQueryBlock:继承 CustomQueryDialog 的全部逻辑,
              仅把弹窗外壳替换为行内容块,原组件自带的「取消 / 保存」因此不再出现);
      下半 —— 引用「自定义表格」组件(TableSetting:表格设置功能已复制到本项目内);
      右下 —— 统一的「取消 / 保存」按钮(取消关闭弹框)。
  -->
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
      <!-- 上半:原个人视图配置(视图名称 + 自定义筛选) -->
      <custom-query-block
        ref="queryBlock"
        :biz-key="bizKey"
        :active-preset-id="activePresetId"
        :hide-sort="true"
      />

      <!-- 自定义排序:多字段,支持添加 / 删除 / 拖拽调整次序 -->
      <div class="pvs__block">
        <div class="pvs__label">自定义排序</div>
        <div class="pvs__sort">
          <div ref="sortListRef" class="pvs__sort-list">
            <div
              v-for="(item, idx) in sortList"
              :key="idx"
              class="pvs__sort-row"
            >
              <i class="el-icon-rank pvs__sort-handle" title="拖动调整次序" />
              <el-select
                v-model="item.field"
                placeholder="选择排序字段"
                size="small"
                filterable
                clearable
                class="pvs__sort-field"
              >
                <el-option
                  v-for="f in sortableFields(item)"
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
          </div>
          <el-button size="mini" icon="el-icon-plus" @click="addSortField">
            添加排序字段<template v-if="sortList.length">（{{ sortList.length }}）</template>
          </el-button>
          <div class="pvs__tip">不选字段则按后端默认排序;次序靠前的字段优先排序</div>
        </div>
      </div>

      <!-- 下半:自定义表格 -->
      <div class="pvs__block">
        <div class="pvs__label">自定义表格</div>
        <table-setting
          ref="tableSetting"
          :config="tableConfig"
          :show-base-settings="showBaseSettings"
        />
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
        <el-button size="small" :disabled="applying" @click="onClose">取消</el-button>
        <el-button size="small" type="primary" :loading="applying" @click="onSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
/**
 * 个人视图设置 —— 「自定义条件查询」与「表格设置」合并为一个弹窗。
 *
 * 组件组织(本组件只做「容器」,不重复实现子组件的逻辑):
 *   1. 上半 <custom-query-block>:extends 继承 @/libs 的 CustomQueryDialog.vue,
 *      拿到全部视图侧逻辑(字段元数据 / 条件树 / 视图名 / 校验 / 保存),
 *      并把其 el-dialog 局部覆盖为行内容块 —— 原组件自带的「取消 / 保存」按钮不再出现。
 *   2. 下半 <table-setting>:design 包的 optionModal.vue 在 node_modules 里无法加参数,
 *      故把「表格设置」功能复制到本项目内(见 TableSetting.vue),去掉弹窗外壳与自带 footer。
 *   3. 右下角统一「取消 / 保存」,取消关闭弹框。
 */
import Sortable from 'sortablejs';
import CustomQueryBlock from './CustomQueryBlock.vue';
import TableSetting from './TableSetting.vue';
import { getTableConfig, tableAddOrUpdate } from '@/api/common';
import { viewTableConfigCode } from './localView';

export default {
  name: 'PersonalViewSetting',
  components: { CustomQueryBlock, TableSetting },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 视图业务键:加载字段元数据与保存视图都需要
    bizKey: {
      type: String,
      required: true
    },
    // 编辑既有视图时传入其 id(新增时传 null)
    activePresetId: {
      type: String,
      default: null
    },
    // 表格列配置(含 columnConfig / autoWrap / layout / isOperateFixed)
    config: {
      type: Object,
      default: () => ({
        autoWrap: false,
        layout: 3,
        columnConfig: [],
        isOperateFixed: true
      })
    },
    /**
     * 是否跳过「性能测试」。
     *
     * 性能测试是针对列表查询接口的耗时校验(视图被用于查询前必须通过)。
     * 但有些场景的视图并不是用于查询 —— 例如单据详情页里的明细表视图,
     * 其筛选/排序在前端本地生效,后端 perf 走通用查询会因缺少业务上下文而失败
     * (实测 bizKey=maintenanceOutboundOrderDetail 会报「维修出库单不存在null」)。
     * 这类场景传 true,保存后直接关闭弹窗。
     */
    skipPerfTest: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示「基础设置」区块(表格内容折行 / 表格紧凑度 / 操作列固定)。
     * 底层表格组件若不支持这三项(如 EditTable 写死了 show-overflow 与行高),
     * 传 false 隐藏该区块,避免出现「设了不生效」的假象。
     */
    showBaseSettings: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      // 校验错误汇总
      errorSummary: [],
      // 保存中
      applying: false,
      // 多字段排序项
      sortList: [],
      // 「自定义表格」区的当前配置(初值取页面传入的列定义)
      tableConfig: this.buildTableConfig(this.config)
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    // 页面列定义变化时重置表格配置区
    config: {
      deep: true,
      handler (val) {
        this.tableConfig = this.buildTableConfig(val);
      }
    }
  },
  mounted () {
    this.initSortable();
  },
  methods: {
    /**
     * 以页面传入的列定义为基准构造表格配置。
     */
    buildTableConfig (config) {
      const columnConfig = Array.isArray(config.columnConfig) ? config.columnConfig : [];
      return {
        autoWrap: config.autoWrap,
        layout: config.layout,
        isOperateFixed: config.isOperateFixed,
        columnConfig: columnConfig.map(item => ({ ...item }))
      };
    },
    /**
     * 弹窗打开:初始化上半区(字段元数据 / 条件树 / 视图名)与排序项,
     * 编辑既有视图时还要把该视图已保存的表格配置拉回来。
     */
    async onOpened () {
      const qb = this.$refs.queryBlock;
      if (qb) {
        await qb.resetState();
        this.syncSortListFromWorking();
      }
      if (this.activePresetId) {
        await this.loadTableConfig(this.activePresetId);
      }
    },
    onClosed () {
      this.errorSummary = [];
    },
    /**
     * 取消:关闭弹框。
     */
    onClose () {
      this.$emit('update:visible', false);
    },
    /**
     * 表格配置在服务端的存储键(与业务页面共用同一套规则)。
     */
    tableConfigCode (viewId) {
      return viewTableConfigCode(this.bizKey, viewId);
    },
    /**
     * 加载已保存视图的表格配置并回填到「自定义表格」区。
     */
    async loadTableConfig (viewId) {
      if (!viewId) return;
      try {
        const res = await getTableConfig(this.tableConfigCode(viewId));
        const cfg = res && res.config;
        if (!cfg || !Array.isArray(cfg.columnConfig) || cfg.columnConfig.length === 0) return;
        // 以当前页面的列定义为基准,只覆盖「显隐 / 顺序」——
        // 页面新增的列不该被历史配置里的旧列覆盖掉
        const base = this.config.columnConfig || [];
        const savedMap = new Map(cfg.columnConfig.map(item => [item.props, item]));
        const merged = base.map(item => {
          const saved = savedMap.get(item.props);
          return { ...item, visible: saved ? saved.visible !== false : true };
        });
        // 排序:历史配置里出现过的列按其顺序排前面,其余保持页面定义顺序
        const savedOrder = cfg.columnConfig
          .filter(item => savedMap.has(item.props))
          .map(item => item.props);
        merged.sort((a, b) => {
          const ia = savedOrder.indexOf(a.props);
          const ib = savedOrder.indexOf(b.props);
          if (ia === -1 && ib === -1) return 0;
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        });
        this.tableConfig = {
          autoWrap: cfg.autoWrap !== undefined ? cfg.autoWrap : this.tableConfig.autoWrap,
          layout: cfg.layout || this.tableConfig.layout,
          isOperateFixed: cfg.isOperateFixed !== undefined ? cfg.isOperateFixed : this.tableConfig.isOperateFixed,
          columnConfig: merged
        };
      } catch (e) {
        // 表格配置是增强能力,读取失败不阻断弹窗使用
      }
    },
    /**
     * 保存当前表格配置到服务端(按视图 id 关联)。
     */
    async saveTableConfig (viewId, tableConfig) {
      if (!viewId || !tableConfig) return;
      try {
        await tableAddOrUpdate({
          tableCode: this.tableConfigCode(viewId),
          config: {
            autoWrap: tableConfig.autoWrap,
            layout: tableConfig.layout,
            isOperateFixed: tableConfig.isOperateFixed,
            columnConfig: (tableConfig.columnConfig || []).map(item => ({
              props: item.props,
              label: item.label,
              visible: item.visible !== false,
              disabled: item.disabled,
              type: item.type
            }))
          },
          resizableData: {}
        });
      } catch (e) {
        this.$message.error('保存表格配置失败');
      }
    },
    /**
     * 可选排序字段:字段元数据(不受表格设置影响),剔除已参与排序的字段。
     */
    sortableFields (current) {
      const qb = this.$refs.queryBlock;
      const fields = (qb && qb.fields) || [];
      const used = this.sortList
        .filter(item => item !== current)
        .map(item => item.field)
        .filter(Boolean);
      return fields.filter(f => !used.includes(f.key));
    },
    /**
     * 上半区的工作排序 → 多字段排序项。
     */
    syncSortListFromWorking () {
      const qb = this.$refs.queryBlock;
      if (!qb) return;
      const working = qb.workingSort;
      this.sortList = working && working.field
        ? [{ field: working.field, order: working.order }]
        : [];
    },
    /**
     * 多字段排序项 → 上半区的工作排序。
     * 后端 addOrUpdate 只接受单字段排序(sortField / sortOrder),
     * 故以第一项为准回写,完整的多字段列表随 save 事件一并抛出。
     */
    syncWorkingFromSortList () {
      const qb = this.$refs.queryBlock;
      if (!qb) return;
      const first = this.sortList[0];
      const next = first
        ? { field: first.field, order: first.order }
        : { field: null, order: null };
      if (!qb.workingSort ||
        qb.workingSort.field !== next.field ||
        qb.workingSort.order !== next.order) {
        qb.workingSort = next;
      }
    },
    addSortField () {
      this.sortList.push({ field: null, order: null });
    },
    removeSortField (idx) {
      this.sortList.splice(idx, 1);
    },
    /**
     * 排序字段拖拽调整次序(最终排序时次序靠前的字段先排)。
     */
    initSortable () {
      const el = this.$refs.sortListRef;
      if (!el) return;
      if (this.sortable) this.sortable.destroy();
      this.sortable = new Sortable(el, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        handle: '.pvs__sort-handle',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt;
          if (oldIndex === newIndex) return;
          const moved = this.sortList.splice(oldIndex, 1)[0];
          this.sortList.splice(newIndex, 0, moved);
        }
      });
    },
    /**
     * 校验排序项:字段必填 + 已选字段必须选顺序。
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
     * 保存入口。
     *
     * <p>校验复用上半区继承来的 validateTree;视图落库复用其 buildAndSave;
     * 「自定义表格」的配置另外落到 userDefineTable(按视图 id 关联)。</p>
     */
    async onSave () {
      if (this.applying) return;
      const qb = this.$refs.queryBlock;
      const ts = this.$refs.tableSetting;
      if (!qb) return;

      const name = (qb.viewName || '').trim();
      const summary = [];
      if (!name) summary.push('请输入视图名称');
      summary.push(...qb.validateTree(qb.workingTree).summary);
      summary.push(...this.validateSortList());
      if (summary.length > 0) {
        this.errorSummary = summary;
        return;
      }
      this.errorSummary = [];

      // 多字段排序的第一项回写到上半区,供 buildAndSave 使用
      this.syncWorkingFromSortList();

      this.applying = true;
      try {
        const newId = await qb.buildAndSave(qb.currentPresetId, name);
        if (!newId) {
          this.$message.error('保存视图失败');
          return;
        }
        qb.currentPresetId = newId;
        // 表格配置按视图 id 单独存
        const tableConfig = ts ? ts.getTableConfig() : null;
        await this.saveTableConfig(newId, tableConfig);
        // 交出保存结果,供宿主页面应用
        this.$emit('save', {
          id: newId,
          viewName: name,
          conditionTree: qb.workingTree,
          sortFields: this.sortList.map(item => ({
            column: item.field,
            sort: item.order ? item.order.toUpperCase() : ''
          })),
          tableConfig
        });
        // 性能测试:视图需通过方可使用。
        // skipPerfTest 场景(如单据明细表视图)不做查询型性能测试
        if (!this.skipPerfTest) {
          const passed = await qb.onRunPerfTest();
          if (!passed) return;
        }
        this.$emit('update:active-preset-id', newId);
        this.$emit('update:visible', false);
      } finally {
        this.applying = false;
      }
    }
  },
  beforeDestroy () {
    if (this.sortable) this.sortable.destroy();
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
  &__tip {
    color: #909399;
    font-size: 12px;
    margin-top: 6px;
  }
  &__sort {
    &-list {
      margin-bottom: 4px;
    }
    &-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    &-handle {
      cursor: move;
      color: #909399;
    }
    &-field {
      width: 220px;
    }
    &-remove {
      color: #909399;
    }
  }
}
</style>
