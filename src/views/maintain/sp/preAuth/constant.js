/**
 * 审批状态枚举
 */
export const AUDIT_STATUS = {
  TODO: 10, // 待提交
  IN_PROGRESS: 20, // 审批中
  APPROVED: 40, // 审批通过
  REJECTED: 30, // 审批驳回
  CANCELLED: 99, // 已作废
  EXPIRED: 60, // 已过期
  REFUSED: 70 // 已拒绝
};
