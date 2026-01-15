<template>
  <div class="page-common-nav">
    <div :class="{'nav-item': true, 'active': +item.code <= current}" v-for="item in list" :key="item.code" @click="handleClick(item.code)">{{ item.message }}</div>
  </div>
</template>
<script>
import { getEnum } from '@/api/maintain/sp/serviceProxy/index';

export default {
  name: 'PageCommonNav',
  props: {
    current: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      list: [
        // { name: '接车预检测', id: '100', active: true },
        // { name: '制单中', id: '110' },
        // { name: '待派工', id: '120' },
        // { name: '施工中', id: '140' },
        // { name: '待终检', id: '150' },
        // { name: '待交车', id: '160' },
        // { name: '已交车', id: '180' },
      ]
    };
  },
  created () {
    this.getTabs();
  },
  methods: {
    handleClick (id) {
      // this.$emit('change', id);
    },
    getTabs () {
      getEnum('OrderStatusEnum').then(res => {
        this.list = res.filter(item => +item.code <= 180);
      });
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
  gap: 8px 0;
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
