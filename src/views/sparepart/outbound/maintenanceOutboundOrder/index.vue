<template>
  <div class="page-common m-maintenance-outbound-order-list">
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
      <el-form-item label="接车施工单号">
        <tag-input v-model="form.serviceProxyCodeList" placeholder="请输入" />
        </el-form-item>
      <el-form-item label="门店名称" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.dealerCodeList"
          placeholder="请输入"
          labelKey="orgName"
          valueKey="orgCode"
          subLabelKey="orgCode"
          clearable
          multiple
          collapseTags
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="备件仓库">
          <fetch-select
            :remote-method="getWarehouse"
            remote
            v-model="form.warehouseId"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            subLabelKey="code"
            clearable
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="vin码">
          <el-input
            placeholder="请输入"
            v-model="form.vehProfileVinLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input
            placeholder="请输入"
            v-model="form.carPlateLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="出库状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="MaintenanceOutboundStatusEnum"
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
        <!-- ===== 全部备件 tab 专用查询 ===== -->
        <el-form-item label="客户经理" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input
            placeholder="请输入"
            v-model="form.customerManager"
            clearable
          />
        </el-form-item>
        <el-form-item label="备件编码" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.sparePartCodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备件名称" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input placeholder="请输入" v-model="form.sparePartName" clearable />
        </el-form-item>
        <el-form-item label="库位" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input placeholder="请输入" v-model="form.locationNameLike" clearable />
        </el-form-item>
        <el-form-item label="是否出库" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.outboundIsList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="领料人" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <fetch-select
            :remote-method="getUser"
            remote
            v-model="form.pickerList"
            placeholder="请输入名称"
            labelKey="username"
            valueKey="userId"
            clearable
            collapseTags
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="领料时间" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-date-picker
            :default-time="['00:00:00', '23:59:59']"
            v-model="form.pickTime"
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
      <el-button size="small" type="primary" @click="handlePringConfig" v-permission="'AISPART-maintenanceOutboundOrder-printSetting'"><i class="iconfont icon-lxppc-plus"></i>打印设置</el-button>
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
    <RepairDialog
      ref="repairDialogRef"
      :id="maintenanceId"
      :visible.sync="repairDialogVisible"
      @update:visible="val => repairDialogVisible = val"
      @success="getData"
    />
    <PrintSettings
      ref="printSettingsRef"
      :visible="printSettingsVisible"
      @close="handlePrintSettingsClose"
      @success="handlePrintSettingsSuccess"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, detailPage, deleteItem, enableItem } from '@/api/sparepart/outbound/maintenanceOutboundOrder/index';
