<template>
  <div class="page-common m-oem-outbound-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="出库单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="采购订单号">
        <tag-input v-model="form.purchaseOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="采购申请单号"  v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.purchaseApplyCodeList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="发货仓库">
          <fetch-select
            :remote-method="getOemWarehouse"
            remote
            v-model="form.deliveryWarehouse"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            subLabelKey="code"
            clearable
            collapseTags
            filterable
          />
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
        <el-form-item label="订单类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="PurchaseOrderTypeEnum"
            v-model="form.purchaseOrderType"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="发运单">
          <el-input
            placeholder="请输入"
            v-model="form.logisticsOrderNo"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单同步是否成功">
          <el-input
            placeholder="请输入"
            v-model="form.orderSyncSuccessIs"
            clearable
          />
        </el-form-item>
        <el-form-item label="SAP返回信息">
          <el-input
            placeholder="请输入"
            v-model="form.sapReturnInfoLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售凭证">
          <tag-input v-model="form.salesVoucherList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="交货凭证">
          <tag-input v-model="form.deliveryVoucherList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="发票号">
          <tag-input v-model="form.invoiceNoList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="开票日期">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.invoiceDate"
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchSync" :disabled="selectionList.length === 0" v-permission="'AISPART-oemOutboundOrder-async'">同步</el-button>
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
    <!-- 物流信息抽屉 -->
    <LogisticsDrawer
      ref="logisticsDrawerRef"
      :visible.sync="logisticsDrawerVisible"
      :drawerData="logisticsData"
      @update:visible="val => logisticsDrawerVisible = val"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, getAsync } from '@/api/sparepart/warehouse/oemOutboundOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, listWarehouse, listOemWarehouse } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import LogisticsDrawer from '@/libs/components/LogisticsDrawer';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  code: '',
  purchaseOrderCode: '',
  purchaseApplyCode: '',
  dealerCode: '',
  purchaseOrderType: '',
  logisticsOrderNo: '',
  orderSyncSuccessIs: '',
  sapReturnInfo: '',
  salesVoucher: '',
  deliveryVoucher: '',
  invoiceNo: '',
  invoiceDate: '',
  taxInvoiceNo: '',
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
    LogisticsDrawer
  },
  data () {
    return {
      pageTitle: 'OEM出库单',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-oemOutboundOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      logisticsData: {}, // 物流信息
      logisticsDrawerVisible: false, // 物流信息抽屉
      clickItemId: '',
      optionObj: {
        id: 'oemOutboundOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '出库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/warehouse/oemOutboundOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'purchaseOrderCode',
            label: '采购订单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseOrder/edit',
                  query: {
                    id: row.purchaseOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'purchaseApplyCode',
            label: '采购申请单',
            visible: true,
            width: 180,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseApply/edit',
                  query: {
                    id: row.purchaseApplyId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'deliveryWarehouseName', label: '发货仓库', visible: true, width: 180 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 180 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 120 },
          {
            props: 'logisticsOrderNo',
            label: '发运单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.getLogisticsInfo(row);
              },
              type: 'primary'
            }]
          },
          { props: 'orderSyncSuccessIsLabel', label: '订单同步是否成功', visible: true, width: 160 },
          { props: 'sapReturnInfo', label: 'SAP返回信息', visible: true, width: 200 },
          { props: 'salesVoucher', label: '销售凭证', visible: true, width: 160 },
          { props: 'deliveryVoucher', label: '交货凭证', visible: true, width: 160 },
          { props: 'invoiceNo', label: '发票号', visible: true, width: 200 },
          { props: 'invoiceDate', label: '开票日期', visible: true, width: 200 },
          { props: 'taxInvoiceNo', label: '税务发票号', visible: true, width: 200 },
          { props: 'purchaseAmount', label: '采购金额', visible: true, align: 'right', width: 120 },
          { props: 'cashAmount', label: '现金金额', visible: true, align: 'right', width: 120 },
          { props: 'rebateAmount', label: '返利金额', visible: true, align: 'right', width: 120 },
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
              name: '同步',
              show: (row) => {
                return (row.orderSyncSuccessIs === '0' || row.outboundSyncSuccessIs === '0' || row.invoiceSyncSuccessIs === '0') && this.permissions.has('AISPART-oemOutboundOrder-async');
              },
              click: (rowIndex, row) => {
                this.handleSync(row.id);
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
  },
  methods: {
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getOemWarehouse (query) {
      try {
        const res = await listOemWarehouse({ codeOrName: query });
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
        path: '/sparepart/warehouse/oemOutboundOrder/edit'
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
      };
      exportTable({
        businessType: 'OEM出库单',
        dataFetchPath: 'sparepart/web/warehouse/oemOutboundOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, 'OEM出库单.xlsx');
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
      if (this.form.invoiceDate) {
        delete data.invoiceDate;
        if (this.form.invoiceDate.length > 1) {
          data.invoiceDateStart = this.form.invoiceDate[0];
          data.invoiceDateEnd = this.form.invoiceDate[1];
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
    // 公共执行逻辑
    _doSync (params, successMsg) {
      this.$confirm('此操作将同步选中项，是否继续?', '提示', { type: 'warning' })
        .then(() => getAsync(params))
        .then(() => {
          this.$message({ type: 'success', message: successMsg });
          this.getData();
        })
        .catch(err => {
        // 用户取消不报错，接口失败才报错
          if (err !== 'cancel') {
            this.$message({ type: 'error', message: err?.message || '同步失败' });
          }
        });
    },

    // 单个同步
    handleSync (val) {
      this._doSync({ id: val }, '同步成功!');
    },

    // 批量同步
    handleBatchSync () {
    // 1. 先检查是否选中
      if (!this.selectionList.length) {
        return this.$message({ type: 'warning', message: '请先选择数据' });
      }
      // 2. 提取 ID 并调用
      const ids = this.selectionList.map(item => item.id);
      this._doSync({ idList: ids }, `成功同步 ${ids.length} 项`);
    },
    // 打开物流信息抽屉
    getLogisticsInfo (row) {
      this.logisticsData = {
        logisticsProvider: row.logisticsProvider,
        logisticsOrderNo: row.logisticsOrderNo,
      };
      this.logisticsDrawerVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-oem-outbound-order-list {
}
</style>
