import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/warehouse/inventory/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

export function getShareList (data) {
  return api.jsonPost(prefix + 'sharePage', data);
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
 * 备件库存流水表分页查询
 * @param {Object} data
 */
export function flowPage (data) {
  return api.jsonPost(prefix + 'flowPage', data);
}

/**
 * 备件库存可用、在途、冻结流水表分页查询
 * @param {Object} data
 */
export function operationFlowPage (data) {
  return api.jsonPost(prefix + 'operationFlowPage', data);
}

/**
 * 获取在途订单信息
 * @param {Object} data
 */
export function getInTransitOrders (data) {
  return api.jsonPost(prefix + 'getInTransitOrders', data);
}

/**
 * 获取冻结订单信息
 * @param {Object} data
 */
export function getFrozenOrders (data) {
  return api.jsonPost(prefix + 'getFrozenOrders', data);
}

/**
 * 门店备件库位表列表查询All
 * @param {Object} data
 */
export function listAll (data) {
  return api.jsonPost('sp/web/warehouse/location/listAll', data);
}

/**
 * 门店备件库位表列表查询All
 * @param {Object} data
 */
export function getBizType (data) {
  return api.jsonPost(prefix + 'getBizType', data);
}

/**
 * 共享上架
 * @param {Object} data
 */
export function sharedShelves (data) {
  return api.jsonPost(prefix + 'sharedShelves', data);
}

/**
 * 共享下架
 * @param {Object} data
 */
export function sharedRemoveShelves (data) {
  return api.jsonPost(prefix + 'sharedRemoveShelves', data);
}
