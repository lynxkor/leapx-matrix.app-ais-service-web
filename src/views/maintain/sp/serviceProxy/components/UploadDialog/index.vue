<template>
  <el-dialog
    :title="title"
    :visible="visible"
    custom-class="ais-upload-modal"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-upload
      ref="upload"
      :limit="limit"
      :accept="acceptString"
      :disabled="isUploading"
      :headers="headers"
      action="#"
      :http-request="customUploadRequest"
      :auto-upload="false"
      :on-change="handleFileChange"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileList"
      drag
      multiple
    >
      <div class="el-upload__inner">
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <div slot="tip" class="el-upload__tip">
        <span>支持扩展名[{{ acceptString }}]，且大小不超过{{ maxSize }}MB</span>
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">取消</el-button>
      <el-button
        type="primary"
        :loading="isUploading"
        @click="handleSubmit"
        size="small"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadFile, deleteFile, addOrUpdateFile } from '@/libs/api/attachment';

export default {
  name: 'UploadModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '上传附件'
    },
    // 业务ID
    businessId: {
      type: String
    },
    // 附件类型
    attachType: {
      type: String
    },
    // 业务参数
    businessParams: {
      type: String
    },
    // 最大文件大小(MB)
    maxSize: {
      type: Number,
      default: 50
    },
    // 最大上传数量
    limit: {
      type: Number,
      default: 100
    },
    // 允许的文件类型
    acceptTypes: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'ppt', 'pptx', 'xlsx', 'xls', 'docx', 'doc', 'rar', 'zip', 'mp4']
    }
  },
  data () {
    return {
      isUploading: false,
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      fileList: [],
      uploadedFiles: [], // 已上传成功的文件列表
      uploadSuccessCount: 0, // 上传成功的文件数
      uploadFailCount: 0, // 上传失败的文件数
      isCheckingComplete: false // 防止重复检查上传完成状态
    };
  },
  computed: {
    acceptString () {
      return this.acceptTypes.map(type => {
        const commonTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', 'mp4'];
        if (commonTypes.includes(type)) {
          return `.${type}`;
        }
        return `.${type}`;
      }).join(',');
    }
  },
  methods: {
    handleClose () {
      this.$refs.upload.clearFiles();
      this.fileList = [];
      this.uploadedFiles = [];
      this.uploadSuccessCount = 0;
      this.uploadFailCount = 0;
      this.isCheckingComplete = false;
      this.$emit('close');
    },

    // 文件选择变化 - 仅添加到列表
    handleFileChange (file, fileList) {
      // 校验文件
      const isValid = this.validateFile(file);
      if (!isValid) {
        // 如果校验失败，从列表中移除
        const index = fileList.findIndex(item => item.uid === file.uid);
        if (index > -1) {
          fileList.splice(index, 1);
        }
        return;
      }
      this.fileList = fileList;
    },

    // 删除文件
    handleRemove (file, fileList) {
      this.fileList = fileList;
    },

    // 文件校验
    validateFile (file) {
      // 文件类型校验
      const fileName = file.name;
      const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      const isValidType = this.acceptTypes.includes(fileExt);

      if (!isValidType) {
        this.$message.error(`不支持的文件类型，请上传${this.acceptString}格式的文件`);
        return false;
      }

      // 文件大小校验
      const isValidSize = file.size / 1024 / 1024 < this.maxSize;
      if (!isValidSize) {
        this.$message.error(`文件大小不能超过 ${this.maxSize}MB`);
        return false;
      }

      return true;
    },

    // 确定按钮 - 提交上传
    async handleSubmit () {
      if (this.fileList.length === 0) {
        this.$message.warning('请先选择要上传的文件');
        return;
      }

      this.isUploading = true;
      this.uploadSuccessCount = 0;
      this.uploadFailCount = 0;
      this.isCheckingComplete = false;

      // 手动触发上传
      this.$refs.upload.submit();
    },

    // 上传成功回调
    handleSuccess (response, file, fileList) {
      this.uploadSuccessCount++;

      let uploadedFile = null;

      // 将上传成功的文件添加到列表
      if (response && response.data) {
        uploadedFile = {
          attachmentId: response.data.id || response.data.fileId,
          name: response.data.fileName || response.data.name || file.name,
          url: response.data.authFileUrl || response.data.url,
          size: response.data.fileSize || response.data.size || file.size,
          fileType: response.data.fileType || response.data.ext || this.getFileType(file),
          response: response.data
        };
        this.uploadedFiles.push(uploadedFile);
      }

      // 检查是否所有文件都上传完成
      this.checkUploadComplete();
    },

    // 上传失败回调
    handleError (error, file) {
      this.uploadFailCount++;
      this.$message.error(`${file.name} 上传失败`);
      console.error('上传失败:', error);

      // 检查是否所有文件都上传完成
      this.checkUploadComplete();
    },

    // 检查所有文件是否上传完成
    checkUploadComplete () {
      // 防止重复触发
      if (this.isCheckingComplete) {
        return;
      }

      const totalFiles = this.fileList.length;
      const completedFiles = this.uploadSuccessCount + this.uploadFailCount;

      if (completedFiles >= totalFiles) {
        this.isCheckingComplete = true;
        this.isUploading = false;

        // 批量保存文件信息
        this.batchSaveFiles();

        // 显示上传结果
        if (this.uploadFailCount === 0) {
          this.$message.success(`成功上传 ${this.uploadSuccessCount} 个文件`);
        } else if (this.uploadSuccessCount === 0) {
          this.$message.error('所有文件上传失败');
        } else {
          this.$message.warning(`上传完成，成功 ${this.uploadSuccessCount} 个，失败 ${this.uploadFailCount} 个`);
        }

        // 通知父组件刷新
        this.$emit('refresh', this.uploadedFiles);

        // 延迟关闭对话框
        setTimeout(() => {
          if (this.uploadSuccessCount > 0) {
            this.handleClose();
          }
        }, 1000);
      }
    },

    // 批量保存文件信息
    async batchSaveFiles () {
      if (!this.businessId || this.uploadedFiles.length === 0) {
        return;
      }

      try {
        // 并发保存所有文件信息
        const savePromises = this.uploadedFiles.map(fileInfo => {
          const params = {
            fileId: fileInfo.attachmentId,
            fileName: fileInfo.name,
            fileUrl: fileInfo.url,
            fileSize: fileInfo.size,
            fileType: fileInfo.fileType,
            attachType: this.attachType,
            businessId: this.businessId
          };

          if (this.id) {
            params.id = this.id;
          }

          return addOrUpdateFile(params);
        });

        await Promise.all(savePromises);
      } catch (error) {
        console.error('批量保存文件信息失败:', error);
      }
    },

    // 获取文件类型
    getFileType (file) {
      const fileName = file.name;
      return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    },

    // 自定义上传请求
    async customUploadRequest (options) {
      const { file, onSuccess, onError } = options;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResult = await uploadFile(formData);

        if (uploadResult && uploadResult.data) {
          onSuccess(uploadResult, file);
        } else {
          onError(new Error('上传失败'));
        }
      } catch (error) {
        console.error('上传失败:', error);
        onError(error);
      }
    }
  }
};
</script>
<style lang="scss">
.ais-upload-modal{
  color: var(--aisDefaultTextColor);
  border-radius: 8px;
  .el-dialog__header {
    border-bottom: 1px solid #E6E6E5;
    padding: 12px 20px;
    font-weight: 700;
    .el-dialog__title{
      font-size: 14px;
      color: var(--aisDefaultTextColor);
    }
    .el-dialog__headerbtn{
      top: 16px;
    }
  }
  .el-dialog__body {
    padding: 20px 20px 48px 20px;
    color: var(--aisDefaultTextColor);
    .el-icon-upload{
      color: rgba($color: #009100, $alpha: 0.2);
      margin-top: 55px;
    }
  }
  .el-dialog__footer {
    padding: 12px 20px;
    border-top: 1px solid #E6E6E5;
    .el-button {
      font-weight: 400;
    }
  }
  .el-upload {
    width: 100%;
  }
  .el-upload-dragger{
    width: 100%;
    height: 206px;
  }
  .el-upload__tip{
    color: #9d9d9d;
  }
  .upload-modal-step{
    margin-bottom: 12px;
  }
  .upload-modal-link {
    color: var(--themColor);
    cursor: pointer;
  }
}
</style>
