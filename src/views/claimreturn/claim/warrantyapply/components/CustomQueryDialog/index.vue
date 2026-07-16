<template>
  <el-dialog
    title="自定义条件查询"
    :visible.sync="dialogVisible"
    width="1000px"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <div class="c-cqd">
      <!-- 方案管理栏 -->
      <div class="c-cqd__presets">
        <span class="c-cqd__presets-label">使用方案：</span>
        <el-select
          v-model="selectedPresetId"
          placeholder="不选择方案(自定义编辑)"
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
        >保存为方案</el-button>
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
        >删除方案</el-button>
        <el-tag
          v-if="selectedPreset"
          type="info"
          size="small"
          class="c-cqd__presets-hint"
        >正在使用「{{ selectedPreset.name }}」,只读模式</el-tag>
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
        :disabled="presetMode"
        @change="onTreeChange"
      />
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="onClear">清空</el-button>
        <el-button size="small" @click="onClose">取消</el-button>
        <el-button size="small" type="primary" @click="onApply">应用</el-button>
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
  deletePreset
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
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      workingTree: this.makeInitialTree(),
      errorSummary: [],
      presets: [],
      selectedPresetId: null
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
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.workingTree = this.makeInitialTree();
        this.errorSummary = [];
        this.presets = loadPresets();
        // 父组件传入的 activePresetId 同步到 selectedPresetId
        this.selectedPresetId = this.activePresetId || null;
        if (this.selectedPreset) {
          this.workingTree = cloneTree(this.selectedPreset.tree);
        }
      }
    },
    activePresetId (val) {
      // 父组件主动清除(例如点"清除方案"),同步到弹窗
      this.selectedPresetId = val || null;
      if (!val && this.dialogVisible) {
        this.workingTree = this.makeInitialTree();
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
        this.$emit('update:active-preset-id', null);
        return;
      }
      const preset = this.presets.find(p => p.id === id);
      if (preset) {
        this.workingTree = cloneTree(preset.tree);
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
        const { value: name } = await this.$prompt('请输入方案名称', '保存为方案', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputPattern: /\S+/,
          inputErrorMessage: '方案名称不能为空'
        });
        const dup = this.presets.find(p => p.name === name);
        if (dup) {
          try {
            await this.$confirm(`已存在同名方案「${name}」,是否覆盖?`, '提示', {
              confirmButtonText: '覆盖',
              cancelButtonText: '取消',
              type: 'warning'
            });
          } catch (e) {
            return;
          }
          deletePreset(dup.id);
        }
        const preset = addPreset(name, this.workingTree);
        this.presets = loadPresets();
        this.selectedPresetId = preset.id;
        this.$emit('update:active-preset-id', preset.id);
        this.$message.success('已保存方案');
      } catch (e) {
        // 用户取消输入
      }
    },
    async onRenamePreset () {
      if (!this.selectedPreset) return;
      try {
        const { value: name } = await this.$prompt('请输入新的方案名称', '重命名方案', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputValue: this.selectedPreset.name,
          inputPattern: /\S+/,
          inputErrorMessage: '方案名称不能为空'
        });
        if (name === this.selectedPreset.name) return;
        const dup = this.presets.find(p => p.name === name && p.id !== this.selectedPreset.id);
        if (dup) {
          this.$message.warning(`已存在同名方案「${name}」`);
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
      this.$confirm(`确认删除方案「${this.selectedPreset.name}」?删除后不可恢复。`, '提示', {
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
        this.$emit('update:active-preset-id', null);
        this.$message.success('已删除方案');
      }).catch(() => {});
    },
    onApply () {
      const result = this.validateTree(this.workingTree);
      if (!result.valid) {
        this.errorSummary = result.summary;
        return;
      }
      this.errorSummary = [];
      this.$emit('input', cloneTree(this.workingTree));
      this.$message.success(`已应用 ${this.countNodes(this.workingTree)} 个自定义条件`);
      this.$emit('update:visible', false);
    },
    onClear () {
      this.$confirm('确认清空当前条件(不会删除已保存的方案)?', '提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.workingTree = {
          logic: 'AND',
          conditions: [createEmptyRow()]
        };
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
}
.dialog-footer {
  text-align: right;
}
</style>