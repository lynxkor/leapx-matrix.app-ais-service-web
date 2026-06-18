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
export function endWork (data) {
  return api.jsonPost(prefix + 'endWork', data);
}

/**
 * 作废
 * @param {Object} data
 */
export function cancelItem (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 搜索施工单
 * @param {Object} data
 */
export function selectServiceProxy (data) {
  return api.jsonPost(prefix + 'selectServiceProxy', data);
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

/**
 * 取消终检
 * @param {Object} data
 */
export function cancelFinal (data) {
  return api.jsonPost(prefix + 'cancelFinal', data);
}
export function deleteDispatchWorkers (data) {
  return api.jsonPost(prefix + 'deleteWorkers', data);
}

/**
 * 终检-项目明细
 * @param {Object} data
 */
export function getFinalInspectionDetail (data) {
  return api.jsonPost(prefix + 'finalInspectionDetail', data);
}

/**
 * 终检
 * @param {Object} data
 */
export function finalInspection (data) {
  return api.jsonPost(prefix + 'finalInspection', data);
}

/**
 * 质检
 * @param {Object} data
 */
export function qualityInspection (data) {
  return api.jsonPost(prefix + 'qualityInspection', data);
}

/**
 * 返修
 * @param data
 */
export function repaired (data) {
  return api.jsonPost(prefix + 'repaired', data);
}

/**
 * 维修类型列表查询
 * @param data
 */
export function getRepairItemTypeList (data) {
  return api.jsonPost('maintain/web/basic/repairItemType/list', data);
}

/**
 * 结算类型列表查询
 * @param data
 */
export function getCheckoutTypeList (data) {
  return api.jsonPost('maintain/web/basic/checkoutType/list', data);
}

/**
 * 搜索故障模块
 * @param {Object} data
 */
export function getCCCList (data) {
  return api.jsonPost(prefix + 'cccList', data);
}

/**
 * 新增故障模块
 * @param data
 */
export function updateSpFaultAlertRecord (data) {
  return api.jsonPost('maintain/web/sp/spFaultAlertRecord/addOrUpdate', data);
}

/**
 * 新增故障模块
 * @param data
 */
export function deleteSpFaultAlertRecord (data) {
  return api.jsonPost('maintain/web/sp/spFaultAlertRecord/delete', data);
}

/**
 * 查询门店详情
 * @param data
 */
export function getStoreDetailByCode (data) {
  return api.jsonPost(prefix + 'getStoreDetailByCode', data);
}
/**
 * 查询用户功能权限
 * @param data
 */
export function getDealerPermission (data) {
  return api.jsonPost('maintain/web/basic/dealerPermission/list', data);
}

/**
 * 查询提醒信息
 * @param data
 */
export function getSpRemindInfo (data) {
  return api.jsonPost(prefix + 'getSpRemindInfo', data);
}

/**
 * 权益列表
 * @param {Object} data
 */
export function rightsList (data) {
  return api.jsonPost(prefix + 'rightsList', data);
}

/**
 * 检查是否需要留车
 * @param {Object} data - { serviceProxyId: String|Number }
 */
export function isVehRetention (data) {
  return api.jsonPost(prefix + 'isVehRetention', data);
}

/**
 * 新增留车清单
 * @param {Object} data - { serviceProxyId: String|Number }
 */
export function addVehRetentionList (data) {
  return api.jsonPost(prefix + 'addVehRetentionList', data);
}

/**
 * 检查车辆活动
 * @param {Object} data - vin
 */
export function getActivityInfo (data) {
  return api.jsonPost(prefix + 'getActivityInfo', data);
}

/**
 * 更新故障模块
 * @param {Object} data - vin
 */
export function addFaultRecord (data) {
  return api.jsonPost('maintain/web/sp/spFaultAlertRecord/addFaultRecord', data);
}

/**
 * 签字短信重推
 * @param {Object} data - vin
 */
export function resendSignSms (data) {
  return api.jsonPost(prefix + 'resendSignSms', data);
}

/**
 * 查询当天最近的一条施工单
 * @param {Object} data - vin
 */
export function getRecentlyServiceProxy (data) {
  return api.jsonPost(prefix + 'getRecentlyServiceProxy', data);
}

/**
 * 出厂台次名细分页查询
 * @param {Object} data
 */
export function pageDepartureDetail (data) {
  return api.jsonPost(prefix + 'pageDepartureDetail', data);
}

/**
 * 车间作业时效表分页查询
 * @param {Object} data
 */
export function pageRepairWorkTimeliness (data) {
  return api.jsonPost(prefix + 'pageRepairWorkTimeliness', data);
}

/**
 * 车间作业时效表分页查询
 * @param {Object} data
 */
export function getLastStoreMileage (data) {
  return api.jsonPost(prefix + 'getLastStoreMileage', data);
}

/**
 * 解密字段
 * @param {String} id
 * @param {String} field
 */
export function getDecrypt (id, field) {
  let param = {
    id,
    decryptFields: [field]
  };
  return new Promise(resolve => {
    api.jsonPost(prefix + 'getDecrypt', param).then(res => {
      resolve(res[field]);
    });
  });
}
