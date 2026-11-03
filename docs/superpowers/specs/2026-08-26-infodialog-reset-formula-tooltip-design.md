# 车辆档案"调整保养信息"重置公式说明 ⓘ 设计文档

**日期**: 2026-08-26
**分支**: feature/20260812-resetMaintain
**状态**: 已批准,待实施

---

## 1. 背景与目标

`InfoDialog` 提供整车重置与零件子表重置(`NextTable.vue`)两类重置能力。当前用户无法直观了解重置后字段的**计算公式**——即下次保养时间/里程是基于什么算出来的。

**目标**:在弹窗标题("调整保养信息")右侧增加一个 ⓘ 图标,鼠标悬停时弹出说明文案,展示两类重置的计算公式。

## 2. 范围

**包含**:
- 修改 `InfoDialog/index.vue` 标题区,移除 `title` prop,改用 `title` slot
- 在标题右侧增加 `el-tooltip` 包裹的 ⓘ 图标(基于 `<i class="el-icon-info">`)
- tooltip 内容展示整车与零部件两种重置的计算公式
- 新增 scoped 样式(标题图标 + tooltip 内容排版)

**不包含**:
- `NextTable.vue` 改动(本轮不在零件行重复加 ⓘ)
- 弹窗其他字段、按钮、状态、方法、props 改动
- `canResetVehicle` 权限(ⓘ 始终显示,不受权限控制——公式属于文档性信息)
- i18n / 多语言(本次只支持中文)

## 3. 设计

### 3.1 文案(与产品图保持一致)

```
车辆的保养重置:
下次保养时间 = 重置触发的时间 + 下次保养计算时间(月)
下次保养里程 = 重置时的车联网里程 + 下次保养计算里程(km)

零部件的保养重置:
下次保养时间 = 重置触发的时间 + 定期保养时间间隔(月)
下次保养里程 = 重置时的车联网里程/车联网里程数(增) + 定期保养里程间隔(km)
```

### 3.2 模板改动

**位置**:`src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` 顶部 `<el-dialog>` 标签(line 2-8)

**改动前**:
```vue
<el-dialog
  title="调整保养信息"
  :visible.sync="dialogVisible"
  width="900px"
  :before-close="beforeClose"
  @close="onClose"
>
```

**改动后**:
```vue
<el-dialog
  :visible.sync="dialogVisible"
  width="900px"
  :before-close="beforeClose"
  @close="onClose"
>
  <template slot="title">
    <span class="dialog-title-text">调整保养信息</span>
    <el-tooltip
      placement="top"
      effect="light"
      popper-class="reset-formula-tooltip"
    >
      <i class="el-icon-info dialog-title-icon" />
      <template slot="content">
        <div class="reset-formula">
          <div class="reset-formula-section">
            <div class="reset-formula-title">车辆的保养重置:</div>
            <div>下次保养时间 = 重置触发的时间 + 下次保养计算时间(月)</div>
            <div>下次保养里程 = 重置时的车联网里程 + 下次保养计算里程(km)</div>
          </div>
          <div class="reset-formula-section">
            <div class="reset-formula-title">零部件的保养重置:</div>
            <div>下次保养时间 = 重置触发的时间 + 定期保养时间间隔(月)</div>
            <div>下次保养里程 = 重置时的车联网里程/车联网里程数(增) + 定期保养里程间隔(km)</div>
          </div>
        </div>
      </template>
    </el-tooltip>
  </template>
```

### 3.3 样式改动(scoped)

**位置**:同一文件 `<style lang="scss" scoped>` 段

**新增**(line 282+ 后):
```scss
.dialog-title-text {
  font-weight: 600;
  margin-right: 8px;
}
.dialog-title-icon {
  cursor: help;
  color: #909399;
  font-size: 16px;
  vertical-align: middle;
  &:hover {
    color: var(--leap-color-primary, #4C4CD6);
  }
}
.reset-formula-tooltip {
  max-width: 360px;
  .reset-formula {
    line-height: 1.6;
    font-size: 12px;
  }
  .reset-formula-section {
    & + .reset-formula-section {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #ebeef5;
    }
  }
  .reset-formula-title {
    font-weight: 600;
    margin-bottom: 2px;
  }
}
```

### 3.4 不动的部分

| 区域 | 行为 |
|------|------|
| 表单字段(`<el-form>` 段) | 不动 |
| 编辑模式 / 按钮 | 不动 |
| `<next-table>` 子组件 | 不动 |
| props / data / methods / watch / API | 不动 |
| `canResetVehicle` 权限控制 | ⓘ **始终**可见(不受权限门控) |

## 4. 边界场景

| 场景 | 期望 |
|------|------|
| 弹窗打开 | 标题显示 "调整保养信息 ⓘ",tooltip 默认不显 |
| 鼠标移到 ⓘ 上 | 立即弹出公式(整车 + 零部件 两段) |
| 鼠标移走 | tooltip 自动关闭 |
| 弹窗拖动、缩放 | 标题随弹窗移动,ⓘ 位置稳定 |
| 弹窗宽度调整至 < 360px | tooltip `max-width: 360px` 限制,过长文案自然换行 |
| 用户无 `canResetVehicle` 权限 | ⓘ 仍显示,公式为文档性说明 |

## 5. 文件改动清单

| 文件 | 类型 | 改动概要 |
|------|------|----------|
| `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` | 修改 | 模板 `title` slot;新增样式块 ~20 行 |

## 6. 验证

- **代码审查**:仅 `InfoDialog/index.vue` 文件,1 处模板改动 + 1 处样式追加
- **lint-staged**:commit 时自动跑 eslint,确保模板字符串 + scss 无 error
- **本地启动 + 浏览器冒烟**:
  1. 打开车辆档案 → 「调整保养信息」弹窗 → 标题右侧出现 ⓘ 图标
  2. 鼠标移到 ⓘ → 弹出两段公式(整车 + 零部件),中间有分割线
  3. 鼠标移走 → tooltip 自动关闭
  4. 在 ⓘ 上点击 → 无任何额外动作(纯 hover 触发)
  5. 弹窗拖动 / 缩放 → 标题与 ⓘ 位置稳定

## 7. 风险与回滚

- **风险**:极低。`el-dialog` 官方支持 `title` slot;`el-tooltip` 是 Element UI 标准组件。
- **回滚**:单 commit 反转即可,无副作用。
- **样式 scope 警告**:`popper-class` 在 `<style scoped>` 下无法直接 scoped,但 popper 默认挂到 `<body>`——这意味着全局生效。在项目中若其他模块同名类需要防范冲突,可改用全局样式块或在 popper-class 加前缀(本次用 `reset-formula-tooltip`,已具区分度)。