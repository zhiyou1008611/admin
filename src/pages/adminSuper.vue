<template>
  <div class="content" v-cloak>
    <div style="border-bottom: 1px solid #e2e2e2; padding: 10px 0; margin-bottom: 10px;">
      <el-badge
        :value="item.item"
        :hidden="item.item <= 0"
        class="items"
        v-for="(item, index) in editableTabs"
        :key="index"
      >
        <el-button type="primary" plain size="medium" @click="badgeclick(item,index)">{{item.title}}</el-button>
      </el-badge>
    </div>
    <el-row style="text-align: right;">
      <el-button type="primary" size="small" @click="dialogTableVisible = true">表头管理</el-button>
      <el-button type="primary" size="small">导出</el-button>
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
      <el-table
        :data="tableData"
        stripe
        fit
        :header-cell-style="{background:'#66b1ff',color:'#fff'}"
        :row-class-name="tableRowClassName"
        v-loading="loading"
        style="height: calc(100% - 50px);"
        empty-text=" "
      >
        <el-table-column
          v-for="(item,index) in tableHead"
          :prop="item.property"
          :label="item.label"
          align="center"
          :key="index"
        >
          <template slot-scope="scope">
            <el-button
              @click="linkClick(item.property, scope.row)"
              type="text"
              size="medium"
              style="color: #606266;"
            >{{scope.row[scope.column.property]}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        :total="total"
        style="position: absolute; right: 0px; bottom: 0px; z-index: 99; width: 100%; background: #fff; padding: 20px 15px; text-align: right; box-sizing: border-box;"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { ports } from "./api/ports";

export default {
  data() {
    return {
      editableTabsValue: "1",
      dialogFormVisible: false,
      editableTabs: [
        {
          title: "视频新增UP主",
          name: "1",
          item: ""
        },
        {
          title: "新增视频",
          name: "2",
          item: ""
        },
        {
          title: "未读视频",
          name: "3",
          item: ""
        },
        {
          title: "站内沟通",
          name: "4",
          item: ""
        }
      ],
      newtitle: "",
      formLabelWidth: "120px",
      dialogTableVisible: false, //修改表头对话框
      tableHead: [
        {
          //表头
          label: "UP主名称",
          property: "accountName"
        },
        {
          label: "来源",
          property: "platform"
        },
        {
          label: "UP主标签",
          property: "userLabel"
        },
        {
          label: "新增视频",
          property: "newUserVodCount"
        },
        {
          label: "未读视频",
          property: "userUnreadVodCounts"
        },
        {
          label: "总数",
          property: "userAllVodCounts"
        }
      ],
      currentPage: 0,
      pageSize: 10,
      total: 10,
      tableData: [],
      loading: true
    };
  },
  mounted() {
    this.userVodCounts();
    this.getDataList();
  },
  methods: {
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
      ports.get("/admin/userVodCounts").then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.editableTabs[0].item = res.data.data.newUserCounts;
          this.editableTabs[1].item = res.data.data.newVodCount;
          this.editableTabs[2].item = res.data.data.AllUnreadVodCounts;
          this.editableTabs[3].item = res.data.data.stationInfoCounts;
          this.total = res.data.data.newUserCounts;
          // this.total = res.data.data.newUserCounts;
        }
      });
    },
    getDataList() {
      this.loading = true;
      this.tableData = [];
      ports
        .get("/admin/userVodList", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          // console.log(res);
          if (res.data.code === 200) {
            console.log(res.data.data);
            for (let i = 0; i < res.data.data.newUserList.length; i++) {
              let obj = {};
              obj.id = res.data.data.newUserList[i].id;
              obj.userId = res.data.data.newUserList[i].userId;
              obj.accountName = res.data.data.newUserList[i].accountName;
              obj.platform = res.data.data.newUserList[i].platform;
              obj.userLabel = res.data.data.newUserList[i].userLabel;
              obj.newUserVodCount = res.data.data.newUserVodCount[i];
              obj.userAllVodCounts = res.data.data.userAllVodCounts[i];
              obj.userUnreadVodCounts = res.data.data.userUnreadVodCounts[i];
              this.tableData.push(obj);
            }
            this.loading = false;
          } else {
            this.loading = false;
          }
        });
    },
    tableRowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 == 0) {
        return "success-row";
      }
      return "";
    },
    handleCurrentChange(val) {
      //翻页时触发事件
      this.getDataList();
    },
    badgeclick(val, index) {
      //点击新消息
      this.editableTabs[index].item = "0";
      if (val.name == 2 || val.name == 3) {
        window.location.href = "vods?flag=" + val.name;
      }
      if (val.name == 4) {
        window.location.href = "inStationManage";
      }
    },
    linkClick(property, rows) {
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
        window.location.href =
          "vods?&userId=" +
          rows.userId +
          "&accountName=" +
          rows.accountName +
          "&params=" +
          rows.userLabel +
          "&flag=6";
      } else if (property == "newUserVodCount") {
        window.location.href =
          "vods?&userId=" +
          rows.userId +
          "&params=" +
          rows.accountName +
          "&flag=2";
      } else if (property == "userUnreadVodCounts") {
        window.location.href =
          "vods?&userId=" +
          rows.userId +
          "&params=" +
          rows.accountName +
          "&flag=3";
      } else if (property == "userAllVodCounts") {
        window.location.href =
          "vods?&userId=" +
          rows.userId +
          "&params=" +
          rows.accountName +
          "&flag=4";
      }
    }
  }
};
</script>
<style scoped lang="less">
.logo {
  width: 140px;
  height: 100%;
  img {
    width: 100%;
    margin-left: -10%;
  }
}
</style>
