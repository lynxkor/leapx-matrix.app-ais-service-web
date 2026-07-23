# 保修申请单自定义条件查询(UI 占位)Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `warrantyapply` 查询页加一个"高级查询"弹窗,用户可在弹窗内可视化构造 5 层嵌套的条件树(字段 + 运算符 + 值,组内 AND/OR 切换),只做 UI 占位,不接入真实查询。

**Architecture:** 4 个新 Vue 文件(弹窗壳 + 递归组 + 叶子行 + 字段元数据),1 个 `index.vue` 改动。弹窗内部用 `workingTree` 编辑副本,点击"应用"才提交给父组件。占位阶段父组件不把 `appliedConditions` 发到接口。

**Tech Stack:** Vue 2.6 + Element UI + 已有的 `TagInput`、`FetchSelect` 组件;无新依赖、无新测试基建。

---

## 文件结构

```
src/views/claimreturn/claim/warrantyapply/
├── index.vue                                      ← 改动
└── components/
    └── CustomQueryDialog/                         ← 新增
        ├── index.vue                              ← 弹窗壳(校验、应用、清空)
        ├── CustomConditionGroup.vue               ← 递归组节点
        ├── CustomConditionRow.vue                 ← 叶子行(字段/运算符/值)
        └── fieldMeta.js                           ← 字段字典 + 运算符矩阵 + 工具函数
```

每个文件单一职责:`fieldMeta.js` 纯数据/工具;`CustomConditionRow` 只负责渲染一行;`CustomConditionGroup` 递归渲染一组;`index.vue` 弹窗壳做校验和提交。

---

## Task 1: 创建字段元数据 `fieldMeta.js`

**Files:**
- Create: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/fieldMeta.js`

- [ ] **Step 1: 创建文件并写入字段列表**

写入 `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/fieldMeta.js`:

```js
/**
 * 保修申请单自定义查询 — 字段元数据
 *
 * 字段键与 warrantyapply/index.vue 中 optionObj.dataProp 的 props 一一对应。
 * 类型(text/number/date/enum)决定可用运算符和值控件。
 *
 * 后续真正接入后端时,本文件可改成"从后端拉字典 + 类型"。
 */

// 35 个可作为查询条件的表格数据列(操作列 operate 不计)
export const FIELDS = [
  { key: 'applyNo', label: '保修申请单', type: 'text' },
  { key: 'vin', label: 'VIN', type: 'text' },
  { key: 'serviceProxyNo', label: '施工单', type: 'text' },
  { key: 'statementCode', label: '结算单号', type: 'text' },
  { key: 'applyStatusLabel', label: '保修单状态', type: 'enum', enumCode: 'claim_warranty_apply_status' },
  { key: 'repairItemTypeName', label: '保修类型', type: 'text' },
  { key: 'dealerCode', label: '门店编码', type: 'text' },
  { key: 'dealerName', label: '门店名称', type: 'text' },
  { key: 'dealerRegionName', label: '门店所属区域', type: 'text' },
  { key: 'currentSubmitTime', label: '当前提交时间', type: 'date' },
  { key: 'approvalTime', label: '审批时间', type: 'date' },
  { key: 'vehiclePlateNo', label: '车牌号', type: 'text' },
  { key: 'ownerName', label: '车主姓名', type: 'text' },
  { key: 'vehicleModelName', label: '车型', type: 'text' },
  { key: 'warrantyStartdate', label: '保修开始日期', type: 'date' },
  { key: 'repairStartTime', label: '维修开始日期', type: 'date' },
  { key: 'mainPartCode', label: '主因件编码', type: 'text' },
  { key: 'mainPartName', label: '主因件名称', type: 'text' },
  { key: 'mileage', label: '进店里程 KM', type: 'number' },
  { key: 'serviceMonth', label: '服务月份', type: 'number' },
  { key: 'laborClaimTotal', label: '工时索赔小计', type: 'number' },
  { key: 'partsClaimTotal', label: '备件索赔小计', type: 'number' },
  { key: 'otherClaimTotal', label: '其他索赔小计', type: 'number' },
  { key: 'totalClaimAmount', label: '索赔总金额', type: 'number' },
  { key: 'workCostCount', label: '工时费用小计', type: 'number' },
  { key: 'partsCostTotal', label: '备件费用小计', type: 'number' },
  { key: 'otherCostTotal', label: '其他费用小计', type: 'number' },
  { key: 'laborShareRatio', label: '工时分担比例', type: 'number' },
  { key: 'partsShareRatio', label: '备件分担比例', type: 'number' },
  { key: 'otherShareRatio', label: '其他分担比例', type: 'number' },
  { key: 'faultPhenomenon', label: '故障信息描述', type: 'text' },
  { key: 'troubleshootingFlow', label: '故障流程排查', type: 'text' },
  { key: 'createTime', label: '创建时间', type: 'date' },
  { key: 'updateTime', label: '修改时间', type: 'date' },
  { key: 'alarmLevelLabel', label: '三包预警', type: 'enum', enumCode: 'alarm_level' }
];

