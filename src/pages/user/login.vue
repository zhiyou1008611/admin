<template>
  <div style="height:100%">
    <div class="header">
      <div class="logo">
        <a href="javascript:">
          <img src="./../../assets/logo.png" />
        </a>
      </div>
    </div>
    <div class="login-container">
      <div class="bg_img"></div>
      <div class="bg_color"></div>
      <el-form
        :model="ruleForm"
        :rules="rules2"
        status-icon
        ref="ruleForm"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-page"
      >
        <h3 class="title">系统登录</h3>
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="loginpic">
        <img src="./../../assets/img/loginpic.png" />
      </div>
    </div>
    <div class="footer">
      Copyright (C) All Rughts Reserved
      <br />北京颐何健康管理有限公司
    </div>
  </div>
</template>
<script>
import { user } from "./../api/user";
// import store from "./../../store";
import registmodal from "./regist";

export default {
  components: { registmodal },
  data() {
    return {
      logining: false,
      ruleForm: {
        username: "",
        password: ""
      },
      rules2: {
        username: [
          {
            required: true,
            message: "请输入您的账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "输入您的密码",
            trigger: "blur"
          }
        ]
      },
      checked: false
    };
  },
  methods: {
    handleSubmit(event) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.logining = true;
          user
            .login({
              params: {
                account: this.ruleForm.username,
                adminPassword: this.ruleForm.password
              }
            })
            .then(res => {
              console.log(res);
              // this.$store.dispatch("UserLogin", res.data.token);
              if (res.code == 200) {
                this.logining = false;
                // let userinfo = user.getuserinfo(res.data);
                // console.log(userinfo);
                // this.$store.dispatch("USERINFO", userinfo);
                this.$router.push({ path: "/home/statistics" });
                // this.$router.push({ path: "/newView/" + row.id });
                // window.location.href = "index?adminId=" + res.data.data;
              } else {
                this.$message({
                  duration: 2000,
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
                this.logining = false;
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
}

.header {
  position: relative;
  width: 100%;
  height: 14%;
  min-height: 120px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 1);
  padding: 0 15%;
}

.login-container {
  position: relative;
  width: 100%;
  height: 72%;
}

.logo {
  width: 150px;
  img {
    display: block;
    width: 100%;
  }
}
.bg_img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: url(./../../assets/img/bg.png) no-repeat;
  background-size: 100%;
  opacity: 0.5;
}

.bg_color {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: #145c83;
  opacity: 0.3;
}

.login-page {
  position: absolute;
  right: 20%;
  z-index: 9;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 20px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 40px #666;
}

label.el-checkbox.rememberme {
  margin: 0 0 20px;
  text-align: left;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

/* 人物图 */
.loginpic {
  position: absolute;
  top: 2%;
  left: 13%;
  z-index: 5;
  width: 40%;
  img {
    display: block;
    width: 100%;
    min-width: 600px;
    opacity: 0.8;
  }
}

.footer {
  position: relative;
  width: 100%;
  line-height: 30px;
  text-align: center;
  margin-top: 40px;
}
</style>
