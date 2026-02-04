import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/purchase/purchaseOrder/';

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
 * 备件采购订单明细表分页查询
 * @param {Object} data
 */
export function purchaseOrderDetail (data) {
  return api.jsonPost('sp/web/purchase/purchaseOrderDetail/page', data);
}

/**
 * 备件采购订单-全部备件
 * @param {Object} data
 */
export function pageAll (data) {
  return api.jsonPost('sp/web/purchase/purchaseOrderDetail/pageAll', data);
}

/**
 * 备件采购订单-待签收备件
 * @param {Object} data
 */
export function pageWaitSign (data) {
  return api.jsonPost('sp/web/purchase/purchaseOrderDetail/pageWaitSign', data);
}

/**
 * 批量签收/入库
 * @param {Object} data
 */
export function batchSign (data) {
  return api.jsonPost('sp/web/purchase/purchaseOrder/batchSign', data);
}
