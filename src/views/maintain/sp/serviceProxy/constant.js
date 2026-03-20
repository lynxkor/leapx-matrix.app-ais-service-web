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
