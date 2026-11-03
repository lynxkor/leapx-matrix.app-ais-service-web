# 车辆档案"调整保养信息"编辑模式 设计文档

**日期**: 2026-08-25
**分支**: feature/20260812-resetMaintain
**状态**: 已批准,待实施

---

## 1. 背景与目标

车辆档案"调整保养信息"弹窗 (`InfoDialog`) 中,目前**整车下次保养时间/里程**两个字段一直处于可编辑状态,并且在 `@change` / `@blur` 时通过 `onFieldChange` 自动调用 `updateFlat` 接口保存。这种"边输入边保存"的行为有副作用:

- 误操作立即入库,无确认机会
- 与整车/零件"重置"按钮(显式按钮 + 二次确认)的交互模式不一致
- 字段状态没有"查看/编辑"切换,与系统其他维护类弹窗习惯不符

本次目标: 将这两个字段改为**默认不可编辑**,通过显式的「编辑 → 保存/取消」流程修改。

## 2. 范围

**包含**:

- `InfoDialog/index.vue` 中两个字段默认 `disabled`,由 `isEditing` 状态控制
- 在整车下次保养里程输入框后**新增「编辑」按钮**(无权限控制,常显)
- 现有「重置」按钮逻辑保持不变,仅在查看态显示
- 点击「编辑」进入编辑态:字段启用,显示「保存」「取消」;「编辑」「重置」隐藏
- 点击「保存」调用现有 `updateFlat` 接口,成功后退出编辑态
- 点击「取消」回滚表单到原始值,退出编辑态
- 编辑态下点 X 或遮罩关闭,触发 `before-close` 二次确认
- 移除 `onFieldChange` 自动保存逻辑和 `pendingSave` 状态

**不包含**:

- 后端接口实现
- 父组件 `edit.vue` 改动
- 字段校验规则改动(沿用现有 `validateMileage`)
- `NextTable.vue` 中零件重置逻辑

## 3. 状态机

```
                ┌─────────────┐
                │   查看态    │  isEditing = false
                │ 控件: 禁用  │
                │ 按钮: 编辑  │
                │       重置  │
                └──────┬──────┘
                       │ enterEdit
                       ▼
                ┌─────────────┐
                │   编辑态    │  isEditing = true
                │ 控件: 可编辑│
                │ 按钮: 取消  │
                │       保存  │
                └──────┬──────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   handleCancel    handleSave      beforeClose
   (回滚原值)       (调接口)       (点 X / 遮罩)
        │              │              │
        │              │  失败         │ 取消 = 留在编辑态
        │              ▼              │ 确定 = 关闭 + 丢弃
        │        (留在编辑态)         ▼
        │                         (关闭对话框)
        └──────────────┬──────────────┘
                       ▼
                ┌─────────────┐
                │   查看态    │
                └─────────────┘
```

## 4. 文件改动清单

| 文件 | 类型 | 改动概要 |
|------|------|----------|
| `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` | 修改 | 全部逻辑改动集中此文件 |

## 5. 详细设计

### 5.1 模板 (template)

**字段禁用绑定**:

```vue
<el-date-picker
  v-model="form.nextMaintainDate"
  type="datetime"
  :disabled="!isEditing"
  format="yyyy-MM-dd HH:mm:ss"
  value-format="yyyy-MM-dd HH:mm:ss"
  :clearable="false"
  placeholder="选择日期时间"
/>
```

```vue
<el-input-number
  v-model="form.nextMaintainMileages"
  placeholder="请输入"
  :disabled="!isEditing"
  maxlength="20"
  precision="2"
  min="0"
  :controls="false"
  style="flex: 1; min-width: 0;"
/>
```

**按钮组**(在里程输入框的 flex 容器内,位于里程输入框之后):

```vue
<el-button
  v-if="!isEditing"
  size="small"
  @click="enterEdit"
>编辑</el-button>

<el-button
  v-if="!isEditing && canResetVehicle"
  size="small"
  type="success"
  :loading="resettingVehicle"
  :disabled="saving"
  style="margin-left: 10px; flex-shrink: 0;"
  @click="handleResetVehicle"
>重置</el-button>

<el-button
  v-if="isEditing"
  size="small"
  @click="handleCancel"
>取消</el-button>

<el-button
  v-if="isEditing"
  size="small"
  type="primary"
  :loading="saving"
  style="margin-left: 10px; flex-shrink: 0;"
  @click="handleSave"
>保存</el-button>
```

**el-dialog 配置**:

```vue
<el-dialog
  title="调整保养信息"
  :visible.sync="dialogVisible"
  width="900px"
  :before-close="beforeClose"
  @close="onClose"
>
```

移除 `:close-on-click-modal="false"`(由 `before-close` 统一处理遮罩关闭),或保留均可——保留时 `before-close` 仍会拦截,行为一致。建议**移除**,避免配置重复。

### 5.2 脚本 (script)

**data 改动**:

```js
data () {
  const validateMileage = (rule, value, callback) => {
    if (value !== '' && value !== null && value !== undefined && isNaN(Number(value))) {
      callback(new Error('必须为数字'));
    } else {
      callback();
    }
  };
  return {
    form: {
      nextMaintainDate: null,
      nextMaintainMileages: '',
    },
    originalForm: {
      nextMaintainDate: null,
      nextMaintainMileages: '',
    },
    rules: {
      nextMaintainMileages: [{ validator: validateMileage, trigger: 'blur' }],
    },
    saving: false,        // 保留:用于保存按钮 loading
    resettingVehicle: false, // 保留
    isEditing: false,     // 新增:编辑态标志
    // pendingSave: false, // 移除:不再需要(无自动保存)
  };
},
```

