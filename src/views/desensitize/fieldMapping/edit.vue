<template>
  <edit-page-layout ref="editLayout" :title="title">
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
              <h2>字段映射信息</h2>
            </div>
            <div class="common-section-body">
              <el-form
                v-if="isEditing || !_id"
                ref="ruleForm"
                :inline="true"
                :model="form"
                :rules="rules"
                label-width="130px"
                class="form-edit"
              >
                <el-form-item label="数据库名：" prop="dbName">
                  <el-input v-model="form.dbName" placeholder="请输入" maxlength="100" show-word-limit clearable />
                </el-form-item>
                <el-form-item label="VO类名：" prop="voClass">
                  <el-input v-model="form.voClass" placeholder="请输入全限定类名" maxlength="200" show-word-limit clearable />
                </el-form-item>
                <el-form-item label="VO字段：" prop="voField">
                  <el-input v-model="form.voField" placeholder="请输入" maxlength="100" show-word-limit clearable />
                </el-form-item>
                <el-form-item label="表名：" prop="tableName">
                  <el-input v-model="form.tableName" placeholder="请输入" maxlength="100" show-word-limit clearable />
                </el-form-item>
                <el-form-item label="字段名：" prop="columnName">
                  <el-input v-model="form.columnName" placeholder="请输入" maxlength="100" show-word-limit clearable />
                </el-form-item>
              </el-form>
              <el-form v-else :inline="true" class="form-detail">
                <el-form-item label="数据库名：">{{ form.dbName }}</el-form-item>
                <el-form-item label="VO类名：">{{ form.voClass }}</el-form-item>
                <el-form-item label="VO字段：">{{ form.voField }}</el-form-item>
                <el-form-item label="表名：">{{ form.tableName }}</el-form-item>
                <el-form-item label="字段名：">{{ form.columnName }}</el-form-item>
                <el-form-item label="状态：">{{ form.status === 1 ? '启用' : '停用' }}</el-form-item>
                <el-form-item label="创建人：">{{ form.creatorName }}</el-form-item>
                <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
                <el-form-item label="修改人：">{{ form.modifierName }}</el-form-item>
                <el-form-item label="更新时间：">{{ form.updateTime }}</el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { add, update, findById } from '@/api/desensitize/fieldMapping';

const defaultForm = {
  id: null,
  dbName: '',
  voClass: '',
  voField: '',
  tableName: '',
  columnName: '',
  status: 1,
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: ''
};

export default {
  name: 'desensitizeFieldMappingEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: { EditPageLayout, EditBaseContainer },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return this._id ? '字段映射：' + (this.form.voField || '') : '新增字段映射';
    }
  },
  data () {
    const form = this.getDefaultForm();
    return {
      pageTitle: '字段映射管理',
      pageType: 'edit',
      moduleKey: 'AISSECURITY-desensitizeFieldMapping',
      noPermissionControl: true,
      form: { ...form },
      originalForm: { ...form },
      loading: false,
      rules: {
        dbName: [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
        voClass: [{ required: true, message: '请输入VO类名', trigger: 'blur' }],
        voField: [{ required: true, message: '请输入VO字段', trigger: 'blur' }],
        tableName: [{ required: true, message: '请输入表名', trigger: 'blur' }],
        columnName: [{ required: true, message: '请输入字段名', trigger: 'blur' }]
      }
    };
  },
  methods: {
    getDefaultForm () {
      return { ...defaultForm };
    },
    detailRequest () {
      return this._id ? findById(this._id) : {};
    },
    submitRequest () {
      const request = { ...this.form };
      return this._id ? update(request) : add(request);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
