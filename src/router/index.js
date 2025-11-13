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
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        name: '首页'
      },
      component: () => import('@/views/home.vue')
    }, {
      path: '/',
      redirect: '/home',
      name: 'index',
      component: () => import('@/views/home.vue')
    }, {
      path: '/maintain/basic/dealerteam',
      name: 'dealerTeam',
      component: () => import('@/views/maintain/basic/dealerTeam/index.vue'),

      meta: {
        name: '厅店班组信息管理'
      }
    }, {
      path: '/maintain/basic/dealerteam/detail',
      name: 'dealerTeamDetail',
      component: () => import('@/views/maintain/basic/dealerTeam/detail.vue'),

      meta: {
        name: '厅店班组信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerteam/edit',
      name: 'dealerTeamEdit',
      component: () => import('@/views/maintain/basic/dealerTeam/edit.vue'),

      meta: {
        name: '厅店班组信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerstation',
      name: 'dealerStation',
      component: () => import('@/views/maintain/basic/dealerStation/index.vue'),

      meta: {
        name: '厅店工位信息管理'
      }
    }, {
      path: '/maintain/basic/dealerstation/detail',
      name: 'dealerStationDetail',
      component: () => import('@/views/maintain/basic/dealerStation/detail.vue'),

      meta: {
        name: '厅店工位信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerstation/edit',
      name: 'dealerStationEdit',
      component: () => import('@/views/maintain/basic/dealerStation/edit.vue'),

      meta: {
        name: '厅店工位信息管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerworkhourpricesetting',
      name: 'dealerWorkhourPriceSetting',
      component: () => import('@/views/maintain/basic/dealerWorkhourPriceSetting/index.vue'),

      meta: {
        name: '工时价格设置管理'
      }
    }, {
      path: '/maintain/basic/dealerworkhourpricesetting/detail',
      name: 'dealerWorkhourPriceSettingDetail',
      component: () => import('@/views/maintain/basic/dealerWorkhourPriceSetting/detail.vue'),

      meta: {
        name: '工时价格设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerworkhourpricesetting/edit',
      name: 'dealerWorkhourPriceSettingEdit',
      component: () => import('@/views/maintain/basic/dealerWorkhourPriceSetting/edit.vue'),

      meta: {
        name: '工时价格设置管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/checkouttype',
      name: 'checkoutType',
      component: () => import('@/views/maintain/basic/checkoutType/index.vue'),

      meta: {
        name: '结算类型管理'
      }
    }, {
      path: '/maintain/basic/checkouttype/detail',
      name: 'checkoutTypeDetail',
      component: () => import('@/views/maintain/basic/checkoutType/detail.vue'),

      meta: {
        name: '结算类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/checkouttype/edit',
      name: 'checkoutTypeEdit',
      component: () => import('@/views/maintain/basic/checkoutType/edit.vue'),

      meta: {
        name: '结算类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerdiscount',
      name: 'dealerDiscount',
      component: () => import('@/views/maintain/basic/dealerDiscount/index.vue'),

      meta: {
        name: '门店优惠模式管理'
      }
    }, {
      path: '/maintain/basic/dealerdiscount/detail',
      name: 'dealerDiscountDetail',
      component: () => import('@/views/maintain/basic/dealerDiscount/detail.vue'),

      meta: {
        name: '门店优惠模式管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/dealerdiscount/edit',
      name: 'dealerDiscountEdit',
      component: () => import('@/views/maintain/basic/dealerDiscount/edit.vue'),

      meta: {
        name: '门店优惠模式管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/repairitemtype',
      name: 'repairItemType',
      component: () => import('@/views/maintain/basic/repairItemType/index.vue'),

      meta: {
        name: '维修类型管理',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/repairitemtype/detail',
      name: 'repairItemTypeDetail',
      component: () => import('@/views/maintain/basic/repairItemType/detail.vue'),

      meta: {
        name: '维修类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/repairitemtype/edit',
      name: 'repairItemTypeEdit',
      component: () => import('@/views/maintain/basic/repairItemType/edit.vue'),

      meta: {
        name: '维修类型管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/batteryunit',
      name: 'batteryUnit',
      component: () => import('@/views/maintain/basic/batteryUnit/index.vue'),

      meta: {
        name: '电池去向单位管理',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/batteryunit/detail',
      name: 'batteryUnitDetail',
      component: () => import('@/views/maintain/basic/batteryUnit/detail.vue'),

      meta: {
        name: '电池去向单位管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/batteryunit/edit',
      name: 'batteryUnitEdit',
      component: () => import('@/views/maintain/basic/batteryUnit/edit.vue'),

      meta: {
        name: '电池去向单位管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/vehicletag',
      name: 'vehicleTag',
      component: () => import('@/views/maintain/basic/vehicleTag/index.vue'),

      meta: {
        name: '车辆标识管理'
      }
    }, {
      path: '/maintain/basic/vehicletag/detail',
      name: 'vehicleTagDetail',
      component: () => import('@/views/maintain/basic/vehicleTag/detail.vue'),

      meta: {
        name: '车辆标识管理详情',
        noResourceUrl: 'true'
      }
    }, {
      path: '/maintain/basic/vehicletag/edit',
      name: 'vehicleTagEdit',
      component: () => import('@/views/maintain/basic/vehicleTag/edit.vue'),

      meta: {
        name: '车辆标识管理详情',
        noResourceUrl: 'true'
      }
    }]
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
      // 开发阶段先跳过权限验证
      if (localStorage.getItem('sourceUrl').includes(to.path) || to.meta.noResourceUrl) {
      // if (true) {
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
