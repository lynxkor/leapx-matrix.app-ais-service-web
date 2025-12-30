import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'claimreturn/claim/web/basic/techServiceActivity/';

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
 * 提交零件准备
 * @param {Object} data
 */
export function submitPartsPreparation (data) {
  return api.jsonPost(prefix + 'submitPartsPreparation', data);
}

/**
 * 零配件准备完成
 * @param {Object} data
 */
export function partsPreparationCompleted (data) {
  return api.jsonPost(prefix + 'partsPreparationCompleted', data);
}

const prefixScheme = 'claimreturn/claim/web/basic/techServiceActivityScheme/';
// 服务活动方案列表查询
export function techServiceActivitySchemeList (data) {
  return api.jsonPost(prefixScheme + 'list', data);
}
// 服务活动方案列表查询
export function techServiceActivitySchemeDelete (data) {
  return api.jsonPost(prefixScheme + 'delete', data);
}
// 服务活动方案详情信息
export function techServiceActivitySchemeGet (data) {
  return api.jsonPost(prefixScheme + 'get', data);
}
// 服务活动方案新增/编辑
export function techServiceActivitySchemeUpdate (data) {
  return api.jsonPost(prefixScheme + 'addOrUpdate', data);
}
// 拷贝方案
export function techServiceActivitySchemeCopy (data) {
  return api.jsonPost(prefixScheme + 'copy', data);
}

const ItemPart = 'claimreturn/claim/web/basic/techServiceActivityItem/';
// 技术服务活动项目分页查询
export function techServiceActivityItemPage (data) {
  return api.jsonPost(ItemPart + 'page', data);
}
// 技术服务活动项目详情信息
export function techServiceActivityItemGet (data) {
  return api.jsonPost(ItemPart + 'get', data);
}
// 技术服务活动项目新增/编辑
export function techServiceActivityItemUpdate (data) {
  return api.jsonPost(ItemPart + 'addOrUpdate', data);
}
// 技术服务活动项目删除
export function techServiceActivityItemDelete (data) {
  return api.jsonPost(ItemPart + 'delete', data);
}

const prefixPart = 'claimreturn/claim/web/basic/techServiceActivityPart/';
// 技术服务活动零件列表查询
export function techServiceActivityPartPage (data) {
  return api.jsonPost(prefixPart + 'page', data);
}
// 技术服务活动零件详情信息
export function techServiceActivityPartGet (data) {
  return api.jsonPost(prefixPart + 'get', data);
}
// 技术服务活动零件新增/编辑
export function techServiceActivityPartUpdate (data) {
  return api.jsonPost(prefixPart + 'addOrUpdate', data);
}
// 技术服务活动零件删除
export function techServiceActivityPartDelete (data) {
  return api.jsonPost(prefixPart + 'delete', data);
}

const prefixFileConfig = 'claimreturn/claim/web/basic/techServiceActivityFileConfig/';
// 服务活动自动审批附件分页查询
export function techServiceActivityFileConfigPage (data) {
  return api.jsonPost(prefixFileConfig + 'page', data);
}
// 服务活动自动审批附件详情信息
export function techServiceActivityFileConfigGet (data) {
  return api.jsonPost(prefixFileConfig + 'get', data);
}
export function techServiceActivityFileConfigUpdate (data) {
  return api.jsonPost(prefixFileConfig + 'addOrUpdate', data);
}
export function techServiceActivityFileConfigDelete (data) {
  return api.jsonPost(prefixFileConfig + 'delete', data);
}