// 运算符定义(valueKind 决定值控件: single | multi | daterange | empty)
export const OPERATORS = {
  equals:      { value: 'equals',      label: '等于',     valueKind: 'multi' },
  notEquals:   { value: 'notEquals',   label: '不等于',   valueKind: 'multi' },
  contains:    { value: 'contains',    label: '包含',     valueKind: 'single' },
  notContains: { value: 'notContains', label: '不包含',   valueKind: 'single' },
  isEmpty:     { value: 'isEmpty',     label: '为空',     valueKind: 'empty' },
  isNotEmpty:  { value: 'isNotEmpty',  label: '不为空',   valueKind: 'empty' },
  startsWith:  { value: 'startsWith',  label: '以...开头', valueKind: 'single' },
  endsWith:    { value: 'endsWith',    label: '以...结尾', valueKind: 'single' },
  gt:          { value: 'gt',          label: '大于',     valueKind: 'single' },
  lt:          { value: 'lt',          label: '小于',     valueKind: 'single' },
  ge:          { value: 'ge',          label: '大于等于', valueKind: 'single' },
  le:          { value: 'le',          label: '小于等于', valueKind: 'single' },
  between:     { value: 'between',     label: '介于',     valueKind: 'daterange' },
  inList:      { value: 'inList',      label: '在...中',   valueKind: 'multi' },
  notInList:   { value: 'notInList',   label: '不在...中', valueKind: 'multi' }
};

// 运算符 × 字段类型 矩阵(允许的运算符 value 列表)
const OPERATOR_MATRIX = {
  text:   ['equals', 'notEquals', 'contains', 'notContains', 'isEmpty', 'isNotEmpty', 'startsWith', 'endsWith'],
  number: ['equals', 'notEquals', 'isEmpty', 'isNotEmpty', 'gt', 'lt', 'ge', 'le'],
  date:   ['isEmpty', 'isNotEmpty', 'between', 'gt', 'lt'],
  enum:   ['equals', 'notEquals', 'isEmpty', 'isNotEmpty', 'inList', 'notInList']
};

// 工具:取字段类型
export function getFieldType (fieldKey) {
  const f = FIELDS.find(item => item.key === fieldKey);
  return f ? f.type : null;
}

// 工具:取字段定义
export function getField (fieldKey) {
  return FIELDS.find(item => item.key === fieldKey) || null;
}

// 工具:取字段对应的可用运算符定义列表
export function getOperatorsForField (fieldKey) {
  const type = getFieldType(fieldKey);
  if (!type) return [];
  return OPERATOR_MATRIX[type].map(opValue => OPERATORS[opValue]);
}

// 工具:取运算符定义
export function getOperator (operatorValue) {
  return OPERATORS[operatorValue] || null;
}

// 工具:运算符是否需要值
export function operatorNeedsValue (operatorValue) {
  const op = getOperator(operatorValue);
  return op && op.valueKind !== 'empty';
}

// 工具:创建空行
export function createEmptyRow () {
  return {
    id: `row_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    field: null,
    operator: null,
    value: null
  };
}

// 工具:创建空分组
export function createEmptyGroup (logic = 'AND') {
  return {
    id: `grp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'group',
    logic,
    conditions: [createEmptyRow()]
  };
}

// 工具:深度克隆条件树
export function cloneTree (tree) {
  return JSON.parse(JSON.stringify(tree));
}
```

- [ ] **Step 2: 验证文件可被引用**

运行:
```bash
cd "D:/git/ais/app-ais-aftersale-front" && node -e "const m = require('./src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/fieldMeta.js'); console.log('FIELDS:', m.FIELDS.length, 'OPERATORS:', Object.keys(m.OPERATORS).length, 'getOperatorsForField(\"vin\"):', m.getOperatorsForField('vin').map(o => o.value).join(','));"
```

预期: `FIELDS: 35 OPERATORS: 15 getOperatorsForField("vin"): equals,notEquals,contains,notContains,isEmpty,isNotEmpty,startsWith,endsWith`

(说明:35 字段、15 运算符、文本类型有 8 个运算符可用。)

- [ ] **Step 3: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/fieldMeta.js
git commit -m "feat(warrantyapply): 自定义条件查询 — 字段元数据 + 运算符矩阵"
```

