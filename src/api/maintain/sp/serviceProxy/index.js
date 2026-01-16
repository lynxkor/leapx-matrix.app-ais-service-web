import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/sp/serviceProxy/';

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
  return api.jsonPost(prefix + 'detail', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function getStatistics (data) {
  return api.jsonPost(prefix + 'statistics', data);
}

/**
 * 获取字典
 * @param {Object} data
 */
export function getEnum (code) {
  return api.jsonPost(`maintain/web/common/enum/${code}`);
}

/**
 * 查询车辆档案
 * @param {Object} data
 */
export function getVehicleProfile (data) {
  return api.jsonPost('datacenter/web/vehicle/vehicleProfile/listFull', data);
}

/**
 * 查询车联网信息
 * @param {Object} data
 */
export function getCarInfo (data) {
  return api.jsonPost(prefix + 'getCarInfo', data);
}

/**
 * vin校验
 * @param {Object} data
 */
export function checkVinTag (data) {
  return api.jsonPost('maintain/web/basic/vehicleTag/checkVinTag', data);
}

/**
 * 预检确认
 * @param {Object} data
 */
export function precheck (data) {
  return api.jsonPost(prefix + 'precheck', data);
}

/**
 * 优惠模式
 * @param {Object} data
 */
export function getDiscountType (data) {
  return api.jsonPost('maintain/web/basic/dealerDiscount/repairItem', data);
}

/**
 * 维修项目--详情
 * @param {Object} data
 */
export function getRepairItemInfo (data) {
  return api.jsonPost(prefix + 'repairItemInfo', data);
}

/**
 * 维修项目--详情
 * @param {Object} data
 */
export function filterRepairItem (data) {
  return api.jsonPost(prefix + 'repairItem/filter', data);
}
