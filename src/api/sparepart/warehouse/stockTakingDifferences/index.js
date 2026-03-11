import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/dealer/stockTakingDifferences/';

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
 * 申请
 * @param {Object} data
 */
export function getApply (data) {
  return api.jsonPost(prefix + 'apply', data);
}

/**
 * 盘亏同意
 * @param {Object} data
 */
export function agreeLoss (data) {
  return api.jsonPost(prefix + 'agreeLoss', data);
}

/**
 * 盘亏拒绝
 * @param {Object} data
 */
export function rejectLoss (data) {
  return api.jsonPost(prefix + 'rejectLoss', data);
}

/**
 * 盘盈同意
 * @param {Object} data
 */
export function agreeProfit (data) {
  return api.jsonPost(prefix + 'agreeProfit', data);
}

/**
 * 盘盈拒绝
 * @param {Object} data
 */
export function rejectProfit (data) {
  return api.jsonPost(prefix + 'rejectProfit', data);
}

/**
 * 入库
 * @param {Object} data
 */
export function getInbound (data) {
  return api.jsonPost(prefix + 'inbound', data);
}

/**
 * 出库
 * @param {Object} data
 */
export function getOutbound (data) {
  return api.jsonPost(prefix + 'outbound', data);
}

/**
 * 备件异常清单
 * @param {Object} data
 */
export function getExceptionList (data) {
  return api.jsonPost(prefix + 'exceptionList', data);
}

/**
 * 清空异常后创建差异单
 * @param {Object} data
 */
export function clearAndDifferences (data) {
  return api.jsonPost(prefix + 'clearAndDifferences', data);
}

/**
 * 备件盘点差异单明细表分页查询
 * @param {Object} data
 */
export function differencesDetailPage (data) {
  return api.jsonPost('/sp/web/dealer/stockTakingDifferencesDetail/page', data);
}
