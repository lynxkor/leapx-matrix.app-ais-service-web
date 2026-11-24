/**
 * BXYJ002 车主信息不一致
 * 触发时机: 上传行驶证
 * OCR 类规则：纯文案 + remindContent，不需要额外输入框
 */
export default {
  ruleType: 'BXYJ002',
  isOcr: true,
  // 纯文案（无嵌入输入框）
  description: '当保修单上传行驶证附件时，若 OCR 行驶证所有人 与 系统车主姓名 不一致时，则提醒：',
  fields: [],
  validate (form) {
    return []; // OCR 类除 remindContent 外无其他校验
  },
  mergeToExtConfig (form, cfg) {
    return { cfg, deleteFromForm: [] };
  },
  parseExtConfig (cfg) {
    return {};
  }
};
