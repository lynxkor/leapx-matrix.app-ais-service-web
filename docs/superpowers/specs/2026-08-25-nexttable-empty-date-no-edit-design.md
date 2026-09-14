# 零件保养信息子表"空日期不可编辑" 设计文档

**日期**: 2026-08-25
**分支**: feature/20260812-resetMaintain
**状态**: 已批准,待实施

---

## 1. 背景与目标

`NextTable.vue` 零件保养信息子表的行内编辑模式下,日期列(`nextMaintenanceDate`)与里程列(`nextMileage`)默认都可编辑。但有些零件目前没有下次保养日期(后端未计算出保养计划),用户不应在 UI 上凭空填写一个日期——否则可能与后端规则不一致。

**目标**:当某行的 `nextMaintenanceDate` 为空时,点行内「编辑」后,日期列保持只读(跟查看态一样只渲染文本),仅里程列可编辑。

## 2. 范围

**包含**:
- 修改 `NextTable.vue` 日期列模板的 `v-if` 条件,使空日期不进入 `el-date-picker` 分支

**不包含**:
- 后端逻辑变更
- 里程列的编辑行为(无论日期是否为空,里程列都可编辑)
- 保存 / 取消 / 重置逻辑变更
- 列表加载 / 分页逻辑

## 3. 设计

### 3.1 触发条件

- `row.nextMaintenanceDate` 为"空"时:**空** 定义为 `!row.nextMaintenanceDate`(覆盖 `null` / `undefined` / `''`)
- 仅影响该行编辑态下的日期列;其他行不受影响

### 3.2 模板改动

**位置**:`src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` line 25-37

**改动**:在 `<el-date-picker>` 的 `v-if` 中增加 `&& row.nextMaintenanceDate`。其他字符不变。

**改动前**(line 28):
```vue
v-if="isEdit && eidtRowIndex === rowIndex"
```

**改动后**:
```vue
v-if="isEdit && eidtRowIndex === rowIndex && row.nextMaintenanceDate"
```

行为:日期为空 → 不进入 picker 分支 → 落到 `<span v-else>{{ row.nextMaintenanceDate }}</span>`(空文本或占位)。

### 3.3 不动的部分

| 区域 | 行为 |
|------|------|
| 里程列(line 38-51) | 不受本规则影响,任何情况下都可编辑 |
| `saveRowEdit` | 继续传 `{ id, nextMaintenanceDate, nextMileage }`,日期仍为 `null`,后端幂等处理 |
| `cancelEdit` | 继续从 `originTableData` 克隆恢复 |
| `handleResetPart` | 不受影响 |
| 列表加载 / 分页 | 不受影响 |

## 4. 边界场景

| 场景 | 期望 |
|------|------|
| 行有日期,点行内编辑 | 日期列与里程列都可编辑(原行为) |
| 行无日期,点行内编辑 | 仅里程可编辑,日期列显示空文本(跟查看态一致) |
| 行无日期,改里程,点保存 | 调 `editMaintenanceRecord`;`nextMaintenanceDate` 仍为 `null` |
| 行无日期,改里程,点取消 | 恢复 `originRow`,退出编辑态 |
| 编辑保存后再点编辑 | 仍按当前日期是否为空判断 |
| 重置后该行有了日期 | 后续编辑日期字段可用(因为 `row.nextMaintenanceDate` 现在是 truthy) |

## 5. 文件改动清单

| 文件 | 类型 | 改动概要 |
|------|------|----------|
| `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | 修改 | line 28 `v-if` 条件增加 `&& row.nextMaintenanceDate` |

## 6. 验证

- **代码审查**:确认仅改 line 28,无其他附带改动
- **lint-staged**:commit 时自动跑 eslint,确保无 error
- **本地启动 + 浏览器冒烟**:
  1. 打开车辆档案 → 调整保养信息 → 找一个 `nextMaintenanceDate` 为空的零件行 → 点「编辑」→ 确认日期列显示空文本、里程列变成 `el-input-number`
  2. 找一个日期非空的零件行 → 点「编辑」→ 确认日期列仍可编辑(行为不变)
  3. 空日期行改里程 → 点保存 → 调接口成功 → 关闭弹窗 → 重新打开 → 再次编辑 → 仍仅里程可编辑

## 7. 风险与回滚

- **风险**:极低。单行模板条件新增,不动方法、props、API、数据流。
- **回滚**:单 commit 反转即可,无副作用。