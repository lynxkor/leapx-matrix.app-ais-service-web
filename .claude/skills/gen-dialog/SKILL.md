---
name: gen-dialog
description: Generate Vue dialog components from MasterGo design images or screenshots. Use this skill when users want to create el-dialog components based on design screenshots. Provide the image URL or MasterGo short link to generate production-ready Vue dialog code. Automatically extracts form fields, layout structure, and styling from the design.
---

## Overview

This skill generates Vue 2 dialog components (el-dialog) from MasterGo design images. It uses the MasterGo MCP to extract DSL data and converts it to production-ready code following project conventions.

## Usage

```
/gen-dialog <image-url-or-mastergo-link>
```

Examples:
- `/gen-dialog https://mastergo.com/file/xxx?layer_id=yyy`
- `/gen-dialog https://mastergo.com/goto/xxxxx`
- `/gen-dialog <image-path>`
- `/gen-dialog` (with image attachment)

---

## Workflow

### Step 1: Parse Input

Detect input type:
- **MasterGo short link**: `https://{domain}/goto/xxxxx`
- **MasterGo file/layer URL**: `https://mastergo.com/file/{fileId}?layer_id={layerId}`
- **Local image path**: Read image directly and analyze
- **Image attachment**: Analyze attached screenshot

If image provided without MasterGo link, analyze the image directly to understand the dialog structure.

### Step 2: Fetch Design DSL (if MasterGo link provided)

Use MCP tool `mcp__getDsl` with the provided link:

```
mcp__getDsl({
  shortLink: "https://mastergo.com/goto/xxxxx"
})
```

Or with fileId and layerId:
```
mcp__getDsl({
  fileId: "xxx",
  layerId: "yyy"
})
```

The tool returns:
- DSL JSON data with component structure
- Generation rules to follow

### Step 3: Analyze Structure

Parse the design to extract:

1. **Dialog properties**:
   - Title (from text content or layer name)
   - Width (from frame dimensions, default 500px)
   - Content layout

2. **Form fields**:
   - Field labels (from text nodes)
   - Input types (text, select, date, radio, checkbox, textarea)
   - Layout (inline form or vertical)
   - Required fields (from validation hints)

3. **Footer buttons**:
   - Cancel button
   - Confirm button
   - Additional buttons

4. **Styling**:
   - Colors, spacing, typography
   - Custom CSS classes

### Step 4: Generate Component Code

Create the Vue component following project conventions.

---

## Component Priority

### @/libs/components (优先使用)

| 组件 | 用途 | 示例 |
|------|------|------|
| `BaseInput` | 文本输入框，自动带 maxlength 限制 | `<base-input v-model="form.name" />` |
| `FetchSelect` | 下拉选择框，支持枚举/API/远程搜索 | `<fetch-select v-model="form.type" :enumCode="'TYPE_ENUM'" />` |
| `AisAttachment` | 文件上传组件 | `<AisAttachment :businessId="id" />` |
| `TagInput` | 标签输入框 | `<tag-input v-model="form.tags" />` |
| `EditTable` | 可编辑表格 | `<EditTable :data="form.list" />` |
| `BaseTabs` | 标签页组件 | `<BaseTabs :tabs="tabs" />` |
| `BaseSearch` | 搜索组件 | `<BaseSearch @search="onSearch" />` |
| `dateranges` | 日期范围选择器 | `<dateranges v-model="form.dateRange" />` |

### element-ui 组件

| 组件 | 用途 | 场景 |
|------|------|------|
| `el-dialog` | 弹窗容器 | 弹窗基础组件 |
| `el-form` | 表单容器 | 表单布局 |
| `el-form-item` | 表单项 | 表单字段包装 |
| `el-radio-group` | 单选组 | 二选一/多选一场景 |
| `el-checkbox-group` | 多选组 | 多选场景 |
| `el-date-picker` | 日期选择器 | 单日期/日期范围 |
| `el-button` | 按钮 | 提交/取消等操作 |
| `el-select` | 下拉框 | 简单静态选项（无 FetchSelect 时使用） |
| `el-input` | 输入框 | 简单场景（无 BaseInput 时使用） |

---

## Component Mapping (DSL → Vue)

| UI元素类型 | 优先组件 | 备选组件 |
|-----------|---------|---------|
| 文本输入 | `base-input` | `el-input` |
| 多行文本 | `base-input type="textarea"` | `el-input type="textarea"` |
| 下拉选择（枚举） | `fetch-select :enumCode` | `el-select` |
| 下拉选择（远程） | `fetch-select remote` | `el-select remote` |
| 单选 | `el-radio-group` | - |
| 多选 | `el-checkbox-group` | - |
| 日期选择 | `el-date-picker` | - |
| 日期范围 | `dateranges` | `el-date-picker type="daterange"` |
| 文件上传 | `AisAttachment` | - |
| 标签输入 | `tag-input` | - |

