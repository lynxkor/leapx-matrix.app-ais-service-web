/**
 * BXYJ005 车牌号预警
 * 触发时机: 上传行驶证
 * OCR 类规则：文案中嵌入 diffCharCount（不匹配位数）
 */
export default {
  ruleType: 'BXYJ005',
  isOcr: true,
  description: '当保修单上传行驶证附件时，若 OCR 行驶证车牌号 与 系统车牌号 不匹配超过 {diffCharCount} 位时，则提醒：',
  fields: [
    { key: 'diffCharCount', type: 'number', placeholder: '', width: '150px' }
  ],
  validate (form) {
    const errs = [];
    if (form.diffCharCount === '' || form.diffCharCount === null || form.diffCharCount === undefined) {
      errs.push('请输入不匹配位数');
    } else if (Number(form.diffCharCount) < 0) {
      errs.push('不匹配位数不能小于 0');
    }
    return errs;
  },
  mergeToExtConfig (form, cfg) {
    cfg.diffCharCount = Number(form.diffCharCount);
    return { cfg, deleteFromForm: ['diffCharCount'] };
  },
  parseExtConfig (cfg) {
    if (!cfg) return { diffCharCount: '' };
    return {
      diffCharCount: cfg.diffCharCount !== undefined && cfg.diffCharCount !== null ? cfg.diffCharCount : ''
    };
  }
};
