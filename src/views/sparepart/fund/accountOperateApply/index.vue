<template>
  <div class="page-common m-account-operate-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
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
        <el-form-item label="账户编号">
          <tag-input v-model="form.accountCodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="公司" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :remote-method="getParentCompany"
            remote
            v-model="form.companyCodeList"
            placeholder="请选择"
            labelKey="companyName"
            valueKey="companyCode"
            subLabelKey="companyCode"
            clearable
            multiple
            collapseTags
            filterable
          />
        </el-form-item>
      <template v-if="show">
        <el-form-item label="充值流水">
          <el-input
            placeholder="请输入"
            v-model="form.code"
            clearable
          />
        </el-form-item>
        <el-form-item label="审批状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="AccountOperateApplyApprovalStateEnum"
            v-model="form.approvalStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="流程审批号">
          <el-input
            placeholder="请输入"
            v-model="form.approvalProcessNo"
            clearable
          />
        </el-form-item>
        <el-form-item label="提交人">
          <fetch-select
            :remote-method="getUser"
            remote
            v-model="form.submitter"
            placeholder="请输入名称"
            labelKey="username"
            valueKey="userId"
            clearable
            collapseTags
            filterable
            />
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.submitTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="充值说明" >
          <el-input
            placeholder="请输入"
            v-model="form.rechargeDescriptionLike"
            clearable
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
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button size="small" @click="handleBatchAgree" :disabled="selectionList.length === 0" v-permission="'AISPART-accountOperateApply-agree'">批量通过</el-button>
      <el-button size="small" @click="handleBatchReject" :disabled="selectionList.length === 0" v-permission="'AISPART-accountOperateApply-reject'">批量驳回</el-button>
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
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :businessParams="'RECHARGE'"
      id="sparePartAccountRechargeApplyImport"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, getCommit, getAgree, getAgreeBatch, getReject, getRejectBatch } from '@/api/sparepart/fund/accountOperateApply/index';
import { getUserByNameOrNo, getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, getSparePartCompany, listWarehouse } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  operateType: 'RECHARGE',
  accountCode: '',
  companyCode: '',
  flowNo: '',
  dataSource: '',
  dealerCode: '',
  approvalStatusList: '',
  expenseCategory: '',
  budgetCenter: '',
  approvalProcessNo: '',
  submitter: '',
  submitTime: '',
  transactionAmount: '',
  rechargeDescription: '',
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
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: this.accountName,
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-accountOperateApply',
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
      operateType: '1',
      optionObj: {
        id: 'accountOperateApplyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'accountCode',
            label: '账户编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/fund/accountOperateApply/edit',
                  query: {
                    id: row.id
                  }
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
                window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'companyCode', label: '公司编码', visible: true, width: 180 },
          { props: 'companyName', label: '公司名称', visible: true, width: 200 },
          { props: 'code', label: '充值流水', visible: true, width: 200 },
          { props: 'approvalStatusLabel', label: '审批状态', visible: true, width: 120 },
          { props: 'expenseCategory', label: '费用类别', visible: true, width: 120 },
          { props: 'budgetCenter', label: '预算归口', visible: true, width: 200 },
          { props: 'approvalProcessNo', label: '审批流程编号', visible: true, width: 200 },
          { props: 'submitterName', label: '提交人', visible: true, width: 120 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 200 },
          { props: 'transactionAmount', label: '交易金额', visible: true, align: 'right', width: 120 },
          { props: 'rechargeDescription', label: '充值说明', visible: true, width: 200 },
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
              show: (row) => {
                return row.approvalStatus === '10' || row.approvalStatus === '40';
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/fund/accountOperateApply/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
              popconfirmConfirmButtonType: 'danger',
              popconfirmConfirmButtonText: '删除',
              show: (row) => {
                return row.approvalStatus === '10' || row.approvalStatus === '40';
              },
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
              name: '提交',
              show: (row) => {
                return (row.approvalStatus === '10' || row.approvalStatus === '40') && this.permissions.has('AISPART-accountOperateApply-commit');
              },
              click: (rowIndex, row) => {
                this.handleSubmit(row.id);
              },
              type: 'info'
            }, {
              name: '通过',
              show: (row) => {
                return row.approvalStatus === '20' && this.permissions.has('AISPART-accountOperateApply-agree');
              },
              click: (rowIndex, row) => {
                this.handleAgree(row.id);
              },
              type: 'info'
            }, {
              name: '驳回',
              show: (row) => {
                return row.approvalStatus === '20' && this.permissions.has('AISPART-accountOperateApply-reject');
              },
              click: (rowIndex, row) => {
                this.handleReject(row.id);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
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
        path: '/sparepart/fund/accountOperateApply/edit'
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
      const reqParams = { ...this.getFormData(), businessType: this.$route.query.type } || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        dataFetchPath: 'sp/web/fund/accountOperateApply/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, this.$route.query.name + '.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
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
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getUser (query) {
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getParentCompany (query) {
      try {
        const res = await getSparePartCompany({ codeOrNameLike: query });
        res.records = res.records?.map(item => ({
          ...item,
          displayName: item.companyName + `(${item.companyCode})`
        }));
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
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
        if (data[key] === '' || data[key] === null || data[key].length === 0) {
          delete data[key];
        }
      });
      if (this.form.submitTime) {
        delete data.submitTime;
        if (this.form.submitTime.length > 1) {
          data.submitTimeStart = this.form.submitTime[0];
          data.submitTimeEnd = this.form.submitTime[1];
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
    },
    // 提交
    handleSubmit (val) {
      let title = '充值说明';
      this.$prompt(`请输入${title}`, '提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: ''
      }).then((reason) => {
        if (!reason.value) {
          this.$message({
            type: 'error',
            message: `请输入${title}!`
          });
          return;
        }
        getCommit({
          id: val,
          description: reason.value
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
        });
      }).catch(() => {});
    },
    // 1. 公共方法：处理带 Confirm 的操作 (通过)
    _handleConfirm (apiFn, params, successMsg) {
      this.$confirm('确定通过吗？', '提示', { type: 'warning' })
        .then(() => apiFn(params))
        .then(() => {
          this.$message({ type: 'success', message: successMsg });
          this.getData();
        })
        .catch(err => err !== 'cancel' && this.$message({ type: 'error', message: '操作失败' }));
    },

    // 2. 公共方法：处理带 Prompt 的操作 (驳回)
    _handlePrompt (apiFn, params, successMsg) {
      this.$prompt('请输入审批说明！', '驳回', { inputValue: '' })
        .then(({ value }) => {
          return apiFn({ ...params, description: value });
        })
        .then(() => {
          this.$message({ type: 'success', message: successMsg });
          this.getData();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // --- 单个操作 ---
    handleAgree (val) {
      this._handleConfirm(getAgree, { id: val }, '通过成功!');
    },
    handleReject (val) {
      this._handlePrompt(getReject, { id: val }, '驳回成功!');
    },

    // --- 批量操作 ---
    handleBatchAgree () {
      const idList = this.selectionList.map(i => i.id);
      this._handleConfirm(getAgreeBatch, { idList }, `成功通过 ${idList.length} 项`);
    },
    handleBatchReject () {
      const idList = this.selectionList.map(i => i.id);
      this._handlePrompt(getRejectBatch, { idList }, `成功驳回 ${idList.length} 项`);
    }
  }
};
</script>

<style lang="scss" scoped>
.m-account-operate-apply-list {
}
</style>
