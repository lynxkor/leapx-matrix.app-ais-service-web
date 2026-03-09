<template>
  <div class="page-common m-{{nameKebabCase}}-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
    {{#each top2SearchList}}
    {{#if isDate}}
      <el-form-item label="{{description}}">
        <el-date-picker
          v-model="form.{{key}}"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    {{/if}}
    {{#if isDateRange}}
      <el-form-item label="{{description}}">
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
      <el-form-item label="{{description}}">
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
      <el-form-item label="{{description}}">
        <list-select
          listUrl="{{searchUrl}}"
          placeholder="请选择"
          v-model="form.{{key}}"
          query-key="{{queryKey}}"
          clearable
          collapseTags
          :show-code="false"
          filterable
          label-key="code"
          value-key="id"
        />
      </el-form-item>
    {{/if}}
    {{#if isBoolean}}
      <el-form-item label="{{description}}">
        <fetch-select
          :options="yes_no_enum"
          v-model="form.{{key}}"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
    {{/if}}
    {{#if isInput}}
      <el-form-item label="{{description}}">
        <el-input
          placeholder="请输入"
          v-model="form.{{key}}"
          clearable
        />
      </el-form-item>
    {{/if}}
    {{#if isTextarea}}
      <el-form-item label="{{description}}">
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
    {{#each thirdSearchList}}
    {{#if isDate}}
      <el-form-item label="{{description}}">
        <el-date-picker
          v-model="form.{{key}}"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    {{/if}}
    {{#if isDateRange}}
      <el-form-item label="{{description}}">
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
      <el-form-item label="{{description}}">
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
      <el-form-item label="{{description}}">
        <list-select
          listUrl="{{searchUrl}}"
          placeholder="请选择"
          v-model="form.{{key}}"
          query-key="{{queryKey}}"
          clearable
          collapseTags
          :show-code="false"
          filterable
          label-key="code"
          value-key="id"
        />
      </el-form-item>
    {{/if}}
    {{#if isBoolean}}
      <el-form-item label="{{description}}">
        <fetch-select
          :options="yes_no_enum"
          v-model="form.{{key}}"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
    {{/if}}
    {{#if isInput}}
      <el-form-item label="{{description}}">
        <el-input
          placeholder="请输入"
          v-model="form.{{key}}"
          clearable
        />
      </el-form-item>
    {{/if}}
    {{#if isTextarea}}
      <el-form-item label="{{description}}">
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
      <template v-if="show">
      {{#each lastSearchList}}
      {{#if isDate}}
        <el-form-item label="{{description}}">
          <el-date-picker
            v-model="form.{{key}}"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      {{/if}}
      {{#if isDateRange}}
        <el-form-item label="{{description}}">
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
        <el-form-item label="{{description}}">
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
        <el-form-item label="{{description}}">
          <list-select
            listUrl="{{searchUrl}}"
            placeholder="请选择"
            v-model="form.{{key}}"
            query-key="{{queryKey}}"
            clearable
            collapseTags
            :show-code="false"
            filterable
            label-key="code"
            value-key="id"
          />
        </el-form-item>
      {{/if}}
      {{#if isBoolean}}
        <el-form-item label="{{description}}">
          <fetch-select
            :options="yes_no_enum"
            v-model="form.{{key}}"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
      {{/if}}
      {{#if isInput}}
        <el-form-item label="{{description}}">
          <el-input
            placeholder="请输入"
            v-model="form.{{key}}"
            clearable
          />
        </el-form-item>
      {{/if}}
      {{#if isTextarea}}
        <el-form-item label="{{description}}">
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
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    {{#if tabsPath}}
    <div class="ais-tabs">
      <div v-for="(item, index) in tabList" :key="item.label" :class="{'ais-tabs-item': true, 'active': item.value == form.aisActiveTab}" @click="onTabChange(item.value)">
        \{{item.label}}
        <!-- <span v-if="index">(\{{ item.count }})</span> -->
      </div>
    </div>
    {{/if}}
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList,
  deleteItem,
  enableItem,
  {{#if tabsPath}}
  getTabsListApi,
  {{/if}}
} from '@/api/{{modulePath}}/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import ListSelect from '@/libs/components/list-select/index.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  {{#each searchList}}
  {{key}}: '',
  {{/each}}
  {{#if tabsPath}}
  aisActiveTab: '',
  {{/if}}
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload,
    ListSelect,
  },
  data () {
    return {
      pageTitle: '{{title}}',
      pageType: 'list',
      // TIPS: 权限前缀 AISCR，根据实际情况修改
      moduleKey: 'AISCR-{{name}}',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      //
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      //
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ],
      {{#if tabsPath}}
      tabList: [],
      {{/if}}
    };
  },
  computed: {
    optionObj () {
      return {
        id: '{{name}}Table',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {{#each tableList}}
          {{#if isFirst}}
          {
            props: '{{key}}',
            label: '{{description}}',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/{{@root.modulePath}}/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {{else}}
          { props: '{{key}}', label: '{{description}}', visible: true, width: 200 },
          {{/if}}
          {{/each}}
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/{{modulePath}}/edit',
                  query: {
                    id: row.id,
                    isEditing: true,
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              click: (rowIndex, row) => {
                deleteItem([row.id]).then(() => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '删除失败!'
                  });
                });
              },
              type: 'danger'
            }]
          }
        ],
        total: this.tableTotal
      };
    },
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    {{#if tabsPath}}
    this.getTabsList();
    {{/if}}
  },
  methods: {
    // 排序
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/{{modulePath}}/edit'
      });
    },
    onSubmit () {
      this.tableForm.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.tableForm.page = 1;
      this.tableForm.pageSize = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '{{title}}',
        dataFetchPath: '{{apiPath}}/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '{{title}}.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size })
        .then(res => {
          this.tableDataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.tableTotal = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.tableForm.page = num;
      } else {
        this.tableForm.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      // TODO xxxx为过滤参数 待修改
      data.xxxx = data.aisActiveTab;

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      // 动态处理所有日期范围字段
      {{#each searchList}}
      {{#if isDateRange}}
      if (this.form.{{key}}) {
        delete data.{{key}};
        if (this.form.{{key}}.length > 1) {
          data.{{key}}Start = this.form.{{key}}[0];
          data.{{key}}End = this.form.{{key}}[1];
        }
      }
      {{/if}}
      {{/each}}

      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {});
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
      // const ids = this.selectionList.map(item => item.id) || [];
      // this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   enableItem({
      //     idSet: ids,
      //     status
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功!'
      //     });
      //     this.getData();
      //   }).catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '操作失败!'
      //     });
      //   });
      // });
    },
    {{#if tabsPath}}
    onTabChange (v) {
      this.form.aisActiveTab = v;
      this.tableForm.page = 1;
      this.debouncedGetData();
    },
    getTabsList () {
      this.tabList = [
        { label: '全部', value: '' },
        { label: '分类1', value: '1' },
        { label: '分类2', value: '2' },
      ];
      getTabsListApi().then(res => {
        const target = res || {};
        // this.tabList = [
        //   { label: '全部', value: null },
        //   { label: '分类1', value: '1' },
        //   { label: '分类2', value: '2' },
        // ];
      });
    },
    {{/if}}
  }
};
</script>

<style lang="scss" scoped>
.m-{{nameKebabCase}}-list {
  {{#if tabsPath}}
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  {{/if}}
}
</style>
