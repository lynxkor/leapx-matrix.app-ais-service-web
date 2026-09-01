import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';
// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/maintenance/maintenanceReturnInbound/';
const prefix_detail = SPARE_PREFIX + '/web/maintenance/maintenanceOutboundReturnDetail/';

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
 * 维修退件入库
 * @param {Object} data
 */
export function inboundWarehousing (data) {
  return api.jsonPost(prefix_detail + 'inbound', data);
}

/**
 * 维修出库领料明细表分页查询
 * @param {Object} data
 */
export function collarPage (data) {
  return api.jsonPost('sp/web/maintenance/maintenanceOutboundOrderDetail/page', data);
}

/**
 * 维修出库退料明细表分页查询
 * @param {Object} data
 */
export function goPage (data) {
  return api.jsonPost(prefix_detail + 'page', data);
}

/**
 * 维修退料入库 - 明细分页查询（按明细维度返回行）
 * @param {Object} data
 */
export function detailPage (data) {
  return api.jsonPost(prefix_detail + 'detailPage', data);
}
