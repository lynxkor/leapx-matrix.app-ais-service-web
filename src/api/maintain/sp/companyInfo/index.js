import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/sp/dealerHealthInfo/';

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
 * 开通健康企业档案上传
 * @param {Object} data
 */
export function openUpload (data) {
  return api.jsonPost(prefix + 'openUpload', data);
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
 * 母公司列表
 * @param {Object} data
 */
export function companyList (data) {
  return api.jsonPost(prefix + 'list', data);
}
/**
 * 获取字典
 * @param {Object} data
 */
export function getEnum (code) {
  return api.jsonPost(`maintain/web/common/enum/${code}`);
}
