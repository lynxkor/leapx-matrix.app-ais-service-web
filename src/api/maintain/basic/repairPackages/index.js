import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/basic/repairPackages/';

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
 * 下发
 * @param {Object} data
 */
export function issue (data) {
  return api.jsonPost(prefix + 'issue', data);
}

/**
 * 撤回
 * @param {Object} data
 */
export function backout (data) {
  return api.jsonPost(prefix + 'backout', data);
}

/**
 * 维修套餐--类型表列表查询
 * @param {Object} data
 */
export function getRepairType (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesType/list', data);
}

/**
 * 套餐类型适配车型分页查询
 * @param {Object} data
 */
export function getModel (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesModel/page', data);
}

/**
 * 套餐类型适配车型添加
 * @param {Object} data
 */
export function saveModelBatch (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesModel/saveBatch', data);
}

/**
 * 维修套餐--维修项目分页查询
 * @param {Object} data
 */
export function getPackagesItem (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesItem/page', data);
}
