// 车辆保养
import api from '@/axios';

const prefix = '/datacenter/web/common/';

/**
 * 查询table配置
 * @param {Object} data
 */
export function getTableConfig (tableCode) {
  return api.get(prefix + 'userDefineTable/get', { tableCode });
};

/**
 * 新增或修改Table配置
 * @param {Object} data
 */
export function tableAddOrUpdate (data) {
  return api.jsonPost(prefix + 'userDefineTable/addOrUpdate', data);
}

/**
 * 列表导出
 * @param {*} data
 */
export function exportTable (data) {
  return api.jsonPost('/data/excelOperate/commonExport', data);
}

/**
 * 枚举通用接口
 * @param {*} data
 */
export function getEnum (code) {
  return api.jsonPost('/datacenter/web/common/commonDictValue/get', { dictType: code });
}

/**
 * 根据名称或工号查询用户
 * @param {*} data
 */
export function getUserByNameOrNo (data) {
  return api.jsonPost('/accountService/user/listByNameOrEmpNo', data);
}

/**
 * 门店模糊搜索
 * @param {*} data
 */
export function listOrgStoreInfo (data) {
  return api.jsonPost('/network/portal/store/page', data);
}

/**
 * 门店模糊搜索
 * @param {*} data
 */
// export function listOrgStoreInfo (data) {
//   return api.get('/accountService/orgInfo/listOrgStoreInfo', data);
// }

/**
 * 车型模糊搜索
 * @param {*} data
 */
export function listVehicleModel (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleModel/list', data);
}

/**
 * 年款模糊搜索
 * @param {*} data
 */
export function listVehicleYearType (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleYearType/list', data);
}

/**
 * 维修类型模糊搜索
 * @param {*} data
 */
export function repairItemType (data) {
  return api.jsonPost('/maintain/web/basic/repairItemType/list', data);
}

/**
 * 城市模糊搜索
 * @param {*} data
 */
export function cityPage (data) {
  return api.jsonPost('/area/findPage/city', data);
}

/**
 * 销售公告车型模糊搜索
 * @param {*} data
 */
export function vehicleSalesVersionList (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleRegisteredModel/list', data);
}
