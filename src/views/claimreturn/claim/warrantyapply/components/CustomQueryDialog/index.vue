<template>
  <el-dialog
    title="自定义条件查询"
    :visible.sync="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <div class="c-cqd">
      <!-- 视图管理栏 -->
      <div class="c-cqd__presets">
        <span class="c-cqd__presets-label">使用视图：</span>
        <el-select
          v-model="selectedPresetId"
          placeholder="不选择视图(自定义编辑)"
          size="small"
          clearable
          class="c-cqd__presets-select"
          @change="onPresetChange"
        >
          <el-option
            v-for="p in presets"
            :key="p.id"
            :value="p.id"
            :label="p.name"
          />
        </el-select>
        <el-button
          size="small"
          icon="el-icon-document-add"
          :disabled="!canSave"
          @click="onSavePreset"
        >保存为视图</el-button>
        <el-button
          v-if="selectedPreset"
          size="small"
          icon="el-icon-edit"
          @click="onRenamePreset"
        >重命名</el-button>
        <el-button
          v-if="selectedPreset"
          size="small"
          icon="el-icon-delete"
          type="danger"
          plain
          @click="onDeletePreset"
        >删除视图</el-button>
        <el-button
          v-if="selectedPreset"
          size="small"
          icon="el-icon-cpu"
          :loading="perfTesting"
          @click="onRunPerfTest"
        >性能测试</el-button>
        <el-tag
          v-if="selectedPreset"
          :type="perfStatusTagType"
          size="small"
          class="c-cqd__presets-status"
        >{{ perfStatusLabel }}</el-tag>
        <el-tag
          v-if="selectedPreset"
          type="info"
          size="small"
          class="c-cqd__presets-hint"
        >正在编辑「{{ selectedPreset.name }}」</el-tag>
      </div>

      <!-- 错误汇总 -->
      <el-alert
        v-if="errorSummary.length > 0"
        :title="errorSummary.join('；')"
        type="error"
        :closable="false"
        class="c-cqd__alert"
      />

      <!-- 递归条件树 -->
      <custom-condition-group
        :group="workingTree"
        :fields="fields"
        :depth="0"
        :removable="false"
        @change="onTreeChange"
      />

      <!-- 排序(单字段 + 升/降) -->
      <div class="c-cqd__sort">
        <div class="c-cqd__sort-title">排序</div>
        <div class="c-cqd__sort-row">
          <el-select
            v-model="workingSort.field"
            placeholder="选择排序字段"
            size="small"
            filterable
            clearable
            class="c-cqd__sort-field"
          >
            <el-option
              v-for="f in fields"
              :key="f.key"
              :value="f.key"
              :label="f.label"
            />
          </el-select>
          <el-radio-group v-model="workingSort.order" size="small" :disabled="!workingSort.field">
            <el-radio-button label="asc">升序</el-radio-button>
            <el-radio-button label="desc">降序</el-radio-button>
          </el-radio-group>
        </div>
        <div class="c-cqd__sort-hint">不选字段则按后端默认排序</div>
      </div>
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="onClear">清空</el-button>
        <el-button size="small" @click="onClose">取消</el-button>
        <el-button size="small" type="primary" @click="onApply">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import CustomConditionGroup from './CustomConditionGroup.vue';
import {
  FIELDS,
  createEmptyRow,
  cloneTree,
  operatorNeedsValue
} from './fieldMeta';
import {
  loadPresets,
  addPreset,
  renamePreset,
  deletePreset,
  updatePreset,
  setPresetPerfStatus,
  PERF_STATUS,
  PERF_THRESHOLD_MS
} from './presetStore';

