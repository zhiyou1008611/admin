<template>
  <el-dialog title="上传图片" class="uploadPicture" :visible.sync="visible">
    <el-upload
      ref="upload"
      action
      list-type="picture-card"
      :multiple="true"
      :before-upload="uploadBefore"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :on-preview="onPreview"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog
      class="picture_preview"
      :visible.sync="preViewVisible"
      :modal="false"
      append-to-body
      width="30%"
    >
      <img width="100%" :src="preViewURL" />
    </el-dialog>
    <!-- footer -->
    <div slot="footer">
      <el-button class="cancle_btn" @click.stop="cancle">取 消</el-button>
      <el-button type="primary" @click="complete">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "uploadPicture",
  data() {
    return {
      visible: true, // 上传图片框toggle
      preViewVisible: false, // 预览框toggle
      preViewURL: "", // 预览图片的URL
      uploadFileList: [], // 上传的图片数组
      selectFileList: [] // 选中的图片数组
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$emit("close", false);
      }
    }
  },
  methods: {
    // 上传图片前检查格式、大小
    uploadBefore(file) {
      const isImg =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isImg) {
        this.$message.error("目前只支持 jpg / png / gif 的图片格式");
      } else if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB");
      }
      return isImg && isLt2M;
    },
    // 上传成功钩子
    onSuccess(response, file, fileList) {
      console.log("上传图片", response);
      console.log("上传图片2", file);
      console.log("上传图片3", fileList);
      this.uploadFileList = fileList;
    },
    // 上传失败钩子
    onError(err, file, fileList) {
      console.log("上传图片失败", err);
      this.$message.error("上传失败，请重新尝试!");
    },
    // 移除上传图片钩子
    onRemove(file, fileList) {
      this.uploadFileList = fileList;
    },
    // 预览上传图片钩子
    onPreview(file) {
      this.preViewURL = file.url;
      this.preViewVisible = true;
    },
    // 上传完成或选择完成
    complete() {
      let uploadPicture = [];
      let isUploadComplete = true;
      this.uploadFileList.forEach((item, index) => {
        console.log(item);
        console.log(index);
        if (item.response) {
          uploadPicture.push(item.response.data);
        } else {
          isUploadComplete = false;
        }
      });
      if (!isUploadComplete) {
        this.$message.warning("部分图片没有上传成功，请重新尝试");
      }
      this.$emit("complete", uploadPicture);
      this.visible = false;
    },
    // 清除上传的图片
    cancle() {
      this.visible = false;
    }
  }
};
</script>
<style lang='less' scoped>
.uploadPicture {
  .el-dialog {
    min-height: 580px;
    max-height: 580px;
    .el-dialog__header {
      padding: 0;
      .el-dialog__headerbtn {
        z-index: 1;
      }
    }
    .el-dialog__body {
      padding: 0;
      min-height: 500px;
      max-height: 500px;
      margin-bottom: 80px;
      overflow-y: auto;
    }
    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 10px;
      text-align: center;
    }
  }
}
</style>
