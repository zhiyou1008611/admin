<template>
  <div class="content" v-cloak>
    <el-row
      :gutter="30"
      style="background:rgb(14, 129, 196); color: #fff; padding:12px 0px; margin-bottom: 10px;"
    >
      <el-col :span="6">
        <template>
          <span style="width: 90px;">标签查询：</span>
          <el-select
            v-model="checkboxGroupTag"
            reserve-keyword
            filterable
            multiple
            collapse-tags
            placeholder="请选择或输入关键字"
            @change="changetag"
            ref="checkselect"
            size="small"
            style="width: calc(100% - 90px)"
          >
            <el-option
              v-for="item in tagslist"
              :key="item.id"
              :label="item.cateName"
              :value="item.cateName"
            ></el-option>
          </el-select>
        </template>
      </el-col>
      <!-- 日期选择 -->
      <el-col :span="13">
        <div class="grid-content bg-purple">
          <div class="block">
            <span style="width: 90px;">日期查询：</span>
            <el-date-picker
              size="small"
              id="start"
              v-model="startTime"
              align="right"
              type="datetime"
              placeholder="选择日期"
              :picker-options="startDatePicker"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="datechange"
            ></el-date-picker>至
            <el-date-picker
              size="small"
              id="end"
              v-model="endTime"
              align="right"
              type="datetime"
              placeholder="选择日期"
              :picker-options="endDatePicker"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="datechange"
            ></el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <!-- <el-input placeholder="UP主或来源" prefix-icon="el-icon-search" v-model="searchs"
                            @keyup.enter.native="userVodCounts()">
        </el-input>-->
        <el-input
          placeholder="UP主或来源"
          v-model="searchs"
          @keyup.enter.native="userVodCounts()"
          size="small"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="userVodCounts()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="30" style="line-height: 32px;">
      <el-col :span="5" v-for="item in editableTabs" :key="item.id">{{ item.title }}：{{item.item}}</el-col>
      <el-col :span="9" style="text-align: right;">
        <el-button type="primary" size="small" @click="dialogTableVisible = true">表头管理</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogTableVisible" title="表头管理" width="36%">
      <el-table :data="tableHead" size="small" border>
        <el-table-column label="表头名称" width="180">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.label"
              aria-placeholder="name"
              autocomplete="off"
              size="small"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="参数">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.property"
              aria-placeholder="parameter"
              autocomplete="off"
              size="small"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableHead)"
              type="text"
              size="small"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBoxhead">新增表头</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <div class="listTable">
      <template>
        <el-table
          id="targetDom"
          ref="tableData"
          :data="tableData"
          height="100%"
          style="width: 100%; overflow: visible;"
          stripe
          fit
          :summary-method="getSummaries"
          show-summary
          :header-cell-style="{background:'#66b1ff',color:'#fff'}"
          :row-class-name="tableRowClassName"
          v-loading="loading"
        >
          <el-table-column
            v-for="(item,index) in tableHead"
            :key="index"
            :prop="item.property"
            :label="item.label"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip
                :disabled="item.property != 'introduction' || (scope.row[scope.column.property] != undefined ? scope.row[scope.column.property].length < 9 : '' )"
                :content="scope.row[scope.column.property]"
                placement="bottom"
                effect="light"
              >
                <el-button
                  @click="linkClick(item.property, scope.row)"
                  type="text"
                  size="medium"
                  style="color: #606266;"
                >{{scope.row[scope.column.property]}}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>
<script>
import { ports } from "./api/ports";

