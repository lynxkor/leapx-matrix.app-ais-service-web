<template>
  <!--
    行内容块容器:替代 el-dialog 使用。
    只渲染默认插槽,**不渲染具名插槽 footer** —— 原组件(el-dialog)自带的
    「取消 / 保存」按钮因此不会出现,改由外层弹窗统一提供。
  -->
  <div class="pvs-inline-dialog">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PvsInlineDialog',
  // 不把 title / visible / width 等 el-dialog 的属性透传到 DOM 上
  inheritAttrs: false
};
</script>

<style lang="scss" scoped>
.pvs-inline-dialog {
  width: 100%;
}
</style>
