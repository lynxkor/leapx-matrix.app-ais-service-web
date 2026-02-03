<template>
  <div class="page-common m-purchase-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="采购申请单">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
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
        <el-form-item label="仓库">
          <fetch-select
            :remote-method="getWarehouse"
            remote
            v-model="form.warehouseIdList"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            subLabelKey="code"
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
        <el-form-item label="订单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="PurchaseApplyApprovalStatusEnum"
            v-model="form.orderStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="缺货单号">
          <el-input
            placeholder="请输入"
            v-model="form.backOrderCode"
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
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="审批人">
          <fetch-select
            :remote-method="getUser"
            remote
            v-model="form.approver"
            placeholder="请输入名称"
            labelKey="username"
            valueKey="userId"
            clearable
            collapseTags
            filterable
            />
        </el-form-item>
        <el-form-item label="审批时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.approvalTime"
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
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
      <el-button size="small" @click="handleBatchAgree" :disabled="selectionList.length === 0">批量同意</el-button>
      <el-button size="small" @click="handleBatchReject" :disabled="selectionList.length === 0">批量驳回</el-button>
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
      :id="'1'"
      @close="handleUploadDialogClose"
    />
    <!-- 提交弹窗 -->
    <SubmitDialog
      ref="submitDialogRef"
      :visible.sync="submitDialogVisible"
      :id="purchaseId"
      :purchaseList="purchaseList"
      @close="handleSubmitDialogClose"
    />
    <!-- 同意弹窗 -->
     <AgreeDialog
      ref="agreeDialogRef"
      :visible.sync="agreeDialogVisible"
      :id="purchaseId"
      :purchaseList="purchaseList"
      @close="handleAgreeDialogClose"
    />
    <!-- 审批同意弹窗 -->
     <ApprovalDialog
      ref="approvalDialogRef"
      :visible.sync="approvalDialogVisible"
      :id="purchaseId"
      :couponObj="couponObj"
      @close="handleApprovalDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, purchaseApplyReject, purchaseApplyBatchReject, purchaseApplyListUnPurchaseDetail, purchaseApplySubmit, purchaseApplyCopy, batchAgree, purchaseApplyGetCoupon } from '@/api/sparepart/purchase/purchaseApply/index';
