/**
 * BXYJ001 重复维修预警
 * 触发时机: 提交保修申请单时
 * 条件: 同一 VIN + 同一主因故障零件，在时间窗口内出现 N 次"已提交/审核中/..."记录
 *
 * judgeDays / judgeTimes 改由 ext_config 管理（主表字段已删除）
 */
export default {
  ruleType: 'BXYJ001',
  isOcr: false,
  // description 模板: {key} 会被 NumberField 替换为输入框
  description: '除当前保修申请单外，创建日期大于等于当前日期- {judgeDays} 天 的其他保修单，若【VIN】【主因故障零件】等于当前保修申请单且是已提交、审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款的记录数大于 {judgeTimes} 笔记录则提醒',
  fields: [
    { key: 'judgeDays', type: 'number', placeholder: '请输入天数', width: '150px' },
    { key: 'judgeTimes', type: 'number', placeholder: '请输入次数', width: '150px' }
  ],
  /**
   * 表单校验：返回错误信息数组，[] 表示通过
   */
  validate (form) {
    const errs = [];
    if (form.judgeDays === '' || form.judgeDays === null || form.judgeDays === undefined) {
      errs.push('请输入判定天数');
    } else if (Number(form.judgeDays) < 0) {
      errs.push('判定天数不能小于 0');
    }
    if (form.judgeTimes === '' || form.judgeTimes === null || form.judgeTimes === undefined) {
      errs.push('请输入判定次数');
    } else if (Number(form.judgeTimes) < 0) {
      errs.push('判定次数不能小于 0');
    }
    return errs;
  },
  /**
   * 提交时把独立字段合并到 extConfig
   * @return { cfg, deleteFromForm }
   */
  mergeToExtConfig (form, cfg) {
    cfg.judgeDays = Number(form.judgeDays);
    cfg.judgeTimes = Number(form.judgeTimes);
    return { cfg, deleteFromForm: ['judgeDays', 'judgeTimes'] };
  },
  /**
   * 从 extConfig 反向解析到独立字段
   * 返回需要写入 form 的字段（与现有 syncExtConfigFields 行为一致）
   */
  parseExtConfig (cfg) {
    if (!cfg) return { judgeDays: '', judgeTimes: '' };
    return {
      judgeDays: cfg.judgeDays !== undefined && cfg.judgeDays !== null ? cfg.judgeDays : '',
      judgeTimes: cfg.judgeTimes !== undefined && cfg.judgeTimes !== null ? cfg.judgeTimes : ''
    };
  }
};
