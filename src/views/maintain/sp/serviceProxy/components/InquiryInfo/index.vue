<template>
  <section class="common-section" v-if="externalFiles.length && internalFiles.length">
    <div class="common-section-header">
      <h2>问诊信息</h2>
    </div>
    <div class="common-section-body">
      <div class="table-section" v-if="externalFiles.length">
        <div class="table-section-header">
          <h3>外部检查</h3>
        </div>
        <FileDisplay :fileList="externalFiles" @delete="handleDelete" @update="loadAttachmentList" />
      </div>
      <div class="table-section" v-if="internalFiles.length">
        <div class="table-section-header">
          <h3>内部检查</h3>
        </div>
        <FileDisplay :fileList="internalFiles" @delete="handleDelete" @update="loadAttachmentList" />
      </div>
    </div>
  </section>
</template>
<script>
import FileDisplay from '@/libs/components/AisAttachment/FileDisplay/index.vue';
import { deleteFile, getFileList } from '@/libs/api/attachment';
import { isFileType } from '@/libs/utils/file';

export default {
  components: {
    FileDisplay
  },
  props: {
    _id: {
      type: [String, Number],
      required: true
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      externalFiles: [],
      internalFiles: [],
      loading: false
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
    async loadAttachmentList () {
      if (!this._id) return;
      this.loading = true;
      try {
        const [extRes, intRes] = await Promise.all([
          getFileList({ businessId: this._id, attachType: '车外照片' }),
          getFileList({ businessId: this._id, attachType: '车内照片' })
        ]);
        this.externalFiles = this.normalizeFiles(extRes && extRes.data ? extRes.data : []);
        this.internalFiles = this.normalizeFiles(intRes && intRes.data ? intRes.data : []);
      } catch (error) {
        console.error('加载附件列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    normalizeFiles (list) {
      return list.map(file => ({
        ...file,
        url: file.fileUrl,
        name: file.fileName,
        isImage: isFileType(file, 'image'),
        isVideo: isFileType(file, 'video'),
        isPdf: isFileType(file, 'pdf'),
        isExcel: isFileType(file, 'excel'),
        isWord: isFileType(file, 'word'),
        isPPT: isFileType(file, 'ppt'),
        isZip: isFileType(file, 'zip'),
        isRar: isFileType(file, 'rar')
      }));
    },

    async handleDelete ({ file }) {
      try {
        await deleteFile([file.id]);
        this.$message.success('删除成功');
        this.loadAttachmentList();
        this.$emit('refresh');
      } catch (error) {
        this.$message.error('删除失败');
      }
    }
  }
};
</script>
<style scoped lang="scss">
.table-section {
  margin-top: 16px;

  &-header {
    h3 {
      font-size: 14px;
    }
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  ::v-deep .file-item .desc {
    display: none;
  }
}
</style>
