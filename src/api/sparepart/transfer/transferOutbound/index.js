import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/dealer/transferOutbound/';

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
 * 提交调拨出库单
 * @param {Object} data
 */
export function getSubmit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 同意调拨出库单
 * @param {Object} data
 */
export function getApprove (data) {
  return api.jsonPost(prefix + 'approve', data);
}

/**
 * 驳回调拨出库单
 * @param {Object} data
 */
export function getReject (data) {
  return api.jsonPost(prefix + 'reject', data);
}

/**
 * 撤回调拨出库单
 * @param {Object} data
 */
export function getRevoke (data) {
  return api.jsonPost(prefix + 'revoke', data);
}

/**
 * 发运调拨出库单
 * @param {Object} data
 */
export function getShip (data) {
  return api.jsonPost(prefix + 'ship', data);
}

/**
 * 申请撤销
 * @param {Object} data
 */
export function applyCancel (data) {
  return api.jsonPost(prefix + 'applyCancel', data);
}

/**
 * 同意撤销
 * @param {Object} data
 */
export function approveCancel (data) {
  return api.jsonPost(prefix + 'approveCancel', data);
}

/**
 * 驳回撤销
 * @param {Object} data
 */
export function rejectCancel (data) {
  return api.jsonPost(prefix + 'rejectCancel', data);
}

/**
 * 入库
 * @param {Object} data
 */
export function getInbound (data) {
  return api.jsonPost(prefix + 'inbound', data);
}

/**
 * 备件调拨出库明细表分页查询
 * @param {Object} data
 */
export function transferOutboundPage (data) {
  return api.jsonPost('/sp/web/dealer/transferOutboundDetail/page', data);
}

/**
 * 备件调拨出库明细表删除
 * @param {Object} data
 */
export function transferOutboundDelete (data) {
  return api.jsonPost('/sp/web/dealer/transferOutboundDetail/delete', data);
}
