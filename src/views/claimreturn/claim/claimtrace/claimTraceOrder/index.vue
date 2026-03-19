<template>
  <div class="page-common m-claim-trace-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="索赔追溯单">
        <tag-input v-model="form.claimTraceCodes" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="保修申请单">
        <tag-input v-model="form.warrantyCodes" placeholder="请输入"/>
      </el-form-item>
      <template v-if="show">
        <el-form-item label="追溯状态">
        <fetch-select
          :request="fetchOptions"
          enumCode="claim_trace_status"
          v-model="form.traceStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
        <el-form-item label="VIN 码">
          <tag-input v-model="form.vins" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="门店编码">
          <dealer-select v-model="form.dealerCodes" multiple/>
        </el-form-item>
        <el-form-item label="计划追溯金额">
          <el-input
            placeholder="开始金额"
            v-model="form.planTraceAmountStart"
            clearable
            style="width: 180px;"
          />
          <span style="margin: 0 10px;">至</span>
          <el-input
            placeholder="结束金额"
            v-model="form.planTraceAmountEnd"
            clearable
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item label="已追溯金额">
          <el-input
            placeholder="开始金额"
            v-model="form.tracedAmountStart"
            clearable
            style="width: 180px;"
          />
          <span style="margin: 0 10px;">至</span>
          <el-input
            placeholder="结束金额"
            v-model="form.tracedAmountEnd"
            clearable
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item label="未追溯金额">
          <el-input
            placeholder="开始金额"
            v-model="form.unTraceAmountStart"
            clearable
            style="width: 180px;"
          />
          <span style="margin: 0 10px;">至</span>
          <el-input
            placeholder="结束金额"
            v-model="form.unTraceAmountEnd"
            clearable
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item label="首次下发时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.firstIssueTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="最新下发时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.latestIssueTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="系统自动同意日期">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.sysAutoAgreeDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="同意追溯时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.agreeTraceTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
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
import { getList, deleteItem, enableItem } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  claimTraceCode: '',
  traceStatus: '',
  warrantyCode: '',
  vin: '',
  dealerCode: '',
  dealerName: '',
  planTraceAmountStart: '',
  planTraceAmountEnd: '',
  tracedAmountStart: '',
  tracedAmountEnd: '',
  unTraceAmountStart: '',
  unTraceAmountEnd: '',
  firstIssueTime: '',
  latestIssueTime: '',
  sysAutoAgreeDate: '',
  agreeTraceTime: '',
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
    EditPage,
    TagInput,
    DealerSelect,
    Upload
  },
  data () {
    return {
      pageTitle: '新页面',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-claimTraceOrder',
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
      optionObj: {
        id: 'claimTraceOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'claimTraceCode',
            label: '索赔追溯单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/claimtrace/claimTraceOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'traceStatusLabel', label: '追溯状态', visible: true, width: 200 },
          { props: 'warrantyCode', label: '保修申请单', visible: true, width: 200 },
          { props: 'vin', label: 'VIN 码', visible: true, width: 200 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'planTraceAmount', label: '计划追溯金额', visible: true, width: 200 },
          { props: 'tracedAmount', label: '已追溯金额', visible: true, width: 200 },
          { props: 'unTraceAmount', label: '未追溯金额', visible: true, width: 200 },
          { props: 'firstIssueTime', label: '首次下发时间', visible: true, width: 200 },
          { props: 'latestIssueTime', label: '最新下发时间', visible: true, width: 200 },
          { props: 'sysAutoAgreeDate', label: '系统自动同意日期', visible: true, width: 200 },
          { props: 'agreeTraceTime', label: '同意追溯时间', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
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
                  path: '/claimreturn/claim/claimtrace/claimTraceOrder/edit',
                  query: {
                    id: row.id
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
        path: '/claimreturn/claim/claimtrace/claimTraceOrder/edit'
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
        businessType: '新页面',
        dataFetchPath: 'claimreturn/web/claim/claimtrace/claimTraceOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '新页面.xlsx');
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

      if (this.form.firstIssueTime) {
        delete data.firstIssueTime;
        if (this.form.firstIssueTime.length > 1) {
          data.firstIssueTimeStart = this.form.firstIssueTime[0];
          data.firstIssueTimeEnd = this.form.firstIssueTime[1];
        }
      }

      if (this.form.latestIssueTime) {
        delete data.latestIssueTime;
        if (this.form.latestIssueTime.length > 1) {
          data.latestIssueTimeStart = this.form.latestIssueTime[0];
          data.latestIssueTimeEnd = this.form.latestIssueTime[1];
        }
      }

      if (this.form.sysAutoAgreeDate) {
        delete data.sysAutoAgreeDate;
        if (this.form.sysAutoAgreeDate.length > 1) {
          data.sysAutoAgreeDateStart = this.form.sysAutoAgreeDate[0];
          data.sysAutoAgreeDateEnd = this.form.sysAutoAgreeDate[1];
        }
      }

      if (this.form.agreeTraceTime) {
        delete data.agreeTraceTime;
        if (this.form.agreeTraceTime.length > 1) {
          data.agreeTraceTimeStart = this.form.agreeTraceTime[0];
          data.agreeTraceTimeEnd = this.form.agreeTraceTime[1];
        }
      }

      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }

      // 计划追溯金额区间
      if (this.form.planTraceAmountStart) {
        data.planTraceAmountStart = this.form.planTraceAmountStart;
      }
      if (this.form.planTraceAmountEnd) {
        data.planTraceAmountEnd = this.form.planTraceAmountEnd;
      }
      // 已追溯金额区间
      if (this.form.tracedAmountStart) {
        data.tracedAmountStart = this.form.tracedAmountStart;
      }
      if (this.form.tracedAmountEnd) {
        data.tracedAmountEnd = this.form.tracedAmountEnd;
      }
      // 未追溯金额区间
      if (this.form.unTraceAmountStart) {
        data.unTraceAmountStart = this.form.unTraceAmountStart;
      }
      if (this.form.unTraceAmountEnd) {
        data.unTraceAmountEnd = this.form.unTraceAmountEnd;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-claim-trace-order-list {
}
</style>
