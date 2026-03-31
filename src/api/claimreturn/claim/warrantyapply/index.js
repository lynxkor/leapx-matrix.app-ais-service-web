import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'claimreturn/claim/web/warrantyapply/warrantyApply/';

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

// 检查是否可创建保修申请单
export function checkCanCreate (data) {
  return api.jsonPost(prefix + 'checkCanCreate', data);
}
export function listUnprocessedDetails (data) {
  return api.jsonPost(prefix + 'listUnprocessedDetails', data);
}
// 查询保修类型列表
export function listWarrantyTypes (data) {
  return api.jsonPost(prefix + 'listWarrantyTypes', data);
}
export function warrantyApplyCreate (data) {
  return api.jsonPost(prefix + 'create', data);
}

// 审核撤回保修申请单
export function withdraw (data) {
  return api.jsonPost(prefix + 'withdraw', data);
}

// 审批拒赔保修申请单
export function deny (data) {
  return api.jsonPost(prefix + 'deny', data);
}

// 审批同意保修申请单
export function approve (data) {
  return api.jsonPost(prefix + 'approve', data);
}
// 提交保修申请单
export function submit (data) {
  return api.jsonPost(prefix + 'submit', data);
}
// 审批驳回保修申请单 （厂端）
export function reject (data) {
  return api.jsonPost(prefix + 'reject', data);
}
// 申请驳回保修申请单 （门店）
export function applyReject (data) {
  return api.jsonPost(prefix + 'applyReject', data);
}

// 批量作废保修申请单
export function batchCancel (data) {
  return api.jsonPost(prefix + 'batchCancel', data);
}

// 查看权益
export function queryRights (data) {
  return api.jsonPost(prefix + 'rights/query', data);
}
