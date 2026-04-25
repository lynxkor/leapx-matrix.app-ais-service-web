<!-- 附件分类明细对话框 -->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    width="1000px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="附件分类名称" prop="attachType">
            <el-input v-model="formData.attachType" placeholder="请输入附件分类名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需要 OCR" prop="needOcr">
            <el-select v-model="formData.needOcr" placeholder="请选择" style="width: 100%">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="至少数量" prop="minNum">
            <el-input-number v-model="formData.minNum" :min="0" :max="999" :controls="false" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="至多数量" prop="maxNum">
            <el-input-number v-model="formData.maxNum" :min="0" :max="999" :controls="false" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="附件大小限制 (M)" prop="maxSize">
            <el-input-number v-model="formData.maxSize" :min="1" :max="100" :controls="false" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否必填" prop="required">
            <el-radio-group v-model="formData.required">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- OCR回调地址 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="OCR回调地址" prop="callbackUrl">
            <el-input
              v-model="formData.callbackUrl"
              placeholder="请输入OCR回调地址"
              :disabled="formData.needOcr !== '1'"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 文件类型 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="文件后缀" prop="acceptSuffix">
            <el-input
              v-model="formData.acceptSuffix"
              placeholder="请输入文件格式，如：.png,.jpg,.pdf"
              @blur="formatFileTypes"
            />
            <div class="form-item-tip">支持用户自定义上传文件格式，每个文件格式使用英文逗号隔开</div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 是否默认 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="是否自定义" prop="isDefault">
            <el-radio-group v-model="formData.isDefault">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 判断条件 -->
      <el-row :gutter="20" v-if="formData.isDefault === '1'">
        <el-col :span="24">
          <el-form-item label="判断条件">
            <condition ref="conditionRef" :config-code="configCode" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addOrUpdateConfigDetail, getConfigDetailDetail } from '@/libs/api/attachment';
import Condition from './Condition';

