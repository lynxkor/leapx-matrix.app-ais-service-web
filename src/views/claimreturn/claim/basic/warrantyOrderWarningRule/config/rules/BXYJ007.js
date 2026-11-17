/**
 * BXYJ007 不同周期重复附件预警
 * 触发时机: 上传/删除附件（含行驶证）
 * 条件: VIN 等于当前车辆 + 维修周期区间不相交（任一为 NULL 不命中）+ 6 种保修状态匹配 + fileId 已被历史单使用
 *
 * 配置全部固定（同车 + 维修周期区间不相交 + 6 状态匹配 + fileId 重复），前端不暴露任何输入框
 */
export default {
  ruleType: 'BXYJ007',
  isOcr: false,
  description: '同一个附件在同一车上，不同维修周期内重复使用（维修开始-结束日期只要有交集，就当做是相同周期）；VIN等于当前车辆，且维修周期不相同，同时保修状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，当前保修单相关附件在上述保修单中已使用，则提醒：',
  fields: [],
  validate () { return []; },
  mergeToExtConfig (form, cfg) { return { cfg, deleteFromForm: [] }; },
  parseExtConfig () { return {}; }
};
