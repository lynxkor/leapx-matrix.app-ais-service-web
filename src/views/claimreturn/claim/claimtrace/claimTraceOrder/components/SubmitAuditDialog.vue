<template>
  <el-dialog
    title="审核下发"
    width="600px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    destroy-on-close
    @close="close"
  >
    <div class="page-common-edit vertical">
      <section class="common-section">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" style="padding-right: 16px;">
          <el-form-item prop="traceDesc" class="form-item-full" label="追溯说明：">
            <el-input type="textarea" v-model="form.traceDesc" placeholder="请输入" :rows="3" maxlength="500" show-word-limit />
          </el-form-item>
          <!-- 直接使用 AisUpload 自己管理 fileList:
               1. 通过 :api-config.deleteApi 替换默认删除,删除已上传文件后只过滤 fileList 不重拉服务端,避免本轮上传的暂存文件被冲掉;
               2. 通过 :isAttached="false" 让本轮上传仅暂存不绑单据,保留"点确定才提交"语义;
               3. 通过 :key 强制组件在单条模式下重建,避免不同调用间 fileList 状态污染。
          -->
          <el-form-item v-if="!batchMode" class="form-item-full" label="追溯凭证：">
            <AisUpload
              ref="upload"
              :key="`single-${traceOrderId}`"
              :business-id="traceOrderId"
              attach-type="不合格凭证"
              v-model="fileList"
              :isAttached="false"
              :readonly="false"
              :api-config="customApiConfig"
              :upload-config="uploadConfig"
              hint="default"
              @upload-loading-change="handleUploadLoadingChange"
              @addParam="handleAddParam"
              @removeParam="handleRemoveParam"
            />
          </el-form-item>
          <el-form-item v-else class="form-item-full" label="追溯凭证：">
            <AisUpload
              ref="upload"
              key="batch"
              attach-type="不合格凭证"
              v-model="fileList"
              :isAttached="false"
              :readonly="false"
              :api-config="customApiConfig"
              :upload-config="uploadConfig"
              hint="default"
              @upload-loading-change="handleUploadLoadingChange"
              @addParam="handleAddParam"
              @removeParam="handleRemoveParam"
            />
          </el-form-item>
        </el-form>
      </section>
    </div>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { submitAudit, batchSubmitForAudit } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import { uploadFile, deleteFile, addOrUpdateFile, getFileList } from '@/libs/api/attachment/index';
import { isFileType } from '@/libs/utils/file.js';
import AisUpload from '@/libs/components/AisAttachment/AisUpload/index.vue';

