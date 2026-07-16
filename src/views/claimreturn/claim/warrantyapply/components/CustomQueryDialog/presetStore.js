/**
 * 保修申请单自定义查询 — 方案(preset)localStorage 持久化
 *
 * 占位阶段不上后端,先用 localStorage;后续接入后端时把 load/save 换成 API 即可。
 */

const STORAGE_KEY = 'WARRANTY_CUSTOM_QUERY_PRESETS';

function genId () {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadPresets () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('[presetStore] loadPresets failed', e);
    return [];
  }
}

function persist (list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function addPreset (name, tree) {
  const list = loadPresets();
  const preset = {
    id: genId(),
    name,
    tree: JSON.parse(JSON.stringify(tree)),
    createdAt: new Date().toISOString()
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

export function updatePresetTree (id, tree) {
  const list = loadPresets();
  const item = list.find(p => p.id === id);
  if (item) {
    item.tree = JSON.parse(JSON.stringify(tree));
    item.updatedAt = new Date().toISOString();
    persist(list);
  }
  return list;
}

export function getPreset (id) {
  return loadPresets().find(p => p.id === id) || null;
}