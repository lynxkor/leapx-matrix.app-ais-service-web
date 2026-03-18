import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'datacenter/web/vehicle/vehicleProfile/';

export function vehicleListFull (data) {
  return api.jsonPost(prefix + 'listFull', data);
};

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'pageFlat', data);
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
 * 查询详情(平铺)
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'getFlat', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}

/**
 * 查询加密数据
 * @param {String} id
 * @param {String} field
 */
export function getDetailDecryptField (id, field) {
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
/**
 * 平铺更新
 * @param {Object} data
 */
export function updateFlat (data) {
  return api.jsonPost(prefix + 'updateFlat', data);
}

/**
 * 退车
 * @param {Object} data
 */
export function vehicleReturn (data) {
  return api.jsonPost(prefix + 'return', data);
}

const vePrefix = 'datacenter/web/vehicle/vehicleProfileMaintenanceRecord/';
/**
 * 车辆档案-零件保养信息表分页查询
 * @param {*} data
 * @returns
 */
export function vehicleProfileMaintenanceRecordPage (data) {
  return api.jsonPost(vePrefix + 'page', data);
}

/**
 * 分页查询车辆关键信息变更日志
 * @param {*} data
 * @returns
 */
export function keyInfoChangeLogPage (data) {
  return api.jsonPost('/datacenter/web/vehicle/keyInfoChangeLog/page', data);
}

/**
 * PC端 接车施工单-维修履历信息管理
 * @param {*} data
 * @returns
 */
export function serviceProxyHisPage (data) {
  return api.jsonPost('/datacenter/web/vehicle/serviceProxyHis/page', data);
}

// 权益查询
export function rightsQuery (data) {
  return api.jsonPost('/claimreturn/claim/web/warrantyapply/warrantyApply/rights/query', data);
}
export function warrantyForecast (data) {
  return api.jsonPost('/datacenter/web/vehicle/vehicleProfile/warrantyForecast', data);
}

// 同步车机
export function syncMaintenance (data) {
  return api.jsonPost('/datacenter/web/vehicle/vehicleProfile/syncMaintenance', data);
}

/**
 * 编辑保养信息
 * @param {Object} data
 */
export function editMaintenanceRecord (data) {
  return api.jsonPost(vePrefix + 'edit', data);
}
