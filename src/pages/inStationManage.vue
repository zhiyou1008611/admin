<template>
  <div class="content" v-cloak>
    <input type="hidden" ref="adminId" th:value="${session.adminInfo.adminId}" />
    <input type="hidden" ref="adminName" th:value="${session.adminInfo.adminName}" />
    <input type="hidden" ref="adminIcon" th:value="${session.adminInfo.adminIcon}" />
    <el-row
      :gutter="30"
      style="background:rgb(14, 129, 196); color: #fff; padding:15px 0px 0px; margin-bottom: 10px;"
    >
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in titleData"
            :key="index"
            :label="item.label"
            :name="item.name"
          ></el-tab-pane>
        </el-tabs>
      </template>
    </el-row>

    <div class="instation">
      <div style="height: 100%;">
        <ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
          <li
            v-for="(item,index) in tableData"
            :key="index"
            style="padding: 10px 10px 0;"
            :style="index == 0?'border-top:0px' : 'border-top:1px solid #eee'"
          >
            <h2 v-text="item.time"></h2>
            <el-collapse accordion>
              <el-collapse-item v-for="(com,index2) in item.itemData" :key="index2">
                <template slot="title">
                  <el-avatar icon="el-icon-user-solid" size="large" :src="com.userIcon"></el-avatar>
                  <dl>
                    <dt>
                      <em>{{com.userName}}</em>
                      在
                      《{{com.vodTitle}}》
                      中{{com.atUserName != undefined ? '@' + com.atUserName : '评论'}}：
                      {{com.content}}
                      <i
                        class="el-icon-s-comment"
                        style="height: 25px; font-size: 24px; padding: 0px 5px;
                                                        color:#1989fa;"
                      ></i>
                    </dt>
                    <dd>{{com.createTime}}</dd>
                  </dl>
                </template>
                <div style="padding-left: 40px;">
                  <div
                    v-for="(reply,index3) in com.replyList"
                    :key="index3"
                    style="position: relative; min-height: 40px;"
                  >
                    <el-avatar icon="el-icon-user-solid" size="large" :src="reply.userIcon"></el-avatar>
                    <dl style="width: calc(100% - 45px); display: inline-block;">
                      <dt>
                        <em>{{reply.userName}}</em>
                        {{reply.replyContent}}
                      </dt>
                      <dd>{{reply.createTime}}</dd>
                    </dl>
                  </div>
                  <div style="margin-top: 5px;">
                    <el-input
                      type="textarea"
                      placeholder="请输入内容"
                      v-model="com.textareaReply"
                      maxlength="300"
                      show-word-limit
                    ></el-input>
                    <div style="margin: 5px 0;"></div>
                    <el-button
                      type="primary"
                      style="float: right; margin-bottom: 15px;"
                      @click="addReplies(index,index2)"
                      size="mini"
                    >回复</el-button>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </li>
        </ul>
        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>
      </div>
    </div>
  </div>
</template>

