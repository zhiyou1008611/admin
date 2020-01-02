<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script>

export default {
  name: "App",
  data() {
    return {
    };
  },
  methods: {}
};
</script>


<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
/*浏览器文本框填写记录背景问题*/
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}
</style>
