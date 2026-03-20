<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="条件配置列表"
    width="1000px"
    @close="handleClose"
  >
    <!-- 搜索区域 -->
    <!-- <el-form
      :inline="true"
      :model="searchForm"
      size="small"
      label-width="80px"
      class="dialog-search-form"
    >
      <el-form-item label="条件名称">
        <el-input
          placeholder="请输入"
          v-model="searchForm.conditionNameLike"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="条件编码">
        <el-input
          placeholder="请输入"
          v-model="searchForm.conditionCodeLike"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="字段类型">
        <el-select
          placeholder="请选择"
          v-model="searchForm.fieldType"
          clearable
          style="width: 120px"
        >
          <el-option
            v-for="option in fieldTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form> -->

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
        <el-table-column prop="conditionName" label="条件名称" min-width="120" />
        <el-table-column prop="conditionCode" label="条件编码" min-width="120" />
        <el-table-column prop="fieldType" label="字段类型" min-width="100">
          <template #default="{ row }">
            {{ getFieldTypeName(row.fieldType) }}
          </template>
        </el-table-column>
        <el-table-column prop="fieldValue" label="字段值" min-width="150" />
        <el-table-column prop="operator" label="逻辑判断" min-width="100">
          <template #default="{ row }">
            {{ getOperatorName(row.operator) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'info'" size="small">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="80" />
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
            <el-button
              type="text"
              size="small"
              class="btn-delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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
      width="800px"
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
            <el-form-item label="条件名称" prop="conditionName">
              <el-input v-model="formData.conditionName" placeholder="请输入条件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条件编码" prop="conditionCode">
              <el-input
                v-model="formData.conditionCode"
                placeholder="请输入条件编码"
                :disabled="!!formData.id"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字段类型" prop="fieldType">
              <el-select
                v-model="formData.fieldType"
                placeholder="请选择字段类型"
                style="width: 100%"
              >
                <el-option
                  v-for="option in fieldTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段值" prop="fieldValue">
              <el-input v-model="formData.fieldValue" placeholder="请输入字段值" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="逻辑判断" prop="operator">
              <el-select
                v-model="formData.operator"
                placeholder="请选择逻辑判断"
                style="width: 100%"
              >
                <el-option
                  v-for="option in operatorOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="formData.status"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number
                v-model="formData.sort"
                :min="0"
                :max="999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
  attachmentConfigConditionAddOrUpdate,
  attachmentConfigConditionList
} from '@/libs/api/attachment';

const defaultForm = {
  id: '',
  conditionName: '',
  conditionCode: '',
  fieldType: '',
  fieldValue: '',
  operator: '',
  status: '1',
  sort: 0,
  remark: ''
};

export default {
  name: 'AttachmentConfigDetailDialog',
  props: {
  },
  data () {
    return {
      dialogVisible: false,
      formDialogVisible: false,
      loading: false,
      submitLoading: false,
      isEditMode: false,
      // 搜索表单
      searchForm: {
        // conditionNameLike: '',
        // conditionCodeLike: '',
        // fieldType: ''
      },
      // 表格数据
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      // 表单数据
      formData: { ...defaultForm },
      formRules: {
        conditionName: [
          { required: true, message: '请输入条件名称', trigger: 'blur' }
        ],
        conditionCode: [
          { required: true, message: '请输入条件编码', trigger: 'blur' }
        ],
        fieldType: [
          { required: true, message: '请选择字段类型', trigger: 'change' }
        ],
        fieldValue: [
          { required: true, message: '请输入字段值', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '请选择逻辑判断', trigger: 'change' }
        ]
      },
      // 选项数据
      fieldTypeOptions: [
        { label: '车系', value: 'carSeries' },
        { label: '车型', value: 'carModle' },
        { label: '年款', value: 'yearType' },
        { label: '合作类型', value: 'cooperationType' },
        { label: '所属区域', value: 'region' }
      ],
      operatorOptions: [
        { label: '等于', value: '=' },
        { label: '不等于', value: '!=' },
        { label: '大于', value: '>' },
        { label: '小于', value: '<' },
        { label: '大于等于', value: '>=' },
        { label: '小于等于', value: '<=' },
        { label: '包含', value: 'contains' },
        { label: '不包含', value: 'not_contains' }
      ],
      selectionList: []
    };
  },
  computed: {
    formTitle () {
      return this.isEditMode ? '编辑条件' : '新增条件';
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
      this.resetSearch();
    },
    // 关闭表单对话框
    handleFormClose () {
      this.formDialogVisible = false;
      this.isEditMode = false;
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate();
      }
    },
    // 获取表格数据
    getData () {
      this.loading = true;
      const params = {
        ...this.searchForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };

      attachmentConfigConditionPage(params)
        .then(res => {
          const records = res.data?.records || [];
          this.tableData = records;
          this.total = res.data?.totals || 0;
        })
        .catch(err => {
          console.error('获取条件列表失败', err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 搜索
    handleSearch () {
      this.pageNum = 1;
      this.getData();
    },
    // 重置
    handleReset () {
      this.searchForm = {
        conditionNameLike: '',
        conditionCodeLike: '',
        fieldType: ''
      };
      this.handleSearch();
    },
    // 重置搜索条件
    resetSearch () {
      this.searchForm = {
        conditionNameLike: '',
        conditionCodeLike: '',
        fieldType: ''
      };
    },
    // 新增
    handleAdd () {
      this.isEditMode = false;
      this.formData = { ...defaultForm, status: '1', sort: 0 };
      this.formDialogVisible = true;
    },
    // 编辑
    handleEdit (row) {
      this.isEditMode = true;
      // 调用详情接口
      attachmentConfigConditionDetail(row.id)
        .then(res => {
          const data = res.data || res;
          if (data) {
            this.formData = {
              ...defaultForm,
              ...data,
              status: String(data.status || '1')
            };
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
          isDelete: true
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
          this.submitLoading = true;
          const params = {
            ...this.formData,
            dataSource: 150
          };
          if (!params.id) {
            delete params.id;
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
    // 获取逻辑判断名称
    getOperatorName (value) {
      const option = this.operatorOptions.find(item => item.value === value);
      return option ? option.label : value;
    },
    // 获取字段选项列表（供 Condition.vue 调用）
    getFieldOptions () {
      return new Promise((resolve, reject) => {
        // 获取所有启用的条件数据
        attachmentConfigConditionList({ status: '1', pageNum: 1, pageSize: 100 })
          .then(res => {
            const records = res.data?.records || [];
            const options = records.map(item => ({
              label: item.conditionName,
              value: item.conditionCode,
              fieldType: item.fieldType,
              fieldValue: item.fieldValue
            }));
            resolve(options);
          })
          .catch(err => {
            console.error('获取字段选项失败', err);
            reject(err);
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-search-form {
  margin-bottom: 16px;
}

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
</style>
