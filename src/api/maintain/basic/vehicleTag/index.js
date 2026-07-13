import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/basic/vehicleTag/';

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
 * 查询VIN列表
 * @param {Object} data
 */
export function getVinList (data) {
  return api.jsonPost(prefix + 'pageTagVin', data);
}

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdateVin (data) {
  return api.jsonPost(prefix + 'addOrUpdateTagVin', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function deleteVin (data) {
  return api.jsonPost(prefix + 'deleteVehicleTagVinByIds', data);
}
