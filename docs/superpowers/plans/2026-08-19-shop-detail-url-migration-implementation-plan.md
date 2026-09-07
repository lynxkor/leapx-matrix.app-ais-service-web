# 门店详情 URL 迁移 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `app-ais-aftersale-front` 里所有 114 处 `/partner/channelManagement/shopDetail?dealerCode=...` 跳转入口统一替换为 `/datacenter/store/store/detail?storeCode=...`。

**Architecture:** 纯 sed 文本批量替换（spec 方案 A）。两行命令覆盖 5 种调用模式：A 路径字符串替换、B query 参数名替换。仅替换目标字符串与参数名，**不动** `window.open` / `$router.push` / `target="_blank"` 等行为、不动 `row.dealerCode` 等字段访问。

**Tech Stack:** Git Bash / sed / grep / Vue 2 + Vue Router。

## 全局约定

- 项目根目录：`D:/work/code/ais/app-ais-aftersale-front`
- 分支：`feature/20260813-store`
- 所有 sed 命令在 Git Bash 环境下运行（仓库路径含空格，使用 `find ... -print0 | xargs -0 sed -i`）
- 替换目标（精确字面量）：
  - 路径：`/partner/channelManagement/shopDetail` → `/datacenter/store/store/detail`
  - query 参数：`?dealerCode=` / `&dealerCode=` / 空格+`dealerCode:` → 对应 `storeCode`
- **不替换**：`row.dealerCode`、`form.dealerCode`、`form.salesDealerCode` 等字段访问表达式（保留后端响应字段名）
- 验证手段：grep 计数应为 0；文件清单 `docs/superpowers/specs/2026-08-19-shop-detail-url-migration-file-list.md` 已枚举 100 个文件，可作为抽检基准

---

## Task 1：执行 sed 批量替换 + 自检

**Files:**
- Modify: `src/views/**/*.vue` 与 `src/libs/mixins/commonMixins.js` 共 100 个文件

**Interfaces:**
- Consumes: 当前分支状态（基线 commit `26fc8926`，已包含 spec 与清单文档）
- Produces: 100 个修改后的文件（URL + 参数名替换完成），所有 grep 验证命令退出码 0

- [ ] **Step 1.1: 进入项目根目录确认工作分支与未提交状态**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
git status --short
git branch --show-current
```

预期：`feature/20260813-store` 分支，无 untracked/unstaged 改动（或仅有 `public/js/env.js` 用户本地 dev 配置，可忽略）。

- [ ] **Step 1.2: 执行 sed 第一步 — 替换 URL 路径**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
find src -type f \( -name "*.vue" -o -name "*.js" \) -print0 | xargs -0 sed -i \
  's|/partner/channelManagement/shopDetail|/datacenter/store/store/detail|g'
```

预期：无输出（sed `-i` 静默）。100 个文件已修改。

- [ ] **Step 1.3: 执行 sed 第二步 — 替换 query 参数名**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
find src -type f \( -name "*.vue" -o -name "*.js" \) -print0 | xargs -0 sed -i \
  's|?dealerCode=|?storeCode=|g; s|\&dealerCode=|\&storeCode=|g; s|dealerCode: |storeCode: |g'
```

预期：无输出。已捕获3 种文本模式：
- URL query 字符串：`?dealerCode=xxx` → `?storeCode=xxx`
- 多参数连接：`&dealerCode=xxx` → `&storeCode=xxx`
- 对象字面量 key：`dealerCode: xxx`（注意有空格）→ `storeCode: xxx`

**为什么不替换 `row.dealerCode`、`form.dealerCode` 等字段访问**：sed 第二步要求 `dealerCode` 紧跟英文冒号 `:`，字段访问是 `.dealerCode`（点号），不会匹配。

- [ ] **Step 1.4: 验证 — 旧 URL 应 0 处**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
grep -rn "channelManagement/shopDetail" src
echo "---exit code: $? (应为 1，表示未找到)---"
```

预期：只有提示 `---exit code: 1 ---`，没有任何匹配行。

