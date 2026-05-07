import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantysettle/warrantySettleSummary/';

/**
 * 分页查询保修结算汇总报表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 查询保修结算汇总报表列表（不分页）
 * @param {Object} data
 */
export function getAllList (data) {
  return api.jsonPost(prefix + 'list', data);
};
