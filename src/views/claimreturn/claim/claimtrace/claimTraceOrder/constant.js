// 追溯状态枚举
export const TRACE_STATUS = {
  DRAFT: '10',
  PENDING_CONFIRM: '20',
  STORE_AGREED: '30',
  APPEALING: '40',
  APPEAL_AGREED: '50',
  APPEAL_REJECTED: '60',
  APPEAL_REFUSED: '70',
  CANCELLED: '80',
  AUDITING: '90',
  REJECTED: '100',
};

// 列表页按钮可见性
export function getListVisibleButtons (traceStatus) {
  const S = TRACE_STATUS;
  const map = {
    [S.DRAFT]: ['编辑', '提交审核', '作废'],
    [S.AUDITING]: ['同意下发', '驳回修改'],
    [S.REJECTED]: ['编辑', '提交审核', '作废'],
    [S.PENDING_CONFIRM]: ['同意追溯', '申诉'],
    [S.APPEALING]: ['同意申诉', '驳回申诉', '拒绝申诉'],
  };
  return map[traceStatus] || [];
}

// 详情页按钮可见性
export function getDetailVisibleButtons (traceStatus) {
  const S = TRACE_STATUS;
  const map = {
    [S.DRAFT]: ['编辑', '提交审核', '作废', '调整追溯金额'],
    [S.AUDITING]: ['同意下发', '驳回修改'],
    [S.REJECTED]: ['编辑', '提交审核', '作废', '调整追溯金额'],
    [S.PENDING_CONFIRM]: ['同意追溯', '申诉'],
    [S.APPEALING]: ['同意申诉', '驳回申诉', '拒绝申诉', '调整追溯金额'],
  };
  return map[traceStatus] || [];
}
