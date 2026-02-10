import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'datacenter/web/vehicle/vehicleProfile/';

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'pageFlat', data);
};

/**
 * 新增或修改
 * @param {Object} data
 */
export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

/**
 * 删除
 * @param {Array<Number>} data
 */
export function deleteItem (data) {
  return api.jsonPost(prefix + 'delete', data);
}

/**
 * 查询详情(平铺)
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'getFlat', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}

/**
 * 查询加密数据
 * @param {String} id
 * @param {String} field
 */
export function getDetailDecryptField (id, field) {
  let param = {
    id,
    decryptFields: [field]
  };
  return new Promise(resolve => {
    api.jsonPost(prefix + 'getDecrypt', param).then(res => {
      resolve(res[field]);
    });
  });
}
/**
 * 平铺更新
 * @param {Object} data
 */
export function updateFlat (data) {
  return api.jsonPost(prefix + 'updateFlat', data);
}
