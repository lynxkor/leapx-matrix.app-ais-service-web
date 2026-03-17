import api from '@/axios';

const prefix = 'maintain/web/sp/preAuthRuleCode/';

/**
 * 查询错误代码列表
 * @param {Object} data
 */
export function getErrorCodeList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 新增错误代码
 * @param {Object} data
 */
export function addErrorCode (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 修改错误代码
 * @param {Object} data
 */
export function updateErrorCode (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除错误代码
 * @param {Array<Number>} data
 */
export function deleteErrorCode (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 启用/禁用错误代码
 * @param {Object} data
 */
export function enableErrorCode (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}
