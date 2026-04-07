import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantysettle/warrantySettle/';

/**
 * 分页查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 获取详情
 * @param {String} id
 */
export function getDetail (id) {
  return api.jsonPost(prefix + 'get', id);
};

/**
 * 确认保修结算通知书
 * @param {String} id
 */
export function confirm (id) {
  return api.jsonPost(prefix + 'confirm', id);
};

/**
 * 开票完成
 * @param {Object} data
 */
export function complete (data) {
  return api.jsonPost(prefix + 'complete', data);
};

/**
 * 发票验收
 * @param {Object} data
 */
export function invoiceAccept (data) {
  return api.jsonPost(prefix + 'invoice/accept', data);
};

/**
 * 发票退回
 * @param {Object} data
 */
export function invoiceReturn (data) {
  return api.jsonPost(prefix + 'invoice/return', data);
};

/**
 * 确认付款
 * @param {Object} data
 */
export function payConfirm (data) {
  return api.jsonPost(prefix + 'pay/confirm', data);
};
