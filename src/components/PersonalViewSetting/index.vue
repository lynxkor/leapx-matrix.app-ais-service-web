<template>
  <!--
    个人视图设置(容器)。

    结构:
      上半 —— 引用原「自定义条件查询」组件(CustomQueryBlock:继承 CustomQueryDialog 的全部逻辑,
              仅把弹窗外壳替换为行内容块,原组件自带的「取消 / 保存」因此不再出现);
      下半 —— 引用「自定义表格」组件(TableSetting:表格设置功能已复制到本项目内);
      右下 —— 统一的「取消 / 保存」按钮(取消关闭弹框)。
  -->
  <!--
    可见性只认父组件传下来的 visible(单一数据源)。
    ⚠️ 不要再用「内部 data.dialogVisible + .sync」的方式另存一份:
    el-dialog 关闭(右上角 X / ESC)时只会 emit update:visible 给 .sync 的那份,
    父组件那份仍是 true —— 于是父组件后续再点「编辑」时 visible 没变化、
    不重渲染,子组件的 visible watch 不触发,弹窗再也打不开(点一次后就失效)。
    这里把 el-dialog 的 update:visible 原样透传给父组件,任何关闭方式都能同步回去。
  -->
  <el-dialog
    title="个人视图设置"
    :visible="visible"
    width="760px"
    append-to-body
    :close-on-click-modal="false"
    class="m-personal-view-setting"
    @update:visible="onVisibleChange"
    @opened="onOpened"
    @closed="onClosed"
  >
    <div class="pvs">
      <!-- 上半:原个人视图配置(视图名称 + 自定义筛选) -->
      <!--
        排序区在 CustomQueryBlock 里 —— 它继承的就是 lib 标准组件 CustomQueryDialog,
        批量多字段排序(需求 LP262002 7.1.2.2)由 lib 自带,这里不再重复实现一套。
      -->
      <custom-query-block
        ref="queryBlock"
        :biz-key="bizKey"
        :active-preset-id="activePresetId"
      />

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
      // 校验错误汇总
      errorSummary: [],
      // 保存中
      applying: false,
      // 「自定义表格」区的当前配置(初值取页面传入的列定义)
      tableConfig: this.buildTableConfig(this.config)
    };
  },
  watch: {
    // 页面列定义变化时重置表格配置区
    config: {
      deep: true,
      handler (val) {
        this.tableConfig = this.buildTableConfig(val);
      }
    }
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
     * 弹窗打开:初始化上半区(字段元数据 / 条件树 / 视图名 / 排序项),
     * 编辑既有视图时还要把该视图已保存的表格配置拉回来。
     *
     * <p>排序项不需要在这里再取一份 —— 上半区继承自 lib 标准组件,
     * resetState() 已经把视图已保存的排序回填进它的 sortList,
     * 界面上看到的排序区就是那一份(数据源唯一)。</p>
     */
    async onOpened () {
      const qb = this.$refs.queryBlock;
      if (qb) {
        await qb.resetState();
      }
      if (this.activePresetId) {
        await this.loadTableConfig(this.activePresetId);
      }
    },
    onClosed () {
      this.errorSummary = [];
    },
    /**
     * el-dialog 关闭(右上角 X / ESC)时,把关闭状态透传给父组件。
     *
     * <p>父组件(CustomView)靠 visible 变化来「打开弹窗」,
     * 若关闭时不同步回去,父组件那边仍是 true,
     * 下次点「编辑」时 visible 没变化 → 不会重新打开。</p>
     *
     * @param {Boolean} val 新的可见状态
     */
    onVisibleChange (val) {
      this.$emit('update:visible', val);
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
     * 保存入口。
     *
     * <p>校验复用上半区继承来的 validateTree / validateSort;视图落库复用其 buildAndSave;
     * 「自定义表格」的配置另外落到 userDefineTable(按视图 id 关联)。</p>
     *
     * <p>保存流程:<b>校验 → 落库(视图 + 表格配置)→ 交出 save 事件并关闭弹窗</b>。
     * 不做性能测试(该能力仅保留在 lib 库的 CustomQueryDialog,列表页场景使用)。</p>
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
      // 排序校验也用 lib 标准组件的(批量多字段,逐行校验)
      summary.push(...qb.validateSort().summary);
      if (summary.length > 0) {
        this.errorSummary = summary;
        return;
      }
      this.errorSummary = [];

      this.applying = true;
      try {
        // 视图落库:排序由 lib 组件的 buildAndSave 统一序列化成 sortJson 发给后端
        // (只发新字段,不双写旧的 sortField / sortOrder)。
        const newId = await qb.buildAndSave(qb.currentPresetId, name);
        if (!newId) {
          this.$message.error('保存视图失败');
          return;
        }
        qb.currentPresetId = newId;
        // 表格配置按视图 id 单独存
        const tableConfig = ts ? ts.getTableConfig() : null;
        await this.saveTableConfig(newId, tableConfig);

        // 保存成功即生效:交出保存结果,供宿主页面应用(并切换选中视图、关闭弹窗)
        this.$message.success('保存成功');
        this.$emit('save', {
          id: newId,
          viewName: name,
          conditionTree: qb.workingTree,
          sortFields: (qb.sortList || []).map(item => ({
            column: item.field,
            sort: item.order ? item.order.toUpperCase() : ''
          })),
          tableConfig
        });
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
}
</style>
