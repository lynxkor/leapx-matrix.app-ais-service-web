<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="补充条件配置"
    width="1000px"
    @close="handleClose"
  >
    <!-- 操作按钮 -->
    <div class="dialog-actions">
      <el-button type="primary" size="small" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i> 新增条件</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="dialog-table-wrapper" v-loading="loading">
      <el-table
        ref="tableRef"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        max-height="400"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="fieldLabel" label="字段显示名称" min-width="120" />
        <el-table-column prop="fieldName" label="字段名称" min-width="120" />
        <el-table-column prop="fieldType" label="字段类型" min-width="100">
          <template #default="{ row }">
            {{ getFieldTypeName(row.fieldType) }}
          </template>
        </el-table-column>
        <el-table-column prop="valueSource" label="值来源" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              type="text"
              size="small"
              class="btn-edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <!-- <el-button
              type="text"
              size="small"
              class="btn-delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="dialog-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 新增/编辑表单对话框 -->
    <el-dialog
      :visible.sync="formDialogVisible"
      :title="formTitle"
      width="900px"
      :append-to-body="true"
      @close="handleFormClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字段显示名称" prop="fieldLabel">
              <el-input v-model="formData.fieldLabel" placeholder="请输入字段显示名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段名称" prop="fieldName">
              <el-input
                v-model="formData.fieldName"
                placeholder="请输入字段名称"
                :disabled="!!formData.id"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字段类型" prop="fieldType">
              <fetch-select
                :request="fetchOptions"
                enumCode="attachment_config_condition_type"
                v-model="formData.fieldType"
                placeholder="请选择字段类型"
                @change="handleFieldTypeChange"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配置编码" prop="configCode">
              <el-input
                v-model="formData.configCode"
                placeholder="请输入配置编码"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="值来源" prop="valueSource" :rules="formData.fieldType !== 'text' ? [{ required: true, message: '请填写值来源', trigger: 'blur' }] : []">
              <el-input
                v-model="formData.valueSource"
                :placeholder="valueSourcePlaceholder"
                type="textarea"
                :rows="2"
              />
              <div class="form-item-tip">
                <span v-if="formData.fieldType === 'dict'">填写 dictCode，如：GenderEnum</span>
                <span v-else-if="formData.fieldType === 'url'">填写接口 URL，如：/api/user/list</span>
                <span v-else>文本类型无需填写</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 条件配置区域 -->
        <!-- <el-row :gutter="20" v-if="formData.fieldType === 'url'">
          <el-col :span="24">
            <el-divider content-position="left">补充条件配置</el-divider>
            <Condition ref="conditionRef" />
          </el-col>
        </el-row> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleFormClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  attachmentConfigConditionPage,
  attachmentConfigConditionDetail,
  attachmentConfigConditionAddOrUpdate
} from '@/libs/api/attachment';
import { getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  id: '',
  configCode: '',
  fieldName: '',
  fieldLabel: '',
  fieldType: '',
  valueSource: '',
  remark: '',
  dataSource: 150,
  attachmentConfigId: ''
};

