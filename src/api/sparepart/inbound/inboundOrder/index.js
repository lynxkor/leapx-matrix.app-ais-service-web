import api from '@/axios';
import { SPARE_PREFIX } from '../../spareurl';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = SPARE_PREFIX + '/web/purchase/inboundOrder/';

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
 * 备件入库明细表分页查询
 * @param {Object} data
 */
export function inboundOrderDetail (data) {
  return api.jsonPost('sp/web/purchase/inboundOrderDetail/page', data);
}

/**
 * 入库
 * @param {Object} data
 */
export function warehousing (data) {
  return api.jsonPost(prefix + 'inbound', data);
}

/**
 * 备件入库单-全部备件（明细维度）分页查询
 * @param {Object} data
 */
export function pageAll (data) {
  return api.jsonPost('sp/web/purchase/inboundOrderDetail/pageAll', data);
}

/**
 * 获取当前用户备件入库打印设置
 * @param {Object} data
 */
export function getMySet (data) {
  return api.jsonPost('sp/web/purchase/inboundPrintSetting/getMySet', data);
}

/**
 * 保存当前用户备件入库打印设置
 * 注意：后端 @RequestBody String，入参直接传 sortOrder 字符串字面量（如 '1'），
 * axios 以 application/json 发送 '1'，后端正确接收。
 * @param {String} sortOrder 排序方式 code（1/2/3）
 */
export function saveMySet (sortOrder) {
  return api.jsonPost('sp/web/purchase/inboundPrintSetting/saveMySet', sortOrder);
}
