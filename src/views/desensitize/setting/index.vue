<template>
  <div class="page-common m-desensitize-setting-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="名称">
        <el-input
          placeholder="请输入"
          v-model="form.name"
          clearable
        />
      </el-form-item>
      <el-form-item label="数据库">
        <el-input
          placeholder="请输入"
          v-model="form.dbName"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="库名">
          <el-input
            placeholder="请输入"
            v-model="form.dsName"
            clearable
          />
        </el-form-item>
        <el-form-item label="实体表">
          <el-input
            placeholder="请输入"
            v-model="form.tableName"
            clearable
          />
        </el-form-item>
        <el-form-item label="表名">
          <el-input
            placeholder="请输入"
            v-model="form.tableNameZh"
            clearable
          />
        </el-form-item>
        <el-form-item label="字段">
          <el-input
            placeholder="请输入"
            v-model="form.columnName"
            clearable
          />
        </el-form-item>
        <el-form-item label="字段名">
          <el-input
            placeholder="请输入"
            v-model="form.columnNameZh"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="form.status"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据分类">
          <fetch-select
            :request="fetchCategoryList"
            v-model="form.dataCategory"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            placeholder="请输入"
            v-model="form.creatorName"
            clearable
          />
        </el-form-item>
        <el-form-item label="创建时间" v-show="this.visibleCount === 3 || show">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="修改人">
          <el-input
            placeholder="请输入"
            v-model="form.modifierName"
            clearable
          />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </template>
      <page-search-action
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>

    <div class="ais-actions">
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd">
        <i class="iconfont icon-lxppc-plus"></i>新增
      </el-button>
      <el-button v-if="canEnableOrDisable" size="small" :disabled="selectionList.length === 0" @click="handleBatchEnable(1)">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" :disabled="selectionList.length === 0" @click="handleBatchEnable(0)">批量禁用</el-button>
      <el-button v-if="canExport" size="small" :loading="exportLoading" @click="handleExport">
        导出
      </el-button>
    </div>

    <div class="ais-table-c">
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-page
        is-checkbox
        centralized
        checkboxFixed
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
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { page, enable } from '@/api/desensitize/rule';
import { getTableConfig, tableAddOrUpdate, getEnum, findByDictType, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  name: '',
  dbName: '',
  dsName: '',
  tableName: '',
  tableNameZh: '',
  columnName: '',
  columnNameZh: '',
  // 默认查询已启用的脱敏规则，清除状态筛选可查询全部
  status: 1,
  dataCategory: [],
  creatorName: '',
  createTime: '',
  modifierName: '',
  updateTime: ''
};

const pageSize = 20;
const mockConfig = { data: null };

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage
  },
  data () {
    return {
      pageTitle: '脱敏设置',
      pageType: 'list',
      moduleKey: 'AISSECURITY-desensitize',
      form: { ...defaultForm },
      selectionList: [],
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      sortColumns: [
        { column: 'update_time', sort: 'DESC' }
      ],
      optionObj: {
        id: 'desensitizeSettingTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'name',
            label: '名称',
            visible: true,
            width: 180,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/desensitize/setting/edit',
                  query: { id: row.id }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dbName', label: '数据库', visible: true, width: 200 },
          { props: 'tableName', label: '实体表', visible: true, width: 200 },
          { props: 'tableNameZh', label: '表名', visible: true, width: 200 },
          { props: 'columnName', label: '字段', visible: true, width: 200 },
          { props: 'columnNameZh', label: '字段名', visible: true, width: 200 },
          { props: 'statusLabel', label: '状态', visible: true, width: 200 },
          { props: 'dataCategory', label: '数据分类', visible: true, width: 200 },
          { props: 'prefixKeep', label: '前缀保留', visible: true, width: 200 },
          { props: 'suffixKeep', label: '后缀保留', visible: true, width: 200 },
          { props: 'listDesensitizeLabel', label: '列表默认脱敏', visible: true, width: 200 },
          { props: 'detailDesensitizeLabel', label: '详情默认脱敏', visible: true, width: 200 },
          { props: 'exportDesensitizeLabel', label: '导出默认脱敏', visible: true, width: 200 },
          { props: 'creatorName', label: '创建人', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'modifierName', label: '修改人', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [
              {
                name: '编辑',
                show: () => this.canAddOrUpdate,
                click: (rowIndex, row) => {
                  this.handleEdit(row);
                },
                type: 'info'
              }
            ]
          }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.optionObj.form.page = 1;
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleAdd () {
      this.$router.push({ path: '/desensitize/setting/edit' });
    },
    handleEdit (row) {
      this.$router.push({
        path: '/desensitize/setting/edit',
        query: { id: row.id, isEditing: true }
      });
    },
    handleExport () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      exportTable({
        businessType: '脱敏规则',
        dataFetchPath: 'desensitize/rule/page',
        gatewayType: 'LEAPX',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '脱敏规则.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enable,
        refreshFunc: this.getData
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.sortColumns = [{ column: 'update_time', sort: 'DESC' }];
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      page({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          const records = (res && res.records) || [];
          this.optionObj.dataList = records.map(item => this.formatRow(item));
          this.optionObj.total = Number(res?.totals ?? 0);
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
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
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        const val = data[key];
        if (val === '' || val === null || (Array.isArray(val) && val.length === 0)) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }

      data.sortColumns = this.sortColumns;
      return data;
    },
    fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return Promise.resolve([]);
    },
    // 数据分类下拉 - 多选，数据源与编辑页保持一致
    async fetchCategoryList () {
      try {
        const res = await findByDictType({
          dictType: 'desensitizeCategory',
          status: 0
        });
        return (res || []).map(item => ({
          code: item.value,
          message: item.label
        }));
      } catch (err) {
        console.error('获取数据分类失败', err);
        return [];
      }
    },
    formatRow (row) {
      return {
        ...row,
        statusLabel: row.status === 1 ? '启用' : '禁用',
        listDesensitizeLabel: row.listDesensitize === 1 ? '是' : '否',
        detailDesensitizeLabel: row.detailDesensitize === 1 ? '是' : '否',
        exportDesensitizeLabel: row.exportDesensitize === 1 ? '是' : '否'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
