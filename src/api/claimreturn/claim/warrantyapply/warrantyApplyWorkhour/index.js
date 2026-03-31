import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantyapply/warrantyApplyWorkhour/';

/**
 * 查询列表
 * @param {Object} data
 */
export function warrantyApplyWorkhourPage (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function warrantyApplyWorkhourUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function warrantyApplyWorkhourDelete (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 查询
 * @param {Object} data
 */
export function warrantyApplyWorkhourGetDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}
