// 申请状态
export const APPLY_STATUS = {
  DRAFT: '10',           // 草稿
  FIRST_PENDING: '20',   // 待一级审批
  FINAL_PENDING: '30',   // 待最终审批
  APPROVED: '40',        // 审批通过
  REJECTED: '50',        // 审批驳回
  IMPORTING: '100',      // 已取消
};

// 可编辑状态（草稿 + 审批驳回）
export const EDITABLE_STATUS = [APPLY_STATUS.DRAFT, APPLY_STATUS.REJECTED];
