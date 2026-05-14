<template>
  <div class="page-common m-file-download-log-list">
    <el-form :inline="true"
              :model="form"
              size="small"
              label-position="right"
              label-width="150px"
              class="ais-search-form">
      <!-- 业务类型多选 -->
      <el-form-item label="业务类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="file_compress_biz_type"
          v-model="form.bizTypeList"
          multiple
          placeholder="请选择"
          clearable
        />
      </el-form-item>
      <!-- 下载人全模糊 -->
      <el-form-item label="下载人">
        <el-input v-model="form.creatorNameLike" placeholder="请输入" clearable/>
      </el-form-item>
      <template v-if="show">
      <!-- 文件序号批量 -->
      <el-form-item label="文件序号">
        <tag-input v-model="form.fileSeqList" placeholder="请输入"/>
      </el-form-item>
      <!-- 文件名称全模糊 -->
      <el-form-item label="文件名称">
        <el-input v-model="form.fileNameLike" placeholder="请输入" clearable/>
      </el-form-item>
      <!-- 下载时间区间 -->
      <el-form-item label="下载时间">
        <el-date-picker
          v-model="form.downloadTime"
          type="daterange"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
      />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { getList } from '@/api/file/fileDownloadLog';
import { exportTable, getEnum, getTableConfig, tableAddOrUpdate } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import { downloadExcel, getEndOfDayString } from '@/libs/utils';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import commonMixins from '@/libs/mixins/commonMixins';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
const defaultForm = {
  bizTypeList: [],
  creatorNameLike: '',
  fileSeqList: [],
  fileNameLike: '',
  downloadTime: []
};

const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    TagInput
  },
  data () {
    return {
      form: { ...defaultForm },
      loading: false,
      bizTypeMap: {
        CLAIM_SETTLE_INVOICE: '保修结算发票'
      },
      moduleKey: 'AISFILE-fileDownloadLog',
      exportLoading: false,
      show: false,
      optionObj: {
        id: 'fileDownloadLogTable',
        dataList: [],
        dataProp: [
          { props: 'fileSeq', label: '文件序号', visible: true, width: 140 },
          { props: 'fileName', label: '文件名称', visible: true, width: 250 },
          { props: 'bizTypeLabel', label: '业务类型', visible: true, width: 200 },
          { props: 'creatorName', label: '下载人', visible: true, width: 140 },
          { props: 'createTime', label: '下载时间', visible: true }
        ],
        form: { page: 1, size: 20 },
        total: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            end.setHours(23, 59, 59, 999); // 设置为当天的 23:59:59
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            start.setHours(0, 0, 0, 0); // 设置为前七天的 00:00:00
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            end.setHours(23, 59, 59, 999); // 设置为当天的 23:59:59
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            start.setHours(0, 0, 0, 0); // 设置为前30天的 00:00:00
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            end.setHours(23, 59, 59, 999); // 设置为当天的 23:59:59
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            start.setHours(0, 0, 0, 0); // 设置为前90天的 00:00:00
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  created () {
    this.getData();
  },
  methods: {
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: 'fileDownloadLog',
        dataFetchPath: '/file/web/attachment/fileDownloadLog/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, 'fileDownloadLog.xlsx');
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
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.getData();
    },
    getData () {
      this.loading = true;
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = res.records || [];
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    getFormData () {
      const data = { ...this.form };
      // 处理下载时间区间
      if (data.downloadTime && data.downloadTime.length > 1) {
        data.createTimeStart = data.downloadTime[0];
        data.createTimeEnd = getEndOfDayString(data.downloadTime[1]);
        delete data.downloadTime;
      }
      // 清除空值
      Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === null ||
          (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getConfig () {
      return new Promise((resolve, reject) => {
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
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300)
  }
};
</script>

<style lang="scss" scoped>
.m-file-download-log-list {
}
</style>
