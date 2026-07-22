import api from '@/axios';

// 数据上报服务的 URL 前缀,axios 拦截器根据该前缀路由到 ais 后端
const prefix = '/datareport/web/profit/profitDetail';

/**
 * 分页查询门店利润明细
 * @param {Object} data 查询条件,字段见后端 ProfitDetailParam
 *   - dealerCodes {String[]} 门店编码列表(可选,多选,不传按数据权限全量)
 *   - bizType {String}       业务类型:自费备件/自费工时/索赔备件/索赔工时/索赔其他(可选)
 *   - statementType {Number} 结算类型:30/40/50(可选)
 *   - itemCategory {String}  项目分类:备件/工时/其他(可选)
 *   - vin {String}           VIN(可选,精确)
 *   - carPlate {String}      车牌号(可选,精确)
 *   - orderStatus {Number}   工单状态:10/20/30/40/50(可选)
 *   - receiveStartTime {String} 收款/审批开始时间 yyyy-MM-dd HH:mm:ss(必填)
 *   - receiveEndTime   {String} 收款/审批结束时间 yyyy-MM-dd HH:mm:ss(必填)
 *   - pageNum {Number}   页码(默认 1)
 *   - pageSize {Number}  每页条数(默认 20)
 * @returns {Promise<PageResult<ProfitDetailResp>>} 返回 { records, total, page, size }
 *
 * <p>注意:数据权限(owner_org_id IN ...)由后端 QryExe 从 LoginUserUtils.getCurrentUser()
 * 自动注入,前端不需要传。
 */
export function pageProfitDetail (data) {
  return api.jsonPost(prefix + '/page', data);
}