export default {
  name: 'AttachmentConfigDetailDialog',
  props: {
    // 附件配置 ID（从父组件传递）
    attachmentConfigId: {
      type: [String, Number],
      default: ''
    },
    // 配置编码（从父组件传递，即 configCode）
    configCode: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    FetchSelect
  },
  data () {
    // 校验只能输入非中文（英文、数字、下划线等）
    const validateNonChinese = (_, value, callback) => {
      if (value && /[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error('不能输入中文'));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      formDialogVisible: false,
      loading: false,
      submitLoading: false,
      isEditMode: false,
      // 表格数据
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // 表单数据
      formData: { ...defaultForm },
      formRules: {
        fieldLabel: [
          { required: true, message: '请输入字段显示名称', trigger: 'blur' }
        ],
        fieldName: [
          { required: true, message: '请输入字段名称', trigger: 'blur' },
          { validator: validateNonChinese, trigger: 'blur' }
        ],
        fieldType: [
          { required: true, message: '请选择字段类型', trigger: 'change' }
        ]
      },
      // 选项数据
      fieldTypeOptions: [
        { label: '文本', value: 'text' },
        { label: '枚举', value: 'dict' },
        { label: '接口', value: 'uel' }
      ],
      selectionList: []
    };
  },
  computed: {
    formTitle () {
      return this.isEditMode ? '编辑条件' : '新增条件';
    },
    valueSourcePlaceholder () {
      if (this.formData.fieldType === 'dict') {
        return '填写 dictCode，如：GenderEnum';
      } else if (this.formData.fieldType === 'url') {
        return '填写接口 URL，如：/api/user/list';
      } else if (this.formData.fieldType === 'text') {
        return '文本类型无需填写';
      }
      return '请选择字段类型后填写';
    }
  },
  watch: {
    configCode: {
      handler (val) {
        if (val) {
          this.formData.configCode = val;
        }
      },
      immediate: true
    }
  },
  methods: {
    // 打开对话框
    show () {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.getData();
      });
    },
    // 关闭对话框
    handleClose () {
      this.dialogVisible = false;
    },
    // 关闭表单对话框
    handleFormClose () {
      this.formDialogVisible = false;
      this.isEditMode = false;
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate();
      }
      // 不清空 Condition 组件的数据，保留以便下次编辑
    },
    // 获取表格数据
    getData () {
      this.loading = true;
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      // 如果有 attachmentConfigId，则传递
      if (this.attachmentConfigId) {
        params.attachmentConfigId = this.attachmentConfigId;
      }

      attachmentConfigConditionPage(params)
        .then(res => {
          const records = res.records || [];
          this.tableData = records;
          this.total = res.totals || 0;
        })
        .catch(err => {
          console.error('获取条件列表失败', err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 新增
    handleAdd () {
      this.isEditMode = false;
      this.formData = {
        ...defaultForm,
        configCode: this.configCode,
        attachmentConfigId: this.attachmentConfigId,
        conditionJson: '' // 新增时清空条件数据
      };
      // 重置 Condition 组件为默认状态
      if (this.$refs.conditionRef) {
        this.$refs.conditionRef.resetConditions();
      }
      this.formDialogVisible = true;
    },
    // 编辑
    handleEdit (row) {
      this.isEditMode = true;
      // 调用详情接口
      attachmentConfigConditionDetail(row.id)
        .then(res => {
          const data = res;
          if (data) {
            this.formData = {
              ...defaultForm,
              ...data
            };
            // 回显条件数据
            if (data.conditionJson) {
              try {
                const conditions = JSON.parse(data.conditionJson);
                this.$nextTick(() => {
                  if (this.$refs.conditionRef) {
                    this.$refs.conditionRef.setConditions(conditions);
                  }
                });
              } catch (e) {
                console.error('解析条件失败', e);
              }
            }
            this.formDialogVisible = true;
          }
        })
        .catch(err => {
          console.error('获取详情失败', err);
        });
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确定要删除该条件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitLoading = true;
        attachmentConfigConditionAddOrUpdate({
          ...row,
          isDelete: true,
          dataSource: 150
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getData();
            this.$emit('confirm');
          })
          .catch(err => {
            console.error('删除失败', err);
          })
          .finally(() => {
            this.submitLoading = false;
          });
      }).catch(() => {});
    },
    // 提交表单
    handleSubmit () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 如果是 url 类型，需要校验 Condition 组件的数据
          if (this.formData.fieldType === 'url') {
            const conditions = this.$refs.conditionRef ? this.$refs.conditionRef.getConditions() : [];
            const validateResult = this.validateConditions(conditions);
            if (!validateResult.valid) {
              this.$message({
                type: 'warning',
                message: validateResult.message
              });
              return;
            }
            // 校验通过，将条件数据转成 JSON 字符串
            this.formData.conditionJson = JSON.stringify(conditions);
          }
          // 非 url 类型，保留之前的 conditionJson 数据

          this.submitLoading = true;
          const params = {
            ...this.formData,
            dataSource: 150
          };
          if (!params.id) {
            delete params.id;
          }
          // 若 conditionJson 为空字符串或空对象，则不传递
          if (!params.conditionJson || params.conditionJson === '') {
            delete params.conditionJson;
          }

          attachmentConfigConditionAddOrUpdate(params)
            .then(() => {
              this.$message({
                type: 'success',
                message: this.isEditMode ? '修改成功' : '新增成功'
              });
              this.formDialogVisible = false;
              this.getData();
              // 通知父组件数据已更新
              this.$emit('confirm');
            })
            .catch(err => {
              console.error('保存失败', err);
            })
            .finally(() => {
              this.submitLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 校验 Condition 组件的数据
    // Condition 数据结构：[{ dataList: [{ field, fieldType, operator, value, valueSource }] }]
    validateConditions (conditions) {
      if (!conditions || conditions.length === 0) {
        return { valid: true, message: '' };
      }

      let hasEmptyField = false; // 是否有字段未填写
      let hasFilledField = false; // 是否有已填写的字段

      // 遍历所有条件组
      for (const condition of conditions) {
        if (!condition.dataList || condition.dataList.length === 0) {
          continue;
        }
        // 遍历每个条件项
        for (const item of condition.dataList) {
          const hasValue = item.value !== '' && item.value !== null && item.value !== undefined;
          const hasOperator = item.operator !== '' && item.operator !== null && item.operator !== undefined;

          if (hasValue && hasOperator) {
            hasFilledField = true;
          } else if (item.field && item.field !== '') {
            // 如果选择了字段但没有填写值或操作符
            hasEmptyField = true;
          }
        }
      }

      // 如果没有填写任何条件，则通过校验（不提取）
      if (!hasFilledField && !hasEmptyField) {
        return { valid: true, message: '' };
      }

      // 如果部分填写，则要求全部填写
      if (hasFilledField && hasEmptyField) {
        return { valid: false, message: '补充条件存在未填写完整的项，请全部填写或全部留空' };
      }

      // 如果全部填写，则通过校验
      if (hasFilledField && !hasEmptyField) {
        return { valid: true, message: '' };
      }

      return { valid: true, message: '' };
    },
    // 分页变化
    handlePageChange (page) {
      this.pageNum = page;
      this.getData();
    },
    // 每页条数变化
    handleSizeChange (size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getData();
    },
    // 选择变化
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    // 获取字段类型名称
    getFieldTypeName (value) {
      const option = this.fieldTypeOptions.find(item => item.value === value);
      return option ? option.label : value;
    },
    // 字段类型变化
    handleFieldTypeChange (val, row) {
      console.log('字段类型变化', val, row);
      // 清空值来源
      this.formData.valueSource = '';
      // 如果是 dict 或 url 类型，需要从 row 中获取 valueSource
      if (row && row.valueSource) {
        this.formData.valueSource = row.valueSource;
      }
      // 如果从 url 类型切换走，不清空 conditionJson，保留数据
      // 如果是切换回 url 类型，也不清空，保留之前的数据
    },
    // 获取字段选项列表（供 Condition.vue 调用）
    getFieldOptions () {
      return new Promise((resolve, reject) => {
        // 获取所有启用的条件数据
        attachmentConfigConditionPage({ pageNum: 1, pageSize: 100 })
          .then(res => {
            const records = res.records || [];
            const options = records.map(item => ({
              label: item.fieldLabel,
              value: item.fieldName,
              fieldType: item.fieldType,
              valueSource: item.valueSource
            }));
            resolve(options);
          })
          .catch(err => {
            console.error('获取字段选项失败', err);
            reject(err);
          });
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-actions {
  margin-bottom: 16px;
}

.dialog-table-wrapper {
  min-height: 400px;
}

.dialog-pagination {
  margin-top: 16px;
  text-align: right;
}

.btn-edit {
  color: var(--leap-color-primary);
  cursor: pointer;
  margin-right: 10px;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
}

.btn-delete {
  color: #f56c6c;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
}

.dialog-footer {
  text-align: right;
}

.form-item-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  margin-top: 5px;
}
</style>
