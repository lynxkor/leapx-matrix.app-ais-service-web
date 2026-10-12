# 零件保养信息子表"保存校验兜底" 设计文档

**日期**: 2026-08-26
**分支**: feature/20260812-resetMaintain
**状态**: 已批准,待实施
**关联 spec**: `2026-08-26-nexttable-non-null-no-clear-design.md`(本 spec 是其兜底补充)

---

## 1. 背景与目标

`docs/superpowers/specs/2026-08-26-nexttable-non-null-no-clear-design.md` 通过在 `<el-date-picker>` 与 `<el-input-number>` 上加 `:clearable="false"` 阻止用户通过 X 按钮清除已填字段。**冒烟测试发现**:用户仍可通过**键盘 backspace / 直接编辑**等方式绕过 X 按钮,把字段清空后保存。这违反了"原数据非空则不能置空"的业务规则。

**目标**:在 `saveRowEdit` 入口加显式校验,作为兜底防御:若原数据 `nextMaintenanceDate` 或 `nextMileage` 非空,但当前编辑后值为空,弹错误提示并保留编辑态,不调接口。

## 2. 范围

**包含**:
- `NextTable.vue` `saveRowEdit` 方法顶部增加 4 行校验逻辑
- 校验失败时弹 `$message.error` toast 并 `return`,不调接口、不退出编辑态

**不包含**:
- 模板改动(`:clearable="false"` 保留作为预防 UX)
- 错误信息用 toast 而非 el-form 内联红字(NextTable 不是 el-form,加 el-form 复杂度高)
- `cancelEdit` / `editRow` / `handleResetPart` / `getDetailPageApi` / API

## 3. 设计

### 3.1 校验逻辑

**位置**:`src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` `saveRowEdit` 方法顶部(line 208 之前)

**当前实现**:
```javascript
saveRowEdit (row, rowIndex) {
  editMaintenanceRecord({
    id: row.id,
    nextMaintenanceDate: row.nextMaintenanceDate,
    nextMileage: row.nextMileage,
  }).then(() => {
    this.$message.success('保存成功');
    this.originTableData = cloneDeep(this.tableData);
    this.eidtRowIndex = -1;
    this.$emit('update');
  });
},
```

**改动后**:
```javascript
saveRowEdit (row, rowIndex) {
  const origin = this.originTableData.find(r => r.id === row.id);
  // 若原数据日期非空,当前值不能为空
  if (origin && origin.nextMaintenanceDate && !row.nextMaintenanceDate) {
    this.$message.error('下次保养日期不能为空');
    return;
  }
  // 若原数据里程非空,当前值不能为空
  if (origin && origin.nextMileage && (row.nextMileage === '' || row.nextMileage === null || row.nextMileage === undefined)) {
    this.$message.error('下次保养里程不能为空');
    return;
  }
  editMaintenanceRecord({
    id: row.id,
    nextMaintenanceDate: row.nextMaintenanceDate,
    nextMileage: row.nextMileage,
  }).then(() => {
    this.$message.success('保存成功');
    this.originTableData = cloneDeep(this.tableData);
    this.eidtRowIndex = -1;
    this.$emit('update');
  });
},
```

### 3.2 与整车 `InfoDialog` 必填校验的差异

| 维度 | 整车 InfoDialog | 零件 NextTable |
|------|----------------|----------------|
| 校验触发 | `el-form` `:rules` + `formRef.validate()` 自动 | `saveRowEdit` 手动检查 |
| 错误展示 | 控件下方红字 | `$message.error` toast |
| 必备条件 | 始终非空(无论原值) | **仅当原值非空**时不能为空 |

### 3.3 双层防护(保留 `:clearable="false"`)

| 防护层 | 阻止什么 |
|--------|----------|
| `:clearable="false"`(预防)| 用户点 X 按钮 |
| `saveRowEdit` 校验(兜底)| 用户键盘 backspace / 直接编辑清空后保存 |

两层都保留,作为互补防御。

### 3.4 不动的部分

| 区域 | 行为 |
|------|------|
| 模板(2 个 `:clearable` 属性) | 不动 |
| 其他列(零件名称 / 代码 / 里程类型 / 操作栏) | 不动 |
| `cancelEdit` / `editRow` / `handleResetPart` / `getDetailPageApi` | 不动 |
| `originTableData` 数据流 | 不动 |
| API (`editMaintenanceRecord`) | 不动 |

## 4. 边界场景

| 场景 | 期望 |
|------|------|
| 原 date 非空,手动清空后点保存 | toast「下次保养日期不能为空」,保留编辑态,不调接口 |
| 原 date 非空,X 清空后点保存 | toast 报错(本 spec 兜底) |
| 原 date 为 null,无 picker 渲染 | 不进入校验分支 |
| 原 date 非空,日期合法点保存 | 正常保存,`originTableData` 同步 |
| 原 mileage 非空,backspace 清空后点保存 | toast「下次保养里程不能为空」 |
| 原 mileage 为 null,无值 | 不进入校验分支 |
| 原 mileage 非空,X 清空后点保存 | toast 报错 |
| 两字段都合法 | 正常保存 |
| 校验失败时 | 保留 `eidtRowIndex`(不退出编辑态),用户可以继续修改 |

## 5. 文件改动清单

| 文件 | 类型 | 改动概要 |
|------|------|----------|
| `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | 修改 | `saveRowEdit` 顶部增加 4 行校验逻辑 |

## 6. 验证

- **代码审查**:仅 `saveRowEdit` 方法,~10 行新增(含原方法)
- **lint-staged**:commit 时自动跑 eslint
- **本地启动 + 浏览器冒烟**(本 spec 新增):
  1. 打开车辆档案 → 「调整保养信息」弹窗 → 找一个有 date 的零件行 → 点编辑 → 键盘 backspace 清空 date(绕过 X 按钮) → 点保存 → toast 报错 + 保留编辑态
  2. 找一个有 mileage 的零件行 → 点编辑 → 键盘清空 mileage → 点保存 → toast 报错 + 保留编辑态
  3. 校验失败后用户填回合法值 → 点保存 → 正常保存
  4. 字段都合法点保存 → 正常保存(回归原有场景)

## 7. 风险与回滚

- **风险**:极低。仅 `saveRowEdit` 顶部增加 4 行 + 1 个本地 `origin` 变量。
- **回滚**:单 commit 反转即可。
- **副作用**:无 API 改动,数据流不变;`originTableData` 是已有数据结构,直接复用。

## 8. 与前序 spec 的关系

- **前序 spec**:`2026-08-26-nexttable-non-null-no-clear-design.md`(commit `91b8e85e`)提供了"预防 UX"(`:clearable="false"`)。
- **本 spec**:作为"兜底防御",捕获绕过 X 按钮的清空路径(如键盘 backspace、直接编辑)。
- **两者并存**:不互相替代,共同构成完整防御。