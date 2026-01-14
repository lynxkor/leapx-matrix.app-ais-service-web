import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/basic/sparePart/';
const modelPrefix = SPARE_PREFIX + '/web/basic/sparePartVehicleModel/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

export function getSparePart (data) {
  return api.jsonPost(prefix + 'list', data);
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
 * 备件适用车型表分页查询
 * @param {Object} data
 */
export function searchVehicleModel (data) {
  return api.jsonPost(modelPrefix + 'page', data);
}

/**
 * 备件适用车型表新增/编辑
 * @param {Object} data
 */
export function addOrUpdateVehicleModel (data) {
  return api.jsonPost(modelPrefix + 'addOrUpdate', data);
}

/**
 * 备件适用车型表删除
 * @param {Object} data
 */
export function deleteVehicleModel (data) {
  return api.jsonPost(modelPrefix + 'delete', data);
}
