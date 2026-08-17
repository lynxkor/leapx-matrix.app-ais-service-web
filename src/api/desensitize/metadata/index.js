import api from '@/axios';

const prefix = 'dbMetadata/';

/**
 * 获取数据库列表
 * @param {String} systemId - 系统标识：leapx | ais
 */
export function getDatabases (systemId) {
  return api.get(prefix + 'databases', { systemId });
}

/**
 * 获取表名列表
 * @param {String} systemId - 系统标识：leapx | ais
 * @param {String} dbName - 数据库名称
 */
export function getTables (systemId, dbName) {
  return api.get(prefix + 'tables', { systemId, dbName });
}

/**
 * 获取字段列表
 * @param {String} systemId - 系统标识：leapx | ais
 * @param {String} dbName - 数据库名称
 * @param {String} tableName - 表名
 */
export function getColumns (systemId, dbName, tableName) {
  return api.get(prefix + 'columns', { systemId, dbName, tableName });
}
