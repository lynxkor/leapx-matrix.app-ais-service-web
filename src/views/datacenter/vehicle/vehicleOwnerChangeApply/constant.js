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

// 申请状态，10:草稿; 20:待审批; 30:审批通过; 40:审批驳回; 50:已作废
// 业务类型，10:二手车信息变更; 20:绑车人调整; 30:二手车+绑车人调整; 40:原车主调整（非二手车）; 50:原车主+绑车人调整（非二手车）; 60:报废灭失;

// oldIdType
// [
//   {"code": "1", "message": "身份证"},
//   {"code": "2", "message": "护照"},
//   {"code": "3", "message": "驾驶证"},
//   {"code": "4", "message": "港澳来往内地通行证"},
//   {"code": "5", "message": "军官证"},
//   {"code": "6", "message": "组织机构代码"},
//   {"code": "7", "message": "统一社会信用代码"},
//   {"code": "20", "message": "台湾通行证"}
// ]

// 允许新建选择的业务类型
export const ALLOWED_BUSINESS_TYPES = ['10', '40', '60'];

// 证件类型 - 个人
export const PERSONAL_ID_TYPES = ['1', '2', '3', '4', '5', '20'];
// 证件类型 - 企业
export const ENTERPRISE_ID_TYPES = ['6', '7'];

// 数据来源
export const DATA_SOURCE = {
  LXP_APP: '30', // LXP APP
};

// 车辆属性
export const VEHICLE_PROPERTY = {
  HOUSEHOLD: '1', // 家用
  OPERATIONAL: '2', // 营运/运营
  SCRAP: '60', // 报废灭失
};