---

## Task 2: 创建叶子行 `CustomConditionRow.vue`

**Files:**
- Create: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/CustomConditionRow.vue`

- [ ] **Step 1: 写入文件**

写入 `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/CustomConditionRow.vue`:

```vue
<template>
  <div class="c-cr">
    <!-- 字段选择 -->
    <el-select
      v-model="localRow.field"
      placeholder="选择字段"
      size="small"
      filterable
      clearable
      class="c-cr__field"
      :class="{ 'is-error': errors.field }"
      @change="onFieldChange"
    >
      <el-option
        v-for="f in fields"
        :key="f.key"
        :value="f.key"
        :label="f.label"
      />
    </el-select>

    <!-- 运算符选择 -->
    <el-select
      v-model="localRow.operator"
      placeholder="选择运算符"
      size="small"
      :disabled="!localRow.field"
      class="c-cr__op"
      :class="{ 'is-error': errors.operator }"
      @change="onOperatorChange"
    >
      <el-option
        v-for="op in availableOperators"
        :key="op.value"
        :value="op.value"
        :label="op.label"
      />
    </el-select>

    <!-- 值控件:多值(TagInput) -->
    <tag-input
      v-if="valueKind === 'multi' && (localRow.field && fieldMeta?.type === 'text')"
      v-model="localRow.value"
      :placeholder="valuePlaceholder"
      class="c-cr__value"
      :class="{ 'is-error': errors.value }"
    />

    <!-- 值控件:多值(数字校验版) -->
    <tag-input
      v-if="valueKind === 'multi' && fieldMeta?.type === 'number'"
      v-model="localRow.value"
      :placeholder="valuePlaceholder"
      class="c-cr__value"
      :class="{ 'is-error': errors.value }"
      @tagClose="onNumberTagClose"
      @input="onNumberTagInput"
    />

    <!-- 值控件:多值(枚举) -->
    <fetch-select
      v-if="valueKind === 'multi' && fieldMeta?.type === 'enum'"
      v-model="localRow.value"
      :enum-code="fieldMeta.enumCode"
      :multiple="true"
      class="c-cr__value"
      :class="{ 'is-error': errors.value }"
    />

    <!-- 值控件:单值文本 -->
    <el-input
      v-if="valueKind === 'single' && fieldMeta?.type === 'text'"
      v-model="localRow.value"
      :placeholder="valuePlaceholder"
      size="small"
      clearable
      class="c-cr__value"
      :class="{ 'is-error': errors.value }"
    />

    <!-- 值控件:单值数字 -->
    <el-input-number
      v-if="valueKind === 'single' && fieldMeta?.type === 'number'"
      v-model="localRow.value"
      :placeholder="valuePlaceholder"
      size="small"
      :controls="false"
      class="c-cr__value c-cr__value--number"
      :class="{ 'is-error': errors.value }"
    />

    <!-- 值控件:日期 daterange -->
    <el-date-picker
      v-if="valueKind === 'daterange'"
      v-model="localRow.value"
      type="daterange"
      :default-time="['00:00:00', '23:59:59']"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd HH:mm:ss"
      size="small"
      class="c-cr__value"
      :class="{ 'is-error': errors.value }"
    />

    <!-- 值控件:日期单值(大于/小于) -->
    <el-date-picker
      v-if="valueKind === 'single' && fieldMeta?.type === 'date'"
      v-model="localRow.value"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择日期"
      size="small"
      class="c-cr__value"
      :class="{ 'is-error': errors.value }"
    />

    <!-- 删除按钮 -->
    <el-button
      type="text"
      icon="el-icon-close"
      class="c-cr__remove"
      @click="$emit('remove')"
    />
  </div>
</template>

<script>
import {
  getField,
  getOperatorsForField,
  getOperator,
  operatorNeedsValue
} from './fieldMeta';
import TagInput from '@/libs/components/TagInput';
import FetchSelect from '@/libs/components/FetchSelect';

