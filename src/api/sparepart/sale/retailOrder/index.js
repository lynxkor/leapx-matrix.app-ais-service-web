import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/dealer/retailOrder/';
const prefixDetail = SPARE_PREFIX + '/web/dealer/retailOrderDetail/';
const retailPaymentRecord = SPARE_PREFIX + '/web/dealer/retailPaymentRecord/';

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

export function getListReturn (data) {
  return api.jsonPost(prefix + 'returnPage', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 查询车辆档案
 * @param {Object} data
 */
export function getVehicleProfile (data) {
  return api.jsonPost('datacenter/web/vehicle/vehicleProfile/listFull', data);
}

export function getCustomerInfo (data) {
  return api.jsonPost(prefix + 'getCustomerInfo', data);
}

/**
 * getVin
 * @param {Object} data
 */
export function getMileage (data) {
  return api.jsonPost(prefix + 'getMileage', data);
}

export function spareParkList (data) {
  return api.jsonPost(prefix + 'spareParkList', data);
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
 * 获取备件清单
 * @param {Object} data
 */
export function getSpareParkList (data) {
  return api.jsonPost(prefix + 'spareParkList', data);
}

/**
 * 确认订单
 * @param {Object} data
 */
export function confirmOrder (data) {
  return api.jsonPost(prefix + 'confirm', data);
}

/**
 * 作废订单
 * @param {Object} data
 */
export function cancelOrder (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 订单出库
 * @param {Object} data
 */
export function shipOrder (data) {
  return api.jsonPost(prefix + 'ship', data);
}

/**
 * 签收
 * @param {Object} data
 */
export function signOrder (data) {
  return api.jsonPost(prefix + 'sign', data);
}

/**
 * 取消签收
 * @param {Object} data
 */
export function cancelSignOrder (data) {
  return api.jsonPost(prefix + 'cancelSign', data);
}

/**
 * 退料申请
 * @param {Object} data
 */
export function applyReturnMaterial (data) {
  return api.jsonPost(prefix + 'applyReturnMaterial', data);
}

/**
 * 退料入库
 * @param {Object} data
 */
export function returnMaterialInbound (data) {
  return api.jsonPost(prefix + 'returnMaterialInbound', data);
}

/**
 * 结算
 * @param {Object} data
 */
export function settleOrder (data) {
  return api.jsonPost(prefix + 'settle', data);
}

/**
 * 取消结算
 * @param {Object} data
 */
export function cancelSettleOrder (data) {
  return api.jsonPost(prefix + 'cancelSettle', data);
}

/**
 * 收款
 * @param {Object} data
 */
export function collectPayment (data) {
  return api.jsonPost(prefix + 'collectPayment', data);
}

/**
 * 反结算
 * @param {Object} data
 */
export function reverseSettleOrder (data) {
  return api.jsonPost(prefix + 'reverseSettle', data);
}

/**
 * 退订入库
 * @param {Object} data
 */
export function cancelOrderInbound (data) {
  return api.jsonPost(prefix + 'cancelOrderInbound', data);
}

/**
 * 退款
 * @param {Object} data
 */
export function refundOrder (data) {
  return api.jsonPost(prefix + 'refund', data);
}

/**
 * 备附件销售单明细表分页查询
 * @param {Object} data
 */
export function retailOrderDetailPage (data) {
  return api.jsonPost(prefixDetail + 'page', data);
}
export function retailOrderDetailPrintPage (data) {
  return api.jsonPost(prefixDetail + 'printPage', data);
}

/**
 * 备附件销售单明细表新增/编辑
 * @param {Object} data
 */
export function addOrUpdateRetailOrderDetail (data) {
  return api.jsonPost(prefixDetail + 'addOrUpdate', data);
}

/**
 * 备附件销售单明细表详情信息
 * @param {Object} data
 */
export function getRetailOrderDetail (data) {
  return api.jsonPost(prefixDetail + 'get', data);
}

/**
 * 备附件销售单明细表删除
 * @param {Object} data
 */
export function deleteRetailOrderDetail (data) {
  return api.jsonPost(prefixDetail + 'delete', data);
}

/**
 * 备附件销售收款记录表分页查询
 * @param {Object} data
 */
export function retailPaymentRecordPage (data) {
  return api.jsonPost(retailPaymentRecord + 'page', data);
}

/**
 * 备附件销售出库单打印设置表新增/编辑
 * @param {Object} data
 */
export function printSetting (data) {
  return api.jsonPost('/sp/web/basic/retailPrintSetting/addOrUpdate', data);
}

/**
 * 备附件销售出库单打印设置表详情信息
 * @param {Object} data
 */
export function getPrintSettingDetail (data) {
  return api.jsonPost('/sp/web/basic/retailPrintSetting/get', data);
}
