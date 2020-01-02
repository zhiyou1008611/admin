<template>
  <div class="content" v-cloak>
    <el-row
      :gutter="30"
      style="background:rgb(14, 129, 196); color: #fff; padding:10px 0px; margin-bottom: 10px;"
    >
      <el-col :span="3" :offset="21" style="text-align: right;">
        <el-button
          type="primary"
          size="small"
          @click="disabled = !disabled"
        >{{disabled ? '上传文章' : '上传视频'}}</el-button>
      </el-col>
    </el-row>

    <!-- 外层盒子 -->
    <div class="addvideo">
      <!-- 这里的标签名称要和main.js文件中定义的组件名称保持一致 -->
      <happy-scroll size="3" resize>
        <!-- 内层盒子——内容区 -->
        <div class="con">
          <div v-if="disabled">
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
              <el-table-column label="文件标题" align="center">
                <template slot-scope="scope">
                  <el-input placeholder="请输入文件标题" v-model="scope.row.name" autocomplete="off"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="UP主" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.Up"
                    @change="changeUp(scope.row)"
                    filterable
                    placeholder="请选择视频Up主"
                  >
                    <el-option
                      v-for="(item,index) in Uplist"
                      :key="index"
                      :label="item.accountName"
                      :value="item.userId"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="标签" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.tags"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择视频标签"
                  >
                    <el-option
                      v-for="item in tagslist"
                      :key="item.value"
                      :label="item.cateName"
                      :value="item.cateName"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="描述" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入描述内容"
                    v-model="scope.row.desc"
                    clearable
                    autocomplete="off"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="是否推荐" width="120" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.recom"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="上传进度" align="center">
                <template slot-scope="scope">
                  <el-progress :percentage="scope.row.percentage"></el-progress>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="resumeUpload(scope.row.key)"
                    type="text"
                    icon="el-icon-video-play"
                    v-if="scope.row.startLoad"
                    style="font-size: 24px;"
                  ></el-button>
                  <el-button
                    @click="pauseUpload(scope.row.key)"
                    type="text"
                    icon="el-icon-video-pause"
                    v-else
                    style="font-size: 24px;"
                  ></el-button>
                  <el-button
                    @click="deleteFile(scope.row.key)"
                    type="text"
                    icon="el-icon-close"
                    style="font-size: 24px;"
                  ></el-button>
                </template>
              </el-table-column>
              <el-table-column type="selection" prop="select" label="全选" width="80" align="center"></el-table-column>
            </el-table>
            <div class="upload">
              <div>
                <div class="filebox">
                  <input
                    type="file"
                    id="fileUpload"
                    @change="fileChange($event)"
                    multiple
                    class="filebtn"
                  />
                  <div class="flletit">选择视频</div>
                </div>
              </div>
              <div class="upload-type" style="text-align: right;">
                <el-button
                  slot="trigger"
                  size="small"
                  type="primary"
                  @click="authUpload"
                  :disabled="uploadDisabled"
                >开始上传</el-button>
                <el-button
                  style="margin-left: 10px;"
                  size="small"
                  type="danger"
                  @click="pauseUploadAll"
                  :disabled="pauseDisabled"
                >暂停</el-button>
                <el-button slot="trigger" size="small" type="primary" @click="delectAll">删除选中项</el-button>
              </div>
            </div>
          </div>
          <div v-else>
            <tinymce-editor></tinymce-editor>
          </div>
        </div>
      </happy-scroll>
    </div>
    <!-- <div class="addvideo" v-if="disabled"></div> -->
  </div>
</template>

<script src="./../assets/js/es6-promise.min.js"></script>
<script src="./../assets/js/aliyun-oss-sdk-5.3.1.min.js"></script>
<script src="./../assets/js/aliyun-upload-sdk-1.5.0.min.js"></script>

<script>
import { ports } from "./api/ports";
import TinymceEditor from "./tinymcs-editor.vue";

