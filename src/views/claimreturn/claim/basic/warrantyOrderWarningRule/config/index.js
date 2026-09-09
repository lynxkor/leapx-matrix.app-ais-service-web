/**
 * BXYJ 预警规则注册表
 *
 * 每条规则的差异（字段、文案、校验、extConfig 合并/解析）通过配置对象声明
 * 新增规则仅需在 rules/ 下加一个文件 + 在此处注册即可，无需改模板
 *
 * 配置对象接口（所有方法为可选，不提供则使用空实现）:
 * - ruleType: string                  规则代码
 * - isOcr: boolean                    是否 OCR 类规则
 * - description: string               描述模板，{key} 占位符会被替换为对应字段的输入控件
 * - fields: FieldDef[]                字段定义
 *   FieldDef: { key, type, placeholder?, width?, optionsKey?, enumCode?, valueKey?, labelKey?, subLabelKey? }
 * - validate(form): string[]          校验函数，返回错误信息数组
 * - mergeToExtConfig(form, cfg): { cfg, deleteFromForm }  提交时合并到 extConfig
 * - parseExtConfig(cfg): object       从 extConfig 反向解析到独立字段
 */
import BXYJ001 from './rules/BXYJ001';
import BXYJ002 from './rules/BXYJ002';
import BXYJ003 from './rules/BXYJ003';
import BXYJ004 from './rules/BXYJ004';
import BXYJ005 from './rules/BXYJ005';
import BXYJ006 from './rules/BXYJ006';
import BXYJ007 from './rules/BXYJ007';
import BXYJ008 from './rules/BXYJ008';
import BXYJ009 from './rules/BXYJ009';
import BXYJ010 from './rules/BXYJ010';

export const RULE_REGISTRY = {
  BXYJ001,
  BXYJ002,
  BXYJ003,
  BXYJ004,
  BXYJ005,
  BXYJ006,
  BXYJ007,
  BXYJ008,
  BXYJ009,
  BXYJ010
};

/**
 * 根据 ruleType 获取规则配置
 */
export function getRuleConfig (ruleType) {
  return RULE_REGISTRY[ruleType] || null;
}

/**
 * 解析 extConfig 字符串为对象
 * 容错：入参可能是 string (JSON 字符串) / object (已解析) / null
 */
export function parseExtConfigString (val) {
  if (!val) return {};
  if (typeof val === 'object') return val;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (e) {
      return {};
    }
  }
  return {};
}

/**
 * 哪些 ruleType 需要把独立字段合并到 extConfig（提交时）
 * 与原 edit.vue 判断一致：BXYJ005/006/008/001/009/010
 */
export function needsExtConfigMerge (ruleType) {
  return [
    'BXYJ001', 'BXYJ005', 'BXYJ006', 'BXYJ008', 'BXYJ009', 'BXYJ010'
  ].includes(ruleType);
}
