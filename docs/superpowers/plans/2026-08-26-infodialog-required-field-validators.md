# 整车保养信息必填校验 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `InfoDialog` 中对整车「下次保养时间」「下次保养里程」两个字段增加必填校验:实时提示(change/blur 触发)+ 保存时阻断(空值不允许提交)。

**Architecture:** 在 `data()` 中新增 `validateDate` 函数,扩展 `validateMileage` 增加空值分支,把 `rules` 由 1 条(mileage)补到 2 条(both fields),均带 `required: true` 与 `trigger: ['blur', 'change']`。不动模板、按钮、handleSave(已有 `if (!valid) return;` 拦截)、API 调用。

**Tech Stack:** Vue 2 + Element UI (`el-form`, `async-validator`)+ 中文错误信息。

---

## 设计参考与基线

- **设计文档**:`docs/superpowers/specs/2026-08-26-infodialog-required-field-validators-design.md`
- **目标文件**:`src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue`
- **改动段**:`data()` 块(line 139-163)
- **不改**:模板、按钮、`handleSave`、`originalForm` / `syncOriginalForm`、API

## 文件结构总览

| 类别 | 路径 | 变更 |
|------|------|------|
| 弹窗 | `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` | `data()` 块:新增 `validateDate`,扩展 `validateMileage`,补 `rules` 2 条 |

## Commit 切分建议

| Commit | 任务 | 范围 |
|--------|------|------|
| `feat(InfoDialog): 整车保养时间与里程加必填校验` | Task 1 | `data()` validators + rules |
| `chore(verify): 本地启动完成冒烟测试` | Task 2 | 浏览器人工验证 |

---

## 全局约束

- 缩进 2 空格,语句加 `;`,函数括号前后空格,文件末尾保留换行符。
- 样式变量:`@/libs/assets/style/variables.scss`;BEM 命名;主题色 `var(--leap-color-primary)`。
- 组件优先级:`@/libs/components` > element-ui;API 调用统一 `api.jsonPost`(本次不新增 API)。
- 不引入新依赖,不修改 `package.json`。
- **本计划不编写自动化测试**。本仓库对 Vue 组件无单测基建,验证方式为 `lint-staged`(commit 时自动跑 eslint)+ 本地浏览器冒烟测试。
- 错误文案:沿用项目具体化风格(非 Element UI 默认「必填」),用「请选择下次保养时间」「请输入下次保养里程」。
- `*SetNull` flag 本轮**不动**(已成死代码,留作未来清理 PR)。

---

## Task 1: data() 中加 validators 与 rules

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue:139-163`(`data()` 块)

### Step 1.1: 替换 `data()` 块(line 139-163 整段)

**位置**:`<script>` 段 `export default { data () { ... }, ... }` 中的 `data()` 函数体

**现状**(line 139-163):
```javascript
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
      saving: false,
      resettingVehicle: false,
      isEditing: false,
    };
  },
```

**改为**:
```javascript
  data () {
    const validateDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择下次保养时间'));
      } else {
        callback();
      }
    };
    const validateMileage = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        callback(new Error('请输入下次保养里程'));
        return;
      }
      if (isNaN(Number(value))) {
        callback(new Error('必须为数字'));
        return;
      }
      callback();
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
        nextMaintainDate: [{ required: true, validator: validateDate, trigger: ['blur', 'change'] }],
        nextMaintainMileages: [{ required: true, validator: validateMileage, trigger: ['blur', 'change'] }],
      },
      saving: false,
      resettingVehicle: false,
      isEditing: false,
    };
  },
```

**校验**:
- 保存文件后,本段与设计文档 §3.3 字面一致
- 新增 `validateDate` 函数与 `validateMileage` 平级
- `validateMileage` 多了空值分支(早返回)
- `rules` 由 1 条变 2 条,均带 `required: true` 与 `trigger: ['blur', 'change']`

### Step 1.2: 静态自检

打开文件,确认:
- `data()` 块已按 Step 1.1 更新
- 其他行(模板、methods、watch、computed、style)无附带改动
- 文件末尾保留换行符

在文件内 grep 期望保留的方法(确认未误删):

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
grep -n "enterEdit\|handleCancel\|handleSave\|beforeClose\|isNoChange\|handleResetVehicle" "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
```

预期:6 个方法名均有命中(其中 `handleResetVehicle` 含自身实现 + 在 `saving` 守卫处出现,行号会变化)。

### Step 1.3: 启动本地 dev server 人工验证

**命令**:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
npm run local
```

**人工验证步骤**:

1. **场景 V**——打开车辆档案 → 「调整保养信息」弹窗(有值)→ 点编辑 → 清空 mileage → 控件下方立即红字「请输入下次保养里程」。
2. **场景 W**——改回合法 mileage → 红字消失。
3. **场景 X**——清空两个字段 → 点保存 → 弹红字提示 + 不调接口 + 保留编辑态。
4. **场景 Y**——两个字段都填上 → 点保存 → 正常调接口 + 保存成功 toast + 退出编辑态。
5. **场景 Z**——输入非数字 mileage(若绕过 el-input-number 校验)→ 红字「必须为数字」。
6. **场景 AA**——点重置(权限允许时)→ 字段被填值,无错误红字。

**任意场景失败**:停下来,排查后再继续;不要提交 Task 1 的 commit。

### Step 1.4: 提交 Task 1

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git add "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit -m "feat(InfoDialog): 整车保养时间与里程加必填校验"
```

预期输出:commit 成功,hash 不为空。

**注意**:lint-staged 会自动跑 eslint;若失败,按报错修复再重试 commit。

---

## Task 2: 集成冒烟测试与归档

**Files:** 无改动,只验证。

### Step 2.1: 跑完整 6 场景回归

将 Task 1 的 6 个场景(V–AA)合并跑一遍,确认全部通过。

记录每个场景的验证结果。

### Step 2.2: 检查 git 历史与差异

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git log --oneline -3
git diff HEAD~1 -- "src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue"
```

**预期**:
- log 最近 1 条为 Task 1 的 commit
- diff 仅触及 `data()` 块,其他无改动

### Step 2.3: 提交验证记录(可选)

如需在 git 中留痕:

```bash
cd "D:\work\code\ais\app-ais-aftersale-front"
git -c user.name=方海鹏 -c user.email=方海鹏@local commit --allow-empty -m "chore(verify): 6 个场景冒烟测试通过"
```

否则跳过本步,直接报告完成。

---

## 自审记录(写计划时复核)

- **spec 覆盖**:
  - §3.1 触发模式 → Step 1.1 trigger `['blur', 'change']` ✓
  - §3.2 错误文案 → Step 1.1 字面一致 ✓
  - §3.3 代码改动 → Step 1.1 完整呈现 ✓
  - §3.4 handleSave 不动 → Step 1.1 不动 ✓
  - §3.5 SetNull flag 保留 → Step 1.1 未改 ✓
  - §4 边界场景 → Step 1.3 场景 V–AA ✓

- **占位符扫描**:无 TBD / TODO / 留白代码块。

- **类型 / 方法名一致性**:
  - `validateDate` / `validateMileage` 命名与 spec 一致 ✓
  - `rules.nextMaintainDate` / `rules.nextMaintainMileages` 字段名与 form/originalForm 一致 ✓
  - 6 个方法名(`enterEdit` / `handleCancel` / `handleSave` / `beforeClose` / `isNoChange` / `handleResetVehicle`)未改名 ✓