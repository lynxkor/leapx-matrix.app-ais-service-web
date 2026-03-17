import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/dealer/stockTaking/';
const prefixDetail = SPARE_PREFIX + '/web/dealer/stockTakingDetail/';
/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function deleteItem (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 查询
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}

/**
 * 初始化
 * @param {Object} data
 */
export function initializeItem (data) {
  return api.jsonPost(prefix + 'initialize', data);
}

/**
 * 作废
 * @param {Object} data
 */
export function cancelItem (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 盘点结果新增
 * @param {Object} data
 */
export function addResultItem (data) {
  return api.jsonPost(prefix + 'addResult', data);
}

/**
 * 生成差异单
 * @param {Object} data
 */
export function generateDifferences (data) {
  return api.jsonPost(prefix + 'generateDifferences', data);
}

/**
 * 备件库存盘点明细表分页查询
 * @param {Object} data
 */
export function stockTakingDetailPage (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}

/**
 * 备件库存盘点明细表分页查询
 * @param {Object} data
 */
export function stockTakingDetailDelete (data) {
  return api.jsonPost(prefixDetail + 'delete', data);
}
