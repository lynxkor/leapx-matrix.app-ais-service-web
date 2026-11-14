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
        <el-form-item label="接车施工单编号">
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
        <el-form-item label="订单创建时间">
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
          <el-form-item label="VIN">
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
          <el-form-item label="入库状态">
            <fetch-select
              :request="fetchOptions"
              enumCode="MaintenanceReturnMaterialStatusEnum"
              v-model="form.returnMaterialStatusList"
              placeholder="请选择"
              clearable
              multiple
              filterable
            />
          </el-form-item>
          <el-form-item label="客户经理" v-show="this.visibleCount === 3 || show">
            <fetch-select
              :remote-method="getUser"
              remote
              v-model="form.serviceProxyCreatorList"
              placeholder="请输入名称"
              labelKey="username"
              valueKey="userId"
              clearable
              collapseTags
              multiple
              filterable
            />
          </el-form-item>
          <el-form-item label="订单修改时间">
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
          <el-form-item label="库位" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
            <el-input placeholder="请输入" v-model="form.locationNameLike" clearable />
          </el-form-item>
          <el-form-item label="退料申请时间" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
            <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              v-model="form.returnApplicationTime"
              type="daterange"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="是否已入库" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
            <fetch-select
              :request="fetchOptions"
              enumCode="BooleanEnum"
              v-model="form.inboundIsList"
              placeholder="请选择"
              clearable
              multiple
              filterable
            />
          </el-form-item>
          <el-form-item label="退料入库时间" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
            <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              v-model="form.returnWarehousingTime"
              type="daterange"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="退料申请人" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
            <fetch-select
              :remote-method="getUser"
              remote
              v-model="form.returnApplicantList"
              placeholder="请输入名称"
              labelKey="username"
              valueKey="userId"
              clearable
              collapseTags
              multiple
              filterable
            />
          </el-form-item>
          <el-form-item label="退料入库人" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
            <fetch-select
              :remote-method="getUser"
              remote
              v-model="form.returnWarehousingOperatorList"
              placeholder="请输入名称"
              labelKey="username"
              valueKey="userId"
              clearable
              collapseTags
              multiple
              filterable
            />
          </el-form-item>
        </template>
        <page-search-action
          v-if="canList"
          v-model="show"
          is-expandable
        :view-scope="activeName"
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
        />
      </el-form>
      <div class="ais-actions">
        <!--  TIPS:根据产品增删功能按钮  -->
        <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handlePringConfig"><i class="iconfont icon-lxppc-plus"></i>打印设置</el-button> -->
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
      <warehousingDialog
        ref="warehousingDialogRef"
        :id="maintenanceId"
        :visible="warehousingDialogVisible"
        @close="handleWarehousingDialogClose"
        @success="handleWarehousingDialogSuccess"
      />
    </div>
  </template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, detailPage, deleteItem, enableItem } from '@/api/sparepart/inbound/maintenanceReturnInbound/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, listWarehouse, getDesensitize, getUserByNameOrNo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import warehousingDialog from './warehousingDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  codeList: [],
  dealerCodeList: [],
  dealerName: '',
  warehouseId: '',
  warehouseIdList: null,
  serviceProxyIdList: [],
  // 注意：被 <tag-input> 绑定的字段必须用 [] 而非 null，否则 reset 时
  // TagInput 内部 tagList = null 会导致 slice()/length 抛错，UI 无法清空。
  serviceProxyCodeList: [],
  vehProfileVin: '',
  vehProfileVinLike: '',
  carPlate: '',
  carPlateLike: '',
  returnMaterialStatusList: [],
  serviceProxyCreatorList: [],
  createTime: '',
  updateTime: '',
  // ===== 全部备件 tab 专用（仅 allSpareParts 用） =====
  sparePartCodeList: [],
  sparePartName: '',
  locationNameLike: '',
  returnApplicationTime: null,
  inboundIsList: null,
  returnWarehousingTime: null,
  returnApplicantList: null,
  returnWarehousingOperatorList: null,
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
    warehousingDialog
  },
  data () {
    return {
      pageTitle: '维修退料入库',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-maintenanceReturnInbound',
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
      warehousingDialogVisible: false, // 维修退料入库弹窗
      maintenanceId: '', // 维修退料入库id
      clickItemId: '',
      activeName: 'homePage',
      optionObj: {
        id: 'maintenanceReturnInbound',
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
                  path: '/sparepart/inbound/maintenanceReturnInbound/edit',
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
                window.open(`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
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
          { props: 'returnMaterialStatusLabel', label: '入库状态', visible: true, width: 120 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          { props: 'serviceProxyCreatorName', label: '客户经理', visible: true, width: 120 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '入库',
              show: (row) => {
                return row.returnMaterialStatus !== '1' && this.permissions.has('AISPART-maintenanceReturnInbound-inbound');
              },
              click: (rowIndex, row) => {
                this.repairPopup(row);
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      optionObjAll: {
        id: 'maintenanceReturnInboundAll',
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
                  path: '/sparepart/inbound/maintenanceReturnInbound/edit',
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
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: { id: row.serviceProxyId }
                });
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
          { props: 'returnMaterialStatusLabel', label: '入库状态', visible: true, width: 120 },
          { props: 'remark', label: '订单备注', visible: true, width: 200 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },
          { props: 'serviceProxyCreatorName', label: '客户经理', visible: true, width: 120 },

          /* ========== 退料明细维度 ========== */
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
          { props: 'returnApplicationQty', label: '退料申请数量', visible: true, align: 'right', width: 140 },
          { props: 'returnApplicationReason', label: '退料申请原因', visible: true, width: 200 },
          { props: 'returnApplicantName', label: '退料申请人', visible: true, width: 120 },
          { props: 'returnApplicationTime', label: '退料申请时间', visible: true, width: 200 },
          { props: 'inboundIsLabel', label: '是否已入库', visible: true, width: 120 },
          { props: 'returnWarehousingOperatorName', label: '退料入库人', visible: true, width: 120 },
          { props: 'returnWarehousingTime', label: '退料入库时间', visible: true, width: 200 },
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
      this.debouncedGetData();
    },
    onReset () {
      // 全部备件 tab：默认创建时间 = 最近一个月
      const extraDefaults = this.activeName === 'allSpareParts'
        ? { createTime: this.getLastMonthRange() }
        : {};
      // 注意：不要整体替换 this.form —— 会丢失 Vue 2 响应性，导致子组件 watch 失效。
      // 必须用 Object.assign 原地写入响应式对象，触发 setter 让 watcher 重新执行。
      Object.assign(this.form, defaultForm, extraDefaults);
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      optionObj.form.size = pageSize;
      this.debouncedGetData();
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
      let fetchPath = 'sp/web/maintenance/maintenanceReturnInbound/page';
      let tableRef = this.$refs.tableRef;
      if (this.activeName === 'homePage') {
        tableRef = this.$refs.tableRef;
        fetchPath = 'sp/web/maintenance/maintenanceReturnInbound/page';
      } else {
        tableRef = this.$refs.tableRefAll;
        fetchPath = 'sp/web/maintenance/maintenanceOutboundReturnDetail/detailPage';
      }
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '维修退料入库',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '维修退料入库.xlsx');
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
          console.error('维修退料入库列表加载失败:', err);
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
      if (this.form.returnApplicationTime) {
        delete data.returnApplicationTime;
        if (this.form.returnApplicationTime.length > 1) {
          data.returnApplicationTimeStart = this.form.returnApplicationTime[0];
          data.returnApplicationTimeEnd = this.form.returnApplicationTime[1];
        }
      }
      if (this.form.returnWarehousingTime) {
        delete data.returnWarehousingTime;
        if (this.form.returnWarehousingTime.length > 1) {
          data.returnWarehousingTimeStart = this.form.returnWarehousingTime[0];
          data.returnWarehousingTimeEnd = this.form.returnWarehousingTime[1];
        }
      }

      // ===== 全部备件 tab 默认条件校验 =====
      // 出库单号（codeList）+ 接车施工单（serviceProxyCodeList）+ 订单创建时间 + VIN + 车牌号 不允许同时为空
      if (this.activeName === 'allSpareParts') {
        const hasCode = !!(data.codeList && data.codeList.length);
        const hasProxy = !!(data.serviceProxyCodeList && data.serviceProxyCodeList.length);
        const hasCreateTime = !!(data.createTimeStart && data.createTimeEnd);
        const hasVin = !!data.vehProfileVinLike;
        const hasPlate = !!data.carPlateLike;
        if (!hasCode && !hasProxy && !hasCreateTime && !hasVin && !hasPlate) {
          this.$message.warning('请至少填写【出库单号】【接车施工单】【订单创建时间】【VIN】【车牌号】中的任意一个');
          return null;
        }
        // ===== 全部备件 tab：订单创建时间跨度校验（不超过半年） =====
        if (data.createTimeStart && data.createTimeEnd) {
          const start = new Date(data.createTimeStart);
          const end = new Date(data.createTimeEnd);
          const sixMonthsLater = new Date(start);
          sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
          if (end > sixMonthsLater) {
            this.$message.warning('【订单创建时间】跨度不能超过半年');
            return null;
          }
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
      this.warehousingDialogVisible = true;
    },
    // 关闭弹窗
    handleWarehousingDialogClose () {
      this.warehousingDialogVisible = false;
    },
    handleWarehousingDialogSuccess () {
      this.warehousingDialogVisible = false;
      this.getData();
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
