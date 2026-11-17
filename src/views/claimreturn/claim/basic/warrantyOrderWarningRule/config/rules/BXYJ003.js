/**
 * BXYJ003 系统车辆用途预警
 * 触发时机: 上传行驶证
 * OCR 类规则：纯文案 + remindContent
 */
export default {
  ruleType: 'BXYJ003',
  isOcr: true,
  description: '当保修单上传行驶证附件时，若 OCR 行驶证使用性质 为"非营运"、且系统车辆用途 不是家用时，则提醒：',
  fields: [],
  validate () { return []; },
  mergeToExtConfig (form, cfg) { return { cfg, deleteFromForm: [] }; },
  parseExtConfig () { return {}; }
};
