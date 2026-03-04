import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/fund/accountOperateApply/';

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
 * 提交
 * @param {Object} data
 */
export function getCommit (data) {
  return api.jsonPost(prefix + 'commit', data);
}

/**
 * 通过
 * @param {Object} data
 */
export function getAgree (data) {
  return api.jsonPost(prefix + 'agree', data);
}

/**
 * 批量通过
 * @param {Object} data
 */
export function getAgreeBatch (data) {
  return api.jsonPost(prefix + 'agreeBatch', data);
}

/**
 * 驳回
 * @param {Object} data
 */
export function getReject (data) {
  return api.jsonPost(prefix + 'reject', data);
}

/**
 * 批量驳回
 * @param {Object} data
 */
export function getRejectBatch (data) {
  return api.jsonPost(prefix + 'rejectBatch', data);
}
