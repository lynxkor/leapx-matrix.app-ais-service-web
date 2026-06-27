import api from '@/axios';

const prefix = 'maintain/web/sp/spRepairWorkRecord/';

/**
 * 按技师统计工时
 * @param {Object} data
 */
export function pageWorkHourSummaryByTechnician (data) {
  return api.jsonPost(prefix + 'pageWorkHourSummaryByTechnician', data);
}

/**
 * 按技师统计工时明细
 * @param {Object} data
*/
export function pageWorkHourSummaryDetailByTechnician (data) {
  return api.jsonPost(prefix + 'pageWorkHourSummaryDetailByTechnician', data);
}

/**
 * 按技师统计工时分组
 * @param {Object} data
*/
export function pageWorkHourSummaryGroupByTechnician (data) {
  return api.jsonPost(prefix + 'pageWorkHourSummaryGroupByTechnician', data);
}

/**
 * 按班组统计工时
 * @param {Object} data
 */
export function pageWorkHourSummaryByTeam (data) {
  return api.jsonPost(prefix + 'pageWorkHourSummaryByTeam', data);
}

/**
 * 按班组统计工时明细
 * @param {Object} data
 */
export function pageWorkHourSummaryDetailByTeam (data) {
  return api.jsonPost(prefix + 'pageWorkHourSummaryDetailByTeam', data);
}

/**
 * 按班组统计工时分组
 * @param {Object} data
 */
export function pageWorkHourSummaryGroupByTeam (data) {
  return api.jsonPost(prefix + 'pageWorkHourSummaryGroupByTeam', data);
}
