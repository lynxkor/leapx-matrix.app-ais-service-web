import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantysettle/warrantySettleCategorySummary/';

/**
 * 分页查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 获取详情
 * @param {String} id
 */
export function getDetail (id) {
  return api.jsonPost(prefix + 'get', id);
};
