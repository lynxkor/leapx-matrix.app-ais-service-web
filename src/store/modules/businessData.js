const data = {
  state: {
    areaTree: localStorage.getItem('areaTree') ? JSON.parse(localStorage.getItem('areaTree')) : []
  },
  mutations: {
    SET_AREATREE (state, info) {
      localStorage.setItem('areaTree', JSON.stringify(info));
      state.areaTree = info;
    }
  }
};

export default data;
