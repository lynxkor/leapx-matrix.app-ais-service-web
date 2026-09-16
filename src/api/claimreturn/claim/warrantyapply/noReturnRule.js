import api from '@/axios';

// 不返件规则配置 API（与项目其他 API 一致，使用 api.jsonPost 风格）

const prefix = '/claimreturn/claim/web/warrantyapply/warrantyNoReturnRule/';

// 分页查询
export function page (params) {
  return api.jsonPost(prefix + 'page', params);
}

// 详情
export function detail (id) {
  return api.jsonPost(prefix + 'get', id);
}

// 新增或编辑
export function addOrUpdate (params) {
  return api.jsonPost(prefix + 'addOrUpdate', params);
}

// 删除（软删）
export function remove (id) {
  return api.jsonPost(prefix + 'delete', [id]);
}
