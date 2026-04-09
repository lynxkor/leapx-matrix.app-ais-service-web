import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantysettle/warrantySettleInvoiceRecord/';

/**
 * 开票记录接口
 * @param {Object} data
 */
export function warrantySettleInvoiceRecordPage (data) {
  return api.jsonPost(prefix + 'page', data);
};

/**
 * 删除
 * @param {String} id
 */
export function warrantySettleInvoiceRecordDelete (id) {
  return api.jsonPost(prefix + 'delete', id);
};
