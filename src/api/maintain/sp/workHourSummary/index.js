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
 * 按班组统计工时
 * @param {Object} data
 */
export function pageWorkHourSummaryByTeam (data) {
  return api.jsonPost(prefix + 'pageWorkHourSummaryByTeam', data);
}
