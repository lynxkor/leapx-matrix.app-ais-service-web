import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantysettle/warrantySettle/';

/**
 * 保修结算验收明细报表 - 分页查询
 * @param {Object} data
 */
export function getAcceptedDetailReport (data) {
  return api.jsonPost(prefix + 'acceptedDetailReport', data);
};
