import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/dealer/dealerOutboundOrder/';

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
 * 申请领料
 * @param {Object} data
 */
export function applyRequest (data) {
  return api.jsonPost(prefix + 'applyRequest', data);
}

/**
 * 同意领料
 * @param {Object} data
 */
export function agreeRequest (data) {
  return api.jsonPost(prefix + 'agreeRequest', data);
}

/**
 * 驳回领料
 * @param {Object} data
 */
export function rejectRequest (data) {
  return api.jsonPost(prefix + 'rejectRequest', data);
}

/**
 * 出库
 * @param {Object} data
 */
export function outbound (data) {
  return api.jsonPost(prefix + 'outbound', data);
}

/**
 * 申请退料
 * @param {Object} data
 */
export function applyReturn (data) {
  return api.jsonPost(prefix + 'applyReturn', data);
}

/**
 * 驳回退料
 * @param {Object} data
 */
export function rejectReturn (data) {
  return api.jsonPost(prefix + 'rejectReturn', data);
}

/**
 * 入库
 * @param {Object} data
 */
export function inbound (data) {
  return api.jsonPost(prefix + 'inbound', data);
}

/**
 * 内部领料申请明细表分页查询
 * @param {Object} data
 */
export function orderDetailPage (data) {
  return api.jsonPost('/sp/web/dealer/dealerOutboundOrderDetail/page', data);
}

/**
 * 内部领料申请明细表删除
 * @param {Object} data
 */
export function orderDetailDelete (data) {
  return api.jsonPost('/sp/web/dealer/dealerOutboundOrderDetail/delete', data);
}

/**
 * 内部领料申请明细表新增/编辑
 * @param {Object} data
 */
export function orderDetailAddOrUpdate (data) {
  return api.jsonPost('/sp/web/dealer/dealerOutboundOrderDetail/addOrUpdate', data);
}
