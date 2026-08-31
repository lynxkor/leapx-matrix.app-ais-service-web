import api from '@/axios';

const prefix = 'claimreturn/claim/web/basic/warrantyWarningPartWhitelist/';
const prefixReplace = 'claimreturn/claim/web/basic/warrantyWarningPartWhitelistReplace/';

// 主白名单
export function whitelistPage (data) {
  return api.jsonPost(prefix + 'page', data);
}

export function whitelistGet (id) {
  return api.jsonPost(prefix + 'get', id);
}

export function whitelistAddOrUpdate (data) {
  return api.jsonPost(prefix + 'addOrUpdate', data);
}

export function whitelistDelete (ids) {
  return api.jsonPost(prefix + 'delete', ids);
}

export function whitelistEnableOrDisable (data) {
  return api.jsonPost(prefix + 'enableOrDisable', data);
}

// 替换件
export function whitelistReplacePage (data) {
  return api.jsonPost(prefixReplace + 'page', data);
}

export function whitelistReplaceAddOrUpdate (data) {
  return api.jsonPost(prefixReplace + 'addOrUpdate', data);
}

export function whitelistReplaceDelete (ids) {
  return api.jsonPost(prefixReplace + 'delete', ids);
}
