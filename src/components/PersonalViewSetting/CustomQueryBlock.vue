<!--
  原「自定义条件查询」弹窗的内容块形态。

  做法:用 extends 继承 CustomQueryDialog 的全部 data / methods / computed / props,
       再把模板里的 el-dialog 局部覆盖为 InlineDialog(行内容块)——
       于是原组件的弹窗外壳与自带的「取消 / 保存」按钮都不再出现,
       逻辑与交互完全复用,零模板复制。

  父组件通过 ref 访问本组件实例,可直接读写继承来的状态
  (viewName / workingTree / workingSort)并调用继承来的方法
  (validateTree / validateSort / buildAndSave)。
-->
<script>
import CustomQueryDialog from '@/libs/components/CustomView/CustomQueryDialog.vue';
import InlineDialog from './InlineDialog.vue';

export default {
  name: 'CustomQueryBlock',
  extends: CustomQueryDialog,
  components: {
    // 覆盖父组件模板里的 <el-dialog>,使其渲染为行内容块
    ElDialog: InlineDialog
  },
  props: {
    /**
     * 隐藏原组件自带的「排序」区(单字段)。
     *
     * <p>PRD 的自定义排序要求支持多字段 + 拖拽调整次序,
     * 由外层组件实现,故这里把继承来的单字段排序区隐藏,避免出现两套排序 UI。</p>
     */
    hideSort: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    /**
     * 覆盖父组件的 visible watch。
     *
     * <p>父组件原本靠 visible 由 false→true 变化来初始化(字段元数据 / 条件树 / 排序),
     * 而嵌入使用时 visible 恒为 true,变化不会触发,
     * 这里改为「由父组件显式调用 resetState()」,打开 / 重新打开都能正确重置。</p>
     */
    visible () {
      // 嵌入模式下由父组件控制初始化时机,此处不重复处理
    }
  },
  created () {
    this.dialogVisible = true;
  },
  mounted () {
    if (this.hideSort) {
      // 原组件的排序区在 .c-cqd__sort,隐藏后由外层的多字段排序区承担
      this.$el.classList.add('pvs-hide-inherited-sort');
    }
    // 合并弹窗不做性能测试(保存即生效),隐藏继承来的「性能测试」按钮
    this.$el.classList.add('pvs-hide-perf-test');
  },
  methods: {
    /**
     * 重置并初始化工作区(字段元数据 / 条件树 / 排序 / 视图名)。
     * 父组件在弹窗打开时调用。
     *
     * <p>批量排序(需求 LP262002 7.1.2.2)相关状态一并重置:
     * {@code presetSortJson} 是「保存时要带给后端的排序列表」,
     * {@code presetSortList} 是「从视图详情读回来的排序列表」。</p>
     */
    async resetState () {
      this.dialogVisible = true;
      this.workingTree = this.makeInitialTree();
      this.workingSort = this.makeInitialSort();
      this.presetSortJson = '';
      this.presetSortList = [];
      this.errorSummary = [];
      this.viewName = '';
      this.currentPresetId = this.activePresetId || null;
      await this.fetchFields();
      if (this.currentPresetId) {
        await this.loadPresetDetail(this.currentPresetId);
      }
    },
    /**
     * 取当前视图已保存的排序项列表 [{field, order}]。
     *
     * <p>继承自 CustomQueryDialog 的 loadPresetDetail 已按
     * 「优先 sortJson(多字段),历史数据回落到旧的 sortField/sortOrder」解析好,
     * 这里只做一次浅拷贝,避免外部改动影响组件内部状态。</p>
     *
     * @returns {Array<Object>}
     */
    getSortList () {
      return (this.presetSortList || []).map(item => ({ field: item.field, order: item.order }));
    }
  }
};
</script>

<style lang="scss">
/* 非 scoped:需要作用到继承自 CustomQueryDialog 的内部元素 */
.pvs-hide-inherited-sort .c-cqd__sort {
  display: none;
}
/* 合并弹窗不做性能测试:隐藏继承来的「性能测试」按钮(在 .c-cqd__presets 里) */
.pvs-hide-perf-test .c-cqd__presets .el-button {
  display: none;
}
</style>
