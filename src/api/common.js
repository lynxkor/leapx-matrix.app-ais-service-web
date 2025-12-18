// 车辆保养
import api from '@/axios';

const prefix = '/datacenter/web/common/';

/**
 * 查询table配置
 * @param {Object} data
 */
export function getTableConfig (tableCode) {
  return api.get(prefix + 'userDefineTable/get', { tableCode });
}

/**
 * 新增或修改Table配置
 * @param {Object} data
 */
export function tableAddOrUpdate (data) {
  return api.jsonPost(prefix + 'userDefineTable/addOrUpdate', data);
}

/**
 * 列表通用下载模板
 * @param {*} data
 */
export function getTemplateUrl (data) {
  return api.jsonPost('/data/commonDataProcessExcelModelMap/get', data);
}

/**
 * 列表下载模板 code
 * @param {*} data
 */
export function getTemplateCode (data) {
  return api.jsonPost('/data/commonDataProcessExcelModelMap/code', data);
}

/**
 * 列表模板确认
 * @param {*} data
 */
export function importExcelConfirmFile (formData, config = {}) {
  // 查询参数需要放在 config 或 URL 中
  return api.postExport('/data/ExcelManage/importExcelConfirm', formData, {
    params: {
      // 查询参数放在 config 中
      id: config.id,
      token: config.token,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers,
    },
    ...config,
  });
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
  return api.jsonPost('/datacenter/web/common/commonDictValue/get', {
    dictType: code,
  });
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
// export function listOrgStoreInfo (data) {
//   return api.jsonPost('/network/portal/store/page', data);
// }

/**
 * 门店模糊搜索
 * @param {*} data
 */
export function listOrgStoreInfo (data) {
  return api.get('/accountService/orgInfo/listOrgStoreInfo', data);
}

/**
 * 车型统一 id  name 搜索
 * @param {*} data
 */
export function listVehicleModel (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleModel/list', data);
}

/**
 * 车型详细模糊搜索
 * @param {*} data
 */
export function listVehicleYearTypeFull (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleModel/listFull', data);
}

/**
 * 车系详细模糊搜索
 * @param {*} data
 */
export function listVehicleSeries (data) {
  return api.jsonPost('/datacenter/web/materials/vehicleSeries/listFull', data);
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
  return api.jsonPost(
    '/datacenter/web/materials/vehicleRegisteredModel/list',
    data
  );
}

/**
 * 建店类型接口 级联
 * @param {*} data
 */
export function getBuildType (data) {
  return api.get('/network/portal/DataDict/getBuildType', data);
}

/**
 * 备件主数据表列表查询
 * @param {*} data
 */
export function sparePartList (data) {
  return api.jsonPost('/sp/web/basic/sparePart/listFull', data);
}

/**
 * 备件主数据表列表查询
 * @param {*} data
 */
export function sparePartListShort (data) {
  return api.jsonPost('/sp/web/basic/sparePart/list', data);
}
