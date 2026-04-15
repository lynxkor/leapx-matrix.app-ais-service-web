<template>
  <el-dialog
    class="m-three-guarantees-dialog"
    title="提醒信息"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="dialog-content" v-loading="loading">
      <!-- 三包预警 -->
      <div v-for="(item, index) in remindList" :key="index" class="info-section">
        <!-- 三包预警类型 - 支持多个消息 -->
        <template v-if="item.type === RemindInfoTypeEnum.THREE_GUARANTEES">
          <div class="warning-title">{{ item.typeLabel }}</div>
          <div class="warning-list">
            <div
              v-for="(alarm, alarmIndex) in item.content"
              :key="alarmIndex"
              :class="['warning-card', `warning-card--${getAlarmType(alarm.alarmLevel)}`]"
            >
              <div class="warning-header">
                <span :class="['warning-tag', `warning-tag--${getAlarmType(alarm.alarmLevel)}`]">
                  {{ getAlarmLabel(alarm.alarmLevel) }}
                </span>
                <span class="warning-content-title">{{ alarm.title }}</span>
              </div>
              <div class="warning-detail">
                <p v-for="(line, lineIndex) in alarm.contents" :key="lineIndex">{{ line }}</p>
                <p v-if="alarm.contents.length === 0">暂无提醒信息</p>
              </div>
            </div>
            <p v-if="item.content.length === 0">暂无提醒信息</p>
          </div>
        </template>
        <!-- 预授权提醒 -->
        <template v-else-if="item.type === RemindInfoTypeEnum.PRE_AUTH">
          <div class="info-title">
            {{ item.typeLabel }}
            <el-button size="small" type="primary" :loading="submitLoading" @click="handleGeneratePreAuth" v-if="showPreAuthBtn">生成预授权</el-button>
          </div>
          <div class="info-content">{{ item.content || '暂无提醒信息'}}</div>
        </template>
        <!-- 服务活动提醒 -->
        <template v-else-if="item.type === RemindInfoTypeEnum.SERVICE_ACTIVITY">
          <div class="info-title">{{ item.typeLabel }}</div>
          <div class="info-content">{{ item.content || '暂无提醒信息'}}</div>
        </template>
      </div>
      <!-- 无数据提示 -->
      <div v-if="!remindList.length && !loading" class="empty-tips">暂无提醒信息</div>
    </div>
    <template v-slot:footer>
      <el-button size="small" @click="close">关 闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getSpRemindInfo } from '@/api/maintain/sp/serviceProxy';
import { addOrUpdate } from '@/api/maintain/sp/preAuth/index';
import { RemindInfoTypeEnum, AlarmLevelEnum } from '../../constant';

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
  computed: {
    showPreAuthBtn () {
      return !this.vehicleInfo.isCreatePreAuth && !this.hasGeneratedPreAuth;
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      loading: false,
      submitLoading: false,
      hasGeneratedPreAuth: false,
      remindList: [],
      RemindInfoTypeEnum
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.hasGeneratedPreAuth = false;
        this.loadData();
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    // 根据预警等级获取类型
    getAlarmType (level) {
      const map = {
        [AlarmLevelEnum.NORMAL]: 'success',
        [AlarmLevelEnum.WARNING]: 'warning',
        [AlarmLevelEnum.CRITICAL]: 'danger'
      };
      return map[level] || 'warning';
    },
    // 根据预警等级获取标签
    getAlarmLabel (level) {
      const map = {
        [AlarmLevelEnum.NOT_SPECIFIED]: '--',
        [AlarmLevelEnum.EXPIRED]: '过期',
        [AlarmLevelEnum.NORMAL]: '正常',
        [AlarmLevelEnum.WARNING]: '黄色',
        [AlarmLevelEnum.CRITICAL]: '红色'
      };
      return map[level] || '预警';
    },
    showMsg (msg) {
      return new Promise((resolve) => {
        const message = `<div class="ais-leave-tips-main warn"><i class="iconfont icon-lxppc-prompt"></i>提醒</div><div class="ais-leave-tips-sub">${msg}</div>`;
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          customClass: 'ais-leave-tips',
          showClose: false
        }).then(() => {
          resolve(true);
        }).catch(() => {
          resolve(false);
        });
      });
    },
    // 生成预授权
    async handleGeneratePreAuth () {
      if (!this.vehicleInfo.id) {
        this.$message.warning('施工单ID不存在');
        return;
      }
      const confirmed = await this.showMsg('确定要生成预授权吗？');
      if (!confirmed) return;
      this.submitLoading = true;
      try {
        // 调用新增接口，参数从 vehicleInfo 中获取
        const params = {
          serviceProxyId: this.vehicleInfo.id,
          saveOrSubmit: 0, // 0-仅保存，1-提交审批
          reason: '预授权申请',
          // preAuthType: 1, // 1-技术预授权，2-保修预授权
        };
        await addOrUpdate(params);
        this.hasGeneratedPreAuth = true;
        this.$message.success('生成预授权成功');
        this.$emit('refresh');
        // 刷新提醒信息列表
        await this.loadData();
      } catch (error) {
        console.error('生成预授权失败:', error);
      } finally {
        this.submitLoading = false;
      }
    },
    async loadData () {
      if (!this.vehicleInfo.id) return;
      this.loading = true;
      try {
        const res = await getSpRemindInfo(this.vehicleInfo.id);
        this.remindList = res || [];
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
    min-height: 100px;
  }

  .info-section {
    flex: 0 0 calc(50% - 6px);
    background: var(--leap-color-default-light-5);
    border-radius: 4px;
    padding: 12px 16px;

    &:only-child {
      flex: 1;
    }
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

  .empty-tips {
    width: 100%;
    text-align: center;
    color: var(--leap-color-default-dark-2);
    padding: 40px 0;
  }
}
</style>
