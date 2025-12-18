<template>
  {{{#isProForm}}}
  <!-- TIPS: 如果填写项小于15项，使用类名page-common-add替换page-common-edit -->
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <div class="page-common-edit">
        <el-container>
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 如果填写项小于15项，去掉 :inline="true" -->
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px">
                {{{#cols}}}
                {{{#isDate}}}
                  <el-form-item label="{{{description}}}" prop="{{{key}}}">
                    <el-date-picker
                      :default-time="['00:00:00', '23:59:59']"
                      v-model="form.{{{key}}}"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                {{{/isDate}}}
                {{{#isSelect}}}
                  <el-form-item label="{{{description}}}" prop="{{{key}}}">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="xxx"
                      v-model="form.{{{key}}}"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                {{{/isSelect}}}
                {{{#isBoolean}}}
                  <el-form-item label="{{{description}}}" prop="{{{key}}}">
                    <el-radio-group v-model="form.{{{key}}}">
                      <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                {{{/isBoolean}}}
                {{{#isNormal}}}
                  <el-form-item label="{{{description}}}" prop="{{{key}}}">
                    <el-input
                      placeholder="请输入"
                      v-model="form.{{{key}}}"
                      clearable
                    />
                  </el-form-item>
                {{{/isNormal}}}
                {{{/cols}}}
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
          <el-footer height="60px">
            <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
            <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
            <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
            <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
          </el-footer>
        </el-container>
      </div>
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
  </edit-page-layout>
  {{{/isProForm}}}
  {{{^isProForm}}}
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
            {{{#cols}}}
            {{{#isDate}}}
              <el-form-item label="{{{description}}}" prop="{{{key}}}">
                <el-date-picker
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="form.{{{key}}}"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            {{{/isDate}}}
            {{{#isSelect}}}
              <el-form-item label="{{{description}}}" prop="{{{key}}}">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.{{{key}}}"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
            {{{/isSelect}}}
            {{{#isBoolean}}}
              <el-form-item label="{{{description}}}" prop="{{{key}}}">
                <el-radio-group v-model="form.{{{key}}}">
                  <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                </el-radio-group>
              </el-form-item>
            {{{/isBoolean}}}
            {{{#isNormal}}}
              <el-form-item label="{{{description}}}" prop="{{{key}}}">
                <el-input
                  placeholder="请输入"
                  v-model="form.{{{key}}}"
                  clearable
                />
              </el-form-item>
            {{{/isNormal}}}
            {{{/cols}}}
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
  {{{/isProForm}}}
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/{{{{modulePath}}}}/index';
import FetchSelect from '@/libs/components/FetchSelect';
{{{#isProForm}}}
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
{{{/isProForm}}}
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  {{{#cols}}}
  {{{key}}}: '',
  {{{/cols}}}
};

export default {
  name: '{{{nameCamelCase}}}Edit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    {{{#isProForm}}}
    EditPageLayout,
    EditTable
    {{{/isProForm}}}
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '{{{title}}}',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-{{{name}}}',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      {{{#isProForm}}}
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
      {{{/isProForm}}}
      rules: {
      {{{#cols}}}
      {{{#isDate}}}
        {{{key}}}: [
          { required: true, message: '请选择{{{description}}}', trigger: 'change' }
        ],
      {{{/isDate}}}
      {{{#isSelect}}}
        {{{key}}}: [
          { required: true, message: '请选择{{{description}}}', trigger: 'change' }
        ],
      {{{/isSelect}}}
      {{{#isNormal}}}
        {{{key}}}: [
          { required: true, message: '请输入{{{description}}}', trigger: 'blur' }
        ],
      {{{/isNormal}}}
      {{{/cols}}}
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['{{{title}}}', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    {{{#isProForm}}}
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
            addOrUpdate({ ...this.form, customKey: tableData }).then(res => {
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
      } catch (error) {
        console.log(error);
      }
    },
    {{{/isProForm}}}
    {{{^isProForm}}}
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
    {{{/isProForm}}}
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
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
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
    // },
    {{{#isProForm}}}
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
    {{{/isProForm}}}
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
