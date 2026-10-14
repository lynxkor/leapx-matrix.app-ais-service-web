import api from '@/axios';

const prefix = 'maintain/web/basic/recordingTask/';

/**
 * 录音事件分页查询
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 录音事件详情
 * @param {String} id 录音任务主键
 */
export function getDetail (id) {
  return api.jsonPost(`${prefix}get`, { id });
};

/**
 * 施工单手动开启录音
 * @param {String} proxyId 施工单主键
 */
export function startRecordingForProxy (proxyId) {
  return api.jsonPost(`${prefix}manualStart/proxy`, { proxyId });
};

/**
 * 结算单手动开启录音
 * @param {String} statementId 结算单主键
 */
export function startRecordingForStatement (statementId) {
  return api.jsonPost(`${prefix}manualStart/statement`, { statementId });
};

/**
 * 查询施工单手动开启录音阻断原因（返回 null/空 表示可开启）
 * @param {String} proxyId 施工单主键
 */
export function getBlockReasonForProxy (proxyId) {
  return api.jsonPost(`${prefix}blockReason/proxy`, { proxyId });
};

/**
 * 查询结算单手动开启录音阻断原因（返回 null/空 表示可开启）
 * @param {String} statementId 结算单主键
 */
export function getBlockReasonForStatement (statementId) {
  return api.jsonPost(`${prefix}blockReason/statement`, { statementId });
};