export default {
  name: 'SubmitAuditDialog',
  components: { AisUpload },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    traceOrderId: {
      type: [String, Number],
      default: ''
    },
    traceOrderIds: {
      type: Array,
      default: () => []
    },
    batchMode: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      form: {
        id: '',
        traceDesc: '',
      },
      submitLoading: false,
      dialogVisible: this.visible,
      rules: {
        traceDesc: [{ required: true, message: '请输入追溯说明', trigger: 'blur' }],
      },
      uploadConfig: {
        acceptSuffix: '.rar,.zip,.doc,.docx,.pdf,.png,.jpg,.jpeg,.xlsx,.xls,.mp4',
        maxSize: 50,
        maxNum: 9,
      },
      // 弹窗当前显示的文件列表,v-model 双向绑 AisUpload
      fileList: [],
      // 本轮新上传的附件 addOrUpdateParams 暂存(直到点确定才和已上传文件一起提交)
      attachFileList: [],
    };
  },
  computed: {
    customApiConfig () {
      return {
        uploadApi: uploadFile,
        // 替换默认 deleteApi:
        //   1) 调用真实 deleteFile 删服务端;
        //   2) 同步从本组件 fileList 中过滤掉已删除 id,只让本文件从 UI 消失,
        //      不触发 fetch 服务端列表(否则本轮上传未绑定的文件 B 会被冲掉)。
        deleteApi: this.handleDeleteApi,
        addOrUpdateFileApi: addOrUpdateFile,
      };
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.form.id = this.traceOrderId;
        this.form.traceDesc = this.formData.traceDesc || '';
        // 重新打开弹窗时清理状态,避免上次关闭残留影响
        this.fileList = [];
        this.attachFileList = [];
        if (!this.batchMode && this.traceOrderId) {
          this.loadExistingFiles();
        }
      }
    }
  },
  methods: {
    /** 单条模式下加载服务端已有附件 */
    async loadExistingFiles () {
      try {
        const response = await getFileList({
          businessId: this.traceOrderId,
          attachType: '不合格凭证'
        });
        // 兼容 getFileList 直接返回数组 或 { records: [] } 两种结构
        const list = Array.isArray(response) ? response : (response?.records || []);
        this.fileList = list.map(file => {
          const fallbackName = file.fileUrl ? file.fileUrl.split('/').pop()?.split('?')[0] : '';
          return {
            id: file.id,
            name: file.fileName || fallbackName || (file.fileType ? `未命名文件.${file.fileType.toLowerCase()}` : '未命名文件'),
            url: file.fileUrl,
            size: file.fileSize,
            fileType: file.fileType,
            isImage: isFileType(file, 'image'),
            isVideo: isFileType(file, 'video'),
            isPdf: isFileType(file, 'pdf'),
            isExcel: isFileType(file, 'excel'),
            isWord: isFileType(file, 'word'),
            isPPT: isFileType(file, 'ppt'),
            isText: isFileType(file, 'text'),
            isZip: isFileType(file, 'zip'),
            isRar: isFileType(file, 'rar'),
            response: file,
          };
        });
      } catch (e) {
        console.error('加载追溯凭证失败:', e);
      }
    },
    /** 自定义删除接口:AisUpload 删除已上传文件后,默认会 emit('update') 触发父级重新拉服务端列表;
     *  这里替换实现,删除后只过滤本组件 fileList 中对应项,避免覆盖未绑定的本轮上传文件 B 等。 */
    async handleDeleteApi (ids) {
      await deleteFile(ids);
      const idSet = new Set(ids);
      this.fileList = this.fileList.filter(f => !idSet.has(f.id));
    },
    handleUploadLoadingChange (loading) {
      this.submitLoading = loading;
    },
    /** 新文件上传成功:暂存 addOrUpdateParams,等"点确定"再和已上传文件一起提交 */
    handleAddParam (param) {
      this.attachFileList.push(param);
    },
    /** 本轮新上传的文件被删除:同步从 attachFileList 移除对应 param */
    handleRemoveParam (file) {
      const idx = this.attachFileList.findIndex(item => item?.file?.name === file?.name);
      if (idx > -1) {
        this.attachFileList.splice(idx, 1);
      }
    },
    close () {
      this.$emit('update:visible', false);
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        // 合并:已存在(c.response 来自服务端)+本轮上传(addOrUpdateParams 暂存)
        const existingFiles = this.fileList.reduce((p, c) => {
          if (c.response) p.push(c.response);
          return p;
        }, []);
        const newFiles = this.attachFileList.map(p => p.addOrUpdateParams);
        const allFiles = [...existingFiles, ...newFiles];
        if (allFiles.length === 0) {
          this.$message.warning('请上传追溯凭证');
          this.submitLoading = false;
          return;
        }
        this.submitLoading = true;
        if (this.batchMode) {
          batchSubmitForAudit({
            ids: this.traceOrderIds,
            traceDesc: this.form.traceDesc,
            attachFileList: allFiles
          }).then(() => {
            this.$message.success('批量审核下发成功');
            this.close();
            this.$emit('success');
          }).finally(() => {
            this.submitLoading = false;
          });
          return;
        }
        submitAudit({ ...this.form, attachFileList: allFiles }).then(() => {
          this.$message.success('审核下发成功');
          this.close();
          this.$emit('success');
        }).finally(() => {
          this.submitLoading = false;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
