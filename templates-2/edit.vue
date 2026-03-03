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
          <div v-if="isEditing" class="header-desc">
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
                    v-model="form.{{key}}"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              {{/if}}
              {{#if isDateRange}}
                <el-form-item class="form-item-half" label="{{description}}：" prop="{{key}}">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.{{key}}"
                    type="daterange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              {{/if}}
              {{#if isEnum}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="{{enum}}"
                    v-model="form.{{key}}"
                    placeholder="请选择"
                    clearable
                    multiple
                    filterable
                  />
                </el-form-item>
              {{/if}}
              {{#if isSearch}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.{{key}}"
                    :remote-method="{{key}}Search"
                    :params="form.{{key}}"
                    @change="{{key}}Change"
                    value-key="code"
                    label-key="name"
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
              {{#if isInput}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  <el-input
                    placeholder="请输入"
                    v-model="form.{{key}}"
                    clearable
                  />
                </el-form-item>
              {{/if}}
              {{#if isTextarea}}
                <el-form-item label="{{description}}：" prop="{{key}}">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.{{key}}"
                    clearable
                    :rows="2"
                    maxLength="500"
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
          {{#if isModalAddTable}}
          <modal-add-table
            ref="modalAddTable"
            :disabled="false"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
            @data-change="() => {}"
            @checkboxChange="checkboxChange"
          />
          {{/if}}
          {{#if isReadonlyTable}}
          <modal-add-table
            :disabled="true"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
          />
          {{/if}}
          {{#if isSearchAddTable}}
          <search-add-table
            :_id="_id"
            @data-change="() => {}"
            @checkboxChange="checkboxChange"
          />
          {{/if}}
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
import {
  getDetail,
  addOrUpdate,
  {{#each detailList}}
  {{#if isSearch}}
  {{key}}SearchApi,
  {{/if}}
  {{/each}}
} from '@/api/{{modulePath}}/index';
import FetchSelect from '@/libs/components/FetchSelect';
{{#contains checkedList 'isSide'}}
import EditPageLayout from '@/libs/components/EditPageLayout';
{{/contains}}
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
{{#if (or isModalAddTable isReadonlyTable)}}
import ModalAddTable from './components/ModalAddTable';
{{/if}}
{{#if isSearchAddTable}}
import SearchAddTable from './components/SearchAddTable';
{{/if}}

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
    {{#if (or isModalAddTable isReadonlyTable)}}
    ModalAddTable,
    {{/if}}
    {{#if isSearchAddTable}}
    SearchAddTable,
    {{/if}}
    EditBaseContainer,
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
      {{#if (or isDate isDateRange isEnum isSearch isBoolean)}}
        {{key}}: [
          { required: true, message: '请选择{{description}}', trigger: 'change' }
        ],
      {{/if}}
      {{#if (or isInput isTextarea)}}
        {{key}}: [
          { required: true, message: '请输入{{description}}', trigger: 'blur' }
        ],
      {{/if}}
      {{/each}}
      },
      {{#if (or isModalAddTable isSearchAddTable)}}
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
    {{#each detailList}}
    {{#if isSearch}}
    {{key}}Search (query) {
      return {{key}}SearchApi({
        {{queryKey}}: query,
        pageSize: 20,
        pageNum: 1,
      }).then(res => {
        return res;
      });
    },
    {{key}}Change (val, record) {},
    {{/if}}
    {{/each}}
    {{#if (or isModalAddTable isSearchAddTable)}}
    checkboxChange (records) {
      this.selectedRows = records;
    },
    {{/if}}
  }
};
</script>
