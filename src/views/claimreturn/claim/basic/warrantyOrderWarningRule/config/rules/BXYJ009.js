/**
 * BXYJ009 事故维修预警
 * 触发时机: 上传附件
 * 条件: 保修类型白名单 + VRT 白名单 + withinDays 天内施工单 + 工单状态白名单 + 结算类型白名单
 *
 * 保修类型白名单、VRT、工单状态、结算类型、withinDays 都由 ext_config 管理
 * vrtIds 允许空数组(语义:不校验VRT), 不强制至少 1 个
 */
import {
  DEFAULT_BXYJ009_WARRANTY_TYPES,
  DEFAULT_BXYJ009_WORK_ORDER_STATUSES,
  DEFAULT_BXYJ009_CHECKOUT_TYPE_IDS,
  DEFAULT_BXYJ009_WITHIN_DAYS
} from '../defaults';

export default {
  ruleType: 'BXYJ009',
  isOcr: false,
  description: '若保修类型为 {warrantyTypes} ,且 VRT 为 {vrtIds} ,若存在施工单 vin 为当前 vin,且结算日期大于等于当前日期- {withinDays} 天,且工单状态为 {workOrderStatuses} ,同时还存在结算类型为 {checkoutTypeIds} 的维修记录(工时或备件一项即可),则提醒:',
  fields: [
    {
      key: 'warrantyTypes',
      type: 'select-multiple',
      placeholder: '请选择保修类型',
      optionsKey: 'warrantyTypeOptions',
      valueKey: 'id',
      labelKey: 'name',
      subLabelKey: 'code',
      width: '260px'
    },
    {
      key: 'vrtIds',
      type: 'select-multiple',
      placeholder: '请选择 VRT',
      optionsKey: 'vrtOptions',
      valueKey: 'id',
      labelKey: 'name',
      subLabelKey: 'code',
      width: '260px'
    },
    { key: 'withinDays', type: 'number', placeholder: '请输入天数', width: '130px' },
    {
      key: 'workOrderStatuses',
      type: 'select-multiple',
      placeholder: '请选择',
      enumCode: 'OrderStatusEnum',
      valueKey: 'code',
      labelKey: 'message',
      width: '260px'
    },
    {
      key: 'checkoutTypeIds',
      type: 'select-multiple',
      placeholder: '请选择结算类型',
      optionsKey: 'checkoutTypeOptions',
      valueKey: 'code',
      labelKey: 'message',
      width: '260px'
    }
  ],
  validate (form) {
    const errs = [];
    if (!Array.isArray(form.warrantyTypes) || form.warrantyTypes.length === 0) {
      errs.push('请至少选择一种保修类型');
    }
    if (!Array.isArray(form.workOrderStatuses) || form.workOrderStatuses.length === 0) {
      errs.push('请至少选择一个工单状态');
    }
    if (form.withinDays === '' || form.withinDays === null || form.withinDays === undefined) {
      errs.push('请输入结算日期时间窗口天数');
    } else if (Number(form.withinDays) < 0) {
      errs.push('结算日期时间窗口不能小于 0 天');
    }
    return errs;
  },
  mergeToExtConfig (form, cfg) {
    cfg.warrantyTypes = [...(form.warrantyTypes || [])];
    cfg.vrtIds = [...(form.vrtIds || [])];
    cfg.withinDays = Number(form.withinDays);
    // form 上是字符串数组(对应 enum code), 提交时 map(Number) 转数字(对齐后端 Builder)
    cfg.workOrderStatuses = (form.workOrderStatuses || []).map(Number);
    // checkoutTypeIds: form 是 UUID 字符串数组, 多选; 提交时透传
    cfg.checkoutTypeIds = [...(form.checkoutTypeIds || [])];
    return {
      cfg,
      deleteFromForm: ['warrantyTypes', 'vrtIds', 'withinDays', 'workOrderStatuses', 'checkoutTypeIds']
    };
  },
  parseExtConfig (cfg) {
    if (!cfg) {
      return {
        warrantyTypes: [...DEFAULT_BXYJ009_WARRANTY_TYPES],
        vrtIds: [],
        withinDays: DEFAULT_BXYJ009_WITHIN_DAYS,
        workOrderStatuses: [...DEFAULT_BXYJ009_WORK_ORDER_STATUSES],
        checkoutTypeIds: [...DEFAULT_BXYJ009_CHECKOUT_TYPE_IDS]
      };
    }
    return {
      // warrantyTypes 缺失时兜底默认值
      warrantyTypes: Array.isArray(cfg.warrantyTypes) && cfg.warrantyTypes.length > 0
        ? [...cfg.warrantyTypes]
        : [...DEFAULT_BXYJ009_WARRANTY_TYPES],
      // vrtIds 允许空数组(语义:不校验VRT), 不主动赋默认值
      vrtIds: Array.isArray(cfg.vrtIds) ? [...cfg.vrtIds] : [],
      // withinDays 缺失时默认 90
      withinDays: (cfg.withinDays !== undefined && cfg.withinDays !== null && cfg.withinDays !== '')
        ? cfg.withinDays
        : DEFAULT_BXYJ009_WITHIN_DAYS,
      // workOrderStatuses 后端存数字数组, 前端 v-model 是字符串数组, 解析时 map(String)
      workOrderStatuses: Array.isArray(cfg.workOrderStatuses) && cfg.workOrderStatuses.length > 0
        ? cfg.workOrderStatuses.map(String)
        : [...DEFAULT_BXYJ009_WORK_ORDER_STATUSES],
      // checkoutTypeIds 默认 [保险 UUID]
      checkoutTypeIds: Array.isArray(cfg.checkoutTypeIds) && cfg.checkoutTypeIds.length > 0
        ? [...cfg.checkoutTypeIds]
        : [...DEFAULT_BXYJ009_CHECKOUT_TYPE_IDS]
    };
  }
};
