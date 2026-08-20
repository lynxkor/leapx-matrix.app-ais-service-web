# 车辆档案"调整保养信息"重置功能 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `app-ais-aftersale-front` 的"调整保养信息"弹窗中,新增整车与零件保养信息的"重置"按钮,调用后端 `MaintenanceRemindController#resetVehicle` / `resetPart` 按当前车联网里程重算下次保养里程/时间,并用返回数据刷新弹窗与车档页展示。

**Architecture:** 在 `InfoDialog/index.vue` 整车下次保养里程输入框后新增重置按钮,在 `NextTable.vue` 操作栏编辑按钮后新增零件重置按钮。两者均使用 `this.$confirm` (Element UI) 二次确认,流程: `getCarInfo(vin)` → 拼装确认文案 → `$confirm` → `resetVehicle/resetPart` → 用返回数据更新弹窗 form 与父页面 form。新建 `src/api/maintain/basic/maintenanceRemind/index.js` 封装两个接口。`edit.vue` 父页面通过 `vin` 与 `canReset` (来自现有 `modifyMaintenanceRecord` 权限字段) prop 向下透传,避免子组件重复加载权限。

**Tech Stack:** Vue 2 + Element UI + VXE Table + `api.jsonPost` (axios 封装) + `this.$confirm` + Element UI MessageBox。

---

## 设计参考与基线

- **设计文档**:`docs/superpowers/specs/2026-08-20-vehicle-profile-maintenance-reset-design.md`
- **现有参考实现**:
  - `src/api/maintain/sp/serviceProxy/index.js` (getCarInfo, line 74-76)
  - `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` (弹窗)
  - `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` (零件子表)
  - `src/views/datacenter/vehicle/vehicleProfile/edit.vue` (父页面,`onInfo()` / `onInfoSuccess()` / `modifyMaintenanceRecord` 权限)
- **后端接口(已知)**:
  - `MaintenanceRemindController#resetVehicle` (入参 `{ vin }`)
  - `MaintenanceRemindController#resetPart` (入参 `{ vin, maintenancePartCode }`)
  - `ServiceProxyController#getCarInfo` (返回 `{ mileage, oilMileage, ... }`)

## 文件结构总览

| 类别 | 路径 | 变更 |
|------|------|------|
| 新增 API | `src/api/maintain/basic/maintenanceRemind/index.js` | 封装 `resetVehicle` + `resetPart` |
| 弹窗 | `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue` | 新增 `vin`/`canReset` props、整车重置按钮、`resettingVehicle` 状态、`handleResetVehicle` 方法、`vehicle-reset` emit、向内嵌 NextTable 透传 props |
| 零件子表 | `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue` | 新增 `vin`/`canReset` props、操作栏重置按钮、`resettingRowId` 状态、`handleResetPart` 方法 |
| 父页面 | `src/views/datacenter/vehicle/vehicleProfile/edit.vue` | `InfoDialog` 透传 `vin`/`can-reset`、监听 `vehicle-reset` 同步父 form |

## Commit 切分建议

| Commit | 任务 | 范围 |
|--------|------|------|
| `feat(api): 封装 maintenanceRemind 模块的 resetVehicle 与 resetPart` | Task 1 | 新建 API 文件 |
| `feat(InfoDialog): 整车下次保养里程增加重置按钮与二次确认流程` | Task 2-5 | InfoDialog 整车重置 |
| `feat(NextTable): 零件列表操作栏增加重置按钮与二次确认流程` | Task 6-8 | NextTable 零件重置 |
| `feat(edit): 透传 vin/canReset 并同步 vehicle-reset 回写父表单` | Task 9 | edit.vue 父页面 |
| `chore(verify): 启动本地 dev server 完成冒烟测试` | Task 10 | 集成验证 |

> Task 2-5 都改 `InfoDialog/index.vue`,合并为单个 commit 以减少噪音;Task 6-8 同理合并。

---

## 全局约束

