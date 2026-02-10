<template>
  {{{#isProForm}}}
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
              {{{#cols}}}
              {{{#isDate}}}
                <el-form-item label="{{{description}}}：" prop="{{{key}}}">
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
                <el-form-item label="{{{description}}}：" prop="{{{key}}}">
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
                <el-form-item label="{{{description}}}：" prop="{{{key}}}">
                  <el-radio-group v-model="form.{{{key}}}">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
              {{{#cols}}}
                <el-form-item label="{{{description}}}：" prop="{{{key}}}">
                  {{{#isBoolean}}}
                  {{ yes_no_enum_map[form.{{{key}}}] }}
                  {{{/isBoolean}}}
                  {{{^isBoolean}}}
                  {{ form.{{{key}}} }}
                  {{{/isBoolean}}}
                </el-form-item>
              {{{/cols}}}
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
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
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
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
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    {{{#isProForm}}}
    EditPageLayout,
    EditBaseContainer,
    {{{/isProForm}}}
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      {{{#top1List}}}
      return '{{{description}}}：' + this.form.{{{key}}};
      {{{/top1List}}}
    }
  },
  watch: {
    {{{#isProForm}}}
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
    {{{/isProForm}}}
    {{{^isProForm}}}
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
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
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
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
          { required: true, message: '请输入{{{description}}}', trigger: 'change' }
        ],
      {{{/isNormal}}}
      {{{/cols}}}
      }
    };
  },
  mounted () {
    {{{^isProForm}}}
    this.getDetailData();
    {{{/isProForm}}}
  },
  methods: {
    {{{#isProForm}}}
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
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
    },
    {{{/isProForm}}}
    {{{^isProForm}}}
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
    {{{/isProForm}}}
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
