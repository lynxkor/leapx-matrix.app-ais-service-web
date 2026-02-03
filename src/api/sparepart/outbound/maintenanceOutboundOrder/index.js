import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'sp/web/maintenance/maintenanceOutboundOrder/';

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
  return api.jsonPost('sp/web/maintenance/maintenanceOutboundReturnDetail/page', data);
}

/**
 * 维修出库领料人
 * @param {Object} data
 */
export function OutboundPeople (data) {
  return api.jsonPost('sp-ywk/web/maintenance/maintenanceOutboundOrderDetail/outbound', data);
}

/**
 * 查询当前用户维修出库单打印设置
 * @param {Object} data
 */
export function getCurrentUserSet (data) {
  return api.jsonPost('sp/web/maintenance/maintenanceOutboundPrintSetting/getCurrentUserSet', data);
}

/**
 * 维修出库单打印设置表新增/编辑
 * @param {Object} data
 */
export function settingUpdate (data) {
  return api.jsonPost('sp/web/maintenance/maintenanceOutboundPrintSetting/addOrUpdate', data);
}
