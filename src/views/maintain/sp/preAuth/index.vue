<template>
  <div class="page-common m-pre-auth-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="预授权申请单号">
        <el-input
          placeholder="请输入"
          v-model="form.code"
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
        <dealer-select v-model="form.dealerCode"/>
      </el-form-item>
      <template v-if="show">
        <el-form-item label="车牌号">
          <el-input
            placeholder="请输入"
            v-model="form.licensePlateNo"
            clearable
          />
        </el-form-item>
        <el-form-item label="VIN">
          <el-input
            placeholder="请输入"
            v-model="form.vehProfileVin"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="AuditStatusEnum"
            v-model="form.statusIncludeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
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
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新建</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="handleErrorCodeMaintain">错误代码维护</el-button>
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
    <!-- 审核对话框 -->
    <AuditDialog
      ref="auditDialog"
      :visible.sync="auditDialogVisible"
      :business-id="currentApprovalRow ? currentApprovalRow.id : ''"
      :info="currentApprovalRow"
      @success="getData"
    />
    <ErrorCodeDialog
      ref="errorCodeDialog"
      :visible.sync="errorCodeDialogVisible"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, cancelItem, auditItem, regenerate, getEnum } from '@/api/maintain/sp/preAuth/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getPartDealer } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import AuditDialog from './components/AuditDialog/index.vue';
import ErrorCodeDialog from './components/ErrorCodeDialog/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';
import { AUDIT_STATUS } from './constant.js';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  code: '',
  serviceProxyCode: '',
  dealerName: '',
  licensePlateNo: '',
  vehProfileVin: '',
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
    AuditDialog,
    ErrorCodeDialog,
    DealerSelect
  },
  data () {
    return {
      pageTitle: '预授权申请',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-preAuth',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      currentApprovalRow: {}, // 当前审批的行数据
      auditDialogVisible: false, // 审核对话框显示状态
      errorCodeDialogVisible: false, // 错误代码维护对话框显示状态
      optionObj: {
        id: 'preAuthTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '预授权申请单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/preAuth/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'serviceProxyCode', label: '施工单号', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'carPlate', label: '车牌号', visible: true, width: 150 },
          { props: 'vehProfileVin', label: 'VIN', visible: true, width: 200 },
          { props: 'approvalStatusLabel', label: '单据状态', visible: true, width: 150 },
          { props: 'approver', label: '审批人', visible: true, width: 150 },
          { props: 'approvalOn', label: '审批时间', visible: true, width: 180 },
          { props: 'modifierName', label: '更新人', visible: true, width: 150 },
          { props: 'updateTime', label: '更新时间', visible: true, width: 180 },
          { props: 'creatorName', label: '创建人', visible: true, width: 150 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 350,
            buttons: [{
              name: '审批',
              click: (rowIndex, row) => {
                this.handleApprove(row, 'pass');
              },
              type: 'info',
              show: (row) => row.approvalStatus === AUDIT_STATUS.IN_PROGRESS // 审批中
            }, {
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/preAuth/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info',
              show: (row) => row.approvalStatus === AUDIT_STATUS.TODO || row.approvalStatus === AUDIT_STATUS.REJECTED // 待提交或审批驳回
            }, {
              name: '作废',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '作废',
              popconfirmTitle: '确定要作废该记录吗?',
              click: (rowIndex, row) => {
                this.handleCancel(row);
              },
              type: 'info',
              show: (row) => row.approvalStatus === AUDIT_STATUS.REJECTED // 审批驳回
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
              type: 'danger',
              show: (row) => row.approvalStatus === AUDIT_STATUS.TODO // 待提交
            }, {
              name: '重新申请',
              click: (rowIndex, row) => {
                // this.handleRegenerate(row);
                this.$router.push({
                  path: '/maintain/sp/preAuth/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info',
              show: (row) => row.approvalStatus === AUDIT_STATUS.EXPIRED // 已过期
            }, {
              name: '激活',
              click: (rowIndex, row) => {
                this.handleApprove(row, 'pass');
              },
              type: 'info',
              show: (row) => row.approvalStatus === AUDIT_STATUS.REFUSED // 已拒绝
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
    handleAdd () {
      this.$router.push({
        path: '/maintain/sp/preAuth/edit'
      });
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
      cancelItem(row.id).then(() => {
        this.$message.success('作废成功');
        this.getData();
      });
    },
    handleApprove (row, action) {
      // 打开审核对话框
      this.currentApprovalRow = row;
      this.$nextTick(() => {
        this.auditDialogVisible = true;
      });
    },
    handleErrorCodeMaintain () {
      this.errorCodeDialogVisible = true;
    },
    handleRegenerate (row) {
      this.$confirm('确定要重新生成该申请吗?', '重新生成确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        regenerate(row.id).then(() => {
          this.$message.success('重新生成成功');
          this.getData();
        }).catch(() => {
          this.$message.error('重新生成失败');
        });
      }).catch(() => {
        // 用户取消操作
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
        businessType: '预授权申请表管理',
        dataFetchPath: 'maintain/web/sp/preAuth/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '预授权申请表管理.xlsx');
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
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              // deleteLoading: false
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
    // 门店搜索相关方法
    async fetchDealerOptions (query) {
      if (query) {
        const params = {
          pageNum: 1,
          pageSize: 100,
          nameLike: query // 假设API支持名称模糊查询
        };
        try {
          const res = await getPartDealer(params);
          return (res?.records || []).map(dealer => ({
            label: dealer.name || dealer.dealerName,
            value: dealer.code || dealer.id
          }));
        } catch (error) {
          console.error('获取门店列表失败', error);
          return [];
        }
      }
      return [];
    },
    async searchDealers (query) {
      if (query) {
        const params = {
          pageNum: 1,
          pageSize: 100,
          nameLike: query
        };
        try {
          const res = await getPartDealer(params);
          return (res?.records || []).map(dealer => ({
            label: dealer.name || dealer.dealerName,
            value: dealer.code || dealer.id
          }));
        } catch (error) {
          console.error('搜索门店失败', error);
          return [];
        }
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
.m-pre-auth-list {
}
</style>
