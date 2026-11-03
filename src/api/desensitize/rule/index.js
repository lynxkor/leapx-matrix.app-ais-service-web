import api from '@/axios';

const prefix = 'desensitize/rule/';

/**
 * 分页查询脱敏规则
 * @param {Object} data - 查询参数（含 name/dbName/tableName/columnName/dataCategory/status 等）
 */
export function page (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 新增脱敏规则（一次性提交主规则+岗位配置+用户配置）
 * @param {Object} data - 入参需包含 positionList、userList
 */
export function add (data) {
  return api.jsonPost(prefix + 'add', data);
}

/**
 * 编辑脱敏规则
 * @param {Object} data - 入参需包含 id、positionList、userList
 */
export function edit (data) {
  return api.put(prefix + 'edit', data);
}

/**
 * 启用/禁用脱敏规则
 * @param {Object} data - { id, status }
 */
export function enable (data) {
  return api.put(prefix + 'enable', data);
}

/**
 * 查询脱敏规则详情（含岗位/用户子列表）
 * @param {Number|String} id - 主键ID
 */
export function findById (id) {
  return api.get(prefix + 'findById', { id });
}