**方法改动**:

| 方法 | 操作 |
|------|------|
| `enterEdit` (新增) | `this.isEditing = true` |
| `handleCancel` (新增) | `this.form = { ...this.originalForm }`;`this.isEditing = false`;`this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate())` |
| `handleSave` (新增) | 见下方伪代码 |
| `beforeClose(done)` (新增) | 见下方伪代码 |
| `onClose` (保留) | `this.dialogVisible = false`;**新增**: `this.isEditing = false`(防止下次打开时仍是编辑态) |
| `onFieldChange` (**删除**) | 自动保存逻辑不再需要 |
| `syncOriginalForm` (保留) | 保存成功后调用,更新原始值 |
| `isNoChange` (保留) | 用于无变更时不调接口 |
| `normalizeDate` / `normalizeMileages` (保留) | 工具方法 |
| `handleResetVehicle` (保留) | 重置按钮逻辑不变 |

**`handleSave` 伪代码**:

```js
async handleSave () {
  if (this.saving) return;
  // 项目中 el-form 使用 callback 风格,包一层 Promise 便于 async/await
  const valid = await new Promise(resolve => {
    this.$refs.formRef.validate((ok) => resolve(ok));
  });
  if (!valid) return;
  if (this.isNoChange()) {
    // 无变更:直接退出编辑态
    this.isEditing = false;
    return;
  }
  this.saving = true;
  try {
    const sentDate = this.normalizeDate(this.form.nextMaintainDate);
    const sentMileages = this.normalizeMileages(this.form.nextMaintainMileages);
    await updateFlat({
      id: this.vehicleProfileId,
      nextMaintainDate: sentDate,
      nextMaintainDateSetNull: !sentDate,
      nextMaintainMileages: sentMileages,
      nextMaintainMileagesSetNull: !sentMileages,
    });
    this.$message.success('保存成功');
    this.syncOriginalForm(sentDate, sentMileages);
    this.isEditing = false;
    this.$emit('update');
  } catch (e) {
    // api 封装层 axios 拦截器已统一弹错误 toast;此处不需额外处理
    // 保留编辑态,用户可调整后重试
  } finally {
    this.saving = false;
  }
}
```

**`beforeClose(done)` 伪代码**:

```js
async beforeClose (done) {
  if (!this.isEditing) {
    done();
    return;
  }
  if (this.isNoChange()) {
    // 编辑态但无修改:直接关闭,不打扰用户
    done();
    return;
  }
  try {
    await this.$confirm('当前有未保存的修改,确定关闭吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    done();
  } catch {
    // 用户取消,留在对话框
  }
}
```

### 5.3 watch 保持不变

`data` 监听器把 `prop.data` 同步到 `form` 和 `originalForm` 的逻辑保留不变。每次父组件传入新 `data` 时,重置 `form` 和 `originalForm` —— 与"打开弹窗时拿到最新值"的语义一致。

注意: `data` 变化时不应强制 `isEditing = false`,否则用户在编辑态时父组件刷新(例如父级定时刷新)会把编辑态打断。**本设计中 `data` 变化时才同步,如果用户在编辑态期间父级刷新,会丢失用户输入**——属于已有风险,本次不解决。

## 6. 边界场景

| 场景 | 期望行为 |
|------|----------|
| 打开弹窗,控件显示最近一次保存的值,禁用 | ✅ 默认 `isEditing = false`,新打开也是 false |
| 点击「编辑」 | 字段启用,按钮切换为「保存/取消」 |
| 编辑后点「保存」,接口成功 | 提示成功,退出编辑态,`originalForm` 更新为新值 |
| 编辑后点「保存」,接口失败 | 提示错误,**保留编辑态**,可重试 |
| 编辑后无任何修改,点「保存」 | 校验通过 → `isNoChange` → 直接退出编辑态,不调接口 |
| 编辑后点「取消」 | 回滚到 `originalForm` 副本,退出编辑态,清校验状态 |
| 编辑态下点 X | `before-close` 拦截,弹确认;取消则留下,确定则关闭并丢弃 |
| 编辑态但无修改,点 X | 直接关闭,不弹确认(`isNoChange` 命中) |
| 查看态点 X | 直接关闭 |
| 编辑态点「重置」 | 「重置」在编辑态被 `v-if` 隐藏,无法触发 |
| 「重置」成功后字段值刷新 | 现有 `handleResetVehicle` 已处理(更新 `form` 和 `originalForm`),逻辑保留 |

## 7. 验证

本项目无前端单测框架(按 `CLAUDE.md`),验证依赖人工 + 静态检查:

- **代码审查**: 检查 4 个新增/修改的方法与 `data` 中字段一致
- **本地启动**: `npm run local` 启动后,手动跑以下场景:
  1. 打开对话框 → 字段禁用,显示「编辑」按钮(及「重置」如有权限)
  2. 点「编辑」 → 字段可编辑,显示「保存」「取消」
  3. 改值后点「保存」 → 弹成功 toast,字段重新禁用,父页面同步更新
  4. 改值后点「取消」 → 字段恢复原值,禁用
  5. 改值后点 X → 弹确认框;选「取消」留在弹窗;选「确定」关闭
  6. 无改动点 X → 直接关闭
  7. 保存失败(可通过临时改后端地址模拟) → 字段保持可编辑,可重试
- **lint**: 项目根目录无独立 lint 命令,遵循既有代码风格(2 空格缩进、语句后分号、模板中方法名驼峰等)

## 8. 风险与回滚

- **风险**: 编辑态下父组件 `data` prop 变化会覆盖用户输入(已有风险,本次不引入新风险)
- **回滚**: 单一文件改动,`git revert` 即可;无需数据库/接口变更
