import api from '@/axios';

// 旧件销毁单设置
const prefix = 'claimreturn/oldpart/web/destroy/oldPartDestroyConfig/';

/**
 * 旧件销毁单设置
 * @param {Object} data
 */
export function update (data) {
  return api.jsonPost(prefix + 'update', data);
};

/**
 * 根据code获取系统参数
 * @param {Object} data
 */
export function getConfig (data) {
  return api.jsonPost(prefix + 'get', data);
};
