<template>
  <div class="content" v-cloak>
    <el-row
      :gutter="30"
      style="background:rgb(14, 129, 196); color: #fff; height: 52px; padding:10px 0px;"
    ></el-row>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm ruleForm"
    >
      <el-row :gutter="60">
        <el-col :span="8" :offset="4">
          <el-form-item label="名称" prop="name">
            <el-input
              type="text"
              auto-complete="off"
              v-model="ruleForm.name"
              placeholder="Up主名称"
              @keyup.enter.native="enterBlur($event)"
              @blur="queryForm"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标签" prop="classify">
            <el-select
              v-model="ruleForm.classify"
              reserve-keyword
              filterable
              multiple
              allow-create
              default-first-option
              placeholder="请选择或搜索标签"
              @change="changetag"
              ref="checkselect"
            >
              <el-option
                v-for="item in tagslist"
                :key="item.id"
                :label="item.cateName"
                :value="item.cateName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="8" :offset="4">
          <el-form-item label="来源" prop="source">
            <el-select
              v-model="ruleForm.source"
              filterable
              allow-create
              default-first-option
              placeholder="请选择或输入"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="已找到" prop="number">
            <el-input type="text" auto-complete="off" v-model="ruleForm.number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="8" :offset="4">
          <el-form-item label="更新时间" required prop="date">
            <el-date-picker
              type="datetime"
              placeholder="选择日期"
              v-model="ruleForm.date"
              style="width: 100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="已下载" prop="downNumber">
            <el-input type="text" auto-complete="off" v-model="ruleForm.downNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="8" :offset="4">
          <el-form-item label="下载人员" prop="download">
            <el-select v-model="ruleForm.download" placeholder="请选择分类">
              <el-option label="郭如意" value="郭如意"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="剪辑人员" prop="Clips">
            <el-select v-model="ruleForm.Clips" placeholder="请选择来源">
              <el-option label="常华斌" value="常华斌"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="16" :offset="4">
          <el-form-item label="备注" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="16" :offset="4">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" :disabled="disabled">创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { ports } from "./api/ports";
export default {
  data() {
    return {
      adminId: 0, //当前用户ID
      searchs: "",
      tagslist: [],
      disabled: false,
      establish: true,
      options: [
        {
          value: "哔哩哔哩",
          label: "哔哩哔哩"
        },
        {
          value: "优酷",
          label: "优酷"
        },
        {
          value: "爱奇艺",
          label: "爱奇艺"
        },
        {
          value: "腾讯",
          label: "腾讯"
        }
      ],
      ruleForm: {
        id: 0,
        name: "", //名称
        classify: [], //分类
        source: "", //来源
        date: "", //时间
        number: "", //找到的数量
        downNumber: "", //下载的数量
        download: "", //下载人员
        Clips: "", //剪辑人员
        desc: "" //备注
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur"
          }
        ],
        classify: [
          {
            required: true,
            message: "请选择标签",
            trigger: "change"
          }
        ],
        source: [
          {
            required: true,
            message: "请选择来源",
            trigger: "change"
          }
        ],
        number: [
          {
            required: true,
            message: "请填写查找数量",
            trigger: "blur"
          }
        ],
        downNumber: [
          {
            required: true,
            message: "请填写下载数量",
            trigger: "blur"
          }
        ],
        date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        download: [
          {
            required: true,
            message: "请填写下载人员",
            trigger: "blur"
          }
        ],
        Clips: [
          {
            required: true,
            message: "请填写剪辑人员",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.tagsList();
  },
  methods: {
    tagsList() {
      //加载视频标签列表
      ports.get("/vod/tags").then(res => {
        if (res.data.code === 513) {
          return false;
        }
        console.log("标签：", res);
        this.tagslist = res.data.data;
      });
    },
    changetag(tag) {
      console.log("changetag" + tag);
      console.log(this.ruleForm.classify);
    },
    enterBlur(event) {
      event.target.blur();
    },
    queryForm() {
      ports.get("/user/userInfo/" + this.ruleForm.name).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data);
          this.ruleForm.classify = res.data.data.userLabel.split(/,|，/);
          this.ruleForm.source = res.data.data.platform;
          this.ruleForm.date = res.data.data.lastUpdateTime;
          this.ruleForm.number = res.data.data.videoCount;
          this.ruleForm.downNumber = res.data.data.downloadCount;
          this.ruleForm.download = res.data.data.downloader;
          this.ruleForm.Clips = res.data.data.editor;
          this.ruleForm.desc = res.data.data.introduction;
          this.ruleForm.id = res.data.data.id;
          this.establish = false;
        } else {
          this.establish = true;
        }
      });
    },
    submitForm(formName) {
      //提交
      this.disabled = true;
      this.$refs.ruleForm.validate(valid => {
        console.log(this.ruleForm);
        // let tags = this.ruleForm.classify.join(',');
        if (valid) {
          let parameters = {};
          parameters.accountName = this.ruleForm.name;
          parameters.platform = this.ruleForm.source;
          parameters.userLabel = this.ruleForm.classify.join(",");
          parameters.introduction = this.ruleForm.desc;
          parameters.videoCount = this.ruleForm.number;
          parameters.downloadCount = this.ruleForm.downNumber;
          parameters.lastUpdateTime = this.ruleForm.date;
          parameters.downloader = this.ruleForm.download;
          parameters.editor = this.ruleForm.Clips;
          if (this.establish) {
            axios.post("/user/info", parameters).then(res => {
              if (res.data.code == 200) {
                console.log(res);
                this.$message({
                  duration: 1100,
                  showClose: true,
                  message: "成功",
                  type: "success"
                });
                this.$refs[formName].resetFields();
                this.disabled = false;
              } else {
                this.$message({
                  duration: 1100,
                  showClose: true,
                  message: "添加Up主失败",
                  type: "error"
                });
                this.disabled = false;
              }
            });
          } else {
            parameters.id = this.ruleForm.id;
            ports.put("/user/userInfo", parameters).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  duration: 1100,
                  showClose: true,
                  message: "成功",
                  type: "success"
                });
                this.disabled = false;
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  duration: 1100,
                  showClose: true,
                  message: "修改Up主失败",
                  type: "error"
                });
                this.disabled = false;
              }
            });
          }
        } else {
          this.$message({
            duration: 1100,
            showClose: true,
            message: "请详细填写信息",
            type: "warning"
          });
          this.disabled = false;
          return false;
        }
      });
    },
    resetForm(formName) {
      //重置
      this.$refs[formName].resetFields();
      this.disabled = false;
    }
  }
};
</script>
<style lang="less">
.ruleForm {
  position: relative;
  width: 100%;
  height: calc(100% - 65px);
  box-shadow: 0 0 6px #eee;
  background: #fff;
  padding: 100px 15px 0px;
  margin-top: 15px;
  box-sizing: border-box;
}

.el-select {
  width: 100%;
}
</style>