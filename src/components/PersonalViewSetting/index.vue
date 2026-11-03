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
      <custom-query-block
        ref="queryBlock"
        :biz-key="bizKey"
        :active-preset-id="activePresetId"
        :hide-sort="true"
        :perf-tab-code="perfTabCode"
        :perf-test-handler="onPerfTest"
      />

      <!--
        自定义排序:多字段批量配置(需求 LP262002 7.1.2.2)。
        交互按 PRD 原型:
          - 一个「＋ 添加排序字段」按钮,下拉列出所有可参与排序的字段;
          - 每行 = [拖拽手柄][字段名] ............ [升序|降序][⊖ 删除];
          - 次序靠前的字段先排序(可拖动调整次序)。
      -->
      <div class="pvs__block">
        <div class="pvs__label">自定义排序</div>
        <div class="pvs__sort">
          <div ref="sortListRef" class="pvs__sort-list">
            <div
              v-for="(item, idx) in sortList"
              :key="idx"
              class="pvs__sort-row"
            >
              <!-- 拖拽手柄:多个排序字段时按住它可调整次序 -->
              <i class="el-icon-rank pvs__sort-handle" title="拖动调整次序" />
              <span class="pvs__sort-name" :title="fieldLabel(item.field)">{{ fieldLabel(item.field) }}</span>
              <el-radio-group v-model="item.order" size="small">
                <el-radio-button label="asc">升序</el-radio-button>
                <el-radio-button label="desc">降序</el-radio-button>
              </el-radio-group>
              <el-button
                type="text"
                icon="el-icon-remove-outline"
                class="pvs__sort-remove"
                title="删除该排序字段"
                @click="removeSortField(idx)"
              />
            </div>
          </div>
          <!--
            添加排序字段:下拉里的候选字段取自后端字段元数据(不受表格设置影响),
            已剔除「已参与排序的字段」与虚拟字段【序号】;字段多时可滚动。
          -->
          <el-dropdown
            trigger="click"
            placement="bottom-start"
            class="pvs__sort-add"
            @command="addSortField"
          >
            <el-button size="mini" icon="el-icon-plus" :disabled="!candidateFields.length">
              添加排序字段<template v-if="sortList.length">（{{ sortList.length }}）</template>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <div class="pvs__sort-candidates">
                <el-dropdown-item
                  v-for="f in candidateFields"
                  :key="f.key"
                  :command="f.key"
                >{{ f.label }}</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="pvs__tip">次序靠前的字段优先排序;不选字段则按后端默认排序</div>
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
import { viewTableConfigCode, localPerfTest } from './localView';
import { toSortJson, isVirtualSortField } from '@/libs/components/CustomView/sortJson';

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
     * <p><b>⚠️ 慎用</b>:跳过意味着「保存即生效、窗口直接关闭」,
     * 与原分支(performance test 通过后才保存)的语义不一致。</p>
     *
     * <p>性能测试是针对列表查询接口的耗时校验(视图被用于查询前必须通过)。
     * 有些场景的视图并不是用于查询 —— 例如单据详情页里的明细表视图,
     * 其筛选/排序在前端本地生效,后端 perf 走通用查询会因缺少业务上下文而失败
     * (实测 bizKey=maintenanceOutboundOrderDetail:直接调 executeQuery 报
     * 「维修出库单不存在null」/500,调 perf 则 future.get(10s) 超时、
     * perfStatus 恒为 pending,永远不可能通过)。</p>
     *
     * <p>这类场景<b>应当改用本地性能测试</b>(见 {@code perfTestRowsLoader}),
     * 对全量明细行跑一次真实的本地过滤 + 排序并计时,
     * 同样能做到「测试通过才真正保存」,只是测的是前端本地这条执行路径。</p>
     *
     * <p>三者关系:
     * <ul>
     *   <li>传了 {@code perfTestRowsLoader} → 走本地性能测试(推荐,明细表场景);</li>
     *   <li>否则 {@code skipPerfTest=true} → 完全跳过测试(保存即生效,<b>不推荐</b>);</li>
     *   <li>否则 → 走原分支的后端 perf 接口(列表页场景)。</li>
     * </ul>
     */
    skipPerfTest: {
      type: Boolean,
      default: false
    },
    /**
     * 本地性能测试用的全量明细行加载器。
     *
     * <p>由宿主页面传入一个 async 函数,返回该单据的全部明细行;
     * 弹窗在保存时调用它取数,用视图的条件树 + 排序项做一次真实的过滤/排序并计时。
     * 传了它就意味着走本地性能测试,见 {@link skipPerfTest}。</p>
     *
     * <p>用函数而不是直接传数组:明细行在保存时才需要,
     * 且要保证测的是最新数据(避免缓存了改动前的行)。</p>
     */
    perfTestRowsLoader: {
      type: Function,
      default: null
    },
    /**
     * 性能测试用的业务上下文标识(单据 ID)。
     *
     * <p>视图对应的接口必须带业务上下文才能定位数据时(单据明细表视图),
     * 由宿主传入此参数:性能测试会把它带给后端,后端再透传给被测接口,
     * 这样明细视图也能正常跑通后端性能测试。</p>
     *
     * <p>传了它 → 走<b>后端 perf</b>(带业务上下文);
     * 没传但传了 {@code perfTestRowsLoader} → 走本地性能测试。</p>
     */
    perfTabCode: {
      type: String,
      default: ''
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
      // 多字段排序项 [{field, order}]
      sortList: [],
      // 候选排序字段(后端字段元数据,打开弹窗时刷新一次)
      fieldOptions: [],
      // 「自定义表格」区的当前配置(初值取页面传入的列定义)
      tableConfig: this.buildTableConfig(this.config)
    };
  },
  computed: {
    /**
     * 可参与排序的候选字段。
     *
     * <p>取自后端字段元数据(customViewField/list)—— <b>不受表格设置影响</b>,
     * 满足 PRD「显示列表中所有可见字段(不受表格设置影响)」的要求。</p>
     *
     * <p>剔除两类:
     * <ul>
     *   <li>已经参与排序的字段(PRD:添加排序字段时需要过滤掉已经参与排序的字段);</li>
     *   <li>虚拟字段【序号】(前端虚拟列,没有对应的业务字段)。</li>
     * </ul>
     */
    candidateFields () {
      const used = this.sortList.map(item => item.field);
      return this.fieldOptions.filter(f => (
        f && f.key && used.indexOf(f.key) === -1 && !isVirtualSortField(f)
      ));
    }
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
        // 候选排序字段:后端字段元数据(不受表格设置影响)。
        // 放在 data 里而不是 computed 里直接取 qb.fields —— this.$refs 不是响应式的,
        // computed 会在 ref 就绪前算一次并缓存住,字段加载完就不会再更新了。
        this.fieldOptions = ((qb && qb.fields) || []).slice();
        // 已保存视图的排序列表:优先 sortJson(多字段),历史数据回落到旧的单字段。
        this.sortList = qb.getSortList();
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
     * 统一的性能测试入口 —— 保存流程与上半区「性能测试」按钮共用。
     *
     * <p>四条路径(按优先级):
     * <ul>
     *   <li>宿主传了 {@code perfTabCode}(单据 ID)→ <b>后端 perf 接口</b>,
     *       后端会把 tabCode 透传给被测接口,单据明细视图也能真实测到查询耗时;</li>
     *   <li>宿主传了 {@code perfTestRowsLoader} → <b>本地性能测试</b>
     *       (无业务上下文、只能在前端跑的场景);</li>
     *   <li>{@code skipPerfTest=true} 且无 loader → 跳过测试;</li>
     *   <li>其余 → <b>后端 perf 接口</b>(列表页场景,与原分支一致)。</li>
     * </ul>
     *
     * @returns {Promise<Boolean>} 是否通过
     */
    async onPerfTest () {
      const qb = this.$refs.queryBlock;
      if (!qb) return false;
      if (this.perfTabCode) {
        // 带业务上下文(单据 ID):走后端 perf,后端会把 tabCode 透传给被测接口,
        // 明细视图也能真实测到「按视图条件 + 按视图排序」的查询耗时。
        // CustomQueryBlock 继承的 onRunPerfTest 会自动带上 perfTabCode。
        return qb.onRunPerfTest();
      }
      if (this.perfTestRowsLoader) {
        return this.runLocalPerfTest(qb);
      }
      if (this.skipPerfTest) {
        // 明确跳过(不推荐):直接视为通过
        return true;
      }
      return qb.onRunPerfTest();
    },
    /**
     * 本地性能测试(明细表场景)。
     *
     * <p>宿主传了 {@code perfTestRowsLoader} 时走这里:用视图的条件树 + 排序项
     * 对全量明细行做一次真实的过滤 + 排序并计时,替代后端 perf。</p>
     *
     * <p>为什么不能用后端 perf:后端 perf 走 customViewMain.path 指向的列表接口,
     * 而明细表不是独立列表页(必须带单据 ID),通用查询拿不到 —— 实测必然失败。</p>
     *
     * @param {Object} qb CustomQueryBlock 实例(取条件树)
     * @returns {Promise<Boolean>} 是否通过
     */
    async runLocalPerfTest (qb) {
      const sortFields = this.sortList.map(item => ({
        column: item.field,
        sort: item.order ? item.order.toUpperCase() : ''
      }));
      let rows = [];
      try {
        rows = (await this.perfTestRowsLoader()) || [];
      } catch (e) {
        this.$message.error('性能测试失败:明细数据加载失败');
        return false;
      }
      const result = localPerfTest(rows, qb.workingTree, sortFields);
      this.$message[result.passed ? 'success' : 'error'](
        `性能测试${result.passed ? '通过' : '未通过'}:耗时 ${result.durationMs}ms`
      );
      return result.passed;
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
     * 排序字段的中文名(取不到时退回字段名本身)。
     * @param {String} fieldKey
     * @returns {String}
     */
    fieldLabel (fieldKey) {
      const hit = this.fieldOptions.find(f => f && f.key === fieldKey);
      return hit ? hit.label : fieldKey;
    },
    /**
     * 添加排序字段(PRD:默认升序)。
     *
     * <p>候选字段来自「添加排序字段」下拉,已剔除已参与排序的字段与虚拟字段【序号】;
     * 这里再兜一层重复校验,防止同一个字段被加入两次。</p>
     *
     * @param {String} fieldKey
     */
    addSortField (fieldKey) {
      if (!fieldKey) return;
      if (this.sortList.some(item => item.field === fieldKey)) return;
      this.sortList.push({ field: fieldKey, order: 'asc' });
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
     * 校验排序项:字段必填 + 已选字段必须选排序方向。
     */
    validateSortList () {
      const summary = [];
      this.sortList.forEach((item, idx) => {
        if (!item.field) {
          summary.push(`排序第 ${idx + 1} 行:请选择字段`);
        } else if (!item.order) {
          summary.push(`排序第 ${idx + 1} 行:请选择排序方向`);
        }
      });
      return summary;
    },
    /**
     * 保存入口。
     *
     * <p>校验复用上半区继承来的 validateTree;视图落库复用其 buildAndSave;
     * 「自定义表格」的配置另外落到 userDefineTable(按视图 id 关联)。</p>
     *
     * <p><b>保存顺序对齐原分支(需求 LP262002 7.1.2.2 / 原分支 feature/20261013-customView)</b>:
     * <ol>
     *   <li>校验视图名 / 条件树 / 排序;</li>
     *   <li>落库(视图 + 表格配置);</li>
     *   <li><b>跑性能测试</b>;</li>
     *   <li><b>测试通过才「真正生效」</b> —— 交出 save 事件让宿主应用视图、
     *       切换选中视图、关闭弹窗;未通过则弹窗保持打开,便于改条件后重试。</li>
     * </ol>
     * 注意:性能测试必须在「交出 save 事件」之前 —— 否则宿主已按新条件刷新了页面,
     * 用户看到的却是「测试没通过」,状态不一致。</p>
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

      // 多字段排序 → 后端新字段 sortJson(需求 LP262002 7.1.2.2)。
      // 同时清空上半区继承来的单字段排序:两套字段不并存,
      // 读取侧优先用 sortJson,历史数据(没有 sortJson)才回落到旧的 sortField/sortOrder。
      // 空列表序列化成 "[]" 而不是空串 —— 空串会被后端当成「没传」而回落到旧字段,
      // 导致「清空排序」不生效。
      qb.presetSortJson = toSortJson(this.sortList);
      qb.workingSort = { field: null, order: null };

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

        // 性能测试:视图需通过方可使用(与原分支一致:测试通过才算真正保存)。
        // 与上半区「性能测试」按钮走同一个入口(onPerfTest),
        // 保证两条路径的判定口径一致。
        if (!this.skipPerfTest || this.perfTestRowsLoader) {
          this.$message.success('保存成功,正在测试接口...');
          const passed = await this.onPerfTest();
          // 测试未通过:弹窗保持打开便于修改条件,不触发页面刷新
          if (!passed) return;
        }

        // 测试通过后才交出保存结果,供宿主页面应用(并切换选中视图、关闭弹窗)
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
      flex: none;
    }
    // 字段名:撑开中间空间,把升降序与删除按钮推到右侧(与 PRD 原型一致)
    &-name {
      flex: 1;
      min-width: 0;
      color: #606266;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &-remove {
      color: #909399;
      font-size: 16px;
      padding: 0;
      &:hover {
        color: var(--leap-color-danger);
      }
    }
    // 候选字段下拉:字段多时需要滚动条(PRD)
    &-candidates {
      max-height: 200px;
      overflow-y: auto;
      min-width: 160px;
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }
    }
  }
}
</style>
