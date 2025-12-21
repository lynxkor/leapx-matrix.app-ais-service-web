import api from '@/axios';

/**
 * 零小跑用户登陆
 * @export
 * @returns
 */
export function login (params) {
  return api.jsonPost('/passport/users/loginEncrypt', params);
};

/**
 * 用户中心登录
 */
export function loginUserCenter (params) {
  return api.post(process.env.VUE_APP_USERCENTER + '/auth/login', params);
};

/**
 * 登录者修改密码
 * @export
 * @param {*} params
 * @returns
 */
export function changeUserPsd (params) {
  return api.post('/passport/users/update/password', params);
};

/**
 * 切换上下线状态
 * @export
 * @param {*} params
 * @returns
 */
export function getOnlineOperation (params) {
  return api.get('/onlineManage/onlineOperation', params);
};

/**
 * 获取上下线状态
 * @export
 * @param {*} params
 * @returns
 */

export function getServiceOnlineStatus (params) {
  return api.get('/onlineManage/getServiceOnlineStatus', params);
};

/**
 * 获取我的应用
 * @export
 * @param {*} params
 * @returns
 */
export function queryClientByUserId (params) {
  return api.get('/userCenter/user/v1/api/sso/queryClientByUserId', params);
};

/**
 * 获取跳转地址
 * @export
 * @param {*} params
 * @returns
 */
export function getRedirectUrl (params) {
  return api.get('/userCenter/user/v1/api/sso/getRedirectUrl', params);
};

// 获取天润客服链接
export function getTrUrl () {
  return api.get('/chat/tianrun/url');
};

/**
 * 通过资源uri查询资源路径
 * @export
 * @param {*} params
 * @returns
 */
export function getActiveBreadcrumb (params) {
  return api.post('/passport/resourceInfo/findPath', params);
};

/**
 * 查询地区树
 * @export
 * @returns
 */
export function getAreaTree () {
  return api.get('/area/tree');
};
