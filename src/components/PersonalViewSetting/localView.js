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
 * 文本排序比较器(PRD 7.1.2.2「自定义排序」的排序规则)。
 *
 * <p>PRD 明确两条:
 * <ul>
 *   <li>含混合模式数字时按升序排序后【a2】排在【a10】前面 —— 需要自然序(numeric);</li>
 *   <li>含中文时需要转化为拼音之后进行排序 —— 需要 zh 的拼音排序规则。</li>
 * </ul>
 *
 * <p>{@code Intl.Collator} 的 zh 排序规则本身就是拼音序,{@code numeric: true}
 * 则是自然序(数字按数值大小比较,而不是逐字符比),两者一起即可满足 PRD。
 * {@code -u-co-pinyin} 是显式指定拼音排序规则,老浏览器不认时退回 {@code zh-CN}
 * (ICU 里 zh 的默认规则同样是拼音)。</p>
 */
const TEXT_COLLATOR = (() => {
  const options = { numeric: true, sensitivity: 'base' };
  try {
    return new Intl.Collator('zh-Hans-CN-u-co-pinyin', options);
  } catch (e) {
    try {
      return new Intl.Collator('zh-CN', options);
    } catch (e2) {
      // 运行环境不支持 Intl.Collator 时退回普通字符串比较
      return null;
    }
  }
})();

/**
 * 两个单元格值的文本比较(升序语义)。
 * @param {*} a
 * @param {*} b
 * @returns {Number} 负数 = a 在前
 */
function compareText (a, b) {
  const at = a === null || a === undefined ? '' : String(a);
  const bt = b === null || b === undefined ? '' : String(b);
  if (TEXT_COLLATOR) return TEXT_COLLATOR.compare(at, bt);
  return at < bt ? -1 : at > bt ? 1 : 0;
}

/**
 * 按排序项排序(多字段依次比较,次序靠前的字段先排)。
 *
 * <p>排序规则见 {@link TEXT_COLLATOR}:中文按拼音、混合模式数字按自然序。</p>
 *
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
        // 两边都是数值:直接按数值大小比(最精确)
        cmp = an - bn;
      } else {
        // 文本(或数值与文本混合):按 PRD 规则 —— 中文转拼音、混合模式数字按自然序
        cmp = compareText(av, bv);
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

/**
 * 本地性能测试的耗时上限(ms)。
 *
 * <p>与后端 perf 的 5000ms 阈值保持一致。</p>
 */
export const LOCAL_PERF_LIMIT_MS = 5000;

/**
 * 本地性能测试 —— 明细表视图的「性能测试」替代实现。
 *
 * <p><b>为什么需要它</b>:后端 perf 接口走 customViewMain.path 指向的列表接口
 * (通用视图查询)。单据明细表不是独立列表页,该接口必须带单据 ID 才能定位数据,
 * 通用查询拿不到 —— 实测 bizKey=maintenanceOutboundOrderDetail:
 * <ul>
 *   <li>直接调 executeQuery → 报「维修出库单不存在null」/ 500;</li>
 *   <li>调 perf → 后端 future.get(10s) 超时,perfStatus 恒为 pending(未通过)。</li>
 * </ul>
 * 即后端性能测试在明细表场景<b>必然失败</b>,不能用来卡保存。</p>
 *
 * <p>明细表视图的筛选/排序本来就在前端本地生效,所以性能测试也应测「本地这条路径」:
 * 用视图的条件树与排序项对<b>全量明细行</b>做一次真实的过滤 + 排序,统计耗时。
 * 测的正是用户实际会走的执行路径,语义上与后端 perf 等价(「这条视图跑起来快不快」)。</p>
 *
 * <p>与后端 perf 保持一致的口径:
 * <ul>
 *   <li>耗时超过 {@link LOCAL_PERF_LIMIT_MS} 视为未通过;</li>
 *   <li>返回耗时(ms),供前端提示「性能测试通过/未通过:耗时 Xms」。</li>
 * </ul>
 *
 * @param {Array<Object>} rows 全量明细行
 * @param {Object} conditionTree 视图条件树
 * @param {Array<Object>} sortFields 排序项 [{column, sort}] sort 为 ASC / DESC
 * @returns {{passed: Boolean, durationMs: Number, rowCount: Number}}
 */
export function localPerfTest (rows, conditionTree, sortFields) {
  const list = Array.isArray(rows) ? rows : [];
  const start = Date.now();
  try {
    const filtered = filterByTree(list, conditionTree);
    const sorted = sortByFields(filtered, sortFields);
    const durationMs = Date.now() - start;
    return {
      passed: durationMs <= LOCAL_PERF_LIMIT_MS,
      durationMs,
      rowCount: sorted.length
    };
  } catch (e) {
    // 条件求值/排序异常也算未通过(视图条件有问题,不能拿去用)
    return {
      passed: false,
      durationMs: Date.now() - start,
      rowCount: 0
    };
  }
}
