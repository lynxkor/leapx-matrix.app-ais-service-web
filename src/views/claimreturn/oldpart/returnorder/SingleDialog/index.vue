<template>
  <el-dialog
    class="m-start-work-dialog"
    title="单件验收"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="start-work-content">
      <!-- 顶部时间选择区域 -->
      <div class="time-section">
        <el-form label-width="" size="small" :inline="true" @submit.native.prevent>
          <el-form-item class="form-item-full" label="" prop="oldPartUniqueCode">
            <el-input
              placeholder="请输入唯一旧件码"
              v-model="oldPartUniqueCode"
              clearable
              v-debounce:input="onChange"
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-if="!form.id" class="please">{{ tipText }}</div>
      <div v-else class="table-section">
        <el-form v-loading="loading" :inline="true" label-width="" class="form-edit">
          <el-form-item label="旧件编码：" prop="oldPartCode">
            {{ form.oldPartCode }}
          </el-form-item>
          <el-form-item label="旧件名称：" prop="oldPartName">
            {{ form.oldPartName }}
          </el-form-item>
          <el-form-item class="form-item-full" label="适用车型：" prop="vehicleModelName">
            {{ form.vehicleModelName }}
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
         <h4 style="color: #0A0E0A;">验收</h4>
         <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
          <el-form-item class="form-item-full" label="验收结果：" prop="acceptanceResult">
            <el-radio-group v-model="form.acceptanceResult">
              <el-radio :label="'0'">验收通过</el-radio>
              <el-radio :label="'1'">验收不合格</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="form-item-full" v-if="form.acceptanceResult === '1'" label="不合格描述：" prop="unqualifiedCode">
            <fetch-select
              filterable
              clearable
              remote
              reserve-keyword
              v-model="form.unqualifiedCode"
              :remote-method="codeSearch"
              :params="form.unqualifiedCode"
              @change="codeChange"
              value-key="unqualifiedCode"
              label-key="unqualifiedDesc"
            />
          </el-form-item>
          <el-form-item
            v-if="form.acceptanceResult === '1'"
            class="form-item-full"
            :label="'附件上传：'"
            prop="attachFileList"
          >
            <AisAttachment
              ref="attachment"
              :businessId="form.id"
              @upload-loading-change="loadingChange"
            />
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
        <el-button size="small" @click="close">取消</el-button>
        <el-button :disabled="!form.id || uploadLoading" size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>

import { singleCheck } from '@/api/claimreturn/oldpart/returnorder/index';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import { queryByOldPartUniqueCode4Check } from '@/api/claimreturn/oldpart/inventory/oem';
import { getList } from '@/api/claimreturn/oldpart/basic/oldPartUnqualifiedConfig/index';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import { escapeHtml } from '@/libs/utils';

const defaultForm = {
  acceptanceResult: '0', // 验收结果 0-验收通过 1-验收不合格
  checkRemark: '', // 验收备注
  unqualifiedCode: '', // 不合格代码
  attachFileList: [], // 附件列表
};
export default {
  name: 'OldPartDialog',
  components: {
    BaseInput,
    FetchSelect,
    AisAttachment,
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
        checkRemark: [],
        unqualifiedCode: [
          { required: true, message: '请选择不合格代码', trigger: 'change' }
        ],
        attachFileList: [
          { required: false, message: '请上传附件', trigger: 'change' }
        ],
      },
      tipText: '请先搜索待验收旧件',
      //
      files: [],
      uploadLoading: false,
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (!val) {
        this.onReset();
      }
    },
    'form.attachFileList' () {
      console.log('附件列表变化：', this.form.attachFileList);
    },
    'form.acceptanceResult' (val) {
      // 验收通过时清空不合格代码
      if (val === '0') {
        this.form.unqualifiedCode = '';
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.onReset();
    },
    submit () {
      //
      this.$refs.ruleForm?.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.submitLoading = true;
        const attachFileList = this.$refs.attachment?.getAttachment();

        singleCheck({
          oldPartInventoryDetailId: this.form.id,
          checkRemark: this.form.checkRemark,
          unqualifiedCode: this.form.unqualifiedCode,
          attachFileList: attachFileList,
        }).then(res => {
          this.close();
          this.$message.success('验收成功！');
          if (res !== '') {
            this.$notify({
              title: '警告',
              // 全局样式对通知内容有两端对齐(text-align:justify),用 HTML 渲染强制左对齐
              message: `<div style="text-align:left;">${escapeHtml(res)}</div>`,
              dangerouslyUseHTMLString: true,
              type: 'warning'
            });
          }

          this.$emit('refresh');
        }).finally(() => {
          this.submitLoading = false;
        });
        //
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
      queryByOldPartUniqueCode4Check(this.oldPartUniqueCode).then((data) => {
        if (data) {
          this.form = data;
          this.$nextTick(() => {
            // 默认选
            this.$set(this.form, 'acceptanceResult', '0');
          });
        } else {
          this.$message.error('未查询到您输入的旧件');
          this.form = { ...defaultForm };
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    onReset () {
      this.$refs.ruleForm?.resetFields();
      this.oldPartUniqueCode = '';
      this.form = {
        ...defaultForm,
      };
    },
    // -------------- 表单查询 --------------------------
    async codeSearch (query) {
      return getList({
        unqualifiedCode: query || '',
        pageNum: 1,
        pageSize: 20,
      });
    },
    codeChange (val, record) {
      if (record) {
        this.form.unqualifiedCode = record.unqualifiedCode;
        this.form.unqualifiedDesc = record.unqualifiedDesc;
      }
    },
    loadingChange (loading) {
      this.uploadLoading = loading;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {

  ::v-deep .el-dialog{
    // height: 560px;
  }
  ::v-deep .el-dialog__body {
    height: calc(100% - 112px);
    padding: 20px;
    .start-work-content {
      height: 100%;
    }
  }
  h4{
    margin-top: 12px;
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
