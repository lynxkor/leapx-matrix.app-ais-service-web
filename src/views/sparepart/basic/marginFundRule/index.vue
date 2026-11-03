<template>
  <div class="page-common m-margin-fund-rule-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      v-if="activeName === 'rule'"
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="门店">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.dealerCodeList"
          placeholder="请输入门店编码或名称"
          labelKey="orgName"
          valueKey="orgCode"
          subLabelKey="orgCode"
          clearable
          multiple
          collapseTags
          filterable
        />
      </el-form-item>
      <el-form-item label="订单类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="PurchaseOrderTypeEnum"
          v-model="form.purchaseOrderTypeList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="名称" v-show="show">
        <tag-input v-model="form.codeList" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="创建时间" v-show="show">
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
      <el-form-item label="修改时间" v-show="show">
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
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>

    <el-form
      v-else
      :inline="true"
      :model="useDetailForm"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="门店">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="useDetailForm.dealerCodeList"
          placeholder="请输入门店编码或名称"
          labelKey="orgName"
          valueKey="orgCode"
          subLabelKey="orgCode"
          clearable
          multiple
          collapseTags
          filterable
        />
      </el-form-item>
      <el-form-item label="订单类型">
        <fetch-select
          :request="fetchOptions"
          enumCode="PurchaseOrderTypeEnum"
          v-model="useDetailForm.purchaseOrderTypeList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="名称" v-show="show">
        <tag-input v-model="useDetailForm.codeList" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="采购申请单" v-show="show">
        <tag-input v-model="useDetailForm.purchaseApplyCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="审批时间" v-show="show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="useDetailForm.approveTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="创建时间" v-show="show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="useDetailForm.createTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="修改时间" v-show="show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="useDetailForm.updateTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
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
      <el-button v-if="canAddOrUpdate && activeName === 'rule'" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport && activeName === 'rule'" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete && activeName === 'rule'" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable && activeName === 'rule'" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable && activeName === 'rule'" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="预留金规则" name="rule"></el-tab-pane>
      <el-tab-pane label="使用明细" name="useDetail"></el-tab-pane>
    </el-tabs>

    <div
      class="ais-table-c"
      v-if="activeName === 'rule'"
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

    <div
      class="ais-table-c"
      v-if="activeName === 'useDetail'"
    >
      <LPVxeTable
        :key="2"
        ref="tableRefDetail"
        v-loading="loading"
        is-checkbox
        checkboxFixed
        is-page
        :option-obj="optionObjDetail"
        :get-config="getConfigDetail"
        :page-sizes="[10, 20, 50, 100]"
        @paginationChange="paginationChangeDetail"
      />
    </div>

    <Upload
      :visible="uploadDialogVisible"
      id="sparePartMarginFundRuleImport"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, useDetailPage } from '@/api/sparepart/basic/marginFundRule/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel, getEndOfDayString } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // 默认查询条件
  dealerCodeList: [],
  purchaseOrderTypeList: [],
  // 扩展查询条件
  codeList: [],
  createTime: null,
  updateTime: null
};

const defaultUseDetailForm = {
  // 使用明细默认查询
  dealerCodeList: [],
  purchaseOrderTypeList: [],
  // 扩展查询
  codeList: [],
  purchaseApplyCodeList: [],
  approveTime: null,
  createTime: null,
  updateTime: null
};

