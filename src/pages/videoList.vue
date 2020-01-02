<template>
  <div class="content" v-cloak>
    <input type="hidden" ref="role" th:value="${session.adminInfo.role}" />
    <input type="hidden" ref="userId" th:value="${userId}" />
    <input type="hidden" ref="accountName" th:value="${accountName}" />
    <input type="hidden" ref="params" th:value="${params}" />
    <input type="hidden" ref="flag" th:value="${flag}" />
    <input type="hidden" ref="adminId" th:value="${session.adminInfo.adminId}" />
    <input
      type="hidden"
      ref="loginTime"
      th:value="${session.admin.loginTime}==null?null:${#temporals.format(session.admin.loginTime, 'yyyy-MM-dd HH:mm:ss')}"
    />
    <input
      type="hidden"
      ref="lastTime"
      th:value="${#temporals.format(session.admin.lastTime, 'yyyy-MM-dd HH:mm:ss')}"
    />
    <el-row :gutter="30" style="background:#fff; padding:10px 0px; margin-bottom: 10px;">
      <el-col :span="5" style="margin: 0px;">
        <el-button
          class="el-dropdown-link"
          style="width: 100%; padding: 10px 20px;"
          @click.prevent="checkSelect(true)"
          v-if="!tagsShow"
        >按标签筛选</el-button>
        <template v-else>
          <el-select
            v-model="checkboxGroupTag"
            reserve-keyword
            filterable
            multiple
            collapse-tags
            @visible-change="checkSelect"
            placeholder="请选择或输入关键字"
            @change="changetag"
            ref="checkselect"
            style="width: 100%;"
          >
            <el-option
              v-for="tags in tagslist"
              :key="tags.id"
              :label="tags.cateName"
              :value="tags.cateName"
            ></el-option>
          </el-select>
        </template>
      </el-col>
      <el-col :span="5" style="margin: 0px;">
        <el-button
          class="el-dropdown-link"
          style="width: 100%; padding: 10px 20px;"
          @click.prevent="checkSelectUp(true)"
          v-if="!UpShow"
        >按UP主筛选</el-button>
        <template v-else>
          <el-select
            v-model="checkboxGroupUp"
            reserve-keyword
            filterable
            multiple
            collapse-tags
            @visible-change="checkSelectUp"
            placeholder="请选择或输入关键字"
            @change="changeUp"
            ref="selectUp"
            style="width: 100%;"
          >
            <el-option
              v-for="uplist in Uplist"
              :key="uplist.userId"
              :label="uplist.accountName"
              :value="uplist.accountName"
            ></el-option>
          </el-select>
        </template>
      </el-col>
      <!-- 日期选择 -->
      <el-col :span="10" style="margin: 0px;">
        <div class="grid-content bg-purple">
          <div class="block">
            <span style="width: 90px;">日期查询：</span>
            <el-date-picker
              class="time_con"
              id="start"
              v-model="time[0]"
              align="right"
              size="medium"
              type="datetime"
              placeholder="选择日期"
              :picker-options="startDatePicker"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="datechange"
            ></el-date-picker>至
            <el-date-picker
              class="time_con"
              id="end"
              v-model="time[1]"
              align="right"
              size="medium"
              type="datetime"
              placeholder="选择日期"
              :picker-options="endDatePicker"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="datechange"
            ></el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="4" style="margin: 0px;">
        <div class="grid-content bg-purple" style="line-height: 36px; text-align: right;">
          <el-switch
            v-model="read"
            active-color="#13ce66"
            @change="switchchange"
            active-text="包含已阅读"
          ></el-switch>
        </div>
      </el-col>
    </el-row>
    <!-- 所有筛选 -->
    <div class="filtrates">
      所有筛选：
      <el-tag
        v-for="tag in checkboxGroupUp"
        :key="tag.userId"
        closable
        effect="dark"
        style="margin-left: 10px;"
        @close="tagcloseUp(tag)"
      >{{tag}}</el-tag>
      <el-tag
        v-for="tag in checkboxGroupTag"
        :key="tag"
        closable
        effect="dark"
        style="margin-left: 10px;"
        @close="tagclose(tag)"
      >{{tag}}</el-tag>
      <!-- <el-tag
        v-if="time[0]!='' && time[0]!=null"
        closable
        effect="dark"
        style="margin-left: 10px;"
        @close="timeclose(time[0])"
      >{{'开始时间：'+time[0]}}</el-tag>-->
      <el-tag
        v-for="(tag,index) in time"
        :key="tag"
        v-if="tag!='' && tag!=null"
        closable
        effect="dark"
        style="margin-left: 10px;"
        @close="timeclose(tag)"
      >{{index==0 ?'开始时间：'+tag : '结束时间：'+tag}}</el-tag>
      <el-button type="primary" @click="allclose()" size="mini" style="float:right;">清空筛选</el-button>
    </div>
    <!-- 视频列表 -->
    <el-row :gutter="10" style="height: calc(100% - 140px);">
      <el-col
        :span="6"
        v-for="(obj,index) in listData"
        :key="index"
        :id="obj.id"
        v-loading="loading"
      >
        <div class="grid-content bg-purple vodlist_cn">
          <img :src="obj.firstFrameUrl" @click="playVod(index)" />
          <span class="play_img" @click="playVod(index)" icon="el-icon-video-play"></span>
          <el-progress
            :percentage="obj.viewingHours"
            stroke-width="4px"
            style="position: absolute; left: 3%; bottom: 38px; width: 108%; opacity: 0.8;"
          ></el-progress>
          <p class="tags" v-if="obj.tags != undefined">
            <el-tag
              v-for="(tags,index) in obj.tags.split(/,|，/)"
              :key="index"
              type="warning"
              size="small"
              effect="dark"
              style="margin-right: 10px; border-radius: 0px;"
            >{{tags}}</el-tag>
          </p>
          <el-button
            v-if="role&&active==0"
            @click="restoreList(obj.id)"
            type="text"
            size="mini"
            icon="el-icon-refresh-left"
            class="restore"
          ></el-button>
          <dl>
            <dt>
              <el-button
                v-if="role&&active!=0"
                @click="deleteList(obj.id)"
                type="text"
                size="mini"
                icon="el-icon-delete"
                style="float: right; font-size: 18px; color:#999;"
              ></el-button>
              <el-button
                v-if="role&&active==0"
                @click="shiftdeleteList(obj.videoId)"
                type="text"
                size="mini"
                icon="el-icon-delete-solid"
                style="float: right; font-size: 18px; color:#999;"
              ></el-button>
              <el-tooltip
                :disabled="obj.title.length < 23 "
                :content="obj.title"
                placement="bottom"
                effect="light"
              >
                <span>{{obj.title | ellipsis}}</span>
              </el-tooltip>
            </dt>
          </dl>
        </div>
      </el-col>
    </el-row>
    <el-pagination
      :hide-on-single-page="true"
      background
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totle"
      style="position: absolute; right: 20px;"
    ></el-pagination>
    <!-- 播放视频 -->
    <div
      class="play_video"
      v-if="playVideo"
      ref="playVideo"
      style="display: none;"
      :style="playVideo?'display:flex' : 'display:none'"
    >
      <el-container style="width: 90%; height: 90%; margin:0 auto;min-width:1400px;">
        <el-container>
          <!-- 视频框 -->
          <el-main>
            <video
              id="audio"
              ref="audio"
              @loadedmetadata="loadedmetadata()"
              controls
              style="max-height:740px; height: 100%; max-width: 1300px;"
            >
              <source :src="listData[this.playIndex].videoAddress" type="video/mp4" />
            </video>
            <el-button
              icon="el-icon-arrow-left"
              type="info"
              circle
              @click="switchTop"
              style="left: 30px;"
            ></el-button>
            <el-button
              icon="el-icon-arrow-right"
              type="info"
              circle
              @click="switchDown"
              style="right: 30px;"
            ></el-button>
          </el-main>
          <!-- 评论 -->
          <el-aside width="400px" style="overflow:visible; background: #f6f9fc; height: auto;">
            <div
              class="grid-content"
              style="height: 100%; box-sizing: border-box; padding: 5px 10px;"
            >
              <h2 style="color: #555; margin: 15px 0px 0px;">评论</h2>
              <!-- 评论列表 -->
              <template>
                <div class="infinite-list-wrapper" style="overflow: hidden;">
                  <div style="width: 103%; height: 100%; overflow-x: hidden;">
                    <ul class="list">
                      <li v-for="(com,index) in comments" :key="index" class="list-item">
                        <el-avatar
                          icon="el-icon-user-solid"
                          :src="com.userIcon"
                          style="position: absolute; width: 35px; height: 35px;"
                        ></el-avatar>
                        <dl>
                          <dt>
                            {{com.userName}}
                            <em>{{com.createTime}}</em>
                          </dt>
                          <dd>
                            <div>{{com.content}}</div>
                            <div
                              v-for="(reply,index) in com.replyList"
                              :key="index"
                              style="position: relative; min-height: 40px;"
                            >
                              <el-avatar
                                icon="el-icon-user-solid"
                                :src="reply.userIcon"
                                style="position: absolute; width: 30px; height: 30px;"
                              ></el-avatar>
                              <dl>
                                <dt>
                                  {{reply.userName}}
                                  <em>{{reply.createTime}}</em>
                                </dt>
                                <dd>{{reply.replyContent}}</dd>
                              </dl>
                            </div>
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="点我回复信息"
                              placement="top-start"
                              style="position: relative; float: right; margin-top: -18px;"
                            >
                              <el-button
                                type="text"
                                size="mini"
                                icon="el-icon-chat-dot-square"
                                style="height: 15px; font-size: 17px; padding: 0px 5px;"
                                @click="ReplyShow(index)"
                              ></el-button>
                            </el-tooltip>
                            <div v-if="textShow[index].show" style="margin-top: 5px;">
                              <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="textareaReply"
                                maxlength="300"
                                show-word-limit
                              ></el-input>
                              <div style="margin: 5px 0;"></div>
                              <el-button
                                type="primary"
                                size="mini"
                                style="float: right;"
                                @click="addReplies(index)"
                              >回复</el-button>
                            </div>
                          </dd>
                        </dl>
                      </li>
                    </ul>
                    <!-- <p v-if="loading">加载中...</p> -->
                  </div>
                </div>
                <div
                  style="position: absolute; left: 0px; bottom: 0px; width: 100%; box-sizing: border-box; padding: 20px;"
                >
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="textarea"
                    maxlength="300"
                    show-word-limit
                    style="font-size: 12px;"
                  ></el-input>
                  <div style="margin: 10px 0;"></div>
                  <el-dropdown size="mini" trigger="click">
                    <el-button type="text" style="padding: 2px;" @click="consumes">@</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(item,index) in optionslist"
                        :key="index"
                        @click.native="pitchon(item)"
                      >{{item.adminName}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button type="primary" size="mini" style="float: right;" @click="addComment">发表</el-button>
                </div>
              </template>
              <el-button
                type="text"
                icon="el-icon-circle-close"
                style="position: absolute; top: -40px; right: -40px; color: #fff; font-size: 30px; padding: 5px;"
                @click="cloneVideo(listData[playIndex])"
              ></el-button>
            </div>
          </el-aside>
        </el-container>
        <el-footer>
          <el-col :span="24">
            <el-input
              v-if="inputTitle"
              v-model="listData[playIndex].title"
              size="small"
              ref="titleInput"
              placeholder="请输入内容"
              @keyup.enter.native="handletitle"
              class="titleInput"
            ></el-input>
            <p
              style="margin: 0px 0 10px; line-height: 32px; cursor: pointer;"
              v-else
              @click="showInputTitle"
            >{{listData[playIndex].title}}</p>
            <div>
              <el-tag
                v-for="(tags,index) in videotags"
                :key="index"
                type="warning"
                closable
                @close="handleClose(tags)"
                effect="dark"
                style="margin-right: 15px;"
              >{{tags}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
            </div>
          </el-col>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
<script>
import { ports } from "./api/ports";

export default {
  data() {
    return {
      playVideo: false, //视频播放框
      role: false,
      adminId: 0, //当前用户ID
      params: "", //首页穿的参数
      flags: 0,
      userId: 0,
      active: 1,
      currentPage: 1,
      pageSize: 12,
      totle: 0,
      totalPage: 0,
      activeName: "first",
      editableTabsValue: "1",
      dialogFormVisible: false,

      tagsShow: false,
      tagslist: [],
      UpShow: false,
      Uplist: [],

      read: true, //是否已阅读
      time: ["", ""],
      startDatePicker: this.beginDate(), //今天之后的不能选
      endDatePicker: this.processDate(), //只能选大于开始时间小于今天之后的时间

      checkboxGroupTag: [], //已选择标签
      checkboxGroupUp: [],
      checkAll: false,
      isIndeterminate: true,
      listData: [], //视频列表
      inputTitle: false, //修改标题
      originalTitle: "", //原标题
      videotags: [], //标签
      inputVisible: false,
      inputValue: "",
      playIndex: 0, //播放视频的索引
      currentTime: 0, //播放时间
      // videoSrc: "", //播放视频地址
      // count: 0,
      loading: false,
      comments: [], //评论列表
      textShow: [], //隐藏回复框
      textarea: "", //评论内容
      textareaReply: "", //回复评论
      optionslist: [], //@列表
      duifangId: "", //@评论用
      loading: true,

      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value1: []
    };
  },
  // computed: {
  //   activeTime() {
  //     return this.time.filter(function(time) {
  //       return time;
  //     });
  //   }
  // },
  mounted() {
    this.loading = true;
    // this.UPList();
    // this.tagsList();
    if (this.$refs.role.value == 1) {
      this.role = true;
    }
    this.flags = this.$refs.flag.value;
    this.adminId = this.$refs.adminId.value; //此用户ID
    this.userId = this.$refs.userId.value; //查询用户ID
    this.params = this.$refs.params.value; //查询用户传参
    if (this.flags == 2) {
      //新增视频参数
      this.time[0] = this.$refs.loginTime.value;
      this.time[1] = this.$refs.lastTime.value;
      if (this.$refs.userId.value != "") {
        this.checkboxGroupUp.push(this.params);
      }
    } else if (this.flags == 3) {
      //未读视频参数
      this.read = false;
      if (this.$refs.userId.value != "") {
        this.checkboxGroupUp.push(this.params);
      }
    } else if (this.flags == 0) {
      //全部视频参数
    } else if (this.flags == 99) {
      //已删除视频参数
      this.active = 0;
    } else if (this.flags == 4) {
      //新增UP主视频参数
      this.checkboxGroupUp.push(this.params);
    } else if (this.flags == 5) {
      this.checkboxGroupUp.push(this.params);
    } else if (this.flags == 6) {
      //标签查询
      this.checkboxGroupTag = this.params.split(/,|，/);
      this.checkboxGroupUp.push(this.$refs.accountName.value);
    }
    setTimeout(() => {
      // this.getSelectDataList();
    }, 200);
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 23) {
        return value.slice(0, 23) + " ...";
      }
      return value;
    }
  },
  methods: {
    tagsList() {
      //加载视频标签列表
      ports.get("/vod/tags").then(res => {
        if (res.data.code == 200) {
          this.tagslist = res.data.data;
        }
      });
    },
    UPList() {
      //加载视频UP列表
      ports.get("/user/").then(res => {
        if (res.data.code == 200) {
          let list = res.data.data;
          for (let i = 0; i < list.length; i++) {
            delete list[i].userLabel;
          }
          this.Uplist = list;
        }
      });
    },
    getSelectDataList() {
      //加载视频列表
      this.loading = true;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      // params.userName = this.checkboxGroupUp.join(",");
      let useridlist = [];
      for (let i = 0; i < this.checkboxGroupUp.length; i++) {
        for (let j = 0; j < this.Uplist.length; j++) {
          if (this.checkboxGroupUp[i] === this.Uplist[j].accountName) {
            useridlist.push(this.Uplist[j].userId);
            break;
          }
        }
      }
      params.userId = useridlist.join(",");
      params.tags = this.checkboxGroupTag.join(",");
      params.start = this.time[0];
      params.end = this.time[1];
      if (this.read == true) {
        params.play = 1;
      } else {
        params.play = 0;
      }
      params.active = this.active;
      ports
        .get("/vod/vodVideos", {
          params: params
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            this.listData = res.data.data.records;
            this.totle = res.data.data.totalCount;
            this.totalPage = res.data.data.totalPage;
            this.loading = false;
          } else {
            this.listData = [];
            this.totle = 0;
            this.totalPage = 0;
            this.loading = false;
            return false;
          }
        });
    },
    deleteList(id) {
      //删除视频
      ports
        .delete("/vod/videos", {
          params: {
            ids: id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              duration: 1100,
              showClose: true,
              message: "删除成功",
              type: "success"
            });
            this.getSelectDataList();
          } else {
            this.$message({
              duration: 1400,
              showClose: true,
              message: "删除视频失败",
              type: "error"
            });
          }
        });
    },
    shiftdeleteList(id) {
      //彻底删除视频
      ports.delete("/vod/video/" + id).then(res => {
        if (res.data.code == 200) {
          this.$message({
            duration: 1100,
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getSelectDataList();
        } else {
          this.$message({
            duration: 1400,
            showClose: true,
            message: "删除失败",
            type: "error"
          });
        }
      });
    },
    restoreList(id) {
      //还原视频
      ports.put("/vod/video/" + id).then(res => {
        if (res.data.code == 200) {
          this.$message({
            duration: 1100,
            showClose: true,
            message: "还原成功",
            type: "success"
          });
          this.getSelectDataList();
        } else {
          this.$message({
            duration: 1400,
            showClose: true,
            message: "还原视频失败",
            type: "error"
          });
        }
      });
    },
    datechange(value) {
      //改变时间触发
      this.currentPage = 1;
      // this.getSelectDataList();
    },
    switchchange() {
      //开关触发 是否已阅读
      this.currentPage = 1;
      this.getSelectDataList();
    },
    beginDate() {
      //开始时间不能大于今天
      return {
        disabledDate(time) {
          return time.getTime() > Date.now(); //开始时间不选时，结束时间最大值小于等于当天
        }
      };
    },
    processDate() {
      //提出结束时间必须大于提出开始时间
      let self = this;
      return {
        disabledDate(time) {
          if (self.value2) {
            return (
              new Date(self.value2).getTime() > time.getTime() ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now(); //开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    allclose() {
      //清除筛选标签触发
      this.currentPage = 1;
      this.checkboxGroupTag = [];
      this.checkboxGroupUp = [];
      this.time = ["", ""];
      this.getSelectDataList();
    },
    tagclose(teg) {
      //关闭标签筛选按钮
      this.currentPage = 1;
      this.checkboxGroupTag.splice(this.checkboxGroupTag.indexOf(teg), 1);
      this.getSelectDataList();
    },
    tagcloseUp(teg) {
      //关闭UP筛选按钮
      this.currentPage = 1;
      this.checkboxGroupUp.splice(this.checkboxGroupUp.indexOf(teg), 1);
      this.getSelectDataList();
    },
    timeclose(time) {
      //清除时间
      this.currentPage = 1;
      this.time[this.time.indexOf(time)] = "";
      console.log(this.time);
      // this.getSelectDataList();
    },
    changetag(tag) {
      //改变标签
      this.currentPage = 1;
      this.getSelectDataList();
    },
    changeUp(up) {
      //改变Up主
      this.currentPage = 1;
      this.getSelectDataList();
    },
    checkSelect(index) {
      //条件查询  标签筛选
      this.tagsShow = index;
      if (index == true) {
        this.$nextTick(_ => {
          this.$refs.checkselect.$refs.input.focus();
        });
      }
    },
    checkSelectUp(index) {
      //条件查询  up主筛选
      this.UpShow = index;
      if (index == true) {
        this.$nextTick(_ => {
          this.$refs.selectUp.$refs.input.focus();
        });
      }
    },
    CommentList() {
      //加载视频评论列表
      this.comments = [];
      ports
        .get("/vod/comments/" + this.listData[this.playIndex].id)
        .then(res => {
          if (res.data.code == 200) {
            this.comments = res.data.data;
            this.textShow = [];
            for (let i = 0; i < this.comments.length; i++) {
              let obj = {
                show: false
              };
              this.textShow.push(obj);
            }
          }
        });
    },
    consumes() {
      //@
      ports.get("/admin/userInfo/").then(res => {
        if (res.data.code == 200) {
          let arr = [];
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].adminId != this.adminId) {
              arr.push(res.data.data[i]);
            }
          }
          this.optionslist = arr;
        } else {
          this.$message({
            duration: 1400,
            showClose: true,
            message: "@ 管理员失败",
            type: "error"
          });
        }
      });
    },
    pitchon(obj) {
      //@选中
      this.duifangId = obj.adminId;
      this.textarea += " @ " + obj.adminName + "  ";
    },
    addComment() {
      //添加视频评论
      if (this.textarea != "") {
        let parameters = {
          vodId: this.listData[this.playIndex].id,
          vodTitle: this.listData[this.playIndex].title,
          userId: this.adminId,
          content: this.textarea
        };
        if (this.textarea.indexOf("@") != -1) {
          parameters.atUserId = this.duifangId;
        }
        ports.post("/vod/comments", parameters).then(res => {
          if (res.data.code == 200) {
            this.CommentList();
            this.textarea = "";
          } else {
            this.$message({
              duration: 1100,
              showClose: true,
              message: "添加评论失败",
              type: "error"
            });
            return false;
          }
        });
      }
    },
    ReplyShow(index) {
      //点击回复
      for (let i = 0; i < this.textShow.length; i++) {
        if (i != index) {
          this.textShow[i].show = false;
        }
      }
      this.textShow[index].show = !this.textShow[index].show;
    },
    addReplies(index) {
      //添加回复信息
      if (this.textareaReply != "") {
        let parameters = {
          commentId: this.comments[index].id,
          userId: this.adminId,
          replyContent: this.textareaReply
        };
        ports.post("/vod/replies", parameters).then(res => {
          if (res.data.code == 200) {
            this.CommentList();
            this.textareaReply = "";
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
        this.textShow[index].show = false;
      }
    },
    handleCurrentChange(val) {
      //翻页时触发事件
      this.currentPage = val;
      this.getSelectDataList();
    },
    playVod(index) {
      //点击播放视频 从上次结束开始播放
      this.playIndex = index;
      this.playVideo = true;
      if (this.listData[this.playIndex].tags != undefined) {
        this.videotags = this.listData[this.playIndex].tags.split(/,|，/);
      }
      this.originalTitle = this.listData[this.playIndex].title;
      this.CommentList();
      this.$refs.audio.load();
    },
    cloneVideo(videoAddress) {
      //关闭视频 判断 保存播放进度
      this.playVideo = false;
      if (
        this.$refs.audio.currentTime != 0 &&
        this.$refs.audio.currentTime !=
          (this.listData[this.playIndex].viewingHours *
            this.$refs.audio.duration) /
            100
      ) {
        let currentdata =
          (100 * this.$refs.audio.currentTime) / this.$refs.audio.duration;
        ports.put("/vod/" + videoAddress.id + "/" + currentdata).then(res => {
          this.listData[this.playIndex].viewingHours = currentdata;
        });
      }
    },
    loadedmetadata() {
      //视频加载完毕
      // this.currentTime = this.listData[this.playIndex].viewingHours * this.$refs.audio.duration / 100;
      this.$refs.audio.currentTime =
        (this.listData[this.playIndex].viewingHours *
          this.$refs.audio.duration) /
        100;
    },
    switchTop() {
      //上一个视频
      if (this.currentPage > 1) {
        if (
          this.$refs.audio.currentTime != 0 &&
          this.$refs.audio.currentTime !=
            (this.listData[this.playIndex].viewingHours *
              this.$refs.audio.duration) /
              100
        ) {
          let currentdata =
            (100 * this.$refs.audio.currentTime) / this.$refs.audio.duration;
          ports
            .put("/vod/" + this.listData[this.playIndex].id + "/" + currentdata)
            .then(res => {
              this.listData[this.playIndex].viewingHours = currentdata;
              if (this.playIndex == 0) {
                this.currentPage--;
                this.getSelectDataList();
                this.playIndex = this.pageSize - 1;
              } else {
                this.playIndex--;
              }
              this.playVod(this.playIndex);
            });
        } else {
          if (this.playIndex == 0) {
            this.currentPage--;
            this.getSelectDataList();
            this.playIndex = this.pageSize - 1;
          } else {
            this.playIndex--;
          }
          this.playVod(this.playIndex);
        }
      } else {
        if (this.playIndex > 0) {
          if (
            this.$refs.audio.currentTime != 0 &&
            this.$refs.audio.currentTime !=
              (this.listData[this.playIndex].viewingHours *
                this.$refs.audio.duration) /
                100
          ) {
            let currentdata =
              (100 * this.$refs.audio.currentTime) / this.$refs.audio.duration;
            ports
              .put(
                "/vod/" + this.listData[this.playIndex].id + "/" + currentdata
              )
              .then(res => {
                this.listData[this.playIndex].viewingHours = currentdata;
                this.playIndex--;
                this.playVod(this.playIndex);
              });
          } else {
            this.playIndex--;
            this.playVod(this.playIndex);
          }
        } else {
          this.$message({
            duration: 1100,
            showClose: true,
            message: "已经是第一条视频了",
            type: "warning"
          });
        }
      }
    },
    switchDown() {
      //下一个视频
      if (this.currentPage < this.totalPage) {
        if (
          this.$refs.audio.currentTime != 0 &&
          this.$refs.audio.currentTime !=
            (this.listData[this.playIndex].viewingHours *
              this.$refs.audio.duration) /
              100
        ) {
          let currentdata =
            (100 * this.$refs.audio.currentTime) / this.$refs.audio.duration;
          ports
            .put("/vod/" + this.listData[this.playIndex].id + "/" + currentdata)
            .then(res => {
              this.listData[this.playIndex].viewingHours = currentdata;
              if (this.playIndex == this.pageSize - 1) {
                this.currentPage++;
                let self = this;
                this.getSelectDataList();
                setTimeout(() => {
                  this.playIndex = 0;
                  this.playVod(this.playIndex);
                }, 300);
              } else {
                this.playIndex++;
                this.playVod(this.playIndex);
              }
            });
        } else {
          if (this.playIndex == this.pageSize - 1) {
            this.currentPage++;
            let self = this;
            this.getSelectDataList();
            setTimeout(() => {
              this.playIndex = 0;
              this.playVod(this.playIndex);
            }, 300);
          } else {
            this.playIndex++;
            this.playVod(this.playIndex);
          }
        }
      } else {
        if (this.playIndex + 1 < this.totle % this.pageSize) {
          if (
            this.$refs.audio.currentTime != 0 &&
            this.$refs.audio.currentTime !=
              (this.listData[this.playIndex].viewingHours *
                this.$refs.audio.duration) /
                100
          ) {
            let currentdata =
              (100 * this.$refs.audio.currentTime) / this.$refs.audio.duration;
            ports
              .put(
                "/vod/" + this.listData[this.playIndex].id + "/" + currentdata
              )
              .then(res => {
                this.listData[this.playIndex].viewingHours = currentdata;
                this.playIndex++;
                this.playVod(this.playIndex);
              });
          } else {
            this.playIndex++;
            this.playVod(this.playIndex);
          }
        } else {
          this.$message({
            duration: 1100,
            showClose: true,
            message: "已经是最后一条视频了",
            type: "warning"
          });
        }
      }
    },
    handleClose(tag) {
      //删除标签
      this.videotags.splice(this.videotags.indexOf(tag), 1);
      let uptags = this.videotags.join(",");
      ports
        .put("/vod/tags/" + this.listData[this.playIndex].id, {
          userId: this.adminId,
          tags: this.listData[this.playIndex].tags,
          newTags: uptags,
          vodTitle: this.originalTitle
        })
        .then(res => {
          if (res.data.code == 200) {
            this.listData[this.playIndex].tags = uptags;
          } else {
            this.$message({
              duration: 1100,
              showClose: true,
              message: "删除标签失败",
              type: "error"
            });
          }
        });
    },
    showInput() {
      //点击添加标签
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      //添加标签
      let inputValue = this.inputValue;
      if (inputValue) {
        this.videotags.push(inputValue);
        let uptags = this.videotags.join(",");
        ports
          .put("/vod/tags/" + this.listData[this.playIndex].id, {
            userId: this.adminId,
            tags: this.listData[this.playIndex].tags,
            newTags: uptags,
            vodTitle: this.originalTitle
          })
          .then(res => {
            if (res.data.code == 200) {
              this.listData[this.playIndex].tags = uptags;
            } else {
              this.$message({
                duration: 1100,
                showClose: true,
                message: "添加标签失败",
                type: "error"
              });
            }
          });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    showInputTitle() {
      //点击标题修改
      this.inputTitle = true;
      this.$nextTick(_ => {
        this.$refs.titleInput.$refs.input.focus();
      });
    },
    handletitle() {
      //修改标题
      ports
        .put("/vod/title/" + this.listData[this.playIndex].id, {
          userId: this.adminId,
          vodTitle: this.originalTitle,
          newTitle: this.listData[this.playIndex].title
        })
        .then(res => {
          if (res.data.code == 200) {
            this.originalTitle = this.listData[this.playIndex].title;
            this.inputTitle = false;
          } else {
            this.$message({
              duration: 1100,
              showClose: true,
              message: "修改标题失败",
              type: "error"
            });
          }
        });
    }
  }
};
</script>
<style lang="less">
.content {
  .el-input__icon {
    width: auto;
  }
  .el-col {
    margin-bottom: 10px;
    height: 32%;
    .el-date-editor.el-input {
      width: 180px;
      .el-input__inner {
        height: 36px;
        line-height: 36px;
        padding: 0px 22px;
      }
    }
  }
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  /* background: #d3dce6; */
}

.bg-purple-light {
  background: #e5e9f2;
}

/* 标签筛选是隐藏框中选中的标签 */
.el-select__tags span {
  display: none;
}

/* 评价区 */
.grid-content {
  position: relative;
  border-radius: 3px;
  min-height: 36px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
  div dl {
    position: relative;
    left: 40px;
    display: inline-block;
    width: calc(100% - 45px);
    color: #555;
    padding-left: 5px;
    margin: 0px;
    dt {
      font-size: 14px;
      line-height: 25px;
      em {
        font-size: 10px;
        color: #999;
        padding-left: 6px;
      }
    }
    dd {
      font-size: 12px;
      color: #999;
      line-height: 15px;
      padding: 0px 15px 0 0;
      margin: 0px;
    }
  }

  .el-textarea__inner {
    font-size: 12px;
    height: 50px;
    padding: 5px;
  }

  .list-item {
    position: relative;
  }

  .row-bg {
    padding: 10px 0;
  }

  .el-checkbox-button:first-child .el-checkbox-button__inner {
    border-radius: 30px;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    -ms-border-radius: 30px;
    -o-border-radius: 30px;
  }

  .el-checkbox-button__inner {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #555555;
    padding: 10px 0px;
    border: 1px solid #dcdfe6;
    border-radius: 30px;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    -ms-border-radius: 30px;
    -o-border-radius: 30px;
  }

  .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 30px;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    -ms-border-radius: 30px;
    -o-border-radius: 30px;
  }

  /* 筛选查找 */
  .vmenu {
    line-height: 30px;
    box-sizing: border-box;
    padding: 5px 20px;
  }

  /* 所有筛选 */
  .filtrates {
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
  }

  /*--  视频列表  --*/
  .vodlist_cn {
    position: relative;
    height: calc(100% - 35px);
    min-height: 100px;
    box-shadow: 0px 0px 8px #bbb;
    background: #f2f2f2;
    padding-bottom: 35px;
    overflow: hidden;
    :hover {
      box-shadow: 0px 0px 10px #666;
    }
    /*--  视频缩略图  --*/
    img {
      display: block;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    .tags {
      position: absolute;
      top: 0px;
      left: 0px;
      margin: 0px;
    }
    /*--  播放按钮  --*/
    span.play_img {
      position: absolute;
      top: 0px;
      /* z-index: 5; */
      width: 100%;
      height: calc(100% - 40px);
      color: #fff;
      font-size: 30px;
      opacity: 0;
      background-size: 100px;
      cursor: pointer;
      :hover {
        background: rgba(1, 1, 1, 0.2);
        opacity: 1;
        background-size: 100px;
      }
    }
    /*--  视频信息及管理  --*/
    dl {
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      max-height: 100%;
      margin: 0;
      dt,
      dd {
        line-height: 35px;
        font-size: 13px;
        padding: 0 10px;
        margin: 0px;
      }
      dt {
        height: 35px;
        overflow: hidden;
      }
    }
    .play_video {
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 99;
      width: 100%;
      height: 100%;
      color: #fff;
      box-sizing: border-box;
      padding: 80px 120px 50px;
      background-color: rgba(0, 0, 0, 0.7);
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flex;
      display: -o-flex;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .el-progress__text {
    display: none;
  }

  .restore {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 22px;
    padding: 0px;
    [class^="el-icon-"] {
      font-weight: bold;
      transform: rotate(-50deg);
      -webkit-transform: rotate(-50deg);
      -moz-transform: rotate(-50deg);
      -ms-transform: rotate(-50deg);
      -o-transform: rotate(-50deg);
    }
  }

  .colordisplay {
    display: block;
  }

  .el-main,
  .el-footer {
    padding: 0px;
  }

  .el-main {
    position: relative;
    min-width: 74%;
    /* width: fit-content; */
    height: 100%;
    flex: none;
    text-align: center;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 1);
  }

  .el-main .el-button {
    display: none;
    position: absolute;
    top: calc(50% - 30px);
  }

  .el-main:hover .el-button {
    display: block;
  }

  .infinite-list-wrapper {
    display: block;
    height: 100%;
    max-height: calc(100% - 170px);
    overflow: hidden;
  }

  .list {
    list-style: none;
    padding: 0px;
    li {
      margin-bottom: 10px;
    }
  }

  .infinite-list-wrapper p {
    color: #555;
    text-align: center;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .titleInput .el-input__inner {
    width: 70%;
    color: #fff;
    border: 0px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 0px 0px 10px;
  }
}
</style>
