import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/purchase/purchaseApply/';
const prefixDetail = SPARE_PREFIX + '/web/purchase/purchaseApplyDetail/';
const prefixReco = SPARE_PREFIX + '/web/purchase/dealerPartsRecommendationT/';
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
 * 备件采购申请明细表新增/编辑
 * @param {Object} data
 */
export function addDetail (data) {
  return api.jsonPost(prefixDetail + 'addOrUpdate', data);
}

/**
 * 获取添加备件采购申请明细信息
 * @param {Object} data
 */
export function getPurchaseApplyDetail (data) {
  return api.jsonPost(prefix + 'getPurchaseApplyDetailInventory', data);
}

/**
 * 备件采购申请明细表分页查询
 * @param {Object} data
 */
export function getPurchaseApplyPage (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}

/**
 * 备件采购申请明细表删除
 * @param {Object} data
 */
export function purchaseApplyDelete (data) {
  return api.jsonPost(prefixDetail + 'delete', data);
}

/**
 * 驳回
 * @param {Object} data
 */
export function purchaseApplyReject (data) {
  return api.jsonPost(prefix + 'reject', data);
}

/**
 * 批量驳回
 * @param {Object} data
 */
export function purchaseApplyBatchReject (data) {
  return api.jsonPost(prefix + 'batchReject', data);
}

/**
 * 提交
 * @param {Object} data
 */
export function purchaseApplySubmit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 同意
 * @param {Object} data
 */
export function purchaseApplyAgree (data) {
  return api.jsonPost(prefix + 'agree', data);
}

/**
 * 批量同意
 * @param {Object} data
 */
export function batchAgree (data) {
  return api.jsonPost(prefix + 'batchAgree', data);
}

/**
 * 复制
 * @param {Object} data
 */
export function purchaseApplyCopy (data) {
  return api.jsonPost(prefix + 'copy', data);
}

/**
 * 不可采购清单列表
 * @param {Object} data
 */
export function purchaseApplyListUnPurchaseDetail (data) {
  return api.jsonPost(prefix + 'listUnPurchaseDetail', data);
}

/**
 * 不可采购清单列表
 * @param {Object} data
 */
export function purchaseApplyDeleteUnPurchaseDetail (data) {
  return api.jsonPost(prefix + 'deleteUnPurchaseDetail', data);
}

/**
 * 采购原价券列表
 * @param {Object} data
 */
export function purchaseApplyGetCoupon (data) {
  return api.jsonPost(prefix + 'getCoupon', data);
}

/**
 * 采购原价券列表
 * @param {Object} data
 */
export function purchaseApplyBatchSubmit (data) {
  return api.jsonPost('/sp/web/purchase/purchaseApply/batchSubmit', data);
}

/**
 * 门店备件预测-推荐结果-数仓数据接收表分页查询
 * @param {Object} data
 */
export function purchaseApplyGetCouponPage (data) {
  return api.jsonPost(prefixReco + 'page', data);
}
