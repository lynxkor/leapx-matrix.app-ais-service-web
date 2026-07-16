<template>
  <div :class="['c-cg', { 'c-cg--nested': depth > 0 }]">
    <!-- 组头部:AND/OR 切换 + 行数提示 + 删除按钮(子组才显示) -->
    <div class="c-cg__head">
      <el-radio-group v-model="localGroup.logic" size="mini" @change="emitChange">
        <el-radio-button label="AND">且</el-radio-button>
        <el-radio-button label="OR">或</el-radio-button>
      </el-radio-group>
      <span class="c-cg__hint">满足以下 {{ localGroup.conditions.length }} 条</span>
      <el-button
        v-if="removable"
        type="text"
        icon="el-icon-delete"
        size="mini"
        class="c-cg__remove"
        @click="$emit('remove')"
      >删除分组</el-button>
    </div>

    <!-- 行/子分组列表 -->
    <div
      v-for="(item, idx) in localGroup.conditions"
      :key="item.id"
      class="c-cg__item"
    >
      <span class="c-cg__sep">
        {{ idx === 0 ? '·' : (localGroup.logic === 'AND' ? '且' : '或') }}
      </span>
      <custom-condition-row
        v-if="item.type !== 'group'"
        :row="item"
        :fields="fields"
        @remove="removeAt(idx)"
        @change="onChildChange(idx, $event)"
      />
      <custom-condition-group
        v-else
        :group="item"
        :fields="fields"
        :depth="depth + 1"
        :removable="true"
        @remove="removeAt(idx)"
        @change="onChildChange(idx, $event)"
      />
    </div>

    <!-- 操作区 -->
    <div class="c-cg__ops">
      <el-button size="mini" icon="el-icon-plus" @click="addRow">加条件</el-button>
      <el-tooltip
        :disabled="depth < 4"
        :content="depth >= 4 ? '已达最大嵌套层级 5' : ''"
        placement="top"
      >
        <el-button
          size="mini"
          icon="el-icon-folder-add"
          :disabled="depth >= 4"
          @click="addGroup"
        >加分组</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import CustomConditionRow from './CustomConditionRow.vue';
import { createEmptyRow, createEmptyGroup } from './fieldMeta';

export default {
  name: 'CustomConditionGroup',
  components: { CustomConditionRow },
  props: {
    group: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    },
    removable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localGroup: JSON.parse(JSON.stringify(this.group))
    };
  },
  watch: {
    group: {
      handler (val) {
        // Guard against re-emit loop (same as CustomConditionRow).
        // Parent splice returns group prop as new ref with same content.
        if (JSON.stringify(val) === JSON.stringify(this.localGroup)) return;
        this.localGroup = JSON.parse(JSON.stringify(val));
      },
      deep: true
    },
    localGroup: {
      handler (val) {
        this.$emit('change', JSON.parse(JSON.stringify(val)));
      },
      deep: true
    }
  },
  methods: {
    addRow () {
      this.localGroup.conditions.push(createEmptyRow());
      this.emitChange();
    },
    addGroup () {
      if (this.depth >= 4) return;
      this.localGroup.conditions.push(createEmptyGroup('AND'));
      this.emitChange();
    },
    removeAt (idx) {
      this.localGroup.conditions.splice(idx, 1);
      if (this.localGroup.conditions.length === 0) {
        this.localGroup.conditions.push(createEmptyRow());
      }
      this.emitChange();
    },
    onChildChange (idx, newChild) {
      this.localGroup.conditions.splice(idx, 1, newChild);
      this.emitChange();
    },
    emitChange () {
      this.$emit('change', JSON.parse(JSON.stringify(this.localGroup)));
    }
  }
};
</script>

<style lang="scss" scoped>
.c-cg {
  background: #fafafa;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 6px;
  &--nested {
    border: 1px dashed #dcdfe6;
    background: #fff;
    margin-left: 16px;
    position: relative;
  }
  &__head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  &__hint {
    color: #909399;
    font-size: 12px;
  }
  &__remove {
    margin-left: auto;
    color: #f56c6c;
    padding: 2px 6px;
  }
  &__item {
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }
  &__sep {
    flex-shrink: 0;
    width: 24px;
    text-align: right;
    color: #909399;
    font-size: 12px;
    padding-top: 6px;
  }
  &__ops {
    margin-top: 6px;
    padding-left: 30px;
  }
}
</style>
