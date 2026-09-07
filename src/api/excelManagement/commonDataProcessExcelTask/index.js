import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'data/commonDataProcessExcelTask/';

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
 * 重试导入任务
 * @param {Number} id
 */
export function retryItem (id) {
  return api.jsonPost('/data/ExcelManage/retryImportTask?id=' + id);
}

/**
 * 重试导出任务
 * @param {Object} data - { taskId }
 */
export function commonExportRetry (data) {
  return api.jsonPost('/data/excelOperate/commonExportRetry', data);
}
