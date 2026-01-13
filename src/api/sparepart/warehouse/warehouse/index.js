import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/warehouse/warehouse/';
const localtion_prefix = SPARE_PREFIX + '/web/warehouse/location/';

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
 * 门店备件库位表新增/编辑
 * @param {Object} data
 */
export function locationList (data) {
  return api.jsonPost(localtion_prefix + 'list', data);
}

/**
 * 门店备件库位表新增/编辑
 * @param {Object} data
 */
export function locationOrUpdate (data) {
  return api.jsonPost('sp/web/warehouse/location/addOrUpdate', data);
}

/**
 * 门店备件库位表分页查询
 * @param {Object} data
 */
export function locationPage (data) {
  return api.jsonPost('sp/web/warehouse/location/page', data);
}

/**
 * 门店备件库位表删除
 * @param {Object} data
 */
export function locationDel (data) {
  return api.jsonPost('sp/web/warehouse/location/delete', data);
}
