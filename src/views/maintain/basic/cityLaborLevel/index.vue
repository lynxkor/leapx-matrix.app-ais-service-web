<template>
  <div class="page-common m-city-labor-level-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="创建时间">
        <el-date-picker v-model="form.createTime" type="daterange" range-separator="至"
        unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="行政区域名称">
        <el-cascader
          placeholder="请选择行政区域"
          v-model="form.areaCode"
          :props="cascaderProps"
          :options="areaOptions"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="行政区域级别" v-show="this.visibleCount === 3 || show">
        <fetch-select :request="fetchOptions" enumCode="AreaLevelEnum" v-model="form.areaLevelList" placeholder="请选择"
          clearable multiple filterable />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="城市工时等级">
          <fetch-select :request="fetchOptions" enumCode="CityLevelEnum" v-model="form.laborLevelList" placeholder="请选择"
            clearable multiple filterable />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select :request="fetchOptions" enumCode="StatusEnum" v-model="form.statusIncludeList" placeholder="请选择"
            clearable multiple filterable />
        </el-form-item>
      </template>
      <page-search-action v-if="canPage" v-model="show" is-expandable :loading="loading" @submit="onSubmit"
        @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i
          class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete"
        :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-checkbox is-page checkboxFixed centralized
        :option-obj="optionObj" :get-config="getConfig" :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange" @handleSelect="handleSelectionChange" @listSelect="handleListSelect"
        @sortChange="handleSortChange">
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" @getData="getData" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { deleteItem, enableItem, getPage } from '@/api/maintain/basic/cityLaborLevel/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  areaList: [],
  areaLevelList: [],
  laborLevelList: [],
  statusIncludeList: []
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
    Upload
  },
  data () {
    return {
      pageTitle: '城市工时等级配置表管理',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-cityLaborLevel',
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
      areaOptions: this.getAreaOptionsFromStorage(), // 行政区域选项数据
      cascaderProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      optionObj: {
        id: 'cityLaborLevelTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'id',
            label: '主键',
            visible: false,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: this.navigateToEdit,
              type: 'primary'
            }]
          },
          {
            props: 'areaCode',
            label: '行政区代码',
            visible: true,
            width: 150,
            fixed: 'left',
            buttons: [{
              click: this.navigateToEdit,
              type: 'primary'
            }]
          },
          { props: 'areaName', label: '行政区名称', visible: true, width: 200 },
          { props: 'areaLevelLabel', label: '行政区域级别', visible: true, width: 120 },
          { props: 'parentId', label: '父级id', visible: true, width: 120 },
          { props: 'parentName', label: '父级行政区名称', visible: true, width: 200 },
          { props: 'laborLevelLabel', label: '城市工时等级', visible: true, width: 120 },
          { props: 'statusLabel', label: '状态', visible: true, width: 100 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },

        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
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
        path: '/maintain/basic/cityLaborLevel/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
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
        businessType: '城市工时等级配置表管理',
        dataFetchPath: 'service/web/maintain/basic/cityLaborLevel/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '城市工时等级配置表管理.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
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
    getData () {
      this.loading = true;
      this.selectionList = [];

      getPage({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = ((res && res.records) || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = (res && res.total) || 0;
        }).catch(err => {
          console.error('获取列表失败:', err);
          this.optionObj.dataList = [];
          this.optionObj.total = 0;
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
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
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
    // 导航到编辑页面
    navigateToEdit (rowIndex, row) {
      this.$router.push({
        path: '/maintain/basic/cityLaborLevel/edit',
        query: {
          id: row.id
        }
      });
    },
    // 获取区域选项数据
    getAreaOptionsFromStorage () {
      try {
        const stored = localStorage.getItem('areaTree');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Failed to parse areaTree from localStorage:', error);
        return [];
      }
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
      }).catch(() => { });
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-city-labor-level-list {}
</style>
