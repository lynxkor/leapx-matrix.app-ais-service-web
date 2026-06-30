<template>
  <div class="page-common m-flow-report-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="备件">
        <fetch-select
            :remote-method="getSparePart"
            remote
            v-model="form.sparePartIdList"
            placeholder="请输入编码或名称"
            labelKey="partCode"
            valueKey="id"
            subLabelKey="partName"
            clearable
            multiple
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
      <el-form-item label="出入库时间" v-show="this.visibleCount === 3 || show">
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
        <el-form-item label="操作类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="InventoryOperateTypeEnum"
            v-model="form.operateTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="业务类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="InventoryBusinessTypeEnum"
            v-model="form.businessTypeList"
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
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
import { flowReport } from '@/api/sparepart/warehouse/inventory/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, listDealerPartWithOem, getDesensitize } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  partCode: '',
  partName: '',
  dealerCode: '',
  dealerName: '',
  warehouseName: '',
  locationName: '',
  purchasePrice: '',
  salePrice: '',
  availableQty: '',
  totalQty: '',
  operateType: '',
  businessType: '',
  code: '',
  qty: '',
  costUnitPrice: '',
  costAmount: '',
  transactionUnitPrice: '',
  transactionAmount: '',
  operator: '',
  businessNo: '',
  createTime: '',
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
    Upload
  },
  data () {
    return {
      pageTitle: '门店备件库存流水',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-flowReport',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      pickerOptions: {},
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      optionObj: {
        id: 'flowReportTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'partCode',
            label: '备件编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/edit',
                  query: {
                    id: row.sparePartId,
                    isEditing: false
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'partName', label: '备件名称', visible: true, width: 200 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '仓库名称', visible: true, width: 200 },
          { props: 'locationName', label: '库位', visible: true, width: 160 },
          { props: 'purchasePrice', label: '最新采购价格', visible: true, width: 140, align: 'right' },
          { props: 'salePrice', label: '最新销售价格', visible: true, width: 140, align: 'right' },
          { props: 'availableQty', label: '最新可用数量', visible: true, width: 140, align: 'right' },
          { props: 'totalQty', label: '最新库存总数', visible: true, width: 140, align: 'right' },
          { props: 'operateTypeLabel', label: '操作类型', visible: true, width: 100 },
          { props: 'businessTypeLabel', label: '业务类型', visible: true, width: 120 },
          { props: 'businessNo', label: '流水业务单号', visible: true, width: 200 },
          { props: 'qty', label: '数量', visible: true, width: 100, align: 'right' },
          { props: 'beforeTotalQty', label: '操作前总库存', visible: true, width: 140, align: 'right' },
          { props: 'afterTotalQty', label: '操作后总库存', visible: true, width: 140, align: 'right' },
          { props: 'costUnitPrice', label: '成本单价', visible: true, width: 140, align: 'right' },
          { props: 'costAmount', label: '成本金额', visible: true, width: 140, align: 'right' },
          { props: 'transactionUnitPrice', label: '交易单价', visible: true, width: 140, align: 'right' },
          { props: 'transactionAmount', label: '交易金额', visible: true, width: 140, align: 'right' },
          { props: 'operator', label: '操作人', visible: true, width: 140 },
          { props: 'createTime', label: '出入库时间', visible: true, width: 200 },
          { props: 'realBusinessNo', label: '实际业务单号', visible: true, width: 200 },
          { props: 'isCreateStatementInfo', label: '是否已生成结算单', visible: true, width: 150 },
          { props: 'createStatementInfoDate', label: '生成结算单时间', visible: true, width: 200 },
          { props: 'statementType', label: '结算类型', visible: true, width: 120 },
          { props: 'statementRemark', label: '备注', visible: true, width: 200 },
          {
            props: 'carPlate',
            label: '车牌',
            visible: true,
            width: 160,
            mask: true,
            getValue: (row) => getDesensitize(row.extraInfo, 'inventoryReport', 'carPlate')
          },
          {
            props: 'vehProfileVin',
            label: 'VIN',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDesensitize(row.extraInfo, 'inventoryReport', 'vehProfileVin')
          },
          {
            props: 'customerName',
            label: '车主名称',
            visible: true,
            width: 160,
            mask: true,
            getValue: (row) => getDesensitize(row.extraInfo, 'inventoryReport', 'customerName')
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
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const format = (d, t) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${t}`;
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    this.form.createTime = [format(oneMonthAgo, '00:00:00'), format(now, '23:59:59')];
    this.getData();
  },
  methods: {
    async getSparePart (query) {
      try {
        const res = await listDealerPartWithOem({ partCodeLikeOrList: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
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
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/warehouse/flowReport/edit'
      });
    },
    onSubmit () {
      const hasPart = this.form.sparePartIdList && this.form.sparePartIdList.length > 0;
      const hasDealer = this.form.dealerCodeList && this.form.dealerCodeList.length > 0;
      const hasTime = this.form.createTime && this.form.createTime.length > 0;
      if (!hasPart && !hasDealer && !hasTime) {
        this.$message({ type: 'warning', message: '请至少填写备件、门店或出入库时间中的一个查询条件' });
        return;
      }
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.pickerMinDate = null;
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const format = (d, t) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${t}`;
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      this.form.createTime = [format(oneMonthAgo, '00:00:00'), format(now, '23:59:59')];
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
        businessType: '门店备件库存流水',
        dataFetchPath: 'sp/web/warehouse/inventory/flowReport',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '门店备件库存流水.xlsx');
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

      flowReport({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
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
  }
};
</script>

<style lang="scss" scoped>
.m-flow-report-list {
}
</style>
