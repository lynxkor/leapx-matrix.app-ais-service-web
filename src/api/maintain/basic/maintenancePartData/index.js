import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/basic/maintenancePartData/';

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
 * 删除零件
 * @param {Object} data
 */
export function deletePartItem (data) {
  return api.jsonPost('maintain/web/basic/maintenancePartList/delete', data);
}

/**
 * 新增零件
 * @param {Object} data
 */
export function addPartItem (data) {
  return api.jsonPost('maintain/web/basic/maintenancePartList/addOrUpdate', data);
}

/**
 * 新增车型
 * @param {Object} data
 */
export function addPartVehModel (data) {
  return api.jsonPost('maintain/web/basic/maintenancePartVehModel/addOrUpdate', data);
}

/**
 * 删除车型
 * @param {Object} data
 */
export function deletePartVehModel (data) {
  return api.jsonPost('maintain/web/basic/maintenancePartVehModel/delete', data);
}
