<template>
  <div class="rule-group" :class="{ 'is-root': isRoot, 'has-multiple': ruleItemList.length > 1 }">
    <div class="relation-toggle-wrapper">
      <div class="relation-line"></div>
      <div class="relation-toggle" :class="{ 'is-or': relation === 'or' }" @click="toggleRelation">
        {{ relation === 'and' ? 'And' : 'Or' }}
        <i class="el-icon-refresh"></i>
      </div>
    </div>
    <div class="rule-group-content">
      <div v-for="(child, index) in ruleItemList" :key="index" class="rule-item-wrapper">
        <!-- 条件行 -->
        <div v-if="child.item" class="rule-condition-row">
          <template v-if="isEditing">
            <fetch-select
              style="width: 200px;"
              :request="fetchOptions"
              enumCode="PredictColumnEnum"
              v-model="child.item.field"
              placeholder="请选择"
              clearable
              filterable
            />
            <fetch-select
              style="width: 200px; margin-left: 10px;"
              :request="fetchOptions"
              enumCode="PredictOperateEnum"
              v-model="child.item.symbol"
              placeholder="请选择"
              clearable
              filterable
            />
            <el-input v-model="child.item.fieldValue" placeholder="输入值" type="number" size="small" style="width: 200px; margin-left: 10px;" />

            <div class="action-buttons" style="margin-left: 20px;">
              <el-dropdown @command="(cmd) => handleAdd(cmd, index)">
                <el-button type="success" icon="el-icon-plus" circle size="mini"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="condition">添加条件</el-dropdown-item>
                  <el-dropdown-item command="group" :disabled="level >= 3">添加组</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button v-if="!(isRoot && ruleItemList.length === 1 && index === 0)"
                type="danger" icon="el-icon-minus" circle size="mini"
                style="margin-left: 10px;"
                :disabled="hasAnyGroupInCurrentLevel()"
                @click="handleDelete(index)">
              </el-button>
            </div>
          </template>
          <template v-else>
            <span class="detail-text">{{ child.item.fieldLabel || child.item.field }}</span>
            <span class="detail-symbol">{{ child.item.symbolLabel || child.item.symbol }}</span>
            <span class="detail-text">{{ child.item.fieldValue }}</span>
          </template>
        </div>
        <!-- 递归组 -->
        <RuleGroupItem v-else
          :relation.sync="child.relation"
          :rule-item-list.sync="child.ruleItemList"
          :level="level + 1"
          :is-editing="isEditing"
          @delete="handleDelete(index)" />
        <!-- 组的删除按钮 -->
        <div v-if="!child.item && isEditing" class="group-delete-wrapper">
          <el-button
            type="danger"
            icon="el-icon-minus"
            circle
            size="mini"
            :disabled="hasGroupChildren(child)"
            @click="handleDelete(index)">
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';

export default {
  name: 'RuleGroupItem',
  props: {
    relation: { type: String, default: 'and' },
    ruleItemList: { type: Array, default: () => [] },
    level: { type: Number, default: 1 },
    isRoot: { type: Boolean, default: false },
    isEditing: { type: Boolean, default: true }
  },
  components: {
    FetchSelect,
    // 递归组件需要自身引用
    RuleGroupItem: () => import('./RuleGroupItem.vue')
  },
  data () {
    return {
    };
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    toggleRelation () {
      if (!this.isEditing) return;
      this.$emit('update:relation', this.relation === 'and' ? 'or' : 'and');
    },
    handleAdd (command, index) {
      const newList = [...this.ruleItemList];
      if (command === 'condition') {
        newList.splice(index + 1, 0, {
          relation: null,
          item: { field: '', symbol: '', fieldValue: '' },
          ruleItemList: []
        });
      } else if (command === 'group') {
        newList.splice(index + 1, 0, {
          relation: 'and',
          item: null,
          ruleItemList: [
            {
              relation: null,
              item: { field: '', symbol: '', fieldValue: '' },
              ruleItemList: []
            }
          ]
        });
      }
      this.$emit('update:ruleItemList', newList);
    },
    handleDelete (index) {
      if (this.isRoot && this.ruleItemList.length === 1 && index === 0) return;
      const newList = [...this.ruleItemList];
      newList.splice(index, 1);
      if (newList.length === 0 && !this.isRoot) {
        this.$emit('delete');
      } else {
        this.$emit('update:ruleItemList', newList);
      }
    },
    // 检查当前层级是否有任何组（有组则不允许删除任何项）
    hasAnyGroupInCurrentLevel () {
      return this.ruleItemList.some(item => item.item === null && item.ruleItemList && item.ruleItemList.length > 0);
    },
    // 检查组是否有子项（组内有子项则不允许删除组）
    hasGroupChildren (group) {
      return group.ruleItemList && group.ruleItemList.length > 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.rule-builder-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

.rule-group {
  position: relative;
  display: flex;
  margin-left: 60px;
  padding: 10px 20px;

  &.is-root {
    margin-left: 0;
    .rule-group-content {
      margin-left: 0;
    }
  }

  &.has-multiple {
    &::before {
      content: '';
      position: absolute;
      left: -30px;
      top: 15px;
      bottom: 15px;
      width: 30px;
      border: 1px solid #67c23a;
      border-right: none;
      border-radius: 4px 0 0 4px;
    }
  }

  .relation-toggle-wrapper {
    position: absolute;
    left: -60px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    z-index: 2;

    .relation-toggle {
      background: #fff;
      border: 1px solid #67c23a;
      color: #67c23a;
      padding: 4px 10px;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s;

      &:hover {
        opacity: 0.8;
      }

      &.is-or {
        border-color: #409eff;
        color: #409eff;
      }

      i {
        font-size: 12px;
      }
    }
  }

  .rule-group-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .rule-item-wrapper {
    position: relative;

    .group-delete-wrapper {
      position: absolute;
      right: -40px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .rule-condition-row {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    padding: 10px 15px;
    border-radius: 4px;
    border: 1px solid #ebeef5;

    .detail-text {
      font-size: 14px;
      color: #606266;
    }

    .detail-symbol {
      margin: 0 15px;
      font-weight: bold;
      color: #409eff;
    }

    .action-buttons {
      display: flex;
      align-items: center;
    }
  }
}
</style>
