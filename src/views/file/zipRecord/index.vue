<template>
  <div class="page-common m-zip-record-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="100px"
      class="ais-search-form"
    >
      <el-form-item label="业务类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="file_compress_biz_type"
          v-model="form.bizTypeList"
          placeholder="请选择"
          clearable
          multiple
        />
      </el-form-item>
      <el-form-item label="导出状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="file_zip_status"
          v-model="form.zipStatusList"
          placeholder="请选择"
          clearable
          multiple
        />
      </el-form-item>
      <template v-if="show">
      <el-form-item label="文件序号">
        <tag-input
          v-model="form.seqList"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="文件名称">
        <el-input
          placeholder="请输入"
          v-model="form.fileNameLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="导出开始时间" v-show="visibleCount === 3 || show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.startTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="导出结束时间" v-show="visibleCount === 3 || show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.finishTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="导出人" v-show="visibleCount === 3 || show">
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
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="修改时间">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
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
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, download } from '@/api/file/zipRecord';
import { getTableConfig, tableAddOrUpdate, getEnum, exportTable } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { downloadExcel, getEndOfDayString } from '@/libs/utils';

const defaultForm = {
  bizTypeList: '',
  zipStatusList: '',
  seqList: [],
  fileNameLike: '',
  startTime: '',
  finishTime: '',
  creatorNameLike: '',
  createTime: '',
  updateTime: '',
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
    TagInput
  },
  data () {
    return {
      pageTitle: '文件下载',
      pageType: 'list',
      moduleKey: 'AISFILE-zipRecord',
      form: {
        ...defaultForm
      },
      selectionList: [],
      show: false,
      loading: false,
      exportLoading: false,
      optionObj: {
        id: 'zipRecordTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'seq', label: '文件序号', visible: true, width: 120 },
          { props: 'fileName', label: '文件名称', visible: true, width: 200 },
          { props: 'bizTypeLabel', label: '业务类型', visible: true, width: 120 },
          { props: 'zipStatusLabel', label: '导出状态', visible: true, width: 100 },
          { props: 'startTime', label: '导出开始时间', visible: true, width: 160 },
          { props: 'finishTime', label: '导出结束时间', visible: true, width: 160 },
          { props: 'creatorName', label: '导出人', visible: true, width: 120 },
          { props: 'errorDescription', label: '导出状态说明', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 160 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 160 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 100,
            buttons: [{
              name: '下载',
              show: (row) => row.zipStatus === '20',
              click: (rowIndex, row) => {
                this.handleDownload(row);
              },
              type: 'primary'
            }]
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
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          const records = res.records || [];
          this.optionObj.dataList = records;
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        businessType: 'zipRecord',
        dataFetchPath: '/file/web/attachment/zipRecord/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '文件下载.xlsx');
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
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
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

      // 处理开始时间区间
      if (this.form.startTime) {
        delete data.startTime;
        if (this.form.startTime.length > 1) {
          data.startTimeStart = this.form.startTime[0];
          data.startTimeEnd = getEndOfDayString(this.form.startTime[1]);
        }
      }

      // 处理结束时间区间
      if (this.form.finishTime) {
        delete data.finishTime;
        if (this.form.finishTime.length > 1) {
          data.finishTimeStart = this.form.finishTime[0];
          data.finishTimeEnd = getEndOfDayString(this.form.finishTime[1]);
        }
      }

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

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleDownload (row) {
      download({ zipRecordId: row.id }).then(res => {
        const url = res?.authFileUrl || res?.data?.authFileUrl;
        const fileName = res?.fileName || res?.data?.fileName || '下载文件.zip';
        if (url) {
          fetch(url)
            .then(response => response.blob())
            .then(blob => {
              const blobUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(blobUrl);
            })
            .catch(() => {
              this.$message({ type: 'error', message: '下载失败' });
            });
        } else {
          this.$message({ type: 'error', message: '获取下载链接失败' });
        }
      }).catch(err => {
        console.error('下载失败:', err);
        this.$message({ type: 'error', message: '下载失败' });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-zip-record-list {
}
</style>
