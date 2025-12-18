import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = '/sp/web/basic/spareSalesCategory/';

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
 * 备件可采购门店表分页查询
 * @param {Object} data
 */
export function categoryPurchaseDealer (data) {
  return api.jsonPost('/sp/web/basic/categoryPurchaseDealer/page', data);
}

/**
 * 备件可采购门店表新增
 * @param {Object} data
 */
export function addDealer (data) {
  return api.jsonPost('/sp/web/basic/categoryPurchaseDealer/addOrUpdate', data);
}

/**
 * 删除备件可采购门店表
 * @param {Object} data
 */
export function deleteDealer (data) {
  return api.jsonPost('/sp/web/basic/categoryPurchaseDealer/delete', data);
}