- [ ] **Step 1.5: 验证 — 旧 query 参数名应 0 处**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
grep -rnE '\?dealerCode=|\&dealerCode=| dealerCode:' src
echo "---exit code: $?---"
grep -rnE '\?dealerCode=|\&dealerCode=' src
echo "---exit code: $?---"
grep -rn ' dealerCode:' src
echo "---exit code: $?---"
```

预期：3 个 grep 都为 exit 1（无匹配）。如果有输出，逐条分析是否漏改的边界情况。

- [ ] **Step 1.6: 验证 — 新 URL 与参数名应至少出现**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
grep -rn "datacenter/store/store/detail" src | wc -l
grep -rnE '\?storeCode=|\&storeCode=| storeCode:' src | wc -l
```

预期：
- 第一个 ≥ 114（替换前后数量一致）
- 第二个 ≥ 114（sed 第二步目标命中数）

- [ ] **Step 1.7: 验证 — 字段访问未被误伤**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
grep -rn "dealerCode" src | head -20
echo "---"
grep -rn "dealerCode" src | wc -l
```

预期：剩余的 `dealerCode` 出现都是字段访问（`row.dealerCode`、`form.dealerCode`、`form.salesDealerCode` 等），不是参数名或 URL。统计数量应大于 0（保留的字段引用）。

- [ ] **Step 1.8: 抽样验证 — 5 个代表性文件**

按清单 §5 列出的5 个文件逐一人工查看，确认上下文正确：

```bash
cd /d/work/code/ais/app-ais-aftersale-front
# 1) vehicle/vehicleProfile/index.vue — 含 num=2 与销售/服务/交付3 个字段名
grep -n "datacenter/store/store/detail\|storeCode" src/views/datacenter/vehicle/vehicleProfile/index.vue

# 2) sparepart/warehouse/oemOutboundOrder/index.vue — 含 2 处
grep -n "datacenter/store/store/detail\|storeCode" src/views/sparepart/warehouse/oemOutboundOrder/index.vue

# 3) libs/mixins/commonMixins.js — 工具方法 docstring
grep -n "datacenter/store/store/detail\|storeCode" src/libs/mixins/commonMixins.js

# 4) maintain/sp/serviceProxy/components/BasicInfo/index.vue — 组件内跳转
grep -n "datacenter/store/store/detail\|storeCode" src/views/maintain/sp/serviceProxy/components/BasicInfo/index.vue

# 5) claimreturn/oldpart/returnorder/index.vue — 含 $router.push 模式
grep -n "datacenter/store/store/detail\|storeCode" src/views/claimreturn/oldpart/returnorder/index.vue
```

每个文件应看到：路径已变成 `/datacenter/store/store/detail`，参数已变成 `storeCode`，其余上下文（`window.open(...)`, `target="_blank"`, `navigateToRoute({...})`）保持原状。

- [ ] **Step 1.9: commit 全部改动**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
git add src
git status --short
git diff --cached --stat | tail -5
git -c user.email=fhp@leapmotor.com -c user.name=方海鹏 commit -m "refactor: 门店详情跳转统一改为 /datacenter/store/store/detail?storeCode"
```

预期：commit message 简洁；commit message 不会包含 `public/js/env.js`（如果还有改动说明本地 dev 配置，应 `git restore --staged public/js/env.js` 后再 commit，或先 `git checkout -- public/js/env.js` 丢弃它）。

---

## Task 2：抽检 5 个关键模块 + 提交总结

**Files:**
- Modify: 无新增文件（验证任务）

**Interfaces:**
- Consumes: Task 1 提交的改动
- Produces: 抽检通过记录 + 全分支总结

- [ ] **Step 2.1: 抽检模块 A — 车辆档案（涉及 num=2 与3 个门店类型字段）**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
sed -n '620,660p' src/views/datacenter/vehicle/vehicleProfile/index.vue
```

预期：3 处 `window.open(...)` 调用都用了 `/datacenter/store/store/detail?storeCode=${row.salesDealerCode|deliveryDealerCode|serviceDealerCode}`。原 `?num=2&dealerCode=` 已正确去掉。

- [ ] **Step 2.2: 抽检模块 B — 索赔与旧件（6 处 navigateToRoute）**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
for f in \
  src/views/maintain/basic/dealerDiscount/index.vue \
  src/views/claimreturn/oldpart/inventory/oem/index.vue \
  src/views/claimreturn/oldpart/inventory/oem/edit.vue \
  src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/index.vue \
  src/views/claimreturn/oldpart/destroy/oldPartDestroyOrder/edit.vue \
  src/views/claimreturn/oldpart/returnorder/index.vue; do
  echo "=== $f ==="
  grep -n "datacenter/store/store/detail\|storeCode: " "$f" | head -3
done
```