import {
  getTableConfig, tableAddOrUpdate, exportTable, getEnum, getUserByNameOrNo, getDesensitize,
  listOrgStoreInfoByParam, listWarehouse
} from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import RepairDialog from './RepairDialog.vue';
import PrintSettings from './PrintSettings.vue';
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  codeList: [],
  dealerCodeList: [],
  dealerName: '',
  warehouseId: '',
  warehouseIdList: null,
  serviceProxyIdList: [],
  serviceProxyCodeList: null,
  vehProfileVin: '',
  vehProfileVinLike: '',
  carPlate: '',
  carPlateLike: '',
  outboundStatus: '',
  outboundStatusList: null,
  customerManager: '',
  customerManagerList: null,
  createTime: '',
  updateTime: '',
  // ===== 全部备件 tab 专用（仅 allSpareParts 用） =====
  sparePartCodeList: null,
  sparePartName: '',
  locationNameLike: '',
  outboundIs: '',
  outboundIsList: null,
  picker: '',
  pickerList: null,
  pickTime: null,
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
    RepairDialog,
    PrintSettings
  },
  data () {
    return {
      pageTitle: '维修出库',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-maintenanceOutboundOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      repairDialogVisible: false, // 维修出库弹窗
      maintenanceId: '', // 维修出库id
      printSettingsVisible: false, // 打印设置弹窗
      clickItemId: '',
      activeName: 'homePage',
      optionObj: {
        id: 'maintenanceOutboundOrderTable',
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
                  path: '/sparepart/outbound/maintenanceOutboundOrder/edit',
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
          {
            props: 'serviceProxyCode',
            label: '接车施工单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/maintain/sp/serviceProxy/edit?id=${row.serviceProxyId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'vehProfileVin',
            label: 'vin',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDesensitize(row.id, 'maintenanceOutboundOrder', 'vehProfileVin')
          },
          {
            props: 'carPlate',
            label: '车牌号',
            visible: true,
            width: 140,
            mask: true,
            getValue: (row) => getDesensitize(row.id, 'maintenanceOutboundOrder', 'carPlate')
          },
          { props: 'outboundStatusLabel', label: '出库状态', visible: true, width: 120 },
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
              name: '出库',
              show: (row) => {
                return row.outboundStatus !== '1' && row.outboundStatus !== '2' && this.permissions.has('AISPART-maintenanceOutboundOrder-outbound');
              },
              click: (rowIndex, row) => {
                this.repairPopup(row);
              },
              type: 'info'
            }, {
              name: '打印',
              show: (row) => {
                return this.permissions.has('AISPART-maintenanceOutboundOrder-print');
              },
              click: (rowIndex, row) => {
                this.handlePrint(row);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      optionObjAll: {
        id: 'maintenanceOutboundOrderTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          /* ========== 订单维度 ========== */
          {
            props: 'code',
            label: '出库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/outbound/maintenanceOutboundOrder/edit',
                  query: { id: row.maintenanceOutboundOrderId || row.id }
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
          {
            props: 'serviceProxyCode',
            label: '接车施工单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/maintain/sp/serviceProxy/edit?id=${row.serviceProxyId}`, '_blank');
              },
              type: 'primary'
            }]
          },
          {
            props: 'vehProfileVin',
            label: 'VIN',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDesensitize(row.maintenanceOutboundOrderId, 'maintenanceOutboundOrder', 'vehProfileVin')
          },
          {
            props: 'carPlate',
            label: '车牌号',
            visible: true,
            width: 140,
            mask: true,
            getValue: (row) => getDesensitize(row.maintenanceOutboundOrderId, 'maintenanceOutboundOrder', 'carPlate')
          },
          { props: 'outboundStatusLabel', label: '出库状态', visible: true, width: 120 },
          { props: 'remark', label: '订单备注', visible: true, width: 200 },
          { props: 'serviceAdvisorName', label: '客户经理', visible: true, width: 120 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },

          /* ========== 领料明细维度 ========== */
          {
            props: 'sparePartCode',
            label: '备件编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/detail',
                  query: { id: row.sparePartId }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'locationName', label: '库位', visible: true, width: 120 },
          { props: 'availableQty', label: '可用库存', visible: true, align: 'right', width: 120 },
          { props: 'outboundQty', label: '出库数量', visible: true, align: 'right', width: 120 },
          { props: 'price', label: '单价', visible: true, align: 'right', width: 120 },
          { props: 'discountAmount', label: '优惠金额', visible: true, align: 'right', width: 120 },
          { props: 'partsAmount', label: '应付金额', visible: true, align: 'right', width: 120 },
          { props: 'costUnitPrice', label: '成本价格', visible: true, align: 'right', width: 120 },
          { props: 'outboundIsLabel', label: '是否出库', visible: true, width: 120 },
          { props: 'pickerName', label: '领料人', visible: true, width: 120 },
          { props: 'pickTime', label: '领料日期', visible: true, width: 200 },
          { props: 'detailRemark', label: '明细备注', visible: true, width: 200 }
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
      // 跨 tab 切换时，把所有 tab 的分页状态都重置为 page 1 + 默认 size，
      // 避免「在 tab2 翻到 page 3 → 切 tab1 → 切回 tab2 还是 page 3」的脏状态
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
        path: '/sparepart/outbound/maintenanceOutboundOrder/edit'
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
    // 全部备件 tab：默认「最近一个月」的时间区间
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
      let fetchPath = 'sp/web/maintenance/maintenanceOutboundOrder/page';
      let tableRef = this.$refs.tableRef;
      if (this.activeName === 'homePage') {
        tableRef = this.$refs.tableRef;
        fetchPath = 'sp/web/maintenance/maintenanceOutboundOrder/page';
      } else {
        tableRef = this.$refs.tableRefAll;
        fetchPath = 'sp/web/maintenance/maintenanceOutboundOrder/detailPage';
      }
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '维修出库',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '维修出库.xlsx');
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
          console.error('维修出库列表加载失败:', err);
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
      if (this.form.pickTime) {
        delete data.pickTime;
        if (this.form.pickTime.length > 1) {
          data.pickTimeStart = this.form.pickTime[0];
          data.pickTimeEnd = this.form.pickTime[1];
        }
      }

      if (Array.isArray(this.form.codeList) && this.form.codeList.length <= 1) {
        delete data.codeList;
        data.code = this.form.codeList[0] || '';
      }
      if (Array.isArray(this.form.serviceProxyIdList) && this.form.serviceProxyIdList.length <= 1) {
        delete data.serviceProxyIdList;
        data.serviceProxyId = this.form.serviceProxyIdList[0] || '';
      }

      // ===== 全部备件 tab 默认条件校验 =====
      // 【出库单号】【接车施工单】【VIN】【车牌号】不允许全部为空
      if (this.activeName === 'allSpareParts') {
        const hasCode = !!(data.codeList && data.codeList.length);
        const hasProxy = !!(data.serviceProxyCodeList && data.serviceProxyCodeList.length);
        const hasVin = !!data.vehProfileVinLike;
        const hasCreateTime = !!(data.createTimeStart && data.createTimeEnd);
        const hasPlate = !!data.carPlateLike;
        if (!hasCode && !hasProxy && !hasVin && !hasPlate && !hasCreateTime) {
          this.$message.warning('请至少填写【出库单号】【接车施工单】【VIN】【车牌号】【创建时间】中的任意一个');
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
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 维修出库弹窗
    repairPopup (val) {
      this.maintenanceId = val.id;
      this.repairDialogVisible = true;
    },
    // 打印设置弹窗
    handlePringConfig () {
      this.printSettingsVisible = true;
    },
    // 关闭打印设置弹窗
    handlePrintSettingsClose () {
      this.printSettingsVisible = false;
    },
    handlePrintSettingsSuccess () {
      this.printSettingsVisible = false;
      this.getData();
    },
    // 维修出库单打印
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'MaintenanceOutbound', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}维修出库单`// 可选，打印标题
      });
    },
    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
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
        console.error('Error fetching user list:', error);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.m-maintenance-outbound-order-list {
}
</style>
