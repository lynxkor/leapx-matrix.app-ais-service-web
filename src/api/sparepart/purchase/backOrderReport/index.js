import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/purchase/backOrder/';

/**
 * 查询列表 备件缺货营销看板
 * @param {Object} data
 */
export function categoryPage (data) {
  return api.jsonPost(prefix + 'categoryPage', data);
};

/**
 * 查询列表 备件缺货备件看板
 * @param {Object} data
 */
export function sparePartPage (data) {
  return api.jsonPost(prefix + 'sparePartPage', data);
};
