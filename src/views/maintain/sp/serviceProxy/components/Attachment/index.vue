<template>
  <div>
    <div v-if="showUpload" class="ais-actions">
      <el-button type="primary" size="small" @click="openUploadDialog">
        <!-- <i class="el-icon-upload"></i> -->
        上传附件
      </el-button>
    </div>
    <div class="table-section">
      <vxe-table
        ref="attachmentTable"
        :data="attachmentData"
        :loading="loading"
        stripe
        show-overflow
        resizable
        border="inner"
        size="medium"
        min-height="0"
        max-height="500px"
      >
        <vxe-column field="fileName" title="附件名称" min-width="250">
          <template #default="{ row }">
            <div v-if="!row.isEditing" class="file-name-cell">
              <img
                :src="getFileIconPath(row)"
                class="file-icon"
                :class="{ 'thumbnail': row.isImage }"
                alt=""
              />
              <el-link :href="row.fileUrl" target="_blank" type="success">{{ row.fileName }}</el-link>
            </div>
            <div v-else class="file-name-edit-cell">
              <img
                :src="getFileIconPath(row)"
                class="file-icon"
                :class="{ 'thumbnail': row.isImage }"
                alt=""
              />
              <el-input
                v-model="row.editingFileName"
                size="small"
                @keyup.enter.native="saveEdit(row)"
                ref="editInput"
              />
            </div>
          </template>
        </vxe-column>
        <vxe-column field="creatorName" title="操作人" width="120" />
        <vxe-column field="fileSize" title="附件大小" width="120" :formatter="({ cellValue }) => formatFileSize(cellValue)" />
        <vxe-column field="createTime" title="创建时间" width="180" />
        <vxe-column title="操作" width="200" fixed="right">
          <template #default="{ row }">
            <span v-if="!row.isEditing" class="action-button btn-edit" @click="startEdit(row)">编辑</span>
            <span v-else class="action-button btn-edit" @click="saveEdit(row)">保存</span>
            <span v-if="!row.isEditing" class="action-button btn-download" @click="handleDownload(row)">下载</span>
            <el-popconfirm
              title="确定删除此文件吗？"
              @confirm="deleteFile(row)"
            >
              <span class="action-button btn-delete" slot="reference">删除</span>
            </el-popconfirm>
          </template>
        </vxe-column>
        <template #empty>
          <div class="m-vxe-table-empty-text">暂无附件数据</div>
        </template>
      </vxe-table>
    </div>
    <upload-dialog
      :visible.sync="uploadDialogVisible"
      :business-id="_id"
      :attach-type="attachType"
      :title="title"
      @refresh="handleUploadSuccess"
      @close="handleUploadClose"
    />
  </div>
</template>
<script>
import { deleteFile, getFileList, addOrUpdateFile } from '@/libs/api/attachment';
import { isFileType } from '@/libs/utils/file';
import UploadDialog from '../UploadDialog/index.vue';

