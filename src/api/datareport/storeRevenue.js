import api from '@/axios';

// 数据上报服务的 URL 前缀,axios 拦截器根据该前缀路由到 ais 后端
const prefix = '/datareport/web/revenue/storeRevenue';

/**
 * 分页查询门店营收报表
 * @param {Object} data 查询条件,字段见后端 StoreRevenueParam
 *   - dealerCodes {String[]}  门店编码列表(可选,多选,不传按数据权限全量)
 *   - receiveStartTime {String} 收款/审批开始时间 yyyy-MM-dd HH:mm:ss(必填)
 *   - receiveEndTime   {String} 收款/审批结束时间 yyyy-MM-dd HH:mm:ss(必填)
 *   - pageNum {Number}   页码(默认 1)
 *   - pageSize {Number}  每页条数(默认 20)
 * @returns {Promise<PageResult<StoreRevenueResp>>} 返回 { records, total, page, size }
 *
 * <p>注意:数据权限(owner_org_id IN ...)由后端 QryExe 从 LoginUserUtils.getCurrentUser()
 * 自动注入,前端不需要传。
 */
export function pageStoreRevenue (data) {
  return api.jsonPost(prefix + '/page', data);
}
