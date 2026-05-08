<template>
  <div class="page-common-nav">
    <div :class="{'nav-item': true, 'active': +item.code <= current}" v-for="item in list" :key="item.code" @click="handleClick(item.code)">
      <span class="nav-item-text">{{ item.message }}</span>
      <div class="arrow-shape">
        <div class="arrow-shape-left"></div>
        <div class="arrow-shape-right"></div>
      </div>
    </div>
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
      list: []
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
  padding: 16px 0;
  position: sticky;
  top: 73px;
  z-index: 20;
  background-color: #fff;
  gap: 8px 20px;
  .nav-item {
    height: 32px;
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: var(--leap-color-default-light-1);
    position: relative;
    min-width: 90px;
    .nav-item-text {
      position: relative;
      z-index: 1;
      display: block;
      line-height: 32px;
    }
    .arrow-shape{
      height: 32px;
      background: var(--leap-color-default-light-5);
      position: relative;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      &-left {
        position: absolute;
        left: -10px;
        top: 0;
        width: 0;
        height: 0;
        border-top: 16px solid var(--leap-color-default-light-5);
        border-bottom: 16px solid var(--leap-color-default-light-5);
        border-left: 10px solid transparent;
      }
      &-right {
        position: absolute;
        right: -10px;
        top: 0;
        width: 0;
        height: 0;
        border-top: 16px solid transparent;
        border-bottom: 16px solid transparent;
        border-left: 10px solid var(--leap-color-default-light-5);
      }
    }
    &.active {
      color: var(--leap-color-primary);
      border-color: var(--leap-color-primary-light-9);
      .arrow-shape {
        background: var(--leap-color-primary-light-9);
        &-left {
          border-top: 16px solid var(--leap-color-primary-light-9);
          border-bottom: 16px solid var(--leap-color-primary-light-9);
        }
        &-right {
          border-left: 10px solid var(--leap-color-primary-light-9);
        }
      }
    }
    &:first-child {
      width: 150px;
      .arrow-shape-left {
        left: 0;
      }
    }
  }
}
</style>
