/**
 * 保修申请单自定义查询 — 字段元数据
 *
 * 字段键与 warrantyapply/index.vue 中 optionObj.dataProp 的 props 一一对应。
 * 类型(text/number/date/enum)决定可用运算符和值控件。
 *
 * 后续真正接入后端时,本文件可改成"从后端拉字典 + 类型"。
 */

// 硬编码枚举字典(占位阶段避免依赖后端枚举接口/store)
export const ENUM_OPTIONS = {
  claim_warranty_apply_status: [
    { code: '10', message: '未提交' },
    { code: '20', message: '审核中' },
    { code: '21', message: '待保修经理审核' },
    { code: '25', message: '待总经理审核' },
    { code: '30', message: '已驳回' },
    { code: '40', message: '已拒赔' },
    { code: '60', message: '审核通过' },
    { code: '70', message: '已结算' },
    { code: '80', message: '已付款' },
    { code: '90', message: '已作废' }
  ],
  alarm_level: [
    { code: '0', message: '未指定' },
    { code: '10', message: '过期' },
    { code: '20', message: '正常' },
    { code: '30', message: '黄色' },
    { code: '40', message: '红色' }
  ]
};

// 35 个可作为查询条件的表格数据列(操作列 operate 不计)
export const FIELDS = [
  { key: 'applyNo', label: '保修申请单', type: 'text' },
  { key: 'vin', label: 'VIN', type: 'text' },
  { key: 'serviceProxyNo', label: '施工单', type: 'text' },
  { key: 'statementCode', label: '结算单号', type: 'text' },
  { key: 'applyStatusLabel', label: '保修单状态', type: 'enum', enumCode: 'claim_warranty_apply_status', options: ENUM_OPTIONS.claim_warranty_apply_status },
  { key: 'repairItemTypeName', label: '保修类型', type: 'text' },
  { key: 'dealerCode', label: '门店编码', type: 'text' },
  { key: 'dealerName', label: '门店名称', type: 'text' },
  { key: 'dealerRegionName', label: '门店所属区域', type: 'text' },
  { key: 'currentSubmitTime', label: '当前提交时间', type: 'date' },
  { key: 'approvalTime', label: '审批时间', type: 'date' },
  { key: 'vehiclePlateNo', label: '车牌号', type: 'text' },
  { key: 'ownerName', label: '车主姓名', type: 'text' },
  { key: 'vehicleModelName', label: '车型', type: 'text' },
  { key: 'warrantyStartdate', label: '保修开始日期', type: 'date' },
  { key: 'repairStartTime', label: '维修开始日期', type: 'date' },
  { key: 'mainPartCode', label: '主因件编码', type: 'text' },
  { key: 'mainPartName', label: '主因件名称', type: 'text' },
  { key: 'mileage', label: '进店里程 KM', type: 'number' },
  { key: 'serviceMonth', label: '服务月份', type: 'number' },
  { key: 'laborClaimTotal', label: '工时索赔小计', type: 'number' },
  { key: 'partsClaimTotal', label: '备件索赔小计', type: 'number' },
  { key: 'otherClaimTotal', label: '其他索赔小计', type: 'number' },
  { key: 'totalClaimAmount', label: '索赔总金额', type: 'number' },
  { key: 'workCostCount', label: '工时费用小计', type: 'number' },
  { key: 'partsCostTotal', label: '备件费用小计', type: 'number' },
  { key: 'otherCostTotal', label: '其他费用小计', type: 'number' },
  { key: 'laborShareRatio', label: '工时分担比例', type: 'number' },
  { key: 'partsShareRatio', label: '备件分担比例', type: 'number' },
  { key: 'otherShareRatio', label: '其他分担比例', type: 'number' },
  { key: 'faultPhenomenon', label: '故障信息描述', type: 'text' },
  { key: 'troubleshootingFlow', label: '故障流程排查', type: 'text' },
  { key: 'createTime', label: '创建时间', type: 'date' },
  { key: 'updateTime', label: '修改时间', type: 'date' },
  { key: 'alarmLevelLabel', label: '三包预警', type: 'enum', enumCode: 'alarm_level', options: ENUM_OPTIONS.alarm_level }
];

// 运算符定义(valueKind 决定值控件: single | multi | daterange | empty)
export const OPERATORS = {
  equals:      { value: 'equals',      label: '等于',     valueKind: 'multi' },
  notEquals:   { value: 'notEquals',   label: '不等于',   valueKind: 'multi' },
  contains:    { value: 'contains',    label: '包含',     valueKind: 'single' },
  notContains: { value: 'notContains', label: '不包含',   valueKind: 'single' },
  isEmpty:     { value: 'isEmpty',     label: '为空',     valueKind: 'empty' },
  isNotEmpty:  { value: 'isNotEmpty',  label: '不为空',   valueKind: 'empty' },
  startsWith:  { value: 'startsWith',  label: '以...开头', valueKind: 'single' },
  endsWith:    { value: 'endsWith',    label: '以...结尾', valueKind: 'single' },
  gt:          { value: 'gt',          label: '大于',     valueKind: 'single' },
  lt:          { value: 'lt',          label: '小于',     valueKind: 'single' },
  ge:          { value: 'ge',          label: '大于等于', valueKind: 'single' },
  le:          { value: 'le',          label: '小于等于', valueKind: 'single' },
  between:     { value: 'between',     label: '介于',     valueKind: 'daterange' },
  inList:      { value: 'inList',      label: '在...中',   valueKind: 'multi' },
  notInList:   { value: 'notInList',   label: '不在...中', valueKind: 'multi' }
};

// 运算符 × 字段类型 矩阵(允许的运算符 value 列表)
const OPERATOR_MATRIX = {
  text:   ['equals', 'notEquals', 'contains', 'notContains', 'isEmpty', 'isNotEmpty', 'startsWith', 'endsWith'],
  number: ['equals', 'notEquals', 'isEmpty', 'isNotEmpty', 'gt', 'lt', 'ge', 'le'],
  date:   ['isEmpty', 'isNotEmpty', 'between', 'gt', 'lt'],
  enum:   ['equals', 'notEquals', 'isEmpty', 'isNotEmpty', 'inList', 'notInList']
};

// 工具:取字段类型
export function getFieldType (fieldKey) {
  const f = FIELDS.find(item => item.key === fieldKey);
  return f ? f.type : null;
}

// 工具:取字段定义
export function getField (fieldKey) {
  return FIELDS.find(item => item.key === fieldKey) || null;
}

// 工具:取字段对应的可用运算符定义列表
export function getOperatorsForField (fieldKey) {
  const type = getFieldType(fieldKey);
  if (!type) return [];
  return OPERATOR_MATRIX[type].map(opValue => OPERATORS[opValue]);
}

// 工具:取运算符定义
export function getOperator (operatorValue) {
  return OPERATORS[operatorValue] || null;
}

// 工具:运算符是否需要值
export function operatorNeedsValue (operatorValue) {
  const op = getOperator(operatorValue);
  return op && op.valueKind !== 'empty';
}

// 工具:创建空行
export function createEmptyRow () {
  return {
    id: `row_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    field: null,
    operator: null,
    value: null
  };
}

// 工具:创建空分组
export function createEmptyGroup (logic = 'AND') {
  return {
    id: `grp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'group',
    logic,
    conditions: [createEmptyRow()]
  };
}

// 工具:深度克隆条件树
export function cloneTree (tree) {
  return JSON.parse(JSON.stringify(tree));
}