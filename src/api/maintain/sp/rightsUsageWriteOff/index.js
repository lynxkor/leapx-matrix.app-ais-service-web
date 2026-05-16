import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/sp/serviceStatementRightsUsageRecord/';

/**
 * 查询列表
 * @param {Object} data
 */
export function pageWriteOff (data) {
  return api.jsonPost(prefix + 'pageWriteOff', data);
};
