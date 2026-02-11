<template>
  {{#contains checkedList 'isSide'}}
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
  {{/contains}}
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        {{#unless (has checkedList 'isShowEditing')}}
        :showEditBtn="false"
        {{/unless}}
        {{#contains checkedList 'isVertical'}}
        direction="vertical"
        {{/contains}}
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        {{#contains checkedList 'isStatus'}}
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        {{/contains}}
        {{#contains checkedList 'isExtraButtons'}}
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        {{/contains}}
        <el-main>
          {{#contains checkedList 'isDetailDesc'}}
          <div class="header-desc">
            顶部说明文字：&nbsp;&nbsp;|&nbsp;&nbsp;顶部说明文字：
          </div>
          {{/contains}}
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
          {{#if (gt detailTable.length 0)}}
          <table-with-btn
            ref="tableWithBtn"
            :disabled="false"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
            @data-change="() => {}"
            @checkboxChange="() => {}"
          />
          {{/if}}
          <!-- {{#if (gt detailTable.length 0)}}
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
                  {{#each detailTable}}
                  <vxe-column field="{{key}}" title="{{description}}" width="150" />
                  {{/each}}
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
          {{/if}} -->
        </el-main>
      </edit-base-container>
  {{#contains checkedList 'isSide'}}
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
  {{/contains}}
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/{{modulePath}}/index';
import FetchSelect from '@/libs/components/FetchSelect';
{{#contains checkedList 'isSide'}}
import EditPageLayout from '@/libs/components/EditPageLayout';
{{/contains}}
import EditTable from '@/libs/components/EditTable';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
{{#if (gt detailTable.length 0)}}
import TableWithBtn from './components/TableWithBtn';
{{/if}}
// 按钮 + 明细表
// 搜索 + 明细表
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
    {{#contains checkedList 'isSide'}}
    EditPageLayout,
    {{/contains}}
    {{#if (gt detailTable.length 0)}}
    TableWithBtn,
    {{/if}}
    EditBaseContainer,
    EditTable,
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
      pageTitle: '{{title}}',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR 根据实际情况修改
      moduleKey: 'AISCR-{{name}}',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      emptyText: '若要启用此内容，请创建记录',
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
      },
      {{#if (gt detailTable.length 0)}}
      selectedRows: [],
      {{/if}}
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
    },
    {{#if (gt detailTable.length 0)}}
    checkboxChange (records) {
      this.selectedRows = records;
    },
    {{/if}}
  }
};
</script>