export default {
  components: { "tinymce-editor": TinymceEditor },
  data() {
    return {
      adminId: 0, //当前用户ID
      disabled: true, //上传视频/文章
      tagslist: [], //标签
      Uplist: [], //Up主
      inputVisible: false, //点击+标签
      inputValue: "", //新增变迁名
      dialogTableVisible: false, //添加标签弹框
      fileList: [],
      tableData: [],
      multipleSelection: [],
      drag: true,

      file: null,
      uploadDisabled: true,
      pauseDisabled: true,
      uploader: null,
      key: 0
    };
  },
  mounted() {
    this.tagsList();
    this.UPList();
  },
  methods: {
    tagsList() {
      //加载视频标签列表
      ports.get("/vod/tags").then(res => {
        if (res.data.code === 513) {
          return false;
        }
        this.tagslist = res.data.data;
      });
    },
    UPList() {
      //加载视频UP列表
      ports.get("/user/").then(res => {
        if (res.data.code === 513) {
          return false;
        }
        this.Uplist = res.data.data;
      });
    },
    changeUp(val) {
      for (let i = 0; i < this.Uplist.length; i++) {
        if (this.Uplist[i].userId == val.Up) {
          for (let j = 0; j < this.tableData.length; j++) {
            if (this.tableData[j].key == val.key) {
              this.tableData[j].tags = this.Uplist[i].userLabel.split(/,|，/);
              for (let k = j; k < this.tableData.length; k++) {
                this.tableData[k].Up = val.Up;
                this.tableData[k].tags = this.Uplist[i].userLabel.split(/,|，/);
              }
              break;
            }
          }
          break;
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fileChange(e) {
      for (var i = 0; i < e.target.files.length; i++) {
        this.file = e.target.files[i];
        if (!this.file) {
          this.$message.error("请先选择需要上传的文件!");
          return;
        }
        this.key++;
        var userData = '{"Vod":{}}';
        if (this.uploader) {
          this.uploader.stopUpload();
        }
        this.uploader = this.createUploader(this.key);
        this.uploader.addFile(this.file, null, null, null, userData);
        let obj = {};
        obj.startLoad = true;
        obj.name = this.file.name.substr(0, this.file.name.lastIndexOf("."));
        obj.Up = "";
        obj.tags = [];
        obj.desc = "";
        obj.recom = false;
        obj.percentage = 0;
        obj.select = false;
        obj.key = this.key;
        obj.uploader = this.uploader;
        this.tableData.push(obj);
      }
    },
    delectAll() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.tableData.splice(
          this.tableData.indexOf(this.multipleSelection[i]),
          1
        );
      }
    },
    authUpload() {
      //全部开始
      // 然后调用 startUpload 方法, 开始上传
      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i].tags.length == 0 ||
          this.tableData[i].Up.length == 0
        ) {
          this.$message({
            duration: 1100,
            showClose: true,
            message: this.tableData[i].name + "未添加Up主或标签",
            type: "error"
          });
        } else {
          if (this.tableData[i].uploader !== null) {
            this.tableData[i].uploader.startUpload();
            this.uploadDisabled = true;
            this.pauseDisabled = false;
          }
        }
      }
    },
    pauseUploadAll() {
      //全部暂停
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].uploader !== null) {
          this.tableData[i].uploader.stopUpload();
          this.uploadDisabled = false;
          this.pauseDisabled = true;
        }
      }
    },
    // 暂停上传
    pauseUpload(key) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].key == key) {
          this.tableData[i].uploader.stopUpload();
          this.tableData[i].startLoad = true;
          break;
        }
      }
    },
    // 恢复上传
    resumeUpload(key) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].key == key) {
          this.tableData[i].uploader.startUpload();
          this.tableData[i].startLoad = false;
          break;
        }
      }
    },
    //移除
    deleteFile(key) {
      // console.log(key);
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].key == key) {
          this.tableData[i].uploader.deleteFile(i);
          this.tableData.splice(i, 1);
          break;
        }
      }
    },
    createUploader(key) {
      let self = this;
      // eslint-disable-next-line
      let uploader = new AliyunUpload.Vod({
        timeout: 60000,
        partSize: 1048576, //分片大小（配置项 partSize, 默认 1048576）
        parallel: 5,
        retryCount: 3,
        retryDuration: 2,
        region: "cn-shanghai",
        userId: "204031556098105963",
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          self.uploadDisabled = false;
        },
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          if (!uploadInfo.videoId) {
            let params = {};
            let isR = 3;
            params.fileName = uploadInfo.file.name;
            params.size = uploadInfo.file.size;
            for (let i = 0; i < self.tableData.length; i++) {
              if (key == self.tableData[i].key) {
                params.title = self.tableData[i].name;
                params.tags = self.tableData[i].tags.join(",");
                if (self.tableData[i].recom) {
                  isR = 1;
                }
                params.recommendState = isR;
                params.description = self.tableData[i].desc;
                params.userId = self.tableData[i].Up;
                break;
              }
            }
            ports.post("/upload/vodVideo", params).then(res => {
              if (res.data.code == 200) {
                let uploadAuth = res.data.data.uploadAuth;
                let uploadAddress = res.data.data.uploadAddress;
                let videoId = res.data.data.videoId;
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                );
              } else {
                // console.log(res);
                self.$message.error(res.msg);
              }
            });
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证, {
            ports.get("/upload/vodVideo/" + uploadInfo.videoId).then(res => {
              if (res.data.code == 200) {
                let uploadAuth = res.data.data.uploadAuth;
                let uploadAddress = res.data.data.uploadAddress;
                let videoId = res.data.data.videoId;
                uploader.setUploadAuthAndAddress(
                  uploadInfo,
                  uploadAuth,
                  uploadAddress,
                  videoId
                );
              } else {
                self.$message.error(res.msg);
              }
            });
          }
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          self.deleteFile(key);
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          // console.log(uploadInfo, code, message);
          for (let i = 0; i < self.tableData.length; i++) {
            if (self.tableData[i].key == key) {
              self.tableData[i].startLoad = true;
              break;
            }
          }
          self.$message({
            duration: 2000,
            showClose: true,
            message: "文件" + uploadInfo.file.name + "上传失败",
            type: "error"
          });
        },
        // 取消文件上传
        onUploadCanceled: function(uploadInfo, code, message) {
          for (let i = 0; i < self.tableData.length; i++) {
            if (self.tableData[i].key == key) {
              self.tableData[i].startLoad = true;
              break;
            }
          }
          self.$message({
            duration: 2000,
            showClose: true,
            message: "文件" + uploadInfo.file.name + "已暂停上传"
          });
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function(uploadInfo, totalSize, progress) {
          let progressPercent = Math.ceil(progress * 100);
          for (let i = 0; i < self.tableData.length; i++) {
            if (self.tableData[i].key == key) {
              self.tableData[i].startLoad = false;
              self.tableData[i].percentage = progressPercent;
              break;
            }
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          ports.get("/upload/vodVideo/" + uploadInfo.videoId).then(res => {
            // console.log(res);
            if (res.data.code == 200) {
              let uploadAuth = res.data.data.uploadAuth;
              uploader.resumeUploadWithAuth(uploadAuth);
            } else {
              self.$message.error(res.msg);
            }
          });
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          // self.$message({
          //     duration: 1100,
          //     showClose: true,
          //     message: '上传完毕',
          //     type: 'success'
          // });
          console.log("上传完毕");
        }
      });
      return uploader;
    }
  }
};
</script>
<style lang="less">
.addvideo {
  width: 100%;
  height: calc(100% - 65px);
  margin-top: 15px;
  box-sizing: border-box;
  overflow-y: auto;
  background: #fff;
  padding: 15px 0px 15px 15px;
  .happy-scroll {
    .happy-scroll-container .happy-scroll-content {
      width: 100%;
      .con {
        box-sizing: border-box;
        // padding: 5px;
        width: calc(100% - 35px);
      }
    }
  }
}

.el-upload {
  width: 100%;
}

.el-upload-dragger {
  position: initial;
  width: 100%;
}

.upload-type {
  margin: 15px 0;
}

.filebox {
  position: fixed;
  top: 140px;
  width: 90px;
  height: 32px;
  color: #fff;
  font-size: 14px;
  background-color: #17b3a3;
  border-color: #17b3a3;
  border-radius: 3px;
  text-align: center;
  line-height: 32px;
  margin: 0 auto;
}

.filebox .filebtn {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.filebox .flletit {
  width: 100%;
  height: 100%;
}

.filetitle {
  margin: 10px 0;
}

.status span {
  color: #ff4c52;
}
</style>
