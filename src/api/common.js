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
  const { businessParams, async, id, token, headers, ...restConfig } = config;
  // 动态构建 params 对象，使用解构和条件展开
  const params = {
    id,
    token,
    ...(async && { async }),
    ...(businessParams && { businessParams }) // 如果 businessParams 存在，则添加到 params 中
  };
  return api.postExport('/data/ExcelManage/importExcelConfirm', formData, {
    params, // 直接使用动态构建的 params
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restConfig
  });
}

/**
 * 异步列表模板确认
 * @param {*} dataMergeConfirm true 数据合并确认 false 数据分批确认
 * @param {*} data
 * @param {*} formData
 * @param {*} config
 */
export function asyncImportExcelConfirm (dataMergeConfirm, formData, config = {}) {
  const { businessParams, id, token, headers, ...restConfig } = config;
  // 动态构建 params 对象，使用解构和条件展开
  const params = {
    id,
    token,
    dataMergeConfirm,
    ...(businessParams && { businessParams }) // 如果 businessParams 存在，则添加到 params 中
  };
  return api.postExport('/data/ExcelManage/asyncImportExcelConfirm', formData, {
    params, // 直接使用动态构建的 params
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    ...restConfig
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
 * 用户查询接口
 * @param {} data
 * @returns
 */
export function userQuery (data) {
  return api.jsonPost('/datacenter/web/common/user/query', data);
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
 * 备件营销分类
 * @param {*} data
 */
export function getCategory (data) {
  return api.jsonPost('/sp/web/basic/spareSalesCategory/page', data);
}

/**
 * 备件主数据表列表查询
 * @param {*} data
 */
export function sparePartListShort (data) {
  return api.jsonPost('/sp/web/basic/sparePart/list', data);
}

/**
 * 备件主数据表列表查询
 * @param {*} data
 */
export function listDealerPart (data) {
  return api.jsonPost('/sp/web/basic/sparePart/listDealerPart', data);
}

export function listDealerPartWithOem (data) {
  return api.jsonPost('/sp/web/basic/sparePart/listDealerPartWithOem', data);
};

/**
 * 母公司列表查询
 * @param {*} data
 */
export function getParentCompany (data) {
  return api.jsonPost('/network/portal/parentCompany/page', data);
}

/**
 * 备件仓库列表查询
 * @param {*} data
 */
export function listWarehouse (data) {
  return api.jsonPost('/sp/web/warehouse/warehouse/list', data);
}
export function listOemWarehouse (data) {
  return api.jsonPost('/sp/web/warehouse/warehouse/listOem', data);
}

/**
 * 备件母公司下拉框查询
 * @param {*} data
 */
export function getSparePartCompany (data) {
  return api.jsonPost('/sp/web/base/common/listCompany', data);
}

/**
 * 备件门店下拉框搜索
 * @param {*} data
 */
export function listOrgStoreInfoByParam (data) {
  return api.jsonPost('/sp/web/base/common/listDealer', data);
}

/**
 * 备件门店详情查询
 * @param {*} data
 */
export function getPartDealer (data) {
  return api.jsonPost('/sp/web/base/dealer/getDealer', data);
}

/**
 * 备件 门店供应商查询
 * @param {*} data
 */
export function getSupplierInfo (data) {
  return api.jsonPost('/sp/web/basic/supplierInfo/listDealer', data);
}

/**
 * 备件 OEM供应商查询
 * @param {*} data
 */
export function getSupplierInfoOem (data) {
  return api.jsonPost('/sp/web/basic/supplierInfo/list', data);
}

/**
 * 备件用户信息查询
 * @param {*} data
 */
export function getLoginUser (data) {
  return api.jsonPost('/sp/web/base/loginUser/getLoginUser', data);
}

/**
 * 维保枚举保养分类
 * @param {*} data
 */
export function getMaintenanceItemEnum (data) {
  return api.jsonPost('/maintain/web/common/enum/MaintenanceItemEnum', data);
}

/**
 * 备件通过code查id 跳转用
 * @param {*} data
 */
export function getSparePartOrderIdByCode (data) {
  return api.jsonPost('/sp/web/base/common/getIdByCode', data);
}

/**
 * 物流 跟踪
 * @param {*} data
 */
export function getLogistics (data) {
  return api.jsonPost('/sp/web/base/common/getLogistics', data);
}

/**
 * 省模糊搜索
 * @param {*}
 */
export function getProvinceTree () {
  return api.get('/area/tree');
}

/**
 * 城市分页搜索
 * @param {*} data
 */
export function cityPage (data) {
  return api.jsonPost('/area/findPage/city', data);
}

/**
 * 城市模糊搜索
 * @param {*} data
 */
export function cityListByName (data) {
  return api.post('/area/search/city', data);
}

/**
 * 根据组织类型查询组织列表
 * @export
 * @param
 * @returns
 */
export function getScopeTypeOrg (data) {
  return api.jsonPost('/users/scope/type/org', data);
}

/**
 * 门店备件仓库表列表查询
 * @export
 * @param
 * @returns
 */
export function listOemFull (data) {
  return api.jsonPost('/sp/web/warehouse/warehouse/listOemFull', data);
}

/**
 * 查询加密数据
 * @param {String} id
 * @param {String} field
 */
export function getDesensitize (id, type, field) {
  let param = {
    id,
    type,
    column: field
  };
  return new Promise(resolve => {
    api.jsonPost('/sp/web/base/common/getDesensitize', param).then(res => {
      resolve(res);
    });
  });
}
