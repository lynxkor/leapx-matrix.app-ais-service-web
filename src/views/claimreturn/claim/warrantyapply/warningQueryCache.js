/**
 * 保修预警弹窗 "查看更多" 跳转的长列表传输工具
 * <p>
 * 背景: "不同车重复附件预警" 的历史保修申请单可能多达数百个 (实测 511 个),
 * 旧实现把全部单号拼进 ?applyNoList= URL, 10KB 级请求行被网关
 * (Nginx/Tomcat 默认 8KB 请求行上限) 直接 414/400 拒掉.
 * 这里改为超过阈值时把单号列表写入 localStorage, URL 只带 warnKey 短 key;
 * 列表页 (index.vue applyWarningSearchParams) 用 readApplyList 读回.
 * </p>
 */
const PREFIX = 'aisWarnQ_';
// localStorage 值的存活时间. 读后不删, 靠本 TTL 过期 + sweepExpired 惰性清理,
// 保证链接在 TTL 内刷新仍有效
const TTL = 10 * 60 * 1000;
// 超过该条数改走 localStorage 短 key; 之下保持原自描述 URL (链接可跨浏览器分享给同事).
// 50 条 ≈ 1.3KB, 距离网关 8KB 请求行上限仍有 6 倍余量
const LEGACY_URL_LIMIT = 50;

function legacyHref (path, list) {
  return `${path}?applyNoList=${list.map(encodeURIComponent).join(',')}`;
}

/**
 * 扫描并清理过期的 warnKey 记录 (生成侧惰性清扫, 读后不删策略的配套)
 */
function sweepExpired () {
  try {
    Object.keys(localStorage)
      .filter(key => key.indexOf(PREFIX) === 0)
      .forEach(key => {
        try {
          const cache = JSON.parse(localStorage.getItem(key));
          if (!cache || Date.now() > cache.expireAt) localStorage.removeItem(key);
        } catch (e) {
          // 坏数据直接清掉
          localStorage.removeItem(key);
        }
      });
  } catch (e) {
    // localStorage 不可用 (隐私模式/配额) 时清扫失败无害
  }
}

/**
 * 构建 "查看更多" 跳转链接
 * <p>
 * list 不超过 {@link LEGACY_URL_LIMIT} 时返回原自描述 URL;
 * 超过时单号列表写入 localStorage, 返回 {@code ?warnKey=} 短 URL.
 * localStorage 写入失败时降级回原 URL, 行为与线上现状一致.
 * </p>
 */
export function buildApplyListHref (path, list) {
  sweepExpired();
  // 小列表保持自描述 URL; 只有会撑爆请求行的大列表才走短 key
  if (!Array.isArray(list) || list.length <= LEGACY_URL_LIMIT) return legacyHref(path, list);
  const key = PREFIX + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  try {
    localStorage.setItem(key, JSON.stringify({ list, type: 'apply', expireAt: Date.now() + TTL }));
    return `${path}?warnKey=${key}`;
  } catch (e) {
    // 存储不可用 (配额/隐私模式) → 退回老 URL
    return legacyHref(path, list);
  }
}

/**
 * 列表页读取 warnKey 对应的单号列表
 * <p>
 * key 必须以 {@link PREFIX} 开头 (防 URL 随意指向其他 storage key),
 * 解析失败/过期/格式不对一律返回 null, 调用方退回普通列表, 不报错.
 * </p>
 */
export function readApplyList (key) {
  if (!key || key.indexOf(PREFIX) !== 0) return null;
  try {
    const cache = JSON.parse(localStorage.getItem(key));
    if (!cache || Date.now() > cache.expireAt || !Array.isArray(cache.list)) return null;
    return cache.list;
  } catch (e) {
    return null;
  }
}