export default {
  props: {
    _id: {
      type: [String, Number],
      required: true
    },
    title: {
      type: String,
      default: '上传附件'
    },
    attachType: {
      type: String,
    },
    showUpload: {
      type: Boolean,
      default: true
    },
    uploadConfig: {
      type: Object,
      default: () => ({
        maxSize: 50,
        acceptTypes: ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'ppt', 'pptx', 'xlsx', 'xls', 'docx', 'doc', 'rar', 'zip', 'mp4']
      })
    }
  },
  components: {
    UploadDialog
  },
  data () {
    return {
      attachmentData: [],
      loading: false,
      uploadDialogVisible: false
    };
  },
  watch: {
    _id: {
      handler (val) {
        if (val) {
          this.loadAttachmentList();
        }
      },
      immediate: true
    }
  },
  mounted () {
    if (this._id) {
      this.loadAttachmentList();
    }
  },
  methods: {
    // 加载附件列表
    async loadAttachmentList () {
      if (!this._id) return;
      this.loading = true;
      try {
        const res = await getFileList({ businessId: this._id, attachType: this.attachType });
        if (res && res.data) {
          this.attachmentData = res.data.map(file => ({
            ...file,
            isImage: isFileType(file, 'image'),
            isPdf: isFileType(file, 'pdf'),
            isExcel: isFileType(file, 'excel'),
            isWord: isFileType(file, 'word'),
            isPpt: isFileType(file, 'ppt'),
            isVideo: isFileType(file, 'video'),
            isZip: isFileType(file, 'zip') || isFileType(file, 'rar')
          }));
        }
      } catch (error) {
        console.error('加载附件列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 格式化文件大小
    formatFileSize (size) {
      if (!size) return '-';
      if (size < 1024) return size + 'B';
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB';
      return (size / 1024 / 1024).toFixed(2) + 'MB';
    },

    // 根据文件类型返回对应图标
    getFileIconPath (file) {
      if (file.isImage) return file.fileUrl;
      if (file.isPdf) return require('@/libs/components/AisAttachment/icon/pdf.png');
      if (file.isExcel) return require('@/libs/components/AisAttachment/icon/xls.png');
      if (file.isWord) return require('@/libs/components/AisAttachment/icon/word.png');
      if (file.isPpt) return require('@/libs/components/AisAttachment/icon/ppt.png');
      if (file.isVideo) return require('@/libs/components/AisAttachment/icon/video.png');
      if (file.isZip) return require('@/libs/components/AisAttachment/icon/zip.png');
      return require('@/libs/components/AisAttachment/icon/text.png');
    },

    // 开始编辑
    startEdit (row) {
      this.$set(row, 'isEditing', true);
      this.$set(row, 'editingFileName', row.fileName);
      this.$nextTick(() => {
        const input = this.$refs.editInput;
        if (input && input.$el) {
          input.$el.querySelector('input').focus();
        }
      });
    },

    // 保存编辑
    async saveEdit (row) {
      if (!row.editingFileName || !row.editingFileName.trim()) {
        this.$message.warning('文件名不能为空');
        return;
      }

      // 文件名未变化，直接退出编辑模式
      if (row.editingFileName === row.fileName) {
        this.$set(row, 'isEditing', false);
        this.$delete(row, 'editingFileName');
        return;
      }

      try {
        await addOrUpdateFile({
          id: row.id,
          fileName: row.editingFileName
        });
        this.$message.success('修改成功');
        this.$set(row, 'isEditing', false);
        this.$set(row, 'fileName', row.editingFileName);
        this.$delete(row, 'editingFileName');
      } catch (error) {
        this.$message.error('修改失败');
      }
    },

    // 下载文件
    handleDownload (file) {
      const link = document.createElement('a');
      link.href = file.fileUrl;
      link.download = file.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // 删除文件
    async deleteFile (file) {
      try {
        await deleteFile([file.id]);
        this.$message.success('删除成功');
        this.loadAttachmentList();
        this.$emit('refresh');
      } catch (error) {
        this.$message.error('删除失败');
      }
    },

    // 打开上传弹窗
    openUploadDialog () {
      this.uploadDialogVisible = true;
    },

    // 上传成功回调
    handleUploadSuccess () {
      this.uploadDialogVisible = false;
      this.loadAttachmentList();
      this.$emit('refresh');
    },

    // 关闭上传弹窗
    handleUploadClose () {
      this.uploadDialogVisible = false;
    }
  }
};

</script>
<style scoped lang="scss">
.table-section{
  margin-top: 16px;
  .m-vxe-table-empty-text {
    text-align: left;
  }

  .action-button {
    cursor: pointer;
    margin-right: 12px;
    &:hover {
      text-decoration: underline;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .btn-edit {
    color: var(--leap-color-link);
  }

  .btn-save {
    color: var(--leap-color-warning);
  }

  .btn-download {
    color: var(--leap-color-link);
  }

  .btn-delete {
    color: var(--leap-color-danger);
  }

  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
  }
}

.file-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .file-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    object-fit: contain;

    &.thumbnail {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      border: 1px solid #E6E6E5;
    }
  }
}

.file-name-edit-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  .file-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    object-fit: contain;

    &.thumbnail {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #E6E6E5;
    }
  }

  .el-input {
    flex: 1;
  }
}
</style>
