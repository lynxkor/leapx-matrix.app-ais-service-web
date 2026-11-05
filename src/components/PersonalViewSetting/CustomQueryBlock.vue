<!--
  原「自定义条件查询」弹窗的内容块形态。

  做法:用 extends 继承 CustomQueryDialog 的全部 data / methods / computed / props,
       再把模板里的 el-dialog 局部覆盖为 InlineDialog(行内容块)——
       于是原组件的弹窗外壳与自带的「取消 / 保存」按钮都不再出现,
       逻辑与交互完全复用,零模板复制。

  <b>排序区不再另起一套</b>:批量多字段排序(需求 LP262002 7.1.2.2)是 lib
  标准组件 CustomQueryDialog 自带的能力(与列表页用的弹窗完全一致),
  这里直接继承使用,不重复实现,也不隐藏它。

  父组件通过 ref 访问本组件实例,可直接读写继承来的状态
  (viewName / workingTree / sortList)并调用继承来的方法
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
    // 合并弹窗不做性能测试(保存即生效),隐藏继承来的「性能测试」按钮
    this.$el.classList.add('pvs-hide-perf-test');
  },
  methods: {
    /**
     * 重置并初始化工作区(字段元数据 / 条件树 / 排序 / 视图名)。
     * 父组件在弹窗打开时调用。
     *
     * <p>批量排序(需求 LP262002 7.1.2.2)相关状态一并重置:
     * {@code sortList} 是「当前排序项列表」,既是编辑时的数据源,
     * 也是保存时要序列化成 sortJson 的内容。</p>
     */
    async resetState () {
      this.dialogVisible = true;
      this.workingTree = this.makeInitialTree();
      this.sortList = this.makeInitialSortList();
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
      return (this.sortList || []).map(item => ({ field: item.field, order: item.order }));
    }
  }
};
</script>

<style lang="scss">
/* 非 scoped:需要作用到继承自 CustomQueryDialog 的内部元素 */
/* 合并弹窗不做性能测试:隐藏继承来的「性能测试」按钮(在 .c-cqd__presets 里) */
.pvs-hide-perf-test .c-cqd__presets .el-button {
  display: none;
}
</style>
