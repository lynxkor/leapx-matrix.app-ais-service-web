<template>
  <el-dialog
    :visible="visible"
    title="不返件规则配置"
    width="1000px"
    :close-on-click-modal="false"
    @update:visible="(val) => $emit('update:visible', val)"
  >
    <div class="dialog-body">
      <el-tabs
        v-model="activeTabName"
        @tab-click="handleTabClick"
        @tab-remove="handleTabRemove"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
          :closable="tab.saved && noReturnRuleDelete"
        >
          <div v-show="activeTabName === tab.name" class="condition-area">
            <Condition
              :ref="'conditionRef_' + tab.name"
              :key="tab.name + '_' + (tab.condKey || 0)"
              :config-code="'warranty_no_return_rule'"
            />
          </div>
        </el-tab-pane>
        <!-- 固定的 + tab（新增入口）：仅可编辑用户可见，点击后在已保存规则末尾追加新规则 -->
        <el-tab-pane v-if="noReturnRuleEdit" name="__add__">
          <span slot="label" class="add-tab-label">+</span>
        </el-tab-pane>
      </el-tabs>

      <div v-if="tabs.length === 0" class="empty-tip">
        点击末尾【+】号，新增第一条不返件规则
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button v-if="noReturnRuleEdit" type="primary" :loading="submitLoading" @click="handleConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Condition from '@/views/file/attachmentConfig/components/Condition.vue';
import * as api from '@/api/claimreturn/claim/warrantyapply/noReturnRule';