export default {
  data() {
    return {
      editableTabs: [
        {
          title: "已找到视频数量",
          name: "1",
          item: ""
        },
        {
          title: "已下载视频数量",
          name: "2",
          item: ""
        },
        {
          title: "已上传视频数量",
          name: "3",
          item: ""
        }
      ],
      tagslist: [], //标签选择
      checkboxGroupTag: [], //已选择标签
      startTime: "",
      endTime: "",
      startDatePicker: this.beginDate(), //今天之后的不能选
      endDatePicker: this.processDate(), //只能选大于开始时间小于今天之后的时间
      searchs: "", //搜索
      dialogTableVisible: false, //修改表头对话框
      tableHead: [
        {
          //表头
          label: "来源",
          property: "platform"
        },
        {
          label: "UP主名称",
          property: "accountName"
        },
        {
          label: "UP主标签",
          property: "userLabel"
        },
        {
          label: "简介",
          property: "introduction"
        },
        {
          label: "数量",
          property: "videoCount"
        },
        {
          label: "最后更新时间",
          property: "lastUpdateTime"
        },
        {
          label: "已下载",
          property: "downloadCount"
        },
        {
          label: "下载人员",
          property: "downloader"
        },
        {
          label: "已上传",
          property: "upLoadCount"
        },
        {
          label: "上传人员",
          property: "editor"
        }
      ],
      downloadPageCount: 0, //下载数量
      uploadPageCount: 0, //上传数量
      videoPageCount: 0, //数量
      currentPage: 1,
      pageSize: 12,
      total: 1,
      totalPage: 1,
      tableData: [],
      loading: true
      // tabIndex: 2
    };
  },
  mounted() {
    this.userVodCounts();
    // this.getDataList();
    this.tagsList();

    // 监听表格dom对象的滚动事件
    // let dom = document.querySelector("table");
    let dom = this.$refs.tableData.bodyWrapper;
    let that = this;
    dom.addEventListener("scroll", function() {
      const scrollDistance =
        dom.scrollHeight - dom.scrollTop - dom.clientHeight;
      if (scrollDistance <= 0) {
        //等于0证明已经到底，可以请求接口
        if (that.currentPage < that.totalPage) {
          //当前页数小于总页数就请求
          that.currentPage++; //当前页数自增
          //请求接口的代码
          ports
            .get("/user/infoAndVod", {
              params: {
                pageNum: that.currentPage,
                pageSize: that.pageSize,
                userLabel: that.checkboxGroupTag.join(","),
                start: that.startTime,
                end: that.endTime,
                condition: that.searchs
              }
            })
            .then(res => {
              that.tableData = that.tableData.concat(res.data.data.records);
              //将请求回来的数据和当前展示的数据合并在一起
            });
        }
      }
    });
  },
  methods: {
    beginDate() {
      return {
        disabledDate(time) {
          return time.getTime() > Date.now(); //开始时间不选时，结束时间最大值小于等于当天
        }
      };
    },
    //提出结束时间必须大于提出开始时间
    processDate() {
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
    datechange(index) {
      console.log("datachange" + index);
      this.userVodCounts();
    },
    tagsList() {
      //加载视频标签列表
      ports.get("/vod/tags").then(res => {
        if (res.data.code === 513) {
          return false;
        }
        // console.log("标签：", res);
        this.tagslist = res.data.data;
      });
    },
    changetag(tag) {
      console.log("changetag" + tag);
      this.userVodCounts();
    },
    addBoxhead() {
      //添加表头
      let hea = {
        label: "",
        property: ""
      };
      this.tableHead.push(hea);
    },
    deleteRow(index, rows) {
      //删除表头
      rows.splice(index, 1);
    },
    userVodCounts() {
      this.currentPage = 1;
      this.loading = true;
      ports
        .get("/user/infoAndVod", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            userLabel: this.checkboxGroupTag.join(","),
            start: this.startTime,
            end: this.endTime,
            condition: this.searchs
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.editableTabs[0].item = res.data.data.videoAllCount;
            this.editableTabs[1].item = res.data.data.downloadAllCount;
            this.editableTabs[2].item = res.data.data.uploadAllCount;
            this.tableData = res.data.data.records;
            this.videoPageCount = res.data.data.videoPageCount;
            this.downloadPageCount = res.data.data.downloadPageCount;
            this.uploadPageCount = res.data.data.uploadPageCount;
            this.totalPage = res.data.data.totalPage;
            this.total = res.data.data.totalCount;
          }
          this.loading = false;
        });
    },
    tableRowClassName({
      //斑马条纹
      row,
      rowIndex
    }) {
      if ((rowIndex + 1) % 2 == 0) {
        return "success-row";
      }
      return "";
    },
    getSummaries(param) {
      //计算统计总和
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (column.label == "UP主名称") {
          sums[index] = this.total;
          return;
        }
        if (column.label == "数量") {
          sums[index] = this.videoPageCount;
          return;
        }
        if (column.label == "已上传") {
          sums[index] = this.uploadPageCount;
          return;
        }
        if (column.label == "已下载") {
          sums[index] = this.downloadPageCount;
          return;
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    linkClick(property, rows) {
      console.log(property, rows);
      if (property == "accountName") {
        window.location.href =
          "vods?&userId=" +
          rows.userId +
          "&params=" +
          rows.accountName +
          "&flag=4";
      } else if (property == "platform") {
        window.location.href =
          "vods?&userId=" +
          rows.userId +
          "&params=" +
          rows.accountName +
          "&flag=4";
      } else if (property == "userLabel") {
        // window.location.href = "vods?&userId=" + rows.userId + "&params=" + rows.userLabel + "&flag=6"
        window.location.href =
          "vods?&userId=" +
          rows.userId +
          "&params=" +
          rows.accountName +
          "&flag=4";
      } else {
      }
    }
  }
};
</script>
<style lang="less">
.el-table__footer-wrapper {
  position: absolute;
  bottom: 0px;
}
</style>
