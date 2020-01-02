<template>
  <div id="backself" class="backstageLeft_self">
    <input type="hidden" ref="role" th:value="${session.adminInfo.role}" />
    <div id="show_patient" class="admin">
      <img
        alt="用户头像"
        id="patient_userphoto"
        ref="adminIcon"
        th:src="${session.adminInfo.adminIcon}"
        @click="userInfo"
      />
      <dl>
        <dt ref="adminName" th:text="${session.adminInfo.adminName}" @click="userInfo">用户名</dt>
        <dd v-text="username" @click="userInfo"></dd>
        <dd v-if="addshow">
          <el-button
            type="primary"
            size="mini"
            style="width: 100%; border-radius: 0px;"
            icon="el-icon-message-solid"
          >您有新消息</el-button>
        </dd>
      </dl>
    </div>
    <div class="nav" :style="addnew?' height: calc(100% - 300px)' : ' height: calc(100% - 270px)'">
      <el-row class="tac" style="display: none;" :style="loading?'display:flex' : 'display:none'">
        <el-col :span="12" style="width: 100%;">
          <el-menu
            :default-active="listIndex"
            background-color="#193B66"
            text-color="#fff"
            class="el-menu-vertical-demo"
            @select="handleSelect"
          >
            <el-menu-item index="statistics">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="videoManage">
              <template slot="title">
                <i class="el-icon-film"></i>
                <span>视频管理</span>
              </template>
              <el-menu-item index="videoList">视频列表</el-menu-item>
              <el-menu-item index="tagManage">标签管理</el-menu-item>
              <el-menu-item index="templates">制作模板</el-menu-item>
              <el-menu-item index="delvideoList">已删除视频</el-menu-item>
              <el-menu-item index="inStationManage">站内管理</el-menu-item>
              <el-menu-item v-if="addshow" index="addup">添加UP主</el-menu-item>
              <el-menu-item v-if="addshow" index="addvideo">上传视频</el-menu-item>
            </el-submenu>
            <el-tooltip class="item" effect="dark" content="用户分析未实现" placement="right-start">
              <el-menu-item index="userAnalysis">
                <i class="el-icon-s-marketing"></i>
                <span slot="title">用户分析</span>
              </el-menu-item>
            </el-tooltip>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div class="admin_exit">
      <el-button
        size="small"
        @click="exit()"
        round
        style=" width:90px; font-size: 14px; color: #333; border:0;"
      >退出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curkey: "/",
      childPage: 0,
      listIndex: "",
      addshow: true,
      addnew: false,
      username: "超级管理员",
      role: 0,
      loading: true
    };
  },

  props: ["curPage"],
  mounted() {
    // console.log(this.$route);
    this.listIndex = this.$route.name;
    this.role = this.$refs.role.value;
    if (this.role == 2) {
      this.addshow = true;
      this.addnew = true;
      this.username = "管理员";
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      if (key == "videoList") {
        this.$router.push({
          path: "/home/" + key,
          query: {
            flag: 0
          }
        });
      } else {
        this.$router.push({ path: "/home/" + key });
      }
      console.log(key, keyPath);
    },
    userInfo() {
      this.$router.push({ path: "/home/userInfo" });
    },
    exit() {
      sessionStorage.clear();
      this.$router.push({ path: "/login" });
    }
  }
};
</script>


<style scoped lang="less">
/* 左侧样式 */
.backstageLeft_self {
  position: relative;
  width: 180px;
  height: 100%;
  background: #193b66;
  clear: both;
  float: left;
  color: #fff;
  display: block;
  padding: 0;
  margin: 0;
  overflow: hidden;
  .admin {
    padding: 30px 0 0;
    img {
      height: 85px;
      width: 85px;
      display: block;
      margin: 0px auto;
      border-radius: 50%;
      cursor: pointer;
    }
    dl {
      margin-top: 8px;
      dt,
      dd {
        display: block;
        width: 100%;
        line-height: 25px;
        text-align: center;
        margin: auto;
        cursor: pointer;
      }
      dd {
        font-size: 14px;
        margin-bottom: 5px;
      }
    }
  }
  .nav {
    width: 110%;
    overflow-x: hidden;
    ul {
      width: 180px;
      padding: 0 0 0 0;
      margin: 0;
      border-top: 1px solid #3d4f66;
      li {
        border-bottom: 1px solid #3d4f66;
        i {
          color: #fff;
        }
        ul li {
          border-bottom: 0;
        }
      }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 180px;
      min-height: 400px;
    }
  }
  .admin_exit {
    position: absolute;
    left: 0;
    bottom: 30px;
    width: 100%;
    text-align: center;
  }
}

[v-cloak] {
  display: none;
}
</style>
