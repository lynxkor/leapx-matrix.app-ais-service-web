// 申请状态
export const APPLY_STATUS = {
  DRAFT: '10', // 草稿
  PENDING: '20', // 待审批
  APPROVED: '30', // 审批通过
  REJECTED: '40', // 审批驳回
  CANCELLED: '50', // 已作废
};

// 业务类型
export const BUSINESS_TYPE = {
  SECOND_HAND: '10', // 二手车信息变更
  OWNER_ADJUST: '40', // 原车主调整（非二手车）
  SCRAP: '60', // 报废灭失
};

// 允许新建选择的业务类型
export const ALLOWED_BUSINESS_TYPES = ['10', '40', '60'];

// 证件类型 - 个人
export const PERSONAL_ID_TYPES = ['1', '2', '3', '4', '5', '20'];
// 证件类型 - 企业
export const ENTERPRISE_ID_TYPES = ['6', '7'];

// 车辆属性
export const VEHICLE_PROPERTY = {
  HOUSEHOLD: '1', // 家用
  OPERATIONAL: '2', // 营运/运营
  SCRAP: '60', // 报废灭失
};
