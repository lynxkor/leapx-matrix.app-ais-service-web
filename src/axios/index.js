import axios from 'axios';
import qs from 'qs';
import { paramsFilter, decrypt } from '@/utils';
import { Message } from 'element-ui';
import store from '../store';

const root = window.APP_AIS_WEB_CONFIG.VUE_APP_WORK_ORDER_URL;
const leapx = window.APP_AIS_WEB_CONFIG.VUE_APP_LEAPX_URL;

// 请求拦截器
axios.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers.Authorization = 'Bearer ' + store.state.user.token;
    config.headers['X-CROSS-NODE-ID'] = localStorage.getItem('token');
  };
  config.headers.Accepte = 'application/vnd.leapx.v2+json';
  return config;
}, error => {
  return Promise.reject(error);
});

const NEED_DECRYPT = (target) => {
  let NEED_DECRYPT_API = [
    '/passport/users/loginEncrypt'
  ];
  return NEED_DECRYPT_API.some(el => (new RegExp(`^${el}[/]?[0-9A-Z]*$`).test(target)));
};

const responseInterceptors = (instance, forbidToast) => {
  return instance.interceptors.response.use(res => {
    /**
    * code为非200是抛错 可结合自己业务进行修改
    */
    // NEED_DECRYPT_LIST中接口返回参数解密
    const flag = NEED_DECRYPT(res.config.url);
    const response = flag ? decrypt(res.data) : res.data;
    // const response = res.data;
    // 登陆token过期
    if (response.code === 610) {
      // 如果是手机，则返回原生的登陆页面
      store.commit('USER_SIGN_OUT');
      return Promise.reject(response);
    } else if (/^20[0-9]+$/.test(response.code)) {
      // 正常返回
      return response;
    } else if (response.code === 600) {
      // 无数据
      return Promise.reject(response);
    } else {
      if (res.config.responseType === 'blob' && !response.code) {
        // 如果是文件流 直接返回
        return Promise.resolve({ data: response });
      }
      !forbidToast && Message({
        message: response.msg,
        type: 'error',
        duration: 3000
      });

      return Promise.reject(response);
    }
  },
  error => {
    const flag = NEED_DECRYPT(error.config.url);

    const response = error.response;
    response.data = flag ? decrypt(response.data) : response.data;

    if (response && response.status === 401) {
      store.commit('USER_SIGN_OUT');
      return Promise.reject(response.data);
    } else if (response && (response.status === 403 || response.status === 405)) {
      !forbidToast && Message({
        message: response.data.msg,
        type: 'error',
        duration: 5000
      });
      return Promise.reject(response.data);
    } else if ((response && response.status === 400) || (response && response.status === 500) || (response && response.status === 710)) {
      if (response.data.msg) {
        !forbidToast && Message({
          message: response.data.msg,
          type: 'error',
          duration: 5000
        });
      } else {
        !forbidToast && Message({
          message: '服务器错误，请稍后再试',
          type: 'error',
          duration: 3000
        });
      }
      return Promise.reject(response.data);
    }

    !forbidToast && Message({
      message: '服务器错误，请稍后再试',
      type: 'error',
      duration: 3000
    });
    return Promise.reject(error);
  });
};
let myInterceptorsResponse = responseInterceptors(axios);
// 封装axios的post 请求

/**
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @param {string} method 请求方法
 * @param {boolean} sign 是否是leapx接口
 * @param {boolean} userResponse 是否自定义拦截器
 * @param {boolean} config 自定义配置 {responseType: 'blob',isRealPut:ture}
 */
export function fetch (url, params, method, sign, userResponse, config) {
  if (url === '/userCenter/user/v1/api/sso/getRedirectUrl') {
    console.log('单点跳转登录:/userCenter/user/v1/api/sso/getRedirectUrl');
    axios.defaults.withCredentials = true;
  };
  // 自定义拦截器
  if (userResponse) {
    axios.interceptors.response.eject(myInterceptorsResponse);
    myInterceptorsResponse = responseInterceptors(axios, userResponse);
  }
  // 手动设置请求超时
  // axios.defaults.timeout = 3000;
  // 按照标识做url转发
  axios.defaults.baseURL = root;
  if (sign) {
    axios.defaults.baseURL = leapx;
  }

  if (method === 'postJson') {
    axios.defaults.headers['Content-Type'] = 'application/json';
  } else if (method === 'put') {
    if (config && config.isRealPut) {
      axios.defaults.headers['Content-Type'] = 'application/json';
    } else {
      axios.defaults.headers['Content-Type'] = 'multipart/form-data';
    }
  } else if (method === 'delete') {
    if (config && config.isJSON) {
      axios.defaults.headers['Content-Type'] = 'application/json';
    } else {
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  } else {
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  };
  return new Promise((resolve, reject) => {
    if (method === 'post') { // 封装post方法
      axios.post(url, qs.stringify(params))
        .then(response => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    } else if (method === 'postJson') { // 封装postJSON方法
      // for (var key in params) { // 非必填字段也要传值,传空就行
      //   if (params[key] === '') {
      //     delete params[key];
      //   }
      // }
      // id为空时删除
      if (params?.id === '') {
        delete params.id;
      }
      axios.post(url, params, config)
        .then(response => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    } else if (method === 'put') {
      if (config && config.isRealPut) {
        axios.put(url, params)
          .then(response => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        axios.post(url, params)
          .then(response => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      }
    } else if (method === 'get') { // 封装get方法
      axios.get(url, { params })
        .then(response => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    } else if (method === 'delete') { // 封装delete方法
      axios.delete(url, params)
        .then(response => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    };
  });
};

export default {
  // post方法
  post (url, params, sign, userResponse) {
    let temp = params;
    if (params) {
      temp = JSON.stringify(params);
      temp = JSON.parse(temp);
    };
    return fetch(url, paramsFilter(temp), 'post', sign, userResponse);
  },
  // postJSON方法
  jsonPost (url, params, sign, userResponse) {
    let temp = params;
    if (params) {
      temp = JSON.stringify(params);
      temp = JSON.parse(temp);
    };
    return fetch(url, temp, 'postJson', sign, userResponse);
  },
  // postJSON方法--文件流
  postExport (url, params, config) {
    return fetch(url, params, 'postJson', '', '', config);
  },

  // get方法
  get (url, params, sign, userResponse) {
    let temp = params;
    if (params) {
      temp = JSON.stringify(params);
      temp = JSON.parse(temp);
    };
    return fetch(url, paramsFilter(temp), 'get', sign, userResponse);
  },
  // delete方法
  delete (url, params, sign) {
    let temp = params;
    if (params) {
      temp = JSON.stringify(params);
      temp = JSON.parse(temp);
    };
    return fetch(url, temp, 'delete', sign);
  },
  // delete方法 -JSON
  deleteJson (url, params, sign) {
    let temp = params;
    // 注意传输 params= { data:xxx }
    return fetch(url, temp, 'delete', sign, '', { isJSON: true });
  },

  // put方法 - 实际是post请求
  putFormData (url, params, sign) {
    return fetch(url, params, 'put', sign);
  },
  put (url, params, sign) {
    return fetch(url, params, 'put', sign, '', { isRealPut: true });
  }
};
