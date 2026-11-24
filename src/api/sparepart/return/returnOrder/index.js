import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/purchase/returnOrder/';
const prefix_Detail = SPARE_PREFIX + '/web/purchase/returnOrderDetail/';
/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * LP261720 备件退货异常订单视图分页查询（明细维度，固定条件：入库状态≠无需入库）
 * @param {Object} data
 */
export function pageExceptionDetailView (data) {
  return api.jsonPost(prefix + 'pageExceptionDetailView', data);
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
 * 添加备件分页查询
 * @param {Object} data
 */
export function addPartPage (data) {
  return api.jsonPost(prefix_Detail + 'addPartPage', data);
}

/**
 * 备件退货明细表分页查询
 * @param {Object} data
 */
export function returnOrderPage (data) {
  return api.jsonPost(prefix_Detail + 'page', data);
}

/**
 * 备件退货单 - 明细分页查询（按明细维度返回行）
 * @param {Object} data
 */
export function detailPage (data) {
  return api.jsonPost(prefix + 'detailPage', data);
}

/**
 * 备件退货明细表分页查询
 * @param {Object} data
 */
export function exceptionPage (data) {
  return api.jsonPost(prefix_Detail + 'exceptionPage', data);
}

/**
 * 备件退货明细表新增/编辑
 * @param {Object} data
 */
export function returnOrderUpdate (data) {
  return api.jsonPost(prefix_Detail + 'addOrUpdate', data);
}

/**
 * 备件退货明细表删除
 * @param {Object} data
 */
export function returnOrderDel (data) {
  return api.jsonPost(prefix_Detail + 'delete', data);
}

/**
 * 提交
 * @param {Object} data
 */
export function returnOrderCommit (data) {
  return api.jsonPost(prefix + 'commit', data);
}

/**
 * 作废
 * @param {Object} data
 */
export function returnOrderCancel (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 同意
 * @param {Object} data
 */
export function returnOrderAgree (data) {
  return api.jsonPost(prefix + 'agree', data);
}

/**
 * 驳回
 * @param {Object} data
 */
export function returnOrderReject (data) {
  return api.jsonPost(prefix + 'reject', data);
}

/**
 * 撤回
 * @param {Object} data
 */
export function returnOrderRevoke (data) {
  return api.jsonPost(prefix + 'revoke', data);
}

/**
 * 发运
 * @param {Object} data
 */
export function returnOrderShipping (data) {
  return api.jsonPost(prefix + 'shipping', data);
}

/**
 * 退货异常入库
 * @param {Object} data
 */
export function returnExceptionInbound (data) {
  return api.jsonPost(prefix + 'returnExceptionInbound', data);
}
