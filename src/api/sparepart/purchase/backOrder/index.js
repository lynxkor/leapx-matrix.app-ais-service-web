import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/purchase/backOrder/';
const prefixDetail = SPARE_PREFIX + '/web/purchase/backOrderDetail/';
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
 * 备件缺货明细表分页查询
 * @param {Object} data
 */
export function getBackOrderDetailList (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}

/**
 * 备件缺货明看板
 * @param {Object} data
 */
export function reportPage (data) {
  return api.jsonPost(prefixDetail + 'reportPage', data);
}

/**
 * 备件缺货明细表详情信息
 * @param {Object} data
 */
export function getBackOrderDetailDetail (data) {
  return api.jsonPost(prefixDetail + 'get', data);
}

/**
 * 备件缺货明细表新增/编辑
 * @param {Object} data
 */
export function updateBackOrderDetail (data) {
  return api.jsonPost(prefixDetail + 'addOrUpdate', data);
}

/**
 * bo转调拨共享库存列表
 * @param {Object} data
 */
export function boToTransferPage (data) {
  return api.jsonPost(prefix + 'boToTransferPage', data);
};

/**
 * 申请调拨
 * @param {Object} data
 */
export function applyBoToTransfer (data) {
  return api.jsonPost(prefix + 'applyBoToTransfer', data);
};
