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
 * 维修项目--筛选
 * @param {Object} data
 */
export function filterRepairItem (data) {
  return api.jsonPost(prefix + 'repairItem/filter', data);
}

/**
 * 维修零件-筛选
 * @param {Object} data
 */
export function filterSparePartItem (data) {
  return api.jsonPost('sp/web/basic/sparePart/repairItem/filter', data);
}

/**
 * 维修项目--签字
 * @param {Object} data
 */
export function confirmToSign (data) {
  return api.jsonPost(prefix + 'confirmToSign', data);
}

/**
 * 维修项目--待派工项目
 * @param {Object} data
 */
export function getRepairWorkRecord (data) {
  return api.jsonPost(prefix + 'repairWorkRecord', data);
}

/**
 * 维修项目--派工
 * @param {Object} data
 */
export function dispatchWorkers (data) {
  return api.jsonPost(prefix + 'dispatchWorkers', data);
}

/**
 * 维修项目--开始作业
 * @param {Object} data
 */
export function startWork (data) {
  return api.jsonPost(prefix + 'startWork', data);
}

/**
 * 作废
 * @param {Object} data
 */
export function cancelItem (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 打印详情
 * @param {Object} data
 */
export function getPrintInfo (data) {
  return api.jsonPost(prefix + 'printServiceProxy', data);
}

/**
 * 结算
 * @param {Object} data
 */
export function addStatement (data) {
  return api.jsonPost(prefix + 'statement/add', data);
}

/**
 * 取消结算
 * @param {Object} data
 */
export function cancelStatement (data) {
  return api.jsonPost(prefix + 'statement/cancel', data);
}

/**
 * 工位
 * @param {Object} data
 */
export function getDealerStation (data) {
  return api.jsonPost('maintain/web/basic/dealerStation/list/v2', data);
}

/**
 * 技师
 * @param {Object} data
 */
export function getDealerTeamUserRelation (data) {
  return api.jsonPost('maintain/web/basic/dealerRelationUser/list/v2', data);
}

/**
 * 班组
 * @param {Object} data
 */
export function getDealerWorkTeam (data) {
  return api.jsonPost('maintain/web/basic/dealerWorkTeam/list/v2', data);
}

/**
 * 退料列表
 * @param {Object} data
 */
export function getSpSparePartList (data) {
  return api.jsonPost('maintain/web/sp/spSparePart/page', data);
}

/**
 * 退料
 * @param {Object} data
 */
export function refundPart (data) {
  return api.jsonPost('maintain/web/sp/spSparePart/refundPart', data);
}

/**
 * 提交项目维修信息
 * @param {Object} data
 */
export function saveRepairItem (data) {
  return api.jsonPost(prefix + 'repairItem/save', data);
}
