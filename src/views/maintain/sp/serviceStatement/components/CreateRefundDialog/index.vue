<template>
  <el-dialog
    :visible.sync="localVisible"
    title="创建反结算申请"
    width="500px"
    custom-class="refund-confirm-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="refund-content">
      <div class="refund-warning">
        <span>确定要创建反结算申请？</span>
      </div>
      <div class="refund-description">
        <p><strong>该施工单对应的结算单均需反结算，才可回退施工单进行修改</strong></p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createCounterSettlement } from '@/api/maintain/sp/serviceStatement';

export default {
  name: 'CreateRefundDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },

  },
  data () {
    return {
      localVisible: this.visible
    };
  },
  watch: {
    visible (val) {
      this.localVisible = val;
    }
  },
  methods: {
    async handleConfirm () {
      try {
        const response = await createCounterSettlement(this.id);

        if (response.code === 200) {
          this.$message.success('反结算申请创建成功');
          this.localVisible = false;
          this.$emit('update:visible', false);

          // 跳转至反结算编辑页面
          if (response.data && response.data) {
            this.$router.push({
              path: '/maintain/sp/restatement/edit',
              query: {
                id: response.data
              }
            });
          } else {
            this.$message.warning('未找到反结算申请单 ID');
          }

          this.$emit('confirm', response);
        } else {
          this.$message.error(response.msg || '反结算申请创建失败');
        }
      } catch (error) {
        console.error('创建反结算申请失败:', error);
      }
    },
    handleCancel () {
      this.localVisible = false;
      this.$emit('update:visible', false);
      this.$emit('cancel');
    },
    handleClose () {
      this.localVisible = false;
      this.$emit('update:visible', false);
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.refund-content {
  padding: 10px 0;

  .refund-warning {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;

    i {
      font-size: 20px;
      color: #f56c6c;
      margin-right: 8px;
    }

    span {
      color: #303133;
    }
  }

  .refund-description {
    background-color: #fef0f0;
    border-left: 4px solid #f56c6c;
    padding: 12px 16px;
    border-radius: 4px;

    p {
      margin: 0;
      line-height: 1.6;

      strong {
        color: #f56c6c;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }
}

.refund-confirm-dialog {
  ::v-deep .el-dialog__header {
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
  }

  ::v-deep .el-dialog__body {
    padding-top: 20px;
  }
}
</style>
