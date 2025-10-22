import api from '@/axios';

/**
 * 查询当前用户拥有的所有资源列表
 * @export
 * @param {*} params
 * @returns
 */
export function getOwnerTree (params) {
  return api.get('/passport/resourceInfo/owner/tree', params);
};

/**
 * 获取资源列表
 * @export
 * @param {*} params
 * @returns
 */
export function getPageSourceList (params) {
  return api.getMockdata('/passport/resourceInfo/page', params);
};
