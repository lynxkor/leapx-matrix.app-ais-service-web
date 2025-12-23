import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'claimreturn/claim/web/basic/freeMaintenancePolicy/';

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

const prefixDetail = 'claimreturn/claim/web/basic/freeMaintenancePolicyPartDetail/';

// 公告车型列表查询
export function freeMaintenancePolicyPartDetailList (data) {
  return api.jsonPost(prefixDetail + 'vehicleRegisteredMode/list', data);
}

// 免保零件明细删除
export function freeMaintenancePolicyPartDetailDelete (data) {
  return api.jsonPost(prefixDetail + 'delete', data);
}
// 免保零件明细分页查询
export function freeMaintenancePolicyPartDetailPage (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}
// 免保零件明细新增/编辑
export function freeMaintenancePolicyPartDetailUpdate (data) {
  return api.jsonPost(prefixDetail + 'addOrUpdate', data);
}
// 根据公告车型ID删除免保零件明细
export function freeMaintenancePolicyPartDetailDeleteVehicle (data) {
  return api.jsonPost(prefixDetail + 'deleteByVehicleRegisteredModel', data);
}

const prefixReplace = 'claimreturn/claim/web/basic/freeMaintenancePartReplaceDetail/';
// 替换件免保零件明细分页查询
export function freeMaintenancePartReplaceDetailPage (data) {
  return api.jsonPost(prefixReplace + 'page', data);
}
// 免保零件替换件明细新增/编辑
export function freeMaintenancePartReplaceDetailUpdate (data) {
  return api.jsonPost(prefixReplace + 'addOrUpdate', data);
}

// 免费保养政策设置删除
export function freeMaintenancePartReplaceDetailDelete (data) {
  return api.jsonPost(prefixReplace + 'delete', data);
}
