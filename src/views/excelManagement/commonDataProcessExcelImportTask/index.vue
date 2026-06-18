<template>
  <div class="page-common m-common-data-process-excel-task-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="业务标识：">
        <el-input
          placeholder="请输入"
          v-model="form.businessTypeLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStatus">
        <fetch-select
          :options="taskStatusOptions"
          v-model="form.taskStatusList"
          placeholder="请选择"
          clearable
          multiple
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTime"
          type="datetimerange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <page-search-action
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
    </div>
    <div
      class="ais-table-c"
      :class="{ 'z-form-show': show }"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <Upload
      :visible="uploadDialogVisible"
      templateUrl=""
      uploadUrl=""
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, retryItem } from '@/api/excelManagement/commonDataProcessExcelTask/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import commonMixins from '@/libs/mixins/commonMixins';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { downloadExcel } from '@/utils/index.js';
import {refreshFileAuthUrl} from "@/api/file/fileDetail";

const defaultForm = {
  // 多选时字段有变化，自行修复
  taskType: 1,
  taskStatus: '',
  creator: '',
  businessType: ''
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [commonMixins],

  components: {
    FetchSelect,
    PageSearchAction,
    LPVxeTable,
    Upload
  },
  data () {
    return {
      pageTitle: 'Excel导入任务',
      pageType: 'list',
      form: {
        ...defaultForm
      },
      selectionList: [],
      taskStatusOptions: [
        { code: 11, message: '等待导入' },
        { code: 12, message: '导入中' },
        { code: 13, message: '导入完成' },
        { code: 14, message: '导入失败' }
      ],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'commonDataProcessExcelTaskTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'id',
            label: '任务id',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/excelManagement/commonDataProcessExcelImportTask/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'taskTypeLabel', label: '任务类型', visible: true, width: 200 },
          { props: 'businessType', label: '业务标识', visible: true, width: 200 },
          {
            props: 'importFailUrl',
            label: '导入失败数据下载地址',
            visible: true,
            width: 200,
            buttons: [{
              name: '点击下载',
              show: (row) => row.fileId,
              click: (rowIndex, row) => {
                this.handleDownload(row);
              },
              type: 'primary'
            }]
          },
          { props: 'taskStatusLabel', label: '任务状态', visible: true, width: 200 },
          { props: 'importRemark', label: '描述', visible: true, width: 200 },
          { props: 'creatorName', label: '创建者', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 }
        ],
        total: 0
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
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/excelManagement/commonDataProcessExcelTask/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        dataFetchPath: '/datacenter/excelManagement/commonDataProcessExcelTask/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols())
      }).then(res => {
        if (res) {
          if (res.excelUrl) {
            window.location.href = res.excelUrl;
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelImportTask', '_blank'),
            { message: '正在导入中，是否要跳转"系统管理-文件管理-导入任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
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
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableItem({
          idSet: ids,
          status
        }).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败!'
          });
        });
      });
    },
    // 重试导入任务
    handleRetry (row) {
      this.$confirm('确定要重新执行该导入任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        retryItem(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败!'
          });
        });
      }).catch(() => {});
    },
    // 下载导入失败数据
    handleDownload (row) {
      const url = row?.importFailUrl || this.info?.importFailUrl;
      const originalUrl = url.split('?')[0];
      refreshFileAuthUrl({
        url: originalUrl,
        expireMinutes: 1440
      }).then(res => {
        if (res) {
          // console.log(res);
          downloadExcel(res.authFileUrl, res.originalFilename || '导入失败数据.xlsx');
        } else {
          this.$message({
            type: 'warning',
            message: '下载地址为空'
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-common-data-process-excel-task-list {
}
</style>
