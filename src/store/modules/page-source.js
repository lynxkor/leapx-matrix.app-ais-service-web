import { getPageSourceList } from '@/api/crm/page-source';
import { recursionSource, getSourceUrl } from '@/utils';
const data = {
  state: {
    pageSource: localStorage.getItem('pageSource') ? JSON.parse(localStorage.getItem('pageSource')) : [],
    sourceUrl: localStorage.getItem('sourceUrl') ? JSON.parse(localStorage.getItem('sourceUrl')) : [],
    aisPageSource: localStorage.getItem('aisPageSource') ? JSON.parse(localStorage.getItem('aisPageSource')) : [],
    // pageSource: ['M10001', 'M10002', 'M10003', 'M10004', 'M10005', 'M10006', 'M10007', 'M10008', 'M10009', 'M10010', 'M10011', 'M10012', 'M10013', 'M10014', 'M10015', 'M10016', 'M10018', 'M10019', 'M10020', 'M10021', 'M10017', 'B10001', 'B10002', 'B10003', 'B10004', 'B10005', 'B10006', 'B10007', 'B10008']
  },
  mutations: {
    // 设置资源目录
    SET_PAGE_RESOURCE (state, info) {
      const arr = [];
      const arr1 = [];
      recursionSource(info, arr);
      getSourceUrl(info, arr1);
      const aisPageSource = arr.filter(item => item.startsWith('AIS'));
      localStorage.setItem('pageSource', JSON.stringify(arr));
      localStorage.setItem('sourceUrl', JSON.stringify(arr1));
      localStorage.setItem('aisPageSource', JSON.stringify(aisPageSource));
      state.pageSource = arr;
      state.sourceUrl = arr1;
    }
  },
  actions: {
    // 获取资源目录
    SET_PAGE_RESOURCE (state) {
      getPageSourceList({
        page: 1,
        size: 1000
      }).then(res => {
        state.commit('SET_PAGE_RESOURCE', res.records);
      }).catch(() => {});
    }
  }
};

export default data;
