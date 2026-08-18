import api from '@/axios';

// 门店管理 — 对应后端 StoreController
const prefix = 'datacenter/web/store/';

/**
 * 门店分页查询
 * @param {Object} data 参见 StorePageReq
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 门店详情
 * @param {Object} data { storeCode }
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}
