// 保修申请单状态枚举
export const APPLY_STATUS = {
  UN_SUBMITTED: '10',       // 未提交
  UNDER_REVIEW: '20',       // 审核中
  PENDING_MANAGER: '25',    // 待保修经理审核
  PENDING_GM: '30',         // 待总经理审核
  REJECTED: '40',           // 已驳回
  DENIED: '50',             // 已拒赔
  APPROVED: '60',           // 审核通过
  SETTLED: '70',            // 已结算
  PAID: '80',               // 已付款
  CANCELLED: '90',          // 已作废
};

// 可编辑状态：未提交、已驳回
export const EDITABLE_STATUSES = [APPLY_STATUS.UN_SUBMITTED, APPLY_STATUS.REJECTED];

// 待审核状态：审核中、待保修经理审核、待总经理审核
export const PENDING_REVIEW_STATUSES = [APPLY_STATUS.UNDER_REVIEW, APPLY_STATUS.PENDING_MANAGER, APPLY_STATUS.PENDING_GM];

// 可撤回状态：审核通过、已拒赔
export const WITHDRAWABLE_STATUSES = [APPLY_STATUS.APPROVED, APPLY_STATUS.DENIED];
