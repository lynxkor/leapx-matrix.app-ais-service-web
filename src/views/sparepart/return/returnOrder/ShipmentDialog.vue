<template>
    <el-dialog class="m-start-work-dialog" title="发运" width="800px" :visible.sync="dialogVisible" @close="close">
        <!-- 数据表格 -->
        <div class="common-section-body">
            <el-form :model="formData" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="物流单号：" prop="approvalDescription">
                    <el-input v-model="formData.logisticsOrderNo" placeholder="请填写物流单号"></el-input>
                </el-form-item>
                <el-form-item label="物流商：">
                    <el-input v-model="formData.logisticsProvider" placeholder="请填写物流商"></el-input>
                </el-form-item>
                <el-form-item label="发货时间：">
                    <el-date-picker v-model="formData.deliveryTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择发货时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="物流备注：">
                    <el-input v-model="formData.logisticsRemark" type="textarea" maxlength="500" show-word-limit placeholder="请填写物流备注"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <!-- 底部按钮 -->
        <template v-slot:footer>
            <div class="dialog-footer">
                <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 认</el-button>
                <el-button size="small" @click="close">取消</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { returnOrderShipping } from '@/api/sparepart/return/returnOrder/index';

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
  },
  data () {
    return {
      dialogVisible: this.visible,
      submitLoading: false,
      formData: {},
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
    },
  },
  methods: {
    async submit () {
      this.submitLoading = true;
      const params = {
        id: this.id,
        ...this.formData
      };
      try {
        await returnOrderShipping(params);
        this.$message({
          message: '发运成功',
          type: 'success',
        });
        this.submitLoading = false;
        this.close();
        this.$emit('success');
      } catch (error) {
        this.submitLoading = false;
      }
    },
    close () {
      this.$emit('update:visible', false);
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
