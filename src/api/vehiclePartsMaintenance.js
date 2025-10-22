// 车辆保养
import api from '@/axios';

const prefix = '/datacenter/vehiclePartsMaintenance/';

/**
 * 查询当前用户拥有的所有资源列表
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
export function getDetail (params) {
  return api.get(prefix + 'get', params);
}
