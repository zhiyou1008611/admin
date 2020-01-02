<template>
  <div id="home">
    <header>
      <headers></headers>
    </header>

    <main>
      <aside>
        <leftmenu></leftmenu>
      </aside>
      <router-view />
    </main>
  </div>
</template>


<script>
import headers from "../components/header.vue";
import leftmenu from "../components/leftmenu.vue";

export default {
  name: "App",
  components: { headers, leftmenu },
  data: function() {
    return {
      curPage: 0
    };
  },
  methods: {
    navitemclick(index) {
      this.$data.curPage = index;
    }
  }
};
</script>

<style lang="less">
html,
body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

body {
  overflow-y: hidden;
  background: url(./../assets/img/bj.png) repeat-x;
}

[v-cloak] {
  display: none;
}
#home {
  margin: 0 auto;
  min-width: 1400px;
  width: 90%;
  height: 100%;
  header {
    height: 130px;
    line-height: 130px;
    padding: 0;
  }
  main {
    height: calc(100% - 150px);
    min-height: 650px;
    aside {
      float: left;
      color: #fff;
      background: #193b66;
      width: 180px;
      height: 100%;
    }
    .content {
      position: relative;
      float: left;
      width: calc(100% - 180px);
      height: 100%;
      background-color: #e9eef3;
      color: #333;
      padding: 0 15px 15px;
      box-sizing: border-box;
    }
  }
}
.items {
  margin-right: 40px;
}

.content .listTable {
  position: relative;
  width: 100%;
  height: calc(100% - 110px);
  box-shadow: 0 0 6px #eee;
  background: #fff;
  padding: 15px;
  margin-top: 10px;
  box-sizing: border-box;
}

.el-table .success-row {
  background: #ecf8ff;
}

.el-input__inner {
  height: 36px;
  line-height: 36px;
}

.content .listTable .el-table td,
.content .listTable .el-table th {
  padding: 10px 0;
}

.el-table__body-wrapper {
  height: calc(100% - 40px);
  margin-top: -1px;
  overflow-y: auto;
}
</style>
