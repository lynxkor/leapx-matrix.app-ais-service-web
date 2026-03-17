import api from '@/axios';

const prefix = 'maintain/web/sp/preAuth/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

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
 * 查询详情
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
 * 作废
 * @param {Object} data
 */
export function cancelItem (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 审批
 * @param {Object} data
 */
export function auditItem (data) {
  return api.jsonPost(prefix + 'audit', data);
}

/**
 * 重新生成
 * @param {Object} data
 */
export function regenerate (data) {
  return api.jsonPost(prefix + 'reGenerate', data);
}

/**
 * 根据施工单ID获取详情信息
 * @param {Object} data
 */
export function getServiceProxyDetail (data) {
  return api.jsonPost('maintain/web/sp/serviceProxy/detail', data);
}

/**
 * 查询施工单列表
 * @param {Object} data
 */
export function getServiceProxyList (data) {
  return api.jsonPost('maintain/web/sp/serviceProxy/page', data);
}

/**
 * 校验施工单是否可创建预授权
 * @param {Object} data
 */
export function checkServiceProxy (data) {
  return api.jsonPost(prefix + 'checkServiceProxy', data);
}
