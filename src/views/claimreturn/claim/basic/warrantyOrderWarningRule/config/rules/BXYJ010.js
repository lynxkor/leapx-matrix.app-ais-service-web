/**
 * BXYJ010 过度更换零件预警
 * 触发时机: 提交保修申请单时
 * 条件: 零件单价门槛 + withinDays + 同年款同车系 + 白名单 + 更换数量阈值 + 比例倍数
 *
 * 4 个阈值字段都由 ext_config 管理
 */
import {
  DEFAULT_BXYJ010_PART_UNIT_PRICE_MIN,
  DEFAULT_BXYJ010_WITHIN_DAYS,
  DEFAULT_BXYJ010_CHANGE_COUNT_THRESHOLD,
  DEFAULT_BXYJ010_RATIO_THRESHOLD
} from '../defaults';

export default {
  ruleType: 'BXYJ010',
  isOcr: false,
  description: '当前保修单中申请的零件价格大于 {partUnitPriceMin} 元的零件，在对应同年款，同车系且当前提交时间大于等于当前时间- {withinDays} 天的其他保修单状态为审核中、待保修经理审核、待总经理审核、审核通过、已结算、已付款，更换了白名单内的零件（替换件视同相同零件）；若当店当前保修单对应零件在周期内更换数量大于等于 {changeCountThreshold} ，且当店更换比例大于全国更换比例的 {ratioThreshold} 倍，则提醒:',
  fields: [
    { key: 'partUnitPriceMin', type: 'number', placeholder: '价格', width: '130px' },
    { key: 'withinDays', type: 'number', placeholder: '天数', width: '130px' },
    { key: 'changeCountThreshold', type: 'number', placeholder: '次数', width: '130px' },
    { key: 'ratioThreshold', type: 'number', placeholder: '倍数', width: '130px' }
  ],
  validate (form) {
    const errs = [];
    if (form.withinDays === '' || form.withinDays === null || form.withinDays === undefined) {
      errs.push('请输入时间窗口天数');
    } else if (Number(form.withinDays) < 0) {
      errs.push('时间窗口天数不能小于 0');
    }
    if (form.partUnitPriceMin === '' || form.partUnitPriceMin === null || form.partUnitPriceMin === undefined) {
      errs.push('请输入零件单价门槛');
    } else if (Number(form.partUnitPriceMin) < 0) {
      errs.push('零件单价门槛不能小于 0');
    }
    if (form.changeCountThreshold === '' || form.changeCountThreshold === null || form.changeCountThreshold === undefined) {
      errs.push('请输入更换数量阈值');
    } else if (Number(form.changeCountThreshold) < 0) {
      errs.push('更换数量阈值不能小于 0');
    }
    if (form.ratioThreshold === '' || form.ratioThreshold === null || form.ratioThreshold === undefined) {
      errs.push('请输入比例倍数');
    } else if (Number(form.ratioThreshold) < 0) {
      errs.push('比例倍数不能小于 0');
    }
    return errs;
  },
  mergeToExtConfig (form, cfg) {
    cfg.withinDays = Number(form.withinDays);
    cfg.partUnitPriceMin = Number(form.partUnitPriceMin);
    cfg.changeCountThreshold = Number(form.changeCountThreshold);
    cfg.ratioThreshold = Number(form.ratioThreshold);
    return {
      cfg,
      deleteFromForm: ['withinDays', 'partUnitPriceMin', 'changeCountThreshold', 'ratioThreshold']
    };
  },
  parseExtConfig (cfg) {
    if (!cfg) {
      return {
        partUnitPriceMin: DEFAULT_BXYJ010_PART_UNIT_PRICE_MIN,
        withinDays: DEFAULT_BXYJ010_WITHIN_DAYS,
        changeCountThreshold: DEFAULT_BXYJ010_CHANGE_COUNT_THRESHOLD,
        ratioThreshold: DEFAULT_BXYJ010_RATIO_THRESHOLD
      };
    }
    return {
      partUnitPriceMin: (cfg.partUnitPriceMin !== undefined && cfg.partUnitPriceMin !== null && cfg.partUnitPriceMin !== '')
        ? cfg.partUnitPriceMin
        : DEFAULT_BXYJ010_PART_UNIT_PRICE_MIN,
      withinDays: (cfg.withinDays !== undefined && cfg.withinDays !== null && cfg.withinDays !== '')
        ? cfg.withinDays
        : DEFAULT_BXYJ010_WITHIN_DAYS,
      changeCountThreshold: (cfg.changeCountThreshold !== undefined && cfg.changeCountThreshold !== null && cfg.changeCountThreshold !== '')
        ? cfg.changeCountThreshold
        : DEFAULT_BXYJ010_CHANGE_COUNT_THRESHOLD,
      ratioThreshold: (cfg.ratioThreshold !== undefined && cfg.ratioThreshold !== null && cfg.ratioThreshold !== '')
        ? cfg.ratioThreshold
        : DEFAULT_BXYJ010_RATIO_THRESHOLD
    };
  }
};
