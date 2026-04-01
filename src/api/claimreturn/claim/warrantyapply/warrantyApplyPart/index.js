import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantyapply/warrantyApplyPart/';

/**
 * 保修零件清单分页查询
 * @param {Object} data
 */
export function warrantyApplyPartPage (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function warrantyApplyPartUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function warrantyApplyPartDelete (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 查询
 * @param {Object} data
 */
export function warrantyApplyPartGetDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}
