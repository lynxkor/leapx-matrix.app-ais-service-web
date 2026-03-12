import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/basic/purchasePrice/';
const prefixDetail = SPARE_PREFIX + '/web/basic/purchasePriceCoupon/';

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
 * 零件特殊采购价优惠券表新增/编辑
 * @param {Object} data
 */
export function addCoupon (data) {
  return api.jsonPost(prefixDetail + 'addOrUpdate', data);
}

/**
 * 零件特殊采购价优惠券表分页查询
 * @param {Object} data
 */
export function listCoupon (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}

/**
 * 零件特殊采购价优惠券表启用/禁用
 * @param {Object} data
 */
export function enableOrDisable (data) {
  return api.jsonPost(prefixDetail + 'enableOrDisable', data);
}
