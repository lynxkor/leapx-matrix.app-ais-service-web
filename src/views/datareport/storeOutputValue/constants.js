/**
 * 售后产值报表 - 14 指标定义(从前端静态常量,无后端接口)
 *
 * 数据来源:Excel「【业务已确认】售后产值报表」sheet 中的 14 个指标说明
 * 修改说明文字时,直接编辑本文件即可
 */
export const INDICATOR_DEFINITIONS = [
  {
    code: 'factoryCount',
    name: '出厂台次',
    selfPaid: '结算单收款时间在所查询时间范围内,结算类型为"自费"的结算单,施工单对应的结算单需已全部结算,施工单存在多个结算单时只按照最后一笔结算时间统计数量且"按日","按VIN"去重统计总和',
    insurance: '结算单收款时间在所查询时间范围内,结算类型为"保险"的结算单,施工单对应的结算单需已全部结算,施工单存在多个结算单时只按照最后一笔结算时间统计数量且"按日","按VIN"去重统计总和',
    internalSettlement: '结算单收款时间在所查询时间范围内,结算类型为"内部结算"的结算单,施工单对应的结算单需已全部结算,施工单存在多个结算单时只按照最后一笔结算时间统计数量且"按日","按VIN"去重统计总和',
    contract: '保修申请单审批通过时间在所查询时间范围内,结算类型为"合同"的保修申请单数量且"按日","按VIN"去重统计总和',
    warranty: '保修申请单审批通过时间在所查询时间范围内,结算类型为"保修"的保修申请单数量且"按日","按VIN"去重统计总和',
    total: '查出的审批通过保修申请单VIN和查出的结算单VIN在一起按日、按VIN去重统计'
  },
  {
    code: 'settledCount',
    name: '已结算施工单数',
    selfPaid: '结算单收款时间在所查询时间范围内,结算类型为"自费"的结算单数量且"按日","按VIN"去重统计总和',
    insurance: '结算单收款时间在所查询时间范围内,结算类型为"保险"的结算单数量且"按日","按VIN"去重统计总和',
    internalSettlement: '结算单收款时间在所查询时间范围内,结算类型为"内部结算"的结算单数量且"按日","按VIN"去重统计总和',
    contract: '保修申请单审批通过时间在所查询时间范围内,结算类型为"合同"的保修申请单数量且"按日","按VIN"去重统计总和',
    warranty: '保修申请单审批通过时间在所查询时间范围内,结算类型为"保修"的保修申请单数量且"按日","按VIN"去重统计总和',
    total: '查出的审批通过保修申请单VIN和查出的结算单VIN在一起按日、按VIN去重统计'
  },
  {
    code: 'outputValue',
    name: '产值',
    selfPaid: '结算单收款时间在所查询时间范围内,结算类型为"自费",结算单状态为"已收款"的"实际应付总金额"总和',
    insurance: '结算单收款时间在所查询时间范围内,结算类型为"保险",结算单状态为"已收款"的"实际应付总金额"总和',
    internalSettlement: '结算单收款时间在所查询时间范围内,结算类型为"内部结算",结算单状态为"已收款"的"实际应付总金额"总和',
    contract: '保修申请单审批通过时间在所查询时间范围内,结算类型为"合同"的索赔总金额总和',
    warranty: '保修申请单审批通过时间在所查询时间范围内,结算类型为"保修"的索赔总金额总和',
    total: '前面5种类型相加'
  },
  {
    code: 'singleCarOutputValue',
    name: '单车产值',
    selfPaid: '自费产值/自费出厂台次',
    insurance: '保险产值/保险出厂台次',
    internalSettlement: '内部结算产值/内部结算出厂台次',
    contract: '合同产值/合同出厂台次',
    warranty: '保修产值/保修出厂台次',
    total: '总产值/总出厂台次'
  },
  {
    code: 'partsCost',
    name: '备件成本',
    selfPaid: '结算单收款时间在所查询时间范围内,结算类型为"自费"的结算单,结算单材料明细数量乘以出库单明细中的成本价格的总和',
    insurance: '结算单收款时间在所查询时间范围内,结算类型为"保险"的结算单,结算单材料明细数量乘以出库单明细中的成本价格的总和',
    internalSettlement: '结算单收款时间在所查询时间范围内,结算类型为"内部结算"的结算单,结算单材料明细数量乘以出库单明细中的成本价格的总和',
    contract: '保修申请单审批通过时间在所查询时间范围内,结算类型为"合同"的保修申请单,保修申请单材料明细数量乘以出库单明细中的成本价格的总和',
    warranty: '保修申请单审批通过时间在所查询时间范围内,结算类型为"保修"的保修申请单,保修申请单材料明细数量乘以出库单明细中的成本价格的总和',
    total: '前面5种类型相加'
  },
  {
    code: 'grossProfit',
    name: '毛利',
    selfPaid: '自费产值-自费成本',
    insurance: '保险产值-保险成本',
    internalSettlement: '内部结算产值-内部结算成本',
    contract: '合同产值-合同成本',
    warranty: '保修产值-保修成本',
    total: '前面5种类型相加'
  },
  {
    code: 'grossProfitRate',
    name: '毛利率',
    selfPaid: '自费毛利/自费产值',
    insurance: '保险毛利/保险产值',
    internalSettlement: '内部结算毛利/内部结算产值',
    contract: '合同毛利/合同产值',
    warranty: '保修毛利/保修产值',
    total: '总毛利/总产值'
  },
  {
    code: 'workhourIncome',
    name: '工时收入',
    selfPaid: '结算单收款时间在所查询时间范围内,结算类型为"自费"的结算单,结算单(维修项目应付金额-去零金额)',
    insurance: '结算单收款时间在所查询时间范围内,结算类型为"保险"的结算单,结算单(维修项目应付金额-去零金额)',
    internalSettlement: '结算单收款时间在所查询时间范围内,结算类型为"内部结算"的结算单,结算单(维修项目应付金额-去零金额)',
    contract: '保修申请单审批通过时间在所查询时间范围内,结算类型为"合同"保修申请单对应的(工时索赔小计+其他索赔小计)',
    warranty: '保修申请单审批通过时间在所查询时间范围内,结算类型为"保修"保修申请单对应的(工时索赔小计+其他索赔小计)',
    total: '前面5种类型相加'
  },
  {
    code: 'partsIncome',
    name: '备件收入',
    selfPaid: '结算单收款时间在所查询时间范围内,结算类型为"自费"的结算单,结算单零件应付金额总和',
    insurance: '结算单收款时间在所查询时间范围内,结算类型为"保险"的结算单,结算单零件应付金额总和',
    internalSettlement: '结算单收款时间在所查询时间范围内,结算类型为"内部结算"的结算单,结算单零件应付金额总和',
    contract: '保修申请单审批通过时间在所查询时间范围内,结算类型为"合同"保修申请单对应的零件索赔小计总和',
    warranty: '保修申请单审批通过时间在所查询时间范围内,结算类型为"保修"保修申请单对应的零件索赔小计总和',
    total: '前面5种类型相加'
  },
  {
    code: 'workhourRatio',
    name: '工时占比',
    selfPaid: '自费工时收入/自费产值',
    insurance: '保险工时收入/保险产值',
    internalSettlement: '内部结算工时收入/内部结算产值',
    contract: '合同工时收入/合同产值',
    warranty: '保修工时收入/保修产值',
    total: '总工时收入/总产值'
  },
  {
    code: 'partsRatio',
    name: '备件占比',
    selfPaid: '自费备件收入/自费产值',
    insurance: '保险备件收入/保险产值',
    internalSettlement: '内部结算备件收入/内部结算产值',
    contract: '合同备件收入/合同产值',
    warranty: '保修备件收入/保修产值',
    total: '总备件收入/总产值'
  },
  {
    code: 'partsGrossProfit',
    name: '备件毛利',
    selfPaid: '自费备件收入-自费备件成本',
    insurance: '保险备件收入-保险备件成本',
    internalSettlement: '内部结算备件收入-内部结算备件成本',
    contract: '合同备件收入-合同备件成本',
    warranty: '保修备件收入-保修备件成本',
    total: '前面5种类型相加'
  },
  {
    code: 'partsGrossProfitRate',
    name: '备件毛利率',
    selfPaid: '自费备件毛利/自费备件收入',
    insurance: '保险备件毛利/保险备件收入',
    internalSettlement: '内部结算备件毛利/内部结算备件收入',
    contract: '合同备件毛利/合同备件收入',
    warranty: '保修备件毛利/保修备件收入',
    total: '备件毛利总计/备件收入总计'
  },
  {
    code: 'repairRatio',
    name: '维修占比',
    selfPaid: '自费产值/总产值',
    insurance: '保险产值/总产值',
    internalSettlement: '内部结算产值/总产值',
    contract: '合同产值/总产值',
    warranty: '保修产值/总产值',
    total: '100%'
  }
];