const pageSize = 20;
const mockConfig = { data: null };

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    TagInput,
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '预留金使用规则设置',
      pageType: 'list',
      moduleKey: 'AISPART-marginFundRule',
      form: {
        ...defaultForm
      },
      useDetailForm: {
        ...defaultUseDetailForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      activeName: 'rule',
      optionObj: {
        id: 'marginFundRuleTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '名称',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/marginFundRule/edit',
                  query: { id: row.id }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.dealerCode) {
                  window.open(`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
                }
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 120 },
          { props: 'monthlyUseCount', label: '月使用次数', visible: true, width: 120, align: 'right' },
          { props: 'remark', label: '备注', visible: true, minWidth: 200, showOverflow: true },
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
                  path: '/sparepart/basic/marginFundRule/edit',
                  query: { id: row.id }
                });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      optionObjDetail: {
        id: 'marginFundRuleUseDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        // 排序：审批时间降序（PRD 要求）
        sortColumns: [
          { column: 'approve_time', sort: 'DESC' }
        ],
        dataProp: [
          {
            props: 'code',
            label: '名称',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/marginFundRule/edit',
                  query: { id: row.ruleId }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 130,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.dealerCode) {
                  window.open(`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
                }
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 160 },
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 100 },
          { props: 'monthlyUseCount', label: '月使用次数', visible: true, width: 100 },
          { props: 'remark', label: '规则备注', visible: true, width: 160 },
          {
            props: 'purchaseApplyCode',
            label: '采购订单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                if (row.purchaseApplyId) {
                  this.$router.push({
                    path: '/sparepart/purchase/purchaseApply/edit',
                    query: { id: row.purchaseApplyId }
                  });
                }
              },
              type: 'primary'
            }]
          },
          { props: 'approveTime', label: '审批时间', visible: true, width: 170 },
          { props: 'originalMonthlyUseCount', label: '月使用次数（原）', visible: true, width: 130 },
          { props: 'originalRuleRemark', label: '使用规则备注（原）', visible: true, width: 240 },
          { props: 'useMarginFundIsLabel', label: '是否使用预留资金', visible: true, width: 200 },
          { props: 'orderRemark', label: '订单备注', visible: true, width: 160 },
          { props: 'createTime', label: '创建时间', visible: true, width: 170 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 170 }
        ],
        total: 0
      },
      sortColumns: []
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching dealer list:', error);
        return [];
      }
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleClick (tab) {
      this.activeName = tab.name;
      this.show = false;
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.optionObjDetail.form.page = 1;
      this.optionObjDetail.form.size = pageSize;
      if (this.activeName === 'rule') {
        this.getData();
      } else {
        this.getUseDetailData();
      }
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/basic/marginFundRule/edit'
      });
    },
    onSubmit () {
      if (this.activeName === 'rule') {
        this.optionObj.form.page = 1;
        this.getData();
      } else {
        this.optionObjDetail.form.page = 1;
        this.getUseDetailData();
      }
    },
    onReset () {
      if (this.activeName === 'rule') {
        Object.assign(this.form, defaultForm);
        this.optionObj.form.page = 1;
        this.optionObj.form.size = pageSize;
        this.getData();
      } else {
        Object.assign(this.useDetailForm, defaultUseDetailForm);
        this.optionObjDetail.form.page = 1;
        this.optionObjDetail.form.size = pageSize;
        this.getUseDetailData();
      }
    },
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.activeName === 'useDetail'
        ? this.getUseDetailFormData()
        : (this.getFormData() || {});
      if (this.selectionList.length > 0 && this.activeName === 'rule') {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      const fetchPath = this.activeName === 'useDetail'
        ? 'sparepart/web/basic/marginFundRule/useDetailPage'
        : 'sparepart/web/basic/marginFundRule/page';
      const tableRef = this.activeName === 'useDetail' ? this.$refs.tableRefDetail : this.$refs.tableRef;
      const businessType = this.activeName === 'useDetail' ? '预留金使用明细' : '预留金使用规则';
      exportTable({
        businessType,
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, `${businessType}.xlsx`);
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
    getData () {
      this.loading = true;
      this.selectionList = [];
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          this.optionObj.dataList = (res?.records || []).map(item => ({ ...item, deleteLoading: false }));
          this.optionObj.total = res?.total || 0;
        }).finally(() => {
          this.loading = false;
        });
    },
    getUseDetailData () {
      this.loading = true;
      const formData = this.getUseDetailFormData();
      const params = {
        ...formData,
        // 排序：审批时间降序（PRD 要求）
        sortColumns: this.optionObjDetail.sortColumns || [
          { column: 'approve_time', sort: 'DESC' }
        ],
        pageNum: this.optionObjDetail.form.page,
        pageSize: this.optionObjDetail.form.size
      };
      console.log('[useDetail] 请求参数:', params);
      useDetailPage(params).then(res => {
        console.log('[useDetail] 响应:', res);
        this.optionObjDetail.dataList = res?.records || [];
        this.optionObjDetail.total = res?.total || 0;
      }).catch(err => {
        console.error('[useDetail] 失败:', err);
        this.optionObjDetail.dataList = [];
        this.optionObjDetail.total = 0;
      }).finally(() => {
        this.loading = false;
      });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    debouncedGetUseDetailData: debounce(function () {
      this.getUseDetailData();
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
    getConfigDetail () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObjDetail.id).then(data => {
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
    paginationChangeDetail (type, num) {
      if (type === 'page') {
        this.optionObjDetail.form.page = num;
      } else {
        this.optionObjDetail.form.size = num;
      }
      this.debouncedGetUseDetailData();
    },
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };
      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });
      if (this.form.createTime && this.form.createTime.length > 1) {
        delete data.createTime;
        data.createTimeStart = this.form.createTime[0];
        data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
      } else if (data.createTime !== undefined) {
        delete data.createTime;
      }
      if (this.form.updateTime && this.form.updateTime.length > 1) {
        delete data.updateTime;
        data.updateTimeStart = this.form.updateTime[0];
        data.updateTimeEnd = getEndOfDayString(this.form.updateTime[1]);
      } else if (data.updateTime !== undefined) {
        delete data.updateTime;
      }
      data.sortColumns = this.sortColumns;
      return data;
    },
    getUseDetailFormData () {
      const data = { ...this.useDetailForm };
      Object.keys(this.useDetailForm).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });
      if (this.useDetailForm.approveTime && this.useDetailForm.approveTime.length > 1) {
        delete data.approveTime;
        data.approveTimeStart = this.useDetailForm.approveTime[0];
        data.approveTimeEnd = getEndOfDayString(this.useDetailForm.approveTime[1]);
      } else if (data.approveTime !== undefined) {
        delete data.approveTime;
      }
      if (this.useDetailForm.createTime && this.useDetailForm.createTime.length > 1) {
        delete data.createTime;
        data.createTimeStart = this.useDetailForm.createTime[0];
        data.createTimeEnd = getEndOfDayString(this.useDetailForm.createTime[1]);
      } else if (data.createTime !== undefined) {
        delete data.createTime;
      }
      if (this.useDetailForm.updateTime && this.useDetailForm.updateTime.length > 1) {
        delete data.updateTime;
        data.updateTimeStart = this.useDetailForm.updateTime[0];
        data.updateTimeEnd = getEndOfDayString(this.useDetailForm.updateTime[1]);
      } else if (data.updateTime !== undefined) {
        delete data.updateTime;
      }
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    deleteOne (row) {
      deleteItem([row.id]).then(() => {
        this.$message({ type: 'success', message: '删除成功!' });
        this.getData();
      }).catch(() => {
        this.$message({ type: 'error', message: '删除失败!' });
      });
    },
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({ type: 'success', message: '删除成功!' });
          this.getData();
        }).catch(() => {
          this.$message({ type: 'error', message: '删除失败!' });
        });
      }).catch(() => {});
    },
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
.m-margin-fund-rule-list {
}
</style>
