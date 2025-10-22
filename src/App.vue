<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style lang="scss" scoped>
#app {
  // max-height: 100vh;
}
#app::-webkit-scrollbar{
  width: 0;
  background: #999;
}
#app::-webkit-scrollbar-track{
  width: 0;
  background: #999;
}
#app::-webkit-scrollbar-thumb{
  width: 0;
  background: #999;
}
#app::-webkit-scrollbar-thumb:hover{
  width: 0;
  background: #999;
}
#app::-webkit-scrollbar-corner{
  width: 0;
  background: #999;
}
</style>
