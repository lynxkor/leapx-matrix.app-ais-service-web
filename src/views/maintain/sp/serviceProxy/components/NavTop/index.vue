<template>
  <div class="page-common-nav">
    <div :class="{'nav-item': true, 'active': item.active}" v-for="item in list" :key="item.id" @click="handleClick(item.id)">{{ item.name }}</div>
  </div>
</template>
<script>
export default {
  name: 'PageCommonNav',
  data () {
    return {
      list: [
        { name: '接车预检测', id: '1', active: true },
        { name: '制单中', id: '2' },
        { name: '待派工', id: '3' },
        { name: '施工中', id: '4' },
        { name: '待终检', id: '5' },
        { name: '待交车', id: '6' },
        { name: '已交车', id: '7' },
      ]
    };
  },
  methods: {
    handleClick (id) {
      // this.$emit('change', id);
    }
  }
};
</script>
<style lang="scss" scoped>
.page-common-nav {
  display: flex;
  align-items: center;
  padding-top: 16px;
  position: sticky;
  top: 0px;
  z-index: 10;
  background-color: #fff;
  .nav-item {
    height: 32px;
    line-height: 32px;
    width: 166px;
    text-align: center;
    font-size: 14px;
    color: var(--leap-color-default-light-1);
    background: url(./bg-nav.png) no-repeat center;
    background-size: cover;
    &.active {
      background: url(./bg-nav-active.png) no-repeat center;
      background-size: cover;
      color: var(--leap-color-primary);
    }
    &:first-child {
      width: 150px;
      background-size: auto;
      background-position: right;
    }
  }
}
</style>