---

## Code Style

- 2 spaces indentation
- Semicolons after statements
- Spaces around function parentheses: `function name () {}`
- BEM naming for CSS classes: `.m-{name}-dialog`
- Use theme color: `var(--leap-color-primary)`

---

## Form Patterns

### Text Input
```vue
<el-form-item label="字段名：" prop="fieldName">
  <base-input
    placeholder="请输入"
    v-model="form.fieldName"
    clearable
  />
</el-form-item>
```

### Textarea
```vue
<el-form-item label="备注：" prop="remark">
  <base-input
    type="textarea"
    placeholder="请输入"
    v-model="form.remark"
    :rows="4"
  />
</el-form-item>
```

### Select (Enum)
```vue
<el-form-item label="类型：" prop="type">
  <fetch-select
    v-model="form.type"
    :enumCode="'TYPE_ENUM'"
    placeholder="请选择"
    clearable
  />
</el-form-item>
```

### Select (Remote Search)
```vue
<el-form-item label="门店：" prop="storeId">
  <fetch-select
    filterable
    clearable
    remote
    reserve-keyword
    v-model="form.storeId"
    :remote-method="storeSearch"
    :params="form.storeName"
    @change="handleStoreChange"
    value-key="id"
    label-key="name"
  />
</el-form-item>
```

### Radio Group
```vue
<el-form-item label="状态：" prop="status">
  <el-radio-group v-model="form.status">
    <el-radio label="0">启用</el-radio>
    <el-radio label="1">停用</el-radio>
  </el-radio-group>
</el-form-item>
```

### Date Picker
```vue
<el-form-item label="日期：" prop="date">
  <el-date-picker
    v-model="form.date"
    type="date"
    placeholder="选择日期"
    value-format="yyyy-MM-dd"
  />
</el-form-item>
```

### File Upload
```vue
<el-form-item label="附件：" prop="attachFileList">
  <AisAttachment
    ref="attachment"
    :businessId="businessId"
    @upload-loading-change="loadingChange"
  />
</el-form-item>
```

---

## Template Structure

```vue
<template>
  <el-dialog
    class="m-xxx-dialog"
    :title="dialogTitle"
    width="500px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="dialog-content">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="form-edit"
      >
        <!-- Form items -->
      </el-form>
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="submitLoading"
          @click="submit"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import BaseInput from '@/libs/components/BaseInput/index.vue';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';

const defaultForm = {
  // form fields
};

export default {
  name: 'XxxDialog',
  components: {
    BaseInput,
    FetchSelect,
    AisAttachment,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    businessId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      uploadLoading: false,
      form: { ...defaultForm },
      rules: {
        // validation rules
      }
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (!val) {
        this.onReset();
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.onReset();
    },
    submit () {
      this.$refs.ruleForm?.validate(async (valid) => {
        if (!valid) return;
        this.submitLoading = true;
        const submitData = { ...this.form };
        this.$emit('confirm', submitData);
        this.submitLoading = false;
      });
    },
    onReset () {
      this.$refs.ruleForm?.resetFields();
      this.form = { ...defaultForm };
    },
    loadingChange (loading) {
      this.uploadLoading = loading;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-xxx-dialog {
  ::v-deep .el-dialog__body {
    padding: 20px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
```

---

## CSS Patterns

```scss
.m-xxx-dialog {
  ::v-deep .el-dialog__body {
    max-height: 70vh;
    padding: 20px;
  }

  .el-form-item {
    width: 50% !important;
    &.form-item-full {
      width: 100% !important;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
```

---

## Usage Example

```vue
<!-- Parent component -->
<template>
  <div>
    <el-button @click="dialogVisible = true">打开弹窗</el-button>

    <XxxDialog
      :visible.sync="dialogVisible"
      :businessId="currentId"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import XxxDialog from './XxxDialog/index.vue';

export default {
  components: { XxxDialog },
  data () {
    return {
      dialogVisible: false,
      currentId: ''
    };
  },
  methods: {
    handleConfirm (data) {
      console.log('提交数据:', data);
      // 调用API
    }
  }
};
</script>
```

---

## Output Format

After generation, provide:

1. **Component file path** - 建议的文件路径
2. **Complete Vue component code** - 完整组件代码
3. **Usage example** - 父组件使用示例
4. **Import statements** - 需要的组件引入