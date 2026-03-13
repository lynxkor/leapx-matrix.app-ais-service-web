<template>
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
          <!-- 支持primary,warning,success,danger等状态 -->
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="配置名称" prop="configName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.configName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="配置编码" prop="configCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.configCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="配置名称：">
                  {{ form.configName }}
                </el-form-item>
                <el-form-item label="配置编码：">
                  {{ form.configCode }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>附件配置明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header" v-if="isEditing || !_id">
                <div class="ais-select-group">
                  <el-button type="primary" size="small" @click="handleAddRow">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="form.detailList"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="attachmentCategoryName" title="附件分类名称" min-width="15%" />
                  <vxe-column field="isRequired" title="是否必传" min-width="10%">
                    <template #default="{ row }">
                      {{ row.isRequired === 1 ? '是' : '否' }}
                    </template>
                  </vxe-column>
                  <vxe-column field="maxCount" title="至多数量" min-width="10%" />
                  <vxe-column field="minCount" title="至少数量" min-width="10%" />
                  <vxe-column field="sizeLimit" title="附件大小限制(M)" min-width="12%" />
                  <vxe-column field="fileSuffix" title="文件后缀(带点，逗号隔开)" min-width="18%" />
                  <vxe-column field="isDefault" title="是否默认" min-width="10%">
                    <template #default="{ row }">
                      {{ row.isDefault === 1 ? '是' : '否' }}
                    </template>
                  </vxe-column>
                  <vxe-column title="操作" width="80" v-if="isEditing || !_id">
                    <template #default="{ rowIndex }">
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
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/file/attachmentConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

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
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '配置名称：' + (this.form.configName || '');
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
    const form = this.getDefautlForm();
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
      rules: {
        configName: [
          { required: true, message: '请输入配置名称', trigger: 'change' }
        ],
        configCode: [
          { required: true, message: '请输入配置编码', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {},
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      this.form.detailList.splice(index, 1);
    },
    // 新增子表数据
    handleAddRow () {
      this.form.detailList.push({
        attachmentCategoryName: '',
        isRequired: 0,
        maxCount: null,
        minCount: null,
        sizeLimit: null,
        fileSuffix: '',
        isDefault: 0
      });
    },
    getDefautlForm () {
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
