import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/basic/sparePart/';
const modelPrefix = SPARE_PREFIX + '/web/basic/sparePartVehicleModel/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 外购件分页列表
 * @param {Object} data
 */
export function getDealerList (data) {
  return api.jsonPost(prefix + 'dealerPage', data);
};

/**
 * 查询门店备件列表
 * @param {Object} data
 */
export function listDealerPart (data) {
  return api.jsonPost(prefix + 'listDealerPart', data);
};

export function getSparePart (data) {
  return api.jsonPost(prefix + 'list', data);
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
 * 备件适用车型表分页查询
 * @param {Object} data
 */
export function searchVehicleModel (data) {
  return api.jsonPost(modelPrefix + 'page', data);
}

/**
 * 备件适用车型表新增/编辑
 * @param {Object} data
 */
export function addOrUpdateVehicleModel (data) {
  return api.jsonPost(modelPrefix + 'addOrUpdate', data);
}

/**
 * 备件适用车型表删除
 * @param {Object} data
 */
export function deleteVehicleModel (data) {
  return api.jsonPost(modelPrefix + 'delete', data);
}

/**
 * 允许 BO 调拨
 * @param {Object} data
 */
export function allowBoTransfer (data) {
  return api.jsonPost(prefix + 'allowBoTransfer', data);
}

/**
 * 禁止 BO 调拨
 * @param {Object} data
 */
export function forbidBoTransfer (data) {
  return api.jsonPost(prefix + 'forbidBoTransfer', data);
}

/**
 * 允许备附件销售
 * @param {Object} data
 */
export function allowPartsAttachmentSales (data) {
  return api.jsonPost(prefix + 'allowPartsAttachmentSales', data);
}

/**
 * 禁止备附件销售
 * @param {Object} data
 */
export function forbidPartsAttachmentSales (data) {
  return api.jsonPost(prefix + 'forbidPartsAttachmentSales', data);
}
