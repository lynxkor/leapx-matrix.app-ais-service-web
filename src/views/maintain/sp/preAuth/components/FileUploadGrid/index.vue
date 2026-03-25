<template>
  <div class="attachment-grid">
    <AisAttachment
      v-for="(item, index) in attachmentList" :key="index"
      :businessId="_id"
      :ref="'attachment' + index"
      :configCode="item.configCode"
      :attachType="item.attachType"
      :title="item.label"
      :uploadConfig="item.uploadConfig"
      type="card"
    />
  </div>
</template>

<script>
import AisAttachment from '@/libs/components/AisAttachment/index.vue';

export default {
  name: 'SimpleDialog',
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      title: '',
      // 附件列表配置
      attachmentList: [
        { label: '车辆信息', required: false, configCode: 'mcs_preauth', attachType: '车辆信息' },
        { label: '行驶证', required: false, configCode: 'mcs_preauth', attachType: '行驶证' },
        { label: '故障信息', required: false, configCode: 'mcs_preauth', attachType: '故障信息' },
        { label: '终身权益', required: false, configCode: 'mcs_preauth', attachType: '终身权益' },
        { label: '首保凭证', required: false, configCode: 'mcs_preauth', attachType: '首保凭证' },
        { label: '保养质检', required: false, configCode: 'mcs_preauth', attachType: '保养质检' },
        { label: '施工旧件', required: false, configCode: 'mcs_preauth', attachType: '施工旧件' },
        { label: '旧件信息', required: false, configCode: 'mcs_preauth', attachType: '旧件信息' },
        { label: '其他', required: false, configCode: 'mcs_preauth', attachType: '其他' }
      ]
    };
  },
  components: {
    AisAttachment
  },
  computed: {
    _id () {
      return this.id || this.$route?.query?.id || '';
    }
  },
  methods: {
    /**
     * 打开弹框
     * @param {Object} options - 配置项
     * @param {string} options.title - 弹框标题
     * @param {string} options.width - 弹框宽度，默认 500px
     * @param {any} options.data - 传递给弹框的数据
     */
    open (options = {}) {
      this.title = options.title || '';
      this.width = options.width || '500px';
      this.visible = true;
      // 如果有数据传递，通过 $emit 通知父组件
      if (options.data) {
        this.$emit('open', options.data);
      }
    },
    /**
     * 关闭弹框
     */
    close () {
      this.visible = false;
    },
    handleClose () {
      this.$emit('close');
    },
    handleCancel () {
      this.close();
      this.$emit('cancel');
    },
    handleConfirm () {
      // 校验必填项
      const missingRequired = [];
      this.attachmentList.forEach((item, index) => {
        if (item.required) {
          const refName = 'attachment' + index;
          const fileLength = this.$refs[refName]?.[0]?.getFileList?.()?.length || 0;
          if (fileLength === 0) {
            missingRequired.push(item.label);
          }
        }
      });

      if (missingRequired.length > 0) {
        this.$message.error(`以下必填项未上传：${missingRequired.join('、')}`);
        return;
      }

      this.$emit('confirm');
    }
  }
};
</script>

<style lang="scss">
  .attachment-grid {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
</style>
