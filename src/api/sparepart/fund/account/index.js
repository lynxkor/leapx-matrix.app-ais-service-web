import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/fund/account/';
const prefixDetail = SPARE_PREFIX + '/web/fund/accountFlow/';

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
 * 备件账户流水表分页查询
 * @param {Object} data
 */
export function accountFlowPage (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}

/**
 * 备件账户表查询冻结账户流水
 * @param {Object} data
 */
export function frozenPage (data) {
  return api.jsonPost(prefixDetail + 'frozenPage', data);
}
