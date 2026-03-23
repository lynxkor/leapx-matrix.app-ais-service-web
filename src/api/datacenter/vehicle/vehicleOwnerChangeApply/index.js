import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'datacenter/web/vehicle/vehicleOwnerChangeApply/';

/**
 * 查询加密数据
 * @param {String} id
 * @param {String} field
 */
export function getDecryptField (id, field) {
  let param = {
    id,
    decryptFields: [field]
  };
  return new Promise(resolve => {
    api.jsonPost(prefix + 'getDecrypt', param).then(res => {
      resolve(res?.[field]);
    });
  });
}

/**
 * 查询列表
 * @param {Object} data
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
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
 * 查询
 * @param {Object} data
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

/**
 * 启用停用
 * @param {Object} data
 */
export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}
/**
 * VIN下拉接口
 */
export function vinSearchApi (data) {
  return api.jsonPost('/xxxx', data);
}

/**
 * 作废车主信息变更申请
 * @param {*} data
 * @returns
 */
export function cancel (data) {
  return api.jsonPost(prefix + 'cancel', data);
}

/**
 * 提交车主信息变更申请
 * @param {*} data
 * @returns
 */
export function submit (data) {
  return api.jsonPost(prefix + 'submit', data);
}

/**
 * 审批驳回车主信息变更申请
 * @param {*} data
 * @returns
 */
export function reject (data) {
  return api.jsonPost(prefix + 'reject', data);
}

/**
 * 审批通过车主信息变更申请
 * @param {*} data
 * @returns
 */
export function approve (data) {
  return api.jsonPost(prefix + 'approve', data);
}
