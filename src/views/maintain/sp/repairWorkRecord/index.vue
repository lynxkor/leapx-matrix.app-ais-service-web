<template>
  <div class="page-common m-sp-repair-work-record-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form :inline="true" :model="form" size="small" label-position="right" label-width="150px"
      class="ais-search-form">
      <el-form-item label="作业编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入编号" clearable />
      </el-form-item>
      <el-form-item label="施工单号" prop="serviceProxyCode">
        <el-input v-model="form.serviceProxyCode" placeholder="请输入编号" clearable />
      </el-form-item>
      <el-form-item label="门店" v-show="this.visibleCount === 3 || show">
        <dealer-select v-model="form.dealerCodes" multiple />
      </el-form-item>
      <page-search-action v-model="show" is-expandable :loading="loading" @submit="onSubmit" @reset="onReset" />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i
          class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete"
        :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)"
        :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)"
        :disabled="selectionList.length === 0">批量停用</el-button>
    </div>
    <div class="ais-table-c">
      <LPVxeTable ref="tableRef" v-loading="loading" is-page :option-obj="optionObj" :get-config="getConfig" @sortChange="handleSortChange"
        :save-or-update="saveOrUpdate" @paginationChange="paginationChange" @listSelect="handleListSelect" >
        <EditPage slot="centralizedViewSlot" :id="clickItemId" />
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload :visible="uploadDialogVisible" :id="'1'" @close="handleUploadDialogClose" />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/maintain/sp/spRepairWorkRecord/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import DealerSelect from '@/components/dealer-select/index.vue';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
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
    // FetchSelect,
    Upload,
    DealerSelect
  },
  data () {
    return {
      pageTitle: '质检记录',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-spRepairWorkRecord',
      form: {
        ...defaultForm
      },
      selectionList: [],
      canExport: true,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,

      clickItemId: '',
      optionObj: {
        id: 'spRepairWorkRecordTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          { props: 'code', label: '编号', visible: true, width: 200 },
          {
            props: 'serviceProxyCode',
            label: '施工单号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: {
                    id: row.serviceProxyId
                  }
                });
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
          { props: 'repairItemName', label: '维修项目名称', visible: true, width: 200 },
          { props: 'repairItemCode', label: '维修项目代码', visible: true, width: 200 },
          { props: 'statusLabel', label: '作业状态', visible: true, width: 200 },
          { props: 'isDispatchLabel', label: '是否已派工', visible: true, width: 200 },
          { props: 'dealerStationName', label: '工位', visible: true, width: 200 },
          { props: 'dealerWorkTeamName', label: '班组信息', visible: true, width: 200 },
          { props: 'repairTechnicianName', label: '维修技师', visible: true, width: 200 },
          { props: 'dispatchTime', label: '派工时间', visible: true, width: 200 },
          { props: 'startAt', label: '计划作业时间', visible: true, width: 200 },
          { props: 'timeSpend', label: '实际作业时间', visible: true, width: 200 },
          { props: 'finishAt', label: '作业结束时间', visible: true, width: 200 },

          { props: 'reworkTypeLabel', label: '返修类型', visible: true, width: 200 },
          { props: 'qualityCheckerName', label: '质检人', visible: true, width: 200 },
          { props: 'qualityCheckAt', label: '质检时间', visible: true, width: 200 },
          { props: 'qualityCheckStatusLabel', label: '质检状态', visible: true, width: 200 },

          { props: 'createTime', label: '创建时间', visible: true, width: 200, sortable: true },
        ],
        total: 0
      },
      sortColumns: [
        {
          column: 'create_time',
          sort: 'DESC'
        }
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
        path: '/maintain/sp/spRepairWorkRecord/edit'
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
        businessType: '接车施工单-维修作业记录表管理',
        dataFetchPath: 'maintain/web/sp/spRepairWorkRecord/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '接车施工单-维修作业记录表管理.xlsx');
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-sp-repair-work-record-list {}
</style>
