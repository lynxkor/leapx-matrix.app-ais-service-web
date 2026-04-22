// 审计单状态枚举
export const AUDIT_STATUS = {
  DRAFT: '10',
  AUDITING: '20',
  SUMMARY_SIGNING: '30',
  SUMMARY_APPROVING: '40',
  SUMMARY_REJECTED: '50',
  RECTIFY_SIGNING: '60',
  RECTIFY_APPROVING: '70',
  RECTIFY_REJECTED: '80',
  COMPLETED: '90',
};

// 列表页按钮可见性
export function getListVisibleButtons (auditStatus) {
  const S = AUDIT_STATUS;
  const map = {
    [S.DRAFT]: ['编辑', '发布'],
    [S.AUDITING]: ['编辑'],
    [S.SUMMARY_SIGNING]: ['签署总结'],
    [S.SUMMARY_APPROVING]: ['同意总结', '驳回总结'],
    [S.SUMMARY_REJECTED]: ['签署总结'],
    [S.RECTIFY_SIGNING]: ['签署整改'],
    [S.RECTIFY_APPROVING]: ['同意整改', '驳回整改'],
    [S.RECTIFY_REJECTED]: ['签署整改'],
  };
  return map[auditStatus] || [];
}

// 编辑页按钮可见性
export function getDetailVisibleButtons (auditStatus) {
  const S = AUDIT_STATUS;
  const map = {
    [S.DRAFT]: ['编辑', '发布'],
    [S.AUDITING]: ['编辑'],
    [S.SUMMARY_SIGNING]: ['签署总结', '重新生成待签署总结报告', '上传待签署总结报告'],
    [S.SUMMARY_APPROVING]: ['同意总结', '驳回总结'],
    [S.SUMMARY_REJECTED]: ['签署总结', '重新生成待签署总结报告', '上传待签署总结报告'],
    [S.RECTIFY_SIGNING]: ['签署整改', '重新生成待签署整改报告', '上传待签署整改报告'],
    [S.RECTIFY_APPROVING]: ['同意整改', '驳回整改'],
    [S.RECTIFY_REJECTED]: ['签署整改', '重新生成待签署整改报告', '上传待签署整改报告'],
  };
  return map[auditStatus] || [];
}
