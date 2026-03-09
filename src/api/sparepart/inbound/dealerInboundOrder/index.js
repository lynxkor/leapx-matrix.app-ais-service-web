import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/dealer/dealerInboundOrder/';

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
 * 外购件入库明细表分页查询
 * @param {Object} data
 */
export function dealerInboundOrderDetailPage (data) {
  return api.jsonPost('/sp/web/dealer/dealerInboundOrderDetail/page', data);
}

/**
 * 提交
 * @param {Object} data
 */
export function dealerInboundOrderCommit (data) {
  return api.jsonPost('/sp/web/dealer/dealerInboundOrder/commit', data);
}

/**
 * 通过
 * @param {Object} data
 */
export function dealerInboundOrderAgree (data) {
  return api.jsonPost('/sp/web/dealer/dealerInboundOrder/agree', data);
}

/**
 * 驳回
 * @param {Object} data
 */
export function dealerInboundOrderReject (data) {
  return api.jsonPost('/sp/web/dealer/dealerInboundOrder/reject', data);
}

/**
 * 入库
 * @param {Object} data
 */
export function dealerInboundOrderInbound (data) {
  return api.jsonPost('/sp/web/dealer/dealerInboundOrder/inbound', data);
}

/**
 * 申请退货
 * @param {Object} data
 */
export function dealerInboundOrderReturnApply (data) {
  return api.jsonPost('/sp/web/dealer/dealerInboundOrder/returnApply', data);
}
