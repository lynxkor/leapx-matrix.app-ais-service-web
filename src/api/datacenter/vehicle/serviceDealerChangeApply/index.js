import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'datacenter/web/vehicle/serviceDealerChangeApply/';

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
 * 一级审批通过
 * @param {Object} data
 */
export function firstApprovePass (data) {
  return api.jsonPost(prefix + 'apply/firstApprove', data);
}

/**
 * 一级审批驳回
 * @param {Object} data
 */
export function firstApproveReject (data) {
  return api.jsonPost(prefix + 'apply/firstReject', data);
}

/**
 * 二级审批通过
 * @param {Object} data
 */
export function finalApprovePass (data) {
  return api.jsonPost(prefix + 'apply/finalApprove', data);
}

/**
 * 二级审批驳回
 * @param {Object} data
 */
export function finalRejectReject (data) {
  return api.jsonPost(prefix + 'apply/finalReject', data);
}

/**
 * 专属服务门店变更车辆批量转移
 * @param {Object} data
 */
export function batchTransfer (data) {
  return api.jsonPost(prefix + 'batchTransfer', data);
}

/**
 * 提交专属服务门店变更申请
 * @param {Object} data
 */
export function submit (data) {
  return api.jsonPost(prefix + 'apply/submit', data);
}
const detailTablePrefix = '/datacenter/web/vehicle/serviceDealerChangeVehicle/';
/**
 * 详情表格接口
 * @param {Object} data
 * @returns
 */
export function getDetailList (data) {
  return api.jsonPost(detailTablePrefix + 'page', data);
}
/**
 * 详情表格新增接口
 * @param {Object} data
 * @returns
 */
export function addDetail (data) {
  return api.jsonPost(detailTablePrefix + 'addOrUpdate', data);
}
/**
 * 详情表格删除接口
 * @param {Object} data
 * @returns
 */
export function removeDetail (data) {
  return api.jsonPost(detailTablePrefix + 'delete', data);
}
