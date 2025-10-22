import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './../store';

const routerPush = VueRouter.prototype.push;
// 修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error);
};
if (!window.VueRouter) Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      isNew: true
    },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      name: '404',
      requiresAuth: true,
      noResourceUrl: true
    },
    component: () => import('@/views/404.vue')
  },
  {
    path: '/',
    name: 'index',
    // component: Layout,
    component: () => import('@/views/layout/index.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/vehiclePartsMaintenance',
        name: 'vehiclePartsMaintenance',
        component: () => import('@/views/vehiclePartsMaintenance/index.vue'),
        meta: {
          name: '车辆档案列表',
          backSwitch: 'front'
        }
      },
      {
        path: '/vehiclePartsMaintenance/detail',
        name: 'vehiclePartsMaintenanceDetail',
        component: () => import('@/views/vehiclePartsMaintenance/detail.vue'),
        meta: {
          name: '车辆档案详情',
          backSwitch: 'front',
          noResourceUrl: true // 详情页不配置对应资源位，需要加
        }
      },
      {
        path: '/home',
        name: 'home',
        meta: {
          name: '首页'
        },
        component: () => import('@/views/home.vue')
      },
      {
        path: '/',
        redirect: '/home',
        name: 'index',
        component: () => import('@/views/home.vue')
      }
    ]
  }
];

// 作为子应用时，重定向会导致路由出错
if (!window.__POWERED_BY_QIANKUN__) {
  routes.push({
    path: '*',
    redirect: '/404',
    hidden: true,
    meta: {
      backSwitch: 'both',
      noResourceUrl: true
    }
  });
}

function toLoginPage (to, next) {
  if (window.__POWERED_BY_QIANKUN__) {
    window.location.href = '/login?redirect=' + to.fullPath;
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
}
export function getRouter () {
  const appPrefix = process.env.VUE_APP_ROUTER_BASE;
  const router = new VueRouter({
    base: `${appPrefix}/`,
    mode: 'history',
    routes
  });
  router.beforeEach((to, from, next) => {
    if (to.matched?.some(record => record.meta.requiresAuth)) {
      // 需要登录
      if (!store.state.user.token || store.state.user.token === '') {
        toLoginPage(to, next);
        return;
      }
      if (localStorage.getItem('sourceUrl').includes(to.path) || to.meta.noResourceUrl) {
        next();
      } else {
        window.alert('你没有访问该页面的权限');
        if (store.state.user.token) {
          next({
            path: '/home'
          });
        } else {
          toLoginPage(to, next);
        }
      }
    }
    next();
  });
  return router;
}
