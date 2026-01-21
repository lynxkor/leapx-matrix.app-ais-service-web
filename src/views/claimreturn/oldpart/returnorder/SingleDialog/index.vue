<template>
  <el-dialog
    class="m-start-work-dialog"
    title="单件验收"
    width="1200px"
    :visible.sync="dialogVisible"
    @close="close"
    @closed="closed"
  >
    <div class="start-work-content">
      <!-- 顶部时间选择区域 -->
      <div class="time-section">
        <el-form ref="ruleForm" label-width="150px" size="small" :inline="true" @submit.native.prevent>
          <el-form-item class="form-item-full" label="旧件唯一码：" prop="oldPartUniqueCode">
            <el-input
              placeholder="请输入"
              v-model="oldPartUniqueCode"
              clearable
              v-debounce:input="onChange"
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-if="!oldPartUniqueCode" class="please">{{ tipText }}</div>
      <div v-else class="table-section">
        <el-form v-loading="loading" :inline="true" label-width="150px" class="form-edit">
          <el-form-item label="旧件编码：" prop="oldPartCode">
            {{ form.oldPartCode }}
          </el-form-item>
          <el-form-item label="旧件名称：" prop="oldPartName">
            {{ form.oldPartName }}
          </el-form-item>
          <!-- TODO -->
          <el-form-item label="适用车型：" prop="">
            {{ 'TODO' }}
          </el-form-item>
          <el-form-item label="旧件唯一码：" prop="oldPartUniqueCode">
            {{ form.oldPartUniqueCode }}
          </el-form-item>
          <el-form-item label="旧件返还类型：" prop="returnTypeLabel">
            {{ form.returnTypeLabel }}
          </el-form-item>
          <el-form-item label="保修申请单：" prop="warrantyNo">
            {{ form.warrantyNo }}
          </el-form-item>
          <el-form-item label="门店名称：" prop="dealerName">
            {{ form.dealerName }}
          </el-form-item>
          <el-form-item label="保修索赔通过时间：" prop="warrantyApproveTime">
            {{form.warrantyApproveTime }}
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            {{ form.remark }}
          </el-form-item>
         </el-form>
         <h4>验收</h4>
         <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
          <el-form-item label="验收结果：" prop="acceptanceResult">
            <el-radio-group v-model="form.acceptanceResult">
              <el-radio :label="'0'">验收通过</el-radio>
              <el-radio :label="'1'">验收不合格</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="form-item-full" label="验收备注：" prop="checkRemark">
            <base-input
              placeholder="请输入"
              v-model="form.checkRemark"
              clearable
              maxlength="1000"
              type="textarea"
            />
          </el-form-item>
         </el-form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  getList, // 旧件库存详情分页查询
} from '@/api/claimreturn/oldpart/inventory/oem/index';
import { addDetail } from '@/api/claimreturn/oldpart/returnorder/index';
import { formatDateTime } from '@/libs/utils';
import BaseInput from '@/libs/components/BaseInput/index.vue';

const defaultForm = {
  acceptanceResult: '0', // 验收结果 0-验收通过 1-验收不合格
  checkRemark: '', // 验收备注
};
export default {
  name: 'OldPartDialog',
  components: {
    BaseInput,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    _id: {
      type: String,
    },
  },
  data () {
    return {
      pageSizes: [10, 20, 50, 100],
      form: { ...defaultForm },
      oldPartUniqueCode: '',
      pageSize: 20,
      pageNum: 1,
      loading: false,
      //
      dialogVisible: this.visible,
      submitLoading: false,
      rules: {
        acceptanceResult: [
          { required: true, message: '请选择验收结果', trigger: 'change' }
        ],
        checkRemark: []
      },
      tipText: '请先搜索待验收旧件',
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (!val) {
        this.onReset();
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.onReset();
    },
    closed () {
      this.form = {
        ...defaultForm,
      };
    },
    submit () {
      //
      this.submitLoading = true;
      addDetail({
        id: this._id,
      }).then(res => {
        this.$emit('update');
        this.close();
        this.$message.success('添加成功');
      }).finally(() => {
        this.submitLoading = false;
      });
    },
    pageChange (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    },
    // --------------- 表单查询 -------------------------
    onChange () {
      this.getData();
    },
    getData () {
      if (!this.oldPartUniqueCode) {
        return;
      }
      this.loading = true;
      getList({
        oldPartUniqueCode: this.oldPartUniqueCode,
      }).then((res) => {
        if (res.records && res.records.length > 0) {
          this.form = res.records[0];
        } else {
          this.$message.error('未找到该旧件信息，请确认后重新输入');
          this.form = { ...defaultForm };
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    onSubmit () {
    },
    onReset () {
      this.$refs.ruleForm.resetFields();
      this.tipText = '请先搜索待验收旧件';
      this.oldPartUniqueCode = '';
    },
    // -------------- 表单查询 --------------------------
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {
  ::v-deep .el-dialog__body {
    max-height: 90vh !important;
    height: 80vh;
    padding: 20px;
    .start-work-content {
      height: 100%;
    }
  }
  .el-form-item {
    width: 33.3% !important;
    &.form-item-full {
      width: 100% !important;
    }
  }
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis > .vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }

  .start-work-content {
    .time-section {
      padding-bottom: 8px;
      border-bottom: 1px solid #e8e8e8;

      .el-form {
        .el-form-item {
          margin-bottom: 8px;
        }
      }
    }

    .table-section {
      height: 80%;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .please{
    color: #6C6E6C;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
  }
}
</style>
