<template>
  <edit-page-layout ref="editLayout" :title="title" showPaneFooter>
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
        :showEditBtn="true"
      >
        <template #status>
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="工程分类编码：" prop="categoryCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.categoryCode"
                    clearable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="工程分类名称：" prop="categoryName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.categoryName"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="工程分类编码：">
                  {{ form.categoryCode }}
                </el-form-item>
                <el-form-item label="工程分类名称：">
                  {{ form.categoryName }}
                </el-form-item>
                <el-form-item label="是否启用：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="状态变更描述：">
                  {{ form.statusDesc }}
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
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/spareEngineeringCategory/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  status: '',
  statusLabel: '',
  categoryCode: '',
  categoryName: '',
};

export default {
  name: 'spareEngineeringCategoryEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '工程分类编码：' + (this.form.categoryCode || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件工程分类',
      pageType: 'edit',
      moduleKey: 'AISPART-spareEngineeringCategory',
      loading: false,
      submitLoading: false,
      info: {},
      form: { ...form },
      originalForm: { ...form },
      rules: {
        categoryCode: [
          { required: true, message: '请输入工程分类编码', trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '请输入工程分类名称', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    submitRequest () {
      return addOrUpdate({ id: this.form.id, ...this.form });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.status.primary {
  color: var(--leap-color-primary);
  font-weight: 500;
}
</style>
