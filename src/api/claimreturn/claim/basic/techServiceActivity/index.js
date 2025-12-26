import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'claimreturn/claim/web/basic/techServiceActivity/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function deleteItem (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 查询
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}

/**
 * 提交零件准备
 * @param {Object} data
 */
export function submitPartsPreparation (data) {
  return api.jsonPost(prefix + 'submitPartsPreparation', data);
}

/**
 * 零配件准备完成
 * @param {Object} data
 */
export function partsPreparationCompleted (data) {
  return api.jsonPost(prefix + 'partsPreparationCompleted', data);
}

const prefixScheme = 'claimreturn/claim/web/basic/techServiceActivityScheme/';
// 服务活动方案列表查询
export function techServiceActivitySchemeList (data) {
  return api.jsonPost(prefixScheme + 'list', data);
}
// 服务活动方案列表查询
export function techServiceActivitySchemeDelete (data) {
  return api.jsonPost(prefixScheme + 'delete', data);
}
