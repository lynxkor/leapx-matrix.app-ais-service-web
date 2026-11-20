// 保修申请单状态枚举
export const APPLY_STATUS = {
  UN_SUBMITTED: '10', // 未提交
  UNDER_REVIEW: '20', // 审核中
  PENDING_MANAGER: '21', // 待保修经理审核
  PENDING_GM: '25', // 待总经理审核
  REJECTED: '30', // 已驳回
  DENIED: '40', // 已拒赔
  APPROVED: '60', // 审核通过
  SETTLED: '70', // 已结算
  PAID: '80', // 已付款
  CANCELLED: '90', // 已作废
};

// 可编辑状态：未提交、已驳回
export const EDITABLE_STATUSES = [APPLY_STATUS.UN_SUBMITTED, APPLY_STATUS.REJECTED];

// 待审核状态：审核中、待保修经理审核、待总经理审核
export const PENDING_REVIEW_STATUSES = [APPLY_STATUS.UNDER_REVIEW, APPLY_STATUS.PENDING_MANAGER, APPLY_STATUS.PENDING_GM];

// 可撤回状态：审核通过、已拒赔
export const WITHDRAWABLE_STATUSES = [APPLY_STATUS.APPROVED, APPLY_STATUS.DENIED];

// 批量操作状态校验
export function validateBatchStatus (selectionList, allowedStatuses, actionName) {
  if (!selectionList?.length) {
    return { valid: false, message: `请选择需要${actionName}的保修单` };
  }
  const invalid = selectionList.find(item => !allowedStatuses.includes(item.applyStatus));
  if (invalid) {
    return { valid: false, message: `保修申请单：${invalid.applyNo}的状态是：${invalid.applyStatusLabel}，不允许${actionName}` };
  }
  return { valid: true };
}

// 自定义视图仅支持查询保修申请主表的页签;值即传给后端的 tabCode(无固定条件的页签传空)
export const CUSTOM_VIEW_TAB_CODES = { all: '', manager: 'manager', gm: 'gm' };

// LP261855 套餐类型文本映射（PackageTypeEnum：10维修/20权益/30商城/40免保/50技术服务活动）
export const PACKAGE_TYPE_TEXT = {
  10: '维修套餐',
  20: '权益套餐',
  30: '商城订单',
  40: '免保项目',
  50: '技术服务活动'
};
