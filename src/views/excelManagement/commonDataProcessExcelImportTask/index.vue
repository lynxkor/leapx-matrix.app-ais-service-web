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
      <el-form-item label="文件名称：">
        <el-input
          placeholder="请输入"
          v-model="form.fileNameLike"
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
      <el-form-item label="创建人：">
        <el-input
          placeholder="请输入"
          v-model="form.creatorNameLike"
          clearable
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
import permissions from '@/libs/mixins/permissions';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { downloadExcel } from '@/utils/index.js';
import { refreshFileAuthUrl } from '@/api/file/fileDetail';

const defaultForm = {
  // 多选时字段有变化，自行修复
  taskType: 1,
  taskStatus: '',
  creator: '',
  businessType: '',
  fileNameLike: '',
  creatorNameLike: ''
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [permissions, commonMixins],

  components: {
    FetchSelect,
    PageSearchAction,
    LPVxeTable,
    Upload
  },
  data () {
    return {
      pageTitle: '导入任务',
      pageType: 'list',
      moduleKey: 'AISMC-commonDataProcessExcelImportTask',
      form: {
        ...defaultForm
      },
      selectionList: [],
      // 状态筛选按原始枚举展示（11 等待导入/12 导入中/13 导入完成/14 导入失败 + 本期新增 15 部分失败），选中什么提交什么
      taskStatusOptions: [
        { code: 11, message: '等待导入' },
        { code: 12, message: '导入中' },
        { code: 13, message: '导入完成' },
        { code: 14, message: '导入失败' },
        { code: 15, message: '部分失败' }
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
          // 文件名称/导入失败数据下载地址 两列不展示（下载入口收敛到操作列，PRD 2026-09）
          // 行数三列空值展示 '-'：LPVxeTable 不支持 dataProp.formatter，由 getData 数据侧映射
          { props: 'totalNum', label: '总数据行数', visible: true, width: 200 },
          { props: 'successNum', label: '成功行数', visible: true, width: 200 },
          { props: 'failNum', label: '失败行数', visible: true, width: 200 },
          // 处理中（等待导入 11/导入中 12）行内展示发送进度 sendNum/totalNum，由 getData 数据侧拼入状态文案，随列表刷新更新（无轮询）
          { props: 'taskStatusLabel', label: '任务状态', visible: true, width: 200 },
          { props: 'importRemark', label: '描述', visible: true, width: 200 },
          { props: 'creatorName', label: '创建人', visible: true, width: 200 },
          { props: 'modifierName', label: '修改人', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 200,
            buttons: [
              {
                name: '下载失败文件',
                // 展示条件：状态 失败(14)/部分失败(15) + 权限码 -downloadFailFile（资源配置）；失败文件未生成（importFailUrl 空）不展示
                show: (row) => [14, 15].includes(row.taskStatus) &&
                  !!row.importFailUrl &&
                  this.permissions.has(`${this.moduleKey}-downloadFailFile`),
                click: (rowIndex, row) => {
                  this.handleDownload(row);
                },
                type: 'primary'
              },
              {
                name: '下载原始文件',
                // 展示条件：所有状态 + 权限码 -downloadOriginalFile（资源配置）；存量任务无原始文件（importOriginalUrl 空）不展示
                show: (row) => !!row.importOriginalUrl &&
                  this.permissions.has(`${this.moduleKey}-downloadOriginalFile`),
                click: (rowIndex, row) => {
                  this.handleDownloadOriginal(row);
                },
                type: 'primary'
              }
            ]
          }
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

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              // LPVxeTable 不支持 dataProp.formatter，行数列空值 '-' 在数据侧映射
              totalNum: item.totalNum ?? '-',
              successNum: item.successNum ?? '-',
              failNum: item.failNum ?? '-',
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
    // 重试导入任务（存量未接线方法，按精准修改原则保留现状死代码不删；
    // 防重留痕行(dedup_hit=1)的拒绝重试防线由后端 retryImportTask 入口负责，前端无改动）
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
    // 下载导入失败文件：文件名 = 业务标识 + yyyyMMddHHmmss
    handleDownload (row) {
      const url = row?.importFailUrl || this.info?.importFailUrl;
      const businessType = row?.businessType || this.info?.businessType || '导入失败数据';
      this.downloadWithFileName(url, `${businessType}${this.nowTimestamp()}.xlsx`);
    },
    // 下载原始文件：文件名 = 之前导入文件的名称（建任务时落库的 importExcelFileName）
    handleDownloadOriginal (row) {
      const url = row?.importOriginalUrl || this.info?.importOriginalUrl;
      this.downloadWithFileName(url, row?.importExcelFileName || this.info?.importExcelFileName || '原始导入文件.xlsx');
    },
    // 换签后以指定文件名下载：fetch 转 blob 走同源 a[download]，
    // 保证跨域签名 URL 下浏览器使用指定文件名（直挂 link 会被忽略、落成 OSS 的 md5 存储名）；
    // fetch 失败降级为直接下载（此时文件名可能不被浏览器采纳）
    downloadWithFileName (url, fileName) {
      if (!url) {
        this.$message({
          type: 'warning',
          message: '下载地址为空'
        });
        return;
      }
      const originalUrl = url.split('?')[0];
      refreshFileAuthUrl({
        url: originalUrl,
        expireMinutes: 1440
      }).then(res => {
        if (!res) {
          this.$message({
            type: 'warning',
            message: '下载地址为空'
          });
          return;
        }
        fetch(res.authFileUrl).then(response => response.blob()).then(blob => {
          const objectUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(objectUrl);
        }).catch(() => {
          downloadExcel(res.authFileUrl, fileName);
        });
      });
    },
    // 当前时间 yyyyMMddHHmmss
    nowTimestamp () {
      const now = new Date();
      return [
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ].map(num => String(num).padStart(2, '0')).join('');
    }
  }
};
</script>

<style lang="scss" scoped>
.m-common-data-process-excel-task-list {
}
</style>
