<template>
  <edit-page-layout ref="editLayout" title="">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`业务场景key：${form.bizKey}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template>
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="业务场景key：" prop="bizKey">
                    <el-input
                      placeholder="请输入"
                      v-model="form.bizKey"
                      :disabled="!!_id"
                      maxlength="100"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="接口路径：" prop="path">
                    <el-input
                      placeholder="请输入"
                      v-model="form.path"
                      maxlength="200"
                      clearable
                    />
                  </el-form-item>

                  <el-form-item label="业务场景描述：" prop="bizDesc">
                    <el-input
                      type="textarea"
                      placeholder="请输入"
                      v-model="form.bizDesc"
                      maxlength="500"
                      show-word-limit
                      clearable
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="业务场景key：" prop="bizKey">
                    {{ form.bizKey }}
                  </el-form-item>
                  <el-form-item label="接口路径：" prop="path">
                    {{ form.path }}
                  </el-form-item>
                  <el-form-item label="状态：" prop="statusDesc">
                    {{ form.statusDesc }}
                  </el-form-item>
                  <el-form-item label="业务场景描述：" prop="bizDesc">
                    {{ form.bizDesc }}
                  </el-form-item>
                </el-form>
              </div>
            </section>

            <section v-if="!!_id" class="common-section">
              <div class="common-section-header">
                <h2>视图字段</h2>
              </div>
              <div class="common-section-body">
                <div class="field-table-toolbar">
                  <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAddFieldRow">新增字段</el-button>
                  <el-button
                    size="small"
                    icon="el-icon-refresh"
                    :loading="syncFieldLoading"
                    @click="handleSyncFields"
                  >同步视图字段</el-button>
                </div>
                <el-table
                  v-if="(editable && !!_id) || fieldTableData.length"
                  ref="fieldTableRef"
                  :data="fieldTableData"
                  v-loading="fieldLoading"
                  border
                  stripe
                  size="medium"
                  style="width: 100%"
                  :empty-text="editable ? '点击新增字段添加行' : '暂无字段'"
                >
                  <el-table-column prop="fieldName" label="字段名" min-width="160">
                    <template #default="{ row }">
                      <el-input
                        v-if="row._editing"
                        v-model="row.fieldName"
                        size="small"
                        maxlength="100"
                        placeholder="请输入字段名"
                      />
                      <span v-else>{{ row.fieldName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="fieldLabel" label="字段标签" min-width="160">
                    <template #default="{ row }">
                      <el-input
                        v-if="row._editing"
                        v-model="row.fieldLabel"
                        size="small"
                        maxlength="100"
                        placeholder="请输入字段标签"
                      />
                      <span v-else>{{ row.fieldLabel }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="fieldType" label="字段类型" min-width="120">
                    <template #default="{ row }">
                      <el-select
                        v-if="row._editing"
                        v-model="row.fieldType"
                        size="small"
                        placeholder="请选择"
                        @change="(val) => handleFieldTypeChange(row, val)"
                      >
                        <el-option
                          v-for="opt in fieldTypeOptions"
                          :key="opt.value"
                          :value="opt.value"
                          :label="opt.label"
                        />
                      </el-select>
                      <span v-else>{{ getFieldTypeLabel(row.fieldType) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="fieldEnum" label="字典枚举" min-width="160">
                    <template #default="{ row }">
                      <el-input
                        v-if="row._editing && row.fieldType === 'enum'"
                        v-model="row.fieldEnum"
                        size="small"
                        maxlength="500"
                        placeholder="请输入字典枚举"
                      />
                      <span v-else>{{ row.fieldEnum }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="editable" label="操作" width="160" align="center" fixed="right">
                    <template #default="{ row }">
                      <template v-if="row._editing">
                        <el-button type="text" @click="handleSaveField(row)">保存</el-button>
                        <el-button type="text" @click="handleCancelField(row)">取消</el-button>
                      </template>
                      <template v-else>
                        <el-button type="text" @click="handleEditField(row)">编辑</el-button>
                        <el-popconfirm title="确定要删除这条记录吗？" @confirm="handleRemoveField(row)">
                          <template #reference>
                            <el-button type="text" class="btn-delete">删除</el-button>
                          </template>
                        </el-popconfirm>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </section>
          </el-main>
        </template>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
    <el-dialog
      title="同步视图字段"
      :visible.sync="syncDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @closed="$refs.syncFormRef && $refs.syncFormRef.clearValidate()"
    >
      <el-form
        ref="syncFormRef"
        :model="syncForm"
        :rules="syncFormRules"
        label-width="100px"
      >
        <el-form-item label="数据库：" prop="databaseName">
          <el-select
            v-model="syncForm.databaseName"
            placeholder="请选择数据库"
            style="width: 100%"
          >
            <el-option
              v-for="opt in dbNameOptions"
              :key="opt.value"
              :value="opt.value"
              :label="opt.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="表名：" prop="tableName">
          <el-input
            v-model="syncForm.tableName"
            placeholder="请输入表名"
            maxlength="200"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="syncDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="syncSubmitting" @click="submitSync">确定</el-button>
      </template>
    </el-dialog>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/datareport/customViewMain';
import { list, addOrUpdateField, deleteItems, syncDdlFields } from '@/api/datareport/customViewField';
import EditBaseContainer from '@/libs/components/EditBaseContainer/index.vue';
import EditPageLayout from '@/libs/components/EditPageLayout/index.vue';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: '文本' },
  { value: 'date', label: '日期' },
  { value: 'number', label: '数字' },
  { value: 'enum', label: '枚举' }
];

const defaultForm = {
  bizKey: '',
  bizDesc: '',
  path: '',
  status: '',
  statusDesc: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  createTime: '',
  updateTime: ''
};

export default {
  name: 'customViewMainEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    showBackBtn: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    EditPageLayout,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    editable () {
      return this.isEditing || !this._id;
    }
  },
  watch: {
    'form.bizKey': {
      immediate: true,
      handler () {
        if (!this._id) return;
        this.loadFields();
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '自定义视图元数据主表',
      pageType: 'edit',
      moduleKey: 'AISMC-customViewMain',
      loading: false,
      submitLoading: false,
      fieldLoading: false,
      syncFieldLoading: false,
      syncDialogVisible: false,
      syncSubmitting: false,
      syncForm: {
        databaseName: '',
        tableName: ''
      },
      dbNameOptions: [
        { value: 'app_ais_datacenter', label: '主数据' },
        { value: 'app_ais_claim', label: '索赔与旧件' },
        { value: 'app_ais_sparepart', label: '备件' },
        { value: 'app_ais_maintenance', label: '维保' },
        { value: 'app_ais_vehretail', label: '零售' },
        { value: 'app_ais_vehwholesale', label: '批售' },
        { value: 'app_ais_vehstock', label: '整车库存' }
      ],
      syncFormRules: {
        databaseName: [
          { required: true, message: '请选择数据库', trigger: 'change' }
        ],
        tableName: [
          { required: true, message: '请输入表名', trigger: 'blur' }
        ]
      },
      fieldTableData: [],
      fieldTypeOptions: FIELD_TYPE_OPTIONS,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        bizKey: [
          { required: true, message: '请输入业务场景key', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入接口路径', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form }).then(res => {
        this.loadFields();
        return res;
      });
    },
    loadFields () {
      const bizKey = this.form.bizKey;
      if (!bizKey) {
        this.fieldTableData = [];
        return;
      }
      this.fieldLoading = true;
      list(bizKey)
        .then(res => {
          this.fieldTableData = Array.isArray(res) ? res : [];
        })
        .catch(err => {
          console.error('获取视图字段失败:', err);
          this.fieldTableData = [];
        })
        .finally(() => {
          this.fieldLoading = false;
        });
    },
    getFieldTypeLabel (value) {
      const item = FIELD_TYPE_OPTIONS.find(opt => opt.value === value);
      return item ? item.label : value || '';
    },
    handleAddFieldRow () {
      if (!this.editable) return;
      const newRow = {
        _isNew: true,
        _editing: true,
        _snapshot: null,
        fieldName: '',
        fieldLabel: '',
        fieldType: 'text',
        fieldEnum: ''
      };
      this.fieldTableData.unshift(newRow);
    },
    handleEditField (row) {
      if (!this.editable) return;
      this.$set(row, '_snapshot', { ...row });
      this.$set(row, '_editing', true);
    },
    handleCancelField (row) {
      if (row._isNew) {
        const idx = this.fieldTableData.indexOf(row);
        if (idx > -1) this.fieldTableData.splice(idx, 1);
        return;
      }
      if (row._snapshot) {
        Object.assign(row, row._snapshot);
      }
      this.$set(row, '_editing', false);
    },
    handleFieldTypeChange (row, value) {
      if (value !== 'enum' && row.fieldEnum) {
        row.fieldEnum = '';
      }
    },
    validateField (row) {
      if (!row.fieldName) {
        this.$message.warning('请输入字段名');
        return false;
      }
      if (!row.fieldLabel) {
        this.$message.warning('请输入字段标签');
        return false;
      }
      if (!row.fieldType) {
        this.$message.warning('请选择字段类型');
        return false;
      }
      return true;
    },
    handleSaveField (row) {
      if (!this.validateField(row)) return;
      const payload = {
        id: row.id,
        bizKey: this.form.bizKey,
        fieldName: row.fieldName,
        fieldLabel: row.fieldLabel,
        fieldType: row.fieldType,
        fieldEnum: row.fieldType === 'enum' ? (row.fieldEnum || '') : ''
      };
      addOrUpdateField(payload).then(() => {
        this.$message.success(row.id ? '更新成功' : '新增成功');
        this.loadFields();
      }).catch(() => {
        // 保留编辑态以便用户修正
      });
    },
    handleRemoveField (row) {
      if (!row.id) {
        const idx = this.fieldTableData.indexOf(row);
        if (idx > -1) this.fieldTableData.splice(idx, 1);
        return;
      }
      deleteItems([row.id]).then(() => {
        this.$message.success('删除成功');
        this.loadFields();
      }).catch(() => {
        // 保留行不变
      });
    },
    handleSyncFields () {
      if (!this.form.bizKey) {
        this.$message.warning('业务场景key为空,无法同步');
        return;
      }
      this.syncForm.databaseName = '';
      this.syncForm.tableName = '';
      this.syncDialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.syncFormRef) this.$refs.syncFormRef.clearValidate();
      });
    },
    submitSync () {
      this.$refs.syncFormRef.validate(valid => {
        if (!valid) return;
        this.syncSubmitting = true;
        syncDdlFields({
          bizKey: this.form.bizKey,
          databaseName: this.syncForm.databaseName,
          tableName: this.syncForm.tableName
        }).then(() => {
          this.$message.success('同步成功');
          this.syncDialogVisible = false;
          this.loadFields();
        }).catch(() => {
          // 保留弹框便于修改
        }).finally(() => {
          this.syncSubmitting = false;
        });
      });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>
