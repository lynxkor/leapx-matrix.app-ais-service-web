import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantyaudit/warrantyAuditDetail/';

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
 * 查询详情
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

/**
 * 保修审计明细详情（含关联数据）
 * @param {Object} data
 */
export function getDetailWithRelated (data) {
  return api.jsonPost(prefix + 'getDetailWithRelated', data);
}

/**
 * 补充材料
 * @param {Object} data
 */
export function supplyMaterial (data) {
  return api.jsonPost(prefix + 'supplementMaterial', data);
}

/**
 * 审计通过
 * @param {Object} data
 */
export function auditPass (data) {
  return api.jsonPost(prefix + 'pass', data);
}

/**
 * 审计驳回
 * @param {Object} data
 */
export function auditReject (data) {
  return api.jsonPost(prefix + 'reject', data);
}

/**
 * 申诉
 * @param {Object} data
 */
export function appeal (data) {
  return api.jsonPost(prefix + 'appeal', data);
}

/**
 * 同意
 * @param {Object} data
 */
export function agree (data) {
  return api.jsonPost(prefix + 'agree', data);
}

/**
 * 同意申诉
 * @param {Object} data
 */
export function agreeAppeal (data) {
  return api.jsonPost(prefix + 'agreeAppeal', data);
}

/**
 * 拒绝申诉
 * @param {Object} data
 */
export function rejectAppeal (data) {
  return api.jsonPost(prefix + 'rejectAppeal', data);
}

/**
 * 获取错误项配置
 * @param {Object} data
 */
export function getErrorConfigList (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyaudit/warrantyAuditErrorConfig/page', data);
}

/**
 * 计算扣款金额
 * @param {Object} data
 */
export function calculateDeduction (data) {
  return api.jsonPost(prefix + 'calculateDeduction', data);
}

/**
 * 补充材料明细表分页查询
 * @param {Object} data
 */
export function getSupplyMaterial (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyapply/warrantyApply/get', data);
}
