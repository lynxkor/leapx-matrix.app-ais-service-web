import api from '@/axios';

// 母公司管理 — 对应后端 ParentCompanyController
const prefix = 'datacenter/web/parentCompany/';

/**
 * 母公司分页查询
 * @param {Object} data 参见 ParentCompanyPageReq
 */
export function getList (data) {
  return api.jsonPost(prefix + 'page', data);
}

/**
 * 母公司详情
 * @param {Object} data { companyCode }
 */
export function getDetail (data) {
  return api.jsonPost(prefix + 'get', data);
}