<script>
Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
import { ports } from "./api/ports";
export default {
  data() {
    return {
      adminId: 0,
      adminName: "",
      adminIcon: "",
      activeName: "all",
      titleData: [
        {
          label: "全部",
          name: "all"
        },
        {
          label: "@我的",
          name: "1"
        },
        {
          label: "我的评论",
          name: "2"
        },
        {
          label: "回复我的",
          name: "reply"
        },
        {
          label: "系统通知",
          name: "3"
        }
      ],
      tableData: [
        {
          time: "2019-12-10",
          itemData: [
            {
              userName: "张三",
              time: "12:12",
              textarea: "名字不对",
              replyList: [],
              textareaReply: ""
            }
          ]
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false
    };
  },
  mounted() {
    this.adminId = this.$refs.adminId.value; //此用户ID
    // this.adminName = leftNav.$refs.adminName.innerText; //此用户ID
    // this.adminIcon = leftNav.$refs.adminIcon.src; //此用户ID
    this.CommentList();
  },
  computed: {
    noMore() {
      let lengths = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        lengths += this.tableData[i].itemData.length;
      }
      return lengths >= this.total;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    load() {
      this.loading = true;
      setTimeout(() => {
        this.currentPage++; //当前页数自增
        //请求接口的代码
        let url;
        if (this.activeName === "all") {
          url = "/vod/allComments";
        } else if (this.activeName === "reply") {
          url = "/vod/replies";
        } else {
          url = "/vod/stationInfo/" + parseInt(this.activeName);
        }
        let params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize
        };
        ports
          .get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 200) {
              var obj = {
                time: this.tableData[this.tableData.length - 1].time,
                itemData: []
              };
              for (let i = 0; i < res.data.data.records.length; i++) {
                let times = res.data.data.records[i].createTime.split(" ");
                let dataobj = {};
                if (obj.time == times[0]) {
                  this.datalist(dataobj, res.data.data.records[i], times[1]);
                  obj.itemData.push(dataobj);
                } else {
                  if (i > 0) {
                    if (
                      obj.time == this.tableData[this.tableData.length - 1].time
                    ) {
                      this.tableData[
                        this.tableData.length - 1
                      ].itemData = this.tableData[
                        this.tableData.length - 1
                      ].itemData.concat(obj.itemData);
                      obj.itemData = [];
                      obj.time = times[0];
                    } else {
                      var obj2 = obj;
                      obj = {};
                      this.tableData.push(obj2);
                      obj.time = times[0];
                      obj.itemData = [];
                    }
                  } else {
                    obj.time = times[0];
                    obj.itemData = [];
                  }
                  i--;
                }
              }
              this.tableData.push(obj);
            }
            this.loading = false;
          });
      }, 100);
    },
    handleClick(tab, event) {
      this.currentPage = 1;
      // console.log(tab, event);
      this.CommentList();
    },
    CommentList() {
      //加载视频评论列表
      this.loading = true;
      this.total = 0;
      this.tableData = [];
      let url;
      if (this.activeName === "all") {
        url = "/vod/allComments";
      } else if (this.activeName === "reply") {
        url = "/vod/replies";
      } else {
        url = "/vod/stationInfo/" + parseInt(this.activeName);
      }
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      ports
        .get(url, {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            this.total = res.data.data.totalCount;
            let obj = {
              time: "",
              itemData: []
            };
            for (let i = 0; i < res.data.data.records.length; i++) {
              let times = res.data.data.records[i].createTime.split(" ");
              let dataobj = {};
              if (obj.time == times[0]) {
                this.datalist(dataobj, res.data.data.records[i], times[1]);
                obj.itemData.push(dataobj);
              } else {
                if (obj.time != "") {
                  var obj2 = obj;
                  obj = {};
                  this.tableData.push(obj2);
                }
                obj.time = times[0];
                obj.itemData = [];
                i--;
              }
            }
            this.tableData.push(obj);
          }
          this.loading = false;
        });
    },
    datalist(dataobj, res, times) {
      dataobj.userName = res.userName;
      dataobj.content = res.content;
      dataobj.vodTitle = res.vodTitle;
      dataobj.userId = res.userId;
      dataobj.id = res.id;
      dataobj.userIcon = res.userIcon;
      dataobj.createTime = times;
      dataobj.replyList = [];
      dataobj.textareaReply = "";
      if (res.replyList != undefined) {
        dataobj.replyList = res.replyList;
      }
      if (res.atUserName != undefined) {
        dataobj.atUserName = res.atUserName;
        dataobj.atUserId = res.atUserId;
        dataobj.atUserIcon = res.atUserIcon;
      }
      if (res.vodStationComment != undefined) {
        dataobj.vodTitle = res.vodStationComment.vodTitle;
        dataobj.content = res.replyContent;
      }
    },
    addReplies(index, index2) {
      //添加回复信息
      if (this.tableData[index].itemData[index2].textareaReply != "") {
        let parameters = {
          commentId: this.tableData[index].itemData[index2].id,
          userId: this.adminId,
          replyContent: this.tableData[index].itemData[index2].textareaReply
        };
        ports.post("/vod/replies", parameters).then(res => {
          if (res.data.code == 200) {
            let replys = {};
            replys.createTime = new Date().format("yyyy-MM-dd hh:mm:ss");
            replys.replyContent = this.tableData[index].itemData[
              index2
            ].textareaReply;
            replys.userName = this.adminName;
            replys.userIcon = this.adminIcon;
            if (this.tableData[index].itemData[index2].replyList == undefined) {
              this.tableData[index].itemData[index2].replyList = [];
            }
            this.tableData[index].itemData[index2].replyList.push(replys);
            this.tableData[index].itemData[index2].textareaReply = "";
          } else {
            this.$message({
              duration: 1100,
              showClose: true,
              message: "添加回复失败",
              type: "error"
            });
            return false;
          }
        });
      }
    }
  }
};
</script>
<style lang="less">
.content {
  height: 100%;
}
.el-tabs__header {
  margin: 0px;
}

/* 菜单筛选 */
.el-tabs__nav {
  width: 100%;
  height: 35px;
}

.el-tabs__item {
  padding: 0 7%;
  width: 20%;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  height: 20px;
  line-height: 20px;
  border-right: 1px solid #ffffff;
  margin-right: -1px;
}

.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding: 0 7%;
}

.el-tabs--top .el-tabs__item.is-top:last-child {
  padding: 0 7%;
  border-right: 0px;
}

.el-tabs__item:hover {
  color: #fff;
}

.el-tabs__item.is-active {
  color: #fff;
}

.el-tabs__active-bar {
  height: 3px;
  bottom: 2px;
  background-color: #e6a23c;
}

.content .instation {
  position: relative;
  width: 100%;
  height: calc(100% - 65px);
  box-shadow: 0 0 6px #eee;
  background: #fff;
  padding: 15px;
  margin-top: 15px;
  box-sizing: border-box;
  overflow-y: scroll;
}

.content .instation p {
  padding: 40px;
  text-align: center;
  margin: 0;
}

.list {
  padding: 0;
  margin: 0;
  list-style: none;
}

/* 评价列表 */
.el-collapse {
  border-top: none;
}

h2 {
  margin: 10px 0 0;
}

.el-collapse-item__header {
  border-bottom: none;
  padding: 10px 0;
}

/*--  视频信息及管理  --*/
.instation dl {
  width: 100%;
  max-height: 100%;
  margin: 0;
}

.instation dl dt,
.instation dl dd {
  line-height: 25px;
  font-size: 13px;
  padding: 0 10px;
  margin: 0px;
}

.instation dl dt {
  height: 25px;
  font-size: 13px;
  overflow: hidden;
}

.instation dl dt em {
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
  margin-right: 10px;
}

.instation dl dd {
  color: #999;
}

.happy-scroll-container .happy-scroll-content {
  width: calc(100% - 20px);
}
</style>
