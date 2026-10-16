// 追溯类型枚举
export const TRACE_TYPE = {
  CLAIM_TRACE: '10', // 索赔追溯
  AUDIT_TRACE: '20', // 审计追溯
};

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
    [S.DRAFT]: ['编辑', '审核下发', '作废'],
    [S.AUDITING]: ['同意下发', '驳回修改'],
    [S.REJECTED]: ['编辑', '审核下发', '作废'],
    [S.PENDING_CONFIRM]: ['同意追溯', '申诉'],
    [S.APPEALING]: ['同意申诉', '驳回申诉', '拒绝申诉'],
  };
  return map[traceStatus] || [];
}

// 详情页按钮可见性
// 作废按钮可见状态扩大（F9，REQ-2026101316421956）：草稿/已驳回/待门店确认/申诉中直接可见；
// 门店同意/申诉拒绝需已追溯金额为 0（与列表页及后端 canCancelInSingleMode 同口径）
export function getDetailVisibleButtons (traceStatus, tracedAmount) {
  const S = TRACE_STATUS;
  const map = {
    [S.DRAFT]: ['编辑', '审核下发', '作废', '调整追溯金额'],
    [S.AUDITING]: ['同意下发', '驳回修改'],
    [S.REJECTED]: ['编辑', '审核下发', '作废', '调整追溯金额'],
    [S.PENDING_CONFIRM]: ['同意追溯', '申诉', '作废'],
    [S.APPEALING]: ['同意申诉', '驳回申诉', '拒绝申诉', '调整追溯金额', '作废'],
    [S.STORE_AGREED]: ['作废'],
    [S.APPEAL_REFUSED]: ['作废'],
  };
  const buttons = map[traceStatus] || [];
  // 门店同意/申诉拒绝仅在已追溯金额为 0（null 视同 0）时可见作废按钮
  if ((traceStatus === S.STORE_AGREED || traceStatus === S.APPEAL_REFUSED) &&
    tracedAmount !== null && tracedAmount !== undefined && Number(tracedAmount) !== 0) {
    return buttons.filter(name => name !== '作废');
  }
  return buttons;
}
