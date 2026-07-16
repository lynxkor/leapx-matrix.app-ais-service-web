<template>
  <el-dialog
    title="自定义条件查询"
    :visible.sync="dialogVisible"
    width="760px"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <div class="c-cqd">
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
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      workingTree: this.makeInitialTree(),
      errorSummary: []
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        // 每次打开重置 workingTree
        this.workingTree = this.makeInitialTree();
        this.errorSummary = [];
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
      this.$confirm('确认清空所有自定义条件?', '提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.workingTree = {
          logic: 'AND',
          conditions: [createEmptyRow()]
        };
        this.errorSummary = [];
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
  &__alert {
    margin-bottom: 12px;
  }
}
.dialog-footer {
  text-align: right;
}
</style>
