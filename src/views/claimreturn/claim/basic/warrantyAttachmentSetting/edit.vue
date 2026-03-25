<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
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
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑表单：只保留保修类型名称、是否自动审批 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="保修类型：" prop="warrantyTypeId">
                  <list-select
                    listUrl="/maintain/web/basic/repairItemType/list"
                    placeholder="请输入保修类型编码/名称"
                    v-model="form.warrantyTypeId"
                    :disabled="Boolean(_id)"
                    query-key="codeOrNameLike"
                    auto-load-options
                    no-param-load
                    filterable
                    clearable
                    label-key="name"
                    second-line-key="code"
                    @change="handleWarrantyTypeChange"
                    :params="{'checkoutTypeNames':['合同','保修'],'excludeMaintenancePackage':true}" />
                </el-form-item>
                <el-form-item label="是否自动审批：" prop="autoApproval">
                  <el-switch v-model="form.autoApproval" active-value="1" inactive-value="0" />
                </el-form-item>
              </el-form>
              <!-- 详情视图：只保留保修类型名称、是否自动审批、创建时间、修改时间 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="保修类型名称：">
                  {{ form.warrantyTypeName }}
                </el-form-item>
                <el-form-item label="是否自动审批：">
                  {{ yes_no_enum_map[form.autoApproval] }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/warrantyAttachmentSetting/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ListSelect from '@/libs/components/list-select/index.vue';
const defaultForm = {
  warrantyTypeName: '',
  warrantyTypeId: '',
  warrantyTypeCode: '',
  autoApproval: '',
  createTime: '',
  updateTime: '',
};

export default {
  name: 'warrantyAttachmentSettingEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    ListSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保修类型名称：' + this.form.warrantyTypeName;
    }
  },
  watch: {
    _id: {
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
      pageTitle: '保修附件设置',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantyAttachmentSetting',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      yes_no_enum_map: {
        0: '否',
        1: '是'
      },
      form: { ...form },
      originalForm: { ...form },
      rules: {
        warrantyTypeId: [
          { required: true, message: '请选择保修类型', trigger: 'change' }
        ],
        autoApproval: [
          { required: true, message: '请选择是否自动审批', trigger: 'change' }
        ],
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
    handleWarrantyTypeChange (val, selectedItem) {
      this.form.warrantyTypeId = val;
      this.form.warrantyTypeName = selectedItem ? selectedItem.name : '';
      this.form.warrantyTypeCode = selectedItem ? selectedItem.code : '';
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    getDefautlForm () {
      return {
        ...defaultForm
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