预期：6 个文件全部输出 `path: '/datacenter/store/store/detail'` 与 `storeCode: row.dealerCode` / `storeCode: form.dealerCode`（dealerCode 字段名保留）。

- [ ] **Step 2.3: 抽检模块 C — 备件（el-link 模式与 window.open 模式混合）**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
sed -n '60,100p' src/views/sparepart/warehouse/stockTaking/edit.vue
echo "---"
sed -n '170,180p' src/views/sparepart/warehouse/sharedInventory/index.vue
```

预期：
- edit.vue 中 `<el-link :href="\`/datacenter/store/store/detail?storeCode=${form.dealerCode}\`" target="_blank">`（href 内的 dealerCode 是字段访问，保留原值）
- sharedInventory/index.vue 中 `window.open(\`/datacenter/store/store/detail?storeCode=${row.dealerCode}\`, '_blank')`

- [ ] **Step 2.4: 抽检模块 D — commonMixins.js docstring**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
sed -n '170,185p' src/libs/mixins/commonMixins.js
```

预期：docstring 示例已改为 `/datacenter/store/store/detail` + `storeCode: row.dealerCode`。

- [ ] **Step 2.5: 验证 git log + diff stat**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
git log --oneline -3
git show --stat HEAD | head -10
```

预期：最近 commit 是 `refactor: 门店详情跳转统一改为 /datacenter/store/store/detail?storeCode`；变更文件数 = 100；增删行数大致对称（基本是字符串1:1 替换）。

- [ ] **Step 2.6: 输出最终汇总**

```bash
cd /d/work/code/ais/app-ais-aftersale-front
echo "=== Branch ===" && git branch --show-current
echo "=== Last commit ===" && git log --oneline -1
echo "=== Diff stat ===" && git show --stat HEAD | tail -3
echo "=== Remaining dealerCode refs (should be field-access only) ==="
grep -rn "dealerCode" src | grep -v "?dealerCode\|&dealerCode=" | head -5
```

预期：所有数字与 Step 1.4–1.7 验证结果一致。grep 中剩余的 `dealerCode` 应是 `row.dealerCode` / `form.dealerCode` / `form.salesDealerCode` 等字段访问，无 URL 残留。

---

## 自检

**Spec 覆盖**：
- ✅ 路径字符串替换 → Task 1 Step 1.2
- ✅ query 参数名替换 → Task 1 Step 1.3
- ✅ 5 种调用模式（A/B/C/D/E）覆盖：window.open（Step 2.3 抽样）、el-link（Step 2.3）、$router.push（Step 2.2）、commonMixins docstring（Step 2.4）
- ✅ `num` 参数丢弃：sed 第二步只匹配 `?dealerCode=` 与 `&dealerCode=`，自动绕开 `?num=2&dealerCode=` 中的 num
- ✅ 字段访问保留：sed 第二步要求 `:` 紧跟 `dealerCode`，不会命中 `.dealerCode`
- ✅ 抽检：Task 2 各 Step 对应 5 个代表性模块
- ✅ 验证：Task 1 Step 1.4–1.7 grep 计数
- ✅ commit：Task 1 Step 1.9

**占位符扫描**：无 TBD/TODO/fill-细节。每步都有具体命令、预期输出、错误判断。

**类型一致性**：本任务不涉及代码类型/方法签名，只涉及字符串模式，无类型风险。

---

## 执行说明

实施完成后，用户需确认是否合并回 master（详见 finishing-a-development-branch）。
- 已与本任务相关的 spec/plan 已提交至 `feature/20260813-store` 分支
- 工作区残留的 `public/js/env.js` 是用户本地 dev 配置，**不应纳入本分支 commit**——若 sed 替换过程误把它加入，需 `git restore --staged public/js/env.js` 后再 commit