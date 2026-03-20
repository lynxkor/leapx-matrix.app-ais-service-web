<template>
  <el-dialog
    class="m-three-guarantees-dialog"
    title="提醒信息"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="dialog-content">
      <!-- 三包预警 -->
      <div class="info-section">
        <div class="warning-title">三包预警</div>
        <div class="warning-list">
          <div
            v-for="(item, index) in threeGuaranteesList"
            :key="index"
            :class="['warning-card', `warning-card--${item.type}`]"
          >
            <div class="warning-header">
              <span :class="['warning-tag', `warning-tag--${item.type}`]">
                {{ item.tagName }}
              </span>
              <span class="warning-content-title">{{ item.title }}</span>
            </div>
            <div class="warning-detail">
              <p v-for="(line, lineIndex) in item.details" :key="lineIndex">{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 预授权提醒 -->
      <div class="info-section">
        <div class="info-title">预授权提醒 <el-button size="small" type="primary">生成预授权</el-button></div>
        <div class="info-content">{{ preAuthReminder }}</div>
      </div>
      <!-- 服务活动提醒 -->
      <div class="info-section">
        <div class="info-title">服务活动提醒</div>
        <div class="info-content">{{ serviceActivityReminder }}{{ serviceActivityReminder }}{{ serviceActivityReminder }}{{ serviceActivityReminder }}</div>
      </div>
      <!-- 预授权提醒 -->
      <div class="info-section">
        <div class="info-title">预授权提醒</div>
        <div class="info-content">{{ preAuthReminder }}</div>
      </div>
      <!-- 服务活动提醒 -->
      <div class="info-section">
        <div class="info-title">服务活动提醒</div>
        <div class="info-content">{{ serviceActivityReminder }}</div>
      </div>
      <!-- 预授权提醒 -->
      <div class="info-section">
        <div class="info-title">预授权提醒</div>
        <div class="info-content">{{ preAuthReminder }}</div>
      </div>
      <!-- 服务活动提醒 -->
      <div class="info-section">
        <div class="info-title">服务活动提醒</div>
        <div class="info-content">{{ serviceActivityReminder }}</div>
      </div>
      <!-- 预授权提醒 -->
      <div class="info-section">
        <div class="info-title">预授权提醒</div>
        <div class="info-content">{{ preAuthReminder }}</div>
      </div>
      <!-- 服务活动提醒 -->
      <div class="info-section">
        <div class="info-title">服务活动提醒</div>
        <div class="info-content">{{ serviceActivityReminder }}</div>
      </div>
      <!-- 预授权提醒 -->
      <div class="info-section">
        <div class="info-title">预授权提醒</div>
        <div class="info-content">{{ preAuthReminder }}</div>
      </div>
      <!-- 服务活动提醒 -->
      <div class="info-section">
        <div class="info-title">服务活动提醒</div>
        <div class="info-content">{{ serviceActivityReminder }}</div>
      </div>
    </div>
    <template v-slot:footer>
      <el-button size="small" @click="close">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
// import { getReminderInfo, mockReminderInfo } from './api';
export const mockReminderInfo = {
  threeGuaranteesList: [
    {
      type: 'danger',
      tagName: '红色预警',
      title: '累计保修次数5项预警 80522250-BE02/低音扬声器总成',
      details: [
        '1、广州零跑中心科学城店，2023-08-15至2023-09-05，次数1',
        '2、深圳零跑中心罗湖店，2023-07-15至2023-08-15，次数1',
        '3、深圳零跑中心罗湖店，2023-07-15至2023-08-15，次数1'
      ]
    },
    {
      type: 'success',
      tagName: '绿色预警',
      title: '累计保修次数2项预警 80522250-BE53/防冻液-25',
      details: [
        '1、广州零跑中心科学城店，2023-08-15至2023-09-05，次数1',
        '2、深圳零跑中心罗湖店，2023-07-15至2023-08-15，次数1'
      ]
    },
    {
      type: 'warning',
      tagName: '黄色预警',
      title: '累计保修次数2项预警 80522250-BE53/防冻液-25',
      details: [
        '1、广州零跑中心科学城店，2023-08-15至2023-09-05，次数1',
        '2、深圳零跑中心罗湖店，2023-07-15至2023-08-15，次数1'
      ]
    }
  ],
  preAuthReminder: '此车包含保修专用的维修项目，需要做预授权。请确认是否需要进行预授权申请。',
  serviceActivityReminder: '此车包含保修专用的维修项目，需要做预授权。请确认是否需要进行预授权申请。'
};

export default {
  name: 'ThreeGuaranteesDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    vehicleInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      loading: false,
      threeGuaranteesList: [],
      preAuthReminder: '',
      serviceActivityReminder: ''
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.loadData();
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    async loadData () {
      if (!this.vehicleInfo.id) return;
      this.loading = true;
      try {
        // 使用 mock 数据进行开发调试，生产环境替换为真实接口
        // const res = await getReminderInfo(this.vehicleInfo.id);
        const res = mockReminderInfo;
        this.threeGuaranteesList = res.threeGuaranteesList || [];
        this.preAuthReminder = res.preAuthReminder || '';
        this.serviceActivityReminder = res.serviceActivityReminder || '';
        console.log(mockReminderInfo);
      } catch (error) {
        console.error('获取提醒信息失败:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-three-guarantees-dialog {
  .dialog-content {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .warning-section,
  .info-section {
    flex: 0 0 calc(50% - 6px);
    background: var(--leap-color-default-light-5);
    border-radius: 4px;
    padding: 12px 16px;
  }

  .warning-title,
  .info-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--leap-color-default-dark-1);
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .warning-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .warning-card {
    padding: 8px;
    border-radius: 4px;

    &--danger {
      background: #F8E8E8;
    }

    &--success {
      background: var(--leap-color-primary-light-9);
    }

    &--warning {
      background: #FAF6EA;
    }
  }

  .warning-header {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 7px;
  }

  .warning-tag {
    display: inline-block;
    padding: 0 4px;
    height: 20px;
    line-height: 20px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    white-space: nowrap;

    &--danger {
      background: var(--leap-color-danger);
    }

    &--success {
      background: var(--leap-color-success);
    }

    &--warning {
      background: var(--leap-color-warning);
    }
  }

  .warning-content-title {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: var(--leap-color-default-dark-1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .warning-card--danger .warning-content-title {
    color: var(--leap-color-danger);
  }

  .warning-card--success .warning-content-title {
    color: var(--leap-color-success);
  }

  .warning-card--warning .warning-content-title {
    color: var(--leap-color-warning);
  }

  .warning-detail,
  .info-content {
    font-size: 14px;
    color: var(--leap-color-default-dark-2);
    line-height: 22px;

    p {
      margin: 0;
    }
  }

  .info-content {
    white-space: pre-wrap;
  }
}
</style>