- 缩进 2 空格,语句加 `;`,文件末尾保留换行符。
- 样式变量:`@/libs/assets/style/variables.scss`;BEM 命名;主题色 `var(--leap-color-primary)`。
- 组件优先级:`@/libs/components` > element-ui;API 调用统一 `api.jsonPost`。
- 不引入新依赖,不修改 `package.json`。
- **本计划不编写自动化测试**。本仓库对 Vue 组件无单测基建,验证方式为 `eslint` + 本地浏览器冒烟测试;`lint-staged` 会在 commit 时自动跑 `eslint`,任何 error 都会阻断 commit。
- 重置接口的入参/返回字段以设计文档 §3 为准;实施时若后端实际字段不同,以 **后端实际字段** 为准并同步更新设计文档。

---

## Task 1: 新增 `maintenanceRemind` API 封装

**Files:**
- Create: `src/api/maintain/basic/maintenanceRemind/index.js`

---

### Step 1.1: 写最小可运行空文件,验证 lint 通过

**位置**:新建文件

```javascript
import api from '@/axios';

const prefix = 'maintain/web/basic/maintenanceRemind/';

/**
 * 重置整车保养里程和时间
 * @param {Object} data - { vin }
 */
export function resetVehicle (data) {
  return api.jsonPost(prefix + 'resetVehicle', data);
}

/**
 * 重置零件保养里程和时间
 * @param {Object} data - { vin, maintenancePartCode }
 */
export function resetPart (data) {
  return api.jsonPost(prefix + 'resetPart', data);
}
```

### Step 1.2: 校验 lint

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
npx eslint src/api/maintain/basic/maintenanceRemind/index.js
```

预期:无错误,无警告(空函数体/未使用变量均不存在)。

### Step 1.3: 提交

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
git add src/api/maintain/basic/maintenanceRemind/index.js
git commit -m "feat(api): 封装 maintenanceRemind 模块的 resetVehicle 与 resetPart"
```

---

## Task 2-5: InfoDialog 整车重置(合并为一个 commit)

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue`

---

### Step 2.1: 在 `<script>` 中 import 新 API

**位置**:第 38-42 行附近

将原代码:

```javascript
<script>
import moment from 'moment';
import NextTable from '../NextTable.vue';
import { updateFlat } from '@/api/datacenter/vehicle/vehicleProfile';

