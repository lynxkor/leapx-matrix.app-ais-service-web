import './public-path';
import Vue from 'vue';
import App from './App.vue';
import { getRouter } from './router';
import store from './store';
import ElementUI from 'element-ui';
import Vuex from 'vuex';
import '@/libs/directive/index.js';
import { confirmExport } from '@/libs/utils';
import '@/common/css/element-variables.scss';
import '@/common/css/base.css';
import '@/libs/assets/styles/index.scss';
import '@/libs/assets/iconfont/iconfont.css';
import '@leapmotor/splitpanes/dist/splitpanes.css';
import AuditLogPlugin from '@/libs/plugins/auditLog.js';
import PrintPlugin from '@/libs/plugins/print.js';
import VideoPlugin from '@/libs/plugins/video.js';
/* -------------------- 注册vxe-table ----------------- */
import {
  VxeUi,
  VxeTooltip,
  VxeButton,
} from 'vxe-pc-ui';

import {
  VxeTable,
  VxeColumn,
  VxeToolbar,
} from 'vxe-table';

// 导入主题变量，也可以重写主题变量
import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/base.scss';
import '@/common/css/vxe-table-variable.scss';

// 导入默认的语言
import zhCN from 'vxe-table/lib/locale/lang/zh-CN';

VxeUi.setI18n('zh-CN', zhCN);
VxeUi.setLanguage('zh-CN');
VxeUi.setConfig({
  zIndex: 2999 // 解决弹出框表格内的提示信息被遮挡问题
});

Vue.use(VxeTable);
Vue.use(VxeTooltip);
Vue.use(VxeColumn);
Vue.use(VxeToolbar);
Vue.use(VxeButton);
/* -------------------- 注册vxe-table ----------------- */

Vue.config.productionTip = false;
Vue.config.errorHandler = (err, vm, info) => {
  console.error('[Vue Error]', info, err);
};

Vue.use(ElementUI);
Vue.use(Vuex);

/* -------------------- 注册插件 ----------------- */
Vue.use(AuditLogPlugin);
Vue.use(PrintPlugin);
Vue.use(VideoPlugin);

/* -------------------- 注册指令 ----------------- */

// 监听全局分辨率
const onResize = () => {
  let dist = document.body.clientWidth;
  let assw = null;
  if (dist > 1919) {
    assw = 1;
  }
  if (dist < 1919 && dist > 1535) {
    assw = 1.24;
  }
  if (dist < 1535) {
    assw = 1.5;
  }
  Vue.prototype.$SCREENWIDTH = assw;
};
window.addEventListener('resize', () => {
  onResize();
});
window.onresize = onResize;
onResize();
Vue.prototype.$confirmExport = confirmExport;

const windowDevice = window.devicePixelRatio;
if (windowDevice === 1.5) {
  document.body.style.zoom = 100 / 150;
} else if (windowDevice === 1.25) {
  document.body.style.zoom = 100 / 125;
} else {
  document.body.style.zoom = 1;
}

let router = null;
let instance = null;

function render (props = {}) {
  const { container } = props;
  router = getRouter();

  instance = new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}

export async function bootstrap () {
  console.log('[vue] vue app bootstraped');
}
export async function mount (props) {
  console.log('[vue] props from main framework', props);
  render(props);
}

export async function unmount () {
  console.log('子应用卸载');
  instance.$destroy();
  instance = null;
  router = null;
};

// 单独开发环境
// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// eslint-disable-next-line no-extend-native
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        // eslint-disable-next-line eqeqeq
        RegExp.$1.length == 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
};
