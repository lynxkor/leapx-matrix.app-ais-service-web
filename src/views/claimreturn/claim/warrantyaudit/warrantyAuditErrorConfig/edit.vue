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
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="错误代码：" prop="errorCode">
                  <el-input v-model="form.errorCode" placeholder="请输入" clearable :disabled="!!_id" />
                </el-form-item>
                <el-form-item label="错误类别：" prop="errorCategory">
                  <el-input v-model="form.errorCategory" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="检查项目：" prop="checkItem">
                  <el-input v-model="form.checkItem" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model="form.remark" placeholder="请输入" clearable type="textarea" rows="3" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="错误代码：">{{ form.errorCode }}</el-form-item>
                <el-form-item label="错误类别：">{{ form.errorCategory }}</el-form-item>
                <el-form-item label="检查项目：">{{ form.checkItem }}</el-form-item>
                <el-form-item label="备注：">{{ form.remark }}</el-form-item>
                <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
                <el-form-item label="修改时间：">{{ form.updateTime }}</el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditErrorConfig/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  errorCode: '',
  errorCategory: '',
  checkItem: '',
  remark: '',
  createTime: '',
  updateTime: ''
};

export default {
  name: 'warrantyAuditErrorConfigEdit',
  props: {
    id: { type: [String, Number], default: null }
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
      return '错误代码：' + (this.form.errorCode || '新增');
    }
  },
  data () {
    return {
      pageTitle: '审计错误项配置',
      pageType: 'edit',
      moduleKey: 'AISCR-warrantyAuditErrorConfig',
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      rules: {
        errorCode: [{ required: true, message: '请输入错误代码', trigger: 'change' }],
        errorCategory: [{ required: true, message: '请输入错误类别', trigger: 'change' }]
      }
    };
  },
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
    getDefautlForm () {
      return { ...defaultForm };
    }
  }
};
</script>
