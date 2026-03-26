import api from '@/axios';

const prefix = 'claimreturn/claim/web/warrantyaudit/warrantyAuditErrorConfig/';

export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
};

export function addOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

export function deleteItem (data) {
  return api.jsonPost(prefix + 'delete', data);
}

export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}

export function enableItem (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}
