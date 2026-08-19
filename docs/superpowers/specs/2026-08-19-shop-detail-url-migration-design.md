# 门店详情 URL 迁移 — 设计文档

- 日期：2026-08-19
- 作者：方海鹏 / Claude（brainstorming 协作产出）
- 适用范围：`app-ais-aftersale-front`

## 1. 背景与目标

旧门店详情入口是 Partner 微服务的 `/partner/channelManagement/shopDetail`，参数名 `dealerCode`。本项目已上线独立门店管理模块（`/datacenter/store/store/detail`），参数名 `storeCode`。需要把整个 `app-ais-aftersale-front` 里所有跳转入口统一改成新地址，让用户从任意业务页面（备件、维保、索赔、车主、车辆档案等）点击门店名/编码时都跳到新详情页。

## 2. 范围

- **修改范围**：仅 `src/views/**`、`src/libs/mixins/commonMixins.js`
- **保留范围**：Partner 微服务侧代码（不在本仓库），不动
- **不改逻辑**：保留每个调用点的 `window.open` / `$router.push` 行为、`target="_blank"`、target 路径等 — 仅替换 URL 字符串 + 参数名

## 3. URL 替换规则

| 原 | 新 |
|---|---|
| `/partner/channelManagement/shopDetail?dealerCode=${...}` | `/datacenter/store/store/detail?storeCode=${...}` |
| `/partner/channelManagement/shopDetail?num=2&dealerCode=${...}` | `/datacenter/store/store/detail?storeCode=${...}` |
| `/partner/channelManagement/shopDetail?num=X&dealerCode=${...}` （num 其它值） | `/datacenter/store/store/detail?storeCode=${...}` |
| `$router.push({ path: '/partner/channelManagement/shopDetail', query: { dealerCode: ... } })` | `$router.push({ path: '/datacenter/store/store/detail', query: { storeCode: ... } })` |
| `commonMixins.js#goShopDetail` 方法内部的 URL + `dealerCode` 字段 | 同样的字符串 + 字段名替换 |

**注意**：
- `num` 参数被丢弃 — 新详情页不再区分门店类型（销售/服务/交付），所有类型统一展示
- `dealerCode` 字段名（包括 `row.dealerCode`、`row.salesDealerCode`、`row.serviceDealerCode`、`row.deliveryDealerCode`、`form.dealerCode`）一律改为 `storeCode` — 这些字段都是同一门店的 storeCode（同源映射，已与用户确认）
- `target="_blank"` 保留 — 旧页面在新标签页打开的语义不变

## 4. 受影响的 5 种调用模式

### 模式 A：`window.open` 列表跳转（最常见，约 80 处）

```js
// 旧
window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.dealerCode}`, '_blank');
// 带 num
window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');

// 新
window.open(`/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
window.open(`/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
```

### 模式 B：`<el-link target="_blank">` 表单跳转（约 20 处）

```html
<!--旧 -->
<el-link type="primary"
          :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`"
          target="_blank">
  {{ form.dealerName }}
</el-link>

<!--新 -->
<el-link type="primary"
          :href="`/datacenter/store/store/detail?storeCode=${form.dealerCode}`"
          target="_blank">
  {{ form.dealerName }}
</el-link>
```

### 模式 C：`$router.push` 内部跳转（约 10 处）

```js
// 旧
this.$router.push({
  path: '/partner/channelManagement/shopDetail',
  query: { dealerCode: row.dealerCode }
});
// 新
this.$router.push({
  path: '/datacenter/store/store/detail',
  query: { storeCode: row.dealerCode }
});
```

### 模式 D：`commonMixins.js` 工具方法（1 处）

```js
// libs/mixins/commonMixins.js（行 177 附近）goShopDetail 方法
// 旧：内部 url = '/partner/channelManagement/shopDetail', query.dealerCode
// 新：内部 url = '/datacenter/store/store/detail', query.storeCode
// 方法名 goShopDetail 保留（避免连带改动调用点）
```

### 模式 E：`num=4` 等其它 num 值（约 1-2 处，需逐个检查）

```js
window.open(`/partner/channelManagement/shopDetail?num=4&dealerCode=${...}`, '_blank')
// → 同样去掉 num 参数
```

## 5. 替换方式

按方案 A：**纯 sed 批量文本替换**，不抽工具方法、不改行为。

执行命令：

```bash
# 1) URL 路径替换（去掉 query 部分）
find src -type f \( -name "*.vue" -o -name "*.js" \) | xargs sed -i \
  's|/partner/channelManagement/shopDetail|/datacenter/store/store/detail|g'

# 2) query 参数名 dealerCode → storeCode（仅 query 字符串里，不动 row.dealerCode 等字段访问）
find src -type f \( -name "*.vue" -o -name "*.js" \) | xargs sed -i \
  's|?dealerCode=|?storeCode=|g; s|&dealerCode=|\&storeCode=|g; s|dealerCode: |storeCode: |g'
```

替换后校验：
```bash
grep -rn "channelManagement/shopDetail" src  # 应该 0 条
grep -rn "?dealerCode=\| dealerCode:" src"     # 应该 0 条
grep -rn "dealerCode" src                      # 应该保留 row.dealerCode 等字段访问
```

## 6. 不在范围

- **Partner 微服务侧代码**：不动
- **`goShopDetail` 方法名**：保留旧名以减少连锁改动（方法名是 API，不影响功能）
- **字段访问表达式**：`row.dealerCode`、`form.salesDealerCode` 等保留 — 后端响应字段名仍是 `dealerCode` 系列，只是 URL query 参数名改为 `storeCode`
- **跳转行为**：保留 `window.open` / `$router.push` / `target="_blank"` 的原有选择

## 7. 验收

1. `grep -rn "channelManagement/shopDetail" src` → 0 条
2. `grep -rn "?dealerCode=\| dealerCode:" src` → 0 条
3. 随机抽 5 个修改过的文件，人工核对跳转上下文正确：
   - URL 已是 `/datacenter/store/store/detail`
   - 参数名是 `storeCode`
   - `target="_blank"` / `window.open` / `$router.push` 与原文件一致
4. `npm run local` 本地启动，随机点击 3 个页面（备件/维保/索赔），）点击门店名/编码 → 跳转到新详情页，URL 含 `?storeCode=xxx`
5. 路由 `/datacenter/store/store/detail` 在 Task 2 已注册，新详情页能正常加载

## 8. 风险

- **风险 1**：某些调用点可能 `dealerCode` 是其它用途（如 `dealerCode=123` 当字符串参数，而不是 query 名）。sed 第二步只匹配 `?dealerCode=`、`&dealerCode=`、空格+`dealerCode:`，不会误伤字段名访问（如 `row.dealerCode`）。
- **风险 2**：如果有 `num=2&dealerCode=` 之外的其它 query 参数（如 `&from=xxx`），保留 — 但本项目未发现此类情况，grep 验证。
- **风险 3**：`commonMixins.js` 中的 `goShopDetail` 方法本身被多个页面间接调用，确认替换后方法逻辑仍正确 — 单元测试覆盖（项目无单测）→ 人工核对方法签名。

## 9. 不做范围 / 后续清理

- 后续可考虑把 `goShopDetail` 重命名为 `goStoreDetail`，统一所有跳转入口 — 本期不做
- 后续可考虑抽 `openStoreDetail(code)` 工具方法，本期不做
- 后端响应字段 `dealerCode` 是否同步改为 `storeCode` — 需要后端协调，本期不做