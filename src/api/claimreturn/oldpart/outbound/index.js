import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'claimreturn/oldpart/web/outbound/oldPartOemOutboundOrder/';

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
 * 下发
 * @param {Object} data
 */
export function publish (data) {
  return api.jsonPost(prefix + 'publish', data);
}

/**
 * 批量签收
 * @param {Array<Number>} data
 */
export function signByIds (data) {
  return api.jsonPost(prefix + 'signByIds', data);
}

/**
 * 添加明细
 * @param {Object} data
 * @returns
 */
export function addDetail (data) {
  return api.jsonPost(prefix + 'addDetail', data);
}

/**
 * 删除明细
 * @param {Object} data
 * @returns
 */
export function removeDetail (data) {
  return api.jsonPost(prefix + 'removeDetail', data);
}

/**
 * 添加连带件
 * @param {Object} data
 * @returns
 */
export function addAssociatedParts (data) {
  return api.jsonPost(prefix + 'addAssociatedParts', data);
}

/**
 * 确认出库
 * @param {Object} data
 * @returns
 */
export function confirmOutbound (data) {
  return api.jsonPost(prefix + 'confirmOutbound', data);
}

/**
 * 同步
 * @param {Object} data
 * @returns
 */
export function sync (data) {
  return api.jsonPost(prefix + 'sync', data);
}

/**
 * 主机厂出库单扫描条码添加明细
 * @param {Object} data
 */
export function scanCodeAddDetail (data) {
  return api.jsonPost(prefix + 'scanCodeAddDetail', data);
}
