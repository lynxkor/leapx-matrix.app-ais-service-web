import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/warehouse/inventory/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'oemPage', data);
};
