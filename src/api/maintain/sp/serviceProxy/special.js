import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/sp/special/';

/**
 * 特殊开单--维修套餐--列表查询
 * @param {Object} data
 */
export function getRpList (data) {
  return api.jsonPost(prefix + 'rp/list', data);
};

/**
 * 特殊开单--维修套餐--套餐类型
 * @param {Object} data
 */
export function getRpListType (data) {
  return api.jsonPost(prefix + 'rp/list/type', data);
};

/**
 * 特殊开单--维修套餐--详情
 * @param {Object} data
 */
export function getRpDetail (data) {
  return api.jsonPost(prefix + 'rp/detail', data);
};

/**
 * 特殊开单--维修套餐--使用
 * @param {Object} data
 */
export function useRp (data) {
  return api.jsonPost(prefix + 'rp/use', data);
};

/**
 * 特殊开单--维修套餐--取消
 * @param {Object} data
 */
export function cancel (data) {
  return api.jsonPost(prefix + 'cancel', data);
};

/**
 * 获取枚举
 * @param {Object} data
 */
export function getEnum (data) {
  return api.jsonPost(`maintain/web/common/enum/${data}`, data);
};

/**
 * 特殊开单--服务活动--列表查询
 * @param {Object} data
 */
export function getActivityList (data) {
  return api.jsonPost(prefix + 'activity/list', data);
};

/**
 * 特殊开单--服务活动--详情
 * @param {Object} data
 */
export function getActivityDetail (data) {
  return api.jsonPost(prefix + 'activity/detail', data);
};

/**
 * 特殊开单--服务活动--使用
 * @param {Object} data
 */
export function useActivity (data) {
  return api.jsonPost(prefix + 'activity/use', data);
};

/**
 * 特殊开单--权益套餐--列表查询
 * @param {Object} data
 */
export function getEquityList (data) {
  return api.jsonPost(prefix + 'equity/list', data);
};

/**
 * 特殊开单--权益套餐--详情
 * @param {Object} data
 */
export function getEquityDetail (data) {
  return api.jsonPost(prefix + 'equity/detail', data);
};

/**
 * 特殊开单--权益套餐--使用
 * @param {Object} data
 */
export function useEquity (data) {
  return api.jsonPost(prefix + 'equity/use', data);
};
