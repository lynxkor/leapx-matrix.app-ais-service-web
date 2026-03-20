import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = '/maintain/web/basic/vehRetentionList/';

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
 * 详情故障模块表格接口
 * @param {Object} data
 * @returns
 */
export function getFaultList (data) {
  return api.jsonPost('/maintain/web/basic/vehRetentionListFault/page', data);
}
/**
 * 详情零件表格接口
 * @param {Object} data
 * @returns
 */
export function getPartsList (data) {
  return api.jsonPost('/maintain/web/basic/vehRetentionListParts/page', data);
}

/**
 * 批量作废
 * @param {Object} data
 * @returns
 */
export function batchInvalid (data) {
  return api.jsonPost(prefix + 'batchInvalid', data);
}
