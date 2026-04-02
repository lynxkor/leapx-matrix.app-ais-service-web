import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/dealer/dealerReturnOrder/';
const prefixDetail = SPARE_PREFIX + '/web/dealer/dealerReturnOrderDetail/';
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
 * 通过
 * @param {Object} data
 */
export function dealerReturnOrderAgree (data) {
  return api.jsonPost(prefix + 'agree', data);
}

/**
 * 作废
 * @param {Object} data
 */
export function dealerReturnOrderCancel (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 出库
 * @param {Object} data
 */
export function dealerReturnOrderOutbound (data) {
  return api.jsonPost(prefix + 'outbound', data);
}

/**
 * 出库
 * @param {Object} data
 */
export function dealerReturnOrderDetailPage (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}
