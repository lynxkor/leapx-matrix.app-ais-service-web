<template>
    <el-dialog class="m-start-work-dialog" :title="title" width="800px" :visible.sync="dialogVisible" @close="close">
        <!-- 数据表格 -->
        <div class="common-section-body">
            <el-form :model="formData" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="审批说明：" prop="approvalDescription">
                    <el-input v-model="form.approvalDescription" type="textarea" maxlength="500" show-word-limit placeholder="审批说明"></el-input>
                </el-form-item>
                <el-form-item label="优惠券：" v-if="!formData.originalPriceIs">
                    <div v-if="formData.count > 0">
                        <div style="display: flex; justify-content: space-between;">
                            <div>{{ formData.couponTypeLabel }}：适用{{ formData.orderTypeLabel }}</div>
                            <div>剩余{{ formData.count }}张</div>
                        </div>
                        <div>{{ formData.validEnd }}前有效</div>
                        <div>使用
                            <el-switch
                                v-model="value"
                                @change="handleSwitchChange"
                            >
                            </el-switch>
                        </div>
                    </div>
                    <div v-else>无优惠券</div>
                </el-form-item>
            </el-form>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 认</el-button>
                <el-button size="small" @click="close">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { purchaseApplyAgree } from '@/api/sparepart/purchase/purchaseApply/index';

export default {
  name: 'ApprovalDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    couponObj: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: this.visible,
      tableData: [],
      submitLoading: false,
      title: '审批同意--非原价订单',
      formData: {},
      form: {
        originalPriceCouponId: '',
        approvalDescription: '',
      },
      value: false
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
    couponObj (val) {
      if (val) {
        this.formData = this.couponObj;
        if (val.originalPriceIs) {
          this.title = '审批同意--原价订单';
        } else {
          this.title = '审批同意--非原价订单';
        }
      }
    },
  },
  methods: {
    // 使用
    handleSwitchChange () {
      if (this.value) {
        this.form.originalPriceCouponId = this.formData.couponId;
      }
    },
    async submit () {
      this.submitLoading = true;
      const params = {
        id: this.id,
        ...this.form,
      };
      try {
        const res = await purchaseApplyAgree(params);
        if (res.length > 0) {
          this.$emit('failure', this.id);
        } else {
          this.$emit('success');
          this.$message({
            message: '审批同意成功',
            type: 'success',
          });
        }
        this.form = {
          id: '',
          approvalDescription: '',
        };
      } catch (error) {
        this.$message.error('操作失败：' + (error.message || '未知错误'));
      } finally {
        this.submitLoading = false;
      }
    },
    close () {
      this.$emit('close');
    },
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {

    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
    ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
        padding: 8px 12px !important;
    }

    .start-work-content {
        .time-section {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e8e8e8;

            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        }

        .table-section {
            margin-top: 15px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

.action-button {
    margin: 0 5px;
    cursor: pointer;

    &.btn-edit {
        color: #4C4CD6;
    }
}
</style>