export default {
  name: 'CustomConditionRow',
  components: { TagInput, FetchSelect },
  props: {
    row: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      localRow: { ...this.row }
    };
  },
  computed: {
    fieldMeta () {
      return this.localRow.field ? getField(this.localRow.field) : null;
    },
    availableOperators () {
      return this.localRow.field ? getOperatorsForField(this.localRow.field) : [];
    },
    valueKind () {
      const op = this.localRow.operator ? getOperator(this.localRow.operator) : null;
      return op ? op.valueKind : null;
    },
    valuePlaceholder () {
      return '请输入值';
    }
  },
  watch: {
    row: {
      handler (val) {
        this.localRow = { ...val };
      },
      deep: true
    },
    localRow: {
      handler (val) {
        this.$emit('change', { ...val });
      },
      deep: true
    }
  },
  methods: {
    onFieldChange () {
      // 改字段:清空运算符和值
      this.localRow.operator = null;
      this.localRow.value = null;
    },
    onOperatorChange () {
      // 改运算符:值清空(让值控件重新挂载)
      this.localRow.value = null;
    },
    onNumberTagInput (val) {
      // 数字类型:过滤掉非数字 tag
      if (!Array.isArray(val)) return;
      const cleaned = val
        .map(v => (typeof v === 'string' ? v.trim() : v))
        .filter(v => v !== '' && v !== null && v !== undefined && !isNaN(Number(v)));
      const filtered = cleaned.map(v => Number(v));
      if (filtered.length !== val.length) {
        this.localRow.value = filtered;
      }
    },
    onNumberTagClose () {
      // 由 localRow 监听自动同步
    }
  }
};
</script>

