<template>
  {{#if isProForm}}
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
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
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
              {{#each detailList}}
              {{#if isDate}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.{{key}}"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              {{/if}}
              {{#if isSelect}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.{{key}}"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              {{/if}}
              {{#if isBoolean}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  <el-radio-group v-model="form.{{key}}">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              {{/if}}
              {{#if isNormal}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  <el-input
                    placeholder="请输入"
                    v-model="form.{{key}}"
                    clearable
                  />
                </el-form-item>
              {{/if}}
              {{/each}}
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                {{#each detailList}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  {{#if isBoolean}}
                  {{yesNoFormat form.[key]}}
                  {{else}}
                  \{{ form.{{key}} }}
                  {{/if}}
                </el-form-item>
                {{/each}}
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
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
  {{else}}
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
            {{#each detailList}}
            {{#if isDate}}
              <el-form-item label="{{description}}" prop="{{key}}">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.{{key}}"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            {{/if}}
            {{#if isSelect}}
              <el-form-item label="{{description}}" prop="{{key}}">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.{{key}}"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
            {{/if}}
            {{#if isBoolean}}
              <el-form-item label="{{description}}" prop="{{key}}">
                <el-radio-group v-model="form.{{key}}">
                  <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                </el-radio-group>
              </el-form-item>
            {{/if}}
            {{#if isNormal}}
              <el-form-item label="{{description}}" prop="{{key}}">
                <el-input
                  placeholder="请输入"
                  v-model="form.{{key}}"
                  clearable
                />
              </el-form-item>
            {{/if}}
            {{/each}}
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
  {{/if}}
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/{{modulePath}}/index';
import FetchSelect from '@/libs/components/FetchSelect';
{{#if isProForm}}
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
{{/if}}
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  {{#each detailList}}
  {{key}}: '',
  {{/each}}
};

export default {
  name: '{{nameCamelCase}}Edit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    {{#if isProForm}}
    EditPageLayout,
    EditBaseContainer,
    EditTable,
    {{/if}}
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '标题xxx'
    }
  },
  watch: {
    {{#if isProForm}}
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
    {{else}}
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
    {{/if}}
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '{{title}}',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-{{name}}',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      {{#if isProForm}}
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      {{/if}}
      rules: {
      {{#each detailList}}
      {{#if isDate}}
        {{key}}: [
          { required: true, message: '请选择{{description}}', trigger: 'change' }
        ],
      {{/if}}
      {{#if isSelect}}
        {{key}}: [
          { required: true, message: '请选择{{description}}', trigger: 'change' }
        ],
      {{/if}}
      {{#if isNormal}}
        {{key}}: [
          { required: true, message: '请输入{{description}}', trigger: 'change' }
        ],
      {{/if}}
      {{/each}}
      }
    };
  },
  mounted () {
    {{#unless isProForm}}
    this.getDetailData();
    {{/unless}}
  },
  methods: {
    {{#if isProForm}}
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
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    {{else}}
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    {{/if}}
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
