import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/dealer/sharedTransferInbound/';
const prefixDetail = SPARE_PREFIX + '/web/dealer/sharedTransferInboundDetail/';
/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 明细分页查询（按明细维度返回行）
 * @param {Object} data
 */
export function detailPage (data) {
  return api.jsonPost(prefix + 'detailPage', data);
}

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
 * 签收共享调拨入库单
 * @param {Object} data
 */
export function getSign (data) {
  return api.jsonPost(prefix + 'sign', data);
}

/**
 * 共享备件调拨入库明细表分页查询
 * @param {Object} data
 */
export function sharedTransferInboundDetailPage (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}
