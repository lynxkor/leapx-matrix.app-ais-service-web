/**
 * 保修申请单自定义查询 — 方案(preset)localStorage 持久化
 *
 * 占位阶段不上后端,先用 localStorage;后续接入后端时把 load/save 换成 API 即可。
 */

const STORAGE_KEY = 'WARRANTY_CUSTOM_QUERY_PRESETS';

// 性能测试阈值(模拟耗时,毫秒)。<= 阈值视为通过。
export const PERF_THRESHOLD_MS = 1500;

// 性能测试状态枚举
export const PERF_STATUS = {
  PENDING: 'pending',   // 待测试(新保存视图的默认状态)
  PASSED: 'passed',     // 已通过
  FAILED: 'failed'      // 未通过
};

function genId () {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadPresets () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return (Array.isArray(list) ? list : []).map(p => ({
      sort: null,
      ...p
    }));
  } catch (e) {
    console.error('[presetStore] loadPresets failed', e);
    return [];
  }
}

function persist (list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function addPreset (name, tree, sort) {
  const list = loadPresets();
  const preset = {
    id: genId(),
    name,
    tree: JSON.parse(JSON.stringify(tree)),
    sort: sort ? { ...sort } : null,
    createdAt: new Date().toISOString(),
    perfStatus: PERF_STATUS.PENDING,
    perfDurationMs: null,
    perfTestedAt: null
  };
  list.push(preset);
  persist(list);
  return preset;
}

export function renamePreset (id, newName) {
  const list = loadPresets();
  const item = list.find(p => p.id === id);
  if (item) {
    item.name = newName;
    persist(list);
  }
  return list;
}

export function deletePreset (id) {
  return persist(loadPresets().filter(p => p.id !== id));
}

export function movePresetToTop (id) {
  const list = loadPresets();
  const idx = list.findIndex(p => p.id === id);
  if (idx > 0) {
    const [item] = list.splice(idx, 1);
    list.unshift(item);
    persist(list);
  }
  return list;
}

export function updatePresetTree (id, tree) {
  const list = loadPresets();
  const item = list.find(p => p.id === id);
  if (item) {
    item.tree = JSON.parse(JSON.stringify(tree));
    item.updatedAt = new Date().toISOString();
    // 编辑条件后视为待重新测试
    item.perfStatus = PERF_STATUS.PENDING;
    persist(list);
  }
  return list;
}

/**
 * 通用更新入口:同时支持 tree、sort 等字段。
 * patch 中省略的字段保持不变;传 null 表示显式置空。
 */
export function updatePreset (id, patch) {
  const list = loadPresets();
  const item = list.find(p => p.id === id);
  if (item) {
    if ('tree' in patch) item.tree = JSON.parse(JSON.stringify(patch.tree));
    if ('sort' in patch) item.sort = patch.sort ? { ...patch.sort } : null;
    item.updatedAt = new Date().toISOString();
    // 编辑条件/排序后视为待重新测试
    item.perfStatus = PERF_STATUS.PENDING;
    persist(list);
  }
  return list;
}

export function setPresetPerfStatus (id, status, durationMs) {
  const list = loadPresets();
  const item = list.find(p => p.id === id);
  if (item) {
    item.perfStatus = status;
    item.perfDurationMs = typeof durationMs === 'number' ? durationMs : item.perfDurationMs;
    item.perfTestedAt = new Date().toISOString();
    persist(list);
  }
  return list;
}

export function getPreset (id) {
  return loadPresets().find(p => p.id === id) || null;
}
