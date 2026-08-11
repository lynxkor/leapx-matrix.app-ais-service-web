import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/claim/claimOrder/';
const prefixDetail = SPARE_PREFIX + '/web/claim/claimOrderDetail/';
const prefixOutbound = SPARE_PREFIX + '/web/claim/claimOutboundDetail/';
const prefixBack = SPARE_PREFIX + '/web/claim/claimBackDetail/';
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
 * 备件索赔备件明细表分页查询
 * @param {Object} data
 */
export function getDetailList (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}

/**
 * 备件索赔出库明细表分页查询
 * @param {Object} data
 */
export function getOutboundDetailList (data) {
  return api.jsonPost(prefixOutbound + 'page', data);
}

/**
 * 备件索赔缺货明细表分页查询
 * @param {Object} data
 */
export function getBackDetailList (data) {
  return api.jsonPost(prefixBack + 'page', data);
}

/**
 * 备件索赔历史
 */
export function historyPage (data) {
  return api.jsonPost(prefixDetail + 'historyPage', data);
}

/**
 * 提交
 * @param {Object} data
 */
export function getCommit (data) {
  return api.jsonPost(prefix + 'commit', data);
}

/**
 * 同意
 * @param {Object} data
 */
export function getAgree (data) {
  return api.jsonPost(prefix + 'agree', data);
}

/**
 * 驳回
 * @param {Object} data
 */
export function getReject (data) {
  return api.jsonPost(prefix + 'reject', data);
}

/**
 * 备件索赔备件明细表新增/编辑
 * @param {Object} data
 */
export function claimOrderDetailUpdate (data) {
  return api.jsonPost('/sp/web/claim/claimOrderDetail/addOrUpdate', data);
}

/**
 * 索赔-物流信息
 * @param {Object} data
 */
export function claimOrderLogisticsClaim (data) {
  return api.jsonPost('/sp/web/claim/claimOrder/logisticsClaim', data);
}

/**
 * 采购-物流信息
 * @param {Object} data
 */
export function claimOrderLogisticsPurchase (data) {
  return api.jsonPost('/sp/web/claim/claimOrder/logisticsPurchase', data);
}
