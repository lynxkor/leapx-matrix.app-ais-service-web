<template>
  <div class="page-common m-warranty-audit-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="保修审计单">
        <el-input
          placeholder="请输入"
          v-model="form.auditCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="保修审计主题">
        <el-input
        placeholder="请输入"
        v-model="form.auditThemeLike"
        clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="门店">
          <dealer-select v-model="form.dealerCodeList" multiple/>
        </el-form-item>
        <el-form-item label="审计开始日期">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.auditStartDate"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="审计类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="warranty_audit_type"
            v-model="form.auditTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="审计单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="warranty_audit_status"
            v-model="form.auditStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="提交截止日期">
          <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
            v-model="form.submitDeadline"
            type="daterange"
            unlink-panels
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
            unlink-panels
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
            unlink-panels
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
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
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
    <!-- 发布弹窗 -->
    <PublishDialog
      :visible.sync="publishDialogVisible"
      :audit-id="currentPublishId"
      :actual-audit-count="currentPublishActualCount"
      @success="getData"
    />
    <!-- 签署总结弹窗 -->
    <SignSummaryDialog
      :visible.sync="signSummaryDialogVisible"
      :audit-id="currentSignSummaryId"
      @success="getData"
    />
    <!-- 驳回总结弹窗 -->
    <RejectSummaryDialog
      :visible.sync="rejectSummaryDialogVisible"
      :audit-id="currentRejectSummaryId"
      @success="getData"
    />
    <!-- 签署整改弹窗 -->
    <SignRectifyDialog
      :visible.sync="signRectifyDialogVisible"
      :audit-id="currentSignRectifyId"
      @success="getData"
    />
    <!-- 驳回整改弹窗 -->
    <RejectRectifyDialog
      :visible.sync="rejectRectifyDialogVisible"
      :audit-id="currentRejectRectifyId"
      @success="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList,
  deleteItem,
  enableItem,
  agreeSummary,
  agreeRectify,
  regenerateUnsignedSummary,
  regenerateUnsignedRectify,
} from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import DealerSelect from '@/components/dealer-select';
import { getListVisibleButtons } from './constant';
import PublishDialog from './components/PublishDialog';
import SignSummaryDialog from './components/SignSummaryDialog';
import RejectSummaryDialog from './components/RejectSummaryDialog';
import SignRectifyDialog from './components/SignRectifyDialog';
import RejectRectifyDialog from './components/RejectRectifyDialog';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  createTime: '',
  updateTime: '',
  auditCode: '',
  auditTheme: '',
  dealerCode: '',
  auditStartDate: '',
  auditTypeList: '',
  auditStatusList: '',
  submitDeadline: '',
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
    DealerSelect,
    PublishDialog,
    SignSummaryDialog,
    RejectSummaryDialog,
    SignRectifyDialog,
    RejectRectifyDialog,
  },
  data () {
    return {
      pageTitle: '保修审计发布',
      pageType: 'list',
      // TIPS: 权限前缀 AISCR，根据实际情况修改
      moduleKey: 'AISCR-warrantyAudit',
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
      publishDialogVisible: false,
      currentPublishId: '',
      currentPublishActualCount: 0,
      //
      signSummaryDialogVisible: false,
      currentSignSummaryId: '',
      //
      rejectSummaryDialogVisible: false,
      currentRejectSummaryId: '',
      //
      signRectifyDialogVisible: false,
      currentSignRectifyId: '',
      //
      rejectRectifyDialogVisible: false,
      currentRejectRectifyId: '',
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
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'warrantyAuditTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'auditCode',
            label: '保修审计单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyAudit/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'auditTheme', label: '保修审计主题', visible: true, width: 200 },
          { props: 'auditStatusLabel', label: '审计单状态', visible: true, width: 200 },
          { props: 'auditTypeLabel', label: '审计类型', visible: true, width: 200 },
          { props: 'auditStartDate', label: '审计开始日期', visible: true, width: 200 },
          { props: 'planAuditCount', label: '计划审计数量', visible: true, width: 200 },
          { props: 'actualAuditCount', label: '实际审计数量', visible: true, width: 200 },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerName',
            label: '门店名称',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?num=2&dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'submitDeadline', label: '提交截止日期', visible: true, width: 200 },
          { props: 'planDeductAmount', label: '计划扣款金额', visible: true, width: 200 },
          { props: 'deductedAmount', label: '已扣款金额', visible: true, width: 200 },
          { props: 'undeductAmount', label: '未扣款金额', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          {
            props: 'createTime',
            label: '创建时间',
            visible: true,
            width: 200,
          },
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
                name: '编辑',
                show: (row) => getListVisibleButtons(row.auditStatus).includes('编辑'),
                click: (rowIndex, row) => {
                  this.$router.push({
                    path: '/claimreturn/claim/warrantyAudit/edit',
                    query: {
                      id: row.id,
                      isEditing: true,
                    }
                  });
                },
                type: 'info'
              },
              {
                name: '发布',
                show: (row) => getListVisibleButtons(row.auditStatus).includes('发布'),
                click: (rowIndex, row) => {
                  this.handlePublish(row);
                },
                type: 'info'
              },
              {
                name: '签署总结',
                show: (row) => getListVisibleButtons(row.auditStatus).includes('签署总结'),
                click: (rowIndex, row) => {
                  this.currentSignSummaryId = row.id;
                  this.signSummaryDialogVisible = true;
                },
                type: 'info'
              },
              {
                name: '同意总结',
                show: (row) => getListVisibleButtons(row.auditStatus).includes('同意总结'),
                click: (rowIndex, row) => {
                  this.handleAgreeSummary(row);
                },
                type: 'info'
              },
              {
                name: '驳回总结',
                show: (row) => getListVisibleButtons(row.auditStatus).includes('驳回总结'),
                click: (rowIndex, row) => {
                  this.currentRejectSummaryId = row.id;
                  this.rejectSummaryDialogVisible = true;
                },
                type: 'info'
              },
              {
                name: '签署整改',
                show: (row) => getListVisibleButtons(row.auditStatus).includes('签署整改'),
                click: (rowIndex, row) => {
                  this.currentSignRectifyId = row.id;
                  this.signRectifyDialogVisible = true;
                },
                type: 'info'
              },
              {
                name: '同意整改',
                show: (row) => getListVisibleButtons(row.auditStatus).includes('同意整改'),
                click: (rowIndex, row) => {
                  this.handleAgreeRectify(row);
                },
                type: 'info'
              },
              {
                name: '驳回整改',
                show: (row) => getListVisibleButtons(row.auditStatus).includes('驳回整改'),
                click: (rowIndex, row) => {
                  this.currentRejectRectifyId = row.id;
                  this.rejectRectifyDialogVisible = true;
                },
                type: 'info'
              },
            ]
          }
        ],
        total: this.tableTotal
      };
    },
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
        path: '/claimreturn/claim/warrantyAudit/edit'
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
        businessType: '新页面',
        dataFetchPath: 'claimreturn/claim/web/warrantyaudit/warrantyAudit/page',
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
      if (this.form.auditStartDate) {
        delete data.auditStartDate;
        if (this.form.auditStartDate.length > 1) {
          data.auditStartDateStart = this.form.auditStartDate[0];
          data.auditStartDateEnd = this.form.auditStartDate[1];
        }
      }
      if (this.form.submitDeadline) {
        delete data.submitDeadline;
        if (this.form.submitDeadline.length > 1) {
          data.submitDeadlineStart = this.form.submitDeadline[0];
          data.submitDeadlineEnd = this.form.submitDeadline[1];
        }
      }

      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    getDealerList (query) {
      return listOrgStoreInfo({
        name: query,
      });
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
    // 打开发布弹窗
    handlePublish (row) {
      this.currentPublishId = row.id;
      this.currentPublishActualCount = row.actualAuditCount || 0;
      this.publishDialogVisible = true;
    },
    // 同意总结
    handleAgreeSummary (row) {
      this.$confirm('确定同意总结？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agreeSummary({ auditId: row.id }).then(() => {
          this.$message.success('同意总结成功');
          this.getData();
        });
      }).catch(() => {});
    },
    // 同意整改
    handleAgreeRectify (row) {
      this.$confirm('确定同意整改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agreeRectify({ auditId: row.id }).then(() => {
          this.$message.success('同意整改成功');
          this.getData();
        });
      }).catch(() => {});
    },
  }
};
</script>

<style lang="scss" scoped>
.m-warranty-audit-list {
}
</style>
