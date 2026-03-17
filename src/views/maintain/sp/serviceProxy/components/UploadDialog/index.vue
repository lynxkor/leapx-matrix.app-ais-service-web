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
import { uploadFile, addOrUpdateFile } from '@/libs/api/attachment';

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
      uploadedFiles: [],
      successCount: 0,
      failCount: 0
    };
  },
  computed: {
    acceptString () {
      return this.acceptTypes.map(type => `.${type}`).join(',');
    }
  },
  methods: {
    resetState () {
      this.uploadedFiles = [];
      this.successCount = 0;
      this.failCount = 0;
    },

    handleClose () {
      this.$refs.upload.clearFiles();
      this.fileList = [];
      this.resetState();
      this.$emit('close');
    },

    handleFileChange (file, fileList) {
      if (!this.validateFile(file)) {
        const index = fileList.findIndex(item => item.uid === file.uid);
        if (index > -1) {
          fileList.splice(index, 1);
        }
        return;
      }
      this.fileList = fileList;
    },

    handleRemove (file, fileList) {
      this.fileList = fileList;
    },

    getFileExt (fileName) {
      return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    },

    validateFile (file) {
      const fileExt = this.getFileExt(file.name);
      if (!this.acceptTypes.includes(fileExt)) {
        this.$message.error(`不支持的文件类型，请上传${this.acceptString}格式的文件`);
        return false;
      }

      if (file.size / 1024 / 1024 >= this.maxSize) {
        this.$message.error(`文件大小不能超过 ${this.maxSize}MB`);
        return false;
      }

      return true;
    },

    async handleSubmit () {
      if (this.fileList.length === 0) {
        this.$message.warning('请先选择要上传的文件');
        return;
      }

      this.isUploading = true;
      this.resetState();
      this.$refs.upload.submit();
    },

    async handleSuccess (response, file) {
      try {
        if (response && response.data) {
          const uploadedFile = {
            attachmentId: response.data.id || response.data.fileId,
            name: response.data.fileName || response.data.name || file.name,
            url: response.data.url,
            size: response.data.fileSize || response.data.size || file.size,
            fileType: response.data.fileType || response.data.ext || this.getFileExt(file.name),
            response: response.data
          };

          await this.saveFileRelation(uploadedFile);
          this.uploadedFiles.push(uploadedFile);
          this.successCount++;
          this.checkAllCompleted();
        }
      } catch (error) {
        console.error('处理上传文件失败:', error);
        this.isUploading = false;
        this.failCount++;
        this.checkAllCompleted();
      }
    },

    handleError (error, file) {
      this.failCount++;
      console.error('上传失败:', error);
      this.isUploading = false;
      this.checkAllCompleted();
    },

    async saveFileRelation (fileInfo) {
      if (!this.businessId) {
        return;
      }

      const params = {
        fileId: fileInfo.attachmentId,
        fileName: fileInfo.name,
        fileUrl: fileInfo.url,
        fileSize: fileInfo.size,
        fileType: fileInfo.fileType,
        attachType: this.attachType,
        businessId: this.businessId,
        ...(this.id && { id: this.id })
      };

      await addOrUpdateFile(params);
    },

    checkAllCompleted () {
      const totalFiles = this.fileList.length;
      const completedCount = this.successCount + this.failCount;
      if (completedCount >= totalFiles && this.isUploading) {
        this.isUploading = false;

        if (this.failCount === 0) {
          this.$message.success(`成功上传 ${this.successCount} 个文件`);
        } else if (this.successCount === 0) {
          this.$message.error('所有文件上传失败');
        } else {
          this.$message.warning(`上传完成，成功 ${this.successCount} 个，失败 ${this.failCount} 个`);
        }

        this.$emit('refresh', this.uploadedFiles);

        setTimeout(() => {
          if (this.successCount > 0) {
            this.handleClose();
          }
        }, 1000);
      }
    },

    async customUploadRequest (options) {
      const { file, onError } = options;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResult = await uploadFile(formData);

        if (uploadResult && uploadResult.data) {
          this.handleSuccess(uploadResult, file);
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
