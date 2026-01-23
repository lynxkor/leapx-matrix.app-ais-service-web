import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'claimreturn/oldpart/web/destroy/oldPartDestroyOrder/';

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
 * 检查销毁条件（点击销毁按钮时调用）
 * @param {Object} data
 */
export function checkDestroy (data) {
  return api.jsonPost(prefix + 'checkDestroy', data);
}

/**
 * 提交销毁申请
 * @param {Object} data
 */
export function executeDestroy (data) {
  return api.jsonPost(prefix + 'executeDestroy', data);
}

/**
 * 审批旧件销毁单
 * @param {Object} data
 */
export function approve (data) {
  return api.jsonPost(prefix + 'approve', data);
}