export default {
  name: 'AttachedFilesDialog',
  components: {
    Condition
  },
  props: {
    // 附件配置 ID
    attachmentConfigId: {
      type: [String, Number],
      default: ''
    },
    // 配置编码
    configCode: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    const validateMaxCount = (rule, value, callback) => {
      if (value < this.formData.minNum) {
        callback(new Error('至多数量不能小于至少数量'));
      } else {
        callback();
      }
    };

    return {
      title: '新增附件分类',
      dialogVisible: false,
      isEditMode: false,
      currentEditId: '',
      formData: {
        id: '',
        attachType: '',
        needOcr: '0',
        required: '1',
        minNum: 0,
        maxNum: 1,
        maxSize: 10,
        acceptSuffix: '',
        callbackUrl: '',
        isDefault: '0',
        conditionJson: '',
        expression: '',
        remark: '',
        dataSource: 150
      },
      formRules: {
        attachType: [
          { required: true, message: '请输入附件分类名称', trigger: 'blur' },
          { max: 50, message: '分类名称不能超过 50 个字符', trigger: 'blur' }
        ],
        needOcr: [
          { required: true, message: '请选择是否需要 OCR', trigger: 'change' }
        ],
        minNum: [
          { required: true, message: '请输入至少数量', trigger: 'blur' },
          { type: 'number', min: 0, max: 999, message: '数量范围应在 0-999 之间', trigger: 'blur' }
        ],
        maxNum: [
          { required: true, message: '请输入至多数量', trigger: 'blur' },
          { type: 'number', min: 0, max: 999, message: '数量范围应在 0-999 之间', trigger: 'blur' },
          { validator: validateMaxCount, trigger: 'blur' }
        ],
        maxSize: [
          { required: true, message: '请输入附件大小限制', trigger: 'blur' },
          { type: 'number', min: 1, max: 100, message: '大小限制范围应在 1-100MB 之间', trigger: 'blur' }
        ],
        acceptSuffix: [
          { required: true, message: '请输入文件类型', trigger: 'blur' }
        ],
        required: [
          { required: true, message: '请选择是否必填', trigger: 'change' }
        ],
        isDefault: [
          { required: true, message: '请选择是否默认', trigger: 'change' }
        ]
      }
    };
  },
  watch: {
    dialogVisible (val) {
      if (val) {
        // 编辑模式时，加载详情数据
        if (this.isEditMode && this.currentEditId) {
          this.loadDetail();
        } else {
          // 新增模式，重置表单
          this.resetForm();
        }
      }
    },
    'formData.isDefault' (val) {
      // 当是否默认变化时，Condition 组件显示/隐藏
      if (val === '1' && this.$refs.conditionRef) {
        this.$nextTick(() => {
          this.$refs.conditionRef.resetConditions();
        });
      }
    }
  },
  methods: {
    // 显示对话框
    show (isEdit = false, rowId = '') {
      this.isEditMode = isEdit;
      this.currentEditId = rowId;
      this.title = isEdit ? '编辑附件分类' : '新增附件分类';
      this.dialogVisible = true;
    },
    // 加载详情数据
    loadDetail () {
      if (!this.currentEditId) {
        this.resetForm();
        return;
      }
      // 调用详情接口获取数据
      getConfigDetailDetail(this.currentEditId).then(res => {
        const data = res;
        if (data) {
          this.formData = {
            ...this.formData,
            ...data,
            // 确保类型正确
            needOcr: String(data.needOcr || '0'),
            required: String(data.required || '1'),
            isDefault: String(data.isDefault || '0'),
            acceptSuffix: data.acceptSuffix || '',
            attachType: data.attachType || '',
            conditionJson: data.conditionJson || ''
          };
          // 回显条件数据
          this.$nextTick(() => {
            if (this.formData.isDefault === '1' && this.$refs.conditionRef && this.formData.conditionJson) {
              try {
                const conditions = JSON.parse(this.formData.conditionJson);
                this.$refs.conditionRef.setConditions(conditions);
              } catch (e) {
                console.error('解析条件失败', e);
              }
            }
          });
        }
      }).catch(err => {
        console.error('加载详情失败', err);
      });
    },
    // 重置表单
    resetForm () {
      this.formData = {
        id: '',
        attachType: '',
        needOcr: '0',
        required: '1',
        minNum: 0,
        maxNum: 1,
        maxSize: 10,
        acceptSuffix: '.png,.jpg,.jpeg,.gif,.pdf,.ppt,.pptx,.xlsx,.xls,.docx,.doc,.rar,.zip,.mp4',
        callbackUrl: '',
        isDefault: '0',
        conditionJson: '',
        expression: '',
        remark: '',
        dataSource: 150
      };
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate();
      }
    },
    // 格式化文件类型，去除空格
    formatFileTypes () {
      if (this.formData.acceptSuffix) {
        // 去除空格，确保使用英文逗号
        this.formData.acceptSuffix = this.formData.acceptSuffix.replace(/\s*,\s*/g, ',').replace(/\s+/g, '');
      }
    },
    handleClose () {
      this.dialogVisible = false;
      this.isEditMode = false;
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate();
      }
    },
    handleSubmit () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 如果是默认，获取 Condition 组件的数据
          if (this.formData.isDefault === '1') {
            if (this.$refs.conditionRef) {
              const conditions = this.$refs.conditionRef.getConditions();
              this.formData.conditionJson = JSON.stringify(conditions);
            }
          } else {
            // 不是默认，清空条件
            this.formData.conditionJson = '';
          }

          // 构建提交参数
          const params = {
            ...this.formData,
            attachmentConfigId: this.attachmentConfigId || this.formData.attachmentConfigId || '',
            dataSource: 150,
            // conditionJson 已经在第 287 行转成字符串了，这里不需要再转
          };
          if (!this.formData.id) {
            delete params.id;
          }
          if (!this.formData.conditionJson) {
            delete params.conditionJson;
          }
          addOrUpdateConfigDetail(params).then(() => {
            this.$message({
              type: 'success',
              message: this.isEditMode ? '修改成功' : '新增成功'
            });
            this.$emit('confirm', params);
            this.handleClose();
          }).catch(err => {
            console.error('保存失败', err);
            // 保存失败时也关闭对话框，让父组件的列表保持原状
            this.handleClose();
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}
::v-deep .el-input-number {
  width: 100%;
}
.form-item-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  margin-top: 5px;
}
</style>