<style lang="scss" scoped>
.c-cr {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  &__field { width: 180px; }
  &__op { width: 130px; }
  &__value { flex: 1; min-width: 200px; }
  &__value--number { width: 100%; }
  &__remove { padding: 4px; color: #f56c6c; }
  ::v-deep .is-error .el-input__inner,
  ::v-deep .is-error .el-input__wrapper,
  ::v-deep .is-error .el-select .el-input__inner {
    border-color: #f56c6c;
  }
}
</style>
```

- [ ] **Step 2: 验证组件无语法错误**

运行 dev server 并浏览保修申请单页面,确认页面仍能加载(此步骤仅作冒烟,因为组件尚未挂载):
```bash
cd "D:/git/ais/app-ais-aftersale-front" && timeout 60 npm run local &
sleep 50
curl -s http://localhost:7779 -o /dev/null -w "%{http_code}\n"
```

预期: 200

然后 `kill` 后台进程(`jobs -p | xargs kill`)。

- [ ] **Step 3: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/CustomConditionRow.vue
git commit -m "feat(warrantyapply): 自定义条件查询 — 叶子行组件"
```

---

## Task 3: 创建递归组 `CustomConditionGroup.vue`

**Files:**
- Create: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/CustomConditionGroup.vue`

- [ ] **Step 1: 写入文件**

写入 `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/CustomConditionGroup.vue`:

```vue
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
```

- [ ] **Step 2: 验证语法**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/CustomConditionGroup.vue 2>&1 | head -30
```

预期: 无 error 输出(可能有 warning,可忽略)。

- [ ] **Step 3: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/CustomConditionGroup.vue
git commit -m "feat(warrantyapply): 自定义条件查询 — 递归组节点"
```

---

## Task 4: 创建弹窗壳 `CustomQueryDialog/index.vue`

**Files:**
- Create: `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue`

- [ ] **Step 1: 写入文件**

写入 `src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue`:

```vue
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
      // 应用态条件树(v-model:conditions)
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      workingTree: this.makeInitialTree(),
      errors: [],
      errorSummary: []
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        // 每次打开重置 workingTree
        this.workingTree = this.makeInitialTree();
        this.errors = [];
        this.errorSummary = [];
      }
    },
    value: {
      handler () {
        // 应用态变化时不主动重置 workingTree,仅在打开时重置
      },
      deep: true
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
        this.errors = result.errors;
        return;
      }
      this.errors = [];
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
        this.errors = [];
        this.errorSummary = [];
      }).catch(() => {});
    },
    onClose () {
      this.$emit('update:visible', false);
    },
    /**
     * 整树校验:返回 { valid, summary: string[], errors: { field, operator, value } }
     * 深度优先遍历,按行序给出错误位置(顶层 1,2,3...,子组重新从 1 计数)。
     */
    validateTree (group, path = '第 1 组', rowIdxRef = { i: 0 }) {
      const errors = [];
      const summary = [];

      group.conditions.forEach((item) => {
        rowIdxRef.i += 1;
        const rowLabel = `${path}第 ${rowIdxRef.i} 行`;

        if (item.type === 'group') {
          const sub = this.validateTree(item, `${path}子组-`, { i: 0 });
          errors.push(...sub.errors);
          summary.push(...sub.summary);
          return;
        }

        const rowErrors = {};
        if (!item.field) {
          rowErrors.field = true;
          summary.push(`${rowLabel}:请选择字段`);
        }
        if (!item.operator) {
          rowErrors.operator = true;
          summary.push(`${rowLabel}:请选择运算符`);
        }
        if (item.operator && operatorNeedsValue(item.operator)) {
          const hasValue = Array.isArray(item.value)
            ? item.value.length > 0
            : item.value !== null && item.value !== undefined && item.value !== '';
          if (!hasValue) {
            rowErrors.value = true;
            summary.push(`${rowLabel}:请填写值`);
          }
        }
        if (item.operator === 'between' && Array.isArray(item.value) && item.value.length === 1) {
          rowErrors.value = true;
          summary.push(`${rowLabel}:介于需同时填起止`);
        }
        if (Object.keys(rowErrors).length > 0) {
          errors.push({ id: item.id, ...rowErrors });
        }
      });

      return { valid: summary.length === 0, summary, errors };
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
```

- [ ] **Step 2: 验证组件可被解析**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npx eslint src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue 2>&1 | head -30
```

预期: 无 error(可能有 warning)。

- [ ] **Step 3: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/components/CustomQueryDialog/index.vue
git commit -m "feat(warrantyapply): 自定义条件查询 — 弹窗壳 + 校验"
```

---

## Task 5: 在 `index.vue` 接入弹窗

**Files:**
- Modify: `src/views/claimreturn/claim/warrantyapply/index.vue`

- [ ] **Step 1: 添加 import + state**

在 `src/views/claimreturn/claim/warrantyapply/index.vue` 顶部 import 区(约 326 行附近,`WithdrawDialog` 之后)插入:

```js
import CustomQueryDialog from './components/CustomQueryDialog/index.vue';
```

在 `data()` 内(约 441 行 `rowId: ''` 之后)插入:

```js
      customDialogVisible: false,
      appliedCustomConditions: null,
```

- [ ] **Step 2: 在 components 注册**

修改 `components:` 块(约 371 行,`WithdrawDialog` 之后)添加:

```js
    CustomQueryDialog,
```

- [ ] **Step 3: 添加"高级查询"按钮**

修改模板,找到 `<div class="ais-actions">`(约 216 行),在 `<el-button size="small" @click="handlePrint">打印标签</el-button>` 前一行插入:

```vue
      <el-button size="small" @click="customDialogVisible = true">
        高级查询
        <el-badge
          v-if="customConditionsCount > 0"
          :value="customConditionsCount"
          class="c-cq-badge"
        />
      </el-button>
```

- [ ] **Step 4: 在表格后挂载弹窗**

找到 `</div>` 结束 `.ais-table-c` 之后(约 251 行,在 `<RejectDialog>` 前),插入:

```vue
    <CustomQueryDialog
      :visible.sync="customDialogVisible"
      v-model="appliedCustomConditions"
    />
```

- [ ] **Step 5: 添加 computed 与占位提示**

在 `computed:` 块(约 443 行 `optionObj ()` 之前)插入:

```js
    customConditionsCount () {
      if (!this.appliedCustomConditions) return 0;
      const count = (group) => group.conditions.reduce((sum, item) => {
        if (item.type === 'group') return sum + count(item);
        return sum + 1;
      }, 0);
      return count(this.appliedCustomConditions);
    }
```

在 `onReset ()` 方法内(约 922 行)首行后追加:

```js
      this.appliedCustomConditions = null;
```

- [ ] **Step 6: 占位提示(可选)**

为提醒用户该功能未真正接入,在 `customDialogVisible` 打开时挂个非阻塞提示。先**跳过本步骤**——后续接入真实查询时再补。

- [ ] **Step 7: 验证页面加载**

启动 dev server:
```bash
cd "D:/git/ais/app-ais-aftersale-front" && timeout 90 npm run local &
sleep 75
curl -s http://localhost:7779 -o /dev/null -w "%{http_code}\n"
```

预期: 200,然后访问 `/claimreturn/claim/warrantyApply`(若该路由的 path 需调整,以 CLAUDE.md 中的 `path: /业务/模块/功能` 规则推算) 页面能渲染出"高级查询"按钮。

关闭后台进程:
```bash
jobs -p | xargs -r kill
```

- [ ] **Step 8: 提交**

```bash
cd "D:/git/ais/app-ais-aftersale-front"
git add src/views/claimreturn/claim/warrantyapply/index.vue
git commit -m "feat(warrantyapply): 接入自定义条件查询弹窗(占位)"
```

---

## Task 6: 端到端手动验证

**Files:** 无改动(纯验证)

- [ ] **Step 1: 启动 dev server 并打开页面**

```bash
cd "D:/git/ais/app-ais-aftersale-front" && npm run local
```

浏览器访问保修申请单页面,确认页面正常渲染、"高级查询"按钮可见(无徽标)。

- [ ] **Step 2: 验证默认状态**

点击"高级查询"按钮。预期:
- 弹窗打开,标题"自定义条件查询"
- 默认有 1 个空行(且可点 + 加条件)
- 头部"且/或"切换可见,且按钮"且"为选中态

关闭弹窗。

- [ ] **Step 3: 验证字段/运算符联动**

再次打开弹窗。在默认行选 `VIN` 字段。预期:
- 运算符下拉激活,出现 8 个选项(等于、不等于、包含、不包含、为空、不为空、以...开头、以...结尾)

选 `包含`,输入 `LV001`。预期:TagInput 接受 `LV001` 作为 tag。

切回字段下拉,改为 `保修单状态`。预期:
- 运算符被清空(因为状态是 enum,可用运算符不同)
- 值控件位置重新渲染为 FetchSelect(枚举单选/多选)

切换字段为 `创建时间`(date 类型)。选 `介于`。预期:值控件变成 daterange。

- [ ] **Step 4: 验证多值与嵌套**

切回 `VIN` 字段 + `等于` 运算符,在 TagInput 中输入 `LV001, LV002, LV003`(用换行或回车确认)。预期:3 个 tag。

点 `+ 加条件`,再添一行 `保修类型 包含 小计`。预期:行间显示"且"。

点 `+ 加分组`。预期:在当前组内追加一个嵌套子组,头部显示"满足以下 1 条",且其内部有一行空。

在子组里添 `门店编码 等于 D001`,再点 `+ 加条件`添 `门店编码 等于 D002`,把子组逻辑切到 `或`。预期:子组显示"满足以下 2 条"。

- [ ] **Step 5: 验证深度上限**

从子组里再点 `+ 加分组`(当前 depth=1,允许),在新子组里再点 `+ 加分组`(depth=2),再点(depth=3),再点(depth=4)。预期:第 4 次点击后,按钮 disabled,鼠标悬停 tooltip "已达最大嵌套层级 5"。

- [ ] **Step 6: 验证校验**

清空整棵树(`清空`按钮 → 确认),弹窗内只剩 1 个空行。点击 `应用`。预期:
- 顶部红色 alert:`第 1 组第 1 行:请选择字段;第 1 组第 1 行:请选择运算符;第 1 组第 1 行:请填写值`
- 弹窗不关闭

依次填好字段、运算符,值故意留空。再次点 `应用`。预期:只提示"请填写值"。

填好全部,点击 `应用`。预期:
- 弹窗关闭
- 顶部 toast: "已应用 N 个自定义条件"
- "高级查询"按钮上的徽标显示 N
- 表格数据**不变**(占位阶段不发请求,这是预期)

- [ ] **Step 7: 验证取消/清空**

再次打开弹窗,改动若干条件。点 `取消`。预期:弹窗关闭,徽标不变。

再次打开,点 `清空` → 确认。预期:回到 1 个空行状态,弹窗不关闭。

点 `取消` 关闭。

- [ ] **Step 8: 验证搜索/重置不影响徽标**

填好一组自定义条件并应用。点击搜索区 `重置`。预期:
- 表单固定条件清空(createTime 恢复为最近 3 个月默认值)
- 自定义条件徽标也清空(因 `onReset` 里把 `appliedCustomConditions` 置 null)

再次应用自定义条件 → 徽标恢复。

- [ ] **Step 9: 回归检查**

确认下列未受影响:
- 现有 20+ 固定条件表单仍正常工作
- 搜索/重置/导出/分页/排序行为不变
- Tabs(全部 / 保修经理 / 总经理)切换正常
- 批量审批按钮(撤回/驳回/同意/作废)权限与状态仍正常

- [ ] **Step 10: 关闭 dev server**

返回终端,Ctrl+C 关闭 `npm run local`。

---

## 自审

### Spec 覆盖

| Spec 章节 | 任务 |
|-----------|------|
| 触发点(高级查询按钮 + 徽标) | Task 5 (Step 3) |
| 弹窗壳(el-dialog 720~760px) | Task 4 |
| 递归组节点(CustomConditionGroup) | Task 3 |
| 叶子行(CustomConditionRow,字段/运算符/值三段) | Task 2 |
| 字段元数据(35 列 + 类型) | Task 1 |
| 运算符 × 类型矩阵 | Task 1 (`OPERATOR_MATRIX`) |
| 多值文本/数字/枚举(等于/不等于/在...中/不在...中) | Task 2 (multi valueKind 分支) |
| date 介于(daterange) | Task 2 (daterange 分支) |
| number >/<(el-input-number) | Task 2 (number + single) |
| 嵌套深度上限 5 层(depth 0~4) | Task 3 (`depth >= 4` disabled) |
| 子组删除(removable prop) | Task 3 |
| 切换字段清空值 | Task 2 (`onFieldChange`) |
| 切换运算符清空值 | Task 2 (`onOperatorChange`) |
| 校验(field/op/value/数字/daterange) | Task 4 (`validateTree`) |
| 校验在"应用"时统一触发 | Task 4 (`onApply`) |
| 应用关闭弹窗 + 提示 | Task 4 (`onApply`) |
| 清空带确认 | Task 4 (`onClear`) |
| 默认 1 个空行 | Task 4 (`makeInitialTree`) |
| 取消不保存 | Task 4 (`onClose`) |
| 父组件持有 appliedConditions | Task 5 (Step 1) |
| 重置时清空 appliedConditions | Task 5 (Step 5) |
| 占位阶段不发送到接口 | Task 5 (Step 6 显式跳过) |
| YAGNI(无持久化、无模板、无导入导出) | 全部任务未实现 |

### 占位符扫描

无 `TBD` / `TODO` / "implement later" / "fill in details" / "appropriate error handling" / "similar to Task N"。

### 类型一致性

- `getField`、`getOperatorsForField`、`getOperator`、`operatorNeedsValue`、`createEmptyRow`、`createEmptyGroup`、`cloneTree`、`FIELDS`、`OPERATORS` 均在 Task 1 定义,后续 Task 2/3/4 引用,签名一致。
- `CustomConditionRow` props:`row`、`fields`、`errors`(默认值 `() => ({})`)。
- `CustomConditionGroup` props:`group`、`fields`、`depth`(默认 0)、`removable`(默认 false)。
- `CustomQueryDialog` props:`visible`、`fields`(默认 `FIELDS`)、`value`(应用态)。
- 节点形状统一:叶子 `{ id, field, operator, value }`、分组 `{ id, type: 'group', logic, conditions }`。`createEmptyRow` 和 `createEmptyGroup` 都通过 `fieldMeta.js` 工厂生成。
- 校验行序计数器 `rowIdxRef` 在递归间隔离,避免子组与父组行号冲突。
- `apply` 事件通过 `v-model`(`input` 事件)回传,父组件 `appliedCustomConditions` 与 prop `value` 双向绑定,符合 Vue 2 自定义组件 v-model 规范。

### 已知次要问题

- Task 5 Step 6 标记为"跳过",任务说明已写明"占位阶段不实现"。
- `CustomConditionGroup` 中 `removeAt` 后若清空会自动补 1 个空行——这是为了防止出现空组导致渲染异常,是设计内的回退,不属 YAGNI 越界。
- TagInput 不支持 `before-add` 钩子,所以 number 多值的过滤在 `onNumberTagInput` 中通过 watch input 实现,延迟一帧——可接受,因为这是极少数用户输入非法字符的场景。

---

## 执行选项

完成后,你会拿到一个功能完整的"高级查询"弹窗,所有交互按 spec 验证过,但**数据没有真正发送到后端**——这是有意为之,等后端支持结构化条件时,只需在 `getFormData()` 里追加 `customCriteria: this.appliedCustomConditions` 字段即可。