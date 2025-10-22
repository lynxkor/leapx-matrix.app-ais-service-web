import store from '../index';

const data = {
  state: {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    middlePlatformMap: localStorage.getItem('middlePlatformMap') ? JSON.parse(localStorage.getItem('middlePlatformMap')) : {} // 用户中心相关，右上角第三方免登模块
  },
  mutations: {
    // 登陆时设置信息
    SET_LOGIN_INFO (state, info) {
      localStorage.setItem('token', info.token);
      state.token = info.token;
      localStorage.setItem('userInfo', JSON.stringify(info));
      state.userInfo = info;
    },
    // 用户登出
    USER_SIGN_OUT (state) {
      localStorage.setItem('token', '');
      state.token = '';
      localStorage.setItem('userInfo', '');
      localStorage.setItem('sourceUrl', '');
      state.userInfo = {};

      store.commit('SET_MIDDLE_PLATFORM_MAP', []);
      store.commit('SET_PAGE_RESOURCE', {});
      // 通过 js 去除掉 url 里面的参数
      var url = window.location.href; // 获取当前页面的url
      if (url.indexOf('?') !== -1) { // 判断是否存在参数
        url = url.replace(/(\?|#)[^'"]*/, ''); // 去除参数
        window.history.pushState({}, 0, url);
      }
      window.location.href = '/login';
    },
    SET_MIDDLE_PLATFORM_MAP (state, info) {
      localStorage.setItem('middlePlatformMap', JSON.stringify(info));
      state.middlePlatformMap = info;
    }
  }
};

export default data;
