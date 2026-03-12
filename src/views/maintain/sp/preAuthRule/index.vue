<template>
  <div class="page-common m-pre-auth-rule-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="120px"
      class="ais-search-form"
    >
      <el-form-item label="预授权申请单号">
        <el-input
          placeholder="请输入"
          v-model="form.applyNo"
          clearable
        />
      </el-form-item>
      <el-form-item label="施工单号">
        <el-input
          placeholder="请输入"
          v-model="form.serviceProxyCode"
          clearable
        />
      </el-form-item>
      <el-form-item label="门店名称" v-show="this.visibleCount === 3 || show">
        <el-input
          placeholder="请输入"
          v-model="form.dealerName"
          clearable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="车牌号">
          <el-input
            placeholder="请输入"
            v-model="form.plateNo"
            clearable
          />
        </el-form-item>
        <el-form-item label="VIN">
          <el-input
            placeholder="请输入"
            v-model="form.vin"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="StatusEnum"
            v-model="form.status"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
      </template>
      <page-search-action
        v-if="canPage"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="handleErrorCodeMaintain">错误代码维护</el-button>
    </div>
    <div class="ais-table-c">
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
    <!-- 错误代码维护侧边栏 -->
    <ErrorCodeDialog
      :visible.sync="errorCodeDrawerVisible"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, cancelItem, auditItem, regenerate } from '@/api/maintain/sp/preAuthRule/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import ErrorCodeDialog from './components/ErrorCodeDialog.vue';

const defaultForm = {
  applyNo: '',
  serviceProxyCode: '',
  dealerName: '',
  plateNo: '',
  vin: '',
  status: ''
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
    ErrorCodeDialog
  },
  data () {
    return {
      pageTitle: '预授权申请',
      pageType: 'list',
      moduleKey: 'AISMC-preAuthRule',
      form: {
        ...defaultForm
      },
      selectionList: [],
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      errorCodeDrawerVisible: false,
      optionObj: {
        id: 'preAuthRuleTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'applyNo',
            label: '预授权申请单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/preAuthRule/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'serviceProxyCode', label: '施工单号', visible: true, width: 180 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 150 },
          { props: 'plateNo', label: '车牌号', visible: true, width: 120 },
          { props: 'vin', label: 'VIN', visible: true, width: 180 },
          { props: 'statusLabel', label: '单据状态', visible: true, width: 100 },
          { props: 'auditorName', label: '审批人', visible: true, width: 100 },
          { props: 'auditTime', label: '审批时间', visible: true, width: 160 },
          { props: 'modifierName', label: '更新人', visible: true, width: 100 },
          { props: 'updateTime', label: '更新时间', visible: true, width: 160 },
          { props: 'creatorName', label: '创建人', visible: true, width: 100 },
          { props: 'createTime', label: '创建时间', visible: true, width: 160 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 280,
            buttons: [{
              name: '审批',
              click: (rowIndex, row) => {
                this.handleAudit(row);
              },
              type: 'primary',
              visible: (row) => row.status === 'pending'
            }, {
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/preAuthRule/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }, {
              name: '作废',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '作废',
              popconfirmTitle: '确定要作废该记录吗?',
              click: (rowIndex, row) => {
                this.handleCancel(row);
              },
              type: 'warning',
              visible: (row) => row.status !== 'canceled'
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
            }, {
              name: '重新生成',
              click: (rowIndex, row) => {
                this.handleRegenerate(row);
              },
              type: 'success',
              visible: (row) => row.status === 'rejected'
            }]
          }
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
    handleAdd () {
      this.$router.push({
        path: '/maintain/sp/preAuthRule/edit'
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
        businessType: '预授权申请',
        dataFetchPath: 'maintain/web/sp/preAuthRule/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '预授权申请.xlsx');
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
    handleErrorCodeMaintain () {
      this.errorCodeDrawerVisible = true;
    },
    handleAudit (row) {
      this.$confirm('确定要审批通过吗?', '审批确认', {
        confirmButtonText: '通过',
        cancelButtonText: '驳回',
        distinguishCancelAndClose: true,
        type: 'warning'
      }).then(() => {
        auditItem({ id: row.id, auditResult: 1 }).then(() => {
          this.$message.success('审批通过');
          this.getData();
        });
      }).catch(action => {
        if (action === 'cancel') {
          auditItem({ id: row.id, auditResult: 0 }).then(() => {
            this.$message.success('已驳回');
            this.getData();
          });
        }
      });
    },
    handleCancel (row) {
      cancelItem({ id: row.id }).then(() => {
        this.$message.success('作废成功');
        this.getData();
      });
    },
    handleRegenerate (row) {
      regenerate({ id: row.id }).then(() => {
        this.$message.success('重新生成成功');
        this.getData();
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
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
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.m-pre-auth-rule-list {
}
</style>
