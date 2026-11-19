/**
 * 自定义视图元数据 —— 「关联对象」两级联动字典（后端字典驱动）
 *
 * 数据来源：datacenter 公共字典接口 /datacenter/web/common/commonDictValue/get
 *   返回结构：{ code, msg, data: [{ id, code, message, sort }] }
 *
 * 字典类型约定：
 *   一级：RELATION_DICT_TYPE（如 custom_view_relation）
 *         字典项 dict_value = 该一级下的二级字典类型后缀（如 dealer）
 *         字典项 dict_label = 一级显示名（如 门店）
 *   二级：{一级字典类型}_{一级字典项 dict_value}（如 custom_view_relation_dealer）
 *         字典项 dict_value = 二级取值，dict_label = 二级显示名（如 region / 大区）
 *
 * ⚠️ 两种格式的分工，别混用：
 *   落库格式 = JSON 字符串 {"table":"dealer","column":"region"}
 *       table  = 一级字典 dict_value（业务表）
 *       column = 二级字典 dict_value（该表下的列）
 *       存字典取值而不是显示名：显示名只是文案，字典一改历史数据就对不上；
 *       而下游（个人视图条件构建器）要的是能直接拼 SQL 的表名与列名。
 *   展示格式 = 一级显示名-二级显示名，如 门店-大区
 *
 * 兼容：库里可能还留着旧格式文本「门店-大区」，读取时按字典反查回显，
 * 保存时统一归一化成 JSON（旧数据会在下一次保存时自动迁移）。
 */

import { getEnum } from '@/libs/api/common';
// 关联对象 JSON 的解析只有一个实现，放在 libs 里 —— 条件构建器（个人视图）
// 也要用同一套解析口径，避免两处实现漂移。
import { parseRelationJson } from '@/libs/components/CustomView/relationMeta';

/** 一级字典类型 */
export const RELATION_DICT_TYPE = 'custom_view_relation';

/** el-cascader 配置：checkStrictly=false 必须选到二级；emitPath=true 取路径数组 */
export const RELATION_CASCADER_PROPS = {
  expandTrigger: 'hover',
  checkStrictly: false,
  emitPath: true,
  value: 'value',
  label: 'label',
  children: 'children'
};

/**
 * 拉取字典项，按 sort 升序，映射成级联节点
 * @param {String} dictType 字典类型
 * @returns {Promise<Array<{value: String, label: String}>>}
 */
async function fetchDictItems (dictType) {
  const res = await getEnum(dictType, 200);
  // axios 封装已把响应拆到 body.data（getEnum 返回的是数组本身），
  // 这里同时兼容「未拆包的完整 body」形态，避免取不到值。
  const list = Array.isArray(res) ? res : ((res && res.data) || []);
  return list
    .slice()
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map(item => ({ value: item.code, label: item.message }));
}

/**
 * 拉取一级字典 + 各一级的二级字典，组装成 el-cascader 的 options 树
 * @returns {Promise<Array<Object>>} 形如 [{ value:'dealer', label:'门店', children:[...] }]
 */
export async function loadRelationOptions () {
  const firstLevel = await fetchDictItems(RELATION_DICT_TYPE);
  return Promise.all(
    firstLevel.map(async node => {
      const children = await fetchDictItems(`${RELATION_DICT_TYPE}_${node.value}`);
      return { ...node, children };
    })
  );
}

/**
 * 旧格式「一级-二级」显示名文本 -> 级联路径（value 数组）
 * 字典中查不到对应显示名时返回空数组（不回显脏数据，避免误导用户）
 * @param {String} text 如 '门店-大区'
 * @param {Array<Object>} tree loadRelationOptions 的结果
 * @returns {Array<String>} 如 ['dealer','region']
 */
function parseLegacyRelationPath (text, tree) {
  if (!text || !Array.isArray(tree) || !tree.length) return [];
  const parts = String(text).split('-').map(part => part.trim()).filter(Boolean);
  if (parts.length < 2) return [];
  const first = tree.find(node => node.label === parts[0]);
  if (!first) return [];
  const second = (first.children || []).find(child => child.label === parts[1]);
  if (!second) return [];
  return [first.value, second.value];
}

/**
 * 关联对象值 -> 级联路径（value 数组），用于回显到 el-cascader
 * 新格式直接取 JSON 里的 table/column；旧格式按字典显示名反查。
 * @param {String} value 库里的原始值（JSON 或旧文本）
 * @param {Array<Object>} tree loadRelationOptions 的结果
 * @returns {Array<String>} 如 ['dealer','region']
 */
export function parseRelationPath (value, tree) {
  const json = parseRelationJson(value);
  if (json) return [json.table, json.column];
  return parseLegacyRelationPath(value, tree);
}

/**
 * 级联路径（value 数组）-> 落库用的 JSON 字符串
 * @param {Array<String>} path 如 ['dealer','region']
 * @returns {String} 如 '{"table":"dealer","column":"region"}'；路径不完整返回空串
 */
export function formatRelationJson (path) {
  if (!Array.isArray(path) || path.length < 2) return '';
  const table = path[0];
  const column = path[1];
  if (!table || !column) return '';
  return JSON.stringify({ table, column });
}

/**
 * 级联路径（value 数组）-> 展示用「一级-二级」显示名
 * @param {Array<String>} path 如 ['dealer','region']
 * @param {Array<Object>} tree loadRelationOptions 的结果
 * @returns {String} 如 '门店-大区'；取不到对应字典项时返回空串
 */
export function formatRelationLabel (path, tree) {
  if (!Array.isArray(path) || path.length < 2 || !Array.isArray(tree)) return '';
  const first = tree.find(node => node.value === path[0]);
  if (!first) return '';
  const second = (first.children || []).find(child => child.value === path[1]);
  if (!second) return '';
  return `${first.label}-${second.label}`;
}

/**
 * 计算落库用的关联对象 JSON（统一归一化入口）
 *   1) 原值已是 JSON  -> 归一化后返回
 *   2) 原值是旧格式文本 -> 按字典反查成路径再转 JSON
 *   3) 无法识别      -> 返回 null，由调用方提示用户重新选择
 * @param {String} value 库里的原始值（JSON 或旧文本）
 * @param {Array<Object>} tree loadRelationOptions 的结果
 * @returns {String|null} JSON 字符串；空值返回空串；无法识别返回 null
 */
export function resolveRelationJson (value, tree) {
  const raw = (value || '').trim();
  if (!raw) return '';
  const json = parseRelationJson(raw);
  if (json) return JSON.stringify(json);
  const path = parseLegacyRelationPath(raw, tree);
  if (path.length >= 2) return formatRelationJson(path);
  return null;
}
