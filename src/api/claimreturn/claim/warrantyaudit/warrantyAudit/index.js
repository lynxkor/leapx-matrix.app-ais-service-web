import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'claimreturn/claim/web/warrantyaudit/warrantyAudit/';

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
 * 详情表格接口
 * @param {Object} data
 * @returns
 */
export function getDetailList (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyaudit/warrantyAuditDetail/page', data);
}
/**
 * 详情表格新增接口
 * @param {Object} data
 * @returns
 */
export function addDetail (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyaudit/warrantyAuditDetail/addOrUpdate', data);
}
/**
 * 详情表格删除接口
 * @param {Object} data
 * @returns
 */
export function removeDetail (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyaudit/warrantyAuditDetail/delete', data);
}
export function detailSearchApi (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyaudit/warrantyAuditDetail/page', data);
}

/**
 * 审计明细表格接口
 * @param {Object} data
 * @returns
 */
export function getDetailTableList (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyaudit/warrantyAuditDetail/pageInAuditDetail', data);
}

/**
 * 发布
 * @param {Object} data
 */
export function publish (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyaudit/warrantyAudit/publish', data);
}

/**
 * 签署总结
 * @param {Object} data
 */
export function signSummary (data) {
  return api.jsonPost('claimreturn/claim/web/warrantyaudit/warrantyAudit/signSummary', data);
}

/**
 * 同意总结
 */
export function agreeSummary (data) {
  return api.jsonPost(prefix + 'agreeSummary', data);
}

/**
 * 驳回总结
 */
export function rejectSummary (data) {
  return api.jsonPost(prefix + 'rejectSummary', data);
}

/**
 * 签署整改
 */
export function signRectify (data) {
  return api.jsonPost(prefix + 'signRectify', data);
}

/**
 * 同意整改
 */
export function agreeRectify (data) {
  return api.jsonPost(prefix + 'agreeRectify', data);
}

/**
 * 驳回整改
 */
export function rejectRectify (data) {
  return api.jsonPost(prefix + 'rejectRectify', data);
}

/**
 * 重新生成待签署总结报告
 */
export function regenerateUnsignedSummary (data) {
  return api.jsonPost(prefix + 'regenerateSummaryReport', data);
}

/**
 * 上传待签署总结报告
 */
export function uploadUnsignedSummary (data) {
  return api.jsonPost(prefix + 'uploadPendingSummaryReport', data);
}

/**
 * 重新生成待签署整改报告
 */
export function regenerateUnsignedRectify (data) {
  return api.jsonPost(prefix + 'regenerateRectifyReport', data);
}

/**
 * 上传待签署整改报告
 */
export function uploadUnsignedRectify (data) {
  return api.jsonPost(prefix + 'uploadPendingRectifyReport', data);
}
