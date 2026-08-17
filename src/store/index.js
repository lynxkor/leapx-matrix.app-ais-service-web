import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import menu from './modules/menu';
import businessData from './modules/businessData';
import pageSource from './modules/page-source';
import enumModule from '@/libs/store/enum';
import customViewModule from '@/libs/store/customView';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    menu,
    pageSource,
    businessData,
    enum: enumModule,
    customView: customViewModule
  }
});