import { getUserByNameOrNo, getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, getParentCompany, listWarehouse, getPartDealer, getLoginUser } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import SubmitDialog from './SubmitDialog.vue';
import AgreeDialog from './AgreeDialog.vue';
import ApprovalDialog from './ApprovalDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  code: '',
  dealerCode: '',
  dealerCodeList: null,
  dealerName: '',
  companyCode: '',
  companyName: '',
  warehouseName: '',
  warehouseId: '',
  purchaseOrderType: '',
  purchaseAmount: '',
  orderStatus: '',
  submitTime: '',
  submitter: '',
  approver: '',
  approvalTime: '',
  remark: '',
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
    TagInput,
    SubmitDialog,
    AgreeDialog,
    ApprovalDialog
  },
  data () {
    return {
      pageTitle: '备件采购申请',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchaseApply',
      form: {
        ...defaultForm
      },
      isPartOrder: null, // 是否有备附件订购能力
      dealerAccountFlag: null, // 是否门店
      currentDealerCode: null, // 当前门店code
      currentDealerName: null, // 当前门店名称
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      submitDialogVisible: false, // 提交按钮弹窗
      agreeDialogVisible: false, // 同意按钮弹窗.
      approvalDialogVisible: false, // 审批按钮弹窗.
      couponObj: {}, // 优惠券对象
      approvalType: '', // 审批类型
      purchaseId: '', // 采购单ID
      purchaseList: [], // 不可采购清单
      clickItemId: '',
      optionObj: {
        id: 'purchaseApplyTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '采购申请单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseApply/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'companyCode', label: '公司编码', visible: true, width: 200 },
          { props: 'companyName', label: '公司名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '仓库名称', visible: true, width: 200 },
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 200 },
          { props: 'purchaseAmount', label: '采购金额', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 200 },
          { props: 'backOrderCode', label: '缺货单号', visible: true, width: 200 },
          { props: 'submitter', label: '提交人', visible: true, width: 200 },
          { props: 'submitTime', label: '提交时间', visible: true, width: 200 },
          { props: 'approver', label: '审批人', visible: true, width: 200 },
          { props: 'approvalTime', label: '审批时间', visible: true, width: 200 },
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
              show: (row) => {
                return row.orderStatus === '0' || row.orderStatus === '3';
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseApply/edit',
                  query: {
                    id: row.id,
                    orderType: 1
                  }
                });
              },
              type: 'info'
            }, {
              name: '删除',
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
                return row.orderStatus === '0' || row.orderStatus === '3';
              },
              click: (rowIndex, row) => {
                this.handleSubmit(row);
              },
              type: 'info'
            }, {
              name: '同意',
              show: (row) => {
                return row.orderStatus === '1';
              },
              click: (rowIndex, row) => {
                this.handleAgree(row);
              },
              type: 'info'
            }, {
              name: '驳回',
              show: (row) => {
                return row.orderStatus === '1';
              },
              click: (rowIndex, row) => {
                this.handleReject(row);
              },
              type: 'info'
            }, {
              name: '复制',
              click: (rowIndex, row) => {
                this.handleCopy(row);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.initDealerUser();
  },
  methods: {
    async initDealerUser () {
      // 查询是否厂端
      const res = await getLoginUser();
      this.dealerAccountFlag = res.dealerAccountFlag;
      this.currentDealerCode = res.currentDealerCode;// 当前门店code
      this.currentDealerName = res.currentDealerName;// 当前门店名称
      console.log(this.dealerAccountFlag);
      if (this.dealerAccountFlag === true) {
        const res = await getPartDealer({ code: this.currentDealerCode });
        this.isPartOrder = res.isPartOrder;
      }
      if (this.dealerAccountFlag === false) {
        this.isPartOrder = true;
      }
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
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },

    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    handleAdd () {
      if (this.isPartOrder === null) {
        this.$message.error('获取用户信息异常，请刷新页面重试');
        return;
      }
      if (this.isPartOrder === false) {
        // 门店名称：XXXX，不具备备附件订购能力，不允许采购
        this.$message.error('门店名称：' + this.currentDealerName + '不具备备附件订购能力，不允许采购');
        return;
      }
      this.$router.push({
        path: '/sparepart/purchase/purchaseApply/edit'
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
      exportTable({
        businessType: '备件采购申请',
        dataFetchPath: 'sparepart/web/purchase/purchaseApply/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件采购申请.xlsx');
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
    async getParentCompany (query) {
      try {
        const res = await getParentCompany({ parentCompanyName: query });
        res.records = res.records?.map(item => ({
          ...item,
          displayName: item.companyName + `(${item.companyCode})`
        }));
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

      if (this.form.approvalTime) {
        delete data.approvalTime;
        if (this.form.approvalTime.length > 1) {
          data.approvalTimeStart = this.form.approvalTime[0];
          data.approvalTimeEnd = this.form.approvalTime[1];
        }
      }

      if (this.form.submitTime) {
        delete data.submitTime;
        if (this.form.submitTime.length > 1) {
          data.submitTimeStart = this.form.submitTime[0];
          data.submitTimeEnd = this.form.submitTime[1];
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
    async handleSubmit (val) {
      const res = await purchaseApplyListUnPurchaseDetail({ id: val.id });
      if (res.length > 0) {
        this.purchaseId = val.id;
        this.purchaseList = res || [];
        this.submitDialogVisible = true;
      } else {
        this.$confirm({
          message: '确认提交吗？',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await purchaseApplySubmit({ id: val.id });
          this.$message.success('提交成功!');
          this.getData();
        }).catch(() => {});
      }
    },
    handleSubmitDialogClose () {
      this.submitDialogVisible = false;
    },
    // 同意
    async handleAgree (val) {
      const res = await purchaseApplyListUnPurchaseDetail({ id: val.id });
      if (res.length > 0) {
        this.purchaseId = val.id;
        this.purchaseList = res || [];
        this.agreeDialogVisible = true;
      } else if (res.length === 0) {
        const res = await purchaseApplyGetCoupon({ id: val.id });
        this.couponObj = res;
        this.approvalDialogVisible = true;
      }
    },
    // 批量同意
    handleBatchAgree () {
      const idList = this.selectionList.map(item => item.id);
      this.$prompt('请输入审批说明', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async (result) => {
        console.log('result', result);
        await batchAgree({ idList, approvalDescription: result.value });
        this.getData();
      });
    },
    handleAgreeDialogClose () {
      this.agreeDialogVisible = false;
    },
    handleApprovalDialogClose () {
      this.approvalDialogVisible = false;
    },
    // 驳回
    handleReject (val) {
      this.allHandleReject(false, val);
    },
    // 批量驳回
    handleBatchReject () {
      this.allHandleReject(true);
    },
    // 统一驳回方法
    async allHandleReject (isBatch = false, rowData = null) {
      const idList = isBatch
        ? (this.selectionList.map(item => item.id) || [])
        : [rowData.id];

      if (isBatch && !idList.length) {
        this.$message.warning('请先选择要驳回的记录');
        return;
      }

      try {
        const result = await this.$prompt('请输入审批说明', '驳回', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const approvalDescription = result.value;
        const params = isBatch
          ? { idList, approvalDescription }
          : { id: rowData.id, approvalDescription };

        const response = isBatch
          ? await purchaseApplyBatchReject(params)
          : await purchaseApplyReject(params);

        this.$message.success('驳回成功!');
        this.getData();
        return response;
      } catch (error) {
        if (error !== 'cancel' && error !== 'close') {
          this.$message.error('驳回失败!');
        }
      }
    },
    // 复制
    async handleCopy (row) {
      const res = await purchaseApplyCopy({ id: row.id });
      this.$router.push({
        path: '/sparepart/purchase/purchaseApply/edit',
        query: {
          id: res
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-purchase-apply-list {
}
</style>
