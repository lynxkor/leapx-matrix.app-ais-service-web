<template>
  {{{#isProForm}}}
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" size="small">
            {{{#cols}}}
            {{{#isDate}}}
              <el-form-item label="{{{description}}}：" prop="{{{key}}}">
                <el-date-picker
                  v-model="form.{{{key}}}"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
            {{{/isDate}}}
            {{{#isSelect}}}
              <el-form-item label="{{{description}}}：" prop="{{{key}}}">
                <fetch-select
                  :request="() => fetchOptions('xxx')"
                  v-model="form.{{{key}}}"
                  placeholder="请选择"
                  clearable
                  multiple
                />
              </el-form-item>
            {{{/isSelect}}}
            {{{#isBoolean}}}
              <el-form-item label="{{{description}}}：">
                <fetch-select
                  :options="yes_no_enum"
                  v-model="form.{{{key}}}"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
            {{{/isBoolean}}}
            {{{#isNormal}}}
              <el-form-item label="{{{description}}}：" prop="{{{key}}}">
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
            <el-button size="small" icon="el-icon-plus" @click="handleAddRow">添加</el-button>
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
              />
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" v-loading="submitLoading">保存</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
        <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
        <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
  {{{/isProForm}}}
  {{{^isProForm}}}
  <div class="page-common-add">
    <el-container>
      <el-main>
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px" size="small">
        {{{#cols}}}
        {{{#isDate}}}
          <el-form-item label="{{{description}}}：" prop="{{{key}}}">
            <el-date-picker
              v-model="form.{{{key}}}"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
          </el-form-item>
        {{{/isDate}}}
        {{{#isSelect}}}
          <el-form-item label="{{{description}}}：" prop="{{{key}}}">
            <fetch-select
              :request="() => fetchOptions('xxx')"
              v-model="form.{{{key}}}"
              placeholder="请选择"
              clearable
              multiple
            />
          </el-form-item>
        {{{/isSelect}}}
        {{{#isBoolean}}}
          <el-form-item label="{{{description}}}：">
            <fetch-select
              :options="yes_no_enum"
              v-model="form.{{{key}}}"
              placeholder="请选择"
              clearable
            />
          </el-form-item>
        {{{/isBoolean}}}
        {{{#isNormal}}}
          <el-form-item label="{{{description}}}：" prop="{{{key}}}">
            <el-input
              placeholder="请输入"
              v-model="form.{{{key}}}"
              clearable
            />
          </el-form-item>
        {{{/isNormal}}}
        {{{/cols}}}
        </el-form>
      </el-main>
      <el-footer height="60px">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')" v-loading="submitLoading">保存</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
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
{{{/isProForm}}}
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  // 多选时字段有变化，自行修复
  {{{#cols}}}
  {{{key}}}: '',
  {{{/cols}}}
};

export default {
  name: '{{{nameCamelCase}}}Edit',
  components: {
    FetchSelect,
    {{{#isProForm}}}
    EditTable
    {{{/isProForm}}}
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: {
        ...defaultForm
      },
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
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  mounted () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['{{{title}}}', '{{{title}}}详情']);
    this.getDetailData();
  },
  methods: {
    getDetailData () {
      const id = this.$route.query.id;
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
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
            addOrUpdate({...this.form, teamUsers: tableData }).then(res => {
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
          addOrUpdate({...this.form }).then(res => {
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
      this.form = {...defaultForm};
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
