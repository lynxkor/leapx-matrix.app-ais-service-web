import { getActiveBreadcrumb } from '@/api/user';
const data = {
  state: {
    activeMenu: localStorage.getItem('activeMenu') ? localStorage.getItem('activeMenu') : '/home',
    activeMenuPath: sessionStorage.getItem('activeMenuPath') ? sessionStorage.getItem('activeMenuPath') : '',
    activeBreadcrumb: localStorage.getItem('activeBreadcrumb') ? JSON.parse(localStorage.getItem('activeBreadcrumb')) : ''
  },
  mutations: {
    // 设置默认菜单的code
    SET_ACTIVE_MENU_PATH (state, path) {
      state.activeMenuPath = path;
      sessionStorage.setItem('activeMenuPath', path);
    },
    // 设置用户信息
    SET_ACTIVE_MENU (state, info) {
      state.activeMenu = info;
      localStorage.setItem('activeMenu', info);
    },
    // 设置页面面包屑
    SET_ACTIVE_BREADCRUMB (state, info) {
      state.activeBreadcrumb = info;
      document.title = `${info ? info.join('') + '-' : ''}零小跑`;
      localStorage.setItem('activeBreadcrumb', JSON.stringify(info));
    },
    // 清除默认菜单
    USER_CLICK_MENU (state) {
      localStorage.setItem('activeMenu', '');
      state.activeMenu = '/home';
      localStorage.setItem('activeBreadcrumb', '');
      state.activeBreadcrumb = '';
    }
  },
  actions: {
    GET_ACTIVE_BREADCRUMB (state, path) {
      getActiveBreadcrumb({ resourceUri: path }).then((res) => {
        state.commit('SET_ACTIVE_BREADCRUMB', res);
      });
    }
  }
};

export default data;
