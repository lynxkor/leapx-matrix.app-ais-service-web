import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = '{{apiPath}}/';

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

{{#each detailList}}
{{#if isSearch}}
/**
 * {{description}}下拉接口
 */
export function {{key}}SearchApi (data) {
  return api.jsonPost('{{@root.pathPrefix}}{{searchUrl}}', data);
}
{{/if}}
{{/each}}
{{#if detailApiPath}}
/**
 * 详情表格接口
 * @param {Object} data
 * @returns
 */
export function getDetailList (data) {
  return api.jsonPost('{{detailApiPath}}', data);
}
{{/if}}
{{#if detailAddPath}}
/**
 * 详情表格新增接口
 * @param {Object} data
 * @returns
 */
export function addDetail (data) {
  return api.jsonPost('{{detailAddPath}}', data);
}
{{/if}}
{{#if detailRemovePath}}
/**
 * 详情表格删除接口
 * @param {Object} data
 * @returns
 */
export function removeDetail (data) {
  return api.jsonPost('{{detailRemovePath}}', data);
}
{{/if}}
{{#if dialogApiPath}}
/**
 * 弹窗表格查询接口
 * @param {Object} data
 * @returns
 */
export function getDialogList (data) {
  return api.jsonPost('{{dialogApiPath}}', data);
}
{{/if}}

{{#if detailSearchPath}}
export function detailSearchApi (data) {
  return api.jsonPost('{{detailSearchPath}}', data);
}
{{/if}}