/**
 * 6 种类型(行) - 与后端 OutputValueTypeEnum.orderedValues() 对齐
 */
export const TYPE_LABELS = ['总计', '自费', '保险', '内部结算', '合同', '保修'];

/**
 * 14 指标字段顺序(用于 LPVxeTable 列定义)
 * 注意:5 个百分比字段毛利率/工时占比/备件占比/备件毛利率/维修占比 格式化为百分比
 */
export const INDICATOR_FIELD_ORDER = [
  { field: 'factoryCount', name: '出厂台次', isRate: false },
  { field: 'settledCount', name: '已结算施工单数', isRate: false },
  { field: 'outputValue', name: '产值(元)', isRate: false },
  { field: 'singleCarOutputValue', name: '单车产值(元)', isRate: false },
  { field: 'partsCost', name: '备件成本(元)', isRate: false },
  { field: 'grossProfit', name: '毛利(元)', isRate: false },
  { field: 'grossProfitRate', name: '毛利率', isRate: true },
  { field: 'workhourIncome', name: '工时收入(元)', isRate: false },
  { field: 'partsIncome', name: '备件收入(元)', isRate: false },
  { field: 'workhourRatio', name: '工时占比', isRate: true },
  { field: 'partsRatio', name: '备件占比', isRate: true },
  { field: 'partsGrossProfit', name: '备件毛利(元)', isRate: false },
  { field: 'partsGrossProfitRate', name: '备件毛利率', isRate: true },
  { field: 'repairRatio', name: '维修占比', isRate: true }
];
