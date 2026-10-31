/**
 * 个人视图 —— 前端本地生效工具。
 *
 * 背景:视图的「自定义筛选 / 自定义排序」在后端有两种落地方式。
 *   1. 通用视图查询:视图对应一个列表页,后端 executeQuery 按 bizKey 解析查询条件,
 *      走 customViewMain.path 指向的列表接口(warrantyapply 等已支持)。
 *   2. 单据明细表视图:视图挂在某张单据的明细表上(如维修出库明细),
 *      该表不是独立列表页,后端 executeQuery 无法解析(缺业务上下文,
 *      实测 bizKey=maintenanceOutboundOrderDetail 报「维修出库单不存在null」),
 *      且明细数据分页由后端按单据 ID 切分。
 *
 * 对第 2 类,筛选/排序在前端本地生效:
 *   - 明细表一次性按大 pageSize 拉全量(单据明细行数量有限),
 *   - 用视图的条件树与排序项在前端过滤、排序,
 *   - 再按前端分页参数切出当前页。
 *
 * 本模块只负责「条件树求值 + 排序」,不关心数据从哪来。
 */

/**
 * 视图的表格配置在服务端的存储键。
 *
 * <p>视图本身存在后端视图表(只有 name/条件树/排序),没有表格配置字段;
 * 表格配置走公共的用户自定义表格接口(userDefineTable),按 tableCode 存取。</p>
 *
 * <p>用「业务键 + 视图 id」组合,保证每个视图一份独立的表格配置,
 * 且不会与 design 包表格设置(按页面 tableCode 存)互相覆盖。
 * PersonalViewSetting 与业务页面都从这里取,避免两处各写一份规则。</p>
 *
 * @param {String} bizKey 业务键
 * @param {String} viewId 视图 id
 * @returns {String}
 */
export function viewTableConfigCode (bizKey, viewId) {
  return `${bizKey}__pvs__${viewId}`;
}

/**
 * 字段名转换:后端字段元数据用下划线(spare_part_code),
 * 而前端明细行用驼峰(sparePartCode)。筛选/排序前需做一次映射。
 * @param {String} fieldName
 * @returns {String}
 */
export function toCamelCase (fieldName) {
  if (!fieldName) return '';
  return fieldName.replace(/_([a-z0-9])/g, (m, c) => c.toUpperCase());
}

/**
 * 取条件行实际作用的行字段名。
 * 优先驼峰(前端行数据),其次下划线(原始字段名),都取不到则返回原名。
 * @param {Object} row
 * @param {String} fieldName
 * @returns {String}
 */
function resolveRowField (row, fieldName) {
  if (!row || !fieldName) return '';
  const camel = toCamelCase(fieldName);
  if (Object.prototype.hasOwnProperty.call(row, camel)) return camel;
  if (Object.prototype.hasOwnProperty.call(row, fieldName)) return fieldName;
  return camel;
}

/**
 * 日期区间的边界(与后端 dateBeforeToday / yesterday 等语义一致)。
 */
