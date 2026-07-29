import api from '@/axios';

// 数据上报服务的 URL 前缀,axios 拦截器根据该前缀路由到 ais 后端
const prefix = '/datareport/web/revenue/storeOutputValue';

/**
 * 分页查询门店产值报表
 * @param {Object} data 查询条件,字段见后端 StoreOutputValueParam
 *   - dealerCodes {String[]}  门店编码列表(必填,多选)
 *   - receiveStartTime {String} 收款/审批开始时间 yyyy-MM-dd HH:mm:ss(必填)
 *   - receiveEndTime   {String} 收款/审批结束时间 yyyy-MM-dd HH:mm:ss(必填)
 *   - pageNum {Number}   页码(默认 1;pageNum>=2 短路返回空,供导出服务循环)
 *   - pageSize {Number}  每页条数(默认 100)
 * @returns {Promise<PageResult<StoreOutputValueResp>>} 返回 { records, total, page, size }
 *
 * <p>返回数据结构:每条记录 = 一个门店 × 一种类型(总计/自费/保险/内部结算/合同/保修)。
 * 14 个指标字段平铺,无嵌套包装。
 *
 * <p>注意:数据权限(owner_org_id IN ...)由后端 QryExe 从 LoginUserUtils.getCurrentUser()
 * 自动注入,前端不需要传。
 */
export function pageStoreOutputValue (data) {
  return api.jsonPost(prefix + '/page', data);
}
