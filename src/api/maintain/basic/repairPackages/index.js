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

/**
 * 维修套餐--零配件表列表查询
 * @param {Object} data
 */
export function getPackagesPart (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesPart/list', data);
}

/**
 * 维修套餐--维修项目新增/编辑
 * @param {Object} data
 */
export function getAddOrUpdate (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesItem/addOrUpdate', data);
}

/**
 * 维修套餐--类型表列表查询
 * @param {Object} data
 */
export function repairList (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesType/list', data);
}

/**
 * 维修套餐--类型表排序（上移/下移）
 * @param {Object} data
 */
export function moveSort (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesType/moveSort', data);
}

/**
 * 维修套餐--类型表新增/编辑
 * @param {Object} data
 */
export function addOrUpdateBatch (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesType/addOrUpdateBatch', data);
}

/**
 * 维修套餐--类型表启用/禁用
 * @param {Object} data
 */
export function enableOrDisable (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesType/enableOrDisable', data);
}

/**
 * 维修套餐--适配车型表删除
 * @param {Object} data
 */
export function modelDelete (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesModel/delete', data);
}

/**
 * 维修套餐--零配件表删除
 * @param {Object} data
 */
export function partDelete (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesPart/delete', data);
}

/**
 * 维修套餐--维修项目详情
 * @param {Object} data
 */
export function repairItemDetail (data) {
  return api.jsonPost('maintain/web/basic/repairPackagesItem/get', data);
}