function startOfToday () {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays (date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * 计算「以今天为基准」的相对日期区间。
 * @param {String} operator
 * @returns {Array|null} [start, end] 闭区间
 */
function relativeRange (operator) {
  const today = startOfToday();
  const dayEnd = new Date(today);
  dayEnd.setHours(23, 59, 59, 999);
  switch (operator) {
    case 'dateBeforeToday':
      return [null, new Date(today.getTime() - 1)];
    case 'yesterday': {
      const s = addDays(today, -1);
      const e = new Date(s);
      e.setHours(23, 59, 59, 999);
      return [s, e];
    }
    case 'today':
      return [today, dayEnd];
    case 'tomorrow': {
      const s = addDays(today, 1);
      const e = new Date(s);
      e.setHours(23, 59, 59, 999);
      return [s, e];
    }
    case 'lastWeek':
      return [addDays(today, -7), new Date(today.getTime() - 1)];
    case 'thisWeek': {
      // 与后端一致:周一为一周第一天
      const dow = (today.getDay() + 6) % 7;
      const s = addDays(today, -dow);
      const e = new Date(s);
      e.setDate(e.getDate() + 6);
      e.setHours(23, 59, 59, 999);
      return [s, e];
    }
    case 'nextWeek':
      return [addDays(today, 7), addDays(today, 13)];
    case 'lastMonth':
      return [addDays(today, -30), new Date(today.getTime() - 1)];
    case 'thisMonth': {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      const e = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      return [s, e];
    }
    case 'nextMonth':
      return [addDays(today, 30), addDays(today, 60)];
    case 'lastQuarter':
      return [addDays(today, -90), new Date(today.getTime() - 1)];
    case 'thisQuarter': {
      const q = Math.floor(today.getMonth() / 3);
      const s = new Date(today.getFullYear(), q * 3, 1);
      const e = new Date(today.getFullYear(), q * 3 + 3, 0, 23, 59, 59, 999);
      return [s, e];
    }
    case 'nextQuarter':
      return [addDays(today, 90), addDays(today, 180)];
    case 'lastYear':
      return [addDays(today, -365), new Date(today.getTime() - 1)];
    case 'thisYear': {
      const s = new Date(today.getFullYear(), 0, 1);
      const e = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
      return [s, e];
    }
    case 'nextYear':
      return [addDays(today, 365), addDays(today, 730)];
    default:
      return null;
  }
}

/**
 * 取值的字符串形式(用于文本类比较)。
 */
function toText (value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * 取值的数值形式(用于数值比较)。非数值返回 NaN。
 */
function toNumber (value) {
  if (value === null || value === undefined || value === '') return NaN;
  const n = Number(value);
  return Number.isNaN(n) ? NaN : n;
}

/**
 * 判断单条条件是否命中一行数据。
 * @param {Object} row 行数据
 * @param {Object} cond 条件行 {field, operator, value}
 * @returns {Boolean}
 */
export function matchCondition (row, cond) {
  if (!cond || !cond.field) return true;
  const operator = cond.operator;
  const raw = cond.value;
  const field = resolveRowField(row, cond.field);
  const cell = row ? row[field] : undefined;
  const isEmpty = cell === null || cell === undefined || cell === '';

  // 无需取值的运算符
  if (operator === 'isEmpty') return isEmpty;
  if (operator === 'isNotEmpty') return !isEmpty;

  // 相对日期区间
  const rel = relativeRange(operator);
  if (rel) {
    if (isEmpty) return false;
    const t = new Date(cell).getTime();
    if (Number.isNaN(t)) return false;
    const [s, e] = rel;
    if (s && t < s.getTime()) return false;
    if (e && t > e.getTime()) return false;
    return true;
  }

  if (raw === null || raw === undefined || raw === '') return true;

  // 多值(数组)条件:任一命中即可
  const values = Array.isArray(raw) ? raw : [raw];

  switch (operator) {
    case 'equals':
    case 'dateEquals':
      if (values.some(v => toText(v) === toText(cell))) return true;
      return false;
    case 'notEquals':
      return !values.some(v => toText(v) === toText(cell));
    case 'contains':
      return values.some(v => toText(cell).includes(toText(v)));
    case 'notContains':
      return !values.some(v => toText(cell).includes(toText(v)));
    case 'startsWith':
      return values.some(v => toText(cell).startsWith(toText(v)));
    case 'endsWith':
      return values.some(v => toText(cell).endsWith(toText(v)));
    case 'gt': {
      const n = toNumber(cell);
      const t = toNumber(values[0]);
      return !Number.isNaN(n) && !Number.isNaN(t) && n > t;
    }
    case 'lt': {
      const n = toNumber(cell);
      const t = toNumber(values[0]);
      return !Number.isNaN(n) && !Number.isNaN(t) && n < t;
    }
    case 'ge': {
      const n = toNumber(cell);
      const t = toNumber(values[0]);
      return !Number.isNaN(n) && !Number.isNaN(t) && n >= t;
    }
    case 'le': {
      const n = toNumber(cell);
      const t = toNumber(values[0]);
      return !Number.isNaN(n) && !Number.isNaN(t) && n <= t;
    }
    case 'between': {
      const n = toNumber(cell);
      const lo = toNumber(values[0]);
      const hi = toNumber(values[1]);
      if (Number.isNaN(n) || Number.isNaN(lo) || Number.isNaN(hi)) return false;
      return n >= lo && n <= hi;
    }
    case 'dateBefore':
      if (isEmpty) return false;
      return new Date(cell).getTime() < new Date(values[0]).getTime();
    case 'dateAfter':
      if (isEmpty) return false;
      return new Date(cell).getTime() > new Date(values[0]).getTime();
    case 'inList':
      return values.some(v => toText(v) === toText(cell));
    case 'notInList':
      return !values.some(v => toText(v) === toText(cell));
    default:
      return true;
  }
}

/**
 * 条件组求值:组内 AND/OR,组间递归。
 *
 * <p>注意:不能写成 conditions.every(...) —— every 的语义是「全部满足」,
 * OR 组需要的是「任一满足」。这里用 filter + 长度比较来表达两者。</p>
 *
 * @param {Object} row
 * @param {Object} group 条件组 {logic, conditions}
 * @returns {Boolean}
 */
export function matchGroup (row, group) {
  if (!group) return true;
  const conditions = group.conditions || [];
  if (conditions.length === 0) return true;
  const isAnd = (group.logic || 'AND') === 'AND';
  const results = conditions.map(c => (
    c.type === 'group' ? matchGroup(row, c) : matchCondition(row, c)
  ));
  return isAnd ? results.every(Boolean) : results.some(Boolean);
}

/**
 * 按条件树过滤行。
 * @param {Array} rows
 * @param {Object} tree
 * @returns {Array}
 */
export function filterByTree (rows, tree) {
  if (!tree || !Array.isArray(rows)) return rows || [];
  const conditions = tree.conditions || [];
  if (conditions.length === 0) return rows;
  return rows.filter(row => matchGroup(row, tree));
}

/**
 * 按排序项排序(多字段依次比较)。
 * @param {Array} rows
 * @param {Array} sortFields [{column, sort}] sort 为 ASC/DESC
 * @returns {Array} 返回新数组
 */
export function sortByFields (rows, sortFields) {
  if (!Array.isArray(rows) || !Array.isArray(sortFields) || sortFields.length === 0) {
    return rows || [];
  }
  const valid = sortFields.filter(f => f && f.column && f.sort);
  if (valid.length === 0) return rows;
  const list = rows.slice();
  list.sort((a, b) => {
    for (const f of valid) {
      const field = resolveRowField(a, f.column);
      const av = a ? a[field] : undefined;
      const bv = b ? b[field] : undefined;
      const desc = String(f.sort).toUpperCase() === 'DESC';
      let cmp = 0;
      const an = toNumber(av);
      const bn = toNumber(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) {
        cmp = an - bn;
      } else {
        const at = av === null || av === undefined ? '' : String(av);
        const bt = bv === null || bv === undefined ? '' : String(bv);
        cmp = at < bt ? -1 : at > bt ? 1 : 0;
      }
      if (cmp !== 0) return desc ? -cmp : cmp;
    }
    return 0;
  });
  return list;
}

/**
 * 表格列配置 → 实际列定义(按配置过滤显隐并重排顺序)。
 *
 * @param {Array} columns 页面定义的原始列 [{field, title, ...}]
 * @param {Object} tableConfig 表格配置 {columnConfig: [{props, visible}]}
 * @returns {Array} 处理后的列定义
 */
export function applyTableConfig (columns, tableConfig) {
  if (!Array.isArray(columns)) return [];
  const columnConfig = tableConfig && Array.isArray(tableConfig.columnConfig)
    ? tableConfig.columnConfig
    : null;
  if (!columnConfig || columnConfig.length === 0) return columns;

  const orderMap = new Map();
  columnConfig.forEach((item, index) => {
    orderMap.set(item.props, { visible: item.visible !== false, index });
  });

  // 先按配置顺序排,配置里没有的列保持页面原顺序排在后面
  const decorated = columns.map((col, idx) => {
    const conf = orderMap.get(col.field);
    return {
      col,
      visible: conf ? conf.visible : true,
      order: conf ? conf.index : Number.MAX_SAFE_INTEGER,
      idx
    };
  });
  decorated.sort((a, b) => (a.order - b.order) || (a.idx - b.idx));

  return decorated.filter(item => item.visible).map(item => item.col);
}
