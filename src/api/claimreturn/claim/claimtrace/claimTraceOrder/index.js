import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'claimreturn/claim/web/claimtrace/claimTraceOrder/';

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

// 提交审核
export function submitAudit (data) {
  return api.jsonPost(prefix + 'submitForAudit', data);
}

// 作废
export function cancelOrder (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

// 调整追溯金额
export function adjustTraceAmount (data) {
  return api.jsonPost(prefix + 'adjustTraceAmount', data);
}

// 同意下发
export function agreeIssue (data) {
  return api.jsonPost(prefix + 'agreeIssue', data);
}

// 驳回修改
export function rejectModify (data) {
  return api.jsonPost(prefix + 'rejectForModify', data);
}

// 同意追溯
export function agreeTrace (data) {
  return api.jsonPost(prefix + 'agreeTrace', data);
}

// 申诉
export function submitAppeal (data) {
  return api.jsonPost(prefix + 'appeal', data);
}

// 同意申诉
export function agreeAppeal (data) {
  return api.jsonPost(prefix + 'agreeAppeal', data);
}

// 驳回申诉
export function rejectAppeal (data) {
  return api.jsonPost(prefix + 'rejectAppeal', data);
}

// 拒绝申诉
export function refuseAppeal (data) {
  return api.jsonPost(prefix + 'rejectForAppeal', data);
}

// 保修工时清单分页查询
const workhourPrefix = 'claimreturn/claim/web/warrantyapply/warrantyApplyWorkhour/';
export function getWorkhourPage (data) {
  return api.jsonPost(workhourPrefix + 'page', data);
}

// 保修备件清单分页查询
const partPrefix = 'claimreturn/claim/web/warrantyapply/warrantyApplyPart/';
export function getPartPage (data) {
  return api.jsonPost(partPrefix + 'page', data);
}

// 保修其他清单分页查询
const otherPrefix = 'claimreturn/claim/web/warrantyapply/warrantyApplyOther/';
export function getOtherPage (data) {
  return api.jsonPost(otherPrefix + 'page', data);
}
