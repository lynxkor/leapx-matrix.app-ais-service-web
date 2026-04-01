import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantyapply/warrantyApplyOther/';

/**
 * 保修其他清单分页查询
 * @param {Object} data
 */
export function warrantyApplyOtherPage (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function warrantyApplyOtherUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function warrantyApplyOtherDelete (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 查询
 * @param {Object} data
 */
export function warrantyApplyOtherGetDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}
