import api from '@/axios';

// 保修参数配置
const prefix = 'claimreturn/web/claim/basic/warrantyParameterConfig/';

/**
 * 更新参数
 * @param {Object} data
 */
export function update (data) {
  return api.jsonPost(prefix + 'update', data);
};

/**
 * 根据 code 获取系统参数
 * @param {Object} data
 */
export function getConfig (data) {
  return api.jsonPost(prefix + 'get', data);
};
