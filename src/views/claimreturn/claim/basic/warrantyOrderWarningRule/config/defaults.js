/**
 * BXYJ 预警规则配置常量
 * 与后端 v3.sql / bxyj009_ext_config_v2.sql 对齐
 */

// BXYJ009 事故维修预警 - 保修类型白名单默认值
// UUID 来源: WarrantyTypeEnum.getCode() / warranty_apply.repair_item_type_id
export const DEFAULT_BXYJ009_WARRANTY_TYPES = [
  'ED68D3F0-C1FB-E911-B0BB-FC82BA5F9EDF', // 售前保修 PRE_SALE_WARRANTY
  '5EA3066F-82AC-E911-B0BB-FC82BA5F9EDF', // 一般整车保修 GENERAL_VEHICLE_WARRANTY
  '5180E2BE-04AE-EE11-B156-E3C14957A562', // 整车终身质保 LIFETIME_VEHICLE_WARRANTY
  '2D87DFC4-04AE-EE11-B156-E3C14957A562', // 三电终身质保 LIFETIME_BATTERY_MOTOR_ELECTRONICS_WARRANTY
  'B96ED1D0-04AE-EE11-B156-E3C14957A562' // 三电延长质保 EXTENDED_BATTERY_MOTOR_ELECTRONICS_WARRANTY
];

// BXYJ009 工单状态白名单默认值(与后端 v3.sql 对齐: 160=待交车, 180=已交车)
// form 上是字符串(对应 OrderStatusEnum.code), 提交时转数字
export const DEFAULT_BXYJ009_WORK_ORDER_STATUSES = ['160', '180'];

// BXYJ009 结算类型白名单默认值(对齐后端 Java StatementTypeEnum.INSURANCE.getCode() = 保险 UUID)
export const DEFAULT_BXYJ009_CHECKOUT_TYPE_IDS = ['372BB70C-82AC-E911-B0BB-FC82BA5F9EDF'];

// BXYJ009 结算类型选项(对应后端 Java StatementTypeEnum 枚举, 下拉框直接使用, 不依赖数据中心字典)
export const BXYJ009_STATEMENT_TYPE_OPTIONS = [
  { code: '352BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '自费' },
  { code: '372BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '保险' },
  { code: '392BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '保修' },
  { code: '3B2BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '合同' },
  { code: '3D2BB70C-82AC-E911-B0BB-FC82BA5F9EDF', message: '内部结算' }
];

// BXYJ010 过度更换零件预警默认值(对齐后端 v3.sql)
export const DEFAULT_BXYJ010_PART_UNIT_PRICE_MIN = 50;
export const DEFAULT_BXYJ010_WITHIN_DAYS = 90;
export const DEFAULT_BXYJ010_CHANGE_COUNT_THRESHOLD = 15;
export const DEFAULT_BXYJ010_RATIO_THRESHOLD = 3;

// BXYJ009 withinDays 默认值
export const DEFAULT_BXYJ009_WITHIN_DAYS = 90;
