import api from '@/axios';

// 根据项目名称（如maintain代表维保项目）手动修改前缀
const prefix = 'maintain/web/sp/serviceStatement/';

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
export function getStatistics (data) {
  return api.jsonPost(prefix + 'statistics', data);
}

/**
 * 批量执行权益核销
 * @param {Object} data
 */
export function execEquityWriteOff (data) {
  return api.jsonPost(prefix + 'execEquityWriteOff', data);
}
/**
 * 提交结算校验
 * @param {Object} data
 */
export function checkStatementAmount (data) {
  return api.jsonPost(prefix + 'checkStatementAmount', data);
}
/**
 * 确定结算
 * @param {Object} data
 */
export function submitSettlementAndSign (data) {
  return api.jsonPost(prefix + 'submitSettlementAndSign', data);
}
/**
 * 驳回
 * @param {Object} data
 */
export function reject (data) {
  return api.jsonPost(prefix + 'reject', data);
}
/**
 * 添加首款记录
 * @param {Object} data
 */
export function addReceiptRecord (data) {
  return api.jsonPost(prefix + 'addReceiptRecord', data);
}
/**
 * 删除首款记录
 * @param {Object} data
 */
export function deleteRecord (data) {
  return api.jsonPost(prefix + 'deleteRecord', data);
}
/**
 * 收款完成
 * @param {Object} data
 */
export function receiptCompletion (data) {
  return api.jsonPost(prefix + 'receiptCompletion', data);
}
/**
 * 创建反结算申请单
 * @param {Object} data
 */
export function createCounterSettlement (data) {
  return api.jsonPost(prefix + 'createCounterSettlement', data);
}

/**
 * 创建保修申请单
 * @param {Object} data
 */
export function createWarrantyApplication (data) {
  return api.jsonPost(prefix + 'createWarrantyApplication', data);
}
/**
 * 权益列表
 * @param {Object} data
 */
export function rightsList (data) {
  return api.jsonPost(prefix + 'rightsList', data);
}
/**
 * 权益核销-冻结
 * @param {Object} data
 */
export function rightsFreeze (data) {
  return api.jsonPost(prefix + 'rightsFreeze', data);
}
/**
 * 权益核销-取消锁定
 * @param {Array} data
 */
export function rightsUnlock (data) {
  return api.jsonPost(prefix + 'rightsUnlock', data);
}
/**
 * 提交结算并确认
 * @param {Object} data
 */
export function submitSettlement (data) {
  return api.jsonPost(prefix + 'submitSettlementAndSign', data);
}

/**
 * 提交结算并签字
 * @param {Object} data
 */
export function signSettlement (data) {
  return api.jsonPost(prefix + 'signSettlement', data);
}

/**
 * 校验签字状态
 * @param {Object} data
 */
export function queryIsLastConfirm (data) {
  return api.jsonPost(prefix + 'queryIsLastConfirm', data);
}

/**
 * 收款记录列表
 * @param {Object} data
 */
export function getStatementPayRecord (data) {
  return api.jsonPost('maintain/web/sp/serviceStatementInvoiceRecord/page', data);
}

/**
 * 查询打印信息
 * @param {Object} data
 */
export function getPrintInfo (data) {
  return api.jsonPost(prefix + 'print', data);
}

/**
 * 重推签字短信
 * @param {Object} data
 */
export function resendSignSms (data) {
  return api.jsonPost(prefix + 'resendSignSms', data);
}

/**
 * 解密字段
 * @param {String} id
 * @param {String} field
 */
export function getDecrypt (id, field) {
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
