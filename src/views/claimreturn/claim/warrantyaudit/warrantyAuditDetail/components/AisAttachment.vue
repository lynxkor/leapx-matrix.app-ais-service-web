<template>
    <div class="ais-attachment">
        <div v-for="(group, type) in groupedAttachments" :key="type" class="attachment-group">
            <div class="group-title">{{ group[0]?.attachTypeName || type }}</div>
            <div class="attachment-grid">
                <div v-for="(item, index) in group" :key="index" class="attachment-item">
                    <div v-if="isImageFile(item.fileType)" class="image-wrapper">
                        <el-image :src="item.fileUrl" :preview-src-list="[item.fileUrl]" fit="cover"
                            style="width: 100%; height: 100%;" />
                        <div class="file-name">{{ item.fileName }}</div>
                    </div>
                    <div v-else class="file-name" @click="downloadExcel(item.fileUrl, item.fileName)">{{ item.fileName }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getFileList } from '@/libs/api/attachment';
import { downloadExcel } from '@/utils';

export default {
  name: 'AisAttachment',
  props: {
    businessId: {
      type: String,
      default: ''
    },
  },
  watch: {
    businessId: {
      handler (val) {
        if (val) {
          this.loadRowFiles();
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      attachmentList: []
    };
  },
  computed: {
    groupedAttachments () {
      return this.attachmentList.reduce((groups, item) => {
        const type = item.attachType || '其他';
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(item);
        return groups;
      }, {});
    }
  },
  methods: {
    downloadExcel,
    isImageFile (fileType) {
      if (!fileType) return false;
      const imageTypes = ['jpg', 'jpeg', 'png'];
      const type = fileType.toLowerCase();
      return imageTypes.includes(type) || type.includes('image');
    },
    async loadRowFiles () {
      try {
        const res = await getFileList({ businessId: this.businessId });
        this.attachmentList = res || [];
      } catch (error) {
      } finally {
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.ais-attachment {
    padding: 10px 0;
}

.attachment-group {
    margin-bottom: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
}

.group-title {
    background-color: #f5f7fa;
    padding: 8px 16px;
    font-weight: 500;
    border-bottom: 1px solid #e4e7ed;
}

.attachment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
}

.attachment-item {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 12px;
    background-color: #ffffff;
    text-align: center;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.file-name {
    font-size: 14px;
    color: #606266;
    line-height: 1.4;
    word-break: break-all;
    cursor: pointer;
}

.image-wrapper {
    width: 100%;
    height: 120px;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.image-wrapper .el-image {
    flex: 1;
    min-height: 0;
}

.image-wrapper .file-name {
    padding: 4px 0;
    font-size: 12px;
    color: #606266;
    text-align: center;
    line-height: 1.2;
}
</style>
