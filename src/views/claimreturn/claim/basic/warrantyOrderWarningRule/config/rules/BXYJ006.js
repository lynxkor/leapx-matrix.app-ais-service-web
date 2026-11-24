/**
 * BXYJ006 不同车重复附件预警（同店不同车）
 * 触发时机: 上传/删除附件
 * 条件: 同店 + 不同 VIN + withinDays 天内 + 6 种保修状态 + fileId 已使用
 */
export default {
  ruleType: 'BXYJ006',
  isOcr: false,
  description: '当前保修单所属门店中，创建日期大于等于当前日期- {withinDays} 天，且 VIN 不等于当前车辆，同时保修状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，当前保修单相关附件在上述保修单中已使用，则提醒：',
  fields: [
    { key: 'withinDays', type: 'number', placeholder: '请输入天数', width: '150px' }
  ],
  validate (form) {
    const errs = [];
    if (form.withinDays === '' || form.withinDays === null || form.withinDays === undefined) {
      errs.push('请输入时间窗口天数');
    } else if (Number(form.withinDays) < 0) {
      errs.push('时间窗口不能小于 0');
    }
    return errs;
  },
  mergeToExtConfig (form, cfg) {
    cfg.withinDays = Number(form.withinDays);
    return { cfg, deleteFromForm: ['withinDays'] };
  },
  parseExtConfig (cfg) {
    if (!cfg) return { withinDays: '' };
    return {
      withinDays: cfg.withinDays !== undefined && cfg.withinDays !== null ? cfg.withinDays : ''
    };
  }
};