export default {
```

改为:

```javascript
<script>
import moment from 'moment';
import NextTable from '../NextTable.vue';
import { updateFlat } from '@/api/datacenter/vehicle/vehicleProfile';
import { resetVehicle } from '@/api/maintain/basic/maintenanceRemind';
import { getCarInfo } from '@/api/maintain/sp/serviceProxy';

export default {
```

### Step 2.2: 新增 `vin` 与 `canReset` props

**位置**:`props:` 块内,在 `vehicleProfileId` 之后(第 56 行后)新增两项:

```javascript
    vin: {
      type: String,
      default: '',
    },
    canReset: {
      type: Boolean,
      default: false,
    },
```

最终 `props` 块(第 48-66 行)应如下:

```javascript
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vehicleProfileId: {
      type: [String, Number],
      default: null,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    vin: {
      type: String,
      default: '',
    },
    canReset: {
      type: Boolean,
      default: false,
    },
  },
```

### Step 2.3: 新增 `resettingVehicle` 状态

**位置**:第 70-85 行 `data () { return { ... } }`

在 `pendingSave: false,` 之后新增一行:

```javascript
      pendingSave: false,
      resettingVehicle: false,
```

### Step 2.4: 新增 `handleResetVehicle` 方法

**位置**:`methods:` 块内,在 `onFieldChange` 方法之前(第 107 行)新增:

```javascript
    async handleResetVehicle () {
      if (this.resettingVehicle || this.saving) return;
      if (!this.vin) {
        this.$message.warning('缺少车辆 VIN,无法重置');
        return;
      }
      this.resettingVehicle = true;
      try {
        const carInfo = await getCarInfo(this.vin);
        const totalMileage = carInfo && carInfo.mileage;
        if (totalMileage === null || totalMileage === undefined || totalMileage === '') {
          this.$message.warning('未获取到车联网里程,无法重置');
          return;
        }
        await this.$confirm(
          `当前车联网里程(总)为 ${totalMileage} km,是否确定重置?`,
          '重置确认',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        );
        const res = await resetVehicle({ vin: this.vin });
        this.form.nextMaintainDate = res.nextMaintainDate && moment(res.nextMaintainDate).isValid()
          ? moment(res.nextMaintainDate).format('YYYY-MM-DD HH:mm:ss')
          : null;
        this.form.nextMaintainMileages = res.nextMaintainMileages ?? '';
        this.originalForm = { ...this.form };
        this.$message.success('重置成功');
        this.$emit('vehicle-reset', res);
        this.$emit('update');
      } catch (e) {
        if (e === 'cancel' || e?.message === 'cancel') return;
        this.$message.error(e?.message || '重置失败');
      } finally {
        this.resettingVehicle = false;
      }
    },
```

### Step 2.5: 在 `<template>` 中为 `nextMaintainMileages` 输入框后增加重置按钮

**位置**:第 20-28 行 `<el-form-item label="下次保养里程:">` 块

将原代码:

```vue
      <el-form-item label="下次保养里程：" prop="nextMaintainMileages">
        <el-input
          clearable
          v-model="form.nextMaintainMileages"
          placeholder="请输入"
          maxlength="20"
          @change="onFieldChange"
        />
      </el-form-item>
```

改为:

```vue
      <el-form-item label="下次保养里程：" prop="nextMaintainMileages">
        <el-input
          clearable
          v-model="form.nextMaintainMileages"
          placeholder="请输入"
          maxlength="20"
          @change="onFieldChange"
          style="width: calc(100% - 80px);"
        />
        <el-button
          v-if="canReset"
          size="small"
          type="primary"
          plain
          :loading="resettingVehicle"
          :disabled="saving"
          style="margin-left: 10px;"
          @click="handleResetVehicle"
        >重置</el-button>
      </el-form-item>
```

### Step 2.6: 向内嵌 `<next-table>` 透传 `vin` 与 `canReset`

**位置**:第 30-34 行

将原代码:

```vue
    <next-table
      :id="vehicleProfileId"
      :isEdit="true"
      @update="$emit('update')"
    />
```

改为:

```vue
    <next-table
      :id="vehicleProfileId"
      :vin="vin"
      :canReset="canReset"
      :isEdit="true"
      @update="$emit('update')"
    />
```

### Step 2.7: 校验 lint

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
npx eslint src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue
```

预期:无错误,无警告。

### Step 2.8: 提交

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
git add src/views/datacenter/vehicle/vehicleProfile/InfoDialog/index.vue
git commit -m "feat(InfoDialog): 整车下次保养里程增加重置按钮与二次确认流程"
```

---

## Task 6-8: NextTable 零件重置(合并为一个 commit)

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/NextTable.vue`

---

### Step 6.1: 在 `<script>` 中 import 新 API

**位置**:第 99-103 行

将原代码:

```javascript
<script>
import { vehicleProfileMaintenanceRecordPage, editMaintenanceRecord } from '@/api/datacenter/vehicle/vehicleProfile';
import permissions from '@/libs/mixins/permissions';
import { cloneDeep } from 'lodash';
```

改为:

```javascript
<script>
import { vehicleProfileMaintenanceRecordPage, editMaintenanceRecord } from '@/api/datacenter/vehicle/vehicleProfile';
import { resetPart } from '@/api/maintain/basic/maintenanceRemind';
import { getCarInfo } from '@/api/maintain/sp/serviceProxy';
import permissions from '@/libs/mixins/permissions';
import { cloneDeep } from 'lodash';
```

### Step 6.2: 新增 `vin` 与 `canReset` props

**位置**:`props:` 块内(第 105-116 行),在 `isEdit` 之后新增两项:

```javascript
    isEdit: {
      type: Boolean,
      default: false,
    },
    vin: {
      type: String,
      default: '',
    },
    canReset: {
      type: Boolean,
      default: false,
    },
```

最终 `props` 块应如下:

```javascript
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    vin: {
      type: String,
      default: '',
    },
    canReset: {
      type: Boolean,
      default: false,
    }
  },
```

### Step 6.3: 新增 `resettingRowId` 状态

**位置**:第 125-137 行 `data () { return { ... } }`

在 `loading: false,` 之后新增一行:

```javascript
      loading: false,
      resettingRowId: null,
```

### Step 6.4: 新增 `handleResetPart` 方法

**位置**:`methods:` 块内,在 `saveRowEdit` 之后(第 201 行后)新增:

```javascript
    async handleResetPart (row) {
      if (this.resettingRowId || this.eidtRowIndex !== -1) return;
      if (!this.vin || !row.maintenancePartCode) {
        this.$message.warning('缺少 VIN 或零件代码,无法重置');
        return;
      }
      // mileageType 为后端枚举 MileageTypeEnum 的 code: TOTAL_MILEAGE / EXTENDED_MILEAGE
      const mileageType = row.mileageType;
      this.resettingRowId = row.id;
      try {
        const carInfo = await getCarInfo(this.vin);
        let mileageValue;
        let mileageLabel;
        if (mileageType === 'EXTENDED_MILEAGE') {
          mileageValue = carInfo && carInfo.oilMileage;
          mileageLabel = '增';
          if (mileageValue === null || mileageValue === undefined || mileageValue === '') {
            this.$message.warning('该车辆暂无增程里程数据');
            return;
          }
        } else if (mileageType === 'TOTAL_MILEAGE') {
          mileageValue = carInfo && carInfo.mileage;
          mileageLabel = '总';
          if (mileageValue === null || mileageValue === undefined || mileageValue === '') {
            this.$message.warning('未获取到车联网里程,无法重置');
            return;
          }
        } else {
          this.$message.error('零件里程类型异常,无法重置');
          return;
        }
        await this.$confirm(
          `当前车联网里程数(${mileageLabel})为 ${mileageValue} km,是否确定重置?`,
          '重置确认',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        );
        const res = await resetPart({
          vin: this.vin,
          maintenancePartCode: row.maintenancePartCode,
        });
        const idx = this.tableData.findIndex(r => r.id === row.id);
        if (idx !== -1) {
          this.tableData[idx].nextMaintenanceDate = res.nextMaintenanceDate;
          this.tableData[idx].nextMileage = res.nextMileage;
          const oIdx = this.originTableData.findIndex(r => r.id === row.id);
          if (oIdx !== -1) {
            this.originTableData[oIdx] = cloneDeep(this.tableData[idx]);
          }
        }
        this.$message.success('重置成功');
        this.$emit('update');
      } catch (e) {
        if (e === 'cancel' || e?.message === 'cancel') return;
        this.$message.error(e?.message || '重置失败');
      } finally {
        this.resettingRowId = null;
      }
    },
```

> **枚举值已确认**:`MileageTypeEnum` 包含 `TOTAL_MILEAGE(10, "总里程")` 与 `EXTENDED_MILEAGE(20, "增程里程")`,`row.mileageType` 存的是 code 值。

### Step 6.5: 在操作栏 `<template v-else>` 内"编辑"按钮后增加"重置"按钮

**位置**:第 68-75 行

将原代码:

```vue
        <template v-else>
          <span
            class="action-button btn-edit"
            @click="editRow(row, rowIndex)"
          >
            编辑
          </span>
        </template>
```

改为:

```vue
        <template v-else>
          <span
            class="action-button btn-edit"
            @click="editRow(row, rowIndex)"
          >
            编辑
          </span>
          <span
            v-if="canReset && row.maintenancePartCode && resettingRowId !== row.id"
            class="action-button btn-reset"
            @click="handleResetPart(row)"
          >
            重置
          </span>
          <span
            v-else-if="canReset && row.maintenancePartCode && resettingRowId === row.id"
            class="action-button btn-reset-loading"
          >
            重置中...
          </span>
        </template>
```

### Step 6.6: 在 `<style>` 中追加 `btn-reset` 与 `btn-reset-loading` 样式

**位置**:第 215-231 行 `<style scoped>`

将原代码:

```scss
.action-button {
  margin: 0 5px;
  cursor: pointer;
  &.btn-edit {
    color: #4C4CD6;
  }
  &.btn-delete {
    color: #b91919;
  }
}
```

改为:

```scss
.action-button {
  margin: 0 5px;
  cursor: pointer;
  &.btn-edit {
    color: #4C4CD6;
  }
  &.btn-delete {
    color: #b91919;
  }
  &.btn-reset {
    color: #c97a16;
  }
  &.btn-reset-loading {
    color: #999;
    cursor: not-allowed;
  }
}
```

### Step 6.7: 校验 lint

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
npx eslint src/views/datacenter/vehicle/vehicleProfile/NextTable.vue
```

预期:无错误,无警告。

### Step 6.8: 提交

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
git add src/views/datacenter/vehicle/vehicleProfile/NextTable.vue
git commit -m "feat(NextTable): 零件列表操作栏增加重置按钮与二次确认流程"
```

---

## Task 9: edit.vue 父页面透传与同步

**Files:**
- Modify: `src/views/datacenter/vehicle/vehicleProfile/edit.vue`

---

### Step 9.1: 修改 `<info-dialog>` 标签,透传 `vin` 与 `canReset`,监听 `vehicle-reset`

**位置**:第 816-822 行(已确认存在)

将原代码:

```vue
        <info-dialog
          v-if="infoDialogVisible"
          :visible.sync="infoDialogVisible"
          :vehicleProfileId="form.id"
          :data="infoDialogData"
          @update="onInfoSuccess"
        />
```

改为:

```vue
        <info-dialog
          v-if="infoDialogVisible"
          :visible.sync="infoDialogVisible"
          :vehicleProfileId="form.id"
          :data="infoDialogData"
          :vin="form.vin"
          :canReset="modifyMaintenanceRecord"
          @vehicle-reset="onVehicleReset"
          @update="onInfoSuccess"
        />
```

> **说明**:`form.vin` 是 `edit.vue` 中真实存在的车辆识别(已确认 line 16-17、621-622、716-717 在多处使用)。`modifyMaintenanceRecord` 是父页面已初始化的权限字段(line 1082)。`canReset` 与 `vehicleProfileId` 在模板中用 camelCase 写法(与 InfoDialog prop 定义一致)。

### Step 9.2: 新增 `onVehicleReset` 方法

**位置**:`methods:` 块内,在 `onInfoSuccess` 之后(第 1198-1201 行已确认)

将原代码:

```javascript
    onInfoSuccess () {
      this.$refs?.nextTable?.getDetailPageApi();
      this.$refs?.containerRef?.loadDetail();
    },
```

改为:

```javascript
    onInfoSuccess () {
      this.$refs?.nextTable?.getDetailPageApi();
      this.$refs?.containerRef?.loadDetail();
    },
    onVehicleReset (res) {
      if (!res) return;
      this.form.nextMaintainDate = res.nextMaintainDate;
      this.form.nextMaintainMileages = res.nextMaintainMileages;
    },
```

### Step 9.3: 校验 lint

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
npx eslint src/views/datacenter/vehicle/vehicleProfile/edit.vue
```

预期:无错误,无警告。

### Step 9.4: 提交

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
git add src/views/datacenter/vehicle/vehicleProfile/edit.vue
git commit -m "feat(edit): 透传 vin/canReset 并同步 vehicle-reset 回写父表单"
```

---

## Task 10: 本地启动与冒烟测试

**Files:** 无文件改动,纯手动验证。

---

### Step 10.1: 启动本地 dev server

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
npm run local
```

预期:dev server 启动成功,控制台无 module 解析错误,无 ESLint warning。

### Step 10.2: 浏览器打开车档列表并进入详情

1. 浏览器访问 `http://localhost:7779`
2. 进入车辆档案列表 → 选择任一车辆 → 进入详情
4. 找到"保养信息"区块(参考 line 230-233 的"调整保养信息"按钮)
5. 点击"调整保养信息"按钮,弹窗打开

预期:

- 弹窗正常打开
- "下次保养里程"输入框后出现"重置"按钮(蓝色,plain 样式)
- 弹窗下方零件列表操作栏出现"重置"按钮(每行)

### Step 10.3: 整车重置冒烟测试

1. 点击整车"重置"按钮
2. 观察 loading 状态
3. 二次确认弹窗出现,文案: `当前车联网里程(总)为 XXXX km,是否确定重置?`(XXXX 为真实车联网里程)
4. 点击"确定"
5. 观察弹窗 `nextMaintainDate` 与 `nextMaintainMileages` 是否更新
6. 关闭弹窗,确认车档详情页 `下次保养时间/里程` 是否同步更新
7. 再次打开弹窗,确认 `originalForm` 已同步(直接关闭不触发自动保存)

### Step 10.4: 零件重置冒烟测试(总里程)

1. 在零件列表找一个 `mileageTypeLabel` 为"总里程"的行
2. 点击该行"重置"
3. 二次确认弹窗出现,文案: `当前车联网里程数(总)为 XXXX km,是否确定重置?`
4. 点击"确定"
5. 观察该行 `nextMaintenanceDate` 与 `nextMileage` 是否更新
6. 关闭弹窗,确认车档详情页的零件子表对应行是否同步更新

### Step 10.5: 零件重置冒烟测试(增程里程)

1. 在零件列表找一个 `mileageTypeLabel` 为"增程里程"的行
2. 点击该行"重置"
3. 二次确认弹窗出现,文案: `当前车联网里程数(增)为 XXXX km,是否确定重置?`
4. 点击"确定"
5. 观察该行 `nextMaintenanceDate` 与 `nextMileage` 是否更新

### Step 10.6: 失败场景测试

1. **取消按钮**:打开重置二次确认后,点"取消",确认无任何 UI 变化
2. **getCarInfo 失败**:临时把 `vin` 改为无效值(如 `'INVALID'`),点击重置,确认 `$message.error` 提示,弹窗不打开二次确认
3. **空里程字段**:若数据里有 mileage/oilMileage 为空的车辆,点击对应重置,确认 `$message.warning('未获取到车联网里程,无法重置')`

### Step 10.7: 权限验证

1. 在浏览器开发者工具中临时移除 `modifyMaintenanceRecord` 数据字段(模拟无权限)
3. 重新打开"调整保养信息"弹窗
4. 确认整车重置按钮与零件行重置按钮均不显示

### Step 10.8: 提交验证记录(可选)

若以上全部通过,在该 commit 上追加一行注释:

```bash
cd "D:/work/code/ais/app-ais-aftersale-front"
git log --oneline -5
```

无需额外操作。

---

## 附录:完成判定

- ✅ Task 1-9 所有 commit 全部通过 lint
- ✅ Task 10 全部冒烟用例通过
- ✅ 与设计文档 §6.5 边界条件一致(空里程、无效 VIN 等均有友好提示)
- ✅ 无新增 TODO/占位符

## 已知风险

1. **`resetVehicle` / `resetPart` 的返回字段**:设计文档 §3 假设 `nextMaintainDate`/`nextMaintainMileages`/`nextMaintenanceDate`/`nextMileage`,若后端实际字段不同,需调整 `handleResetVehicle` 与 `handleResetPart` 中的赋值语句。
2. **`form.vin` 字段名**:已确认是 `form.vin`,无需替换。

> 以下两点已核实,不再列为风险:
> - `row.mileageType` = 后端枚举 code,`TOTAL_MILEAGE` / `EXTENDED_MILEAGE`(详见 Step 6.4)
> - `getCarInfo` 响应字段 `mileage` / `oilMileage`(已用现有调用处 `qualityOrderReport/edit.vue:1270`、`serviceProxy/.../BasicInfo/index.vue:903,907` 复核)