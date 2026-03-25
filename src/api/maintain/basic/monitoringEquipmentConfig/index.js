import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/basic/monitoringEquipmentConfig/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 查询列表
 * @param {Object} data
 */
export function pageHasDevicePurpose (data) {
  return api.jsonPost(prefix + 'pageHasDevicePurpose', data);
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
 * 查询没有设备用途的设备列表
 * @param {Object} data
 */
export function getListWithoutPurpose (data) {
  return api.jsonPost(prefix + 'listNoDevicePurpose', data);
}

/**
 * 新增或修改
 * @param {Object} data
 */
export function batchUpdate (data) {
  return api.jsonPost(prefix + 'batchUpdate', data);
}