export default {
  name: 'CustomQueryDialog',
  components: { CustomConditionGroup },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array,
      default: () => FIELDS
    },
    value: {
      // v-model:conditions — applied condition tree
      type: Object,
      default: null
    },
    activePresetId: {
      // v-model:activePresetId — 当前激活的方案 ID(页面控制)
      type: String,
      default: null
    },
    editingPresetId: {
      // 打开弹窗时直接定位到该视图(优先级高于 activePresetId)
      type: String,
      default: null
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      workingTree: this.makeInitialTree(),
      workingSort: this.makeInitialSort(),
      errorSummary: [],
      presets: [],
      selectedPresetId: null,
      perfTesting: false
    };
  },
  computed: {
    presetMode () {
      return !!this.selectedPreset;
    },
    selectedPreset () {
      if (!this.selectedPresetId) return null;
      return this.presets.find(p => p.id === this.selectedPresetId) || null;
    },
    canSave () {
      // 只读模式下不能保存(避免覆盖),且当前树必须有有效内容
      return !this.presetMode;
    },
    perfStatusLabel () {
      if (!this.selectedPreset) return '';
      const s = this.selectedPreset.perfStatus || PERF_STATUS.PENDING;
      const dur = this.selectedPreset.perfDurationMs;
      if (s === PERF_STATUS.PASSED && dur != null) return `已通过(${dur}ms)`;
      if (s === PERF_STATUS.FAILED && dur != null) return `未通过(${dur}ms)`;
      if (s === PERF_STATUS.PASSED) return '已通过';
      if (s === PERF_STATUS.FAILED) return '未通过';
      return '待测试';
    },
    perfStatusTagType () {
      if (!this.selectedPreset) return 'info';
      const s = this.selectedPreset.perfStatus || PERF_STATUS.PENDING;
      if (s === PERF_STATUS.PASSED) return 'success';
      if (s === PERF_STATUS.FAILED) return 'danger';
      return 'warning';
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.workingTree = this.makeInitialTree();
        this.workingSort = this.makeInitialSort();
        this.errorSummary = [];
        this.presets = loadPresets();
        // editingPresetId 优先(编辑指定视图的场景)
        // 其次回退到 activePresetId(打开弹窗查看当前激活视图)
        this.selectedPresetId = this.editingPresetId || this.activePresetId || null;
        if (this.selectedPreset) {
          this.workingTree = cloneTree(this.selectedPreset.tree);
          this.workingSort = this.selectedPreset.sort
            ? { ...this.selectedPreset.sort }
            : this.makeInitialSort();
        }
      }
    },
    activePresetId (val) {
      // 父组件主动清除(例如点"清除方案"),同步到弹窗
      this.selectedPresetId = val || null;
      if (!val && this.dialogVisible) {
        this.workingTree = this.makeInitialTree();
        this.workingSort = this.makeInitialSort();
      }
    }
  },
  methods: {
    makeInitialTree () {
      if (this.value && this.value.conditions && this.value.conditions.length > 0) {
        return cloneTree(this.value);
      }
      return {
        logic: 'AND',
        conditions: [createEmptyRow()]
      };
    },
    makeInitialSort () {
      // 当前没有"已应用排序"概念,自定义模式默认空
      return { field: null, order: null };
    },
    onTreeChange (newTree) {
      this.workingTree = newTree;
    },
    onPresetChange (id) {
      if (!id) {
        // 切回自定义模式:重置为空
        this.workingTree = {
          logic: 'AND',
          conditions: [createEmptyRow()]
        };
        this.workingSort = this.makeInitialSort();
        this.$emit('update:active-preset-id', null);
        return;
      }
      const preset = this.presets.find(p => p.id === id);
      if (preset) {
        this.workingTree = cloneTree(preset.tree);
        this.workingSort = preset.sort ? { ...preset.sort } : this.makeInitialSort();
        this.$emit('update:active-preset-id', id);
      }
    },
    async onSavePreset () {
      const result = this.validateTree(this.workingTree);
      if (!result.valid) {
        this.errorSummary = result.summary;
        this.$message.warning('请先完善条件再保存');
        return;
      }
      this.errorSummary = [];
      try {
        const { value: name } = await this.$prompt('请输入视图名称', '保存为视图', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputPattern: /\S+/,
          inputErrorMessage: '视图名称不能为空'
        });
        const dup = this.presets.find(p => p.name === name);
        if (dup) {
          try {
            await this.$confirm(`已存在同名视图「${name}」,是否覆盖?`, '提示', {
              confirmButtonText: '覆盖',
              cancelButtonText: '取消',
              type: 'warning'
            });
          } catch (e) {
            return;
          }
          deletePreset(dup.id);
        }
        const preset = addPreset(name, this.workingTree, this.workingSort.field
          ? { field: this.workingSort.field, order: this.workingSort.order }
          : null);
        this.presets = loadPresets();
        this.selectedPresetId = preset.id;
        this.$emit('update:active-preset-id', preset.id);
        this.$message.success('已保存视图');
      } catch (e) {
        // 用户取消输入
      }
    },
    async onRenamePreset () {
      if (!this.selectedPreset) return;
      try {
        const { value: name } = await this.$prompt('请输入新的视图名称', '重命名视图', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputValue: this.selectedPreset.name,
          inputPattern: /\S+/,
          inputErrorMessage: '视图名称不能为空'
        });
        if (name === this.selectedPreset.name) return;
        const dup = this.presets.find(p => p.name === name && p.id !== this.selectedPreset.id);
        if (dup) {
          this.$message.warning(`已存在同名视图「${name}」`);
          return;
        }
        this.presets = renamePreset(this.selectedPreset.id, name);
        this.$message.success('已重命名');
      } catch (e) {
        // 用户取消
      }
    },
    onDeletePreset () {
      if (!this.selectedPreset) return;
      this.$confirm(`确认删除视图「${this.selectedPreset.name}」?删除后不可恢复。`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = this.selectedPreset.id;
        this.presets = deletePreset(id);
        this.selectedPresetId = null;
        this.workingTree = {
          logic: 'AND',
          conditions: [createEmptyRow()]
        };
        this.workingSort = this.makeInitialSort();
        this.$emit('update:active-preset-id', null);
        this.$message.success('已删除视图');
      }).catch(() => {});
    },
    async onRunPerfTest () {
      if (!this.selectedPreset || this.perfTesting) return;
      const result = this.validateTree(this.workingTree);
      if (!result.valid) {
        this.errorSummary = result.summary;
        this.$message.warning('请先完善条件再测试');
        return;
      }
      this.errorSummary = [];
      this.perfTesting = true;
      // 模拟耗时:800-2800ms 随机
      const duration = 800 + Math.floor(Math.random() * 2000);
      await new Promise(resolve => setTimeout(resolve, duration));
      const status = duration <= PERF_THRESHOLD_MS ? PERF_STATUS.PASSED : PERF_STATUS.FAILED;
      this.presets = setPresetPerfStatus(this.selectedPreset.id, status, duration);
      this.perfTesting = false;
      this.$message[status === PERF_STATUS.PASSED ? 'success' : 'error'](
        `性能测试${status === PERF_STATUS.PASSED ? '通过' : '未通过'}:耗时 ${duration}ms`
      );
    },
    onApply () {
      const treeResult = this.validateTree(this.workingTree);
      const sortResult = this.validateSort();
      const summary = [...treeResult.summary, ...sortResult.summary];
      if (summary.length > 0) {
        this.errorSummary = summary;
        return;
      }
      this.errorSummary = [];
      // 选中预设:把改动写回预设(tree + sort 一起)
      if (this.selectedPresetId) {
        this.presets = updatePreset(this.selectedPresetId, {
          tree: this.workingTree,
          sort: this.workingSort.field
            ? { field: this.workingSort.field, order: this.workingSort.order }
            : null
        });
      }
      this.$emit('input', cloneTree(this.workingTree));
      this.$emit('update:sort', this.workingSort.field
        ? { field: this.workingSort.field, order: this.workingSort.order }
        : null);
      const tipExtra = this.workingSort.field ? `,排序:${this.workingSort.field} ${this.workingSort.order}` : '';
      this.$message.success(`已应用 ${this.countNodes(this.workingTree)} 个自定义条件${tipExtra}`);
      this.$emit('update:visible', false);
    },
    onClear () {
      this.$confirm('确认清空当前条件(不会删除已保存的视图)?', '提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.workingTree = {
          logic: 'AND',
          conditions: [createEmptyRow()]
        };
        this.workingSort = this.makeInitialSort();
        this.selectedPresetId = null;
        this.errorSummary = [];
        this.$emit('update:active-preset-id', null);
      }).catch(() => {});
    },
    onClose () {
      this.$emit('update:visible', false);
    },
    /**
     * 整树校验:返回 { valid, summary }
     * 深度优先遍历,按行序给出错误位置(顶层 1,2,3...,子组重新从 1 计数)。
     */
    validateTree (group, path = '第 1 组', rowIdxRef = { i: 0 }) {
      const summary = [];

      group.conditions.forEach((item) => {
        rowIdxRef.i += 1;
        const rowLabel = `${path}第 ${rowIdxRef.i} 行`;

        if (item.type === 'group') {
          const sub = this.validateTree(item, `${path}子组-`, { i: 0 });
          summary.push(...sub.summary);
          return;
        }

        if (!item.field) {
          summary.push(`${rowLabel}:请选择字段`);
        }
        if (!item.operator) {
          summary.push(`${rowLabel}:请选择运算符`);
        }
        if (item.operator && operatorNeedsValue(item.operator)) {
          const hasValue = Array.isArray(item.value)
            ? item.value.length > 0
            : item.value !== null && item.value !== undefined && item.value !== '';
          if (!hasValue) {
            summary.push(`${rowLabel}:请填写值`);
          }
        }
        if (item.operator === 'between' && Array.isArray(item.value) && item.value.length === 1) {
          summary.push(`${rowLabel}:介于需同时填起止`);
        }
      });

      return { valid: summary.length === 0, summary };
    },
    /**
     * 排序校验:返回 { valid, summary }
     * 规则:选了字段就必须选 order;两者皆空视为"不指定排序",合法。
     */
    validateSort () {
      const summary = [];
      if (this.workingSort.field && !this.workingSort.order) {
        summary.push('排序:请选择顺序');
      }
      return { valid: summary.length === 0, summary };
    },
    countNodes (group) {
      let count = 0;
      group.conditions.forEach(item => {
        if (item.type === 'group') count += this.countNodes(item);
        else count += 1;
      });
      return count;
    }
  }
};
</script>

<style lang="scss" scoped>
.c-cqd {
  max-height: 60vh;
  overflow-y: auto;
  padding: 4px;
  &__presets {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    margin-bottom: 12px;
    background: #f5f7fa;
    border-radius: 4px;
    flex-wrap: wrap;
  }
  &__presets-label {
    color: #606266;
    font-size: 13px;
    white-space: nowrap;
  }
  &__presets-select {
    width: 240px;
  }
  &__presets-hint {
    margin-left: auto;
  }
  &__alert {
    margin-bottom: 12px;
  }
  &__sort {
    margin-top: 12px;
    padding: 8px 10px;
    background: #f5f7fa;
    border-radius: 4px;
  }
  &__sort-title {
    color: #606266;
    font-size: 13px;
    margin-bottom: 6px;
  }
  &__sort-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }
  &__sort-field {
    width: 240px;
  }
  &__sort-hint {
    color: #909399;
    font-size: 12px;
  }
}
.dialog-footer {
  text-align: right;
}
</style>
