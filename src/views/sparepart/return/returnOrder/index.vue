<template>
  <div class="page-common m-return-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="备件退货单号">
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
      <el-form-item label="备件仓库">
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
      <template v-if="show">
        <el-form-item label="退货原因" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :request="fetchOptions"
            enumCode="ReturnReasonEnum"
            v-model="form.returnReasonList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="退货状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="ReturnStatusEnum"
            v-model="form.returnStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="发货时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.deliveryTime"
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
        <!-- ===== 全部备件 tab 专用查询 ===== -->
        <el-form-item label="备件编码" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.sparePartCodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备件名称" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input placeholder="请输入" v-model="form.sparePartName" clearable />
        </el-form-item>
        <el-form-item label="交货单号" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.deliveryNoList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="销售凭证" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.saleVoucherList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="入库单号" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.inboundNoList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="采购订单号" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.purchaseOrderNoList" placeholder="请输入" />
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
    />
    <!-- 发运 -->
    <ShipmentDialog
      :visible.sync="shipmentDialogVisible"
      :id="shipmentId"
      @update:visible="val => shipmentDialogVisible = val"
      @success="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, detailPage, deleteItem, enableItem, returnOrderCancel, returnOrderAgree, returnOrderRevoke, returnOrderCommit, returnOrderReject } from '@/api/sparepart/return/returnOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, listWarehouse, getLoginUser } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import ShipmentDialog from './ShipmentDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化,自行校对
  code: '',
  codeList: null,
  dealerCode: '',
  dealerCodeList: null,
  warehouseId: '',
  warehouseIdList: null,
  returnReason: '',
  returnReasonList: null,
  returnStatus: '',
  returnStatusList: null,
  deliveryTime: '',
  remark: '',
  createTime: '',
  updateTime: '',
  // ===== 全部备件 tab 专用（仅 allSpareParts 用） =====
  sparePartCodeList: null,
  sparePartName: '',
  deliveryNoList: null,
  saleVoucherList: null,
  inboundNoList: null,
  purchaseOrderNoList: null,
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
    ShipmentDialog
  },
  data () {
    return {
      pageTitle: '备件退货单',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-returnOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      shipmentDialogVisible: false, // 发运弹窗
      shipmentId: '', // 发运弹窗id
      clickItemId: '',
      activeName: 'homePage',
      accountFlag: false, // 账号类型 true为门店 false为主机厂
      optionObj: {
        id: 'returnOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '备件退货单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/return/returnOrder/edit',
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
          { props: 'warehouseName', label: '备件仓库', visible: true, width: 200 },
          { props: 'returnReasonLabel', label: '退货原因', visible: true, width: 200 },
          { props: 'returnStatusLabel', label: '退货状态', visible: true, width: 120 },
          { props: 'logisticsOrderNo', label: '物流单号', visible: true, width: 200 },
          { props: 'logisticsProvider', label: '物流商', visible: true, width: 120 },
          { props: 'deliveryTime', label: '发货时间', visible: true, width: 200 },
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
                const editableStatus = ['10', '30'];
                if (this.accountFlag) {
                  return editableStatus.includes(row.returnStatus);
                }
                return ['10', '20', '30', '40'].includes(row.returnStatus);
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/return/returnOrder/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '同意',
              show: (row) => {
                return row.returnStatus === '20' && this.permissions.has('AISPART-returnOrder-agree');
              },
              popconfirmTitle: '是否同意退货申请?',
              click: (rowIndex, row) => {
                returnOrderAgree({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '同意成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '同意失败!'
                  });
                });
              },
              type: 'info'
            }, {
              name: '撤回',
              show: (row) => {
                return row.returnStatus === '40' && this.permissions.has('AISPART-returnOrder-revoke');
              },
              popconfirmTitle: '是否撤回退货申请?',
              click: (rowIndex, row) => {
                returnOrderRevoke({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '撤回成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '撤回失败!'
                  });
                });
              },
              type: 'info'
            },
            // {
            //   name: '删除',
            //   show: (row) => {
            //     return row.returnStatus === '90';
            //   },
            //   popconfirmTitle: '此操作将永久删除, 是否继续?',
            //   click: (rowIndex, row) => {
            //     deleteItem([row.id]).then(() => {
            //       this.$message({
            //         type: 'success',
            //         message: '删除成功!'
            //       });
            //       this.getData();
            //     }).catch(() => {
            //       this.$message({
            //         type: 'error',
            //         message: '删除失败!'
            //       });
            //     });
            //   },
            //   type: 'danger'
            // },
            {
              name: '打印退货单',
              show: (row) => {
                return this.permissions.has('AISPART-returnOrder-printReturn');
              },
              click: (rowIndex, row) => {
                this.handlePrint(row);
              },
              type: 'info'
            }, {
              name: '打印退货标签',
              show: (row) => {
                return this.permissions.has('AISPART-returnOrder-printTag');
              },
              click: (rowIndex, row) => {
                this.handlePrintLabel(row);
              },
              type: 'info'
            }, {
              name: '提交',
              show: (row) => {
                return (row.returnStatus === '10' || row.returnStatus === '30') && this.permissions.has('AISPART-returnOrder-commit');
              },
              popconfirmTitle: '是否提交退货申请?',
              click: (rowIndex, row) => {
                returnOrderCommit({ id: row.id }).then(() => {
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
              },
              type: 'info'
            }, {
              name: '作废',
              show: (row) => {
                return (row.returnStatus === '10' || row.returnStatus === '30') && this.permissions.has('AISPART-returnOrder-cancel');
              },
              click: (rowIndex, row) => {
                this.handleVoid(row);
              },
              type: 'info'
            }, {
              name: '驳回',
              show: (row) => {
                return row.returnStatus === '20' && this.permissions.has('AISPART-returnOrder-reject');
              },
              click: (rowIndex, row) => {
                this.handleReject(row);
              },
              type: 'info'
            }, {
              name: '发运',
              show: (row) => {
                return row.returnStatus === '40' && this.permissions.has('AISPART-returnOrder-shipping');
              },
              click: (rowIndex, row) => {
                this.handleShipment(row);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      optionObjAll: {
        id: 'returnOrderTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          /* ========== 订单维度 ========== */
          {
            props: 'backOrderCode',
            label: '备件退货单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({ path: '/sparepart/return/returnOrder/edit', query: { id: row.backOrderId || row.id } });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.dealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '备件仓库', visible: true, width: 200 },
          { props: 'returnReasonLabel', label: '退货原因', visible: true, width: 120 },
          { props: 'returnStatusLabel', label: '退货状态', visible: true, width: 120 },
          { props: 'logisticsNo', label: '物流单号', visible: true, width: 200 },
          { props: 'logisticsProvider', label: '物流商', visible: true, width: 200 },
          { props: 'deliveryTime', label: '发货时间', visible: true, width: 200 },
          { props: 'remark', label: '订单备注', visible: true, width: 200 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },

          /* ========== 明细维度 ========== */
          {
            props: 'sparePartCode',
            label: '备件编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({ path: '/sparepart/basic/sparePart/detail', query: { id: row.sparePartId } });
              },
              type: 'primary'
            }]
          },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'returnQty', label: '退货数量', visible: true, align: 'right', width: 120 },
          { props: 'qualifiedQty', label: '合格数量', visible: true, align: 'right', width: 120 },
          { props: 'deliveryNo', label: '交货单号', visible: true, width: 200 },
          { props: 'saleVoucher', label: '销售凭证', visible: true, width: 200 },
          { props: 'inboundNo', label: '入库单号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/inbound/dealerInboundOrder/edit', query: { id: row.inboundId } }); }, type: 'primary' }] },
          { props: 'purchaseOrderNo', label: '采购订单号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/purchase/purchaseOrder/edit', query: { id: row.purchaseOrderId } }); }, type: 'primary' }] },
          { props: 'purchaseCashUnitPrice', label: '采购现金单价', visible: true, align: 'right', width: 140 },
          { props: 'purchaseRebateUnitPrice', label: '采购返利单价', visible: true, align: 'right', width: 140 },
          { props: 'returnCashUnitPrice', label: '退货现金单价', visible: true, align: 'right', width: 140 },
          { props: 'expectedReturnCashAmount', label: '预计退货现金金额', visible: true, align: 'right', width: 160 },
          { props: 'actualReturnCashAmount', label: '实际退货现金金额', visible: true, align: 'right', width: 160 },
          { props: 'returnRebateUnitPrice', label: '退货返利单价', visible: true, align: 'right', width: 140 },
          { props: 'expectedReturnRebateAmount', label: '预计退货返利金额', visible: true, align: 'right', width: 160 },
          { props: 'actualReturnRebateAmount', label: '实际退货返利金额', visible: true, align: 'right', width: 160 },
          { props: 'detailRemark', label: '明细备注', visible: true, width: 200 }
        ],
        total: 0
      }
    };
  },
  async created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    try {
      const res = await getLoginUser();
      this.accountFlag = res.accountFlag;
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
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
    handleAdd () {
      this.$router.push({
        path: '/sparepart/return/returnOrder/edit'
      });
    },
    onSubmit () {
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      // 全部备件 tab：默认创建时间 = 最近一个月
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
      const formData = this.getFormData();
      if (formData === null) {
        this.exportLoading = false;
        return;
      }
      const reqParams = formData || {};
      let fetchPath = 'sp/web/purchase/returnOrder/page';
      let tableRef = this.$refs.tableRef;
      if (this.activeName === 'homePage') {
        tableRef = this.$refs.tableRef;
        fetchPath = 'sp/web/purchase/returnOrder/page';
      } else {
        tableRef = this.$refs.tableRefAll;
        fetchPath = 'sp/web/purchase/returnOrder/detailPage';
      }
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '备件退货单',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件退货单.xlsx');
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
          const records = res?.records || [];
          optionObj.dataList = records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('备件退货单列表加载失败:', err);
          optionObj.dataList = [];
          optionObj.total = 0;
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
      if (this.form.deliveryTime) {
        delete data.deliveryTime;
        if (this.form.deliveryTime.length > 1) {
          data.deliveryTimeStart = this.form.deliveryTime[0];
          data.deliveryTimeEnd = this.form.deliveryTime[1];
        }
      }

      // ===== 全部备件 tab 默认条件校验 =====
      // 【退货单号】【订单创建时间】【交货单号】【销售凭证】【入库单号】【采购订单号】不允许全部为空
      if (this.activeName === 'allSpareParts') {
        const hasCode = !!(data.codeList && data.codeList.length);
        const hasCreateTime = !!(data.createTimeStart && data.createTimeEnd);
        const hasDeliveryNo = !!(data.deliveryNoList && data.deliveryNoList.length);
        const hasSaleVoucher = !!(data.saleVoucherList && data.saleVoucherList.length);
        const hasInboundNo = !!(data.inboundNoList && data.inboundNoList.length);
        const hasPurchaseOrderNo = !!(data.purchaseOrderNoList && data.purchaseOrderNoList.length);
        if (!hasCode && !hasCreateTime && !hasDeliveryNo && !hasSaleVoucher && !hasInboundNo && !hasPurchaseOrderNo) {
          this.$message.warning('请至少填写【退货单号】【订单创建时间】【交货单号】【销售凭证】【入库单号】【采购订单号】中的任意一个');
          return null;
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
    // 打印退货单
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'SparePartsReturn', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}备件退货单`// 可选，打印标题
      });
    },
    // 打印退货标签
    handlePrintLabel (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'SparePartsReturnLabel', // 必选，对应 ./template/文件名.vue
        title: '备件退货标签'// 可选，打印标题
      });
    },
    // 发运
    handleShipment (val) {
      this.shipmentId = val.id;
      this.shipmentDialogVisible = true;
    },
    // 作废
    async handleVoid (val) {
      const result = await this.$prompt('请输入作废说明', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      const reviewDescription = result.value;
      if (!reviewDescription) {
        return this.$message.warning('请输入作废说明');
      }
      const params = { id: val.id, reviewDescription };
      await returnOrderCancel(params);
      this.getData();
    },
    // 驳回
    async handleReject (val) {
      const result = await this.$prompt('请输入审批意见', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      const reviewDescription = result.value;
      if (!reviewDescription) {
        return this.$message.warning('请输入审批意见');
      }
      const params = { id: val.id, reviewDescription };
      await returnOrderReject(params);
      this.getData();
    },
  }
};
</script>

<style lang="scss" scoped>
.m-return-order-list {
}
</style>
