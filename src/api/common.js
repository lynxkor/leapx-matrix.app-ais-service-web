// 车辆保养
import api from '@/axios';

const prefix = '/datacenter/';

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
  return api.get(`/maintain/web/common/enum/${code}`);
}

/**
 * 根据名称或工号查询用户
 * @param {*} data
 */
export function getUserByNameOrNo (data) {
  return api.jsonPost('/accountService/user/listByNameOrEmpNo', data);
}
