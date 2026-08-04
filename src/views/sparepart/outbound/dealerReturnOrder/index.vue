<template>
  <div class="page-common m-dealer-return-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="外购入库单号">
        <tag-input v-model="form.dealerInboundOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="外购退货单">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="供应商名称" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :remote-method="getSupplierList"
          remote
          v-model="form.supplierInfoId"
          placeholder="请输入供应商编码或名称"
          labelKey="name"
          valueKey="id"
          subLabelKey="code"
          clearable
          collapseTags
          filterable
          />
      </el-form-item>
      <template v-if="show">
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
        <el-form-item label="订单状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerReturnOrderOrderStatusEnum"
            v-model="form.orderStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="出库状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerReturnOrderOutboundStatusEnum"
            v-model="form.outboundStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="homePage"></el-tab-pane>
      <el-tab-pane label="全部备件" name="allSpareParts"></el-tab-pane>
    </el-tabs>
    <div
      class="ais-table-c"
      v-if="activeName === 'homePage'"
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
      v-if="activeName === 'allSpareParts'"
    >
      <LPVxeTable
        :key="2"
        ref="tableRefAll"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObjAll"
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
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, detailPage, deleteItem, enableItem, dealerReturnOrderAgree, dealerReturnOrderCancel, dealerReturnOrderOutbound } from '@/api/sparepart/outbound/dealerReturnOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, getSupplierInfo, getLoginUser } from '@/api/common';
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
  codeList: [],
  dealerInboundOrderCodeList: [],
  dealerCodeList: [],
  dealerName: '',
  warehouseId: '',
  supplierInfoId: '',
  outboundStatusList: [],
  totalAmount: '',
  createTime: '',
  updateTime: '',
  orderStatusList: [],

  // ===== 全部备件 tab 专用（仅 allSpareParts 用） =====
  sparePartCodeList: null,
  sparePartName: '',
  deliveryNoList: null,
  saleVoucherList: null,
  inboundNoList: null,
  purchaseOrderNoList: null,
  locationNameList: null,
  locationCodeList: null,
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
      pageTitle: '外购件退货单',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-dealerReturnOrder',
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
      activeName: 'homePage',
      optionObj: {
        id: 'dealerReturnOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '外购退货单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/outbound/dealerReturnOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerInboundOrderCode',
            label: '外购入库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/inbound/dealerInboundOrder/edit',
                  query: {
                    id: row.dealerInboundOrderId
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
          { props: 'warehouseName', label: '备件仓库', visible: true, width: 200 },
          { props: 'supplierName', label: '供应商名称', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 120 },
          { props: 'outboundStatusLabel', label: '出库状态', visible: true, width: 120 },
          { props: 'totalAmount', label: '出库总金额', visible: true, width: 120, align: 'right' },
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
                return row.orderStatus === '10';
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/outbound/dealerReturnOrder/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '打印出库单',
              show: (row) => {
                return this.permissions.has('AISPART-dealerReturnOrder-outbound');
              },
              click: (rowIndex, row) => {
                this.handlePrint(row);
              },
              type: 'info'
            }, {
              name: '通过',
              show: (row) => {
                return row.orderStatus === '10' && this.permissions.has('AISPART-dealerReturnOrder-agree');
              },
              popconfirmTitle: '此操作将通过订单, 是否继续?',
              click: (rowIndex, row) => {
                dealerReturnOrderAgree({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '通过成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '通过失败!'
                  });
                });
              },
              type: 'info'
            }, {
              name: '作废',
              show: (row) => {
                return row.orderStatus === '10' && this.permissions.has('AISPART-dealerReturnOrder-cancel');
              },
              click: (rowIndex, row) => {
                this.handleVoid(row);
              },
              type: 'info'
            }, {
              name: '出库',
              show: (row) => {
                return row.orderStatus === '20' && row.outboundStatus === '10' && this.permissions.has('AISPART-dealerReturnOrder-outbound');
              },
              popconfirmTitle: '此操作将出库订单, 是否继续?',
              click: (rowIndex, row) => {
                dealerReturnOrderOutbound({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '出库成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '出库失败!'
                  });
                });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      optionObjAll: {
        id: 'dealerReturnOrderTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          /* ========== 订单维度 ========== */
          {
            props: 'returnCode',
            label: '外购退货单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/dealerReturnOrder/edit', query: { id: row.returnId } }); }, type: 'primary' }]
          },
          { props: 'inboundCode', label: '外购入库单号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/dealerInboundOrder/edit', query: { id: row.inboundId } }); }, type: 'primary' }] },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.dealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '备件仓库', visible: true, width: 200 },
          { props: 'supplierName', label: '供应商名称', visible: true, width: 200 },
          { props: 'orderStatusLabel', label: '订单状态', visible: true, width: 120 },
          { props: 'outboundStatusLabel', label: '出库状态', visible: true, width: 120 },
          {
            props: 'outboundAmount',
            label: '出库金额',
            visible: true,
            width: 140,
            align: 'right'
          },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },

          /* ========== 明细维度 ========== */
          { props: 'sparePartCode', label: '备件编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/sparePart/detail', query: { id: row.sparePartId } }); }, type: 'primary' }] },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'locationCode', label: '库位编码', visible: true, width: 120 },
          {
            props: 'availableQty',
            label: '可用库存',
            visible: true,
            width: 120,
            align: 'right'
          },
          {
            props: 'unitPrice',
            label: '单价',
            visible: true,
            width: 120,
            align: 'right'
          },
          {
            props: 'outboundQty',
            label: '出库数量',
            visible: true,
            width: 120,
            align: 'right'
          },
          {
            props: 'outboundAmountDetail',
            label: '出库金额',
            visible: true,
            width: 140,
            align: 'right'
          },
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
    this.getLoginUser();
  },
  methods: {
    async getLoginUser () {
      try {
        const res = await getLoginUser();
        this.dealerCode = res.currentDealerCode;
        this.dealerName = res.currentDealerName;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
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
    getOptionObj () {
      if (this.activeName === 'homePage') {
        return this.optionObj;
      } else if (this.activeName === 'allSpareParts') {
        return this.optionObjAll;
      }
      return this.optionObj;
    },
    handleClick (item) {
      this.activeName = item.name;
      this.show = false;
      // 跨 tab 切换时，把所有 tab 的分页状态都重置为 page 1 + 默认 size
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.optionObjAll.form.page = 1;
      this.optionObjAll.form.size = pageSize;
      this.onReset();
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

    async getSupplierList (query) {
      try {
        const res = await getSupplierInfo({ supplierCodeOrNameLike: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/outbound/dealerReturnOrder/edit'
      });
    },
    onSubmit () {
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      // 全部备件 tab：默认创建时间 = 最近一个月（end 用 23:59:59）
      const extraDefaults = this.activeName === 'allSpareParts'
        ? { createTime: this.getLastMonthRange() }
        : {};
      this.form = { ...defaultForm, ...extraDefaults };
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      optionObj.form.size = pageSize;
      this.getData();
    },
    getLastMonthRange () {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      const fmt = (d, isEnd) => {
        const pad = (n) => (n < 10 ? `0${n}` : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${isEnd ? '23:59:59' : '00:00:00'}`;
      };
      return [fmt(start, false), fmt(end, true)];
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '外购件退货单',
        dataFetchPath: 'sp/web/dealer/dealerReturnOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '外购件退货单.xlsx');
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
    getData () {
      this.loading = true;
      this.selectionList = [];
      const optionObj = this.getOptionObj();

      const fetchApi = this.activeName === 'allSpareParts' ? detailPage : getList;
      const formData = this.getFormData();
      if (formData === null) {
        this.loading = false;
        return;
      }
      fetchApi({ ...formData, pageNum: optionObj.form.page, pageSize: optionObj.form.size })
        .then(res => {
          console.log(res);
          if (!res || !res.records) return;
          optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          optionObj.total = res.total;
        }).catch(err => {
          console.error('获取列表数据失败:', err);
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      const optionObj = this.getOptionObj();
      return new Promise((resolve, reject) => {
        getTableConfig(optionObj.id).then(data => {
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
      const optionObj = this.getOptionObj();
      if (type === 'page') {
        optionObj.form.page = num;
      } else {
        optionObj.form.size = num;
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
    // 打印外购件退货单
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'ReturnOrderPurchased', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}厅店外购件退货单`// 可选，打印标题
      });
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
    // 作废
    handleVoid (val) {
      this.$prompt('请输入审批原因！', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        // 调用驳回接口
        dealerReturnOrderCancel({ id: val.id, description: value }).then(() => {
          this.$message({
            type: 'success',
            message: '作废成功!'
          });
          this.getData();
        });
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-dealer-return-order-list {
}
</style>
