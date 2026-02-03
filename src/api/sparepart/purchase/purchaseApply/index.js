import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/purchase/purchaseApply/';

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
  return api.jsonPost('sp/web/purchase/purchaseApplyDetail/addOrUpdate', data);
}

/**
 * 获取添加备件采购申请明细信息
 * @param {Object} data
 */
export function getPurchaseApplyDetail (data) {
  return api.jsonPost('sp/web/purchase/purchaseApplyDetail/getPurchaseApplyDetailInventory', data);
}

/**
 * 备件采购申请明细表分页查询
 * @param {Object} data
 */
export function getPurchaseApplyPage (data) {
  return api.jsonPost('sp/web/purchase/purchaseApplyDetail/page', data);
}

/**
 * 备件采购申请明细表删除
 * @param {Object} data
 */
export function purchaseApplyDelete (data) {
  return api.jsonPost('sp/web/purchase/purchaseApplyDetail/delete', data);
}

/**
 * 驳回
 * @param {Object} data
 */
export function purchaseApplyReject (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/reject', data);
}

/**
 * 批量驳回
 * @param {Object} data
 */
export function purchaseApplyBatchReject (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/batchReject', data);
}

/**
 * 提交
 * @param {Object} data
 */
export function purchaseApplySubmit (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/submit', data);
}

/**
 * 同意
 * @param {Object} data
 */
export function purchaseApplyAgree (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/agree', data);
}

/**
 * 批量同意
 * @param {Object} data
 */
export function batchAgree (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/batchAgree', data);
}

/**
 * 复制
 * @param {Object} data
 */
export function purchaseApplyCopy (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/copy', data);
}

/**
 * 不可采购清单列表
 * @param {Object} data
 */
export function purchaseApplyListUnPurchaseDetail (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/listUnPurchaseDetail', data);
}

/**
 * 不可采购清单列表
 * @param {Object} data
 */
export function purchaseApplyDeleteUnPurchaseDetail (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/deleteUnPurchaseDetail', data);
}

/**
 * 采购原价券列表
 * @param {Object} data
 */
export function purchaseApplyGetCoupon (data) {
  return api.jsonPost('sp/web/purchase/purchaseApply/getCoupon', data);
}
