<template>
  <div>
    <edit-page-layout ref="editLayout" title="附件配置明细" showPaneFooter>
      <template #left>
        <edit-base-container
          ref="containerRef"
          :id="_id"
          :title="title"
          :isEditing.sync="isEditing"
          :form.sync="form"
          :originalForm.sync="originalForm"
          :submitRequest="submitRequest"
          :detailRequest="detailRequest"
        >
          <template #status>
            <!-- 支持 primary,warning,success,danger 等状态 -->
          </template>
          <template #extraButtons>
          </template>
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>实体信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 自行调整 label-width="150px"，使得 label 不换行 -->
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="实体显示名称：" prop="configName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.configName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="实体名称：" prop="configCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.configCode"
                      clearable
                      :disabled="!!_id"
                    />
                  </el-form-item>
                  <el-form-item label="创建人：" prop="modifierName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.modifierName"
                      clearable
                      :disabled="!!_id"
                    />
                  </el-form-item>
                  <el-form-item label="创建时间：" prop="createTime">
                    <el-input
                      placeholder="请输入"
                      v-model="form.createTime"
                      clearable
                      :disabled="!!_id"
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="实体显示名称：">
                    {{ form.configName }}
                  </el-form-item>
                  <el-form-item label="实体名称：">
                    {{ form.configCode }}
                  </el-form-item>
                  <el-form-item label="创建人：">
                    {{ form.modifierName }}
                  </el-form-item>
                  <el-form-item label="创建时间：">
                    {{ form.createTime }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <section class="common-section" v-if="_id">
              <div class="common-section-header">
                <h2>附件分类明细</h2>
              </div>
              <div class="common-section-body">
                <div class="common-section-header" v-if="isEditing || !_id">
                  <div class="ais-select-group">
                    <el-button size="small" @click="handleAddRow">新增</el-button>
                    <el-button size="small" @click="handlConfigCondition">补充配置条件查看</el-button>
                  </div>
                </div>
                <div class="common-section-table">
                  <vxe-table
                    ref="tableRef"
                    stripe
                    :data="detailList"
                    show-overflow
                    resizable
                    border="inner"
                    size="medium"
                    min-height="0"
                    max-height="400px"
                  >
                    <vxe-column field="attachType" title="附件分类名称" min-width="15%" />
                    <vxe-column field="needOcr" title="是否 OCR 识别" min-width="10%">
                      <template #default="{ row }">
                        {{ row.needOcr === '1' ? '是' : '否' }}
                      </template>
                    </vxe-column>
                    <vxe-column field="required" title="是否必传" min-width="10%">
                      <template #default="{ row }">
                        {{ row.required === '1' ? '是' : '否' }}
                      </template>
                    </vxe-column>
                    <vxe-column field="maxNum" title="至多数量" min-width="10%" />
                    <vxe-column field="minNum" title="至少数量" min-width="10%" />
                    <vxe-column field="maxSize" title="附件大小限制 (M)" min-width="12%" />
                    <vxe-column field="acceptSuffix" title="文件后缀" min-width="15%" />
                    <vxe-column title="操作" width="180" v-if="isEditing || !_id">
                      <template #default="{ rowIndex }">
                        <span class="btn-edit" @click="handleEditRow(rowIndex)">编辑</span>
                        <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                          <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                        </el-popconfirm>
                      </template>
                    </vxe-column>
                    <template #empty>
                      <div class="m-vxe-table-empty-text">暂无数据</div>
                    </template>
                  </vxe-table>
                </div>
              </div>
            </section>
          </el-main>
        </edit-base-container>
      </template>
      <template #right>
        <div class="page-common-edit">
          <!-- 右侧栏组件，自行开发 -->
        </div>
      </template>
    </edit-page-layout>

    <!-- 附件分类明细对话框 -->
    <attached-files-dialog
      ref="attachedFilesDialog"
      :attachment-config-id="form.id"
      @confirm="handleAttachedFilesConfirm"
    />
    <!-- 条件配置列表对话框（用于 Condition 组件获取 fieldOptions） -->
    <attachment-config-detail-dialog
      ref="conditionConfigDialog"
      :attachment-config-id="form.id"
      :config-code="form.configCode"
    />
  </div>
</template>

<script>
import { getConfigDetail, addOrUpdateConfig, geConfigDetailList, deleteConfigDetail, attachmentConfigConditionList } from '@/libs/api/attachment';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import AttachedFilesDialog from './components/attachedFilesDialog.vue';
import AttachmentConfigDetailDialog from './components/AttachmentConfigDetailDialog.vue';

const defaultForm = {
  configName: '',
  configCode: '',
  remark: '',
  detailList: []
};

export default {
  name: 'attachmentConfigEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    AttachedFilesDialog,
    AttachmentConfigDetailDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '实体显示名称：' + (this.form.configName || '');
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefaultForm();
    // 校验只能输入中文
    const validateChinese = (_, value, callback) => {
      if (value && !/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('只能输入中文'));
      } else {
        callback();
      }
    };
    // 校验只能输入非中文（英文、数字、下划线等）
    const validateNonChinese = (_, value, callback) => {
      if (value && /[\u4e00-\u9fa5]/.test(value)) {
        callback(new Error('不能输入中文'));
      } else {
        callback();
      }
    };
    return {
      pageTitle: '附件配置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISFILE-attachmentConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      detailList: [],
      // 对话框数据
      currentEditIndex: null,
      rules: {
        configName: [
          { required: true, message: '请输入实体显示名称', trigger: 'change' },
          { validator: validateChinese, trigger: 'blur' }
        ],
        configCode: [
          { required: true, message: '请输入实体名称', trigger: 'change' },
          { validator: validateNonChinese, trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {},
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getConfigDetail(id).then(res => {
          const formData = res.data;
          this.$nextTick(() => {
            this.loadConfigDetailList(formData);
          });
          return formData;
        });
      }
    },
    // 加载附件配置明细分页数据
    loadConfigDetailList (formData) {
      const configId = formData.id || this.form.id;
      if (!configId) return;
      geConfigDetailList({ attachmentConfigId: configId }).then(res => {
        const records = res.data;
        console.log('附件配置明细列表:', records);
        this.detailList = records.records || [];
      });
    },
    submitRequest () {
      const params = this._id ? { ...this.form } : {
        configName: this.form.configName,
        configCode: this.form.configCode,
        dataSource: 150 // 数据来源，150:新销服; 老销服:10
      };
      return addOrUpdateConfig(params);
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handlConfigCondition () {
      this.$refs.conditionConfigDialog.show();
    },
    // 新增子表数据
    handleAddRow () {
      this.currentEditIndex = null;
      this.$refs.attachedFilesDialog && this.$refs.attachedFilesDialog.show(false);
    },
    // 编辑子表数据
    handleEditRow (rowIndex) {
      this.currentEditIndex = rowIndex;
      const row = this.detailList[rowIndex];
      this.$refs.attachedFilesDialog && this.$refs.attachedFilesDialog.show(true, row.id);
    },
    // 处理对话框确认（新增/编辑）
    handleAttachedFilesConfirm () {
      // 子组件已经调用了保存接口，这里只需要刷新列表即可
      this.loadConfigDetailList(this.form);
    },
    // 删除子表数据
    handleDeleteRow (rowIndex) {
      const row = this.detailList[rowIndex];
      if (!row || !row.id) {
        // 如果是新增的数据，直接删除
        this.detailList.splice(rowIndex, 1);
        return;
      }
      // 调用删除接口
      deleteConfigDetail([row.id]).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.detailList.splice(rowIndex, 1);
      }).catch(err => {
        console.error('删除失败', err);
      });
    },
    getDefaultForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
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
.btn-edit {
  color: var(--leap-color-primary);
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    opacity: 0.8;
  }
}
</style>