export default {
  name: 'NoReturnRuleDialog',
  components: { Condition },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  // 通过 computed 直接从父组件实例读取 boolean（绕过 props 链路）
  // 父组件(index.vue)的 noReturnRuleEdit / noReturnRuleDelete 无论是否通过 props 传过来，
  // 都能通过 $parent 直接读到，避免 props 链路断裂导致 UI 不显示
  computed: {
    noReturnRuleEdit () {
      // $parent 链路上溯查找含 noReturnRuleEdit 的实例
      let p = this.$parent;
      while (p) {
        if (p.noReturnRuleEdit !== undefined) return p.noReturnRuleEdit;
        p = p.$parent;
      }
      return false;
    },
    noReturnRuleDelete () {
      let p = this.$parent;
      while (p) {
        if (p.noReturnRuleDelete !== undefined) return p.noReturnRuleDelete;
        p = p.$parent;
      }
      return false;
    }
  },
  data () {
    return {
      tabs: [],
      activeTabName: '',
      submitLoading: false,
      condKeyCounter: 0
    };
  },
  watch: {
    visible (val) {
      console.log('[NoReturnRuleDialog] visible:', val);
      if (val) {
        this.initTabs();
      } else {
        this.tabs = [];
        this.activeTabName = '';
      }
    },
    'tabs.length' (val) {
      if (val === 0) {
        this.activeTabName = '__add__';
      }
    }
  },
  methods: {
    async initTabs (newlySavedId) {
      try {
        const res = await api.page({ pageNum: 1, pageSize: 100 });
        const records = (res && res.records) || [];
        console.log('[NoReturnRuleDialog] loaded:', records.length);
        // 保留保存前的 active tab，让用户编辑/保存后仍停留在当前规则上
        // （保存前可能编辑的是中间某个 tab，不一定是 tabs[0]，避免被强制切走导致"输入内容消失"的错觉）
        const prevActiveTabName = this.activeTabName;
        this.tabs = records.map((rule, idx) => ({
          name: rule.id,
          label: `规则${idx + 1}`,
          saved: true,
          id: rule.id,
          conditionJson: this.parseConditionJson(rule.conditionJson),
          condKey: ++this.condKeyCounter
        }));
        if (this.tabs.length > 0) {
          // 兜底顺序：
          //   1) 上一个 active tab 仍在（如编辑现有规则）→ 留在原 tab
          //   2) 刚保存的新规则 ID（新增场景下，prev 是 __new_xxx 临时名）→ 跳到新规则
          //   3) 都没有 → 回退到 tabs[0]（如删除当前 tab 后）
          const stillExists = this.tabs.some(t => t.name === prevActiveTabName);
          const newSavedExists = newlySavedId && this.tabs.some(t => t.name === newlySavedId);
          this.activeTabName = stillExists
            ? prevActiveTabName
            : (newSavedExists ? newlySavedId : this.tabs[0].name);
          this.$nextTick(() => this.loadConditionToCurrentTab());
        } else {
          // 没有已保存规则时，默认停留在 + tab，引导用户点击新增
          this.activeTabName = '__add__';
        }
      } catch (err) {
        console.error('[NoReturnRuleDialog] 加载失败', err);
        this.$message.error('加载不返件规则失败：' + (err && err.message ? err.message : ''));
      }
    },
    parseConditionJson (jsonStr) {
      if (!jsonStr) return this.getDefaultCondition();
      try {
        return typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      } catch (e) {
        return this.getDefaultCondition();
      }
    },
    getDefaultCondition () {
      return {
        outerLogic: 'OR',
        conditions: [{
          logic: 'AND',
          dataList: [{ field: '', operator: '=', value: '', fieldType: '', isMultiValue: false }]
        }]
      };
    },
    handleTabClick (tab) {
      // 点击末尾 + tab：拦截后新增规则，不切换到 + tab 本身
      if (tab.name === '__add__') {
        this.handleAddNewTab();
        return;
      }
      this.activeTabName = tab.name;
      this.$nextTick(() => this.loadConditionToCurrentTab());
    },
    handleAddNewTab () {
      const newTabName = `__new_${Date.now()}`;
      this.tabs.push({
        name: newTabName,
        // 用 tabs.length + 1 命名（push 到末尾），与后端 ORDER BY create_time ASC 配合：
        // 保存后新规则 create_time 最新，重新加载时排在列表末尾，标签自动对齐为 "规则{N+1}"
        label: `规则${this.tabs.length + 1}`,
        saved: false,
        id: null,
        conditionJson: this.getDefaultCondition(),
        condKey: ++this.condKeyCounter
      });
      this.activeTabName = newTabName;
    },
    async handleTabRemove (tabName) {
      const tab = this.tabs.find(t => t.name === tabName);
      if (!tab || !tab.saved) {
        this.tabs = this.tabs.filter(t => t.name !== tabName);
        return;
      }
      try {
        await this.$confirm('确定删除该规则吗？删除后不可恢复。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
      } catch (e) {
        return;
      }
      try {
        await api.remove(tab.id);
        this.$message.success('删除成功');
        this.tabs = this.tabs.filter(t => t.name !== tabName);
      } catch (err) {
        console.error('[NoReturnRuleDialog] 删除失败', err);
        this.$message.error('删除失败');
      }
    },
    getCurrentConditionRef () {
      const tab = this.tabs.find(t => t.name === this.activeTabName);
      if (!tab) return null;
      const refKey = 'conditionRef_' + tab.name;
      const r = this.$refs[refKey];
      if (!r) return null;
      return Array.isArray(r) ? r[0] : r;
    },
    loadConditionToCurrentTab () {
      const tab = this.tabs.find(t => t.name === this.activeTabName);
      if (!tab) return;
      this.$nextTick(() => {
        const ref = this.getCurrentConditionRef();
        if (ref) {
          try {
            ref.setConditions(tab.conditionJson);
          } catch (e) {
            console.error('[NoReturnRuleDialog] setConditions failed', e);
          }
        }
      });
    },
    async handleConfirm () {
      const tab = this.tabs.find(t => t.name === this.activeTabName);
      if (!tab) {
        this.$message.warning('请先选择或新增规则');
        return;
      }
      // 防御：即使 props 传错（父组件未传 / v-if 被绕过），没有编辑权限也不允许提交
      if (!this.noReturnRuleEdit) {
        this.$message.warning('您没有新增/编辑不返件规则的权限');
        return;
      }
      const ref = this.getCurrentConditionRef();
      if (!ref) {
        this.$message.warning('条件编辑器未就绪');
        return;
      }
      let conditions;
      try {
        conditions = ref.getConditions();
      } catch (e) {
        this.$message.warning('条件数据异常');
        return;
      }
      if (!conditions || !conditions.conditions || conditions.conditions.length === 0) {
        this.$message.warning('请至少配置一条条件');
        return;
      }
      // 用 ref 上的 validate 统一处理校验：
      //   - 非不返件规则：保持原有"至少一条完整条件"
      //   - 不返件规则：4 个必填字段逐行校验（PART_UNIT_PRICE 额外校验数字格式）
      const validation = ref.validate();
      if (!validation.valid) {
        this.$message.warning(validation.errors[0] || '条件校验失败');
        return;
      }
      this.submitLoading = true;
      try {
        // 后端 addOrUpdate 返回新增/更新后的规则 ID
        //   - 编辑场景：返回值与 tab.id 相同，prevActiveTabName 也能命中，仍停留原 tab
        //   - 新增场景：返回值是新分配的 ID，prevActiveTabName 是 __new_xxx 临时名不会命中，
        //     需要把 newId 传给 initTabs 作为兜底，避免被强制跳回 tabs[0]
        const newId = await api.addOrUpdate({
          id: tab.id,
          conditionJson: JSON.stringify(conditions)
        });
        this.$message.success(tab.id ? '修改成功' : '新增成功');
        this.initTabs(newId);
      } catch (err) {
        console.error('[NoReturnRuleDialog] 保存失败', err);
        this.$message.error('保存失败');
      } finally {
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-body {
  min-height: 380px;
  padding: 10px 0;
}
.empty-tip {
  text-align: center;
  color: #999;
  padding: 80px 0;
  font-size: 14px;
}
.dialog-footer {
  text-align: right;
}
.condition-area {
  min-height: 200px;
}
// + tab 标签：包成正方形按钮样式，与【规则1】【规则2】垂直对齐
.add-tab-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #E6E6E5;
  border-radius: 4px;
  font-size: 14px;
  color: #3B3E3B;
  cursor: pointer;
  user-select: none;
  // 与 el-tabs__item 内文本基线对齐
  vertical-align: middle;
  &:hover {
    border-color: var(--leap-color-primary);
    color: var(--leap-color-primary);
  }
}
</style>
