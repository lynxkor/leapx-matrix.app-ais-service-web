export const RepairOrderStatusEnum = {
  /** 接车预检测 */
  RECEPTION_INSPECTION: 100,
  /** 制单中 */
  CREATING_ORDER: 110,
  /** 待派工 */
  PENDING_DISPATCH: 120,
  /** 施工中 */
  UNDER_CONSTRUCTION: 140,
  /** 待终检 */
  PENDING_FINAL_INSPECTION: 150,
  /** 待交车 */
  PENDING_DELIVERY: 160,
  /** 已交车 */
  DELIVERED: 180,
  /** 反结算 */
  ANTI_SETTLEMENT: 200,
  /** 已作废 */
  CANCEL: 210
};

export const BusinessTypeEnum = {
  /** 自然到店 */
  NATURAL_ARRIVAL: 10,
  /** 取送车到店 */
  PICKUP_DELIVERY: 20,
  /** 上门服务 */
  DOOR_SERVICE: 30,
  /** 外出驻点服务 */
  ONSITE_SERVICE: 40,
  /** 预约到店 */
  APPOINTMENT_ARRIVAL: 50,
  /** 反结算审批 */
  ANTI_SETTLEMENT_APPROVAL: 60
};

// 结算类型枚举
export const CheckoutTypeEnum = {
  /** 自费 */
  SELF_PAY: '352BB70C-82AC-E911-B0BB-FC82BA5F9EDF',
  /** 保险 */
  INSURANCE: '372BB70C-82AC-E911-B0BB-FC82BA5F9EDF',
  /** 保修 */
  WARRANTY: '392BB70C-82AC-E911-B0BB-FC82BA5F9EDF',
  /** 合同 */
  CONTRACT: '3B2BB70C-82AC-E911-B0BB-FC82BA5F9EDF',
  /** 内部结算 */
  INTERNAL_SETTLEMENT: '3D2BB70C-82AC-E911-B0BB-FC82BA5F9EDF'
};

// 保修类型枚举
export const WarrantyTypeEnum = {
  /** 技术服务活动 */
  TECHNICAL_SERVICE_ACTIVITY: '64A3066F-82AC-E911-B0BB-FC82BA5F9EDF',
  /** 免费保养 */
  FREE_MAINTENANCE: '60A3066F-82AC-E911-B0BB-FC82BA5F9EDF',
  /** 终身保养 */
  LIFETIME_MAINTENANCE: '4EC01DDD-DD79-EC11-B0F9-9216EACB73F2',
  /** 保养套餐 */
  MAINTENANCE_PACKAGE: 'BA408917-12AE-EF11-B1BC-B6F71A4539C1',
  /** 售前保修 */
  PRE_SALE_WARRANTY: 'ED68D3F0-C1FB-E911-B0BB-FC82BA5F9EDF'
};

// 万能工时项目ID
export const UNIVERSAL_LABOR_HOUR_ITEM_ID = '999999';

// 提醒信息类型枚举
export const RemindInfoTypeEnum = {
  /** 服务活动提醒 */
  SERVICE_ACTIVITY: '1',
  /** 三包预警 */
  THREE_GUARANTEES: '2',
  /** 预授权提醒 */
  PRE_AUTH: '3'
};

// 三包预警等级枚举
export const AlarmLevelEnum = {
  /** 绿色预警 */
  GREEN: 30,
  /** 黄色预警 */
  YELLOW: 35,
  /** 红色预警 */
  RED: 40
};
