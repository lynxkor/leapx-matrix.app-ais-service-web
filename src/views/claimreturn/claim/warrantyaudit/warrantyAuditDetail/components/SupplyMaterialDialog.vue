<template>
  <el-dialog
    title="补充材料"
    :visible="visible"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="材料补充说明：" prop="materialSupplyDesc">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入材料补充说明"
          v-model="form.materialSupplyDesc"
        />
      </el-form-item>
      <el-form-item label="补充材料附件：">
        <div class="attachment-section">
          <div class="attachment-header">
            <h4>补充材料附件列表</h4>
            <el-button size="small" type="primary" @click="handleAddAttachment">新增附件</el-button>
          </div>
          <div class="attachment-list">
            <el-table :data="form.attachmentList" border size="small">
              <el-table-column prop="attachmentType" label="附件类型" width="150">
                <template #default="{ row }">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="warranty_attachment_type"
                    v-model="row.attachmentType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </template>
              </el-table-column>
              <el-table-column prop="fileName" label="文件名称" width="200">
                <template #default="{ row }">
                  {{ row.fileName || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="fileUrl" label="文件" width="200">
                <template #default="{ row }">
                  <el-upload
                    :show-file-list="false"
                    :before-upload="(file) => handleBeforeUpload(file, row)"
                    action=""
                  >
                    <el-button size="mini" type="primary">上传</el-button>
                  </el-upload>
                  <el-link v-if="row.fileUrl" type="primary" :href="row.fileUrl" target="_blank">查看</el-link>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ $index }">
                  <el-button size="mini" type="danger" @click="handleDeleteAttachment($index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="原保修单附件：">
        <div class="attachment-section">
          <div class="attachment-header">
            <h4>原保修单附件列表（不可修改）</h4>
          </div>
          <div class="attachment-list">
            <el-table :data="originalAttachmentList" border size="small">
              <el-table-column prop="attachmentTypeLabel" label="附件类型" width="150" />
              <el-table-column prop="fileName" label="文件名称" width="200" />
              <el-table-column prop="fileUrl" label="文件" width="200">
                <template #default="{ row }">
                  <el-link v-if="row.fileUrl" type="primary" :href="row.fileUrl" target="_blank">查看</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { supplyMaterial } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import { getEnum, uploadFile } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  materialSupplyDesc: '',
  attachmentList: [],
};

export default {
  name: 'SupplyMaterialDialog',
  components: {
    FetchSelect,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectionList: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      form: { ...defaultForm },
      originalAttachmentList: [],
      submitLoading: false,
      rules: {
        materialSupplyDesc: [
          { required: true, message: '请输入材料补充说明', trigger: 'blur' }
        ],
      },
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.initForm();
      }
    }
  },
  methods: {
    initForm () {
      this.form = { ...defaultForm };
      this.originalAttachmentList = [];
      // TODO: 获取原保修单附件列表
      // if (this.selectionList.length > 0) {
      //   getOriginalAttachments(this.selectionList[0].warrantyApplyId).then(res => {
      //     this.originalAttachmentList = res || [];
      //   });
      // }
    },
    handleClose () {
      this.$emit('update:visible', false);
    },
    handleAddAttachment () {
      this.form.attachmentList.push({
        attachmentType: '',
        fileName: '',
        fileUrl: '',
      });
    },
    handleDeleteAttachment (index) {
      this.form.attachmentList.splice(index, 1);
    },
    handleBeforeUpload (file, row) {
      // 上传文件
      uploadFile(file).then(res => {
        row.fileName = file.name;
        row.fileUrl = res.fileUrl;
        this.$message.success('上传成功');
      }).catch(() => {
        this.$message.error('上传失败');
      });
      return false;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 附件校验：若上传的附件，没有满足对应保修类型设置的附件要求，不允许提交
          // TODO: 实现附件校验逻辑
          this.submitLoading = true;
          const ids = this.selectionList.map(item => item.id);
          supplyMaterial({
            ids,
            materialSupplyDesc: this.form.materialSupplyDesc,
            attachmentList: this.form.attachmentList,
          }).then(() => {
            this.$message.success('补充材料成功');
            this.$emit('success');
            this.handleClose();
          }).catch(() => {
            this.$message.error('补充材料失败');
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.attachment-section {
  .attachment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: normal;
    }
  }
  .attachment-list {
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>
